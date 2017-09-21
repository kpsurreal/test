{{-- 账户管理页面 --}}
@extends('adminmanager_standard')

@section('asset-css')
    <link href="{{ asset('/css/selectize.min.css') }}" rel="stylesheet">
    <link href="{{ asset('/js/jquery-confirm/jquery-confirm.min.css') }}" rel="stylesheet">
    <link href="{{ asset('/dist/css/static/oms.css') }}" rel="stylesheet">
    <link href="{{ asset('/dist/css/static/components.css') }}" rel="stylesheet">
    <link href="{{ asset('/js/plugin/multiple-select/multiple-select.css') }}" rel="stylesheet">
    <link href="{{ asset('/css/oms.min.css') }}" rel="stylesheet">

    <style>
        .jconfirm-box-container{
            /*margin-left: 33%;*/
            margin-left: auto;
            margin-right: auto;
            width: 680px;
            box-sizing: content-box;
            position: relative;
            min-height: 1px;
            padding-right: 15px;
            padding-left: 15px;
        }
        .jconfirm.jconfirm-white .jconfirm-box .buttons button.btn-default,.jconfirm.jconfirm-white .jconfirm-box .buttons button.btn-default:hover{
            padding: 2px 4px;
            border-radius: 2px;
            /*background: #fff;
            color: #5b8cf1;*/
            font-weight: normal;

            font-size: 14px;
            color: #fff;
            background-color: #E74C3C;
            width: 100px;
            height: 30px;
        }
        .jconfirm.jconfirm-white .jconfirm-box .buttons{
            float: none;
            text-align: center;
        }
        .jconfirm .jconfirm-box .buttons button+button{
            margin-left: 10px;
        }
        .jconfirm .jconfirm-box div.content-pane .content{
            padding-top: 5px;
            padding-bottom: 20px;
        }
        .confirm-class{
            width: 100px;
            height: 40px;
            background-color: #FFDE00;
            border-radius: 2px;
            color: #333!important;
            font-size: 16px!important;
        }
        .cancel-class{
            width: 100px;
            height: 40px;
            background-color: #f9f9f9;
            border-radius: 2px;
            border: 1px solid #ccc!important;
            color: #333!important;
            font-size: 16px!important;
        }
        a.jquery-confirm-ok:focus{
            background: #f0f0f0;
        }
        .jconfirm .jconfirm-scrollpane{
            background-color: rgba(0,0,0,.4);
        }


    </style>
@endsection

@section('content')
    <div class="main-container fc">
        <section class="section-container">
            {{-- 来自于rms的数据 --}}
        </section>
        <span id="page_tip" class="hide"></span>
    </div>
@endsection

@section('js-private')
    <script>
        //全局配置
        window.ENV = window.ENV || {};
        window.REQUEST_PREFIX = "{{ config('view.path_prefix','') }}";
    </script>
    
    <script src="{{asset('/js/jquery.validate.min.js')}}" type="text/javascript"></script>
    <script src="{{asset('/js/oms/custom.validate.js')}}" type="text/javascript"></script>
    <script src="{{asset('/js/plugin/multiple-select/multiple-select.js')}}" type="text/javascript"></script>
    <script src="{{asset('/js/plugin/doT.min.js')}}" type="text/javascript"></script>
    <script src="{{ asset('/js/jquery-confirm/jquery-confirm.min.js') }}"></script>
    <script type="text/javascript" src="{{ asset('/js/plugin/selectize/js/standalone/selectize.js') }}"></script>

    <script src="{{ asset('/dist/js/common/config.js') }}" type="text/javascript"></script>
    <script src="{{ asset('/dist/js/product/base_lists_v2.js') }}" type="text/javascript"></script>
    <script type="text/json" page-info-data >{!! isset($lists) ? json_encode($lists) : '' !!}</script>
    <script type="text/json" org-info-data >{!! isset($org_info) ? json_encode($org_info) : '' !!}</script>
    <script type="text/json" permission-info-data >{!! isset($permission) ? json_encode($permission) : '' !!}</script>
    <script src="{{ asset('/js/plugin/vue/vue.js') }}"></script>
    <script src="{{ asset('/js/plugin/Sortable/Sortable.min.js')}}" type="text/javascript"></script>
    <script src="{{ asset('/js/plugin/vue-draggable/vuedraggable.min.js')}}" type="text/javascript"></script>
    <script src="{{ asset('/dist/js/common/vue.component.js') }}"></script>
    <script>
        var FD = {};
        FD.accountInfo = JSON.parse( $('[page-info-data]').html() );
        FD.orgInfo = JSON.parse( $('[org-info-data]').html() );
        // FD.permission = JSON.parse( $('[permission-info-data]').html() );
        $(function(){
            $.ajax({
                // url: '/bms-pub/html/product/base_lists_v2.html',
                url: window.REQUEST_PREFIX + '/html/product/base_lists_v2.html',
                type: 'get',
                success: function(data){
                    $('.section-container').html(data);
                    JS_base_lists(window.REQUEST_PREFIX);
                },
                error: function(){

                }
            })
        })
    </script>
@endsection
