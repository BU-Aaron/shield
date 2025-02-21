<?php

namespace Modules\Item\Data;

use Spatie\LaravelData\Attributes\Validation\ArrayType;
use Spatie\LaravelData\Attributes\Validation\Uuid;
use Spatie\LaravelData\Data;

class DeleteItemsData extends Data
{
    public function __construct(
        public array $ids,
    ) {}
}
