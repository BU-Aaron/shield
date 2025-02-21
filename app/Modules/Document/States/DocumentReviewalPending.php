<?php

namespace Modules\Document\States;

class DocumentReviewalPending extends DocumentState
{
    public function label(): string
    {
        return 'Reviewal Pending';
    }
}
