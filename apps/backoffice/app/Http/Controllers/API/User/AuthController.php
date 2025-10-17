<?php

namespace App\Http\Controllers\API\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Services\AuthService;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    private $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'country_code' => 'required_with:mobile|string',
            'mobile' => 'required_without:email|string',
            'email' => 'required_without:mobile|email',
            'password' => 'required|string'
        ]);

        if ($validator->fails()) {
            return $this->appResponse(null, $validator->errors(), 422, '');
        }

        $loginField = $request->has('mobile') ? 'mobile' : 'email';
        $credentials = [
            $loginField => $request->$loginField,
            'password' => $request->password,
        ];

        if ($loginField === 'mobile') {
            $credentials['country_code'] = $request->country_code;
        }

        $user = $this->authService->validateUserCredentials($credentials);

        if (!$user) {
            return $this->appResponse(null, null, 422, 'Invalid login credentials');
        }

        $tokenData = $this->authService->generateToken([
            'username' => $user->email,
            'password' => $request->password,
        ], 'password');

        if (!$tokenData || !isset($tokenData->access_token)) {
            return $this->appResponse(null, null, 422, 'Failed to generate token');
        }

        $responseData = [
            'user_id' => $user->id,
            'name' => $user->name,
            'phone_verified' => $user->phone_verified,
            'access_token' => $tokenData->access_token,
            'refresh_token' => $tokenData->refresh_token,
            'expires_in' => $tokenData->expires_in,
        ];

        return $this->appResponse($responseData, null, 200, 'Login successful');
    }

    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6|confirmed',
            'country_code' => 'required|string|max:5',
            'mobile' => [
                'required',
                'string',
                'max:15',
                function ($attribute, $value, $fail) use ($request) {
                    $exists = User::where('country_code', $request->country_code)
                        ->where('mobile', $value)
                        ->exists();
                    if ($exists) {
                        $fail('The mobile number is already taken.');
                    }
                },
            ],
        ]);

        if ($validator->fails()) {
            return $this->appResponse(null, $validator->errors(), 422, 'Validation failed');
        }

        DB::beginTransaction();
        try {
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'country_code' => $request->country_code,
                'mobile' => $request->mobile,
                'source_type' => 'app',
                'guard_name' => 'web',
                'is_superadmin' => false,
            ]);

            $user->assignRole('user');
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->appResponse(null, null, 422, 'Something went wrong');
        }

        return $this->login($request);
    }

    public function forgotPassword() {
        $validator = Validator::make($request->all(), [
            'country_code' => 'required_with:mobile|string',
            'mobile' => 'required_without:email|string',
        ]);
        if ($validator->fails()) {
            return $this->appResponse(null, $validator->errors(), 422, 'Validation failed');        
        }

        try{
            $user = User::where(function ($query) use ($request) {
                    $query->where('mobile', $request->mobile)
                        ->where('country_code', $request->country_code);
                })->first();

            if(is_null($user)) {
                return $this->appResponse(null, null, 422, 'Mobile number not exist!'); 
            }
            
            $otp = $this->authService->generateOtp($user);

            return $this->appResponse(['otp_id' => $otp->id], null, 200, 'OTP sent successfully');

        } catch (Exception $e) {
            return $this->appResponse(null, null, 422, 'Something went wrong');
        }
    }
}