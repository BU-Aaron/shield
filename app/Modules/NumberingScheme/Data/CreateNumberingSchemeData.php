<?php

namespace Modules\NumberingScheme\Data;

use Spatie\LaravelData\Attributes\Validation\Uuid;
use Spatie\LaravelData\Data;

class CreateNumberingSchemeData extends Data
{
    public function __construct(
        #[Uuid()]
        public string $folder_item_id,

        public string $name,

        public string $prefix,

        public int $next_number,

        public string $reset_frequency,

        public bool $add_if_approved,
    ) {}
}
