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

    @include('oms.advanced.frozen_fund.detail')

    {{-- <div class="new-oms-container">
        @include('common.sub_side_nav') --}}
        <div class="main-container">
            @include('oms.advanced.head')
            @include('oms.advanced.frozen_fund.list')
            <p class="foot-note">
                金额单位:元 股票单位:股<br/>
                * 若操作失误，请在已完里重新处理
            </p>
        </div>
    {{-- </div> --}}
@endsection
