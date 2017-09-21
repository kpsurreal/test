<section class="create-order" style="display:none;">
    <div class="left-nav">
        <div class="section-nav">
            <span class="nav-item red active single-buy" nav=".single-stock" click-click=".direction-ctrl.buy" click-active="_self">个股买入</span>
            <span class="nav-item blue single-sell" nav=".single-stock" click-click=".direction-ctrl.sell" click-active="_self">个股卖出</span>
            <span class="nav-item red multi-buy" nav=".multi-stocks .buy" click-active="_self">批量买入</span>
            <span class="nav-item blue multi-sell" nav=".multi-stocks .sell" click-active="_self">批量卖出</span>
        </div>
    </div>
    <div class="right-board">
        {{-- 单只股票买卖 --}}
        <div class="inner-wrap single-stock" style="display:none;">
            {{-- 创建订单 --}}
            @include('oms.product.order_create.new_order')
            {{-- 5当行情 --}}
            @include('oms.product.order_create.trade_5')
        </div>

        {{-- 多只股票批量买卖 --}}
        <div class="inner-wrap multi-stocks">
            <div class="buy multi-stocks-section" style="display:none;">
                @include('oms.product.order_create.multi_order.buy')
            </div>
            <div class="sell multi-stocks-section" style="display:none;">
                @include('oms.product.order_create.multi_order.sell')
            </div>
        </div>
    </div>

    <script>
    (function(){
        var me = $(this);
        var nav = me.find('>.left-nav');
        var board = me.find('>.right-board');

        $(function(){
            closePositionCmdCheck();

            nav.find('.nav-item').on('click_active',function(event){
                $(this).siblings().each(function(){
                    board.find( '>' + $(this).attr('nav') ).hide();
                });
                board.find( '>' + $(this).attr('nav') ).show();
                $.omsUpdateLocalJsonData('etc','order_create_nav_index',nav.find('.nav-item').index(this));

                var type = 'order_create:nav' + $(this).attr('nav').replace(/\s/g,'').replace(/\./g,':');
                $(window).trigger({type:'order_create:nav:change'});
                $(window).trigger({type:type});
            }).eq( $.omsGetLocalJsonData('etc','order_create_nav_index',0) ).click();
        });

        //启动本模块的代码
        $(window).on('load spa_product_change',function(event){
            var product = event.product || PRODUCT;
            var can_trade = product.is_running && $.pullValue(product,'current_user_permission.product_do_trade',NaN);
            can_trade ? me.show() : me.hide();
        }).on('spa_product_change',function(event){
            var product = event.product || PRODUCT;
            product.is_running && reActiveNav();
        }).on('order_create:by_stock',function(event){
            $(window).trigger({type:'main_window:goto_section',section:me});
            nav.find('.nav-item.single-'+ $.pullValue(event,'stock.direction','sell')).click();
        }).on('add_multi_hand_order:success',function(){
            nav.find('.nav-item.active').click();
        }).on('order_create:direction:changed',function(event){
            var direction = event.direction;
            board.find('>.single-stock').removeClass('sell').removeClass('buy').addClass(direction);
        });

        //平仓指令检测  http://192.168.0.20:26080/omsv2/oms/11302#cmd=close-position
        function closePositionCmdCheck(){
            if( location.hash=='#cmd=close-position' ){//检测到平仓指令
                location.hash='';

                me.one('order_create:multi_order:sell:ready', '.sell.multi-stocks-section', function(event){
                    var multi_stocks_sell_board = $(this);
                    setTimeout(function(){
                        multi_stocks_sell_board.find('.range-input').trigger({type:'setValue',value:1}); //进度条拉到 100%
                        multi_stocks_sell_board.find('[rows-head] input[type=checkbox]').prop('checked',true).change(); //全部选中
                        closePositionReady();
                    },1000);
                });

                startClosePosition();
            }

            function startClosePosition(){
                $.omsUpdateLocalJsonData('etc','order_create_nav_index',3);
                $.startLoading('正在进行平仓准备工作...');
            }

            function closePositionReady(){
                $.clearLoading();
                $.omsAlert('平仓准备就绪，请手动完成后续工作！',10000);
            }
        }

        function reActiveNav(){
            nav.find('.nav-item.active').click();
        }
    }).call( document.scripts[document.scripts.length-1].parentNode );
    </script>
</section>
