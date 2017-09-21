<style>tr[position]{cursor:pointer!important;}</style>
<div class="popup-wrap mod-popup mfp-hide oms-popup popup-stock-history">
    <header class="popup-hd">
        <h2>个股交易历史</h2>
    </header>
    <div class="popup-bd">
        <div class="content-bd">
            <table class="oms-brief-table">
                <tr>
                    <td>交易股票
                        <b>
                            <span data-src="stock.code|getPureCode"></span>
                            <span data-src="stock.name"></span>
                        </b>
                    </td>
                    <td>交易策略
                        <b data-src="product.name"></b>
                    </td>
                </tr>
            </table>
            <table class="oms-table loading-loading nothing-nothing">
                <tr class="hd">
                    <th>交易方向</th>
                    <th>成交时间</th>
                    <th>交易数量</th>
                    <th>交易价格</th>
                    {{-- <th></th> --}}
                </tr>
                <tbody class="loading-hide" rows-body></tbody>
                <script type="text/html" row-tpl>
                    <tr>
                        <td>
                            <span data-src="entrust.model|entrustModelCH"></span><span data-class="entrust.type|mapVal:1->red,2->blue"  data-src="entrust.type|entrustTypeCH"></span>
                        </td>
                        <td data-class="entrust.type|mapVal:1->red,2->blue" data-src="updated_at|unixTime"></td>
                        <td data-class="entrust.type|mapVal:1->red,2->blue">
                            <span data-src="deal.amount|numFormat:0,0"></span>股
                        </td>
                        <td data-class="entrust.type|mapVal:1->red,2->blue">
                            <span data-src="deal.price|numeral:0,0.000"></span>元
                        </td>
                        <!-- <td class="cell-right">
                            <span class="oms-btn sm gray open-order-detail">详情</span>
                        </td> -->
                    </tr>
                </script>
            </table>
            <div class="page-ctrls" data-src="|getPageControls"></div>
        </div>
    </div>
    <script>
    (function(){
        var me = this;
        window.showOrderHistoryByPosition = showOrderHistoryByPosition;

        $(function(){
            me.on('click', '.open-order-detail', function(){
                var order = $(this).closest('tr').getCoreData();
                $(window).trigger({type:'open_order_by_id',order_id:order.id});
            });
        });

        function showOrderHistoryByPosition(position){
            var url = (window.REQUEST_PREFIX||'') + '/oms/order/get_deal_list?permission_type=product&product_id=' + position.product_id + '&count=5&stock_id='+position.stock_id + '&start=2015-01-01';

            me.render({
                product: {
                    name: $.pullValue(position, 'product.name')
                },
                stock: {
                    code: position.stock_id,
                    name: position.stock_name
                }
            });

            $.magnificPopup.open({
                items: {
                    src: me,
                    type: "inline",
                    midClick: true
                },
                callbacks: {
                    open: function(){
                        me.find('table').renderTable([]);

                        loadOrderHistoryList(url);
                        me.find('.page-ctrls').off('nav').on('nav',function(event){
                            // 塞入参数然后加载 orders 数据
                            var page_num = event.page_num;
                            url = url.replace(/page\=\d?\&?/g,'').replace('?','?page='+page_num+'&');
                            loadOrderHistoryList(url);
                        });
                    },
                    close: function(){
                        me.find('.page-ctrls').off('nav');
                    }
                }
            });
        }

        function loadOrderHistoryList(url){
            me.find('.loading-loading').addClass('loading').end().find('.nothing-nothing').removeClass('nothing');
            $.getJSON(url,function(res){
                if(res.code==0){
                    // 分页逻辑
                    $.pullValue(res,'data.list') ? me.find('.page-ctrls').render( $.pullValue(res,'data') ) : me.find('.page-ctrls').html('');
                    // 获取数据列表的逻辑，兼容分页数据和非分页数据
                    var orders = $.pullValue(res,'data.list',$.pullValue(res,'data',[]));

                    orders.length && me.find('table').renderTable(orders);
                    !orders.length && me.find('.nothing-nothing').addClass('nothing');
                }else{
                    $.omsAlert('获取信息失败！'+(res.msg||'未知错误！'),false);
                }
            }).always(function(){
                me.find('.loading-loading').removeClass('loading');
            });
        }
    }).call( $(document.scripts[document.scripts.length-1]).parent() );
    </script>
</div>
