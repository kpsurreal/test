<section class="order-list advanced">
    <div class="hd">
        <span class="section-title">委托比对</span>
        <a class="oms-btn gray refresh-btn loading-loading right" href="javascript:;"><i class="oms-icon refresh"></i>刷新</a>
        <span class="order-list-ctrls right list-ctrls" style="display:none;">
            <a data-uri="{{ config('view.path_prefix','') }}/oms/monitor/get_today_entrust?" class="active" href="javascript:;"></a>
        </span>
    </div>

    <table class="oms-table loading-loading nothing-nothing">
        <tr class="hd">
            <th>证券代码</th>
            <th class="cell-right">委托编号</th>
            <th class="cell-right">买卖标志</th>
            <th class="cell-right">委托数量</th>
            <th class="cell-right">委托价格</th>
            <th class="cell-right">成交数量</th>
            <th class="cell-right">撤单数量</th>
            <th class="cell-right">OMS 委托编码</th>
            <th class="cell-right">OMS 买卖方向</th>
            <th class="cell-right">OMS 委托数量</th>
            <th class="cell-right">OMS 委托价格</th>
            <th class="cell-right">OMS 成交数量</th>
            <th class="cell-right">OMS 撤单数量</th>
            <th class="cell-right">OMS 是否废单</th>
        </tr>
        <tbody class="rows-body loading-hide nothing-hide loading-loading" rows-body ></tbody>
        <script type="text/html" row-tpl >
            <tr>
                <td data-src="0">证券代码</td>
                <td data-src="1" class="cell-right">委托编号</td>
                <td data-src="2" class="cell-right">买卖标志</td>
                <td data-src="3" class="cell-right">委托数量</td>
                <td data-src="4" class="cell-right">委托价格</td>
                <td data-src="5" class="cell-right">成交数量</td>
                <td data-src="6" class="cell-right">撤单数量</td>
                <td data-src="7" class="cell-right">OMS 委托编码</td>
                <td data-src="8" class="cell-right">OMS 买卖方向</td>
                <td data-src="9" class="cell-right">OMS 委托数量</td>
                <td data-src="10" class="cell-right">OMS 委托价格</td>
                <td data-src="11" class="cell-right">OMS 成交数量</td>
                <td data-src="12" class="cell-right">OMS 撤单数量</td>
                <td data-src="13" class="cell-right">OMS 是否废单</td>
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
                $.pullValue(res,'data.list') ? me.find('.page-ctrls').render( $.pullValue(res,'data') ) : me.find('.page-ctrls').html('');
                // 获取数据列表的逻辑，兼容分页数据和非分页数据
                var list = $.pullValue(res,'data.list',[]);

                res.code==0 ? mergeProductsBriefInfo(list).then(function(){
                    callback && callback(list)
                }) : $.failNotice(uri,res);

            }).fail($.failNotice.bind(null,uri)).always(function(){
                me.find('.loading-loading').removeClass('loading');
            });
        }

        function renderList(data){
            me.renderTable(data);
            showAbnormalData();
            !data.length && me.find('.nothing-nothing').addClass('nothing');
        }

        function showAbnormalData(){
            me.find('[rows-body] tr').each(function(){
                var row = $(this);
                var data = row.getCoreData();
                [3,4,5,6].forEach(function(key1){
                    var key2 = key1+6;
                    if( +data[key1] != +data[key2] ){
                        row.addClass('abnormal').find('[data-src='+key1+'],[data-src='+key2+']').addClass('abnormal');
                    }
                });
            });

            me.find('[rows-body] tr.abnormal').css({
                background: '#f7dfe3'
            }).find('td.abnormal').css({
                color: 'red'
            });
        }

    }).call( document.scripts[document.scripts.length-1].parentNode );
    </script>
</section>
