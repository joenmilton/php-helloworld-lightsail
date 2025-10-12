<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\SoftDeletes;
use Auth;

class Filter extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $dates = ['deleted_at'];

    protected $fillable = [
        'name',
        'identifier',
        'user_id',
        'is_shared',
        'is_readonly',
        'rules',
        'flag'
    ];

    protected $appends = ['save_filter', 'mark_default'];

    public function getSaveFilterAttribute() {
        return ( ($this->user_id === Auth::id() || Auth::user()->hasRole('admin') ) && !$this->is_readonly);
    }

    public function getMarkDefaultAttribute() {
        return $this->defaults()->where('user_id', Auth::id())->exists();
    }

    public function getNameAttribute($value) {
        return trans($value);
    }

    public function setRulesAttribute($value) {
        $this->attributes['rules'] = json_encode($value);
    }

    public function getRulesAttribute($value) {
        return json_decode($value, true);
    }


    public function markDefaultAttribute($flag) {
        if ($flag) {
            // Remove existing defaults for this user and view
            FilterDefault::where('user_id', Auth::id())
                ->where('view', $this->identifier)
                ->delete();

            // Set this filter as the default
            FilterDefault::create([
                'filter_id' => $this->id,
                'user_id' => Auth::id(),
                'view' => $this->identifier
            ]);
        } else {
            // Remove this filter as default if it is currently set
            FilterDefault::where('filter_id', $this->id)
                ->where('user_id', Auth::id())
                ->delete();
        }
    }

    public function defaults() {
        return $this->hasMany(FilterDefault::class, 'filter_id');
    }
}
