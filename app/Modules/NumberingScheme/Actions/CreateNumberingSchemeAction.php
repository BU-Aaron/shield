<?php

namespace Modules\NumberingScheme\Actions;

use Modules\NumberingScheme\Data\CreateNumberingSchemeData;
use Modules\NumberingScheme\Models\NumberingScheme;

class CreateNumberingSchemeAction
{
    public function execute(CreateNumberingSchemeData $data): NumberingScheme
    {
        return NumberingScheme::create($data->toArray());
    }
}
