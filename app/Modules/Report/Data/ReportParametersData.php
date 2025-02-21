<?php

namespace Modules\Report\Data;

use Spatie\LaravelData\Data;
use Spatie\LaravelData\Attributes\Validation\Required;
use Spatie\LaravelData\Attributes\Validation\Uuid;

class ReportParametersData extends Data
{
    public function __construct(
        #[Required, Uuid]
        public string $folder_item_id
    ) {}
}
