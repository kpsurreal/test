<?php
use App\Services\OMS\Workflow\OMSWorkflowEntrustService;
use App\Services\UserPermissionService;
use App\Models\Permissions;
?>
<link href="{{ asset('/js/plugin/searchable/searchableOptionList.css') }}" rel="stylesheet">
<link rel="stylesheet" type="text/css" href="{{ asset('/js/plugin/easySelect/jquery.easyselect.min.css')}}" media="screen" />
{{-- <link href="{{ asset('/css/selectize.min.css') }}" rel="stylesheet"> --}}
<link href="{{ asset('/3rd/datepicker/css/zebra_datepicker.css') }}" rel="stylesheet">
<link href="{{ asset('/css/policy-create.min.css') }}" rel="stylesheet">
<style>
    .Zebra_DatePicker{width:200px;line-height:1;}
    .Zebra_DatePicker table{width:100%!important;}
    .Zebra_DatePicker_Icon_Wrapper{
        margin-top: 16px;
    }
    /*button.Zebra_DatePicker_Icon_Inside_Right{top:13px!important;right:2px!important;}*/
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
        height: 27px;
    }
    .sol-selected-display-item{
        border-radius: 0;
        border-color: #E3E3E3;
        background-color: #fff;
        color: #666666;
        font-weight: 500;
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
        padding-right: 0;
    }
    .sol-selected-display-item{
        margin-right: 6px;
    }
    .sol-container.sol-active .sol-inner-container{
        border-radius: 0;
    }

    .sol-container.sol-active .sol-selection-container {
    	 display: block;
        position: absolute!important;
        left: inherit!important;
        top: 30px!important;
        z-index: 2;
    }
    /*.plugin-optgroup_columns .item{
        display: none;
    }*/
</style>
<script type="text/javascript" src="{{ asset('/js/selectize.js') }}"></script>
<script src="{{ asset('/js/plugin/doT.min.js')}}" type="text/javascript"></script>
<script src="{{ asset('/3rd/datepicker/zebra_datepicker.js') }}"></script>
<script src="{{ asset('/js/moment.min.js') }}"></script>
<script src="{{ asset('/js/plugin/searchable/sol-2.0.0.js')}}"></script>
<section class="multi-product-head policy-product-head" style="padding-top: 10px!important;">
    <div>
        <h2 style="display:inline-block;margin: 16px 18px;font-size:24px;line-height:33px;float:left;">成交列表</h2>
        {{-- <input style="float:left;" id="input-products" /> --}}
        <select id="demonstration" name="character0" style="width: 250px;height: 27px;border-radius: 0;" multiple="multiple">

        </select>
        <input style="float:left;" size="16" type="text" name="begin" id="begin" value="">
        <span style="float:left; margin-top:16px;">-</span>
        <input style="float:left;" size="16" type="text" name="end" id="end" value="">
        {{-- <a class="policy_products_search" style="margin-top:16px;">
            <i class="oms-icon oms-icon-search"></i>
            搜索
        </a> --}}

        <a style="float:right;" class="policy-refresh-btn oms-btn gray refresh-btn loading-loading">
            <i class="oms-icon refresh"></i>刷新
        </a>
        {{-- @if(UserPermissionService::check_user_permission($logined_info['user_id'], Permissions::PERMISSION_DEAL_MANAGER)) --}}
        <a style="float:right;margin-right:0;" class="policy-export-btn">
            <i class="oms-icon oms-icon-export"></i>导出
        </a>
        {{-- @endif --}}
        <div style="clear:both;"></div>
        <a class="policy-export-url"></a>
    </div>
    <div class="selectize-target">
        {{-- <input id="input-target" disabled="disabled" /> --}}
    </div>
    {{-- <div class="section-loading loading-loading"></div> --}}
    <table class="oms-table nothing-nothing loading-loading">
        <tr rows-head>
            <th class="cell-left">成交时间</th>
            <th class="cell-left">产品名称</th>
            <th class="cell-left">交易类别</th>
            <th class="cell-left">证券类别</th>
            <th class="cell-left">证券代码</th>
            <th class="cell-right">证券名称</th>
            <th class="cell-right">买卖方向</th>
            <th class="cell-right">成交数量</th>
            <th class="cell-right">成交均价</th>
            <th class="cell-right">净价金额</th>
            <th class="cell-right">全价成交金额</th>
            <th class="cell-right">币种</th>
            <th class="cell-right">汇率</th>
            <th></th>
        </tr>
        <tbody style="font-weight: 500;" rows-body id="multi-product-head">

        </tbody>
    </table>
    <div class="gridPagination" style="padding-left: 20px;"></div>
