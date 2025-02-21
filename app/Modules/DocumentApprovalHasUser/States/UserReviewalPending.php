<?php

namespace Modules\DocumentApprovalHasUser\States;

class UserReviewalPending extends UserState
{
    public function label(): string
    {
        return 'Reviewal Pending';
    }
}
