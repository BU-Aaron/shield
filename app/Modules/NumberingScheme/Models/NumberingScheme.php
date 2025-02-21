<?php

namespace Modules\NumberingScheme\Models;

use Modules\Folder\Models\Folder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class NumberingScheme extends Model
{
    protected $fillable = [
        'folder_item_id',
        'name',
        'prefix',
        'next_number',
        'reset_frequency',
        'last_reset_date',
        'add_if_approved',
    ];

    protected $casts = [
        'last_reset_date' => 'date',
    ];

    public function folder()
    {
        return $this->belongsTo(Folder::class);
    }
}
