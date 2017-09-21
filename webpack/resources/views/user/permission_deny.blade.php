@extends('adminmanager_standard')

@section('asset-css')
    <link href="{{ asset('/js/jquery-confirm/jquery-confirm.min.css') }}" rel="stylesheet">
    <link href="{{ asset('/css/oms.min.css') }}" rel="stylesheet">
    <link href="{{ asset('/css/oms_v2/user.min.css') }}" rel="stylesheet">
    <style>
    .warn_container{
        padding-top: 145px;text-align: center;
    }
    .warn_div_left{
        margin-right:40px;display:inline-block;width:222px;height:230px;background-image: url(../images/welcome/logo_warn.png);background-size:cover;
    }
    .warn_div_right{
        display:inline-block;width:222px;height:230px;vertical-align: top;
    }
    .warn_div_right h2{
        margin-top: 60px;font-size:23px;
    }
    .warn_div_right p{
        font-size:16px;color:#595959;
    }
    .warn_btn{
        width:160px;height:48px;display:inline-block;font-size:16px;background-color:#FFDE00;line-height:48px;margin-top:30px;border-radius:2px;color:#4A4A4A;
        display:none;
    }
    </style>
@endsection

@section('content')
    <script>
    //全局配置
    window.ENV = window.ENV || {};
    window.REQUEST_PREFIX = "{{ config('view.path_prefix','') }}";
    </script>
    <script src="{{asset('/js/plugin/doT.min.js')}}" type="text/javascript"></script>

    {{-- <div class="new-oms-container">
        @include('common.side_nav') --}}
        <div class="main-container fc" style="color:#324250;">
            {{-- @include('oms.multi.product.main') --}}
            <section class="section-container">
                <div class="warn_container">
                    <div class="warn_div_left"></div>
                    <div class="warn_div_right" >
                        <h2>Oops! 访问出错啦。</h2>
                        <p>您没有访问该页面的权限</p>
                        <p>(若需要请联系管理员授权)</p>
                        <a class="warn_btn">
                            <span style="color:#E74C3C;"></span>前往首页
                        </a>
                    </div>
                </div>

            </section>

            <span id="page_tip" class="hide"></span>
        </div>
    {{-- </div> --}}
    <script>
        $(function(){
            if ($('.side-nav-status').hasClass('close')) {
                $('.side-nav-status').click();
            }
        })
        // var second = 10;
        // function countDown(){
        //     if(0 <= second){
        //
        //     }else{
        //         second -= 1;
        //
        //     }
        // }
        // $(function(){
        //     setInterval(countDown,1000);
        // })
    </script>
@endsection
