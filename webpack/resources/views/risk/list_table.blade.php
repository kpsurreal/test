<table class="oms-table loading-loading nothing-nothing risk">
    <tr class="hd" rows-head>
        <th style="min-width:60px;">状态</th>
        <th>策略</th>
        @if(config('custom.showProductType'))
            <th>类型</th>
        @endif

        <th class="border-left" sort-by="settlement.net_value">净值</th>
        <th class="cell-right" sort-by="settlement.position">仓位</th>
        {{-- <th class="cell-right" sort-by="settlement.pierce_rate">穿仓比</th> --}}
        <th class="cell-right">总资产/起始</th>

        <th class="cell-right">总市值/可用</th>
        <th class="cell-right" sort-by="settlement.net_value">盈亏比例</th>
        <th class="cell-right">预警线</th>

        <th class="cell-right">平仓线</th>
        <th class="cell-right" sort-by="stop_time">结束日期</th>
    </tr>
    <tbody class="rows-body loading-hide nothing-hide loading-loading" rows-body ></tbody>
    <script type="text/html" row-tpl >
        <tr row >
            <td data-class="risk_status.degree|getRiskDegreeBg" data-src="risk_status.words" style="min-width:60px;"></td>
            <td data-src="|getRowProductLink"></td>
            @if(config('custom.showProductType'))
                <td data-src="fund_inner_type|fundTypeCH"></td>
            @endif
            <td>
                <span data-class="settlement.net_value|rgColor:1" data-src="settlement.net_value|numeral:0.000"></span>
            </td>
            <td class="cell-right" data-src="settlement.position|numeral:0.00%"></td>
            <!-- <td class="cell-right">
                <span if="fund_inner_type|>=:4" data-src="settlement.pierce_rate|numeral:0.00%"></span>
            </td> -->
            <td class="cell-right">
                <span data-src="settlement.total_assets|numeral:0,0.00"></span>
                <div data-src="settlement.invest_amount|numeral:0,0.00"></div>
            </td>

            <td class="cell-right">
                <span data-src="settlement.security|numeral:0,0.00"></span>
                <div data-src="settlement.balance_amount|numeral:0,0.00"></div>
            </td>

            <td class="cell-right" data-src="settlement.net_value|-:1|numeral:0.00%"></td>
            <td class="cell-right" data-src="risk_status.risk_line|numeral:0.000"></td>
            <td class="cell-right" data-src="risk_status.closing_line|numeral:0.000"></td>
            <td class="cell-right" data-src="stop_time|unixDay"></td>
            <td class="cell-right">
                <span
                    if="early_warning|<=:0 AND settlement_type|inNumsList:6:7"
                    class="red"
                >*警戒线未设置</span>
            </td>
        </tr>
    </script>
    <script>
    (function(){
        var me = $(this);
        var options = ['全部'];

        $(window).on('risk_list_updated',function(){
            // me.find('[rows-head]').find('select').val('全部');
            setTimeout(updateRows);
        }).on('risk_list:select:changed',function(event){
            options = event.options;
            updateRows();
        });

        function updateRows(){
            var col = me.find('[rows-head] th:contains(类型)');
            var td_index = me.find('[rows-head] th').index(col);

            if(options.length==1 && options[0]=='全部'){
                return me.find('[rows-body] tr').show();
            }

            me.find('[rows-body] tr').each(function(){
                var row = $(this);
                var td = row.find('td').eq(td_index);
                var text = td.text();
                options.indexOf(text)>=0 ? row.show() : row.hide();
            });

            me.trigger('table:updated');
        }
    }).call( document.scripts[document.scripts.length-1].parentNode );
    </script>
</table>
