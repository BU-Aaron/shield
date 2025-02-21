<?php

namespace Modules\DocumentApproval\States;

class DocumentReviewalRejected extends DocumentState
{
    public function label(): string
    {
        return 'Reviewal Rejected';
    }
}
