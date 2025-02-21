<?php

namespace Modules\Item\Data;

use Spatie\LaravelData\Data;
use Spatie\LaravelData\Attributes\Validation\ArrayType;
use Spatie\LaravelData\Attributes\Validation\BooleanType;
use Spatie\LaravelData\Attributes\Validation\Uuid;

class DownloadItemsData extends Data
{
    /**
     * Indicates whether to download all items.
     */
    public function __construct(
        #[Uuid]
        public ?string $parent_id,

        public array $ids = [],

        #[BooleanType]
        public bool $all = false
    ) {}
}
