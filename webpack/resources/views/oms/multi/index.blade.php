@extends('adminmanager_standard')

@section('asset-css')
    <link href="{{ asset('/dist/css/static/oms.css') }}" rel="stylesheet">
    @if($host_theme == 'standard')
        <link href="{{ asset('/css/oms.min.css') }}" rel="stylesheet">
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
    <script src="{{ asset('/js/plugin/vue/vue.js')}}"></script>
    <script src="{{ asset('/dist/js/common/vue.component.js') }}"></script>
    <script src="{{ asset('/dist/js/common/client.electron.js') }}"></script>
    <script src="{{ asset('/dist/js/common/localStorage.js') }}"></script>
    <script src="{{ asset('/dist/js/common/common.saveData.js') }}"></script>

    @include('oms.order_detail.allocation_trader')
    <div class="main-container fc">
        @include('oms.multi.product.main')
    </div>
@endsection
