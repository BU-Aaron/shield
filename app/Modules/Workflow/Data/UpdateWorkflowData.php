<?php

namespace Modules\Workflow\Data;

use Spatie\LaravelData\Attributes\Validation\In;
use Spatie\LaravelData\Attributes\Validation\Required;
use Spatie\LaravelData\Data;

class UpdateWorkflowData extends Data
{
    /**
     * @param WorkflowHasUserData[] $users
     */
    public function __construct(

        public ?string $resolution = null,

        #[Required(), In(['reviewal', 'approval'])]
        public string $type,

        #[Required]
        public array $users

        // #[Uuid()]
        // public ?string $destination = null,

        // public ?array $users_to_add,

        // public ?array $users_to_remove
    ) {}
}
