<!--
批量买入／卖出 表格
trigger:
create_order:multi_stocks:delete_stock //自己给自己传的事件 告知删除股票
'create_order:multi_stocks:'+direction+':max_cash:changed' //最大可用资金变化，footer部分刷新
risk_cash_check:success // 自己给自己传的事件
'order_create:multi_order:real_cost_change:'+direction //给foot传值，提供给foot计算显示
'order_create:multi_order:real_cost_change:'+direction //给foot传值，提供给foot计算显示
risk_cash_check:success // 自己给自己传的事件
order_create:multi_order:ready //已经没地方监听该事件了，没啥用
'order_create:multi_order:'+direction+':ready' //已经没地方监听该事件了，没啥用

on:
multi_products:head:updated:checked_one //获取产品信息，使能控制块，获取股票列表
multi_products:head:updated:checked_notone //禁止用户使用
load
'order_create:nav:multi-stocks:'+direction //菜单切换到多股票下单，开始获取数据
add_multi_hand_order:success //
'order_create:multi_order:data_change:'+direction //foot计算完购买数据后触发该事件返回数据， 使得表格数据变化
product:position:updated // 持仓列表更新后，需要更新单产品多股票列表的持仓
risk_cash_check:success // 自己给自己传的事件 风控校验通过后触发告知最大可用资金变化的事件

create_order:multi_stocks:add_stock //添加自选股之后，更新股票列表
create_order:multi_stocks:delete_stock //自己给自己传的事件 告知删除股票 随后删除本地缓存

 -->

