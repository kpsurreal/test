<section class="order-list frozen_fund advanced wait">
    <div class="hd">
        <span class="section-title">策略列表</span>
        <a class="oms-btn gray refresh-btn loading-loading right" href="javascript:;"><i class="oms-icon refresh"></i>刷新</a>
        <span class="order-list-ctrls right list-ctrls" style="display:none;">
            <a data-uri="{{ config('view.path_prefix','') }}/oms/advanced/get_frozen_fund_list?" class="active" href="javascript:;"></a>
        </span>
    </div>

    <table class="oms-table loading-loading nothing-nothing">
        <tr class="hd">
            <th>策略ID</th>
            <th>策略名称</th>
            <th class="cell-right">最新冻结值</th>
            <th class="cell-right">最新市值</th>
            <th class="cell-right">最后有效日</th>

            <th class="cell-right">操作</th>
        </tr>
        <tbody class="rows-body loading-hide nothing-hide loading-loading" rows-body ></tbody>
        <script type="text/html" row-tpl >
            <tr>
                <td data-src="id"></td>
                <td data-src="name"></td>
                <td class="cell-right" data-src="frozen_fund.frozen|numeral:0.000"></td>
                <td class="cell-right" data-src="frozen_fund.unfrozen|numeral:0.000"></td>
                <td class="cell-right" data-src="frozen_fund.actived_at|unixDay"></td>

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
            var frozen_fund = $(this).closest('tr').getCoreData();
            $(window).trigger({type:'open_frozen_fund_detail',frozen_fund:frozen_fund,sponsor:this});
        });

        me.find('.refresh-btn').on('click',updateList);
        $(window).on('wait_updated',function(event){
            event.updated_timestamp > me.find('[rows-body]').attr('last_updated_timestamp')
            && !me.find('[rows-body]').is('.loading')
            && updateList();
        });

        $(window).on('advanced:exec_frozen_fund_update:success',updateList);

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
                var orders = $.pullValue(res,'data.list',$.pullValue(res,'data',[]));

                //填充委托单列表数据
                res.code==0 ? mergeProductsBriefInfo(orders).then(function(){
                        if( me.find('[rows-body]').attr('last_loading_timestamp')!=last_loading_timestamp ){return;}
                        callback(orders);
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
