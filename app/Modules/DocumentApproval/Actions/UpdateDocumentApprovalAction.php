<?php

namespace Modules\DocumentApproval\Actions;

use Modules\Document\States\DocumentApprovalPending as StatesDocumentApprovalPending;
use Modules\Document\States\DocumentReviewalPending as StatesDocumentReviewalPending;
use Modules\DocumentApproval\Data\UpdateDocumentApprovalData;
use Modules\DocumentApproval\Models\DocumentApproval;
use Modules\DocumentApproval\States\DocumentApprovalPending;
use Modules\DocumentApproval\States\DocumentReviewalPending;
use Modules\DocumentApprovalHasUser\Models\DocumentApprovalHasUser;
use Modules\DocumentApprovalHasUser\States\UserApprovalPending;
use Modules\DocumentApprovalHasUser\States\UserReviewalPending;
use Modules\User\Models\User;

class UpdateDocumentApprovalAction
{
    public function __construct(
        protected SendDocumentApprovalNotificationAction $sendDocumentApprovalNotificationAction,
        protected RecalculateDocumentStateAction $recalculateDocumentStateAction
    ) {}

    public function execute(DocumentApproval $documentApproval, UpdateDocumentApprovalData $data): array
    {
        // Update document approval details
        $documentApproval->update([
            'resolution' => $data->resolution,
            'type' => $data->type,
            'overall_state' => $data->type === 'reviewal' ? DocumentReviewalPending::class : DocumentApprovalPending::class,
        ]);

        // Update the related document's status
        if ($data->type === 'reviewal') {
            $documentApproval->document->update([
                'review_status' => StatesDocumentReviewalPending::class,
            ]);
        } elseif ($data->type === 'approval') {
            $documentApproval->document->update([
                'approval_status' => StatesDocumentApprovalPending::class,
            ]);
        }

        // Determine required role based on the new type
        $requiredRole = $this->getRequiredRole($data->type);

        if ($requiredRole) {
            // Fetch users based on the required role
            $filteredUsers = User::whereIn('id', array_map(fn($user) => $user->user_id, $data->users))
                ->where('workflow_role', $requiredRole)
                ->get();

            // Retrieve existing user approvals
            $existingUserApprovals = $documentApproval->documentApprovalUsers()->get();

            // Separate decided and pending users
            $decidedUsers = $existingUserApprovals->filter(function ($userApproval) {
                return !in_array($userApproval->user_state, [
                    UserApprovalPending::class,
                    UserReviewalPending::class
                ]);
            });

            $pendingUsers = $existingUserApprovals->filter(function ($userApproval) {
                return in_array($userApproval->user_state, [
                    UserApprovalPending::class,
                    UserReviewalPending::class
                ]);
            });

            // Identify user IDs from the new data
            $newUserIds = collect($data->users)->pluck('user_id')->toArray();

            // Determine which pending users to delete (those not in the new data)
            $userIdsToDelete = $pendingUsers->filter(function ($userApproval) use ($newUserIds) {
                return !in_array($userApproval->user_id, $newUserIds);
            })->pluck('id')->toArray();

            if (!empty($userIdsToDelete)) {
                DocumentApprovalHasUser::whereIn('id', $userIdsToDelete)->delete();
            }

            // Identify users to add (those not already in the system)
            $existingUserIds = $existingUserApprovals->pluck('user_id')->toArray();

            $usersToAdd = $filteredUsers->filter(function ($user) use ($existingUserIds) {
                return !in_array($user->id, $existingUserIds);
            });

            foreach ($usersToAdd as $user) {
                DocumentApprovalHasUser::create([
                    'document_approval_id' => $documentApproval->id,
                    'user_id' => $user->id,
                    'user_state' => $requiredRole === 'reviewer' ? UserReviewalPending::class : UserApprovalPending::class,
                ]);
            }

            // Optionally, update existing pending users if necessary

            // Send notifications about the update
            $this->sendDocumentApprovalNotificationAction->execute($documentApproval);
        }

        $this->recalculateDocumentStateAction->execute($documentApproval);

        return ['documentApproval' => $documentApproval->load('documentApprovalUsers')];
    }

    /**
     * Determines the required user role based on the document approval type.
     *
     * @param string $type
     * @return string|null
     */
    private function getRequiredRole(string $type): ?string
    {
        return match ($type) {
            'reviewal' => 'reviewer',
            'approval' => 'approver',
            default => null,
        };
    }
}