</section>
{{-- doT.js模版代码，模版符号前加@符以解决与blade模版的冲突  --}}
<script id="tabletmpl" type="text/x-dot-template">
@{{?it.array&&it.array.length>0}}
    @{{~it.array:val:index}}
        <tr @{{? val.childrens&&val.childrens.length }}style="background-color:#E7F4FD;"@{{?}}>
            <td class="black cell-left">
                @{{=val.deal_datetime}}
            </td>
            <td class="black cell-left">
                @{{=val.pb_product_name}}
            </td>
            <td class="black cell-left">
                @{{=val.trader_type_desc}}
            </td>
            <td class="black cell-left">
                @{{=val.stock_type_desc}}
            </td>
            <td class="black cell-left">
                @{{=val.stock_code}}
            </td>
            <td class="black cell-right">
                @{{=val.stock_name}}
            </td>
            <td class="black cell-right">
                @{{=val.deal_type_desc}}
            </td>
            <td class="black cell-right">
                @{{=Number(val.deal_volume).formatMoney(0, '.', ',')}}
            </td>
            <td class="black cell-right">
                @{{=Number(val.deal_avg_price).formatMoney(3, '.', ',')}}
            </td>
            <td class="black cell-right">
                @{{=val.net_amount}}
            </td>
            <td class="black cell-right">
                @{{=Number(val.full_deal_amount).formatMoney(3, '.', ',')}}
            </td>
            <td class="black cell-right">
                @{{=val.currency}}
            </td>
            <td class="black cell-right" style="padding-right: 0;">
                @{{=val.exchange_rate}}
            </td>
            <td></td>
        </tr>
    @{{~}}
@{{??}}
    @{{?true == it.flag.emptyFlag}}
        <span class="empty_tip">请先选择账户</span>
    @{{??}}
        @{{?true == it.flag.initFlag}}
            <span class="empty_tip loading-loading loading"><i class="oms-icon wait_v2" style="margin-left: 4px;margin-right: 4px;vertical-align: baseline;"></i>努力加载中...</span>
        @{{??}}
            <span class="empty_tip">该时段暂无成交记录</span>
        @{{?}}
    @{{?}}
