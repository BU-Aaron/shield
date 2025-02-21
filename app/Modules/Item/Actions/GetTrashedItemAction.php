<?php

namespace App\Modules\Item\Actions;

use Modules\Item\Data\TrashedItemsResourceData;
use Modules\Item\Models\Item;
use Spatie\LaravelData\DataCollection;

class GetTrashedItemAction
{
    public function execute()
    {
        // Get all trashed items
        $trashedItems = Item::onlyTrashed()->get();

        // Filter out items that have a trashed parent and reindex the collection
        $filteredItems = $trashedItems->filter(function ($item) use ($trashedItems) {
            return !$trashedItems->contains('id', $item->parent_id);
        })->values(); // Reset the keys to be consecutive integers

        return [
            'trashedItems' => TrashedItemsResourceData::collect($filteredItems, DataCollection::class),
        ];
    }
}
