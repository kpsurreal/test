<section class="order-list allocation-allocated_today">
    <div class="hd">
        <span class="section-title">{{
            ((isset($is_commander) && $is_commander) ? '今日已分单，等待委托及回报' : '').
            ((isset($is_executor) && $is_executor) ? '今日未下单' : '').
            (((isset($is_trader) && $is_trader) || (isset($is_creator) && $is_creator)) ? '今日待处理' : '')
        }}{!!
            ((isset($is_commander) && $is_commander) ? '<a href="'.asset("/risk/compare").'" style="padding:0 5px;border:1px solid #f44336;color:#f44336;border-radius:3px;font-size:14px;margin-left:10px;font-weight:normal;display:none;">数据监控核对</a>' : '' )
        !!}</span>

        <a class="oms-btn gray refresh-btn loading-loading" href="javascript:;"><i class="oms-icon refresh"></i>刷新</a>
        <span class="order-list-ctrls right list-ctrls" style="display:none;">
            @if(isset($is_commander) && $is_commander)
                <a data-uri="{{ config('view.path_prefix','') }}/oms/order/get_entrust_list?permission_type=commander&type=undone" class="active" href="javascript:;"></a>
            @endif
            @if(isset($is_executor) && $is_executor)
                <a data-uri="{{ config('view.path_prefix','') }}/oms/order/get_entrust_list?permission_type=executor&type=undone&executor_uid={{ $logined_info['user_id'] }}" class="active" href="javascript:;"></a>
            @endif
            @if(isset($is_trader) && $is_trader)
                <a data-uri="{{ config('view.path_prefix','') }}/oms/order/get_entrust_list?permission_type=trader&type=undone&trader_uid={{ $logined_info['user_id'] }}" class="active" href="javascript:;"></a>
            @endif
            @if(isset($is_creator) && $is_creator)
                <a data-uri="{{ config('view.path_prefix','') }}/oms/order/get_entrust_list?permission_type=trader&type=undone&creator_uid={{ $logined_info['user_id'] }}" class="active" href="javascript:;"></a>
            @endif
        </span>
    </div>

    <table class="oms-table allocated_today-table loading-loading nothing-nothing">
        <tr class="hd">
            <th>订单号</th>
            <th>策略名称</th>
            <th>更新时间</th>

            <th>方向</th>
            <th class="border-left">证券名称/代码</th>

            <th class="cell-right border-left">委托价格/数量</th>

            <th class="cell-right border-left">成交价格/数量</th>
            <th class="cell-right">订单状态</th>

            <th class="cell-right">下单流程</th>
            <th class="cell-right">撤单流程</th>

            @if( (isset($is_commander) && $is_commander) || (isset($is_executor) && $is_executor) )
                <th class="cell-right">最后处理人</th>
            @endif

            <th class="cell-right">操作</th>
        </tr>
        <tbody class="loading-hide nothing-hide loading-loading" rows-body></tbody>
        <script type="text/html" row-tpl>
            <tr>
                <td data-src="id"></td>
                <td data-src="product|getProductLink"></td>
                <td data-src="updated_at|unixTime"></td>

                <td>
                    <span data-src="entrust.type|entrustTypeCH" data-class="entrust.type|mapVal:1->red,2->blue"></span>
                </td>
                <td>
                    <span data-src="stock_info.stock_name"></span>
                    <div data-src="stock.code|getPureCode"></div>
                </td>

                <td class="cell-right border-left">
                    <span>
                        <span if="entrust.model|equalNum:1" data-src="entrust.price|numeral:0,0.000"></span>
                        <span  data-src="entrust.model|entrustModelType"></span>
                    </span>
                    <div data-src="entrust.amount|toFixed:0"></div>
                </td>

                <td class="cell-right border-left">
                    <span data-src="deal.price|numeral:0,0.000"></span>
                    <div data-src="deal.amount|toFixed:0"></div>
                </td>

                <td class="cell-right" data-src="status|statusCH"></td>
                <td class="cell-right">
                    <span class="red" data-src="order_status|orderStatusCH"></span>
                </td>
                <td class="cell-right">
                    <span data-class="cancel_status|mapVal:1->red,2->red" data-src="cancel_status|cancelStatusCH"></span>
                </td>

                @if( (isset($is_commander) && $is_commander) || (isset($is_executor) && $is_executor) )
                    <td class="cell-right" data-src="last_handler.real_name|showUserName"></td>
                @endif

                <td class="cell-right" style="width:75px;">
                    @if(isset($is_commander) && $is_commander)
                        <a class="open-detail oms-btn sm yellow" href="javascript:;">详情</a>
                    @endif
                    @if(isset($is_executor) && $is_executor)
                        <span if="order_status|<:3"><a class="open-detail oms-btn sm yellow" href="javascript:;">委托</a></span>
                        <span if="order_status|>=:3"><a class="open-detail oms-btn sm yellow" href="javascript:;">回报</a></span>
                    @endif
                    @if((isset($is_trader) && $is_trader) || (isset($is_creator) && $is_creator))
                        <span if="cancel_status|<:1"><a class="open-detail oms-btn sm red" href="javascript:;">撤单</a></span>
                        <span if="cancel_status|>=:1"><a class="open-detail oms-btn sm yellow" href="javascript:;">详情</a></span>
                    @endif
                </td>
            </tr>
        </script>
    </table>
    <div class="page-ctrls" data-src="|getPageControls"></div>

    <script>
    (function(){
        var me = $(this);

        me.find('.list-ctrls').on('click','a',function(){
            $(this).addClass('active').siblings().removeClass('active');
            var dataSrc = $(this).data('uri');
            me.find('.list-ctrls').data('done', $(this).is('.done'));
            loadOrderList(dataSrc, renderOrderList);
        });

        me.find('.page-ctrls').on('nav',function(event){
            var page_num = event.page_num;
            var dataSrc = me.find('.list-ctrls a.active').data('uri').replace('?','?page='+page_num+'&');
            loadOrderList(dataSrc, renderOrderList);
        });

        me.find('[rows-body]').on('click','.open-detail:not(.disabled)',function(){
            var order = $(this).closest('tr').data('srcData');
            order.live_with = $(this);
            $(window).trigger({type:'open_order_by_order',order:order});
        });

        me.find('.refresh-btn').on('click',updateWaitingOrderList);

        $(window).on('oms_workflow_handle_done',
            setTimeout.bind(null,updateWaitingOrderList,1500)
        ).on('wait_done_updated wait_updated',function(event){
            if( event.updated_timestamp > me.find('[rows-body]').attr('last_updated_timestamp') ){
                updateAllocList();
                setTimeout(updateAllocList,5000);
            }
            function updateAllocList(){
                !me.find('[rows-body]').is('.loading')
                && updateWaitingOrderList();
            }
        });

        $(updateWaitingOrderList);

        function updateWaitingOrderList(){
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

            $.getJSON(uri).done(function(res){
                if( me.find('.list-ctrls').attr('last_loading_timestamp')!=last_loading_timestamp ){return;}

                // 分页逻辑
                $.pullValue(res,'data.list') ? me.find('.page-ctrls').render( $.pullValue(res,'data') ) : me.find('.page-ctrls').html('');
                // 获取数据列表的逻辑，兼容分页数据和非分页数据
                var orders = $.pullValue(res,'data.list',$.pullValue(res,'data',[]));

                //填充委托单列表数据
                res.code==0 ? mergeOrderStocksInfo(orders).then(function(){
                    // mergeOrderLastHandlersInfo(orders).then(function(){
                        mergeProductsBriefInfo(orders).then(function(){
                            if( me.find('.list-ctrls').attr('last_loading_timestamp')!=last_loading_timestamp ){
                                return false;//过期结果直接抛弃
                            }
                            callback(orders);
                        });
                    // });
                }) : $.omsAlert(res.code + ' : ' + (res.msg || '未知错误') + '，请稍候重试！',false);

                res.code==0 && me.find('[rows-body]').attr('last_updated_timestamp',(res.timestamp||0));

                //订单通知处理，有waiting的，持续响铃，没有waiting的，只响一次
                orders.filter(function(order){
                    return +order.status<2;
                }).length ? $(window).trigger({type:'some_order_is_waiting'}) : $(window).trigger({type:'no_order_is_waiting'});
            }).always(function(){
                if( me.find('.list-ctrls').attr('last_loading_timestamp')!=last_loading_timestamp ){return;}
                me.find('.loading-loading').removeClass('loading');
            });
        }

        function renderOrderList(data){
            data.forEach(function(order,index){
                order.wf_id = order.workflow_id;
                // order.product = getProductById(order.product_id);
            });
            me.renderTable(data);
            !data.length && me.find('.nothing-nothing').addClass('nothing');
        }

        function getProductById(id){
            return PRODUCTS.filter(function(x){
                return x.id == id;
            })[0];
        }
    }).call( document.scripts[document.scripts.length-1].parentNode );
    </script>
</section>
