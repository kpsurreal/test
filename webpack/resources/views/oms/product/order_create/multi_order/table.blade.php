<div>
    <div class="section-loading loading-loading"></div>
    <table class="nothing-nothing {{$to_buy ? 'red' : 'blue'}}">
        <tr rows-head>
            <th><input class="check-rows" type="checkbox"></th>
            <th>代码</th>
            <th>名称</th>
            @if($to_buy)<th>可用限额</th>@endif

            <th>成本价</th>
            <th>持仓数量</th>
            @if($to_sell)<th>可卖数量</th>@endif
            <th>市值</th>

            <th>盈亏比例</th>
            <th>仓位</th>

            <th>是否限价</th>
            <th>{{$to_buy?'买入':'卖出'}}价格</th>
            <th>数量(股)</th>
            <th>目标仓位</th>
        </tr>
        <tbody rows-body></tbody>
        <script type="text/html" row-tpl>
            <tr data-class="blackList|checkBlackList">
                <td><input class="check-row" type="checkbox"></input></td>
                <td data-src="stock_id|getPureCode"></td>
                <td data-src="stock_info.stock_name"></td>
                @if($to_buy)<td data-src="max_cash|numeral:0,0.00"></td>@endif

                <td class="position-light" data-src="cost_price|numeral:0.000"></td>
                <td class="position-light" data-src="total_amount|numeral:0,0"></td>
                @if($to_sell)<td class="position-light" data-src="enable_sell_volume|numeral:0,0"></td>@endif
                <td class="position-light" data-class="earning|rmgColor" data-src="market_value|numeral:0,0.00"></td>

                <td class="position-light" data-class="earning_ratio|rmgColor" data-src="earning_ratio|mSignNumeral:0.00%"></td>
                <td class="position-light" data-src="weight|numeral:0.00%"></td>

                <td>
                    <div class="checked-visible">
                        <label><input type="checkbox" name="trade_mode" class="limit">限价</label>
                    </div>
                </td>
                <td style="width:18%;">
                    <div class="checked-visible">
                        <span class="limit-hide">市价</span>
                        <input class="limit-show" type="number" name="price" data-src="stock_info.last_price|numeral:0.000" render-once>
                    </div>
                </td>
                <td>
                    <div class="checked-visible">
                        <input type="number" name="volume">
                    </div>
                </td>
                <td class="last">
                    <div>
                        <span class="checked-visible" data-src="target_position|numeral:0.00%"></span>
                        <span class="msg-wrap"><span class="error-msg"></span></span>
                    </div>
                    <span if="follow" class="delete">删除</span>
                </td>
            </tr>
        </script>
    </table>
    <script>
    (function(){
        var me = $(this);
        var direction = "{{$to_buy?'buy':'sell'}}";
        var user_id = $.pullValue(window,'LOGIN_INFO.user_id','');
        var stock_list = [];
        var data;
        var checked_state = '';
        var total_max_cash = 0;

        me.on('click','.delete',function(){
            var btn = $(this);
            var row = $(this).closest('tr');
            if(btn.is('.loading')){return;}

            var stock = row.getCoreData();
            var stock_id = stock.stock_id;
            var url = (window.REQUEST_PREFIX||'')+'/user/stock-follow/delete';
            $(this).addClass('loading');
            $.post(url,{stock_id: stock_id}).done(function(res){
                if(res.code==0){
                    $.omsAlert('删除自选股 '+stock_id+' 成功！');
                    row.remove();
                    $(window).trigger({type:'create_order:multi_stocks:delete_stock',stock:{stock_id:stock_id}});
                }else{
                    $.failNotice(url,res);
                }
            }).fail($.failNotice.bind(null,url)).always(function(){
                btn.removeClass('loading');
            });
        });

        me.on('change','[rows-head] input.check-rows',function(){
            var checked = $(this).is(':checked');
            $('[rows-body]').find('input.check-row:not(:disabled)').prop('checked',checked).change();
        }).on('change','input.check-row',function(){
            var checked = $(this).is(':checked');
            var row = $(this).closest('tr').toggleClass('checked',checked);

            if(!checked){
                row.find('input[name=volume]').val('');
            }

            setTimeout(checkedRowsChange);
        }).on('change','input[type=checkbox].limit',function(){
            var row = $(this).closest('tr');
            var checked = $(this).is(':checked');
            $(this).closest('tr').toggleClass('limit',checked);
            validateRowChange(row);
            gatherTradeData();
        }).on('keyup','[name=volume],[name=price]',function(){
            var row = $(this).closest('tr');
            validateRowChange(row);
            gatherTradeData();
            // 资金不足时，在该股票上显示出错信息
            if (Number($('.multi-stocks-section.buy [data-src="balance_amount_last|numeral:0,0.00"]').html()) < 0) {
                $(this).parents('tr').addClass('error').find('.error-msg').text('可用资金不足');
            }
        });

        $(window).on('load',function(){
            //清空缓存区的自选股列表
            direction == 'buy' && $.omsUpdateLocalJsonData('stock_follow',user_id);
        }).on('order_create:nav:multi-stocks:'+direction,function(){
            getStockList();
        }).on('add_multi_hand_order:success',
            reset
        ).on('order_create:multi_order:data_change:'+direction,function(event){
            data = event.new_data;
            distributeTradeData(data);
        }).on('product:position:updated',function(event){
            var position = event.position;
            position && updatePositionList(position);
        }).on('risk_cash_check:success',function(event){
            var product_max_cash = $.pullValue(event,'res_data.product_cash.max_cash',0);
            // if( $.dirtyCheck('product_buy_max_cash:'+PRODUCT.id,product_max_cash) ){
                $(window).trigger({type:'create_order:multi_stocks:'+direction+':max_cash:changed',max_cash:product_max_cash});
            // }
        });

        direction=='buy' && $(window).on('create_order:multi_stocks:add_stock',function(event){
            var stock = event.stock;

            //新增，更新本地缓存
            var cached_follow_stocks = $.omsGetLocalJsonData('stock_follow', user_id, false);
            if(cached_follow_stocks){
                cached_follow_stocks.push($.extend(stock,{follow:true}));
                $.omsUpdateLocalJsonData('stock_follow', user_id, cached_follow_stocks);
            }

            combinePositionStocksInfo([stock], $.omsGetLocalJsonData('position_realtime', PRODUCT.id, []))

            // 新增股票时，前端风控
            var product  = PRODUCT;
            // 计算可用余额
            // 新增股票的总可用资金
            var market_value = 0;
            var total_amount = 0;
            var enable_sell_volume = 0;
            window.position_realtime && window.position_realtime.forEach(function(e){
                if (e.stock_id === stock.stock_id && e.product_id == product.id) {

                    // market_value = e.market_value;
                    // total_amount = e.total_amount;
                    enable_sell_volume = e.enable_sell_volume;
                }
            });
            var all_market_value = 0;
            window.risk_position[product.id].data.forEach(function(el){
                if (el.stock_id == stock.stock_id) {
                    total_amount = el.total_amount;
                    market_value = el.market_value;
                }
                all_market_value += el.market_value;
            });
            var obj = riskCheck.checkRules({
                product_id: product.id,                             // 产品id， id
                // 交易数据 form_data
                trade_direction: 1,                                 // 交易方向，1买入 2卖出 trade_direction
                trade_mode: 1,                                      // 1限价／2市价  trade_mode
                volume: 0,                                          // 交易数量
                price: 1,                                       // 限价金额
                surged_limit: 1,                                // 涨停价 price已经做了处理了
                decline_limit: 1,                               // 跌停价 price已经做了处理了
                stock_code: stock.stock_id,                         // 股票code，包含“.SZ”,比较的时候最好都进行小写转换
                stock_name: stock.stock_name,            // 股票名称，用于判断st股票
                // 产品的数据 product
                total_assets: product.runtime.total_assets,         // 资产总值 runtime.total_assets
                enable_cash: product.runtime.enable_cash,           // 可用资金 runtime.enable_cash
                security: all_market_value,                         // 持仓市值 runtime.security 改为 all_market_value
                net_value: product.runtime.net_value,               // 当日净值 runtime.net_value
                // 持仓数据
                market_value: market_value,                         // 本股票持仓市值 //window.position_realtime里面有
                total_amount: total_amount,                         // 该股票当前持仓数
                enable_sell_volume: 0                               // 该股票能卖的数量
            });
            // 剩余可用资金 ＝ 空仓下的总可用资金 － 股票资产
            var max_cash = Math.max(obj.max_cash, 0);
            stock.max_cash = Math.min(max_cash, total_max_cash);

            // stock.forEach(function(e){
            //     e.max_cash = max_cash;
            // });
            $(window).trigger({
                type:'risk_cash_check:success',
                res_data:{
                    product_cash: {
                        max_cash: max_cash
                    }
                }
            });

            mergeFreshStocksInfo([stock]).then(function(){
                stock.follow = true;
                var row = $(me.find('[row-tpl]').html()).render(stock).toggleClass('position',!!stock.total_amount);
                me.find('[rows-body]').append(row);
            });

            me.find('.nothing-nothing').removeClass('nothing');

            // checkMultiRiskCash([stock],function(){
            //     mergeFreshStocksInfo([stock]).then(function(){
            //         stock.follow = true;
            //         var row = $(me.find('[row-tpl]').html()).render(stock).toggleClass('position',!!stock.total_amount);
            //         me.find('[rows-body]').append(row);
            //     });
            //
            //     me.find('.nothing-nothing').removeClass('nothing');
            // });
        }).on('create_order:multi_stocks:delete_stock',function(event){
            var stock = event.stock;

            //删除，更新本地缓存
            var cached_follow_stocks = $.omsGetLocalJsonData('stock_follow', user_id, false);
            if(cached_follow_stocks){
                cached_follow_stocks = cached_follow_stocks.filter(function(cached_stock){
                    return cached_stock.stock_id != stock.stock_id;
                });
                $.omsUpdateLocalJsonData('stock_follow', user_id, cached_follow_stocks);
            }

             me.find('.nothing-nothing').toggleClass('nothing', !me.find('[rows-body] tr').length);
        });

        function validateRowChange(row){
            var stock = row.getCoreData();
            var limit = row.is('.limit');
            var price = getRowSuitablePrice(row);
            var volume = +row.find('[name=volume]').val() || 0;
            var max_cash = stock.max_cash || 0;
            var max_sell_volume = stock.enable_sell_volume || 0;

            // 改版后的前端风控判断
            var product = window.PRODUCT;
            if ('buy' == direction) {
                var total_amount = 0;
                var enable_sell_volume = 0;
                var market_value = 0;
                window.position_realtime && window.position_realtime.forEach(function(e){
                    if (e.stock_id === stock.stock_id && e.product_id == product.id) {

                        // market_value = e.market_value;
                        // total_amount = e.total_amount;
                        enable_sell_volume = e.enable_sell_volume;
                    }
                });
                var all_market_value = 0;
                window.risk_position[product.id].data.forEach(function(el){
                    if (el.stock_id == stock.stock_id) {
                        total_amount = el.total_amount;
                        market_value = el.market_value;
                    }
                    all_market_value += el.market_value;
                });

                var obj = riskCheck.checkRules({
                    product_id: product.id,                             // 产品id， id
                    // 交易数据 form_data
                    trade_direction: 1,                                 // 交易方向，1买入 2卖出 trade_direction
                    trade_mode: (true == limit) ? 1 : 2,                // 1限价／2市价  trade_mode
                    volume: volume,                                     // 交易数量
                    price: price,                                       // 限价金额
                    surged_limit: price,                                // 涨停价 price已经做了处理了
                    decline_limit: price,                               // 跌停价 price已经做了处理了
                    stock_code: stock.stock_id,                         // 股票code，包含“.SZ”,比较的时候最好都进行小写转换
                    stock_name: stock.stock_info.stock_name,            // 股票名称，用于判断st股票
                    // 产品的数据 product
                    total_assets: product.runtime.total_assets,         // 资产总值 runtime.total_assets
                    enable_cash: product.runtime.enable_cash,           // 可用资金 runtime.enable_cash
                    security: all_market_value,                         // 持仓市值 runtime.security 改为 all_market_value
                    net_value: product.runtime.net_value,               // 当日净值 runtime.net_value
                    // 持仓数据
                    market_value: market_value,                         // 本股票持仓市值 //window.position_realtime里面有
                    total_amount: total_amount,                         // 该股票当前持仓数
                    enable_sell_volume: max_sell_volume                 // 该股票能卖的数量
                });
                if (0 !== obj.code) {
                    row.addClass('error').find('.error-msg').text(obj.msg + ' 当前可买数量：'+ obj.freeNum + '');
                    return;
                }
            }
            if ('sell' == direction) {
                var obj = riskCheck.checkRules({
                    product_id: product.id,                             // 产品id， id
                    // 交易数据 form_data
                    trade_direction: 2,                                 // 交易方向，1买入 2卖出
                    volume: volume,                                     // 交易数量
                    enable_sell_volume: max_sell_volume                 // 该股票能卖的数量
                });
                if (0 !== obj.code) {
                    row.addClass('error').find('.error-msg').text('超出该股票最大可卖'+ obj.freeNum + '股限制');
                    return;
                }
            }

            row.removeClass('error').find('.error-msg').text('');
        }

        function checkedRowsChange(){
            var new_checked_state = me.find('[rows-body] tr').toArray().map(function(tr){
                return $(tr).is('.checked') ? 'checked' : 'unchecked';
            }).join(':');

            if(new_checked_state != checked_state){
                checked_state = new_checked_state;
                distributeTradeData(data);
            }
        }

        function distributeTradeData(data){
            var balckList_rows = me.find('tr.checked.blackList');
            balckList_rows.each(function(i){
                $(this).addClass('error').find('.error-msg').text($(this).getCoreData().blackListMsg);
            })

            var checked_rows = me.find('tr.checked').not(".blackList");
            if(!checked_rows.length){return;}

            var last_rows_count = checked_rows.length; //剩余未分配资金行数，用于购买时 动态分发资金配额

            var each_cash = Math.max((data.balance_amount_diff=data.balance_amount*data.original_range)/checked_rows.length,0); //for buy
            var total_last_cash = 0; //for buy

            var total_sell_position = 0; //for sell
            var total_sell_cash = 0;

            // 可用资金最小的放在最前，优先配置资金
            var sorted_checked_trs = checked_rows.toArray().sort(function(tr1,tr2){
                var stock1 = $(tr1).getCoreData();
                var stock2 = $(tr2).getCoreData();
                return stock1.max_cash <= stock2.max_cash ? -1 : 1;
            });

            sorted_checked_trs.forEach(function(tr){
                last_rows_count--;
                var row = $(tr);
                var stock = row.getCoreData();
                var limit = row.is('.limit');
                var max_cash = Math.min(+stock.max_cash || 0, each_cash);
                var price = getRowSuitablePrice(row);

                if(direction=='buy'){
                    var volume = price ? max_cash/price : 0;
                    volume = stock.use_volume = correctVolume(volume,stock);

                    var cost = price*volume;
                    var last_cash = each_cash - (cost||0);

                    // 资金不重新分配 算法
                    // total_last_cash += last_cash;

                    // 剩余资金重新分配到 last_rows 算法
                    if(last_rows_count>0){
                        each_cash += last_cash/last_rows_count;
                    }else{
                        total_last_cash = last_cash;
                    }

                    row.find('[name=volume]').val(volume);
                }

                if(direction=='sell'){
                    var volume = data.original_range * stock.enable_sell_volume;
                    volume = stock.use_volume = correctVolume(volume,stock);
                    row.find('[name=volume]').val(volume);
                }

                updateRowTargetPosition(row);

                if(direction=='sell'){
                    total_sell_position += stock.diff_position;
                    total_sell_cash += volume*price;
                }

                validateRowChange(row);
            });

            if(direction=='buy'){
                var real_cost = Math.max(data.balance_amount_diff - total_last_cash,0);
                data.real_cost=real_cost;
            }

            if(direction=='sell'){
                data.total_sell_position = total_sell_position;
                data.total_sell_cash = total_sell_cash;
            }

            $(window).trigger({type:'order_create:multi_order:real_cost_change:'+direction});
        }

        function gatherTradeData(){
            var checked_rows = me.find('tr.checked');
            if(!checked_rows.length){return;}

            var total_cost_cash = 0; //for buy

            var total_sell_position = 0; //for sell
            var total_sell_cash = 0;

            checked_rows.each(function(){
                var row = $(this);
                var stock = row.getCoreData();
                var limit = row.is('.limit');

                var volume = stock.use_volume = +row.find('[name=volume]').val() || 0;
                var price = getRowSuitablePrice(row);

                updateRowTargetPosition(row);

                if(direction=='buy'){
                    var cost = volume*price;
                    total_cost_cash += cost;
                }

                if(direction=='sell'){
                    total_sell_position += stock.diff_position;
                    total_sell_cash += volume*price;
                }
            });

            if(direction=='buy'){
                data.real_cost = Math.max(total_cost_cash,0);
            }

            if(direction=='sell'){
                data.total_sell_position = total_sell_position;
                data.total_sell_cash = total_sell_cash;
            }

            $(window).trigger({type:'order_create:multi_order:real_cost_change:'+direction});
        }

        function correctVolume(volume,stock){
            if(direction=='buy'){
                volume = Math.floor(volume/100)*100;
            }

            if(direction=='sell'){
                if( volume==+stock.enable_sell_volume ){return volume;}
                volume = Math.round(volume/100)*100;
                volume = Math.min(volume,+stock.enable_sell_volume);
            }

            return volume;
        }

        function updateRowTargetPosition(row){
            var stock = $(row).getCoreData();

            if(direction=='buy'){
                var old_market_value = stock.old_market_value = +stock.market_value || 0;
                var new_market_value = stock.new_market_value = stock.use_price*stock.use_volume;
                var target_total_market_value = stock.target_total_market_value = old_market_value+new_market_value;
                var target_position = stock.target_position = data.total_assets ? target_total_market_value/data.total_assets : 0;
                row.find('[data-src*=target_position]').render({target_position:target_position});
            }

            if(direction=='sell'){
                var old_position = stock.old_position = +stock.weight || 0;
                var old_volume = stock.old_volume = +stock.enable_sell_volume || 0;
                var diff_volume = stock.diff_volume = +stock.use_volume || 0;
                var last_volume = stock.last_volume = old_volume - diff_volume;
                var row_range = stock.row_range = old_volume ? diff_volume/old_volume : 0;
                var diff_position = stock.diff_position = old_position * row_range;
                var target_position = stock.target_position = old_position - diff_position;
                row.find('[data-src*=target_position]').render({target_position:target_position});
            }
        }

        function getRowSuitablePrice(row){
            var limit = row.is('.limit');
            var stock = $(row).getCoreData();
            var input_price = stock.input_price = +row.find('[name=price]').val() || 0;
            var prev_close_price = +$.pullValue(stock,'stock_info.prev_close_price',0);
            // var stop_top_price = stock.stop_top_price = prev_close_price*1.095;
            // var stop_down_price = stock.stop_down_price = prev_close_price*0.905;
            var stop_top_price = stock.stop_top_price = prev_close_price*1.1;
            var stop_down_price = stock.stop_down_price = prev_close_price*0.9;
            if(direction=='buy'){
                stock.use_price = limit ? input_price : stop_top_price;
                return stock.use_price;
            }
            if(direction=='sell'){
                stock.use_price = limit ? input_price : stop_down_price;
                return stock.use_price;
            }
        }

        function getStockList(){
            reset();
            renderStocksList( stock_list = [] );
            direction=='buy' ? getFollowListStocks() : getPositionStocks();

            function getFollowListStocks(){
                var url = (window.REQUEST_PREFIX||'')+'/user/stock-follow/get';

                var cached_follow_stocks = $.omsGetLocalJsonData('stock_follow', user_id, false);

                cached_follow_stocks
                    ? (stock_list = cached_follow_stocks, getPositionStocks())
                    : $.getJSON(url).done(function(res){

                        stock_list = stock_list.concat($.pullValue(res,'data.list',[]).map(function(stock_id){
                            return {stock_id:stock_id,follow:true};
                        }).reverse());

                        //缓存 stock_follow 的信息
                        $.omsCacheLocalJsonData('stock_follow', user_id, stock_list);

                        res.code==0 && getPositionStocks();
                        !res.code==0 && $.failNotice(url,res);

                    }).fail($.failNotice.bind(null,url));
            }

            function getPositionStocks(){
                var url = (window.REQUEST_PREFIX||'')+'/oms/api/position_realtime?product_id='+PRODUCT.id;

                var last_loading_timestamp = new Date().valueOf();
                me.attr('last_loading_timestamp',last_loading_timestamp);
                me.find('.loading-loading').addClass('loading');
                me.find('.nothing-nothing').removeClass('nothing');

                var cached_postion = $.omsGetLocalJsonData('position_realtime', PRODUCT.id, false);
                var position_stocks;

                cached_postion
                    ? (position_stocks = cached_postion, displayStocksList())
                    : $.getJSON(url).done(function(res){
                        position_stocks = $.pullValue(res,'data',[]);
                        displayStocksList();
                        !res.code==0 && $.failNotice(url,res);
                    }).fail($.failNotice.bind(null,url));

                function displayStocksList(){
                    var product  = PRODUCT;
                    // 计算可用余额
                    // 空仓下的总可用资金
                    var total_cash = riskCheck.getMaxCash({
                        total_assets: product.runtime.total_assets,
                        net_value: product.runtime.net_value,
                        product_id: product.id
                    });
                    // 剩余可用资金 ＝ 空仓下的总可用资金 － 股票资产
                    // var max_cash = total_cash - product.runtime.security;

                    // 剩余可用资金 ＝ 空仓下的总可用 － 风控里面的所有该产品的各个股票的market_value
                    var stock_market_value = 0;
                    window.risk_position[product.id].data.forEach(function(e){
                        stock_market_value += Number(e.market_value);
                    });
                    var max_cash = total_cash - stock_market_value;
                    total_max_cash = max_cash;
                    // max_cash = Math.min(max_cash, total_max_cash);
                    // // stock.max_cash = max_cash;
                    // stock_list.forEach(function(stock){
                    //     stock.max_cash = max_cash;
                    // });
                    $(window).trigger({
                        type:'risk_cash_check:success',
                        res_data:{
                            product_cash: {
                                max_cash: max_cash
                            }
                        }
                    });

                    if(direction == 'buy'){
                        //合并自选股的持仓数据
                        combinePositionStocksInfo(stock_list,position_stocks);
                        stock_list.length ? mergeFreshStocksInfo(stock_list).then(render) : render();
                        // checkMultiRiskCash(stock_list,function(){
                        //     stock_list.length ? mergeFreshStocksInfo(stock_list).then(render) : render();
                        // });
                        return;
                    }

                    if(direction == 'sell'){
                        stock_list = excludeFutures(position_stocks);
                        stock_list.length ? mergeFreshStocksInfo(stock_list).then(render) : render();
                        // checkMultiRiskCash(stock_list,function(){
                        //     stock_list.length ? mergeFreshStocksInfo(stock_list).then(render) : render();
                        // });
                        return;
                    }

                    function render(){
                        if(last_loading_timestamp!=me.attr('last_loading_timestamp')){return;}
                        me.find('.loading-loading').removeClass('loading');
                        renderStocksList(stock_list);

                        //ready broadcast
                        me.trigger('order_create:multi_order:ready');
                        me.trigger('order_create:multi_order:'+direction+':ready');

                        me.find('.nothing-nothing').toggleClass('nothing',!stock_list.length);
                    }
                }
            }
        }

        function combinePositionStocksInfo(target_stocks, position_stocks){
            target_stocks.forEach && target_stocks.forEach(function(stock){
                position_stocks.forEach && position_stocks.forEach(function(position){
                    if(stock.stock_id == position.stock_id){
                        $.extend(stock,position);
                    }
                });
            });
        }

        // function checkMultiRiskCash(stocks,callback){
        //     return;
        //     // TODO 废弃后端风控，采用新的逻辑处理
        //     var url = (window.REQUEST_PREFIX||'')+'/oms/helper/risk_cash_check/'+PRODUCT.id;
        //
        //     //bugfix but i dont know why
        //     if(!stocks.map || !stocks.length){return callback && callback();}
        //
        //     var stock_ids = stocks.map(function(stock){
        //         return stock.stock_id;
        //     });
        //     $.get(url,{multi: stock_ids}).done(function(res){
        //         if(res.code==0){
        //             var res_stocks = $.pullValue(res,'data.stock_cash',{});
        //             stocks.forEach(function(stock){
        //                 var res_stock = res_stocks[stock.stock_id];
        //                 $.pullValue(res_stock,'code',1) != 0
        //                     ? $.omsAlert(stock.stock_id + $.pullValue(res_stock,'msg',' 股票最大可买获取失败！'),false)
        //                     : (stock.max_cash = $.pullValue(res_stock,'data.max_cash',0));
        //             });
        //             callback && callback();
        //             $(window).trigger({type:'risk_cash_check:success',res_data:res.data});
        //         }else{
        //             $.failNotice(url,res);
        //         }
        //     }).fail($.failNotice.bind(null,url));
        // }

        function renderStocksList(list){
            var product_id = window.PRODUCT.id;
            list.forEach(function(e){
                var obj = riskCheck.getTargetStatus({
                    product_id: product_id,
                    stock_code: e.stock_info.stock_id,
                    stock_name: e.stock_info.stock_name
                });
                if (0 === obj.status) {
                    e.blackList = false;
                    e.blackListMsg = obj.blackListMsg;
                    e.stockPoolName = obj.stockPoolName;
                }else{
                    e.blackList = true;
                    e.blackListMsg = obj.blackListMsg;
                    e.stockPoolName = obj.stockPoolName;
                }
                // 新增股票时，前端风控
                var product  = window.PRODUCT;
                // 计算可用余额
                // 新增股票的总可用资金
                var total_amount = 0;
                var enable_sell_volume = 0;
                var market_value = 0;
                var stock = e.stock_info;
                window.position_realtime && window.position_realtime.forEach(function(e){
                    if (e.stock_id === stock.stock_id && e.product_id == product.id) {
                        // market_value = e.market_value;
                        // total_amount = e.total_amount;
                        enable_sell_volume = e.enable_sell_volume;
                    }
                });
                var all_market_value = 0;
                window.risk_position && window.risk_position[product.id].data.forEach(function(el){
                    if (el.stock_id == stock.stock_id) {
                        total_amount = el.total_amount;
                        market_value = el.market_value;
                    }
                    all_market_value += el.market_value;
                });
                var obj = riskCheck.checkRules({
                    product_id: product.id,                             // 产品id， id
                    // 交易数据 form_data
                    trade_direction: 1,                                 // 交易方向，1买入 2卖出 trade_direction
                    trade_mode: 1,                                      // 1限价／2市价  trade_mode
                    volume: 0,                                          // 交易数量
                    price: 1,                                       // 限价金额
                    surged_limit: 1,                                // 涨停价 price已经做了处理了
                    decline_limit: 1,                               // 跌停价 price已经做了处理了
                    stock_code: e.stock_info.stock_id,                         // 股票code，包含“.SZ”,比较的时候最好都进行小写转换
                    stock_name: e.stock_info.stock_name,            // 股票名称，用于判断st股票
                    // 产品的数据 product
                    total_assets: product.runtime.total_assets,         // 资产总值 runtime.total_assets
                    enable_cash: product.runtime.enable_cash,           // 可用资金 runtime.enable_cash
                    security: all_market_value,                 // 持仓市值 runtime.security 改为 all_market_value
                    net_value: product.runtime.net_value,               // 当日净值 runtime.net_value
                    // 持仓数据
                    market_value: market_value,                         // 本股票持仓市值 //window.position_realtime里面有
                    total_amount: total_amount,                         // 该股票当前持仓数
                    enable_sell_volume: 0                               // 该股票能卖的数量
                });
                // 剩余可用资金 ＝ 空仓下的总可用资金 － 股票资产
                var max_cash = Math.max(obj.max_cash - market_value, 0);
                max_cash = Math.min(max_cash, total_max_cash);
                // total_max_cash = max_cash;
                e.max_cash = max_cash;
            });
            me.renderTable(list);
            me.find('[rows-body] tr').each(function(){
                var row = $(this);
                resetRenderedRow(row);
            });
        }

        //动态更新持仓数据
        function updatePositionList(position_stocks){
            if(!position_stocks || !position_stocks.length){return;}

            var rows = me.find('[rows-body] tr');

            position_stocks.forEach(function(position_stock){
                rows.each(function(){
                    var row = $(this);
                    var row_stock = row.getCoreData();
                    if(position_stock.stock_id == row_stock.stock_id){
                        $.extend(row_stock,position_stock);
                        row.render(row_stock);
                        resetRenderedRow(row);
                    }
                });
            });
        }

        function resetRenderedRow(row){
            var stock = row.getCoreData();
            row.toggleClass('position',!!stock.total_amount);

            if(direction=='buy'){
                if(stock.max_cash<=0){
                    row.addClass('disabled').addClass('error').removeClass('limit').removeClass('checked');
                    if (stock.blackListMsg) {
                        row.find('.error-msg').text(stock.blackListMsg);
                    }else{
                        row.find('.error-msg').text('根据单票持仓风控限制，当前可用余额为 '+numeral(stock.max_cash).format('0,0.00'));
                    }
                    row.find('input[type=checkbox]').prop('checked',false);
                    row.find('input').attr('disabled','true');
                }
            }

            if(direction=='sell'){
                if(stock.enable_sell_volume<=0){
                    row.addClass('disabled').addClass('error').removeClass('limit').removeClass('checked');
                    row.find('.error-msg').text('该股票当前可卖数量为 '+numeral(stock.enable_sell_volume));
                    row.find('input[type=checkbox]').prop('checked',false);
                    row.find('input').attr('disabled','true');
                }
            }

            row.find('[name=volume]').change();
        }

        function excludeFutures(list){
            //排除期货，期货 stock_id 是 708090
            return (list && list.map) ? list.filter(function(stock){
                return (stock.stock_id!=708090)
            }) : [];
        }

        function reset(){
            me.find('input[type=checkbox]').prop('checked',false).change();
        }
    }).call(document.scripts[document.scripts.length-1].parentNode);
    </script>
</div>
