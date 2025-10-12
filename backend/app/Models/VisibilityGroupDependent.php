<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\SoftDeletes;

class VisibilityGroupDependent extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $dates = ['deleted_at'];

    protected $fillable = ['visibility_group_id', 'dependable_type', 'dependable_id'];

    public function visibilityGroup() {
        return $this->belongsTo(VisibilityGroup::class);
    }

    public function dependable() {
        return $this->morphTo();
    }
}