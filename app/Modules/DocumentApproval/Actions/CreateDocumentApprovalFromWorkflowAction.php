<?php

namespace Modules\DocumentApproval\Actions;

use Modules\Document\Models\Document;
use Modules\DocumentApproval\Actions\CreateDocumentApprovalAction;
use Modules\DocumentApproval\Data\CreateDocumentApprovalData;
use Modules\DocumentApprovalHasUser\Data\DocumentApprovalHasUserData;
use Modules\Folder\Models\Folder;


class CreateDocumentApprovalFromWorkflowAction
{
    public function __construct(
        protected CreateDocumentApprovalAction $createDocumentApprovalAction
    ) {}

    public function execute(Document $document)
    {
        $folder = Folder::find($document->item->parent_id);

        if ($folder && $folder->workflow) {
            $workflow = $folder->workflow;

            $createDocumentApprovalData = new CreateDocumentApprovalData(
                document_id: $document->item->id,
                resolution: $workflow->resolution,
                destination: $workflow->destination,
                type: $workflow->type,
                users: $workflow->workflowUsers->map(fn($user) => new DocumentApprovalHasUserData($user->user_id))->all()
            );

            $this->createDocumentApprovalAction->execute($createDocumentApprovalData);
        }
    }
}
