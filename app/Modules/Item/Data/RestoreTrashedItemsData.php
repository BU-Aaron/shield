<?php

namespace Modules\Item\Data;

use Spatie\LaravelData\Data;

class RestoreTrashedItemsData extends Data
{
    public function __construct(
        public array $ids,
    ) {}
}
