<?php

namespace Modules\Document\Actions;

use Illuminate\Support\Facades\Auth;
use Modules\Document\Actions\UpdateDocumentMetadataAction;
use Modules\Document\Data\UpdateDocumentData;
use Modules\Document\Models\Document;
use Modules\Metadata\Models\Metadata;

class UpdateDocumentAction
{
    public function __construct(
        protected UpdateDocumentMetadataAction $updateDocumentMetadataAction,
        protected AttachRelatedDocumentAction $attachRelatedDocumentAction,
    ) {}

    public function execute(Document $document, UpdateDocumentData $data): Document
    {
        $document->update([
            'name' => $data->name,
            'document_number' => $data->document_number,
            'description' => $data->description,
            'due_date' => $data->due_date,
        ]);

        $this->updateDocumentMetadataAction->execute($document, $data);
        $this->attachRelatedDocumentAction->execute($document, $data->related_documents);

        activity()
            ->performedOn($document)
            ->causedBy(Auth::id())
            ->log("Document updated");

        return $document;
    }
}
