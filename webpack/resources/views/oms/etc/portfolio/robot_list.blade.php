<section class="order-list advanced">
    <div>
        <table class="oms-table loading-loading nothing-nothing">
            <tr class="hd">
                <th class="cell-left">ID</th>
                <th>券商帐号</th>
                {{-- <th>status</th> --}}
                <th>策略数</th>
                <th>created_at</th>
                <th>updated_at</th>
                <th></th>
            </tr>
            <tbody class="rows-body nothing-nothing loading-loading" rows-body></tbody>
            <script type="text/html" row-tpl>
                <tr row>
                    <td class="cell-left"><span data-src="roboter_id"></span></td>
                    <td><span data-src="broker_id"></span></td>
                    <!-- <td data-src="status"></td> -->
                    <td data-src="product_list.length"></td>
                    <td data-src="created_at"></td>
                    <td data-src="updated_at"></td>
                    <td class="cell-right">
                        <span class="blue" handle="see_detail">查看详情</span>
                    </td>
                </tr>
            </script>
        </table>
    </div>

    <script>
    (function(){
        var me = $(this);
        var robot_list;

        $(function(){
            me.on('click','[rows-body] [handle=see_detail]',function(){
                var row = $(this).closest('tr');
                var robot = row.getCoreData();
                $(window).trigger({type:'portfolio:robot_list:see_detail',robot:robot});
            });
        });

        $(window).on('portfolio:get_portfolio:loaded',function(event){
            robot_list = $.pullValue(event, 'all_portfolio.robot_list', []);
            display();
        });

        function display(){
            me.renderTable(robot_list);
        };
    }).call( document.scripts[document.scripts.length-1].parentNode );
    </script>
</section>
