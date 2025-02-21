<?php

namespace Modules\Folder\Data;

use Spatie\LaravelData\Data;
use Spatie\LaravelData\Attributes\Validation\Required;

class SelectMetadataColumnData extends Data
{
    public function __construct(
        public ?array $metadata_ids = []
    ) {}
}
