<?php

namespace Modules\Folder\Data;

use Spatie\LaravelData\Data;
use Modules\Folder\Models\Folder;
use Modules\Item\Models\Item;

class FolderLinksData extends Data
{
    public function __construct(
        public string $item_id,
        public string $name,
        public string $url
    ) {}

    public static function fromModel(Item $item): self
    {
        $url = sprintf('/folder/%s', $item->id);

        return new self(
            item_id: $item->id,
            name: $item->folder->name,
            url: $url
        );
    }
}
