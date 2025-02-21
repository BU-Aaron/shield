<?php

namespace Modules\NumberingScheme\Actions;

use Modules\Document\Models\Document;
use Modules\Document\States\DocumentApprovalAccepted;
use Modules\Folder\Models\Folder;
use Modules\Metadata\Models\Metadata;
use Modules\NumberingScheme\Actions\GenerateDocumentNumberAction;

class ApplyDocumentNumberAction
{
    public function __construct(
        protected GenerateDocumentNumberAction $generateDocumentNumberAction
    ) {}

    public function execute(Document $document): void
    {
        $folder = Folder::find($document->item->parent_id);

        if ($folder) {
            $numberingScheme = $folder->numberingScheme;

            if ($numberingScheme && (!$numberingScheme->add_if_approved || $document->approval_status == DocumentApprovalAccepted::class)) {
                $documentNumber = $this->generateDocumentNumberAction->execute($numberingScheme);

                $document->update([
                    'document_number' => $documentNumber,
                ]);

                $metadata = Metadata::where('name', 'Document Number')->first();

                $document->metadata()->attach($metadata->id, [
                    'value' => $documentNumber,
                ]);
            }
        }
    }
}
