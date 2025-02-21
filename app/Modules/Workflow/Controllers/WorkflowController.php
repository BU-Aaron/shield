<?php

namespace Modules\Workflow\Controllers;

use Modules\Common\Controllers\Controller;
use Modules\Workflow\Data\CreateWorkflowData;
use Modules\Workflow\Actions\CreateWorkflowAction;
use Modules\Workflow\Models\Workflow;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Modules\Workflow\Data\UpdateWorkflowData;
use Modules\Workflow\Actions\UpdateWorkflowAction;
use Modules\Workflow\Actions\DeleteWorkflowAction;
use Modules\User\Models\User;
use Illuminate\Http\Request;
use Modules\Workflow\Data\WorkflowResource;

class WorkflowController extends Controller
{
    public function __construct(
        protected CreateWorkflowAction $createWorkflowAction,
        protected UpdateWorkflowAction $updateWorkflowAction,
        protected DeleteWorkflowAction $deleteWorkflowAction
    ) {}

    public function index(): JsonResponse
    {
        $workflows = Workflow::with('workflowUsers')->get();
        return response()->json($workflows);
    }

    public function show(Workflow $workflow): JsonResponse
    {
        return response()->json(WorkflowResource::fromModel($workflow));
    }

    public function store(CreateWorkflowData $data): RedirectResponse
    {
        $workflow = $this->createWorkflowAction->execute($data);

        return redirect()->back();
    }

    public function update(Workflow $workflow, UpdateWorkflowData $data): RedirectResponse
    {
        $updatedWorkflow = $this->updateWorkflowAction->execute($workflow, $data);
        return redirect()->back();
    }

    public function destroy(Workflow $workflow): RedirectResponse
    {
        $this->deleteWorkflowAction->execute($workflow);
        return redirect()->back();
    }

    // public function getWorkflowUsersByType(string $type): JsonResponse
    // {
    //     if (!in_array($type, ['reviewal', 'approval'])) {
    //         return response()->json(['error' => 'Invalid workflow type'], 400);
    //     }

    //     if ($type == 'reviewal') {
    //         $users = User::where('workflow_role', 'reviewer')->get();
    //     } else if ($type == 'approval') {
    //         $users = User::where('workflow_role', 'approver')->get();
    //     }

    //     return response()->json($users);
    // }
}
