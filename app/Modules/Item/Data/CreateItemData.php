<?php

namespace Modules\Item\Data;

use Spatie\LaravelData\Data;
use Spatie\LaravelData\Attributes\Validation\Uuid;

class CreateItemData extends Data
{
    public function __construct(
        #[Uuid()]
        public ?string $parent_id = null,
    ) {}
}
