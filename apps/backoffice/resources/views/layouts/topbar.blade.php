<header id="page-topbar">
    <div class="navbar-header">
        <div class="d-flex">
           <!-- LOGO -->
           <div class="navbar-brand-box">
            <a href="{{ url('index') }}" class="logo logo-dark">
                <span class="logo-sm">
                    <img src="{{URL::asset('assets/images/logo-sm.svg')}}" alt="" height="26">
                </span>
                <span class="logo-lg">
                    <img src="{{URL::asset('assets/images/logo-sm.svg')}}" alt="" height="26"> <span class="logo-txt">Vusey</span>
                </span>
            </a>

            <a href="{{ url('index') }}" class="logo logo-light">
                <span class="logo-sm">
                    <img src="{{URL::asset('assets/images/logo-sm.svg')}}" alt="" height="26">
                </span>
                <span class="logo-lg">
                    <img src="{{URL::asset('assets/images/logo-sm.svg')}}" alt="" height="26"> <span class="logo-txt">Vusey</span>
                </span>
            </a>

        </div>
            <button type="button" class="btn btn-sm px-3 header-item vertical-menu-btn noti-icon">
                <i class="fa fa-fw fa-bars font-size-16"></i>
            </button>
        </div>

        <div class="d-flex">





            <div class="dropdown d-inline-block">
                <div id="app-notification"></div>
            </div>

            <div class="dropdown d-inline-block">
                <button type="button" class="btn header-item user text-start d-flex align-items-center" id="page-header-user-dropdown"
                    data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <img class="rounded-circle header-profile-user" src="{{URL::asset('assets/images/users/avatar-2.jpg')}}"
                    alt="Header Avatar">
                    <span class="ms-2 d-none d-xl-inline-block user-item-desc">
                        <span class="user-name">{{Auth()->user()->name}}<i class="mdi mdi-chevron-down"></i></span>
                    </span>
                </button>
                <div class="dropdown-menu dropdown-menu-end pt-0">
                    <h6 class="dropdown-header">Welcome Marie N!</h6>
                    <a class="dropdown-item" href="{{ url('pages-profile') }}"><i class="bx bx-user-circle text-muted font-size-16 align-middle me-1"></i> <span class="align-middle">Profile</span></a>
                    <div class="dropdown-divider"></div>
                    <a class="dropdown-item" href="#"><i class="mdi mdi-wallet text-muted font-size-16 align-middle me-1"></i> <span class="align-middle">Balance : <b>$6951.02</b></span></a>
                    <a href="javascript:void(0);" class="dropdown-item" onclick="event.preventDefault();document.getElementById('logout-form').submit();"><i class="mdi mdi-logout text-muted font-size-16 align-middle me-1"></i> <span class="align-middle">Logout</span></a>
                    <form id="logout-form" action="{{ route('logout') }}" method="POST" style="display: none;">
                    @csrf
                    </form>
                </div>
            </div>
        </div>
    </div>

    <div class="collapse show verti-dash-content" id="dashtoggle">
        <div class="container-fluid">
            <!-- start page title -->
            {{-- <div class="row">
                <div class="col-12">
                    <div class="page-title-box d-flex align-items-center justify-content-between">
                        <h4 class="mb-0">@@title</h4>

                        <div class="page-title-right">
                            <ol class="breadcrumb m-0">
                                <li class="breadcrumb-item"><a href="javascript: void(0);">@@pagetitle</a></li>
                                <li class="breadcrumb-item active">@@title</li>
                            </ol>
                        </div>

                    </div>
                </div>
            </div> --}}
            @yield('breadcrumb')
            <!-- end page title -->
        </div>
    </div>

</header>