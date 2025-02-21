<?php

namespace Modules\Document\States;

class DocumentReviewalRejected extends DocumentState
{
    public function label(): string
    {
        return 'Reviewal Rejected';
    }
}
