<?php

namespace Modules\Item\Actions;

use Illuminate\Support\Facades\Auth;
use Modules\Item\Data\ItemAncestorsResourceData;
use Modules\Item\Data\ItemContentsResourceData;
use Modules\Item\Data\ItemParentResourceData;
use Modules\Item\Models\Item;
use Modules\User\Models\User;
use Spatie\LaravelData\DataCollection;

class GetItemDataAction
{
    public function execute(Item $item): array
    {
        $user = Auth::user();
        $user = User::find($user->id);

        if ($user && ($user->hasRole('admin') || $user->hasRole('viewer'))) {
            // If the user is an admin or viewer, retrieve all children with their folder and document relationships, excluding archived items
            $itemContentsQuery = $item->children()->whereNull('archived_at')->with(['folder', 'document']);
        } elseif ($user) {
            // If the user is authenticated but not an admin/viewer, retrieve only children shared with the user, excluding archived items
            $itemContentsQuery = $item->children()
                ->whereNull('archived_at')
                ->where(function ($query) use ($user) {
                    $query->whereHas('folder.userAccess', function ($q) use ($user) {
                        $q->where('user_id', $user->id);
                    })
                        ->orWhereHas('document.userAccess', function ($q) use ($user) {
                            $q->where('user_id', $user->id);
                        });
                })
                ->with(['folder', 'document']);
        } else {
            // If the user is not authenticated, set itemContents to an empty collection
            return [
                'itemParent' => ItemParentResourceData::fromModel($item),
                'itemAncestors' => ItemAncestorsResourceData::collect(collect(), DataCollection::class),
                'itemContents' => ItemContentsResourceData::collect(collect(), DataCollection::class),
            ];
        }

        // Execute the query to get the filtered item contents
        $itemContents = $itemContentsQuery->get();

        // Load ancestors with workspace and folder relationships
        $itemAncestors = $item->ancestorsWithSelf()->get()->load('workspace', 'folder');

        return [
            'itemParent' => ItemParentResourceData::fromModel($item),
            'itemAncestors' => ItemAncestorsResourceData::collect($itemAncestors, DataCollection::class),
            'itemContents' => ItemContentsResourceData::collect($itemContents, DataCollection::class),
        ];
    }
}
