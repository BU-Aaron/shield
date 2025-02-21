<?php

namespace Modules\Item\Actions;

use Modules\Item\Models\Item;
use Modules\Item\Data\ItemAncestorsResourceData;
use Modules\Item\Data\ItemParentResourceData;
use Modules\Item\Data\MoveItemContentsResource;
use Modules\Workspace\Models\Workspace;
use Spatie\LaravelData\DataCollection;

class ShowMoveItemsAction
{
    public function execute(?Item $item): array
    {
        $itemContents = [];
        $itemAncestors = [];

        if ($item === null) {
            $itemContents = Item::whereNull('parent_id')->get();
        } else {
            $itemContents = $item->getChildren();
            $itemAncestors = $item->ancestorsWithSelf()->get()->load('workspace', 'folder');
        }

        return [
            'itemParent' => $item ? ItemParentResourceData::fromModel($item) : null,
            'itemAncestors' => $item ? ItemAncestorsResourceData::collect($itemAncestors, DataCollection::class) : null,
            'itemContents' => MoveItemContentsResource::collect($itemContents, DataCollection::class),
        ];
    }
}
