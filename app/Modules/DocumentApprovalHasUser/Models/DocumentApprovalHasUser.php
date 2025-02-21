<?php

namespace Modules\DocumentApprovalHasUser\Models;

use Illuminate\Database\Eloquent\Model;
use Modules\User\Models\User;
use Modules\DocumentApproval\Models\DocumentApproval;
use Modules\DocumentApprovalHasUser\States\UserState;
use Spatie\ModelStates\HasStates;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class DocumentApprovalHasUser extends Model
{
    use HasUuids, HasStates;

    protected $fillable = [
        'document_approval_id',
        'user_id',
        'user_state',
        'comment',
    ];

    protected $casts = [
        'user_state' => UserState::class,
    ];

    public function documentApproval()
    {
        return $this->belongsTo(DocumentApproval::class);
    }

    /**
     * Get the user associated with the approval.
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
}
