<?php

namespace Modules\DocumentApproval\States;

class DocumentApprovalAccepted extends DocumentState
{
    public function label(): string
    {
        return 'Approval Accepted';
    }
}
