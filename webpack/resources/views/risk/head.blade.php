<section class="allocation-head">
    <div class="hd">
        <span class="section-title">运行中的策略</span>
        <span class="title-tip">所有当前运行中的策略的信息概览 &nbsp; &nbsp; [ 数据更新时间：<str data-src="product_new_list.update_time">--</str> ]</span>
    </div>
    <div class="bd">
        <div class="card">
            <h2 class="red" data-src="bad_products.length">--</h2>
            <span>达到平仓线</span>
        </div>
        <div class="card">
            <h2 class="yellow" data-src="warn_products.length">--</h2>
            <span>达到预警线</span>
        </div>
        <div class="card">
            <h2 data-src="sad_products.length">--</h2>
            <span>净值低于1的策略</span>
        </div>
        <div class="card">
            <h2 data-src="products.length">--</h2>
            <span>所有运行中的策略</span>
        </div>
    </div>
    <div class="select" {{config('custom.showProductType') ? '' : 'style=display:none;'}}>
        <b>筛选：</b>
        <label class="option all active" value="全部"><input type="checkbox">全部</label>
        <label class="option active" value="进取型操盘乐"><input type="checkbox">进取型操盘乐</label>
        <label class="option active" value="分红乐"><input type="checkbox">分红乐</label>
        <label class="option active" value="公益乐"><input type="checkbox">公益乐</label>
        <label class="option active" value="无忧型操盘乐"><input type="checkbox">无忧型操盘乐</label>
        <label class="option active" value="稳赢型操盘乐"><input type="checkbox">稳赢型操盘乐</label>
    </div>

    <?php
        $group_id = array_search(true,[
            false,
            Request::is('oms/allocation/index'),
            Request::is('oms/gather'),
            Request::is('oms/*')
        ]);
    ?>
    <script>
    (function(){
        var me = $(this);
        var select = me.find('.select');

        select.find('.option.active input[type=checkbox]').prop('checked',true);
        select.find('.option:not(.active) input[type=checkbox]').prop('checked',false);

        select.on('change', 'input[type=checkbox]', function(){
            var label = $(this).closest('label');

            label.toggleClass('active');

            if( label.is('.all') ){
                var all_show = label.is('.active');
                select.find('.option:not(.all)').toggleClass('active', all_show).find('input[type=checkbox]').prop('checked', all_show);
            }else{
                !label.is('.active') && select.find('.option.all').removeClass('active').find('input[type=checkbox]').prop('checked', false);
            }

            active_options = select.find('.active');

            var options = select.find('.option.active').toArray().map(function(item){
                return $(item).attr('value');
            });

            $(window).trigger({type:'risk_list:select:changed',options:options});
        });

        $(window).on('risk_list_updated',function(event){
            var risk_list_info = event.risk_list_info;
            me.render(risk_list_info);
        });
    }).call( document.scripts[document.scripts.length-1].parentNode );
    </script>
</section>
