<?php

namespace App\Modules\Metadata\Data;

use Modules\Metadata\Models\Metadata;
use Spatie\LaravelData\Data;
use App\Modules\Metadata\Data\MetadataPredefinedValueData;

class MetadataResourceData extends Data
{
    public function __construct(
        public int $metadata_id,
        public string $name,
        public string $type,
        public array $predefined_values = [],
    ) {}

    public static function fromModel(Metadata $metadata): self
    {
        return new self(
            metadata_id: $metadata->id,
            name: $metadata->name,
            type: $metadata->type,
            predefined_values: $metadata->predefinedValues->map(fn($predefinedValue) => [
                'id' => $predefinedValue->id,
                'predefined_value' => $predefinedValue->predefined_value,
            ])->toArray(),
        );
    }
}
