<?php

namespace Modules\Document\Actions;

use Illuminate\Support\Facades\Auth;
use Modules\Document\Models\Document;
use Modules\Item\Actions\DeleteItemAction;

class DeleteDocumentAction
{
    public function __construct(
        protected DeleteItemAction $deleteItemAction
    ) {}

    public function execute(Document $document): void
    {
        $this->deleteItemAction->execute($document->item);

        activity()
            ->performedOn($document)
            ->causedBy(Auth::id())
            ->log("Document deleted");
    }
}
