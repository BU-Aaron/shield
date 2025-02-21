<?php

namespace Modules\DocumentApprovalHasUser\States;

class UserReviewalAccepted extends UserState
{
    public function label(): string
    {
        return 'Reviewal Accepted';
    }
}
