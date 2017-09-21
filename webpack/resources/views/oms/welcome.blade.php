@extends('adminmanager_standard')

@section('asset-css')
    <link href="{{ asset('/css/oms.min.css') }}" rel="stylesheet">
@endsection

@section('content')
    <script src="{{ asset('/js/oms/oms.render.js') }}"></script>
    <script src="{{ asset('/js/oms/oms.filters.js') }}"></script>
    <script src="{{ asset('/js/oms/oms.directives.js') }}"></script>
	<script src="{{ asset('/js/jquery.magnific-popup.min.js') }}"></script>
    <script>
    //全局配置
    window.ENV = window.ENV || {};

    window.REQUEST_PREFIX = "{{ config('view.path_prefix','') }}";

    </script>
    <script src="{{ asset('/js/oms/oms.app.js') }}"></script>

    {{-- <div class="new-oms-container">
        @include('common.sub_side_nav') --}}
        <div class="main-container">
            <center cid="nothing-0">
                <style>[cid=nothing-0] *{transition:color 5s ease;}</style><br/><br/><br/>
                <p style="font-size:160px;">WELCOME</p><br/>
                <font size="7">点击旁边的导航，开始愉快地工作吧 :)</font>
                <script>
                (function(){
                    var me = this;
                    setInterval(function(){
                        me.style.color = '#'+parseInt(0xffffff*Math.random()).toString(16)
                    },5000);
                }).call(document.scripts[document.scripts.length-1].parentNode);
                </script>
            </center>
        </div>
    {{-- </div> --}}
@endsection
