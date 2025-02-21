<?php

namespace Modules\DocumentApprovalHasUser\States;

use Spatie\ModelStates\State;
use Spatie\ModelStates\StateConfig;

abstract class UserState extends State
{
    abstract public function label(): string;

    public static function config(): StateConfig
    {
        return parent::config()
            ->allowTransition(UserReviewalPending::class, UserReviewalRejected::class, UserReviewalPendingToRejected::class)
            ->allowTransition(UserReviewalPending::class, UserReviewalAccepted::class, UserReviewalPendingToAccepted::class)
            ->allowTransition(UserApprovalPending::class, UserApprovalRejected::class, UserApprovalPendingToRejected::class)
            ->allowTransition(UserApprovalPending::class, UserApprovalAccepted::class, UserApprovalPendingToAccepted::class);
    }
}
