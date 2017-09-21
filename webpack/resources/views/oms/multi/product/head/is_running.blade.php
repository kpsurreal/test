<!--
产品组列表
trigger:
main_window:goto_section //触发到oms.app.js 使得页面滚动到最顶部。意义不大，因为并不是滚动到特定某一行
multi_products:create_order:finish //触发批量下单已完成事件，后续事情大致有：下单模块数量清空、更新持仓列表、更新委托/成交列表、告知head.blade.php，在查询get_settlement_info时传入unuse_cache=1
order_list:add_temporary_order //下单后构造临时数据
multi_products:head:updated //更新选中情况，持仓页面收到该事件后更新持仓显示
multi_products:head:updated:checked_one //用户选中1个产品
multi_products:head:updated:checked_notone //用户选中非1个产品
multi_products:head:updated:checked_nothing //用户什么也没选中 //已经没啥用了，没有地方监听该事件
multi_products:head:updated:checked_multi //用户选中多个产品 //已经没啥用了，没有地方监听该事件
multi_products:head:predict //每当页面触发“rendered change”时，则告知下单模块 计算可用数量

on:
multi_load
position_update_updated //订单提交后，需要触发刷新 entrust_update_updated
product:position:updated  // 持仓列表更新后，需要更新选中行的部分数据
create_order:form:changed //处理来自提交表单的事件，但是成功失败分别如何处理待理解
create_order:form:changed:pass //处理来自提交表单的事件，但是成功失败分别如何处理待理解
create_order:form:changed:stuck //处理来自提交表单的事件，但是成功失败分别如何处理待理解
create_order:form:submit //用户点击提交后，进行二次提示并提交
order_create:trade_5:updated //股票行情更新，产品组页面得到行情数据
multi_products:create_order:finish //批量下单完成，其实是此页面自己触发的事件 更新显示，具体每一个处理还待分析
productList:reset ／/撤单后更新列表
order_create:by_stock //无，此模块已经不处理该事件了
multi_products:create_order:finish add_multi_hand_order:success order_create:success //更新数据 告知head.blade.php，在查询get_multi_settlement_info时传入unuse_cache=1
create_order:form:warning-toggle //单股票下单页面，当底部提示不能按照用户所期望购买时，显示问号按钮，用户点击该按钮，产品列表需要显示原因。
position:runtime:refresh //持仓刷新后，更新产品组列表
 -->

<?php
use App\Services\OMS\Workflow\OMSWorkflowEntrustService;
?>
<link href="{{ asset('/js/jquery-confirm/jquery-confirm.min.css') }}" rel="stylesheet">
<style>
    .jconfirm-box-container{
        /*margin-left: 33%;*/
        margin: 0 auto;
        max-width: 670px;
        position: relative;
        min-height: 1px;
        padding-right: 15px;
        padding-left: 15px;
    }
    .custom_confirm tr>td{
        max-width: 100px;
        line-height: inherit;
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

    .new-oms-container .main-container section.multi-product-head .oms-table.policy-table.nothing:before{
         @if(isset($logined_info) && isset($logined_info['org_info']) && isset($logined_info['org_info']['theme']) && 3 == $logined_info['org_info']['theme'])
            content: '暂未分配任何策略，请联系管理员';
        @else
            content: '暂未分配任何交易单元，请联系管理员';
        @endif
    }

    .error-td{
        z-index: 9;
        display: block;
    }
    .error-box{
        position: fixed;  
    }
    .error-box .error-info{
        position: absolute;
        border: 1px solid #979797;
        width: 178px;
        height: 89px;
        white-space: normal;
        top: 10px;
        right: 18px;
        border-radius: 4px;
        background-color: #fff;
        line-height: 20px;
        z-index: 1;
    }
    .error-box .error-info:before{

        content: "";
        display: block;
        position: absolute;
        border-top: 6px solid transparent;
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-bottom: 6px solid #979797;
        width: 0;
        height: 0;
        top: -12px;
        left: 82px;
    }
    .error-box .error-info:after {
        content: "";
        display: block;
        position: absolute;
        border-top: 4px solid transparent;
        border-left: 4px solid transparent;
        border-right: 4px solid transparent;
        border-bottom: 4px solid #fff;
        width: 0;
        height: 0;
        top: -8px;
        left: 84px;›
    }

    .tr-alert{
        background-color: #FFC3BE !important;
        position: relative;

    }
    .tr-alert>td:first-child:after{
        width: 14px;
        height: 14px;
        content: "";
        display: block;
        background-image: url("../../css/img/icon-alert.png");
        position: absolute;
        left:2px;
        top:13px;
    }
    #multi_table_batch_buy ::-webkit-scrollbar {  
        width: 9px;
        height: 9px;
        border-top: 1px solid #e8e8e8;
        border-left: 1px solid #e8e8e8;
        background-color: #fafafa;  
    }
    #multi_table_batch_buy ::-webkit-scrollbar-thumb {
        border-radius: 10px;
        background-color: #afacac; 
    }
</style>
<script src="{{ asset('/js/jquery-confirm/jquery-confirm.min.js') }}"></script>
<div class="fixed-nav">
    <a class="fixed-nav__item" href="#anchor-productlist" data-hover-text="查看产品" data-normal-text="产品">产品</a>
    <a class="fixed-nav__item" href="#anchor-position" data-hover-text="查看持仓" data-normal-text="持仓">持仓</a>
    <a class="fixed-nav__item" href="#anchor-orderlist" data-hover-text="查看订单" data-normal-text="订单">订单</a>
