<?php

namespace Modules\Dashboard\Data;

use Modules\Metadata\Models\Metadata;
use Spatie\LaravelData\Data;

class DashboardMetadataResourceData extends Data
{
    public function __construct(
        public int $metadata_id,
        public string $name,
        public string $type,
    ) {}

    public static function fromModel(Metadata $metadata): self
    {
        return new self(
            metadata_id: $metadata->id,
            name: $metadata->name,
            type: $metadata->type,
        );
    }
}
