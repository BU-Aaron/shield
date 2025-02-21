<?php

namespace App\Modules\Item\Controllers;

use App\Modules\Item\Actions\GetTrashedItemAction;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Modules\Common\Controllers\Controller;
use Modules\Item\Actions\DeleteTrashedItemsAction;
use Modules\Item\Actions\RestoreTrashedItemsAction;
use Modules\Item\Data\DeleteTrashedItemsData;
use Modules\Item\Data\RestoreTrashedItemsData;
use App\Modules\Item\Authorization\TrashAuthorization;
use Illuminate\Support\Facades\Auth;
use Modules\User\Models\User;

class TrashController extends Controller
{
    public function __construct(
        protected GetTrashedItemAction $getTrashedItemAction,
        protected DeleteTrashedItemsAction $deleteTrashedItemsAction,
        protected RestoreTrashedItemsAction $restoreTrashedItemsAction,
        protected TrashAuthorization $trashAuthorization
    ) {}

    public function index()
    {
        // Enforce admin authorization
        $this->trashAuthorization->isAdmin(Auth::user());

        $user = Auth::user();

        $user = User::find($user->id);

        if ($user->hasRole('admin')) {
            $role = 'admin';
        } else {
            // Fallback to system-level permissions
            if ($user->hasRole('admin')) {
                $role = 'admin';
            } elseif ($user->hasRole('viewer')) {
                $role = 'viewer';
            } else {
                // If user has no relevant roles, deny access
                abort(403, 'Unauthorized.');
            }
        }

        $data = $this->getTrashedItemAction->execute();

        return Inertia::render('Trash', $data);
    }

    public function delete(DeleteTrashedItemsData $data): RedirectResponse
    {
        // Enforce admin authorization
        $this->trashAuthorization->isAdmin(Auth::user());

        $this->deleteTrashedItemsAction->execute($data);

        return redirect()->back();
    }

    public function restore(RestoreTrashedItemsData $data): RedirectResponse
    {
        // Enforce admin authorization
        $this->trashAuthorization->isAdmin(Auth::user());

        $this->restoreTrashedItemsAction->execute($data);

        return redirect()->back();
    }
}
