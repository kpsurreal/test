@extends('adminmanager_standard')

@section('asset-css')
    <link href="{{ asset('/css/oms.min.css') }}" rel="stylesheet">
    <link href="{{ asset('/css/selectize.min.css') }}" rel="stylesheet">
    <link href="{{ asset('/js/jquery-confirm/jquery-confirm.min.css') }}" rel="stylesheet">
    <link href="{{ asset('/js/laydate/need/laydate.css') }}" rel="stylesheet">
    <link href="{{ asset('/js/laydate/skins/molv/laydate.css') }}" rel="stylesheet">
    <link href="{{ asset('/js/plugin/searchable/searchableOptionList.css') }}" rel="stylesheet">
    <style>
        .container-title{
             height:80px;
             /*width:100%;*/
             padding-left: 21px;
             color:#000000;
             font-size: 24px;
             font-weight: bold;
        }
        .container-title p{
            padding-top: 28px;
        }
        .container-content{
            margin-left: 2px;
        }
        .product-info table{
            width:100%;
        }
        .product-info table thead td{
            color:#999999;
            font-size: 12px;
            height: 31px;
            line-height: 31px;
        }
        .product-info table tbody td{
            height: 40px;
        }
        .product-info table td {
            border-top: 1px solid #CCCCCC;
            font-size:12px;
        }
        .nameLeft{
            padding-left: 50px;
        }
        .product-info table tr:last-child td{
            border-bottom: 1px solid #CCCCCC;
        }
        .unusual-title{
            color:#000000;
            height: 65px;
            padding-left: 21px;
            font-size: 18px;
            padding-top: 30px;
            display: flex;
            flex:left;
            position: relative;
        }
        .unusual-title h2{
            border-left: 4px solid #FFDE00;
            height: 20px;
            line-height: 20px;
            padding-left: 14px;
            font-size:16px;
            padding-right: 14px;
        }
        .product-unusual table{
            width:100%;
        }
        .product-unusual table tr{
            width:100%;
        }
        .product-unusual table tr th{
            background: #EEF4F9;height:40px;
            font-size:14px;color:#000;line-height: 40px;
            border-right: 1px solid #E5E5E5;
            border-top: 1px solid #CCCCCC;
            text-align: center;
        }
        .product-unusual table tr td{
            height:40px;
            /*line-height: 40px;*/
            /*text-align: center;*/
            font-size:12px;
            border-top: 1px solid #CCCCCC;
            padding-top: 10px;
            padding-bottom: 10px;
        }
        .product-unusual table thead  td{
            color:#999999;font-size:12px;
        }
        .product-unusual table tr td span{
            background: #FFEB3B;
            width: 46px;
            height: 25px;font-size:12px;display: inline-block;
            margin-top: 8px;
            line-height: 30px;
            border-radius: 3px;
        }
        .anarchy{
            border-right: 1px solid #E5E5E5;
        }
        .product-unusual table tr:last-child td{
            border-bottom: 1px solid #CCCCCC;
        }
        .employer{
            height: 80px;
            line-height: 80px;
            width: 99.8%;
            position: absolute;
            bottom: 0;
            background: #f1f3fa;
            font-size: 12px;
            color: #999999;
            padding-left: 9px;
        }
        .product-unusual table dl {
            line-height: normal;
        }
        .unusual-title select{
            width: 150px;
            height: 32px;
            margin-top:-6px;
            border:1px solid #BEBEBE;
        }
        .color-red{
           color:#F44336;
        }
        .cell-right{
          text-align: right;
        }
        .oms-btn{
            cursor: pointer;
           float:right;
           position: absolute;;
           width: 65px;
           height: 32px;
           background: #E8E9ED;
           font-size: 14px;
           top:45px;
           text-align: center;
           right: 27px;
           line-height: 32px;
        }
        .selectize-input{
           padding:inherit;
           width: 150px;
           height: 32px;
           line-height: 32px;
           top: -6px;
           padding-left: 10px;
           font-size:14px;
           border: 1px solid #BEBEBE;
        }
        .selectize-dropdown-content:hover{
            background: #EEF4F9;
        }
        .ui-datepicker-time{
            width:150px;
            height: 32px;
            position: relative;
            border:1px solid #BEBEBE;
            border-radius: 3px;
            padding-left: 7px;
            background: url("https://dn-gmf-product-face.qbox.me/image/data/data_pic.png") no-repeat;
            background-size: 18px;
            background-position: 124px 7px;
        }
        .dataTime{
            position: relative;
            left: 15px;
            top: -6px;
            font-size: 14px;
            color:#000;
        }
        .exported{
            width: 65px;
            height: 32px;
            background: #E8E9ED;
            border-radius: 3px;
            position: absolute;
            right: 24px;
            top:25px;
            text-align: center;
            font-size: 14px;
            line-height: 32px;
            font-weight: bold;
        }
        .exported i{
            display: inline-block;
            width: 15px;
            height: 14px;
            background: url("https://dn-gmf-product-face.qbox.me/image/data/exported.png") no-repeat;
            background-size: 15px;
            margin-right: 7px;
            margin-top:8px;
        }
        .new-oms-container .main-container{
            background: #fff;
        }
        .sol-container{
            width: 150px;
            margin-top: -6px;
        }
        .sol-action-buttons {
            line-height: 20px;
            color: #555;
            background: #eee;
            padding: 7px 10px;
            border-bottom: 1px solid #ccc;
            border-top-right-radius: 4px;
        }
        .layers{
            position: fixed;
            top: 0;
            left:0;
            right:0;
            bottom:0;
            background:rgba(0,0,0,.4);
        }
        .layersDeal{
            width: 680px;
            height: 284px;
            margin:0 auto;
            background: #fff;
            position: absolute;
            left: 50%;
            margin-left:-340px;
            top:50%;
            margin-top:-142px;
            border-radius: 5px;
        }
        .alreadyDeal{
            margin-left:20px;
            margin-top:30px;
            font-size:20px;
            font-weight: bold;
        }
        .alreadyDeal>span{
            float:right;
            margin-right: 20px;
            margin-top:2px;
            font-weight: normal;
        }
        .established{
            text-align: center;
            font-size: 14px;
            margin-top:55px;
        }
        .btn{
            width: 118px;
            height: 32px;
            background: #F44336;
            color:#fff;
            display: block;
            margin-left:280px;
            border-radius: 3px;
            font-size:14px;
            margin-top:70px;
            border: none;
        }
        .established img{
            width: 20px;
            margin-right: 6px;
            vertical-align: middle;
        }
        .treated:hover{
            cursor: pointer;
        }
        .orderRight{
           text-align: right;
           padding-right: 60px;
        }
        .controlRight{
           text-align: right;
           padding-right: 10px;
           padding-right: 5px;
        }
        .controlLeft{
           padding-left: 15px;
           padding-left: 10px;
        }
        .treated{
           text-align: center;
        }
        .order_refresh{
            right: 100px;
            top: 25px;
            border-radius: 3px;
            font-weight: bold;
        }
    </style>
