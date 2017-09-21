// # Risk_check workflow
//
// Before: pre_log timestamp;
//
// risk_check_request: stock_id, product_id, buy or sell, price(limit_price or market_price), volume;
//
//
//     risk_check ---push---> risk_check_task_pool;
//
//
//     risk_condition_ready ---trigger---> risk_check_task_pool;
//
//         stock_detail    ready
//         product_detail  ready
//         rules           ready
//         position        ready
//
//
//     risk_check_task_pool ---return---> risk_res;
//
//
// risk_check_response: max_volume, is_request_volume_ok, msg;
//
// After: re_check timestamp;

!function(){
    return false;
    var stock_pool = {};
    function GetStockList(idStr){
        $.ajax({
            url: '/rms-pub/stock_pool/get_stock_list',
            type: 'get',
            data: {
                pool_id: idStr
            },
            success: function(res){
                if (0 == res.code) {
                    // console.log('stock_pool');
                    stock_pool = res.data;
                }
            },
            error: function(){
            }
        })
    }
    var pool_list = [];
    function GetPoolList(){
        // stock_pool/get_list
        $.ajax({
            url: '/rms-pub/stock_pool/get_list',
            type: 'get',
            success: function(res){
                if (0 == res.code) {
                    pool_list = res.data;
                }
            },
            error: function(){
            }
        })
    }
    GetPoolList();

    var condition = {};
    var stocks = {};

    window.condition = condition;

    var waiting_task_pool = [];
    var done_task_pool = [];

    window.tradeRiskLimitCheck = function(params){
        var result = {then:function(func){params.callback=func}};
        addWaitingTask(params);
        (window.requestAnimationFrame||window.setTimeout)(batchTasks);
        return result;
    }

    setInterval(batchTasks,2500);
    setTimeout(loadRiskBaseInfo);

    monitorRiskTaskCondition();

    function batchTasks(){
        var ready_tasks = waiting_task_pool.filter(taskConditionsAllReady);
        ready_tasks.forEach(function(task){
            handleRiskCheckTask(
                popWaitingTask(task)
            );
            done_task_pool.push(task);
        });

        function taskConditionsAllReady(task){
            return isStockReady(task.stock_id) && isProductReady(task.product_id);

            function isStockReady(stock_id){
                var now_timestamp = new Date().valueOf();
                return $.pullValue(stocks,safe_stocks_key(stock_id)+'.detail_ready') && (
                    now_timestamp - (+$.pullValue(stocks,safe_stocks_key(stock_id)+'.update_timestamp')||0) < 1000*60
                );
            }

            function isProductReady(product_id){
                return (
                    $.pullValue(condition,product_id+'.brief_info_ready') &&
                    $.pullValue(condition,product_id+'.settlement_info_ready') &&
                    $.pullValue(condition,product_id+'.position_ready') &&
                    $.pullValue(condition,product_id+'.risk_rules_ready')
                );
            }
        }

        function handleRiskCheckTask(task){
            var buy_limit = getMaxBuyVolumeLimitByTask(task);
            var buy_max_volume = $.pullValue(buy_limit,'buy_volume_limit',0);
            var original_buy_max_volume = $.pullValue(buy_limit,'original_buy_volume_limit',0);
            var sell_max_volume = getMaxSellVolumeByTask(task);

            var buy_limit_msg = $.pullValue(buy_limit,'msg','');
            var sell_limit_msg = sell_max_volume ? ('当前最大可卖 '+sell_max_volume) : '当前无可卖持仓';
            var now_max_volume = task.buy_or_sell=='buy' ? buy_max_volume : sell_max_volume;

            var res = {
                code: 0,
                data: {
                    max_volume: now_max_volume,

                    buy_max_volume: buy_max_volume,
                    original_buy_max_volume: original_buy_max_volume,

                    sell_max_volume: sell_max_volume,
                    buy_limit_msg: buy_limit_msg,
                    sell_limit_msg: sell_limit_msg,
                    limit_msg: task.buy_or_sell == 'buy' ? buy_limit_msg.replace('资金余额不足','资金余额限制') : sell_limit_msg
                },
                msg: 'ok'
            };

            if(task.volume){
                var code = task.volume <= now_max_volume ? 0 : 110;
                $.extend(res,{
                    code: code,
                    msg: code==0
                            ? 'ok'
                            : (
                                task.buy_or_sell == 'buy'
                                    ? buy_limit_msg
                                    : ( sell_max_volume
                                            ? ('超过当前最大可卖 '+sell_max_volume)
                                            : '当前无可卖持仓'
                                    )
                            )
                });
            }

            if (0 == task.left_buy_day && 'buy' == task.buy_or_sell) {
                $.extend(res,{
                    // code: 0,
                    data:{
                        max_volume: 0,
                        limit_msg: '最后清仓日期不允许买入股票'
                    }
                    // ,
                    // msg: '最后清仓日期不允许买入股票'
                });
            }

            task.done = true;
            task.callback(res);
        }
    }

    function addWaitingTask(task){
        waiting_task_pool.push(task);
    }

    function popWaitingTask(task){
        waiting_task_pool.splice(waiting_task_pool.indexOf(task),1);
        return task;
    }

    function getArray(a) {
        var hash = {},
        len = a.length,
        result = [];

        for (var i = 0; i < len; i++){
            if (!hash[a[i]]){
                hash[a[i]] = true;
                result.push(a[i]);
            }
        }
        return result;
    }

    function monitorRiskTaskCondition(){
        //###################### 需要监控的数据 ######################
        // http://192.168.0.20:26080/omsv2/oms/helper/risk_rules
        // http://192.168.0.20:26080/omsv2/oms/helper/get_all_products
        // http://192.168.0.20:26080/omsv2/oms/helper/risk_settlement
        // http://192.168.0.20:26080/omsv2/oms/helper/risk_position
        // http://192.168.0.20:26080/omsv2/oms/helper/stock_detail

        $(window).ajaxComplete(function(event, xhr, settings) {
            if( !(xhr.status==200 && xhr.responseJSON && xhr.responseJSON.code == 0 && xhr.responseJSON.data) ){return;}
            var res_data = xhr.responseJSON.data;
            var url = decodeURIComponent(settings.url);

            //#############################  风控规则  ################################
            if( /risk_rules/.test(url) ){ //rules -> risk_rules
                var product_ids = getProductIdsFromUrl(url);
                product_ids.forEach(function(product_id){
                    productRiskRulesInfoReady(product_id);
                    $.pullValue(res_data,product_id+'.code',NaN)==0 && combineProductRiskRules(product_id, $.pullValue(res_data,product_id+'.data.rules'));
                });

                var pool_id_arr = [];
                Object.keys(res_data).forEach(function(e){
                    var target = [];
                    $.pullValue(res_data,e+'.code',NaN)==0 && $.pullValue(res_data,e+'.data.rules.target',NaN) && (target = $.pullValue(res_data,e+'.data.rules.target'));
                    target.forEach(function(el){
                        pool_id_arr.push(el.stock_pool_id);
                    })
                });
                pool_id_arr = getArray(pool_id_arr);
                GetStockList(pool_id_arr.join(','));
            }

            //#############################  策略信息  ###############################
            if( /get_all_products/.test(url) ){//store product info by id
                var products = res_data;
                // if( !$.pullValue(products,'length',0) ){$.omsAlert('您当前没有可操作的策略！',false,1500)}

                products.forEach && products.forEach(function(product){
                    productBriefInfoReady(product.id);
                    combineProductInfo(product.id,product);
                });
            }

            //#############################  结算数据  ###############################
            if( /\/oms\/helper\/risk\_settlement/.test(url) ){
                var product_ids = getProductIdsFromUrl(url);
                product_ids.forEach(function(product_id){
                    productSettlementInfoReady(product_id);
                    $.pullValue(res_data,product_id+'.code',NaN)==0 && combineProductSettlementInfo(product_id, $.pullValue(res_data,product_id+'.data'));
                });
            }

            //#############################  仓位数据  ###############################
            if( /\/oms\/helper\/risk\_position/.test(url) ){//store product position info by product_id
                var product_ids = getProductIdsFromUrl(url);
                product_ids.forEach(function(product_id){
                    productPositionReady(product_id);
                    clearProductPositions(product_id);
                    $.pullValue(res_data,product_id+'.code',NaN)==0 && updateProductPosition(product_id, $.pullValue(res_data,product_id+'.data'));
                });
            }

            //#############################  股票数据  ################################
            if( /stock_detail/.test(url) ){ //stock_ready
                res_data.forEach && res_data.forEach(function(stock_detail){
                    stockDetailReady(stock_detail.stock_id);
                    combineStockDetail(stock_detail.stock_id,stock_detail);
                });
            }

            // if( /[^\_]get_product_info/.test(url) ){//basic -> store product info by id
            //     var product_info = $.pullValue(res_data,'basic');
            //     product_info && product_info.id && combineProductInfo(product_info.id,product_info);
            // }

            batchTasks();//批量处理风控任务
        });

            //#####################  策略信息：单策略直接访问  ##########################
            // $(window).on('load',function(event){
            //     var product_info = event.product || window.PRODUCT;
            //     product_info && product_info.id && combineProductInfo(product_info.id,product_info);
            //
            //     batchTasks();//批量处理风控任务
            // });

        function combineProductRiskRules(product_id,risk_rules){
            $.pushValue(condition,product_id+'.risk_rules',risk_rules);
        }
        function combineProductSettlementInfo(product_id,settlement_info){
            $.pushValue(condition,product_id+'.runtime',settlement_info);
        }
        function combineProductInfo(product_id,info_obj){
            for(var key in info_obj){
                info_obj.hasOwnProperty(key) && $.pushValue(condition,product_id+'.'+key,info_obj[key]);
            }
        }
        function clearProductPositions(product_id){
            $.pushValue(condition,product_id+'.positions',[]);
        }
        function updateProductPosition(product_id,positions){
            $.pushValue(condition,product_id+'.positions',positions);
        }
        function productBriefInfoReady(product_id){
            $.pushValue(condition,product_id+'.brief_info_ready',true);
        }
        function productSettlementInfoReady(product_id){
            $.pushValue(condition,product_id+'.settlement_info_ready',true);
        }
        function productPositionReady(product_id){
            $.pushValue(condition,product_id+'.position_ready',true);
        }
        function productRiskRulesInfoReady(product_id){
            $.pushValue(condition,product_id+'.risk_rules_ready',true);
        }

        function combineStockDetail(stock_id,stock_detail){
            stock_detail.update_timestamp = new Date().valueOf();
            for(var key in stock_detail){
                stock_detail.hasOwnProperty(key) && $.pushValue(stocks,safe_stocks_key(stock_id)+'.'+key,stock_detail[key]);
            }
        }

        function stockDetailReady(stock_id){
            $.pushValue(stocks,safe_stocks_key(stock_id)+'.detail_ready',true);
        }

        function getProductIdsFromUrl(url){
            var product_ids = [];
            url.replace(/product_id\[\]\=(\d+)/g,function(match_str, $1, start_index){
                var product_id = $1;
                product_ids.push(product_id);
            });
            return product_ids;
        }
    }

    function safe_stocks_key(stock_id){
        return stock_id.replace('.','_');
    }

    function getMaxBuyVolumeLimitByTask(task){
        var buy_limits = getBuyLimitsRulesByTask(task);

        var buy_limit = buy_limits.sort(function(x,y){
            return x.value_limit > y.value_limit ? 1 : -1;
        })[0];


        // {
        //     position_limit: 50%,
        //     value_limit: 50000,
        //     msg: '持仓不能超过百分之百'
        // }

        var predict_price = getBuyPriceByTask(task);
        var volume = +task.volume||0;
        var predict_value = volume*predict_price;
        var now_market_value = getStockNowMarketValue(task.product_id,task.stock_id);
        var value_limit = +$.pullValue(buy_limit,'value_limit',0);

        var max_new_market_value = Math.max(value_limit - now_market_value,0);
        var original_buy_volume_limit = predict_price ? Math.floor(max_new_market_value/predict_price) : 0;

        var buy_volume_limit = Math.floor(original_buy_volume_limit/100)*100;

        buy_limit.now_market_value = now_market_value;
        buy_limit.original_buy_volume_limit = original_buy_volume_limit;
        buy_limit.buy_volume_limit = buy_volume_limit;

        return buy_limit;
    }

    function getBuyPriceByTask(task){
        var last_price = +$.pullValue(stocks,safe_stocks_key(task.stock_id)+'.last_price',0);
        var best_buy_price = +$.pullValue(stocks,safe_stocks_key(task.stock_id)+'.stop_top',0) || last_price;

        if(task.limit_price_or_market_price=='limit_price'){
            return +task.price || best_buy_price;
        }

        if(task.limit_price_or_market_price=='market_price'){
            return best_buy_price;
        }
    }

    function getMaxSellVolumeByTask(task){
        var position = getPosition(task.product_id,task.stock_id);
        var max_sell_volume = $.pullValue(position,'enable_sell_volume',0);
        return max_sell_volume;
    }

    function getProductNowMarketValue(product_id){
        var positions = $.pullValue(condition,product_id+'.positions',[]);
        var total_market_value = positions.reduce && positions.reduce(function(pre_value,position){
            return pre_value + (+$.pullValue(position,'market_value')||0);
        },0);

        // console.log(product_id,total_market_value);

        return total_market_value||0;
    }

    function getStockNowMarketValue(product_id,stock_id){
        var total_amount = +getStockTotalAmount(product_id,stock_id);
        var last_price = +$.pullValue(stocks,safe_stocks_key(stock_id)+'.last_price',0);
        return total_amount*last_price;
    }

    function getStockTotalAmount(product_id,stock_id){
        var position = getPosition(product_id,stock_id);
        return $.pullValue(position,'total_amount',0);
    }

    function getPosition(product_id,stock_id){
        var positions = $.pullValue(condition,product_id+'.positions',[]);
        return positions.filter && positions.filter(function(position){
            return position.stock_id == stock_id;
        })[0];
    }

    function getBuyLimitsRulesByTask(task){
        var risk_rules = $.pullValue(condition,task.product_id+'.risk_rules');
        var rules = [
            // {
            //     position_limit: 50%,
            //     value_limit: 50000,
            //     msg: '持仓不能超过百分之百'
            // }
        ];
        var settlement_type_ch = getProductSettlementTypeCH(task.product_id);

        checkLeftBuyDay();
        checkIfMoneyIsEnough();

        //白名单特殊待遇啊
        var white_list = [
            11308,    //钟杰操盘专户02期
            11319,    //钟杰操盘专户03期
            11333,    //黎明02期
            11258     //清楚理财01期
        ];
        if( white_list.indexOf(+task.product_id)>-1 ){return rules;}

        //无忧型和稳赢型不受量级持仓限制
        /caopanle|fenhongle/.test(settlement_type_ch) && checkProductBasePositionRules(task);
        checkDegreeRulesByControlLineConfig(task);

        function checkIfMoneyIsEnough(){
            var position_limit = 1;//总仓位不能超过100%
            var limit_res = getStockLimitByPositionLimit(position_limit);
            rules.push(
                $.extend(limit_res,{
                    msg: '资金余额不足'
                })
            );
        }

        // function checkLeftRunningDay(){
        //     var left_running_day = +$.pullValue(condition,task.product_id+'.left_running_day',0);
        //     if(!left_running_day){
        //         var position_limit = 0;//剩余交易日为 0，不能买入股票
        //         var limit_res = getStockLimitByPositionLimit(position_limit);
        //         rules.push(
        //             $.extend(limit_res,{
        //                 msg: '最后一个交易日不允许买入股票'
        //             })
        //         );
        //     }
        // }
        function checkLeftBuyDay(){
            var left_buy_day = +$.pullValue(condition,task.product_id+'.left_buy_day',0);
            if(!left_buy_day){
                var position_limit = 0;//剩余交易日为 0，不能买入股票
                var limit_res = getStockLimitByPositionLimit(position_limit);
                rules.push(
                    $.extend(limit_res,{
                        msg: '可买天数为0，不允许买入股票'
                    })
                );
            }
        }

        // function checkDegreeRulesByControlLineConfig(task){
        //     var type_rules = $.pullValue(risk_rules,'control_line_config',[]);
        //
        //     if(!type_rules || !type_rules.sort){return;}
        //
        //     //根据策略运行情况，获取当前适用规则
        //     type_rules.sort(function(r1,r2){return r1.min>r2.min ? 1 : -1;});
        //     var now_net_value = +$.pullValue(condition,task.product_id+'.runtime.net_value',0);
        //
        //     var available_rule = type_rules.filter && type_rules.filter(function(rule){
        //         return (now_net_value >= +rule.min) && (now_net_value < +rule.max);
        //     })[0];
        //
        //     var rule_max_net_value = $.pullValue(available_rule,'max');
        //     var rule_min_net_value = $.pullValue(available_rule,'min');
        //
        //     var position_limit = $.pullValue(available_rule,'position',1);
        //
        //     var limit_res = getStockLimitByPositionLimit(position_limit);
        //     rules.push(
        //         $.extend(limit_res,{
        //             msg: (
        //                     position_limit==1
        //                     ? '资金余额不足'
        //                     : ('策略净值小于'+rule_max_net_value+'，总持仓不能超过'+numeral(position_limit).format('0.00%'))
        //             )
        //         })
        //     );
        // }
        function checkDegreeRulesByControlLineConfig(task){
            var type_rules = $.pullValue(risk_rules,'wholePosition',[]);

            if(!type_rules || !type_rules.sort){return;}

            // 从小到大排序
            type_rules.sort(function(r1, r2){
                return r1.net_value > r2.net_value ? 1 : -1
            });
            for (var i = 0; i < type_rules.length; i++) {
                type_rules[i].position = type_rules[i].limit_position;
                type_rules[i].max = type_rules[i].net_value / 100;
                if (0 === i) {
                    type_rules[i].min = 0;
                }else{
                    type_rules[i].min = type_rules[i - 1].max;
                }
            }
            //根据策略运行情况，获取当前适用规则
            type_rules.sort(function(r1,r2){return r1.min>r2.min ? 1 : -1;});//排序
            var now_net_value = +$.pullValue(condition,task.product_id+'.runtime.net_value',0);

            var available_rule = type_rules.filter && type_rules.filter(function(rule){
                return (now_net_value >= +rule.min) && (now_net_value < +rule.max);
            })[0];

            var rule_max_net_value = $.pullValue(available_rule,'max');
            var rule_min_net_value = $.pullValue(available_rule,'min');

            var position_limit = $.pullValue(available_rule,'position',1);

            var limit_res = getStockLimitByPositionLimit(position_limit);
            rules.push(
                $.extend(limit_res,{
                    msg: (
                            position_limit==1
                            ? '资金余额不足'
                            : ('策略净值小于'+rule_max_net_value+'，总持仓不能超过'+numeral(position_limit).format('0.00%'))
                    )
                })
            );
        }

        function getStockLimitByPositionLimit(position_limit){
            //这是策略仓位限制
            var total_assets = +$.pullValue(condition,task.product_id+'.runtime.total_assets',0);
            var balance_amount = +$.pullValue(condition,task.product_id+'.runtime.balance_amount',0);

            var value_limit = position_limit*total_assets;
            var now_market_value = getProductNowMarketValue(task.product_id);
            var product_new_value_available = Math.max( value_limit - now_market_value ,0 ); //可新增的股票市值

            //坑：策略 资金余额+股票资产 != 资产总值，所以，这里算出来的 product_new_value_available 不能大于 资金余额
            product_new_value_available = Math.min(product_new_value_available,balance_amount);

            //把策略仓位限制，转化为单股持仓限制
            var stock_now_market_value = getStockNowMarketValue(task.product_id,task.stock_id);

            var stock_value_limit = product_new_value_available+stock_now_market_value;
            var stock_position_limit = total_assets ? stock_value_limit/total_assets : 0;

            // console.log('position_limit',position_limit);
            // console.log(stock_value_limit,stock_position_limit);
            return {
                position_limit: stock_position_limit,
                value_limit: stock_value_limit
            };
        }


        function IsContained(pool_id, stock_id){
            var rtn = false;
            var pool = stock_pool[pool_id];
            pool.forEach(function(e){
                // console.log('e: ' + e + '; stock_id: ' + stock_id);
                if (e == stock_id) {
                    rtn = true;
                }
            })

            return rtn;
        }

        function GetPoolNameById(id){
            var rtn = '';
            pool_list.forEach(function(e){
                if (Number(e.id) === Number(id)) {
                    rtn = e.name;
                }
            });
            return rtn;
        }

        function checkProductBasePositionRules(task){
            var total_assets = +$.pullValue(condition,task.product_id+'.runtime.total_assets',0);
            var collect_capital = +$.pullValue(condition,task.product_id+'.collect_capital',0);

            //没有数据就不检查咯
            // if( !$.pullValue(risk_rules,'position',NaN) ){return;}
            if( !$.pullValue(risk_rules,'onePosition',NaN) ){return;}

            var onePositions = $.pullValue(risk_rules,'onePosition', []);
            onePositions.forEach(function(e){
                var stock_pool_id = e.stock_pool_id;
                if (IsContained(stock_pool_id, task.stock_id)) {
                    var position_limit = e.limit_position / 100;
                    rules.push({
                        position_limit: position_limit,
                        value_limit: 0,
                        msg: '本策略'+ GetPoolNameById(stock_pool_id) +'单票持仓不能超过'+numeral(position_limit).format('0.00%')
                    });
                }
            });




            // var position_limit = +$.pullValue(risk_rules,'position.single_position',NaN);
            // if(position_limit==position_limit){
            //     var value_limit = position_limit*total_assets;
            //     rules.push({
            //         position_limit: position_limit,
            //         value_limit: value_limit,
            //         msg: '本策略单票持仓不能超过'+numeral(position_limit).format('0.00%')
            //     });
            // }
            //
            // if( isGEM(task.stock_id) ){
            //     var position_limit = +$.pullValue(risk_rules,'position.career_position',NaN);
            //     if(position_limit==position_limit){
            //         var value_limit = position_limit*total_assets;
            //         rules.push({
            //             position_limit: position_limit,
            //             value_limit: value_limit,
            //             msg: '本策略创业版单票持仓不能超过'+numeral(position_limit).format('0.00%')
            //         });
            //     }
            //
            //     var value_limit = +$.pullValue(risk_rules,'position.career_single_market_value',NaN);
            //     if(value_limit==value_limit){
            //         var position_limit = total_assets ? value_limit/total_assets : 0;
            //         rules.push({
            //             position_limit: position_limit,
            //             value_limit: value_limit,
            //             msg: '本策略创业版单票市值不能超过'+value_limit
            //         });
            //     }
            // }
        }

        function getProductSettlementTypeCH(product_id){
            var settlement_type = +$.pullValue(condition,product_id+'.settlement_type');

            // const SETTLEMENT_TYPE_A          = 1; // A类策略
            // const SETTLEMENT_TYPE_BONUS_NRNG = 2; // 分红乐 牛人牛股
            // const SETTLEMENT_TYPE_BONUS_YDDD = 3; // 分红乐 盈多点点
            // const SETTLEMENT_TYPE_CHARITABLE = 4; // 公益乐
            // const SETTLEMENT_TYPE_MIRRORING  = 5; // 镜像策略
            // const SETTLEMENT_TYPE_CAREFREE 	 = 6; // 无忧型
            // const SETTLEMENT_TYPE_STEADY   	 = 7; // 稳赢型

            switch( settlement_type ){
                case 1:
                    return 'caopanle';
                    break;
                case 2:
                    return 'fenhongle';
                    break;
                case 3:
                    return 'fenhongle';
                    break;
                case 4:
                    return 'caopanle';//公益乐当操盘乐
                    break;
                case 5:
                    return 'mirroring';
                    break;
                case 6:
                    return 'carefree';
                    break;
                case 7:
                    return 'steady';
                    break;
                default:
                    return NaN;
            }
        }

        return rules;
    }

    function isGEM(stock_id){
        // 'GEM' stands for Growth Enterprise Market
        return /^300/.test(stock_id);
    }

    //load risk_rules
    function loadRiskBaseInfo(){
        // 风控按策略下发，风控信息统一在策略信息页里面加载
        // multi/product/head/is_running 里面有 loadRiskRulesInfo
        // product/detail/head 里面有 loadRiskRulesInfo

        // $.get( (window.REQUEST_PREFIX||'')+'/oms/helper/risk_rules' ).done(function(res){
        //     $.pullValue(res,'code',NaN) != 0 && riskRuleFailReport();
        // }).fail(riskRuleFailReport);
        //
        // function riskRuleFailReport(){
        //     $.omsAlert('风控拉取失败，请刷新页面重试！',false,5000);
        // }

        // $.get( (window.REQUEST_PREFIX||'')+'/oms/helper/get_all_products' ); //侧边导航部分已经加载过这些数据了
        loadRiskRuntimeInfo();
    }

    function loadRiskRuntimeInfo(){
        // $.get( (window.REQUEST_PREFIX||'')+'/oms/helper/risk_position' ); //放在持仓 section 里面加载咯，主要是具体场景 product_id(s) 参数不一样
        // $.get( (window.REQUEST_PREFIX||'')+'/oms/helper/risk_settlement' ); //放在head section 里面加载咯，主要是具体场景 product_id(s) 的参数
    }
}();
