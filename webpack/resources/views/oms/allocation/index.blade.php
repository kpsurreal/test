@extends('adminmanager_standard')

{{-- @section('title','订单分配 - '.config('custom.app_name').'资产管理平台') --}}

@section('asset-css')
    @if($host_theme == 'standard')
        <link href="{{ asset('/css/oms.min.css') }}" rel="stylesheet">
    {{-- @elseif($condition) --}}
    @else
        <link href="{{ asset('/css/theme1/oms.min.css') }}" rel="stylesheet">
    @endif

@endsection

@section('content')
    <script>
    //全局配置
    window.ENV = window.ENV || {};
    window.REQUEST_PREFIX = "{{ config('view.path_prefix','') }}";
    </script>
    <script src="{{ asset('/js/oms/oms.app.js') }}"></script>

    @include('oms.order_detail.allocation_index')

    {{-- <div class="new-oms-container">
        @include('common.sub_side_nav') --}}
        <div class="main-container">
            @include('oms.allocation.head',['is_commander'=>true])
            @include('oms.allocation.list_unallocated',['is_commander'=>true])
            @include('oms.allocation.list_allocated_today',['is_commander'=>true])
            @include('oms.allocation.list_allocated_doned',['is_commander'=>true])
            <p class="foot-note">金额单位:元 股票单位:股</p>
        </div>
    {{-- </div> --}}
@endsection
