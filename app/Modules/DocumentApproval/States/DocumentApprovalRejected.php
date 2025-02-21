<?php

namespace Modules\DocumentApproval\States;

class DocumentApprovalRejected extends DocumentState
{
    public function label(): string
    {
        return 'Approval Rejected';
    }
}
