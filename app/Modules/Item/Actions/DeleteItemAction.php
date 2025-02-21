<?php

namespace Modules\Item\Actions;

use Modules\Item\Models\Item;

class DeleteItemAction
{
    public function execute(Item $item): void
    {
        $item->delete();
    }
}
