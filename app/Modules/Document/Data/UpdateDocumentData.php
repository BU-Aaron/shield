<?php

namespace Modules\Document\Data;

use Spatie\LaravelData\Attributes\Validation\Required;
use Spatie\LaravelData\Data;

class UpdateDocumentData extends Data
{
    /**
     * @param DocumentMetadataData[] $update_metadata
     * @param DocumentMetadataData[] $delete_metadata
     */
    public function __construct(
        public string $name,

        public ?string $document_number,

        public ?string $description,

        public ?string $due_date,

        public array $update_metadata,

        public ?array $delete_metadata,

        public ?array $related_documents,
    ) {}
}
