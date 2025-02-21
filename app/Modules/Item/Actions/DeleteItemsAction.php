<?php

namespace Modules\Item\Actions;

use Modules\Item\Models\Item;
use Modules\Item\Data\DeleteItemsData;

class DeleteItemsAction
{
    public function execute(DeleteItemsData $data): string
    {
        // Fetch the items to be deleted
        $items = Item::whereIn('id', $data->ids)->get();

        // Determine the redirect URL before deletion
        $redirectUrl = route('dashboard'); // Default redirect to dashboard

        if ($items->isNotEmpty()) {
            $firstItem = $items->first();
            if ($firstItem->parent_id) {
                // Assuming there's a named route 'folder.show' that displays a folder
                $redirectUrl = route('folder.show', ['folder' => $firstItem->parent_id]);
            }
        }

        // Iterate over each item and delete its children
        foreach ($items as $item) {
            $this->deleteWithChildren($item);
        }

        return $redirectUrl;
    }

    private function deleteWithChildren(Item $item): void
    {
        // Fetch child items
        $children = Item::where('parent_id', $item->id)->get();

        // Recursively delete each child
        foreach ($children as $child) {
            $this->deleteWithChildren($child);
        }

        // Soft delete the item
        $item->delete();
    }
}