@endsection

@section('content')
    <script>
    //全局配置
    window.ENV = window.ENV || {};
    window.REQUEST_PREFIX = "{{ config('view.path_prefix','') }}";
    </script>

    <script src="{{ asset('/js/plugin/vue/vue.js') }}"></script>
    <script src="{{ asset('/dist/js/common/vue.component.js') }}"></script>
    <script src="{{asset('/js/jquery.validate.min.js')}}" type="text/javascript"></script>
    <script src="{{asset('/js/oms/custom.validate.js')}}" type="text/javascript"></script>
    <script src="{{asset('/js/plugin/doT.min.js')}}" type="text/javascript"></script>
    <script src="{{ asset('/js/jquery-confirm/jquery-confirm.min.js') }}"></script>
    <script type="text/javascript" src="{{ asset('/js/plugin/selectize/js/standalone/selectize.js') }}"></script>

    <script src="{{ asset('/js/laydate/laydate.js') }}"></script>
    <script src="{{ asset('/js/plugin/searchable/sol-2.0.0.js')}}"></script>
    {{-- @include('common.side_nav') --}}
    <div class="main-container fc">
        <section class="section-container">
            <div class="container-title">
                <p>数据监控核对</p>
                <a class="oms-btn ui-btn gray refresh-btn loading-loadings"><i class="oms-icon refresh"></i>刷新</a>
            </div>
            <div class="container-content">
                <div class="product-info">
                    <table>
                        <thead>
                            <tr>
                                <td class="nameLeft">账户</td>
                                <td class="orderRight">账户现金余额/策略总现金余额</td>
                                <td class="orderRight">账户市值/策略总市值</td>
                                <td class="orderRight">账户委托数/策略总委托数</td>
                                <td class="orderRight">账户委托金额/策略总委托金额</td>
                                <td class="orderRight">账户成交数/策略总成交数</td>
                                <td class="orderRight">账户成交金额/策略总成交金额</td>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- <tr>
                                <td>恒泰01</td>
                                <td>
                                    <dl>
                                        <dt>6,772.67</dt>
                                        <dd>6,772.67</dd>
                                    </dl>
                                </td>
                                <td>
                                    <dl>
                                        <dt>2,996,772.67</dt>
                                        <dd>2,996,772.67</dd>
                                    </dl>
                                </td>
                                <td>
                                    <dl>
                                        <dt>13</dt>
                                        <dd>13</dd>
                                    </dl>
                                </td>
                                <td>
                                    <dl>
                                        <dt>96,772.67</dt>
                                        <dd>96,772.67</dd>
                                    </dl>
                                </td>
                                <td>
                                    <dl>
                                        <dt>13</dt>
                                        <dd>13</dd>
                                    </dl>
                                </td>
                                <td>
                                    <dl>
                                        <dt>96,772.67</dt>
                                        <dd>96,772.67</dd>
                                    </dl>
                                </td>
                            </tr> -->
                        </tbody>
                    </table>
                </div>
                <div class="product-unusual exceptional">
                    <div class="unusual-title">
                        <h2>异常单（<span>0</span>）</h2>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th colspan="10">产品数据信息</th>
                                <th colspan="11">策略数据</th>
                            </tr>
                            <tr>
                                <td class="controlLeft">账户</td>
                                <td class="controlLeft">证券代码</td>
                                <td class="controlLeft">交易方向</td>
                                <td class="controlRight">委托价格</td>
                                <td class="controlRight">委托数量</td>
                                <td class="controlRight">成交价格</td>
                                <td class="controlRight">成交数量</td>
                                <td class="controlRight">状态</td>
                                <td class="controlRight">委托时间</td>
                                <td class="anarchy controlRight">成交时间</td>

                                <td class="controlLeft">策略</td>
                                <td class="controlLeft">证券代码</td>
                                <td class="controlLeft">交易方向</td>
                                <td class="controlRight">委托价格</td>
                                <td class="controlRight">委托数量</td>
                                <td class="controlRight">成交价格</td>
                                <td class="controlRight">成交数量</td>
                                <td class="controlRight">状态</td>
                                <td class="controlRight">委托时间</td>
                                <td class="controlRight">成交时间</td>

                            </tr>
                        </thead>
                        <tbody>
                            <!-- <tr>
                                <td>恒泰01</td>
                                <td>限价买入</td>
                                <td>13.2</td>
                                <td>2000</td>
                                <td>13.2</td>
                                <td class="color-red">1000</td>
                                <td class="anarchy color-red">部撤</td>
                                <td>渔人01</td>
                                <td>限价买入</td>
                                <td>13.2</td>
                                <td>2000</td>
                                <td>13.2</td>
                                <td class="color-red">1000</td>
                                <td class="color-red">已成交</td>
                                <td><span>已处理</span></td>
                            </tr> -->
                        </tbody>
                    </table>
                </div>
                <div class="product-unusual product-unusual-content">
                    <div class="unusual-title">
                        <h2>订单核对</h2>
                        <div class="selectize-control single">
                            <div class="selectize-input items has-options full has-items" style="background-color: initial;">
                                <div class="item" data-value="0" title="全部类型">选择账户</div>
                                <input type="text" autocomplete="off" tabindex="" id="search_type-selectized" style="width: 4px; opacity: 0; position: absolute; left: -10000px;">
                            </div>
                            <div class="selectize-dropdown single" style="display: none; visibility: visible; width: 150px; top: 27px; left: 0px;">
                                <!-- <div class="selectize-dropdown-content">
                                    <div class="option selected" title="全部类型" data-selectable="" data-value="0">选择账户</div>
                                </div> -->
                            </div>
                        </div>
                        <!-- 日历 -->
                        <!-- <div class="dataTime">
                            <input type="text" class="ui-datepicker-time" readonly="" value="2016-11-23" onClick="laydate()"> －
                            <input type="text" class="ui-datepicker-time" readonly="" value="2016-11-24" onClick="laydate()">
                        </div> -->
                        <a class="oms-btn ui-btn gray refresh-btn loading-loading order_refresh" style="display:none;"><i class="oms-icon refresh "></i>刷新</a>
                        <a class="exported policy-export-btn" style="cursor:pointer;"><i></i>导出</a>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th colspan="8">产品数据信息</th>
                                <th colspan="9">策略数据</th>
                            </tr>
                            <tr>
                                <td class="controlLeft">账户</td>
                                <td class="controlLeft">证券代码</td>
                                <td class="controlLeft">交易方向</td>
                                <td class="controlRight">委托价格</td>
                                <td class="controlRight">委托数量</td>
                                <td class="controlRight">成交价格</td>
                                <td class="controlRight">成交数量</td>
                                <td class="anarchy controlRight">委托时间</td>
                                <td class="controlLeft">策略</td>
                                <td class="controlLeft">证券代码</td>
                                <td class="controlLeft">交易方向</td>
                                <td class="controlRight">委托价格</td>
                                <td class="controlRight">委托数量</td>
                                <td class="controlRight">成交价格</td>
                                <td class="controlRight">成交数量</td>
                                <td class="controlRight">委托时间</td>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- <tr>
                                <td>恒泰01</td>
                                <td></td>
                                <td>限价买入</td>
                                <td>13.2</td>
                                <td>2000</td>
                                <td>13.2</td>
                                <td>1000</td>
                                <td class="anarchy">
                                    <dl>
                                       <dt>2016-12-11</dt>
                                       <dd>12:12:12</dd>
                                    </dl>
                                </td>
                                <td>渔人01</td>
                                <td></td>
                                <td>限价买入</td>
                                <td>13.2</td>
                                <td>2000</td>
                                <td>13.2</td>
                                <td>1000</td>
                                <td>
                                   <dl>
                                      <dt>2016-12-11</dt>
                                      <dd>12:12:12</dd>
                                   </dl>
                                </td>
                            </tr>-->
                        </tbody>
                    </table>
                </div>
                <div style="height: 80px;width:100%;"></div>
                <div class="employer">金额单位:元  &nbsp;&nbsp; 股票单位:股</div>
            </div>
        </section>
    </div>
    <div class="layers" style="display:none;">
        <div class="layersDeal">
            <p class="alreadyDeal">已处理确认<span>x</span></p>
            <p class="established"><img src="https://dn-gmf-product-face.qbox.me/image/data/deal.png"/>您确定已处理此异常？确定则该条记录不再显示为异常单</p>
            <button class="btn">确认</button>
        </div>
    </div>
    <script>
        $(function(){
            document.title = '数据监控核对' + ' - {{config('custom.app_name')}}资产管理平台';
        })

        var arrId = [];
        var dropdownId;
        var exceptional = '';
        var except = '';
        var orderPartsFlag = true;
        Number.prototype.formatMoney = function(c, d, t){
            var n = this,
                c = isNaN(c = Math.abs(c)) ? 2 : c,
                d = d == undefined ? "." : d,
                t = t == undefined ? "," : t,
                s = n < 0 ? "-" : "",
                i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "",
                j = (j = i.length) > 3 ? j % 3 : 0;
            return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
        };
        $(".selectize-input").click(function () {
            $(".selectize-dropdown").show();
        });
        $(document).on('click', '.selectize-dropdown .option', function(){
          $(".selectize-dropdown").hide();
          $(".selectize-input").html($(this).html());
        });
        $(document).on('click', function(e){
          if ($(e.target).hasClass('selectize-input') || $(e.target.parentElement).hasClass('selectize-input')) {

          }else{
            $(".selectize-dropdown").hide();
          }
        });
        //刷新
        $(".loading-loadings").click(function () {
            checked();
        });

        $(document).on('click', '.selectize-dropdown-content', function(){
            dropdownId = $(this).find('.option').attr('data-id');
            orderParts(dropdownId);
        });

        setInterval(function(){
          checked();
        }, 10 * 1000);

        var checked = function () {
            var htmlContent = '';
            var htmlExceptional = '';
            $(".loading-loadings").addClass('loading');
            $.ajax({
                type: 'get',
                url: window.REQUEST_PREFIX + '/oms/report/get_monitor_data',
                data: {
                },
                success: function(res){
                    var content = res.data.census;
                    var diff = res.data.diff;
                    var dropdown = '';
                    arrId = [];
                    Object.keys(content).forEach(function(e){
                        arrId.push(e);
                        dropdown += '<div class="selectize-dropdown-content">'+
                           '<div class="option selected" data-id="'+ e +'" title="'+ content[e].name +'" data-selectable="" data-value="0">'+content[e].name+'</div>'+
                           '</div>';

                        htmlContent += '<tr>'+
                            '<td class="nameLeft">'+content[e].name+'</td>'+
                            '<td class="orderRight"><dl><dt>'+parseFloat(content[e].balance_amount.base).formatMoney(3,'.',',')+'</dt><dd>'+parseFloat(content[e].balance_amount.child).formatMoney(3,'.',',')+'</dd></dl></td>'+
                            '<td class="orderRight"><dl><dt>'+parseFloat(content[e].market_value.base).formatMoney(3,'.',',')+'</dt><dd>'+parseFloat(content[e].market_value.child).formatMoney(3,'.',',')+'</dd></dl></td>'+
                            '<td class="orderRight"><dl><dt>'+parseInt(content[e].entrust_count.base)+'</dt><dd>'+parseInt(content[e].entrust_count.child)+'</dd></dl></td>'+
                            '<td class="orderRight"><dl><dt>'+parseFloat(content[e].entrust_value.base).formatMoney(3,'.',',')+'</dt><dd>'+parseFloat(content[e].entrust_value.child).formatMoney(3,'.',',')+'</dd></dl></td>'+
                            '<td class="orderRight"><dl><dt>'+parseInt(content[e].deal_count.base)+'</dt><dd>'+parseInt(content[e].deal_count.child)+'</dd></dl></td>'+
                            '<td class="orderRight"><dl><dt>'+parseFloat(content[e].deal_value.base).formatMoney(3,'.',',')+'</dt><dd>'+parseFloat(content[e].deal_value.child).formatMoney(3,'.',',')+'</dd></dl></td></tr>';
                    })
                    $(".product-info table tbody").html(htmlContent);
                    $(".orderRight").each(function () {
                        if ($(this).children().children("dt").html() != $(this).children().children("dd").html()) {
                            $(this).css("color", "#F44336");
                        }
                    })

                    $(".selectize-dropdown").html(dropdown);
                    if (true ==  orderPartsFlag) {
                        orderPartsFlag = false;
                        dropdownId = arrId[0];
                        orderParts(arrId[0]);
                    }

                    // console.log(Object.keys(diff));
                    Object.keys(diff).sort(function(a, b){
                        var arrA = a.split('-');
                        var arrB = b.split('-');
                        var flag = true;
                        if (arrA.length === arrB.length) {
                            for (var i = 0; i < arrA.length; i++) {
                                if (arrA[i] > arrB[i]) {
                                    flag = arrA[i] - arrB[i];
                                    break;
                                }
                                if (arrA[i] === arrB[i]) {
                                    flag = arrA[i] - arrB[i];
                                }
                                if (arrA[i] < arrB[i]) {
                                    flag = arrA[i] - arrB[i];
                                    break;
                                }
                            }
                        }
                        return flag;
                    }).forEach(function(e){
                        var deal_way,stock_name,stock_code;
                        if (diff[e].base.entrust_model == 0 || diff[e].child.entrust_model == 0) {
                            if (diff[e].base.entrust_type == 1 || diff[e].child.entrust_type == 1) {
                                deal_way = "限价买入";
                            } else if (diff[e].base.entrust_type == 2 || diff[e].child.entrust_type == 2) {
                                deal_way = "限价卖出";
                            }
                        }else if (diff[e].base.entrust_model == undefined){
                            if (diff[e].base.entrust_type == 1 || diff[e].child.entrust_type == 1) {
                                deal_way = "买入";
                            } else if (diff[e].base.entrust_type == 2 || diff[e].child.entrust_type == 2) {
                                deal_way = "卖出";
                            }
                        } else {
                            if (diff[e].base.entrust_type == 1 || diff[e].child.entrust_type == 1) {
                                //  deal_way = "市价" + diff[e].base.entrust_model + "买入";
                                deal_way = "市价买入";
                            } else if (diff[e].base.entrust_type == 2 || diff[e].child.entrust_type == 2) {
                                //  deal_way = "市价" + diff[e].base.entrust_model + "卖出";
                                deal_way = "市价卖出";
                            }
                        }
                        if (diff[e].base.stock_name == '' || diff[e].base.stock_name == null || diff[e].base.stock_name == undefined) {
                            stock_name = '';
                        } else {
                            stock_name = diff[e].base.stock_name;
                        }
                        if (diff[e].base.stock_code == "" || diff[e].base.stock_code == null || diff[e].base.stock_code == undefined) {
                            stock_code = '';
                        }else {
                            stock_code = diff[e].base.stock_code;
                        }

                        var td1 = diff[e].base.robotor_name;
                        var td2 = td3 = td4 = td5 = td6 = td7 = td8 = td9 = td10 = td11 = td12 = td13 = td14 = td15 = td16 = '';
                        var leftEntrustAt = '<td class="controlRight">'+diff[e].base.entrust_at+'</td>';
                        var rightEntrustAt = '<td class="controlRight">'+diff[e].child.created_at+'</td>';
                        var leftDealAt = '<td class="anarchy controlRight">'+diff[e].base.deal_at+'</td>';
                        var rightDealAt = '<td class="controlRight">'+diff[e].child.deal_at+'</td>';
                        if (diff[e].base.stock_name == "" || diff[e].base.stock_name == null || diff[e].base.stock_name == undefined) {
                            td2 = '无对应记录';
                            td3 = '<td class="controlLeft"></td>'
                            td6 = td5 = td4 = td7 = '<td class="controlRight"> </td>'
                            td8 = '<td class="controlRight"> </td>';
                            leftEntrustAt = '<td class="controlRight"></td>';
                            leftDealAt = '<td class="anarchy controlRight"></td>';
                        }  else {
                            td2 = '<dl><dt>'+stock_name+'</dt><dd>'+stock_code+'</dd></dl>';
                            td3 = '<td class="controlLeft">'+deal_way+'</td>';
                            td4 = '<td class="controlRight">'+parseFloat(diff[e].base.entrust_price).formatMoney(3,'.',',')+'</td>';
                            td5 = '<td class="controlRight">'+parseInt(diff[e].base.entrust_amount).formatMoney(0,'.',',')+'</td>';
                            td6 = '<td class="controlRight">'+parseFloat(diff[e].base.deal_price).formatMoney(3,'.',',')+'</td>';
                            td7 = '<td class="controlRight transac">'+parseInt(diff[e].base.deal_amount).formatMoney(0,'.',',')+'</td>';
                            td8 = '<td class="controlRight">'+diff[e].base.status_desc+'</td>';

                        }
                        if (diff[e].child == "") {
                            td9 = '无对应记录';
                            td10 = ' ';
                            td15 = td14 = td13 = td12 = td11 = td16 = '<td> </td>'
                            rightEntrustAt = '<td class="controlRight"></td>';
                            rightDealAt = '<td class="controlRight"></td>';
                        } else {
                            td9 = diff[e].child.product_name;
                            td10 = '<dl><dt>'+diff[e].child.stock_name+'</dt><dd>'+diff[e].child.entrust_stock_code+'</dd></dl>';
                            td11 = '<td class="controlLeft">'+deal_way+'</td>';
                            td12 = '<td class="controlRight">'+parseFloat(diff[e].child.entrust_price).formatMoney(3,'.',',')+'</td>';
                            td13 = '<td class="controlRight">'+parseInt(diff[e].child.entrust_amount).formatMoney(0,'.',',')+'</td>';
                            td14 = '<td class="controlRight">'+parseFloat(diff[e].child.deal_price).formatMoney(3,'.',',')+'</td>';
                            td15 = '<td class="controlRight">'+parseInt(diff[e].child.deal_amount).formatMoney(0,'.',',')+'</td>';
                            td16 = '<td class="controlRight">'+diff[e].child.status_desc+'</td>';
                        }
                        if (td9 != '无对应记录' && td2 != '无对应记录') {
                            if (diff[e].child.deal_amount != diff[e].base.deal_amount) {
                                td15 = '<td class="controlRight color-red">'+parseInt(diff[e].child.deal_amount).formatMoney(0,'.',',')+'</td>';
                                td7 = '<td class="controlRight color-red">'+parseInt(diff[e].base.deal_amount).formatMoney(0,'.',',')+'</td>';
                            }
                            if ($(td11).html() != $(td3).html()) {
                                td3 = td11 = '<td class="controlLeft color-red">'+deal_way+'</td>';
                            }
                            if (diff[e].child.entrust_price != diff[e].base.entrust_price) {
                                td12 = '<td class="controlRight color-red">'+parseFloat(diff[e].child.entrust_price).formatMoney(3,'.',',')+'</td>';
                                td4 = '<td class="controlRight color-red">'+parseFloat(diff[e].base.entrust_price).formatMoney(3,'.',',')+'</td>';
                            }
                            if (diff[e].child.entrust_amount != diff[e].base.entrust_amount) {
                                td5 = '<td class="controlRight color-red">'+parseInt(diff[e].base.entrust_amount).formatMoney(0,'.',',')+'</td>';
                                td13 = '<td class="controlRight color-red">'+parseInt(diff[e].child.entrust_amount).formatMoney(0,'.',',')+'</td>';
                            }
                            if(diff[e].base.deal_price != diff[e].child.deal_price) {
                                td14 = '<td class="controlRight color-red">'+parseFloat(diff[e].child.deal_price).formatMoney(3,'.',',')+'</td>';
                                td6 = '<td class="controlRight color-red">'+parseFloat(diff[e].base.deal_price).formatMoney(3,'.',',')+'</td>';
                            }
                        }

                        // 做什么事情
                        exceptional = '<tr>'+
                            '<td class="controlLeft">'+td1+'</td>'+
                            '<td class="controlLeft">'+td2+'</td>'+ td3+
                            td4+
                            td5+
                            td6+
                            td7+
                            td8+
                            leftEntrustAt+
                            leftDealAt;
                        except = '<td class="controlLeft">'+td9+'</td>'+
                            '<td class="controlLeft">'+td10+'</td>'+
                            td11+
                            td12+
                            td13+
                            td14+
                            td15+
                            td16+
                            rightEntrustAt+
                            rightDealAt;
                        htmlExceptional += exceptional+except+
                            '<td class="controlRight"><span class="treated" data-id="'+ e +'">处理</span></td></tr>';

                    })
                    $(".exceptional table tbody").html(htmlExceptional);
                    orderCheck();
                    $(".product-unusual .unusual-title h2 span").html($(".exceptional table tbody tr").size());
                    $(".exceptional table tbody tr td").each(function () {
                        if ($(this).html() == '无对应记录') {
                            $(this).addClass("color-red");
                        }
                    })
                    $(".loading-loadings").removeClass('loading');
                },
                error: function(){
                    $(".loading-loadings").removeClass('loading');
                }
            })
        }
        checked();
        function orderParts(dropdownId) {
            var order = '';
            $('.order_refresh').addClass('loading');
            $.ajax({
                type: 'get',
                url: window.REQUEST_PREFIX + '/oms/report/get_monitor_list?roboter_id=' + dropdownId,
                success: function(res){
                    var diff = res.data;
                     Object.keys(diff).forEach(function(e){
                        var deal_way;
                        if (diff[e].base.entrust_model == 0 || diff[e].child.entrust_model == 0) {
                            if (diff[e].base.entrust_type == 1 || diff[e].child.entrust_type == 1) {
                                deal_way = "限价买入";
                            } else if (diff[e].base.entrust_type == 2 || diff[e].child.entrust_type == 2) {
                                deal_way = "限价卖出";
                            }
                        }else if (diff[e].base.entrust_model == undefined){
                             if (diff[e].base.entrust_type == 1 || diff[e].child.entrust_type == 1) {
                                 deal_way = "买入";
                             } else if (diff[e].base.entrust_type == 2 || diff[e].child.entrust_type == 2) {
                                deal_way = "卖出";
                             }
                        }  else {
                            if (diff[e].base.entrust_type == 1 || diff[e].child.entrust_type == 1) {
                                deal_way = "市价买入";
                            } else if (diff[e].base.entrust_type == 2 || diff[e].child.entrust_type == 2) {
                                deal_way = "市价卖出";
                            }
                        }
                        var td1 = diff[e].base.robotor_name;
                        var td2 = td3 = td4 = td5 = td6 = td7 = td8 = td9 = td10 = td11 = td12 = td13 = td14 = td15 = td16 = '';
                        if (diff[e].base.stock_name == "" || diff[e].base.stock_name == null || diff[e].base.stock_name == undefined) {
                            td2 = '无对应记录';
                            td3 = td4 = td5 = td6 = td7 = td8 = '&nbsp;';
                        }  else {
                            td2 = '<dl><dt>'+diff[e].base.stock_name+'</dt><dd>'+diff[e].base.stock_code+'</dd></dl>';
                            td3 = deal_way;
                            td4 = parseFloat(diff[e].base.entrust_price).formatMoney(3,'.',',');
                            td5 = parseInt(diff[e].base.entrust_amount).formatMoney(0,'.',',');
                            td6 = parseFloat(diff[e].base.deal_price).formatMoney(3,'.',',');
                            td7 = parseInt(diff[e].base.deal_amount).formatMoney(0,'.',',');
                            td8 = '<dl><dt>'+diff[e].base.entrust_date+'</dt><dd>'+diff[e].base.entrust_time+'</dd></dl>';
                        }
                        if (diff[e].child == "") {
                            td9 = '无对应记录';
                            td10 = td11 = td12 = td13 = td14 = td15 = td16 = '&nbsp;';
                        } else {
                            td9 = diff[e].child.product_name;
                            td10 = '<dl><dt>'+diff[e].child.stock_name+'</dt><dd>'+diff[e].child.entrust_stock_code+'</dd></dl>';
                            td11 = deal_way;
                            td12 = parseFloat(diff[e].child.entrust_price).formatMoney(3,'.',',');
                            td13 = parseInt(diff[e].child.entrust_amount).formatMoney(0,'.',',');
                            td14 = parseFloat(diff[e].child.deal_price).formatMoney(3,'.',',');
                            td15 = parseInt(diff[e].child.deal_amount).formatMoney(0,'.',',');
                            td16 = '<dl><dt>'+diff[e].child.created_at.split(/\s/)[0]+'</dt><dd>'+diff[e].child.created_at.split(/\s/)[1]+'</dd></dl>';
                        }
                        exceptional = '<tr>'+
                                            '<td class="controlLeft">'+td1+'</td>'+
                                            '<td class="controlLeft">'+td2+'</td>'+
                                            '<td class="controlLeft">'+td3+'</td>'+
                                            '<td class="controlRight">'+td4+'</td>'+
                                            '<td class="controlRight">'+td5+'</td>'+
                                            '<td class="controlRight">'+td6+'</td>'+
                                            '<td class="controlRight transac">'+td7+'</td>';
                        except = '<td class="controlLeft">'+td9+'</td>'+
                                      '<td class="controlLeft">'+td10+'</td>'+
                                      '<td class="controlLeft">'+td11+'</td>'+
                                      '<td class="controlRight">'+td12+'</td>'+
                                      '<td class="controlRight">'+td13+'</td>'+
                                      '<td class="controlRight">'+td14+'</td>'+
                                      '<td class="controlRight transactions">'+td15+'</td>';
                    order += exceptional+
                                        '<td class="anarchy controlRight statute">'+td8+'</td>'+except+
                                        '<td class="controlRight status">'+td16+'</td></tr>';

                   })
                   $(".product-unusual-content table tbody").html(order);
                   $('.order_refresh').removeClass('loading');
                },
                error: function(){
                  $('.order_refresh').removeClass('loading');
                }
            })
        }
        //导出
        $('.policy-export-btn').on('click', function(){
            var html = window.REQUEST_PREFIX + '/oms/report/download_monitor_list?roboter_id='+dropdownId;
            $(this).attr('href', html);
        });

        var handle_id;
        $(document).on('click', '.layersDeal .alreadyDeal>span', function () {
            $(".layers").hide();
            $(".product-unusual .unusual-title h2 span").html($(".exceptional table tbody tr").size());
        })
        $(document).on('click', '.layersDeal .btn', function () {
        // $(".layersDeal .btn").click(function () {
            $.ajax({
                type: 'get',
                url: window.REQUEST_PREFIX + '/oms/report/handle_diff?diff_id=' + handle_id,
                success: function (res) {
                    if (res.data.result == 1) {
                        $(".layers").hide();
                        checked();
                        // $(e).parent().parent().remove();
                        // $(".product-unusual .unusual-title h2 span").html($(".exceptional table tbody tr").size());
                        // return;
                    }
                },
                error: function () {

                }
            })
        })
        // 处理按钮的事件
        function orderCheck () {
            // $(".treated").each(function (index, e) {
            $('.treated').on('click',function () {
                var e = $(this);
                handle_id = $(this).attr('data-id');
                $(".layers").show();
                // $(".layersDeal .alreadyDeal>span").click(function () {
                //     $(".layers").hide();
                //     $(".product-unusual .unusual-title h2 span").html($(".exceptional table tbody tr").size());
                // })
                //
                // $(".layersDeal .btn").click(function () {
                //     $.ajax({
                //         type: 'get',
                //         url: window.REQUEST_PREFIX + '/oms/report/handle_diff?diff_id=' + dropdownId,
                //         success: function (res) {
                //             if (res.data.result == 1) {
                //                 $(".layers").hide();
                //                 checked();
                //                 // $(e).parent().parent().remove();
                //                 // $(".product-unusual .unusual-title h2 span").html($(".exceptional table tbody tr").size());
                //                 // return;
                //             }
                //         },
                //         error: function () {
                //
                //         }
                //     })
                // })
            })

            // })
         }
    </script>
    {{-- <script src="{{ asset('/dist/js/common/vue.filter.js') }}"></script> --}}
    <script src="{{ asset('/dist/js/risk_info.js') }}"></script>

@endsection
