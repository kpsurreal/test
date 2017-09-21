<div class="foot" color="{{$to_buy ? 'red' : 'blue'}}">
    <div class="foot-inner">
        <div class="item total-info">
            风控后可用资金
                <span data-src="balance_amount|numeral:0,0.00">18,150,000.00</span>
            交易后
                <span data-src="balance_amount_last|numeral:0,0.00">150,000.00</span>
            <br/>
            当前仓位
                <span data-src="position|numeral:0.00%">20.00%</span>
            交易后
                <span data-src="position_last|numeral:0.00%">28.75%</span>
        </div>

        <div class="item range-ctrl">
            {{-- 新增对于时间的判断 --}}

            {{-- <div if="|notSubmitPeriod" style="padding-right: 10px;">当前时段不可提单，请17:00后再试</div> --}}
            <div if="|submitPeriod">
                @if($to_buy)
                     {{-- left_running_day check start --}}
                    <div if="left_buy_day|<=:0 AND is_forever|=:1|isFalse">
                        <str style="color:red;">可买天数为0，不允许买入股票 &nbsp; &nbsp;</str>
                    </div>
                    <div if="left_buy_day|>:0 OR is_forever|=:1">
                @endif

                <div class="ctrl left-ctrl">
                    @if($to_buy)
                        可用资金消耗
                        <span if="range|>:1|isFalse" data-src="range|numeral:0.00%"></span>
                        <span if="range|>:1" data-src="range|numeral:0.00%" style="color:red;"></span>
                        <br/>
                        <str if="range|>:1" style="color:red;">超出可用资金限额</str>
                    @endif
                    @if($to_sell)
                        卖出股票占比
                        <span data-src="range|numeral:0.00%"></span>
                    @endif
                </div>
                <div class="ctrl right-ctrl">
                    <div class="range-input" data-src="range|getRangeInput" render-once></div>
                </div>

                @if($to_buy)
                    {{-- left_running_day check end --}}
                    </div>
                @endif
            </div>

        </div>

        <div class="item submit">
            @include('oms.product.order_create.multi_order.submit',['to_buy'=>$to_buy,'to_sell'=>$to_sell])
        </div>
    </div>
    <script>
    (function(){
        var me = $(this);
        var active = false;
        var direction = "{{$to_buy?'buy':'sell'}}";
        var data = {};

        $(window).on('order_create:nav:change',function(){
            active = false;
            reset();
        }).on('order_create:nav:multi-stocks:'+direction,function(){
            active = true;
        }).on('spa_product_change',
            reset
        ).on('product_detail_changed',function(event){
            var product = event.product;
            var core_info = {
                left_buy_day: +$.pullValue(product,'left_buy_day',0),
                total_assets: +$.pullValue(product,'runtime.total_assets',0),
                position: +$.pullValue(product,'runtime.position',0),
                is_forever: +$.pullValue(product,'is_forever',0),
                left_running_day: +$.pullValue(product,'left_running_day',0)
                // balance_amount: +$.pullValue(product,'runtime.balance_amount',0)
            };
            var core_info_cache_key = 'multi_order:core_info:'+direction+':'+PRODUCT.id;

            if( $.dirtyCheck(core_info_cache_key,core_info) ){
                $.extend(data,core_info);
                // if (PRODUCT && PRODUCT.runtime && PRODUCT.runtime.enable_cash) {
                //     data.balance_amount = PRODUCT.runtime.enable_cash
                // }
                updateData();
            }
        }).on('create_order:multi_stocks:'+direction+':max_cash:changed',function(event){
            var max_cash = event.max_cash;
            data.balance_amount = max_cash;
            updateData();
        }).on('order_create:multi_order:real_cost_change:'+direction, updateDataWithRealCost);

        me.find('.range-input').on('changed',function(event){
            var value = event.value;
            if(data.range!=value){//来自用户操作产生的主动变更
                data.original_range = value;
                data.range = value;
                updateData();
            }
        });

        function updateData(){
            //the core algorithm
            var result = $.extend({
                direction: direction,

                total_assets: 0,
                position: 0,
                balance_amount: 0,

                range: 0,
                original_range: 0,
                position_diff: 0,
                balance_amount_diff: 0,

                position_last: 0,
                balance_amount_last: 0,

                is_forever: 0,
                left_buy_day: 0,
                left_running_day: 0
            },data);

            if(direction=='buy'){
                result.balance_amount_diff = Math.max(result.balance_amount*result.original_range,0);
                result.balance_amount_last = result.balance_amount-result.balance_amount_diff;
                result.position_diff = result.total_assets ? result.balance_amount_diff/result.total_assets : 0;
                result.position_last = result.position_diff + result.position;
            }

            if(direction=='sell'){
                result.balance_amount_last = result.balance_amount-result.balance_amount_diff;
                data.position_diff = -data.position * data.range;
                result.position_last = result.position_diff + result.position;
            }

            data = result;
            me.render(data);

            $(window).trigger({type:'order_create:multi_order:data_change:'+direction,new_data:data});
        }

        function updateDataWithRealCost(){
            //通过真实花费，重置展示

            if(direction=='buy'){
                data.balance_amount_diff = data.real_cost;
                data.range = data.balance_amount ? data.balance_amount_diff/data.balance_amount : 0;
                data.balance_amount_last = data.balance_amount-data.balance_amount_diff;
                data.position_diff = data.total_assets ? data.balance_amount_diff/data.total_assets : 0;
                data.position_last = data.position_diff + data.position;
            }

            if(direction=='sell'){
                data.balance_amount_diff = -data.total_sell_cash;
                data.balance_amount_last = data.balance_amount-data.balance_amount_diff;

                // 仓位变化单独处理
                data.position_last = Math.max(data.position - data.total_sell_position,0);
            }

            me.render(data);
            setRange(data.range);
        }

        function setRange(value){
            me.find('.range-input').trigger({type:'setValue',value:value});
        }

        function reset(){
            var core_info_cache_key = 'multi_order:core_info:'+direction+':'+PRODUCT.id;
            $.dirtyCheck(core_info_cache_key);//重置 core_info 缓存

            $.extend(data,{
                direction: direction,
                balance_amount: 0,

                range: 0,
                original_range: 0,
                position_diff: 0,
                balance_amount_diff: 0,

                position_last: 0,
                balance_amount_last: 0
            });

            updateData();
            setRange(data.range);
        }
    }).call(document.scripts[document.scripts.length-1].parentNode);
    </script>
</div>
