<?php

namespace App\Http\Controllers\API\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Services\AuthService;
use App\Models\User;
use App\Traits\OtpTrait;
use Illuminate\Support\Facades\Hash;

class TokenController extends Controller
{
    use OtpTrait;

    private $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    public function authenticate(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'country_code' => 'required',
            'mobile' => 'required',
        ]);

        if ($validator->fails()) {
            return $this->appResponse(null, $validator->errors(), 422, 'Validation failed');
        }

        $user = User::where('country_code', $request->country_code)
            ->where('mobile', $request->mobile)
            ->first();

        if (!$user) {
            return $this->appResponse(null, null, 422, 'Mobile number not registered');
        }

        $otp = $this->authService->generateOtp($user);

        return $this->appResponse(['otp_id' => $otp->id], null, 200, 'OTP sent successfully');
    }

    public function verifyMobileOtp(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'country_code' => 'required',
            'mobile' => 'required',
            'otp' => 'required',
        ]);

        if ($validator->fails()) {
            return $this->appResponse(null, $validator->errors(), 422, 'Validation failed');
        }

        $user = User::where('country_code', $request->country_code)
            ->where('mobile', $request->mobile)
            ->first();

        if (!$user) {
            return $this->appResponse(null, null, 422, 'User not found');
        }

        $tokenData = $this->authService->generateToken([
            'phone_number' => $request->country_code . $request->mobile,
            'otp' => $request->otp,
        ], 'otp_grant');

        if (!$tokenData || !isset($tokenData->access_token)) {
            return $this->appResponse(null, null, 422, 'Invalid OTP');
        }

        $user->phone_verified = true;
        $user->save();
        
        $responseData = [
            'user_id' => $user->id,
            'name' => $user->name,
            'phone_verified' => $user->phone_verified,
            'access_token' => $tokenData->access_token,
            'refresh_token' => $tokenData->refresh_token,
            'expires_in' => $tokenData->expires_in,
        ];

        return $this->appResponse($responseData, null, 200, 'OTP verified successfully');
    }

    public function resetOtpMail(Request $request) {

        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email'
        ]);

        if ($validator->fails()) {
            return $this->appResponse(null, $validator->errors(), 422, 'Validation failed');
        }

        $this->generateOtp($request->email);

        return $this->appResponse(null, null, 200, 'OTP Sent!');
    }

    public function verifyEmailOtp(Request $request) {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email',
            'otp' => 'required|numeric',
            'password' => 'required|min:6|confirmed',
        ]);

        if ($validator->fails()) {
            return $this->appResponse(null, $validator->errors(), 422, 'Validation failed');
        }


        if (!$this->validateOtp($request->email, $request->otp)) {
            return $this->appResponse(null, $validator->errors(), 422, 'OTP Not valid!');
        }

        // Reset the password
        $user = User::where('email', $request->email)->first();
        $user->password = Hash::make($request->password);
        $user->save();

        return $this->appResponse(null, null, 200, 'Password reset success!');
    }

    public function logout(Request $request) {
        try {
            if ($request->user()->token()) {
                $request->user()->token()->revoke();
            }
            return $this->appResponse(null, null, 200, 'Logged out successfully!');
        } catch (\Exception $e) {
            return $this->appResponse(null, null, 422, 'Failed to log out. Please try again later.');
        }
    }
}