@{{?}}
</script>
<script>
    var policyGridData = {};
    var ajaxLocker;
    policyGridData.flag = {
        emptyFlag: true,
        initFlag: true
    }

    var searchList = $('#demonstration').searchableOptionList({
        maxHeight: '300px',
        showSelectAll: true,
        showSelectionBelowList:true,
        texts: {
            noItemsAvailable: '无可用账户',
            selectAll: '全选',
            selectNone: '清空',
            searchplaceholder: '选择账户'
        },
        events: {
            onChange: function(){
                getPolicyGrid();
            },
            onInitialized: function(){
              searchList.selectAll(); //初始化时默认全选
            }
        },
        // data: window.REQUEST_PREFIX + '/oms/api/get_permission_products',
        data: '/bms-pub/product/base_list',

        converter: function (sol, res) {
            // debugger;
            var solData = [];
            if (0 === res.code) {
                res.data.forEach(function(e, index){
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

    // policyGridData.flag.initFlag = false;
    var tablefn = doT.template(document.getElementById('tabletmpl').text, undefined, undefined);
    function getPolicyGrid(page){
        if (!page) {page = 1}
        $('.policy-refresh-btn').addClass('loading');
        var tmpArr = [];
        searchList.getSelection().each(function(e){
            tmpArr.push($(this).val());
        });
        // var product_id = $('.product_search_input').attr('data-id');
        ajaxLocker = new Date().getTime();
        var tmpLocker = ajaxLocker;
        $.ajax({
            type: 'get',
            url: window.REQUEST_PREFIX + '/oms/pb/get_deal_list',
            data: {
                page: page,
                product_id: tmpArr.join(','),
                start_date: $('#begin').val(),
                stop_date: $('#end').val()
            },
            success: function(res){
                if (tmpLocker != ajaxLocker) {
                    return;
                }
                if (0 == res.code) {
                    policyGridData.array = res.data.data;
                    $('#multi-product-head').empty();  //解决dom泄漏
                    if (0 == searchList.getSelection().length) {
                        policyGridData.flag.emptyFlag = true;
                    }else{
                        policyGridData.flag.emptyFlag = false;
                    }
                    document.getElementById('multi-product-head').innerHTML = tablefn(policyGridData);
                    $('.gridPagination').html(res.data.data_page_html.replace(/href/g,'data-href'));
                    policyGridData.flag.initFlag = false;
                    $('.policy-refresh-btn').removeClass('loading');
                }else if(5022321 == res.code){
                    policyGridData.array = [];
                    $('#multi-product-head').empty();
                    if (0 == searchList.getSelection().length) {
                        policyGridData.flag.emptyFlag = true;
                    }else{
                        policyGridData.flag.emptyFlag = false;
                    }
                    document.getElementById('multi-product-head').innerHTML = tablefn(policyGridData);
                    $('.gridPagination').html('');
                    policyGridData.flag.initFlag = false;
                    $('.policy-refresh-btn').removeClass('loading');
                }else{
                    $.omsAlert(res.msg);
                }
            },
            error: function(){
                // $.failNotice(window.REQUEST_PREFIX + '/oms/pb/get_deal_list');
                $('.policy-refresh-btn').removeClass('loading');
            }
        })
    }

    $(function(){
        $('#begin').Zebra_DatePicker({
            show_clear_date: false,
            months: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
            days: ['日', '一', '二', '三', '四', '五', '六'],
            show_select_today: '今天',
            offset: [-125,260],
            onSelect: function(){
                getPolicyGrid();
            }
        });
        $('#end').Zebra_DatePicker({
            show_clear_date: false,
            months: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
            days: ['日', '一', '二', '三', '四', '五', '六'],
            show_select_today: '今天',
            offset: [-125,260],
            onSelect: function(){
                getPolicyGrid();
            }
        });
        var dateStr = moment().format("YYYY-MM-DD");
        $('#begin').val(dateStr);
        $('#end').val(dateStr).change();

        $('#multi-product-head').empty();
        document.getElementById('multi-product-head').innerHTML = tablefn(policyGridData);
        policyGridData.flag.initFlag = false;
        getPolicyGrid();
        var rollPolingTimer = setInterval(function(){
          var pageNum = $('.pagination li.active>span').html()
          getPolicyGrid(pageNum);
        },5 * 1000);

        $('.multi-product-head').on('click', '.policy_products_search', function(){
            getPolicyGrid();
        });

        $('.policy-refresh-btn').on('click', function(){
            getPolicyGrid();
        });

        $('.policy-export-btn').on('click', function(){
            var tmpArr = [];
            searchList.getSelection().each(function(e){
                tmpArr.push($(this).val());
            });
            if(tmpArr.length == 0){
                $.omsAlert('请先选择账户');
                return false;
            }else{
                var html = window.REQUEST_PREFIX + '/oms/pb/get_deal_list_file?start_date=' + $('#begin').val() + '&stop_date=' +  $('#end').val() + '&product_id=' + tmpArr.join(',');
                $(this).attr('href', html);
            }
        });

        $(document).on('click', '.pagination a', function(){
            var pageNumArr = $(this).attr('data-href').split('page=');
            if (2 == pageNumArr.length) {
                getPolicyGrid(pageNumArr[1]);
            }
        })

    });
</script>
