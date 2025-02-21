<?php

namespace Modules\Workspace\Actions;

use Modules\Workspace\Models\Workspace;
use Modules\Item\Actions\DeleteItemAction;

class DeleteWorkspaceAction
{
    public function __construct(
        protected DeleteItemAction $deleteItemAction
    ) {}

    public function execute(Workspace $workspace): void
    {
        $this->deleteItemAction->execute($workspace->item);
    }
}
