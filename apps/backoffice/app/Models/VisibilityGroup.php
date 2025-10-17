<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\SoftDeletes;

class VisibilityGroup extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $dates = ['deleted_at'];

    protected $fillable = ['type', 'visibilityable_type', 'visibilityable_id'];

    public function visibilityable() {
        return $this->morphTo();
    }

    public function dependents() {
        return $this->hasMany(VisibilityGroupDependent::class, 'visibility_group_id');
    }

    public function getVisibleUsers() {
        switch ($this->type) {
            case 'all':
  
                return User::select('id', 'name')
                    ->whereHas('roles', function($query) {
                        $query->whereHas('permissions', function($q1) {
                            $q1->whereIn('name', ['view own deals', 'view all deals', 'view team deals']);
                        });
                    })->get();

            case 'teams':
                $teamIds = $this->dependents()->where('dependable_type', Team::class)->pluck('dependable_id');
                return User::select('id', 'name')
                ->whereHas('roles', function($query) {
                    $query->whereHas('permissions', function($q1) {
                        $q1->whereIn('name', ['view own deals', 'view all deals', 'view team deals']);
                    });
                })->whereHas('teams', function ($query) use ($teamIds) {
                    $query->whereIn('teams.id', $teamIds);
                })->get();

            case 'users':
                $userIds = $this->dependents()->where('dependable_type', User::class)->pluck('dependable_id');
                return User::select('id', 'name')
                ->whereHas('roles', function($query) {
                    $query->whereHas('permissions', function($q1) {
                        $q1->whereIn('name', ['view own deals', 'view all deals', 'view team deals']);
                    });
                })->whereIn('id', $userIds)->get();

            default:
                return collect();
        }
    }
}
