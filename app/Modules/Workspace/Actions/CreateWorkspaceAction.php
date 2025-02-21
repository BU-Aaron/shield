<?php

namespace Modules\Workspace\Actions;

use Modules\Workspace\Data\CreateWorkspaceData;
use Modules\Item\Actions\CreateItemAction;
use Modules\Item\Data\CreateItemData;
use Illuminate\Support\Facades\Auth;
use Modules\Folder\Models\Folder;

class CreateWorkspaceAction
{
    public function __construct(
        protected CreateItemAction $createItemAction
    ) {}

    public function execute(CreateWorkspaceData $data): Folder
    {
        $item = $this->createItemAction->execute(
            CreateItemData::from([
                'parent_id' => null,
                'position' => 0,
            ])
        );

        $workspace = $item->folder()->create([
            'name' => $data->name,
            'owned_by' => $data->owned_by ?? Auth::id(),
        ]);

        activity()
            ->performedOn($workspace)
            ->causedBy(Auth::id())
            ->log("Workspace created");

        return $workspace;
    }
}
