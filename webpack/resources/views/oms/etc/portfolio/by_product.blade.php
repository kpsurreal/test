<section class="order-list advanced">
    <div class="hd">
        <span>
            选择策略：
            <select style="font-size:18px;"></select>
        </span>
        <span style="float:right;position:relative;">
            选择日期：
            <input size="16" type="text" name="date" value="" zebra-datepicker="by_product">
        </span>
    </div>

    <br/>

    <div class="account-part">
        <h4>当日资金概览</h4>
        <table class="oms-table">
            <tr>
                <th class="cell-left" style="width:100px;">资产总值</th>
                <th>资金余额</th>
                <th>冻结资金</th>
                <th>平台费用</th>
                <th>临时冻结资金</th>
                <th>交易费</th>
                <th>解冻资金</th>
                <th>持仓成本</th>
                <th>股票资产</th>
            </tr>
            <tr>
                <td class="cell-left"><span data-src="total_value|numeral:0,0.000"></span></td>
                <td><span data-src="account_info.balance_amount|numeral:0,0.000"></span></td>
                <td><span data-src="account_info.frozen_amount|numeral:0,0.000"></span></td>
                <td><span data-src="account_info.platform_fee|numeral:0,0.000"></span></td>
                <td><span data-src="account_info.tmp_frozen_amount|numeral:0,0.000"></span></td>
                <td><span data-src="account_info.trade_fee|numeral:0,0.000"></span></td>
                <td><span data-src="account_info.unfrozen_amount|numeral:0,0.000"></span></td>
                <td><span data-src="position_info.cost_amount|numeral:0,0.000"></span></td>
                <td><span data-src="position_info.market_amount|numeral:0,0.000"></span></td>
            </tr>
        </table>
    </div>

    <br/>

    <div class="position-part">
        <h4>当日持仓详情</h4>
        <table class="oms-table loading-loading nothing-nothing">
            <tr class="hd" rows-head>
                <th class="cell-left">代码</th>
                <th>名称</th>

                <th class="cell-right">持仓数量</th>
                <th class="cell-right">持仓成本</th>
                <th class="cell-right">成本价</th>
                <th class="cell-right">当日可卖</th>

                <th class="cell-right">当日买入</th>
                <th class="cell-right">当日卖出</th>

                <th class="cell-right">总盈亏</th>
                <th class="cell-right">盈亏率</th>

                {{-- <th class="cell-right">当日盈亏</th>
                <th class="cell-right">当日盈亏率</th> --}}

                <th class="cell-right">市值</th>
                <th class="cell-right">市场价</th>
                {{-- <th class="cell-right">仓位占比</th> --}}

                <th class="cell-right">总费用</th>
            </tr>
            <tbody class="rows-body nothing-nothing loading-loading" rows-body></tbody>
            <script type="text/html" row-tpl>
                <tr>
                    <td><span data-src="stock_id|getPureCode"></span></td>
                    <td><span data-src="stock_name"></span></td>

                    <td class="cell-right"><span data-src="hold_volume|numeral:0,0"></span></td>
                    <td class="cell-right"><span data-src="hold_cost|numeral:0,0.000"></span></td>
                    <td class="cell-right"><span data-src="cost_price|numeral:0,0.000"></span></td>
                    <td class="cell-right"><span data-src="enable_sell_volume|numeral:0,0"></span></td>

                    <td class="cell-right"><span data-src="buy_volume|numeral:0,0"></span></td>
                    <td class="cell-right"><span data-src="sell_volume|numeral:0,0"></span></td>

                    <td class="cell-right"><span data-src="earning|numeral:0,0.000"></span></td>
                    <td class="cell-right"><span data-src="earning_ratio|numeral:0,0.00%"></span></td>

                    <!-- <td class="cell-right"><span data-src="today_earning|numeral:0,0.000"></span></td>
                    <td class="cell-right"><span data-src="today_earning_ratio|numeral:0,0.00%"></span></td> -->

                    <td class="cell-right"><span data-src="market_value|numeral:0,0.000"></span></td>
                    <td class="cell-right"><span data-src="market_price|numeral:0,0.000"></span></td>
                    <!-- <td class="cell-right"><span data-src="weight|numeral:0,0.00%"></span></td> -->

                    <td class="cell-right"><span data-src="total_fee|numeral:0,0.000"></span></td>
                </tr>
            </script>
        </table>
    </div>


    <script>
    (function(){
        var me = $(this);
        var me_head = me.find('> .hd');

        var me_account = me.find('.account-part');
        var me_position = me.find('.position-part');

        var all_portfolio;
        var now_product_id;

        $(window).on('portfolio:get_portfolio:loaded',function(event){
            all_portfolio = event.all_portfolio;
            me_head.find('select').html(all_portfolio.product_list.map(function(product){
                return $('<option></option>').val(product.product_id).html(product.product_id).setCoreData(product);
            }));
            if( me_head.find('select option').length ){
                var last_selected_value = $.omsGetLocalJsonData('etc','portfolio:by_product:last_selected_value',false);
                last_selected_value && hasProduct(last_selected_value) && me_head.find('select').val(last_selected_value);
                me_head.find('select').change();
            }
        }).on('portfolio:product_list:see_detail',function(event){
            var product = event.product;
            me_head.find('select').val(product.product_id).change();
        }).on('portfolio:product_list:updated',function(event){
            me_head.find('select option').each(function(){
                var product = $(this).getCoreData();
                var name = $.pullValue(product,'product.name','');
                name && $(this).html(product.product_id + ' : ' + product.product.name);
            });
        });

        $(function(){
            me_head.find('select').on('change',function(){
                var old_value = $(this).attr('old_value')||NaN;
                var new_value = $(this).val();
                if(old_value==new_value){return;}
                $(this).attr('old_value',new_value);
                $.omsCacheLocalJsonData('etc','portfolio:by_product:last_selected_value',new_value);

                display();
            });

            me_head.find('[name=date]').on('change',function(){
                var old_value = $(this).attr('old_value')||NaN;
                var new_value = $(this).val();
                if(old_value==new_value){return;}
                $(this).attr('old_value',new_value);

                display();
            });
        });

        function display(){
            clear();

            var product_id = me_head.find('select').val();
            var date = me_head.find('[name=date]').val();

            now_product_id = product_id;
            var product = all_portfolio.product_list.filter(function(product){
                return product.product_id == product_id;
            })[0];
            if(!product){return $.omsAlert('没有找到相关策略数据！',false);}

            loadAccount();
            loadPosition();

            function loadAccount(){
                var url = (window.REQUEST_PREFIX||'') + '/portfolio/account';
                me_account.find('.loading-loading').addClass('loading');

                $.getJSON(url,{product_id:product_id,date:date}).done(function(res){
                    res.code==0 ? renderAccount(res.data) : $.failNotice(url,res);
                }).fail($.failNotice.bind(null,url)).always(function(){
                    me_account.find('.loading-loading').removeClass('loading');
                });

                function renderAccount(account){
                    //总市值计算
                    account.total_value = (
                        (+$.pullValue(account.account_info,'balance_amount',0)||0)
                        // +(+$.pullValue(account.account_info,'platform_fee',0)||0)
                        +(+$.pullValue(account.position_info,'market_amount',0)||0)
                    );

                    me_account.render(account);
                }
            }

            function loadPosition(){
                var url = (window.REQUEST_PREFIX||'') + '/portfolio/position';
                me_position.find('.loading-loading').addClass('loading');
                me_position.find('.nothing-nothing').removeClass('nothing');

                $.getJSON(url,{product_id:product_id,date:date}).done(function(res){
                    res.code==0 ? renderPosition(res.data) : $.failNotice(url,res);
                    !$.pullValue(res,'data.length',0) && me_position.find('.nothing-nothing').addClass('nothing');
                }).fail($.failNotice.bind(null,url)).always(function(){
                    me_position.find('.loading-loading').removeClass('loading');
                });

                function renderPosition(position_list){
                    me_position.renderTable(position_list);
                }
            }
        }

        function clear(){
            me_account.render({})
            me_position.renderTable([]);
        }

        function hasProduct(id){
            return $.pullValue(all_portfolio,'product_list',[]).filter(function(product){
                return product.product_id == id;
            }).length;
        }
    }).call( document.scripts[document.scripts.length-1].parentNode );
    </script>
</section>
