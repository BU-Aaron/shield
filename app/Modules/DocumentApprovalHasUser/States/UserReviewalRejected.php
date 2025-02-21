<?php

namespace Modules\DocumentApprovalHasUser\States;

class UserReviewalRejected extends UserState
{
    public function label(): string
    {
        return 'Reviewal Rejected';
    }
}
