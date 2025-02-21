<?php

namespace Modules\Workflow\Models;

use Modules\Folder\Models\Folder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Modules\User\Models\User;

class Workflow extends Model
{
    protected $fillable = [
        'folder_item_id',
        'resolution',
        'destination',
        'type',
    ];

    public function folder(): BelongsTo
    {
        return $this->belongsTo(Folder::class);
    }

    public function workflowUsers(): HasMany
    {
        return $this->hasMany(WorkflowHasUser::class);
    }

    public function users()
    {
        return $this->hasManyThrough(User::class, WorkflowHasUser::class, 'workflow_id', 'id', 'id', 'user_id');
    }
}