</div>
<section class="multi-product-head">
    <div class="section-loading loading-loading"></div>
    <a id="anchor-productlist" style="position: relative;top:-65px;display: block;height: 0;width:0;"></a>
    <table class="oms-table policy-table nothing-nothing loading-loading">
        <tr rows-head>
            <th><input type="checkbox">&nbsp; 全选</th>
            @if(isset($logined_info) && isset($logined_info['org_info']) && isset($logined_info['org_info']['theme']) && 3 == $logined_info['org_info']['theme'])
                <th class="cell-right">当日净值</th>
                <th class="cell-right">仓位</th>
            @else
                <th class="cell-right">基金预估净值</th>
                <th class="cell-right">基金预估仓位</th>
            @endif
            
            @if(isset($logined_info) && isset($logined_info['org_info']) && isset($logined_info['org_info']['theme']) && 3 == $logined_info['org_info']['theme'])
                <th class="cell-right risk-line">风控距离/仓位限制</th>
                <th class="cell-right">当日盈亏</th>
                <th class="cell-right">当日盈亏率</th>

                <th class="cell-right">总盈亏</th>
                <th class="cell-right">总盈亏率</th>
                <th class="cell-right">资产总值</th>
                <th class="cell-right">持仓总值</th>
                <th class="cell-right">资金余额</th>
                <th class="cell-right">可用资金</th>
            @else
                <th class="cell-right">基金净资产</th>
                <th class="cell-right">交易单元持仓</th>
                <th class="cell-right">交易单元余额</th>
                <th class="cell-right">交易单元可用</th>
                <th class="cell-right">交易单元盈亏</th>
                <th class="cell-right">交易单元盈亏率</th>
            @endif

            @if(isset($logined_info) && isset($logined_info['org_info']) && isset($logined_info['org_info']['theme']) && 3 == $logined_info['org_info']['theme'])
                 <th class="cell-center">剩余交易天数</th>
            @endif
            
            @if(config('custom.showProductDetail'))
            <th></th>
            @endif
        </tr>
        <tbody rows-body></tbody>
        <script type="text/html" row-tpl>

            <tr data-class="positionInfo|getPositionTips|?:tr-alert">
                <td>
                    <label style="cursor:pointer;user-select:none;-webkit-user-select:none;">
                        <input type="checkbox" data-src="checked" class="product-checkbox">
                        <!-- &nbsp; &nbsp; &nbsp;<span data-src="|getProductLink"></span> -->
                        &nbsp; <span data-src="name"></span>

                        @if(config('custom.showProductType'))
                        <span class="append-tip" if="settlement_type">
                            <str if="settlement_type" data-src="settlement_type|settlementTypeCH"></str>
                                <!-- <str if="trading_day">T+<str data-src="trading_day"></str></str> -->
                        </span>
                        @endif
                    </label>
                </td>
                <td class="cell-right"><span data-src="runtime.net_value|numeral:0.0000"></span></td>
                <td class="cell-right" data-class="predict.entrust_volume|?:predict-td">
                    <span data-src="runtime.position|numeral:0.00%"></span>
                    {{-- <span class="predict second-line" if="predict.entrust_volume" data-src="predict.position|numeral:0.00%"></span> --}}
                </td>
                <!-- <td class="cell-right risk-line">
                    <span data-src="settlement_type|settlementTypeCH|getRiskLineWords"></span>getPositionWords
                </td> -->
                
                @if(isset($logined_info) && isset($logined_info['org_info']) && isset($logined_info['org_info']['theme']) && 3 == $logined_info['org_info']['theme'])
                    <td class="cell-right risk-line">
                        <span data-src="positionInfo|getPositionWords"></span>
                    </td>
                    <td class="cell-right"><span data-class="runtime.profit_of_today_v2|rgColor" data-src="runtime.profit_of_today_v2|numeral:0,0.000"></span></td>
                    <td class="cell-right"><span data-class="runtime.profit_of_today_v2|rgColor" data-src="runtime.profit_rate_of_day_v2|numeral:0.00%"></span></td>

                    <td class="cell-right"><span data-class="runtime.net_profite|rgColor" data-src="runtime.net_profite|numeral:0,0.00"></span></td>
                    <td class="cell-right"><span data-class="runtime.net_profite|rgColor" data-src="runtime.profit_rate|numeral:0.00%"></span></td>

                    <td class="cell-right"><span data-src="runtime.total_assets|numeral:0,0.00"></span></td>

                    <td class="cell-right" data-class="predict.entrust_volume|?:predict-td">
                        <span data-src="runtime.security|numeral:0,0.00"></span>
                        <span class="predict second-line" if="predict.entrust_volume" data-src="predict.security|numeral:0,0.00"></span>
                    </td>
                    <td class="cell-right" data-class="predict.entrust_volume|?:predict-td">
                        <span data-src="runtime.balance_amount|numeral:0,0.00"></span>
                        <span class="predict second-line" if="predict.entrust_volume" data-src="predict.balance_amount|numeral:0,0.00"></span>
                    </td>
                    <td class="cell-right" data-class="predict.entrust_volume|?:predict-td">
                        <span data-src="runtime.enable_cash|numeral:0,0.00"></span>
                        <span class="predict second-line" if="predict.entrust_volume" data-src="predict.enable_cash|numeral:0,0.00"></span>
                    </td>

                    
                @else
                    <td class="cell-right"><span data-src="runtime.total_assets|numeral:0,0.00"></span></td>

                    <td class="cell-right">
                        <span data-src="runtime.security|numeral:0,0.00"></span>
                        {{-- <span class="predict second-line" if="predict.entrust_volume" data-src="predict.security|numeral:0,0.00"></span> --}}
                    </td>
                    <td class="cell-right">
                        <span data-src="runtime.balance_amount|numeral:0,0.00"></span>
                        {{-- <span class="predict second-line" if="predict.entrust_volume" data-src="predict.balance_amount|numeral:0,0.00"></span> --}}
                    </td>
                    <td class="cell-right">
                        <span data-src="runtime.enable_cash|numeral:0,0.00"></span>
                        {{-- <span class="predict second-line" if="predict.entrust_volume" data-src="predict.enable_cash|numeral:0,0.00"></span> --}}
                    </td>

                    <td class="cell-right"><span data-class="runtime.net_profite|rgColor" data-src="runtime.net_profite|numeral:0,0.00"></span></td>
                    <td class="cell-right"><span data-class="runtime.net_profite|rgColor" data-src="runtime.profit_rate|numeral:0.00%"></span></td>
                @endif

                

                @if(isset($logined_info) && isset($logined_info['org_info']) && isset($logined_info['org_info']['theme']) && 3 == $logined_info['org_info']['theme'])
                     <td class="cell-center"><span data-src="left_running_day|getRunningDay"></span></td>
                @endif
               
                @if(config('custom.showProductDetail'))
                <td>
                    <a data-href="|parseString:{{ config('view.path_prefix','') }}/oms/${id}" target="_blank">详情</a>
                </td>
                @endif

                @if(isset($logined_info) && isset($logined_info['org_info']) && isset($logined_info['org_info']['theme']) && 3 == $logined_info['org_info']['theme'])
                <td class="error-td">
                    <div class="error-box" style="display: none;"><div class="error-info" ><span>风险提示：</span><span class="error-text" data-src="positionInfo|getTips"></span></div></div>
                </td>
                @endif
            </tr>
        </script>
    </table>
    
    <script>
    utils.deadline.init(LOGIN_INFO.user_id);
    utils.tab.init();
    var orginfo_theme = window.LOGIN_INFO.org_info.theme;//机构版／专户版枚举值 专户版为3，机构版为非3.

    //获取新股列表 写入全局中 
    $(function(){
        (function(){
            var url = (window.REQUEST_PREFIX||'')+"/oms/helper/new_ipo";
            $.get(url).done(function(res){
                if (0 == res[0]) {
                    window.new_stock_list = res[2];
                }
            });    
        })()
    });
    (function(){
        var me = $(this);
        var head_checkbox = me.find('[rows-head] input[type=checkbox]');
        var market = 'marketA';
        // 切换市场时，重新获取自选股数据
        $(window).on('order_create:market:changed', function(event){
            market = event.market;
            head_checkbox.prop('checked',false).change(); //首次全部不选中
            // 沪深 港股修改 触发修改产品列表的展示
            updateProductList(true);
        })

        $(document).on('mouseover', '.fixed-nav__item', function(){
            $(this).html($(this).attr('data-hover-text'));
        }).on('mouseout', '.fixed-nav__item', function(){
            var _this = this;
            setTimeout(function(){
                $(_this).html($(_this).attr('data-normal-text'));
            }, 0);
        });

        var form_data;
        var trade_5_stock;

        var last_trigger_timeout;
        // var multi_status;
        var product_list = [];
        var product_ids = [];
        var positions_loaded = false;
        var positions = [];

        var unuse_cache = 0;

        var feeData;
        var predict_display_arr;

        // 自动预算更新
        setAutoPredictTotalInfo();

        me.find('.loading-loading').addClass('loading');

        // 5秒更新 runtime
        setInterval(function(){
            loadRiskRulesInfo(function(){
                loadStockPoolInfo();
            });
        }, 10 * 1000);

        setInterval(function(){
            if(!product_ids.length){return;}
            !me.is('.loading') && loadRuntimeInfo();
        }, 4000 + parseInt(Math.random() * 1000));

        $(window).on('multi_load',function(event){
            // multi_status = event.multi_status;
            product_list = event.product_list;
            product_ids = event.product_ids;

            if(product_ids.length == 0){
                renderProductListFirst();
                // 不需要已停留3秒的方式进行提示
                // $.omsAlert('你当前暂没有运行中的组合！',false);
                return me.find('.loading-loading').removeClass('loading');
                loadRuntimeInfo();
            }else{
                loadRiskRulesInfo(function(){
                    loadStockPoolInfo(function(){
                        loadFeeRulesInfo(function(){
                            renderProductListFirst();
                            loadRuntimeInfo();
                        });
                    });
                });
            }
        }).on('position_update_updated entrust_update_updated', function(event){
            !me.is('.loading') && (event.updated_timestamp >(me.attr('last_updated_timestamp')||0)) && loadRuntimeInfo();
        }).on('product:position:updated',function(event){
            positions_loaded = true;
            positions = event.position;
            distributeFormDate();
        }).on('create_order:form:changed',function(event){
            var now_form_data = event.form_data;
            var direction = now_form_data.trade_direction=='{{OMSWorkflowEntrustService::ORDER_DIRECTION_BUY}}' ? 'buy' : 'sell';
            me.find('[rows-head]').render({
                buy: direction=='buy',
                sell: direction=='sell'
            });
            me.toggleClass('buy',direction=='buy')
            .toggleClass('sell',direction=='sell');

        }).on('create_order:form:changed:pass',function(event){
            form_data = event.form_data;
            window.form_data = form_data;
            if ('marketHSH' == market) {
                form_data.stock_id = form_data.stock_code + 'SH'
            }else if('marketHSZ' == market){
                form_data.stock_id = form_data.stock_code + 'SZ'
            }else if('marketA' == market){
                form_data.stock_id = form_data.stock_code;
            }
            distributeFormDate();
        }).on('create_order:form:changed:stuck',function(){
            form_data = null;
            resetProductList();
        }).on('create_order:form:submit',
            multiProductsSubmit
        ).on('order_create:trade_5:updated',function(event){
            trade_5_stock = event.stock;
            // 这里如果不加replace，会导致不断叠加SH和SZ字符串，导致stock_id不能匹配
            if ('marketHSH' == market) {
                trade_5_stock.stock_id = trade_5_stock.stock_id.replace('SH', '') + 'SH'
            }else if('marketHSZ' == market){
                trade_5_stock.stock_id = trade_5_stock.stock_id.replace('SZ', '') + 'SZ'
            }
            distributeFormDate();
        }).on('multi_products:create_order:finish',function(){
            loadRuntimeInfo();
            resetProductList();
        }).on('productList:reset', function(){
            loadRuntimeInfo();
            resetProductList();
        }).on('order_create:by_stock',function(event){
            // $(window).trigger({type:'main_window:goto_section',section:me});
        }).on('multi_products:create_order:finish add_multi_hand_order:success order_create:success',function(){
            unuse_cache = 1;//激活 unuse_cache
        }).on('create_order:form:warning-toggle',function(){
            $(window).trigger({type:'main_window:goto_section',section:me});
            toggleWarning();
        }).on('click',function(event){
            var event_target = $(event.target);
            if( event_target.closest('.warning-mark').length||event_target.closest('.dot-tip.risk_limit_check_dot').length ){return;}
            toggleWarning(false);
        }).on('position:runtime:refresh', function(event){
            updateProductListAfterRuntimeReady(true);
        }).on('multi_products:head:predict:after_preview', function(event){
            predict_display_arr = event.predict.display_arr;
            // console.log(predict_display_arr);
        });

        head_checkbox.on('change',function(){
            // me.find('[rows-body] tr input[type=checkbox]').prop('checked',$(this).prop('checked')).change();

            // 特殊处理，以免runtime没有时依旧可以提交下单
            var _this = this;
            var checkboxArr = me.find('[rows-body] tr input[type=checkbox]');
            checkboxArr.each(function(){
                if ($(this).attr('data-disabled') != 'true') {
                    // 全选时分别调用各个子checkbox的change事件，将导致大量冗余事件，所以改为自己独立触发。
                    // $(this).prop('checked',$(_this).prop('checked')).change();

                    $(this).prop('checked',$(_this).prop('checked'));
                    var row = $(this).closest('tr');
                    var product = row.getCoreData();
                    product.checked = $(this).prop('checked');
                    row.toggleClass('checked',product.checked);
                    row = null;
                }
            });
            tryTriggerUpdateNotice();
            distributeFormDate();
        });

        me.on('change','[rows-body] input[type=checkbox]',function(){
            var row = $(this).closest('tr');
            var product = row.getCoreData();
            product.checked = $(this).prop('checked');
            row.toggleClass('checked',product.checked);
            tryTriggerUpdateNotice();

            distributeFormDate();
        });

                // $(this).on('mouseenter',function(){
                //     console.log("enter");
                //     alertNode.find('.error-text').text(error_text);
                //     alertNode.show();
                // })
                // $(this).on('mouseleave',function(){
                //     console.log('leave');
                //     alertNode.hide();
                // })
                // $(this).on('mousemove',function(event){
                //     alertNode.css({
                //         left:event.clientX + 178,
                //         top:event.clientY
                //     })
                // })
        //当鼠标移入时风控悬浮事件      
        me.on('mouseenter','.tr-alert',function(){
            $(this).find('.error-box').show();
        }).on('mouseleave','.tr-alert',function(){
            $(this).find('.error-box').hide();
        }).on('mousemove','.tr-alert',function(){
            $(this).find('.error-box').css({
                left:event.clientX + 178,
                top:event.clientY
            })
        })


        function multiProductsSubmit(){
            //这里需要先进行二次提示，用户确认之后才下发指令/委托
            //产品单元、交易方向、指令价格、交易数量、交易金额
            var stock_code = $.pullValue($('.trade-5').getCoreData(), 'stock_code');
            var stock_name = $.pullValue($('.trade-5').getCoreData(), 'stock_name');
            var is_trade_day = $.pullValue($('.trade-5').getCoreData(), 'is_trade_day');
            var sponor_user_id = '11';//基金经理

            var ins_price = $('#val_price').val().trim();
            var ins_price_copy;
            ins_price = ('' == ins_price)?0:ins_price;
            var ins_type;//1买入 2卖出
            var typeStr1 = '';
            if ($('.single-buy').hasClass('active')) {
                ins_type = 1;
                typeStr1 = '<span style="color:#F44336;">买入</span>';
                ins_price_copy = parseFloat($('.stop_top_price').html());//买入使用涨停价
            }else{
                ins_type = 2;
                typeStr1 = '<span style="color:#2196F3">卖出</span>';
                ins_price_copy = parseFloat($('.stop_down_price').html());//卖出使用跌停价
            }
            var ins_model;//限价、市价，市价时，价格切记传空
            var typeStr2 = '';
            if ('marketA' == market) {
                if ($('.order_model_limit_price').hasClass('active')) {
                    ins_model = 1;
                    typeStr2 = '限价';
                    if (0 == ins_price) {
                        ins_model = selectize.getValue();
                        typeStr2 = '市价';
                    }
                }else{
                    ins_model = selectize.getValue();
                    ins_price = 0;
                    typeStr2 = '市价';
                }
            }
            if('marketHSH' == market || 'marketHSZ' == market){
                var trade_mode = $('#order_model-select').val();
                if (trade_mode == 5) {
                    typeStr2 = '增强限价'
                }else if(trade_mode == 4){
                    typeStr2 = '竞价限价'
                }
            }
            var exchange = $.pullValue($('.trade-5').getCoreData('exchange'), 'exchange');//股票交易所，上交所、深交所，从股票行情中获取
            if ('SH' === exchange) {
                exchange = 1;
            }else if ('SZ' === exchange) {
                exchange = 2;
            }

            var checked_rows = getSubmitableRows();
            if(!checked_rows){return;}
            // if($.isLoading()){return;}
            let asset_class = form_data ?(form_data.asset_class || 0) : 0;


            if(asset_class ==2){

                //国债逆回购

                var results = [];
                let tableData = [];
                var ins_volume_arr = [];
                 checked_rows.each(function(e){
                    let row = $(this);
                    let product = row.getCoreData();
                    results.push(product);
                    let predict_display = predict_display_arr.find(e=>{return e.product_id == product.id});
                    product.predict_display = predict_display;
                    checked_rows[e].predict_display = predict_display;
                    tableData.push(product);
                 })
                let contentChild = Vue.extend({
                    data(){
                        let stock_code =  form_data.stock_code.split('.')[0];
                        stock_name = $('#stock_name_addon').html();
                        return {
                            orginfo_theme: orginfo_theme,
                            tableData:tableData,
                            form_data:form_data,
                            stock_code:stock_code,
                            stock_name:stock_name,
                        }
                    },
                    template:`
                     <form class="vue-form">
                        <table style="text-align:center;margin-bottom:42px;">
                            <thead>
                                <tr style="background-color: #f7f7f7;">
                                    <th class="vue-form-confirmation__text-align-left">证券代码</th>
                                    <th class="vue-form-confirmation__text-align-left">证券名称</th>
                                    <th class="vue-form-confirmation__text-align-left">@{{3 == orginfo_theme ? '产品账户' : '交易单元'}}</th>
                                    <th vclass="ue-form-confirmation__text-align-left">报价方式</th>
                                    <th class="vue-form-confirmation__text-align-right">委托价格</th>
                                    <th class="vue-form-confirmation__text-align-right">本次委托数量</th>
                                    <th class="vue-form-confirmation__text-align-right">交易金额</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr style="border-bottom: 1px solid rgba(0,0,0,0.05);" v-for="row in tableData">
                                    <td class="vue-form-confirmation__text-align-left">@{{stock_code}}</td>
                                    <td class="vue-form-confirmation__text-align-left">@{{stock_name}}</td>
                                    <td class="vue-form-confirmation__text-align-left">@{{row.name}}</td>
                                    <td class="vue-form-confirmation__text-align-left">限价</td>
                                    <td class="vue-form-confirmation__text-align-right">@{{row.predict_display.risk_limit_check_request.price}}</td>
                                    <td class="vue-form-confirmation__text-align-right">@{{row.predict_display.show_entrust_volume}}</td>
                                    <td class="vue-form-confirmation__text-align-right">@{{row.predict_display.show_entrust_volume *100}}</td>
                                </tr>
                            </tbody>
                        </table>
                        <div class="buttons" >
                            <button type="button" class="vue-confirm__btns--cancel"  @click=btn_submit>确定</button>
                            <button type="button" class="vue-confirm__btns--submit"  @click=btn_cancel>取消</button>
                          
                        </div>
                      </form>
                    `,
                    methods:{

                      btn_submit(){
                        var _this = this;
                        var ins_volume_arr = [];
                        var policy_amount_arr = [];
                        $.startLoading('正在提交...');
                        this.form_data.batch_no = $.randomNo(LOGIN_INFO.user_id,30);
                        // 数组打乱排序
                        checked_rows.sort(function(a, b){
                            return Math.random() - 0.5;
                        });
                        checked_rows.each(function(e){
                            var row = $(this);
                            var product = row.getCoreData();
                            product.add_hand_order_res = null;//解决一个bug 去掉该语句将导致重复下单时，回调处理会认为已经有返回了。

                            if (location.search.includes("permission=special")) {
                                var is_manual_order = $('.is_auto_order').prop('checked')?0:1;
                            }else{
                                var is_manual_order = 0;
                            }
                            var post_data = $.extend({},_this.form_data,{
                                is_manual_order: is_manual_order,
                                volume: checked_rows[e].predict_display.show_entrust_volume //predict_display.show_entrust_volume
                            });

                            var marketType = 1;
                            if ('marketA' == market) {
                                if ($('.order_model_market_price').hasClass('active')) {
                                    post_data.trade_mode = selectize.getValue();
                                }
                                marketType = 1;
                            }else if('marketHSH' == market){
                                post_data.trade_mode = $('#order_model-select').val();
                                marketType = 2;
                                post_data.stock_code += 'SH';
                            }else if('marketHSZ' == market){
                                post_data.trade_mode = $('#order_model-select').val();
                                marketType = 3;
                                post_data.stock_code += 'SZ';
                            }
                            post_data.market = marketType;
                            post_data.price = $('#val_price').val().trim();
                            post_data.trade_mode = 1;
                            setTimeout(function(){
                                $.post((window.REQUEST_PREFIX||'')+'/oms/workflow/'+product.id+'/add_hand_order',post_data).done(function(res){
                                    product.add_hand_order_res = res;
                                    // 原流程是从后端返回的数据中获取委托数量，现在改为从请求中读取
                                    product.add_hand_order_res.data.entrust_amount = post_data.volume;
                                }).fail(function(){
                                    product.add_hand_order_res = {code:110,msg:'网络错误！'};
                                }).always(checkResults);
                            },Math.random()*200);
                            //清除二次确认框
                            setTimeout(function(){
                                _this.$parent.close();
                                
                            },1000)
                        });

                      },
                      btn_cancel(){
                        this.$parent.close();

                      }
                    }
                });

                Vue.prototype.$confirm({
                    title: '提交委托确认',
                    content:contentChild,
                    closeIcon: true,
                });

            }else if(asset_class == "new"){
                //新股认购
                var results = [];
                let tableData = [];
                 checked_rows.each(function(e){
                    let row = $(this);
                    let product = row.getCoreData();
                    results.push(product);
                    let predict_display = predict_display_arr.find(e=>{return e.product_id == product.id});
                    product.predict_display = predict_display;
                    checked_rows[e].predict_display = predict_display;
                    tableData.push(product);
                 })
                let contentChild = Vue.extend({
                    data(){
                        let stock_name = $('[data-src="stock_name|--"]').html();
                    let stock_code =  form_data.stock_code.split('.')[0];
                      return {
                        orginfo_theme: orginfo_theme,
                        tableData:tableData,
                        form_data:form_data,
                        stock_code:stock_code,
                        stock_name:stock_name,
                      }
                    },
                    template:`
                     <form class="vue-form ">
                        <table style="text-align:center;margin-bottom:42px;">
                            <thead>
                                <tr style="background-color: #f7f7f7;">
                                    <th class="vue-form-confirmation__text-align-left">证券代码</th>
                                    <th class="vue-form-confirmation__text-align-left">证券名称</th>
                                    <th class="vue-form-confirmation__text-align-left">@{{3 == orginfo_theme ? '产品账户' : '交易单元'}}</th>
                                    <th class="vue-form-confirmation__text-align-left">报价方式</th>
                                    <th class="vue-form-confirmation__text-align-right">委托价格</th>
                                    <th class="vue-form-confirmation__text-align-right">本次委托数量</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr style="border-bottom: 1px solid rgba(0,0,0,0.05);" v-for="row in tableData">
                                    <td class="vue-form-confirmation__text-align-left">@{{stock_code}}</td>
                                    <td class="vue-form-confirmation__text-align-left">@{{stock_name}}</td>
                                    <td class="vue-form-confirmation__text-align-left">@{{row.name}}</td>
                                    <td class="vue-form-confirmation__text-align-left">限价</td>
                                    <td class="vue-form-confirmation__text-align-right">@{{row.predict_display.risk_limit_check_request.price}}</td>
                                    <td class="vue-form-confirmation__text-align-right">@{{row.predict_display.show_entrust_volume}}</td>
                                </tr>
                            </tbody>
                        </table>
                        <div class="buttons" >
                            <button type="button" class="vue-confirm__btns--cancel"  @click=btn_submit>确定</button>
                            <button type="button" class="vue-confirm__btns--submit"  @click=btn_cancel>取消</button>
                          
                        </div>
                      </form>
                    `,
                    methods:{
                      btn_submit(){
                        var _this = this;
                        var ins_volume_arr = [];
                        var policy_amount_arr = [];
                        $.startLoading('正在提交...');
                        this.form_data.batch_no = $.randomNo(LOGIN_INFO.user_id,30);
                        // 数组打乱排序
                        checked_rows.sort(function(a, b){
                            return Math.random() - 0.5;
                        });
                        checked_rows.each(function(e){
                            var row = $(this);
                            var product = row.getCoreData();
                            product.add_hand_order_res = null;//解决一个bug 去掉该语句将导致重复下单时，回调处理会认为已经有返回了。

                            if (location.search.includes("permission=special")) {
                                var is_manual_order = $('.is_auto_order').prop('checked')?0:1;
                            }else{
                                var is_manual_order = 0;
                            }
                            var post_data = $.extend({},_this.form_data,{
                                is_manual_order: is_manual_order,
                                volume: checked_rows[e].predict_display.show_entrust_volume //predict_display.show_entrust_volume
                            });
                            var marketType = 1;
                            if ('marketA' == market) {
                                post_data.trade_mode = 1;
                                marketType = 1;
                            }else if('marketHSH' == market){
                                post_data.trade_mode = 1;
                                marketType = 2;
                                post_data.stock_code += 'SH';
                            }else if('marketHSZ' == market){
                                post_data.trade_mode = 1;
                                marketType = 3;
                                post_data.stock_code += 'SZ';
                            }
                            post_data.market = marketType;
                            post_data.price = $('#val_price').val().trim();
                            post_data.trade_mode = 1;
                            setTimeout(function(){
                                $.post((window.REQUEST_PREFIX||'')+'/oms/workflow/'+product.id+'/apply_new_ipo',post_data).done(function(res){
                                    product.add_hand_order_res = res;
                                    // 原流程是从后端返回的数据中获取委托数量，现在改为从请求中读取
                                    product.add_hand_order_res.data.entrust_amount = post_data.volume;
                                }).fail(function(){
                                    product.add_hand_order_res = {code:110,msg:'网络错误！'};
                                }).always(checkResults);
                            },Math.random()*200);
                            //清除二次确认框
                            setTimeout(function(){

                                _this.$parent.close();

                            },1000)
                        });

                      },
                      btn_cancel(){
                        this.$parent.close();
                      },
                      show_total_price(row){
                        let temp = row.predict_display.show_entrust_volume * (+row.predict_display.risk_limit_check_request.price);
                        temp =  temp.toFixed(3);
                        return temp;
                      }
                    }
                });

                Vue.prototype.$confirm({
                    title: '提交委托确认',
                    content:contentChild,
                    closeIcon: true,
                });
            }else{

                //除了国债逆回购 和新股
                var results = [];
                var product_id = [];
                var ins_volume_arr = [];
                var policy_amount_arr = [];
                var htmlArr = [];

                var display_all = $('.entrust_total_num').data('display_arr');

                var showRiskMsg = false;
                checked_rows.each(function(e){
                    var row = $(this);
                    var product = row.getCoreData();

                    var riskObj = {};
                    Object.values(display_all).forEach(function(el){
                        if (el.product_id == product.id) {
                            riskObj = el.riskObj;
                        }
                    });
                    results.push(product);
                    product_id.push(product.id);

                    var predict_display = predict_display_arr.find(e=>{return e.product_id == product.id});
                    checked_rows[e].predict_display = predict_display;
                    // var tmpInsVolume = predict_display.entrust_volume;
                    var tmpInsVolume = predict_display.show_entrust_volume;
                    ins_volume_arr.push(tmpInsVolume);
                    var tmpPolicyAmount = (0 == ins_price || '' == ins_price)?(Number((1000 * ins_price_copy).toFixed(2)) * tmpInsVolume / 1000):(Number((1000 * ins_price).toFixed(2)) * tmpInsVolume / 1000);
                    policy_amount_arr.push(tmpPolicyAmount);
                    var priceStr = (('市价' == typeStr2)?utils.common.getData(PRICE_TYPE_LIST, ins_model):ins_price);
                    htmlArr.push('<tr style="border-bottom: 1px solid #E2E2E2;"><td class="cell-left">'+ product.name + '</td>'+
                        '<td class="cell-left">'+ typeStr1 +'</td>'+
                        '<td class="cell-left">'+ typeStr2 +'</td>'+
                        '<td class="cell-right" style="max-width:190px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="'+ priceStr +'">'+ priceStr +'</td>'+
                        '<td class="cell-right">'+ tmpInsVolume +'</td>'+
                        '<td class="cell-right">'+ tmpPolicyAmount +'</td></tr>'
                    );
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
                if (false == showRiskMsg) {
                    var confirmHtml = '<table class="custom_confirm"><tbody style="width:100%;display: inline-table;"><tr><th class="cell-left">'+ (3 == orginfo_theme ? '产品单元' : '交易单元') +'</th>'+
                        '<th class="cell-left">买卖标志</th>'+
                        '<th class="cell-left">报价方式</th>'+
                        '<th class="cell-right">委托价格</th>'+
                        '<th class="cell-right">交易数量(股)</th>'+
                        '<th class="cell-right">交易金额(元)</th></tr>'+html+'</tbody></table>'+
                        '<div class="custom_total"><span style="color:#999999;font-size:13px;">总计</span><span>'+totalVolume+'</span><span>'+totalAmount+'</span></div>';
                }else{
                    var confirmHtml = '<table class="custom_confirm"><tbody style="width:100%;display: inline-table;"><tr><th class="cell-left">'+ (3 == orginfo_theme ? '产品单元' : '交易单元') +'</th>'+
                        '<th class="cell-left">买卖标志</th>'+
                        '<th class="cell-left">报价方式</th>'+
                        '<th class="cell-right">委托价格</th>'+
                        '<th class="cell-right">交易数量(股)</th>'+
                        '<th class="cell-right">交易金额(元)</th>'+
                        // '<th class="cell-right">备注</th></tr>'+
                        html+
                        '</tbody></table>'+
                        '<div class="custom_total"><span style="color:#999999;font-size:13px;">总计</span><span>'+totalVolume+'</span><span>'+totalAmount+'</span></div>';
                }
                
                if (0 == is_trade_day) {//0是休市时间，也就是非交易日或者是交易日的15点之后 1为非休市时间
                    confirmHtml += '<div style="color:#F44336;font-size: 14px;padding-bottom: 3px;">*当前为休市时间，指令将提交至下一交易日</div>'
                }
                if (location.search.includes("permission=special")) {
                    confirmHtml += '<label><input class="is_auto_order" style="margin-right: 10px;" type="checkbox" />自动审核</label>'
                }

                $.confirm({
                    title: '委托确认 <span style="margin-left:10px;font-size: 14px;font-weight: normal;">股票：'+ stock_code + ' ' + stock_name +'</span>',
                    content: confirmHtml,
                    keyboardEnabled: true,
                    closeIcon: true,
                    confirmButton: '确定',
                    cancelButton: '取消',
                    confirm: function(){
                        if($.isLoading()){return;}
                        $.startLoading('正在提交订单...');
                        form_data.batch_no = $.randomNo(LOGIN_INFO.user_id,30);

                        // 数组打乱排序
                        checked_rows.sort(function(a, b){
                            return Math.random() - 0.5;
                        });

                        checked_rows.each(function(e){
                            var row = $(this);
                            var product = row.getCoreData();
                            product.add_hand_order_res = null;//解决一个bug 去掉该语句将导致重复下单时，回调处理会认为已经有返回了。

                            if (location.search.includes("permission=special")) {
                                var is_manual_order = $('.is_auto_order').prop('checked')?0:1;
                            }else{
                                var is_manual_order = 0;
                            }
                            var post_data = $.extend({},form_data,{
                                is_manual_order: is_manual_order,
                                volume: checked_rows[e].predict_display.show_entrust_volume //predict_display.show_entrust_volume
                            });

                            var marketType = 1;
                            if ('marketA' == market) {
                                if ($('.order_model_market_price').hasClass('active')) {
                                    post_data.trade_mode = selectize.getValue();
                                }
                                marketType = 1;
                            }else if('marketHSH' == market){
                                post_data.trade_mode = $('#order_model-select').val();
                                marketType = 2;
                                post_data.stock_code += 'SH';
                            }else if('marketHSZ' == market){
                                post_data.trade_mode = $('#order_model-select').val();
                                marketType = 3;
                                post_data.stock_code += 'SZ';
                            }
                            
                            post_data.market = marketType;
                            post_data.price = post_data.price.trim();

                            setTimeout(function(){
                                $.post((window.REQUEST_PREFIX||'')+'/oms/workflow/'+product.id+'/add_hand_order',post_data).done(function(res){
                                    product.add_hand_order_res = res;
                                    // 原流程是从后端返回的数据中获取委托数量，现在改为从请求中读取
                                    //product.add_hand_order_res.data.entrust_amount = post_data.volume;
                                }).fail(function(){
                                    product.add_hand_order_res = {code:110,msg:'网络错误！'};
                                }).always(checkResults);
                            },Math.random()*200);
                        });
                    }
                });
            }

            function checkResults(){
                var form_data = window.form_data;
                var waiting_num = results.filter(function(product){
                    return !product.add_hand_order_res;
                }).length;
                if(waiting_num){return;}
                var filter_res = {success:[],fail:[]};
                var htmlArr = [];
                //新版二次确认框
                //包括处理结果和继续购买按钮

                for(let i = 0;i<results.length;i++){
                    let row = results[i];
                    //row.add_hand_order_res;
                    //服务端返回数据对应理解
                    let res = row.add_hand_order_res;
                    //模拟数据
                    // res ={"code":0,
                    //         "msg":"",
                    //         "data":{
                    //          "000001.SZ":{
                    //             "code": 5022111,
                    //             "msg": "",
                    //             "data": {
                    //                 "msg": [
                    //                     "已触发风控:0329股票池禁止买入",
                    //                     "已触发风控(公司):0329股票池禁止买入"
                    //                 ],
                    //                 "limit_action": 0
                    //             }
                    //         }}
                    //     }
                    //是否显示继续购买按钮
                    if(res.code == 0){
                        //购买成功
                        row.btnType =  false;
                        row.msg = ["委托成功"];
                        row.entrustStatus = "pass";
                        row.style = {}


                    }else if(res.code == 5022111){//风控专用错误码 不可更改 不能挪为它用
                        if(res.data[trade_5_stock.stock_id]){
                            let temp = res.data[trade_5_stock.stock_id];
                            if(temp.code == 0){
                                //没问题
                                row.btnType =  false;
                                row.msg = ["委托成功"];
                                row.entrustStatus = "pass";
                                row.style = {
                                   
                                }
                            }else if(temp.code == 5022111){
                                //提示性风控
                                if(temp.msg==""){
                                    if(temp.data.limit_action == 0){
                                        //alert
                                        row.btnType =  true;
                                        row.msg = temp.data.msg;
                                        row.entrustStatus = "alert";
                                        row.style = {
                                        color:"#FAA11F"
                                        }
                                    }else{    
                                        //购买失败
                                        row.btnType = false;
                                        row.entrustStatus = "fail";
                                        row.style = {
                                            color:"red"
                                        }
                                        if(temp.msg ==""){
                                            row.msg = temp.data.msg;
                                        }else{
                                            row.msg = [temp.msg];
                                        }
                                        row.msg.unshift("委托失败");
                                    }

                                }else{
                                    //购买失败
                                    row.btnType = false;
                                    row.entrustStatus = "fail";
                                    row.style = {
                                        color:"red"
                                    }
                                    if(temp.msg ==""){
                                        row.msg = []
                                    }else{
                                        row.msg = [temp.msg];
                                    }
                                    row.msg.unshift("委托失败");
                                }

                            } else if(temp.code == 5022110){
                                row.btnType =  false;
                                row.msg = [temp.msg];
                                row.msg.unshift("委托失败");
                                row.entrustStatus = "fail";
                                row.style = {
                                    color:"red"
                                }
                            }else{
                                //禁止性风控
                                row.btnType =  false;
                                row.msg = temp.data.msg;
                                row.msg.unshift("委托失败");
                                row.entrustStatus = "fail";
                                row.style = {
                                    color:"red"
                                }
                            }
                        }else{
                        //购买成功
                        row.btnType =  false;
                        row.msg = ["委托成功"];
                        row.entrustStatus = "pass";
                        row.style = {}
                        }

                    }else{
                        //购买失败
                        row.btnType = false;
                        row.entrustStatus = "fail";
                        row.style = {
                            color:"red"
                        }
                        if(res.msg ==""){
                            row.msg = [];
                        }else{
                            row.msg = [res.msg];
                        }
                        row.msg.unshift("委托失败");
                    }
                }
                let contentChild = Vue.extend({
                    data(){
                        if(trade_5_stock){
                            var stock_id = trade_5_stock.stock_id;
                            var stock_name = trade_5_stock.stock_name;
                            var stock_code = trade_5_stock.stock_code;
                        }else{
                            var stock_id = "";
                            var stock_name = "";
                            var stock_code = "";
                        }
                        if(!form_data){
                            form_data.price = results[0].risk_limit_check_request.price;
                        }
                        var entrust_price = results[0].predict.entrust_price; //获取价格
                        results.forEach(function(row){
                            //普通股票显示数量
                            if(row.predict.entrust_volume && !isNaN(row.predict.entrust_volume)){
                                row.entrust_volume  =  row.predict.entrust_volume;
                                return;
                            }
                            //国债和新股
                            if(row.predict_display){
                                row.entrust_volume  =  row.predict_display.show_entrust_volume;
                            }
                        })

                        this.$nextTick(function(){
                            $('#val_volume').val('').change();
                            $('#vale_current_volum').val('').change();
                            $('#val_assets_ratio').val('').change();
                            $('#val_position_ratio').val('').change();
                            $('#val_cur_position_ratio').val('').change();
                            // $('#vale__volum').val('').change(); // 3.11版本只保留目标仓位情况下的数量填写
                            //清空新股的股票代码
                            if(form_data.asset_class == "new"){
                                $('#stock_code').val('').change();
                            }
                        })
                        return {
                            orginfo_theme: orginfo_theme,
                            tableData: results,
                            stock_id: stock_id,
                            stock_name: stock_name,
                            entrust_price_str: entrust_price,
                            stock_code: stock_code,
                            form_data: form_data,
                            isLoading: false,
                        }
                    },
                    template:`
                    <div style="position:relative">
                    <span style="position: absolute;top: -36px;left: 91px;font-size:12px;">股票：@{{stock_code}}&nbsp;&nbsp;@{{stock_name}}&nbsp;&nbsp;价格：@{{form_data.price}}</span>
                    <div class="vue-form-confirmation">
                        <table style="width: 600px;">
                            <tr style="background-color: #f7f7f7;">
                                <tr style="border-bottom: 1px solid rgba(0,0,0,0.05);">
                                    <th class="vue-form-confirmation__text-align-left" style="color:rgba(74,74,74,0.5);">@{{3 == orginfo_theme ? '产品账户' : '交易单元'}}</th>
                                    <th class="vue-form-confirmation__text-align-left" style="color:rgba(74,74,74,0.5);">数量</th>
                                    <th class="vue-form-confirmation__text-align-left" style="color:rgba(74,74,74,0.5);">备注</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr  v-for="row in tableData" style="border-bottom: 1px solid rgba(0,0,0,0.05);">
                                    <td class="vue-form-confirmation__text-align-left" style="text-overflow: ellipsis;overflow: hidden;white-space: nowrap;max-width:100px">@{{row.name}}</td>
                                    <td class="vue-form-confirmation__text-align-left">@{{row.entrust_volume}}</td>
                                    <td class="vue-form-confirmation__text-align-left vue-form-confirmation__span-center" >
                                        <div>
                                            <span :style=row.style>
                                                <template v-for="msg in row.msg">
                                                    @{{msg}}</br>
                                                </template>
                                            </span>  
                                            <button type="" v-if="row.btnType" @click=btn_submit(row)>继续委托</button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                      </div>
                      </div>
                    `,
                    methods:{
                        btn_submit(row){
                            if(this.isLoading){
                                return
                            }
                            this.isLoading = true;
                            //忽略提示性风控 继续购买
                            var _this = this;
                            var ins_volume_arr = [];
                            var policy_amount_arr = [];
                            var batch_no = $.randomNo(LOGIN_INFO.user_id,30);
                            var volume = row.entrust_volume;
                            var post_data = $.extend({},this.form_data,{
                                ignore_tips:1,
                                volume: volume //predict_display.show_entrust_volume
                            });
                            var marketType = 1;
                            if ('marketA' == market) {
                                if ($('.order_model_market_price').hasClass('active')) {
                                    post_data.trade_mode = selectize.getValue();
                                }
                                marketType = 1;
                            }else if('marketHSH' == market){
                                post_data.trade_mode = $('#order_model-select').val();
                                marketType = 2;
                                post_data.stock_code += 'SH';
                            }else if('marketHSZ' == market){
                                post_data.trade_mode = $('#order_model-select').val();
                                marketType = 3;
                                post_data.stock_code += 'SZ';
                            }
                            post_data.market = marketType;
                            post_data.price = $('#val_price').val().trim();

                            $.post((window.REQUEST_PREFIX||'')+'/oms/workflow/'+row.product_id+'/add_hand_order',post_data).done(function(res){
                                 if(res.code == 0){
                                    row.btnType =  false;
                                    row.entrustStatus = "pass";
                                    row.msg = [];
                                    row.msg.unshift('委托成功');
                                    row.style = {}
                                 }else{
                                    row.btnType =  false;
                                    row.entrustStatus = "fail";
                                    row.msg = [];
                                    row.msg.unshift(res.msg);
                                    row.msg.unshift('委托失败');
                                    row.style = {
                                        color:"red"
                                    }
                                 }
                                 _this.tableData = Object.assign({}, _this.tableData)

                            }).fail(function(){
                                row.btnType =  false;
                                row.entrustStatus = "fail";
                                row.msg = ["委托失败"];
                                row.style = {
                                    color:"red"
                                }
                                _this.tableData = Object.assign({}, _this.tableData)
                            }).always(function(){
                                _this.isLoading = false;
                            });
                        },
                        show_entrust_volume(row){
                            //普通股票显示数量
                            if(row.predict.entrust_volume && !isNaN(row.predict.entrust_volume)){
                                return row.predict.entrust_volume;
                            }
                            //国债和新股
                            if(row.predict_display){
                                return row.predict_display.show_entrust_volume;
                            }
                        },
                        entrust_price(row){
                            if(row.predict_display){
                                return row.predict_display.risk_limit_check_request.price
                            }
                            if(this.entrust_price_str){
                                return this.entrust_price_str;
                            }
                        }
                    },
                    mounted(){
                        $.clearLoading();
                    }
                });

                Vue.prototype.$confirm({
                    title: '委托结果',
                    content:contentChild,
                    closeIcon: true,
                });



                // var msg = $('<div style="max-height: 300px; overflow: auto;">').html(
                //     filter_res.success.map(function(product){
                //         return '<div style="font-size:bold;"><h2>'+ product.name +' 下单成功！</h2></div>';
                //     }).concat(filter_res.fail.map(function(product){
                //         return '<div style="color:red;font-size:bold;"><h2>'+ product.name +' 下单失败！</h2>'+
                //             $.pullValue(product,'add_hand_order_res.msg','网络错误')
                //         +'</div>';
                //     })).join('')
                // );
                // $.clearLoading();
                // $.gmfConfirm('批量下单结果',msg);

                // addTemporaryOrder(filter_res.success);
                // $(window).trigger('multi_products:create_order:finish');
            }

            function addTemporaryOrder(success_res){
                var tmpModel = $('.order_model_limit_price.active').children('input').val();
                var order = {
                    stock: {
                        code: window.form_data.stock_code
                    },
                    entrust: {
                        price: window.form_data.price,
                        amount: 0,
                        model: 1 == tmpModel ? tmpModel : selectize.getValue(),
                        type: window.form_data.trade_direction
                    },
                    // model: selectize.getValue(),
                    deal: {
                        amount: 0,
                        price: 0
                    },
                    product: {
                        name: '',
                    },
                    stock_info: {
                        stock_name: trade_5_stock ? trade_5_stock.stock_name : form_data.stock_code,
                    },
                    updated_at: 0,
                    created_at: 0
                };

                success_res.forEach(function(product){
                    var re_order = $.pullValue(product,'add_hand_order_res.data');
                    // 原流程是从后端返回的数据中获取委托数量，现在改为从请求中读取
                    order.entrust.amount += +$.pullValue(re_order,'entrust_amount',0);
                    order.product.name = order.product.name ? '多策略' : product.name;
                    order.created_at = re_order.created_at;
                    order.updated_at = re_order.updated_at;
                });

                $(window).trigger({type:'order_list:add_temporary_order',order:order});
            }

            function getSubmitableRows(){
                var rows = me.find('[rows-body] tr.checked');

                if(!rows.length){
                    if (3 == orginfo_theme) {
                        $.omsAlert('没有选中的策略！',false);
                    }else{
                        $.omsAlert('没有选中的交易单元！',false);
                    }
                    
                    return false;
                }

                rows = rows.filter(function(){
                    var row = $(this);
                    var product = row.getCoreData();
                    var predict_display = predict_display_arr.find(e=>{return e.product_id == product.id});
                    // return $.pullValue(product,'predict.entrust_volume',0) > 0;
                    return $.pullValue(predict_display,'show_entrust_volume',0) > 0;
                });

                if(!rows.length){
                    if (3 == orginfo_theme) {
                        $.omsAlert('没有可以下单的策略！',false);
                    }else{
                        $.omsAlert('没有可以下单的交易单元！',false);
                    }
                    
                    return false;
                }
                return rows;
            }
        }

        // 分散表单数据，将其渲染到表格 此处进行前端风控
        function distributeFormDate(){

            if( !formDataIsOk() ){
                return;
            }
            if( $.pullValue(trade_5_stock,'stock_id',NaN)!=$.pullValue(form_data,'stock_id',NaN) ){return;}//股票数据不一致
            if( !positions_loaded ){return;}//持仓数据没有加载出来
            var trading_unit = trade_5_stock.trading_unit;

            me.find('[rows-body] tr.checked').each(function(){
                var row = $(this);
                var product = row.getCoreData();

                if(!product.runtime){return;} //无tuntime数据则返回（为了等runtime接口返回数据）

                 if(form_data.asset_class && form_data.asset_class == "new"){
                    //新股申购修改请求数量
                    // risk_limit_check_request 记住这个变量，与risk_limit_check_response对应更好理解
                    product.risk_limit_check_request = {
                        trade_mode: form_data.trade_mode,  //限价1、市价2
                        stop_top_price: $('.stop_top_price').html(),
                        stop_down_price: $('.stop_down_price').html(),
                        trade_number_method: form_data.trade_number_method, //3.8.0新增，记录交易方式 绝对数量、按比例、调仓到、
                        stock_id: form_data.stock_id,
                        product_id: product.id,
                        left_buy_day: product.left_buy_day,
                        buy_or_sell: form_data.trade_direction=='{{OMSWorkflowEntrustService::ORDER_DIRECTION_BUY}}' ? 'buy' : 'sell',
                        price:$('#val_price').val(),
                        limit_price_or_market_price: form_data.trade_mode=='{{OMSWorkflowEntrustService::ORDER_MODEL_MARKET_PRICE}}' ? 'market_price' : 'limit_price',
                        volume: +$('#val_volume').val() || 0,
                        max_volume: +$('#val_volume').attr('max_volume') || 0,
                        dst_position: form_data.position_ratio, //目标比例
                        cur_volume: form_data.current_volume || 0,
                        dst_assets:form_data.assets_ratio,     //等比例调仓
                        cur_position_ratio: form_data.cur_position_ratio,

                    };
                }else{
                    // risk_limit_check_request 记住这个变量，与risk_limit_check_response对应更好理解
                    product.risk_limit_check_request = {
                        trade_mode: form_data.trade_mode,  //限价1、市价2
                        stop_top_price: $('.stop_top_price').html(),
                        stop_down_price: $('.stop_down_price').html(),
                        trade_number_method: form_data.trade_number_method, //3.8.0新增，记录交易方式 绝对数量、按比例、调仓到
                        stock_id: form_data.stock_id,
                        product_id: product.id,
                        left_buy_day: product.left_buy_day,
                        buy_or_sell: form_data.trade_direction=='{{OMSWorkflowEntrustService::ORDER_DIRECTION_BUY}}' ? 'buy' : 'sell',
                        price: +form_data.price||0,
                        limit_price_or_market_price: form_data.trade_mode=='{{OMSWorkflowEntrustService::ORDER_MODEL_MARKET_PRICE}}' ? 'market_price' : 'limit_price',
                        volume: +form_data.volume||0,
                        dst_position: form_data.position_ratio, //目标比例
                        cur_volume: form_data.current_volume || 0,
                        dst_assets:form_data.assets_ratio,     //等比例调仓
                        cur_position_ratio: form_data.cur_position_ratio,
                    };
                }

                var market_value = 0;
                var total_amount = 0;
                var sell_total_amount = 0;// 卖出不需要计算买入委托作为总持仓数量
                var enable_sell_volume = 0;
                var all_market_value = 0;
                var entrust_buy_num = 0;
                var entrust_buy_money = 0;
                var entrust_sell_num = 0;
                var entrust_sell_money = 0;
                var latest_price = $('.last_price').html();
                var cost_price = 0;
                var market_value_v2 = 0;

                var stock_position_num = 0; //该产品已持仓该股票数量
                var stock_entrust_num = 0; //该产品已委托该股票数量
                var stock_total_share = trade_5_stock.total_share_capital; //该股票总股票数量，即总股本
                var stock_all_position_num = 0; //所有的持仓汇总该股票数量
                var stock_all_entrust_num = 0; //所有的委托汇总该股票数量
                var stock_entrust_buy_num = 0; //该产品已委托买入数量
                var stock_entrust_sell_num = 0; //该产品已委托卖出数量
                var stock_all_entrust_buy_num = 0; //所有的产品已委托买入数量
                var stock_all_entrust_sell_num = 0; //所有的产品已委托卖出数量

                // position_realtime和risk_position所含的market_value和total_amount的含义是有区别的，risk_position包含已委托还未成交的股票，所以应该取这个。
                window.position_realtime.forEach(function(e){
                    if (e.stock_id === form_data.stock_id && e.product_id == product.id) {
                        enable_sell_volume = e.enable_sell_volume;
                        sell_total_amount = e.total_amount;
                        market_value_v2 = e.market_value;
                        // latest_price = e.latest_price
                        cost_price = e.cost_price;

                        stock_position_num += Number(e.total_amount); // 得到该产品已持仓该股票数量
                    }

                    // 联合风控需要遍历所有的组合
                    if (e.stock_id === form_data.stock_id) {
                        stock_all_position_num += Number(e.total_amount);
                    }
                });
                window.risk_position[product.id].data.forEach(function(el){
                    if (el.stock_id == form_data.stock_id) {
                        total_amount = el.total_amount;
                        market_value = el.market_value;
                    }
                    all_market_value += el.market_value - 0;//强制转数字
                });
                window.entrust_info.forEach(function(el){
                    if (el.stock.code == product.risk_limit_check_request.stock_id && el.product_id == product.id && 
                        (![4, 5, 7, 8, 9].some(function(ele){
                            return el.status == ele;
                        }) || (el.status == 4 && !/1|2/.test( el.cancel_status )))
                    ) {
                        if ('buy' == product.risk_limit_check_request.buy_or_sell && 1 == el.entrust.type) {
                            entrust_buy_num += el.entrust.amount - el.deal.amount;
                            entrust_buy_money += (el.entrust.amount - el.deal.amount) * el.entrust.price;
                        }else if ('sell' == product.risk_limit_check_request.buy_or_sell && 2 == el.entrust.type){
                            entrust_sell_num += el.entrust.amount - el.deal.amount;
                            entrust_sell_money += (el.entrust.amount - el.deal.amount) * el.entrust.price;
                        }

                        // 计算对敲、举牌委托数量时，不应该区分当前是买还是卖
                        if (1 == el.entrust.type) {
                            stock_entrust_num += el.entrust.amount - el.deal.amount; // 得到该产品已委托该股票数量
                            stock_entrust_buy_num = el.entrust.amount - el.deal.amount; // 得到该产品已委托买入数量
                        }else if(2 == el.entrust.type){
                            stock_entrust_sell_num = el.entrust.amount - el.deal.amount; // 得到该产品已委托卖出数量
                        }
                    }

                    // 联合风控需要遍历所有的组合,不应该区分当前是买还是卖
                    if (el.stock.code == product.risk_limit_check_request.stock_id && 
                        (![4, 5, 7, 8, 9].some(function(ele){
                            return el.status == ele;
                        }) || (el.status == 4 && !/1|2/.test( el.cancel_status )))
                    ) {
                        if (1 == el.entrust.type) {
                            stock_all_entrust_num += el.entrust.amount - el.deal.amount; // 得到所有产品已委托该股票数量

                            stock_all_entrust_buy_num += el.entrust.amount - el.deal.amount; // 所有的产品已委托买入数量
                        }else if(2 == el.entrust.type){
                            stock_all_entrust_sell_num += el.entrust.amount - el.deal.amount; // 所有的产品已委托卖出数量
                        }
                    }
                })

                // 风控校验
                // 交易数量这样的值，以前可以直接在form表单中读取。但是在新支持调仓到及具体数字后，需要判断读取具体哪一个值。
                var checkVolume = +form_data.volume||0;
                var needAlert = false;
                // checkVolume = Math.floor(checkVolume / 100) * 100;
               // 目标仓位风控校验
                if ('position_ratio' == form_data.trade_number_method) {
                    if ('buy' == product.risk_limit_check_request.buy_or_sell) {
                        // // checkVolume = Math.floor((form_data.position_ratio * product.runtime.total_assets / form_data.price / 100 - total_amount) / 100) * 100;
                        // // 总资金 - 委托的金额- 持仓的金额，再除以当前价格
                        // checkVolume = Math.floor((form_data.position_ratio * product.runtime.total_assets / 100 - entrust_buy_money - market_value_v2) / form_data.price / 100) * 100;
                        // checkVolume = Math.max(checkVolume, 0);

                        checkVolume = +form_data.current_volume||0;
                    }else{
                        // // checkVolume = Math.ceil((sell_total_amount - form_data.position_ratio * product.runtime.total_assets / form_data.price / 100 - entrust_sell_num) / 100) * 100;
                        // // 持仓的金额 - 总资金 - 委托的金额，再除以当前价格
                        // var tmpLastPrice = $('.last_price').html();
                        // if (isNaN(Number(tmpLastPrice))) {
                        //     checkVolume = 0;
                        // }else{
                        //     // checkVolume = (market_value_v2 - form_data.position_ratio * product.runtime.total_assets / 100 - entrust_sell_money) / $('.last_price').html();
                        //     checkVolume = (sell_total_amount - form_data.position_ratio * product.runtime.total_assets / 100 / $('.last_price').html() - entrust_sell_num) ;
                        // }
                        // if (checkVolume > enable_sell_volume) {
                        //     needAlert = true;
                        // }
                        // // 如果可卖不为整百，且需卖大于可卖的向下取整百，且计划委卖大于100 则提示
                        // var tmp_floor_enable_sell_volume = Math.floor(enable_sell_volume / trading_unit) * trading_unit;
                        // if (tmp_floor_enable_sell_volume != enable_sell_volume &&
                        //     checkVolume > tmp_floor_enable_sell_volume &&
                        //     checkVolume > trading_unit) {
                        //     needAlert = true;
                        // }else{
                        //     if (Math.ceil(checkVolume / trading_unit) * trading_unit == Math.ceil(enable_sell_volume / trading_unit) * trading_unit) {
                        //         needAlert = false;
                        //     }
                        // }

                        checkVolume = +form_data.current_volume||0;
                        
                        checkVolume = Math.ceil(checkVolume / trading_unit) * trading_unit;
                        checkVolume = Math.min(checkVolume, enable_sell_volume)
                        checkVolume = Math.max(checkVolume, 0);
                        // var checkVolumeV2 = Math.ceil((market_value_v2 - form_data.position_ratio * product.runtime.total_assets / 100) / form_data.price / 100) * 100;
                    }
                }

                //等比例调仓的风控校验
                if('assets_ratio' == form_data.trade_number_method){
                    if ('buy' == product.risk_limit_check_request.buy_or_sell) {
                        checkVolume = form_data.assets_ratio * product.runtime.total_assets / 100 / form_data.price ;
                    }else{
                        checkVolume = form_data.assets_ratio * product.runtime.total_assets / 100 / $('.last_price').html() ;
                    }
                }

                //按持仓比例的风控校验
                if('cur_position_ratio' == form_data.trade_number_method){
                    if ('buy' == product.risk_limit_check_request.buy_or_sell) {
                        checkVolume = form_data.cur_position_ratio * total_amount / 100;
                    }else{
                        checkVolume = form_data.cur_position_ratio * total_amount / 100;
                    }
                }

                var obj = riskCheck.checkRules({
                    trading_unit: trading_unit,
                    product_id: product.id,                             // 产品id， id
                    // 交易数据 form_data
                    trade_direction: form_data.trade_direction,         // 交易方向，1买入 2卖出 trade_direction
                    trade_mode: form_data.trade_mode,                   // 1限价／2市价  trade_mode
                    volume: checkVolume,                                // 交易数量
                    price: +form_data.price||0,                         // 限价金额
                    surged_limit: $('.stop_top_price').html(),          // 涨停价 $('.stop_top_price').html()
                    decline_limit: $('.stop_down_price').html(),        // 跌停价 $('.stop_down_price').html()
                    stock_code: form_data.stock_id,                     // 股票code，包含“.SZ”,比较的时候最好都进行小写转换
                    stock_name: $('#stock_name_addon').html(),          // 股票名称，用于判断st股票
                    // 产品的数据 product
                    total_assets: product.runtime.total_assets||0,         // 资产总值 runtime.total_assets
                    enable_cash: product.runtime.enable_cash||0,           // 可用资金 runtime.enable_cash
                    security: all_market_value,                         // 持仓市值 runtime.security 改为 all_market_value
                    net_value: product.runtime.net_value,               // 当日净值 runtime.net_value
                    // 持仓数据
                    market_value: market_value,                         // 本股票持仓市值 //window.position_realtime里面有
                    total_amount: total_amount,                         // 该股票当前持仓数
                    enable_sell_volume: enable_sell_volume,             // 该股票能卖的数量
                    // 其它
                    // time: ''                  // 交易时间

                    // 举牌
                    stock_position_num: stock_position_num, //该产品已持仓该股票数量
                    stock_entrust_num: stock_entrust_num, //该产品已委托该股票数量
                    stock_total_share: stock_total_share, //该股票总股票数量，即总股本

                    // 联合风控：举牌
                    stock_all_position_num: stock_all_position_num, //所有的持仓汇总该股票数量
                    stock_all_entrust_num: stock_all_entrust_num, //所有的委托汇总该股票数量

                    // 对敲
                    stock_entrust_buy_num: stock_entrust_buy_num, //该产品已委托买入数量
                    stock_entrust_sell_num: stock_entrust_sell_num, //该产品已委托卖出数量

                    // 联合风控：对敲
                    stock_all_entrust_buy_num: stock_all_entrust_buy_num, //所有的产品已委托买入数量
                    stock_all_entrust_sell_num: stock_all_entrust_sell_num, //所有的产品已委托卖出数量
                });

                // 规避一个问题
                if ('position_ratio' == form_data.trade_number_method && 'sell' == product.risk_limit_check_request.buy_or_sell) {
                    if (needAlert) {
                        obj.msg = '可卖数量不足';
                        obj.code = 2;
                    }
                }

                // 重新构造一个对象，因为以前是通过调后端接口得到返回值的。为了尽可能少的修改，所以采用接口返回的对象结构。
                var rtn = {
                    code: obj.code,
                    msg: obj.msg,
                    data: {
                        cost_price: cost_price,
                        entrust_buy_money: entrust_buy_money,
                        entrust_sell_money: entrust_sell_money,
                        latest_price: latest_price,
                        buy_limit_msg: obj.msg,           // 已无用
                        buy_max_volume: obj.num,          // 有用，暂时填最大数量
                        limit_msg: obj.msg,               // 提示信息
                        // max_volume: (1== form_data.trade_direction)?obj.freeNum:enable_sell_volume, // 最大可买/卖数量
                        max_volume: (1== form_data.trade_direction)? (Math.floor(obj.num / trading_unit) * trading_unit):enable_sell_volume, // 最大可买/卖数量
                        original_buy_max_volume: Math.floor( ((1== form_data.trade_direction)?obj.freeNum:enable_sell_volume) / trading_unit ) * trading_unit, // 有用，按比例的最大数量
                        // original_buy_max_volume: (1== form_data.trade_direction)?obj.num:enable_sell_volume, // 有用，按比例的最大数量
                        sell_limit_msg: '',               // 已无用
                        position_sell_num: obj.num,
                        sell_max_volume: enable_sell_volume // 有用，暂时填最大数量
                    }
                };

                // risk_limit_check_request 记住这个变量，与risk_limit_check_response对应更好理解
                product.risk_limit_check_response = rtn;
                // oms3.10.0 风控接口返回的数据全部传进去
                product.riskObj = obj;
                product.predict = getPredictData(product);
                row.reRender();
            });

            function formDataIsOk(){
                if( !form_data ){return false;}//没有表单数据
                // 之前是判断在按比例交易的情况下并没有制定比率。现在要判断的是资产比例和调仓到
                if( $.pullValue(form_data, 'trade_number_method') == 'assets_ratio' && !$.pullValue(form_data, 'assets_ratio') ){
                  return false;
                }
                if( $.pullValue(form_data, 'trade_number_method') == 'position_ratio' && !$.pullValue(form_data, 'position_ratio') ){
                  return false;
                }
                if( $.pullValue(form_data, 'trade_number_method') == 'cur_position_ratio' && !$.pullValue(form_data, 'cur_position_ratio') ){
                  return false;
                }

                // if( $.pullValue(form_data,'trade_number_method')=='rate' && !$.pullValue(form_data,'rate') ){return false;}//按比率交易但是没有指定比率
                return true;
            }

            // 获取预算数据
            function getPredictData(product){
                // //获取特定产品的特定股票持仓数据。但是，这个数据赋值给predict后，马上就被前端风控的值给替换了。所以并没有什么用
                // var product_stock_position = getProductStockPosition(product,trade_5_stock);

                var predict = {
                    max_volume: product.risk_limit_check_response.data.max_volume,
                    entrust_price: 0,
                    entrust_volume: 0,

                    security: 0,
                    balance_amount: 0,
                    position: 0,

                    original_buy_max_volume: 0,
                    max_buy_volume: 0,
                    // //获取特定产品的特定股票持仓数据。但是，这个数据赋值给predict后，马上就被前端风控的值给替换了。所以并没有什么用
                    // max_sell_volume: $.pullValue(product_stock_position,'enable_sell_volume',0),
                    free_money: $.pullValue(product,'runtime.balance_amount',0),
                    //添加账户总额
                    total_money: $.pullValue(product,'runtime.total_assets',0),
                };

                //################## 搞定价格和数量 #################
                if(form_data.trade_mode==1){//限价
                    predict.entrust_price = form_data.price;
                }
                if(form_data.trade_mode==2){//市价
                    //修改市价时的计算逻辑，买入时取涨停价，卖出时取跌停价。
                    if ('1' == form_data.trade_direction) {
                        predict.entrust_price = $.pullValue(trade_5_stock, 'stop_top');
                    }else{
                        predict.entrust_price = $.pullValue(trade_5_stock, 'stop_down');
                    }
                }

                // 这里取出前端风控计算后的数据。
                predict.original_buy_max_volume = +$.pullValue(product.risk_limit_check_response,'data.original_buy_max_volume',0);
                predict.max_buy_volume = +$.pullValue(product.risk_limit_check_response,'data.buy_max_volume',0);
                predict.max_sell_volume = +$.pullValue(product.risk_limit_check_response,'data.sell_max_volume',0);

                // // 此处的按比例下单需要修改，支持按总资产和调仓到
                // if(form_data.trade_number_method=='assets_ratio'){//按总资产
                //     if(form_data.trade_direction == '1'){//买单
                //         // 总资产product.runtime.total_assets * 比例form_data.assets_ratio
                //         // 按总资产计算出数量，再与风控最大购买值比较取较小值。
                //         var tmpVolume = Math.min(product.runtime.total_assets * form_data.assets_ratio / 100 / predict.entrust_price, predict.original_buy_max_volume);
                //         // predict.entrust_volume = predict.original_buy_max_volume * form_data.assets_ratio/100;
                //         predict.entrust_volume = Math.floor(tmpVolume/trading_unit)*trading_unit;
                //         // 下载这个判断在与predict.original_buy_max_volume比较取较小值之后，已经不需要了
                //         // if( predict.entrust_volume*predict.entrust_price>predict.free_money ){
                //         //     predict.entrust_volume-=100;
                //         // }
                //         predict.assets_ratio = form_data.assets_ratio
                //     }

                //     if(form_data.trade_direction == '2'){//卖单
                //         // var tmpVolume = Math.min(product.runtime.total_assets * form_data.assets_ratio / 100 / predict.entrust_price, predict.max_sell_volume);
                //         var tmpVolume = Math.min(predict.max_sell_volume * form_data.assets_ratio / 100/predict.entrust_price, predict.max_sell_volume);
                //         predict.entrust_volume = tmpVolume;
                //         // predict.entrust_volume = predict.max_sell_volume * form_data.assets_ratio/100;
                //         if(predict.entrust_volume!=predict.max_sell_volume){
                //             predict.entrust_volume = Math.floor(predict.entrust_volume/trading_unit)*trading_unit;
                //         }
                //         // predict.entrust_volume = Math.min(predict.entrust_volume,predict.max_sell_volume);
                //         //添加目标仓位
                //         predict.assets_ratio = form_data.assets_ratio
                //     }
                // }

                var market_value = 0;
                var total_amount = 0;
                window.risk_position[product.id].data.forEach(function(el){
                    if (el.stock_id == form_data.stock_id) {
                        total_amount = el.total_amount;
                        market_value = el.market_value;
                    }
                });

                // if(form_data.trade_number_method=='position_ratio'){//按调仓到
                //     if(form_data.trade_direction == '1'){//买单
                //         // 数量 = （仓位 * 总资产 - 已持仓市值 - 已委托金额（市价则用涨跌停）） ／ 价格
                //         var tmpVolume = (product.runtime.total_assets * form_data.position_ratio / 100 - market_value) / predict.entrust_price;
                //         // predict.entrust_volume = predict.original_buy_max_volume * form_data.position_ratio/100;
                //         predict.entrust_volume = Math.max( Math.min( Math.floor(tmpVolume/100)*100, predict.original_buy_max_volume ), 0 );
                //         // 下载这个判断在与predict.original_buy_max_volume比较取较小值之后，已经不需要了
                //         // if( predict.entrust_volume*predict.entrust_price>predict.free_money ){
                //         //     predict.entrust_volume-=100;
                //         // }
                //     }
                //     if(form_data.trade_direction == '2'){//卖单
                //         // 数量 = （已持仓市值 - 已委托金额（市价则用涨跌停） - 仓位 * 总资产） ／ 价格
                //         // 同时比较最大可卖
                //         // sell_max_volume * price +
                //         var stock_num = 0;
                //         var tmp_market_price = 0;
                //         window.position_realtime.forEach(function(e){
                //           if(e.stock_id == form_data.stock_id && product.id == e.product_id){
                //             stock_num += +e.enable_sell_volume;
                //             stock_num += +e.today_buy_volume || 0;
                //             tmp_market_price = e.market_price;
                //           }
                //         })
                //         var tmp_market_value = stock_num * tmp_market_price;

                //         var tmpVolume = (tmp_market_value - product.runtime.total_assets * form_data.position_ratio / 100) / predict.entrust_price;
                //         predict.entrust_volume = Math.min(tmpVolume, predict.max_sell_volume);
                //         // predict.entrust_volume = predict.max_sell_volume * form_data.position_ratio/100;
                //         if(predict.entrust_volume!=predict.max_sell_volume){
                //             // 这里向上取整，为的是使持仓比例不超过用户所写的比例
                //             predict.entrust_volume = Math.ceil(predict.entrust_volume/100)*100;
                //         }
                //         // predict.entrust_volume = Math.min(predict.entrust_volume,predict.max_sell_volume);
                //     }
                // }

                // if(form_data.trade_number_method=='volume'){//按数量下单
                //     if(form_data.trade_direction == '1'){//买单
                //         predict.max_buy_volume = Math.floor(predict.max_buy_volume/trading_unit)*trading_unit;
                //         predict.entrust_volume = (+form_data.volume||0);
                //         predict.entrust_volume = Math.round(predict.entrust_volume/trading_unit)*trading_unit;
                //         predict.entrust_volume = Math.min(predict.max_buy_volume,predict.entrust_volume);
                //     }

                //     if(form_data.trade_direction == '2'){//卖单
                //         predict.entrust_volume = (+form_data.volume||0);
                //         predict.entrust_volume = Math.min(predict.entrust_volume,predict.max_sell_volume);
                //         if(predict.entrust_volume!=predict.max_sell_volume){
                //             predict.entrust_volume = Math.round(predict.entrust_volume/trading_unit)*trading_unit;
                //         }
                //         predict.entrust_volume = Math.min(predict.entrust_volume,predict.max_sell_volume);
                //     }
                //     predict.volume = form_data.volume

                // }

                // //交易数量不能大于限值
                // predict.entrust_volume = Math.min( +$.pullValue(product.risk_limit_check_response,'data.max_volume',0), predict.entrust_volume );
                // //交易数量不能小于零
                // predict.entrust_volume = Math.max( predict.entrust_volume, 0 );


                // 3.11版本，预算功能不过风控了，因为预览也不过风控了。
                // 从以前的代码来看，这里只需要传入参数：predict.entrust_volume
                if ('volume' == form_data.trade_number_method) {
                    // 按绝对数量
                    if ('1' == form_data.trade_direction) {
                        predict.entrust_volume = (+form_data.volume||0);
                        predict.entrust_volume = Math.floor(predict.entrust_volume / trading_unit) * trading_unit;
                    }else if('2' == form_data.trade_direction){
                        predict.entrust_volume = (+form_data.volume||0);
                    }
                }else if('assets_ratio' == form_data.trade_number_method){
                    // 按总资产比例
                    if ('1' == form_data.trade_direction) {
                        predict.entrust_volume = Math.floor((+form_data.assets_ratio||0) * product.runtime.total_assets / 100 / predict.entrust_price / trading_unit) * trading_unit;
                    }else if('2' == form_data.trade_direction){
                        predict.entrust_volume = Math.floor((+form_data.assets_ratio||0) * product.runtime.total_assets / 100 / predict.entrust_price);
                    }
                }else if('position_ratio' == form_data.trade_number_method){
                    // 按目标仓位
                    if ('1' == form_data.trade_direction) {
                        predict.entrust_volume = Math.floor((+form_data.position_ratio||0) * product.runtime.total_assets / 100 / predict.entrust_price / trading_unit) * trading_unit - total_amount;
                    }else if('2' == form_data.trade_direction){
                        predict.entrust_volume = Math.floor((+form_data.position_ratio||0) * product.runtime.total_assets / 100 / predict.entrust_price) - total_amount;
                    }
                }else if('cur_position_ratio' == form_data.trade_number_method){
                    // 按当前持仓比例
                    if ('1' == form_data.trade_direction) {
                        predict.entrust_volume = Math.floor((+form_data.cur_position_ratio||0) * total_amount / 100 / trading_unit) * trading_unit;
                    }else if('2' == form_data.trade_direction){
                        predict.entrust_volume = Math.floor((+form_data.cur_position_ratio||0) * total_amount / 100);
                    }
                }

                calculatePredictResult(predict, product);

                return predict;
            }

            // 计算估算结果
            function calculatePredictResult(predict, product){
                predict.diff_balance_money = predict.entrust_volume*predict.entrust_price*(form_data.trade_direction=='1'?-1:1);//买为负，卖为正

                //################## 核心数据计算 #################
                predict.balance_amount = (+product.runtime.balance_amount) + predict.diff_balance_money;
                predict.enable_cash = (+product.runtime.enable_cash) + predict.diff_balance_money;
                predict.security = (+product.runtime.security) - predict.diff_balance_money;
                predict.position = product.runtime.total_assets ? predict.security/product.runtime.total_assets : 0;

                //################## 当前股票持仓变动预估 #################
                product.stock_position = $.extend({
                    total_amount: 0,
                    weight: 0
                },getProductStockPosition(product,trade_5_stock));

                var diff_volume = predict.entrust_volume*(product.risk_limit_check_request.buy_or_sell=='buy' ? 1 : -1);
                var diff_weight = product.runtime.total_assets ? diff_volume*predict.entrust_price/product.runtime.total_assets : 0;
                var predict_total_amount = Number(product.stock_position.total_amount) + Number(diff_volume);
                var predict_weight = Number(product.stock_position.weight) + Number(diff_weight);

                predict.stock_position = {
                    total_amount: predict_total_amount,
                    weight: predict_weight
                }
            }
        }

        function tryTriggerUpdateNotice(){
            clearTimeout(last_trigger_timeout)
            last_trigger_timeout = setTimeout(triggerUpdateNotice,100);
        }

        // 获取运行时数据
        function loadRuntimeInfo(){
            if (0 == product_ids.length) {
                return;
            }
            me.addClass('loading');
            var url = (window.REQUEST_PREFIX||'')+'/oms/api/get_multi_settlement_info';

            var last_loading_timestamp = new Date().valueOf();
            me.attr('last_loading_timestamp',last_loading_timestamp);

            $.get(url,{
                product_id: product_ids,
                unuse_cache: unuse_cache ? (unuse_cache=0,1) : 0 //使用 unuse_cache 并重置为 0
            }).done(function(res){
                if(last_loading_timestamp!=me.attr('last_loading_timestamp')){return;}
                if(res.code==0){
                    //合并数据
                    product_list.forEach(function(product){
                        product.runtime = product.runtime || {};
                        //采用合并老数据的方式，防止没有数据导致整行空白的问题
                        $.extend(product.runtime, $.pullValue(res,'data.'+product.id+'.data'));
                        // if (product.runtime.estimate) {
                        //     product.runtime.net_value = product.runtime.estimate.net_value;
                        //     product.runtime.position = product.runtime.estimate.position;
                        //     product.runtime.total_assets = product.runtime.estimate.total_assets;
                        // }

                        // 3.11版本修改，机构版将net_assets赋值到total_assets,为了解决含义变化的问题
                        if (3 != orginfo_theme) {
                            product.runtime.total_assets = product.runtime.net_assets;
                        }
                    });
                    updateProductListAfterRuntimeReady();
                }

                res.code!=0 && $.failNotice(url,res,'M101');

                res.code==0 && me.attr('last_updated_timestamp',(res.timestamp||0));
            }).fail($.failNotice.bind(null,url,'M100')).always(function(){
                if(last_loading_timestamp!=me.attr('last_loading_timestamp')){return;}
                me.removeClass('loading');
            });
        }

        // 获取风控规则
        function loadRiskRulesInfo(callback){
            riskCheck.getRulesData(product_ids, callback);
        }
        // 获取股票池
        function loadStockPoolInfo(callback){
            riskCheck.getStockPoolData(callback);
        }
        // 获取费用规则
        function loadFeeRulesInfo(callback){
            riskCheck.getFeeData(product_ids, callback);
        }
        // 首次渲染产品列表
        function renderProductListFirst(){
            me.renderTable(product_list);
            head_checkbox.prop('checked',false).change(); //首次全部不选中
            // 首次只有一个组合时，默认选中
            if (1 == $('input[type=checkbox].product-checkbox').length) {
                $('input[type=checkbox].product-checkbox').prop('checked',true).change();
            }
        }
        // 重置产品列表
        function resetProductList(){
            product_list.forEach && product_list.forEach(function(product){
                product.risk_limit_check_request = product.risk_limit_check_response = product.predict = product.stock_position = null;
            });
            updateProductList();
        }

        // 未找到调用该函数的地方，评估已无用处
        // function resetUncheckedRows(){
        //     product_list.forEach && product_list.forEach(function(product){
        //         if(product.checked){return;}
        //         product.risk_limit_check_request = product.risk_limit_check_response = product.predict = null;
        //     });
        //     updateProductList();
        // }

        // 更新产品列表（在获取运行时数据之后）
        function updateProductListAfterRuntimeReady(needRefresh){
            updateProductList(needRefresh);
            me.find('.loading-loading').removeClass('loading');
        }

        // 更新产品列表
        function updateProductList(needRefresh){
            //新增代码，遍历取出其中left_running_day为0-2的数据
            var tmpArr = [];
            me.find('[rows-body] tr').each(function(){
                var row = $(this);

                var data = row.getCoreData();
                data.market = market;
                tmpArr.push(data);
                // 空仓下的总可用资金
                if (!data.runtime) {return}
                var obj = riskCheck.getPositionInfo({
                    total_assets: data.runtime.total_assets,
                    net_value: data.runtime.net_value,
                    product_id: data.id
                });

                if(data.positionInfo !== JSON.stringify(obj) || needRefresh == true){
                    data.positionInfo = JSON.stringify(obj);
                    row.render(data);
                }
            });

            //tmpArr.name
            //tmpArr.left_running_day
            //tmpArr.left_buy_day
            //tmpArr.clearance_day
            if (0 < tmpArr.length) {
                if (true == utils.deadline.needDisplay()) {
                    // forbidden_interval = true;

                    var trStr = '';
                    tmpArr.forEach(function(e){
                        //额外新增一个条件，剩余交易天数为0，不加入展示
                        if (e.is_forever != 1 && e.left_buy_day <= 2 && e.left_buy_day >= 0 && e.left_running_day != 0) {
                            trStr += '<tr class="alert_tr" data-product_id="'+e.product_id+'" style="border-bottom: 1px solid #E2E2E2;">' +
                                '<td style="display:table-cell;font-size: 12px;padding-top: 6px;padding-bottom: 6px;padding-left: 10px;" class="cell-left">'+ e.name +'</td>' +
                                '<td style="display:table-cell;font-size: 12px;padding-top: 6px;padding-bottom: 6px;padding-left: 10px;text-align:center;" class="cell-right">'+
                                ((0 == Number(e.left_buy_day)) ? ('<span style="color:#F44336">0</span>') : (e.left_buy_day)) +
                                '</td>' +
                                '<td style="display:table-cell;font-size: 12px;padding-top: 6px;padding-bottom: 6px;padding-left: 10px;" class="cell-left">'+ e.clearance_day +'</td>' +
                            '</tr>';
                        }
                    });
                    if ('' !== trStr && 3 == window.LOGIN_INFO.org_info.theme) {
                        utils.deadline.setNeedDisplay(false);
                        var tableStr = '<p>以下策略即将到期，为确保策略按计划回款，平台将在最后清仓日期任意时段对未主动清仓的策略进行清仓操作，请提前主动清仓</p>'+
                        '<table class="oms-table" style="max-height:500px;overflow-y:auto;width:100%;margin-top:12px;">' +
                            '<tr rows-head>' +
                                '<th style="display:table-cell;font-size: 12px;padding-left: 10px;text-align: left;">'+ (3 == orginfo_theme ? '产品单元' : '交易单元') +'</th>' +
                                '<th style="display:table-cell;display:table-cell;font-size: 12px;padding-left: 10px;text-align: center;">剩余可买天数</th>' +
                                '<th style="display:table-cell;font-size: 12px;padding-left: 10px;text-align: left;">最后清仓日期</th>' +
                            '</tr>' +
                            '<tbody rows-body>'+ trStr +'</tbody>' +
                        '</table>'+
                        '<p style="margin-top: 10px;color: #F44336;">*最后清仓日期将限制不可买入</p>';
                        $.confirm({
                            title: '到期提醒',
                            content: tableStr,
                            closeIcon: true,
                            confirmButton: false,
                            cancelButton: '确定',
                            cancel: function(){
                                // forbidden_interval = false;
                            }
                        });
                    }
                }
            }
        }

        // 通过事件告知其他模块，选中产品被修改了。
        function triggerUpdateNotice(){
            var checked_count = 0;
            var last_checked_product;
            product_list.forEach(function(product){
                if(product.checked){
                    checked_count++;
                    last_checked_product = product;
                }
            });

            $(window).trigger({
                type: 'multi_products:head:updated',
                product_list: product_list,
                checked_count: checked_count
            });

            if(checked_count == 1){
                $(window).trigger({
                    type: 'multi_products:head:updated:checked_one',
                    product: last_checked_product
                });
                return;
            }

            $(window).trigger('multi_products:head:updated:checked_notone');

            if(checked_count == 0){
                $(window).trigger({
                    type: 'multi_products:head:updated:checked_nothing'
                });
                return;
            }

            $(window).trigger({
                type: 'multi_products:head:updated:checked_multi',
                product_list: product_list
            });
        }

        // 自动预算更新
        function setAutoPredictTotalInfo(){
            var timer;
            me.on('rendered change',function(){
                clearTimeout(timer);
                timer = setTimeout(trigger,100);
            });
        }
        // 将估算的数据传给其他模块。（而触发条件则是表格的“rendered change”事件）
        function trigger(){
            var total_entrust_volume = 0;
            var warning_count = 0;
            var detail_arr = [];

            product_list.forEach(function(product){
                total_entrust_volume += product.checked ? $.pullValue(product,'predict.entrust_volume',0) : 0;
                warning_count += product.checked ? (
                    $.pullValue(product,'risk_limit_check_request.volume',0) > $.pullValue(product,'risk_limit_check_response.data.max_volume',0)
                    ? 1
                    : 0
                ) : 0;
                var obj = {};
                obj.name = product.name;
                var total_amount = 0;
                var total_weight = 0;
                var entrust_buy_num = 0;
                var entrust_sell_num = 0;
                if (product.checked && product.risk_limit_check_request) {

                    window.position_realtime.forEach(function(e){
                        if (e.stock_id === product.risk_limit_check_request.stock_id && e.product_id == product.id) {
                            // enable_sell_volume = e.enable_sell_volume;
                            obj.entrust_volume = e.entrust_volume;
                            total_amount = e.total_amount;
                            total_weight = e.weight;
                        }
                    });

                    window.risk_position[product.id].data.forEach(function(el){
                        if (el.stock_id == product.risk_limit_check_request.stock_id) {
                            // total_amount = el.total_amount;
                        }
                    });

                    // 需要过滤全部成交5、已撤单7、部分成交4、废单8、已删除9。
                    // 需要注意，有两种情况都是部分成交，还需要判断字段get_deal_list
                    window.entrust_info.forEach(function(el){
                        if (el.stock.code == product.risk_limit_check_request.stock_id && el.product_id == product.id && 
                            (![4, 5, 7, 8, 9].some(function(ele){
                                return el.status == ele;
                            }) || (el.status == 4 && !/1|2/.test( el.cancel_status )))
                        ) {
                            if ('buy' == product.risk_limit_check_request.buy_or_sell && 1 == el.entrust.type) {
                                entrust_buy_num += el.entrust.amount - el.deal.amount;
                            }else if ('sell' == product.risk_limit_check_request.buy_or_sell && 2 == el.entrust.type){
                                entrust_sell_num += el.entrust.amount - el.deal.amount;
                            }
                        }
                    })

                    obj.entrust_buy_num = entrust_buy_num;
                    obj.entrust_sell_num = entrust_sell_num;

                    // 当前持仓数量
                    obj.total_amount = total_amount;
                    // 当前持仓比例
                    obj.position = product.position;
                    obj.weight = total_weight;

                    // 3.8.0版本，额外传数据：risk_limit_check_request、risk_limit_check_response、predict
                    // 3.8.0版本去掉了产品列表的一些字段，我们可以理解为挪到了新的地方显示。
                    obj.risk_limit_check_request = $.pullValue(product,'risk_limit_check_request', {});
                    obj.risk_limit_check_response = $.pullValue(product,'risk_limit_check_response', {});
                    obj.predict = $.pullValue(product,'predict', {});
                    obj.runtime = $.pullValue(product,'runtime', {});

                    // oms3.10.0 风控数据直接传到后面使用
                    obj.riskObj = $.pullValue(product,'riskObj', {});

                    detail_arr.push(obj);
                }
            });

            if (window.PRODUCTS.length > 0) {
                var trading_unit = 100;
                if (trade_5_stock) {
                    trading_unit = trade_5_stock.trading_unit;
                }
                
                $(window).trigger({
                    type:'multi_products:head:predict', //告知下单模块可交易数额预估 //新增下单预览页面也会监听predict事件，但是由于需要显示详细信息，所以新增detail_arr
                    predict: {
                        trading_unit: trading_unit,
                        total_entrust_volume: total_entrust_volume,
                        trade_direction: form_data ? form_data.trade_direction : NaN,
                        warning_count: warning_count,
                        detail_arr: detail_arr,
                        asset_class:form_data ?(form_data.asset_class || 0) : 0
                    }
                });
            }
            
        }

        function toggleWarning(state){
            //toggle
            me.find('.dot-tip.risk_limit_check_dot').toggleClass('hover',state);//单股票下单页面，当底部提示不能按照用户所期望购买时，显示问号按钮，用户点击该按钮，产品列表需要显示原因。
        }

        // 获取特定产品的特定股票持仓数据
        function getProductStockPosition(product,stock){
            return positions.filter(function(position){
                return position.product_id == product.id && position.stock_id == stock.stock_id;
            })[0];
        }
    }).call(document.scripts[document.scripts.length-1].parentNode);
    </script>
</section>
