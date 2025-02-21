<?php

namespace Modules\Metadata\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MetadataHasPredefinedValue extends Model
{
    protected $fillable = [
        'metadata_id',
        'predefined_value',
    ];

    /**
     * Get the metadata that owns the predefined value.
     */
    public function metadata(): BelongsTo
    {
        return $this->belongsTo(Metadata::class);
    }
}
