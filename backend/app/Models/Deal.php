<?php

namespace App\Models;

use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;
use Carbon\Carbon;

use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;

use App\Facades\ChangeLogger;
use App\Models\User;
use App\Models\Activity;
use Setting;
use Auth;

use App\Sigapps\Filterable;
use App\Sigapps\Sortable;

class Deal extends Model
{
    use HasFactory, HasUuids, SoftDeletes, LogsActivity, Filterable, Sortable;

    protected $dates = ['deleted_at', 'expected_close_date'];
    
    protected $fillable = [
        'id',
        'name',
        'owner_id',
        'pipeline_id',
        'amount',
        'paid_amount',
        'has_products',
        'stage_id',
        'contact_id',
        'sort_order',
        'expected_close_date',
        'status',
        'won_date',
        'lost_date',
        'lost_reason',
        'owner_rewarded_at',
        'internal_reference_id'
    ];

    protected $appends = ['is_loading', 'temp_custom_fields'];

    public function clone(Request $request, Pipeline $pipeline) {

        $parent_id = !is_null($this->parent_id) ? $this->parent_id : $this->id;

        $clonedDeal                         = new Deal;
        $clonedDeal->id                     = Str::uuid();
        $clonedDeal->name                   = $this->name;
        $clonedDeal->parent_id              = $parent_id;
        $clonedDeal->owner_id               = $request->owner_id;
        $clonedDeal->pipeline_id            = $request->pipeline_id;
        $clonedDeal->stage_id               = $pipeline->initialStage();
        $clonedDeal->sort_order             = 1;
        $clonedDeal->expected_close_date    = $this->expected_close_date;
        $clonedDeal->status                 = '1';
        $clonedDeal->save();

        $assignedIds[$request->owner_id] = ['is_deal_owner' => true];
        $clonedDeal->users()->attach($assignedIds);

        // foreach($this->customFields as $field) {
        //     $clonedDeal->customFields()->updateOrCreate(
        //         ['field_name'  => $field->field_name],
        //         [
        //             'field_value' => $field->field_value
        //         ]
        //     );
        // }

        return $clonedDeal;
    }

    public function getActivitylogOptions(): LogOptions {
        return LogOptions::defaults()
            ->logOnly(['name', 'expected_close_date'])
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs();
    }

    public function logStageChange($previousStage) {
        ChangeLogger::logStageChangeActivity($this, $previousStage);
    }

    public function logContactChange(User $contact, $type = 'contact_attach') {
        ChangeLogger::logContactChangeActivity($this, $contact, null, $type);
    }

    public function logStatusChange() {
        ChangeLogger::logStatusChangeActivity($this, null);
    }

    public function logOwnerChange() {
        ChangeLogger::logOwnerChangeActivity($this, null);
    }

    public function logDealClone(Pipeline $pipeline) {
        ChangeLogger::logDealCloneActivity($this, $pipeline, null);
    }


    public function updateStatus($status, $lostReason = null)
    {
        $this->status = $status;

        if ($status === 1) { // open
            $this->fill([ 
                'won_date' => null, 'lost_date' => null,  'lost_reason' => null 
            ]);
        } elseif ($status === 3) { // lost
            $this->fill([
                'lost_date' => now(), 'won_date' => null, 'lost_reason' => $lostReason
            ]);
        } else { // won
            $this->fill([
                'won_date' => now(), 'lost_date' => null, 'lost_reason' => null,
            ]);
        }

        $this->save();
    }

    public function updatePaidAmount() {
        try {
            $paid_total = $this->payments()
                ->whereNull('deleted_at')
                ->where('status', 1)
                ->sum('paid_amount');

            $this->paid_amount = $paid_total;
            $this->save();
        } catch (\Exception $e) {
            // Log the exception for debugging
            \Log::error('Failed Paid amount update: ' . $e->getMessage());
        }
    }

    public function getIsLoadingAttribute() {
        return false;
    }

    public function getExpectedCloseDateAttribute($value) {
        return Carbon::parse($value)->format('Y-m-d');
    }

