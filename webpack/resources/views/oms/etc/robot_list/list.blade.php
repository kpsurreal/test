<section class="order-list advanced">
    <div class="hd">
        <span class="section-title">机器人列表</span>
        <a class="oms-btn gray refresh-btn loading-loading right" href="javascript:;"><i class="oms-icon refresh"></i>刷新</a>
        <span class="order-list-ctrls right list-ctrls" style="display:none;">
            <a data-uri="{{ config('view.path_prefix','') }}/oms/etc/robot_list/get?" class="active" href="javascript:;"></a>
        </span>
    </div>

    <table class="oms-table loading-loading nothing-nothing">
        <tr class="hd">
            <th>策略ID</th>
            <th>策略名称</th>
            <th class="cell-right">机器人ID</th>
            <th class="cell-right">机器人状态</th>
            <th class="cell-right">broker_id</th>
            <th class="cell-right">created_at</th>
            <th class="cell-right">updated_at</th>
        </tr>
        <tbody class="rows-body loading-hide nothing-hide loading-loading" rows-body ></tbody>
        <script type="text/html" row-tpl >
            <tr>
                <td data-src="product_id"></td>
                <td data-src="product.name"></td>
                <td data-src="roboter_id" class="cell-right"></td>
                <td data-src="status" class="cell-right"></td>
                <td data-src="broker_id" class="cell-right"></td>
                <td data-src="created_at" class="cell-right"></td>
                <td data-src="updated_at" class="cell-right"></td>
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

        me.find('.refresh-btn').on('click',updateList);

        $(updateList);

        function updateList(){
            me.find('.list-ctrls a.active').click();
        }

        function loadList(uri, callback){
            me.find('.loading-loading').addClass('loading');
            me.find('.nothing-nothing').removeClass('nothing');

            $.getJSON(uri).done(function(res){
                // 分页逻辑
                $.pullValue(res,'data.list.data') ? me.find('.page-ctrls').render( $.pullValue(res,'data.list') ) : me.find('.page-ctrls').html('');
                // 获取数据列表的逻辑，兼容分页数据和非分页数据
                var list = $.pullValue(res,'data.list.data',[]);

                res.code==0 ? mergeProductsBriefInfo(list).then(function(){
                    callback && callback(list)
                }) : $.failNotice(uri,res);

            }).fail($.failNotice.bind(null,uri)).always(function(){
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
