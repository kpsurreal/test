<?php
use App\Services\OMS\Workflow\OMSWorkflowEntrustService;
?>
<div class="section-panel create-order">
    <div class="oms-popup popup-create-order" id="popup-create-order">
        <form class="popup-bd create-order-form" id="create_order_form" autocomplete="off">
            <div class="content-bd">
                <div class="field first-field">
                    <label>股票代码</label>
                    <div class="content stock-code">
                        <input tabIndex="1000" autofocus id="stock_code" type="text" autocomplete="off"
                            name="stock_code" pattern="^\d{6}\.(SZ|SH)$" x-placeholder="请输入股票代码或拼音"
                            focus-class="active" active-slide="#magic-suggest" comment="#magic-suggest 定义在 oms.filters 中"
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
                    {{-- 限价才展示 使用价格输入控制 --}}
                    <div class="active-show order_model_limit_price active">
                        <div class="field">
                            <label>价格</label>
                            <div class="content">
                                <input tabIndex="1001" class="plus-input change-checkrisk-last" type="text" id="val_price" name="price"
                                    pattern="^(\d*\.?\d+|\d*)$">
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
                {{-- <div style="display:none;"> --}}
                    {{-- @include('oms.multi.product.order_create.new_order.trade_number_method') --}}
                {{-- </div> --}}
                <div class="field risk-pre" style="display:none;">
                    <center class="content risk-info-pre" id="riskInfoPre">
                        可用资金 <span data-src="balance_amount|getBalanceAmount|numFormat:0,0.00">--</span>
                        最大可买 <span class="blue"><span data-src="buy_max_volume|numFormat">--</span> 股</span>
                        最大可卖 <span class="yellow"><span data-src="sell_max_volume|numFormat">--</span> 股</span>
                    </center>
                </div>
            </div>

            <div class="content-foot" id="risk2Res" style="margin-top: 36px;padding-top: 26px;border-top: 1px solid RGBA(197,202,209,.5);">
                <div if="loading" class="submit-wrap">
                    <p class="loading">等待风控检测</p>
                    <button class="oms-btn disabled" type="submit" disabled="true" submit-direction-relative>提交指令</button>
                </div>
                <div if="loading|isFalse">
                    <div if="code|notNum" class="submit-wrap">
                        <p if="msg" data-src="msg" class="red"></p>
                        <button class="oms-btn disabled" disabled="true" submit-direction-relative>提交指令</button>
                    </div>
                    <div if="code|numNotEqual:0">
                        <div class="active-show default-active submit-wrap">
                            <p data-src="msg" class="red resk2-fail-msg"></p>
                            <button class="oms-btn disabled" disabled="true" submit-direction-relative>提交指令</button>
                        </div>
                    </div>
                    <div if="code|numEqual:0" class="resk2-pass submit-wrap">
                        <p class="green"><span data-src="msg"></span><span if="warning_count" class="warning-mark">?</span></p>
                        <button tabIndex="0" class="oms-btn" submit submit-direction-relative>提交指令</button>
                    </div>
                </div>
            </div>
        </form>
    </div>
    <script>
    utils.tab.init();
    (function(){
        var me = $(this);

        var trade_number_method;

        // var multi_status;
        var product_list = [];
        var product_ids = [];
        var predict;

        $(window).on('multi_load',function(event){
            // multi_status = event.multi_status;
            product_list = event.product_list;
            product_ids = event.product_ids;
        });

        $(function(){
            //ie keyup but value didn't change bug fix;
            /msie|edge/i.test(navigator.userAgent) && $('input').on('keyup',function(){
                $(this).blur().change().focus();
            });

            /msie|edge/i.test(navigator.userAgent) && $('label').on('click_active',function(){
                $(this).find('input[type=radio]').change();
            });

            me.find('.magic-suggest-wrap').render();

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

                // checkRiskInfoPre();
            }).on('pattern_stuck',function(){
                var new_value = $(this).val().trim();
                if( new_value.length==6 && ($(this).attr('last_value') || '').indexOf(new_value)===0 ){return;}
                $(this).removeAttr('last_value').removeAttr('old_value');

                me.data('stock_info',{});
                $('#stock_name_addon').html('');
                $(window).trigger({type:'create_order:stock_code:pattern_stuck'});
                checkFormInputsStuck();
            }).on('stock_code:suggest',function(event){
                var stock = event.stock;
                if ($('#stock_code').attr('old_value') !== $('#stock_code').attr('last_value')) {
                    $('#val_price').val('');
                }
                $('#stock_code').val(stock.stock_id).change();
                $('#stock_name_addon').text(stock.stock_name);
                if ($('#stock_code').attr('old_value') !== $('#stock_code').attr('last_value')) {
                    $('#val_price').val('');
                }
                checkFormInputsStuck();
            });

            me.find('[name=trade_direction]').on('change',setMaxVolumeValue);

            $('#create_order_form').find('input.change-checkrisk-last').on('change keyup click',tryCheckRiskBeforeSubmit);

            $('#create_order_form').on('click', '[submit]', tryCreateOrder);

            $('#force-inputs').on('click_active',function(){
                $('input[name=is_force]').prop('checked',true);
                $(this).find('input:not([type=checkbox])').val('').change().filter('[name=force_pswd]').attr('type','password');
            });

            //买卖方向变更
            $('.direction-ctrl').on('click_active',function(){
                // $('#val_volume').val('').change(); //不清空数量咯
                //getTradeDirection 是通过 表单 serializeArray 来实现的，有一点延迟
                (window.requestAnimationFrame||window.setTimeout)(function(){
                    var direction = buyOrSell();
                    $(window).trigger({type:'order_create:direction:changed',direction:direction});
                });
            });

            //限价市价切换
            $('.order_model-ctrl').on('click_active',function(){
                $(window).trigger('policy_display_change');
                // setTimeout(checkFormInputsStuck);
            });

            me.on('stock_info_update',function(event){
                me.data('stock_info',event.stock);
            });

            // me.on('change keyup',broadcastFormChange);

            me.on('click','.warning-mark',function(){
                $(window).trigger('create_order:form:warning-toggle');
            });

            me.on('change keyup', '#val_price', function(){
                $(window).trigger('policy_display_change');
            });

            // broadcastFormChange();
        });

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
                $('#risk2Res').render({msg:'请输入股票代码'}).find('.active-show').removeClass('active').filter('.default-active').addClass('active');

                form.find('input:not([type=radio]):not([type=hidden]):not([type=checkbox]):not(.force-append):not(#stock_code)').val('').change();
                form.find('input.force-append').removeClass('stuck');
                $('input[name=is_force]').prop('checked',false);
            }
        }).on('order_create:trade_5:updated',function(event){
            me.trigger({type:'stock_info_update',stock:event.stock});
        }).on('order_create:trade_5:updated:first',function(){
            //当前股票第一次更新
            resetDefaultValPrice();
        }).on('order_create:success',function(){
            me.find('[name=stock_code],[name=volume],[name=price]').val('').removeAttr('last_value').removeAttr('old_value').change();
        }).on('load spa_product_change balance_amount_changed policy_products_selected_change policy_display_change',function(){
            checkFormInputsStuck();
        }
            // checkRiskInfoPre

        ).on('order_create:direction:changed',function(event){
            var direction = event.direction;

            $('[submit-direction-relative]').text(
                '提交委' + (direction == 'buy' ? '买' : '卖')
            ).toggleClass('red',direction=='buy')
            .toggleClass('blue',direction=='sell');

        }).on('order_create:trade_number_method:change',function(event){
            // 数量比例
            // trade_number_method = event.trade_number_method;
            // checkFormInputsStuck();
        }).on('order_create:nav:multi-stocks:sell order_create:nav:multi-stocks:buy',function(){
            me.find('[name=volume],[name=rate]').val('').removeAttr('last_value').removeAttr('old_value').change();;
        }).on('multi_products:head:predict',function(event){
            // 多策略产品，
            // predict = $.pullValue(event,'predict');
            // checkFormInputsStuck();
        }).on('product:position:row-click',function(event){
            var position_stock_code = event.position.stock_id;
            me.find('[name=stock_code]').val()!=position_stock_code && me.find('[name=stock_code]').val(position_stock_code).change();
        });

        // //将修改通过事件告知其他模块
        // function broadcastFormChange(){
        //     broadcast();
        //     (window.requestAnimationFrame||window.setTimeout)(broadcast);//再来一瓶
        //     function broadcast(){
        //         var validate_pass = !getStuckInputs().length;
        //         $(window).trigger({
        //             type: 'create_order:form:changed',
        //             form_data: getFormSerializeObj(),
        //             validate_pass: validate_pass
        //         });
        //         $(window).trigger({
        //             type: 'create_order:form:changed:' + (validate_pass ? 'pass' : 'stuck'),
        //             form_data: getFormSerializeObj()
        //         });
        //         checkFormInputsStuck();
        //     }
        // }

        function getFormSerializeObj(){
            var form = me.find('form').first();
            var result = {};
            var data = form.serializeArray();
            data.forEach(function(item){
                result[item.name] = item.value;
            });
            return result;
        }

        // function checkRiskInfoPre(){
        //     var form = $('#create_order_form');
        //     $('#riskInfoPre').render({});
        //     $('#risk2Res').render({msg:'正在检测可买可卖数量'}).find('.active-show').removeClass('active').filter('.default-active').addClass('active');
        //
        //     if( $('#stock_code').hasClass('pass') ){
        //         resetMaxVolumeValue();
        //         $('#riskInfoPre').addClass('loading');
        //         $(window).trigger({type:'risk_info_pre_start'});
        //
        //         var res_data = getRiskInfoPreData();
        //         $('#riskInfoPre').removeClass('loading');
        //         $('#riskInfoPre').render(res_data);
        //
        //         setMaxSellBuyVolumeValue(res_data);
        //         $('#val_volume').val('').change().focus();
        //         $(window).trigger({
        //             type:'risk_info_pre_finish',
        //             more_data: res_data
        //         });
        //     }else{
        //         checkFormInputsStuck();
        //     }
        // }

        function getRiskInfoPreData(){
            var balance_amount = 1000;
            var last_price = 10;
            return {
                balance_amount: balance_amount,
                sell_max_volume: balance_amount/last_price,
                buy_max_volume: balance_amount/last_price
            }
        }

        function tryCheckRiskBeforeSubmit(){
            var form = $('#create_order_form');

            if($('#riskInfoPre').is('.loading')){return;}
            checkFormInputsStuck();

            //没有数据变更的时候，不发送请求
            var new_serialize_str = form.serialize().replace(/\&(is_force|msg|force_pswd)\=[^\&]*/g,'');
            if( new_serialize_str===form.attr('last-serialize') ){return;}
            form.attr( 'last-serialize', new_serialize_str );

            var data = form.serialize().replace('stock_code','stock_id');
            data = isMarketPriceOrder() ? data.replace(/\&price\=[^\&]*/,'') : data;

            var stuck_inputs = getStuckInputs();

            if(!stuck_inputs.length){
                $('#risk2Res').render({loading:true}).find('.active-show').removeClass('active').filter('.default-active').addClass('active');
                $('input[name=is_force]').prop('checked',false);
                $('#risk2Res').render({code:0});
            }

            checkFormInputsStuck();
        }

        //提交表单，创建新委托单

        //################## TODO: 批量创建委托 ##################
        function tryCreateOrder(){
            var form = $('#create_order_form');

            //表单验证
            var stuck = false;
            var stuck_inputs = getStuckInputs();

            stuck_inputs.each(function(){
                // $.omsAlert($(this).focus().closest('.field').find('label:first').text() + '不正确！',false);
                $.omsAlert($(this).closest('.field').find('label:first').text() + '不正确！',false);
                stuck = true;
                return !stuck;
            });

            // 多策略咯，就不验证了
            // var sellMaxVolumeErrorMsg = getSellMaxVolumeError();
            // if( sellMaxVolumeErrorMsg ){
            //     $.omsAlert(sellMaxVolumeErrorMsg,false,1000);
            //     $('#val_volume').focus();
            //     return false;
            // }

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

            // broadcastFormChange();//保证跟踪到变化
            if (true !== checkFormInputsStuck()) {
                stuck = true;
            }

            setTimeout(function(){
                !stuck && $(window).trigger('create_policy:form:submit');
            },100);

            return false;
        }

        function resetDefaultValPrice(){
            var stock = me.data('stock_info');
            if(!stock || stock.stock_id != $('[name=stock_code]').val()){return;}

            var pre_price = $.pullValue(
                stock,
                ( getTradeDirection()=='{{OMSWorkflowEntrustService::ORDER_DIRECTION_BUY}}' ? 'ask' : 'bid' ) + '1_price',
                $.pullValue(stock, 'last_price', 0)
            );

            pre_price && $('#val_price').val(pre_price).change();
        }

        function checkFormInputsStuck(){
            var form = $('#create_order_form');

            var stuck_inputs = getStuckInputs();

            if( stuck_inputs.length ){
                var stuck_input = stuck_inputs.first();
                var stuck_input_value = stuck_input.val().trim();
                var stuck_label = stuck_input.closest('.field').find('label:first').text();
                var stuck_msg = stuck_input_value ? stuck_label+'格式不正确！' : stuck_input.attr('x-placeholder');

                if( !stuck_input.is('.pattern-stuck') && stuck_input.is('.limit-rule-stuck') ){
                    stuck_msg = stuck_label + stuck_input.attr('limit-words');
                }

                if (stuck_msg) {
                    $('#risk2Res').render({msg: stuck_msg});
                    return;
                }
            }

            var tmpN = 0;
            var validFlag = true;
            var validFlagV2 = true;//判断买入时是否为100的整数倍
            $('.product-select').each(function(){
                if($(this).prop('checked')){
                    var tmpValue = $(this).parents('tr').find('.math-input>input').val();
                    if ('' == tmpValue || 0 == tmpValue) {
                        validFlag = false;
                    }
                    if($('.single-buy').hasClass('active')){
                        if (0 != tmpValue % 100) {
                            validFlagV2 = false;
                        }
                    }
                    tmpN++;
                }
            });
            if (0 >= tmpN) {
                $('#risk2Res').render({msg: '请勾选产品单元'});
                return;
            }

            // 左边所有产品都没的情况下，提示“还没有分配任何产品单元，请联系管理员分配”
            if (0 == $('.product-select').length) {
                $('#risk2Res').render({msg: '还没有分配任何产品单元，请联系管理员分配'});
                return;
            }

            //判断所有选中的产品单元的数量，提示“请输入指令数量”
            if (false === validFlag) {
                $('#risk2Res').render({msg: '请输入指令数量'});
                return;
            }

            //判断所有选中的产品单元的数量，提示“买入数量必须为100的整数倍”
            if (false === validFlagV2) {
                $('#risk2Res').render({msg: '买入数量必须为100的整数倍'});
                return;
            }

            // if( buyOrSell()=='buy' && getTradeNumberMethod()=='volume' && (+me.find('[name=volume]').val()||0)%100!==0 ){
            //     $('#risk2Res').render({msg: '买入数量必须为整手'});
            //     return;
            // }

            // checkTotalPredict();
            $('#risk2Res').render({
                code: 0,
                msg: ''
            });

            return true;
        }

        function getStuckInputs(){
            var form = $('#create_order_form');

            var selector = '.stuck' + (
                isMarketPriceOrder() ? ':not([name=price])' : '' //市价单不考虑价格
            ) + (
                trade_number_method == 'volume' ? ':not([name=rate])' : ':not([name=volume])' //按数量购买，不考虑比例；否则相反
            );

            var stuck_inputs = form.find(selector);

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

        // function getTradeNumberMethod(){
        //     return me.find('form:first').serializeArray().filter(function(item){
        //         return item.name === 'trade_number_method'
        //     })[0].value;
        // }

        function buyOrSell(){
            return getTradeDirection() == '{{OMSWorkflowEntrustService::ORDER_DIRECTION_BUY}}' ? 'buy' : 'sell'
        }

        function getTradeDirection(){
            return me.find('form:first').serializeArray().filter(function(item){
                return item.name === 'trade_direction'
            })[0].value;
        }

        function setMaxSellBuyVolumeValue(data){
            setMaxVolumeValue();
        }

        function resetMaxVolumeValue(){
            me.find('[name=volume]').removeAttr('oms_max_value');
        }

        function setMaxVolumeValue(res){}

        function getSellMaxVolumeError(){
            var sell_max_volume = parseInt( $('#val_volume').attr('sell_max_volume')||0 );
            var volume = parseInt( $('#val_volume').val()||0 );

            if( getTradeDirection() == '{{OMSWorkflowEntrustService::ORDER_DIRECTION_SELL}}' ){
                // if( volume>sell_max_volume){
                //     return '卖出数量不能超过当前可卖数量！';
                // }
                if( volume%100!==0 && volume!==sell_max_volume ){
                    return '如果不全部卖出可卖持仓，不能包含碎股！你可以全部卖出，否则只能卖出100股的整数倍！';
                }
            }else{
                if( volume%100!==0 ){
                    return '【成交限制】委托买入的数量需为整手';
                }
            }

            return '';
        }
    }).call(document.scripts[document.scripts.length-1].parentNode);
    </script>
</div>
