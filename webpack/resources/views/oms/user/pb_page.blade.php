@extends('adminmanager_standard')

@section('asset-css')
    <link href="{{ asset('/js/jquery-confirm/jquery-confirm.min.css') }}" rel="stylesheet">
    <link href="{{ asset('/css/oms.min.css') }}" rel="stylesheet">
    <link href="{{ asset('/css/oms_v2/user.min.css') }}" rel="stylesheet">
    <style>
    label.confirm-tips{
        position: absolute;
        display: block;
        right: 11px;
        top: -20px;
    }
    input.tips{
        border-color: #F44336!important;
    }
    input.confirm-tips{
        border-color: #F44336!important;
    }
    .jconfirm-box-container{
        margin-left: 33%;
        width: 380px;
        position: relative;
        min-height: 1px;
        padding-right: 15px;
        padding-left: 15px;
    }
    .jconfirm.jconfirm-white .jconfirm-box .buttons button.btn-default{
        padding: 2px 4px;
        border-radius: 2px;
        background: #fff;
        color: #5b8cf1;
        font-weight: normal;
    }
    .jconfirm.jconfirm-white .jconfirm-box .buttons{
        float: none;
        text-align: center;
    }
    .jconfirm .jconfirm-box .buttons button+button{
        margin-left: 10px;
    }
    .jconfirm .jconfirm-box div.content-pane .content{
        padding-top: 20px;
        /*padding-bottom: 20px;*/
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
    .custom-window-width{
        width: 470px;
    }

    tbody {
        display:block;
        max-height: 460px;
        overflow:auto;
        overflow-y:scroll;
    }
    thead, tbody tr {
        display:table;
        width:100%;
        table-layout:fixed;
    }
    thead {
        width: calc( 100% - 1em )
    }
    </style>
@endsection

@section('content')
    <script>
    //全局配置
    window.ENV = window.ENV || {};
    window.REQUEST_PREFIX = "{{ config('view.path_prefix','') }}";
    </script>
    <script src="{{asset('/js/jquery.validate.min.js')}}" type="text/javascript"></script>
    <script src="{{asset('/js/oms/custom.validate.js')}}" type="text/javascript"></script>
    <script src="{{asset('/js/plugin/doT.min.js')}}" type="text/javascript"></script>
    <script src="{{ asset('/js/jquery-confirm/jquery-confirm.min.js') }}"></script>

    {{-- <div class="new-oms-container">
        @include('common.side_nav') --}}
        <div class="main-container fc">
            <section class="section-container">
                <div>
                    <h2 class="container-title">PB账号维护</h2>
                    {{-- <a class="btn_add productAdd_btn"><i></i>新建产品</a> --}}
                    <div style="clear:both;"></div>
                </div>
                <div class="container-content">
                    <div>
                        <span class="content-title">PB账号列表</span>
                        <span class="content-tip">故障PB账号：</span>
                        <span class="content-tip bug_pb_num"></span>
                    </div>
                    <div style="padding-bottom: 20px;">
                        <p style="margin-left:10px;display:none;"><span class="cancel_num color-red">2个</span>产品的基金经理已<span class="color-red">被注销</span>，可点击<span class="color-red">编辑</span>重新分配</p>
                        {{-- <a class="pb_scan_btn"><i></i>检测</a> --}}
                        <a style="float:right;" class="gaoyi-refresh-btn loading-loading">
                            <i class="oms-icon refresh"></i>刷新
                        </a>
                    </div>
                    <table class="oms-table nothing-nothing loading-loading">
                        <thead>
                            <tr rows-head>
                                <th class="cell-left">券商</th>
                                <th class="cell-left">账号</th>
                                <th class="cell-left">产品单元数</th>
                                <th class="cell-left">状态</th>
                                <th class="cell-left">最近检测时间</th>
                                {{-- <th class="cell-left">更新时间</th> --}}
                                {{-- <th class="cell-left">创建日期</th>
                                <th class="cell-left" style="width:80px;padding-left:20px;"></th> --}}
                            </tr>
                        </thead>
                        <tbody rows-body id="pb_list_content">
                        </tbody>
                    </table>
                </div>
            </section>
            <span id="page_tip" class="hide"></span>
        </div>
    {{-- </div> --}}
    <script id="tabletmpl" type="text/x-dot-template">
        @{{~it.array.lists:v:i}}
            <tr>
                <td class="cell-left">@{{=v.securities_name||'--'}}</td>
                <td class="cell-left">@{{=v.pb_account||'--'}}</td>
                <td class="cell-left">@{{=v.product_count}}</td>
                <td class="cell-left">
                    @{{?1==v.check_status}}
                        <span>@{{='正常'}}</span>
                    @{{??2==v.check_status}}
                        <span style="color:#EE634C;">@{{='故障'}}</span>
                    @{{??}}
                        <span>@{{='--'}}</span>
                    @{{?}}
                </td>
                <td class="cell-left">@{{=v.check_time||'--'}}</td>
            </tr>
        @{{~}}
    </script>
    <script>
    var jc;
    var gridData = {};
    var tipTimer;
    var product_add_data = {};
    var tablefn = doT.template(document.getElementById('tabletmpl').text, undefined, undefined);

    function showTable(data){
        var count = 0;
        data.array.lists.forEach(function(e, i){
            if (1 != e.check_status) {
                count += 1;
            }
        });
        $('.bug_pb_num').html(count);

        document.getElementById('pb_list_content').innerHTML = tablefn(data);//历史列表
    }

    function getTableData(){
        $('.gaoyi-refresh-btn').addClass('loading');
        $.ajax({
            url: window.REQUEST_PREFIX + '/user/pb_list',
            type: 'get',
            data: {},
            success: function(res){
                // debugger;
                gridData.array = res.data;
                showTable(gridData);
                $('.gaoyi-refresh-btn').removeClass('loading');
            },
            error: function(){
                $('.gaoyi-refresh-btn').removeClass('loading');
            }
        });
    }

    $(function(){
        getTableData();

        //pb检测按钮
        $('.gaoyi-refresh-btn').click(function(){
            getTableData();
        });
    })
    </script>
@endsection
