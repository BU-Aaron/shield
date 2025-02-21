<?php

namespace Modules\DocumentApproval\Actions;

use Modules\Document\States\DocumentApprovalAccepted as StatesDocumentApprovalAccepted;
use Modules\Document\States\DocumentApprovalRejected as StatesDocumentApprovalRejected;
use Modules\Document\States\DocumentReviewalAccepted as StatesDocumentReviewalAccepted;
use Modules\Document\States\DocumentReviewalRejected as StatesDocumentReviewalRejected;
use Modules\DocumentApproval\Models\DocumentApproval;

use Modules\DocumentApproval\States\DocumentApprovalRejected;
use Modules\DocumentApproval\States\DocumentApprovalAccepted;
use Modules\DocumentApproval\States\DocumentReviewalRejected;
use Modules\DocumentApproval\States\DocumentReviewalAccepted;

use Modules\DocumentApprovalHasUser\States\UserReviewalPending;
use Modules\DocumentApprovalHasUser\States\UserReviewalRejected;
use Modules\DocumentApprovalHasUser\States\UserReviewalAccepted;
use Modules\DocumentApprovalHasUser\States\UserApprovalPending;
use Modules\DocumentApprovalHasUser\States\UserApprovalRejected;
use Modules\DocumentApprovalHasUser\States\UserApprovalAccepted;

class RecalculateDocumentStateAction
{
    public function execute(DocumentApproval $documentApproval): void
    {
        $documentApprovalUsers = $documentApproval->documentApprovalUsers;

        if ($documentApproval->type == 'reviewal') {
            if ($documentApprovalUsers->contains('user_state', UserReviewalPending::class)) {
                return;
            }

            if ($documentApprovalUsers->contains('user_state', UserReviewalRejected::class)) {
                $documentApproval->overall_state->transitionTo(DocumentReviewalRejected::class);

                $documentApproval->document->review_status->transitionTo(StatesDocumentReviewalRejected::class);

                $documentApproval->document->versions()->where('current', true)->update([
                    'review_status' => new StatesDocumentReviewalRejected($documentApproval->document),
                ]);
            } elseif ($documentApprovalUsers->every('user_state', UserReviewalAccepted::class)) {
                $documentApproval->overall_state->transitionTo(DocumentReviewalAccepted::class);

                $documentApproval->document->review_status->transitionTo(StatesDocumentReviewalAccepted::class);

                $documentApproval->document->versions()->where('current', true)->update([
                    'review_status' => new StatesDocumentReviewalAccepted($documentApproval->document),
                ]);
            }
        } else if ($documentApproval->type == 'approval') {
            if ($documentApprovalUsers->contains('user_state', UserApprovalPending::class)) {
                return;
            }

            if ($documentApprovalUsers->contains('user_state', UserApprovalRejected::class)) {
                $documentApproval->overall_state->transitionTo(DocumentApprovalRejected::class);

                $documentApproval->document->approval_status->transitionTo(StatesDocumentApprovalRejected::class);

                $documentApproval->document->versions()->where('current', true)->update([
                    'approval_status' => new StatesDocumentApprovalRejected($documentApproval->document),
                ]);
            } elseif ($documentApprovalUsers->every('user_state', UserApprovalAccepted::class)) {
                $documentApproval->overall_state->transitionTo(DocumentApprovalAccepted::class);

                $documentApproval->document->approval_status->transitionTo(StatesDocumentApprovalAccepted::class);

                $documentApproval->document->versions()->where('current', true)->update([
                    'approval_status' => new StatesDocumentApprovalAccepted($documentApproval->document),
                ]);
            }
        }
    }
}
