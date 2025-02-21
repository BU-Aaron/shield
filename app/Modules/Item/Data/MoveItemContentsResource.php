<?php

namespace Modules\Item\Data;

use Spatie\LaravelData\Resource;
use Modules\Item\Models\Item;

class MoveItemContentsResource extends Resource
{
    public function __construct(
        public string $item_id,
        public ?string $name,
        public ?string $type,
        public ?string $mime,
    ) {}

    public static function fromModel(Item $item): self
    {
        return new self(
            item_id: $item->id,
            name: $item->workspace ?? $item->folder->name ?? $item->document->name ?? null,
            type: $item->workspace ? 'workspace' : ($item->document ? 'document' : 'folder'),
            mime: $item->document->mime ?? null
        );
    }
}
