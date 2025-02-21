<?php

namespace Modules\Folder\Data;

use Spatie\LaravelData\Data;
use Spatie\LaravelData\Attributes\Validation\Required;
use Spatie\LaravelData\Attributes\Validation\Uuid;

class UpdateFolderMetadataData extends Data
{
    public function __construct(
        #[Required]
        public int $metadata_id
    ) {}
}
