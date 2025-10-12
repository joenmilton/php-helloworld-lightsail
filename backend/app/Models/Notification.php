<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\SoftDeletes;

class Notification extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = [
        'title',
        'message',
        'type',          // 'user' or 'management'
        'target_type',   // 'single', 'all_users', 'all_management', 'group'
        'target_ids',    // JSON array of specific user IDs for 'single' or 'group' types
        'link',          // URL to redirect when clicked
        'data',          // Additional JSON data if needed
    ];

    protected $casts = [
        'data' => 'array',
        'target_ids' => 'array',
    ];

    public function readStatuses()
    {
        return $this->hasMany(NotificationReadStatus::class);
    }

    public function isVisibleTo(User $user): bool
    {
        switch ($this->target_type) {
            case 'single':
            case 'group':
                return in_array($user->id, $this->target_ids ?? []);
                
            case 'all_users':
                return $user->hasRole('user');
                
            case 'all_management':
                return !$user->hasRole('user');
                
            default:
                return false;
        }
    }
}
