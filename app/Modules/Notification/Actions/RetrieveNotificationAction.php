<?php

namespace Modules\Notification\Actions;

use Illuminate\Support\Facades\Auth;
use Modules\DocumentApproval\Data\DocumentApprovalResourceData;
use Modules\DocumentApproval\Models\DocumentApproval;
use Modules\DocumentApprovalHasUser\States\UserApprovalPending;
use Modules\DocumentApprovalHasUser\States\UserReviewalPending;

class RetrieveNotificationAction
{
    public function execute()
    {
        $user = Auth::user();

        if (!$user) {
            // Handle the case where there is no authenticated user
            return collect(); // Return an empty collection or handle as needed
        }

        $pendingApprovals = DocumentApproval::whereHas('documentApprovalUsers', function ($query) use ($user) {
            $query->where('user_id', $user->id)
                ->whereIn('user_state', [
                    UserApprovalPending::class,
                    UserReviewalPending::class,
                ]);
        })
            ->whereHas('documentVersion', function ($query) {
                $query->where('current', true);
            })
            ->whereHas('documentVersion.document', function ($query) {
                // Ensure the related Item is not soft-deleted
                $query->whereHas('item', function ($query) {
                    $query->whereNull('deleted_at');
                });
            })
            ->get()
            ->map(fn($approval) => DocumentApprovalResourceData::fromModel($approval));

        return $pendingApprovals;
    }
}
