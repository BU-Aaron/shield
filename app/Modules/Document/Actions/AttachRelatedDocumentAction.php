<?php

namespace Modules\Document\Actions;

use Modules\Document\Models\Document;

class AttachRelatedDocumentAction
{
    public function execute(Document $document, array $relatedDocuments): void
    {
        $relatedDocumentIds = collect($relatedDocuments)->pluck('item_id');

        // Map each item_id to a related_document_id
        $formattedRelatedDocuments = $relatedDocumentIds->map(function ($itemId) {
            return [
                'related_document_id' => $itemId,
            ];
        });

        // Delete first all related documents
        $document->relatedDocuments()->detach();

        // Attaching related documents (assuming a relationship exists)
        $document->relatedDocuments()->syncWithoutDetaching($formattedRelatedDocuments->pluck('related_document_id'));

        // Also attach the inverse relationship
        foreach ($relatedDocuments as $relatedDocument) {
            $relatedDocumentModel = Document::find($relatedDocument['item_id']);
            $relatedDocumentModel->relatedDocuments()->syncWithoutDetaching([$document->item_id]);
        }
    }
}
