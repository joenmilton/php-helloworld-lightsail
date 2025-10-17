<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class VuesyController extends Controller
{
    //
    public function index(Request $request){
        if(view()->exists($request->path())){
            return view($request->path());
        }
        return view('pages-404');
    }

    public function home(){
        return view('auth.login');
    }
    
    public function login(){
        return view('auth.login');
    }

    public function register(){
        return view('auth.register');
    }
}
