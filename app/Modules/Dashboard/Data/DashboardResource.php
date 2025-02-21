<?php

namespace Modules\Dashboard\Data;

use Spatie\LaravelData\Data;

class DashboardResource extends Data
{
    public function __construct(
        public int $number_of_review_pending,
        public int $number_of_review_accepted,
        public int $number_of_review_rejected,
        public int $number_of_approval_pending,
        public int $number_of_approval_accepted,
        public int $number_of_approval_rejected,
        public int $number_of_documents,
        public array $recently_uploaded_documents
    ) {}
}
