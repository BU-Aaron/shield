<?php

namespace Modules\DocumentApproval\States;

use Modules\Document\Models\Document;
use Modules\DocumentApproval\Actions\RecalculateDocumentStateAction;
use Spatie\ModelStates\Transition;
use Modules\DocumentApproval\Models\DocumentApproval;
use Modules\Folder\Models\Folder;
use Modules\NumberingScheme\Actions\ApplyDocumentNumberAction;

class DocumentApprovalPendingToAccepted extends Transition
{
    public function __construct(
        private DocumentApproval $documentApproval,
    ) {}

    public function handle(
        ApplyDocumentNumberAction $applyDocumentNumberAction,
    ): DocumentApproval {
        $folder = Folder::find($this->documentApproval->document->item->parent_id);

        if ($folder->numberingScheme->add_if_approved) {
            $applyDocumentNumberAction->execute($this->documentApproval->document);
        }

        return $this->documentApproval;
    }
}
