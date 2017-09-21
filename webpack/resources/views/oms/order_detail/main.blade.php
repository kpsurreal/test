<section >
    <div class="popup-wrap mod-popup mfp-hide oms-popup popup-order-detail" id="popup-order-detail"><div id="order_detail">
        <div class="popup-bd">
            <div class="content-bd">
                <div class="panel info-panel">
                    <h2>订单<span data-src="id"></span></h2>
                    <div class="order-brief">
                        <p>订单状态
                            <span class="red" data-src="status|statusCH"></span>
                        </p>
                        <p>策略
                            <span data-src="product.name"></span>
                        </p>
                        <p>股票
                            <span>
                                <b data-src="stock.code|getPureCode"></b>
                                <b data-src="stock_info.stock_name"></b>
                            </span>
                        </p>
                        <p>方向
                            <span data-class="entrust.type|mapVal:1->red,2->blue"><b data-src="entrust.type|entrustTypeCH"></b></span>
                        </p>
                        <p>下单价格
                            <span>
                                <b if="entrust.model|equalNum:1">
                                    <b data-src="entrust.price|numeral:0,0.000"></b> 元
                                </b>
                                <span  data-src="entrust.model|entrustModelType"></span>
                            </span>
                        </p>
                        <p>下单数量
                            <span><b><b data-src="entrust.amount|numeral:0,0"></b> 股</b></span>
                        </p>
                        <p>下单时间
                            <span data-src="created_at|unixTime"></span>
                        </p>
                        <p>委托编号
                            <span if="order_id" data-src="order_id"></span>
                            <span if="order_id|isFalse">未设置</span>
                        </p>
                        <p if="order_status|>:3">成交数量/价格
                            <span>
                                <span data-src="deal.amount|numFormat:0,0"></span>股/<span data-src="deal.price|numeral:0,0.000"></span>元
                            </span>
                        </p>
                    </div>
                    @include('oms.order_detail.order_deal_history')
                </div>
                <div class="panel ctrl-panel">
                    <h2>
                        <str if="product.cup.product_manger|isFalse">
                            <span class="ctrl-area-ctrls default-active exclusive-active" click-active=".ctrl-area-ctrls">处理</span>
                        </str>
                        <str if="product.cup.product_manger">
                            <span class="ctrl-area-ctrls default-active exclusive-active" click-active=".ctrl-area-ctrls">处理</span>
                            <i>/</i>
                            <span class="ctrl-area-history exclusive-active" click-active=".ctrl-area-history">操作历史</span>
                        </str>
                    </h2>
                    <p class="status-words"></p>
                    <div class="ctrl-area">
                        <div class="active-show ctrl-area-ctrls exclusive-active default-active" id="ctrl-area">
                            <div class="workflow-board">
                                <div class="workflow order-workflow" data-src="order_status|orderWorkFlow"></div>
                                <div class="workflow cancel-workflow" data-src="cancel_status|cancelWorkFlow"></div>
                            </div>
                            <div if="hiddenBtnFlag|isFalse">
                              @yield('ctrl_panel')
                            </div>
                        </div>
                        <div class="active-show exclusive-active ctrl-area-history">
                            @include('oms.order_detail.order_ctrl_history')
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div></div>

    <script>
    (function(){
        var me = $(this);
        var popup = me.find('#popup-order-detail');
        var order_detail_dom = me.find('#order_detail');

        $(window).on('order_open',function(event){
            $('.exclusive-active.default-active').siblings().removeClass('active').end().addClass('active');
            isOrderFinish(event.order) && order_detail_dom.find('.if-pass .ctrl-area-history').click();
        }).on('open_order_by_id',function(event){
            var order_id = event.order_id;
            openOrderById(order_id);
        }).on('open_order_by_order',function(event){
            var order = event.order;
            order.hiddenBtnFlag = !!event.hiddenBtnFlag;
            openOrderDetail(order);
        }).on('oms_workflow_handle_done',function(){
            $.magnificPopup.close();
        });

        order_detail_dom.on('click','.if-pass .ctrl-area-history',function(){
            $(window).trigger('order_detail:open_ctrl_history');
        });

        function openOrderById(original_ploy_id){
            var url = (window.REQUEST_PREFIX||'')+'/oms/order/get_detail?id=' + original_ploy_id;
            $.get(url).done(function(res){
                if(res.code==0){
                    var order = res.data;
                    openOrderDetail(order);
                }else{
                    failNotice(res);
                }
            }).fail(failNotice);

            function failNotice(res){
                $.omsAlert($.pullValue(res,'msg','请求失败'),false);
            }
        }

        function isOrderFinish(order){
            if( order.status == 3 ){ return true; }
            if( order.status == 5 ){ return true; }
            if( order.status == 7 ){ return true; }
            if( order.order_status == 4 ){ return true; }
            if( order.cancel_status == 2 ){ return true; }
            return false;
        }

        function openOrderDetail(order){
            //尝试分配策略概览信息
            order.product = getProductById(order.product_id);

            //如果没有呢，尝试把全局信息传递给当前 order
            !order.product && window.PRODUCT && window.PRODUCT.id==order.product_id && (order.product = window.PRODUCT);

            //如果还是没有策略信息，远程获取
            order.product
            ? openOrderPopup(order)
            : getProductInfoById(order.product_id).then(function(product_info){
                order.product = product_info.basic;
                openOrderPopup(order)
            });

            function getProductById(id){
                return PRODUCTS.filter(function(x){
                    return x.id == id;
                })[0];
            }
        }

        function openOrderPopup(order){
            injectPermissionInfo(order);

            $.magnificPopup.close();

            var last_render_timestamp = new Date().valueOf();
            order_detail_dom.attr('last_render_timestamp',last_render_timestamp);

            var destroy_timer;
            $.magnificPopup.open({
                items: {
                    src: popup,
                    type: "inline",
                    midClick: true
                },
                callbacks: {
                    open: function() {
                        order.live_with && $(order.live_with).on('destroy',function(){
                            //是真的 destroy 掉了吗？还是仅仅刷新了列表数据
                            var tbody = $(this).closest('tbody');
                            var is_destroy = true;
                            destroy_timer = setTimeout(function(){
                                tbody.find('tr').each(function(){
                                    var tr_order = $(this).getCoreData();
                                    var has_same_order = (tr_order.id == order.id);
                                    if(has_same_order){
                                        is_destroy = false;
                                    }
                                });
                                is_destroy && $.magnificPopup.close();
                            },100);
                        });

                        $.isEmptyObject(order.stock_info) ? mergeOrderStocksInfo([order]).then(function(){
                            last_render_timestamp<=order_detail_dom.attr('last_render_timestamp') && renderOrderDetail();
                        }) : renderOrderDetail();

                        function renderOrderDetail(){
                            order_detail_dom.render(order);
                            $(window).trigger({type:'order_open',order:order});

                            //第二次不再触发 order_open
                            renderOrderDetail = function(){
                                order_detail_dom.render(order);
                            }
                        }
                    },
                    close: function(){
                        order.live_with && order.live_with.off('destroy');
                        clearTimeout(destroy_timer);
                        $(window).trigger('order_detail:close');
                    }
                }
            });
        }

        function injectPermissionInfo(order){
            var product = order.product;
            var current_user_permission = $.pullValue(window,'LOGIN_INFO.my_permission.'+product.id,{});
            product.cup = product.current_user_permission = current_user_permission;
        };
    }).call( document.scripts[document.scripts.length-1].parentNode );
    </script>
</section>
