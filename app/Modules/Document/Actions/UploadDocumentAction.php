<?php

namespace Modules\Document\Actions;

use Modules\Document\Data\UploadDocumentData;
use Modules\Document\Models\Document;
use Modules\DocumentApproval\Actions\CreateDocumentApprovalFromWorkflowAction;
use Modules\Item\Actions\CreateItemAction;
use Modules\Item\Data\CreateItemData;
use Modules\NumberingScheme\Actions\ApplyDocumentNumberAction;
use Modules\Folder\Actions\CreateFolderAction;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class UploadDocumentAction
{
    public function __construct(
        protected CreateItemAction $createItemAction,
        protected CreateDocumentApprovalFromWorkflowAction $createDocumentApprovalFromWorkflowAction,
        protected ApplyDocumentNumberAction $applyDocumentNumberAction,
        protected CreateFolderAction $createFolderAction
    ) {}

    public function execute(UploadDocumentData $data): array
    {
        $documents = [];

        // Group files by folder path if available.
        $groupedFiles = [];
        foreach ($data->files as $fileData) {
            // If relativePath is set, use its directory.
            $relativePath = property_exists($fileData, 'relativePath') ? $fileData->relativePath : '';
            $groupKey = '';
            if (!empty($relativePath)) {
                $dirname = pathinfo($relativePath, PATHINFO_DIRNAME);
                if ($dirname !== '.' && $dirname !== '') {
                    $groupKey = $dirname;
                }
            }
            $groupedFiles[$groupKey][] = $fileData;
        }

        // Process each file group.
        foreach ($groupedFiles as $folderPath => $filesGroup) {
            $currentParentId = $data->parent_id;

            // If there is a folder path then create a folder for these files.
            if ($folderPath !== '') {
                // Use the last segment of the folder path as the folder name.
                $folderName = basename($folderPath);
                $folderData = \Modules\Folder\Data\CreateFolderData::from([
                    'parent_id' => $data->parent_id,
                    'name'      => $folderName,
                    'owned_by'  => $data->owned_by,
                ]);
                $folder = $this->createFolderAction->execute($folderData);
                $currentParentId = $folder->item_id;
            }

            // Now upload each file in the group.
            foreach ($filesGroup as $fileData) {
                $uploadedFile = $fileData->file;

                // Generate a unique name within the (possibly new) folder.
                $originalName = pathinfo($uploadedFile->getClientOriginalName(), PATHINFO_FILENAME);
                $extension = $uploadedFile->getClientOriginalExtension();
                $newName = $originalName . '.' . $extension;
                $counter = 1;

                while (
                    Document::where('name', $newName)
                    ->whereHas('item', function ($query) use ($currentParentId) {
                        $query->where('parent_id', $currentParentId);
                    })
                    ->exists()
                ) {
                    $counter++;
                    $newName = $originalName . " ({$counter})." . $extension;
                }

                // Create an item for the document.
                $item = $this->createItemAction->execute(
                    CreateItemData::from([
                        'parent_id' => $currentParentId,
                    ])
                );

                // Store the file with the unique name.
                $filePath = $uploadedFile->storeAs('documents', $newName, 'public');

                // Create the document.
                $document = $item->document()->create([
                    'name'     => $newName,
                    'owned_by' => $data->owned_by ?? Auth::id(),
                    'mime'     => $uploadedFile->getMimeType(),
                    'size'     => $uploadedFile->getSize(),
                    'file_path' => $filePath,
                ]);

                // Create the initial version.
                $document->versions()->create([
                    'file_path' => $filePath,
                    'name'      => $newName,
                    'current'   => true,
                    'mime'      => $uploadedFile->getMimeType(),
                    'size'      => $uploadedFile->getSize(),
                ]);

                // Log activity.
                activity()
                    ->performedOn($document)
                    ->causedBy(Auth::id())
                    ->log("Document '{$document->name}' uploaded");

                // Apply numbering scheme and create approval workflow.
                $this->applyDocumentNumberAction->execute($document);
                $this->createDocumentApprovalFromWorkflowAction->execute($document);

                // Inherit sharing permissions from the parent folder.
                $parentItem = $item->parent;
                if ($parentItem && $parentItem->folder) {
                    $parentFolder = $parentItem->folder;
                    $parentShares = $parentFolder->userAccess()->get();
                    $userAttachments = [];
                    foreach ($parentShares as $share) {
                        $userAttachments[$share->id] = ['role' => $share->pivot->role];
                    }
                    if (!empty($userAttachments)) {
                        $document->userAccess()->sync($userAttachments);
                    }
                }

                $documents[] = $document;
            }
        }

        return $documents;
    }
}
