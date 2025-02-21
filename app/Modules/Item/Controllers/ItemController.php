<?php

namespace Modules\Item\Controllers;

use Modules\Common\Controllers\Controller;
use Modules\Item\Models\Item;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Modules\Item\Actions\DeleteItemsAction;
use Modules\Item\Actions\DownloadItemsAction;
use Modules\Item\Actions\GetItemDataAction;
use Modules\Item\Actions\ShowMoveItemsAction;
use Modules\Item\Data\DeleteItemsData;
use Modules\Item\Data\DownloadItemsData;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Modules\Item\Actions\ArchiveItemsAction;
use Modules\Item\Data\ArchiveItemsData;

class ItemController extends Controller
{
    public function __construct(
        private DownloadItemsAction $downloadItemsAction,
        private DeleteItemsAction $deleteItemsAction,
        private ShowMoveItemsAction $showMoveItemsAction,
        private ArchiveItemsAction $archiveItemsAction
    ) {}

    public function index(): JsonResponse
    {
        $items = Item::with(['workspace', 'folder', 'document'])->get();

        return response()->json($items);
    }

    public function showItems(Item $item = null): JsonResponse
    {
        $data = $this->showMoveItemsAction->execute($item);

        return response()->json($data);
    }

    public function download(DownloadItemsData $data)
    {
        return $this->downloadItemsAction->execute($data);
    }

    public function delete(DeleteItemsData $data): RedirectResponse
    {
        // Execute the delete action and get the redirect URL
        $redirectUrl = $this->deleteItemsAction->execute($data);

        // Redirect to the determined URL
        return redirect($redirectUrl);
    }

    public function archive(ArchiveItemsData $data): RedirectResponse
    {
        // Execute the archive action and get the redirect URL
        $redirectUrl = $this->archiveItemsAction->execute($data);

        // Redirect to the determined URL
        return redirect()->to($redirectUrl);
    }
}
