<div class="section-panel trade-5" updown-monitor="udm_trade_5:${stock_id}">
    <div class="panel high-low">
        <h1 class="loading-loading">
            <span data-src="stock_code|--" class="code">- -</span><br/>
            <span data-src="stock_name|--">- -</span>
        </h1>
        <div class="hd loading-loading" data-class="change_ratio|rmgColor">
            <b data-src="last_price|numeral:0,0.000">- -</b> &nbsp;
            <span data-src="change|numeral:0,0.000"></span>
            <span data-src="change_ratio|numeral:0,0.000%"></span>
        </div>
        <div class="bd">
            <p>
                今开：<span data-src="open_price|numeral:0,0.000" data-class="open_price|minus:prev_close_price|rmgColor">- -</span><br/>
                昨收：<span data-src="prev_close_price|numeral:0,0.000">- -</span>
            </p>
            <p>
                最高：<span data-src="high_price|numeral:0,0.000" data-class="high_price|minus:prev_close_price|rmgColor">- -</span><br/>
                最低：<span data-src="low_price|numeral:0,0.000" data-class="low_price|minus:prev_close_price|rmgColor">- -</span>
            </p>
            <p>
                涨停：<span class="stop_top_price" data-src="stop_top|numeral:0,0.000" data-class="stop_top|minus:prev_close_price|rmgColor">- -</span><br/>
                跌停：<span class="stop_down_price" data-src="stop_down|numeral:0,0.000" data-class="stop_down|minus:prev_close_price|rmgColor"></span>
            </p>
        </div>
    </div>
    <div class="panel ask-bid">
        <table>
            <tbody class="ask">
                <tr>
                    <td>卖5</td>
                    <td data-src="ask5_price|numeral:0,0.000" data-class="ask5_price|minus:prev_close_price|rmgColor">- -</td>
                    <td data-src="ask5_volume|numeral:0,0">- -</td>
                </tr>
                <tr>
                    <td>卖4</td>
                    <td data-src="ask4_price|numeral:0,0.000" data-class="ask4_price|minus:prev_close_price|rmgColor">- -</td>
                    <td data-src="ask4_volume|numeral:0,0">- -</td>
                </tr>
                <tr>
                    <td>卖3</td>
                    <td data-src="ask3_price|numeral:0,0.000" data-class="ask3_price|minus:prev_close_price|rmgColor">- -</td>
                    <td data-src="ask3_volume|numeral:0,0">- -</td>
                </tr>
                <tr>
                    <td>卖2</td>
                    <td data-src="ask2_price|numeral:0,0.000" data-class="ask2_price|minus:prev_close_price|rmgColor">- -</td>
                    <td data-src="ask2_volume|numeral:0,0">- -</td>
                </tr>
                <tr>
                    <td>卖1</td>
                    <td data-src="ask1_price|numeral:0,0.000" data-class="ask1_price|minus:prev_close_price|rmgColor">- -</td>
                    <td data-src="ask1_volume|numeral:0,0">- -</td>
                </tr>
                <tr class="blank-tr"><td>&nbsp;</td></tr>
            </tbody>
            <tbody><tr class="hr-tr"><td colspan="3" class="hr"><span class="hr"></span></td></tr></tbody>
            <tbody class="bid">
                <tr>
                    <td>买1</td>
                    <td data-src="bid1_price|numeral:0,0.000" data-class="bid1_price|minus:prev_close_price|rmgColor">- -</td>
                    <td data-src="bid1_volume|numeral:0,0">- -</td>
                </tr>
                <tr>
                    <td>买2</td>
                    <td data-src="bid2_price|numeral:0,0.000" data-class="bid2_price|minus:prev_close_price|rmgColor">- -</td>
                    <td data-src="bid2_volume|numeral:0,0">- -</td>
                </tr>
                <tr>
                    <td>买3</td>
                    <td data-src="bid3_price|numeral:0,0.000" data-class="bid3_price|minus:prev_close_price|rmgColor">- -</td>
                    <td data-src="bid3_volume|numeral:0,0">- -</td>
                </tr>
                <tr>
                    <td>买4</td>
                    <td data-src="bid4_price|numeral:0,0.000" data-class="bid4_price|minus:prev_close_price|rmgColor">- -</td>
                    <td data-src="bid4_volume|numeral:0,0">- -</td>
                </tr>
                <tr>
                    <td>买5</td>
                    <td data-src="bid5_price|numeral:0,0.000" data-class="bid5_price|minus:prev_close_price|rmgColor">- -</td>
                    <td data-src="bid5_volume|numeral:0,0">- -</td>
                </tr>
            </tbody>
        </table>
    </div>
    <script>
    (function(){
        var me = $(this);
        var update_timer;
        var stock;
        var updated_count = 0;

        $(window).on('order_create:stock_code:ready',function(event){
            clear5();
            stock = event.stock;
            update_timer = setInterval(function(){
                update5(stock);
            },5000);
            update5(stock);
        }).on('create_order:stock_code:pattern_stuck',function(){
            clear5();
        });

        me.on('click','[data-src*=_price],[data-src*=stop_top],[data-src*=stop_down]',function(){
            var price = parseFloat($(this).text().trim().replace(/\,/g,'')) || 0;
            price && $('#val_price').val( price ).change() && $('#val_volume').focus();
        });

        function update5(stock){
            me.render($.extend(stock,{loading:true}));

            var url = (window.REQUEST_PREFIX||'')+"/oms/helper/stock_detail?stock_id="+stock.stock_id;

            var last_loading_timestamp = new Date().valueOf();
            me.attr('last_loading_timestamp',last_loading_timestamp);
            me.find('.loading-loading').addClass('loading');
            $.get(url).done(function(res){
                if(last_loading_timestamp!=me.attr('last_loading_timestamp')){return;}

                res.code==0 && renderStockDetail($.pullValue(res,'data.0'));
                (res.code!=0||!res.data||!res.data[0]) && failNotice(res);
            }).fail(failNotice).always(function(){
                if(last_loading_timestamp!=me.attr('last_loading_timestamp')){return;}
                me.find('.loading-loading').removeClass('loading');
            });

            function failNotice(res){
                $.omsAlert($.pullValue(res,'msg','请求异常'),false);
            }
        }

        function renderStockDetail(data){
            updated_count ++;
            stock = data;
            me.render(stock);
            $(window).trigger({type:'order_create:trade_5:updated',stock:stock});

            //当前股票第一次更新
            updated_count==1 && $(window).trigger({type:'order_create:trade_5:updated:first',stock:stock});
        }

        function clear5(){
            updated_count = 0;
            clearInterval(update_timer);
            me.attr('last_loading_timestamp','');
            me.find('.loading-loading').removeClass('loading');
            me.render({});
        }
    }).call(document.scripts[document.scripts.length-1].parentNode);
    </script>
</div>
