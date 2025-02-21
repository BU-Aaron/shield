<?php

namespace Modules\Workspace\Controllers;

use Modules\Common\Controllers\Controller;
use Modules\Workspace\Models\Workspace;
use Modules\Item\Models\Item;
use Modules\User\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Modules\Workspace\Data\CreateWorkspaceData;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;
use Modules\Item\Data\ItemAncestorsResourceData;
use Modules\Item\Data\ItemContentsResourceData;
use Modules\Item\Data\ItemParentResourceData;
use Modules\Workspace\Actions\CreateWorkspaceAction;
use Modules\Workspace\Authorization\WorkspaceAuthorization;
use Modules\Workspace\Data\RemoveShareWorkspaceData;
use Modules\Workspace\Data\ShareWorkspaceData;
use Spatie\LaravelData\DataCollection;
use Modules\Item\Actions\GetItemDataAction;

class WorkspaceController extends Controller
{
    public function __construct(
        protected CreateWorkspaceAction $createWorkspaceAction,
        protected WorkspaceAuthorization $workspaceAuthorization,
        protected GetItemDataAction $getItemDataAction
    ) {}

    public function index(): JsonResponse
    {
        $this->workspaceAuthorization->isAdmin(Auth::user());

        $workspaces = Workspace::all();

        return response()->json($workspaces);
    }

    /**
     * Show contents of workspace
     * @return \Spatie\LaravelData\DataCollection<ItemContentsResourceData>
     */
    public function show(Workspace $workspace)
    {
        $this->workspaceAuthorization->canView(Auth::user(), $workspace);

        $item = Item::find($workspace->item->id);

        $data = $this->getItemDataAction->execute($item);

        return Inertia::render('Item', $data);
    }

    public function store(CreateWorkspaceData $data): RedirectResponse
    {
        $this->createWorkspaceAction->execute($data);

        return redirect()->back();
    }

    public function share(ShareWorkspaceData $data, Workspace $workspace): JsonResponse
    {
        $this->workspaceAuthorization->canShare(Auth::user(), $workspace);

        $user = User::where('email', $data->email)->firstOrFail();

        $workspace->userAccess()->attach($user->id, ['role' => $data->role]);

        return response()->json(['message' => 'Workspace shared successfully.'], 200);
    }

    public function removeShare(RemoveShareWorkspaceData $data, Workspace $workspace): JsonResponse
    {
        $this->workspaceAuthorization->canShare(Auth::user(), $workspace);

        $user = User::where('email', $data->email)->firstOrFail();

        $workspace->userAccess()->detach($user->id);

        return response()->json(['message' => 'Workspace unshared successfully.'], 200);
    }
}
