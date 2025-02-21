<?php

namespace Modules\Metadata\Actions;

use Modules\Metadata\Data\CreateMetadataData;
use Modules\Metadata\Models\Metadata;

class CreateMetadataAction
{
    public function execute(CreateMetadataData $data): Metadata
    {
        return Metadata::create($data->toArray());
    }
}
