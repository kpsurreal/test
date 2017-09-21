<section class="order-list advanced">
    <div class="hd hide">
        <b style="font-size:16px;">
            选择机器人：
            <select style="font-size:16px;"></select>
        </b>
        <a class="oms-btn gray refresh-btn loading-loading right" href="javascript:;"><i class="oms-icon refresh"></i>刷新</a>
        <span class="order-list-ctrls right list-ctrls" style="display:none;">
            <a data-uri="{{ config('view.path_prefix','') }}/oms/other/get_robot_deal_list?" class="active" href="javascript:;"></a>
        </span>
    </div>

    <table class="oms-table loading-loading nothing-nothing">
        <tr class="hd">
            <th>股票代码</th>
            <th class="cell-right">OMS 成交记录 id</th>
            <th class="cell-right">券商委托编号</th>
            <th class="cell-right">买卖标识</th>
            <th class="cell-right">成交类型</th>
            <th class="cell-right">撤单标示</th>
            <th class="cell-right">成交价格</th>
            <th class="cell-right">成交数量</th>
            <th class="cell-right">成交金额</th>
            <th class="cell-right">成交时间</th>
        </tr>
        <tbody class="rows-body loading-hide nothing-hide loading-loading" rows-body ></tbody>
        <script type="text/html" row-tpl >
            <tr>
                <td data-src="stock_id"></td>
                <td data-src="id" class="cell-right"></td>
                <td data-src="order_id" class="cell-right"></td>
                <td data-src="deal_type" class="cell-right"></td>
                <td data-src="deal_flag" class="cell-right"></td>
                <td data-src="is_cancel" class="cell-right"></td>
                <td data-src="deal_price" class="cell-right"></td>
                <td data-src="deal_volume" class="cell-right"></td>
                <td data-src="deal_amount" class="cell-right"></td>
                <td data-src="dealed_at" class="cell-right"></td>
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
        me.on('change', 'select', updateList);

        //初始化机器人列表
        $(initRobotList);

        function initRobotList(){
            //  获取机器人列表的接口
            // res.data 返回一个数组
            // [
            //     {
            //         roboter_id: '123',
            //         broker_id: '券商A'
            //     }
            // ]

            var url = (window.REQUEST_PREFIX||'') + '/oms/other/get_robot_list';
            $.getJSON(url).done(function(res){
                res.code==0 ? renderRobotList(res.data) : $.failNotice(url,res);
            }).fail($.failNotice.bind(null,url));

            function renderRobotList(list){
                if(!list || !list.length){return $.omsAlert('没有获取到有效机器人列表！',false);}

                me.find('select').html(list.map(function(robot){
                    // broker_id = ''; // 机器人名称
                    return $('<option>').html(robot.roboter_id+ ' : '+robot.broker_id).val(robot.roboter_id);
                })).change();
            }
        }

        function updateList(){
            me.find('.list-ctrls a.active').click();
        }

        function loadList(uri, callback){
            var roboter_id = me.find('select').val();
            if(!roboter_id){return $.omsAlert('没有选择有效机器人！',false);}

            me.find('.loading-loading').addClass('loading');
            me.find('.nothing-nothing').removeClass('nothing');

            $.getJSON(uri,{
                roboter_id: roboter_id
            }).done(function(res){
                // 分页逻辑
                $.pullValue(res,'data.list') ? me.find('.page-ctrls').render( $.pullValue(res,'data.list') ) : me.find('.page-ctrls').html('');
                // 获取数据列表的逻辑，兼容分页数据和非分页数据
                var list = $.pullValue(res,'data.list',[]);

                res.code==0 && callback && callback(list);

            }).fail($.failNotice.bind(null,uri)).always(function(){
                me.find('.loading-loading').removeClass('loading');

                setTimeout(function(){ loadList(uri, callback); }, 3000);
            });
        }

        function renderList(data){
            me.renderTable(data);
            !data.length && me.find('.nothing-nothing').addClass('nothing');
        }

    }).call( document.scripts[document.scripts.length-1].parentNode );
    </script>
</section>
