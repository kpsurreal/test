<section class="product-detail" updown-monitor="udm_product_detail:${id}">
    <div class="inner-wrap">
        <div class="left-part">
            <div class="hd">
                <b data-src="name" class="section-title"></b>
                <span class="words">
                    <a href="javascript:;" target="_blank" data-href="|getHostHref:/product/detail?product_id=${id}">查看策略详情></a>
                </span>
            </div>

            <div if="is_waiting" class="income-brief">
                <div class="left-part">
                    预期规模 &nbsp;
                    <font class="big-num red">
                        <b data-src="target_capital|numeral:0,0.00"></b>
                        <span></span>
                    </font>
                </div>
                <div class="right-part">
                    已投资 &nbsp;
                    <font class="big-num red">
                        <b data-src="collect_capital|numeral:0,0.00"></b>
                        <span data-src="collect_capital|devided_by:target_capital|numeral:0.000%"></span>
                    </font>
                </div>
            </div>

            <div if="is_waiting|isFalse" class="income-brief">
                <div class="left-part">
                    <str if="is_running">单位净值 </str>
                    <str if="is_stoped">最终净值 </str>
                    <font class="big-num" data-class="runtime.net_value|rgColor:1">
                        <b data-src="runtime.net_value|numeral:0.0000"></b>
                        <span></span>
                    </font>
                </div>
                <div class="right-part" if="is_running">
                    当日盈亏
                    <font class="big-num" data-class="runtime.profit_of_today|rgColor">
                        <b data-src="runtime.profit_of_today|numeral:0,0.00"></b>
                        <span data-src="runtime.profit_rate_of_day|numeral:0.00%"></span>
                    </font>
                </div>
            </div>
        </div>
        <div class="right-part">
            <table>
                <tr>
                    <td if="is_waiting|isFalse">
                        资产总值
                        <span data-src="runtime.total_assets|numeral:0,0.00"></span>
                    </td>
                    <td if="is_waiting|isFalse">
                        股票资产
                        <span data-src="runtime.security|numeral:0,0.00"></span>
                    </td>
                    <td if="is_waiting|isFalse">
                        资金余额
                        <span data-src="runtime.balance_amount|numeral:0,0.00"></span>
                    </td>
                    <td>
                        开始运行日期
                        <span data-src="start_time|unixDay"></span>
                    </td>
                    <td>
                        结束运行日期
                        <span data-src="stop_time|unixDay"></span>
                    </td>
                </tr>

                <tr>
                    <td if="is_waiting|isFalse">
                        总收益率
                        <span data-src="runtime.profit_rate|numeral:0.00%" data-class="runtime.net_profite|rgColor"></span>
                    </td>
                    <td if="is_waiting|isFalse">
                        总盈亏
                        <span data-src="runtime.net_profite|numeral:0,0.00" data-class="runtime.net_profite|rgColor"></span>
                    </td>
                    <td if="is_waiting|isFalse">
                        初始投资总额
                        <span data-src="collect_capital|numeral:0,0.00"></span>
                    </td>
                    <td>
                        止损线
                        <span data-src="stop_loss|numeral:0,0.0000"></span>
                    </td>
                    <td>
                        收益分成比例
                        <span data-src="profit_sharing_ratio|numeral:0%"></span>
                    </td>
                </tr>
            </table>
        </div>
    </div>
    <script>
    (function(){
        var me = $(this);

        var unuse_cache = 0;
        $(renderProduct.bind(null, PRODUCT));

        //5秒更新 runtime
        setInterval(function(){
            PRODUCT.is_running && !me.is('.loading') && loadRuntimeInfo();
        }, 4000 + parseInt(Math.random() * 1000));

        $(window).on('position_update_updated entrust_update_updated', function(event){
            !me.is('.loading') && (event.updated_timestamp >(me.attr('last_updated_timestamp')||0)) && loadRuntimeInfo();
        }).on('spa_product_change', function(event){
            var product = event.product;
            // PRODUCT = $.extend(product, $.omsGetLocalJsonData('product_detail',PRODUCT.id)); //干掉缓存咯
            PRODUCT = product;
            renderProduct(PRODUCT);
            loadBasicInfo();
            loadRuntimeInfo();
            $(window).trigger({type:'main_window:goto_section',section:me});
        }).on('load', function(event){
            renderProduct(PRODUCT);
            loadBasicInfo();
            loadRuntimeInfo();
        }).on('multi_products:create_order:finish add_multi_hand_order:success order_create:success',function(){
            unuse_cache = 1;//激活 unuse_cache
        });

        function loadBasicInfo(){
            me.addClass('basic_info_loading');
            var url = (window.REQUEST_PREFIX||'')+'/oms/api/get_product_info?product_id='+PRODUCT.id;

            var last_basic_info_loading_timestamp = new Date().valueOf();
            me.attr('last_basic_info_loading_timestamp',last_basic_info_loading_timestamp);

            $.get(url).done(function(res){
                if(last_basic_info_loading_timestamp!=me.attr('last_basic_info_loading_timestamp')){return;}

                if(res.code==0){
                    var product = $.extend(PRODUCT||{},$.pullValue(res,'data.basic',{}));
                    renderProduct(PRODUCT = product);
                }

                res.code!=0 && $.failNotice(url,res);
                res.code==0 && me.attr('last_basic_info_updated_timestamp',(res.timestamp||0));
            }).fail( $.failNotice.bind(null,url) ).always(function(){
                if(last_basic_info_loading_timestamp!=me.attr('last_basic_info_loading_timestamp')){return;}
                me.removeClass('basic_info_loading');
            });

            //加载风控信息
            PRODUCT.is_running && loadRiskRulesInfo(function(){
                loadFeeRulesInfo(function(){
                });
            });
        }

        function loadRuntimeInfo(){
            me.addClass('loading');
            var url = (window.REQUEST_PREFIX||'')+'/oms/api/get_settlement_info?product_id='+PRODUCT.id;

            var last_loading_timestamp = new Date().valueOf();
            me.attr('last_loading_timestamp',last_loading_timestamp);

            $.get(url,{
                unuse_cache: unuse_cache ? (unuse_cache=0,1) : 0 //使用 unuse_cache 并重置为 0
            }).done(function(res){
                if(last_loading_timestamp!=me.attr('last_loading_timestamp')){return;}

                if(res.code==0){
                    //可用资金变更通知
                    var new_balance_amount = $.pullValue(res,'data.balance_amount',0);
                    var balance_amount_changed = $.pullValue(window,'PRODUCT.runtime.balance_amount',0) != new_balance_amount;

                    var product = $.extend(PRODUCT||{},
                        {runtime:$.pullValue(res,'data',{})}
                    );

                    renderProduct(PRODUCT = product);

                    balance_amount_changed && $(window).trigger({type:'balance_amount_changed',balance_amount:new_balance_amount});
                }

                res.code!=0 && failNotice(res);
                res.code==0 && me.attr('last_updated_timestamp',(res.timestamp||0));
            }).fail(failNotice).always(function(){
                if(last_loading_timestamp!=me.attr('last_loading_timestamp')){return;}
                me.removeClass('loading');
            });

            function failNotice(res){
                $.omsAlert($.pullValue(res,'msg','请求失败'),false);
            }
        }

        function loadRiskRulesInfo(callback){
            var product_ids = [PRODUCT.id];
            riskCheck.getRulesData(product_ids, callback);
        }
        function loadFeeRulesInfo(callback){
            var product_ids = [PRODUCT.id];
            riskCheck.getFeeData(product_ids, callback);
        }
        // function loadRiskRulesInfo(){
        //     var product_ids = [PRODUCT.id];
        //     riskCheck.getRulesData(product_ids);
        //     // var product_ids = [PRODUCT.id];
        //     // $.get((window.REQUEST_PREFIX||'')+'/oms/helper/risk_rules',{
        //     //     product_id: product_ids
        //     // }).done(function(res){
        //     //     var success = true;
        //     //     success = success && $.pullValue(res,'code',NaN) == 0;
        //     //     product_ids.forEach(function(product_id){
        //     //         success = success && $.pullValue(res,'data.'+product_id+'.code',NaN) == 0;
        //     //     });
        //     //     !success && riskRuleFailReport();
        //     // }).fail(riskRuleFailReport);
        //     //
        //     // function riskRuleFailReport(){
        //     //     $.omsAlert('风控信息获取失败，请刷新页面重试！',false,5000);
        //     // }
        // }

        function renderProduct(product){
            //全局通知
            $(window).trigger({type:'product_detail_changed',product:product});

            // product = $.omsCacheLocalJsonData('product_detail',PRODUCT.id,$.extend({},product,{runtime:null})); //干掉缓存咯

            $.pushValue(
                product,
                'runtime.total_performance',
                $.pullValue(product,'runtime.performance_pay',0) + $.pullValue(product,'runtime.confirm_performance',0)
            );
            me.render(product);
        }

    }).call(document.scripts[document.scripts.length-1].parentNode);
    </script>
</section>
