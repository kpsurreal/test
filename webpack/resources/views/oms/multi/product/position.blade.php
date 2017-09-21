<!--
选中产品的持仓显示
trigger:
1.stock:add_follow //股票加自选
2.stock:stop_orders //撤单？但是看起来没有地方处理该事件
3.order_create:by_stock //持仓页面点击某只股票，切换到卖出该股票的界面
4.order_create:by_stock //同上
5.product:position:row-click //与order_create:by_stock其实并没有太多区别，区别在于 “买入” “卖出”，区别在于点击的位置
6.position:runtime:refresh //持仓刷新后，更新产品组列表
7.product:position:updated // 持仓列表更新后，更新产品组列表和单产品多股票表格的数据和显示

on:
1.multi_load
2.multi_products:head:updated //产品组选中变化后，计算显示哪些数据。
3.multi_products:head:updated:checked_one //控制是否显示汇总
4.multi_products:head:updated:checked_notone //控制是否显示汇总
5.multi_products:create_order:finish //触发批量下单已完成事件，此处更新持仓列表
 -->
<section class="product-position new-design" style="display:none;" inner-sort>
    <a name="foo" id="anchor-position" style="position: relative;top:-65px;display: block;height: 0;width:0;"></a>
    <div class="hd">
        <span class="section-title">当前持仓</span>
        <a class="oms-btn gray refresh-btn loading-loading right"><i class="oms-icon refresh"></i>刷新</a>
        <span class="single_product_show">
            <span class="right" style="font-size:16px;font-weight:600;color:#000;" rows-total>当前仓位 <span data-src="total_weight|numeral:0.00%">--.--%</span></span>
        </span>
    </div>
    <table class="oms-table nothing-nothing loading-loading">
        <tr class="hd" rows-head>
            <th class="cell-left" sort-by="stock_id">证券代码</th>
            <th class="cell-left" sort-by="stock_name">证券名称</th>
            @if(isset($logined_info) && isset($logined_info['org_info']) && isset($logined_info['org_info']['theme']) && 3 == $logined_info['org_info']['theme'])
                <th class="cell-left" sort-by="product_id">持仓策略</th>
            @else
                <th class="cell-left" sort-by="product_id">持仓交易单元</th>
            @endif
            

            <th sort-by="cost_price">成本价</th>
            <th sort-by="market_price">最新价</th>
            <th sort-by="total_amount">持仓数量</th>
            <th sort-by="enable_sell_volume">可卖数量</th>

            <th sort-by="market_value">市值</th>
            @if(isset($logined_info) && isset($logined_info['org_info']) && isset($logined_info['org_info']['theme']) && 3 == $logined_info['org_info']['theme'])
                <th sort-by="today_earning">当日盈亏</th>
            @endif

            {{-- <th sort-by="today_earning_ratio">当日盈亏率</th> --}}
            <th sort-by="earning">浮动盈亏</th>
            <th sort-by="earning_ratio">盈亏率</th>
            <th sort-by="weight">所占仓位</th>

            <th>操作 &nbsp;  &nbsp;</th>
        </tr>
        <tbody rows-body></tbody>
        <tbody class="single_product_show">
            <tr rows-total style="display:none;" updown-monitor="udm_position_total:${product_id}">
                <th class="cell-left" colspan='7'>当前持仓汇总</th>
                <td data-src="total_market_value|numeral:0,0.00"></td>
                @if(isset($logined_info) && isset($logined_info['org_info']) && isset($logined_info['org_info']['theme']) && 3 == $logined_info['org_info']['theme'])
                    <td data-src="total_today_earning|signNumeral:0,0.00" data-class="total_today_earning|rgColor"></td>
                @endif
                <td data-src="total_earning|signNumeral:0,0.00" data-class="total_earning|rgColor"></td>
                <td data-src="total_weight|numeral:0.00%" class="product-position-total" colspan='2'></td>
                <td></td>
            </tr>
        </tbody>
        <script type="text/html" row-tpl>
            <tr position updown-monitor="udm_position:${product_id}-${stock_id}">
                <!-- <td data-src="industry"></td> -->
                <td class="cell-left" data-src="stock_id"></td>
                <td class="cell-left" data-src="stock_name"></td>
                <td class="cell-left" data-src="product.name"></td>

                <td data-src="cost_price|numeral:0.000"></td>
                <td data-class="earning|rgColor" data-src="market_price|numeral:0.000"></td>
                <td data-src="total_amount|numeral:0,0"></td>
                <td data-src="enable_sell_volume|numeral:0,0"></td>

                <td data-class="earning|rgColor" data-src="market_value|numeral:0,0.00"></td>

                @if(isset($logined_info) && isset($logined_info['org_info']) && isset($logined_info['org_info']['theme']) && 3 == $logined_info['org_info']['theme'])
                    <td data-class="today_earning|rgColor" data-src="today_earning|signNumeral:0,0.00"></td>
                @endif
                <!-- <td data-class="today_earning_ratio|rgColor" data-src="today_earning_ratio|signNumeral:0.00%"></td> -->
                <td data-class="earning|rgColor" data-src="earning|signNumeral:0,0.00"></td>
                <td data-class="earning_ratio|rgColor" data-src="earning_ratio|signNumeral:0.00%"></td>
                <td data-src="weight|numeral:0.00%"></td>

                <td>
                    <span class="oms-btn sm gray three" position-handle direction="follow">加自选</span>
                    <!-- <span class="oms-btn sm gray five" position-handle direction="stop_orders">止盈/止损</span> -->
                    <span class="oms-btn sm red" position-handle direction="buy" trade>买入</span>
                    <span class="oms-btn sm blue" position-handle direction="sell" trade>卖出</span>
                </td>
            </tr>
        </script>
    </table>

    <script>
    (function(){
        var me = $(this);

        var single_product_show = false;
        var single_product;

        // var multi_status;
        var product_list;
        var product_ids;

        //基本的历史逻辑
        $(function(){
            me.find('.refresh-btn').click(loadRealtimePositionInfo);

            me.find('[rows-body]').on('click','[position-handle]',function(){
                var position = $(this).closest('[position]').data('srcData');
                var direction = $(this).attr('direction');
                if(!direction){return;}

                if(direction=='follow'){
                    $(window).trigger({type:'stock:add_follow',stock:position});
                    return false;
                }

                if(direction=='stop_orders'){
                    $(window).trigger({type:'stock:stop_orders',position:position});
                    return false;
                }

                $(window).trigger({type:'order_create:by_stock',stock:{
                    stock_code: position.stock_id,
                    stock_name: position.stock_name,
                    direction: direction
                }});
            }).on('click','tr[position]',function(event){
                var position_data = $(this).getCoreData();

                // 修改选中股票
                if( !$(event.target).is('[trade]') ){
                    $(window).trigger({type:'order_create:by_stock',stock:{
                        stock_code: position_data.stock_id,
                        stock_name: position_data.stock_name,
                        direction: 'sell'
                    }});
                }

                // 显示该股票交易历史，已废弃。
                $(window).trigger({type:'product:position:row-click',position:position_data});
            });

            me.on('table:rendered',tableRendered);
        });

        //刷新通用的逻辑代码
        $(window).on('multi_load',function(event){
            // if(event.multi_status!='is_running'){return;}
            //
            // multi_status = event.multi_status;
            product_list = event.product_list;
            product_ids = event.product_ids;

            me.show();
            loadRealtimePositionInfo();

            setInterval(function(){
                // 去除为空时不刷新的清空
                // !me.find('.nothing-nothing').is('.nothing')
                // &&
                !me.find('.loading-loading').is('.loading')
                && loadRealtimePositionInfo();
            },5000);
        }).on('multi_products:head:updated',function(event){
            updateListView();
        }).on('multi_products:head:updated:checked_one',function(){
            // 控制持仓的汇总栏的显示和隐藏
            me.find('.single_product_show').show();
        }).on('multi_products:head:updated:checked_notone',function(){
            // 控制持仓的汇总栏的显示和隐藏
            me.find('.single_product_show').hide();
        }).on('multi_products:create_order:finish',function(){
            loadRealtimePositionInfo();
        });

        function loadRealtimePositionInfo(){
            me.find('.loading-loading').addClass('loading');
            // .end().find('.nothing-nothing').removeClass('nothing');

            var url = (window.REQUEST_PREFIX||'')+'/oms/api/multi_position_realtime';

            var last_loading_timestamp = new Date().valueOf();
            me.attr('last_loading_timestamp',last_loading_timestamp);

            //######################### 风控增补数据 risk_check js 用到 ########################
            $.get((window.REQUEST_PREFIX||'')+'/oms/helper/risk_position',{product_id:product_ids}, function(res){
                if (0 == res.code) {
                    window.risk_position = res.data;
                }
            });
            //######################### 风控增补数据 risk_check js 用到 ########################

            $.get(url,{
                product_id: product_ids,
                // with_entrust: 1 //暂时干掉 with_entrust
            }).done(function(res){
                if(last_loading_timestamp!=me.attr('last_loading_timestamp')){return;}

                if(res.code==0){
                    var position_realtime = [];

                    var needRefresh = false;
                    product_list.forEach(function(product){
                        var id = product.id;
                        var positions = $.pullValue(res,'data.'+id+'.data',[]);

                        // product.position_realtime = positions;
                        positions.forEach(function(position){
                            position.product = product;
                        });

                        // id是组合id，positions是实时持仓数据 在此计算出“今日盈亏”和“今日盈亏率”修改到window.PRODUCTS 的对应组合的runtime中
                        // product.today_earning;
                        var profit_of_today = 0;
                        positions.forEach(function(position){
                            profit_of_today += position.today_earning;
                        });
                        window.PRODUCTS.forEach(function(e){
                            if (e.id == id) {
                                if (e.runtime && Object.keys(e.runtime).length > 0) {
                                    needRefresh = true;
                                    var profit_of_today_v2 = profit_of_today - e.runtime.redeem_fee - e.runtime.manage_fee - e.runtime.other_fee;
                                    e.runtime.profit_of_today_v2 = profit_of_today_v2;
                                    if (0 == e.runtime.total_assets) {
                                        e.runtime.profit_rate_of_day_v2 = 0;
                                    }else{
                                        e.runtime.profit_rate_of_day_v2 = profit_of_today_v2 / e.runtime.total_assets;
                                    }
                                }
                            }
                        });

                        position_realtime.push.apply(position_realtime,positions);
                    });
                    if (needRefresh == true) {
                        $(window).trigger({
                            type: 'position:runtime:refresh'
                        });
                    }


                    window.position_realtime = position_realtime;

                    me.find('.loading-loading').end().find('.nothing-nothing').removeClass('nothing');

                    renderPostionRealTime(position_realtime);
                }else{
                    failNotice(res);
                    me.renderTable();
                }

                res.code==0 && me.attr('last_updated_timestamp',(res.timestamp||0));
            }).fail(failNotice).always(function(){
                if(last_loading_timestamp!=me.attr('last_loading_timestamp')){return;}
                me.find('.loading-loading').removeClass('loading');
            });

            function failNotice(res){
                $.omsAlert($.pullValue(res,'msg','请求异常'),false);
            }
        }

        function renderPostionRealTime(position_realtime){
            //纠正持仓中的 total_amount，里面是包含 with_entrust，委托中未成交的数据也会反应在 total_amount 和 enable_sell_volume 中
            position_realtime = correctPositionWithEntrust(position_realtime);

            me.renderTable(position_realtime);

            $(window).trigger({type:'product:position:updated',position:position_realtime});
        }

        function correctPositionWithEntrust(position_realtime){
            if( $.type(position_realtime)!='array' ){return position_realtime};

            //WithEntrust 的持仓，是包含委托中的数据的，需要把委托中的数据提出来，才能变成真实持仓
            var results = [];
            position_realtime.forEach(function(position){
                if(position.stock_id==708090){
                    results.push(position);
                    return;
                }

                var res_position = $.extend({},position);//数据 copy
                //纠正 total_amount;
                res_position.total_amount = $.pullValue(res_position,'total_amount',0) - $.pullValue(res_position,'entrust_volume',0);
                // res_position.total_amount && results.push(res_position);//根据大燕和alen的要求，去除限制条件
                results.push(res_position);
            });
            return results;
        }

        function tableRendered(){
            me.find('table').find('tr:even').addClass('active');

            me.find('[rows-body] tr').each(function(){
                var position = $(this).getCoreData();
                //期货特别处理，期货 stock_id 是 708090
                (position.stock_id==708090) && $(this).find('[data-src*=stock_name]').html('期货') && $(this).find('[position-handle]').remove();
            });

            updateListView();
        }

        function updateListView(){
            me.find('[rows-body] tr').each(function(){
                var position = $(this).getCoreData();
                var can_view = $.pullValue(position,'product.checked',0);
                // Begin added by liuzeyafzy for bug id 1002713
                var can_calc = can_view;
                if (0 == position.total_amount) {
                    can_view = false;
                }
                $(this).toggleClass('can_calc',can_calc);
                // End added by liuzeyafzy for bug id 1002713
                $(this).toggleClass('can_view',can_view);
                can_view ? $(this).show() : $(this).hide();
            });
            reCalculateTotalInfo();
        }

        function reCalculateTotalInfo(){
            var rows_total = me.find('[rows-total]');
            var total_info = {};
            var rows = me.find('[rows-body] tr.can_view'); //Modified by liuzeyafzy for bug id 1002713
            // 将id相同的行进行汇总，给到最后一行进行展示。
            rows.each(function(){
                var item = $(this).getCoreData();
                for(var i in item){
                    if( /id$/.test(i) ){ //id 特别保留处理
                        !total_info[i] && (total_info[i] = item[i]);
                        continue;
                    }else{
                        total_info['total_'+i] = (total_info['total_'+i]||0)+(+(item[i]));
                    }
                }
            });

            rows_total.render(total_info);
            setTimeout(function(){
                rows.length ? rows_total.show() : rows_total.hide();
            });
            me.find('.nothing-nothing').toggleClass('nothing', !rows.length);
            $(window).trigger({
                type: 'positionGrid_listNum',
                num: rows.length
            })
        }
    }).call(document.scripts[document.scripts.length-1].parentNode);
    </script>
</section>
