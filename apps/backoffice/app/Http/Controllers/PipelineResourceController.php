<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Pipeline;
use App\Models\PipelineStage;
use App\Models\Deal;
use App\Models\Team;
use App\Models\User;
use App\Models\VisibilityGroup;
use App\Models\VisibilityGroupDependent;

use App\Facades\ChangeLogger;
use Illuminate\Support\Facades\DB;
use Validator;

class PipelineResourceController extends Controller
{
    private function populateBoardList(Request $request, string $id) {
        $pipeline = Pipeline::with(['stages.deals' => function ($query) use($request){
            $query
                ->select('deals.*')
                ->getVisibleDeals()
                ->with(['contact' => function($query){
                    $query->select('id', 'name', 'email', 'mobile');
                }])
                ->whereNull('deals.deleted_at')
                ->applyFilter($request->all());
        }])
        ->where('pipelines.id', $id)
        ->whereNull('pipelines.deleted_at')
        ->first();

        $tasks = []; $columns = []; $columnOrder = [];

        foreach ($pipeline->stages as $stage) {
            $columnId = $stage->id;
            $columnOrder[] = $columnId;

            $columns[$columnId] = [
                'id' => $columnId,
                'title' => $stage->name,
                'shrink' => false,  // Set to false or retrieve actual value if available
                'taskIds' => $stage->deals->pluck('id')->toArray()
            ];

            foreach ($stage->deals as $deal) {
                $tasks[$deal->id] = $deal;
            }
        }

        $response = [
            'tasks' => $tasks,
            'columns' => $columns,
            'columnOrder' => $columnOrder
        ];

        return $response;
    }

    public function getBoard(Request $request, string $id) {

        if ($request->ajax()) {
            return $this->response($this->populateBoardList($request, $id), '');
        }
        
        return view('admin.pipeline.boardview');
    }


    public function updateBoard(Request $request, string $id) {

        $validator = Validator::make($request->all(), [
            'type' => 'required|in:task,column',
            'columnList' => 'required|array',
            'data' => 'required'
        ]);

        if ($validator->fails()) { 
            return $this->response(null, $validator->errors()->first(), $validator->errors()->toArray(), 422);
        }

        try {
            DB::beginTransaction();

            $pipeline = Pipeline::where('id', $id)->first();
            if(is_null($pipeline)) {
                return $this->response(null, 'Pipeline not valid', [], 400);
            }

            foreach($request->columnList as $stageId) {
                if(isset($request->data['columns']) && 
                    isset($request->data['columns'][$stageId]) && 
                    isset($request->data['columns'][$stageId]['taskIds']) &&
                    is_array($request->data['columns'][$stageId]['taskIds']) && 
                    count($request->data['columns'][$stageId]['taskIds']) > 0) {
                    
                    foreach($request->data['columns'][$stageId]['taskIds'] as $key => $dealId) {
                        $sortOrder = $key+1;

                        $deal = Deal::where('id', $dealId)->first();
                        if(!is_null($deal)) {
                            $previousStage      = $deal->stage; 

                            $deal->sort_order   = $sortOrder;
                            $deal->stage_id     = $stageId;
                            $deal->save();

                            if($previousStage->id !== $stageId) {
                                $deal = Deal::where('id', $dealId)->first();
                                ChangeLogger::logStageChangeActivity($deal, $previousStage);
                            }
                        }
                    }
                }
            }
            DB::commit();

            return $this->response($this->populateBoardList($request, $id), '');
        } catch (\Exception $e) {
            dd($e);
            DB::rollback();
            return $this->response(null, 'Something went wrong', [], 400);
        }

    }
    







    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $pipelines = Pipeline::whereNull('deleted_at')->get();

