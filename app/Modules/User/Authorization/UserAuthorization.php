<?php

namespace Modules\User\Authorization;

use Modules\User\Models\User;
use Illuminate\Auth\Access\AuthorizationException;

class UserAuthorization
{
    /**
     * Determine if the user can view the user list.
     *
     * @param  User  $user
     * @return bool
     *
     * @throws AuthorizationException
     */
    public function canView(User $user): bool
    {
        if ($user->hasRole('admin')) {
            return true;
        }

        throw new AuthorizationException('Unauthorized to view users.');
    }

    /**
     * Determine if the user can create a new user.
     *
     * @param  User  $user
     * @return bool
     *
     * @throws AuthorizationException
     */
    public function canCreate(User $user): bool
    {
        if ($user->hasRole('admin')) {
            return true;
        }

        throw new AuthorizationException('Unauthorized to create users.');
    }

    /**
     * Determine if the user can update a specific user.
     *
     * @param  User  $user
     * @param  User  $targetUser
     * @return bool
     *
     * @throws AuthorizationException
     */
    public function canUpdate(User $user, User $targetUser): bool
    {
        if ($user->hasRole('admin') || $user->id === $targetUser->id) {
            return true;
        }

        throw new AuthorizationException('Unauthorized to update this user.');
    }

    /**
     * Determine if the user can delete a specific user.
     *
     * @param  User  $user
     * @param  User  $targetUser
     * @return bool
     *
     * @throws AuthorizationException
     */
    public function canDelete(User $user, User $targetUser): bool
    {
        if ($user->hasRole('admin') && $user->id !== $targetUser->id) {
            return true;
        }

        throw new AuthorizationException('Unauthorized to delete this user.');
    }
}
