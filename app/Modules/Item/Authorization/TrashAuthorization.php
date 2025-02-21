<?php

namespace App\Modules\Item\Authorization;

use Modules\User\Models\User;
use Illuminate\Auth\Access\AuthorizationException;

class TrashAuthorization
{
    /**
     * Determine if the user is an admin.
     *
     * @param User $user
     * @return bool
     * @throws AuthorizationException
     */
    public function isAdmin(User $user): bool
    {
        if ($user->hasRole('admin') || $user->hasRole('viewer')) {
            return true;
        }

        throw new AuthorizationException('Unauthorized.');
    }
}
