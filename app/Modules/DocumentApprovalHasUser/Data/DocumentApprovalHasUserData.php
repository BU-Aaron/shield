<?php

namespace Modules\DocumentApprovalHasUser\Data;

use Spatie\LaravelData\Data;
use Spatie\LaravelData\Attributes\Validation\Required;
use Spatie\LaravelData\Attributes\Validation\Nullable;
use Spatie\LaravelData\Attributes\Validation\StringType;

class DocumentApprovalHasUserData extends Data
{
    public function __construct(
        public ?int $user_id = null,

        #[Nullable, StringType]
        public ?string $comment = null,
    ) {}
}
