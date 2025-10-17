<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\SoftDeletes;
use Auth;

class Pipeline extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = [
        'name', 'visible_to'
    ];

    protected $dates = ['deleted_at'];

    public function stages() {
        return $this->hasMany(PipelineStage::class, 'pipeline_id')
            ->orderBy('sort_order', 'asc');
    }

    public function visibilityGroup(){
        return $this->morphOne(VisibilityGroup::class, 'visibilityable');
    }

    public function initialStage() {
        return $this->stages()->first()->id ?? null;
    }


    public static function getVisibles() {

        $user = Auth::user();
        $query = self::query();

        // If the user is an admin, return the query without any additional conditions
        if ($user->hasRole('admin')) {
            return $query->orderBy('pipelines.created_at', 'desc');
        }
        
        // Check 'view all deals' permission
        if ($user->can('view all pipelines')) {
            return $query->orderBy('pipelines.created_at', 'desc');
        }
        
        // Base joins
        $query->join('visibility_groups', 'pipelines.id', '=', 'visibility_groups.visibilityable_id')
            ->leftJoin('visibility_group_dependents', 'visibility_groups.id', '=', 'visibility_group_dependents.visibility_group_id')
            ->where('visibility_groups.visibilityable_type', Pipeline::class)
            ->whereNull('pipelines.deleted_at')
            ->whereNull('visibility_groups.deleted_at')
            ->groupBy('pipelines.id') 
            ->orderBy('pipelines.created_at', 'desc')
            ->where(function ($q) use ($user) {
                // Add condition for 'view own deals' permission
                $teamIds = $user->teams()->pluck('teams.id')->toArray();
                $q->Where(function ($subQuery) use ($user, $teamIds) {
                
                    $subQuery->where(function ($innerSubQuery) use ($teamIds) {
                        $innerSubQuery->where('visibility_groups.type', 'teams')
                            ->where('visibility_group_dependents.dependable_type', Team::class)
                            ->whereIn('visibility_group_dependents.dependable_id', $teamIds)
                            ->whereNull('visibility_group_dependents.deleted_at');
                    })->orWhere(function ($innerSubQuery) use ($user) {
                        $innerSubQuery->where('visibility_groups.type', 'users')
                            ->where('visibility_group_dependents.dependable_type', User::class)
                            ->whereIn('visibility_group_dependents.dependable_id', [$user->id])
                            ->whereNull('visibility_group_dependents.deleted_at');
                    })->orWhere(function ($innerSubQuery) {
                        $innerSubQuery->where('visibility_groups.type', 'all');
                    });
                });
            });
        
        return $query;
    }
}
