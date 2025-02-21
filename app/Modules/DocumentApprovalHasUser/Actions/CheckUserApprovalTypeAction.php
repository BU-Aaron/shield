<?php

namespace Modules\DocumentApprovalHasUser\Actions;

use Modules\DocumentApprovalHasUser\Data\DocumentApprovalHasUserData;
use Modules\DocumentApprovalHasUser\Models\DocumentApprovalHasUser;
use Modules\DocumentApprovalHasUser\States\UserApprovalAccepted;
use Modules\DocumentApprovalHasUser\States\UserApprovalPending;
use Modules\DocumentApprovalHasUser\States\UserApprovalRejected;
use Modules\DocumentApprovalHasUser\States\UserReviewalAccepted;
use Modules\DocumentApprovalHasUser\States\UserReviewalPending;
use Modules\DocumentApprovalHasUser\States\UserReviewalRejected;

class CheckUserApprovalTypeAction
{
    public function accept(DocumentApprovalHasUser $userApproval, DocumentApprovalHasUserData $data): void
    {
        if ($userApproval->user_state instanceof UserReviewalPending) {
            $userApproval->user_state->transitionTo(UserReviewalAccepted::class);
            $userApproval->update(['comment' => $data->comment]);
        } else if ($userApproval->user_state instanceof UserApprovalPending) {
            $userApproval->user_state->transitionTo(UserApprovalAccepted::class);
            $userApproval->update(['comment' => $data->comment]);
        }
    }

    public function reject(DocumentApprovalHasUser $userApproval, DocumentApprovalHasUserData $data): void
    {
        if ($userApproval->user_state instanceof UserReviewalPending) {
            $userApproval->user_state->transitionTo(UserReviewalRejected::class);
            $userApproval->update(['comment' => $data->comment]);
        } else if ($userApproval->user_state instanceof UserApprovalPending) {
            $userApproval->user_state->transitionTo(UserApprovalRejected::class);
            $userApproval->update(['comment' => $data->comment]);
        }
    }
}
