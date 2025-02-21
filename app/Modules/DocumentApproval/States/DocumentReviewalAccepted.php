<?php

namespace Modules\DocumentApproval\States;

class DocumentReviewalAccepted extends DocumentState
{
    public function label(): string
    {
        return 'Reviewal Accepted';
    }
}
