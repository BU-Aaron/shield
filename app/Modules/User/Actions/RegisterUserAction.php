<?php

namespace Modules\User\Actions;

use Modules\User\Data\RegisterUserData;
use Modules\User\Models\User;
use Illuminate\Support\Facades\Hash;
use Modules\User\Notifications\NewUserNotification;
use Illuminate\Support\Facades\Password;
use Illuminate\Auth\Events\Registered;

class RegisterUserAction
{
    public function execute(RegisterUserData $data): User
    {
        // Define a default password
        $defaultPassword = 'BU-IRO-Arquivo';

        $user = User::create([
            'name' => $data->name,
            'username' => $data->username,
            'email' => $data->email,
            'password' => Hash::make($data->password),
            'office_position' => $data->office_position,
            'system_role' => $data->system_role,
        ]);

        $user->assignRole($data->system_role);

        event(new Registered($user));

        // Send notification to the user with credentials and reset link
        $user->notify(new NewUserNotification($defaultPassword));

        return $user;
    }
}
