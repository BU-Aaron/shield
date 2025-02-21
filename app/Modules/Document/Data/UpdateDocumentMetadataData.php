<?php

namespace Modules\Document\Data;

use Spatie\LaravelData\Data;
use Spatie\LaravelData\Attributes\Validation\Required;
use Spatie\LaravelData\Attributes\Validation\StringType;

class UpdateDocumentMetadataData extends Data
{
    public function __construct(
        #[Required, StringType]
        public string $value
    ) {}
}
