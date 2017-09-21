<?php
use App\Services\OMS\Workflow\OMSWorkflowEntrustService;
?>
<link href="{{ asset('/css/selectize.min.css') }}" rel="stylesheet">
<link href="{{ asset('/js/jquery-confirm/jquery-confirm.min.css') }}" rel="stylesheet">
<style>
    .selectize-control{
        height: 40px;
    }
    .selectize-input{
        padding: 0 10px;
        border-radius: 3px;
        line-height: 40px;
        height: 40px;
        font-size: 14px;
        color: #000000;
        font-weight: normal;
    }
    .custon_option{
        position: relative;
        font-weight: normal;
        font-size: 13px;
        color: #595959;
    }
    .custon_option>span.default{
        display: none;

    }
    .custon_option>span.set_default{
        display: none;
        position: absolute;
        right: 5px;
        font-size: 10px;
        color: #2196F3;
        font-weight: normal;
        cursor: pointer;
    }
    .custon_option:hover>span.set_default{
        display: inline;
        /*display: block;
        top: 8px;*/
    }
    .custon_option.default:hover>span.set_default{
        display: none;
    }
    .custon_option.default>span.default{
        display: inline-block;
        position: absolute;
        right: 5px;
        font-size: 10px;
        color: #2196F3;
        font-weight: normal;
        cursor: pointer;
    }
    .custon_option.default>span.set_default{
        display: none;
    }

    .jconfirm-box-container{
        margin-left: 33%;
        width: 670px;
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
<script src="{{ asset('/js/jquery-confirm/jquery-confirm.min.js') }}"></script>
{{-- <script type="text/javascript" src="{{ asset('/js/selectize.min.js') }}"></script> --}}
<script type="text/javascript" src="{{ asset('/js/plugin/selectize/js/standalone/selectize.js') }}"></script>
<div class="section-panel create-order">
    <div class="oms-popup popup-create-order" id="popup-create-order">
        <form class="popup-bd create-order-form" id="create_order_form" autocomplete="off">
            <div class="content-bd">
                <div class="field first-field">
                    <label>股票代码</label>
                    <div class="content stock-code">
                        <input id="stock_code" type="text" autocomplete="off"
                            name="stock_code" pattern="^\d{6}\.(SZ|SH)$" placeholder="请输入股票代码或拼音"
                            focus-class="active" active-slide="#magic-suggest" comment="#magic-suggest 定义在 oms.filters 中..."
                        >
                        <div class="magic-suggest-wrap" data-src="|getMagicSuggest"></div>
                        <span class="stock-name" id="stock_name_addon"></span>
                    </div>
                </div>
                <div class="field">
                    <label>报价方式</label>
                    <div class="content">
                        <label class="active order_model-ctrl order_model_limit_price" click-active=".order_model_limit_price">
                            限价<input class="sr-only change-checkrisk-last" type="radio" checked="checked" name="trade_mode" value="{{OMSWorkflowEntrustService::ORDER_MODEL_LIMIT_PRICE}}">
                            <i class="oms-icon right"></i>
                        </label>
                        <label class="order_model-ctrl order_model_market_price" click-active=".order_model_market_price">
                            市价<input class="sr-only change-checkrisk-last" type="radio" name="trade_mode" value="{{OMSWorkflowEntrustService::ORDER_MODEL_MARKET_PRICE}}">
                            <i class="oms-icon right"></i>
                        </label>
                    </div>
                </div>
                <div class="field" style="display:none;">
                    <label>买卖方向</label>
                    <div class="content">
                        <label class="active direction-ctrl buy" click-active="_self">
                            买入<input class="change-checkrisk-last trade_direction_buy" type="radio" checked="checked" name="trade_direction" value="{{OMSWorkflowEntrustService::ORDER_DIRECTION_BUY}}">
                            <i class="oms-icon right"></i>
                        </label>
                        <label class="direction-ctrl sell" click-active="_self">
                            卖出<input class="change-checkrisk-last trade_direction_sell" type="radio" name="trade_direction" value="{{OMSWorkflowEntrustService::ORDER_DIRECTION_SELL}}">
                            <i class="oms-icon right"></i>
                        </label>
                    </div>
                </div>
                <div>
                    <div class="active-show order_model_limit_price">
                    </div>
                    {{-- 市价 不使用价格输入控制 --}}
                    <div class="active-show order_model_market_price">
                        <div class="field">
                            <label>委托方式</label>
                            <div class="content">
                                <select id="custom-select" placeholder="请输入股票代码">
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    {{-- 限价才展示 使用价格输入控制 --}}
                    <div class="active-show order_model_limit_price active">
                        <div class="field">
                            <label>价格</label>
                            <div class="content">
                                <input class="plus-input change-checkrisk-last" type="text" id="val_price" name="price"
                                    pattern="^\d*\.?\d+$" limit-rule="positive" limit-words="必须大于 0" placeholder="请输入股票价格">
                                <div class="plus-ctrls">
                                    <span class="plus-ctrl" click-value="#val_price:+.01"><i>+</i><br/>0.01</span>
                                    <span class="plus-ctrl" click-value="#val_price:-.01"><i>-</i><br/>0.01</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    {{-- 市价 不使用价格输入控制 --}}
                    <div class="active-show order_model_market_price">
                        <div class="field">
                            <label>价格</label>
                            <div class="content">
                                <input class="plus-input" type="text" placeholder="市价" value="市价" disabled readonly>
                                <div class="plus-ctrls">
                                    <span class="plus-ctrl disabled"><i>+</i><br/>0.01</span>
                                    <span class="plus-ctrl disabled"><i>-</i><br/>0.01</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="field">
                    <label>数量</label>
                    <div class="content">
                        <input class="plus-input change-checkrisk-last" type="text" id="val_volume" name="volume"
                            pattern="^[1-9]+\d*$" limit-rule="positive" limit-words="必须大于 0" placeholder="请输入交易数量">
                        <div class="percent-ctrls" id="percent_ctrls">
                            <span click-trigger-msg="set_order_val_volume:1/3">1/3</span>
                            <span click-trigger-msg="set_order_val_volume:1/2">1/2</span>
                            <span click-trigger-msg="set_order_val_volume:1">全部</span>
                        </div>
                        <div class="plus-ctrls">
                            <span class="plus-ctrl" click-value="#val_volume:+100"><i>+</i><br/><span>100</span></span>
                            <span class="plus-ctrl" click-value="#val_volume:-100"><i>-</i><br/><span>100</span></span>
                        </div>
                    </div>
                </div>
                <div class="field risk-pre">
                    <center class="content risk-info-pre" id="riskInfoPre">
                        {{-- 可用资金 <span data-src="balance_amount|getBalanceAmount|numFormat:0,0.00">--</span> --}}
                        预计最大可买 <span class="blue"><span data-src="buy_max_volume|numFormat">--</span> 股</span>
                        最大可卖 <span class="yellow"><span data-src="sell_max_volume|numFormat">--</span> 股</span>
                    </center>
                </div>
            </div>

            <div class="content-foot" id="risk2Res">
                <div if="loading" class="submit-wrap">
                    <p class="loading">等待风控检测...</p>
                    <button class="oms-btn disabled" type="submit" disabled="true" submit-direction-relative>提交委托</button>
                </div>
                <div if="loading|isFalse">
                    <div if="code|notNum" class="submit-wrap">
                        <p if="msg" data-src="msg" class="red"></p>
                        <button class="oms-btn disabled" disabled="true" submit-direction-relative>提交委托</button>
                    </div>
                    <div if="code|numNotEqual:0">
                        <div force-submit-permission="cannot">
                            <div class="active-show default-active submit-wrap">
                                <p data-src="msg" class="red resk2-fail-msg"></p>
                                <button class="oms-btn disabled" disabled="true" submit-direction-relative>提交委托</button>
                            </div>
                        </div>
                        <div force-submit-permission="can">
                            <div class="active-show default-active submit-wrap">
                                <p data-src="msg" class="red resk2-fail-msg"></p>
                                <span class="oms-btn red" click-active=".force-inputs">强制委托</span>
                            </div>
                            <div class="force-inputs active-show" id="force-inputs">
                                <p class="red">风控不过时的强制委托需要理由，请输入：</p>
                                <div class="field">
                                    <label>理由</label>
                                    <div class="content">
                                        <input type="text" class="force-append" name="msg" placeholder="请输入强制委托理由" f-pattern="^.{4,}$">
                                    </div>
                                </div>
                                <div class="field">
                                    <label>密码</label>
                                    <div class="content">
                                        <input type="text" class="force-append" name="force_pswd" placeholder="请输入密码"  f-pattern="^.{4,}$">
                                    </div>
                                </div>
                                <input type="checkbox" style="display:none;" name="is_force" value="1">
                                <button class="oms-btn red" submit>确认强制委托</button>
                            </div>
                        </div>
                    </div>
                    <div if="code|numEqual:0" class="resk2-pass submit-wrap">
                        <p class="green">已通过风控预检测</p>
                        <button class="oms-btn" submit submit-direction-relative>提交委托</button>
                    </div>
                </div>
            </div>
        </form>
    </div>
    <script>
    (function(){
        var me = $(this);

        var $select = $('#custom-select').selectize({
            valueField: 'key',
            labelField: 'value',
            render: {
                option: function(item, escape) {
                    // debugger;
                    var label = item.value;
                    var clsStr = '';
                    if (true == item.is_default) {
                        clsStr = 'default';
                    }
                    return '<div class="custon_option '+ clsStr +'">' +
                        '<span class="label">' + escape(label) + '</span>' +
                        '<span class="default">默认</span>' +
                        '<span class="set_default" data-value="'+ item.key +'" data-market="'+ item.market +'">设为默认</span>' +
                    '</div>';
                }
            },
            //这里是修改了selectize的源码后新增的方法，用于在设置了默认的选中项执行。
            onSetDefault: function(e){
                var dst = $(e.currentTarget).attr('data-value');
                var market = $(e.currentTarget).attr('data-market');
                utils.stock_custom.chgMarketData(market, dst);
                var tmpData = utils.stock_custom.getMarketData(market);
                selectize.clearOptions();
                tmpData.forEach(function(e){
                    e.market = market;
                    selectize.addOption(e);
                });
                selectize.setValue(dst);
                ChangeSelectize(market, dst);
            }
        });

        selectize = $select[0].selectize;
        utils.stock_custom.init(LOGIN_INFO.user_id);

        function ChangeSelectize(market, dst){
            $.ajax({
                url: (window.REQUEST_PREFIX||'')+'/oms/helper/default_price_type',
                type: 'post',
                data: {
                    price_type: dst,
                    market_type: market
                },
                success: function(res){
                    // GetSelectize(dst);
                },
                error: function(){
                    $.failNotice('网络异常');
                }
            });
        }

        function GetSelectize(flag){
            var tmpArrSZ = [], tmpArrSH = [];
            $.ajax({
                url: (window.REQUEST_PREFIX||'')+'/oms/helper/price_type_list',
                success: function(res){
                    var tmpId;
                    if (0 == res.code) {
                        tmpArrSZ = res.data['SZ'];
                        tmpArrSH = res.data['SH'];

                        selectize.clearOptions();
                        tmpArrSZ.forEach(function(e){
                            e.market = 'SZ';
                            if ($('#stock_code').val().indexOf('SZ') >= 0) {
                                if (true == !!e.is_default) {
                                    tmpId = e.key;
                                }
                                selectize.addOption(e);
                            }
                        });
                        utils.stock_custom.setMarketData('SZ', tmpArrSZ);

                        tmpArrSH.forEach(function(e){
                            e.market = 'SH';
                            if ($('#stock_code').val().indexOf('SH') >= 0) {
                                if (true == !!e.is_default) {
                                    tmpId = e.key;
                                }
                                selectize.addOption(e);
                            }
                        });
                        utils.stock_custom.setMarketData('SH', tmpArrSH);

                        if (true === flag) {
                            selectize.setValue(tmpId);
                        }
                    }else{
                        $.failNotice(res.msg);
                    }
                },
                error: function(){
                    $.failNotice('网络异常');
                }
            });

        }

        //强制委托权限设置
        var force_submit = (
            $.pullValue(window,'LOGIN_INFO.role_id',[]).some(function(e){
                return e == 12;
            })
            // $.pullValue(window,'LOGIN_INFO.my_permission.0.manger_commander',NaN)   // 交易员 12
            // && $.pullValue(window,'LOGIN_INFO.my_permission.0.manger_executor',NaN) // 交易员 12
        ) ? 'can' : 'cannot';
        me.find('[force-submit-permission]:not([force-submit-permission='+force_submit+'])').remove();

        $(function(){
            //ie keyup but value didn't change bug fix;
            /msie|edge/i.test(navigator.userAgent) && $('input').on('keyup',function(){
                $(this).blur().change().focus();
            });

            /msie|edge/i.test(navigator.userAgent) && $('label').on('click_active',function(){
                $(this).find('input[type=radio]').change();
            });

            me.find('.magic-suggest-wrap').render();


            //判断是否是新股
            function judgeNewStock(stock_code){
                window.new_stock_list.forEach(function(e){
                      // let stock_id = e.stock_id.replace(/\.(SZ|SH)$/i,'')
                    if( stock_code == e.ticker ||stock_code == e.stock_id || stock_code == e.ipo_code){
                        result =  e;
                        result.stock_id = e.ipo_code + '.' +e.stock_id.split('.')[1];
                        result.asset_class = "new"
                    }
                })
                return false;
            }

            $('#stock_code').on('pattern_pass',function(event){
                if( ($(this).attr('last_value') || '').indexOf($(this).val().trim())===0 ){return;}

                var new_value = $(this).val();
                var old_value = $(this).attr('old_value');
                if(new_value==old_value){return;}
                $(this).attr('old_value',new_value);

                setTimeout(function(){
                    $(window).trigger({type:'order_create:stock_code:ready', stock:{
                        stock_name: $('#stock_name_addon').html(),
                        stock_code: $('#stock_code').val().replace(/\.(SZ|SH)$/i,''),
                        stock_id: $('#stock_code').val()
                    }});
                });

                GetSelectize(true);

                // 前置风控检测改位置了
                // checkRiskInfoPre();
            }).on('pattern_stuck',function(){
                var new_value = $(this).val().trim();
                if( new_value.length==6 && ($(this).attr('last_value') || '').indexOf(new_value)===0 ){return;}
                $(this).removeAttr('last_value').removeAttr('old_value');

                me.data('stock_info',{});
                $('#stock_name_addon').html('');
                $(window).trigger({type:'create_order:stock_code:pattern_stuck'});
                checkFormInputsStuck();
                $('#riskInfoPre').render({});
            }).on('stock_code:suggest',function(event){
                var stock = event.stock;
                resetViewByStockType(stock);
                $('#val_price').val('');
                $('#stock_code').val(stock.stock_id).change();
                $('#stock_name_addon').text(stock.stock_name);
                $('#val_price').val('');
            });

            me.find('[name=trade_direction]').on('change',setMaxVolumeValue);
            me.on('change keyup',function(event){
                var input = $(event.target);
                // 前置风控检测改位置了
                if( input.is('[name=price]') || input.is('[name=trade_mode]') ){
                    checkRiskInfoPre(); //检测成功自带 tryCheckRiskBeforeSubmit
                }else if( input.is('[name=volume]') || input.is('.change-checkrisk-last') ){
                    tryCheckRiskBeforeSubmit();
                }
            });

            $('#create_order_form').on('click', '[submit]', tryCreateOrder);

            $(window).on('order_create:by_stock',function(event){
                var form = $('#create_order_form');

                if(event.stock && event.stock.stock_code && event.stock.stock_name){
                    if( event.stock.stock_code != me.find('[name=stock_code]').val() ){
                        reset();
                        form.find('#stock_name_addon').html(event.stock.stock_name);
                        form.find('#stock_code').val(event.stock.stock_code).change();
                        form.find('[name=price]').val('').change();
                        form.find('#val_volume').focus();
                    }
                }else{
                    reset();
                    form.find('#stock_name_addon').html('');
                    form.find('#stock_code').focus();
                    setTimeout(function(){
                        form.find('#stock_code').focus();
                    },500);
                }

                function reset(){
                    //清空数据
                    $('#riskInfoPre').render({});
                    $('#risk2Res').render({msg:'请输入股票代码...'}).find('.active-show').removeClass('active').filter('.default-active').addClass('active');

                    form.find('input:not([type=radio]):not([type=hidden]):not([type=checkbox]):not(.force-append):not(#stock_code)').val('').change();
                    form.find('input.force-append').removeClass('stuck');
                    $('input[name=is_force]').prop('checked',false);
                }
            }).on('order_create:trade_5:updated',function(event){
                me.trigger({type:'stock_info_update',stock:event.stock});
            }).on('order_create:trade_5:updated:first',function(){
                //当前股票第一次更新
                resetDefaultValPrice();
                checkRiskInfoPre();
            }).on('risk_info_pre_start',function(){
                //前置风控开始
                $(window).off('set_order_val_volume');
                $('#percent_ctrls').removeClass('active');
            }).on('risk_info_pre_finish',function(event){
                //前置风控结束
                var risk_info = event.more_data;
                $('#percent_ctrls').addClass('active');
                $(window).on('set_order_val_volume',function(event){
                    var percent = event.more_data[0];
                    var is_sell = $('input.trade_direction_sell').is(':checked');
                    var max_value = $.pullValue(risk_info, (is_sell?'sell':'buy')+'_max_volume', 0);
                    var value = eval(max_value+'*'+percent);
                    value = (is_sell && percent==1) ? (
                        Math.floor(value)
                    ) : (
                        Math.floor(value/100)*100
                    );
                    $('#val_volume').val(value).change();
                });
            }).on('order_create:success',function(){
                me.find('[name=stock_code],[name=volume],[name=price]').val('').removeAttr('last_value').removeAttr('old_value').change();
            }).on('load spa_product_change balance_amount_changed',
                checkRiskInfoPre
            ).on('order_create:direction:changed',function(event){
                var direction = event.direction;

                $('[submit-direction-relative]').text(
                    '提交委' + (direction == 'buy' ? '买' : '卖')
                ).toggleClass('red',direction=='buy')
                .toggleClass('blue',direction=='sell');

            });

            $('#force-inputs').on('click_active',function(){
                $('input[name=is_force]').prop('checked',true);
                $(this).find('input:not([type=checkbox])').val('').change().filter('[name=force_pswd]').attr('type','password');
            });

            //买卖方向变更
            $('.direction-ctrl').on('click_active',function(){
                // $('#val_volume').val('').change(); //前端风控，不清空数量咯
                //getTradeDirection 是通过 表单 serializeArray 来实现的，有一点延迟
                (window.requestAnimationFrame||window.setTimeout)(function(){
                    var direction = getTradeDirection() == '{{OMSWorkflowEntrustService::ORDER_DIRECTION_BUY}}' ? 'buy' : 'sell';
                    $(window).trigger({type:'order_create:direction:changed',direction:direction});
                });
            });

            $('.order_model-ctrl').on('click_active',function(){
                setTimeout(checkFormInputsStuck);
            });

            me.on('stock_info_update',function(event){
                var old_stock = me.data('stock_info');
                me.data('stock_info',event.stock);
                // 前置风控检测改位置了
                // $.pullValue(old_stock,'stock_id',NaN)!=$.pullValue(event,'stock.stock_id',NaN) && checkRiskInfoPre()
            });
        });

        function checkRiskInfoPre(){
            var form = $('#create_order_form');
            $('#riskInfoPre').render({});
            $('#risk2Res').render({msg:'正在检测可买可卖数量...'}).find('.active-show').removeClass('active').filter('.default-active').addClass('active');

            // if( $.pullValue(window,'localStorage.____be_risk_check____',false) ){
            //     return backendRiskInfoPre(); //保留后端前置风控接口
            // }

            cancelLastRiskCheck();
            if( $('#stock_code').hasClass('pass') ){
                resetMaxVolumeValue();
                $('#riskInfoPre').addClass('loading');
                $(window).trigger({type:'risk_info_pre_start'});

                var product = PRODUCT;
                var form_data = {
                    stock_id : form.find('[name=stock_code]').val().trim()
                };
                var market_value = 0;
                var total_amount = 0;
                var enable_sell_volume = 0;
                window.position_realtime.forEach(function(e){
                    if (e.stock_id === form_data.stock_id && e.product_id == product.id) {

                        // market_value = e.market_value;
                        // total_amount = e.total_amount;
                        enable_sell_volume = e.enable_sell_volume;
                    }
                });
                var all_market_value = 0;
                window.risk_position[product.id].data.forEach(function(el){
                    if (el.stock_id == form_data.stock_id) {
                        total_amount = el.total_amount;
                        market_value = el.market_value;
                    }
                    all_market_value += el.market_value;
                });

                // 因为实际使用中既显示了可买数量也显示了可卖数量，所以trade_direction分别为1和2分开执行了。
                var obj = riskCheck.checkRules({
                    product_id: product.id,                             // 产品id， id
                    // 交易数据 form_data
                    trade_direction: getTradeDirection(),               // 交易方向，1买入 2卖出 getTradeDirection()
                    trade_mode: getTradeMode(),                         // 1限价／2市价  trade_mode
                    volume: +$('#val_volume').val()||0,                       // 交易数量
                    price: +$('#val_price').val()||0,                         // 限价金额
                    surged_limit: $('.stop_top_price').html(),          // 涨停价 $('.stop_top_price').html()
                    decline_limit: $('.stop_down_price').html(),        // 跌停价 $('.stop_down_price').html()
                    stock_code: form_data.stock_id,                     // 股票code，包含“.SZ”,比较的时候最好都进行小写转换
                    stock_name: $('#stock_name_addon').html(),          // 股票名称，用于判断st股票
                    // 产品的数据 product
                    total_assets: product.runtime.total_assets,         // 资产总值 runtime.total_assets
                    enable_cash: product.runtime.enable_cash,           // 可用资金 runtime.enable_cash
                    security: all_market_value,                 // 持仓市值 runtime.security 改为 all_market_value
                    net_value: product.runtime.net_value,               // 当日净值 runtime.net_value
                    // 持仓数据
                    market_value: market_value,                         // 本股票持仓市值 //window.position_realtime里面有
                    total_amount: total_amount,                         // 该股票当前持仓数
                    enable_sell_volume: enable_sell_volume              // 该股票能卖的数量
                    // 其它
                    // time: ''                  // 交易时间
                });

                var res = {
                    code: obj.code,
                    msg: obj.msg,
                    data: {
                        buy_limit_msg: obj.msg,                 // 已无用
                        buy_max_volume: obj.freeNum,            // 有用，暂时填最大数量
                        limit_msg: obj.msg,                     // 提示信息
                        max_volume: (1== getTradeDirection())?obj.freeNum:enable_sell_volume, // 最大可买/卖数量
                        original_buy_max_volume: (1== getTradeDirection())?obj.freeNum:enable_sell_volume,       // 有用
                        sell_limit_msg: '',                     // 已无用
                        sell_max_volume: enable_sell_volume     // 有用，暂时填最大数量
                    }
                };
                $('#riskInfoPre').removeClass('loading');
                if(res.code==0){
                    $('#riskInfoPre').render(res.data);
                    setMaxSellBuyVolumeValue(res.data);
                    $(window).trigger({
                        type:'risk_info_pre_finish',
                        more_data: res.data
                    });
                    tryCheckRiskBeforeSubmit(true);
                }else{
                    // $('#riskInfoPre').render({});
                    $('#risk2Res').render({msg:res.msg}).find('.active-show').removeClass('active').filter('.default-active').addClass('active');
                    // $('#riskInfoPre').render({
                    //     code: obj.code,//obj.num>0 ? 0 : 101,
                    //     msg: res.msg,
                    //     warning_count: 1
                    // });
                    // $.omsAlert('风控信息拉取失败：' + (res.msg||':('),false);
                }
            }else{
                checkFormInputsStuck();
            }
        }

        function tryCheckRiskBeforeSubmit(force){
            var form = $('#create_order_form');

            if($('#riskInfoPre').is('.loading')){return;}
            checkFormInputsStuck();

            //没有数据变更的时候，不发送请求
            var new_serialize_str = form.serialize().replace(/\&(is_force|msg|force_pswd)\=[^\&]*/g,'');
            //增加 force 参数，强制重复检测
            if( !force && new_serialize_str===form.attr('last-serialize') ){return;}
            form.attr( 'last-serialize', new_serialize_str );

            var data = form.serialize().replace('stock_code','stock_id');
            data = isMarketPriceOrder() ? data.replace(/\&price\=[^\&]*/,'') : data;

            cancelLastRiskCheck();

            var stuck_inputs = getStuckInputs();

            if(!stuck_inputs.length){
                riskCheckFn();
            }

            checkFormInputsStuck();

            function riskCheckFn(){
                $('#risk2Res').render({loading:true}).find('.active-show').removeClass('active').filter('.default-active').addClass('active');
                $('input[name=is_force]').prop('checked',false);

                var risk_before_submit_loading_timestamp = new Date().valueOf();
                me.attr('risk_before_submit_loading_timestamp',risk_before_submit_loading_timestamp);

                // if( $.pullValue(window,'localStorage.____be_risk_check____',false) ){
                //     return backEndAjaxRiskCheck(); //保留后端风控检测接口
                // }

                // 新的前端风控
                var product = PRODUCT;
                var form_data = {
                    stock_id : form.find('[name=stock_code]').val().trim()
                };
                var market_value = 0;
                var total_amount = 0;
                var enable_sell_volume = 0;
                window.position_realtime.forEach(function(e){
                    if (e.stock_id === form_data.stock_id && e.product_id == product.id) {

                        // market_value = e.market_value;
                        // total_amount = e.total_amount;
                        enable_sell_volume = e.enable_sell_volume;
                    }
                });
                var all_market_value = 0;
                window.risk_position[product.id].data.forEach(function(el){
                    if (el.stock_id == form_data.stock_id) {
                        total_amount = el.total_amount;
                        market_value = el.market_value;
                    }
                    all_market_value += el.market_value;
                });
                var obj = riskCheck.checkRules({
                    product_id: product.id,                             // 产品id， id
                    // 交易数据 form_data
                    trade_direction: getTradeDirection(),               // 交易方向，1买入 2卖出 trade_direction
                    trade_mode: getTradeMode(),                         // 1限价／2市价  trade_mode
                    volume: +$('#val_volume').val()||0,                       // 交易数量
                    price: +$('#val_price').val()||0,                         // 限价金额
                    surged_limit: $('.stop_top_price').html(),          // 涨停价 $('.stop_top_price').html()
                    decline_limit: $('.stop_down_price').html(),        // 跌停价 $('.stop_down_price').html()
                    stock_code: form_data.stock_id,                     // 股票code，包含“.SZ”,比较的时候最好都进行小写转换
                    stock_name: $('#stock_name_addon').html(),          // 股票名称，用于判断st股票
                    // 产品的数据 product
                    total_assets: product.runtime.total_assets,         // 资产总值 runtime.total_assets
                    enable_cash: product.runtime.enable_cash,           // 可用资金 runtime.enable_cash
                    security: all_market_value,                 // 持仓市值 runtime.security 改为 all_market_value
                    net_value: product.runtime.net_value,               // 当日净值 runtime.net_value
                    // 持仓数据
                    market_value: market_value,                         // 本股票持仓市值 //window.position_realtime里面有
                    total_amount: total_amount,                         // 该股票当前持仓数
                    enable_sell_volume: enable_sell_volume              // 该股票能卖的数量
                    // 其它
                    // time: ''                  // 交易时间
                });

                var res = {
                    code: obj.code,
                    msg: obj.msg,
                    data: {
                        buy_limit_msg: obj.msg,           // 已无用
                        buy_max_volume: obj.num,          // 有用，暂时填最大数量
                        limit_msg: obj.msg,               // 提示信息
                        max_volume: obj.num,              // 最大可买
                        // original_buy_max_volume: obj.freeNum, // 有用
                        original_buy_max_volume: (1== getTradeDirection())?obj.freeNum:enable_sell_volume, // 有用
                        sell_limit_msg: '',               // 已无用
                        sell_max_volume: obj.num          // 有用，暂时填最大数量
                    }
                };

                $('#riskInfoPre').removeClass('loading');
                if(risk_before_submit_loading_timestamp!=me.attr('risk_before_submit_loading_timestamp')){return;}

                //增加整手提示
                var msg = getSellMaxVolumeError();
                if(msg){
                    $('#risk2Res').render({msg:msg});
                }else{
                    $('#risk2Res').render(res);
                }

                res.code == 0 && $('#is_force').prop('checked') && $('#is_force').click();

                // tradeRiskLimitCheck({
                //     stock_id: form.find('[name=stock_code]').val().trim(),
                //     product_id: PRODUCT.id,
                //     buy_or_sell: getTradeDirection()=='{{OMSWorkflowEntrustService::ORDER_DIRECTION_BUY}}' ? 'buy' : 'sell',
                //     price: +form.find('[name=price]').val()||0,
                //     limit_price_or_market_price: getTradeMode()=='{{OMSWorkflowEntrustService::ORDER_MODEL_MARKET_PRICE}}' ? 'market_price' : 'limit_price',
                //     volume: +form.find('[name=volume]').val()||0
                // }).then(function(res){
                //     if(risk_before_submit_loading_timestamp!=me.attr('risk_before_submit_loading_timestamp')){return;}
                //
                //     //增加整手提示
                //     var msg = getSellMaxVolumeError();
                //     if(msg){
                //         $('#risk2Res').render({msg:msg});
                //     }else{
                //         $('#risk2Res').render(res);
                //     }
                //
                //     res.code == 0 && $('#is_force').prop('checked') && $('#is_force').click();
                // });

                // function backEndAjaxRiskCheck(){
                //     $.ajax({
                //         type: 'POST',
                //         url: (window.REQUEST_PREFIX||'')+'/oms/helper/risk_check/' + PRODUCT.id,
                //         data: data,
                //     }).done(function(res){
                //         if(risk_before_submit_loading_timestamp!=me.attr('risk_before_submit_loading_timestamp')){return;}
                //
                //         $('#risk2Res').render(res);
                //         res.code == 0 && $('#is_force').prop('checked') && $('#is_force').click();
                //     }).fail(function(){
                //         $.omsAlert('风控请求失败',false);
                //     }).always(function(){
                //         if(risk_before_submit_loading_timestamp!=me.attr('risk_before_submit_loading_timestamp')){return;}
                //     });
                // }
            }
        }

        //提交表单，创建新委托单
        function tryCreateOrder(){
            var form = $('#create_order_form');

            //表单验证
            var stuck = false;
            var stuck_inputs = getStuckInputs();

            stuck_inputs.each(function(){
                $.omsAlert($(this).focus().closest('.field').find('label:first').text() + '不正确！',false);
                stuck = true;
                return !stuck;
            });

            var sellMaxVolumeErrorMsg = getSellMaxVolumeError();
            if( sellMaxVolumeErrorMsg ){
                $.omsAlert(sellMaxVolumeErrorMsg,false,1000);
                $('#val_volume').focus();
                return false;
            }

            //强制委托
            if( $('#force-inputs').is('.active') ){
                form.find('input.force-append').each(function(){
                    var patternStr = $(this).attr('f-pattern');
                    var reg = new RegExp(patternStr);
                    var value = $(this).val().trim();
                    stuck = !reg.test(value);
                    stuck && $.omsAlert($(this).focus().closest('.field').find('label:first').text() + '不正确！',false);
                    return !stuck;
                });
            }

            !stuck && $(window).data('order_creating') && alert('上次提交尚未完成，可能是你手速太快了，你可以刷新页面或稍后重试！');

            //提交数据
            if(!stuck && !$(window).data('order_creating')){
                var productInfo = $('.product-detail').getCoreData();
                var stockInfo = $('.trade-5').getCoreData();
                var name = productInfo.name;
                var stock_id = stockInfo.stock_id;
                var stock_name = stockInfo.stock_name;
                var is_trade_day = stockInfo.is_trade_day;
                var order_model = $('.order_model-ctrl.active').find('input').val();
                var order_price = $('#val_price').val().trim();
                var order_volume = $('#val_volume').val().trim();

                var typeStr2 = '';
                var typeStr1 = '';
                if (2 == order_model) {
                    typeStr2 = '市价';
                    order_model = selectize.getValue();

                }else if(1 == order_model){
                    typeStr2 = '限价';
                    // order_model = utils.stock_custom.getMarketType(stock_id.match(/[a-zA-Z]+/));
                }

                var trade_direction;
                var trade_direction_str;
                var order_price_stop;
                if ($('.single-buy').hasClass('active')) {
                    trade_direction = 1;
                    trade_direction_str = '买入';
                    typeStr1 = '<span style="color:#F44336;">买入</span>';
                    order_price_stop = stockInfo.stop_top;
                }else if($('.single-sell').hasClass('active')){
                    trade_direction = 2;
                    trade_direction_str = '卖出';
                    typeStr1 = '<span style="color:#2196F3">卖出</span>';
                    order_price_stop = stockInfo.stop_down;
                }
                var priceStr = (('市价' == typeStr2)?utils.common.getData(PRICE_TYPE_LIST, order_model):order_price);
                var order_amount = ('市价' == typeStr2)?(Number((1000 * order_price_stop).toFixed(2)) * order_volume / 1000):(Number((1000 * order_price).toFixed(2)) * order_volume / 1000);
                var html = '<tr style="border-bottom: 1px solid #E2E2E2;"><td class="cell-left">'+ name + '</td>'+
                    '<td class="cell-left">'+ typeStr2 + typeStr1 +'</td>'+
                    '<td class="cell-right" style="max-width:190px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="'+ priceStr +'">'+ priceStr +'</td>'+
                    '<td class="cell-right">'+ order_volume +'</td>'+
                    '<td class="cell-right">'+ order_amount +'</td></tr>';
                var confirmHtml = '<table class="custom_confirm"><tbody style="width:100%;display: inline-table;"><tr><th class="cell-left">产品单元</th>'+
                    '<th class="cell-left">交易方向</th>'+
                    '<th class="cell-right">指令价格</th>'+
                    '<th class="cell-right">交易数量(股)</th>'+
                    '<th class="cell-right">交易金额(元)</th></tr>'+html+'</tbody></table>'+
                    '<div class="custom_total"><span style="color:#999999;font-size:13px;">总计</span><span>'+order_volume+'</span><span>'+order_amount+'</span></div>';
                if (0 == is_trade_day) {//0是休市时间，也就是非交易日或者是交易日的15点之后 1为非休市时间
                    confirmHtml += '<div style="color:#F44336;font-size: 14px;padding-bottom: 3px;">*当前为休市时间，指令将提交至下一交易日</div>'
                }

                $.confirm({
                    title: '指令确认 <span style="margin-left:10px;font-size: 14px;font-weight: normal;">股票：'+ stock_id + ' ' + stock_name +'</span>',
                    content: confirmHtml,
                    closeIcon: true,
                    confirmButton: '确定',
                    cancelButton: false,
                    confirm: function(){
                        if($.isLoading()){return;}
                        $.startLoading('正在提交订单...');
                        $(window).data('order_creating',true);

                        $.post(
                            (window.REQUEST_PREFIX||'')+'/oms/workflow/'+PRODUCT.id+'/add_hand_order',
                            getFormSerializeString()
                        ).done(function(res){
                            if(res.code==0){
                                $.omsAlert('创建委托单成功！',true,1000,true);
                                $(window).trigger({type:'order_create:success'});
                            }else{
                                $.omsAlert('创建委托单失败：' + (res.msg || '未知错误') + '，请稍候重试！',false);
                            }
                        }).fail(function(){
                            $.omsAlert('网络错误，创建委托单失败！',false);
                        }).always(function(){
                            $.clearLoading();
                            $(window).data('order_creating',false);
                        });
                    }
                });
            }

            return false;
        }

        function cancelLastRiskCheck(){
            me.attr('risk_before_submit_loading_timestamp','');
        }

        function resetDefaultValPrice(){
            var stock = me.data('stock_info');
            if(!stock || stock.stock_id != $('[name=stock_code]').val()){return;}

            var pre_price = $.pullValue(
                stock,
                ( getTradeDirection()=='{{OMSWorkflowEntrustService::ORDER_DIRECTION_BUY}}' ? 'ask' : 'bid' ) + '1_price',
                $.pullValue(stock, 'last_price', 0)
            );
            !$('#val_price').val() && pre_price && $('#val_price').val(pre_price).change();
        }

        function checkFormInputsStuck(){
            // var timeStr = moment().hours();
            // //16-17点，禁止下单
            // if (timeStr == 16) {
            //     $('#risk2Res').render({msg: '当前时段不可提单，请17:00后再试'});
            //     return;
            // }
            var form = $('#create_order_form');

            var stuck_inputs = getStuckInputs();

            if( stuck_inputs.length ){
                var stuck_input = stuck_inputs.first();
                var stuck_input_value = stuck_input.val().trim();
                var stuck_label = stuck_input.closest('.field').find('label:first').text();
                var stuck_msg = stuck_input_value ? stuck_label+'格式不正确！' : stuck_input.attr('placeholder');

                if( !stuck_input.is('.pattern-stuck') && stuck_input.is('.limit-rule-stuck') ){
                    stuck_msg = stuck_label + stuck_input.attr('limit-words');
                }

                $('#risk2Res').render({msg: stuck_msg});
            }

            // if( buyOrSell()=='buy' && (+me.find('[name=volume]').val()||0)%100!==0 ){
            //     $('#risk2Res').render({msg: '买入数量必须为整手'});
            //     return;
            // }
        }

        function getStuckInputs(){
            var form = $('#create_order_form');

            var stuck_inputs = form.find(
                '.stuck' + (
                    isMarketPriceOrder() ? ':not([name=price])' : '' //市价单不考虑价格
                )
            );

            // if( !stuck_inputs.length && buyOrSell()=='buy' && (+me.find('[name=volume]').val()||0)%100!==0 ){
            //     stuck_inputs = stuck_inputs.add( me.find('[name=volume]') );
            // }

            return stuck_inputs;
        }

        function isMarketPriceOrder(){
            return getTradeMode()=="{{OMSWorkflowEntrustService::ORDER_MODEL_MARKET_PRICE}}";
        }

        function getTradeMode(){
            return me.find('form:first').serializeArray().filter(function(item){
                return item.name === 'trade_mode'
            })[0].value;
        }

        function buyOrSell(){
            return getTradeDirection() == '{{OMSWorkflowEntrustService::ORDER_DIRECTION_BUY}}' ? 'buy' : 'sell'
        }

        function getTradeDirection(){
            return me.find('form:first').serializeArray().filter(function(item){
                return item.name === 'trade_direction'
            })[0].value;
        }

        function setMaxSellBuyVolumeValue(data){
            $('#val_volume').attr('sell_max_volume', data.sell_max_volume);
            $('#val_volume').attr('buy_max_volume', data.buy_max_volume);
            setMaxVolumeValue();
        }

        function resetMaxVolumeValue(){
            me.find('[name=volume]').removeAttr('oms_max_value');
        }

        function setMaxVolumeValue(res){
            var direction = getTradeDirection() == '{{OMSWorkflowEntrustService::ORDER_DIRECTION_BUY}}' ? 'buy' : 'sell';
            var volume_input = me.find('[name=volume]');
            volume_input.attr('oms_max_value', volume_input.attr(direction+'_max_volume') || 0);
        }

        function getSellMaxVolumeError(){
            var sell_max_volume = parseInt( $('#val_volume').attr('sell_max_volume')||0 );
            var volume = parseInt( $('#val_volume').val()||0 );

            if( getTradeDirection() == '{{OMSWorkflowEntrustService::ORDER_DIRECTION_SELL}}' ){
                // if( volume>sell_max_volume){
                //     return '卖出数量不能超过当前可卖数量！';
                // }
                if( volume%100!==0 && volume!==sell_max_volume ){
                    return '如果不全部卖出可卖持仓，不能包含碎股！';
                }
            }else{
                if( volume%100!==0 ){
                    return '买入数量必须为整手';
                }
            }

            return '';
        }

        function resetViewByStockType(stock){
            var stock_id = stock.stock_id;
            (/^131/.test(stock_id) || /^204/.test(stock_id))
                ? setNationalDebt(stock_id)
                : setNormalStock(stock_id);

            function setNationalDebt(){
                /^131/.test(stock_id) && setShenZhen(stock_id);//1K起买
                /^204/.test(stock_id) && setShanghai();//10W起买

                function setShenZhen(){
                    //TODO:
                }

                function setShanghai(){
                    //TODO:
                }
            }

            function setNormalStock(){
                //TODO:
            }
        }

        function getFormSerializeString(){
            var form = $('#create_order_form');
            var stock_id = form.find('[name=stock_code]').val();
            var result = form.serialize();

            if ($('.order_model_market_price').hasClass('active')) {
                result = result.replace(/trade_mode=[^\&]/,'trade_mode=' + selectize.getValue());
            }

            //国债逆回购
            if( (/^131/.test(stock_id) || /^204/.test(stock_id)) ){
                result = result.replace(/trade_direction=[^\&]/,'trade_direction=101');
            }

            return result;
        }
    }).call(document.scripts[document.scripts.length-1].parentNode);
    </script>
</div>
