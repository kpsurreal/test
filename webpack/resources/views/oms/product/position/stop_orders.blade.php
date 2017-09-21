<div class="popup-wrap mod-popup mfp-hide oms-popup popup-stock-stop_orders">
    <header class="popup-hd">
        <h2>设置止盈止损提醒</h2>
    </header>
    <div class="popup-bd">
        <div class="content-bd">
            <div class="brief-info">
                <str data-src="stock_id|getPureCode"></str>
                <span data-src="stock_name"></span>
                成本价格：<span data-src="cost_price"></span>
                持仓数量：<span data-src="total_amount"></span>
            </div>
            <div class="form-body">
                <div class="left-part take-profit stop_orders-item">
                    <div class="field first">
                        <label><input type="checkbox" data-src="stop_orders.1.stop_is_actived" name="stop_profit_is_actived" data-src="stop_profit_is_actived" value="1">止盈</label>
                    </div>
                    <div class="field" stop-profit about="cost_price">
                        <label>价格涨至</label>
                        <div class="input double">
                            <div class="left-input input-item">
                                <input data-src="stop_orders.1.stop_price" name="stop_profit_price" x-pattern="^\d*\.?\d+$">
                                <span class="unit rmb">元</span>
                            </div>
                            <span class="or">或</span>
                            <div class="right-input input-item">
                                <input type="number" range>
                                <span class="unit percent">%</span>
                            </div>
                        </div>
                    </div>
                    <div class="field" stop-profit about="total_amount">
                        <label>卖出数量</label>
                        <div class="input double">
                            <div class="left-input input-item">
                                <input data-src="stop_orders.1.stop_amount" name="stop_profit_amount" x-pattern="^[1-9]+\d*$">
                                <span class="unit share">股</span>
                            </div>
                            <span class="or">或</span>
                            <div class="right-input input-item">
                                <input type="number" range>
                                <span class="unit percent">%</span>
                            </div>
                        </div>
                    </div>
                    <div class="field">
                        <label>卖出市值</label>
                        <div>
                            <span data-src="stop_orders.1.sell_value|numeral:0,0.00" sell-value></span> 元
                        </div>
                    </div>
                    <div class="field">
                        <label>有效时间</label>
                        <div class="input">
                            <input data-src="stop_orders.1.stop_actived_at|subString:0:10" name="stop_profit_actived_at" type="date" x-pattern="^\d{4}\-\d{2}\-\d{2}$">
                        </div>
                    </div>
                </div>

                <div class="right-part stop-loss stop_orders-item">
                    <div class="field first">
                        <label><input type="checkbox" data-src="stop_orders.2.stop_is_actived" name="stop_lose_is_actived" data-src="stop_lose_is_actived" value="1">止损</label>
                    </div>
                    <div class="field" stop-lose about="cost_price">
                        <label>价格跌至</label>
                        <div class="input double">
                            <div class="left-input input-item">
                                <input data-src="stop_orders.2.stop_price" name="stop_lose_price" x-pattern="^\d*\.?\d+$">
                                <span class="unit rmb">元</span>
                            </div>
                            <span class="or">或</span>
                            <div class="right-input input-item">
                                <input type="number" range>
                                <span class="unit percent">%</span>
                            </div>
                        </div>
                    </div>
                    <div class="field" stop-lose about="total_amount">
                        <label>卖出数量</label>
                        <div class="input double">
                            <div class="left-input input-item">
                                <input data-src="stop_orders.2.stop_amount" name="stop_lose_amount" x-pattern="^[1-9]+\d*$">
                                <span class="unit share">股</span>
                            </div>
                            <span class="or">或</span>
                            <div class="right-input input-item">
                                <input type="number" range>
                                <span class="unit percent">%</span>
                            </div>
                        </div>
                    </div>
                    <div class="field">
                        <label>卖出市值</label>
                        <div>
                            <span data-src="stop_orders.2.sell_value|numeral:0,0.00" sell-value></span> 元
                        </div>
                    </div>
                    <div class="field">
                        <label>有效时间</label>
                        <div class="input">
                            <input data-src="stop_orders.2.stop_actived_at|subString:0:10" name="stop_lose_actived_at" type="date" x-pattern="^\d{4}\-\d{2}\-\d{2}$">
                        </div>
                    </div>
                </div>
            </div>

            <div class="form-foot">
                <span class="oms-btn blue submit">确认设置提醒</span>
            </div>

        </div>
    </div>
    <script>
    (function(){
        var me = this;
        var now_position;

        $(window).on('stock:stop_orders',function(event){
            now_position = event.position;
            showStopOrdersByPosition(now_position);
        });

        me.on('click','.submit:not(.posting)',function(){
            saveStopOrders(now_position);
        }).on('change','input[type=checkbox]',function(){
            var input = $(this);
            var checked = input.prop('checked');
            var item_board = input.closest('.stop_orders-item');
            item_board.toggleClass('checked',checked);
            item_board.toggleClass('disabled',!checked);
            checked
                ? item_board.find('input:not([type=checkbox]),.unit').removeAttr('disabled')
                : item_board.find('input:not([type=checkbox]),.unit').attr('disabled',true);
        }).on('real_change','input[range]',function(event){
            var real_value = event.real_value;
            var input = $(this);
            var field = input.closest('.field');
            var base_key = field.attr('about');
            var base_value = +$.pullValue(now_position,base_key,0);
            var direction = field.is('[stop-profit]') ? 1 : -1;
            var diff_target_value = direction*real_value*base_value;
            var target_value =
                /price/.test(base_key)
                ? (base_value + diff_target_value)
                : (diff_target_value*direction);

            target_value = Math.round(target_value*1000)/1000;

            var target_input = field.find('input').first();
            var old_target_value = +target_input.val()||0;
            if(old_target_value!=target_value){
                target_input.val( target_value ).change();
            }
        }).on('keyup change','[about] input[name]',function(){
            var input = $(this);
            var value = +input.val()||0;
            var field = input.closest('.field');
            var range_input = field.find('input[range]');
            var real_value = 0;
            var stop_item_board = input.closest('.stop_orders-item');

            var base_key = field.attr('about');
            var base_value = +$.pullValue(now_position,base_key,0);
            var direction = field.is('[stop-profit]') ? 1 : -1;

            if(/price/.test(base_key)){
                real_value = direction*(value-base_value)/base_value;
            }

            if(/amount/.test(base_key)){
                real_value = base_value ? value/base_value : 0;
            }

            var old_real_value = +range_input.attr('real_value')||0;
            if(real_value!=old_real_value){
                range_input.trigger({type:'real_change',real_value:real_value});
            }

            stop_item_board.find('[sell-value]').text(
                numeral( stop_item_board.find('input[name*=price]').val()*stop_item_board.find('input[name*=amount]').val()||0 ).format('0,0.00')
            );
        });

        function saveStopOrders(position){
            var url = (window.REQUEST_PREFIX||'') + '/oms/api/full_stop/set';
            var post_data = {
                product_id: position.product_id,
                stock_id: position.stock_id
            };

            if(!checkFormPass()){return;}

            [
                'stop_profit_is_actived',
                'stop_profit_price',
                'stop_profit_amount',
                'stop_profit_actived_at',

                'stop_lose_is_actived',
                'stop_lose_price',
                'stop_lose_amount',
                'stop_lose_actived_at'
            ].forEach(function(name){
                var input = me.find('[name='+name+']');
                post_data[name] = input.is('[type=checkbox]')
                    ? (input.prop('checked') ? 1 : 0)
                    : input.val();
            });

            me.find('.submit').addClass('posting');
            $.post(url,post_data).then(function(res){
                if(res.code==0){
                    $.omsAlert('更新止盈止损信息成功！');
                    $(window).trigger({
                        type: 'position:stop_orders:updated',
                        position: position
                    });
                }
                res.code!=0 && $.failNotice(url,res);
            }).fail($.failNotice.bind(null,url)).always(function(){
                me.find('.submit').removeClass('posting');
            });
        }

        function checkFormPass(){
            var pass = true;
            me.find('.stop_orders-item.checked').each(function(){
                var form = $(this);

                form.find('input[x-pattern]').each(function(){
                    var patternStr = $(this).attr('x-pattern');
                    var reg = new RegExp(patternStr);
                    var value = $(this).val().trim();
                    var pattern_pass = reg.test(value);
                    $(this).toggleClass('stuck',!pattern_pass);
                });

                var first_stuck_input = form.find('input.stuck').first();
                if(first_stuck_input.length){
                    var err_msg = form.find('label').first().text() + '设置：' + first_stuck_input.closest('.field').find('label').first().text().replace(/(涨|跌)至/g,'') + '格式输入不正确!';
                    $.omsAlert(err_msg,false);
                    return (pass = false);
                }
            });
            return pass;
        }

        function loadStopOrders(position,callback){
            var url = (window.REQUEST_PREFIX||'') + '/oms/api/full_stop/get';
            $.getJSON(url,{
                product_id: position.product_id,
                stock_id: position.stock_id
            },function(res){
                res.code==0 && callback && callback( $.pullValue(res,'data.'+position.product_id,{})[position.stock_id] );
                res.code!=0 && $.failNotice(url,res);
            }).fail($.failNotice.bind(null,url));
        }

        function showStopOrdersByPosition(position){
            var last_loading_timestamp = new Date().valueOf();
            me.attr('last_loading_timestamp',last_loading_timestamp);
            loadStopOrders(position,show);

            function show(stop_orders){
                if(me.attr('last_loading_timestamp')!=last_loading_timestamp){return;}

                position.stop_orders = stop_orders;
                for(var key in stop_orders){
                    stop_orders[key]['sell_value'] = 0;
                    with( stop_orders[key] ){
                        sell_value = stop_price*stop_amount;
                    }
                }

                me.render(position);
                $.magnificPopup.open({
                    items: {
                        src: me,
                        type: "inline",
                        midClick: true
                    },
                    callbacks: {
                        open: function(){
                            me.find('.field.first input[type=checkbox]').change();
                            me.find('.left-input').find('input:first').filter(function(){return $(this).val().length;}).change();
                        },
                        close: function(){
                        }
                    }
                });
            }
        }
    }).call( $(document.scripts[document.scripts.length-1]).parent() );
    </script>
</div>
