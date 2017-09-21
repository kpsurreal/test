<section  cid="hand_order-detail">
	<div class="popup-wrap mod-popup mfp-hide oms-popup popup-order-detail hand_order" popup >
        <div class="popup-bd">
            <div class="content-bd">
                <div class="panel info-panel">
                    <h2>订单<span data-src="id"></span></h2>
                    <div class="order-brief">
                        <p>策略
                            <span data-src="product.name"></span>
                        </p>
                        <p>股票
                            <span data-src="stock_info.stock_name"></span>
                        </p>
                        <p>买卖方向
                            <span data-src="deal_type|entrustTypeCH"></span>
                        </p>
                        <p>成交日期
                            <span data-src="dealed_at|moment:YYYY-MM-DD"></span>
                        </p>
                        <p>成交价格
                            <span data-src="deal_price|numeral:0,0.000"></span>
                        </p>
                        <p>成交数量
                            <span data-src="deal_volume|numeral:0,0.000"></span>
                        </p>
                        <p>成交金额
                            <span data-src="deal_amount|numeral:0,0.000"></span>
                        </p>
                        <p>总计交易费
                            <span data-src="total_fee|numeral:0,0.000"></span>
                        </p>
                        <p>委托编号
                            <span data-src="order_id"></span>
                        </p>
                    </div>
                </div>
                <div class="panel ctrl-panel">
                    <h2>
                        <span class="ctrl-area-ctrls active" click-active=".ctrl-area-ctrls">处理</span>
                    </h2>
                    <div class="ctrl-area">
                        <form autocomplete="off">
                            <input type="hidden" data-src="id" name="delivery_id">
                            <label>
                                <span style="width:23%;">交易费</span>
                                <div class="input" style="padding-right:4%;">
                                    <input data-src="total_fee|numeral:0.000" type="text" name="total_fee" pattern="^\d*\.?\d*$">
                                </div>
                            </label>
                            <button class="ctrl-btn blue" type="submit">确认更新</button>
                        </form>
                    </div>
                    @include('oms.advanced.hand_order.update_history')
                </div>
            </div>
        </div>
    </div>
    <script>
    (function(){
        var me = $(this);
        var me = me.find('[popup]');

        $(window).on('open_hand_order_detail',function(event){
            openHandOrderById(event.hand_order.id);
        });

        me.find('form').submit(function(){
            var form = $(this);
            if(form.is('.loading')){return false;}

            form.addClass('loading');
            var url = (window.REQUEST_PREFIX||'')+'/oms/advanced/exec_hand_order_update';
            $.post( url, form.serialize() ).done(function(res){
                if(res.code==0){
                    $.magnificPopup.close();
                    $(window).trigger({type:'advanced:exec_hand_order_update:success'});
                }else{
                    $.failNotice(url,res);
                }
            }).fail( $.failNotice.bind(null,url) ).always(function(){
                form.removeClass('loading');
            });

            return false;
        });

        function openHandOrderById(id){
            var url = (window.REQUEST_PREFIX||'')+'/oms/advanced/get_hand_order_detail?id='+id;
            $.get(url).done(function(res){
                res.code==0 ? openHandOrder(res.data) : $.failNotice(url,res);
            });
        }

        function openHandOrder(hand_order){
            $.extend(hand_order,$.pullValue(hand_order,'execed',{}));
            hand_order.product = hand_order.product || getProductById(hand_order.product_id);

            var last_render_timestamp = new Date().valueOf();
            me.attr('last_render_timestamp',last_render_timestamp);

            mergeHandOrderStocksInfo([hand_order]).then(function(){
                mergeProductsBriefInfo([hand_order]).then(function(){
                    if( last_render_timestamp<me.attr('last_render_timestamp') ){return;}
                    me.render(hand_order)
                });
            });

            if(hand_order.status == 0){
                me.find('input[type=checkbox]').prop('checked', /SH/.test(hand_order.stock_id));
            }else{
                me.find('input[type=checkbox]').prop('checked', 1*hand_order.frozen_today);
            }

            $.magnificPopup.open({
                items: {
                    src: me,
                    type: "inline",
                    midClick: true
                },
                callbacks: {
                    open: function() {
                        $(window).trigger({type:'hand_order_detail_opened',hand_order:hand_order});
                    }
                }
            });

            function render(hand_order){

            }
        }

        function getProductById(id){
            return PRODUCTS.filter(function(x){
                return x.id == id;
            })[0];
        }

    }).call( document.scripts[document.scripts.length-1].parentNode );
    </script>
</section>
