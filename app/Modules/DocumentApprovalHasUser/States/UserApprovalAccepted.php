<?php

namespace Modules\DocumentApprovalHasUser\States;

class UserApprovalAccepted extends UserState
{
    public function label(): string
    {
        return 'Approval Accepted';
    }
}
