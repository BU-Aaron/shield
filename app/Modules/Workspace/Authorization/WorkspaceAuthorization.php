<?php

namespace Modules\Workspace\Authorization;

use Modules\User\Models\User;
use Modules\Workspace\Models\Workspace;
use Illuminate\Auth\Access\AuthorizationException;

class WorkspaceAuthorization
{
    private function authorize(User $user, callable $callback)
    {
        if ($this->before($user)) {
            return true;
        }

        return $callback();
    }

    private function before(User $user): ?bool
    {
        if ($user->hasRole('admin')) {
            return true;
        }

        return null;
    }

    public function isAdmin(User $user)
    {
        if ($user->hasRole('admin')) {
            return true;
        }

        throw new AuthorizationException('Unauthorized');
    }

    public function canView(User $user, Workspace $workspace)
    {
        return $this->authorize($user, function () use ($workspace, $user) {
            if (!$workspace->userAccess()->where('user_id', $user->id)->exists()) {
                throw new AuthorizationException('You don`t have permission to view this workspace');
            }
        });
    }

    public function canEdit(User $user, Workspace $workspace)
    {
        return $this->authorize($user, function () use ($workspace, $user) {
            if (!$workspace->userAccess()
                ->where('user_id', $user->id)
                ->wherePivot('role', 'editor')
                ->exists()) {
                throw new AuthorizationException('You don`t have permission to edit this workspace');
            }
        });
    }

    public function canShare(User $user, Workspace $workspace)
    {
        $this->authorize($user, function () use ($workspace, $user) {
            if (!$workspace->userAccess()
                ->where('user_id', $user->id)
                ->wherePivot('role', 'editor')
                ->exists()) {
                throw new AuthorizationException('You don`t have permission to share this workspace');
            }
        });
    }
}
