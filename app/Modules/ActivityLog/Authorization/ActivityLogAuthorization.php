<?php

namespace App\Modules\ActivityLog\Authorization;

use Modules\User\Models\User;
use Illuminate\Auth\Access\AuthorizationException;

class ActivityLogAuthorization
{
    /**
     * Determine if the user is an admin.
     *
     * @param  User  $user
     * @return bool
     *
     * @throws AuthorizationException
     */
    public function isAdmin(User $user): bool
    {
        if ($user->hasRole('admin')) {
            return true;
        }

        throw new AuthorizationException('Unauthorized.');
    }

    /**
     * Determine if the user can view the activity logs.
     *
     * @param  User  $user
     * @return bool
     *
     * @throws AuthorizationException
     */
    public function canView(User $user): bool
    {
        // You can add more complex logic here if needed
        return $this->isAdmin($user);
    }
}
