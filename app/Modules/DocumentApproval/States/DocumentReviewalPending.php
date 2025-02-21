<?php

namespace Modules\DocumentApproval\States;

class DocumentReviewalPending extends DocumentState
{
    public function label(): string
    {
        return 'Reviewal Pending';
    }
}
