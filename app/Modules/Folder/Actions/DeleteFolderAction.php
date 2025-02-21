<?php

namespace Modules\Folder\Actions;

use Illuminate\Support\Facades\Auth;
use Modules\Folder\Models\Folder;
use Modules\Item\Actions\DeleteItemAction;

class DeleteFolderAction
{
    public function __construct(
        protected DeleteItemAction $deleteItemAction
    ) {}

    public function execute(Folder $folder): void
    {
        $this->deleteItemAction->execute($folder->item);

        activity()
            ->performedOn($folder)
            ->causedBy(Auth::id())
            ->log("Folder deleted");
    }
}
