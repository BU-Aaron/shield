<?php

namespace Modules\Workflow\Models;

use Modules\User\Models\User;
use Modules\Workflow\Models\Workflow;
use Illuminate\Database\Eloquent\Model;

class WorkflowHasUser extends Model
{
    protected $fillable = [
        'workflow_id',
        'user_id',
    ];

    public function workflow()
    {
        return $this->belongsTo(Workflow::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
