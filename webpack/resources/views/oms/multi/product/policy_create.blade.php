<link href="{{ asset('/css/policy-create.min.css') }}" rel="stylesheet">
<script id="product-manager-tmpl" type="text/x-dot-template">
@{{?it.array&&it.array.length>0}}
    @{{~it.array:value:index}}
        <tr style="height: 37px;">
            <td style="padding-left: 20px;">
                <label style="cursor:pointer;user-select:none;-webkit-user-select:none;">
                    @{{?1==it.array.length}}
                        <input class="product-select" type="checkbox" checked="checked" data-productId="@{{=value.id}}">
                    @{{??}}
                        <input class="product-select" type="checkbox" data-productId="@{{=value.id}}">
                    @{{?}}
                    &nbsp; <span data-src="name"></span>
                </label>
            </td>
            <td style="width: 144px;max-width: 144px;text-overflow: ellipsis;overflow: hidden;white-space: nowrap;">
                <span title="@{{=value.name}}" class="product-name">
                    @{{=value.name}}
                </span>
            </td>
            <td>
                <label class="label-policy-num">指令数量</label>
                <div class="math-input" style="float:left;margin-left: 3px;">
                    @{{?1==it.array.length}}
                        <input tabIndex="@{{=(index+1)}}" class="plus-input change-checkrisk-last plus-input-volume" type="text" id="policy_num_@{{=index}}" name="price"
                            pattern="^\d*$" onkeyup="value=value.replace(/[^\d]*/g,'')" limit-rule="positive" limit-words="必须大于 0">
                    @{{??}}
                        <input tabIndex="@{{=(index+1)}}" disabled="disabled" class="plus-input change-checkrisk-last plus-input-volume" type="text" id="policy_num_@{{=index}}" name="price"
                            pattern="^\d*$" onkeyup="value=value.replace(/[^\d]*/g,'')" limit-rule="positive" limit-words="必须大于 0">
                    @{{?}}

                    <span class="plus-ctrl" data-plus="+100"><i>+</i></span>
                    <span class="plus-ctrl" data-plus="-100"><i>-</i></span>
                </div>
                <div style="clear:both;display:block;"></div>
            </td>
            <td style="padding-right: 20px;">
                <label>指令金额</label>
                <input tabIndex="@{{=(-1)}}" class="policy_volume plus-input-amount" disabled="disabled" type="text" style="margin-left: 3px;width: 95px;" />
            </td>
        </tr>
    @{{~}}
@{{??}}
    @{{?true == it.flag.initFlag}}
        <span class="empty_tip loading-loading loading"><i class="oms-icon wait_v2" style="margin-left: 4px;margin-right: 4px;vertical-align: baseline;"></i>努力加载中...</span>
    @{{??}}
        @{{?1==window.LOGIN_INFO.role_id}}
            <span class="empty_tip">暂未创建产品单元，请先创建</span>
            @{{??}}
            <span class="empty_tip">还没有分配任何产品，请联系管理员分配</span>
        @{{?}}
    @{{?}}

