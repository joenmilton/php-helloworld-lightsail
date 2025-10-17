<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Filter;
use App\Models\Deal;
use App\Models\Activity;
use App\Models\Media;
use App\Models\User;
use App\Models\ActivityType;
use App\Models\Comment;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use App\Rules\IsoDate;
use Auth;
use Validator;
use Setting;
use Carbon\Carbon;

use App\Sigapps\Filters\Text as TextFilter;
use App\Sigapps\Filters\Date as DateFilter;
use App\Sigapps\Filters\Select as SelectFilter;

use App\Services\NotificationService;
use App\Events\NotificationSent;

class ActivityResourceController extends Controller
{
    protected $notificationService;

    public function __construct(NotificationService $notificationService) {
        $this->notificationService = $notificationService;
    }

    public function getDealActivities($id, Request $request) {
        try {
            $deal = Deal::where('id', $id)->first();
            if(is_null($deal)) {
                return $this->response(null, 'Deal not valid', [], 400);
            }
            $deal_id = !is_null($deal->parent_id) ? $deal->parent_id : $deal->id;

            $activites = Activity::with('owner:id,name')
                ->with('activity_type:id,name,color,icon')
                ->with(['media' => function($query) {
                    $query->select('id','user_id','mediable_id','mediable_type','file_name','file_path','file_size','created_at');
                    $query->with('user');
                }])
                ->with(['comments' => function($query) {
                    $query->select('id', 'commentable_id', 'commentable_type', 'body', 'user_id', 'created_at')
                        ->with(['user:id,name'])
                        ->orderBy('created_at', 'DESC');
                }])
                ->where('activitable_type', Deal::class)
                ->where('activitable_id', $deal_id);

            if($request->has('q') && $request->q != '') {
                $activites = $activites->where('title', 'like', '%'.$request->q.'%');
            }

            $activites = $activites->paginate($request->per_page);

            return $this->response($activites, '');
        } catch (\Exception $e) {
            return $this->response(null, 'Something went wrong', [], 400);
        }
    }
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        if ($request->ajax()) {
            $query = Activity::getVisibleActivities()
                ->applyFilter($request->all(), 'activities')
                ->applySort($request->all(), 'activities');

            $activites = $query->select('activities.*', 'parent.name as deal_name')
                ->with('owner:id,name')
                ->with('activity_type:id,name,icon,color')
                ->with('users:id,name')
                ->paginate($request->per_page);

            return $this->response($activites, '');
        }