<div style="max-height: 400px; overflow-y: auto; overflow-x: hidden;margin-top: 5px;padding-right: 20px;">

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

            <th>
                <div class="display-marketA">是否限价</div>
                <div class="display-marketH" style="display: none;">报价方式</div>
            </th>
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
                    <div if="market|equalString:marketA" class="checked-visible">
                        <label><input type="checkbox" name="trade_mode" class="limit">限价</label>
                    </div>
                    <div if="market|equalString:marketH" class="checked-visible">
                        <select name="marketH_trade_mode">
                            <option value="5">增强限价</option>
                            <option value="4">竞价限价</option>
                        </select>
                    </div>
                </td>
                <td style="width:18%;">
                    <div if="market|equalString:marketA" class="checked-visible">
                        <span class="limit-hide">市价</span>
                        <input class="limit-show checked-visible__input" data-type="decimal" type="number" name="price" data-reg="[^\d.]" data-src="stock_info.last_price|numeral:0.000" render-once>
                    </div>
                    <div if="market|equalString:marketH" class="checked-visible">
                        <input type="number" name="marketH_price" data-src="stock_info.last_price|numeral:0.000" render-once>
                    </div>
                </td>
                <td>
                    <div class="checked-visible">
                        <input type="number" name="volume" class="checked-visible__input" data-reg="[^\d]" data-type="integer">
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
        var market = 'marketA';

        var product;
        //数量（股）输入数字的判断
        me.on('keydown', '.checked-visible__input', function (e) {
          var data_value = new RegExp($(this).attr('data-reg'));
          if ('integer' == $(this).attr('data-type')) {
            if (110 == e.keyCode || 190 == e.keyCode) {
              e.preventDefault();
              return false;
            }
          }
        })
        me.on('keyup', '.checked-visible__input', function (e) {
          if ($(this).val().indexOf('.') < 0 && '' != $(this).val()) {//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
            $(this).val(parseFloat($(this).val()));
          }
        })

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

        me.on('click','[rows-head] input.check-rows',function(){
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
        }).on('keyup','[name=volume],[name=price],[name=marketH_price]',function(){
            var row = $(this).closest('tr');
            validateRowChange(row);
            gatherTradeData();
        });

        $(window).on('multi_products:head:updated:checked_one',function(event){
            var new_product = event.product;
            // if(new_product!==product){
                //不同组合被选中
                product = new_product;
                getStockList();
            // }else{
            //     //相同组合被再次选中
            //
            // }
            enableSection();
        }).on('multi_products:head:updated:checked_notone',function(){
            disableSection();
        });
        // 切换市场时，重新获取自选股数据
        $(window).on('order_create:market:changed', function(event){
            market = event.market;
            if ('marketA' == market) {
                $('.display-marketA').show();
                $('.display-marketH').hide();
            }else if('marketH' == market){
                $('.display-marketA').hide();
                $('.display-marketH').show();
            }
            product && getStockList();
        })

        $(window).on('load',function(){
            //清空缓存区的自选股列表
            direction == 'buy' && $.omsUpdateLocalJsonData('stock_follow',user_id);
        }).on('order_create:nav:multi-stocks:'+direction,function(){
            product && getStockList();
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
            $(window).trigger({type:'create_order:multi_stocks:'+direction+':max_cash:changed',max_cash:product_max_cash});
        });

        direction=='buy' && $(window).on('create_order:multi_stocks:add_stock',function(event){
            var stock = event.stock;

            //新增，更新本地缓存
            var cached_follow_stocks = $.omsGetLocalJsonData('stock_follow', user_id, false);
            if(cached_follow_stocks){
                cached_follow_stocks.push($.extend(stock,{follow:true}));
                $.omsUpdateLocalJsonData('stock_follow', user_id, cached_follow_stocks);
            }

            combinePositionStocksInfo([stock], $.omsGetLocalJsonData('position_realtime', product.id, []))

            // 新增股票时，前端风控
            // var product = PRODUCT;
            // 计算可用余额
            // 新增股票的总可用资金
            var market_value = 0;
            var total_amount = 0;
            var enable_sell_volume = 0;
            var stock_position_num = 0; //该产品已持仓该股票数量
            var stock_entrust_num = 0; //该产品已委托该股票数量
            var stock_total_share = Infinity; //该股票总股票数量，即总股本 //此处计算可用余额时不要过举牌风控，所以，填Infinity。
            var stock_all_position_num = 0; //所有的持仓汇总该股票数量
            var stock_all_entrust_num = 0; //所有的委托汇总该股票数量
            var stock_entrust_buy_num = 0; //该产品已委托买入数量
            var stock_entrust_sell_num = 0; //该产品已委托卖出数量
            var stock_all_entrust_buy_num = 0; //所有的产品已委托买入数量
            var stock_all_entrust_sell_num = 0; //所有的产品已委托卖出数量
            window.position_realtime && window.position_realtime.forEach(function(e){
                if (e.stock_id === stock.stock_id && e.product_id == product.id) {

                    // market_value = e.market_value;
                    // total_amount = e.total_amount;
                    enable_sell_volume = e.enable_sell_volume;

                    stock_position_num += Number(e.total_amount); // 得到该产品已持仓该股票数量
                }

                // 联合风控需要遍历所有的组合
                if (e.stock_id === stock.stock_id) {
                    stock_all_position_num += Number(e.total_amount);
                }
            });
            var all_market_value = 0;
            window.risk_position[product.id].data.forEach(function(el){
                if (el.stock_id == stock.stock_id) {
                    total_amount = el.total_amount;
                    market_value = el.market_value;
                }
                all_market_value += el.market_value - 0;
            });

            window.entrust_info.forEach(function(el){
                if (el.stock.code == stock.stock_id && el.product_id == product.id &&
                    (![4, 5, 7, 8, 9].some(function(ele){
                        return el.status == ele;
                    }) || (el.status == 4 && !/1|2/.test( el.cancel_status )))
                ) {
                    if (1 == el.entrust.type) {
                        stock_entrust_num += el.entrust.amount - el.deal.amount; // 得到该产品已委托该股票数量
                        stock_entrust_buy_num = el.entrust.amount - el.deal.amount; // 得到该产品已委托买入数量
                    }else if (2 == el.entrust.type){
                        stock_entrust_sell_num = el.entrust.amount - el.deal.amount; // 得到该产品已委托卖出数量
                    }
                }

                // 联合风控需要遍历所有的组合
                if (el.stock.code == stock.stock_id &&
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

            var trading_unit = 100;
            if (stock.stock_info && stock.stock_info.trading_unit) {
                trading_unit = stock.stock_info.trading_unit;
            }

            var obj = riskCheck.checkRules({
                trading_unit: trading_unit,
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
                enable_sell_volume: 0,                               // 该股票能卖的数量

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

            // 新增自定义股票时需要得到新的股票的可用资金等信息
            mergeFreshStocksInfo([stock]).then(function(){
                stock.follow = true;
                stock.market = market;
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

        // 批量购买的规则鉴定
        function validateRowChange(row){
            var stock = row.getCoreData();
            if (!stock.stock_info) {
                row.addClass('error').find('.error-msg').text('股票'+ stock.stock_id + '所含信息不足');
                return;
            }
            var limit = row.is('.limit');
            if ('marketH' == market) {
                limit = true;
            }
            var price = getRowSuitablePrice(row);
            var volume = +row.find('[name=volume]').val() || 0;
            var max_cash = stock.max_cash || 0;
            var max_sell_volume = stock.enable_sell_volume || 0;
            var trading_unit = 100;
            if (stock.stock_info && stock.stock_info.trading_unit) {
                trading_unit = stock.stock_info.trading_unit;
            }

            var stock_position_num = 0; //该产品已持仓该股票数量
            var stock_entrust_num = 0; //该产品已委托该股票数量
            var stock_total_share = stock.total_share_capital; //该股票总股票数量，即总股本
            var stock_all_position_num = 0; //所有的持仓汇总该股票数量
            var stock_all_entrust_num = 0; //所有的委托汇总该股票数量
            var stock_entrust_buy_num = 0; //该产品已委托买入数量
            var stock_entrust_sell_num = 0; //该产品已委托卖出数量
            var stock_all_entrust_buy_num = 0; //所有的产品已委托买入数量
            var stock_all_entrust_sell_num = 0; //所有的产品已委托卖出数量

            var market_value = 0;
            var total_amount = 0;
            var enable_sell_volume = 0;

            window.position_realtime.forEach(function(e){
                if (e.stock_id === stock.stock_id && e.product_id == product.id) {
                    // market_value = e.market_value;
                    // total_amount = e.total_amount;
                    enable_sell_volume = e.enable_sell_volume;

                    stock_position_num += Number(e.total_amount); // 得到该产品已持仓该股票数量
                }

                // 联合风控需要遍历所有的组合
                if (e.stock_id === stock.stock_id) {
                    stock_all_position_num += Number(e.total_amount);
                }
            });
            var all_market_value = 0;
            window.risk_position[product.id].data.forEach(function(el){
                if (el.stock_id == stock.stock_id) {
                    total_amount = el.total_amount;
                    market_value = el.market_value;
                }
                all_market_value += el.market_value - 0;
            });

            window.entrust_info.forEach(function(el){
                if (el.stock.code == stock.stock_id && el.product_id == product.id &&
                    (![4, 5, 7, 8, 9].some(function(ele){
                        return el.status == ele;
                    }) || (el.status == 4 && !/1|2/.test( el.cancel_status )))
                ) {
                    if (1 == el.entrust.type) {
                        stock_entrust_num += el.entrust.amount - el.deal.amount; // 得到该产品已委托该股票数量
                        stock_entrust_buy_num = el.entrust.amount - el.deal.amount; // 得到该产品已委托买入数量
                    }else if (2 == el.entrust.type){
                        stock_entrust_sell_num = el.entrust.amount - el.deal.amount; // 得到该产品已委托卖出数量
                    }
                }

                // 联合风控需要遍历所有的组合
                if (el.stock.code == stock.stock_id &&
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
            });

            // 改版后的前端风控判断
            if ('buy' == direction) {
                var obj = riskCheck.checkRules({
                    trading_unit: trading_unit,
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
                    security: all_market_value,                         // 持仓市值 runtime.security 改为all_market_value
                    net_value: product.runtime.net_value,               // 当日净值 runtime.net_value
                    // 持仓数据
                    market_value: market_value,                         // 本股票持仓市值 //window.position_realtime里面有
                    total_amount: total_amount,                         // 该股票当前持仓数
                    enable_sell_volume: max_sell_volume,                // 该股票能卖的数量

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
                if (0 !== obj.code) {
                    var tmpNum = Math.max(Math.floor(obj.freeNum / 100) * 100, 0);
                    row.addClass('error').find('.error-msg').text(obj.msg + ' 当前可买数量：'+ tmpNum + '');
                    return;
                }
            }
            if ('sell' == direction) {
                var obj = riskCheck.checkRules({
                    trading_unit: trading_unit,
                    product_id: product.id,                             // 产品id， id
                    // 交易数据 form_data
                    trade_direction: 2,                                 // 交易方向，1买入 2卖出
                    volume: volume,                                     // 交易数量
                    enable_sell_volume: max_sell_volume,                // 该股票能卖的数量

                    // 对敲
                    stock_entrust_buy_num: stock_entrust_buy_num, //该产品已委托买入数量
                    stock_entrust_sell_num: stock_entrust_sell_num, //该产品已委托卖出数量

                    // 联合风控：对敲
                    stock_all_entrust_buy_num: stock_all_entrust_buy_num, //所有的产品已委托买入数量
                    stock_all_entrust_sell_num: stock_all_entrust_sell_num, //所有的产品已委托卖出数量
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
            var product_id = data.id;
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
                if ('marketH' == market) {
                    limit = true;
                }
                var max_cash = Math.min(+stock.max_cash || 0, each_cash);
                var price = getRowSuitablePrice(row);

                if(direction=='buy'){

                    var volume = Math.max(riskCheck.checkFee(stock.stock_id, max_cash, price, product_id), 0);

                    // var volume = price ? max_cash/price : 0;
                    volume = stock.use_volume = correctVolume(volume,stock);
                    var cost = riskCheck.calFeeTotal(stock.stock_id, max_cash, price, product_id, volume);

                    // var cost = price*volume;
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
                if ('marketH' == market) {
                    limit = true;
                }

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
            var trading_unit = 100;
            if (stock.stock_info && stock.stock_info.trading_unit) {
                trading_unit = stock.stock_info.trading_unit;
            }

            if(direction=='buy'){
                volume = Math.floor(volume/trading_unit)*trading_unit;
            }

            if(direction=='sell'){
                if( volume==+stock.enable_sell_volume ){return volume;}
                volume = Math.round(volume/trading_unit)*trading_unit;
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
            if ('marketH' == market) {
                limit = true;
            }
            var stock = $(row).getCoreData();
            var input_price = stock.input_price = +row.find('[name=price]').val() || 0;
            if ('marketH' == market) {
                input_price = stock.input_price = +row.find('[name=marketH_price]').val() || 0;
            }
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

                        if( environmentChanged() ){return;}//如果已经切换到多策略模式，或者策略id已经切换，抛弃结果

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
                var url = (window.REQUEST_PREFIX||'')+'/oms/api/position_realtime?product_id='+$.pullValue(product,'id');

                var last_loading_timestamp = new Date().valueOf();
                me.attr('last_loading_timestamp',last_loading_timestamp);
                me.find('.loading-loading').addClass('loading');
                me.find('.nothing-nothing').removeClass('nothing');

                var cached_postion = $.omsGetLocalJsonData('position_realtime', $.pullValue(product,'id'), false);
                var position_stocks;

                cached_postion
                    ? (position_stocks = cached_postion, displayStocksList())
                    : $.getJSON(url).done(function(res){
                        if(!product){return;}//如果已经切换到多策略模式，抛弃

                        position_stocks = $.pullValue(res,'data',[]);
                        displayStocksList();
                        !res.code==0 && $.failNotice(url,res);
                    }).fail($.failNotice.bind(null,url));

                function displayStocksList(){
                    if (!product.runtime) {
                      return;
                    }
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

                        // 购买时，显示自定义股票
                        stock_list.length ? mergeFreshStocksInfo(stock_list).then(render) : render();
                        // checkMultiRiskCash(stock_list,function(){
                        //     stock_list.length ? mergeFreshStocksInfo(stock_list).then(render) : render();
                        // });
                        return;
                    }

                    if(direction == 'sell'){
                        stock_list = excludeFutures(position_stocks);

                        // 卖出时，显示自定义股票
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
                        me.trigger('order_create:multi_order:ready');
                        me.trigger('order_create:multi_order:'+direction+':ready');

                        me.find('.nothing-nothing').toggleClass('nothing',!stock_list.length);
                    }
                }
            }
        }

        //检测环境是否发生变化，主要是 product_id
        function environmentChanged(){
            return false;
        }

        //记住当前环境，主要是 product_id
        function memorizeEnvironment(){

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
        //     var url = (window.REQUEST_PREFIX||'')+'/oms/helper/risk_cash_check/'+$.pullValue(product,'id');
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

        // 批量下单，渲染每一行
        function renderStocksList(list){
            var product_id = product.id;
            list.forEach(function(e){
                if (!e.stock_info) {
                    return;
                }
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
                // var product  = window.PRODUCT;
                // 计算可用余额
                // 新增股票的总可用资金
                var market_value = 0;
                var total_amount = 0;
                var enable_sell_volume = 0;
                var stock = e.stock_info;

                var stock_position_num = 0; //该产品已持仓该股票数量
                var stock_entrust_num = 0; //该产品已委托该股票数量
                var stock_total_share = stock.total_share_capital; //该股票总股票数量，即总股本
                var stock_all_position_num = 0; //所有的持仓汇总该股票数量
                var stock_all_entrust_num = 0; //所有的委托汇总该股票数量
                var stock_entrust_buy_num = 0; //该产品已委托买入数量
                var stock_entrust_sell_num = 0; //该产品已委托卖出数量
                var stock_all_entrust_buy_num = 0; //所有的产品已委托买入数量
                var stock_all_entrust_sell_num = 0; //所有的产品已委托卖出数量

                window.position_realtime && window.position_realtime.forEach(function(e){
                    if (e.stock_id === stock.stock_id && e.product_id == product.id) {
                        // market_value = e.market_value;
                        // total_amount = e.total_amount;
                        enable_sell_volume = e.enable_sell_volume;

                        stock_position_num += Number(e.total_amount); // 得到该产品已持仓该股票数量
                    }

                    // 联合风控需要遍历所有的组合
                    if (e.stock_id === stock.stock_id) {
                        stock_all_position_num += Number(e.total_amount);
                    }
                });
                var all_market_value = 0;
                window.risk_position[product.id].data.forEach(function(el){
                    if (el.stock_id == stock.stock_id) {
                        total_amount = el.total_amount;
                        market_value = el.market_value;
                    }
                    all_market_value += el.market_value - 0;
                });

                window.entrust_info.forEach(function(el){
                    if (el.stock.code == e.stock_id && el.product_id == product.id &&
                        (![4, 5, 7, 8, 9].some(function(ele){
                            return el.status == ele;
                        }) || (el.status == 4 && !/1|2/.test( el.cancel_status )))
                    ) {
                        if (1 == el.entrust.type) {
                            stock_entrust_num += el.entrust.amount - el.deal.amount; // 得到该产品已委托该股票数量
                            stock_entrust_buy_num = el.entrust.amount - el.deal.amount; // 得到该产品已委托买入数量
                        }else if (2 == el.entrust.type){
                            stock_entrust_sell_num = el.entrust.amount - el.deal.amount; // 得到该产品已委托卖出数量
                        }
                    }

                    // 联合风控需要遍历所有的组合
                    if (el.stock.code == e.stock_id &&
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

                var trading_unit = 100;
                if (stock.trading_unit) {
                    trading_unit = stock.trading_unit;
                }
                var obj = riskCheck.checkRules({
                    trading_unit: trading_unit,
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
                    enable_sell_volume: 0,                               // 该股票能卖的数量

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
                // 剩余可用资金 ＝ 空仓下的总可用资金 － 股票资产
                var max_cash = Math.max(obj.max_cash, 0);
                max_cash = Math.min(max_cash, total_max_cash);
                e.max_cash = max_cash;
            });


            // var market = $('.market-ctrl.marketA.active').length > 0 ? 'marketA' : 'marketH';
            var market = 'marketA';
            if ($('.market-ctrl.marketA.active').length > 0) {
                market = 'marketA';
            }else if($('.market-ctrl.marketHSH.active').length > 0){
                market = 'marketHSH';
            }else if($('.market-ctrl.marketHSZ.active').length > 0){
                market = 'marketHSZ';
            }

            if ('marketA' == market) {
                list = list.filter(function(e){
                    return /\.(SZ|SH)$/.test(e.stock_id.toUpperCase());
                })
            }else if('marketHSH' == market){
                list = list.filter(function(e){
                    return /\.(HKSH)$/.test(e.stock_id.toUpperCase());
                })
            }else if('marketHSZ' == market){
                list = list.filter(function(e){
                    return /\.(HKSZ)$/.test(e.stock_id.toUpperCase());
                })
            }
            list.forEach(function(e){
                e.market = market;
            });
            // console.log(list);
            // var josn = JSON.stringify(list);
            // console.log(josn);
            //创建表格
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
                    if(position_stock.stock_id == row_stock.stock_id && position_stock.product_id == row_stock.product_id){
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
            memorizeEnvironment();
        }

        function disableSection(){
            //禁用本区块，多策略选取不为 一 的时候
        }

        function enableSection(){
            //启用本区块，多策略选取为 一 的时候
        }
    }).call(document.scripts[document.scripts.length-1].parentNode);
    </script>
</div>
