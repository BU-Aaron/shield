<?php

namespace Modules\Item\Actions;

use Modules\Item\Data\CreateItemData;
use Modules\Item\Models\Item;

class CreateItemAction
{
    public function execute(CreateItemData $data): Item
    {
        return Item::create($data->toArray());
    }
}
