<?php

namespace Modules\DocumentApproval\Actions;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Modules\Document\Models\DocumentHasVersion;
use Modules\Document\States\DocumentApprovalPending as StatesDocumentApprovalPending;
use Modules\Document\States\DocumentReviewalPending as StatesDocumentReviewalPending;
use Modules\DocumentApproval\States\DocumentApprovalPending;
use Modules\DocumentApproval\States\DocumentReviewalPending;
use Modules\DocumentApproval\Data\CreateDocumentApprovalData;
use Modules\DocumentApproval\Models\DocumentApproval;
use Modules\DocumentApprovalHasUser\Models\DocumentApprovalHasUser;
use Modules\DocumentApprovalHasUser\States\UserApprovalPending;
use Modules\DocumentApprovalHasUser\States\UserReviewalPending;
use Modules\Metadata\Models\Metadata;

class CreateDocumentApprovalAction
{
    public function __construct(
        protected SendDocumentApprovalNotificationAction $sendDocumentApprovalNotificationAction
    ) {}

    public function execute(CreateDocumentApprovalData $data): DocumentApproval
    {
        $approvalType = $data->type;

        // Start of Selection
        $documentVersion = DocumentHasVersion::where('document_item_id', $data->document_id)
            ->where('current', true)
            ->firstOrFail();

        $documentApproval = DocumentApproval::create([
            'document_version_id' => $documentVersion->id, // Associate with DocumentHasVersion
            'resolution' => $data->resolution,
            'destination' => $data->destination,
            'type' => $data->type,
            'overall_state' => $approvalType === 'reviewal' ? DocumentReviewalPending::class : DocumentApprovalPending::class,
        ]);

        $documentApprovalUsers = collect($data->users)->map(function ($user) use ($approvalType) {
            return new DocumentApprovalHasUser([
                'user_id' => $user->user_id,
                'user_state' => $approvalType === 'reviewal' ? UserReviewalPending::class : UserApprovalPending::class,
            ]);
        });

        $documentApproval->documentApprovalUsers()->saveMany($documentApprovalUsers);

        // Update statuses on the document version instead of the document
        if ($approvalType === 'reviewal') {
            $documentVersion->update([
                'review_status' => StatesDocumentReviewalPending::class,
            ]);

            $documentVersion->document->versions()->where('current', true)->update([
                'review_status' => new StatesDocumentReviewalPending($documentVersion->document),
            ]);

            $documentApproval->document->update([
                'review_status' => StatesDocumentReviewalPending::class,
            ]);
        } else {
            $documentVersion->update([
                'approval_status' => StatesDocumentApprovalPending::class,
            ]);

            $documentVersion->document->versions()->where('current', true)->update([
                'approval_status' => new StatesDocumentApprovalPending($documentVersion->document),
            ]);

            $documentApproval->document->update([
                'approval_status' => StatesDocumentApprovalPending::class,
            ]);
        }

        if ($approvalType === 'reviewal') {
            $reviewStatusMetadata = Metadata::where('name', 'Review Status')->first();
            $documentVersion->document->metadata()->sync([
                $reviewStatusMetadata->id => [
                    'value' => $documentVersion->review_status->label(),
                ],
            ]);
        } else {
            $approvalStatusMetadata = Metadata::where('name', 'Approval Status')->first();
            $documentVersion->document->metadata()->sync([
                $approvalStatusMetadata->id => [
                    'value' => $documentVersion->approval_status->label(),
                ],
            ]);
        }

        $this->sendDocumentApprovalNotificationAction->execute($documentApproval);

        activity()
            ->performedOn($documentVersion->document)
            ->causedBy(Auth::id())
            ->log("Started " . $approvalType . " workflow");

        return $documentApproval;
    }
}
