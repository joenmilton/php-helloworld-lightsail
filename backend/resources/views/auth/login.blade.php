@extends('layouts.master-without-nav')
@section('title')Sign In @endsection
@section('content')

<div class="auth-page d-flex align-items-center min-vh-100">
    <div class="container-fluid p-0">
        <div class="row g-0">
            <div class="col-xxl-3 col-lg-4 col-md-5">
                <div class="d-flex flex-column h-100 py-5 px-4">
                    <div class="text-center text-muted mb-2">
                        <div class="pb-3">
                            <a href="{{ url('index') }}">
                                <span class="logo-lg">
                                    <img src="{{URL::asset('assets/images/logo-sm.svg')}}" alt="" height="24"> <span class="logo-txt">Vuesy</span>
                                </span>
                            </a>
                            <p class="text-muted font-size-15 w-75 mx-auto mt-3 mb-0">User Experience & Interface Design Strategy Saas Solution</p>
                        </div>
                    </div>

                    <div class="my-auto">
                        <div class="p-3 text-center">
                            <img src="{{URL::asset('assets/images/auth-img.png')}}" alt="" class="img-fluid">
                        </div>
                    </div>

                    <div class="mt-4 mt-md-5 text-center">
                        <p class="mb-0">© <script>
                                document.write(new Date().getFullYear())
                            </script> Crafted with <i class="mdi mdi-heart text-danger"></i> by A2Z Street</p>
                    </div>
                </div>

                <!-- end auth full page content -->
            </div>
            <!-- end col -->

            <div class="col-xxl-9 col-lg-8 col-md-7">
                <div class="auth-bg bg-light py-md-5 p-4 d-flex">
                    <div class="bg-overlay-gradient"></div>
                    <!-- end bubble effect -->
                    <div class="row justify-content-center g-0 align-items-center w-100">
                        <div class="col-xl-4 col-lg-8">
                            <div class="card">
                                <div class="card-body">
                                    <div class="px-3 py-3">
                                        <div class="text-center">
                                            <h5 class="mb-0">Welcome Back !</h5>
                                            <p class="text-muted mt-2">Sign in to continue to Vuesy.</p>
                                        </div>
                                        @if(Session::has('flash_error'))
                                            <div class="alert alert-danger">
                                                {{ Session::get('flash_error') }}
                                            </div>
                                        @endif
                                        @if(Session::has('flash_success'))
                                            <div class="alert alert-success">
                                                {{ Session::get('flash_success') }}
                                            </div>
                                        @endif
                                        <form method="POST" action="{{ route('login') }}" class="mt-4 pt-2">
                                            @csrf
                                            <div class="form-floating form-floating-custom mb-3">
                                                <input type="email" id="email" placeholder="Enter User Name" class="form-control @error('email') is-invalid @enderror" name="email" value="{{ old('email') }}" required autocomplete="email" autofocus>
                                                <label for="input-username">{{ __('Email Address') }}</label>
                                                @error('email')
                                                <span class="invalid-feedback" role="alert">
                                                    <strong>{{ $message }}</strong>
                                                </span>
                                                @enderror
                                                <div class="form-floating-icon">
                                                    <i class="uil uil-users-alt"></i>
                                                </div>
                                            </div>

                                            <div class="form-floating form-floating-custom mb-3 auth-pass-inputgroup">
                                                <input id="password-input" type="password" class="form-control @error('password') is-invalid @enderror" name="password" required autocomplete="current-password" placeholder="enter your password">
                                                <button type="button" class="btn btn-link position-absolute h-100 end-0 top-0" id="password-addon">
                                                    <i class="mdi mdi-eye-outline font-size-18 text-muted"></i>
                                                </button>
                                                <label for="password-input">{{ __('Password') }}</label>
                                                @error('password')
                                                <span class="invalid-feedback" role="alert">
                                                    <strong>{{ $message }}</strong>
                                                </span>
                                                @enderror
                                                <div class="form-floating-icon">
                                                    <i class="uil uil-padlock"></i>
                                                </div>
                                            </div>

                                            <div class="form-check form-check-primary font-size-16 py-1">
                                                <input class="form-check-input" type="checkbox" name="remember" id="remember" {{ old('remember') ? 'checked' : '' }}>
                                                <div class="float-end">
                                                    @if (Route::has('password.request'))
                                                    <a href="/password/reset" class="text-muted text-decoration-underline font-size-14">{{ __('Forgot Your Password?') }}</a>
                                                    @endif
                                                </div>
                                                <label class="form-check-label font-size-14" for="remember-check">
                                                    {{ __('Remember Me') }}
                                                </label>
                                            </div>

                                            <div class="mt-3">
                                                <button class="btn btn-primary w-100" type="submit">{{ __('Login') }}</button>
                                            </div>

                                        </form><!-- end form -->
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- end col -->
        </div>
        <!-- end row -->
    </div>
    <!-- end container fluid -->
</div>
<!-- end authentication section -->
@endsection

@section('script-bottom')
<script>
    // show password input value
    document.getElementById('password-addon').addEventListener('click', function () {
        var passwordInput = document.getElementById("password-input");
        if (passwordInput.type === "password") {
            passwordInput.type = "text";
        } else {
            passwordInput.type = "password";
        }
    });
</script>
@endsection