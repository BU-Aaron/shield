<?php

namespace App\Modules\Metadata\Data;

use Modules\Metadata\Models\MetadataHasPredefinedValue;
use Spatie\LaravelData\Data;

class MetadataPredefinedValueData extends Data
{
    public function __construct(
        public int $id,
        public string $predefined_value,
    ) {}

    public static function fromModel(MetadataHasPredefinedValue $value): self
    {
        return new self(
            id: $value->id,
            predefined_value: $value->predefined_value,
        );
    }
}
