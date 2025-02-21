<?php

namespace Modules\Folder\Controllers;

use App\Modules\Metadata\Data\MetadataResourceData;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Modules\Common\Controllers\Controller;
use Modules\Folder\Models\Folder;
use Modules\Folder\Data\CreateFolderData;
use Modules\Folder\Data\UpdateFolderData;
use Modules\Folder\Actions\CreateFolderAction;
use Modules\Folder\Actions\DeleteFolderAction;
use Modules\Folder\Actions\SelectMetadataColumnAction;
use Modules\Folder\Actions\UpdateFolderAction;
use Modules\Folder\Data\FolderResourceData;
use Modules\Folder\Data\ShareFolderData;
use Modules\Folder\Data\RemoveShareFolderData;
use Modules\Folder\Authorization\FolderAuthorization;
use Modules\Item\Data\ItemAncestorsResourceData;
use Modules\Item\Data\ItemContentsResourceData;
use Modules\Item\Models\Item;
use Modules\User\Models\User;
use Modules\Item\Actions\GetItemDataAction;
use Modules\Folder\Actions\UpdateFolderMetadataAction;
use Modules\Folder\Data\UpdateFolderMetadataData;
use Modules\Folder\Data\FolderRequiredMetadataResource;
use Modules\Folder\Data\SelectMetadataColumnData;
use Modules\Item\Actions\ShowMoveItemsAction;
use Modules\Metadata\Models\Metadata;
use Modules\Folder\Actions\DeleteRequiredMetadataAction;
use Illuminate\Http\Request;

class FolderController extends Controller
{
    public function __construct(
        private CreateFolderAction $createFolderAction,
        private UpdateFolderAction $updateFolderAction,
        private DeleteFolderAction $deleteFolderAction,
        private FolderAuthorization $folderAuthorization,
        private GetItemDataAction $getItemDataAction,
        private UpdateFolderMetadataAction $updateFolderMetadataAction,
        private SelectMetadataColumnAction $selectMetadataColumnAction,
        protected DeleteRequiredMetadataAction $deleteRequiredMetadataAction
    ) {}

    public function show(Folder $folder)
    {
        // Authorize the user can view the folder
        $this->folderAuthorization->canView(Auth::user(), $folder);

        $user = Auth::user();

        $user = User::find($user->id);

        // Check for specific folder permissions
        $userAccess = $folder->userAccess()->where('user_id', $user->id)->first();

        if ($userAccess) {
            // User has specific permissions for this folder
            $role = $userAccess->pivot->role; // e.g., 'editor' or 'viewer'
        } else {
            // Fallback to system-level permissions
            if ($user->hasRole('admin')) {
                $role = 'admin';
            } elseif ($user->hasRole('viewer')) {
                $role = 'viewer';
            } else {
                // If user has no relevant roles, deny access
                abort(403, 'Unauthorized.');
            }
        }

        // Retrieve the associated item
        $item = Item::find($folder->item->id);

        // Execute action to get item data
        $data = $this->getItemDataAction->execute($item);

        // Render the Inertia view with the relevant data and user role
        return Inertia::render('Item', array_merge($data, [
            'folderUserRole' => $role,
        ]));
    }

    public function store(CreateFolderData $data): RedirectResponse
    {
        $this->createFolderAction->execute($data);

        return redirect()->back();
    }

    public function edit(Folder $folder): Response
    {
        $this->folderAuthorization->canView(Auth::user(), $folder);

        $item = Item::find($folder->item_id);

        $data = $this->getItemDataAction->execute($item);

        return Inertia::render('FolderProperties', array_merge($data, [
            'folder' => FolderResourceData::from($folder),
        ]));
    }

    public function update(Folder $folder, UpdateFolderData $data): RedirectResponse
    {
        $this->folderAuthorization->canEdit(Auth::user(), $folder);

        $this->updateFolderAction->execute($folder, $data);

        return redirect()->back();
    }

    public function destroy(Folder $folder): JsonResponse
    {
        $this->folderAuthorization->canEdit(Auth::user(), $folder);

        $this->deleteFolderAction->execute($folder);

        return response()->json(['message' => 'Folder deleted successfully']);
    }

