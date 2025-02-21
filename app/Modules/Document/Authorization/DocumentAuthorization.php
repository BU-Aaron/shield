<?php

namespace Modules\Document\Authorization;

use Modules\User\Models\User;
use Modules\Document\Models\Document;
use Illuminate\Auth\Access\AuthorizationException;

class DocumentAuthorization
{
    /**
     * Authorize a user to perform an action on a Document.
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
     * Determine if the user can view the Document.
     *
     * @param  User  $user
     * @param  Document  $document
     * @return bool
     *
     * @throws AuthorizationException
     */
    public function canView(User $user, Document $document): bool
    {
        // Allow viewers to view documents
        if ($user->hasRole('viewer')) {
            return true;
        }

        return $this->authorize($user, function () use ($document, $user) {
            if (!$document->userAccess()->where('user_id', $user->id)->exists()) {
                throw new AuthorizationException('You don’t have permission to view this document');
            }

            return true;
        });
    }

    /**
     * Determine if the user can edit the Document.
     *
     * @param  User  $user
     * @param  Document  $document
     * @return bool
     *
     * @throws AuthorizationException
     */
    public function canEdit(User $user, Document $document): bool
    {
        return $this->authorize($user, function () use ($document, $user) {
            if (!$document->userAccess()
                ->where('user_id', $user->id)
                ->wherePivot('role', 'editor')
                ->exists()) {
                throw new AuthorizationException('You don’t have permission to edit this document');
            }

            return true;
        });
    }

    /**
     * Determine if the user can share the Document.
     *
     * @param  User  $user
     * @param  Document  $document
     * @return bool
     *
     * @throws AuthorizationException
     */
    public function canShare(User $user, Document $document): bool
    {
        return $this->authorize($user, function () use ($document, $user) {
            if (!$document->userAccess()
                ->where('user_id', $user->id)
                ->wherePivot('role', 'editor')
                ->exists()) {
                throw new AuthorizationException('You don’t have permission to share this document');
            }

            return true;
        });
    }

    // ... other methods
}
