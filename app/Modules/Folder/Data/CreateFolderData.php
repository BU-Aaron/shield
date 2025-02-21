<?php

namespace Modules\Folder\Data;

use Spatie\LaravelData\Data;
use Spatie\LaravelData\Attributes\Validation\Uuid;

class CreateFolderData extends Data
{
    public function __construct(
        #[Uuid()]
        public string $parent_id,

        public string $name,

        #[Uuid()]
        public ?string $owned_by = null
    ) {}
}
