<?php

namespace Modules\Archive\Actions;

use Illuminate\Support\Facades\Auth;
use Modules\Item\Data\ItemContentsResourceData;
use Modules\Item\Models\Item;
use Modules\Folder\Models\Folder;
use Modules\User\Models\User;
use Spatie\LaravelData\DataCollection;
use Modules\Archive\Data\ArchiveAncestorsResourceData;

class GetArchiveDataAction
{
    /**
     * Execute the action to retrieve archived items.
     *
     * @param Folder|null $folder
     * @return array
     */
    public function execute(?Folder $folder = null): array
    {
        if ($folder) {
            // Retrieve archived items within the specified folder
            $archivedItems = $folder->item->children()
                ->whereNotNull('archived_at')
                ->with(['folder', 'document'])
                ->get();
        } else {
            // Retrieve all archived items
            $archivedItems = Item::with(['folder', 'document'])
                ->whereNotNull('archived_at')
                ->get();
        }

        // Filter out items that have an archived parent and reindex the collection
        $filteredItems = $archivedItems->filter(function ($item) use ($archivedItems) {
            return !$archivedItems->contains('id', $item->parent_id);
        })->values(); // Reset the keys to be consecutive integers

        // Retrieve all ancestors including self
        $allAncestors = $folder ? $folder->item->ancestorsWithSelf()->get() : collect();

        // Filter ancestors to include only those of type 'archive'
        $archiveAncestors = $allAncestors->filter(function ($ancestor) {
            return $this->getType($ancestor) === 'archive';
        });

        // Prepend the 'Archive' root ancestor
        $archiveRoot = new ArchiveAncestorsResourceData(
            id: 'archive-root',
            depth: 0,
            name: 'Archive',
            url: '/archive'
        );
        $archiveAncestors = $archiveAncestors->prepend($archiveRoot);

        // Prepare the data for the frontend
        return [
            'itemParent' => $folder ? \Modules\Item\Data\ItemParentResourceData::fromModel($folder->item) : null,
            'itemAncestors' => $folder ? \Modules\Archive\Data\ArchiveAncestorsResourceData::collect($archiveAncestors, DataCollection::class) : [],
            'itemContents' => ItemContentsResourceData::collect($filteredItems, DataCollection::class),
            'folderUserRole' => $folder ? $this->determineUserRole($folder) : null,
        ];
    }

    /**
     * Determine the user's role for the folder.
     *
     * @param Folder $folder
     * @return string|null
     */
    protected function determineUserRole(Folder $folder): ?string
    {
        $user = Auth::user();
        $user = User::find($user->id);
        if (!$user) {
            return null;
        }

        $userAccess = $folder->userAccess()->where('user_id', $user->id)->first();
        if ($userAccess) {
            return $userAccess->pivot->role; // e.g., 'editor' or 'viewer'
        }

        // Fallback to system-level permissions
        if ($user->hasRole('admin')) {
            return 'admin';
        } elseif ($user->hasRole('viewer')) {
            return 'viewer';
        }

        return null;
    }

    /**
     * Determine the type of the item.
     *
     * @param Item $item
     * @return string
     */
    private function getType(Item $item): string
    {
        if ($item->archived_at) {
            return 'archive';
        } elseif ($item->workspace) {
            return 'workspace';
        } elseif ($item->folder) {
            return 'folder';
        } elseif ($item->document) {
            return 'document';
        }

        return 'unknown';
    }
}
