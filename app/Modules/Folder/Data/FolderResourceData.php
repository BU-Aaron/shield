<?php

namespace Modules\Folder\Data;

use Spatie\LaravelData\Resource;

class FolderResourceData extends Resource
{
    public function __construct(
        public string $item_id,
        public string $name,
        public string $created_at,
        public string $updated_at,

        // TODO: Maybe add metadata and related items here?
    ) {}
}
