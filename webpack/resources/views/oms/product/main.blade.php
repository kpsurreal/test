<div>
    <div class="main-toggle-pane main-no-empty" style="display:none;">
        @include('oms.product.detail')
        @include('oms.product.order_create')
        @include('oms.product.position')
        @include('oms.product.order_list')
        <p class="foot-note">金额单位:元 股票单位:股</p>
    </div>
    <div class="main-toggle-pane main-empty" style="display:none;">
        <center cid="nothing-404">
            <style>[cid=nothing-404] *{transition:color 1s ease;}</style><br/>
            <p style="font-size:260px;">404</p><br/>
            <font size="7">
                <div if="id">
                    没有请求到 ID 为 <span data-src="id"></span> 的策略数据呃 :)
                    <br/>
                    请确定你拥有相应权限
                </div>
                <div if="id|isFalse">
                    没有相关策略数据呃 :)
                </div>
            </font>
            <script>
            // (function(){
            //     var me = $(this);
            //     if( /oms\/?$/.test(location.href) ){
            //         me.find('p').css({
            //             fontSize: '150px',
            //             visibility: 'hidden'
            //         });
            //         me.find('font').html('正在跳转...');
            //         $(function(){
            //             $.omsAlertShutUp();
            //         });
            //
            //         $(window).trigger(
            //             'side_nav_product_list:try_goto_first_nav'
            //         ).on('side_nav_product_list:no_running',function(event){
            //             me.find('p').css({
            //                 fontSize: '260px',
            //                 visibility: 'visible'
            //             });
            //
            //             me.find('font').html('您当前没有可查看的运行中的组合 : )').show();
            //         });
            //     }
            // }).call(document.scripts[document.scripts.length-1].parentNode);
            </script>
        </center>
    </div>

    <script>
    (function(){
        var me = $(this);
        var pane_no_empty = me.find('>.main-toggle-pane.main-no-empty');
        var pane_empty = me.find('>.main-toggle-pane.main-empty');

        $(window).on('load spa_product_change',function(event){
            var product = event.product || PRODUCT;
            var can_view = $.pullValue(product,'current_user_permission.product_do_trade',NaN);
            can_view ? pane_no_empty.show() : pane_no_empty.hide();
            !can_view ? pane_empty.render(product).show() : pane_empty.hide();
            can_view ? $.omsAlertOpenUp() : $.omsAlertShutUp();
        });
    }).call(document.scripts[document.scripts.length-1].parentNode);
    </script>
</div>
