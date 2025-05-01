<?php

namespace Modules\Document\Controllers;

use App\Modules\ActivityLog\Data\ActivityLogResourceData;
use App\Modules\Document\Data\MoveDocumentsData;
use Modules\Common\Controllers\Controller;
use Modules\Document\Models\Document;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Modules\Document\Data\UploadDocumentData;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Modules\Document\Actions\UpdateDocumentAction;
use Modules\Document\Actions\UploadDocumentAction;
use Modules\Document\Authorization\DocumentAuthorization;
use Modules\Document\Data\DocumentResourceData;
use Modules\Document\Data\ShareDocumentData;
use Modules\Document\Data\RemoveShareDocumentData;
use Modules\Document\Data\UpdateDocumentData;
use Modules\Item\Actions\GetItemDataAction;
use Modules\Item\Data\ItemAncestorsResourceData;
use Modules\Item\Models\Item;
use Modules\User\Models\User;
use Spatie\LaravelData\DataCollection;
use Modules\Document\Actions\UploadDocumentVersionAction;
use Modules\Document\Actions\RestoreDocumentVersionAction;
use Modules\Document\Actions\DeleteDocumentVersionAction;
use Modules\Document\Data\DocumentVersionResourceData;
use Modules\Document\Data\UploadDocumentVersionData;
use Modules\Document\Actions\MoveDocumentsAction;

class DocumentController extends Controller
{
    public function __construct(
        protected UploadDocumentAction $uploadDocumentAction,
        protected DocumentAuthorization $documentAuthorization,
        protected GetItemDataAction $getItemDataAction,
        protected UpdateDocumentAction $updateDocumentAction,
        protected UploadDocumentVersionAction $uploadDocumentVersionAction,
        protected RestoreDocumentVersionAction $restoreDocumentVersionAction,
        protected DeleteDocumentVersionAction $deleteDocumentVersionAction,
        protected MoveDocumentsAction $moveDocumentsAction
    ) {}

    public function store(UploadDocumentData $data): RedirectResponse
    {
        $this->uploadDocumentAction->execute($data);

        return redirect()->back();
    }

    public function show(Document $document)
    {
        $this->documentAuthorization->canView(Auth::user(), $document);

        $item = Item::find($document->item_id);

        if (!$item) {
            abort(404, 'Item not found.');
        }

        $itemAncestors = $item->ancestorsWithSelf()->get()->load('workspace', 'folder');

        // $userRole = $document->userAccess()
        //     ->where('user_id', Auth::id())
        //     ->pluck('role')
        //     ->first();

        $user = Auth::user();
        $user = User::find($user->id);

        // Determine the user's role: 'admin' takes precedence
        if ($user->hasRole('admin')) {
            $userRole = 'admin';
        } else {
            $userAccess = $document->userAccess()->where('user_id', $user->id)->first();
            $userRole = $userAccess ? $userAccess->pivot->role : null;
        }

        $activityLogs = $document->activityLogs()->latest()->get();

        return Inertia::render('DocumentProperties', [
            'activityLog' => ActivityLogResourceData::collect($activityLogs),
            'itemAncestors' => ItemAncestorsResourceData::collect($itemAncestors, DataCollection::class),
            'document' => DocumentResourceData::fromModel($document, true),
            'userRole' => $userRole,
        ]);
    }

    public function move(MoveDocumentsData $data): RedirectResponse
    {
        $this->moveDocumentsAction->execute($data);

        return redirect()->back();
    }

    public function edit(Document $document)
    {
        $this->documentAuthorization->canEdit(Auth::user(), $document);

        $item = Item::find($document->item_id);

        $itemAncestors = $item->ancestorsWithSelf()->get()->load('workspace', 'folder');


        // dd(DocumentResourceData::fromModel($document));

        return Inertia::render('DocumentEdit', [
            'itemAncestors' => ItemAncestorsResourceData::collect($itemAncestors, DataCollection::class),
            'document' => DocumentResourceData::fromModel($document),
        ]);

        // return response()->json([
        //     'document' => DocumentResourceData::fromModel($document)
        // ], 200);
    }

    public function save(Document $document, UpdateDocumentData $data): RedirectResponse
    {
        $this->documentAuthorization->canEdit(Auth::user(), $document);

        $this->updateDocumentAction->execute($document, $data);

        return redirect()->back();
    }

    public function share(ShareDocumentData $data, Document $document): RedirectResponse
    {
        $this->documentAuthorization->canShare(Auth::user(), $document);

        // Detach all existing users
        $document->userAccess()->detach();

        // Attach new users with roles
        foreach ($data->users as $userData) {
            $user = User::where('email', $userData->email)->firstOrFail();

            if (!$document->userAccess()->where('user_id', $user->id)->exists()) {
                $document->userAccess()->attach($user->id, ['role' => $userData->role]);
            }
        }

        return redirect()->back()->with('success', 'Document shared successfully.');
    }

    public function removeShare(RemoveShareDocumentData $data, Document $document): JsonResponse
    {
        $this->documentAuthorization->canShare(Auth::user(), $document);

        $user = User::where('email', $data->email)->firstOrFail();

        $document->userAccess()->detach($user->id);

        return response()->json(['message' => 'Document unshared successfully.'], 200);
    }

    public function fetchUserShareDocument(Document $document): JsonResponse
    {
        // Assuming the relationship is defined as userAccess()
        $sharedUsers = $document->userAccess()->select('users.id', 'users.name', 'users.email', 'role')->get();

        return response()->json($sharedUsers);
    }

    public function uploadDocumentVersion(UploadDocumentVersionData $data): RedirectResponse
    {
        $this->uploadDocumentVersionAction->execute($data);

        return redirect()->back();
    }

    public function restoreDocumentVersion(string $versionId): RedirectResponse
    {
        $this->restoreDocumentVersionAction->execute($versionId);

        return redirect()->back();
    }

    public function deleteDocumentVersion(string $versionId): RedirectResponse
    {
        $this->deleteDocumentVersionAction->execute($versionId);

        return redirect()->back();
    }

    public function view(Document $document)
{
    $path = Storage::disk('public')->path($document->file_path);
    $mime = $document->mime_type;

    if (str_starts_with($mime, 'image/') || $mime === 'application/pdf' || str_starts_with($mime, 'text/')) {
        return response()->file($path, ['Content-Type' => $mime]);
    }

    if (in_array($mime, [
        'application/msword',                      // .doc
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
        'application/vnd.ms-excel',               // .xls
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    ])) {
        $previewUrl = 'https://view.officeapps.live.com/op/view.aspx?src=' . urlencode(asset('storage/' . $document->file_path));
        return redirect()->away($previewUrl);
    }

    // For unsupported types, show a generic download or message
    return Inertia::render('UnsupportedPreview', [
        'fileUrl' => asset('storage/' . $document->file_path),
        'fileName' => $document->name,
        'mimeType' => $mime,
    ]);
}
}
