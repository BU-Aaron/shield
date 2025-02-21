<?php

namespace Modules\Folder\Actions;

use Modules\Folder\Data\SelectMetadataColumnData;
use Modules\Folder\Models\Folder;

class SelectMetadataColumnAction
{
    public function execute(Folder $folder, SelectMetadataColumnData $data): void
    {
        // Sync the metadata columns
        $folder->metadataColumns()->sync($data->metadata_ids);
    }
}
