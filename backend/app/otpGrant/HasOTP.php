<?php
namespace App\otpGrant;

use League\OAuth2\Server\Exception\OAuthServerException;

trait HasOTP
{
    public $countryCodeColumn = 'country_code';
    public $phoneNumberColumn = 'mobile';
    public $OTPColumn = 'otp';
    public $OTPExpireTime = 5;

    /**
     * @param  $phoneNumber
     * @param  $otp
     * @return mixed
     */
    public function validateForOTPCodeGrant($phoneNumber, $otp)
    {
        $user = $this->whereRaw("CONCAT({$this->getCountryCodeColumn()}, {$this->getPhoneNumberColumn()}) = ?", [$phoneNumber])->first();
        if (! $user) {
            throw OAuthServerException::invalidRequest('phone_number', 'phone_number');
        }

        $userOtp = $user->latestOtp;
        if (!$userOtp || $userOtp->otp != $otp) {
            throw OAuthServerException::invalidRequest('otp', 'OTP is invalid');
        }

        if ($userOtp->expire_at->diffInMinutes(now()) > $this->getOTPExpireTime()) {
            throw  OAuthServerException::invalidRequest('otp', 'otp code expired try get it again');
        }
        $this->removeOtp($user);

        return $user;
    }

    protected function getCountryCodeColumn() {
        return $this->countryCodeColumn;
    }

    protected function getPhoneNumberColumn() {
        return $this->phoneNumberColumn;
    }

    protected function getOTPExpireTime() {
        return $this->OTPExpireTime;
    }

    public function removeOtp($user) {
        if ($user->latestOtp) {
            $user->latestOtp->delete();
        }
    }

    protected function getOTPColumn() {
        return $this->OTPColumn;
    }
}