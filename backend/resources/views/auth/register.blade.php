@extends('layouts.master-without-nav')
@section('title')Signup @endsection
@section('content')

<div class="auth-bg-basic d-flex align-items-center min-vh-100">
    <div class="bg-overlay bg-light"></div>
    <div class="container">
        <div class="d-flex flex-column min-vh-100 py-5 px-3">
            <div class="row justify-content-center">
                <div class="col-xl-5">
                    <div class="text-center text-muted mb-2">
                        <div class="pb-3">
                            <a href="{{ url('index') }}">
                                <span class="logo-lg">
                                    <img src="{{URL::asset('assets/images/logo-sm.svg')}}" alt="" height="24"> <span class="logo-txt">Vuesy</span>
                                </span>
                            </a>
                            <p class="text-muted font-size-15 w-75 mx-auto mt-3 mb-0">User Experience &amp; Interface Design Strategy Saas Solution</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row justify-content-center my-auto">
                <div class="col-md-8 col-lg-6 col-xl-5">
                    <div class="card bg-transparent shadow-none border-0">

                        <div class="card-body">
                            <div class="py-3">
                                <div class="text-center">
                                    <h5 class="mb-0">Register Account</h5>
                                    <p class="text-muted mt-2">Get your free Vuesy account now.</p>
                                </div>

                                <form method="POST" action="{{ route('register') }}" class="mt-4 pt-2">

                                    @csrf

                                    <div class="form-floating form-floating-custom mb-3">
                                        <input type="text" id="input-username" placeholder="Enter User Name" class="form-control @error('name') is-invalid @enderror" name="name" value="{{ old('name') }}" required autocomplete="name" autofocus>
                                        <label for="input-username">{{ __('Name') }}</label>
                                        @error('name')
                                        <span class="invalid-feedback" role="alert">
                                            <strong>{{ $message }}</strong>
                                        </span>
                                        @enderror
                                        <div class="form-floating-icon">
                                            <i class="uil uil-users-alt"></i>
                                        </div>
                                    </div>


                                    <div class="form-floating form-floating-custom mb-3">
                                        <input type="email" id="input-email" placeholder="Enter Email" required="" class="form-control @error('email') is-invalid @enderror" name="email" value="{{ old('email') }}" required autocomplete="email">
                                        <div class="invalid-feedback">
                                            Please Enter Email
                                        </div>
                                        <label for="input-email">{{ __('Email Address') }}</label>
                                        @error('email')
                                        <span class="invalid-feedback" role="alert">
                                            <strong>{{ $message }}</strong>
                                        </span>
                                        @enderror
                                        <div class="form-floating-icon">
                                            <i class="uil uil-envelope-alt"></i>
                                        </div>
                                    </div>

                                    <div class="form-floating form-floating-custom mb-3">
                                        <input type="password" id="password" placeholder="Enter Password" class="form-control" name="password" required autocomplete="new-password">
                                        <label for="input-password">{{ __('Password') }}</label>
                                        @error('password')
                                        <span class="invalid-feedback" role="alert">
                                            <strong>{{ $message }}</strong>
                                        </span>
                                        @enderror
                                        <div class="form-floating-icon">
                                            <i class="uil uil-padlock"></i>
                                        </div>
                                    </div>

                                    <div class="form-floating form-floating-custom mb-3">
                                        <input type="password" id="password-confirm" placeholder="Enter Password" class="form-control" name="password_confirmation" required autocomplete="new-password">
                                        <label for="password-confirm">{{ __('Confirm Password') }}</label>
                                        
                                        <div class="form-floating-icon">
                                            <i class="uil uil-padlock"></i>
                                        </div>
                                    </div>

                                    <div class="py-1">
                                        <p class="mb-0">By registering you agree to the Vuesy <a href="#" class="text-primary">Terms of Use</a></p>
                                    </div>

                                    <div class="mt-3">
                                        <button class="btn btn-primary w-100" type="submit">{{ __('Register') }}</button>
                                    </div>
                                    <div class="mt-4 text-center">
                                        <div class="signin-other-title">
                                            <h5 class="font-size-15 mb-4 text-muted fw-medium">- Or you can join with -</h5>
                                        </div>

                                        <div class="d-flex gap-2">
                                            <button type="button" class="btn btn-soft-primary waves-effect waves-light w-100">
                                                <i class="bx bxl-facebook font-size-16 align-middle"></i>
                                            </button>
                                            <button type="button" class="btn btn-soft-info waves-effect waves-light w-100">
                                                <i class="bx bxl-linkedin font-size-16 align-middle"></i>
                                            </button>
                                            <button type="button" class="btn btn-soft-danger waves-effect waves-light w-100">
                                                <i class="bx bxl-google font-size-16 align-middle"></i>
                                            </button>
                                        </div>
                                    </div>

                                    <div class="mt-4 pt-3 text-center">
                                        <p class="text-muted mb-0">Already have an account ? <a href="{{ route('login') }}" class="fw-semibold text-decoration-underline"> Login </a> </p>
                                    </div>

                                </form><!-- end form -->
                            </div>
                        </div>

                    </div>
                </div>
            </div><!-- end row -->

            <div class="row">
                <div class="col-xl-12">
                    <div class="mt-4 mt-md-5 text-center">
                        <p class="mb-0">© <script>
                                document.write(new Date().getFullYear())

                            </script> Vuesy. Crafted with <i class="mdi mdi-heart text-danger"></i> by A2ZStreet</p>
                    </div>
                </div>
            </div> <!-- end row -->
        </div>
    </div>
    <!-- end container fluid -->
</div>
<!-- end authentication section -->

@endsection
