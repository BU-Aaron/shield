<?php

namespace Modules\Item\Data;

use Spatie\LaravelData\Data;
use Spatie\LaravelData\Attributes\Validation\Required;
use Spatie\LaravelData\Attributes\Validation\ArrayType;
use Spatie\LaravelData\Attributes\Validation\Uuid;

class ArchiveItemsData extends Data
{
    #[Required, ArrayType]
    public array $ids;

    public function __construct(array $ids)
    {
        $this->ids = $ids;
    }
}
