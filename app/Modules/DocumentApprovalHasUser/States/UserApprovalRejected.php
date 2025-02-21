<?php

namespace Modules\DocumentApprovalHasUser\States;

class UserApprovalRejected extends UserState
{
    public function label(): string
    {
        return 'Approval Rejected';
    }
}
