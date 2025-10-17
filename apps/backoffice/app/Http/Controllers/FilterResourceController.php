<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Filter;
use Illuminate\Support\Facades\DB;
use App\Rules\EmptyString;
use Illuminate\Support\Str;
use Auth;
use Validator;

class FilterResourceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
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
            'id' => [new EmptyString],
            'identifier' => 'required|in:deals,payments,activites,papers',
            'is_shared' => 'required|boolean',
            'name' => 'required_if:save_filter,true|max:255',

            'rules' => 'required|array',
            'rules.condition' => 'required|in:and,or',
            'rules.children' => 'required|array|min:1',
            'rules.children.*.type' => 'required|in:rule,group',
            'rules.children.*.query' => 'required|array',
            'rules.children.*.query.operator' => 'required|string',
            'rules.children.*.query.rule' => 'required|string',
            'rules.children.*.query.type' => 'required|string',
            'rules.children.*.query.value' => 'required',

            'save_filter' => 'nullable|boolean',
            'mark_default' =>  'nullable|boolean',
        ]);

        if ($validator->fails()) { 
            return $this->response(null, $validator->errors()->first(), $validator->errors()->toArray(), 422);
        }

        DB::beginTransaction();
        try {
            $user = Auth::user();

            $filter = new Filter;
            $filter->name           = $request->name;
            $filter->identifier     = $request->identifier;
            $filter->is_shared      = $request->is_shared;
            $filter->is_readonly    = $request->is_readonly;
            $filter->rules          = $request->rules;
            $filter->user_id        = $user->id;
            $filter->flag           = $this->generateUniqueSlug($request->name);
            $filter->save();

            $mark_default   = ( $request->has('mark_default') && $request->mark_default === true ) ? true : false;
            $filter->markDefaultAttribute($mark_default);
            DB::commit();

            $data['filters'] = Filter::where('identifier', $request->identifier)
                ->where(function ($q) use ($user) {
                    $q->orWhere('user_id', $user->id)
                        ->orWhere('is_shared', true);
                })
                ->get();
            $data['active_id'] = $filter->id;

            return $this->response($data, '');
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
            'identifier' => 'required|in:deals,payments,activites,papers',
            'is_shared' => 'required|boolean',
            'name' => 'required_if:save_filter,true|max:255',

            'rules' => 'required|array',
            'rules.condition' => 'required|in:and,or',
            'rules.children' => 'required|array|min:1',
            'rules.children.*.type' => 'required|in:rule,group',
            'rules.children.*.query' => 'required|array',
            'rules.children.*.query.operator' => 'required|string',
            'rules.children.*.query.rule' => 'required|string',
            'rules.children.*.query.type' => 'required|string',
            'rules.children.*.query.value' => 'required',

            'save_filter' => 'nullable|boolean',
            'mark_default' =>  'nullable|boolean',
        ]);

        if ($validator->fails()) { 
            return $this->response(null, $validator->errors()->first(), $validator->errors()->toArray(), 422);
        }

        $filter = Filter::where('id', $id)->first();
        if(is_null($filter)) {
            return $this->response(null, 'filter not valid', [], 400);
        }

        DB::beginTransaction();
        try {
            $user = Auth::user();
            $filter->name           = $request->name;
            $filter->identifier     = $request->identifier;
            $filter->is_shared      = $request->is_shared;
            $filter->is_readonly    = $request->is_readonly;
            $filter->rules          = $request->rules;
            $filter->user_id        = $user->id;
            $filter->flag           = $this->generateUniqueSlug($request->name);
            $filter->save();

            $mark_default   = ( $request->has('mark_default') && $request->mark_default === true ) ? true : false;
            $filter->markDefaultAttribute($mark_default);
            DB::commit();

            $data['filters'] = Filter::where('identifier', $request->identifier)
                ->where(function ($q) use ($user) {
                    $q->orWhere('user_id', $user->id)
                        ->orWhere('is_shared', true);
                })
                ->get();
            $data['active_id'] = $filter->id;

            return $this->response($data, '');
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

    private function generateUniqueSlug($title) {
        // Generate initial slug
        $slug = Str::slug($title);
        $originalSlug = $slug;

        // Check if the slug exists in the database
        $i = 1;
        while (Filter::where('flag', $slug)->exists()) {
            // If it exists, append a number to the slug and check again
            $slug = $originalSlug . '-' . $i;
            $i++;
        }

        return $slug;
    }
}
