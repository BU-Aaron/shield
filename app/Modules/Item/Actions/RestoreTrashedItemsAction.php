<?php

namespace Modules\Item\Actions;

use Modules\Item\Models\Item;
use Modules\Item\Data\RestoreTrashedItemsData;

class RestoreTrashedItemsAction
{
    public function execute(RestoreTrashedItemsData $data): void
    {
        // Restore the parent items
        $parentItems = Item::withTrashed()->whereIn('id', $data->ids)->get();
        $parentItems->each->restore();

        // Restore child items of the restored parents
        foreach ($parentItems as $parentItem) {
            $this->restoreChildren($parentItem);
        }
    }

    private function restoreChildren(Item $parentItem): void
    {
        $childItems = Item::withTrashed()->where('parent_id', $parentItem->id)->get();
        $childItems->each->restore();

        // Recursively restore children of children
        foreach ($childItems as $childItem) {
            $this->restoreChildren($childItem);
        }
    }
}
