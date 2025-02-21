<?php

namespace Modules\Notification\Data;

use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Log;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Attributes\MapInputName;

class NotificationResource extends Data
{
    public function __construct(
        public ?string $id,
        public ?string $document_id,
        public ?string $document_approval_id,
        public ?string $message,
        public ?string $date
    ) {}

    public static function fromModel($notification): self
    {
        return new self(
            id: $notification->id,
            document_id: $notification->data['document_id'],
            document_approval_id: $notification->data['document_approval_id'],
            message: $notification->data['message'],
            date: $notification->created_at
        );
    }
}
