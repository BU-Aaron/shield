<?php

namespace Modules\Metadata\Authorization;

use Modules\User\Models\User;
use Modules\Metadata\Models\Metadata;
use Illuminate\Auth\Access\AuthorizationException;

class MetadataAuthorization
{
    /**
     * Determine if the user can view metadata.
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

        throw new AuthorizationException('Unauthorized to view metadata.');
    }

    /**
     * Determine if the user can create metadata.
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

        throw new AuthorizationException('Unauthorized to create metadata.');
    }

    /**
     * Determine if the user can update metadata.
     *
     * @param  User  $user
     * @param  Metadata  $metadata
     * @return bool
     *
     * @throws AuthorizationException
     */
    public function canUpdate(User $user, Metadata $metadata): bool
    {
        if ($user->hasRole('admin')) {
            return true;
        }

        throw new AuthorizationException('Unauthorized to update this metadata.');
    }

    /**
     * Determine if the user can delete metadata.
     *
     * @param  User  $user
     * @param  Metadata  $metadata
     * @return bool
     *
     * @throws AuthorizationException
     */
    public function canDelete(User $user, Metadata $metadata): bool
    {
        if ($user->hasRole('admin')) {
            return true;
        }

        throw new AuthorizationException('Unauthorized to delete this metadata.');
    }
}
