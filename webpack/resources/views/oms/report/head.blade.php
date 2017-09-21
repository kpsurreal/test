@include('oms.product.detail.head')

<section style="margin-bottom:0;margin-top:30px;">
    <div class="section-nav head-nav" style="padding:0;">
        <a class="nav-item black" href="javascript:;" data-href="|parseString:{{ config('view.path_prefix','') }}/oms/report/${id}/assets">资产查询</a>
        <a class="nav-item black" href="javascript:;" data-href="|parseString:{{ config('view.path_prefix','') }}/oms/report/${id}/entrust">委托查询</a>
        <a class="nav-item black" href="javascript:;" data-href="|parseString:{{ config('view.path_prefix','') }}/oms/report/${id}/position">持仓查询</a>
        <a class="nav-item black" href="javascript:;" data-href="|parseString:{{ config('view.path_prefix','') }}/oms/report/${id}/deal">成交查询</a>
        <a class="nav-item black" href="javascript:;" data-href="|parseString:{{ config('view.path_prefix','') }}/oms/report/${id}/cashflow">清算单查询</a>
    </div>
    <script>
    (function(){
        var me = $(this);

        $(function(){
            me.find('.head-nav').render(
                $.pullValue(window,'PRODUCT',{
                    id: location.pathname.replace(/^.*\/(\d+)$/,'$1')
                })
            ).find('a').each(function(){
                $(this).toggleClass('active',$(this).attr('href') == location.pathname)
            }).filter('.active').click(function(){
                return false;
            });
        });
    }).call( document.scripts[document.scripts.length-1].parentNode );
    </script>
</section>
