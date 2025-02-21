<?php

namespace App\Modules\Admin\Authorization;

use Modules\User\Models\User;
use Illuminate\Auth\Access\AuthorizationException;

class AdminAuthorization
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
     * Determine if the user can access admin tools.
     *
     * @param  User  $user
     * @return bool
     *
     * @throws AuthorizationException
     */
    public function canAccessAdminTools(User $user): bool
    {
        // Additional logic can be added here if needed
        return $this->isAdmin($user);
    }
}