        return view('admin.activity.index');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'activity_type_id' => 'required|string|uuid',
            'module' => 'required|in:deal',
            'module_id' => 'required',
            'due_date' => ['required', new IsoDate],
            'start_time' => 'required|date_format:H:i',
            'end_date' => ['nullable', new IsoDate],
            'end_time' => 'nullable|date_format:H:i',
            'users' => 'array'
        ]);

        if ($validator->fails()) { 
            return $this->response(null, $validator->errors()->first(), $validator->errors()->toArray(), 422);
        }

        DB::beginTransaction();
        try {
            $module = Deal::whereNull('deleted_at')->where('id', $request->module_id)->first();
            if(is_null($module)) {
                return $this->response(null, 'Deal not valid', [], 400);
            }
            $module = (!is_null($module->parentDeal) && isset($module->parentDeal->id)) ? $module->parentDeal : $module;

            $dueDate = Carbon::parse($request->due_date);
            $dueDate->setTimezone('Asia/Kolkata');
            $formattedDueDate = $dueDate->format('Y-m-d');

            $endDate = Carbon::parse($request->end_date);
            $endDate->setTimezone('Asia/Kolkata');
            $formattedEndDate = $endDate->format('Y-m-d');

            $dueDateWithTime = ($request->has('start_time') && $request->start_time != '') ? Carbon::createFromFormat('Y-m-d H:i', $formattedDueDate . ' ' . $request->start_time, 'Asia/Kolkata') : Carbon::createFromFormat('Y-m-d', $formattedDueDate, 'Asia/Kolkata')->endOfDay();
            $endDateWithTime = ($request->has('end_time') && $request->end_time != '') ? Carbon::createFromFormat('Y-m-d H:i', $formattedEndDate . ' ' . $request->end_time, 'Asia/Kolkata') : Carbon::createFromFormat('Y-m-d', $formattedEndDate, 'Asia/Kolkata')->endOfDay();

            $activity = Activity::create([
                'id' => (string) Str::uuid(),
                'owner_id' => Auth::id(),
                'title' => $request->title,
                'activity_type_id' => $request->activity_type_id,
                'start_time' => $dueDateWithTime,
                'end_time' => $endDateWithTime,
                'reminder_in_minutes' => $this->convertToMinutes($request->reminder_type, $request->reminder_minutes),
                'reminder_minutes' => $request->reminder_minutes,
                'reminder_type' => $request->reminder_type,
                'description' => ($request->has('description') && $request->description != '') ? $request->description : '',
                'note' => ($request->has('note') && $request->note != '') ? $request->note : '',
                'completed' => $request->completed,
                'completed_at' => $request->completed ? $endDateWithTime : NULL,
                'activity_percentage' => $request->completed ? 100 : 0
            ]);

            $activity->activitable()->associate($module);
            $activity->save();

            $assignedIds[Auth::id()] = ['is_activity_owner' => true];

            // Collect new user IDs
            $newUserIds = []; 

            if($request->has('users') && is_array($request->users)) {
                foreach($request->users as $usr) {
                    if(isset($usr['id'])) {
                        $usr_id = $usr['id'];
                        $assignedIds[$usr_id] = ['is_activity_owner' => false];

                        $newUserIds[] = $usr_id;
                    }
                }
            }
            $activity->users()->attach($assignedIds);
            DB::commit();


            if(count($newUserIds) > 0) {
                // Create notification to assigned users
                $push_notification = $this->notificationService->create([
                    'title' => 'Activity Assigned to You',
                    'message' => "An activity '{$activity->title}' has been assigned to you. Please review and take action.",
                    'type' => 'management',
                    'target_type' => 'group',
                    'link' => "/activity/{$activity->id}",
                    'data' => [
                        'deal_id' => $activity->id,
                        'action' => 'activity_assigned'
                    ]
                ], $newUserIds);
                broadcast(new NotificationSent($push_notification));
            }


            $updatedActivity = Activity::with('owner:id,name')
                ->with('activity_type:id,name,color,icon')
                ->with(['media' => function($query) {
                    $query->select('id','user_id','mediable_id','mediable_type','file_name','file_path','file_size','created_at');
                    $query->with('user');
                }])
                ->with(['comments' => function($query) {
                    $query->select('id', 'commentable_id', 'commentable_type', 'body', 'user_id', 'created_at')
                        ->with(['user:id,name'])
                        ->orderBy('created_at', 'DESC');
                }])
                ->where('id', $activity->id)
                ->first();

            return $this->response($updatedActivity, '');
        } catch (\Exception $e) {
            DB::rollback();
            return $this->response(null, 'Something went wrong', [], 400);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $activity = Activity::with('owner:id,name')
                ->with('activity_type:id,name,icon,color')
                ->with('users:id,name')
                ->with(['media' => function($query) {
                    $query->select('id','user_id','mediable_id','mediable_type','file_name','file_path','file_size','created_at');
                    $query->with('user');
                }])
                ->with(['comments' => function($query) {
                    $query->select('id', 'commentable_id', 'commentable_type', 'body', 'user_id', 'created_at')
                        ->with(['user:id,name'])
                        ->orderBy('created_at', 'DESC');
                }])
                ->where('id', $id)
                ->first();
            if(is_null($activity)) {
                return $this->response(null, 'Activity not valid', [], 400);
            }

            return $this->response($activity, '');
        } catch(Exception $e) {
            return $this->response(null, 'Something went wrong', [], 400);
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'activity_type_id' => 'required|string|uuid',
            'due_date' => ['required', new IsoDate],
            'start_time' => 'required|date_format:H:i',
            'end_date' => ['nullable', new IsoDate],
            'end_time' => 'nullable|date_format:H:i',
            'users' => 'array'
        ]);

        if ($validator->fails()) { 
            return $this->response(null, $validator->errors()->first(), $validator->errors()->toArray(), 422);
        }

        DB::beginTransaction();
        try {
            $activity = Activity::where('id', $id)->first();
            if(is_null($activity)) {
                return $this->response(null, 'Activity not valid', [], 400);
            }

            $dueDate = Carbon::parse($request->due_date);
            $dueDate->setTimezone('Asia/Kolkata');
            $formattedDueDate = $dueDate->format('Y-m-d');
            $endDate = Carbon::parse($request->end_date);
            $endDate->setTimezone('Asia/Kolkata');
            $formattedEndDate = $endDate->format('Y-m-d');
            $dueDateWithTime = ($request->has('start_time') && $request->start_time != '') ? Carbon::createFromFormat('Y-m-d H:i', $formattedDueDate . ' ' . $request->start_time, 'Asia/Kolkata') : Carbon::createFromFormat('Y-m-d', $formattedDueDate, 'Asia/Kolkata')->endOfDay();
            $endDateWithTime = ($request->has('end_time') && $request->end_time != '') ? Carbon::createFromFormat('Y-m-d H:i', $formattedEndDate . ' ' . $request->end_time, 'Asia/Kolkata') : Carbon::createFromFormat('Y-m-d', $formattedEndDate, 'Asia/Kolkata')->endOfDay();
            $activity->title = $request->title;
            $activity->activity_type_id = $request->activity_type_id;
            $activity->start_time = $dueDateWithTime;
            $activity->end_time = $endDateWithTime;
            $activity->reminder_in_minutes = $this->convertToMinutes($request->reminder_type, $request->reminder_minutes);
            $activity->reminder_minutes = $request->reminder_minutes;
            $activity->reminder_type = $request->reminder_type;
            $activity->description = ($request->has('description') && $request->description != '') ? $request->description : '';
            $activity->note = ($request->has('note') && $request->note != '') ? $request->note : '';
            $activity->save();

            // Collect new user IDs
            $newUserIds = []; 

            $owner_id = $activity->owner_id;
            $assignedIds[$owner_id] = ['is_activity_owner' => 1];

            // Get existing assigned user IDs
            $existingUserIds = $activity->users()->pluck('users.id')->toArray();
            if($request->has('users') && is_array($request->users) && count($request->users) > 0) {
                foreach($request->users as $user) {
                    if (isset($user['id'])) {
                        $id = $user['id'];
                        $assignedIds[$id] = ['is_activity_owner' => ($id === $owner_id ? 1 : 0)];
        
                        // Check if this is a newly assigned user
                        if (!in_array($id, $existingUserIds)) {
                            $newUserIds[] = $id;
                        }
                    }
                }
            }

            $activity->users()->detach();
            $activity->users()->attach($assignedIds);
            DB::commit();

            $updatedActivity = Activity::with('owner:id,name')
                ->with('users:id,name')
                ->with('activity_type:id,name,color,icon')
                ->with(['media' => function($query) {
                    $query->select('id','user_id','mediable_id','mediable_type','file_name','file_path','file_size','created_at');
                    $query->with('user');
                }])
                ->with(['comments' => function($query) {
                    $query->select('id', 'commentable_id', 'commentable_type', 'body', 'user_id', 'created_at')
                        ->with(['user:id,name'])
                        ->orderBy('created_at', 'DESC');
                }])
                ->where('id', $activity->id)
                ->first();


                if(count($newUserIds) > 0) {
                    // Create notification to assigned users
                    $push_notification = $this->notificationService->create([
                        'title' => 'Activity Assigned to You',
                        'message' => "An activity '{$updatedActivity->title}' has been assigned to you. Please review and take action.",
                        'type' => 'management',
                        'target_type' => 'group',
                        'link' => "/activity/{$updatedActivity->id}",
                        'data' => [
                            'deal_id' => $updatedActivity->id,
                            'action' => 'activity_assigned'
                        ]
                    ], $newUserIds);
                    broadcast(new NotificationSent($push_notification));
                }

            return $this->response($updatedActivity, '');
        } catch (\Exception $e) {
            DB::rollback();
            return $this->response(null, 'Something went wrong', [], 400);
        }
    }

    public function quickUpdate(Request $request)
    {
        $rule = [
            'activity_id' => 'required|string|uuid',
            'data' => 'required',
            'type' => 'required'
        ];

        if($request->has('type') && $request->type == 'attachment') {
            $rule['data'] = 'required|mimes:jpg,jpeg,png,pdf,doc,docx,ppt,pptx,xls,xlsx|max:20480';
        }

        $validator = Validator::make($request->all(), $rule);
        if ($validator->fails()) { 
            return $this->response(null, $validator->errors()->first(), $validator->errors()->toArray(), 422);
        }

        $activity = Activity::where('id', $request->activity_id)->first();
        if(is_null($activity)) {
            return $this->response(null, 'Activity not valid', [], 400);
        }
        
        DB::beginTransaction();
        try {
            $result = null;

            if($request->type === 'completed') {
                $activity->completed            = ($request->data == 100) ? true : false;
                $activity->completed_at         = ($request->data == 100) ? Carbon::now() : NULL;
                $activity->activity_percentage  = $request->data;
                $activity->save();
                DB::commit();
                
                $result = [
                    [
                        'key' => 'completed',
                        'activity_percentage' => $activity->activity_percentage,
                        'value' => $activity->completed
                    ]
                ];
            }

            if($request->type === 'activity_type_id') {
                $activity->activity_type_id = $request->data;
                $activity->save();
                DB::commit();
                
                $updatedActivity = Activity::where('id', $request->activity_id)
                    ->with(['activity_type:id,name,color,icon'])
                    ->first();

                $result = [
                    [
                        'key' => 'activity_type_id',
                        'value' => $activity->activity_type_id
                    ],
                    [
                        'key' => 'activity_type',
                        'value' => $updatedActivity->activity_type
                    ]
                ];
            }


            if($request->type === 'owner_id') {
                $activity->owner_id = $request->data;
                $activity->save();
                DB::commit();

                $updatedActivity = Activity::where('id', $request->activity_id)
                    ->with(['owner:id,name'])
                    ->first();

                $result = [
                    [
                        'key' => 'owner_id',
                        'value' => $activity->owner_id
                    ],
                    [
                        'key' => 'owner',
                        'value' => $updatedActivity->owner
                    ]
                ];
            }
            

            if($request->type === 'attachment') {

                $file = $request->file('data');
                $fileName = $file->getClientOriginalName();
                $filePath = $file->store('uploads', 'public');
                $fileSize = $file->getSize();
    
                // Create the media record
                $media = new Media([
                    'id' => (string) Str::uuid(), // Generate a UUID for the media
                    'file_name' => $fileName,
                    'file_size' => $fileSize,
                    'file_path' => $filePath,
                    'user_id' => Auth::id()
                ]);
    
                $activity->media()->save($media);
                DB::commit();

                $updatedActivity = Activity::where('id', $request->activity_id)
                    ->with(['media' => function($query) {
                        $query->select('id','user_id','mediable_id','mediable_type','file_name','file_path','file_size','created_at');
                        $query->with('user');
                    }])
                    ->first();

                $result = [
                    [
                        'key' => 'media',
                        'value' => $updatedActivity->media
                    ]
                ];
            }

            if($request->type === 'comment') {
                // Create the media record
                $comment = new Comment([
                    'user_id' => Auth::id(),
                    'body' => $request->data
                ]);
    
                $activity->comments()->save($comment);
                DB::commit();

                $updatedActivity = Activity::where('id', $request->activity_id)
                    ->with(['comments' => function($query) {
                        $query->select('id', 'commentable_id', 'commentable_type', 'body', 'user_id', 'created_at')
                            ->with(['user:id,name'])
                            ->orderBy('created_at', 'DESC');
                    }])
                    ->first();

                $result = [
                    [
                        'key' => 'comments',
                        'value' => $updatedActivity->comments
                    ]
                ];
            }

            if($request->type === 'inner_comment') {
                $comment = Comment::where('id', $request->inner_id)->first();
                if(!is_null($comment)) {
                    $comment->body = $request->data;
                    $comment->save();
                    DB::commit();
                }

                $updatedActivity = Activity::where('id', $request->activity_id)
                    ->with(['comments' => function($query) {
                        $query->select('id', 'commentable_id', 'commentable_type', 'body', 'user_id', 'created_at')
                            ->with(['user:id,name'])
                            ->orderBy('created_at', 'DESC');
                    }])
                    ->first();

                $result = [
                    [
                        'key' => 'comments',
                        'value' => $updatedActivity->comments
                    ]
                ];

            }
            
            
            return $this->response($result, '');
        } catch (\Exception $e) {
            DB::rollback();
            return $this->response(null, 'Something went wrong', [], 400);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }


        /**
     * Convert the reminder value to minutes based on the type.
     *
     * @param string $reminderType
     * @param int $reminderMinutes
     * @return int
     */
    private function convertToMinutes($reminderType, $reminderMinutes)
    {
        switch ($reminderType) {
            case 'minutes':
                return $reminderMinutes;
            case 'hours':
                return $reminderMinutes * 60;
            case 'days':
                return $reminderMinutes * 60 * 24;
            case 'weeks':
                return $reminderMinutes * 60 * 24 * 7;
            default:
                throw new \InvalidArgumentException("Invalid reminder type: $reminderType");
        }
    }

    private function getActivitySettings(Request $request) {
        $data['users'] = User::doesntHave('roles', 'and', function($query) {
                $query->where('name', 'user');
            })
            ->select('id', 'name', 'email')->get();  

        // Get the filtered activity types
        $filteredActivityTypes = ActivityType::select('id', 'name', 'icon', 'color')
            ->whereNull('deleted_at')
            ->where('id', '!=', Setting::get('client_task_id', null))
            ->get();

        $data['activity_types'] = $filteredActivityTypes;

        // Get the full list of activity types for the dropdown
        $allActivityTypes = ActivityType::select('id', 'name', 'icon', 'color')
            ->whereNull('deleted_at')
            ->get();

        $data['rules'] = [];
        if(empty(array_intersect(explode(',', $request->skip), ['rules'])) ) {
            $data['rules'] = [
                TextFilter::make('activities.title', __('fields.activities.title'))
                    ->withoutEmptyOperators()
                    ->jsonSerialize(),
                DateFilter::make('activities.created_at', __('fields.deals.created_date'))
                    ->jsonSerialize(),
                DateFilter::make('activities.start_time', __('fields.activities.due_date'))
                    ->jsonSerialize(),
                DateFilter::make('activities.end_time', __('fields.activities.end_date'))
                    ->jsonSerialize(),
                SelectFilter::make('activities.completed', __('fields.activities.status'))
                    ->labelKey('name')
                    ->valueKey('id')
                    ->options([['id' => 0, 'name' => 'Not Completed'], ['id' => 1, 'name' => 'Completed']])
                    ->jsonSerialize(),
                SelectFilter::make('activities.activity_type_id', __('fields.activities.type'))
                    ->labelKey('name')
                    ->valueKey('id')
                    ->options(function() use($allActivityTypes){
                        return $allActivityTypes;
                    })
                    ->jsonSerialize(),
                SelectFilter::make('activities.owner_id', __('fields.activities.owner.name'))
                    ->labelKey('name')
                    ->valueKey('id')
                    ->options(function () {
                        return app(User::class)->getBackendUsers()
                            ->select(
                                DB::raw("CASE WHEN users.id = " . Auth::id() . " THEN 0 ELSE users.id END as id"),
                                DB::raw("CASE WHEN users.id = " . Auth::id() . " THEN 'Me' ELSE users.name END as name")
                            )
                            ->orderByRaw("users.id = " . Auth::id() . " DESC")
                            ->get();
                    })
                    ->jsonSerialize(),
            ];
        }


        $user = Auth::user();
        $data['filters'] = [];
        if(empty(array_intersect(explode(',', $request->skip), ['filters'])) ) {
            $data['filters']           = Filter::where('identifier', 'activites')
                ->where(function ($q) use ($user) {
                    $q->whereNull('user_id')
                        ->orWhere('is_shared', true)
                        ->orWhere('user_id', $user->id);
                })
                ->get();
        }

        return $data;
    }

    public function getSettings(Request $request) {
        $data = $this->getActivitySettings($request);
        return $this->response($data, '');
    }
}
