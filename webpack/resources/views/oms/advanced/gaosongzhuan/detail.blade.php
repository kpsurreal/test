<section>
	<div class="popup-wrap mod-popup mfp-hide oms-popup popup-order-detail gaosongzhuan" popup >
        <div class="popup-bd">
            <div class="content-bd">
                <div class="panel info-panel gaosongzhuan-render">
                    <h2>订单<span data-src="id"></span></h2>
                    <div class="order-brief">
                        <p>策略
                            <span data-src="product.name"></span>
                        </p>
                        <p>股票
                            <span data-src="stock_info.stock_name"></span>
                        </p>
                        <p>每股送股比例
                            <span data-src="per_share_div_ratio|numeral:0%"></span>
                        </p>
                        <p>每股转增比例
                            <span data-src="per_share_trans_ratio|numeral:0%"></span>
                        </p>
                        <p>每股派现
                            <span data-src="per_cash_div|numeral:0,0.000"></span>
                        </p>
                        <p>除权派息日
                            <span data-src="ex_div_date|moment:YYYY/M/DD"></span>
                        </p>
                        <p>派现日
                            <span data-src="pay_cash_date|moment:YYYY/M/DD"></span>
                        </p>
                        <p>红股上市日
                            <span data-src="bonus_share_list_date|moment:YYYY/M/DD"></span>
                        </p>
                    </div>
                </div>
                <div class="panel ctrl-panel">
                    <h2>
                        <span class="ctrl-area-ctrls active" click-active=".ctrl-area-ctrls">处理</span>
                    </h2>
                    <div class="ctrl-area gaosongzhuan-render">
                        <form autocomplete="off" style="margin-top:-15px;">
                            <input type="hidden" data-src="gaosongzhuan_id" name="gaosongzhuan_id">
                            <table class="gaosongzhuan-update">
                                <tr>
                                    <th></th>
                                    <!-- <th>价格</th> -->
                                    <th>数量</th>
                                    <th>现金</th>
                                </tr>
                                <tr>
                                    <td>变更前</td>
                                    <!-- <td data-src="stock_info.last_price|numeral:0.000" ></td> -->
                                    <td data-src="position_amount|numeral:0,0" ></td>
                                    <td data-src="|numeral:0,0.000" ></td>
                                </tr>
                                <tr>
                                    <td>派股送息</td>
                                    <!-- <td>
                                        <input data-src="suggest_price" type="text" readonly disabled>
                                    </td> -->
                                    <td>
                                        <input data-src="suggest_amount" type="text" name="amount" value="" pattern="^\d*\.?\d*$">
                                    </td>
                                    <td>
                                        <input data-src="suggest_cash|numeral:0.000" type="text" name="cash" value="" pattern="^\d*\.?\d*$">
                                    </td>
                                </tr>
                            </table>
                            <div class="more-fields">
                                <label>
                                    <span style="width:23%;">当日冻结</span>
                                    <div class="input" style="padding-right:4%;">
                                        <input type="checkbox" name="frozen_today" value="1">
                                    </div>
                                </label>
                                <label>
                                    <span style="width:23%;">备注</span>
                                    <div class="input" style="padding-right:4%;">
                                        <input data-src="msg" type="text" name="msg">
                                    </div>
                                </label>
                                <label>
                                    <span style="width:23%;">&nbsp;</span>
                                    <div class="input" style="padding-right:4%;">
                                        <div if="status|=:0">
                                            <button class="ctrl-btn blue" type="submit">确认处理</button>
                                        </div>
                                        <div if="status|=:20">
                                            <button class="ctrl-btn blue" type="submit">确认重新变更</button>
                                        </div>
                                    </div>
                                </label>
                            </div>
                        </form>
                    </div>
                    @include('oms.advanced.gaosongzhuan.update_history')
                </div>
            </div>
        </div>
    </div>
    <script>
    (function(){
        var me = $(this);
        var me = me.find('[popup]');

        $(window).on('open_gaosongzhuan_detail',function(event){
            openGaosongzhuanById(event.gaosongzhuan.gaosongzhuan_id);
        });

        me.find('form').submit(function(){
            var form = $(this);
            if(form.is('.loading')){return false;}

            form.addClass('loading');
            var url = (window.REQUEST_PREFIX||'')+'/oms/advanced/exec_gaosongzhuan';
            $.post( url, form.serialize() ).done(function(res){
                res.code==0 ? $.magnificPopup.close() : $.failNotice(url,res);
            }).fail( $.failNotice.bind(null,url) ).always(function(){
                form.removeClass('loading');
            });

            return false;
        });

        function openGaosongzhuanById(id){
            var url = (window.REQUEST_PREFIX||'')+'/oms/advanced/get_gaosongzhuan_detail?id='+id;
            $.get(url).done(function(res){
                res.code==0 ? openGaosongzhuan(res.data) : $.failNotice(url,res);
            });
        }

        function openGaosongzhuan(gaosongzhuan){
            $.extend(gaosongzhuan,$.pullValue(gaosongzhuan,'execed',{}));
            gaosongzhuan.product = gaosongzhuan.product || getProductById(gaosongzhuan.product_id);

            var last_render_timestamp = new Date().valueOf();
            me.attr('last_render_timestamp',last_render_timestamp);

            $.isEmptyObject(gaosongzhuan.stock_info) ? mergeGaosongzhuanStocksInfo([gaosongzhuan]).then(function(){
                if( last_render_timestamp<me.attr('last_render_timestamp') ){return;}
                me.find('.gaosongzhuan-render').render(gaosongzhuan)
            }) : me.find('.gaosongzhuan-render').render(gaosongzhuan);

            if(gaosongzhuan.status == 0){
                me.find('input[type=checkbox]').prop('checked', /SH/.test(gaosongzhuan.stock_id));
            }else{
                me.find('input[type=checkbox]').prop('checked', 1*gaosongzhuan.frozen_today);
            }

            $.magnificPopup.open({
                items: {
                    src: me,
                    type: "inline",
                    midClick: true
                },
                callbacks: {
                    open: function() {
                        $(window).trigger({type:'gaosongzhuan_detail_opened',gaosongzhuan:gaosongzhuan});
                    }
                }
            });
        }

        function getProductById(id){
            return PRODUCTS.filter(function(x){
                return x.id == id;
            })[0];
        }
    }).call( document.scripts[document.scripts.length-1].parentNode );
    </script>
</section>
