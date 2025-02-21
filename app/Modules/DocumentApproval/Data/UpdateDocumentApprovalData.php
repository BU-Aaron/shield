<?php

namespace Modules\DocumentApproval\Data;

use Spatie\LaravelData\Data;
use Spatie\LaravelData\Attributes\Validation\In;
use Spatie\LaravelData\Attributes\Validation\Required;
use Modules\DocumentApprovalHasUser\Data\DocumentApprovalHasUserData;

class UpdateDocumentApprovalData extends Data
{
    /**
     * @param DocumentApprovalHasUserData[] $users
     */
    public function __construct(
        #[Required, In(['reviewal', 'approval'])]
        public string $type,

        public ?string $resolution = null,

        #[Required]
        public array $users
    ) {}
}
