<?php

namespace Modules\NumberingScheme\Actions;

use Modules\NumberingScheme\Data\UpdateNumberingSchemeData;
use Modules\NumberingScheme\Models\NumberingScheme;

class UpdateNumberingSchemeAction
{
    public function execute(NumberingScheme $numberingScheme, UpdateNumberingSchemeData $data): NumberingScheme
    {
        $numberingScheme->update($data->toArray());
        return $numberingScheme;
    }
}
