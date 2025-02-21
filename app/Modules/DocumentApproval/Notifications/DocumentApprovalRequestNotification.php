<?php

namespace Modules\DocumentApproval\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Modules\DocumentApproval\Models\DocumentApproval;

class DocumentApprovalRequestNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected DocumentApproval $documentApproval;

    public function __construct(DocumentApproval $documentApproval)
    {
        $this->documentApproval = $documentApproval;
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    // /**
    //  * Get the array representation of the notification for storage in the database.
    //  *
    //  * @param  mixed  $notifiable
    //  * @return array
    //  */
    // public function toDatabase($notifiable)
    // {
    //     return [
    //         'message' => 'There is an active ' . $this->documentApproval->type . ' workflow',
    //         'document_id' => $this->documentApproval->document->item_id,
    //         'document_approval_id' => $this->documentApproval->id,
    //         'created_at' => now(),
    //     ];
    // }

    public function toMail($notifiable)
    {
        $documentName = $this->documentApproval->document->name ?? 'Unnamed Document';

        return (new MailMessage)
            ->subject('New Document Approval Request')
            ->greeting('Hello!')
            ->line('You have a new document approval request for the document: ' . $documentName)
            ->action('View Document Approval', url('/document_approval/' . $this->documentApproval->id))
            ->line('Thank you for using our application!');
    }
}
