<?php

namespace Modules\Dashboard\Data;

use Modules\Document\Models\Document;
use Spatie\LaravelData\Data;

class RecentlyUploadedDocumentResource extends Data
{
    public function __construct(
        public string $id,
        public string $name,
        public ?string $category,
        public ?string $review_status,
        public ?string $approval_status,
        public string $date_uploaded,
        public string $mime
    ) {}
}
