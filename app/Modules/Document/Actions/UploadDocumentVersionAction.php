<?php

namespace Modules\Document\Actions;

use Illuminate\Support\Facades\Auth;
use Modules\Document\Data\UploadDocumentVersionData;
use Modules\Document\Models\Document;
use Modules\Document\Models\DocumentHasVersion;
use Illuminate\Support\Facades\Storage;
use Modules\NumberingScheme\Actions\ApplyDocumentNumberAction;

class UploadDocumentVersionAction
{
    public function __construct(
        protected ApplyDocumentNumberAction $applyDocumentNumberAction,
    ) {}

    public function execute(UploadDocumentVersionData $data): DocumentHasVersion
    {
        $document = Document::findOrFail($data->document_item_id);

        // Store the new version file
        $filePath = $data->file->store('document_versions', 'public');

        // Set all existing versions to not current
        $document->versions()->update(['current' => false]);

        // Create the new version
        $version = $document->versions()->create([
            'file_path' => $filePath,
            'name' => $data->file->getClientOriginalName(),
            'current' => true,
            'mime' => $data->file->getMimeType(),
            'size' => $data->file->getSize(),
        ]);

        $document->update([
            'name' => $data->file->getClientOriginalName(),
            'updated_at' => now(),
            'mime' => $data->file->getMimeType(),
            'size' => $data->file->getSize(),
            'review_status' => null,
            'approval_status' => null,
        ]);

        // Log activity
        activity()
            ->performedOn($document)
            ->causedBy(Auth::id())
            ->log("Uploaded new version for document {$document->name}");

        $this->applyDocumentNumberAction->execute($document);

        return $version;
    }
}
