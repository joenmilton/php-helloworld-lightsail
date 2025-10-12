<!doctype html>
<html>

<head>
    <meta charset="utf-8">
    <meta content="width=device-width, initial-scale=1.0" name="viewport">

    <title> @yield('title')| Deals - Admin & Dashboard</title>
    <meta content="Premium Multipurpose Admin & Dashboard Template" name="description" />
    <meta content="A2ZStreet" name="author" />
        
    <!-- Favicons -->
    <link href="{{ URL::asset('assets/images/favicon.ico')}}" rel="icon">

    <!-- Google Fonts -->
    <link href="https://fonts.gstatic.com" rel="preconnect">
    <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,300i,400,400i,600,600i,700,700i|Nunito:300,300i,400,400i,600,600i,700,700i|Poppins:300,300i,400,400i,500,500i,600,600i,700,700i" rel="stylesheet">

    @include('layouts.head')
</head>
<body data-topbar="dark">

    <div id="react-app" data-auth-user="{{ Auth::user() ? json_encode(Auth::user()->only(['id', 'name', 'email'])) : 'null' }}"></div>
    @yield('content')
    
    @include('layouts.vendor-script')
</body>

</html>
