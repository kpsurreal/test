<!--
委托、成交列表
trigger:
1.open_order_by_order //用户点击订单详情，弹窗显示股票详情

on:
1.entrust_update_updated //并没有找到触发的地方了 从名字上来看 应该是委托更新时触发的事件
2.multi_load
3.multi_products:create_order:finish //触发批量下单已完成事件，此处更新委托/成交列表
4.order_list:add_temporary_order //下单后构造临时数据

 -->

<div id="position_list">
  
</div>

<script type="text/javascript">
  $(function(){
    var positionList;
    var orginfo_theme = window.LOGIN_INFO.org_info.theme;//机构版／专户版枚举值 专户版为3，机构版为非3.

    var query_arr = [{
      id: 'position',
      uri: window.REQUEST_PREFIX + '/oms/api/multi_position_realtime',
      order: '',
      order_by: '',
      gridDataStr: 'positionGrid',
      display_rules: [{
        id: 'stock_id',
        label: '证券代码',
        withMultiIcon: true,
        withStockType: true,
        format: ['hideStockType'],
        class: ''
      },{
        id: 'stock_name',
        label: '证券名称',
        format: '',
        class: 'cell-left'
      },{
        id: 'product_name',
        // label: '持仓策略',
        label: 3 == orginfo_theme ? '持仓策略' : '交易单元',
        format: '',
        class: 'cell-left'
      },{
        id: 'cost_price',
        label: '成本价',
        format: ['numeralNumber', 3],
        class: 'cell-right'
      },{
        id: 'latest_price',
        label: '最新价',
        format: ['numeralNumber', 3],
        classFormat: ['rgColor', 'earning'],
        class: 'cell-right'
      },{
        id: 'total_amount',
        label: '持仓数量',
        format: ['numeralNumber', 0],
        class: 'cell-right'
      },{
        id: 'enable_sell_volume',
        label: '可卖数量',
        format: ['numeralNumber', 0],
        class: 'cell-right'
      },{
        id: 'market_value',
        label: '市值',
        format: ['numeralNumber', 2],
        showTotal: true,
        classFormat: ['rgColor', 'earning'],
        class: 'cell-right'
      },{
      //   id: 'today_earning',
      //   label: '当日盈亏',
      //   format: ['signNumeralNumber', 2],
      //   classFormat: ['rgColor', 'earning'],
      //   class: 'cell-right'
      // },{
        id: 'earning',
        label: '浮动盈亏',
        format: ['signNumeralNumber', 2],
        showTotal: true,
        classFormat: ['rgColor', 'earning'],
        class: 'cell-right'
      },{
        id: 'earning_ratio',
        label: '浮盈率',
        format: ['signNumeralPercent', 2],
        classFormat: ['rgColor', 'earning_ratio'],
        class: 'cell-right'
      },{
        id: 'weight',
        label: '所占仓位',
        showTotal: true,
        format: ['numeralPercent', 2],
        class: 'cell-right'
      // },{
      //   id: 'exchange_text',
      //   label: '交易市场',
      //   format: '',
      //   hide_flag: 3 == orginfo_theme ? true : false,
      //   class: 'cell-right'
      }]
    }];

    $(window).on('multi_load', function(event){
      var product_list = event.product_list;
      var product_ids = event.product_ids;

      positionList = new Vue({
        el: '#position_list',
        template: `
          <section class="order-list new-design">
            <a id="anchor-position" style="position: relative;top:-65px;display: block;height: 0;width:0;"></a>
            <div class="hd">
              <span class="section-title">当前持仓</span>
              
              <a class="oms-btn gray refresh-btn loading-loading right" v-bind:class="{'loading': loadingNum > 0}" href="javascript:;" v-on:click="loadOrderList"><i class="oms-icon refresh"></i>刷新</a>
              <span v-if="1 == checked_count" class="right" style="font-size:16px;font-weight:600;color:#000;">@{{3 == orginfo_theme ? '当前仓位': '交易单元仓位'}}<span style="padding-left: 5px;" v-text="numeralPercent(totalData.weight)"></span></span>
            </div>
            <table class="oms-table loading-loading nothing-nothing" v-bind:class="{'nothing': activeGridList.length == 0}">
              <tbody>
                <tr>
                  <th v-if="rule.hide_flag != true" v-for="rule in curQueryInfo.display_rules" v-bind:class="rule.class">
                    <span v-text="rule.label"></span>
                    <a class="icon-sortBy" v-on:click="chgSort(rule.id)">
                      <i class="icon-asc" :class="{active: (order_by == rule.id && order == 'asc')}"></i>
                      <i class="icon-desc" :class="{active: (order_by == rule.id && order == 'desc')}"></i>
                    </a>
                  </th>
                  <th class="cell-right">
                    <span>操作</span>
                  </th>
                </tr>
              </tbody>
              <tbody>
                <tr v-for="row in activeGridList" v-show="checkShow(row)" v-bind:class="{'sub_order': row.is_sub, 'display_multi': row.web_showChildren}">
                  <td v-if="rule.hide_flag != true" v-for="rule in curQueryInfo.display_rules" v-bind:class="rule.class">
                    <span v-bind:class="displayClass(row, rule)" v-text="displayValue(row, rule)"></span>
                    <span v-if="rule.withStockType && (3 == checkStockType(row[rule.id]) || 4 == checkStockType(row[rule.id]))" v-bind:class="displayStockClass(row, rule)">
                      @{{ displayStockType(row, rule) }}
                    </span>
                  </td>
                  <td class="cell-right">
                    <span @click="doFollow(row)" class="oms-btn sm gray three">加自选</span>
                    <span @click="doTrade(row, 'buy')" class="oms-btn sm red">买入</span>
                    <span @click="doTrade(row, 'sell')" class="oms-btn sm blue">卖出</span>
                  </td>
                </tr>
                <tr v-if="1 == checked_count && activeGridList.length > 0">
                  <td v-bind:class="rule.class" v-if="rule.hide_flag != true" v-for="(rule, index) in curQueryInfo.display_rules">
                    <span v-if="0 == index" style="color: #999;">当前持仓汇总</span>
                    <span v-if="rule.showTotal" v-bind:class="displayClass(totalData, rule)" v-text="displayValue(totalData, rule)"></span>
                  </td>
                  <td class="cell-right">
                    
                  </td>
                </tr>
              </tbody>
            </table>
          </section>
        `,
        data: {
          order: '',
          order_by: '',
          gridData: [],
          curActive: 'position',

          orginfo_theme: orginfo_theme,

          positionGrid: [],
          product_list: [],
          checked_count: 0,
          totalData: [],

          query_arr: query_arr,
          loadingNum: 0
        },
        watch: {

        },
        computed: {
          curQueryInfo: function(){
            var _this = this;
            var rtn = {};
            this.query_arr.forEach(function(e){
              if (e.id == _this.curActive) {
                rtn = e;
              }
            });
            return rtn;
          },
          activeGridList: function(){
            let _this = this;
            var rtn = [];
            // return [];

            this.product_list.forEach(function(ele){
              if (true == ele.checked) {
                _this['positionGrid'] && _this['positionGrid'].forEach(function(e){
                  if (e.product.id == ele.product_id && 0 != e.total_amount){
                    var obj = {};
                    obj.product_id = e.product.id;
                    // 证券名称
                    obj.stock_id = e.stock_id;
                    // 证券代码
                    obj.stock_name = e.stock_name;
                    // 持仓策略
                    obj.product_name = e.product ? e.product.name : '';
                    // 成本价
                    obj.cost_price = e.cost_price;
                    // 最新价
                    obj.latest_price = e.latest_price;
                    // 持仓数量
                    obj.total_amount = e.total_amount;
                    // 可卖数量
                    obj.enable_sell_volume = e.enable_sell_volume;
                    // 市值
                    obj.market_value = e.market_value;
                    // 当日盈亏
                    obj.today_earning = e.today_earning;
                    // 浮动盈亏
                    obj.earning = e.earning;
                    // 浮盈率
                    obj.earning_ratio = e.earning_ratio;
                    // 所占仓位
                    obj.weight = e.weight;
                    // 证券市场
                    obj.exchange_text = e.exchange_text;

                    rtn.push(obj);
                  }
                });
              }
            });

            // 步骤2，根据排序逻辑进行排序
            rtn = VUECOMPONENT.sort(rtn, _this.order, _this.order_by);

            var rtn2 = {};
            rtn2.market_value = 0;
            rtn2.earning = 0;
            rtn2.weight = 0;
            if (1 == this.checked_count) {
              rtn.forEach(function(e){
                rtn2.market_value += parseFloat(e.market_value);
                rtn2.earning += parseFloat(e.earning);
                rtn2.weight += parseFloat(e.weight);
              })
            }
            this.totalData = rtn2;

            $(window).trigger({type:'product:position:updated',position:rtn});

            return rtn;
          }
        },
        methods: {
          hideStockType: function(val){
            return val.split(/\./)[0];
          },
          checkStockType: function(value){
            if (/\.sh/.test(value.toLowerCase())) {
              return 1;
            }
            if (/\.sz/.test(value.toLowerCase())) {
              return 2;
            }
            if (/\.hksh/.test(value.toLowerCase())) {
              return 3;
            }
            if (/\.hksz/.test(value.toLowerCase())) {
              return 4;
            }
          },
          displayStockClass: function(row, rule){
            var value = row[rule.id];
            var type = this.checkStockType(value);
            if (3 == type) {
              return 'stock-type-hksh';
            }
            if (4 == type) {
              return 'stock-type-hksz'
            }
          },
          displayStockType: function(row, rule){
            var value = row[rule.id];
            var type = this.checkStockType(value);
            if (3 == type) {
              return '沪港通'
            }
            if (4 == type) {
              return '深港通'
            }
          },
          chgSort: function(id){
            if (id == this.order_by) {
              if (this.order == 'asc') {
                this.order = 'desc';
              }else if(this.order == 'desc'){
                this.order = '';
              }else{
                this.order = 'asc'
              }
            }else{
              this.order_by = id;
              this.order = 'asc';
            }
            // // 用户切换排序命令，需要保存新的排序
            // let obj = {};
            // obj.field_sort = this.display_rules.map(function(e){
            //   return e.id
            // });
            // obj.order_by = this.order_by;
            // obj.order = this.order;

            // this.$emit('order', {order: this.order,
            //   order_by: this.order_by,
            //   typeStr: this.typeStr,
            //   display_rules: this.display_rules
            // });
            // common_storage.setItem(this.typeStr, obj);
          },
          // 行点击
          doRowClick: function(row){
            // $(window).trigger({
            //   type:'order_create:by_stock',
            //   stock:{
            //     stock_code: row.stock_id,
            //     stock_name: row.stock_name,
            //     direction: 'sell'
            //   }
            // });
          },
          // 添加自选股
          doFollow: function(row){
            $(window).trigger({
              type: 'stock:add_follow',
              stock: row
            });
          },
          // 买入卖出按钮
          doTrade: function(row, direction){
            $(window).trigger({
              type:'order_create:by_stock',
              stock:{
                stock_code: row.stock_id,
                stock_name: row.stock_name,
                direction: direction
              }
            });
          },
          checkShow: function(row){
            if (row.do_hide) {
              return false;
            }

            return true;
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
            return numeral(arg).format( '0.00%' );
          },
          signNumeralNumber: function(arg, num){
            if('-' == arg || '--' == arg){
              return arg;
            }

            var noSign = +(arg||0).toString().replace(/^(\-|\+)/,'');
            return (arg<0 ? '-' : '+') + this.numeralNumber(noSign, num);
          },
          signNumeralPercent: function(arg, num){
            if('-' == arg || '--' == arg){
              return arg;
            }

            var noSign = +(arg||0).toString().replace(/^(\-|\+)/,'');
            return (arg<0 ? '-' : '+') + this.numeralPercent(noSign, num);
          },
          // row是行数据，name是比较的那个属性名，middle是比较的标尺数据，默认为0
          rgColor: function(row, name, middle){
            var num = row[name];
            return num<(middle||0) ? 'green' : 'red';
          },
          displayValue: function(sub_value, rule){
            var value = sub_value[rule.id];
            if ((rule.format != '') && (rule.format instanceof Array) && (this[rule.format[0]] instanceof Function)) {
              // value = this[rule.format].call(this, value, )
              var args = [value].concat(rule.format.slice(1))
              value = this[rule.format[0]].apply(this, args);

            }
            if (rule.unit) {
              return value + rule.unit;
            }else{
              return value;
            }
          },
          displayClass: function(sub_value, rule){
            // 注意这里是把sub_value整个传给了函数处理
            var value = sub_value;
            var rtn = '';
            if ((rule.classFormat != '') && (rule.classFormat instanceof Array) && (this[rule.classFormat[0]] instanceof Function)) {
              // value = this[rule.classFormat].call(this, value, )
              var args = [value].concat(rule.classFormat.slice(1))
              rtn = this[rule.classFormat[0]].apply(this, args);
            }
            return rtn;
          },
          // 读取三个接口的数据
          loadOrderList: function(){
            let _this = this;

            //######################### 风控增补数据 risk_check js 用到 ########################
            $.get((window.REQUEST_PREFIX||'')+'/oms/helper/risk_position',{product_id:product_ids}, function(res){
                if (0 == res.code) {
                    window.risk_position = res.data;
                }
            });
            //######################### 风控增补数据 risk_check js 用到 ########################

            // 额外新增一个保护，计算loadOrderList发起ajax的数量，如果不为0，则return。
            // 由此带来一个小问题，就是一个接口没有返回，其它都不会去更新了。但不是问题呀，因为更新按钮也是在转的
            if (0 != this.loadingNum) {
              return;
            }

            // this.last_loading_timestamp = new Date().valueOf();
            this.query_arr && this.query_arr.forEach(function(e){
              var last_loading_timestamp = new Date().valueOf();
              _this[e.gridDataStr].last_loading_timestamp = last_loading_timestamp;

              _this[e.gridDataStr].loadingStatus = 'loading';
              _this.loadingNum += 1;
              $.getJSON(e.uri, {product_id: product_ids}).done(function(res){
                if( _this[e.gridDataStr].last_loading_timestamp != last_loading_timestamp ){return;}

                if(res.code==0){
                  var position_realtime = [];

                  var needRefresh = false;
                    product_list.forEach(function(product){
                      var id = product.id;
                      var positions = $.pullValue(res,'data.'+id+'.data',[]);

                      // product.position_realtime = positions;
                      positions.forEach(function(position){
                          position.product = product;
                      });

                      // id是组合id，positions是实时持仓数据 在此计算出“今日盈亏”和“今日盈亏率”修改到window.PRODUCTS 的对应组合的runtime中
                      // product.today_earning;
                      var profit_of_today = 0;
                      positions.forEach(function(position){
                          profit_of_today += position.today_earning;
                      });
                      window.PRODUCTS.forEach(function(e){
                        if (e.id == id) {
                          if (e.runtime && Object.keys(e.runtime).length > 0) {
                            needRefresh = true;
                            var profit_of_today_v2 = profit_of_today - e.runtime.redeem_fee - e.runtime.manage_fee - e.runtime.other_fee;
                            e.runtime.profit_of_today_v2 = profit_of_today_v2;
                            if (0 == e.runtime.total_assets) {
                              e.runtime.profit_rate_of_day_v2 = 0;
                            }else{
                              e.runtime.profit_rate_of_day_v2 = profit_of_today_v2 / e.runtime.total_assets;
                            }
                          }
                        }
                      });

                      position_realtime.push.apply(position_realtime,positions);
                    });
                    if (needRefresh == true) {
                      $(window).trigger({
                        type: 'position:runtime:refresh'
                      });
                    }

                    window.position_realtime = position_realtime;

                    _this[e.gridDataStr] = position_realtime;
                    _this[e.gridDataStr]['list_num'] = position_realtime.length;
                    _this[e.gridDataStr]['last_updated_timestamp'] = res.timestamp;
                    // _this.getGridList(e.gridDataStr);
                  }else{
                    _this[e.gridDataStr] = [];
                    _this[e.gridDataStr]['list_num'] = 0;
                    // _this.getGridList(e.gridDataStr);
                  }
              }).always(function(){
                _this.loadingNum -= 1;
                _this[e.gridDataStr].loadingStatus = '';
              });
            });

            
          }
        }
      });

      positionList.loadOrderList();

      setInterval(function(){
        positionList.loadOrderList();
      },5000);

      // 曾经，我们的持仓监听了3个事件：“multi_products:head:updated”、“multi_products:head:updated:checked_one”、“multi_products:head:updated:checked_notone”
      // 现在，我们使用一个multi_products:head:updated就行
      $(window).on('multi_products:head:updated', function(event){
        positionList.product_list = event.product_list;
        positionList.checked_count = event.checked_count;
      }).on('multi_products:create_order:finish', function(event){
        positionList.loadOrderList();
      });

      $(window).on('position_update_updated', function(event){
        var flag = false;
        positionList && positionList.query_arr && positionList.query_arr.forEach(function(e){
          if (positionList[e.gridDataStr].last_updated_timestamp < event.updated_timestamp) {
            flag = true;
          }
        });

        if( flag ){
          positionList.loadOrderList();
          // setTimeout(function(){
          //   positionList.loadOrderList();
          // },5000);
        }
      })
    })
  });

  
  
</script>


