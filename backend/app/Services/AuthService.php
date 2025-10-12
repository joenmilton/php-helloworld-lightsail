<?php

namespace App\Services;

use App\Models\User;
use App\Models\UserOtp;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Str;
use Exception;

class AuthService
{
    private $client;

    public function __construct()
    {
        $this->client = \Laravel\Passport\Client::where('name', 'Laravel Password Grant Client')->first();
    }

    public function generateToken(array $data, string $grantType): ?object
    {
        $data['grant_type'] = $grantType;
        $data['client_id'] = $this->client->id;
        $data['client_secret'] = $this->client->secret;
        $data['scope'] = '';

        try {
            $req = Request::create('/oauth/token', 'POST', $data);
            $res = app()->handle($req);
            return json_decode($res->getContent());
        } catch (Exception $e) {
            return null;
        }
    }

    public function validateUserCredentials($credentials): ?User
    {
        $user = User::where(function ($query) use ($credentials) {
            if (isset($credentials['email'])) {
                $query->where('email', $credentials['email']);
            } elseif (isset($credentials['mobile'])) {
                $query->where('mobile', $credentials['mobile'])
                      ->where('country_code', $credentials['country_code']);
            }
        })->first();

        if ($user && isset($credentials['password']) && Hash::check($credentials['password'], $user->password)) {
            return $user;
        }

        return null;
    }

    public function generateOtp(User $user): UserOtp
    {
        $now = now();
        $existingOtp = UserOtp::where('user_id', $user->id)->latest()->first();

        if ($existingOtp && $now->isBefore($existingOtp->expire_at)) {
            return $existingOtp;
        }

        return UserOtp::create([
            'id' => (string) Str::uuid(),
            'user_id' => $user->id,
            'otp' => rand(123456, 999999),
            'expire_at' => $now->addMinutes(5),
        ]);
    }
}