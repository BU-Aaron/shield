<?php

namespace Modules\Document\States;

class DocumentApprovalAccepted extends DocumentState
{
    public function label(): string
    {
        return 'Approval Accepted';
    }
}
