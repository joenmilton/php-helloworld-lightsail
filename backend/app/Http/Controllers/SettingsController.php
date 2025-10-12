<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Pipeline;
use App\Models\Deal;
use App\Models\User;
use Spatie\Permission\Models\Role;

use Auth;
use Setting;

class SettingsController extends Controller
{
    public function getSettings() {

        $user = Auth::user();
        $data['pipelines']          = Pipeline::getVisibles()->with(['stages'])
            ->select('pipelines.id', 'pipelines.name')
            ->get();
    
        $data['admins']             = User::doesntHave('roles', 'and', function($query) {
                                            $query->where('name', 'user');
                                        })->select('id', 'name', 'email')->get();
        $data['roles']              = Role::select('id', 'name')->where('name', '!=', 'user')->get();
        $data['custom_fields']      = Setting::get('custom_fields', []);
        
        $data['permissions']        = User::findOrFail($user->id)->getPermissionNames();
        $data['user']               = [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
        ];

        return $this->response($data);
    }

    public function index(Request $request){
        if(view()->exists($request->path())){
            return view($request->path());
        }
        return view('pages-404');
    }
}
