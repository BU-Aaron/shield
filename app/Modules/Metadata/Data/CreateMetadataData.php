<?php

namespace Modules\Metadata\Data;

use Spatie\LaravelData\Data;
use Spatie\LaravelData\Attributes\Validation\Required;
use Spatie\LaravelData\Attributes\Validation\StringType;
use Spatie\LaravelData\Attributes\Validation\Unique;
use Spatie\LaravelData\Attributes\Validation\In;

class CreateMetadataData extends Data
{
    public function __construct(
        #[Required, StringType, Unique('metadata', 'name')]
        public string $name,

        #[Required, StringType, In(['Text', 'Number', 'Yes/No'])]
        public string $type,

        public ?string $status = 'custom'
    ) {}
}
