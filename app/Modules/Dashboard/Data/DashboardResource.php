<?php

namespace Modules\Dashboard\Data;

use Spatie\LaravelData\Data;

class DashboardResource extends Data
{
    public function __construct(
        public int $number_of_inv,
        public int $number_of_inq,
        public int $number_of_ui,
        public int $number_of_documents,
        public array $recently_uploaded_documents
    ) {}
}
