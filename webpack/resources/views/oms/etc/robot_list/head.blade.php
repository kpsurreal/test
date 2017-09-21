<section class="advanced-head-section">
    <div class="hd">
        <span class="section-title">杂项</span>
        <span class="title-tip">杂七杂八</span>
    </div>
    <div class="bd">
        <a href="{{ config('view.path_prefix','') }}/oms/etc/robot_list">机器人分配列表</a>
        {{-- <a href="{{ config('view.path_prefix','') }}/oms/advanced/hand_order">手工交割单管理</a>
        <a href="{{ config('view.path_prefix','') }}/oms/advanced/frozen_fund">临时冻结解冻资金管理</a> --}}
        <!-- <a href="#">交割单</a>
        <a href="#">成交记录</a> -->
    </div>
    <script>
    (function(){
        var me = $(this);
        me.find('a').each(function(){
            $(this).toggleClass('active',$(this).attr('href') == location.pathname)
        }).filter('.active').click(function(){
            return false;
        });
    }).call( document.scripts[document.scripts.length-1].parentNode );
    </script>
</section>
