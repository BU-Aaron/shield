<?php

namespace Modules\DocumentApprovalHasUser\States;

use Illuminate\Support\Facades\Auth;
use Spatie\ModelStates\Transition;
use Modules\DocumentApprovalHasUser\Models\DocumentApprovalHasUser;
use Modules\DocumentApproval\Actions\RecalculateDocumentStateAction;
use Modules\DocumentApproval\Actions\SendDocumentApprovalNotificationAction;
use Modules\DocumentApprovalHasUser\States\UserApprovalAccepted;
use Modules\Metadata\Models\Metadata;
use Modules\User\Models\User;

class UserApprovalPendingToAccepted extends Transition
{
    public function __construct(
        private DocumentApprovalHasUser $documentApprovalHasUser,
    ) {}

    public function handle(
        SendDocumentApprovalNotificationAction $sendDocumentApprovalNotification,
        RecalculateDocumentStateAction $recalculateDocumentStateAction
    ): DocumentApprovalHasUser {

        $this->documentApprovalHasUser->user_state = new UserApprovalAccepted($this->documentApprovalHasUser);
        $this->documentApprovalHasUser->save();

        // $sendDocumentApprovalNotification->execute($this->documentApprovalHasUser->documentApproval);

        $recalculateDocumentStateAction->execute($this->documentApprovalHasUser->documentApproval);

        $metadata = Metadata::where('name', 'Approval Status')->first();

        $this->documentApprovalHasUser->documentApproval->document->metadata()->sync([
            $metadata->id => [
                'value' => $this->documentApprovalHasUser->documentApproval->document->approval_status->label(),
            ],
        ]);

        activity()
            ->performedOn($this->documentApprovalHasUser->documentApproval->document)
            ->causedBy(Auth::id())
            ->log("Document approval accepted");

        return $this->documentApprovalHasUser;
    }
}
