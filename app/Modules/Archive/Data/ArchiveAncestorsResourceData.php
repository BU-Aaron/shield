<?php

namespace Modules\Archive\Data;

use Modules\Item\Models\Item;
use Spatie\LaravelData\Resource;

class ArchiveAncestorsResourceData extends Resource
{
    public function __construct(
        public string $id,
        public int $depth,
        public string $name,
        public string $url
    ) {}

    public static function fromModel(Item $item): self
    {
        $type = self::getType($item);
        $url = sprintf('/%s/%s', $type, $item->id);

        return new self(
            id: $item->id,
            depth: $item->depth,
            name: $item->workspace->name ?? $item->folder->name ?? $item->document->name ?? 'Unknown',
            url: $url
        );
    }

    private static function getType(Item $item): string
    {
        if ($item->archived_at) {
            return 'archive';
        } elseif ($item->workspace) {
            return 'workspace';
        } elseif ($item->folder) {
            return 'folder';
        } elseif ($item->document) {
            return 'document';
        }

        return 'unknown';
    }
}
