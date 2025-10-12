<?php
namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use App\Models\Notification;

// class NotificationSent implements ShouldBroadcast
class NotificationSent implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $notification;

    public function __construct(Notification $notification)
    {
        $this->notification = $notification;
    }

    public function broadcastOn()
    {
        switch ($this->notification->target_type) {
            case 'single':
                return [new PrivateChannel("user.{$this->notification->target_ids[0]}")];

            case 'group':
                return array_map(fn($id) => new PrivateChannel("user.{$id}"), $this->notification->target_ids);

            case 'all_users':
                return [new Channel("all_users")];

            case 'all_management':
                return [new Channel("all_management")];

            default:
                return [];
        }
    }

    public function broadcastAs()
    {
        return 'notification.sent';
    }
}
