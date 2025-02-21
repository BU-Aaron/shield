<?php

namespace Modules\Document\Actions;

use Modules\Document\Models\DocumentHasVersion;
use Illuminate\Support\Facades\Auth;

class RestoreDocumentVersionAction
{
    public function execute(string $versionId): void
    {
        $version = DocumentHasVersion::findOrFail($versionId);
        $document = $version->document;

        // Set all versions to not current
        $document->versions()->update(['current' => false]);

        // Set the selected version as current
        $version->update(['current' => true]);

        $document->update([
            'name' => $version->name,
            'updated_at' => now(),
            'mime' => $version->mime,
            'size' => $version->size,
            'review_status' => $version->review_status,
            'approval_status' => $version->approval_status,
        ]);

        // Log activity
        activity()
            ->performedOn($document)
            ->causedBy(Auth::id())
            ->log("Restored version {$version->id} for document {$document->name}");
    }
}
