<?php

namespace Modules\Dashboard\Data;

use Spatie\LaravelData\Data;

class DashboardReportParametersData extends Data
{
    public function __construct(
        public ?string $document_status = null,
        public ?string $start_date = null,
        public ?string $end_date = null,
        public ?array $metadata_ids = null,
        public ?array $metadata_filters = null
    ) {}
}
