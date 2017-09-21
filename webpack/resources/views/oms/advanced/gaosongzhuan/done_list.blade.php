<section class="order-list gaosongzhuan advanced" inner-sort>
    <div class="hd">
        <span class="section-title">已完成任务</span>
        <a class="oms-btn gray refresh-btn loading-loading right" href="javascript:;"><i class="oms-icon refresh"></i>刷新</a>
        <span class="order-list-ctrls right list-ctrls" style="display:none;">
            <a data-uri="{{ config('view.path_prefix','') }}/oms/advanced/get_gaosongzhuan_list?type=doned" class="active" href="javascript:;"></a>
        </span>
    </div>

    <table class="oms-table loading-loading nothing-nothing">
        <tr class="hd" rows-head>
            <th>订单号</th>
            <th>策略</th>

            <th class="cell-left">名称/代码</th>

            <th class="cell-right">当前价</th>
            <th class="cell-right">持仓数量</th>

            <th class="cell-right">每股送股比例</th>
            <th class="cell-right">每股转增比例</th>
            <th class="cell-right">每股派现</th>

            <th class="cell-right" sort-by="updated_at">处理日期</th>

            {{-- <th class="cell-right">变更后价格</th> --}}
            <th class="cell-right">派股数量</th>
            <th class="cell-right">增加现金</th>

            <th class="cell-right">操作</th>
        </tr>
        <tbody class="rows-body loading-hide nothing-hide loading-loading" rows-body></tbody>
        <script type="text/html" row-tpl>
            <tr row >
                <td data-src="id"></td>
                <td data-src="product|getProductLink"></td>
                <td>
                    <span data-src="stock_info.stock_name"></span>
                    <div data-src="stock_id|getPureCode"></div>
                </td>

                <td class="cell-right" data-src="stock_info.last_price|numeral:0.000"></td>
                <td class="cell-right" data-src="position_amount"></td>

                <td class="cell-right" data-src="per_share_div_ratio|numeral:0%"></td>
                <td class="cell-right" data-src="per_share_trans_ratio|numeral:0%"></td>
                <td class="cell-right" data-src="per_cash_div|numeral:0,0.000"></td>

                <td class="cell-right" data-src="updated_at|moment:MM/DD"></td>

                <!-- <td class="cell-right" data-src="suggest_price|numeral:0.000"></td> -->
                <td class="cell-right" data-src="suggest_amount|numeral:0,0"></td>
                <td class="cell-right" data-src="suggest_cash|numeral:0,0.000"></td>

                <td class="cell-right" class="cell-right" style="width:75px;">
                    <a class="open-detail oms-btn sm gray open-detail" href="javascript:;">详情</a>
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
            var gaosongzhuan = $(this).closest('tr').getCoreData();
            $(window).trigger({type:'open_gaosongzhuan_detail',gaosongzhuan:gaosongzhuan,sponsor:this});
        });

        me.find('.refresh-btn').on('click',updateList);
        $(window).on('done_updated',function(event){
            event.updated_timestamp > me.find('[rows-body]').attr('last_updated_timestamp')
            && !me.find('[rows-body]').is('.loading')
            && updateList();
        });
        
        $(updateList);

        function updateList(){
            me.find('.list-ctrls a.active').click();
        }

        function loadList(uri, callback){
            me.find('.loading-loading').addClass('loading');
            me.find('.nothing-nothing').removeClass('nothing');

            var last_loading_timestamp = new Date().valueOf()
            me.find('[rows-body]').attr('last_loading_timestamp',last_loading_timestamp);

            $.getJSON(uri).done(function(res){
                if( me.find('[rows-body]').attr('last_loading_timestamp')!=last_loading_timestamp ){return;}

                // 分页逻辑
                $.pullValue(res,'data.list') ? me.find('.page-ctrls').render( $.pullValue(res,'data') ) : me.find('.page-ctrls').html('');
                // 获取数据列表的逻辑，兼容分页数据和非分页数据
                var items = $.pullValue(res,'data.list',$.pullValue(res,'data',[]));

                //填充委托单列表数据
                res.code==0 ? mergeGaosongzhuanStocksInfo(items).then(function(){
                    if( me.find('[rows-body]').attr('last_loading_timestamp')!=last_loading_timestamp ){
                        return false;//过期结果直接抛弃
                    }
                    callback(items);
                }) : $.omsAlert(res.code + ' : ' + (res.msg || '未知错误') + '，请稍候重试！',false);

                res.code==0 && me.find('[rows-body]').attr('last_updated_timestamp',(res.timestamp||0));
            }).always(function(){
                if( me.find('[rows-body]').attr('last_loading_timestamp')!=last_loading_timestamp ){return;}
                me.find('.loading-loading').removeClass('loading');
            });
        }

        function renderList(data){
            var rows = [];
            data.forEach(function(item,index){
                var row = $( me.find('[row-tpl]').html() );
                //数据装载
                item.product = getProductById(item.product_id);
                $(row).render(item);
                rows.push(row);
            });
            me.find('[rows-body]').html(rows);
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
