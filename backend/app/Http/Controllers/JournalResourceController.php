<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Filter;
use App\Models\User;
use App\Models\Deal;
use App\Models\Paper;
use App\Models\Activity;
use App\Models\PaperProcessing;
use App\Models\ProcessRevision;
use App\Models\ProcessProof;
use App\Models\MasterDomain;
use App\Models\MasterService;
use App\Models\MasterPublisher;
use App\Models\MasterJournal;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Auth;
use Carbon\Carbon;
use App\Rules\IsoDate;
use Validator;
use Setting;
use Config;

use App\Sigapps\Filters\Text as TextFilter;

class JournalResourceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        if ($request->ajax()) {
            $query = Paper::getVisiblePapers()
                ->applyFilter($request->all(), 'papers')
                ->applySort($request->all(), 'papers');

            $papers = $query->select(
                    'papers.*', 
                    'parent.id as deal_id',
                    'parent.name',
                    'client.name as client_name'
                )
                ->with('domain:id,name')
                ->with('service:id,name')
                ->with('processing:paper_id,publisher_id,journal_id,submission_date,due_date,status,extra_info')
                ->with('processing.journal:id,journal_name')
                ->with('processing.publisher:id,name')
                ->with('processing.publisher:id,name')
                ->with('processing.submission:id,processing_id,revised_by,activity_id')
                ->with(['processing.current_revision' => function($query){
                    $query->with([
                        'staff:id,name', 
                        'activity' => function ($query) {
                            $query->select('id', 'title')->withCount('comments');
                        }
                    ]);
                }])
                ->paginate($request->per_page);
            return $this->response($papers, '');
        }

        return view('admin.payment.index');
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
        $rule = [
            'journalable_id' => 'required',
            'paper' => 'required',
            'domain_id' => 'required',
            'service_id' => 'required',
            'confirmation_date' => ['nullable', new IsoDate],
            'deadline' => ['nullable', new IsoDate],
        ];

        $validator = Validator::make($request->all(), $rule);
        if ($validator->fails()) { 
            return $this->response(null, $validator->errors()->first(), $validator->errors()->toArray(), 422);
        }

        DB::beginTransaction();
        try {
            $existingDeal = Deal::where('id', $request->journalable_id)->first();
            if(is_null($existingDeal)) {
                return $this->response(null, 'Deal not valid', [], 400);
            }
            $deal_id = !is_null($existingDeal->parent_id) ? $existingDeal->parent_id : $existingDeal->id;

            $paper = new Paper;
            $paper->id                  = (string) Str::uuid();
            $paper->journalable_type    = Deal::class;
            $paper->journalable_id      = $deal_id;
            $paper->owner_id            = Auth::id();
            $paper->domain_id           = $request->domain_id;
            $paper->service_id          = $request->service_id;
            $paper->paper               = $request->paper;
            $paper->confirmation_date   = ( $request->has('confirmation_date') && $request->confirmation_date != '' ) ? Carbon::parse($request->confirmation_date)->setTimezone('Asia/Kolkata')->endOfDay()->format('Y-m-d H:i:s') : NULL;
            $paper->deadline            = ( $request->has('deadline') && $request->deadline != '' ) ? Carbon::parse($request->deadline)->setTimezone('Asia/Kolkata')->endOfDay()->format('Y-m-d H:i:s') : NULL;
            $paper->save();

            $assignedIds[Auth::id()] = ['is_paper_owner' => true];
            if($request->has('users') && is_array($request->users)) {
                foreach($request->users as $usr) {
                    $usr_id = $usr['id'];
                    $assignedIds[$usr_id] = ['is_paper_owner' => false];
                }
            }
            $paper->users()->attach($assignedIds);
            DB::commit();

            return $this->response($this->getPapers($deal_id), '');
        } catch (\Exception $e) {
            DB::rollback();
            return $this->response(null, 'Something went wrong', [], 400);
        }
    }


    public function storeProcessing(Request $request)
    {
        $rule = [
            'paper_id' => 'required',
            'publisher_id' => 'required',
            'journal_id' => 'required',
            'due_date' => ['nullable', new IsoDate],
            'submission_date' => ['nullable', new IsoDate],
        ];

        if($request->has('revised_by') && $request->revised_by !== '') {
            if($request->has('fetch_as') && $request->fetch_as === 'existing') {
                $rule['activity_id'] = 'required';
            }
        }

        $validator = Validator::make($request->all(), $rule);
        if ($validator->fails()) { 
            return $this->response(null, $validator->errors()->first(), $validator->errors()->toArray(), 422);
        }

        DB::beginTransaction();
        try {
            $existingPaper = Paper::where('id', $request->paper_id)->first();
            if(is_null($existingPaper)) {
                return $this->response(null, 'Paper not valid', [], 400);
            }

            $existingDeal = Deal::where('id', $existingPaper->journalable_id)->first();
            if(is_null($existingDeal)) {
                return $this->response(null, 'Deal not valid', [], 400);
            }
            $deal_id = !is_null($existingDeal->parent_id) ? $existingDeal->parent_id : $existingDeal->id;
            $module = (!is_null($existingDeal->parentDeal) && isset($existingDeal->parentDeal->id)) ? $existingDeal->parentDeal : $existingDeal;

            $processing = new PaperProcessing;
            $processing->id                 = (string) Str::uuid();
            $processing->paper_id           = $existingPaper->id;
            $processing->publisher_id       = $request->publisher_id;
            $processing->journal_id         = $request->journal_id;
            $processing->url                = ($request->has('url') && $request->url !== '') ? $request->url : null;
            $processing->submission_date    = ( $request->has('submission_date') && $request->submission_date != '' ) ? Carbon::parse($request->submission_date)->setTimezone('Asia/Kolkata')->endOfDay()->format('Y-m-d H:i:s') : NULL;
            $processing->due_date           = ( $request->has('due_date') && $request->due_date != '' ) ? Carbon::parse($request->due_date)->setTimezone('Asia/Kolkata')->endOfDay()->format('Y-m-d H:i:s') : NULL;
            $processing->status             = ( $request->has('process_status') && $request->process_status != '' ) ? $request->process_status : '';
            $processing->extra_info         = ( $request->has('extra_info') && $request->extra_info ) ? $request->extra_info : NULL;
            $processing->save();

            $revision = new ProcessRevision;
            $revision->id                   = (string) Str::uuid();
            $revision->revision_type        = 'submission';
            $revision->submission_date      = ( $request->has('submission_date') && $request->submission_date != '' ) ? Carbon::parse($request->submission_date)->setTimezone('Asia/Kolkata')->endOfDay()->format('Y-m-d H:i:s') : NULL;
            $revision->due_date             = ( $request->has('due_date') && $request->due_date != '' ) ? Carbon::parse($request->due_date)->setTimezone('Asia/Kolkata')->endOfDay()->format('Y-m-d H:i:s') : NULL;
            $revision->status               = ( $request->has('status') && $request->status != '' ) ? $request->status : '';
            $revision->processing_id        = $processing->id;
            $revision->revised_by           = ($request->has('revised_by') && $request->revised_by != '') ? $request->revised_by : null;
            $revision->serial               = 1;
            $revision->save();

            $processing->current_revision_id    = $revision->id;
            $processing->save();

            $activity_id = NULL;
            if($request->has('revised_by') && $request->revised_by !== '' && $request->enable_task_attach !== false) {
                $activity_id = $request->has('activity_id') && $request->activity_id !== '' ? $request->activity_id : NULL;
                if($request->has('fetch_as') && $request->fetch_as === 'new') {
                    
                    $activityEntry = [
                        'id' => (string) Str::uuid(),
                        'owner_id' => Auth::id(),
                        'title' => $processing->publisher->name.' - Submission',
                        'activity_type_id' => Setting::get('task_id', null), //Change dynamic
                        'start_time' => Carbon::today(),
                        'end_time' => (!is_null($existingPaper->deadline) && $existingPaper->deadline !== '') ? $existingPaper->deadline : Carbon::today()->addDays(15),
                        'reminder_in_minutes' => 0,
                        'reminder_minutes' => 0,
                        'reminder_type' => 'minutes',
                        'description' => '',
                        'note' => '',
                        'completed' => 0,
                        'completed_at' => NULL,
                        'activity_percentage' => 0
                    ];
                    $activity = Activity::create($activityEntry);

                    $activity->activitable()->associate($module);
                    $activity->save();

                    $owner_id               = Auth::id();
                    $assigned_user          = $request->revised_by;
                    $assignedIds[$owner_id] = ['is_activity_owner' => true];
                    $assignedIds[$assigned_user] = ['is_activity_owner' => false];
                    $activity->users()->attach($assignedIds);

                    $activity_id = $activity->id;
                }

                $revision->activity_id          = $activity_id;
                $revision->save();
            }

            DB::commit();
            return $this->response($this->getPapers($deal_id), '');
        } catch (\Exception $e) {
            DB::rollback();
            return $this->response(null, 'Something went wrong', [], 400);
        }
    }

    
    public function updateProcessing(Request $request, string $id) {
        $rule = [
            'publisher_id' => 'required',
            'journal_id' => 'required',
            'due_date' => ['nullable', new IsoDate],
            'submission_date' => ['nullable', new IsoDate],
        ];

        if($request->has('revised_by') && $request->revised_by !== '') {
            if($request->has('fetch_as') && $request->fetch_as === 'existing') {
                $rule['activity_id'] = 'required';
            }
        }

        $validator = Validator::make($request->all(), $rule);
        if ($validator->fails()) { 
            return $this->response(null, $validator->errors()->first(), $validator->errors()->toArray(), 422);
        }

        DB::beginTransaction();
        try {
            $processing = PaperProcessing::where('id', $id)->first();
            if(is_null($processing)) {
                return $this->response(null, 'Process entry not valid', [], 400);
            }

            $existingPaper = Paper::where('id', $processing->paper_id)->first();
            if(is_null($existingPaper)) {
                return $this->response(null, 'Paper not valid', [], 400);
            }

            $existingDeal = Deal::where('id', $existingPaper->journalable_id)->first();
            if(is_null($existingDeal)) {
                return $this->response(null, 'Deal not valid', [], 400);
            }
            $deal_id = !is_null($existingDeal->parent_id) ? $existingDeal->parent_id : $existingDeal->id;
            $module = (!is_null($existingDeal->parentDeal) && isset($existingDeal->parentDeal->id)) ? $existingDeal->parentDeal : $existingDeal;

            $processing->publisher_id       = $request->publisher_id;
            $processing->journal_id         = $request->journal_id;
            $processing->url                = ($request->has('url') && $request->url !== '') ? $request->url : null;
            $processing->submission_date    = ( $request->has('submission_date') && $request->submission_date != '' ) ? Carbon::parse($request->submission_date)->setTimezone('Asia/Kolkata')->endOfDay()->format('Y-m-d H:i:s') : NULL;
            $processing->due_date           = ( $request->has('due_date') && $request->due_date != '' ) ? Carbon::parse($request->due_date)->setTimezone('Asia/Kolkata')->endOfDay()->format('Y-m-d H:i:s') : NULL;
            $processing->status             = ( $request->has('process_status') && $request->process_status != '' ) ? $request->process_status : '';
            $processing->extra_info         = ( $request->has('extra_info') && $request->extra_info ) ? $request->extra_info : NULL;
            $processing->shared             = ( $request->has('shared') && $request->shared === true ) ? true : false;
            $processing->save();

            DB::commit();
            return $this->response($this->getPapers($deal_id), '');
        } catch (\Exception $e) {
            DB::rollback();
            return $this->response(null, 'Something went wrong', [], 400);
        }
    }


    public function storeProcessRevision(Request $request)
    {
        $rule = [
            'processing_id' => 'required',
            'due_date' => ['nullable', new IsoDate],
            'submission_date' => ['nullable', new IsoDate],
        ];

        if($request->has('revised_by') && $request->revised_by !== '') {
            if($request->has('fetch_as') && $request->fetch_as === 'existing') {
                $rule['activity_id'] = 'required';
            }
        }

        $validator = Validator::make($request->all(), $rule);
        if ($validator->fails()) { 
            return $this->response(null, $validator->errors()->first(), $validator->errors()->toArray(), 422);
        }

        DB::beginTransaction();
        try {
            $existingProcessing = PaperProcessing::where('id', $request->processing_id)->first();
            if(is_null($existingProcessing)) {
                return $this->response(null, 'Processing not valid', [], 400);
            }

            $existingPaper = Paper::where('id', $existingProcessing->paper_id)->first();
            if(is_null($existingPaper)) {
                return $this->response(null, 'Paper not valid', [], 400);
            }

            $existingDeal = Deal::where('id', $existingPaper->journalable_id)->first();
            if(is_null($existingDeal)) {
                return $this->response(null, 'Deal not valid', [], 400);
            }

            $deal_id = !is_null($existingDeal->parent_id) ? $existingDeal->parent_id : $existingDeal->id;
            $module = (!is_null($existingDeal->parentDeal) && isset($existingDeal->parentDeal->id)) ? $existingDeal->parentDeal : $existingDeal;

            $revisionCount = ProcessRevision::where('processing_id', $existingProcessing->id)
                ->where('revision_type', 'revision')
                ->count() + 1;

            $revision = new ProcessRevision;
            $revision->id                   = (string) Str::uuid();
            $revision->revision_type        = 'revision';
            $revision->submission_date      = ( $request->has('submission_date') && $request->submission_date != '' ) ? Carbon::parse($request->submission_date)->setTimezone('Asia/Kolkata')->endOfDay()->format('Y-m-d H:i:s') : NULL;
            $revision->due_date             = ( $request->has('due_date') && $request->due_date != '' ) ? Carbon::parse($request->due_date)->setTimezone('Asia/Kolkata')->endOfDay()->format('Y-m-d H:i:s') : NULL;
            $revision->status               = ( $request->has('status') && $request->status != '' ) ? $request->status : '';
            $revision->processing_id        = $existingProcessing->id;
            $revision->revised_by           = ($request->has('revised_by') && $request->revised_by != '') ? $request->revised_by : null;
            $revision->serial               = $revisionCount;
            $revision->save();

            $existingProcessing->current_revision_id    = $revision->id;
            $existingProcessing->save();

            $activity_id = NULL;
            if($request->has('revised_by') && $request->revised_by !== '' && $request->enable_task_attach !== false) {
                $activity_id = $request->has('activity_id') && $request->activity_id !== '' ? $request->activity_id : NULL;
                if($request->has('fetch_as') && $request->fetch_as === 'new') {
                    
                    $activityEntry = [
                        'id' => (string) Str::uuid(),
                        'owner_id' => Auth::id(),
                        'title' => $existingProcessing->publisher->name.' - Revision #'.$revisionCount,
                        'activity_type_id' => Setting::get('sub_task_id', null), //Change dynamic
                        'start_time' => Carbon::today(),
                        'end_time' => (!is_null($existingPaper->deadline) && $existingPaper->deadline !== '') ? $existingPaper->deadline : Carbon::today()->addDays(15),
                        'reminder_in_minutes' => 0,
                        'reminder_minutes' => 0,
                        'reminder_type' => 'minutes',
                        'description' => '',
                        'note' => '',
                        'completed' => 0,
                        'completed_at' => NULL,
                        'activity_percentage' => 0
                    ];
                    $activity = Activity::create($activityEntry);

                    $activity->activitable()->associate($module);
                    $activity->save();

                    $owner_id               = Auth::id();
                    $assigned_user          = $request->revised_by;
                    $assignedIds[$owner_id] = ['is_activity_owner' => true];
                    $assignedIds[$assigned_user] = ['is_activity_owner' => false];
                    $activity->users()->attach($assignedIds);

                    $activity_id = $activity->id;
                }

                $revision->activity_id          = $activity_id;
                $revision->save();
            }
            DB::commit();

            return $this->response($this->getPapers($deal_id), '');
        } catch (\Exception $e) {
            DB::rollback();
            return $this->response(null, 'Something went wrong', [], 400);
        }
    }

    
    public function updateProcessRevision(Request $request, string $id) {
        $rule = [
            'processing_id' => 'required',
            'due_date' => ['nullable', new IsoDate],
            'submission_date' => ['nullable', new IsoDate],
        ];

        if($request->has('revised_by') && $request->revised_by !== '') {
            if($request->has('fetch_as') && $request->fetch_as === 'existing') {
                $rule['activity_id'] = 'required';
            }
        }

        $validator = Validator::make($request->all(), $rule);
        if ($validator->fails()) { 
            return $this->response(null, $validator->errors()->first(), $validator->errors()->toArray(), 422);
        }
       
        
        DB::beginTransaction();
        try {
            $revision = ProcessRevision::where('id', $id)->first();
            if(is_null($revision)) {
                return $this->response(null, 'Entry not valid', [], 400);
            }

            $existingProcessing = PaperProcessing::where('id', $revision->processing_id)->first();
            if(is_null($existingProcessing)) {
                return $this->response(null, 'Processing not valid', [], 400);
            }

            $existingPaper = Paper::where('id', $existingProcessing->paper_id)->first();
            if(is_null($existingPaper)) {
                return $this->response(null, 'Paper not valid', [], 400);
            }

            $existingDeal = Deal::where('id', $existingPaper->journalable_id)->first();
            if(is_null($existingDeal)) {
                return $this->response(null, 'Deal not valid', [], 400);
            }

            $deal_id = !is_null($existingDeal->parent_id) ? $existingDeal->parent_id : $existingDeal->id;
            $module = (!is_null($existingDeal->parentDeal) && isset($existingDeal->parentDeal->id)) ? $existingDeal->parentDeal : $existingDeal;

            $revision->submission_date      = ( $request->has('submission_date') && $request->submission_date != '' ) ? Carbon::parse($request->submission_date)->setTimezone('Asia/Kolkata')->endOfDay()->format('Y-m-d H:i:s') : NULL;
            $revision->due_date             = ( $request->has('due_date') && $request->due_date != '' ) ? Carbon::parse($request->due_date)->setTimezone('Asia/Kolkata')->endOfDay()->format('Y-m-d H:i:s') : NULL;
            $revision->status               = ( $request->has('status') && $request->status != '' ) ? $request->status : '';
            $revision->processing_id        = $existingProcessing->id;
            $revision->revised_by           = ($request->has('revised_by') && $request->revised_by != '') ? $request->revised_by : null;
            $revision->save();

            $activity_id = NULL;
            if($request->has('revised_by') && $request->revised_by !== '' && $request->enable_task_attach !== false) {
                $activity_id = $request->has('activity_id') && $request->activity_id !== '' ? $request->activity_id : NULL;
                if($request->has('fetch_as') && $request->fetch_as === 'new') {
                    
                    $activityEntry = [
                        'id' => (string) Str::uuid(),
                        'owner_id' => Auth::id(),
                        'start_time' => Carbon::today(),
                        'end_time' => (!is_null($existingPaper->deadline) && $existingPaper->deadline !== '') ? $existingPaper->deadline : Carbon::today()->addDays(15),
                        'reminder_in_minutes' => 0,
                        'reminder_minutes' => 0,
                        'reminder_type' => 'minutes',
                        'description' => '',
                        'note' => '',
                        'completed' => 0,
                        'completed_at' => NULL,
                        'activity_percentage' => 0
                    ];

                    $activityEntry['title']             = $existingProcessing->publisher->name.' - Submission';
                    $activityEntry['activity_type_id']  = Setting::get('task_id', null);
                    if($revision->revision_type === 'revision') {
                        $revisionCount = ProcessRevision::where('processing_id', $existingProcessing->id)
                            ->where('revision_type', 'revision')
                            ->count();

                        $activityEntry['title']             = $existingProcessing->publisher->name.' - Revision #'.$revisionCount;
                        $activityEntry['activity_type_id']  = Setting::get('sub_task_id', null);
                    }
                    $activity = Activity::create($activityEntry);

                    $activity->activitable()->associate($module);
                    $activity->save();

                    $owner_id               = Auth::id();
                    $assigned_user          = $request->revised_by;
                    $assignedIds[$owner_id] = ['is_activity_owner' => true];
                    $assignedIds[$assigned_user] = ['is_activity_owner' => false];
                    $activity->users()->attach($assignedIds);

                    $activity_id = $activity->id;
                }

                $revision->activity_id          = $activity_id;
                $revision->save();
            }
            DB::commit();

            return $this->response($this->getPapers($deal_id), '');
        } catch (\Exception $e) {
            DB::rollback();
            return $this->response(null, 'Something went wrong', [], 400);
        }
    }






    public function storeProcessProof(Request $request)
    {
        $rule = [
            'processing_id' => 'required',
            'accepted_date' => ['nullable', new IsoDate]
        ];

        $validator = Validator::make($request->all(), $rule);
        if ($validator->fails()) { 
            return $this->response(null, $validator->errors()->first(), $validator->errors()->toArray(), 422);
        }

        DB::beginTransaction();
        try {
            $existingProcessing = PaperProcessing::where('id', $request->processing_id)->first();
            if(is_null($existingProcessing)) {
                return $this->response(null, 'Processing not valid', [], 400);
            }

            $existingPaper = Paper::where('id', $existingProcessing->paper_id)->first();
            if(is_null($existingPaper)) {
                return $this->response(null, 'Paper not valid', [], 400);
            }

            $existingDeal = Deal::where('id', $existingPaper->journalable_id)->first();
            if(is_null($existingDeal)) {
                return $this->response(null, 'Deal not valid', [], 400);
            }

            $deal_id = !is_null($existingDeal->parent_id) ? $existingDeal->parent_id : $existingDeal->id;
            $module = (!is_null($existingDeal->parentDeal) && isset($existingDeal->parentDeal->id)) ? $existingDeal->parentDeal : $existingDeal;

            $proof = new ProcessProof;
            $proof->id                      = (string) Str::uuid();
            $proof->processing_id           = $existingProcessing->id;
            $proof->accepted_date           = ( $request->has('accepted_date') && $request->accepted_date != '' ) ? Carbon::parse($request->accepted_date)->setTimezone('Asia/Kolkata')->endOfDay()->format('Y-m-d H:i:s') : NULL;
            $proof->copyright_status        = ( $request->has('copyright_status') && $request->copyright_status != '' ) ? $request->copyright_status : NULL;
            $proof->proof_status            = ( $request->has('proof_status') && $request->proof_status != '' ) ? $request->proof_status : NULL;
            $proof->final_status            = ( $request->has('final_status') && $request->final_status != '' ) ? $request->final_status : NULL;
            $proof->save();
            DB::commit();

            return $this->response($this->getPapers($deal_id), '');
        } catch (\Exception $e) {
            DB::rollback();
            return $this->response(null, 'Something went wrong', [], 400);
        }
    }

    public function updateProcessProof(Request $request, string $id)
    {
        $rule = [
            'processing_id' => 'required',
            'accepted_date' => ['nullable', new IsoDate]
        ];

        $validator = Validator::make($request->all(), $rule);
        if ($validator->fails()) { 
            return $this->response(null, $validator->errors()->first(), $validator->errors()->toArray(), 422);
        }

        DB::beginTransaction();
        try {
            $proof = ProcessProof::where('id', $id)->first();
            if(is_null($proof)) {
                return $this->response(null, 'Entry not valid', [], 400);
            }

            $existingProcessing = PaperProcessing::where('id', $proof->processing_id)->first();
            if(is_null($existingProcessing)) {
                return $this->response(null, 'Processing not valid', [], 400);
            }

            $existingPaper = Paper::where('id', $existingProcessing->paper_id)->first();
            if(is_null($existingPaper)) {
                return $this->response(null, 'Paper not valid', [], 400);
            }

            $existingDeal = Deal::where('id', $existingPaper->journalable_id)->first();
            if(is_null($existingDeal)) {
                return $this->response(null, 'Deal not valid', [], 400);
            }

            $deal_id = !is_null($existingDeal->parent_id) ? $existingDeal->parent_id : $existingDeal->id;
            $module = (!is_null($existingDeal->parentDeal) && isset($existingDeal->parentDeal->id)) ? $existingDeal->parentDeal : $existingDeal;

            $proof->accepted_date           = ( $request->has('accepted_date') && $request->accepted_date != '' ) ? Carbon::parse($request->accepted_date)->setTimezone('Asia/Kolkata')->endOfDay()->format('Y-m-d H:i:s') : NULL;
            $proof->copyright_status        = ( $request->has('copyright_status') && $request->copyright_status != '' ) ? $request->copyright_status : NULL;
            $proof->proof_status            = ( $request->has('proof_status') && $request->proof_status != '' ) ? $request->proof_status : NULL;
            $proof->final_status            = ( $request->has('final_status') && $request->final_status != '' ) ? $request->final_status : NULL;
            $proof->save();
            DB::commit();

            return $this->response($this->getPapers($deal_id), '');
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
        //
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
        $rule = [
            'journalable_id' => 'required',
            'paper' => 'required',
            'domain_id' => 'required',
            'service_id' => 'required',
            'confirmation_date' => ['nullable', new IsoDate],
            'deadline' => ['nullable', new IsoDate],
        ];

        $validator = Validator::make($request->all(), $rule);
        if ($validator->fails()) { 
            return $this->response(null, $validator->errors()->first(), $validator->errors()->toArray(), 422);
        }
        
        DB::beginTransaction();
        try {
            $paper = Paper::where('id', $id)->first();
            if(is_null($paper)) {
                return $this->response(null, 'Paper not valid', [], 400);
            }

            $existingDeal = Deal::where('id', $paper->journalable_id)->first();
            if(is_null($existingDeal)) {
                return $this->response(null, 'Deal not valid', [], 400);
            }
            $deal_id = !is_null($existingDeal->parent_id) ? $existingDeal->parent_id : $existingDeal->id;

            $paper->owner_id            = Auth::id();
            $paper->domain_id           = $request->domain_id;
            $paper->service_id          = $request->service_id;
            $paper->paper               = $request->paper;
            $paper->confirmation_date   = ( $request->has('confirmation_date') && $request->confirmation_date != '' ) ? Carbon::parse($request->confirmation_date)->setTimezone('Asia/Kolkata')->endOfDay()->format('Y-m-d H:i:s') : NULL;
            $paper->deadline            = ( $request->has('deadline') && $request->deadline != '' ) ? Carbon::parse($request->deadline)->setTimezone('Asia/Kolkata')->endOfDay()->format('Y-m-d H:i:s') : NULL;
            $paper->save();

            $assignedIds[Auth::id()] = ['is_paper_owner' => true];
            if($request->has('users') && is_array($request->users)) {
                foreach($request->users as $usr) {
                    $usr_id = $usr['id'];
                    $assignedIds[$usr_id] = ['is_paper_owner' => false];
                }
            }
            $paper->users()->sync($assignedIds);
            DB::commit();

            return $this->response($this->getPapers($deal_id), '');
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


    public function getDealPapers(Request $request, $deal_id)
    {
        $deal = Deal::where('id', $deal_id)->first();
        if(is_null($deal)) {
            return $this->response(null, 'Deal not valid', [], 400);
        }
        $deal_id = !is_null($deal->parent_id) ? $deal->parent_id : $deal->id;

        return $this->response($this->getPapers($deal_id), '');
    }


    public function updateSheet(Request $request, string $id) {

        $rule = [
            'due_date' => ['nullable', new IsoDate],
            'submission_date' => ['nullable', new IsoDate],
            'current_revision.due_date' => ['nullable', new IsoDate],
            'current_revision.submission_date' => ['nullable', new IsoDate],
            'current_revision.id' => 'required'
        ];
        $validator = Validator::make($request->all(), $rule);
        if ($validator->fails()) { 
            return $this->response(null, $validator->errors()->first(), $validator->errors()->toArray(), 422);
        }

        DB::beginTransaction();
        try {
            $existingProcessing = PaperProcessing::where('id', $id)->first();
            if(is_null($existingProcessing)) {
                return $this->response(null, 'Process entry not valid', [], 400);
            }

            $revision = ProcessRevision::where('id', $request->current_revision['id'])->first();
            if(is_null($revision)) {
                return $this->response(null, 'Entry not valid', [], 400);
            }

            $existingPaper = Paper::where('id', $existingProcessing->paper_id)->first();
            if(is_null($existingPaper)) {
                return $this->response(null, 'Paper not valid', [], 400);
            }

            $existingDeal = Deal::where('id', $existingPaper->journalable_id)->first();
            if(is_null($existingDeal)) {
                return $this->response(null, 'Deal not valid', [], 400);
            }
            $deal_id = !is_null($existingDeal->parent_id) ? $existingDeal->parent_id : $existingDeal->id;
            $module = (!is_null($existingDeal->parentDeal) && isset($existingDeal->parentDeal->id)) ? $existingDeal->parentDeal : $existingDeal;

            $existingProcessing->submission_date    = ( $request->has('submission_date') && $request->submission_date != '' ) ? Carbon::parse($request->submission_date)->setTimezone('Asia/Kolkata')->endOfDay()->format('Y-m-d H:i:s') : NULL;
            $existingProcessing->due_date           = ( $request->has('due_date') && $request->due_date != '' ) ? Carbon::parse($request->due_date)->setTimezone('Asia/Kolkata')->endOfDay()->format('Y-m-d H:i:s') : NULL;
            $existingProcessing->status             = ( $request->has('publisher_status') && $request->publisher_status != '' ) ? $request->publisher_status : '';
            $existingProcessing->extra_info         = ( $request->has('extra_info') && $request->extra_info ) ? $request->extra_info : NULL;
            $existingProcessing->url                = ( $request->has('url') && $request->url !== '' ) ? $request->url : NULL;
            $existingProcessing->save();


            if($request->has('current_revision')) {
                $revision->submission_date    = ( isset($request->current_revision['submission_date'])  && $request->current_revision['submission_date'] != '' ) ? Carbon::parse($request->current_revision['submission_date'])->setTimezone('Asia/Kolkata')->endOfDay()->format('Y-m-d H:i:s') : NULL;
                $revision->due_date           = ( isset($request->current_revision['due_date'])         && $request->current_revision['due_date'] != '' ) ? Carbon::parse($request->current_revision['due_date'])->setTimezone('Asia/Kolkata')->endOfDay()->format('Y-m-d H:i:s') : NULL;
                $revision->status             = ( isset($request->current_revision['tech_status'])      && $request->current_revision['tech_status'] != '' ) ? $request->current_revision['tech_status'] : '';
                $revision->revised_by         = ( isset($request->current_revision['revised_by'])       && $request->current_revision['revised_by'] != '' ) ? $request->current_revision['revised_by'] : null;
                $revision->save();
    
                $current_activity_id = NULL;
                if( isset($request->current_revision['revised_by']) && $request->current_revision['revised_by'] != '' && $request->current_revision['enable_task_attach'] !== false ) {
                    $current_activity_id = ( isset($request->current_revision['activity_id']) && $request->current_revision['activity_id'] != '') ? $request->current_revision['activity_id'] : NULL;
                    if(is_null($current_activity_id) && isset($request->current_revision['fetch_as']) && $request->current_revision['fetch_as'] === 'new') {
                        
                        $activityEntry = [
                            'id' => (string) Str::uuid(),
                            'owner_id' => Auth::id(),
                            'start_time' => Carbon::today(),
                            'end_time' => (!is_null($existingPaper->deadline) && $existingPaper->deadline !== '') ? $existingPaper->deadline : Carbon::today()->addDays(15),
                            'reminder_in_minutes' => 0,
                            'reminder_minutes' => 0,
                            'reminder_type' => 'minutes',
                            'description' => '',
                            'note' => '',
                            'completed' => 0,
                            'completed_at' => NULL,
                            'activity_percentage' => 0
                        ];
    
                        $activityEntry['title']             = $existingProcessing->publisher->name.' - Submission';
                        $activityEntry['activity_type_id']  = Setting::get('task_id', null);
                        if($revision->revision_type === 'revision') {
                            $revisionCount = ProcessRevision::where('processing_id', $existingProcessing->id)
                                ->where('revision_type', 'revision')
                                ->count();
    
                            $activityEntry['title']             = $existingProcessing->publisher->name.' - Revision #'.$revisionCount;
                            $activityEntry['activity_type_id']  = Setting::get('sub_task_id', null);
                        }
                        $activity = Activity::create($activityEntry);
    
                        $activity->activitable()->associate($module);
                        $activity->save();
    
                        $owner_id               = Auth::id();
                        $assigned_user          = $request->current_revision['revised_by'];
                        $assignedIds[$owner_id] = ['is_activity_owner' => true];
                        $assignedIds[$assigned_user] = ['is_activity_owner' => false];
                        $activity->users()->attach($assignedIds);

                        $current_activity_id = $activity->id;
                    }
    
                    $revision->activity_id          = $current_activity_id;
                    $revision->save();
                }
            }



            if($request->has('next_revision') && isset($request->next_revision['flag']) && $request->next_revision['flag'] == true) {
                $revisionCount = ProcessRevision::where('processing_id', $existingProcessing->id)
                    ->where('revision_type', 'revision')
                    ->count() + 1;

                $new_revision = new ProcessRevision;
                $new_revision->id                   = (string) Str::uuid();
                $new_revision->revision_type        = 'revision';
                $new_revision->submission_date      = ( isset($request->next_revision['submission_date'])   && $request->next_revision['submission_date'] != '' ) ? Carbon::parse($request->next_revision['submission_date'])->setTimezone('Asia/Kolkata')->endOfDay()->format('Y-m-d H:i:s') : NULL;
                $new_revision->due_date             = ( isset($request->next_revision['due_date'])          && $request->next_revision['due_date'] != '' ) ? Carbon::parse($request->next_revision['due_date'])->setTimezone('Asia/Kolkata')->endOfDay()->format('Y-m-d H:i:s') : NULL;
                $new_revision->status               = ( isset($request->next_revision['tech_status'])       && $request->next_revision['tech_status'] != '' ) ? $request->next_revision['tech_status'] : '';
                $new_revision->processing_id        = $existingProcessing->id;
                $new_revision->serial               = $revisionCount;
                $new_revision->save();

                $existingProcessing->current_revision_id    = $new_revision->id;
                $existingProcessing->save();

                $next_activity_id = NULL;
                if( isset($request->next_revision['revised_by']) && $request->next_revision['revised_by'] != '' && $request->next_revision['enable_task_attach'] !== false ) {
                    $next_activity_id = ( isset($request->next_revision['activity_id']) && $request->next_revision['activity_id'] != '') ? $request->next_revision['activity_id'] : NULL;
                    if(isset($request->next_revision['fetch_as']) && $request->next_revision['fetch_as'] === 'new') {
                        
                        $activityEntry = [
                            'id' => (string) Str::uuid(),
                            'title' => $existingProcessing->publisher->name.' - Revision #'.$revisionCount,
                            'activity_type_id' => Setting::get('sub_task_id', null),
                            'owner_id' => Auth::id(),
                            'start_time' => Carbon::today(),
                            'end_time' => (!is_null($existingPaper->deadline) && $existingPaper->deadline !== '') ? $existingPaper->deadline : Carbon::today()->addDays(15),
                            'reminder_in_minutes' => 0,
                            'reminder_minutes' => 0,
                            'reminder_type' => 'minutes',
                            'description' => '',
                            'note' => '',
                            'completed' => 0,
                            'completed_at' => NULL,
                            'activity_percentage' => 0
                        ];
    
                        $activity = Activity::create($activityEntry);
                        $activity->activitable()->associate($module);
                        $activity->save();
    
                        $owner_id               = Auth::id();
                        $assigned_user          = $request->next_revision['revised_by'];
                        $assignedIds[$owner_id] = ['is_activity_owner' => true];
                        $assignedIds[$assigned_user] = ['is_activity_owner' => false];
                        $activity->users()->attach($assignedIds);
                        
                        $next_activity_id = $activity->id;
                    }
    
                    $revision->activity_id          = $next_activity_id;
                    $revision->save();
                }
            }

            DB::commit();
            return $this->response($this->getPapers($deal_id), '');
        } catch (\Exception $e) {
            DB::rollback();
            return $this->response(null, 'Something went wrong', [], 400);
        }
    }

    private function getPapers($deal_id) {
        $papers = Paper::select('papers.*')
            ->with('users:id,name')
            ->with(['processing' => function($query) {
                $query->with([
                    'submission' => function ($query) {
                        $query->select('*');
                        $query->orderBy('created_at', 'DESC');
                        $query->with([
                            'staff:id,name', 
                            'activity' => function ($query) {
                                $query->select('id', 'title')->withCount('comments');
                            }
                        ]);
                    },
                    'revisions' => function ($query) {
                        $query->select('*');
                        $query->orderBy('created_at', 'DESC');
                        $query->with([
                            'staff:id,name', 
                            'activity' => function ($query) {
                                $query->select('id', 'title')->withCount('comments');
                            }
                        ]);
                    },
                    'proof',
                    'journal:id,journal_name', 'publisher:id,name'
                ]);
            }, 'domain:id,name', 'service:id,name'])
            ->whereNull('papers.deleted_at')
            ->where('journalable_type', Deal::class)
            ->where('journalable_id', $deal_id)
            ->paginate();

        return $papers;
    }




    public function createDomain(Request $request) {
        $rules = [
            'data'                        => 'required'
        ];
        $validator = Validator::make($request->all(), $rules);
        if ($validator->fails()) { 
            return $this->response(null, $validator->errors()->first(), $validator->errors()->toArray(), 422);
        }

        DB::beginTransaction();
        try {
            $existing_domain = MasterDomain::select('id', 'name')->where('name', trim($request->data))->first();
            if($existing_domain) {
                return $this->response($existing_domain, '');
            }

            $new_domain         = new MasterDomain;
            $new_domain->id     = (string) Str::uuid();
            $new_domain->name   = trim($request->data);
            $new_domain->save();

            DB::commit();
            return $this->response($new_domain, '');
        } catch (\Exception $e) {
            DB::rollback();
            return $this->response(null, 'Something went wrong', [], 400);
        }
    }

    public function createService(Request $request) {
        $rules = [
            'data'                        => 'required'
        ];
        $validator = Validator::make($request->all(), $rules);
        if ($validator->fails()) { 
            return $this->response(null, $validator->errors()->first(), $validator->errors()->toArray(), 422);
        }

        DB::beginTransaction();
        try {
            $existing_service = MasterService::select('id', 'name')->where('name', trim($request->data))->first();
            if($existing_service) {
                return $this->response($existing_service, '');
            }

            $new_service         = new MasterService;
            $new_service->id     = (string) Str::uuid();
            $new_service->name   = trim($request->data);
            $new_service->save();

            DB::commit();
            return $this->response($new_service, '');
        } catch (\Exception $e) {
            DB::rollback();
            return $this->response(null, 'Something went wrong', [], 400);
        }
    }

    public function createPublisher(Request $request) {
        $rules = [
            'data'                        => 'required'
        ];
        $validator = Validator::make($request->all(), $rules);
        if ($validator->fails()) { 
            return $this->response(null, $validator->errors()->first(), $validator->errors()->toArray(), 422);
        }

        DB::beginTransaction();
        try {
            $existing_publisher = MasterPublisher::select('id', 'name')->where('name', trim($request->data))->first();
            if($existing_publisher) {
                return $this->response($existing_publisher, '');
            }

            $new_publisher         = new MasterPublisher;
            $new_publisher->id     = (string) Str::uuid();
            $new_publisher->name   = trim($request->data);
            $new_publisher->save();

            DB::commit();
            return $this->response($new_publisher, '');
        } catch (\Exception $e) {
            DB::rollback();
            return $this->response(null, 'Something went wrong', [], 400);
        }
    }

    public function createJournal(Request $request) {
        $rules = [
            'data'          => 'required',
            'publisher_id'  => 'required'
        ];
        $validator = Validator::make($request->all(), $rules);
        if ($validator->fails()) { 
            return $this->response(null, $validator->errors()->first(), $validator->errors()->toArray(), 422);
        }

        DB::beginTransaction();
        try {
            $existing_journal = MasterJournal::select('id', 'journal_name')
                ->where('journal_name', trim($request->data))
                ->where('publisher_id', $request->publisher_id)
                ->first();
            if($existing_journal) {
                return $this->response($existing_journal, '');
            }

            $new_journal                = new MasterJournal;
            $new_journal->id            = (string) Str::uuid();
            $new_journal->journal_name  = trim($request->data);
            $new_journal->publisher_id  = $request->publisher_id;
            $new_journal->save();

            DB::commit();
            return $this->response($new_journal, '');
        } catch (\Exception $e) {
            DB::rollback();
            return $this->response(null, 'Something went wrong', [], 400);
        }
    }

    public function createActivity(Request $request) {
        $rules = [
            'title' => 'required|string|max:255',
            'module' => 'required|in:deal',
            'owner_id' => 'required',
            'module_id' => 'required',
            'due_date' => ['required', new IsoDate],
            'start_time' => 'required|date_format:H:i',
            'end_date' => ['nullable', new IsoDate],
            'end_time' => 'nullable|date_format:H:i',
        ];
        $validator = Validator::make($request->all(), $rules);
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

            $owner_id = $request->owner_id;
            $activityEntry = [
                'id' => (string) Str::uuid(),
                'owner_id' => $owner_id,
                'title' => $request->title,
                'activity_type_id' => '9cb7d4ea-98e8-4597-b300-72fab74344e0', //Change dynamic
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
            ];
            $activity = Activity::create($activityEntry);

            $activity->activitable()->associate($module);
            $activity->save();
            
            $assignedIds[$owner_id] = ['is_activity_owner' => true];
            $activity->users()->attach($assignedIds);
            DB::commit();

            return $this->response($activity, '');
        } catch (\Exception $e) {
            DB::rollback();
            return $this->response(null, 'Something went wrong', [], 400);
        }
    }
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

    private function getJournalSettings(Request $request) {
        $data['journals']           = [];
        $data['status']             = Setting::get('journals', []);
        $data['master_domains']     = MasterDomain::select('id', 'name')
            ->whereNull('deleted_at')->get();
        $data['master_services']    = MasterService::select('id', 'name')
            ->whereNull('deleted_at')->get();
        $data['master_publishers']  = MasterPublisher::select('id', 'name')
            ->with('journals:id,publisher_id,journal_name')
            ->whereNull('deleted_at')->get();
        $data['staffs']  = User::whereHas('roles', function($query) {
                $query->whereIn('name', ['Technical Staff', 'Technical Head']);
            })->select('id', 'name', 'email')->get();
        $data['publication_staffs']  = User::whereHas('roles', function($query) {
            $query->whereIn('name', ['Publication Staff', 'Publication Head']);
        })->select('id', 'name', 'email')->get();
        $data['extra_label'] = Config::get('permission.journal_extra_info');
        
        $data['tasks'] = [];
        if($request->has('deal_id') && $request->deal_id !== '') {
            $existingDeal = Deal::where('id', $request->deal_id)->first();
            if(!is_null($existingDeal)) {
                $module = (!is_null($existingDeal->parentDeal) && isset($existingDeal->parentDeal->id)) ? $existingDeal->parentDeal : $existingDeal;
                            
                $data['tasks']  = Activity::select('id', 'title', 'activity_type_id', 'owner_id')
                ->with('activity_type:id,name,color,icon')
                ->where('activitable_type', Deal::class)
                ->where('activitable_id', $module->id)
                ->get();
            }
        }

        $data['rules'] = [];
        if(empty(array_intersect(explode(',', $request->skip), ['rules'])) ) {
            $data['rules'] = [
                TextFilter::make('parent.name', __('fields.activities.deal_title'))
                    ->withoutEmptyOperators()
                    ->jsonSerialize(),
                TextFilter::make('papers.paper', __('fields.activities.paper_title'))
                    ->withoutEmptyOperators()
                    ->jsonSerialize(),
                    
            ];
        }

        $user = Auth::user();
        $data['filters'] = [];
        if(empty(array_intersect(explode(',', $request->skip), ['filters'])) ) {
            $data['filters']           = Filter::where('identifier', 'journals')
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
        $data = $this->getJournalSettings($request);
        return $this->response($data, '');
    }
}
