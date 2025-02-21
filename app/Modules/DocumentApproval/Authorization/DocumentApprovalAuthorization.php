<?php

namespace Modules\DocumentApproval\Authorization;

use Modules\User\Models\User;
use Modules\DocumentApproval\Models\DocumentApproval;
use Illuminate\Auth\Access\AuthorizationException;

class DocumentApprovalAuthorization
{
    /**
     * Authorize a user to perform an action on a DocumentApproval.
     *
     * @param  User  $user
     * @param  DocumentApproval  $documentApproval
     * @param  callable  $callback
     * @return mixed
     *
     * @throws AuthorizationException
     */
    private function authorize(User $user, DocumentApproval $documentApproval, callable $callback)
    {
        return $callback();
    }

    /**
     * Determine if the user can view the DocumentApproval.
     *
     * @param  User  $user
     * @param  DocumentApproval  $documentApproval
     * @return bool
     *
     * @throws AuthorizationException
     */
    public function canView(User $user, DocumentApproval $documentApproval): bool
    {
        return $this->authorize($user, $documentApproval, function () use ($user, $documentApproval) {
            if (!$documentApproval->documentApprovalUsers()->where('user_id', $user->id)->exists()) {
                throw new AuthorizationException('You do not have permission to view this document approval.');
            }

            return true;
        });
    }

    /**
     * Determine if the user can edit the DocumentApproval.
     *
     * @param  User  $user
     * @param  DocumentApproval  $documentApproval
     * @return bool
     *
     * @throws AuthorizationException
     */
    public function canEdit(User $user, DocumentApproval $documentApproval): bool
    {
        return $this->authorize($user, $documentApproval, function () use ($user, $documentApproval) {
            // Add your specific edit logic here. For example, check if the user has an 'editor' role in the approval.
            $userApproval = $documentApproval->documentApprovalUsers()
                ->where('user_id', $user->id)
                ->first();

            if (!$userApproval || $userApproval->user_state instanceof \Modules\DocumentApprovalHasUser\States\UserApprovalRejected) {
                throw new AuthorizationException('You do not have permission to edit this document approval.');
            }

            return true;
        });
    }

    /**
     * Determine if the user can approve the DocumentApproval.
     *
     * @param  User  $user
     * @param  DocumentApproval  $documentApproval
     * @return bool
     *
     * @throws AuthorizationException
     */
    public function canApprove(User $user, DocumentApproval $documentApproval): bool
    {
        return $this->authorize($user, $documentApproval, function () use ($user, $documentApproval) {
            $userApproval = $documentApproval->documentApprovalUsers()
                ->where('user_id', $user->id)
                ->first();

            if (!$userApproval || !$userApproval->canApprove()) { // Assuming canApprove method exists in DocumentApprovalHasUser model
                throw new AuthorizationException('You do not have permission to approve this document approval.');
            }

            return true;
        });
    }

    /**
     * Determine if the user can reject the DocumentApproval.
     *
     * @param  User  $user
     * @param  DocumentApproval  $documentApproval
     * @return bool
     *
     * @throws AuthorizationException
     */
    public function canReject(User $user, DocumentApproval $documentApproval): bool
    {
        return $this->authorize($user, $documentApproval, function () use ($user, $documentApproval) {
            $userApproval = $documentApproval->documentApprovalUsers()
                ->where('user_id', $user->id)
                ->first();

            if (!$userApproval || !$userApproval->canReject()) { // Assuming canReject method exists in DocumentApprovalHasUser model
                throw new AuthorizationException('You do not have permission to reject this document approval.');
            }

            return true;
        });
    }
}
