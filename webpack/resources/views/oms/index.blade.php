@extends('adminmanager_standard')

@section('asset-css')
    @if($host_theme == 'standard')
        <link href="{{ asset('/css/oms.min.css') }}" rel="stylesheet">
    {{-- @elseif($condition) --}}
    @else
        <link href="{{ asset('/css/theme1/oms.min.css') }}" rel="stylesheet">
    @endif
@endsection

@section('content')
    <script type="text/json" product-basic-data >{!! !empty($basic) ? json_encode($basic) : '' !!}</script>
    <script>
    //全局配置
    window.ENV = window.ENV || {};

    window.REQUEST_PREFIX = "{{ config('view.path_prefix','') }}";
    window.PRODUCT = $('[product-basic-data]').html() && JSON.parse( $('[product-basic-data]').html() );

    //单策略页面直接访问：产品权限数据合并，拼装权限数据
    $(window).on('load spa_product_change',function(event){
        var product = event.product || PRODUCT;
        product.is_waiting = !product.is_running && !product.is_stoped;

        var current_user_permission = $.pullValue(window,'LOGIN_INFO.my_permission.'+product.id,{});
        product.cup = product.current_user_permission = current_user_permission;
    });
    </script>
    <script src="{{ asset('/js/oms/oms.app.js') }}"></script>

    {{-- Realtime the world! --}}
    <script src="{{ asset('/js/oms/ums.js') }}"></script>
    <script src="{{ asset('/js/oms/realtime.js') }}"></script>

    @include('oms.order_detail.allocation_trader')
    {{-- @include('oms.product.position.stock_history') --}}
    {{-- @include('oms.product.position.stop_orders') --}}

    {{-- <div class="new-oms-container">
        @include('common.side_nav') --}}
        <div class="main-container">
            @include('oms.product.main')
        </div>
    {{-- </div> --}}
@endsection
