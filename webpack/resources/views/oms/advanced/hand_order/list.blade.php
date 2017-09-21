<section class="order-list hand_order advanced wait">
    <div class="hd">
        <span class="select-wrap" style="display:none;">筛选策略：<select name="product_id" more-param><option value="">全部策略</option></select></span>
        <a class="oms-btn gray refresh-btn loading-loading right" href="javascript:;"><i class="oms-icon refresh"></i>刷新</a>
        <span class="order-list-ctrls right list-ctrls" style="display:none;">
            <a data-uri="{{ config('view.path_prefix','') }}/oms/advanced/get_hand_order_list?" class="active" href="javascript:;"></a>
        </span>
    </div>

    <table class="oms-table loading-loading nothing-nothing">
        <tr class="hd" rows-head>
            <th sort-by="id" sort-type="desc">订单号</th>
            <th>策略</th>
            <th class="border-left">名称/代码</th>
            <th class="cell-right">当前价</th>

            <th class="cell-right">买卖方向</th>
            <th class="cell-right">成交日期</th>
            <th class="cell-right">成交价格</th>
            <th class="cell-right">成交数量</th>
            <th class="cell-right">成交金额</th>

            <th class="cell-right">总计交易费</th>

            <th class="cell-right">操作</th>
        </tr>
        <tbody class="rows-body loading-hide nothing-hide loading-loading" rows-body ></tbody>
        <script type="text/html" row-tpl >
            <tr>
                <td data-src="id"></td>
                <td hover-show-wrap><span data-src="product|getProductLink"></span><span class="append-btn" hover-show>+筛选</span></td>
                <td>
                    <span data-src="stock_info.stock_name"></span>
                    <div data-src="stock_id|getPureCode"></div>
                </td>
                <td class="cell-right" data-src="stock_info.last_price|numeral:0.000"></td>

                <td class="cell-right" data-src="deal_type|entrustTypeCH"></td>
                <td class="cell-right" data-src="dealed_at|moment:YYYY-MM-DD"></td>
                <td class="cell-right" data-src="deal_price|numeral:0,0.000"></td>
                <td class="cell-right" data-src="deal_volume|numeral:0,0.000"></td>
                <td class="cell-right" data-src="deal_amount|numeral:0,0.000"></td>

                <td class="cell-right" data-src="total_fee|numeral:0,0.000"></td>

                <td class="cell-right" class="cell-right" style="width:75px;">
                    <a class="open-detail oms-btn sm yellow open-detail" href="javascript:;">设置</a>
                </td>
            </tr>
        </script>
    </table>
    <div class="page-ctrls" data-src="|getPageControls"></div>

    <script>
    (function(){
        var me = $(this);
        var product_list = [];
        var select_wrap = me.find('.select-wrap');
        var select = select_wrap.find('select');

        me.find('.list-ctrls').on('click','a',function(){
            $(this).addClass('active').siblings().removeClass('active');
            // 加载 items 数据
            var dataSrc = $(this).data('uri');
            loadList(dataSrc, renderList);
        });

        me.find('.page-ctrls').on('nav',function(event){
            var page_num = event.page_num;
            var dataSrc = me.find('.list-ctrls a.active').data('uri').replace('?','?page='+page_num+'&');
            loadList(dataSrc, renderList);
        });

        me.on('click','.open-detail',function(){
            var hand_order = $(this).closest('tr').getCoreData();
            $(window).trigger({type:'open_hand_order_detail',hand_order:hand_order,sponsor:this});
        });

        me.find('.refresh-btn').on('click',updateList);
        me.find('[rows-head]').on('sort_by:changed',updateList);
        select.on('real_change',updateList);
        me.on('click','[rows-body] .append-btn',function(){
            var data = $(this).closest('tr').getCoreData();
            var product_id = $.pullValue(data,'product_id','');
            select.val(product_id).change();
        });

        $(window).on('side_nav_product_list:updated',function(event){
            product_list = $.pullValue(event,'product_list.able_list',[]);
            product_list.length && displayProductsSelect();
        });

        $(window).on('advanced:exec_hand_order_update:success',updateList);

        $(updateList);

        function updateList(){
            me.find('.list-ctrls a.active').click();
        }

        function displayProductsSelect(){
            select.append(product_list.map(function(product){
                return $('<option>').val( product.id ).html( product.id + ' : ' + product.name );
            }));
            select_wrap.show();
        }

        function loadList(uri, callback){
            me.find('.loading-loading').addClass('loading');
            me.find('.nothing-nothing').removeClass('nothing');

            var last_loading_timestamp = new Date().valueOf()
            me.find('[rows-body]').attr('last_loading_timestamp',last_loading_timestamp);

            $.getJSON(uri, me.getMoreParams()).done(function(res){
                if( me.find('[rows-body]').attr('last_loading_timestamp')!=last_loading_timestamp ){return;}

                // 分页逻辑
                $.pullValue(res,'data.list') ? me.find('.page-ctrls').render( $.pullValue(res,'data') ) : me.find('.page-ctrls').html('');
                // 获取数据列表的逻辑，兼容分页数据和非分页数据
                var orders = $.pullValue(res,'data.list',$.pullValue(res,'data',[]));

                !orders.length && callback([]);

                //填充委托单列表数据
                res.code==0 ? mergeGaosongzhuanStocksInfo(orders).then(function(){
                    mergeProductsBriefInfo(orders).then(function(){
                        if( me.find('[rows-body]').attr('last_loading_timestamp')!=last_loading_timestamp ){return;}
                        callback(orders);
                    });
                }) : $.omsAlert(res.code + ' : ' + (res.msg || '未知错误') + '，请稍候重试！',false);

                res.code==0 && me.find('[rows-body]').attr('last_updated_timestamp',(res.timestamp||0));
            }).always(function(){
                if( me.find('[rows-body]').attr('last_loading_timestamp')!=last_loading_timestamp ){return;}
                me.find('.loading-loading').removeClass('loading');
            });
        }

        function renderList(data){
            me.renderTable(data);
            !data.length && me.find('.nothing-nothing').addClass('nothing');
        }

    }).call( document.scripts[document.scripts.length-1].parentNode );
    </script>
</section>