@{{?}}
</script>
<section class="create-order board black-turnoff fc fixed transition" style="bottom: 0px; margin-bottom: 0px;">
    <div class="body single" style="display:flex;height:280px;overflow:hidden;">
        <div class="policy_create_left">
            <div class="sub_title">
                管理产品单元<span class="nav-item">已选择</span><span class="red">0</span><span>个</span>
                <span class="product-select-all">全选</span><span class="product-select-empty" style="display:none;">清空</span>
            </div>
            <table class="policy_products_table">
                <tbody id="product-manager-dst">
                </tbody>
            </table>
        </div>
        <div class="policy_create_right">
            <div class="left-nav">
                <div class="section-nav">
                    {{-- nav属性实现的是类似于切换tab的功能， --}}
                    {{-- <span class="nav-item red active single-buy" nav=".single-stock" click-click=".direction-ctrl.buy" click-active="_self">个股买入</span>
                    <span class="nav-item blue single-sell" nav=".single-stock" click-click=".direction-ctrl.sell" click-active="_self">个股卖出</span> --}}
                    <span class="nav-item red active single-buy" nav=".single-stock" click-click=".direction-ctrl.buy" click-active="_self">个股买入</span>
                    <span class="nav-item blue single-sell" nav=".single-stock" click-click=".direction-ctrl.sell" click-active="_self">个股卖出</span>
                </div>
            </div>
            <div class="right-board">
                {{-- 单只股票买卖 --}}
                <div class="inner-wrap single-stock buy">
                    {{-- 创建订单 --}}
                    {{-- @include('oms.multi.product.order_create.new_order') --}}
                    @include('oms.multi.product.policy_create.new_order')
                    {{-- 5当行情 --}}
                    @include('oms.multi.product.order_create.trade_5')
                    {{-- 个股交易历史 --}}
                    @include('oms.multi.product.order_create.trade_history')
                </div>
            </div>
        </div>
        <div style="clear: both;display: block;"></div>
    </div>
    {{-- @include('oms.multi.product.order_create.foot') --}}
    @include('oms.multi.product.policy_create.foot')

    <script>
    var policyProductsData = {};
    policyProductsData.flag = {
        initFlag: true
    }
    $(function(){
        var tablefn = doT.template(document.getElementById('product-manager-tmpl').text, undefined, undefined);
        function getPolicyProducts(){
            $.ajax({
                type: 'get',
                url: window.REQUEST_PREFIX + '/oms/helper/get_products_by_trader',
                data: {
                    status: 'running'
                },
                success: function(res){
                    // policyProductsData = {
                    //     'array': res.data
                    // }
                    policyProductsData.flag.initFlag = false;
                    policyProductsData.array = res.data;
                    // policyProductsData.array.length>0&&policyProductsData.array.sort(function(a, b){
                    //     return a.id > b.id;
                    // });

                    $(window).trigger({type: 'refreshProductsName', sets: policyProductsData })
                    document.getElementById('product-manager-dst').innerHTML = tablefn(policyProductsData);

                    if (1 == policyProductsData.array.length) {
                        $('.product-select-all').hide();
                        $('.product-select-empty').show();
                        $('.sub_title .red').html(1);
                    }

                    if (0 == policyProductsData.array.length) {
                        $('.product-select-all').hide();
                    }
                },
                error: function(){

                }
            });
        }
        getPolicyProducts();

        $(window).on('doRefreshProductsName', function(){
            $(window).trigger({type: 'refreshProductsName', sets: policyProductsData })
        });

        $('#product-manager-dst').on('click', '.product-name', function(){
            var thisSelect = $(this).parents('tr').find('.product-select');
            thisSelect.prop('checked', !thisSelect.prop('checked'));
            if ($(this).parents('tr').find('.product-select').prop('checked')) {
                $(this).parents('tr').addClass('active').find('.plus-input').prop('disabled', false).focus();
            }else{
                $(this).parents('tr').removeClass('active').find('.plus-input').prop('disabled', true);
            }
            var tmpN = 0;
            policyGridData.flag.showProductArr = [];
            $('.product-select').each(function(){
                if($(this).prop('checked')){
                    tmpN++;
                    policyGridData.flag.showProductArr.push(Number($(this).attr('data-productid')));
                }
            });
            if(0 == tmpN){
                $('.product-select-all').show();
                $('.product-select-empty').hide();
            }else{
                $('.product-select-all').hide();
                $('.product-select-empty').show();
            }
            $('.sub_title>.red').html(tmpN);
            $(window).trigger({
                type: 'policy_products_selected_change'
            });
            $(window).trigger('policy_display_change');
            $(window).trigger('display_policy_grid');
        });

        $('.product-select-all').click(function(){
            $('.product-select').each(function(){
                if (this.checked) {
                    ;
                }else{
                    $(this).click();
                }
            });
        });
        $('.product-select-empty').click(function(){
            $('.product-select').each(function(){
                if (this.checked) {
                    $(this).click();
                }else{
                    ;
                }
            });
        });

        $('#product-manager-dst').on('change', '.product-select', function(){
            if (this.checked) {
                $(this).parents('tr').addClass('active').find('.plus-input').prop('disabled', false).focus();
            }else{
                $(this).parents('tr').removeClass('active').find('.plus-input').prop('disabled', true);
            }
            var tmpN = 0;
            policyGridData.flag.showProductArr = [];
            $('.product-select').each(function(){
                if($(this).prop('checked')){
                    tmpN++;
                    policyGridData.flag.showProductArr.push(Number($(this).attr('data-productid')));
                }
            });
            if(0 == tmpN){
                $('.product-select-all').show();
                $('.product-select-empty').hide();
            }else{
                $('.product-select-all').hide();
                $('.product-select-empty').show();
            }
            $('.sub_title>.red').html(tmpN);
            $(window).trigger({
                type: 'policy_products_selected_change'
            });
            $(window).trigger('policy_display_change');
            $(window).trigger('display_policy_grid');
        }).on('click', '.plus-ctrl', function(){
            var dst = $(this).parent().find('.plus-input');
            if (dst.prop('disabled')) {
                return;
            }
            var value = $(this).attr('data-plus');
            if ('' == dst.val()) {
                var val = 0 + parseInt(value);
            }else{
                var val = parseInt(dst.val()) + parseInt(value);
            }

            if(val < 0){
                return;
            }
            dst.val(val);

            $(window).trigger({type:'policy_display_change'});
        }).on('change keyup', '.plus-input', function(){
            $(window).trigger({type:'policy_display_change'});
        });

        $(window).on('policy_display_change', function(){
            var value = $('#val_price').val();
            if ($('.order_model_limit_price').hasClass('active')) {
                if (0 == value || '' == value) {
                    if ($('.single-buy').hasClass('active')) {
                        //取涨停价
                        value = $('.stop_top_price').html();
                    }else if($('.single-sell').hasClass('active')){
                        //取当前价
                        value = $('.last_price').html();
                    }else{
                        return;
                    }
                }
            }else{
                if ($('.single-buy').hasClass('active')) {
                    //取涨停价
                    value = $('.stop_top_price').html();
                }else if($('.single-sell').hasClass('active')){
                    //取跌当前价
                    value = $('.stop_down_price').html();
                }else{
                    return;
                }
            }

            if ('' === value || '- -' === value || '--' === value) {
                return;
            }
            if (isNaN(Number(value))) {
                return;
            }
            $('#product-manager-dst').find('.plus-input').each(function(){
                if ($(this).prop('disabled')) {
                    ;
                }else{
                    var number = $(this).val();
                    if ('' == number) {
                        number = 0;
                    }

                    $(this).parents('tr').find('.policy_volume').val(Number((1000 * value).toFixed(2)) * number / 1000);
                }

            });
        });

        $('.single-buy').click(function(){
            $('.single-stock').removeClass('sell').addClass('buy');
            $(window).trigger({type: 'policy_display_change'});
            setTimeout(function(){
                $(window).trigger({type: 'policy_display_change'});
            });
        });
        $('.single-sell').click(function(){
            $('.single-stock').removeClass('buy').addClass('sell');
            setTimeout(function(){
                $(window).trigger({type: 'policy_display_change'});
            });
        });

        $('#product-manager-dst').on('keydown', '.plus-input', function(e){
            var value = parseInt(('' == $(this).val()) ? 0 : $(this).val(), 10);
            if (37 === e.keyCode) {
                value += 100;
                $(this).val(value);
                return false;
            }else if(39 === e.keyCode){
                value -= 100;
                if (0 > value) {
                    value = 0;
                }
                $(this).val(value);
                return false;
            }
        });
    });
    (function(){
        var me = $(this);
        var head = me.find('>.head');
        var nav = me.find('>.body>.left-nav');
        var board = me.find('>.body>.right-board');

        var multi_status;
        var product_list;
        var product_ids;

        $(function(){
            var last_order_create_nav_index = $.omsGetLocalJsonData('etc','order_create_nav_index',0);
            //默认不开启批量下单，多策略是没法批量下单的
            last_order_create_nav_index = last_order_create_nav_index>1 ? 0 : last_order_create_nav_index;

            nav.find('.nav-item').on('click_active',function(event){
                $(this).siblings().each(function(){
                    board.find( '>' + $(this).attr('nav') ).hide();
                });
                board.find( '>' + $(this).attr('nav') ).show();
                $.omsUpdateLocalJsonData('etc','order_create_nav_index',nav.find('.nav-item').index(this));

                var type = 'order_create:nav' + $(this).attr('nav').replace(/\s/g,'').replace(/\./g,':');
                $(window).trigger({type:'order_create:nav:change'});
                $(window).trigger({type:type});

                me.find('>.body').removeClass('multi single').addClass(
                    $(this).is('[nav*=single]') ? 'single' : 'multi'
                );
            }).eq( last_order_create_nav_index ).click();

            nav.on('click', '.nav-item.multi_products-disabled.disabled', function(){
                $.omsAlert('多策略暂时无法使用批量下单功能！',false,1000);
            });
        });

        //启动本模块的代码
        $(window).on('order_create:by_stock',function(event){
            var target_nav = nav.find('.nav-item.single-'+ $.pullValue(event,'stock.direction','sell'));
            !(target_nav.is('.active')) && target_nav.click();
        }).on('add_multi_hand_order:success',function(){
            nav.find('.nav-item.active').click();
        }).on('order_create:direction:changed',function(event){
            // var direction = event.direction;
            // board.find('>.single-stock').removeClass('sell').removeClass('buy').addClass(direction);
        }).on('multi_products:head:updated:checked_one',function(){
            enableMultiOrder();
        }).on('multi_products:head:updated:checked_notone',function(){
            disableMultiOrder();
        });

        function enableMultiOrder(){
            me.find('.multi_products-disabled').removeClass('disabled');
        }

        function disableMultiOrder(){
            me.find('.multi_products-disabled').addClass('disabled');
        }

        function reActiveNav(){
            nav.find('.nav-item.active').click();
        }
    }).call( document.scripts[document.scripts.length-1].parentNode );
    </script>
</section>
