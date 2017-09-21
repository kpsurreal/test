<style type="text/css">
  .section-panel-trade-preview{
    width: auto;height:225px;
    /*overflow:hidden;overflow-x:visible;*/
    /*overflow:visible;*/
  }
  .trade-preview-div{
/*    height:180px;
    overflow-x:visible;
    overflow-y:auto;*/
    /* 以下是overflow不可用的一个hack */
/*    padding-left: 200px;
    margin-left: -200px;*/
    /*overflow:visible;*/

  }
  .trade-preview-div>table{
    width: 100%;
  }
</style>
<div id="trade_preview">
	
</div>

<script type="text/javascript">
  var orginfo_theme = window.LOGIN_INFO.org_info.theme;//机构版／专户版枚举值 专户版为3，机构版为非3.
  var trade_preview = new Vue({
    el: '#trade_preview',
    template: `
      <div v-show="visibility" class="section-panel section-panel-trade-preview" style="flex:1;">
        <div class="trade-preview-div">
          <template v-if="asset_class == 0 || 1 == asset_class">
            <table class="oms-preview-table loading-loading nothing-nothing">
              <thead>
                <tr class="hd">
                  <th class="oms-preview-table__content--left oms-preview-table__max-width-130">@{{3 == orginfo_theme ? '账户名称' : '交易单元'}}</th>
                  <th class="oms-preview-table__content--right">本次委托</th>
                  <th class="oms-preview-table__content--right">当前挂单</th>
                  <th v-show="'position_ratio' == trade_number_method" class="oms-preview-table__content--right">缺口数量</th>
                  <th class="oms-preview-table__content--right">当前仓位(个股)</th>
                  <th class="oms-preview-table__content--right">目标仓位(个股)</th>
                </tr>
              </thead>
              <tbody class="loading-hide">
                <tr v-for="row in display_arr">
                  <td class="oms-preview-table__content--left oms-preview-table__max-width-130" v-text="row.name"></td>
                  <td class="oms-preview-table__content--right">
                    <span v-if="0 != row.show_entrust_volume" v-bind:class="'buy' == buy_or_sell ? 'buy-color' : 'sell-color'">@{{'buy' == buy_or_sell ? '+' : '-'}}</span>
                    @{{row.show_entrust_volume}}
                    <prompt-language v-if="!row.pass_risk_check" style="width: 15px;display: inline-block;left: 0;" :language_val="row.risk_msg"></prompt-language>
                  </td>
                  <td class="oms-preview-table__content--right">
                    @{{row.entrusted_volume}}
                  </td>
                  <td v-show="'position_ratio' == trade_number_method" class="oms-preview-table__content--right">
                    @{{row.gap_amount}}
                  </td>
                  <td class="oms-preview-table__content--right" v-text="numeralNumber(row.cur_amount, 0) + '/' + numeralPercent(row.cur_position)"></td>
                  <td class="oms-preview-table__content--right" v-text="numeralNumber(row.dst_amount, 0) + '/' + numeralPercent(row.dst_position)"></td>
                </tr>
              </tbody>
                <thead>
                  <tr>
                    <td class="oms-preview-table__content--left oms-preview-table__max-width-130">汇总</td>
                    <td class="oms-preview-table__content--right">
                      <span v-if="0 != gather_info.show_entrust_volume" v-bind:class="'buy' == buy_or_sell ? 'buy-color' : 'sell-color'">@{{'buy' == buy_or_sell ? '+' : '-'}}</span>
                      @{{gather_info.show_entrust_volume}}
                    </td>
                    <td class="oms-preview-table__content--right" v-text="gather_info.entrusted_volume"></td>
                    <td v-show="'position_ratio' == trade_number_method" class="oms-preview-table__content--right" v-text="gather_info.total_gap"></td>
                    <td class="oms-preview-table__content--right" v-text="numeralNumber(gather_info.cur_amount, 0) + '/' + numeralPercent(gather_info.cur_position)"></td>
                    <td class="oms-preview-table__content--right" v-text="numeralNumber(gather_info.dst_amount, 0) + '/' + numeralPercent(gather_info.dst_position)"></td>
                  </tr>
                </thead> 
            </table>
          </template>
          <template v-if="asset_class == 2">
            <table class="oms-preview-table loading-loading nothing-nothing">
              <thead>
                <tr class="hd">
                  <th class="oms-preview-table__content--left oms-preview-table__max-width-130">@{{3 == orginfo_theme ? '账户名称' : '交易单元'}}</th>
                  <th class="oms-preview-table__content--right">最大可卖(张)</th>
                  <th class="oms-preview-table__content--right">本次委卖(张)</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in display_arr">
                  <td class="oms-preview-table__content--left" v-text="row.name"></td>
                  <td class="oms-preview-table__content--right">@{{row.estimate_entrust_volume}}</td>
                  <td class="oms-preview-table__content--right"><input type="text" v-model="row.show_entrust_volume"/></td> 
                </tr>
              </tbody class="oms-preview-tbody_national">
              <thead>
                <tr>
                  <td class="oms-preview-table__content--left oms-preview-table__max-width-130">汇总</td>
                  <td class="oms-preview-table__content--right">@{{gather_info.estimate_entrust_volume}}</td>
                  <td class="oms-preview-table__content--right">@{{get_total_entrust_volume()}}</td>
                </tr>
              </thead>
            </table>
          </template>
          <template v-if="asset_class == 'new'">
            <table class="oms-preview-table loading-loading nothing-nothing">
              <thead>
                <tr class="hd">
                  <th class="oms-preview-table__content--left oms-preview-table__max-width-130">@{{3 == orginfo_theme ? '账户名称' : '交易单元'}}</th>
                  <th class="oms-preview-table__content--right">申购上限</th>
                  <th class="oms-preview-table__content--right">本次申购</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in display_arr">
                  <td class="oms-preview-table__content--left" v-text="row.name"></td>
                  <td class="oms-preview-table__content--right">@{{row.estimate_entrust_volume}}</td>
                  <td class="oms-preview-table__content--right"><input type="text" v-model="row.show_entrust_volume"/></td>
                </tr>
              </tbody class="oms-preview-tbody_national">
              <thead>
                <tr>
                  <td class="oms-preview-table__content--left oms-preview-table__max-width-130">汇总</td>
                  <td class="oms-preview-table__content--right">@{{gather_info.estimate_entrust_volume}}</td>
                  <td class="oms-preview-table__content--right">@{{get_total_entrust_volume()}}</td>
                </tr>
              </thead>
            </table>
          </template>
        </div>
      </div>
    `,
    data: {
      orginfo_theme: orginfo_theme,
      trading_unit: '100',
      pass_risk_check: true, // 判断是否通过风控，但凡有一行没通过，就为false
      // 产品列表预算后通过事件传过来的数据。
      detail_arr: [],
      trade_number_method: '',
      trade_direction: '',
      buy_or_sell: '',
      visibility: false, //false,
      asset_class:0,//股票种类   0: 股票, 含沪深/港股/沪港通/深港通    1: 基金    2: 国债逆回购    3: 指数
      display_arr:[],
      gather_info:[],
      my_detail_arr:'',
      timer:''

    },
    computed: {

    },
    methods: {
      display_title: function(){
        if ('sell' == this.buy_or_sell) {
          return '卖出';
        }else if('buy' == this.buy_or_sell){
          return '买入';
        }
      },
      numeralNumber: function(arg, num){
        if ('--' == arg || '' === arg || undefined == arg) {
          return '--'
        }
        if (undefined != num) {
          var str = '0.'
          for (let i = num - 1; i >= 0; i--) {
            str += '0';
          }
          if(0 == num){
            str = '0';
          }
          return numeral(arg).format( '0,' + str );
        }
        return numeral(arg).format( '0,0.00' );
      },
      numeralPercent: function(arg){
        if (!isFinite(arg)) {
          return arg;
        }
        return numeral(arg).format( '0.00%' );
      },
      get_total_entrust_volume(){
        let total = 0;
        this.display_arr.forEach(function(e){
          total += parseInt(e.show_entrust_volume || 0)
        })
        return total;
      },
    },
    watch:{
      detail_arr(val){
        // JSON.PAR
        if(JSON.stringify(val) == JSON.stringify(this.my_detail_arr)){
          return
        }else{
          this.my_detail_arr = val;
        }
      },
      my_detail_arr(){
        var _this = this;
        this.pass_risk_check = true;
        this.display_arr = (function(){
          
          var rtn = [];
          var req_total_amount = 0;
          var total_gap = 0;
          // 0为股票 1为基金
          if(_this.asset_class == 0 || 1 == _this.asset_class){
            _this.detail_arr.forEach(function(e){
              var obj = {};
              obj.riskObj = e.riskObj;
              obj.product_id = e.risk_limit_check_request.product_id;
              obj.risk_limit_check_response = e.risk_limit_check_response;
              obj.risk_limit_check_request = e.risk_limit_check_request;
              obj.runtime = e.runtime;
              // 通过风控数量
              obj.volume_after_check = e.risk_limit_check_response.data.max_volume;
              obj.volume_after_check = Math.min(obj.volume_after_check, e.riskObj.freeNum);
              obj.volume_after_check = Math.max(obj.volume_after_check, 0);
              // 持仓价格
              // obj.cost_price = e.cost_price;
              obj.name =  e.name;
              // 当前最新价格
              obj.latest_price = e.risk_limit_check_response.data.latest_price;
              // 当前持仓数量
              obj.cur_amount = e.total_amount;
              // 当前持仓比例
              obj.cur_position = e.weight;
              // 资产总值
              obj.total_assets = e.runtime.total_assets || 0;
              // 下单价格
              obj.request_price = e.risk_limit_check_request.price;
              // 委托数量
              req_total_amount = e.risk_limit_check_request.cur_volume;
              // 挂单数量
              obj.entrusted_volume = 0;
              // 已经委托的数量
              if ('buy' == e.risk_limit_check_request.buy_or_sell) {
                obj.entrusted_volume = e.entrust_buy_num;
                if (2 == e.risk_limit_check_request.trade_mode) {
                  obj.request_price = e.risk_limit_check_request.stop_top_price;
                }
              }else{
                obj.entrusted_volume = e.entrust_sell_num;
                if (2 == e.risk_limit_check_request.trade_mode) {
                  obj.request_price = e.risk_limit_check_request.stop_down_price;
                }
              }
              
              if ("volume" == e.risk_limit_check_request.trade_number_method) {
                // 按数量
                if ('buy' == e.risk_limit_check_request.buy_or_sell) {
                  // 限价买入时，目标数量就是两者相加 当前持仓+比例计算的数量／直接数量+委托的数量
                  obj.dst_amount = parseFloat(e.total_amount) + parseFloat(e.risk_limit_check_request.volume) + parseFloat(obj.entrusted_volume);
                  obj.dst_total_money = (obj.latest_price * (parseFloat(e.total_amount) + parseFloat(obj.entrusted_volume)) + obj.request_price * parseFloat(e.risk_limit_check_request.volume))
                  if (0 == obj.total_assets) {
                    obj.dst_position = 0;
                  }else{
                    obj.dst_position = obj.dst_total_money / obj.total_assets;
                  }
                }else{
                  // 限价卖出时，目标数量就是两者相减
                  obj.dst_amount = parseFloat(e.total_amount) - parseFloat(e.risk_limit_check_request.volume) - parseFloat(obj.entrusted_volume);
                  if (obj.dst_amount > 0) {
                    obj.dst_amount = parseFloat(e.total_amount) - Math.floor(parseFloat(e.risk_limit_check_request.volume) / _this.trading_unit) * _this.trading_unit - parseFloat(obj.entrusted_volume);
                  }else{
                    obj.dst_amount = 0;
                  }
                  // obj.dst_total_money = obj.total_assets - obj.latest_price * parseFloat(e.risk_limit_check_request.volume) - obj.latest_price * parseFloat(obj.entrusted_volume);
                  obj.dst_total_money = obj.latest_price * obj.cur_amount - obj.latest_price * parseFloat(e.risk_limit_check_request.volume) - obj.latest_price * parseFloat(obj.entrusted_volume);
                  if (0 == obj.total_assets) {
                    obj.dst_position = 0;
                  }else{
                    // obj.dst_position = obj.request_price * obj.dst_amount / obj.total_assets;
                    obj.dst_position = obj.dst_total_money / obj.total_assets;
                  }
                }
              }else if('assets_ratio' == e.risk_limit_check_request.trade_number_method){
                // 按总资产比例
                if ('buy' == e.risk_limit_check_request.buy_or_sell) {
                  var tmp_amount = Math.floor(parseFloat(e.risk_limit_check_request.dst_assets) / 100 * obj.total_assets / obj.request_price / _this.trading_unit) * _this.trading_unit;
                  obj.dst_amount = parseFloat(e.total_amount) + tmp_amount + parseFloat(obj.entrusted_volume);
                  obj.dst_total_money = (obj.latest_price * (parseFloat(e.total_amount) + parseFloat(obj.entrusted_volume)) + obj.request_price * tmp_amount);
                  if (0 == obj.total_assets) {
                    obj.dst_position = 0;
                  }else{
                    // obj.dst_position = e.risk_limit_check_request.price * obj.dst_amount / obj.total_assets;
                    obj.dst_position = obj.dst_total_money / obj.total_assets;
                  }
                }else{
                  var tmp_amount = Math.floor(parseFloat(e.risk_limit_check_request.dst_assets) / 100 * obj.total_assets / obj.request_price / _this.trading_unit) * _this.trading_unit;
                  obj.dst_amount = parseFloat(e.total_amount) + tmp_amount + parseFloat(obj.entrusted_volume);
                  obj.dst_total_money = (obj.latest_price * (parseFloat(e.total_amount) - parseFloat(obj.entrusted_volume)) - obj.latest_price * tmp_amount);
                  if (0 == obj.total_assets) {
                    obj.dst_position = 0;
                  }else{
                    // obj.dst_position = e.risk_limit_check_request.price * obj.dst_amount / obj.total_assets;
                    obj.dst_position = obj.dst_total_money / obj.total_assets;
                  }
                }
              }else if('position_ratio' == e.risk_limit_check_request.trade_number_method){
                // 按目标持仓
                if ('buy' == e.risk_limit_check_request.buy_or_sell) {
                  var tmp_amount = Math.floor(parseFloat(e.risk_limit_check_request.dst_position) / 100 * obj.total_assets / obj.request_price / _this.trading_unit) * _this.trading_unit;
                  obj.dst_amount = tmp_amount;
                  obj.dst_total_money = (obj.latest_price * obj.dst_amount);
                  if (0 == obj.total_assets) {
                    obj.dst_position = 0;
                  }else{
                    obj.dst_position = obj.dst_total_money / obj.total_assets;
                  }
                }else{
                  var tmp_amount = Math.floor(parseFloat(e.risk_limit_check_request.dst_position) / 100 * obj.total_assets / obj.request_price / _this.trading_unit) * _this.trading_unit;
                  obj.dst_amount = tmp_amount;
                  obj.dst_total_money = (obj.latest_price * obj.dst_amount);
                  if (0 == obj.total_assets) {
                    obj.dst_position = 0;
                  }else{
                    obj.dst_position = obj.dst_total_money / obj.total_assets;
                  }
                }
              }else if('cur_position_ratio' == e.risk_limit_check_request.trade_number_method){
                // 按持仓比例
                if ('buy' == e.risk_limit_check_request.buy_or_sell) {
                  var tmp_amount = Math.floor(parseFloat(e.risk_limit_check_request.cur_position_ratio) / 100 * e.total_amount / _this.trading_unit) * _this.trading_unit;
                  obj.dst_amount = parseFloat(e.total_amount) + tmp_amount + parseFloat(obj.entrusted_volume);
                  obj.dst_total_money = obj.latest_price * parseFloat(e.total_amount) + obj.request_price * tmp_amount + obj.latest_price * parseFloat(obj.entrusted_volume);
                  if (0 == obj.total_assets) {
                    obj.dst_position = 0;
                  }else{
                    obj.dst_position = obj.dst_total_money / obj.total_assets;
                  }
                }else{
                  var tmp_amount = Math.floor(parseFloat(e.risk_limit_check_request.cur_position_ratio) / 100 * e.total_amount / _this.trading_unit) * _this.trading_unit;
                  obj.dst_amount = parseFloat(e.total_amount) - tmp_amount - parseFloat(obj.entrusted_volume);
                  obj.dst_total_money = obj.latest_price * parseFloat(e.total_amount) - obj.request_price * tmp_amount - obj.latest_price * parseFloat(obj.entrusted_volume);
                  if (0 == obj.total_assets) {
                    obj.dst_position = 0;
                  }else{
                    obj.dst_position = obj.dst_total_money / obj.total_assets;
                  }
                }
              }
              // }else{

              //   if ('buy' == e.risk_limit_check_request.buy_or_sell) {
              //     // 限价买入时，
              //     // 因为碎股而去除floor方法
              //     // obj.dst_amount = parseFloat(obj.volume_after_check) + parseFloat(e.total_amount) + parseFloat(obj.entrusted_volume);
              //     obj.dst_amount = parseFloat(e.total_amount) + parseFloat(obj.volume_after_check) + parseFloat(obj.entrusted_volume);
              //     if (0 == obj.total_assets) {
              //       obj.dst_position = 0;
              //     }else{
              //       obj.dst_position = e.risk_limit_check_request.price * obj.dst_amount / obj.total_assets;
              //     }
              //   }else{
              //     // 限价卖出时，目标数量就是两者相减position_sell_num
              //     obj.dst_amount = parseFloat(e.total_amount) - parseFloat(e.risk_limit_check_response.data.position_sell_num) - parseFloat(obj.entrusted_volume);
              //     if (obj.dst_amount > 0) {
              //       obj.dst_amount = parseFloat(e.total_amount) - Math.floor(parseFloat(e.risk_limit_check_response.data.position_sell_num) / _this.trading_unit) * _this.trading_unit - parseFloat(obj.entrusted_volume);
              //     }else{
              //       obj.dst_amount = 0;
              //     }
              //     if (0 == obj.total_assets) {
              //       obj.dst_position = 0;
              //     }else{
              //       obj.dst_position = e.risk_limit_check_request.price * obj.dst_amount / obj.total_assets;
              //     }
              //   }
              // }
              obj.risk_msg = e.risk_limit_check_response.data.limit_msg;
              obj.risk_code = e.risk_limit_check_response.code;

              // 缺口数量： 按绝对数量交易时不该处理挂单数量，3.11版本后，只有按目标持仓需要该功能。
              if ('position_ratio' == e.risk_limit_check_request.trade_number_method) {
                if ('buy' == e.risk_limit_check_request.buy_or_sell) {
                  // obj.gap_amount = obj.volume_after_check;
                  obj.gap_amount = Math.floor(Math.max(obj.dst_amount - obj.cur_amount - obj.entrusted_volume, 0) / _this.trading_unit) * _this.trading_unit;
                  total_gap += obj.gap_amount;
                }else{
                  // obj.gap_amount = Math.min(Math.ceil(Math.max(obj.cur_amount - obj.dst_amount - obj.entrusted_volume, 0) / __this.trading_unit) * __this.trading_unit, e.risk_limit_check_response.data.sell_max_volume);
                  // 3.11 版本修改，不再计算出风控范围内的最大缺口数量，而是直接展示缺口数量
                  obj.gap_amount = Math.ceil(Math.max(obj.cur_amount - obj.dst_amount - obj.entrusted_volume, 0) / _this.trading_unit) * _this.trading_unit;
                  total_gap += obj.gap_amount;
                }
              }

              obj.trade_number_method = e.risk_limit_check_request.trade_number_method;
              obj.buy_or_sell = e.risk_limit_check_request.buy_or_sell;
              if ("volume" == obj.trade_number_method) {
                // 限价时 填充委托数量
                obj.entrust_volume = e.risk_limit_check_request.volume;
              }

              rtn.push(obj);
            });

            // var average = req_total_amount / total_gap;
            rtn.forEach(function(e){
              _this.trade_number_method = e.trade_number_method;
              _this.buy_or_sell = e.buy_or_sell;

              // 按目标仓位时，需要根据缺口数量计算，其他情况不需要
              if('position_ratio' == e.trade_number_method){
                // 调仓到时，平均分配委托数量
                if (0 == total_gap) {
                  e.show_entrust_volume = 0;
                }else{
                  // e.entrust_volume = Math.floor(req_total_amount * e.gap_amount / total_gap / this.trading_unit) * this.trading_unit;
                  e.show_entrust_volume = req_total_amount * e.gap_amount / total_gap;
                }
              }else{
                // e.show_entrust_volume = e.risk_limit_check_request.volume;
                if ('buy' == e.risk_limit_check_request.buy_or_sell) {
                  e.show_entrust_volume = e.dst_amount - e.cur_amount - e.entrusted_volume;
                }else{
                  e.show_entrust_volume = e.cur_amount - e.dst_amount - e.entrusted_volume;
                }
              }

              // // 本次委买数量，不再跟缺口数量比较了，而是直接取表单的数量进行计算
              // if ('volume' == e.trade_number_method) {
              //   e.show_entrust_volume = e.risk_limit_check_request.volume;
              //   if ('buy' == e.risk_limit_check_request.buy_or_sell) {
              //     // 限价买入时，目标数量就是两者相加
              //     e.dst_total_money = (e.cur_amount * e.risk_limit_check_response.data.latest_price + e.risk_limit_check_request.price * e.show_entrust_volume + e.risk_limit_check_response.data.entrust_buy_money);
              //     if (0 == obj.total_assets) {
              //       e.dst_position = 0;
              //     }else{
              //       e.dst_position = e.dst_total_money / obj.total_assets;
              //     }
              //   }else{
              //     // 限价卖出时，目标数量就是两者相减
              //     e.dst_total_money = e.dst_amount * e.risk_limit_check_response.data.latest_price;
              //     if (0 == obj.total_assets) {
              //       e.dst_position = 0;
              //     }else{
              //       e.dst_position = e.dst_amount * e.risk_limit_check_response.data.latest_price / obj.total_assets;
              //     }
              //   }
              // }else if('position_ratio' == e.trade_number_method){

              // }

              if (e.risk_code != 0) {
                e.pass_risk_check = false; // 未通过风控
                _this.pass_risk_check = false;
              }else{
                e.pass_risk_check = true;
              }

              // // 目标仓位数量 // 目标仓位比例 移动到了前面计算。
              // if ("volume" == e.risk_limit_check_request.trade_number_method) {
              //   // if ('buy' == e.risk_limit_check_request.buy_or_sell) {
              //   //   // 限价买入时，目标数量就是两者相加
              //   //   e.dst_total_money = (e.cur_amount * e.risk_limit_check_response.data.latest_price + e.risk_limit_check_request.price * e.show_entrust_volume + e.risk_limit_check_response.data.entrust_buy_money);
              //   //   if (0 == obj.total_assets) {
              //   //     e.dst_position = 0;
              //   //   }else{
              //   //     e.dst_position = e.dst_total_money / obj.total_assets;
              //   //   }
              //   // }else{
              //   //   // 限价卖出时，目标数量就是两者相减
              //   //   e.dst_total_money = e.dst_amount * e.risk_limit_check_response.data.latest_price;
              //   //   if (0 == obj.total_assets) {
              //   //     e.dst_position = 0;
              //   //   }else{
              //   //     e.dst_position = e.dst_amount * e.risk_limit_check_response.data.latest_price / obj.total_assets;
              //   //   }
              //   // }
              // }else{
              //   if ('buy' == e.risk_limit_check_request.buy_or_sell) {
              //     // 限价买入时，
              //     // obj.dst_amount = Math.floor((parseFloat(obj.volume_after_check) + parseFloat(e.total_amount) + parseFloat(obj.entrusted_volume)) / this.trading_unit) * this.trading_unit;
              //     e.dst_total_money = (e.cur_amount * e.risk_limit_check_response.data.latest_price + e.risk_limit_check_request.price * e.gap_amount + e.risk_limit_check_response.data.entrust_buy_money);
              //     if (0 == obj.total_assets) {
              //       e.dst_position = 0;
              //     }else{
              //       e.dst_position = e.dst_total_money / obj.total_assets;
              //     }
              //   }else{
              //     // 限价卖出时，目标数量就是两者相减position_sell_num
              //     // obj.dst_amount = Math.floor((parseFloat(e.total_amount) - parseFloat(e.risk_limit_check_response.data.data.position_sell_num) - parseFloat(obj.entrusted_volume)) / this.trading_unit) * this.trading_unit;
              //     e.dst_total_money = e.dst_amount * e.risk_limit_check_response.data.latest_price;
              //     if (0 == obj.total_assets) {
              //       e.dst_position = 0;
              //     }else{
              //       e.dst_position = e.dst_amount * e.risk_limit_check_response.data.latest_price / obj.total_assets;
              //     }
              //     // e.dst_total_money = (e.cur_amount * e.risk_limit_check_response.data.latest_price - e.risk_limit_check_request.price * e.gap_amount - e.risk_limit_check_response.data.entrust_buy_money );
              //     // e.dst_position = e.dst_total_money / obj.total_assets;
              //   }
              // }
            });
          }

          //国债逆回购 预览页面
          if(_this.asset_class == 2){
            let total_assets  = 0;
            _this.detail_arr.forEach(function(e){
              total_assets += e.runtime.balance_amount;
              total_gap += parseInt((+e.runtime.enable_cash) / parseInt(_this.trading_unit) / 100 ) * parseInt(_this.trading_unit);
            })

            _this.detail_arr.forEach(function(e){
              let obj = {};
              obj.product_id = e.risk_limit_check_request.product_id;
              obj.risk_limit_check_response = e.risk_limit_check_response;
              obj.risk_limit_check_request = e.risk_limit_check_request;       
              obj.req_total_amount = e.risk_limit_check_request.volume; //委托数量
              obj.total_assets = (+e.runtime.enable_cash); //当前可用资金
              obj.show_entrust_volume; 
              obj.estimate_entrust_volume; 
              obj.trading_unit = parseInt(_this.trading_unit) //最小购买张数
              obj.name = e.name;
              //预计可买最大
              obj.estimate_entrust_volume =parseInt(obj.total_assets/obj.trading_unit/100) * obj.trading_unit;
              obj.product_id = e.risk_limit_check_request.product_id;
              

              obj.runtime = e.runtime;

              obj.entrusted_volume = obj.req_total_amount;
              //实际购买数量
              // obj.show_entrust_volume = 0;
              obj.show_entrust_volume = parseInt(obj.entrusted_volume / total_gap * obj.estimate_entrust_volume / obj.trading_unit) * obj.trading_unit;
              rtn.push(obj)
            });
          }

          // 新股申购
          if(_this.asset_class == "new"){
            _this.detail_arr.forEach(function(e){
              let obj = {};
              obj.product_id = e.risk_limit_check_request.product_id;
              obj.risk_limit_check_response = e.risk_limit_check_response;
              obj.risk_limit_check_request = e.risk_limit_check_request;       
              obj.req_total_amount = e.risk_limit_check_request.volume; //委托数量
              obj.max_req_total_amount = e.risk_limit_check_request.max_volume; //委托数量
              obj.trading_unit = parseInt(_this.trading_unit) //最小购买张数
              obj.name = e.name;
              obj.estimate_entrust_volume = obj.max_req_total_amount;
              obj.show_entrust_volume = req_total_amount;
              obj.product_id = e.risk_limit_check_request.product_id;
              obj.runtime = e.runtime;
              obj.entrusted_volume = obj.req_total_amount;
              obj.show_entrust_volume = obj.req_total_amount;
              rtn.push(obj)
            })
          }

          // //国债逆回购 预览页面
          // if(_this.asset_class == 2){

          //   let total_assets  = 0;

          //   _this.detail_arr.forEach(function(e){
          //     total_assets += e.runtime.balance_amount
          //   })

          //   _this.detail_arr.forEach(function(e){
          //     let obj = {};
          //     obj.product_id = e.risk_limit_check_request.product_id;
          //     obj.risk_limit_check_response = e.risk_limit_check_response;
          //     obj.risk_limit_check_request = e.risk_limit_check_request;       
          //     obj.req_total_amount = e.risk_limit_check_request.volume; //委托数量
          //     obj.total_assets = (+e.runtime.enable_cash); //当前可用资金
          //     obj.show_entrust_volume; //实际购买数量
          //     obj.estimate_entrust_volume; //预计可买最大
          //     obj.trading_unit = parseInt(_this.trading_unit) //最小购买张数
          //     obj.name = e.name;
          //     obj.estimate_entrust_volume =parseInt(obj.total_assets/obj.trading_unit/100) * obj.trading_unit;
          //     obj.product_id = e.risk_limit_check_request.product_id;

          //     obj.runtime = e.runtime;

          //     obj.entrusted_volume = 0;
          //     obj.show_entrust_volume = 0;
          //     rtn.push(obj)
          //   })
          // }
          // if(_this.asset_class == "new"){
          //   _this.detail_arr.forEach(function(e){
          //     let obj = {};
          //     obj.product_id = e.risk_limit_check_request.product_id;
          //     obj.risk_limit_check_response = e.risk_limit_check_response;
          //     obj.risk_limit_check_request = e.risk_limit_check_request;       
          //     obj.req_total_amount = e.risk_limit_check_request.volume; //委托数量
          //     obj.trading_unit = parseInt(_this.trading_unit) //最小购买张数
          //     obj.name = e.name;
          //     obj.estimate_entrust_volume = obj.req_total_amount;
          //     obj.show_entrust_volume = req_total_amount;
          //     obj.product_id = e.risk_limit_check_request.product_id;
          //     obj.runtime = e.runtime;
          //     obj.entrusted_volume = obj.req_total_amount;
          //     obj.show_entrust_volume = obj.req_total_amount;
          //     rtn.push(obj)
          //   })
          // }
          return rtn;
        })();

        this.gather_info = (function(){
          var info = {};
          // 委托数量
          info.show_entrust_volume = 0;
          // 挂单数量
          info.entrusted_volume = 0;
          // 当前持仓
          info.cur_amount = 0;
          // 目标持仓
          info.dst_amount = 0;
          // 资产总值
          info.total_assets = 0;
          // 总缺
          info.total_gap = 0;
          // 
          info.dst_total_money = 0;
          info.estimate_entrust_volume = 0;

          _this.display_arr.forEach(function(e){
            info.show_entrust_volume += parseFloat(e.show_entrust_volume);
            info.estimate_entrust_volume += parseFloat(e.estimate_entrust_volume);//最大可卖汇总
            info.entrusted_volume += parseFloat(e.entrusted_volume);
            info.cur_amount += parseFloat(e.cur_amount);
            info.dst_amount += parseFloat(e.dst_amount);
            info.total_assets += parseFloat(e.total_assets);
            info.total_gap += parseFloat(e.gap_amount);
            if (0 == info.total_assets) {
              info.cur_position = 0;
            }else{
              info.cur_position = info.cur_amount * e.latest_price / info.total_assets;
            }
            
            info.dst_total_money += e.dst_total_money;
            // info.dst_position = info.dst_amount * e.request_price / info.total_assets;

          });
          if (0 == info.total_assets) {
            info.dst_position = 0;
          }else{
            info.dst_position = info.dst_total_money / info.total_assets;
          }
          
          // // multi_products:head:predict:after_preview // 预览事件原本直接从is_running页面到new_order页面，因为新增预览表格，所以中间插入了trade_preview页面
          // // 也就是说，流程为：is_running -(multi_products:head:predict)-> trade_preview -(multi_products:head:predict:after_preview)-> new_order
          // $(window).trigger({
          //   type: 'multi_products:head:predict:after_preview', 
          //   predict: {
          //     total_entrust_volume: info.show_entrust_volume,
          //     total_gap: info.total_gap,
          //     dst_amount: info.dst_amount,
          //     trade_direction: _this.trade_direction,
          //     pass_risk_check: _this.pass_risk_check,
          //     warning_count: 0,
          //     display_arr: _this.display_arr
          //   }
          // });

          // $(window).trigger({
          //   type: 'multi_products:head:predict:after_preview', 
          //   predict: {
          //     total_entrust_volume: _this.gather_info.show_entrust_volume,
          //     total_gap: _this.gather_info.total_gap,
          //     dst_amount: _this.gather_info.dst_amount,
          //     trade_direction: _this.trade_direction,
          //     pass_risk_check: _this.pass_risk_check,
          //     warning_count: 0,
          //     display_arr: _this.display_arr,
          //     asset_class:_this.asset_class
          //   }
          // });

          return info;
        })();

        if(this.asset_class == 2){
          this.display_arr.forEach(function(e){
            e.show_entrust_volume = parseInt(e.estimate_entrust_volume/_this.gather_info.estimate_entrust_volume*e.req_total_amount/e.trading_unit) *e.trading_unit;
            if(isNaN(e.show_entrust_volume)){
              e.show_entrust_volume = 0;
            }
          })
        }

      }
    },
    mounted(){
      var _this = this;
      clearInterval( this.timer );
      this.timer = setInterval(function(){

        if(_this.asset_class == 2){
          //国债逆回购走新逻辑
          $(window).trigger({
            type: 'multi_products:head:predict:after_preview', 
            predict: {
              total_entrust_volume: _this.get_total_entrust_volume(),
              total_gap:  _this.get_total_entrust_volume(),
              dst_amount:  _this.get_total_entrust_volume(),
              trade_direction: _this.trade_direction,
              pass_risk_check: _this.pass_risk_check,
              warning_count: 0,
              display_arr: _this.display_arr
            }
          });
        }else if(_this.asset_class == 0 || 1 == _this.asset_class){
          //走旧逻辑 股票和基金
          $(window).trigger({
            type: 'multi_products:head:predict:after_preview', 
            predict: {
              total_entrust_volume: _this.gather_info.show_entrust_volume,
              total_gap: _this.gather_info.total_gap,
              dst_amount: _this.gather_info.dst_amount,
              trade_direction: _this.trade_direction,
              pass_risk_check: _this.pass_risk_check,
              warning_count: 0,
              display_arr: _this.display_arr,
              asset_class:_this.asset_class
            }
          });
        }else if(_this.asset_class == "new"){
          // 新股
          $(window).trigger({
            type: 'multi_products:head:predict:after_preview', 
            predict: {
              total_entrust_volume: _this.get_total_entrust_volume(),
              total_gap:  _this.get_total_entrust_volume(),
              dst_amount:  _this.get_total_entrust_volume(),
              trade_direction: _this.trade_direction,
              pass_risk_check: _this.pass_risk_check,
              warning_count: 0,
              display_arr: _this.display_arr
            }
          });
        }

      },600)

    }

  });

  $(window).on('multi_products:head:predict', function(event){
    if (event.predict.detail_arr.length > 0) {
      trade_preview.visibility = true;
    }else{
      trade_preview.visibility = false
    }
    
    trade_preview.detail_arr = event.predict.detail_arr;
    trade_preview.trade_direction = event.predict.trade_direction;
    trade_preview.asset_class  = event.predict.asset_class;
    if ('new' == event.predict.asset_class) {
      trade_preview.trading_unit = 100;
    }else{
      trade_preview.trading_unit = event.predict.trading_unit;
    }

  })
</script>