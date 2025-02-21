<?php

namespace Modules\Document\Data;

use Spatie\LaravelData\Data;
use Spatie\LaravelData\Attributes\Validation\Required;
use Spatie\LaravelData\Attributes\Validation\Exists;
use Spatie\LaravelData\Attributes\Validation\StringType;

class DocumentMetadataData extends Data
{
    public function __construct(
        #[Required, Exists('metadata', 'id')]
        public int $metadata_id,

        #[StringType]
        public ?string $value
    ) {}
}
