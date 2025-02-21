<?php

namespace Modules\Archive\Actions;

use Illuminate\Support\Facades\Log;
use Modules\Item\Models\Item;

class UnarchiveItemsAction
{
    /**
     * Execute the unarchive action.
     *
     * @param array $ids
     * @return bool
     */
    public function execute(array $ids): bool
    {
        try {
            // Fetch the items to be unarchived
            $items = Item::whereIn('id', $ids)->get();

            foreach ($items as $item) {
                $this->unarchiveWithChildren($item);
            }

            return true;
        } catch (\Exception $e) {
            // Log the error or handle accordingly
            Log::error('UnarchiveItemsAction Error: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Recursively unarchive an item and its children.
     *
     * @param Item $item
     * @return void
     */
    private function unarchiveWithChildren(Item $item): void
    {
        // Unarchive the current item by setting archived_at to null
        $item->archived_at = null;
        $item->save();

        // Fetch child items
        $children = Item::where('parent_id', $item->id)->get();

        // Recursively unarchive each child
        foreach ($children as $child) {
            $this->unarchiveWithChildren($child);
        }
    }
}
