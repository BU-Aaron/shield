<?php

namespace Modules\Folder\Actions;

use Illuminate\Support\Facades\Auth;
use Modules\Folder\Data\UpdateFolderData;
use Modules\Folder\Models\Folder;

class UpdateFolderAction
{
    public function execute(Folder $folder, UpdateFolderData $data): Folder
    {
        $folder->update([
            'name' => $data->name,
            'description' => $data->description,
        ]);

        activity()
            ->performedOn($folder)
            ->causedBy(Auth::id())
            ->log("Folder updated");

        return $folder;
    }
}