        return $this->response($pipelines, '');
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
            'name' => ['required'],
        ]);

        if ($validator->fails()) { 
            return $this->response(null, $validator->errors()->first(), $validator->errors()->toArray(), 422);
        }

        try {
            $pipeline = new Pipeline;
            $pipeline->name = $request->name;
            $pipeline->save();

            return $this->response($pipeline, 'Pipeline Created!');
        } catch(Exception $e) {
            return $this->response(null, 'Something went wrong', [], 400);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $pipeline = Pipeline::with('visibilityGroup.dependents')
                ->with(['stages' => function($query) {
                    $query->orderBy('sort_order', 'ASC');
                }])
                ->where('id', $id)->first();
            if(is_null($pipeline)) {
                return $this->response(null, 'Pipeline not valid', [], 400);
            }

            return $this->response($pipeline, '');
        } catch(Exception $e) {
            return $this->response(null, 'Something went wrong', [], 400);
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        return view('admin.pipeline.edit');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'visible_to' => 'required|string|in:all,teams,users',
            'stages' => 'required|array',
            'stages.*.id' => 'nullable|uuid',
            'stages.*.name' => 'required|string|max:255',
            'stages.*.sort_order' => 'required|integer',
            'visibility_group.dependents' => 'array|required_if:visible_to,teams,users',
        ]);

        if ($validator->fails()) { 
            return $this->response(null, $validator->errors()->first(), $validator->errors()->toArray(), 422);
        }

        try {
            // Start a transaction
            DB::beginTransaction();

            $pipeline = Pipeline::where('id', $id)->first();
            if(is_null($pipeline)) {
                return $this->response(null, 'Pipeline not valid', [], 400);
            }

            $pipeline->update([
                'name' => $request->name,
                'visible_to' => $request->visible_to,
            ]);

            // Get the current stages' IDs
            $currentStageIds = $pipeline->stages()->pluck('id')->toArray();

            // Process each stage
            foreach ($request->stages as $stageData) {
                if (isset($stageData['id']) && in_array($stageData['id'], $currentStageIds)) {
                    // Update existing stage
                    $pipeline->stages()->where('id', $stageData['id'])->update([
                        'name' => $stageData['name'],
                        'sort_order' => $stageData['sort_order'],
                    ]);
                } else {
                    // Create a new stage
                    $pipeline->stages()->create([
                        'name' => $stageData['name'],
                        'sort_order' => $stageData['sort_order'],
                    ]);
                }
            }

            //Existing available stage ids from ui
            $requestStageIds = array_filter(array_column($request->stages, 'id'));

            // Determine the IDs of stages to be deleted (those existing but not in the request)
            $stagesToDelete = array_diff($currentStageIds, $requestStageIds);

            // Delete stages that are in $stagesToDelete array
            if (!empty($stagesToDelete)) {
                $pipeline->stages()->whereIn('id', $stagesToDelete)->delete();
            }



            // Create or update the visibility group
            $visibilityGroup = VisibilityGroup::updateOrCreate(
                [
                    'visibilityable_type' => Pipeline::class,
                    'visibilityable_id' => $pipeline->id,
                ],
                [
                    'type' => $request->visible_to,
                    'visibilityable_type' => Pipeline::class,
                    'visibilityable_id' => $pipeline->id,
                ]
            );

            // Clear existing dependents
            $visibilityGroup->dependents()->delete();

            // Create visibility group dependents
            if (in_array($request->visible_to, ['teams', 'users'])) {
                foreach ($request->visibility_group['dependents'] as $dependent) {
                    VisibilityGroupDependent::create([
                        'visibility_group_id' => $visibilityGroup->id,
                        'dependable_type' => $request->visible_to == 'teams' ? Team::class : User::class,
                        'dependable_id' => $dependent['dependable_id'],
                    ]);
                }
            }

            DB::commit();

            $updatedPipeline = Pipeline::with('visibilityGroup.dependents')
                ->with(['stages' => function($query) {
                    $query->orderBy('sort_order', 'ASC');
                }])
                ->where('id', $id)->first();

            return $this->response($updatedPipeline, '');
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
}
