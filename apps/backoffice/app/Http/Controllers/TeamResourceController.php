<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Team;
use Validator;

class TeamResourceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        if ($request->ajax()) {
            $teams = Team::with(['members:id,name,email', 'manager:name'])
                ->paginate($request->per_page ?? 25);

            return $this->response($teams, '');
        }
    
        return view('admin.settings.teams');
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
            'name' => 'required|string',
            'description' => 'nullable|string|max:255',
            'members' => 'nullable|array',
            'members.*.id' => 'required|integer|exists:users,id'
        ]);

        if ($validator->fails()) { 
            return $this->response(null, $validator->errors()->first(), $validator->errors()->toArray(), 422);
        }

        $hasManager = false;
        foreach ($request->members as $member) {
            if ($member['is_manager']) {
                $hasManager = true;
                break;
            }
        }

        if (!$hasManager) {
            return $this->response(null, 'Manager must be selected', ['is_manager' => ['Manager must be selected']], 422);
        }
        
        DB::beginTransaction();
        try {
            $team = Team::create([
                'name' => $request->name,
                'description' => $request->description ?? null,
            ]);

            // Attach members to the team if any
            if (isset($request->members)) {
                $members = [];
                foreach ($request->members as $member) {
                    $members[$member['id']] = ['is_manager' => $member['is_manager'] ?? false];
                }

                $team->members()->sync($members);
            }

            DB::commit();
            $updatedTeams = Team::with(['members:id,name,email','manager:name'])->paginate();

            return $this->response($updatedTeams, '');
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
        $validator = Validator::make($request->all(), [
            'name' => 'required|string',
            'description' => 'nullable|string|max:255',
            'members' => 'required|array',
            'members.*.id' => 'required|integer|exists:users,id'
        ]);

        if ($validator->fails()) { 
            return $this->response(null, $validator->errors()->first(), $validator->errors()->toArray(), 422);
        }

        $hasManager = false;
        foreach ($request->members as $member) {
            if ($member['is_manager']) {
                $hasManager = true;
                break;
            }
        }

        if (!$hasManager) {
            return $this->response(null, 'Manager must be selected', ['is_manager' => ['Manager must be selected']], 422);
        }


        DB::beginTransaction();
        try {
            $team = Team::where('id', $id)->first();
            if(is_null($team)) {
                return $this->response(null, 'Team not valid', [], 400);
            }
            $team->name         = $request->name;
            $team->description  = $request->description ?? null;
            $team->save();
            
            // Attach members to the team if any
            if (isset($request->members)) {
                $members = [];
                foreach ($request->members as $member) {
                    $members[$member['id']] = ['is_manager' => $member['is_manager'] ?? false];
                }

                $team->members()->sync($members);
            }

            DB::commit();
            $updatedTeams = Team::with(['members:id,name,email','manager:name'])->paginate();

            return $this->response($updatedTeams, '');
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
