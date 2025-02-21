<?php

namespace Modules\Folder\Data;

use Spatie\LaravelData\Data;
use Modules\Metadata\Data\MetadataResourceData;
use Modules\Metadata\Models\Metadata;

class FolderRequiredMetadataResource extends Data
{
    public function __construct(
        public int $metadata_id,
        public string $name,
        public string $description
    ) {}

    public static function fromModel(Metadata $metadata): self
    {
        return new self(
            metadata_id: $metadata->id,
            name: $metadata->name,
            description: "Fix this later"
        );
    }
}
