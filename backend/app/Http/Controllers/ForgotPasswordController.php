<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\SendsPasswordResetEmails;
use Illuminate\Support\Facades\Password;
use App\Traits\OtpTrait;

class ForgotPasswordController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Password Reset Controller
    |--------------------------------------------------------------------------
    |
    | This controller is responsible for handling password reset emails and
    | includes a trait which assists in sending these notifications from
    | your application to your users. Feel free to explore this trait.
    |
    */

    use SendsPasswordResetEmails, OtpTrait;


    public function __construct()
    {
        $this->middleware('guest');
    }

    /**
     * Display the form to request a password reset link.
     *
     * @return \Illuminate\Http\Response
     */
    public function showLinkRequestForm(Request $request)
    {
        if($request->has('token') && $request->token != '') {

            return view('common.account.password.reset')->with(
                ['token' => $request->token, 'email' => $request->email]
            );
        }

        return view('common.account.password.email');
    }


    public function sendOtp(Request $request) {
        $request->validate(['email' => 'required|email|exists:users,email']);

        $this->generateOtp($request->email);

        return redirect()->route('password.reset.form')->with('flash_success', 'An OTP has been sent to your email. Use it to reset your password.');
    }
}