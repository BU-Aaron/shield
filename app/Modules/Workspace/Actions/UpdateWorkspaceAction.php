<?php

namespace Modules\Workspace\Actions;

use Modules\Workspace\Data\UpdateWorkspaceData;
use Modules\Workspace\Models\Workspace;

class UpdateWorkspaceAction
{
    public function execute(Workspace $workspace, UpdateWorkspaceData $data): Workspace
    {
        $workspace->update([
            'name' => $data->name,
        ]);

        return $workspace;
    }
}
