<?php

namespace Modules\Document\States;

class DocumentApprovalPending extends DocumentState
{
    public function label(): string
    {
        return 'Approval Pending';
    }
}
