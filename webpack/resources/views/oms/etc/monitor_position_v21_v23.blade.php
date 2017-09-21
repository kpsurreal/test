@extends('adminmanager_standard')

@section('asset-css')
    <link href="{{ asset('/css/oms.min.css') }}" rel="stylesheet">
@endsection

@section('content')
    <script>
    //全局配置
    window.REQUEST_PREFIX = "{{ config('view.path_prefix','') }}";
    </script>
    <script src="{{ asset('/js/oms/oms.app.js') }}"></script>

    {{-- <div class="new-oms-container">
        @include('common.sub_side_nav') --}}
        <div class="main-container">
            @include('oms.etc.monitor_position_v21_v23.head')
            @include('oms.etc.monitor_position_v21_v23.list_position')
            @include('oms.etc.monitor_position_v21_v23.list_frozen_fund')
            @include('oms.etc.monitor_position_v21_v23.list_fee')
        </div>
    {{-- </div> --}}
@endsection
