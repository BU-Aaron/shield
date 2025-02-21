<?php

namespace Modules\DocumentApproval\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;
use Modules\Common\Controllers\Controller;
use Modules\DocumentApproval\Actions\CreateDocumentApprovalAction;
use Modules\DocumentApproval\Data\CreateDocumentApprovalData;
use Modules\DocumentApproval\Data\DocumentApprovalResourceData;
use Modules\DocumentApproval\Models\DocumentApproval;
use Modules\DocumentApproval\Actions\UpdateDocumentApprovalAction;
use Modules\DocumentApproval\Data\UpdateDocumentApprovalData;
use Modules\DocumentApproval\Actions\DeleteDocumentApprovalAction;
use Modules\DocumentApproval\Authorization\DocumentApprovalAuthorization;
use Modules\DocumentApprovalHasUser\States\UserApprovalPending;
use Modules\DocumentApprovalHasUser\States\UserReviewalPending;

class DocumentApprovalController extends Controller
{
    private DeleteDocumentApprovalAction $deleteDocumentApprovalAction;
    private DocumentApprovalAuthorization $documentApprovalAuthorization;

    public function __construct(
        protected CreateDocumentApprovalAction $createDocumentApprovalAction,
        protected UpdateDocumentApprovalAction $updateDocumentApprovalAction,
        DeleteDocumentApprovalAction $deleteDocumentApprovalAction,
        DocumentApprovalAuthorization $documentApprovalAuthorization
    ) {
        $this->deleteDocumentApprovalAction = $deleteDocumentApprovalAction;
        $this->documentApprovalAuthorization = $documentApprovalAuthorization;
    }

    public function show(DocumentApproval $documentApproval): Response
    {
        $this->documentApprovalAuthorization->canView(Auth::user(), $documentApproval);

        return Inertia::render('ApproveDocument', [
            'documentApproval' => DocumentApprovalResourceData::fromModel($documentApproval),
        ]);
    }

    public function showToUpdate(DocumentApproval $documentApproval): JsonResponse
    {
        return response()->json(DocumentApprovalResourceData::fromModel($documentApproval));
    }

    public function store(CreateDocumentApprovalData $data): RedirectResponse
    {
        $this->createDocumentApprovalAction->execute($data);

        return redirect()->back();
    }

    public function update(DocumentApproval $documentApproval, UpdateDocumentApprovalData $data): RedirectResponse
    {
        // $this->documentApprovalAuthorization->canEdit(Auth::user(), $documentApproval);

        $this->updateDocumentApprovalAction->execute($documentApproval, $data);

        return redirect()->back();
    }

    public function cancel(DocumentApproval $documentApproval): RedirectResponse
    {
        // $this->documentApprovalAuthorization->canEdit(Auth::user(), $documentApproval);

        $this->deleteDocumentApprovalAction->execute($documentApproval);

        return redirect()->back();
    }

    /**
     * Retrieve pending document approvals for the authenticated user.
     */
    public function getPendingApprovals(): JsonResponse
    {
        $user = Auth::user();

        $pendingApprovals = DocumentApproval::whereHas('documentApprovalUsers', function ($query) use ($user) {
            $query->where('user_id', $user->id)
                ->whereIn('user_state', [
                    UserApprovalPending::class,
                    UserReviewalPending::class,
                ]);
        })
            ->whereHas('document', function ($query) {
                // No need to check for 'deleted_at' on Document, since it doesn't use soft deletes.
                $query->whereHas('item', function ($query) {
                    $query->whereNull('deleted_at'); // Ensure the related Item is not soft-deleted
                });
            })
            ->get()
            ->map(fn($approval) => DocumentApprovalResourceData::fromModel($approval));

        return response()->json(['pending_approvals' => $pendingApprovals], 200);
    }
}
