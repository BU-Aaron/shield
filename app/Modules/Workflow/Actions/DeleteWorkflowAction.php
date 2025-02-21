<?php

namespace Modules\Workflow\Actions;

use Modules\Workflow\Models\Workflow;

class DeleteWorkflowAction
{
    public function execute(Workflow $workflow): void
    {
        $workflow->delete();
    }
}
