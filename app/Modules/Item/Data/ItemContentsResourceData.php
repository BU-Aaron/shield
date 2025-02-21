<?php

namespace Modules\Item\Data;

use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
use Spatie\LaravelData\Resource;
use Modules\Item\Models\Item;

class ItemContentsResourceData extends Resource
{
    public function __construct(
        public string $id,
        public ?string $owned_by,
        public ?string $name,
        public ?string $mime,
        public ?string $size,
        public ?string $type,
        public ?string $document_number,
        public ?string $review_status,
        public ?string $approval_status,
        public ?string $description,
        public ?string $updated_at,
        public ?string $due_in,
        public ?string $file_path,
        public ?bool $missing_required_metadata = false, // TODO: make logic to check if the document is missing required metadata
        public ?array $metadata = null,
        public ?string $archived_at = null,
    ) {}

    public static function fromModel(Item $item): self
    {
        return new self(
            id: $item->id,
            owned_by: $item->folder->owned_by ?? null,
            name: $item->folder->name ?? $item->document->name ?? null,
            mime: $item->document->mime ?? null,
            size: $item->document->size ?? null,
            type: $item->document ? 'document' : 'folder',
            document_number: $item->document->document_number ?? null,
            review_status: $item->document && $item->document->review_status ? $item->document->review_status->label() : null,
            approval_status: $item->document && $item->document->approval_status ? $item->document->approval_status->label() : null,
            description: $item->document->description ?? null,
            updated_at: $item->document->updated_at ?? null,
            due_in: $item->document?->due_date ?? null,
            file_path: $item->document->file_path ?? null,
            metadata: $item->document ? $item->document->metadata()->get()->map(fn($metadata) => [
                'metadata_id' => $metadata->id,
                'name' => $metadata->name,
                'value' => $metadata->pivot->value,
            ])->toArray() : null,
            archived_at: $item->archived_at ? Carbon::parse($item->archived_at)->format('Y-m-d') : null,
        );
    }
}
