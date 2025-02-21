<?php

namespace Modules\Workflow\Data;

use Spatie\LaravelData\Attributes\Validation\In;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Attributes\Validation\Uuid;
use Spatie\LaravelData\Attributes\Validation\Required;

class CreateWorkflowData extends Data
{
    /**
     * @param WorkflowHasUserData[] $users
     */
    public function __construct(
        #[Required, Uuid()]
        public string $folder_item_id,

        public ?string $resolution = null,

        #[Required, In(['reviewal', 'approval'])]
        public string $type,

        #[Uuid()]
        public ?string $destination = null,

        #[Required]
        public array $users
    ) {}
}
