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
    <script>
    //全局配置
    window.REQUEST_PREFIX = "{{ config('view.path_prefix','') }}";
    </script>
    <script src="{{ asset('/js/oms/oms.app.js') }}"></script>

    @include('oms.advanced.hand_order.detail')

    {{-- <div class="new-oms-container">
        @include('common.sub_side_nav') --}}
        <div class="main-container">
            @include('oms.advanced.head')
            @include('oms.advanced.hand_order.list')
            <p class="foot-note">
                金额单位:元 股票单位:股<br/>
                * 若操作失误，请在已完里重新处理
            </p>
        </div>
    {{-- </div> --}}
@endsection
