<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;

class Media extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = [
        'file_name',
        'file_path',
        'file_size',
        'mediable_id',
        'mediable_type',
        'user_id'
    ];

    protected $appends = ['file_url'];

    public function getFileUrlAttribute() {
        return config('app.url') . '/storage/' . $this->attributes['file_path'];
    }

    public function user() {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function mediable() {
        return $this->morphTo();
    }
}
