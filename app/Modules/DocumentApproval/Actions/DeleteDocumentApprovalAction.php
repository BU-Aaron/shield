<?php

namespace Modules\DocumentApproval\Actions;

use Illuminate\Support\Facades\Auth;
use Modules\DocumentApproval\Models\DocumentApproval;
use Modules\User\Models\User;
use Modules\Metadata\Models\Metadata;

class DeleteDocumentApprovalAction
{
    public function execute(DocumentApproval $documentApproval): void
    {
        $user = User::find(Auth::user()->id);

        // $user->notifications()->where('data->document_approval_id', $documentApproval->id)->delete();

        $document = $documentApproval->document;

        if ($documentApproval->type === 'reviewal') {
            $document->update([
                'review_status' => null,
            ]);

            $metadata = Metadata::where('name', 'Review Status')->first();
            if ($metadata) {
                $document->metadata()->detach($metadata->id);
            }
        } elseif ($documentApproval->type === 'approval') {
            $document->update([
                'approval_status' => null,
            ]);

            $metadata = Metadata::where('name', 'Approval Status')->first();
            if ($metadata) {
                $document->metadata()->detach($metadata->id);
            }
        }

        $documentApproval->delete();
    }
}
