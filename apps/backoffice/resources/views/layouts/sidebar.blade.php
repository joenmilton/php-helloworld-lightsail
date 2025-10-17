<!-- ========== Left Sidebar Start ========== -->
<div class="vertical-menu">


     <!-- LOGO -->
     <div class="navbar-brand-box">
        <a href="{{ url('admin.home.index') }}" class="logo logo-dark">
            <span class="logo-sm">
                <img src="{{URL::asset('assets/images/logo-sm.svg')}}" alt="" height="26">
            </span>
            <span class="logo-lg">
                <img src="{{URL::asset('assets/images/logo-sm.svg')}}" alt="" height="26"> <span class="logo-txt">Vuesy</span>
            </span>
        </a>

        <a href="{{ url('admin.home.index') }}" class="logo logo-light">
            <span class="logo-sm">
                <img src="{{URL::asset('assets/images/logo-sm.svg')}}" alt="" height="26">
            </span>
            <span class="logo-lg">
                <img src="{{URL::asset('assets/images/logo-sm.svg')}}" alt="" height="26"> <span class="logo-txt">Vuesy</span>
            </span>
        </a>
    </div>

    <button type="button" class="btn btn-sm px-3 font-size-16 header-item vertical-menu-btn">
        <i class="fa fa-fw fa-bars"></i>
    </button>

    <div data-simplebar class="sidebar-menu-scroll">

        <!--- Sidemenu -->
        <div id="sidebar-menu">
            <!-- Left Menu Start -->
            <ul class="metismenu list-unstyled" id="side-menu">
                <li class="menu-title" data-key="t-menu">Menu</li>
                <li>
                    <a href="{{ route('admin.home.index') }}">
                        <i class="fas fa-home nav-icon"></i>
                        <span class="menu-item" data-key="t-deals">Home</span>
                    </a>
                </li>
                @canany(['view own deals', 'view all deals', 'view team deals'])
                <li>
                    <a href="{{ route('admin.deals.index') }}">
                        <i class="fas fa-ticket-alt nav-icon"></i>
                        <span class="menu-item" data-key="t-deals">Deals</span>
                    </a>
                </li>
                @endcan
                @canany(['view own activities', 'view all activities', 'view deal activities'])
                <li>
                    <a href="{{ route('admin.activity.index') }}">
                        <i class="uil-calender nav-icon"></i>
                        <span class="menu-item" data-key="t-deals">Activites</span>
                    </a>
                </li>
                @endcan
                @can(['view payments'])
                <li>
                    <a href="{{ route('admin.payments.index') }}">
                        <i class="bx bx-money nav-icon"></i>
                        <span class="menu-item" data-key="t-deals">Payments</span>
                    </a>
                </li>
                @endcan
                @can('view products')
                <li>
                    <a href="{{ route('admin.products.index') }}">
                        <i class="uil-postcard nav-icon"></i>
                        <span class="menu-item" data-key="t-deals">Services</span>
                    </a>
                </li>
                @endcan
                @can('view publication sheet')
                <li>
                    <a href="{{ route('admin.sheet.process') }}">
                        <i class="uil-table nav-icon"></i>
                        <span class="menu-item" data-key="t-deals">Publication Sheet</span>
                    </a>
                </li>
                @endcan
                @can('update settings')
                <li>
                    <a href="{{ route('admin.settings.index', ['general']) }}">
                        <i class="bx bx-cog nav-icon"></i>
                        <span class="menu-item" data-key="t-settings">Settings</span>
                    </a>
                </li>
                @endcan
            </ul>
        </div>
        <!-- Sidebar -->
    </div>
</div>
<!-- Left Sidebar End -->