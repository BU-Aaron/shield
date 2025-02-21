<?php

namespace Modules\NumberingScheme\Authorization;

use Modules\User\Models\User;
use Modules\NumberingScheme\Models\NumberingScheme;
use Illuminate\Auth\Access\AuthorizationException;

class NumberingSchemeAuthorization
{
    /**
     * Determine if the user can view numbering schemes.
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

        throw new AuthorizationException('Unauthorized to view numbering schemes.');
    }

    /**
     * Determine if the user can create a numbering scheme.
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

        throw new AuthorizationException('Unauthorized to create numbering schemes.');
    }

    /**
     * Determine if the user can update a numbering scheme.
     *
     * @param  User  $user
     * @param  NumberingScheme  $numberingScheme
     * @return bool
     *
     * @throws AuthorizationException
     */
    public function canUpdate(User $user, NumberingScheme $numberingScheme): bool
    {
        if ($user->hasRole('admin')) {
            return true;
        }

        throw new AuthorizationException('Unauthorized to update this numbering scheme.');
    }

    /**
     * Determine if the user can delete a numbering scheme.
     *
     * @param  User  $user
     * @param  NumberingScheme  $numberingScheme
     * @return bool
     *
     * @throws AuthorizationException
     */
    public function canDelete(User $user, NumberingScheme $numberingScheme): bool
    {
        if ($user->hasRole('admin')) {
            return true;
        }

        throw new AuthorizationException('Unauthorized to delete this numbering scheme.');
    }
}
