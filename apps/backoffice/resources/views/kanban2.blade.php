@extends('layouts.vertical-master-layout')
@section('title')Mentor Thesis - CRM @endsection
@section('css')

<!-- plugin css -->
<link href="{{ URL::asset('assets/libs/jsvectormap/jsvectormap.min.css') }}" rel="stylesheet" type="text/css">
<!-- swiper css -->
<link href="{{ URL::asset('assets/libs/swiper/swiper-bundle.min.css') }}" rel="stylesheet" type="text/css">
@endsection
@section('content')
<div class="row">
    <div class="col-xl-12">
        <div class="card">
            <div class="card-body pb-2">

                <!-- <div id="kanban_new"></div> -->
                <div id="kanban"></div>
                
            </div>

        </div>
    </div>


</div>
@endsection
@section('script')

@endsection
