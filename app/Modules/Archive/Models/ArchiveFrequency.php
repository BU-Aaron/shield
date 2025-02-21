<?php

namespace App\Modules\Archive\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ArchiveFrequency extends Model
{
    use HasFactory;

    protected $fillable = ['years', 'enabled'];
}
