<?php

namespace Modules\DocumentApproval\States;

use Spatie\ModelStates\State;
use Spatie\ModelStates\StateConfig;

abstract class DocumentState extends State
{
    abstract public function label(): string;

    public static function config(): StateConfig
    {
        return parent::config()
            ->allowTransition(DocumentReviewalPending::class, DocumentReviewalAccepted::class)
            ->allowTransition(DocumentReviewalPending::class, DocumentReviewalRejected::class)
            ->allowTransition(DocumentApprovalPending::class, DocumentApprovalAccepted::class)
            ->allowTransition(DocumentApprovalPending::class, DocumentApprovalRejected::class);
    }
}
