<!--
单产品多股票提交
trigger:
add_multi_hand_order:success //订单提交成功，触发其他页面的刷新
position_update_updated //订单提交后，需要触发刷新

on:
multi_products:head:updated:checked_one //得到单产品的数据
 -->
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
        var market = 'marketA';
        var product;

        // 切换市场时，重新获取自选股数据
        $(window).on('order_create:market:changed', function(event){
            market = event.market;
        })

        $(window).on('multi_products:head:updated:checked_one',function(event){
            product = event.product;
        });
        me.on('click','.oms-btn:not(.disabled)',function(){
            var btn = $(this);
            var url = (window.REQUEST_PREFIX||'')+'/oms/workflow/'+product.id+'/add_multi_hand_order';
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
                        // var trade_market = 1;
                        var typeStr1 = '';
                        if (1 == ins_type) {
                            typeStr1 = '<span style="color:#F44336;">买入</span>';
                        }else if(2 == ins_type){
                            typeStr1 = '<span style="color:#2196F3">卖出</span>';
                        }

                        var ins_model = e.trade_mode;//限价、市价，市价时，价格切记传空
                        var typeStr2 = '';
                        if ('marketA' == market) {
                            if (1 == ins_model) {
                                typeStr2 = '限价';
                                if (0 == ins_price) {
                                    ins_model = utils.stock_custom.getMarketType(e.stock_id.match(/[a-zA-Z]+/));
                                    e.trade_mode = ins_model;
                                    typeStr2 = '市价';
                                }
                            }else if(2 == ins_model){
                                // ins_price = 0;
                                ins_model = utils.stock_custom.getMarketType(e.stock_id.match(/[a-zA-Z]+/));
                                e.trade_mode = ins_model;
                                typeStr2 = '市价';
                            }
                            e.market = 1;
                        }else if('marketH' == market){
                            // trade_market = 2;
                            e.trade_mode = e.marketH_trade_mode;
                            if (e.trade_mode == 5) {
                                typeStr2 = '增强限价'
                            }else if(e.trade_mode == 4){
                                typeStr2 = '竞价限价'
                            }
                            e.market = 2;
                        }
                        

                        var tmpInsVolume = e.volume;
                        var tmpInsAmount = Number((10000 * ins_price).toFixed(2)) * tmpInsVolume / 10000;
                        totalAmount = (parseFloat(totalAmount)*10000 + parseFloat(tmpInsAmount)*10000) / 10000;
                        totalVolume = parseFloat(totalVolume) + parseFloat(tmpInsVolume);
                        var priceStr = (('市价' == typeStr2)?utils.common.getData(PRICE_TYPE_LIST, ins_model):ins_price);
                        htmlArr.push('<tr style="border-bottom: 1px solid #E2E2E2;"><td class="cell-left">'+ e.stock_id + ' ' + e.stock_name + '</td>'+
                            '<td class="cell-left">'+ typeStr1 +'</td>'+
                            '<td class="cell-left">'+ typeStr2 +'</td>'+
                            '<td class="cell-right" style="max-width:190px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="'+ priceStr +'">'+ priceStr +'</td>'+
                            '<td class="cell-right">'+ tmpInsVolume +'</td>'+
                            '<td class="cell-right">'+ tmpInsAmount +'</td></tr>');
                    });

                    var confirmHtml = '<table class="custom_confirm"><tbody style="width:100%;display: inline-table;"><tr><th class="cell-left">证券</th>'+
                        '<th class="cell-left">买卖标志</th>'+
                        '<th class="cell-left">报价方式</th>'+
                        '<th class="cell-right">指令价格</th>'+
                        '<th class="cell-right">交易数量(股)</th>'+
                        '<th class="cell-right">交易金额(元)</th></tr>'+htmlArr.join('')+'</tbody></table>'+
                        '<div class="custom_total"><span style="color:#999999;font-size:13px;">总计</span><span>'+totalVolume+'</span><span>'+totalAmount+'</span></div>';
                    if (0 == is_trade_day) {//0是休市时间，也就是非交易日或者是交易日的15点之后 1为非休市时间
                        confirmHtml += '<div style="color:#F44336;font-size: 14px;padding-bottom: 3px;">*当前为休市时间，指令将提交至下一交易日</div>'
                    }
                    // var section = me.closest('.multi-stocks-section');
                    // var checked_rows = section.find('input.check-row:checked').closest('tr');

                    $.confirm({
                        title: '委托确认 <span style="margin-left:10px;font-size: 14px;font-weight: normal;">策略：'+ $('.multi-product-head').find('input[type="checkbox"]:checked').siblings('span[data-src="name"]').html() +'</span>',
                        content: confirmHtml,
                        closeIcon: true,
                        confirmButton: '确定',
                        cancelButton: false,
                        confirm: function(){
                            if($.isLoading()){return;}
                            $.startLoading('正在提交订单...');

                            $.post(url,{multi:orders}).done(function(res){
                                // if(res.code==0){
                                    reportResult(res,orders,product);
                                    $(window).trigger({type:'add_multi_hand_order:success',res:res});
                                    $(window).trigger({type:'position_update_updated'});
                                // }else{
                                //     $.failNotice(url,res);
                                // }
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
                var trading_unit = 100;
                if (stock.stock_info && stock.stock_info.trading_unit) {
                    trading_unit = stock.stock_info.trading_unit;
                }
                var volume = +row.find('[name=volume]').val()||0;
                if( direction=='buy' && volume%trading_unit!=0 ){
                    $.omsAlert(stock.stock_id+' 买入数量必须是'+trading_unit+'股的整数倍！',false);
                    return (all_input_ok=false);
                }
                if( direction=='sell' && volume%trading_unit!=0 && $.pullValue(stock,'enable_sell_volume',0)!= volume ){
                    $.omsAlert(stock.stock_id+' 卖出数量只能'+trading_unit+'股的整数倍，或者全部卖出！',false);
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
                if ('marketA' == market) {
                    var row = $(this);
                    var stock = row.getCoreData();
                    var limit = row.find('[name=trade_mode].limit').is(':checked');
                    var price = limit ? row.find('[name=price]').val() : stock.use_price;
                    if(stock.stock_info.asset_class == 0){
                        price = (+price).toFixed(2);
                    }else{
                        price = (+price).toFixed(3);
                    }
                    var volume = row.find('[name=volume]').val();
                    var stock_name = row.find('[data-src="stock_info.stock_name"]').html();
                    var marketH_trade_mode = row.find('[name=marketH_trade_mode]').val();

                    (+price||0) && (+volume||0) && orders.push({
                        stock_id: stock.stock_id,
                        stock_name: stock_name,
                        price: price,
                        volume: volume,
                        trade_direction: direction=='buy' ? "{{OMSWorkflowEntrustService::ORDER_DIRECTION_BUY}}":"{{OMSWorkflowEntrustService::ORDER_DIRECTION_SELL}}",
                        trade_mode: limit ? "{{OMSWorkflowEntrustService::ORDER_MODEL_LIMIT_PRICE}}":"{{OMSWorkflowEntrustService::ORDER_MODEL_MARKET_PRICE}}",
                        marketH_trade_mode: marketH_trade_mode
                    });
                }else if('marketH' == market){
                    var row = $(this);
                    var stock = row.getCoreData();
                    var limit = true;
                    var price = row.find('[name=marketH_price]').val();
                    price = (+price).toFixed(3);
                    var volume = row.find('[name=volume]').val();
                    var stock_name = row.find('[data-src="stock_info.stock_name"]').html();
                    var marketH_trade_mode = row.find('[name=marketH_trade_mode]').val();

                    (+price||0) && (+volume||0) && orders.push({
                        stock_id: stock.stock_id,
                        stock_name: stock_name,
                        price: price,
                        volume: volume,
                        trade_direction: direction=='buy' ? "{{OMSWorkflowEntrustService::ORDER_DIRECTION_BUY}}":"{{OMSWorkflowEntrustService::ORDER_DIRECTION_SELL}}",
                        trade_mode: row.find('[name=marketH_trade_mode]').val(),
                        marketH_trade_mode: marketH_trade_mode
                    });
                }
            });
            return orders;
        }

        function reportResult(res,orders,product){
                        //模拟数据
            // res ={"code":0,
            //         "msg":"",
            //         "data":{
            //          "000001.SZ":{
            //             "code": 5022111,
            //             "msg": "hello,workd",
            //             "data": {
            //                 "msg": [
            //                     "已触发风控:0329股票池禁止买入",
            //                     "已触发风控(公司):0329股票池禁止买入"
            //                 ],
            //                 "limit_action": 1
            //             }
            //         }}
            //     }
            let str_deal_method ;
            if(direction == "buy"){
                str_deal_method="买入"
            }
            if(direction == "sell"){
                str_deal_method="卖出"
            }
            orders.forEach(function(row) {
                if (res.code == 0) {
                    row.btnType = false;
                    row.msg = ["委托成功"];
                    row.entrustStatus = "pass";
                    row.style = {}
                } else if(res.code == 700001){
                    if (res.data[row.stock_id]) {
                        let temp = res.data[row.stock_id];
                        if (temp.code == 0) {
                            //没问题
                            row.btnType = false;
                            row.msg = ["委托成功"];
                            row.entrustStatus = "pass";
                            row.style = {}
                        } else if (temp.code == 5022111) {
                            //提示性风控
                            if (temp.msg == "") {
                                if (temp.data.limit_action == 0) {
                                    //alert
                                    row.btnType = true;
                                    row.msg = temp.data.msg;
                                    row.entrustStatus = "alert";
                                    row.style = {
                                      color: "#FAA11F"
                                    }
                                } else {
                                    //购买失败
                                    row.btnType = false;
                                    row.entrustStatus = "fail";
                                    row.style = {
                                      color: "red"
                                    }
                                    if (temp.msg == "") {
                                        row.msg = temp.data.msg;
                                    } else {
                                        row.msg = [temp.msg];
                                    }
                                    row.msg.unshift("委托失败");
                                }
                            } else {
                                //购买失败
                                row.btnType = false;
                                row.entrustStatus = "fail";
                                row.style = {
                                    color: "red"
                                }
                                if (temp.msg == "") {
                                    row.msg = []
                                } else {
                                    row.msg = [temp.msg];
                                }
                                row.msg.unshift("委托失败");
                            }
                        }else if(temp.code == 5022110){
                            row.btnType = false;
                            row.msg = [temp.msg];
                            row.msg.unshift("委托失败");
                            row.entrustStatus = "fail";
                            row.style = {
                                color: "red"
                            }
                        } else {
                            //禁止性风控
                            row.btnType = false;
                            if(temp.msg && temp.msg !=""){
                                row.msg = [temp.msg];
                            }else if(temp.data.msg){
                                row.msg = temp.data.msg;
                            }else{
                                row.msg = []
                            }
                            row.msg.unshift("委托失败");
                            row.entrustStatus = "fail";
                            row.style = {
                                color: "red"
                            }
                        }
                    } else {
                        row.btnType = false;
                        row.entrustStatus = "pass";
                        row.msg = ["委托成功"];
                        row.style = {};
                    }
                }else {
                    //购买失败
                    row.btnType = false;
                    row.entrustStatus = "fail";
                    row.style = {
                        color: "red"
                    }
                    if (res.msg == "") {
                        row.msg = [];
                    } else {
                        row.msg = [res.msg];
                    }
                    row.msg.unshift("委托失败");
                }
            })
            let contentChild = Vue.extend({
                data() {
                  return {
                    tableData: orders,
                    product:product
                  }
                },
                template: `
                  <div style="position:relative">
                  <span style="position: absolute;top: -36px;left: 91px;font-size:12px;">产品账户：@{{product.name}}</span>
                  <div class="vue-form-confirmation">
                      <table style="max-width: 600px;">
                          <thead>
                              <tr style="border-bottom: 1px solid rgba(0,0,0,0.05);">
                                  <th class="vue-form-confirmation__text-align-left" style="color:rgba(74,74,74,0.5);">证券</th>
                                  <th class="vue-form-confirmation__text-align-left" style="color:rgba(74,74,74,0.5);">`+str_deal_method+`价格</th>
                                  <th class="vue-form-confirmation__text-align-left" style="color:rgba(74,74,74,0.5);">`+str_deal_method+`数量</th>
                                  <th class="vue-form-confirmation__text-align-left" style="color:rgba(74,74,74,0.5);">备注</th>

                              </tr>
                          </thead>
                          <tbody>
                              <tr  v-for="row in tableData" style="border-bottom: 1px solid rgba(0,0,0,0.05);">
                                  <td class="vue-form-confirmation__text-align-left">@{{row.stock_name}}</td>
                                  <td class="vue-form-confirmation__text-align-left">@{{row.price}}</td>
                                  <td class="vue-form-confirmation__text-align-left">@{{row.volume}}</td>
                                  <td class="vue-form-confirmation__text-align-left vue-form-confirmation__span-center" >
                                      <div>
                                          <span :style=row.style>
                                              <template v-for="msg in row.msg">
                                                  @{{msg}}</br>
                                              </template>
                                          </span>  
                                          <button type="" v-if="row.btnType" @click=btn_submit(row)>继续委托</button>
                                      </div>

                                  </td>
                              </tr>
                          </tbody>
                      </table>
                    </div>
                    </div>
                  `,
                methods: {
                  btn_submit(row) {
                    //忽略提示性风控 继续购买
                    let _this = this;
                    let orders = [row]
                    var url = (window.REQUEST_PREFIX || '') + '/oms/workflow/' + product.id + '/add_multi_hand_order';
                    $.post(url, {
                      multi: orders,
                      ignore_tips:1,
                    }).done(function(res) {
                      if (res.code != 0) {
                        if (res.data == '') {
                          row.btnType = false;
                          row.entrustStatus = "pass";
                          row.msg = [];
                          row.msg.unshift('委托成功');
                          row.style = {

                          }
                        } else {
                          var tmpObj = res.data[row.stock_id];
                          if (0 == tmpObj.code) {
                            row.btnType = false;
                            row.entrustStatus = "pass";
                            row.msg = [];
                            row.msg.unshift('委托成功');
                            row.style = {

                            }
                          } else {
                            row.btnType = false;
                            row.entrustStatus = "fail";
                            row.msg = [];
                            row.msg.unshift(tmpObj.msg);
                            row.msg.unshift('委托失败');
                            row.style = {
                              color: "red"
                            }
                          }
                        }
                      } else {
                          row.btnType = false;
                          row.entrustStatus = "pass";
                          row.msg = [];
                          row.msg.unshift('委托成功');
                          row.style = {};
                      }
                      _this.tableData = Object.assign({}, _this.tableData)
                    }).fail(function() {
                      row.btnType = false;
                      row.msg = ["委托失败"];
                      row.entrustStatus = "fail";
                      row.style = {
                        color: "red"
                      }
                      _this.tableData = Object.assign({}, _this.tableData)

                    });
                  },
                },
                mounted() {
                  $.clearLoading();
                }
            });
            Vue.prototype.$confirm({
                title: '委托结果',
                content: contentChild,
                closeIcon: true,
            });
        }
    }).call(document.scripts[document.scripts.length-1].parentNode);
    </script>
</div>
