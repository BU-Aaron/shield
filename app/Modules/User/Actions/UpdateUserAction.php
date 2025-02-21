<?php

namespace Modules\User\Actions;

use Modules\User\Data\UpdateUserData;
use Modules\User\Models\User;

class UpdateUserAction
{
    public function execute(User $user, UpdateUserData $data): User
    {
        $user->update([
            'workflow_role' => $data->workflow_role,
            'office_position' => $data->office_position,
            'system_role' => $data->system_role,
        ]);

        $user->syncRoles($data->system_role);

        return $user;
    }
}
