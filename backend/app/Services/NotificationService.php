<?php
namespace App\Services;

use App\Models\Notification;
use App\Models\NotificationReadStatus;
use App\Models\User;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;

class NotificationService
{
    public function create(array $data, $recipientIds = null)
    {
        if (in_array($data['target_type'], ['single', 'group'])) {
            $data['target_ids'] = is_array($recipientIds) ? $recipientIds : [$recipientIds];
        }
        
        return Notification::create($data);
    }
    
    public function markAsRead($notificationId, $userId)
    {
        return NotificationReadStatus::firstOrCreate(
            [
                'notification_id' => $notificationId,
                'user_id' => $userId,
            ],
            [
                'id' => Str::uuid(),
                'read_at' => now(),
            ]
        );
    }
    
    public function getUserNotifications($userId, $limit = 20)
    {
        $user = User::findOrFail($userId);
        
        return $user->notifications()
            ->with(['readStatuses' => function($query) use ($userId) {
                $query->where('user_id', $userId);
            }])
            ->latest()
            ->paginate($limit)
            ->through(function($notification) use ($userId) {
                $notification->is_read = $notification->readStatuses->isNotEmpty();
                unset($notification->readStatuses);
                return $notification;
            });
    }
}