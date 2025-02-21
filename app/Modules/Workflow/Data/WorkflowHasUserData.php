<?php

namespace Modules\Workflow\Data;

use Spatie\LaravelData\Data;
use Spatie\LaravelData\Attributes\Validation\Uuid;
use Spatie\LaravelData\Attributes\Validation\Required;

class WorkflowHasUserData extends Data
{
    public function __construct(
        #[Required]
        public int $user_id,
    ) {}
}
