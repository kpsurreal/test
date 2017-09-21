<?php
use App\Services\OMS\Workflow\OMSWorkflowEntrustService;
use App\Services\RoleService;
?>
<link href="{{ asset('/3rd/datepicker/css/zebra_datepicker.css') }}" rel="stylesheet">
<link href="{{ asset('/js/jquery-confirm/jquery-confirm.min.css') }}" rel="stylesheet">
<style>
    .Zebra_DatePicker{width:200px;line-height:1;}
    .Zebra_DatePicker table{width:100%!important;}
    .Zebra_DatePicker_Icon_Wrapper{
        margin-top: 16px;
    }
    button.Zebra_DatePicker_Icon_Inside_Right{
        top:5px!important;
    }
    /*button.Zebra_DatePicker_Icon_Inside_Right{top:13px!important;right:2px!important;}*/
    .btn_all_read{
        margin-left: 16px;
        display: inline-block;
        text-align: center;
        line-height: 30px;
        width: 100px;
        height: 30px;
        border-radius: 4px;
        font-size: 12px;
        cursor: pointer;
        color: #2196F3;
    }
    .btn_all_read:hover{
        background-color: #0078BF;
        color: #fff;
    }

    .jconfirm-box-container{
        margin-left: 33%;
        width: 580px;
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

    .jc-cancel-btn{
        text-align: center;
    }
    .jc-cancel-btn>.ui-btn{
        display:inline-block;
        text-align:center;
        width:100px;
        height:30px;
        line-height:30px;
        cursor:pointer;
        color: white;
        font-weight: normal;
        background-color: #F44336;
    }
</style>

<script src="{{ asset('/js/plugin/doT.min.js') }}" type="text/javascript"></script>
<script src="{{ asset('/3rd/datepicker/zebra_datepicker.js') }}"></script>
<script src="{{ asset('/js/jquery-confirm/jquery-confirm.min.js') }}"></script>

<section class="multi-product-head policy-product-head">
    <div>
        <h2 style="display:inline-block;margin: 16px 18px;font-size:24px;line-height:33px;float:left;">指令提交</h2>
        {{-- <div class="features-unread unread-div" style="display:none;">
            <span>未读：</span><span class="num_unread">-条</span><a class="btn_all_read">全部设为已读</a>
        </div> --}}
        <input style="float:left;" class="switch_show hide" size="16" type="text" name="begin" id="begin" value="">
        <span style="float:left; margin-top:16px;" class="switch_show hide">-</span>
        <input style="float:left;" class="switch_show hide" size="16" type="text" name="end" id="end" value="">
        {{-- <a class="policy_products_search">
            <i class="oms-icon oms-icon-search"></i>
            搜索
        </a> --}}

        <a style="float:right;" class="policy-refresh-btn policy_instruction_btn oms-btn gray refresh-btn loading-loading">
            <i class="oms-icon refresh"></i>刷新
        </a>
        {{-- <div class="features-unread unread-config" style="display:none;">
            <a class="policy-config-btn oms-btn gray" style="margin:0;margin-bottom:5px;width: 100px;">
                <i class="oms-icon config"></i>提醒设置
            </a>
            <dl class="config hide">
                <dt>新指令提醒</dt>
                <dd>1.不提醒<input type="radio" value="1" name="display_radio" /></dd>
                <dd>2.仅开启颜色提醒<input type="radio" value="2" name="display_radio" /></dd>
                <dd>3.开启颜色及声音提醒<input type="radio" value="3" name="display_radio" /></dd>
            </dl>
        </div> --}}

        <label class="historyPolicyLabel"><input class="historyPolicyInput" type="radio" name="historyPolicy" value="1" />历史指令</label>
        <label class="historyPolicyLabel"><input class="historyPolicyInput" type="radio" checked="checked" name="historyPolicy" value="0" />今日指令</label>

        <div style="clear:both;"></div>
    </div>
    {{-- <div class="section-loading loading-loading"></div> --}}
    <span id="multi-product-body-empty-tip" class="empty_tip loading-loading loading"><i class="oms-icon wait_v2" style="margin-left: 4px;margin-right: 4px;vertical-align: baseline;"></i>努力加载中...</span>
    <table class="oms-table nothing-nothing loading-loading">
        <tr rows-head>
            <th class="cell-left">证券代码/名称</th>
            <th class="cell-left " data-name="fund_id" data-history-name="product_id"><span>产品单元</span></th>
            <th class="cell-left " data-name="ins_type" data-history-name="ins_type"><span>交易方向</span></th>
            <th class="cell-right">指令价格</th>
            <th class="cell-right">指令数量</th>
            <th class="cell-right">指令金额</th>
            <th class="cell-right">成交数量</th>
            <th class="cell-right">成交金额</th>
            <th class="cell-left">成交百分比</th>
            <th class="cell-left">指令状态</th>
            <th class="cell-right " data-name="created_at" data-history-name="created_at"><span>提交时间</span></th>
            <th class="cell-right " data-name="end_datetime" data-history-name="end_datetime"><span>结束时间</span></th>
            <th class="cell-left  history_hide" data-name="sponor_user_real_name"><span>下达人</span></th>
            <th class="cell-right history_hide"></th>
        </tr>
        <tbody style="font-weight: 500;" rows-body id="multi-product-body">

        </tbody>
    </table>
    <div id="page_html" style="padding-left: 20px;"></div>
</section>
<span id="page_tip" class="hide"></span>
{{-- doT.js模版代码，模版符号前加@符以解决与blade模版的冲突 --}}
<script id="tabletmpl" type="text/x-dot-template">
    @{{?it.array&&it.array.length>0}}
        @{{~it.array:val:index}}
            @{{?(0==it.flag.showProductArr.length||-1!=it.flag.showProductArr.indexOf(Number(val.product_id))||(val.childrens&&val.childrens.length&&val.childrens.some(function(e,i,array){return (-1!=it.flag.showProductArr.indexOf(Number(e.product_id)))})))}}
                <tr class="@{{? val.childrens&&val.childrens.length }}display_parent@{{?}} @{{?(val.webFlag_is_unread&&it.flag.displayColor)}}display_unread@{{?}} @{{?val.ins_error_msg&&!(val.childrens&&val.childrens.length)}}display_error@{{?}}" data-id="@{{=val.id}}" data-ps_id="@{{=val.ps_id}}">
                    <td class="black cell-left select-stock" data-code="@{{=val.stock_code}}" data-id="@{{=val.id}}" data-name="@{{=val.stock_name}}">
                        @{{=val.stock_code}} @{{=val.stock_name}}
                    </td>
                    <td class="black cell-left">
                        @{{? val.childrens&&val.childrens.length }}
                            @{{?!(-1!=it.flag.collapsedArr.indexOf(Number(val.id)))}}
                                <div data-toHide=".childrensOf_@{{=index}}" class="multi_btn" data-id="@{{=val.id}}"><span style="text-decoration: underline;">多产品单元</span><span class="grid-arrow"></span></div>
                            @{{??}}
                            <div data-toHide=".childrensOf_@{{=index}}" class="multi_btn hide-arrow" data-id="@{{=val.id}}"><span style="text-decoration: underline;">多产品单元</span><span class="grid-arrow"></span></div>
                            @{{?}}
                        @{{??}}
                            @{{=val.product_name||'--'}}
                        @{{?}}
                    </td>
                    <td class="black cell-left">
                        <span>@{{? val.ins_model == 1}}限价@{{?}}@{{? val.ins_model == 2}}市价@{{?}}</span>
                        @{{? val.ins_type == 1}}<span style="color:#F24A3D;">买入</span>@{{?}}@{{? val.ins_type == 2}}<span style="color:#2196F3;">卖出</span>@{{?}}
                    </td>
                    <td class="black cell-right">
                        @{{?1==val.ins_model}}
                            @{{=Number(val.ins_price).formatMoney(3, '.', ',')}}
                        @{{??2==val.ins_model}}
                            @{{='市价'}}
                        @{{?}}
                    </td>
                    <td class="black cell-right">
                        @{{=parseInt(val.ins_volume)}}
                    </td>
                    <td class="black cell-right">
                        @{{=Number(val.ins_amount).formatMoney(3, '.', ',')}}
                    </td>
                    <td class="black cell-right">
                        @{{=parseInt(val.deal_volume)}}
                    </td>
                    <td class="black cell-right">
                        @{{=Number(val.deal_amount).formatMoney(3, '.', ',')}}
                    </td>
                    <td class="black cell-left">
                        <div class="policy_percent">
                            <div style="width:@{{=val.deal_ratio*100}}%;"></div>
                        </div>
                        <label class="policy_label">@{{=val.deal_ratio*100}}%</label>
                    </td>
                    <td class="black cell-left">
                        @{{=val.ins_status_desc}}
                        @{{?val.ins_error_msg}}
                            @{{? val.childrens&&val.childrens.length }}
                            @{{??}}
                                <span class="dot-tip exclamation">
                                    <div>
                                    <em>i</em>
                                    <str>
                                    <span class="msg">
                                    <span>
                                    @{{=val.ins_error_msg}}
                                    </span>
                                    </span>
                                    </str>
                                    </div>
                                </span>
                            @{{?}}
                        @{{?}}
                    </td>
                    <td class="black cell-right">
                        @{{=val.created_at||'--'}}
                    </td>
                    <td class="black cell-right">
                        @{{=val.end_datetime||'--'}}
                    </td>
                    <td class="black cell-left">
                        @{{?1==val.accept_userinfo.status}}
                            @{{=val.accept_userinfo.accept_username}}
                        @{{??'--' == val.accept_userinfo.status}}
                            @{{=val.accept_userinfo.accept_username}}
                        @{{??}}
                            <span style="color:#999999;">@{{=val.accept_userinfo.accept_username+'('+val.accept_userinfo.status_desc+')'}}</span>
                        @{{?}}
                    </td>
                    <td class="black cell-right" style="padding-right: 0;">
                        @{{?true == it.flag.is_history}}
                        @{{??}}
                            @{{? val.childrens&&val.childrens.length}}
                                @{{?1==val.is_can_cancel}}
                                    <a class="table-btn table-btn-cancelAll table-loading loading-loading" data-id="@{{=val.id}}" data-ps_id="@{{=val.ps_id}}"><i class="oms-icon wait" style="margin-left: 4px;margin-right: 4px;vertical-align: baseline;display:none;"></i>撤销</a>
                                @{{??}}
                                    <a class="table-btn disabled">撤销</a>
                                @{{?}}
                            @{{??}}
                                @{{?1==val.is_can_cancel}}
                                    <a class="table-btn table-loading loading-loading" data-id="@{{=val.id}}"><i class="oms-icon wait" style="margin-left: 4px;margin-right: 4px;vertical-align: baseline;display:none;"></i>撤销</a>
                                @{{??}}
                                    <a class="table-btn disabled">撤销</a>
                                @{{?}}
                            @{{?}}
                        @{{?}}
                    </td>
                </tr>
                @{{?!(-1!=it.flag.collapsedArr.indexOf(Number(val.id)))&&val.childrens&&val.childrens.length}}
                    @{{~val.childrens:value:i}}
                        <tr class="childrensOf_@{{=index}} display_children @{{?value.ins_error_msg}}display_error@{{?}} @{{?(value.webFlag_is_unread&&it.flag.displayColor)}}display_unread@{{?}}"  data-id="@{{=value.id}}" data-ps_id="@{{=value.ps_id}}">
                            <td class="black cell-left">
                                --
                            </td>
                            <td class="black cell-left">
                                @{{=value.product_name||'--'}}
                            </td>
                            <td class="black cell-left">
                                @{{='--'}}
                            </td>
                            <td class="black cell-right">
                                @{{='--'}}
                            </td>
                            <td class="black cell-right">
                                @{{=parseInt(value.ins_volume)}}
                            </td>
                            <td class="black cell-right">
                                @{{=Number(value.ins_amount).formatMoney(3, '.', ',')}}
                            </td>
                            <td class="black cell-right">
                                @{{=parseInt(value.deal_volume)}}
                            </td>
                            <td class="black cell-right">
                                @{{=Number(value.deal_amount).formatMoney(3, '.', ',')}}
                            </td>
                            <td class="black cell-left">
                                <div class="policy_percent">
                                    <div style="width:@{{=value.deal_ratio*100}}%;"></div>
                                </div>
                                <label class="policy_label">@{{=value.deal_ratio * 100}}%</label>
                            </td>
                            <td class="black cell-left">
                                @{{=value.ins_status_desc}}
                                @{{?value.ins_error_msg}}
                                <span class="dot-tip exclamation">
                                    <div>
                                    <em>i</em>
                                    <str>
                                    <span class="msg">
                                    <span>
                                    @{{=value.ins_error_msg}}
                                    </span>
                                    </span>
                                    </str>
                                    </div>
                                </span>
                                @{{?}}
                            </td>
                            <td class="black cell-right">
                                @{{='--'}}
                            </td>
                            <td class="black cell-right">
                                @{{='--'}}
                            </td>
                            <td class="black cell-left">
                                @{{='--'}}
                            </td>
                            <td class="black cell-right" style="padding-right: 0;">
                                @{{?true == it.flag.is_history}}
                                @{{??}}
                                    @{{?1==value.is_can_cancel}}
                                        <a class="table-btn table-loading loading-loading" data-id="@{{=value.id}}"><i class="oms-icon wait" style="margin-left: 4px;margin-right: 4px;vertical-align: baseline;display:none;"></i>撤销</a>
                                    @{{??}}
                                        <a class="table-btn disabled">撤销</a>
                                    @{{?}}
                                @{{?}}
                            </td>
                        </tr>
                    @{{~}}
                @{{?}}

            @{{??}}
                <!-- @{{=val.id}} -->
            @{{?}}
        @{{~}}
    @{{??}}
        @{{?false == it.flag.is_history}}
            <span class="empty_tip">还没有提交任何指令，可在下方选择产品提交相应指令</span>
        @{{??}}
            <span class="empty_tip">该时段暂无匹配的指令</span>
        @{{?}}
    @{{?}}
</script>
@if ( isset($logined_info) && isset($logined_info['role_id']) && (!in_array(RoleService::ROLE_ID_ADMIN, $logined_info['role_id']) && !in_array(RoleService::ROLE_ID_TRADER, $logined_info['role_id'])) )
    <script>
    $('.features-unread').remove();
    </script>
@endif
<script>
    var jc;

    // if (1 != LOGIN_INFO.role_id && 13 != LOGIN_INFO.role_id) {//13才是交易员 12是交易总监
    //     $('.features-unread').remove();
    // }
    var forbidden_interval = false;
    var ajaxLock_policyGrid;

    var policyGridData = {};
    policyGridData.flag = {
        // 'initFlag': true,
        'displayColor': true,
        'showProductArr': [],
        'is_history': false,
        'collapsedArr': [],
        'order_by': '',
        'order_type': 'asc'
    };
    var managerData = [];
    var productData = [];
    var tablefn = doT.template(document.getElementById('tabletmpl').text, undefined, undefined);

    var history_order_field = '';
    var history_order_type = '';
    var firstTimeGetUserInfo = true;

    function sortDataForDisplay(policyGridData){
        if ('' == policyGridData.flag.order_by || '' == policyGridData.flag.order_type) {
            return;
        }

        policyGridData.array&&policyGridData.array.sort(function(a, b){
            var tmpRegex = /[^\d]/g;
            var before = a[policyGridData.flag.order_by];
            var end =  b[policyGridData.flag.order_by];

            if (undefined == before) {
                if('asc' == policyGridData.flag.order_type){
                    return -1;
                }else{
                    return 1;
                }

            }
            if (undefined == end) {
                if('asc' == policyGridData.flag.order_type){
                    return 1;
                }else{
                    return -1;
                }
            }

            if ('desc' == policyGridData.flag.order_type) {
                if(before.toString() > end.toString()) return -1;
                if(before.toString() < end.toString()) return 1;
            }else if('asc' == policyGridData.flag.order_type){
                if(before.toString() > end.toString()) return 1;
                if(before.toString() < end.toString()) return -1;
            }

            return 0;
            // return before.toString() < end.toString();
            // return before.toString().replace(tmpRegex, '') > end.toString().replace(tmpRegex, '');
        });
    }

    function getPolicyGridInterval(){
        setTimeout(function(){
            //1为历史 0为今天
            if (1 == $('.historyPolicyInput:checked').val()) {
                //历史查询，不需要自动刷新，但是定时器还是要继续运行
                getPolicyGridInterval();
            }else{
                if (true == forbidden_interval) {
                    getPolicyGridInterval();
                }else{
                    getPolicyGrid(getPolicyGridInterval);
                }
            }
        }, 1000 * 5);
    }

    function MakeDataReady(){
        policyGridData.array&&policyGridData.array.forEach(function(item){
            productData&&productData.forEach(function(it){
                if (item.product_id == it.id) {
                    item.product_name = it.name;
                }
                if (item.childrens && item.childrens.length > 0) {
                    item.childrens.forEach(function(i){
                        if (i.product_id == it.id) {
                            i.product_name = it.name;
                        }
                    })
                }
            });
        });

    }
    function showTodayGrid(){
        policyGridData.array = utils.policyGrid.getItem();
        policyGridData.flag.displayColor = utils.policyGrid.getColorDisplayFlag();
        MakeDataReady();
        policyGridData.flag.is_history = false;

        document.getElementById('multi-product-body').innerHTML = tablefn(policyGridData);//今日列表更新/周期更新
        $('#multi-product-body-empty-tip').hide();
        // policyGridData.flag.initFlag = false;
        $('#page_html').html('');
        $('.policy-refresh-btn').removeClass('loading');
        $(window).trigger({type: 'doRefreshProductsName'});

        var tmpArr = [];
        policyGridData.array&&policyGridData.array.forEach(function(e){
            if (e.childrens) {
                e.childrens.forEach(function(el){
                    if (el.ins_error_msg && false == el.webFlag_has_alert && el.sponor_user_id == LOGIN_INFO.user_id) {
                        tmpArr.push(el);
                    }
                })
            }else{
                if (e.ins_error_msg && false == e.webFlag_has_alert && e.sponor_user_id == LOGIN_INFO.user_id) {
                    tmpArr.push(e);
                }
            }
        });

        if (0 < tmpArr.length) {
            tmpArr.forEach(function(e){
                utils.policyGrid.changeAlertItem({id: e.id, ps_id: e.ps_id});
            });

            forbidden_interval = true;
            // console.log(tmpArr);
            var trStr = '';
            tmpArr.forEach(function(e){
                trStr += '<tr class="alert_tr" data-product_id="'+e.product_id+'">' +
                    '<td style="font-size: 12px;padding-top: 6px;padding-bottom: 6px;" class="cell-left"><span style="display:block;">'+ e.stock_name +'</span><span style="display:block;color:#999;">'+ e.stock_code +'</span></td>' +
                    '<td style="font-size: 12px;padding-top: 6px;padding-bottom: 6px;" class="cell-left alert_product_name">'+ e.product_name +'</td>' +
                    '<td style="font-size: 12px;padding-top: 6px;padding-bottom: 6px;" class="cell-left"><span>'+((e.ins_model == 1)?'限价':'市价')+'</span>'+
                    ((e.ins_type == 1)?'<span style="color:#F24A3D;">买入</span>':'<span style="color:#2196F3;">卖出</span>')+'</td>' +
                    '<td style="font-size: 12px;padding-top: 6px;padding-bottom: 6px;" class="cell-right"><span style="display:block;">'+ parseInt(e.ins_volume, 10) +'</span><span style="display:block;color:#999;">'+ ((1==e.ins_model)?Number(e.ins_price).formatMoney(3, '.', ','):'市价') +'</span></td>' +
                    '<td style="font-size: 12px;padding-top: 6px;padding-bottom: 6px;" class="cell-left">'+ e.ins_error_msg +'</td>' +
                '</tr>';
            });
            var tableStr = '<table class="oms-table" style="max-height:500px;overflow-y:auto;display:block;">' +
                '<tr rows-head>' +
                    '<th class="cell-left" style="font-size: 12px;min-width: 70px;">证券</th>' +
                    '<th class="cell-left" style="font-size: 12px;min-width: 100px;">产品单元</th>' +
                    '<th class="cell-left" style="font-size: 12px;min-width: 70px;">交易方向</th>' +
                    '<th class="cell-right" style="font-size: 12px;min-width: 70px;">股数/价格</th>' +
                    '<th class="cell-left" style="font-size: 12px;">失败原因</th>' +
                '</tr>' +
                '<tbody rows-body>'+ trStr +'</tbody>' +
            '</table>';
            $.confirm({
                title: '提交失败指令',
                content: tableStr,
                closeIcon: true,
                confirmButton: false,
                cancelButton: false,
                cancel: function(){
                    forbidden_interval = false;
                }
            });
        }
    }

    function getTodayPolicyGrid(){
        getPolicyGridData(false, function(){
            showTodayGrid();
        });
    }

    function getPolicyGrid(callback){
        $('.policy-refresh-btn').addClass('loading');
        var product_id = $('.product_search_input').attr('data-id');

        //1为历史 0为当天
        if (1 == $('.historyPolicyInput:checked').val()) {
            var product_id = [];
            $('.product-select').each(function(){
                if($(this).prop('checked')){
                    product_id.push($(this).attr('data-productId'));
                }
            });
            ajaxLock_policyGrid = new Date().getTime();
            var tmpLock = ajaxLock_policyGrid;
            $.ajax({
                type: 'get',
                url: window.REQUEST_PREFIX + '/oms/ins/get_history_list',
                data: {
                    order_field: history_order_field,
                    order_type: history_order_type,
                    product_id: product_id.join(','),
                    start_date: $('#begin').val(),
                    stop_date: $('#end').val(),
                    page: 1
                },
                success: function(res){
                    if (tmpLock == ajaxLock_policyGrid) {
                        policyGridData.array = res.data.data;
                        policyGridData.data_page = res.data.data_page_html ? res.data.data_page_html : '';
                        policyGridData.flag.is_history = true;
                        //历史查询，不需要将数据policyGridData.array进行排序，使满足policyGridData.flag的排序条件。
                        document.getElementById('multi-product-body').innerHTML = tablefn(policyGridData);//历史列表
                        $('#multi-product-body-empty-tip').hide();
                        // policyGridData.flag.initFlag = false;
                        $('#page_html').html(policyGridData.data_page);
                        $('.policy-refresh-btn').removeClass('loading');
                        $(window).trigger({type: 'doRefreshProductsName'});
                    }

                    if ("[object Function]" == Object.prototype.toString.call(callback)) {
                        callback.call();
                    }
                },
                error: function(){
                    // $.failNotice(window.REQUEST_PREFIX + '/oms/ins/get_history_list');
                    $('.policy-refresh-btn').removeClass('loading');

                    if ("[object Function]" == Object.prototype.toString.call(callback)) {
                        callback.call();
                    }
                }
            });
        }else{
            showTodayGrid();

            if ("[object Function]" == Object.prototype.toString.call(callback)) {
                callback.call();
            }


            // ajaxLock_policyGrid = new Date().getTime();
            // var tmpLock = ajaxLock_policyGrid;
            // $.ajax({
            //     type: 'get',
            //     url: window.REQUEST_PREFIX + '/oms/ins/get_list',
            //     // data: {
            //     //     product_id: product_id,
            //     //     sponor_user_id: $('.manager_search_input').val()
            //     // },
            //     success: function(res){
            //         if (tmpLock == ajaxLock_policyGrid) {
            //             utils.policyGrid.setItem(res.data);
            //
            //         }
            //
            //         if ("[object Function]" == Object.prototype.toString.call(callback)) {
            //             callback.call();
            //         }
            //     },
            //     error: function(){
            //         $('.policy-refresh-btn').removeClass('loading');
            //
            //         if ("[object Function]" == Object.prototype.toString.call(callback)) {
            //             callback.call();
            //         }
            //     }
            // })
        }
    }

    $('#page_html').on('click', '.pagination a', function(){
        var pageNumArr = $(this).attr('href').split('page=');
        if (pageNumArr.length = 2) {
            var product_id = [];
            $('.product-select').each(function(){
                if($(this).prop('checked')){
                    product_id.push($(this).attr('data-productId'));
                }
            });

            ajaxLock_policyGrid = new Date().getTime();
            var tmpLock = ajaxLock_policyGrid;
            $.ajax({
                type: 'get',
                url: window.REQUEST_PREFIX + '/oms/ins/get_history_list',
                data: {
                    order_type: history_order_type,
                    order_field: history_order_field,
                    product_id: product_id.join(','),
                    start_date: $('#begin').val(),
                    stop_date: $('#end').val(),
                    page: pageNumArr[1]
                },
                success: function(res){
                    if (tmpLock == ajaxLock_policyGrid) {
                        // var tmpD = $.extend(true, res);
                        policyGridData.array = res.data.data;
                        policyGridData.data_page = res.data.data_page_html;
                        policyGridData.flag.is_history = true;
                        //分页历史查询，不需要将数据policyGridData.array进行排序，使满足policyGridData.flag的排序条件。
                        document.getElementById('multi-product-body').innerHTML = tablefn(policyGridData);//历史列表，分页渲染
                        $('#multi-product-body-empty-tip').hide();
                        // policyGridData.flag.initFlag = false;
                        $('#page_html').html(policyGridData.data_page);
                        $('.policy-refresh-btn').removeClass('loading');
                        $(window).trigger({type: 'doRefreshProductsName'});
                    }
                },
                error: function(){
                    // $.failNotice(window.REQUEST_PREFIX + '/oms/ins/get_history_list');
                    $('.policy-refresh-btn').removeClass('loading');

                    if ("[object Function]" == Object.prototype.toString.call(callback)) {
                        callback.call();
                    }
                }
            });
        }
        return false;
    });

    var beginZebra = $('#begin').Zebra_DatePicker({
        show_clear_date: false,
        months: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
        days: ['日', '一', '二', '三', '四', '五', '六'],
        show_select_today: '今天',
        offset: [-125,260],
        onSelect: function(){
            getPolicyGrid();
        }
    });
    var endZebra = $('#end').Zebra_DatePicker({
        show_clear_date: false,
        months: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
        days: ['日', '一', '二', '三', '四', '五', '六'],
        show_select_today: '今天',
        offset: [-125,260],
        onSelect: function(){
            getPolicyGrid();
        }
    });

    function ChangeFlag(){
        var colorFlag = utils.policyGrid.getColorDisplayFlag();
        var soundFlag = utils.policyGrid.getSoundDisplayFlag()

        if (colorFlag) {
            // $('[name="display_radio"][value="1"]').prop('checked', true);
            if (soundFlag) {
                $('[name="display_radio"][value="3"]').prop('checked', true);
            }else {
                $('[name="display_radio"][value="2"]').prop('checked', true);
            }
        }else{
            $('[name="display_radio"][value="1"]').prop('checked', true);
        }
    }

    $(document).on('change', '[name="display_radio"]', function(){
        if (3 == $(this).val()) {
            utils.policyGrid.setColorDisplayFlag(true);
            utils.policyGrid.setSoundDisplayFlag(true);
        }else if(2 == $(this).val()){
            utils.policyGrid.setColorDisplayFlag(true);
            utils.policyGrid.setSoundDisplayFlag(false);
        }else if(1 == $(this).val()){
            utils.policyGrid.changeItem(0);
            utils.policyGrid.setColorDisplayFlag(false);
            utils.policyGrid.setSoundDisplayFlag(false);
        }

        policyGridData.array = utils.policyGrid.getItem();
        policyGridData.flag.displayColor = utils.policyGrid.getColorDisplayFlag();
        MakeDataReady();
        policyGridData.flag.is_history = false;

        var unreadNum = utils.policyGrid.getUnreadNum();
        $('.num_unread').html(unreadNum + '条');
        if (utils.policyGrid.getSoundDisplayFlag() && 0 < unreadNum) {
            $.omsSoundNotice(0);
        }

        document.getElementById('multi-product-body').innerHTML = tablefn(policyGridData);//今日列表更新/周期更新
        $('#multi-product-body-empty-tip').hide();

        $('dl.config').addClass('hide');
    });

    function DoCancel(_this, tipTimer){
        $.ajax({
            type: 'post',
            url: window.REQUEST_PREFIX + '/oms/ins/cancel_order',
            data: {
                id: _this.attr('data-id'),
                cancel_person: ''
            },
            success: function(res){
                _this.find('i').show();
                _this.addClass('loading');
                getTodayPolicyGrid();//getPolicyGrid();

                if (0 != res.code) {
                    if (tipTimer) {
                        clearTimeout(tipTimer);
                        tipTimer = undefined;
                    }
                    $('#page_tip').html(res.msg).removeClass('hide');
                    tipTimer = setTimeout(function(){
                        $('#page_tip').addClass('hide');
                    }, 3 * 1000);
                }
            }
        })
    }

    $(function(){
        // $('.switch_show').addClass('hide');
        setTimeout(function(){
            $('#begin').parent('.Zebra_DatePicker_Icon_Wrapper').hide();
            $('#end').parent('.Zebra_DatePicker_Icon_Wrapper').hide();
        }, 0);
        var dateStr = moment().format("YYYY-MM-DD");
        $('#begin').val(dateStr);
        $('#end').val(dateStr).change();

        $('.policy-product-head').on('change', '#begin, #end',  function(){
            // console.log('1111');
        });

        //设置是否显示
        ChangeFlag()

        getTodayPolicyGrid();
        getPolicyGridInterval();

        $(window).on('refreshProductsName', function(e){
            e&&e.sets&&e.sets.array&&(productData = e.sets.array);
            if (!policyGridData.array) {
                return;
            }
            MakeDataReady()
            document.getElementById('multi-product-body').innerHTML = tablefn(policyGridData);//产品名称更新，从而刷新显示
            $('#multi-product-body-empty-tip').hide();
            // policyGridData.flag.initFlag = false;

            //需要更新失败的提示
            if ($('.alert_tr').length > 0) {
                setTimeout(function(){
                    $('.alert_tr').each(function(){
                        var _this = this;
                        var product_id = $(_this).attr('data-product_id');
                        productData.forEach(function(el){
                            if (Number(el.id) == Number(product_id)) {
                                // console.log(el.name);
                                $(_this).find('.alert_product_name').html(el.name);
                            }
                        });
                    })
                }, 100);
            }

        }).on('display_policy_grid', function(){
            if (true == policyGridData.flag.is_history) {
                getPolicyGrid();
            }else{
                document.getElementById('multi-product-body').innerHTML = tablefn(policyGridData);
                $('#multi-product-body-empty-tip').hide();
                // policyGridData.flag.initFlag = false;
            }

        });

        $('.manager_search_input').change(function(){
            getTodayPolicyGrid();//getPolicyGrid();
        });

        $('.historyPolicyInput').click(function(){
            //0为今日，1为历史
            if ('1' == $(this).val()) {
                $('.switch_show').removeClass('hide');
                $('#begin').parent('.Zebra_DatePicker_Icon_Wrapper').show();
                $('#end').parent('.Zebra_DatePicker_Icon_Wrapper').show();
                $('.features-unread').hide();
                //$('.history_hide').removeClass('sort_by');
                getPolicyGrid();
            }else {
                $('.switch_show').addClass('hide');
                $('#begin').parent('.Zebra_DatePicker_Icon_Wrapper').hide();
                $('#end').parent('.Zebra_DatePicker_Icon_Wrapper').hide();
                $('.features-unread').show();
                //$('.history_hide').addClass('sort_by');
                getTodayPolicyGrid();
            }
        })

        $('.product_search_input').on('keyup', function(){
            $('.product_search_input').attr('data-id', '');
            var destObj = $('.policy_products_show');
            var value = $(this).val();
            if (0 >= value.length) {
                destObj.hide();
                return false;
            }

            // var product_id_arr = [];
            // var product_name_arr = [];
            var tmpSearchArr = []
            $('#product-manager-dst>tr').each(function(){
                tmpSearchArr.push({
                    'id': $(this).find('.product-select').attr('data-productId'),
                    'name': $(this).find('.product-name').html()
                });
                // product_id_arr.push($(this).find('.product-select').attr('data-productId'));
                // product_name_arr.push($(this).find('.product-name').html());
            });
            var searchArr = tmpSearchArr.filter(function(element, index, array){
                return (element.id.match(value) || element.name.match(value))
            });

            var html = '';
            searchArr.forEach(function(value, index, array){
                html += '<li class="product_select_li" data-id="'+value.id+'">'+ value.name +'</li>';
            })

            destObj.html(html).show();
        });
        $('.multi-product-head').on('click','.product_select_li', function(){
            $('.policy_products_show').hide();
            $('.product_search_input').val($(this).html()).attr('data-id', $(this).attr('data-id'));
        });

        var tipTimer;
        $('.multi-product-head').on('click', '.multi_btn', function(){
            $(this).toggleClass('hide-arrow');
            $($(this).attr('data-toHide'));
            // .toggleClass('hide-row');

            //有“hide-arrow”则为收起了子条目
            if ($(this).hasClass('hide-arrow')) {
                policyGridData.flag.collapsedArr.push(Number($(this).attr('data-id')));
            }else{
                for (var i = policyGridData.flag.collapsedArr.length - 1; i >= 0 ; i--) {
                    if ($(this).attr('data-id') == policyGridData.flag.collapsedArr[i]) {
                        policyGridData.flag.collapsedArr.splice(i, 1);
                    }
                }
            }
            document.getElementById('multi-product-body').innerHTML = tablefn(policyGridData);//多产品策略收缩功能
            $('#multi-product-body-empty-tip').hide();
            // policyGridData.flag.initFlag = false;
        }).on('click', '.select-stock', function(){
            var code = $(this).attr('data-code');
            // var name = $(this).attr('data-name');
            $('#stock_code').val(code).keyup();
            // $('#stock_name_addon').text(name);
        }).on('click', '.table-btn', function(){

            if (!$(this).hasClass('disabled')) {
                if ($(this).hasClass('table-btn-cancelAll')) {
                    var ps_id = $(this).attr('data-ps_id');
                    $(this).addClass('loading');
                    $('tr[data-ps_id="'+ ps_id +'"]').find('.table-btn').each(function(){
                        if (!$(this).hasClass('disabled') && !$(this).hasClass('table-btn-cancelAll')) {
                            var _this = $(this);
                            DoCancel(_this, tipTimer);
                        }
                    })
                }else{
                    var _this = $(this);
                    DoCancel(_this, tipTimer);
                }

            }
        });

        // $('.multi-product-head').on('click', '.policy_products_search', function(){
        //     getPolicyGrid();
        // });

        $('.multi-product-head').on('click', '.sort_by', function(){
            if ('' == policyGridData.flag.order_type) {
                policyGridData.flag.order_type = 'asc';
            }else if('asc' == policyGridData.flag.order_type){
                policyGridData.flag.order_type = 'desc';
            }else if('desc' == policyGridData.flag.order_type){
                policyGridData.flag.order_type = 'asc';
            }
            policyGridData.flag.order_by = $(this).attr('data-name');

            $('.desc').removeClass('desc');
            $('.asc').removeClass('asc');
            $(this).addClass(policyGridData.flag.order_type)
            if (0 == $('.historyPolicyInput:checked').val()) {
                //今日
                document.getElementById('multi-product-body').innerHTML = tablefn(policyGridData);//排序功能
                $('#multi-product-body-empty-tip').hide();
                // policyGridData.flag.initFlag = false;
            }else if(1 == $('.historyPolicyInput:checked').val()){
                //历史
                history_order_field = $(this).attr('data-history-name');
                history_order_type = $(this).hasClass('asc')?1:2;

                //使用
                getPolicyGrid();
            }

        });

        $('.policy-refresh-btn').on('click', function(){
            if (true == policyGridData.flag.is_history) {
                getPolicyGrid();
            }else{
                getTodayPolicyGrid();
            }

        });

        $(window).on('create_policy:form:submit',function(){
            multiPolicySubmit();
        });

        $(document).on('click', '.display_unread', function(){
            utils.policyGrid.changeItem(Number($(this).attr('data-id')), Number($(this).attr('data-ps_id')));

            policyGridData.array = utils.policyGrid.getItem();
            MakeDataReady();
            policyGridData.flag.is_history = false;
            $('.num_unread').html(utils.policyGrid.getUnreadNum() + '条');
            document.getElementById('multi-product-body').innerHTML = tablefn(policyGridData);//今日列表更新/周期更新
        }).on('click', '.btn_all_read', function(){
            utils.policyGrid.changeItem(0);//传0表示所有
            policyGridData.array = utils.policyGrid.getItem();
            MakeDataReady();
            policyGridData.flag.is_history = false;
            $('.num_unread').html(utils.policyGrid.getUnreadNum() + '条');
            document.getElementById('multi-product-body').innerHTML = tablefn(policyGridData);//今日列表更新/周期更新
        }).on('mouseover', '.unread-config', function(){
            $('dl.config').removeClass('hide');
        }).on('mouseout', '.unread-config', function(){
            $('dl.config').addClass('hide');
        });

        // multiPolicySubmit
        //$.gmfConfirm
        function multiPolicySubmit(){
            // var stock_code = $('#stock_code').val();
            var stock_code = $.pullValue($('.trade-5').getCoreData(), 'stock_code');
            var stock_name = $.pullValue($('.trade-5').getCoreData(), 'stock_name');
            var is_trade_day = $.pullValue($('.trade-5').getCoreData(), 'is_trade_day');
            var ins_price = $('#val_price').val().trim();
            ins_price = ('' == ins_price)?0:ins_price;
            // var expire_date = '2016-09-22';
            var sponor_user_id = '11';//基金经理
            var ins_type;//1买入 2卖出
            var typeStr1 = '';

            if ($('.single-buy').hasClass('active')) {
                ins_type = 1;
                typeStr1 = '<span style="color:#F44336;">买入</span>';
            }else{
                ins_type = 2;
                typeStr1 = '<span style="color:#2196F3">卖出</span>';
            }
            var ins_model;//限价、市价，市价时，价格切记传空
            var typeStr2 = '';
            if ($('.order_model_limit_price').hasClass('active')) {
                ins_model = 1;
                typeStr2 = '限价';
                if (0 == ins_price) {
                    ins_model = 2;
                    typeStr2 = '市价';
                }
            }else{
                ins_model = 2;
                ins_price = 0;
                typeStr2 = '市价';
            }
            var exchange = $.pullValue($('.trade-5').getCoreData('exchange'), 'exchange');//股票交易所，上交所、深交所，从股票行情中获取
            if ('SH' == exchange) {
                exchange = 1;
            }else if ('SZ' == exchange) {
                exchange = 2;
            }
            var product_id = [];
            var ins_volume_arr = [];
            var policy_amount_arr = [];
            var htmlArr = [];
            $('.product-select').each(function(){
                if($(this).prop('checked')){
                    product_id.push($(this).attr('data-productId'));
                    var tmpInsVolume = $(this).parents('tr').find('.plus-input').val();
                    ins_volume_arr.push(tmpInsVolume);
                    var tmpPolicyAmount = $(this).parents('tr').find('.policy_volume').val();
                    policy_amount_arr.push(tmpPolicyAmount);
                    htmlArr.push('<tr style="border-bottom: 1px solid #E2E2E2;"><td class="cell-left">'+ $(this).parents('tr').find('.product-name').html() + '</td>'+
                        '<td class="cell-left">'+ typeStr2 + typeStr1 +'</td>'+
                        '<td class="cell-right">'+ ((0 == ins_price || '' == ins_price)?'市价':ins_price) +'</td>'+
                        '<td class="cell-right">'+ tmpInsVolume +'</td>'+
                        '<td class="cell-right">'+ tmpPolicyAmount +'</td></tr>');
                }
            });
            var totalAmount = policy_amount_arr.reduce(function(a, b) {
              return (parseFloat(a)*1000 + parseFloat(b)*1000) / 1000;
            }, 0);
            totalAmount = Number(totalAmount.toFixed(3));
            product_id = product_id.join(',');
            var totalVolume = ins_volume_arr.reduce(function(a, b) {
              return parseFloat(a) + parseFloat(b);
            }, 0);
            ins_volume = ins_volume_arr.join(',');
            var html = htmlArr.join('');
            var confirmHtml = '<table class="policy_confirm"><tr><th class="cell-left">产品单元</th>'+
                '<th class="cell-left">交易方向</th>'+
                '<th class="cell-right">指令价格</th>'+
                '<th class="cell-right">交易数量(股)</th>'+
                '<th class="cell-right">交易金额(元)</th></tr>'+html+'</table>'+
                '<div class="policy_total"><span style="color:#999999;font-size:13px;">总计</span><span>'+totalVolume+'</span><span>'+totalAmount+'</span></div>';
            if (0 == is_trade_day) {//0是休市时间，也就是非交易日或者是交易日的15点之后 1为非休市时间
                // confirmHtml += '<div style="color:#F44336;font-size: 14px;padding-bottom: 3px;">*当前为休市时间，指令将提交至下一交易日</div>';
                confirmHtml += '<label style="color:#F44336;font-size: 14px;padding-bottom: 3px;font-weight: bold;"><input type="checkbox" name="nextMarketDay" style="margin-right:6px;" />将指令提交至下一交易日</label>' +
                '<div class="jc-cancel-btn"><a class="ui-btn disabled">确定</a></div>';
            }else{
                confirmHtml += '<div class="jc-cancel-btn"><a class="ui-btn">确定</a></div>';
            }

            jc = $.confirm({
                title: '指令确认 <span style="margin-left:10px;font-size: 14px;font-weight: normal;">股票：'+ stock_code + ' ' + stock_name +'</span>',
                content: confirmHtml,
                closeIcon: true,
                confirmButton: false,//'确定',
                cancelButton: false
            });
            $('[name=nextMarketDay]').change(function(){
                if (true == $(this).prop('checked')) {
                    $('.jc-cancel-btn>.ui-btn').removeClass('disabled');
                }else {
                    $('.jc-cancel-btn>.ui-btn').addClass('disabled');
                }
            })
            $('.jc-cancel-btn>.ui-btn').click(function(){
                if (true !== $(this).hasClass('disabled')) {
                    jc.close();
                    doConfirmSubmit();
                }
            });
            function doConfirmSubmit(){
                $.ajax({
                    url: window.REQUEST_PREFIX + '/oms/ins/add_order',
                    type: 'post',
                    data: {
                        stock_code: stock_code,
                        stock_name: stock_name,
                        ins_price: ins_price,
                        ins_volume: ins_volume,
                        // expire_date: '2016-09-22',//暂时不传
                        sponor_user_id: sponor_user_id,
                        ins_type: ins_type,
                        product_id: product_id,
                        exchange: exchange,
                        ins_model: ins_model
                    },
                    success: function(res){
                        if (0 == res.code) {
                            // 不需要对结果进行提示，只需要刷新
                            getTodayPolicyGrid();
                            var htm = '';
                            var needShowConfirm = false;
                            var params = {};
                            this.data.replace(/^\?/,'').split('&').forEach(function(x){
                                params[ x.replace(/\=.*/,'') ] = decodeURIComponent( x.replace(/.*\=/,'') );
                            });
                            var trIndex = 0;
                            Object.keys(res.data).forEach(function(value, index){
                                var tmpName = '';
                                for (var i = 0; i < policyProductsData.array.length; i++) {
                                    if (value == policyProductsData.array[i].id) {
                                        tmpName = policyProductsData.array[i].name;
                                    }
                                }
                                var statusStr = '';
                                if (0 == res.data[value].code) {
                                    // statusStr = '提交成功';

                                }else{
                                    // statusStr = '<span style="color:#E74C3C;">' + res.data[value].msg + '</span>';
                                    statusStr = '<span>' + res.data[value].msg + '</span>';
                                    needShowConfirm = true;
                                    var volumeArr = params.ins_volume.split(',');
                                    var idArr = params.product_id.split(',');
                                    var tmpVolume;
                                    idArr.forEach(function(e, index){
                                        if (e == value) {
                                            tmpVolume = volumeArr[index];
                                        }
                                    });

                                    if (0 == trIndex) {
                                        trIndex += 1;
                                        htm += '<tr>'+
                                            '<td style="font-size: 12px;line-height: 16px;padding-top: 6px;padding-bottom: 6px;" class="cell-left"><span style="display:block;line-height: 16px;">'+ params.stock_name +'</span><span style="display:block;color:#999;">'+ params.stock_code +'</span></td>' +
                                            '<td style="font-size: 12px;line-height: 16px;padding-top: 6px;padding-bottom: 6px;" class="cell-left alert_product_name">'+ tmpName +'</td>' +
                                            '<td style="font-size: 12px;line-height: 16px;padding-top: 6px;padding-bottom: 6px;" class="cell-left"><span>'+((params.ins_model == 1)?'限价':'市价')+'</span>'+
                                            ((params.ins_type == 1)?'<span style="color:#F24A3D;">买入</span>':'<span style="color:#2196F3;">卖出</span>')+'</td>' +
                                            '<td style="font-size: 12px;line-height: 16px;padding-top: 6px;padding-bottom: 6px;" class="cell-right"><span style="display:block;line-height: 16px;">'+ parseInt(tmpVolume, 10) +'</span><span style="display:block;color:#999;">'+ ((1==params.ins_model)?Number(params.ins_price).formatMoney(3, '.', ','):'市价') +'</span></td>' +
                                            '<td style="font-size: 12px;line-height: 16px;padding-top: 6px;padding-bottom: 6px;max-width: 300px;" class="cell-left">'+ statusStr +'</td>' +
                                        '</tr>';
                                    }else{
                                        trIndex += 1;
                                        htm += '<tr style="border-top: 1px solid #E2E2E2;">'+
                                            '<td style="font-size: 12px;line-height: 16px;padding-top: 6px;padding-bottom: 6px;" class="cell-left"><span style="display:block;line-height: 16px;">'+ params.stock_name +'</span><span style="display:block;color:#999;">'+ params.stock_code +'</span></td>' +
                                            '<td style="font-size: 12px;line-height: 16px;padding-top: 6px;padding-bottom: 6px;" class="cell-left alert_product_name">'+ tmpName +'</td>' +
                                            '<td style="font-size: 12px;line-height: 16px;padding-top: 6px;padding-bottom: 6px;" class="cell-left"><span>'+((params.ins_model == 1)?'限价':'市价')+'</span>'+
                                            ((params.ins_type == 1)?'<span style="color:#F24A3D;">买入</span>':'<span style="color:#2196F3;">卖出</span>')+'</td>' +
                                            '<td style="font-size: 12px;line-height: 16px;padding-top: 6px;padding-bottom: 6px;" class="cell-right"><span style="display:block;line-height: 16px;">'+ parseInt(tmpVolume, 10) +'</span><span style="display:block;color:#999;">'+ ((1==params.ins_model)?Number(params.ins_price).formatMoney(3, '.', ','):'市价') +'</span></td>' +
                                            '<td style="font-size: 12px;line-height: 16px;padding-top: 6px;padding-bottom: 6px;max-width: 300px;" class="cell-left">'+ statusStr +'</td>' +
                                        '</tr>';
                                    }
                                }
                            });
                            if (true == needShowConfirm) {
                                forbidden_interval = true;
                                $.gmfConfirm('提交结果反馈',
                                    '<span style="font-size: 12px;">以下指令无法提交！</span><table class="policy_confirm">'+
                                    '<tr rows-head>' +
                                        '<th class="cell-left" style="font-size: 12px;min-width: 70px;">证券</th>' +
                                        '<th class="cell-left" style="font-size: 12px;min-width: 100px;">产品单元</th>' +
                                        '<th class="cell-left" style="font-size: 12px;min-width: 70px;">交易方向</th>' +
                                        '<th class="cell-right" style="font-size: 12px;min-width: 70px;">股数/价格</th>' +
                                        '<th class="cell-left" style="font-size: 12px;max-width: 300px;">失败原因</th>' +
                                    '</tr>' +
                                    htm+'</table>').ok(function(){
                                    forbidden_interval = false;
                                    getPolicyGrid();
                                });
                            }else{
                                //清空页面指令数量股票, 代码，价格
                                clearSubmitFormData();
                            }

                        }else{
                            if (tipTimer) {
                                clearTimeout(tipTimer);
                                tipTimer = undefined;
                            }
                            $('#page_tip').html(res.msg).removeClass('hide');
                            tipTimer = setTimeout(function(){
                                $('#page_tip').addClass('hide');
                            }, 3 * 1000);
                        }
                    },
                    error: function(){
                        if (tipTimer) {
                            clearTimeout(tipTimer);
                            tipTimer = undefined;
                        }
                        $('#page_tip').html('系统异常').removeClass('hide');
                        tipTimer = setTimeout(function(){
                            $('#page_tip').addClass('hide');
                        }, 3 * 1000);
                    }
                });
            }
            function clearSubmitFormData() {
                $("#stock_code").val('').change();
                $(".stock-name").html('');
                $("#val_price").val('');
                $(".plus-input-volume").val('');
                $(".plus-input-amount").val('');
                $(".product-select").each(function() {
                    $(this).attr('checked', false);
                    $(this).parents('tr').removeClass('active').find('.plus-input').prop('disabled', true);
                    $('.sub_title>.red').html(0);
                    $('.product-select-empty').hide();
                    $('.product-select-all').show();
                });
                $(".product-select").eq(0).change();
                $('#risk2Res').render({msg:'请输入股票代码'}).find('.active-show').removeClass('active').filter('.default-active').addClass('active');
            }
            $('.jquery-confirm-ok').focus();
        }
    });
</script>
