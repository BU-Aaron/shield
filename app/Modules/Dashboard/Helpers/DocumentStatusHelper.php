<?php

namespace Modules\Dashboard\Helpers;

class DocumentStatusHelper
{
    protected static $statusMap = [
        'reviewal_pending' => [
            'class' => 'Modules\Document\States\DocumentReviewalPending',
            'column' => 'review_status',
        ],
        'reviewal_accepted' => [
            'class' => 'Modules\Document\States\DocumentReviewalAccepted',
            'column' => 'review_status',
        ],
        'reviewal_rejected' => [
            'class' => 'Modules\Document\States\DocumentReviewalRejected',
            'column' => 'review_status',
        ],
        'approval_pending' => [
            'class' => 'Modules\Document\States\DocumentApprovalPending',
            'column' => 'approval_status',
        ],
        'approval_accepted' => [
            'class' => 'Modules\Document\States\DocumentApprovalAccepted',
            'column' => 'approval_status',
        ],
        'approval_rejected' => [
            'class' => 'Modules\Document\States\DocumentApprovalRejected',
            'column' => 'approval_status',
        ],
        // Add more statuses as needed
    ];

    /**
     * Get the status class based on the status key.
     *
     * @param string|null $statusKey
     * @return string|null
     */
    public static function getStatusClass(?string $statusKey): ?string
    {
        if ($statusKey && isset(self::$statusMap[$statusKey])) {
            return self::$statusMap[$statusKey]['class'];
        }

        return null;
    }

    /**
     * Get the status details based on the status key.
     *
     * @param string|null $statusKey
     * @return array|null
     */
    public static function getStatusDetails(?string $statusKey): ?array
    {
        if ($statusKey && isset(self::$statusMap[$statusKey])) {
            return self::$statusMap[$statusKey];
        }

        return null;
    }
}