    public function pipeline() {
        return $this->belongsTo(Pipeline::class, 'pipeline_id');
    }
    
    public function stage() {
        return $this->belongsTo(PipelineStage::class, 'stage_id');
    }

    public function owner() {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function users() {
        return $this->belongsToMany(User::class, 'deal_users', 'deal_id', 'user_id');
    }

    public function internal_reference() {
        return $this->belongsTo(InternalReference::class, 'internal_reference_id');
    }

    public function customFields() {
        return $this->morphMany(CustomField::class, 'model');
    }
    
    public function getTempCustomFieldsAttribute(){
        return $this->customFields;
    }

    /* Start Parent Model related */
    public function parentDeal() {
        return $this->belongsTo(Deal::class, 'parent_id')->withDefault();
    }

    public function childDeals() {
        return $this->hasMany(Deal::class, 'parent_id');
    }

    
    public function getAmountAttribute($value) {
        if ($this->parent_id) {
            return (!is_null($this->parentDeal) && isset($this->parentDeal->id)) ? $this->parentDeal->amount : 0.00;
        }
        return $value;
    }

    public function getPaidAmountAttribute($value) {
        if ($this->parent_id) {
            return (!is_null($this->parentDeal) && isset($this->parentDeal->id)) ? $this->parentDeal->paid_amount : 0.00;
        }
        return $value;
    }

    public function getHasProductsAttribute($value) {
        if ($this->parent_id) {
            return (!is_null($this->parentDeal) && isset($this->parentDeal->id)) ? $this->parentDeal->has_products : 0;
        }
        return $value;
    }

    public function getContactIdAttribute($value) {
        if ($this->parent_id) {
            return (!is_null($this->parentDeal) && isset($this->parentDeal->id)) ? $this->parentDeal->contact_id : NULL;
        }
        return $value;
    }
    public function contact() {
        if ($this->parent_id) {
            return $this->parentDeal->contact();
        }
        return $this->belongsTo(User::class, 'contact_id');
    }

    public function payments() {
        if ($this->parent_id) {
            return $this->parentDeal->payments();
        }
        return $this->morphMany(Payment::class, 'payable');
    }

    public function activities() {
        if ($this->parent_id) {
            return $this->parentDeal->activities();
        }
        return $this->morphMany(Activity::class, 'activitable');
    }

    public function taskActivities()
    {
        if ($this->parent_id) {
            return $this->parentDeal->taskActivities();
        }
        return $this->morphMany(Activity::class, 'activitable')
                    ->where('activity_type_id', Setting::get('task_id', null));
    }

    public function clientTaskActivity() {
        if ($this->parent_id) {
            return $this->parentDeal->clientTaskActivity();
        }
    
        $clientTaskId = Setting::get('client_task_id', null);
    
        return $this->morphOne(Activity::class, 'activitable')
                    ->where('activity_type_id', $clientTaskId);
    }

    public function billableable() {
        if ($this->parent_id) {
            return $this->parentDeal->billableable();
        }
        return $this->morphOne(Billable::class, 'billableable');
    }

    /* End Parent Model related */



    public function scopeGetVisibleDeals($query) {

        $query->join('pipelines', 'deals.pipeline_id', '=', 'pipelines.id')
            ->leftJoin('users as client', 'client.id', '=', 'deals.contact_id')
            ->whereNull('pipelines.deleted_at')
            ->groupBy('deals.id');

        $user = Auth::user();
        // If the user is an admin, return the query without any additional conditions
        if ($user->hasRole('admin')) {
            return $query;
        }
        
        // Check 'view all deals' permission
        if ($user->can('view all deals')) {
            return $query;
        }

        // Base joins
        $query->join('visibility_groups', 'pipelines.id', '=', 'visibility_groups.visibilityable_id')
            ->leftJoin('visibility_group_dependents', 'visibility_groups.id', '=', 'visibility_group_dependents.visibility_group_id')
            ->leftJoin('deal_users', 'deal_users.deal_id', '=', 'deals.id')
            ->where('visibility_groups.visibilityable_type', Pipeline::class)
            ->whereNull('visibility_groups.deleted_at')
            ->where(function ($q) use ($user) {
                // Add condition for 'view own deals' permission
                if ($user->can('view own deals')) {
                    $q->Where('deals.owner_id', $user->id)
                        ->orWhere('deal_users.user_id', $user->id);
                }

                // Add condition for 'view team deals' permission
                if ($user->can('view team deals')) {
                    $teamIds = $user->teams()->pluck('teams.id')->toArray();
                    $teamUserIds = User::whereHas('teams', function ($query) use ($teamIds) {
                        $query->whereIn('teams.id', $teamIds);
                        $query->whereNull('teams.deleted_at');
                    })->pluck('users.id')->toArray();
                
                    $q->Where(function ($subQuery) use ($user, $teamIds, $teamUserIds) {
                        $subQuery->where(function ($innerSubQuery) use ($teamIds, $teamUserIds) {
                            $innerSubQuery->where('visibility_groups.type', 'teams')
                                ->where('visibility_group_dependents.dependable_type', Team::class)
                                ->whereIn('visibility_group_dependents.dependable_id', $teamIds)
                                ->whereIn('deals.owner_id', $teamUserIds)
                                ->whereNull('visibility_group_dependents.deleted_at');
                        })
                        ->orWhere('deals.owner_id', $user->id);
                    });
                }
            });
        return $query;
    }


    public function createClientTask() {
        $task_type_id =     Setting::get('client_task_id', null);
        if(is_null($task_type_id)){
            return false;
        }

        $client_task = $this->clientTaskActivity()->first();
        if(!is_null($client_task)) {
            return $client_task;
        }

        $activity = Activity::create([
            'id' => (string) Str::uuid(),
            'owner_id' => $this->owner_id,
            'activitable_type' => self::class,
            'activitable_id' => $this->id,
            'title' => 'Sharing details with client',
            'activity_type_id' => $task_type_id,
            'start_time' => NULL,
            'end_time' => NULL,
            'reminder_in_minutes' => 0,
            'reminder_minutes' => 0,
            'reminder_type' => 'minutes',
            'description' => '',
            'note' => '',
            'completed' => true,
            'completed_at' => NULL,
            'activity_percentage' => 0
        ]);

        return $activity;
    }












    public function scopeGetDealReport($query, $pipeline_id = null) {
        $query->whereNull('deals.deleted_at');
        if($pipeline_id) {
            $query->where('deals.pipeline_id', $pipeline_id);
        }


        $user = Auth::user();
        // If the user is an admin, return the query without any additional conditions
        if ($user->hasRole('admin')) {
            return $query;
        }
        
        // Check 'view all deals' permission
        if ($user->can('view all deals')) {
            return $query;
        }

        $query->leftJoin('deal_users', 'deal_users.deal_id', '=', 'deals.id')
            ->where(function ($q) use ($user) {
                if ($user->can('view own deals')) {
                    $q->Where('deals.owner_id', $user->id)
                        ->orWhere('deal_users.user_id', $user->id);
                } else {
                    $q->Where('deals.owner_id', $user->id);
                }
            });

        return $query;
    }


    //Methods for Dashboard
    public static function getClientDealStatsForChart($year = null, $pipeline_id = null) {
        if (!$year) {
            $year = now()->year;
        }
        
        $query = self::getDealReport($pipeline_id);

        // Single query to get both linked and unlinked deals
        $stats = (clone $query)
            ->whereYear('deals.created_at', $year)
            ->selectRaw('
                COUNT(CASE WHEN deals.contact_id IS NOT NULL THEN 1 END) as linked_deals,
                COUNT(CASE WHEN deals.contact_id IS NULL THEN 1 END) as unlinked_deals
            ')
            ->first();

        return [
            'series' => [$stats->linked_deals, $stats->unlinked_deals],
            'labels' => ['Client Deals', 'Unknown Deals'],
            'linked_deals' => $stats->linked_deals,
            'unlinked_deals' => $stats->unlinked_deals,
        ];
    }

    public static function getDashboardStats($year = null, $pipeline_id = null) {
        if (!$year) {
            $year = now()->year;
        }

        $previousYear = $year - 1;

        $query = self::getDealReport($pipeline_id);

        // Single query for current year stats
        $currentYearStats = (clone $query)
            ->selectRaw('
                COUNT(CASE WHEN YEAR(deals.created_at) = ? THEN 1 END) as total_created,
                COUNT(CASE WHEN deals.status = 2 AND YEAR(deals.won_date) = ? THEN 1 END) as total_owned,
                COUNT(CASE WHEN deals.status = 3 AND YEAR(deals.lost_date) = ? THEN 1 END) as total_lost
            ', [$year, $year, $year])
            ->first();

        // Single query for previous year stats
        $previousYearStats = (clone $query)
            ->selectRaw('
                COUNT(CASE WHEN YEAR(deals.created_at) = ? THEN 1 END) as total_created,
                COUNT(CASE WHEN deals.status = 2 AND YEAR(deals.won_date) = ? THEN 1 END) as total_owned,
                COUNT(CASE WHEN deals.status = 3 AND YEAR(deals.lost_date) = ? THEN 1 END) as total_lost
            ', [$previousYear, $previousYear, $previousYear])
            ->first();

        // Calculate percentage changes with null safety
        $current_total_created_change_percentage = $previousYearStats->total_created > 0 
            ? (($currentYearStats->total_created - $previousYearStats->total_created) / $previousYearStats->total_created) * 100 
            : 0;

        $current_total_owned_change_percentage = $previousYearStats->total_owned > 0 
            ? (($currentYearStats->total_owned - $previousYearStats->total_owned) / $previousYearStats->total_owned) * 100 
            : 0;

        $current_total_lost_change_percentage = $previousYearStats->total_lost > 0 
            ? (($currentYearStats->total_lost - $previousYearStats->total_lost) / $previousYearStats->total_lost) * 100 
            : 0;

        return [
            'date_from' => Carbon::createFromDate($year, 1, 1)->format('M d, Y'),
            'date_to' => Carbon::createFromDate($year, 12, 31)->format('M d, Y'),
            'total_created' => $currentYearStats->total_created,
            'total_owned' => $currentYearStats->total_owned,
            'total_lost' => $currentYearStats->total_lost,
            'total_created_change_percentage' => $current_total_created_change_percentage,
            'total_owned_change_percentage' => $current_total_owned_change_percentage,
            'total_lost_change_percentage' => $current_total_lost_change_percentage,
        ];
    }
    public static function getDashboardStatsForChart($year = null, $pipeline_id = null) {
        if (!$year) {
            $year = now()->year;
        }

        $monthlyStats = self::getDashboardStats($year, $pipeline_id);

        return [
            'date_from' => $monthlyStats['date_from'],
            'date_to' => $monthlyStats['date_to'],
            'total_created' => $monthlyStats['total_created'],
            'total_owned' => $monthlyStats['total_owned'],
            'total_lost' => $monthlyStats['total_lost'],
            'total_created_change_percentage' => round($monthlyStats['total_created_change_percentage'], 2),
            'total_owned_change_percentage' => round($monthlyStats['total_owned_change_percentage'], 2),
            'total_lost_change_percentage' => round($monthlyStats['total_lost_change_percentage'], 2),
        ];
    }

    public static function getCreatedVsClosedStats($year = null, $pipeline_id = null) {

        $query = self::getDealReport($pipeline_id);

        // Get owned deals (status = 2 and won_date in the specified year)
        $ownedDeals = (clone $query)
            ->where('deals.status', 2)
            ->whereYear('deals.won_date', $year)
            ->selectRaw('MONTH(deals.won_date) as month, COUNT(*) as count')
            ->groupBy('month')
            ->pluck('count', 'month')
            ->toArray();

        // Get lost deals (status = 3 and lost_date in the specified year)
        $lostDeals = (clone $query)
            ->where('deals.status', 3)
            ->whereYear('deals.lost_date', $year)
            ->selectRaw('MONTH(deals.lost_date) as month, COUNT(*) as count')
            ->groupBy('month')
            ->pluck('count', 'month')
            ->toArray();

        // Get total created deals (created_at in the specified year)
        $totalCreated = (clone $query)
            ->whereYear('deals.created_at', $year)
            ->selectRaw('MONTH(deals.created_at) as month, COUNT(*) as count')
            ->groupBy('month')
            ->pluck('count', 'month')
            ->toArray();

        // Determine how many months to include
        $maxMonth = 12;
        if ($year == now()->year) {
            $maxMonth = now()->month;
        }

        // Initialize result array with months up to maxMonth
        $result = [];
        for ($month = 1; $month <= $maxMonth; $month++) {
            $result[$month] = [
                'total_closed' => ($ownedDeals[$month] ?? 0) + ($lostDeals[$month] ?? 0),
                'total_created' => $totalCreated[$month] ?? 0,
            ];
        }
        return $result;
    }
    public static function getCreatedVsClosedForChart($year = null, $pipeline_id = null) {
        if (!$year) {
            $year = now()->year;
        }

        $monthlyStats = self::getCreatedVsClosedStats($year, $pipeline_id);

        $monthNames = [
            1 => 'Jan', 2 => 'Feb', 3 => 'Mar', 4 => 'Apr',
            5 => 'May', 6 => 'June', 7 => 'July', 8 => 'Aug',
            9 => 'Sep', 10 => 'Oct', 11 => 'Nov', 12 => 'Dec'
        ];

        $categories = [];
        $totalCreatedData = [];
        $totalClosedData = [];

        // foreach ($monthlyStats as $month => $stats) {
        //     $categories[] = $monthNames[$month];
        //     $totalCreatedData[] = $stats['total_created'];
        //     $totalClosedData[] = $stats['total_closed'];
        // }

        foreach($monthNames as $index => $month) {
            $categories[] = $month;
            $totalCreatedData[] = isset($monthlyStats[$index]['total_created']) ? $monthlyStats[$index]['total_created'] : 0;
            $totalClosedData[] = isset($monthlyStats[$index]['total_closed']) ? $monthlyStats[$index]['total_closed'] : 0;
        }

        return [
            'categories' => $categories,
            'series' => [
                [
                    'name' => 'Total Created',
                    'data' => $totalCreatedData,
                    'type' => 'column'
                ],
                [
                    'name' => 'Total Closed',
                    'data' => $totalClosedData,
                    'type' => 'line'
                ]
            ]
        ];
    }

    public static function getMonthlyStatsByCreatedDate($year = null, $pipeline_id = null) {

        $query = self::getDealReport($pipeline_id);

        // Get total created deals (created_at in the specified year)
        $totalCreated = (clone $query)
            ->whereYear('deals.created_at', $year)
            ->selectRaw('MONTH(deals.created_at) as month, COUNT(*) as count')
            ->groupBy('month')
            ->pluck('count', 'month')
            ->toArray();

        // Get owned deals (status = 2) that were created in the specified year
        $ownedDeals = (clone $query)
            ->where('deals.status', 2)
            ->whereYear('deals.created_at', $year)
            ->selectRaw('MONTH(deals.created_at) as month, COUNT(*) as count')
            ->groupBy('month')
            ->pluck('count', 'month')
            ->toArray();

        // Get lost deals (status = 3) that were created in the specified year
        $lostDeals = (clone $query)
            ->where('deals.status', 3)
            ->whereYear('deals.created_at', $year)
            ->selectRaw('MONTH(deals.created_at) as month, COUNT(*) as count')
            ->groupBy('month')
            ->pluck('count', 'month')
            ->toArray();

        // Get open deals (status = 1) that were created in the specified year
        $openDeals = (clone $query)
            ->where('deals.status', 1)
            ->whereYear('deals.created_at', $year)
            ->selectRaw('MONTH(deals.created_at) as month, COUNT(*) as count')
            ->groupBy('month')
            ->pluck('count', 'month')
            ->toArray();

        // Determine how many months to include
        $maxMonth = 12;
        if ($year == now()->year) {
            $maxMonth = now()->month;
        }

        // Initialize result array with months up to maxMonth
        $result = [];
        for ($month = 1; $month <= $maxMonth; $month++) {
            $result[$month] = [
                'owned' => $ownedDeals[$month] ?? 0,
                'lost' => $lostDeals[$month] ?? 0,
                'open' => $openDeals[$month] ?? 0,
                'total_created' => $totalCreated[$month] ?? 0,
            ];
        }

        return $result;
    }
    public static function getMonthlyStatsForChart($year = null, $pipeline_id = null) {
        if (!$year) {
            $year = now()->year;
        }

        $monthlyStats = self::getMonthlyStatsByCreatedDate($year, $pipeline_id);
        
        // Get month names for categories
        $monthNames = [
            1 => 'Jan', 2 => 'Feb', 3 => 'Mar', 4 => 'Apr',
            5 => 'May', 6 => 'June', 7 => 'July', 8 => 'Aug',
            9 => 'Sep', 10 => 'Oct', 11 => 'Nov', 12 => 'Dec'
        ];

        $categories = [];
        $ownedData = [];
        $lostData = [];
        $openData = [];
        $totalCreatedData = [];

        // foreach ($monthlyStats as $month => $stats) {
        //     $categories[] = $monthNames[$month];
        //     $ownedData[] = $stats['owned'];
        //     $lostData[] = $stats['lost'];
        //     $openData[] = $stats['open'];
        //     $totalCreatedData[] = $stats['total_created'];
        // }


        foreach($monthNames as $index => $month) {
            $categories[] = $month;
            $totalCreatedData[] = isset($monthlyStats[$index]['total_created']) ? $monthlyStats[$index]['total_created'] : 0;
            $openData[] = isset($monthlyStats[$index]['open']) ? $monthlyStats[$index]['open'] : 0;
            $ownedData[] = isset($monthlyStats[$index]['owned']) ? $monthlyStats[$index]['owned'] : 0;
            $lostData[] = isset($monthlyStats[$index]['lost']) ? $monthlyStats[$index]['lost'] : 0;
        }


        return [
            'categories' => $categories,
            'series' => [
                [
                    'name' => 'Total Created',
                    'data' => $totalCreatedData,
                    'type' => 'column',
                ],
                [
                    'name' => 'Open',
                    'data' => $openData,
                    'type' => 'column',
                    'stack' => 'stacked'
                ],
                [
                    'name' => 'Owned',
                    'data' => $ownedData,
                    'type' => 'column',
                    'stack' => 'stacked'
                ],
                [
                    'name' => 'Lost',
                    'data' => $lostData,
                    'type' => 'column',
                    'stack' => 'stacked'
                ]
            ]
        ];
    }
    // End of Methods for Dashboard


    //Methods for Report
    public static function getDealStatusStats($from_date = null, $to_date = null, $pipeline_id = null, $pipeline_user_id = null, $status = null, $paginate = false) {
        $query = self::getDealReport($pipeline_id);

        // Apply date filters
        if ($from_date && $to_date) {
            if($status == 2) {
                $query->whereBetween('deals.won_date', [$from_date, $to_date]);
            } else if($status == 3) {
                $query->whereBetween('deals.lost_date', [$from_date, $to_date]);
            } else {
                $query->whereBetween('deals.created_at', [$from_date, $to_date]);
            }
        }

        // Apply pipeline user filter (if not 'all' or '-')
        if ($pipeline_user_id && $pipeline_user_id !== '-' && $pipeline_user_id !== 'all') {
            $query->where('deals.owner_id', $pipeline_user_id);
        }

        // Apply status filter
        if ($status && $status !== 'all') {
            $query->where('deals.status', $status);
        }

        if($paginate) {
            return $query->join('users', 'users.id', '=', 'deals.owner_id')
            ->select('users.id as user_id', 'users.name as user_name')
            ->selectRaw('COUNT(deals.id) as deal_count, SUM(deals.amount) as total_amount, round(AVG(deals.amount), 2) as avg_amount')
            ->groupBy('users.id', 'users.name')
            ->orderBy('deal_count', 'desc')
            ->paginate(20);
        }

        // Join with users table and group by user
        $results = $query->join('users', 'users.id', '=', 'deals.owner_id')
            ->select('users.id as user_id', 'users.name as user_name')
            ->selectRaw('COUNT(deals.id) as deal_count, SUM(deals.amount) as total_amount')
            ->groupBy('users.id', 'users.name')
            ->orderBy('deal_count', 'desc')
            ->get();

        return $results;
    }

    public static function getDealStatusStatsForChart($from_date = null, $to_date = null, $pipeline_id = null, $pipeline_user_id = null, $status = null) {
        $stats = self::getDealStatusStats($from_date, $to_date, $pipeline_id, $pipeline_user_id, $status);

        $categories = [];
        $countData = [];
        $amountData = [];
        
        foreach ($stats as $stat) {
            $categories[] = $stat->user_name;
            $countData[] = (int) $stat->deal_count;
            $amountData[] = (int) $stat->total_amount;
        }

        return [
            'status' => [
                'categories' => $categories,
                'series' => [
                    [
                        'name' => 'Deal Count',
                        'data' => $countData
                    ]
                ]
            ],
            'amount' => [
                'categories' => $categories,
                'series' => [
                    [
                        'name' => 'Total Amount',
                        'data' => $amountData
                    ]
                ]
            ]
        ];
    }

    public static function getDealsRewardedStats($from_date = null, $to_date = null, $pipeline_id = null, $pipeline_user_id = null, $status = null, $paginate = false) {
        $query = self::getDealReport($pipeline_id);

        // Apply date filters
        if ($from_date && $to_date) {
            if($status == 2) {
                $query->whereBetween('deals.won_date', [$from_date, $to_date]);
            } else if($status == 3) {
                $query->whereBetween('deals.lost_date', [$from_date, $to_date]);
            } else {
                $query->whereBetween('deals.created_at', [$from_date, $to_date]);
            }

            $query->whereBetween('deals.owner_rewarded_at', [$from_date, $to_date]);
        }

        // Apply pipeline user filter (if not 'all' or '-')
        if ($pipeline_user_id && $pipeline_user_id !== '-' && $pipeline_user_id !== 'all') {
            $query->where('deals.owner_id', $pipeline_user_id);
        }

        // Apply status filter
        if ($status && $status !== 'all') {
            $query->where('deals.status', $status);
        }

        if($paginate) {
            return $query->join('users', 'users.id', '=', 'deals.owner_id')
            ->select('users.id as user_id', 'users.name as user_name')
            ->selectRaw('COUNT(deals.id) as deal_count')
            ->groupBy('users.id', 'users.name')
            ->orderBy('deal_count', 'desc')
            ->paginate(20);
        }

        // Join with users table and group by user
        $results = $query->join('users', 'users.id', '=', 'deals.owner_id')
            ->select('users.id as user_id', 'users.name as user_name')
            ->selectRaw('COUNT(deals.id) as deal_count')
            ->groupBy('users.id', 'users.name')
            ->orderBy('deal_count', 'desc')
            ->get();

        return $results;
    }

    public static function getDealsRewardedStatsForChart($from_date = null, $to_date = null, $pipeline_id = null, $pipeline_user_id = null, $status = null) {
        $stats = self::getDealsRewardedStats($from_date, $to_date, $pipeline_id, $pipeline_user_id, $status);
        
        $categories = [];
        $countData = [];
        $amountData = [];
        
        foreach ($stats as $stat) {
            $categories[] = $stat->user_name;
            $countData[] = (int) $stat->deal_count;
        }

        return [
            'status' => [
                'categories' => $categories,
                'series' => [
                    [
                        'name' => 'Deal Count',
                        'data' => $countData
                    ]
                ]
            ]
        ];
    }
    // End of Methods for Report

}
