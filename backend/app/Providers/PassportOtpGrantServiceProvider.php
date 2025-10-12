<?php

namespace App\Providers;

use App\otpGrant\OTPGrant;
use App\otpGrant\OTPRepository;
use DateInterval;
use Exception;
use Illuminate\Contracts\Container\BindingResolutionException;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Laravel\Passport\Bridge\RefreshTokenRepository;
use Laravel\Passport\Passport;
use League\OAuth2\Server\AuthorizationServer;

class PassportOtpGrantServiceProvider extends ServiceProvider
{
    /**
     * Perform post-registration booting of services.
     *
     * @return void
     */
    public function boot(): void
    {

    }

    /**
     * Register any package services.
     *
     * @return void
     */
    public function register(): void
    {
        parent::register();
        $this->app
            ->afterResolving(AuthorizationServer::class, function (AuthorizationServer $server) {
                $server->enableGrantType($this->makeOTPGrant(), DateInterval::createfromdatestring('+15 day'));
            }); 
    }

    /**
     * Create and configure a OTP grant instance.
     *
     * @return OTPGrant
     *
     * @throws BindingResolutionException
     * @throws Exception
     */
    protected function makeOTPGrant()
    {
        $grant = new OTPGrant(
            $this->app->make(OTPRepository::class),
            $this->app->make(RefreshTokenRepository::class),
            new DateInterval('PT10M')
        );

        $grant->setRefreshTokenTTL(Passport::refreshTokensExpireIn());

        return $grant;
    }

    /**
     * Get the services provided by the provider.
     *
     * @return array
     */
    public function provides()
    {
        return ['passport-otp-grant'];
    }

    /**
     * Console-specific booting.
     *
     * @return void
     */
    protected function bootForConsole(): void
    {

    }
}