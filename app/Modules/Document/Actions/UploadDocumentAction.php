<?php

namespace Modules\Document\Actions;

use Modules\Document\Data\UploadDocumentData;
use Modules\Document\Models\Document;
use Modules\DocumentApproval\Actions\CreateDocumentApprovalFromWorkflowAction;
use Modules\Item\Actions\CreateItemAction;
use Modules\Item\Data\CreateItemData;
use Modules\NumberingScheme\Actions\ApplyDocumentNumberAction;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class UploadDocumentAction
{
    public function __construct(
        protected CreateItemAction $createItemAction,
        protected CreateDocumentApprovalFromWorkflowAction $createDocumentApprovalFromWorkflowAction,
        protected ApplyDocumentNumberAction $applyDocumentNumberAction,
    ) {}

    public function execute(UploadDocumentData $data): array
    {
        $documents = [];

        foreach ($data->files as $fileData) {
            $uploadedFile = $fileData->getUploadedFile();

            // Generate a unique name within the folder
            $originalName = pathinfo($uploadedFile->getClientOriginalName(), PATHINFO_FILENAME);
            $extension = $uploadedFile->getClientOriginalExtension();
            $newName = $originalName . '.' . $extension;
            $counter = 1;

            while (
                Document::where('name', $newName)
                ->whereHas('item', function ($query) use ($data) {
                    $query->where('parent_id', $data->parent_id);
                })
                ->exists()
            ) {
                $counter++;
                $newName = $originalName . " ({$counter})." . $extension;
            }

            // Create item for the document
            $item = $this->createItemAction->execute(
                CreateItemData::from([
                    'parent_id' => $data->parent_id,
                ])
            );

            // Store the file with the unique name
            $filePath = $uploadedFile->storeAs('documents', $newName, 'public');

            // Create the document
            $document = $item->document()->create([
                'name' => $newName,
                'owned_by' => $data->owned_by ?? Auth::id(),
                'mime' => $uploadedFile->getMimeType(),
                'size' => $uploadedFile->getSize(),
                'file_path' => $filePath,
            ]);

            // Create the initial version
            $document->versions()->create([
                'file_path' => $filePath,
                'name' => $newName,
                'current' => true,
                'mime' => $uploadedFile->getMimeType(),
                'size' => $uploadedFile->getSize(),
            ]);

            // Log activity
            activity()
                ->performedOn($document)
                ->causedBy(Auth::id())
                ->log("Document '{$document->name}' uploaded");

            // Apply numbering scheme and create approval workflow
            $this->applyDocumentNumberAction->execute($document);
            $this->createDocumentApprovalFromWorkflowAction->execute($document);

            // Inherit sharing permissions from the parent folder
            if ($data->parent_id) {
                // Retrieve the parent item
                $parentItem = $item->parent;

                if ($parentItem && $parentItem->folder) {
                    // Get the parent folder's sharing settings
                    $parentFolder = $parentItem->folder;
                    $parentShares = $parentFolder->userAccess()->get();

                    // Prepare user attachments for the new document
                    $userAttachments = [];
                    foreach ($parentShares as $share) {
                        $userAttachments[$share->id] = ['role' => $share->pivot->role];
                    }

                    // Attach the same users and roles to the new document
                    if (!empty($userAttachments)) {
                        $document->userAccess()->sync($userAttachments);
                    }
                }
            }

            $documents[] = $document;
        }

        return $documents;
    }
}
