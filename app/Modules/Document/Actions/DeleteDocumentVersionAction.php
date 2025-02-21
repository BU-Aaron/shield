<?php

namespace Modules\Document\Actions;

use Modules\Document\Models\DocumentHasVersion;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class DeleteDocumentVersionAction
{
    public function execute(string $versionId): void
    {
        $version = DocumentHasVersion::findOrFail($versionId);
        $document = $version->document;

        // Prevent deletion of the current version
        if ($version->current) {
            throw new \Exception("Cannot delete the current version of the document.");
        }

        // Delete the file from storage
        Storage::disk('public')->delete($version->file_path);

        // Log activity before deletion
        activity()
            ->performedOn($version)
            ->causedBy(Auth::id())
            ->log("Deleted version {$version->id} for document {$document->name}");

        // Delete the version record
        $version->delete();
    }
}
