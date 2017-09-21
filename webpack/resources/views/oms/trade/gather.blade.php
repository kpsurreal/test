@extends('adminmanager_standard')

{{-- @section('title',config('custom.app_name').'资产管理平台') --}}

@section('asset-css')
    <link href="{{ asset('/css/oms.min.css') }}" rel="stylesheet">
@endsection

@section('content')
    <script>
    //全局配置
    window.ENV = window.ENV || {};

    window.REQUEST_PREFIX = "{{ config('view.path_prefix','') }}";

    </script>
    <script src="{{ asset('/js/oms/oms.app.js') }}"></script>

    @include('oms.order_detail.allocation_trader')

    {{-- <div class="new-oms-container">
        @include('common.sub_side_nav') --}}
        <div class="main-container">
            @include('oms.allocation.head',['is_trader'=>true])
            @include('oms.allocation.list_allocated_today',['is_trader'=>true])
            @include('oms.allocation.list_allocated_doned',['is_trader'=>true])
            <p class="foot-note">金额单位:元 股票单位:股</p>
        </div>
    {{-- </div> --}}
@endsection
