<?php

namespace Modules\Item\Data;

use Spatie\LaravelData\Data;

class DeleteTrashedItemsData extends Data
{
    public function __construct(
        public array $ids,
    ) {}
}
