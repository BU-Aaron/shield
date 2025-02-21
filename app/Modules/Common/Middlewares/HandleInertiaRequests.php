<?php

namespace Modules\Common\Middlewares;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Middleware;
use Modules\Folder\Data\FolderLinksData;
use Modules\Folder\Models\Folder;
use Modules\Item\Models\Item;
use Modules\Notification\Actions\RetrieveNotificationAction;
use Spatie\LaravelData\DataCollection;

class HandleInertiaRequests extends Middleware
{
    public function __construct(private RetrieveNotificationAction $retrieveNotificationAction) {}
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): string|null
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();

        if ($user && ($user->hasRole('admin') || $user->hasRole('viewer'))) {
            // If the user is an admin or viewer, retrieve all root items with their folders
            $workspaces = Item::whereNull('parent_id')
                ->whereNull('archived_at')
                ->with('folder')
                ->get();
        } elseif ($user) {
            // If the user is authenticated but not an admin/viewer, retrieve only root items where the folder is shared with the user
            $workspaces = Item::whereNull('parent_id')
                ->whereNull('archived_at')
                ->whereHas('folder.userAccess', function ($query) use ($user) {
                    $query->where('user_id', $user->id);
                })
                ->with('folder')
                ->get();
        } else {
            // If the user is not authenticated, set workspaces to an empty collection
            $workspaces = collect(); // Empty collection or define as needed
        }

        $currentPath = $request->path();
        $pathSegments = explode('/', $currentPath);

        // Initialize currentWorkspace as null
        $currentWorkspace = null;

        if (
            isset($pathSegments[0]) &&
            ($pathSegments[0] === 'dashboard' || $pathSegments[0] === 'trash' ||
                ($pathSegments[0] === 'item' && isset($pathSegments[1]) && $pathSegments[1] === 'shared-with-me'))
        ) {
            $currentWorkspace = '/' . $pathSegments[0];
        } elseif (isset($pathSegments[1])) {
            $currentFolderId = $pathSegments[1];
            $currentFolder = Item::find($currentFolderId);

            if ($currentFolder) {
                if ($currentFolder->ancestors()->get()->isEmpty()) {
                    $currentWorkspace = '/folder/' . $currentFolder->id;
                } else {
                    $parentAncestor = $currentFolder->ancestors()->whereNull('parent_id')->first();
                    $currentWorkspace = $parentAncestor
                        ? '/folder/' . $parentAncestor->id
                        : '/folder/' . $currentFolder->id; // Fallback if no parent ancestor found
                }
            } else {
                // Handle the case where the folder is not found
                // You can choose to set a default workspace or handle it as per your application's requirement
                // Optionally, log the incident for debugging
            }
        } else {
            // If the path doesn't have the expected structure, handle accordingly
        }

        $notifications = $this->retrieveNotificationAction->execute();

        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $user,
                'systemRole' => ($user && ($user->hasRole('admin'))) ? $user->system_role : null,
            ],
            'workspaces' => FolderLinksData::collect($workspaces, DataCollection::class),
            'csrf_token' => csrf_token(),
            'notifications' => $notifications,
            'currentWorkspace' => $currentWorkspace,
        ]);
    }
}
