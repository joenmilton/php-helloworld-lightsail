<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\DB;
use Config;
use Validator;

class RoleResourceController extends Controller
{
    public function permission_group(Request $request)
    {
        if ($request->ajax()) {
            $group_list = Config::get('permission.role_permissions');
            return $this->response($group_list, '');
        }
        return view('admin.settings.roles');
    }
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        if ($request->ajax()) {
            $roles = Role::with('permissions:name')
                ->whereNotIn('name', ['user'])
                ->paginate();

            // Transform the permissions to only include their names
            $roles->getCollection()->transform(function ($role) {
                $updated_permissions = $role->permissions->pluck('name')->toArray();
                unset($role->permissions);
                $role->permissions = $updated_permissions;
                return $role;
            });

            return $this->response($roles, '');
        }
    
        return view('admin.settings.roles');
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
            'name' => 'required|string'
        ]);

        if ($validator->fails()) { 
            return $this->response(null, $validator->errors()->first(), $validator->errors()->toArray(), 422);
        }

        DB::beginTransaction();
        try {

            $role = Role::create(['name' => $request->name, 'guard_name' => 'web']);

            $role->syncPermissions($request->permissions);

            DB::commit();


            $updatedRoles = Role::with('permissions:name')
                ->whereNotIn('name', ['user'])
                ->paginate();

            // Transform the permissions to only include their names
            $updatedRoles->getCollection()->transform(function ($role) {
                $updated_permissions = $role->permissions->pluck('name')->toArray();
                unset($role->permissions);
                $role->permissions = $updated_permissions;
                return $role;
            });

            return $this->response($updatedRoles, '');
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
            'name' => 'required|string'
        ]);

        if ($validator->fails()) { 
            return $this->response(null, $validator->errors()->first(), $validator->errors()->toArray(), 422);
        }

        DB::beginTransaction();
        try {

            $role = Role::where('id', $id)->first();
            if(is_null($role)) {
                return $this->response(null, 'Role not valid', [], 400);
            }

            $role->name = $request->name;
            $role->save();
            $role->syncPermissions($request->permissions);

            DB::commit();


            $updatedRoles = Role::with('permissions:name')
                ->whereNotIn('name', ['user'])
                ->paginate();

            // Transform the permissions to only include their names
            $updatedRoles->getCollection()->transform(function ($role) {
                $updated_permissions = $role->permissions->pluck('name')->toArray();
                unset($role->permissions);
                $role->permissions = $updated_permissions;
                return $role;
            });

            return $this->response($updatedRoles, '');
        } catch (\Exception $e) {
            dd($e);
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
