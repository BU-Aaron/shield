<?php

namespace Modules\Document\Controllers;

use Modules\Common\Controllers\Controller;
use Modules\Document\Models\Document;
use Modules\Document\Actions\AttachDocumentMetadataAction;
use Modules\Document\Actions\DetachDocumentMetadataAction;
use Modules\Document\Actions\UpdateDocumentMetadataAction;
use Modules\Document\Data\DocumentMetadataData;
use Modules\Document\Data\UpdateDocumentMetadataData;
use Modules\Metadata\Models\Metadata;
use Illuminate\Http\JsonResponse;

class DocumentMetadataController extends Controller
{
    public function __construct(
        protected AttachDocumentMetadataAction $attachDocumentMetadataAction,
        // protected UpdateDocumentMetadataAction $updateDocumentMetadataAction,
        protected DetachDocumentMetadataAction $detachDocumentMetadataAction
    ) {}

    /**
     * Attach metadata to a document.
     */
    public function attach(DocumentMetadataData $data, Document $document): JsonResponse
    {
        // $this->attachDocumentMetadataAction->execute($document, $data);

        return response()->json(['message' => 'Data requirements changed.'], 200);
    }

    /**
     * Update metadata value for a document.
     */
    public function update(UpdateDocumentMetadataData $data, Document $document, Metadata $metadata): JsonResponse
    {
        // $this->updateDocumentMetadataAction->execute($document, $metadata, $data);

        return response()->json(['message' => 'Data requirements changed.'], 200);
    }

    /**
     * Detach metadata from a document.
     */
    public function detach(Document $document, Metadata $metadata): JsonResponse
    {
        $this->detachDocumentMetadataAction->execute($document, $metadata);

        return response()->json(['message' => 'Metadata detached successfully.'], 200);
    }
}
