<?php

namespace Modules\User\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use Modules\DocumentApprovalHasUser\Models\DocumentApprovalHasUser;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Modules\Auth\Models\SecurityQuestion;

class User extends Authenticatable
{
    use HasFactory, HasRoles, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'username',
        'email',
        'password',
        'office_position',
        'system_role',
        'security_question_answer',
        'security_question_id',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function documentApprovalUsers()
    {
        return $this->hasMany(DocumentApprovalHasUser::class, 'user_id', 'id');
    }

    public function securityQuestion()
    {
        return $this->belongsTo(SecurityQuestion::class, 'security_question_id');
    }

    protected static function newFactory()
    {
        return \Database\Factories\UserFactory::new();
    }
}
