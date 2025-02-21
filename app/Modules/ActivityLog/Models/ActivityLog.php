<?php

namespace Modules\ActivityLog\Models;

use Illuminate\Database\Eloquent\Relations\MorphTo;
use Spatie\Activitylog\Models\Activity;

class ActivityLog extends Activity
{
    public function subject(): MorphTo
    {
        return $this->morphTo();
    }
}
