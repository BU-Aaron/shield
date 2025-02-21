<?php

namespace Modules\Dashboard\Data;

use Spatie\LaravelData\Data;

class SelectDashboardMetadataColumnData extends Data
{
    public function __construct(
        public ?array $metadata_ids = []
    ) {}
}
