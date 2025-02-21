<?php

namespace Modules\Metadata\Data;

use Spatie\LaravelData\Data;
use Spatie\LaravelData\Attributes\Validation\Required;
use Spatie\LaravelData\Attributes\Validation\StringType;
use Spatie\LaravelData\Attributes\Validation\Unique;
use Spatie\LaravelData\Attributes\Validation\In;
use Spatie\LaravelData\Attributes\Validation\Sometimes;

class UpdateMetadataData extends Data
{
    public function __construct(
        #[Sometimes, Required, StringType]
        public ?string $name = null,

        #[Sometimes, Required, StringType, In(['Text', 'Yes/No', 'Number'])]
        public ?string $type = null,

        public ?array $predefined_values = [],
    ) {}
}
