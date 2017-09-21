<section class="product-position" style="display:none;" inner-sort>
    <div class="hd">
        <span class="section-title">当前持仓</span>
        <a class="oms-btn gray refresh-btn loading-loading"><i class="oms-icon refresh"></i>刷新</a>
        <span class="right" style="font-size:16px;font-weight:600;color:#000;" rows-total>当前仓位 <span data-src="total_weight|numeral:0.00%">--.--%</span></span>
    </div>
    <table class="oms-table nothing-nothing loading-loading">
        <tr class="hd" rows-head>
            <th class="cell-left" sort-by="stock_id">证券代码</th>
            <th class="cell-left" sort-by="stock_name">证券名称</th>

            <th sort-by="cost_price">成本价</th>
            <th sort-by="market_price">最新价</th>
            <th sort-by="total_amount">持仓数量</th>
            <th sort-by="enable_sell_volume">可卖数量</th>

            <th sort-by="market_value">市值</th>
            <th sort-by="today_earning">当日盈亏</th>
            <th sort-by="earning">浮动盈亏</th>
            <th sort-by="earning_ratio">盈亏率</th>
            <th sort-by="weight">所占仓位</th>

            <th>操作 &nbsp;  &nbsp;</th>
        </tr>
        <tbody rows-body></tbody>
        <tbody rows-total style="display:none;" updown-monitor="udm_position_total:${product_id}">
            <tr>
                <th class="cell-left" colspan='6'>当前持仓汇总</th>
                <td data-src="total_market_value|numeral:0,0.00"></td>
                {{-- <td data-src="total_today_earning|signNumeral:0,0.00" data-class="total_today_earning|rgColor"></td> --}}
                <td data-src="total_earning|signNumeral:0,0.00" data-class="total_earning|rgColor" colspan="2"></td>
                <td data-src="total_weight|numeral:0.00%" class="product-position-total" colspan='2'></td>
                <td></td>
            </tr>
        </tbody>
        <script type="text/html" row-tpl>
            <tr position updown-monitor="udm_position:${product_id}-${stock_id}">
                <!-- <td data-src="industry"></td> -->
                <td class="cell-left" data-src="stock_id"></td>
                <td class="cell-left" data-src="stock_name"></td>

                <td data-src="cost_price|numeral:0.000"></td>
                <td data-class="earning|rgColor" data-src="market_price|numeral:0.000"></td>
                <td data-src="total_amount|numeral:0,0"></td>
                <td data-src="enable_sell_volume|numeral:0,0"></td>

                <td data-class="earning|rgColor" data-src="market_value|numeral:0,0.00"></td>
                <td data-class="today_earning|rgColor" data-src="today_earning|signNumeral:0,0.00"></td>
                <td data-class="earning|rgColor" data-src="earning|signNumeral:0,0.00"></td>
                <td data-class="earning_ratio|rgColor" data-src="earning_ratio|signNumeral:0.00%"></td>
                <td data-src="weight|numeral:0.00%"></td>

                <td>
                    <span class="oms-btn sm gray three" position-handle direction="follow">加自选</span>
                    <!-- <span class="oms-btn sm gray five" position-handle direction="stop_orders">止盈/止损</span> -->
                    <span class="oms-btn sm red" position-handle direction="buy">买入</span>
                    <span class="oms-btn sm blue" position-handle direction="sell">卖出</span>
                </td>
            </tr>
        </script>
    </table>

    <script>
    (function(){
        var me = $(this);
        var me_can_trade = false;

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

                return false;
            }).on('click','tr[position]',function(){
                var position_data = $(this).data('srcData');
                window.showOrderHistoryByPosition && showOrderHistoryByPosition( position_data );
            });
        });

        //刷新通用的逻辑代码
        $(window).on('position_update_updated',function(event){
            event.updated_timestamp > me.attr('last_updated_timestamp')
            && !me.find('loading-loading').is('.loading')
            && loadRealtimePositionInfo();

        //启动本模块的代码
        }).on('load spa_product_change',function(event){
            var product = event.product||PRODUCT;
            me_can_trade = product.is_running && $.pullValue(product,'current_user_permission.product_do_trade',NaN);

            product.is_running ? me.show() : me.hide();
            product.is_running && renderPostionRealTime();
            product.is_running && loadRealtimePositionInfo();

            //5s 钟自动刷新持仓数据
            event.type=='load' && product.is_running && setInterval(function(){
                !me.find('.nothing-nothing').is('.nothing') && !me.find('.loading-loading').is('.loading') && loadRealtimePositionInfo();
            },5000);
        }).on('product_detail_changed',function(event){
            var product = event.product;
            var position = +$.pullValue(product,'runtime.position',0);
            me.find('[data-src*=total_weight],[total-weight]').attr('total-weight',position).removeAttr('data-src').text( numeral(position).format('0.00%') );
        });

        function loadRealtimePositionInfo(){
            me.find('.loading-loading').addClass('loading').end().find('.nothing-nothing').removeClass('nothing');

            var url = (window.REQUEST_PREFIX||'')+'/oms/api/position_realtime?product_id='+PRODUCT.id;

            var last_loading_timestamp = new Date().valueOf();
            me.attr('last_loading_timestamp',last_loading_timestamp);

            //######################### 风控增补数据 risk_check js 用到 ########################
            $.get((window.REQUEST_PREFIX||'')+'/oms/helper/risk_position',{product_id:[PRODUCT.id]}, function(res){
                if (0 == res.code) {
                    window.risk_position = res.data;
                }
            });
            //######################### 风控增补数据 risk_check js 用到 ########################

            $.get(url,{
            // with_entrust: 1 //暂时干掉 with_entrust
            }).done(function(res){
                if(last_loading_timestamp!=me.attr('last_loading_timestamp')){return;}

                if(res.code==0){
                    var position_realtime = res.data;
                    window.position_realtime = position_realtime;
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

            position_realtime = $.omsCacheLocalJsonData('position_realtime',PRODUCT.id,position_realtime);

            me.renderTable(position_realtime);
            me.find('table').find('tr:even').addClass('active');

            me.find('[rows-body] tr').each(function(){
                var position = $(this).getCoreData();
                //期货特别处理，期货 stock_id 是 708090
                (position.stock_id==708090) && $(this).find('[data-src*=stock_name]').html('期货') && $(this).find('[position-handle]').remove();
            });

            !me_can_trade && me.find('[rows-body] tr [position-handle]').remove();

            $(window).trigger({type:'product:position:updated',position:position_realtime});
        }

        function correctPositionWithEntrust(position_realtime){
            if( $.type(position_realtime)!='array' ){return position_realtime};

            //WithEntrust已经停止使用了，且需要支持当天显示已清仓策略，所以不需要做处理了。
            return position_realtime;

            // //WithEntrust 的持仓，是包含委托中的数据的，需要把委托中的数据提出来，才能变成真实持仓
            // var results = [];
            // position_realtime.forEach(function(position){
            //     if(position.stock_id==708090){
            //         results.push(position);
            //         return;
            //     }
            //
            //     var res_position = $.extend({},position);//数据 copy
            //     //纠正 total_amount;
            //     res_position.total_amount = $.pullValue(res_position,'total_amount',0) - $.pullValue(res_position,'entrust_volume',0);
            //     res_position.total_amount && results.push(res_position);
            // });
            // return results;
        }
    }).call(document.scripts[document.scripts.length-1].parentNode);
    </script>
</section>
