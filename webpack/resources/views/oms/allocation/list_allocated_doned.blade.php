<section class="order-list allocation-done">
    <div class="hd">
        <span class="section-title">已完成订单</span>
        <a class="oms-btn gray right refresh-btn loading-loading" href="javascript:;"><i class="oms-icon refresh"></i>刷新</a>
        @if(isset($is_commander) && $is_commander)
            <!-- 3.8.1 版本隐藏下载入口 -->
            <!-- <a class="oms-btn gray download-history-btn" href="{{ config('view.path_prefix','') }}/oms/order/get_entrust_list?permission_type=commander&type=done&start=2015-01-01&to=csv">&#8659;下载历史委托</a> -->
            <span class="order-list-ctrls right list-ctrls">
                <a data-uri="{{ config('view.path_prefix','') }}/oms/order/get_entrust_list?permission_type=commander&type=done" class="done active" href="javascript:;">今日</a>
                <a data-uri="{{ config('view.path_prefix','') }}/oms/order/get_entrust_list?permission_type=commander&type=done&start=2015-01-01" class="done" href="javascript:;">历史全部</a>
            </span>
        @endif
        @if(isset($is_executor) && $is_executor)
            <!-- 3.8.1 版本隐藏下载入口 -->
            <!-- <a class="oms-btn gray download-history-btn" href="{{ config('view.path_prefix','') }}/oms/order/get_entrust_list?permission_type=executor&type=done&executor_uid={{ $logined_info['user_id'] }}&start=2015-01-01&to=csv">&#8659;下载历史委托</a> -->
            <span class="order-list-ctrls right list-ctrls">
                <a data-uri="{{ config('view.path_prefix','') }}/oms/order/get_entrust_list?permission_type=executor&type=done&executor_uid={{ $logined_info['user_id'] }}" class="done active" href="javascript:;">今日</a>
                <a data-uri="{{ config('view.path_prefix','') }}/oms/order/get_entrust_list?permission_type=executor&type=done&executor_uid={{ $logined_info['user_id'] }}&start=2015-01-01" class="done" href="javascript:;">历史全部</a>
            </span>
        @endif
        @if(isset($is_trader) && $is_trader)
            <span class="order-list-ctrls right list-ctrls">
                <a data-uri="{{ config('view.path_prefix','') }}/oms/order/get_entrust_list?permission_type=trader&type=done&trader_uid={{ $logined_info['user_id'] }}" class="done active" href="javascript:;">今日</a>
                <a data-uri="{{ config('view.path_prefix','') }}/oms/order/get_entrust_list?permission_type=trader&type=done&trader_uid={{ $logined_info['user_id'] }}&start=2015-01-01" class="done" href="javascript:;">历史全部</a>
            </span>
        @endif
        @if(isset($is_creator) && $is_creator)
            <span class="order-list-ctrls right list-ctrls">
                <a data-uri="{{ config('view.path_prefix','') }}/oms/order/get_entrust_list?permission_type=trader&type=done&creator_uid={{ $logined_info['user_id'] }}" class="done active" href="javascript:;">今日</a>
                <a data-uri="{{ config('view.path_prefix','') }}/oms/order/get_entrust_list?permission_type=trader&type=done&creator_uid={{ $logined_info['user_id'] }}&start=2015-01-01" class="done" href="javascript:;">历史全部</a>
            </span>
        @endif
    </div>

    <table class="oms-table loading-loading nothing-nothing">
        <tr class="hd" rows-head>
            <th>订单号</th>
            <th>所属策略</th>
            <th sort-by="created_at">委托时间</th>
            <th sort-by="updated_at">成交时间</th>

            <th>方向</th>
            <th class="border-left">证券代码</th>
            <th class="">证券名称</th>

            <th class="cell-right border-left">成交价</th>
            <th class="cell-right border-left">委托价</th>

            <th class="cell-right border-right">成交量</th>
            <th class="cell-right border-right">委托量</th>
            <th sort-by="status" class="cell-right">订单状态</th>
            <th></th>
        </tr>
        <tbody class="loading-hide nothing-hide loading-loading" rows-body></tbody>
        <!-- order-list 数据模板-->
        <script type="text/html" row-tpl>
            <tr>
                <td data-src="id"></td>
                <td data-src="product|getProductLink"></td>
                <td data-src="created_at|unixTime"></td>
                <td data-src="updated_at|unixTime"></td>

                <td>
                    <span data-src="entrust.type|entrustTypeCH" data-class="entrust.type|mapVal:1->red,2->blue"></span>
                </td>
                <td><span data-src="stock.code|getPureCode"></span></td>
                <td><span data-src="stock_info.stock_name"></span></td>

                <td class="cell-right border-left"><span data-src="deal.price|numeral:0,0.000"></span></td>
                <td if="done|isFalse" class="cell-right border-left">
                    <span if="entrust.model|equalNum:1" data-src="entrust.price|numeral:0,0.000"></span>
                    <span  data-src="entrust.model|entrustModelType"></span>
                </td>
                <td class="cell-right border-right"><span data-src="deal.amount|toFixed:0"></span></td>
                <td if="done|isFalse" class="cell-right"><span data-src="entrust.amount|toFixed:0"></span></td>

                <td class="cell-right" data-src="status|statusCH"></td>
                <td class="cell-right" style="width:75px;">
                    <a class="open-detail oms-btn sm gray" href="javascript:;">详情</a>
                </td>
            </tr>
        </script>
    </table>
    <div class="page-ctrls" data-src="|getPageControls"></div>

    <script>
    (function(){
        var me = $(this);

        $(function(){
            setDownloadBtn();
            me.find('.list-ctrls').on('click','a',function(){
                $(this).addClass('active').siblings().removeClass('active');
                // 加载 orders 数据
                var dataSrc = $(this).data('uri');
                me.find('.list-ctrls').data('done', $(this).is('.done'));
                loadOrderList(dataSrc, renderOrderList);
                setDownloadBtn();
            });

            me.find('.page-ctrls').on('nav',function(event){
                // 塞入参数然后加载 orders 数据
                var page_num = event.page_num;
                var dataSrc = me.find('.list-ctrls a.active').data('uri').replace('?','?page='+page_num+'&');
                loadOrderList(dataSrc, renderOrderList);
            });

            me.find('[rows-head]').on('sort_by:changed',updateActiveOrderList);

            me.find('[rows-body]').on('click','.open-detail:not(.disabled)',function(){
                var order = $(this).closest('tr').data('srcData');
                order.live_with = $(this);
                $(window).trigger({type:'open_order_by_order',order:order});
            });

            $(window).on('oms_workflow_handle_done',
                setTimeout.bind(null,updateActiveOrderList,1500)
            ).on('done_updated',function(event){
                if( event.updated_timestamp > me.find('[rows-body]').attr('last_updated_timestamp') ){
                    updateAllocList();
                    setTimeout(updateAllocList,5000);
                }
                function updateAllocList(){
                    !me.find('[rows-body]').is('.loading')
                    && updateActiveOrderList();
                }
            }).on('load',updateActiveOrderList);

            me.find('.refresh-btn').on('click',updateActiveOrderList);
        });

        function updateActiveOrderList(){
            me.find('.list-ctrls').find('a.active').click();
        }

        function isDoneOrderListAcitve(){
            return me.find('.list-ctrls').has('.done.active').length;
        }

        function loadOrderList(uri, callback){
            me.find('.loading-loading').addClass('loading');
            me.find('.nothing-nothing').removeClass('nothing');

            var last_loading_timestamp = new Date().valueOf()
            me.find('.list-ctrls').attr('last_loading_timestamp',last_loading_timestamp);

            $.getJSON( uri, me.find('[rows-head]').getRowsHeadSortParams() ).then(function(res){
                if( me.find('.list-ctrls').attr('last_loading_timestamp')!=last_loading_timestamp ){
                    return false;//过期结果直接抛弃
                }
                me.find('.loading-loading').removeClass('loading');

                // 分页逻辑
                $.pullValue(res,'data.list') ? me.find('.page-ctrls').render( $.pullValue(res,'data') ) : me.find('.page-ctrls').html('');
                // 获取数据列表的逻辑，兼容分页数据和非分页数据
                var orders = $.pullValue(res,'data.list',$.pullValue(res,'data',[]));

                orders.forEach(function(order){
                    order.wf_id = order.workflow_id;
                    order.product = getProductById(order.product_id);
                });

                //填充委托单列表数据
                res.code==0 ? mergeOrderStocksInfo(orders).then(function(){
                    mergeProductsBriefInfo(orders).then(function(){
                        if( me.find('.list-ctrls').attr('last_loading_timestamp')!=last_loading_timestamp ){
                            return false;//过期结果直接抛弃
                        }
                        callback && callback(orders);
                    });
                }) : $.omsAlert(res.code + ": " + (res.msg || '未知错误') + '，请稍候重试！',false);

                res.code==0 && me.find('[rows-body]').attr('last_updated_timestamp',(res.timestamp||0));
            });
        }

        function renderOrderList(data){
            me.renderTable(data);
            !data.length && me.find('.nothing-nothing').addClass('nothing');
        }

        function getProductById(id){
            return PRODUCTS.filter(function(x){
                return x.id == id;
            })[0];
        }

        function setDownloadBtn(){
            //下载今日成交，下载历史成交
            var is_today = me.find('.list-ctrls').find('a.active').is(':contains(今日)');
            var btn = me.find('.download-history-btn');

            if(!btn.length){return;}

            var href = btn.attr('href');
            var target_date = is_today ? moment().format('YYYY-MM-DD') : '2015-01-01';
            btn.html(
                is_today ? btn.html().replace('历史','今日') : btn.html().replace('今日','历史')
            ).attr('href', href.replace(/(\&start\=)\d{4}\-\d{2}-\d{2}/,'&start='+target_date) );
        }
    }).call( document.scripts[document.scripts.length-1].parentNode );
    </script>
</section>
