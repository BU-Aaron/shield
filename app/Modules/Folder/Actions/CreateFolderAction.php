<?php

namespace Modules\Folder\Actions;

use Modules\Folder\Data\CreateFolderData;
use Modules\Folder\Models\Folder;
use Modules\Item\Actions\CreateItemAction;
use Modules\Item\Data\CreateItemData;
use Illuminate\Support\Facades\Auth;

class CreateFolderAction
{
    public function __construct(
        protected CreateItemAction $createItemAction
    ) {}

    public function execute(CreateFolderData $data): Folder
    {
        // Create the item associated with the folder
        $item = $this->createItemAction->execute(
            CreateItemData::from([
                'parent_id' => $data->parent_id,
            ])
        );

        // Create the folder
        $folder = $item->folder()->create([
            'name' => $data->name,
            'owned_by' => $data->owned_by ?? Auth::id(),
        ]);

        // Log activity
        activity()
            ->performedOn($folder)
            ->causedBy(Auth::id())
            ->log("Folder '{$folder->name}' created");

        // Inherit sharing permissions from the parent folder
        if ($data->parent_id) {
            // Retrieve the parent item
            $parentItem = $item->parent;

            if ($parentItem && $parentItem->folder) {
                // Get the parent folder's sharing settings
                $parentFolder = $parentItem->folder;
                $parentShares = $parentFolder->userAccess()->get();

                // Prepare user attachments for the new folder
                $userAttachments = [];
                foreach ($parentShares as $share) {
                    $userAttachments[$share->id] = ['role' => $share->pivot->role];
                }

                // Attach the same users and roles to the new folder
                if (!empty($userAttachments)) {
                    $folder->userAccess()->sync($userAttachments);
                }
            }
        }

        return $folder;
    }
}
