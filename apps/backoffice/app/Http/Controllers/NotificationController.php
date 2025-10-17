<?php

namespace App\Http\Controllers;

use App\Services\NotificationService;
use Illuminate\Http\Request;
use App\Models\NotificationReadStatus;
use Auth;

class NotificationController extends Controller
{
    protected $notificationService;

    public function __construct(NotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }

    /**
     * Get paginated list of notifications for authenticated user
     */
    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 15);
        $userId = Auth::id();
        
        $notifications = $this->notificationService->getUserNotifications($userId, $perPage);
        
        $notification = [
            'notifications' => $notifications,
            'unread_count' => Auth::user()->unreadNotifications()->count()
        ];

        return $this->response($notification, '');
    }

    /**
     * Get unread notification count for authenticated user
     */
    public function getUnreadCount()
    {
        $count = Auth::user()->unreadNotifications()->count();
        
        return $this->response($count, '');
    }

    /**
     * Mark notification as read
     */
    public function markAsRead(Request $request, $notificationId)
    {
        $userId = Auth::id();
        try {
            $this->notificationService->markAsRead($notificationId, $userId);
            return $this->index($request);
        } catch (\Exception $e) {
            return $this->response(null, 'Could not mark notification as read', [], 400);
        }
    }

    /**
     * Mark all notifications as read
     */
    public function markAllAsRead(Request $request)
    {
        $userId = Auth::id();
        
        try {
            $unreadNotifications = Auth::user()->unreadNotifications()->get();
            
            foreach ($unreadNotifications as $notification) {
                $this->notificationService->markAsRead($notification->id, $userId);
            }
            
            return $this->index($request);
        } catch (\Exception $e) {
            dd($e);
            return $this->response(null, 'Could not mark notification as read', [], 422);
        }
    }
}