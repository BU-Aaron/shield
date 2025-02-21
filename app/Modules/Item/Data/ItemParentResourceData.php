<?php

namespace Modules\Item\Data;

use Illuminate\Support\Facades\Log;
use Spatie\LaravelData\Data;
use Modules\Item\Models\Item;

class ItemParentResourceData extends Data
{
    public function __construct(
        public string $item_id,
        public ?string $parent_id,
        public string $name,
        public ?string $description = null,
        public string $owned_by,
        public ?string $numbering_scheme_id = null,
        public ?string $workflow_id = null,
        public ?bool $is_shared = null,
        public ?array $required_metadata = null,
        public ?array $metadata_columns = null
    ) {}

    public static function fromModel(Item $item): self
    {
        $item->load('folder.userAccess');

        // dd($item->folder->description);

        return new self(
            item_id: $item->id,
            parent_id: $item->parent_id ?? null,
            name: $item->workspace->name ?? $item->folder->name ?? '',
            description: $item->folder->description ?? null,
            owned_by: $item->workspace->owned_by ?? $item->folder->owned_by ?? '',
            numbering_scheme_id: $item->folder->numberingScheme->id ?? null,
            workflow_id: $item->folder->workflow->id ?? null,
            is_shared: $item->folder->userAccess->isNotEmpty(),
            required_metadata: $item->workspace ? [] : ($item->folder->requiredMetadata()->get()->toArray() ?? []),
            metadata_columns: $item->workspace ? [] : ($item->folder->metadataColumns()->get()->map(fn($metadata) => [
                'metadata_id' => $metadata->id,
                'name' => $metadata->name,
            ])->toArray() ?? [])
        );
    }
}
