<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

class ExcludeRole
{
    public function handle($request, Closure $next, $role)
    {
        if (Auth::check() && Auth::user()->hasRole($role)) {
            return redirect('/');
        }

        return $next($request);
    }
}