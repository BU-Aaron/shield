<?php

namespace Modules\Item\Actions;

use Modules\Item\Models\Item;
use Modules\Item\Data\DeleteTrashedItemsData;

class DeleteTrashedItemsAction
{
    public function execute(DeleteTrashedItemsData $data): void
    {
        Item::whereIn('id', $data->ids)->forceDelete();
    }
}
