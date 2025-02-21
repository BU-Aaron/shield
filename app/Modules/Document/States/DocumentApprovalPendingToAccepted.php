<?php

namespace Modules\Document\States;

use Modules\Document\Models\Document;
use Modules\DocumentApproval\Actions\RecalculateDocumentStateAction;
use Modules\DocumentApproval\States\DocumentApprovalAccepted;
use Modules\Document\States\DocumentApprovalAccepted as StatesDocumentApprovalAccepted;
use Spatie\ModelStates\Transition;
use Modules\Folder\Models\Folder;
use Modules\NumberingScheme\Actions\ApplyDocumentNumberAction;

class DocumentApprovalPendingToAccepted extends Transition
{
    public function __construct(
        private Document $document,
    ) {}

    public function handle(
        ApplyDocumentNumberAction $applyDocumentNumberAction,
        RecalculateDocumentStateAction $recalculateDocumentStateAction,
    ): Document {
        $folder = Folder::find($this->document->item->parent_id);

        // $this->document->documentApproval->overall_state->transitionTo(DocumentApprovalAccepted::class);
        $this->document->approval_status = new StatesDocumentApprovalAccepted($this->document);
        $this->document->save();

        $this->document->versions()->where('current', true)->update([
            'approval_status' => new StatesDocumentApprovalAccepted($this->document),
        ]);

        // dd($folder->numberingScheme->add_if_approved);

        if ($folder && $folder->numberingScheme && $folder->numberingScheme->add_if_approved) {
            $applyDocumentNumberAction->execute($this->document);
        }


        return $this->document;
    }
}
