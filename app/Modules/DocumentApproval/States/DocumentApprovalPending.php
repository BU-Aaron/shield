<?php

namespace Modules\DocumentApproval\States;

class DocumentApprovalPending extends DocumentState
{
    public function label(): string
    {
        return 'Approval Pending';
    }
}
