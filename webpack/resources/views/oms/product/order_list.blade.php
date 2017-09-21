<section class="order-list" style="display:none;">
    <div class="hd" section-head>
        <span class="section-title">订单</span>

        <a if="is_running" class="oms-btn gray refresh-btn loading-loading" href="javascript:;"><i class="oms-icon refresh"></i>刷新</a>

        {{--
            <a if="cup.product_manger" class="oms-btn gray download-history-btn" target="_blank"
           data-href="{{ config('view.path_prefix','') }}/oms/order/get_deal_list?permission_type=product&product_id=${product_id}&start=2015-01-01&to=csv">&#8659;下载历史成交</a>
        --}}

        <span class="order-list-ctrls right loading-loading list-ctrls">
            <a if="is_running" data-uri="{{ config('view.path_prefix','') }}/oms/order/get_entrust_list?permission_type=product&type=all&product_id=${product_id}" class="active" href="javascript:;">今日委托</a>
            <a if="is_running" data-uri="{{ config('view.path_prefix','') }}/oms/order/get_deal_list?permission_type=product&product_id=${product_id}" class="done" href="javascript:;">今日成交</a>
            <a data-uri="{{ config('view.path_prefix','') }}/oms/order/get_deal_list?permission_type=product&product_id=${product_id}&start=2015-01-01" class="done" href="javascript:;">历史成交</a>
        </span>
    </div>

    <table class="oms-table loading-loading nothing-nothing">
        <tr class="hd" rows-head>
            <th sort-by="updated_at">
                <span if="done|isFalse">更新时间</span>
                <span if="done">成交时间</span>
            </th>
            <th if="done|isFalse" sort-by="created_at">委托时间</th>

            <th>方向</th>

            <th>代码</th>
            <th style="width:150px;">名称</th>

            <th class="cell-right border-left">成交价</th>
            <th if="done|isFalse" class="cell-right border-left">委托价</th>

            <th class="cell-right border-right">成交量</th>
            <th if="done|isFalse" class="cell-right">委托量</th>
            <th if="done|isFalse" class="cell-right">成交百分比</th>

            <th sort-by="status" if="done|isFalse" class="cell-right">订单状态</th>
            <th if="done|isFalse"></th>
        </tr>
        <tbody class="loading-hide nothing-hide" rows-body></tbody>
        <!-- order-list 数据模板-->
        <script type="text/html" row-tpl>
            <tr>
                <td data-src="updated_at|unixTime"></td>
                <th if="done|isFalse" data-src="created_at|unixTime"></th>

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
                <td if="done|isFalse" class="cell-right"><span data-src="deal.amount|devided_by:entrust.amount|numeral:0.00%"></span></td>

                <td if="done|isFalse" class="cell-right">
                    <str if="|isFinish|isFalse" class="red"  data-src="status|statusCH"></str>
                    <str if="|isFinish" data-src="status|statusCH"></str>
                </td>
                <td if="done|isFalse" class="cell-right" style="width:75px;">
                    <div if="status|inNumsList:1:2:4">
                        <div if="cancel_status|outNumsList:1:2 AND me_can_trade">
                            <a class="open-detail oms-btn sm red" href="javascript:;">撤单</a>
                        </div>
                        <div if="cancel_status|inNumsList:1:2 OR me_can_trade|isFalse">
                            <a class="open-detail oms-btn sm gray" href="javascript:;">详情</a>
                        </div>
                    </div>
                    <div if="status|outNumsList:1:2:4">
                        <a class="open-detail oms-btn sm gray" href="javascript:;">详情</a>
                    </div>
                </td>
            </tr>
        </script>
    </table>
    <div class="page-ctrls" data-src="|getPageControls"></div>

    <script>
    (function(){
        var me = $(this);
        var me_can_trade = false;

        $(function(){
            me.find('.list-ctrls').on('click','a',function(){
                $(this).addClass('active').siblings().removeClass('active');
                // 加载 orders 数据
                var dataSrc = $(this).data('uri').replace('${product_id}',PRODUCT.id);
                me.find('.list-ctrls').data('done', $(this).is('.done'));
                loadOrderList(dataSrc, renderOrderList);
            });

            me.on('click','.open-detail',function(){
                var order = $(this).closest('tr').data('srcData');

                //尝试把全局的策略信息传递给
                !order.product && window.PRODUCT && (order.product = window.PRODUCT);

                //如果还是没有策略信息，远程获取，下面有两个全局函数，坑啊
                order.product
                ? $(window).trigger({type:'open_order_by_order',order:order})
                : getProductInfoById(order.product_id).then(function(product_info){
                    order.product = product_info.basic;
                    $(window).trigger({type:'open_order_by_order',order:order})
                });
            });

            me.find('.page-ctrls').on('nav',function(event){
                // 塞入参数然后加载 orders 数据
                var page_num = event.page_num;
                var dataSrc = me.find('.list-ctrls a.active').data('uri').replace('${product_id}',PRODUCT.id).replace('?','?page='+page_num+'&');
                loadOrderList(dataSrc, renderOrderList);
            });

            me.find('[rows-head]').on('sort_by:changed',updateActiveOrderList);

            me.find('.refresh-btn').click(updateActiveOrderList);
        });

        $(window).on('entrust_update_updated',function(event){
            if( event.updated_timestamp > me.find('[rows-body]').attr('last_updated_timestamp') ){
                updateEntrustList();
                setTimeout(updateEntrustList,5000);
            }

            function updateEntrustList(){
                !me.find('.list-ctrls .done').is('.active')
                && !me.find('.list-ctrls').is('.loading')
                && updateActiveOrderList();
            }
        //启动本模块的代码
        }).on('load spa_product_change',function(event){
            var product = event.product||PRODUCT;
            me_can_trade = product.is_running && $.pullValue(product,'current_user_permission.product_do_trade',NaN);

            !product.is_waiting ? me.show() : me.hide();
            !product.is_waiting && me.find('[section-head]').render(product).find('.list-ctrls a:not(.if-stuck)').first().click();

            //下载历史，product_id 更新
            var download_btn = me.find('.download-history-btn');
            download_btn.length && download_btn.attr( 'href', (download_btn.data('href')||'').replace('${product_id}',product.id) );
        }).on('oms_workflow_handle_done',
            setTimeout.bind(null,updateActiveOrderList,1500)
        );

        function updateActiveOrderList(){
            me.find('.list-ctrls a.active').click();
        }

        function isDoneOrderListAcitve(){
            return me.find('.list-ctrls').has('.done.active').length;
        }

        function loadOrderList(uri, callback){
            me.find('.loading-loading').addClass('loading');
            me.find('.nothing-nothing').removeClass('nothing');

            var last_loading_timestamp = new Date().valueOf()
            me.find('.list-ctrls').attr('last_loading_timestamp',last_loading_timestamp);

            $.getJSON(uri, me.find('[rows-head]').getRowsHeadSortParams() ).done(function(res){
                if( me.find('.list-ctrls').attr('last_loading_timestamp')!=last_loading_timestamp ){return;}

                // 分页逻辑
                $.pullValue(res,'data.list') ? me.find('.page-ctrls').render( $.pullValue(res,'data') ) : me.find('.page-ctrls').html('');
                // 获取数据列表的逻辑，兼容分页数据和非分页数据
                var orders = $.pullValue(res,'data.list',$.pullValue(res,'data',[]));

                orders.forEach(function(order){
                    order.me_can_trade = me_can_trade;
                    order.done = isDoneOrderListAcitve();
                });

                //填充委托单列表数据
                res.code==0 ? mergeOrderStocksInfo(orders).then(function(){
                    if( me.find('.list-ctrls').attr('last_loading_timestamp')!=last_loading_timestamp ){return;}
                    callback(orders);
                }) : $.omsAlert(res.code + ' : ' + (res.msg || '未知错误') + '，请稍候重试！',false);

                res.code==0 && me.find('[rows-body]').attr('last_updated_timestamp',(res.timestamp||0));
            }).always(function(){
                if( me.find('.list-ctrls').attr('last_loading_timestamp')!=last_loading_timestamp ){return;}
                me.find('.loading-loading').removeClass('loading');
            });
        }

        function renderOrderList(data){
            me.find('[rows-head]').render({done:me.find('.list-ctrls').data('done')});

            me.renderTable(data);

            !data.length && me.find('.nothing-nothing').addClass('nothing');
        }
    }).call( document.scripts[document.scripts.length-1].parentNode );
    </script>
</section>
