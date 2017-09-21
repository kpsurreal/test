<section class="order-list advanced portfolio-brief">
    <div class="hd">
        <span style="float:right;position:relative;">
            选择日期：
            <input size="16" type="text" name="date" value="" zebra-datepicker="robot_list">
        </span>
    </div>

    <div>
        <table class="oms-table loading-loading nothing-nothing">
            <tr class="hd">
                <th>ID</th>
                <th>机器人</th>

                <th>现金余额</th>
                <th>证券市值</th>
                <th>总资产</th>

                <th>平台策略</th>
                <th>现金余额</th>
                <th>证券市值</th>
                <th>总资产</th>
            </tr>
            <tbody class="rows-body nothing-nothing loading-loading" rows-body></tbody>
            <script type="text/html" row-tpl>
                <tr row>

                    <td merge data-src="robot_profile.roboter_id"></td>
                    <td merge><span data-src="robot_profile.broker_id" handle="see_detail" class="blue"></span></td>

                    <td merge><span data-src="all.balance_amount|numeral:0,0.000"></span></td>
                    <td merge><span data-src="all.market_amount|numeral:0,0.000"></span></td>
                    <td merge><span data-src="all.total_amount|numeral:0,0.000"></span></td>

                    <td>
                        <span data-src="product_id"></span>
                        <span data-src="product.name" handle="see_detail" class="blue"></span>
                    </td>
                    <td><span data-src="account_profile.account_info.balance_amount|numeral:0,0.000"></span></td>
                    <td><span data-src="account_profile.position_info.market_amount|numeral:0,0.000"></span></td>
                    <td><span data-src="total_amount|numeral:0,0.000"></span></td>
                </tr>
            </script>
        </table>
    </div>

    <script>
    (function(){
        var me = $(this);
        var product_list;

        $(function(){
            me.on('click','[rows-body] [handle=see_detail]',function(){
                var row = $(this).closest('tr');
                var product = row.getCoreData();
                if( /robot/.test($(this).attr('data-src')) ){
                    $(window).trigger({type:'portfolio:robot_list:see_detail',robot:product.robot_profile});
                }
                if( /product/.test($(this).attr('data-src')) ){
                    $(window).trigger({type:'portfolio:product_list:see_detail',product:product});
                }
            }).on('change','[name=date]',function(event){console.log(event);
                $(window).trigger({
                    type: 'portfolio:reload',
                    params: {
                        date: $(this).val()
                    }
                });
            });
        });

        $(window).on('portfolio:get_portfolio:loaded',function(event){
            product_list = $.pullValue(event, 'all_portfolio.product_list', []);
            display();
        }).on('portfolio:product_list:updated',function(event){
            me.find('[rows-body] tr').each(function(){
                $(this).reRender();
            });
        });

        function display(){
            product_list.sort(function(p1,p2){
                return $.pullValue(p1,'robot_profile.roboter_id') > $.pullValue(p2,'robot_profile.roboter_id') ? 1 : -1;
            });
            me.renderTable(product_list);

            me.find('[rows-body] tr').each(function(){
                var row = $(this);
                var current_product = row.getCoreData();
                var current_roboter_id = current_product.robot_profile.roboter_id;

                var first_robot_row = $(this).siblings('[first-robot='+current_roboter_id+']');

                var current_balance_amount = +$.pullValue(current_product,'account_profile.account_info.balance_amount',0);
                var current_market_amount = +$.pullValue(current_product,'account_profile.position_info.market_amount',0);
                var current_total_amount = current_balance_amount + current_market_amount;

                current_product.total_amount = current_total_amount;

                if( !first_robot_row.length ){
                    row.attr('first-robot',current_roboter_id);
                    current_product.all = {
                        balance_amount: current_balance_amount,
                        market_amount: current_market_amount,
                        total_amount: current_total_amount
                    }
                }else{
                    row.find('td[merge]').hide();
                    first_robot_row.find('td[merge]').each(function(){
                        var rowspan = +$(this).attr('rowspan') || 1;
                        $(this).attr('rowspan',rowspan+1);
                    });

                    var first_product = first_robot_row.getCoreData();
                    first_product.all.balance_amount += current_balance_amount;
                    first_product.all.market_amount += current_market_amount;
                    first_product.all.total_amount += current_total_amount;

                    first_robot_row.reRender();
                }
            });
        };
    }).call( document.scripts[document.scripts.length-1].parentNode );
    </script>
</section>
