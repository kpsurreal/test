<div>
    <div class="order-deal-history nothing-nothing loading-loading">
        <table class="oms-table order-deal-history-table nothing-nothing loading-loading">
            <tr class="hd">
                <th>成交时间</th>
                <th>数量</th>
                <th class="cell-right">价格</th>
            </tr>
            <tbody class="loading-hide" rows-body></tbody>
            <script type="text/html" row-tpl>
                <tr>
                    <td data-src="updated_at|unixTime"></td>
                    <td><span data-src="deal.amount|numFormat:0,0"></span>股</td>
                    <td class="cell-right"><span data-src="deal.price|numeral:0,0.000"></span>元</td>
                </tr>
            </script>
        </table>
    </div>
    <script>
    (function(){
        var me = $(this);

        $(window).on('order_open',function(event){
            var order = event.order;
            me.renderTable([]);
            order.order_status>='3' ? loadOrderDealHistory(order) : me.find('.nothing-nothing').addClass('nothing');
        });

        function loadOrderDealHistory(order){
            me.find('.loading-loading').addClass('loading');
            me.find('.nothing-nothing').removeClass('nothing');

            $.getJSON((window.REQUEST_PREFIX||'')+'/oms/order/get_deal_list?permission_type=product', {
                'workflow_id': order.id
            }).done(function(res){
                if(res.code==0){
                    var orders = $.pullValue(res,'data.list',$.pullValue(res,'data',[]));
                    orders.length && me.renderTable(orders);
                    !orders.length && me.find('.nothing-nothing').addClass('nothing');
                }else{
                    $.omsAlert('获取信息失败！'+(res.msg||'未知错误！'),false);
                }
            }).always(function(){
                me.find('.loading-loading').removeClass('loading');
            });
        }
    }).call(document.scripts[document.scripts.length-1].parentNode);
    </script>
</div>
