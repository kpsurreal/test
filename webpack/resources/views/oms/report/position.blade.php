@extends('oms.report.base')
@section('table')
<section class="report assets product-position" inner-sort>
    <div class="loading-loading section-loading"></div>
    <div class="hd">
        <span style="position:relative;">
            选择日期：
            {{-- more-param 代指查询的附加参数 --}}
            <input size="16" type="text" name="start" id="query-start" value="" zebra-datepicker="report_assets_start" more-param>
        </span>
        <a class="right oms-btn gray download-excel" data-text="EXCEL" data-href="{{ config('view.path_prefix','') }}/oms/report/{{ $product_id }}/output/position?output=excel"
            style="width:auto;"
        >下载EXCEL</a>
        <a class="right oms-btn gray download-pdf" data-text="PDF" data-href="{{ config('view.path_prefix','') }}/oms/report/{{ $product_id }}/output/position?output=pdf"
            style="width:auto;"
        >下载PDF</a>
        <a style="margin-right: 60px;" class="unvisible right download-loading" href="javascript:;"><i class="oms-icon refresh"></i>正在生成文件</a>
        <a class="hide" id="download-link">下载标签</a>

        <span class="order-list-ctrls right list-ctrls" style="display:none;">
            {{-- 下面的 url 是一个示例 --}}
            <a data-uri="{{ config('view.path_prefix','') }}/oms/report/${product_id}/output/position?" class="active" href="javascript:;"></a>
        </span>
    </div>

    <table class="oms-table loading-loading nothing-nothing">
        <tr class="hd" rows-head>
            <th class="cell-left" sort-by="stock_id">证券代码</th>
            <th class="cell-left">证券名称</th>

            <th class="cell-right" sort-by="cost">当前成本</th>
            <th class="cell-right" sort-by="total_amount">持仓数量</th>
            <th class="cell-right" sort-by="cost_price">成本均价</th>
            <th class="cell-right" sort-by="market_price">最新价</th>
            <th class="cell-right" sort-by="market_value">持仓市值</th>

            {{-- <th class="cell-right" sort-by="today_earning_ratio">当日涨跌幅（%）</th> --}}
            <th class="cell-right" sort-by="earning">浮动盈亏</th>
            <th class="cell-right" sort-by="earning_ratio">浮动盈亏率（%）</th>
        </tr>
        <tbody class="rows-body nothing-nothing loading-loading" rows-body></tbody>
        <tbody rows-total style="display:none;" updown-monitor="udm_position_total:${product_id}">
            <tr>
                <th class="cell-left" colspan='2'>当前持仓汇总</th>
                <td data-src="total_cost|numeral:0,0.000"></td>
                <td colspan='3'></td>
                <td data-src="total_market_value|numeral:0,0.00"></td>
                <td data-src="total_earning|signNumeral:0,0.00" data-class="total_earning|rgColor"></td>
                <td></td>
            </tr>
        </tbody>
        <script type="text/html" row-tpl>
            <tr position updown-monitor="udm_position:${product_id}-${stock_id}">
                <td class="cell-left" data-src="stock_id"></td>
                <td class="cell-left" data-src="stock_name"></td>

                <td class="cell-right" data-src="cost|numeral:0,0.000"></td>
                <td class="cell-right" data-src="total_amount|numeral:0,0"></td>
                <td class="cell-right" data-src="cost_price"></td>
                <td class="cell-right" data-src="market_price|numeral:0,0.000"></td>
                <td class="cell-right" data-src="market_value|numeral:0,0.000"></td>

                <!-- <td class="cell-right" data-src="today_earning_ratio|numeral:0.00%"></td> -->
                <td class="cell-right" data-src="earning|numeral:0,0.000" data-class="earning|rgColor"></td>
                <td class="cell-right" data-src="earning_ratio|numeral:0.00%" data-class="earning|rgColor"></td>
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

                res.code==0 ? renderList(list) : $.failNotice(uri,res);

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
