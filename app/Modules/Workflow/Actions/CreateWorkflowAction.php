<?php

namespace Modules\Workflow\Actions;

use Modules\Workflow\Data\CreateWorkflowData;
use Modules\Workflow\Models\Workflow;
use Modules\Workflow\Models\WorkflowHasUser;

class CreateWorkflowAction
{
    public function execute(CreateWorkflowData $data): array
    {
        $workflow = Workflow::create([
            'folder_item_id' => $data->folder_item_id,
            'resolution' => $data->resolution,
            'type' => $data->type,
            'destination' => $data->destination,
        ]);

        $workflowUsers = collect($data->users)->map(function ($user) {
            return new WorkflowHasUser([
                'user_id' => $user->user_id,
            ]);
        });

        $workflow->workflowUsers()->saveMany($workflowUsers);

        return ['workflow' => $workflow, 'workflow_users' => $workflowUsers];
    }
}
