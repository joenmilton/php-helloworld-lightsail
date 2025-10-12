<?php
namespace App\Http\Controllers\API\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Auth;
use Exception;
use Validator;

class AccountController extends Controller
{
    public function getProfile() {
        $user = Auth::user();
        $user_data = [
            'id'            => $user->id,
            'name'          => $user->name,
            'email'         => $user->email,
            'country_code'  => $user->country_code,
            'mobile'        => $user->mobile,
        ];

        return $this->response($user_data);
    }

    public function changePassword(Request $request) {
        $validator = Validator::make($request->all(), [
            'password'    => 'required|confirmed|min:6',
        ]);

        if ($validator->fails()) { 
            return $this->appResponse(null, $validator->errors(), 422, 'Validation failed');          
        }

        try{
            $user = Auth::user();
            $user->password = Hash::make($request->password);
            $user->save();

            return $this->appResponse(null, null, 200, 'Password updated successfully');

        } catch (Exception $e) {
            return $this->appResponse(null, null, 422, 'Something went wrong');
        }
    }
}