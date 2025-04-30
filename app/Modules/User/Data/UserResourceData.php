<?php

namespace App\Modules\User\Data;

use Modules\User\Models\User;
use Spatie\LaravelData\Resource;

class UserResourceData extends Resource
{
    public function __construct(
        public int $id,
        public string $name,
        public string $username,
        public string $email,
        public string $office_position,
        public string $system_role,
        public string $password,
        public string $security_question_answer,
        public string $security_question_id,


    ) {}

    public static function fromModel(User $user): self
    {
        return new self(
            id: $user->id,
            name: $user->name,
            username:$user->username,
            email: $user->email,
            office_position: $user->office_position ?? "",
            system_role: $user->system_role ?? "",
            password:$user->password,
            security_question_answer: $user->security_question_answer ?? "",
            security_question_id: $user->security_question_id ??  "",

        );
    }
}
