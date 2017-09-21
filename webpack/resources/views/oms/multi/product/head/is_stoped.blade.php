<?php
use App\Services\OMS\Workflow\OMSWorkflowEntrustService;
?>
<section class="multi-product-head">
    <div class="section-loading loading-loading"></div>
    <table class="oms-table nothing-nothing loading-loading">
        <tr rows-head>
            <th>策略名称</th>
            <th class="cell-right">期末净值</th>
            <th class="cell-right">期末盈亏</th>
            <th class="cell-right">期末盈亏率</th>
            <th class="cell-right">期末净资产</th>
            <th class="cell-right">期末总收益分成</th>
        </tr>
        <tbody rows-body></tbody>
        <script type="text/html" row-tpl>
            <tr>
                <td>
                    <label style="cursor:pointer;user-select:none;-webkit-user-select:none;">
                        <span data-src="name"></span>
                        <span if="settlement_type" class="settlement-type" data-src="settlement_type|settlementTypeCH"></span>
                    </label>
                </td>
                <td class="cell-right"><span data-src="net_value|numeral:0.0000"></span></td>
                <td class="cell-right"><span data-class="profit|rgColor" data-src="profit|numeral:0,0.00"></span></td>
                <td class="cell-right"><span data-class="profit|rgColor" data-src="profit_rate|numeral:0.00%"></span></td>

                <td class="cell-right"><span data-src="net_assets|numeral:0,0.00"></span></td>
                <td class="cell-right"><span data-src="confirm_performance|plus:performance_fee|numeral:0,0.00"></span></td>
                <!-- <td if="net_assets|isFalse AND settlement_returned" colspan="5" style="text-align:right;">  当前策略期末结算数据尚未发布  </td> -->
            </tr>
        </script>
    </table>
    <script>
    (function(){
        var me = $(this);

        // var multi_status;
        var product_list = [];
        var product_ids = [];

        me.find('.loading-loading').addClass('loading');

        $(window).on('multi_load',function(event){
            // multi_status = event.multi_status;
            product_list = event.product_list;
            product_ids = event.product_ids;

            renderProductListFirst();
            loadRuntimeInfo();
        });

        function loadRuntimeInfo(){
            me.addClass('loading');
            var url = (window.REQUEST_PREFIX||'')+'/oms/api/last_settlement_data';

            var last_loading_timestamp = new Date().valueOf();
            me.attr('last_loading_timestamp',last_loading_timestamp);

            $.get(url,{
                product_id: product_ids
            }).done(function(res){
                if(last_loading_timestamp!=me.attr('last_loading_timestamp')){return;}

                if(res.code==0){
                    //合并数据
                    product_list.forEach(function(product){
                        $.extend(product,{
                            settlement_returned: true
                        },$.pullValue(res,'data.'+product.id));
                    });
                    updateProductListAfterRuntimeReady();
                }

                res.code!=0 && $.failNotice(url,res);
                res.code==0 && me.attr('last_updated_timestamp',(res.timestamp||0));
            }).fail($.failNotice.bind(null,url)).always(function(){
                if(last_loading_timestamp!=me.attr('last_loading_timestamp')){return;}
                me.removeClass('loading');
            });
        }

        function renderProductListFirst(){
            me.renderTable(product_list);
        }

        function resetProductList(){
            product_list.forEach && product_list.forEach(function(product){
                product.risk_limit_check_request = product.risk_limit_check_response = product.predict = null;
            });
            updateProductList();
        }

        function resetUncheckedRows(){
            product_list.forEach && product_list.forEach(function(product){
                if(product.checked){return;}
                product.risk_limit_check_request = product.risk_limit_check_response = product.predict = null;
            });
            updateProductList();
        }

        function updateProductListAfterRuntimeReady(){
            updateProductList();
            me.find('.loading-loading').removeClass('loading');
        }

        function updateProductList(){
            me.find('[rows-body] tr').each(function(){
                var row = $(this);
                row.reRender();
            });
        }
    }).call(document.scripts[document.scripts.length-1].parentNode);
    </script>
</section>
