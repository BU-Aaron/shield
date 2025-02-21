<?php

namespace Modules\DocumentApprovalHasUser\States;

class UserApprovalPending extends UserState
{
    public function label(): string
    {
        return 'Approval Pending';
    }
}
