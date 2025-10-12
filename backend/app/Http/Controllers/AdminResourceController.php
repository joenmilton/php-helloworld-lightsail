<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Role;
use App\Models\User;
use Validator;

class AdminResourceController extends Controller
{

    public function retriveDeal(Request $request) {
        $admins = User::doesntHave('roles', 'and', function($query) {
                $query->where('name', 'user');
            })
            ->with('roles')
            ->where('id', '!=', 1)
            ->whereNull('deleted_at')->paginate($request->per_page ?? 25);

        $admins->getCollection()->transform(function ($user) {
            $user->password                 = '';
            $user->password_confirmation    = '';
            $user->role_id                  = $user->roles->first() ? $user->roles->first()->id : false;
            $user->role_name                = $user->roles->first() ? $user->roles->first()->name : '-';
            unset($user->roles);
            return $user;
        });

        return $admins;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        if ($request->ajax()) {
            $admins = $this->retriveDeal($request);
            return $this->response($admins, '');
        }
    
        return view('admin.settings.users');
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
            'password' => 'required|string|min:6|confirmed',
            'is_superadmin' => 'required|boolean',
            'role_id' => [
                'required_if:is_superadmin,0',
                function ($attribute, $value, $fail) use ($request) {
                    if ($request->is_superadmin == 0) {
                        $role = Role::find($value);
                        if (!$role || in_array(strtolower($role->name), ['admin', 'user'])) {
                            $fail('Invalid role selected.');
                        }
                    }
                },
            ],
            'email' => 'required|email|unique:users,email',
            'name' => 'required|string',
        ], [
            'password.required' => 'Password is required',
            'password.min' => 'Password must be at least 6 characters',
            'password.confirmed' => 'Passwords do not match',
            'is_superadmin.required' => 'The is_superadmin field is required',
            'is_superadmin.boolean' => 'The is_superadmin field must be true or false',
            'role_id.required_if' => 'Role ID is required when the user is not a superadmin',
            'role_id.exists' => 'The selected role ID does not exist',
            'email.required' => 'Email is required',
            'email.email' => 'The email must be a valid email address',
            'email.unique' => 'The email has already been taken',
            'name.required' => 'Name is required',
        ]);

        if ($validator->fails()) { 
            return $this->response(null, $validator->errors()->first(), $validator->errors()->toArray(), 422);
        }

        try {
            DB::beginTransaction();
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'guard_name' => 'web',
                'is_superadmin' => $request->is_superadmin ? true : false,
            ]);

            // Assign role to the user
            if ($request->is_superadmin == 0 && $request->role_id) {
                $role = Role::findById($request->role_id);
                $user->syncRoles($role);
            } else {
                $role = Role::findById(1);
                $user->syncRoles($role); 
            }
            DB::commit();

            $updatedAdmins = $this->retriveDeal($request);

            return $this->response($updatedAdmins, '');
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
            'password' => 'nullable|string|min:6|confirmed',
            'is_superadmin' => 'required|boolean',
            'role_id' => [
                'required_if:is_superadmin,0',
                function ($attribute, $value, $fail) use ($request) {
                    if ($request->is_superadmin == 0) {
                        $role = Role::find($value);
                        if (!$role || in_array(strtolower($role->name), ['admin', 'user'])) {
                            $fail('Invalid role selected.');
                        }
                    }
                },
            ],
            'email' => 'required|email|unique:users,email,' . $id,
            'name' => 'required|string',
        ], [
            'password.min' => 'Password must be at least 6 characters',
            'password.confirmed' => 'Passwords do not match',
            'is_superadmin.required' => 'The is_superadmin field is required',
            'is_superadmin.boolean' => 'The is_superadmin field must be true or false',
            'role_id.required_if' => 'Role ID is required when the user is not a superadmin',
            'role_id.exists' => 'The selected role ID does not exist',
            'email.required' => 'Email is required',
            'email.email' => 'The email must be a valid email address',
            'email.unique' => 'The email has already been taken',
            'name.required' => 'Name is required',
        ]);

        if ($validator->fails()) { 
            return $this->response(null, $validator->errors()->first(), $validator->errors()->toArray(), 422);
        }

        $user = User::where('id', $id)->first();
        if(is_null($user)) {
            return $this->response(null, 'User not valid', [], 400);
        }

        try {
            DB::beginTransaction();

            $user->name             = $request->name;
            $user->email            = $request->email;

            if($request->has('password'))
                $user->password         = Hash::make($request->password);

            $user->is_superadmin    = $request->is_superadmin ? true : false;
            $user->save();

            // Assign role to the user
            if ($request->is_superadmin == 0 && $request->role_id) {
                $role = Role::findById($request->role_id);
                $user->syncRoles($role);
            } else {
                $role = Role::findById(1);
                $user->syncRoles($role); 
            }
            DB::commit();

            $updatedAdmins = $this->retriveDeal($request);

            return $this->response($updatedAdmins, '');
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
