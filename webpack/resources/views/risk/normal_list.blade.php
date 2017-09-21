<section class="order-list risk normal" inner-sort>
    <div class="hd">
        <span class="section-title">其他策略</span>
        <a refresh-btn class="oms-btn gray refresh-btn loading-loading right" href="javascript:;"><i class="oms-icon refresh"></i>刷新</a>
        <span class="right">数据更新时间：<str data-src="product_new_list.update_time">--</str> &nbsp; </span>
        <span list-ctrls class="order-list-ctrls right" style="display:none;">
            {{-- <a data-uri="/risk/risky_list" class="active" href="javascript:;"></a> --}}
            <a data-uri="/rms/home?format=json" class="active" href="javascript:;"></a>
        </span>
    </div>

    @include('risk.list_table')

    <script>
    (function(){
        var me = $(this);

        me.find('[refresh-btn]').on('click',function(){
            $(window).trigger({type:'risk_list_update_please'});
        });

        $(window).on('risk_list_updated',function(event){
            var risk_list_info = event.risk_list_info;
            me.children('.hd').render(risk_list_info);

            renderList($.pullValue(risk_list_info,'normal_products',[]));
        });

        function renderList(products){
            me.renderTable(products);
            !products.length && me.find('.nothing-nothing').addClass('nothing');
        }

    }).call( document.scripts[document.scripts.length-1].parentNode );
    </script>
</section>
