<?php

namespace Modules\DocumentApproval\Actions;

use Modules\DocumentApproval\Models\DocumentApproval;
use Modules\DocumentApproval\Notifications\DocumentApprovalRequestNotification;
use Illuminate\Support\Facades\Notification;

class SendDocumentApprovalNotificationAction
{
    public function execute(DocumentApproval $documentApproval): void
    {
        $users = $documentApproval->users;
        Notification::send($users, new DocumentApprovalRequestNotification($documentApproval));
    }
}
