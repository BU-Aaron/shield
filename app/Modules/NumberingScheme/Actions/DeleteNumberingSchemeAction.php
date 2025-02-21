<?php

namespace Modules\NumberingScheme\Actions;

use Modules\NumberingScheme\Models\NumberingScheme;

class DeleteNumberingSchemeAction
{
    public function execute(NumberingScheme $numberingScheme): void
    {
        $numberingScheme->delete();
    }
}
