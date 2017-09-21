@extends('adminmanager_standard')

@section('asset-css')
    <link href="{{ asset('/css/oms.min.css') }}" rel="stylesheet">
    <link href="{{ asset('/3rd/datepicker/css/zebra_datepicker.css') }}" rel="stylesheet">
    <style>
        .Zebra_DatePicker{width:200px;top:40px!important;line-height:1;}
        .Zebra_DatePicker table{width:100%!important;}
        button.Zebra_DatePicker_Icon_Inside_Right{top:13px!important;right:2px!important;}
    </style>
@endsection

@section('content')
    <script type="text/json" product-basic-data >{!! !empty($basic) ? json_encode($basic) : '' !!}</script>
    <script>
    //全局配置
    window.ENV = window.ENV || {};
    window.REQUEST_PREFIX = "{{ config('view.path_prefix','') }}";
    window.PRODUCT = $('[product-basic-data]').html() && JSON.parse( $('[product-basic-data]').html() );
    </script>
    <script src="{{ asset('/3rd/datepicker/zebra_datepicker.js') }}"></script>
    <script src="{{ asset('/js/oms/oms.app.js') }}"></script>

    {{-- <div class="new-oms-container">
        @include('common.sub_side_nav') --}}
        <div class="main-container">
            @include('oms.report.head')

            @yield('table')

            <p class="foot-note">
                金额单位:元 股票单位:股<br/>
            </p>
        </div>
    {{-- </div> --}}
@endsection
