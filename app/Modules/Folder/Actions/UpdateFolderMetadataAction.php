<?php

namespace Modules\Folder\Actions;

use Modules\Folder\Data\UpdateFolderMetadataData;
use Modules\Folder\Models\Folder;

class UpdateFolderMetadataAction
{
    public function execute(Folder $folder, UpdateFolderMetadataData $data): void
    {
        $folder->requiredMetadata()->attach($data->metadata_id);
    }
}
