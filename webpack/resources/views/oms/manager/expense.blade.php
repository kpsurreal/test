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
             min-height: 67px;
             /*width:100%;*/
             padding-left: 21px;
             color:#000000;
             font-size: 24px;
             font-weight: bold;
        }
        .container-title p{
            padding-top: 28px;
        }
        .container-title .item{
            float:left;margin-top: 18px;
        }
        .oms-btn{
           float:right;
           position: absolute;;
           width: 65px;
           height: 32px;
           background: #E8E9ED;
           font-size: 14px;
           top:28px;
           text-align: center;
           right: 27px;
           line-height: 32px;
           cursor: pointer;
        }
        .single{
            float:left;
        }
        .exported{
            width: 65px;
            height: 32px;
            background: #E8E9ED;
            border-radius: 3px;
            position: absolute;
            right: 100px;
            top:28px;
            text-align: center;
            font-size: 14px;
            line-height: 32px;
            font-weight: bold;
            cursor: pointer;
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
        .contain-banner{
            width: 100%;
            height: 84px;
            background:#fff;
        }
        .contain-banner-div{
            padding-top:20px;
            padding-left: 45px;
            font-size: 12px;
            color: #A2A2A2;
        }
        .parts{
            width: 100%;
        }
        .parts>thead{
            color:#A2A2A2;
            height: 30px;
            font-size: 12px;
            line-height: 30px;
            border-top:1px solid #E2E2E2;
        }
        .parts td{
            /*text-align: center;*/
            border-bottom:1px solid #E2E2E2;
        }
        .partLeft{
            text-align: left;
        }
        .partRight{
            text-align: right;
            padding-right: 60px;
        }
        .parts tbody tr td{
            height: 38px;
            line-height: 38px;
            font-size: 12px;
        }
        .partDate{
            width: 95%;
            margin:0 auto;
        }
        .partDate thead{
            color:#A2A2A2;
            height: 30px;
            font-size: 12px;
            line-height: 30px;
        }
        .partDate tr:last-child td{
             border-bottom:none;
        }
        .partDate tbody td{
            /*text-align: center;*/
            border-top:1px solid #E2E2E2;
        }
        .partDate tbody tr td{
            height: 38px;
            line-height: 38px;
            font-size: 12px;
        }
        .changeType{
            width: 81px;
            height: 20px;
            font-size:12px;
            line-height: 20px;
            border: 1px solid #CCCCCC;
            color:#999999;
            margin-left: 8px;
            padding-left: 5px;
            padding-right: 5px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .allType .option{
            width: 80px;
            display: block;
            margin-top: 3px;
            font-size: 12px;
            padding-right: 0;
            padding-left: 6px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .selectize-dropdown-content .option:hover{
            background: #EEF4F9;
        }
        .expense{
            font-size:20px;
        }
        table.parts tr td span{
            position: relative;
        }
        table.parts tr td span.partsName:before{
            content: '';
            position: absolute;
            right: 5px;
            top: 2px;
            border-bottom: 7px solid transparent;
            border-left: 7px solid transparent;
            border-top: 7px solid #000;
            border-right: 7px solid transparent;
        }
        table.parts tr td span.partsNameAgain:before{
            content: '';
            position: absolute;
            right: 5px;
            top: -5px;
            border-bottom: 7px solid #000;
            border-left: 7px solid transparent;
            border-top: 7px solid transparent;
            border-right: 7px solid transparent;
        }
        .employer{
            height: 80px;
            line-height: 80px;
            width: 100%;
            position: absolute;
            bottom: 0;
            background: #f1f3fa;
            font-size: 12px;
            color: #999999;
            padding-left: 9px;
        }
        .new-oms-container .main-container{
            background: #fff;
        }
        table tr:last-child td{
            border-bottom: 1px solid #E2E2E2;
        }
        .sol-container{
            display: inline-block;
            float: left;
            margin-top: 16px;
            width: 260px;
        }
        .sol-current-selection{
            width: 1100px;
            white-space: pre-line;
        }
        .sol-inner-container{
            height: 20px;font-size:12px;margin-top:12px;
        }
        .sol-selected-display-item{
            border-radius: 0;
            border-color: #E3E3E3;
            background-color: #fff;
            color: #666666;
            font-weight: 500;height: 20px;line-height: 20px;
        }
        .sol-selected-display-item-text{
            font-size: 12px;
            line-height: 22px;
            height: 22px;
        }
        .sol-quick-delete{
            float: right;
        }
        .sol-quick-delete + .sol-selected-display-item-text{
            float: left;
            padding-left: 4px;
            padding-right: 0;height: 20px;
        }
        .sol-current-selection {
           padding: 0;
        }
        .sol-selected-display-item{
            margin-right: 6px;height: 20px;
        }
        .sol-container.sol-active .sol-inner-container{
            border-radius: 0;
        }
        .sol-input-container>input{
            font-size:12px;position: absolute;
            top:1px;
            padding-right: 0;
            padding-left: 3px;
        }
        .sol-caret-container b{
            top:8px;
        }
        .sol-container{
          margin-left:10px;
        }
        .sol-label-text{
           line-height: 20px;
        }
        .allName{
            text-align: left;
            padding-left: 45px;
        }
        .distances{
            padding-left: 63px;
        }
        .deailLeft{
            padding-left:50px;
            text-align: left;
        }
        .deailRight{
            text-align: right;
            padding-right: 100px;
        }
        .changeParts{
            text-align: center;
            margin-top: 70px;
            font-size: 18px;
            color: #000;
            opacity: 0.5;
        }
        .contain-banner-div p{
            width: 100%;
        }
        .clearfix:after{
           content:"";
           clear:both;height:0;overflow:hidden;
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
    {{-- <div class="new-oms-container">
        @include('common.side_nav') --}}
        <div class="main-container fc">
            <section class="section-container" style="background:#fff;">
                <div class="container-title">
                    <div class="item" data-value="0" title="策略费用查询">策略费用查询</div>
                    <select id="demonstration" name="character0" style="width: 200px;height: 20px;border-radius: 0;" multiple="multiple">

                    </select>
                    <a class="exported policy-export-btn"><i></i>导出</a>
                    <a class="oms-btn gray refresh-btn loading-loading"><i class="oms-icon refresh"></i>刷新</a>
                </div>

                <div class="clearfix"></div>
                <div class="contain-banner">
                    <div class="contain-banner-div">
                        <p>我的盈亏=总盈亏-应付成本-应付收益分成</p>
                        <p>应付成本、应付收益分成、我的盈亏将在策略结束后清算</p>
                    </div>
                </div>
                <table class="parts">
                    <thead>
                        <td class="allName">所属策略</td>
                        <td>状态</td>
                        <td class="partRight">已结算天数</td>
                        <td class="partRight">策略总盈亏</td>
                        <td class="partRight">管理费</td>
                        <td class="partRight">退出费</td>
                        <td class="partRight">通道费</td>
                        <td class="partRight">应付利息成本</td>
                        <td class="partRight">投资人收益分成</td>
                        <td class="partRight">我的盈亏</td>
                    </thead>
                    <tbody id="multi-product-head">
                        <!-- <tr class="allParts">
                            <td><span class="partsName"></span>2058金魔方瑞景一号</td>
                            <td>运行中</td>
                            <td>12</td>
                            <td>8230</td>
                            <td>70</td>
                            <td>70</td>
                            <td>70</td>
                            <td>70</td>
                            <td>－－</td>
                            <td>－－</td>
                        </tr>
                        <tr style="display:none;" class="partDateTr">
                            <td colspan="10">
                                  <table class="partDate">
                                      <thead>
                                          <td>日期</td>
                                          <td>结算前资产</td>
                                          <td>日扣管理费</td>
                                          <td>日扣退出费</td>
                                          <td>日扣通道费</td>
                                      </thead>
                                      <tbody>
                                          <tr>
                                              <td>2016-6-25</td>
                                              <td>40000</td>
                                              <td>35</td>
                                              <td>35</td>
                                              <td>35</td>
                                          </tr>
                                      </tbody>
                                  </table>
                            </td>
                        </tr> -->
                    </tbody>
                </table>
                <div class="changeParts" style="display:block;">请先选择策略</div>
                <div style="height: 80px;width:100%;"></div>
                <div class="employer">金额单位:元  &nbsp;&nbsp; 股票单位:股</div>
            </section>
        </div>

        <script src="{{ asset('/dist/js/risk_info.js') }}"></script>
        <script>
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

            var searchList = $('#demonstration').searchableOptionList({
                maxHeight: '300px',
                showSelectAll: true,
                showSelectionBelowList:true,
                texts: {
                    noItemsAvailable: '无可用策略',
                    selectAll: false,
                    selectNone: '清空',
                    searchplaceholder: '选择策略'
                },
                events: {
                    onChange: function(){
                        $(".changeParts").css("display", "none");

                        getPolicyGrid();


                    }
                },
                data: window.REQUEST_PREFIX + '/oms/report/get_settle_data',
                converter: function (sol, res) {
                    // debugger;
                    solData = [{"type": "option", "label": "全部策略", "value": "allChange"}];
                    if (0 === res.code) {
                        window.PRODUCTS.forEach(function(e, index){
                            solData.push({
                                "type": "option",
                                "value": e.id,
                                "label": e.name
                            })
                        });
                    }
                    return solData;
                }
            });

            function getPolicyGrid(){
                var tmpArr = [];
                var partsINdex = '';
                searchList.getSelection().each(function(e){
                    tmpArr.push($(this).val());
                });
                $(".sol-deselect-all").on("click", function () {
                    $(".changeParts").css("display", "block");
                    $(".sol-current-selection").html('');
                })
                add(tmpArr);
                $(".sol-selection .sol-option").each(function () {
                    if ($(this).children().children($("input")).prop('checked') == true && $(this).children().children($("input")).prop('value') == "allChange") {
                        $(this).siblings().children().children($(".sol-checkbox")).attr('disabled', true);
                        $(".sol-current-selection").children($(".sol-selected-display-item")).last().show().siblings().hide();
                        $(".parts body").html(" ");
                        tmpArr = [];
                        for (var temp of solData) {
                            tmpArr.push(temp.value);
                        }
                        add (tmpArr);
                    }  else if ($(this).children().children($("input")).prop('checked') == false && $(this).children().children($("input")).prop('value') == "allChange"){
                        $(this).siblings().children().children($(".sol-checkbox")).attr('disabled', false);
                        $(".sol-current-selection").children($(".sol-selected-display-item")).last().show().siblings().show()
                    }
                })
                function add (tmpArr) {
                    for (var i = 0; i < tmpArr.length; i++) {
                        if (i == tmpArr.length - 1) {
                            partsINdex += tmpArr[i];
                        } else {
                            partsINdex += tmpArr[i] + ",";
                        }
                    }
                    $.ajax({
                        type: 'get',
                        url: window.REQUEST_PREFIX + '/oms/report/get_settle_data?product_id=' + partsINdex,
                        success: function (res) {
                            var contents = res.data;
                            var allPartsContent = '';
                            var partDateTrContent = '';
                            var changeTypes = '';
                            var sol_current = '';
                            var html = '';
                            var arr = [];
                            var running,gains,myProfit,tackle;
                            for (var temp of contents) {
                                arr.push(temp);
                                if (temp.status == 5) {
                                    running = "运行中";
                                    gains = "－－";
                                    myProfit = "－－";
                                    tackle = '－－';
                                }else if (temp.status == 6) {
                                    running = "已结束";
                                    gains = parseFloat(temp.total_settle.profit_share).formatMoney(2,'.',',');
                                    myProfit = parseFloat(temp.total_settle.my_profit).formatMoney(2,'.',',');
                                    tackle = parseFloat(temp.total_settle.total_interest).formatMoney(2,'.',',');
                                }

                                function selectChange () {
                                    allPartsContent = '<tr class="allParts" data-value=""><td class="distances"><span class="partsName"></span>'+temp.name+'</td>'+
                                                          '<td>'+running+'</td>'+
                                                          '<td class="partRight">'+parseInt(temp.had_running_day).formatMoney(0,'.',',')+'</td>'+
                                                          '<td class="partRight">'+parseFloat(temp.total_settle.profit).formatMoney(2,'.',',')+'</td>'+
                                                          '<td class="partRight">'+parseFloat(temp.total_settle.manage_fee).formatMoney(2,'.',',')+'</td>'+
                                                          '<td class="partRight">'+parseFloat(temp.total_settle.out_fee).formatMoney(2,'.',',')+'</td>'+
                                                          '<td class="partRight">'+parseFloat(temp.total_settle.payment_in_out_fee).formatMoney(2,'.',',')+'</td>'+
                                                          '<td class="partRight">'+tackle+'</td>'+
                                                          '<td class="partRight">'+gains+'</td>'+
                                                          '<td class="partRight">'+myProfit+'</td></tr>';
                                    var dataArr = [];
                                    Object.keys(temp.daily_settle).forEach(function (e, index) {
                                        dataArr.push(temp.daily_settle[e]);
                                    })
                                    function compare (property) {
                                        return function (a, b) {
                                            var value1 = new Date(a[property]).getTime();
                                            var value2 = new Date(b[property]).getTime();
                                            return value2 - value1;
                                        }
                                    }
                                    dataArr.sort(compare('settlement_time'));
                                    for (var i = 0; i < dataArr.length; i++) {
                                        var payment = parseFloat(dataArr[i].payment_incoming_fee) + parseFloat(dataArr[i].payment_withdraw_fee);
                                        partDateTrContent += '<tr><td class="dataPart deailLeft">'+dataArr[i].settlement_time+'</td>'+
                                                              // '<td class="deailRight">'+parseFloat(temp.daily_settle[e].total_assets).formatMoney(2,'.',',')+'</td>'+
                                                              '<td class="deailRight">'+parseFloat(dataArr[i].management_fee).formatMoney(2,'.',',')+'</td>'+
                                                              '<td class="deailRight">'+parseFloat(dataArr[i].redeem_fee).formatMoney(2,'.',',')+'</td>'+
                                                              '<td class="deailRight">'+payment.formatMoney(2,'.',',')+'</td></tr>';
                                    }
                                    html += allPartsContent + '<tr style="display:none;" class="partDateTr">'+
                                                                  '<td colspan="10">'+
                                                                  '<table class="partDate"><thead><td class="deailLeft">日期</td><td class="deailRight">日扣管理费</td><td class="deailRight">日扣退出费</td><td class="deailRight">日扣通道费</td></thead>'+
                                                                  '<tbody>'+partDateTrContent+'</tbody></table></td></tr>';
                                }

                                if (tmpArr == '' || tmpArr == undefined) {
                                    selectChange();
                                }else {

                                    for (var tempIndex of tmpArr) {
                                        if (tempIndex == temp.id) {

                                            $('.policy-export-btn').on('click', function(){
                                                var html = window.REQUEST_PREFIX + '/oms/report/download_settle_data?product_id=' + partsINdex;
                                                $(this).attr('href', html);
                                                $(".changeParts").css("display", "none");
                                            });
                                            selectChange();
                                        }
                                    }
                                }
                            }
                            $("table.parts tbody").html(html);

                            $(".parts tbody tr.allParts").each(function () {
                                var that = this;
                                $(this).click(function () {
                                    $(that).next($("tr.partDateTr")).toggle();
                                    $(that).children().children($("span")).each(function () {
                                        if ($(this).hasClass("partsName")) {
                                            $(this).removeClass("partsName").addClass("partsNameAgain");
                                        }else {
                                            $(this).removeClass("partsNameAgain").addClass("partsName");
                                        }
                                    })
                                })
                            })
                        },
                        error: function () {

                        }
                    })
                }
            }
            $(".loading-loading").click(function () {
                $("table.parts tbody").html(" ");
                getPolicyGrid();
            })
        </script>
@endsection
