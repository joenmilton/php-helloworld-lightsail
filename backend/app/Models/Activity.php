<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\SoftDeletes;
use Auth;

use App\Sigapps\Filterable;
use App\Sigapps\Sortable;

class Activity extends Model
{
    use HasFactory, HasUuids, SoftDeletes, Filterable, Sortable;

    protected $dates = ['deleted_at'];
    
    protected $fillable = [
        'id',
        'parent_id',
        'owner_id',
        'title',
        'activitable_type',
        'activitable_id',
        'activity_type_id',
        'start_time',
        'end_time',
        'reminder_in_minutes',
        'reminder_minutes',
        'reminder_type',
        'description',
        'note',
        'completed',
        'completed_at',
        'activity_percentage'
    ];

    protected $appends = ['activity_loader', 'attachments_toggle', 'comments_toggle', 'comment_text', 'commenting_toggle', 'is_owner'];

    public function getIsOwnerAttribute() {
        return $this->user_id === Auth::id() || Auth::user()->hasRole('admin');
    }
    
    public function getActivityLoaderAttribute() {
        return false;
    }

    public function getAttachmentsToggleAttribute() {
        return false;
    }

    public function getCommentsToggleAttribute() {
        return true;
    }

    public function getCommentingToggleAttribute() {
        return false;
    }

    public function getCommentTextAttribute() {
        return '';
    }
    
    public function media() {
        return $this->morphMany(Media::class, 'mediable');
    }

    public function comments() {
        return $this->morphMany(Comment::class, 'commentable');
    }

    public function activitable() {
        return $this->morphTo();
    }

    public function owner() {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function activity_type() {
        return $this->belongsTo(ActivityType::class, 'activity_type_id');
    }

    public function users() {
        return $this->belongsToMany(User::class, 'activity_users', 'activity_id', 'user_id');
    }

    public function scopeGetVisibleActivities($query) {
        $query->join('deals as parent', 'parent.id', '=', 'activities.activitable_id')
            ->leftJoin('activity_users as users', 'users.activity_id', '=', 'activities.id')
            ->whereNull('activities.deleted_at')
            ->whereNull('parent.deleted_at')
            ->groupBy('activities.id');

        $user = Auth::user();
        if ($user->hasRole('admin')) {
            return $query;
        }

        if ($user->can('view all activities')) {
            return $query;
        }
        
        $query->leftJoin('deals as child', 'child.parent_id', '=', 'parent.id');
        if($user->can('view deal activities')) {
            $query->where(function ($subQuery) use($user){
                $subQuery->where('parent.owner_id', $user->id)
                    ->orWhere('child.owner_id', $user->id)
                    ->orWhere('users.user_id', $user->id);
            });

            return $query;
        }

        if ($user->can('view own activities')) {
            $query->where('users.user_id', $user->id);
            return $query;
        }

        return $query;
    }
}
