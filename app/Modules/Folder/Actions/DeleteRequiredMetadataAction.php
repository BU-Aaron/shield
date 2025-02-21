<?php

namespace Modules\Folder\Actions;

use Modules\Folder\Models\Folder;
use Modules\Metadata\Models\Metadata;

class DeleteRequiredMetadataAction
{
    public function execute(Folder $folder, Metadata $metadata): void
    {
        $folder->requiredMetadata()->detach($metadata->id);
    }
}
