<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\SoftDeletes;

class Team extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $dates = ['deleted_at'];

    protected $fillable = [
        'name',
        'description'
    ];

    public function members() {
        return $this->belongsToMany(User::class, 'team_users', 'team_id', 'user_id')
            ->withPivot('is_manager')
            ->withTimestamps();
    }

    public function manager() {
        return $this->members()->wherePivot('is_manager', true);
    }
}
