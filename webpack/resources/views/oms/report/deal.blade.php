@extends('oms.report.base')
@section('table')
<section class="order-list report assets">
    <div class="loading-loading section-loading"></div>
    <div class="hd">
        <span style="position:relative;">
            起始日期：
            {{-- more-param 代指查询的附加参数 --}}
            <input size="16" type="text" name="start" id="query-start" value="" zebra-datepicker="report_assets_start" more-param>
        </span>
        <span style="position:relative;">
            截至日期：
            <input size="16" type="text" name="end" id="query-end" value="" zebra-datepicker="report_assets_end" more-param>
        </span>
        <a class="right oms-btn gray download-excel" data-text="EXCEL" data-href="{{ config('view.path_prefix','') }}/oms/report/{{ $product_id }}/output/deal?output=excel"
            style="width:auto;"
        >下载EXCEL</a>
        <a class="right oms-btn gray download-pdf" data-text="PDF" data-href="{{ config('view.path_prefix','') }}/oms/report/{{ $product_id }}/output/deal?output=pdf"
            style="width:auto;"
        >下载PDF</a>
        <a style="margin-right: 60px;" class="unvisible right download-loading" href="javascript:;"><i class="oms-icon refresh"></i>正在生成文件</a>
        <a class="hide" id="download-link">下载标签</a>

        <span class="order-list-ctrls right list-ctrls" style="display:none;">
            {{-- 下面的 url 是一个示例 --}}
            <a data-uri="{{ config('view.path_prefix','') }}/oms/report/${product_id}/output/deal?" class="active" href="javascript:;"></a>
        </span>
    </div>

    <table class="oms-table loading-loading nothing-nothing">
        <tr class="hd" rows-head>
            <th>成交序号</th>
            <th>证券代码</th>
            <th>证券名称</th>
            <th>委托方向</th>
            <th class="cell-right">成交数量</th>
            <th class="cell-right">成交均价</th>
            <th class="cell-right">成交金额</th>
            <th class="cell-right">成交时间</th>
        </tr>
        <tbody class="rows-body nothing-nothing loading-loading" rows-body></tbody>
        <script type="text/html" row-tpl>
            <tr>
                <td data-src="id"></td>
                <td data-src="stock.code|getPureCode"></td>
                <td data-src="stock_info.stock_name"></td>
                <td><span data-src="entrust.type" data-class="entrust.type|mapVal:卖出->blue,买入->red"></span></td>
                <td class="cell-right" data-src="deal.amount|toFixed:0"></td>
                <td class="cell-right" data-src="deal.price|numeral:0,0.000"></td>
                <td class="cell-right" data-src="deal.total|numeral:0,0.000"></td>
                <td class="cell-right" data-src="updated_at|unixTime"></td>
            </tr>
        </script>
    </table>
    <div class="page-ctrls" data-src="|getPageControls"></div>
    <script src="{{ asset('/js/report-download.js') }}"></script>
    <script>
    (function(){
        var me = $(this);

        me.find('[data-uri]').each(function(){
            $(this).attr('data-uri', $(this).attr('data-uri').replace('${product_id}',PRODUCT.id));
        });

        me.find('.list-ctrls').on('click','a',function(){
            $(this).addClass('active').siblings().removeClass('active');
            // 加载 items 数据
            var dataSrc = $(this).data('uri');
            loadList(dataSrc);
        });

        me.find('.page-ctrls').on('nav',function(event){
            var page_num = event.page_num;
            var dataSrc = me.find('.list-ctrls a.active').data('uri').replace('?','?page='+page_num+'&');
            loadList(dataSrc);
        });

        me.on('sort_by:changed',updateList);
        me.on('change','[name=start],[name=end]',updateList);

        setTimeout(updateList,500);

        function updateList(){
            me.find('.list-ctrls a.active').click();
        }

        function loadList(uri){
            me.find('.loading-loading').addClass('loading');
            me.find('.nothing-nothing').removeClass('nothing');

            var last_loading_timestamp = new Date().valueOf()
            me.find('.list-ctrls').attr('last_loading_timestamp',last_loading_timestamp);

            $.getJSON(uri, me.getMoreParams()).done(function(res){
                // 分页逻辑
                $.pullValue(res,'data.list') ? me.find('.page-ctrls').render( $.pullValue(res,'data') ) : me.find('.page-ctrls').html('');
                // 获取数据列表的逻辑，兼容分页数据和非分页数据
                var list = $.pullValue(res,'data.list',$.pullValue(res,'data',[]));

                res.code==0 ? mergeOrderStocksInfo(list).then(function(){
                    if( me.find('.list-ctrls').attr('last_loading_timestamp')!=last_loading_timestamp ){return;}
                    renderList(list)
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
@endsection
