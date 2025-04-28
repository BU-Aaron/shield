<?php

namespace Modules\User\Controllers;

use App\Modules\User\Data\UserResourceData;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Modules\Common\Controllers\Controller;
use Modules\User\Models\User;
use Modules\User\Actions\DeleteUserAction;
use Modules\User\Actions\RegisterUserAction;
use Modules\User\Actions\UpdateUserAction;
use Modules\User\Data\RegisterUserData;
use Modules\User\Data\UpdateUserData;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Modules\User\Authorization\UserAuthorization;

class UserController extends Controller
{
    protected UserAuthorization $userAuthorization;

    protected RegisterUserAction $registerUserAction;

    protected UpdateUserAction $updateUserAction;

    protected DeleteUserAction $deleteUserAction;

    public function __construct(
        RegisterUserAction $registerUserAction,
        UpdateUserAction $updateUserAction,
        DeleteUserAction $deleteUserAction,
        UserAuthorization $userAuthorization
    ) {
        $this->registerUserAction = $registerUserAction;
        $this->updateUserAction = $updateUserAction;
        $this->deleteUserAction = $deleteUserAction;
        $this->userAuthorization = $userAuthorization;
    }

    public function index(Request $request)
    {
        // Authorize the user to view users
        $this->userAuthorization->canView($request->user());

        $search = $request->input('search');

        $users = User::query()
            ->when($search, function ($query, $search) {
                $searchableColumns = ['name', 'email'];

                $query->where(function ($query) use ($search, $searchableColumns) {
                    foreach ($searchableColumns as $column) {
                        $query->orWhere($column, 'like', "%{$search}%");
                    }
                });
            })
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('User', [
            'users' => UserResourceData::collect($users),
            'filters' => $request->only(['search']),
        ]);
    }

    public function register(RegisterUserData $registerUserData): RedirectResponse
    {
        // Authorize the user to create a new user
        $this->userAuthorization->canCreate(Auth::user());

        $user = $this->registerUserAction->execute($registerUserData);

        return redirect()->back();
    }

    public function update(User $user, UpdateUserData $updateUserData): RedirectResponse
    {
        // Authorize the user to update this user
        $this->userAuthorization->canUpdate(Auth::user(), $user);

        $updatedUser = $this->updateUserAction->execute($user, $updateUserData);

        return redirect()->back();
    }

    public function delete(User $user): RedirectResponse
    {
        // Authorize the user to delete this user
        $this->userAuthorization->canDelete(Auth::user(), $user);

        $this->deleteUserAction->execute($user);

        return redirect()->back();
    }

    public function getUsers(): JsonResponse
    {
        $users = User::all();

        return response()->json(UserResourceData::collect($users));
    }
}
