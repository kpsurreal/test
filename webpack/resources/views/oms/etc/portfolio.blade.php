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
    <script>
    //全局配置
    window.REQUEST_PREFIX = "{{ config('view.path_prefix','') }}";
    </script>
    <script src="{{ asset('/3rd/datepicker/zebra_datepicker.js') }}"></script>
    <script src="{{ asset('/js/oms/oms.app.js') }}"></script>

    {{-- <div class="new-oms-container">
        @include('common.sub_side_nav') --}}
        <div class="main-container">
            @include('oms.etc.portfolio.head')
            @include('oms.etc.portfolio.nav')
        </div>
    {{-- </div> --}}
@endsection
