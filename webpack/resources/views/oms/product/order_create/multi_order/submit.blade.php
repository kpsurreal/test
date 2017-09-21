<?php
    use App\Services\OMS\Workflow\OMSWorkflowEntrustService;
?>
<div>
    @if($to_buy)
        <div if="|runningPeriod">
            <span class="oms-btn red">批量买入</span>
        </div>
        <div if="|notRunningPeriod">
            <span class="oms-btn disabled">批量买入</span>
        </div>
    @endif
    @if($to_sell)
        <div if="|submitPeriod">
            <span class="oms-btn blue">批量卖出</span>
        </div>
        <div if="|notSubmitPeriod">
            <span class="oms-btn disabled">批量卖出</span>
        </div>
    @endif
    <script>
    (function(){
        var me = $(this);
        var direction = "{{$to_buy?'buy':'sell'}}";

        me.on('click','.oms-btn:not(.disabled)',function(){
            var btn = $(this);
            var url = (window.REQUEST_PREFIX||'')+'/oms/workflow/'+PRODUCT.id+'/add_multi_hand_order';
            if(btn.is('.loading')){return;}

            var section = me.closest('.multi-stocks-section');
            var checked_rows = section.find('[rows-body] tr.checked');

            if( !checked_rows.length ){
                return $.omsAlert('没有选中任何股票 :)',false);
            }

            if( checkRowsOk() ){
                var orders = getOrders();
                if(orders.length){
                    //这里新增二次提醒
                    var is_trade_day = $.pullValue($('.trade-5').getCoreData(), 'is_trade_day');
                    var htmlArr = [];
                    var totalAmount = 0;
                    var totalVolume = 0;
                    orders.forEach(function(e){
                        var ins_price = e.price;
                        ins_price = ('' == ins_price)?0:ins_price;
                        var ins_type = e.trade_direction;//1买入 2卖出
                        var typeStr1 = '';
                        if (1 == ins_type) {
                            typeStr1 = '<span style="color:#F44336;">买入</span>';
                        }else if(2 == ins_type){
                            typeStr1 = '<span style="color:#2196F3">卖出</span>';
                        }

                        var ins_model = e.trade_mode;//限价、市价，市价时，价格切记传空
                        var typeStr2 = '';
                        if (1 == ins_model) {
                            typeStr2 = '限价';
                            if (0 == ins_price) {
                                // ins_model = selectize.getValue();
                                ins_model = utils.stock_custom.getMarketType(e.stock_id.match(/[a-zA-Z]+/));
                                e.trade_mode = ins_model;
                                typeStr2 = '市价';
                            }
                        }else if(2 == ins_model){
                            // ins_price = 0;
                            // ins_model = selectize.getValue();
                            ins_model = utils.stock_custom.getMarketType(e.stock_id.match(/[a-zA-Z]+/));
                            e.trade_mode = ins_model;
                            typeStr2 = '市价';
                        }

                        var tmpInsVolume = e.volume;
                        var tmpInsAmount = Number((10000 * ins_price).toFixed(2)) * tmpInsVolume / 10000;
                        totalAmount = (parseFloat(totalAmount)*10000 + parseFloat(tmpInsAmount)*10000) / 10000;
                        totalVolume = parseFloat(totalVolume) + parseFloat(tmpInsVolume);
                        var priceStr = (('市价' == typeStr2)?utils.common.getData(PRICE_TYPE_LIST, ins_model):ins_price);
                        htmlArr.push('<tr style="border-bottom: 1px solid #E2E2E2;"><td class="cell-left">'+ e.stock_id + ' ' + e.stock_name + '</td>'+
                            '<td class="cell-left">'+ typeStr2 + typeStr1 +'</td>'+
                            '<td class="cell-right" style="max-width:190px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="'+ priceStr +'">'+ priceStr +'</td>'+
                            '<td class="cell-right">'+ tmpInsVolume +'</td>'+
                            '<td class="cell-right">'+ tmpInsAmount +'</td></tr>');
                    });

                    var confirmHtml = '<table class="custom_confirm"><tbody style="width:100%;display: inline-table;"><tr><th class="cell-left">证券</th>'+
                        '<th class="cell-left">交易方向</th>'+
                        '<th class="cell-right">指令价格</th>'+
                        '<th class="cell-right">交易数量(股)</th>'+
                        '<th class="cell-right">交易金额(元)</th></tr>'+htmlArr.join('')+'</tbody></table>'+
                        '<div class="custom_total"><span style="color:#999999;font-size:13px;">总计</span><span>'+totalVolume+'</span><span>'+totalAmount+'</span></div>';
                    if (0 == is_trade_day) {//0是休市时间，也就是非交易日或者是交易日的15点之后 1为非休市时间
                        confirmHtml += '<div style="color:#F44336;font-size: 14px;padding-bottom: 3px;">*当前为休市时间，指令将提交至下一交易日</div>'
                    }
                    // var section = me.closest('.multi-stocks-section');
                    // var checked_rows = section.find('input.check-row:checked').closest('tr');
                    // debugger;
                    $.confirm({
                        title: '指令确认 <span style="margin-left:10px;font-size: 14px;font-weight: normal;">策略：'+ $('.product-detail').getCoreData().name +'</span>',
                        content: confirmHtml,
                        closeIcon: true,
                        confirmButton: '确定',
                        cancelButton: false,
                        confirm: function(){
                            if($.isLoading()){return;}
                            btn.addClass('loading');
                            $.startLoading('正在提交批量下单...');
                            $.post(url,{multi:orders}).done(function(res){
                                if(res.code==0){
                                    reportResult(res);
                                    $(window).trigger({type:'add_multi_hand_order:success',res:res});
                                    $(window).trigger({type:'position_update_updated'});
                                }else{
                                    $.failNotice(url,res);
                                }
                            }).fail($.failNotice.bind(null,url)).always(function(){
                                $.clearLoading();
                                btn.removeClass('loading');
                            });
                        }
                    });
                }else{
                    $.omsAlert('选中股票中暂无可交易股票！',false);
                }
            }
        });

        function checkRowsOk(){
            var orders = [];
            var section = me.closest('.multi-stocks-section');
            var checked_rows = section.find('input.check-row:checked').closest('tr');
            var error_rows = checked_rows.filter('.error');

            if(error_rows.length){
                var first_error_row = error_rows.eq(0);
                var error_stock = first_error_row.getCoreData();
                $.omsAlert(error_stock.stock_id + first_error_row.find('.error-msg').text().replace('该股票',''),false);
                return false;
            }

            var all_input_ok = true;
            checked_rows.each(function(){
                var row = $(this);
                var stock = row.getCoreData();
                var volume = +row.find('[name=volume]').val()||0;
                if( direction=='buy' && volume%100!=0 ){
                    $.omsAlert(stock.stock_id+' 买入数量不是100股的整数倍！',false);
                    return (all_input_ok=false);
                }
                if( direction=='sell' && volume%100!=0 && $.pullValue(stock,'enable_sell_volume',0)!= volume ){
                    $.omsAlert(stock.stock_id+' 卖出数量只能100股的整数倍，或者全部卖出！',false);
                    return (all_input_ok=false);
                }
            });

            if(!all_input_ok){return all_input_ok;}

            if( +section.find('.range-input').attr('value')>1 ){
                $.omsAlert(direction=='buy' ? '超过可用资金消耗100%，无法完成交易！' : '卖出股票超出可卖总量！',false);
                return false;
            }

            return true;
        }

        function getOrders(){
            var orders = [];
            var section = me.closest('.multi-stocks-section');
            var checked_rows = section.find('input.check-row:checked').closest('tr');

            checked_rows.each(function(){
                var row = $(this);
                var stock = row.getCoreData();
                var limit = row.find('[name=trade_mode].limit').is(':checked');
                var price = limit ? row.find('[name=price]').val() : stock.use_price;
                var volume = row.find('[name=volume]').val();
                var stock_name = row.find('[data-src="stock_info.stock_name"]').html();

                (+price||0) && (+volume||0) && orders.push({
                    stock_id: stock.stock_id,
                    stock_name: stock_name,
                    price: price,
                    volume: volume,
                    trade_direction: direction=='buy' ? "{{OMSWorkflowEntrustService::ORDER_DIRECTION_BUY}}":"{{OMSWorkflowEntrustService::ORDER_DIRECTION_SELL}}",
                    trade_mode: limit ? "{{OMSWorkflowEntrustService::ORDER_MODEL_LIMIT_PRICE}}":"{{OMSWorkflowEntrustService::ORDER_MODEL_MARKET_PRICE}}"
                });
            });
            return orders;
        }

        function reportResult(res){
            var result = $.pullValue(res,'data');
            var filter_res = {success:[],fail:[]};
            for(var stock_id in result){
                if( result.hasOwnProperty(stock_id) ){
                    $.extend(result[stock_id],{stock_id:stock_id});
                    filter_res[ result[stock_id].code==0 ? 'success' : 'fail' ].push( result[stock_id] );
                }
            }

            mergeBriefStocksInfo(
                filter_res.success.concat(filter_res.fail)
            ).then(function(){
                var msg = $('<div>').html(
                    filter_res.success.map(function(stock){
                        return '<div style="font-size:bold;"><h2>'+stock.stock_id+' '+stock.stock_info.stock_name+' 下单成功！</h2></div>';
                    }).concat(filter_res.fail.map(function(stock){
                        return '<div style="color:red;font-size:bold;"><h2>'+stock.stock_id+' '+stock.stock_info.stock_name+' 下单失败！</h2>'+stock.msg+'</div>';
                    })).join('')
                );
                $.gmfConfirm('批量下单结果',msg);
            });
        }
    }).call(document.scripts[document.scripts.length-1].parentNode);
    </script>
</div>
