<?php

namespace Modules\Folder\Data;

use Spatie\LaravelData\Data;

class UpdateFolderData extends Data
{
    public function __construct(
        public string $name,
        public ?string $description = null,
        public ?string $category = null,
    ) {}
}
