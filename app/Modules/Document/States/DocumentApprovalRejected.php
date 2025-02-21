<?php

namespace Modules\Document\States;

class DocumentApprovalRejected extends DocumentState
{
    public function label(): string
    {
        return 'Approval Rejected';
    }
}
