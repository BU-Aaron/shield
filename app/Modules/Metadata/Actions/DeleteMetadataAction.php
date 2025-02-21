<?php

namespace Modules\Metadata\Actions;

use Modules\Metadata\Models\Metadata;

class DeleteMetadataAction
{
    public function execute(Metadata $metadata): void
    {
        $metadata->delete();
    }
}
