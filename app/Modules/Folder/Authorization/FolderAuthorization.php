<?php

namespace Modules\Folder\Authorization;

use Modules\User\Models\User;
use Modules\Folder\Models\Folder;
use Illuminate\Auth\Access\AuthorizationException;

class FolderAuthorization
{
    /**
     * Authorize a user to perform an action on a Folder.
     *
     * @param  User  $user
     * @param  callable  $callback
     * @return bool
     *
     * @throws AuthorizationException
     */
    private function authorize(User $user, callable $callback)
    {
        if ($this->before($user)) {
            return true;
        }

        return $callback();
    }

    /**
     * Grant blanket authorization to admins.
     *
     * @param  User  $user
     * @return bool|null
     */
    private function before(User $user): ?bool
    {
        if ($user->hasRole('admin')) {
            return true;
        }

        return null;
    }

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

        throw new AuthorizationException('Unauthorized');
    }

    /**
     * Determine if the user can view the Folder.
     *
     * @param  User  $user
     * @param  Folder  $folder
     * @return bool
     *
     * @throws AuthorizationException
     */
    public function canView(User $user, Folder $folder): bool
    {
        // Allow viewers to view folders
        if ($user->hasRole('viewer')) {
            return true;
        }

        return $this->authorize($user, function () use ($folder, $user) {
            if (!$folder->userAccess()->where('user_id', $user->id)->exists()) {
                throw new AuthorizationException('You don’t have permission to view this folder');
            }

            return true;
        });
    }

    /**
     * Determine if the user can edit the Folder.
     *
     * @param  User  $user
     * @param  Folder  $folder
     * @return bool
     *
     * @throws AuthorizationException
     */
    public function canEdit(User $user, Folder $folder): bool
    {
        return $this->authorize($user, function () use ($folder, $user) {
            if (!$folder->userAccess()
                ->where('user_id', $user->id)
                ->wherePivot('role', 'editor')
                ->exists()) {
                throw new AuthorizationException('You don’t have permission to edit this folder');
            }

            return true;
        });
    }

    /**
     * Determine if the user can share the Folder.
     *
     * @param  User  $user
     * @param  Folder  $folder
     * @return bool
     *
     * @throws AuthorizationException
     */
    public function canShare(User $user, Folder $folder): bool
    {
        return $this->authorize($user, function () use ($folder, $user) {
            if (!$folder->userAccess()
                ->where('user_id', $user->id)
                ->wherePivot('role', 'editor')
                ->exists()) {
                throw new AuthorizationException('You don’t have permission to share this folder');
            }

            return true;
        });
    }

    // ... other methods
}
