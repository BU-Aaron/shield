<?php

namespace Modules\Folder\Actions;

use Illuminate\Support\Facades\Auth;
use Modules\Document\Models\Document;
use Modules\Folder\Data\UpdateFolderData;
use Modules\Folder\Models\Folder;

class UpdateFolderAction
{
    public function execute(Folder $folder, UpdateFolderData $data): Folder
    {
        $folder->update([
            'name' => $data->name,
            'description' => $data->description,
            'category' => $data->category,
        ]);

        $descendantIds = $folder->item->descendants()->pluck('id');

        // Update the category for any child folders
        Folder::whereIn('item_id', $descendantIds)
            ->update(['category' => $data->category]);

        // Update the category for any child documents
        Document::whereIn('item_id', $descendantIds)
            ->update(['category' => $data->category]);

        activity()
            ->performedOn($folder)
            ->causedBy(Auth::id())
            ->log("Folder updated");

        return $folder;
    }
}