    /**
     * Share a folder with specified users and recursively share its contents.
     *
     * @param ShareFolderData $data
     * @param Folder $folder
     * @return RedirectResponse
     */
    public function share(ShareFolderData $data, Folder $folder): RedirectResponse
    {
        // Authorize the user can share the folder
        $this->folderAuthorization->canShare(Auth::user(), $folder);

        // Detach all existing users from the folder
        $folder->userAccess()->detach();

        // Prepare an array to hold user IDs and their roles
        $userAttachments = [];
        foreach ($data->users as $userData) {
            $user = User::where('email', $userData->email)->firstOrFail();
            $userAttachments[$user->id] = ['role' => $userData->role];
        }

        // Attach new users with roles to the folder
        $folder->userAccess()->sync($userAttachments);

        // Recursively share all subfolders and documents using the children relationship
        $this->shareContentsRecursively($folder->item, $userAttachments);

        return redirect()->back()->with('success', 'Folder and its contents shared successfully.');
    }

    /**
     * Recursively share subfolders and documents with specified users using the children relationship.
     *
     * @param Item $item
     * @param array $userAttachments
     * @return void
     */
    protected function shareContentsRecursively(Item $item, array $userAttachments): void
    {
        foreach ($item->getChildren() as $child) {
            if ($child->folder) {
                // If the child is a folder
                $child->folder->userAccess()->sync($userAttachments);

                // Recursively share its children
                $this->shareContentsRecursively($child, $userAttachments);
            } elseif ($child->document) {
                // If the child is a document
                $child->document->userAccess()->sync($userAttachments);
            }
        }
    }

    public function fetchUserShareFolder(Folder $folder): JsonResponse
    {
        // Assuming the relationship is defined as userAccess()
        $sharedUsers = $folder->userAccess()->select('users.id', 'users.name', 'users.email', 'role')->get();

        return response()->json($sharedUsers);
    }

    /**
     * Remove a user's share from a folder and its contents.
     *
     * @param RemoveShareFolderData $data
     * @param Folder $folder
     * @return JsonResponse
     */
    public function removeShare(RemoveShareFolderData $data, Folder $folder): JsonResponse
    {
        $this->folderAuthorization->canShare(Auth::user(), $folder);

        $user = User::where('email', $data->email)->firstOrFail();

        // Detach the user from the folder
        $folder->userAccess()->detach($user->id);

        // Recursively remove the user's access from all subfolders and documents
        $this->unshareContentsRecursively($folder->item, $user->id);

        return response()->json(['message' => 'Folder and its contents unshared successfully.'], 200);
    }

    /**
     * Recursively remove a user's access from subfolders and documents.
     *
     * @param Item $item
     * @param int $userId
     * @return void
     */
    protected function unshareContentsRecursively(Item $item, int $userId): void
    {
        foreach ($item->children as $child) {
            if ($child->folder) {
                // If the child is a folder
                $child->folder->userAccess()->detach($userId);

                // Recursively remove access from its children
                $this->unshareContentsRecursively($child, $userId);
            } elseif ($child->document) {
                // If the child is a document
                $child->document->userAccess()->detach($userId);
            }
        }
    }

    /**
     * Add required metadata to a folder.
     */
    public function updateFolderRequiredMetadata(Folder $folder, UpdateFolderMetadataData $data)
    {
        $this->updateFolderMetadataAction->execute($folder, $data);
        return redirect()->back();
    }

    /**
     * Show required metadata of a folder.
     */
    public function showFolderRequiredMetadata(Folder $folder)
    {
        $requiredMetadata = $folder->requiredMetadata()->get();

        // return response()->json($requiredMetadata);

        return Inertia::render('FolderMetadata', [
            'requiredMetadata' => FolderRequiredMetadataResource::collect($requiredMetadata),
            'folder' => FolderResourceData::from($folder),
        ]);
    }

    public function getExistingMetadataColumns(Folder $folder)
    {
        $metadataColumns = $folder->metadataColumns()->get();

        return response()->json([
            'metadata_columns' => MetadataResourceData::collect($metadataColumns),
        ], 200);
    }

    public function selectMetadataColumn(Folder $folder, SelectMetadataColumnData $data): RedirectResponse
    {
        $this->selectMetadataColumnAction->execute($folder, $data);
        return redirect()->back();
    }

    /**
     * Remove the specified required metadata from the folder.
     */
    public function deleteRequiredMetadata(Folder $folder, Metadata $metadata): RedirectResponse
    {
        $this->deleteRequiredMetadataAction->execute($folder, $metadata);

        return redirect()->back();
    }
}
