<?php
namespace App\Traits;

use Illuminate\Support\Facades\Mail;
use App\Models\PasswordResetsOtp;

trait OtpTrait
{
    /**
     * Generate and send OTP to the specified email.
     *
     * @param string $email
     * @return string $otp
     */
    public function generateOtp($email)
    {
        $otp = rand(100000, 999999);

        // Store OTP in the database
        PasswordResetsOtp::updateOrInsert(
            ['email' => $email],
            ['otp' => $otp, 'created_at' => now()]
        );

        // Send OTP via email
        Mail::raw("Your OTP for password reset is: $otp", function ($message) use ($email) {
            $message->to($email)
                ->subject('Password Reset OTP');
        });

        return $otp;
    }

    /**
     * Validate OTP for the given email.
     *
     * @param string $email
     * @param string $otp
     * @return bool
     */
    public function validateOtp($email, $otp)
    {
        $record = PasswordResetsOtp::where('email', $email)->first();

        if ($record && $record->otp == $otp && now()->diffInMinutes($record->created_at) <= 10) {
            return true;
        }

        return false;
    }
}