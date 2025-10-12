@extends('layouts.master-without-nav')

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
                                            <h5 class="mb-0">Reset Your Password!</h5>
                                            <p class="text-muted mt-2">Please provide your registered email, the OTP sent to you, and a new password to securely reset your account credentials.</p>
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

                                        <form class="form" action="{{url('/password/reset')}}" method="POST">
                                            @csrf
                                            @if (session('status'))
                                                <div class="alert alert-success">
                                                    {{ session('status') }}
                                                </div>
                                            @endif
                                            <div class="form-floating form-floating-custom mb-3">
                                                <input type="email" id="input-email" name="email" placeholder="E-Mail Address" class="form-control @error('email') is-invalid @enderror" value="{{ old('email') }}" required autocomplete="email" autofocus>
                                                <label for="input-email">{{ __('Email Address') }}</label>
                                                @if ($errors->has('email'))
                                                    <span class="invalid-feedback" role="alert">
                                                        <strong>{{ $errors->first('email') }}</strong>
                                                    </span>
                                                @endif
                                                <div class="form-floating-icon">
                                                    <i class="uil uil-users-alt"></i>
                                                </div>
                                            </div>

                                            <div class="form-floating form-floating-custom mb-3">
                                                <input type="text" id="input-otp" name="otp" placeholder="Enter OTP" class="form-control @error('otp') is-invalid @enderror" value="{{ old('otp') }}" required autocomplete="off" autofocus>
                                                <label for="input-otp">{{ __('OTP') }}</label>
                                                @if ($errors->has('otp'))
                                                    <span class="invalid-feedback" role="alert">
                                                        <strong>{{ $errors->first('otp') }}</strong>
                                                    </span>
                                                @endif
                                                <div class="form-floating-icon">
                                                    <i class="uil uil-users-alt"></i>
                                                </div>
                                            </div>


                                            <div class="form-floating form-floating-custom mb-3">
                                                <input type="text" id="input-password" name="password" placeholder="New password" class="form-control @error('password') is-invalid @enderror" required autocomplete="off" autofocus>
                                                <label for="input-password">{{ __('New password') }}</label>
                                                @if ($errors->has('password'))
                                                    <span class="invalid-feedback" role="alert">
                                                        <strong>{{ $errors->first('password') }}</strong>
                                                    </span>
                                                @endif
                                                <div class="form-floating-icon">
                                                    <i class="uil uil-users-alt"></i>
                                                </div>
                                            </div>

                                            <div class="form-floating form-floating-custom mb-3">
                                                <input type="text" id="input-password_confirmation" name="password_confirmation" placeholder="Password Confirmation" class="form-control @error('password_confirmation') is-invalid @enderror" required autocomplete="off" autofocus>
                                                <label for="input-password_confirmation">{{ __('New Password Confirmation') }}</label>
                                                @if ($errors->has('password_confirmation'))
                                                    <span class="invalid-feedback" role="alert">
                                                        <strong>{{ $errors->first('password_confirmation') }}</strong>
                                                    </span>
                                                @endif
                                                <div class="form-floating-icon">
                                                    <i class="uil uil-users-alt"></i>
                                                </div>
                                            </div>

                                            <div class="mt-3">
                                                <button class="btn btn-primary w-100" type="submit">Reset Password</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection