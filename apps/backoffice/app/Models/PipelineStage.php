<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\SoftDeletes;

class PipelineStage extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $dates = ['deleted_at'];
    
    protected $fillable = [
        'name', 'sort_order', 'pipeline_id'
    ];

    public function deals() {
        return $this->hasMany(Deal::class, 'stage_id')
            ->orderBy('sort_order', 'asc')
            ->whereNull('deals.deleted_at');
    }
}
