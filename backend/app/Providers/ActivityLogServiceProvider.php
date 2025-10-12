<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Spatie\Activitylog\Models\Activity;
use Illuminate\Support\Facades\Auth;

class ActivityLogServiceProvider extends ServiceProvider
{
    public function boot()
    {
        Activity::saving(function (Activity $activity) {
            if ($activity->causer) {
                $activity->causer_name = $activity->causer->name ?? null;
            }
        });
    }

    public function register()
    {
        //
    }
}