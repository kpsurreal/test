<!--
股票下单模块，包含单只和多只股票买卖
trigger:
order_create:nav:change //用户切换买入卖出菜单，使得多股票买卖表格重置
'order_create:nav' + $(this).attr('nav').replace(/\s/g,'').replace(/\./g,':')

on:
multi_load
order_create:by_stock //用户点击持仓股票，切换到卖出
add_multi_hand_order:success //这个页面处理这个事件的意义何在？
order_create:direction:changed //用户切换买入 卖出后，颜色样式
multi_products:head:updated:checked_one //用户选中产品组后，决定是否能够批量下单
multi_products:head:updated:checked_notone //用户选中产品组后，决定是否能够批量下单

oms3.8.1修改：
将下单模块的菜单，改写为vue.js的组件，可以更好的根据版本来控制菜单内容
后续也要将此页面用到的其他blade模块文件的东西移到此页面
 -->


<?php
    use App\Services\UserService;
    $org_info = UserService::getOrgInfo(); 
 ?>



<section id="order_create_id" class="create-order board black-turnoff fc" style="bottom: 0px;margin-bottom:0;">

  <div class="body single">
    <div id="tradeMenu">
      <!-- <div class="section-nav" style="overflow: visible;">
        <span class="nav-item red active single-buy" nav=".single-stock" click-click=".direction-ctrl.buy" click-active="_self">个股买入</span>
        <span class="nav-item blue single-sell" nav=".single-stock" click-click=".direction-ctrl.sell" click-active="_self">个股卖出</span>
        <span class="nav-item red multi-buy multi_products-disabled" nav=".multi-stocks .buy" click-active="_self">批量买入</span>
        <span class="nav-item blue multi-sell multi_products-disabled" nav=".multi-stocks .sell" click-active="_self">批量卖出</span>
        
        <div class="nav-bar-toggle"><i class="nav-bar-show-icon"></i><span class="nav-bar-toggle-text">收起指令提交区</span><i class="nav-bar-hide-icon"></i></div>
      </div> -->
    </div>
    <div class="right-board" style="padding-bottom: 0px;">
      {{-- 单只股票买卖 --}}
      <div class="inner-wrap single-stock" style="display:none;display: flex;">
        {{-- 创建订单 --}}
        @include('oms.multi.product.order_create.new_order')
        {{-- 5当行情 --}}
        @include('oms.multi.product.order_create.trade_5')
        {{-- 个股交易历史(已废弃) --}}
        {{-- @include('oms.multi.product.order_create.trade_history') --}}

        {{-- 交易预览 --}}
        @include('oms.multi.product.order_create.trade_preview')
      </div>

      {{-- 多只股票批量买卖 这里blade模版架构有个问题，buy和sell都引用了foot.blade.php，而foot又引用了submit.blade.php，待优化 --}}


        

        

      <div class="inner-wrap multi-stocks multi_products-disabled" >
      
        @if ($org_info['theme'] == 3)
        {{-- 专户版旧逻辑--}}

        <div class="buy multi-stocks-section" style="display:none;padding-left: 20px;">

          @include('oms.multi.product.order_create.multi_order.buy')
        </div>
        <div class="sell multi-stocks-section" style="display:none;padding-left: 20px;">

          @include('oms.multi.product.order_create.multi_order.sell')
        </div>



        @else


        <div class="buy multi-stocks-section"  style="display:none;" >
          @include('oms.multi.product.order_create.multi_order.table_batch')
        </div>


        <script src="{{ asset('/dist/js/oms/multi/batchdeal.js') }}"></script> 

        @endif 

        <div class="disabled-mask"></div>
      </div>
      <div id="do_revert">
      </div>
    </div>
  </div>
  @include('oms.multi.product.order_create.foot')

  <script>
    // me这个变量是因为以前代码遗留逻辑不得已而保留。
    // 它会控制各个下单的显示和隐藏
    var orginfo_theme = window.LOGIN_INFO.org_info.theme;//机构版／专户版枚举值 专户版为3，机构版为非3.
    var order_create_me = $('#order_create_id');
    var nav = order_create_me.find('.left-nav');
    var board = order_create_me.find('>.body>.right-board');
    var market = 'marketA';
    
    $(window).on('multi_load',function(event){
      product_list = event.product_list;
      product_ids = event.product_ids;

      var tradeMenu = new Vue({
        el: '#tradeMenu',
        template: `
        <div class="left-nav">
          <div class="trade-nav" style="overflow: visible;">
            <div class="trade-nav__marketMenu">
              <div v-if="3 != org_info_theme" class="trade-nav__market" @click="chgCurMarket('marketA')" v-bind:class="{'active': 'marketA' == curMarket}">沪深交易A</div>
              <div v-if="3 != org_info_theme" class="trade-nav__market" @click="chgCurMarket('marketHSH')" v-bind:class="{'active': 'marketHSH' == curMarket}">沪港通交易H</div>
              <div v-if="3 != org_info_theme" class="trade-nav__market" @click="chgCurMarket('marketHSZ')" v-bind:class="{'active': 'marketHSZ' == curMarket}">深港通交易H</div>
            </div>
            
            <span class="trade-nav__item single-buy" v-bind:class="{'active': 'single-buy' == curActive}" @click="chgActive('single-buy')">个股买入</span>
            <span class="trade-nav__item single-sell" v-bind:class="{'active': 'single-sell' == curActive}" @click="chgActive('single-sell')">个股卖出</span>
            <span class="trade-nav__item multi-buy multi_products-disabled" v-bind:class="{'active': 'multi-buy' == curActive, 'disabled': 1 != checked_count}" @click="chgActive('multi-buy')">批量买入</span>
            <span class="trade-nav__item multi-sell multi_products-disabled" v-bind:class="{'active': 'multi-sell' == curActive, 'disabled': 1 != checked_count}" @click="chgActive('multi-sell')">批量卖出</span>
            <span v-if="3 != org_info_theme" class="trade-nav__item do_revert" v-bind:class="{'active': 'do_revert' == curActive}" @click="chgActive('do_revert')">撤单<i v-if="displayRevertNum > 0" class="trade-nav__item--tip" v-text="displayRevertNum"></i></span>

            <div style="flex: 1;"></div>
            <a class="trade-nav__toggle" @click="showBoard = !showBoard;">
              <i class="nav-bar-show-icon" v-bind:class="{'icon-collapse': showBoard, 'icon-spread': !showBoard}"></i>
            </a>
          </div>
        </div>
        `,
        data: {
          org_info_theme: window.LOGIN_INFO.org_info.theme,
          curMarket: 'marketA',
          curActive: 'single-buy',
          displayRevertNum: 0,
          showBoard: true,
          product_list: [],
          checked_count: 0
        },
        watch: {
          checked_count: function(){
            if (1 == this.checked_count) {
              $('.disabled-mask').hide();
            }else{
              $('.disabled-mask').show();
            }
          },
          showBoard: function(){
            if (true == this.showBoard) {
              board.show();
            }else{
              board.hide();
            }
            // 规避解决一个问题，展示隐藏board后，没有重新计算高度
            $(window).scroll();
          },
          curActive: function(){
            // 记录当前买入卖出情况
            var index = 0;
            if ('single-sell' == this.curActive) {
              index = 1;
            }
            $.omsUpdateLocalJsonData('etc','order_create_nav_index', index);

            this.showBoard = true;

            // 控制底部购买表单、表格的显示
            // 由于之前的处理逻辑是这里菜单被点击修改后，触发点击表格隐藏的买卖方向按钮，再在那里监听自定义点击事件“click_active” 
            // 所以，此处在不修改流程的情况下重写代码，会显得有点乱。现在只是走出第一步，
            // 等时间充足的时候，整个下单页面的所有代码 应该合到同一个文件中。前端模块化也不是一块代码一个.blade.php文件。高内聚不谈，低耦合实在是算不上
            if ('single-buy' == this.curActive || 'single-sell' == this.curActive) {
              board.find('.single-stock').siblings().hide();
              board.find('.single-stock').show();
              query_arr.doShow = false;

              order_create_me.find('.body').removeClass('multi').addClass('single');

              // 似乎没用的事件
              $(window).trigger({
                type: 'order_create:nav:single-stock'
              });

              // 触发new_order.blade.php页面的隐藏的按钮点击，达到修改买入卖出方向的目的
              if ('single-buy' == this.curActive) {
                board.find('.direction-ctrl.buy').click();
              }
              if ('single-sell' == this.curActive) {
                board.find('.direction-ctrl.sell').click();
              }
            }else if('multi-buy' == this.curActive || 'multi-sell' == this.curActive){
              board.find('.multi-stocks').siblings().hide();
              board.find('.multi-stocks').show();
              query_arr.doShow = false;

              if(this.org_info_theme == 3){
                if ('multi-buy' == this.curActive) {
                  board.find('.multi-stocks').find('.multi-stocks-section.buy').show().siblings().hide();
                  // 使table刷新
                  $(window).trigger({
                    type: 'order_create:nav:multi-stocks:buy'
                  });
                }
                if ('multi-sell' == this.curActive) {
                  board.find('.multi-stocks').find('.multi-stocks-section.sell').show().siblings().hide();
                  // 使table刷新
                  $(window).trigger({
                    type: 'order_create:nav:multi-stocks:sell'
                  });
                }

              }else{
                if ('multi-buy' == this.curActive) {
                  board.find('.multi-stocks').find('.multi-stocks-section').show().siblings().hide();
                  //触发batch的 改变交易类型事件
                  $(window).trigger({
                    type:'order_create:deal_method:changed',
                    deal_method: "buy"
                  });
                }
                if ('multi-sell' == this.curActive) {
                  board.find('.multi-stocks').find('.multi-stocks-section').show().siblings().hide();
                  $(window).trigger({
                    type:'order_create:deal_method:changed',
                    deal_method: "sell"
                  });
                }

              }

              order_create_me.find('.body').removeClass('multi').addClass('multi');

              // 似乎没用的事件
              $(window).trigger({
                type: 'order_create:nav:multi-stock'
              });
            }else if('do_revert' == this.curActive){
              board.find('.multi-stocks').siblings().hide();
              board.find('.multi-stocks').hide();
              board.find('.order-list').show();
              // board.find('#do_revert').siblings().hide();
              // board.find('#do_revert').show();
              doRevert.doShow = true;
            }
            
          },
          curMarket: function(curValue, oldValue){
            // 控制底部购买表单，表格的显示
            // 依照修改买入卖出方向的处理，也触发new_order.blade.php页面的隐藏的按钮点击
            if ('marketA' == this.curMarket) {
              board.find('.market-ctrl.marketA').click();
            }

            if ('marketHSH' == this.curMarket) {
              board.find('.market-ctrl.marketHSH').click();
            }

            if ('marketHSZ' == this.curMarket) {
              board.find('.market-ctrl.marketHSZ').click();
            }
          }
        },
        methods: {
          chgCurMarket: function(curMarket){
            // 判断是否修改，如果被修改，清空股票及价格
            if(curMarket !== this.curMarket){
              $('#stock_code').val('').change();
              $("#val_price").val('');
              $('[click-active=".trade_number_method-by_volume"]').click();
              $('#val_volume').val('');
              if ('marketA' == curMarket) {
                $('.order_model_limit_price').click();
                $("#val_volume").attr('placeholder', '每手100股');
                $("#vale_current_volum").attr('placeholder', '每手100股');
              }else if ('marketHSH' == curMarket) {
                $("#val_volume").attr('placeholder', '');
                $("#vale_current_volum").attr('placeholder', '');
              }else if ('marketHSZ' == curMarket) {
                $("#val_volume").attr('placeholder', '');
                $("#vale_current_volum").attr('placeholder', '');
              }
            }

            this.curMarket = curMarket;
            this.showBoard = true;
          },
          chgActive: function(val){
            // if (1 != this.checked_count && ('multi-buy' == val || 'multi-sell' == val)) {
            //   $.omsAlert('多策略暂时无法使用批量下单功能！',false,1000);
            //   return;
            // }

            if (0 == this.checked_count && ('multi-buy' == val || 'multi-sell' == val)) {
              if (3 == orginfo_theme) {
                $.omsAlert('请选择产品！',false,1000);
              }else{
                $.omsAlert('请选择交易单元！',false,1000);
              }
              
              return;
            }

            if (1 < this.checked_count && ('multi-buy' == val || 'multi-sell' == val)) {
              $.omsAlert('系统暂不支持多产品批量股票交易！',false,1000);
              return;
            }
            this.curActive = val;
            this.showBoard = true;
          }
        }
      });

      (function(){
        //根据交易时段显示／收缩底部菜单栏
        var url = (window.REQUEST_PREFIX||'')+"/oms/helper/is_trade_day";
        $.get(url).done(function(res){
          if (0 == res.code) {
            if (1 == res.data.is) {
              tradeMenu.showBoard = true;
            }else{
              tradeMenu.showBoard = false;
            }
          }
        });
      })();

      var orderList;
      

      var query_arr = [{
        id: 'revert',
        uri: window.REQUEST_PREFIX + '/oms/order/getCanBeCanceledList?permission_type=product&type=all&count=9999',
        gridDataStr: 'revertGrid',
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
          // 专户版买卖标志
          id: 'entrust_type',
          label: '买卖标志',
          hide_flag: (3 == orginfo_theme) ? false : true,
          format: ['entrustTypeCH'],
          classFormat: ['entrustTypeClass'],
          class: 'cell-left'
        },{
          // 机构版买卖标志
          id: 'bs_symbol_text',
          label: '买卖标志',
          hide_flag: (3 == orginfo_theme) ? true : false,
          class: 'cell-left'
        },{
          id: 'product_name',
          label: 3 == orginfo_theme ? '策略' : '交易单元',
          format: '',
          class: 'cell-left'
        },{
          id: 'created_at',//'entrust_at',
          label: '委托时间',
          format: ['unixTime'],
          class: 'cell-right'
        },{
          id: 'entrust_price',
          label: '委托价格',
          format: ['numeralNumber', 3],
          class: 'cell-right'
        },{
          id: 'entrust_amount',
          label: '委托数量',
          format: '',
          class: 'cell-right'
        },{
          id: 'deal_price',
          label: '成交价格',
          format: ['numeralNumber', 3],
          class: 'cell-right'
        },{
          id: 'deal_amount',
          label: '成交数量',
          format: '',
          class: 'cell-right'
        },{
          // 专户版订单状态
          id: 'status',
          label: '订单状态',
          hide_flag: (3 == orginfo_theme) ? false : true,
          format: ['statusCH'],
          classFormat: ['statusClass'],
          class: 'cell-left'
        },{
          // 机构版订单状态
          id: 'vendor_status_text',
          label: '订单状态',
          hide_flag: (3 == orginfo_theme) ? true : false,
          // format: ['statusCH'],
          // classFormat: ['statusClass'],
          class: 'cell-left'
        },{
          // 专户版报价方式
          id: 'entrust_model',
          label: '报价方式',
          hide_flag: (3 == orginfo_theme) ? false : true,
          format: ['entrustModelType'],
          class: 'cell-left'
        },{
          // 机构版报价方式
          id: 'quote_type_text',
          label: '报价方式',
          hide_flag: (3 == orginfo_theme) ? true : false,
          class: 'cell-left'
        // },{
        //   id: 'created_at',
        //   label: '委托时间',
        //   format: ['unixTime'],
        //   class: 'cell-right'
        // },{
        //   id: 'updated_at',
        //   label: '更新时间',
        //   format: ['unixTime'],
        //   class: 'cell-right'

        // },{
        //   // 机构版 港股 字段
        //   id: 'exchange_rate',
        //   label: '参考汇率',
        //   hide_flag: (3 == orginfo_theme) ? true : false,
        //   doHideWhenMarketA: true,
        //   format: '',
        //   class: 'cell-left'
        }]
      }];
      var doRevert = new Vue({
        el: '#do_revert',
        template: `
          <section v-show="doShow" class="order-list new-design" style="min-height: 245px; max-height: 400px; overflow: auto;margin: 0;">
            <a id="anchor-orderList" style="position: relative;top:-65px;display: block;height: 0;width:0;"></a>
            <div class="hd">
              <span class="section-title" style="font-size: 16px; color: #222222;">可撤订单</span>
              <a class="oms-btn gray refresh-btn loading-loading right" v-bind:class="{'loading': loadingNum > 0}" href="javascript:;" v-on:click="loadOrderList">
                <i class="oms-icon refresh"></i>刷新
              </a>
              <a class="oms-btn red revert-btn  right" href="javascript:;" v-on:click="doRevert">撤单</a>
            </div>
            <table class="oms-table loading-loading nothing-nothing" v-bind:class="{'nothing': Object.keys(temporary_order).length == 0 && activeGridList.length == 0}">
              <tbody>
                <tr>
                  <th style="width: 40px;">
                    <input type="checkbox" v-model="selectAll" v-on:change="chgSelectAll()" />
                  </th>
                  <th v-if="rule.hide_flag != true" v-show="rule.doHideWhenMarketA != true || 'marketA' != market" v-for="rule in curQueryInfo.display_rules" v-bind:class="rule.class">
                    <span v-text="rule.label"></span>
                  </th>
                </tr>
              </tbody>
              <tbody>
                <tr v-if="Object.keys(temporary_order).length > 0">
                  <td>
                    <input :disabled="checkDisabled(temporary_order)" type="checkbox" v-model="temporary_order.web_checked" v-on:change="chgSelect(temporary_order)" />
                  </td>
                  <td v-on:click="changeShow(temporary_order)" v-if="rule.hide_flag != true" v-show="rule.doHideWhenMarketA != true || 'marketA' != market" v-for="rule in curQueryInfo.display_rules" v-bind:class="rule.class">
                    <span v-bind:class="displayClass(temporary_order, rule)" v-text="displayValue(temporary_order, rule)"></span>
                    <div v-if="rule.withMultiIcon && temporary_order.is_batch" v-bind:class="{'icon-show': temporary_order.web_showChildren, 'icon-hide': !temporary_order.web_showChildren}"></div>
                  </td>
                </tr>
                <tr v-for="row in activeGridList" v-show="checkShow(row)" v-bind:class="{'sub_order': row.is_sub, 'display_multi': row.web_showChildren}">
                  <td>
                    <input :disabled="checkDisabled(row)" type="checkbox" v-model="row.web_checked" v-on:change="chgSelect(row)" />
                  </td>
                  <td v-on:click="changeShow(row)" v-if="rule.hide_flag != true" v-show="rule.doHideWhenMarketA != true || 'marketA' != market" v-for="rule in curQueryInfo.display_rules" v-bind:class="rule.class">
                    <span v-bind:class="displayClass(row, rule)" v-text="displayValue(row, rule)"></span>
                    <div v-if="rule.withMultiIcon && row.is_batch" v-bind:class="{'icon-show': row.web_showChildren, 'icon-hide': !row.web_showChildren}" ></div>
                    <span v-if="rule.withStockType && (3 == checkStockType(row[rule.id]) || 4 == checkStockType(row[rule.id]))" v-bind:class="displayStockClass(row, rule)">
                      @{{ displayStockType(row[rule.id]) }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </section>
        `,
        data: {
          doShow: false,
          me_can_trade: true,
          gridData: [],
          curActive: 'revert',
          market: 'marketA',

          selectAll: false,
          selectList: new Map(),

          orginfo_theme: orginfo_theme,
          temporary_order: {},

          hideRevert: false,
          hideDeal: false,
          hideIssue: false,

          revertGrid: {},
          revertGrid_midGridList: [],
          query_arr: query_arr,
          orderNum: 0,
          // last_loading_timestamp: '',
          loadingNum: 0
        },
        watch: {
        },
        computed: {
          activeGridList: function(){
            if ('revert' == this.curActive) {
              this.selectAll = this.revertGridList.every(function(e){
                return e.web_checked == true;
              });
              return this.revertGridList;
            }
          },
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
          revertGridList: function(){
            var str = 'revertGrid';
            var rtn = this[str + '_midGridList'];
            var show_batchs = [];

            rtn.forEach(function(e){
              if (e.is_batch) {
                show_batchs.push(e);
              }
            });

            // 处理决定是否勾选的数据
            show_batchs.forEach(function(e){
              if (e.orders.every(function(el){
                return el.web_checked == true;
              }) == true) {
                e.web_checked = true;
              }else{
                e.web_checked = false;
              }
            })

            // 处理决定是否显示的数据
            rtn.forEach(function(el){
              el.do_hide = false;
            });
            show_batchs.forEach(function(e){
              if (!e.web_showChildren) {
                rtn.forEach(function(el){
                  if (el.batch_no == '' || true == el.is_batch || e.batch_no != el.batch_no) {
                    // el.do_hide = false; //不能设置为false，因为有些本来设置为true的又被修改为false
                  }else{
                    el.do_hide = true;
                  }
                })
              }
            })
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
          displayStockType: function(value){
            var type = this.checkStockType(value);
            if (3 == type) {
              return '沪港通'
            }
            if (4 == type) {
              return '深港通'
            }
          },
          changeShow: function(row){
            if (row.is_batch) {
              row.web_showChildren = !row.web_showChildren;
            }
          },
          checkDisabled: function(row){
            return (this.statusClass(row) !== 'red' || 6 == row.status || 8 == row.status || 105 == row.status || 108 == row.status) ? true : false
          },
          checkShow: function(row){
            if (row.do_hide) {
              return false;
            }
            if (row.status == 7 && this.hideRevert) {
              return false;
            }
            // if ((row.status == 5 || row.status == 105) && this.hideDeal) {
            //   return false;
            // }
            if ((this.isFinish(row) && row.status != 7 && row.status != 8) && this.hideDeal) {
              return false;
            }
            if (row.status == 8 && this.hideIssue) {
              return false;
            }

            return true;
          },
          doRevert: function(){
            var _this = this;
            var doRevertArr = [];
            var htmlArr = [];
            this.activeGridList.forEach(function(e){
              if (e.is_batch != true && e.web_checked && !(+e.cancel_status) && [1,2,4].some(function(el){
                return el == e.status
              })) {
                doRevertArr.push(e);

                htmlArr.push('<tr style="border-bottom: 1px solid #E2E2E2;"><td class="cell-left">' + e.product_name + '</td>' +
                  '<td class="cell-left">' + e.stock_id + ' ' + e.stock_name + '</td>' +
                  '<td class="cell-left">' + e.bs_symbol_text + '</td>' +
                  '<td class="cell-left">' + e.quote_type_text + '</td>'+
                  '<td class="cell-right">' + e.entrust_price + '</td>' +
                  '<td class="cell-right">' + e.entrust_amount + '</td></tr>');
                
              }
            });

            if (doRevertArr.length == 0) {
              $.omsAlert('请选择需要撤单的订单');
              return;
            }

            var html = htmlArr.join('');
            var confirmHtml = '<table class="custom_confirm"><tbody style="width:100%;display: inline-table;"><tr><th class="cell-left">'+ ((3 == orginfo_theme) ? '策略' : '交易单元') +'</th>'+
              '<th class="cell-left">证券</th>'+
              '<th class="cell-left">买卖标志</th>'+
              '<th class="cell-left">报价方式</th>'+
              '<th class="cell-right">委托价格</th>'+
              '<th class="cell-right">委托数量(股)</th></tr>'+html+'</tbody></table>';

            $.confirm({
              title: '撤单确认',
              content: confirmHtml,
              closeIcon: true,
              confirmButton: '确定',
              cancelButton: false,
              confirm: function(){
                var results = [];

                $.startLoading('正在批量撤单...');
                doRevertArr.forEach(function(order){
                  order.cancel_res = null;
                  results.push(order);
                  setTimeout(function(){
                    var url = (window.REQUEST_PREFIX||'')+'/oms/workflow/'+order.product_id+'/'+order.id +'/do_cancel?workflow_id=' + order.id;

                    if (3 != _this.orginfo_theme) {
                      url = (window.REQUEST_PREFIX||'')+'/oms/workflow/' + order.product_id + '/direct_cancel?entrust_id=' + order.entrust_id + '&stock_id=' + order.stock_code;
                      if ('marketA' == market) {
                        url += '&market=1';
                      }else if('marketHSH' == market){
                        url += '&market=2';
                      }else if('marketHSZ' == market){
                        url += '&market=3';
                      }
                    }
                    
                    $.post(url).done(function(res){
                      order.cancel_res = res;
                    }).fail(function(){
                      order.cancel_res = {code:110,msg:'网络错误！'};
                    }).always(function(){
                      _this.checkResults(results);
                    });
                  },Math.random()*500);
                });

              }
            });
          },
          checkResults: function(results){
            var _this = this;
            var waiting_num = results.filter(function(order){
                return !order.cancel_res;
            }).length;
            if(waiting_num){return;}

            var filter_res = {success:[],fail:[]};
            results.forEach(function(order){
                filter_res[$.pullValue(order,'cancel_res.code',NaN) == 0 ? 'success' : 'fail'].push(order);
            });

            $(window).trigger({
              type: 'multi_products:create_order:finish'
            });

            var htmlArr = [];

            filter_res.fail.forEach(function(e){
              htmlArr.push('<tr style="border-bottom: 1px solid #E2E2E2;"><td class="cell-left max-width-120" title="'+ e.product_name +'">' + e.product_name + '</td>' +
                '<td class="cell-left">' + e.stock_id + ' ' + e.stock_name + '</td>' +
                
                '<td class="cell-left">' + e.bs_symbol_text + '</td>' +
                // '<td class="cell-left">' + _this.entrustTypeCH(e.entrust_type) + '</td>' +
                '<td class="cell-right">' + e.entrust_price + '</td>' +
                '<td class="cell-right">' + e.entrust_amount + '</td>' +
                '<td>' + e.cancel_res.msg + '</td>' +
                '</tr>');
            });

            var html = htmlArr.join('');
            var confirmHtml = '<table class="custom_confirm"><tbody style="width:100%;display: inline-table;">'+
              '<tr>'+
              '<th class="min-width-40 max-width-120 cell-left">'+ (3 == orginfo_theme ? '策略' : '交易单元') +'</th>'+
              '<th class="min-width-40 cell-left">证券</th>'+
              '<th class="min-width-40 cell-left">买卖标志</th>'+
              '<th class="min-width-40 cell-right">委托价格</th>'+
              '<th class="min-width-40 cell-right">委托数量(股)</th>'+
              '<th class="min-width-40 cell-right">备注</th>' +
              '</tr>'+html+'</tbody></table>';

            $.clearLoading();

            if (filter_res.fail.length == 0) {
              $.omsAlert('撤单请求提交成功')
            }else{
              $.confirm({
                title: '失败提示',
                content: confirmHtml,
                closeIcon: true,
                confirmButton: '确定',
                cancelButton: false
              });
            }

            setTimeout(function(){
              _this.loadOrderList();
            });
            setTimeout(function(){
                _this.loadOrderList();
            }, 2000);
          },
          chgSelect: function(row){
            var _this = this;
            if (row.is_batch) {
              // 修改批量的选中框之后，修改其子项的选中框
              row.orders.forEach(function(e){
                e.web_checked = row.web_checked;
              })
            }
          },
          chgSelectAll: function(){
            var _this = this;
            // this.selectAll = !this.selectAll;
            this.activeGridList.forEach(function(e){
              e.web_checked = _this.selectAll;
            })
          },
          getGridList: function(str){
            let _this = this;
            var rtn = [];

            this.temporary_order = {};

            this[str].list.forEach(function(e){
              var obj = {};
              obj.web_checked = false;
              if (_this.selectList.get(e.entrust_id)) {
                obj.web_checked = true;
              }
              // 批量处理序号
              obj.batch_no = e.entrust.batch_no;
              // 证券代码
              // obj.stock_id = e.stock_info ? e.stock_info.stock_id : '';
              obj.stock_id = ('' == e.stock.code) ? (e.stock_info ? e.stock_info.stock_id : '') : e.stock.code;
              // 机构版撤单id，仅revert表格使用
              obj.entrust_id = e.entrust_id;
              // 机构版股票代码，仅revert表格使用
              obj.stock_code = e.stock ? e.stock.code : '';
              // 证券名称
              obj.stock_name = ('' == e.stock.name) ? (e.stock_info ? e.stock_info.stock_name : '') : e.stock.name;
              // 买卖标志
              obj.entrust_type = e.entrust.type;
              // 策略
              obj.product_name = e.product ? e.product.name : '';
              // 委托价格
              obj.entrust_price = e.entrust.price;
              // 委托数量
              obj.entrust_amount = e.entrust.amount;
              // 成交价格
              obj.deal_price = e.deal.price;
              // 成交数量
              obj.deal_amount = e.deal.amount;
              // 已撤数量
              // 原有接口找不到该字段，暂时不加
              // 订单状态
              obj.status = e.status;
              // 报价方式
              obj.entrust_model = e.entrust.model;
              // 委托时间
              obj.created_at = e.created_at;
              // 更新时间 //在已成交的订单中，这就是成交时间
              obj.updated_at = e.updated_at;

              obj.cancel_status = e.cancel_status;
              obj.id = e.id;
              obj.product_id = e.product_id;

              // 汇率
              obj.exchange_rate = e.entrust.exchange_rate;
              // 买卖方向
              obj.bs_symbol_text = e.entrust.bs_symbol_text;
              // 报价方式
              obj.quote_type_text = e.entrust.quote_type_text;
              // 订单状态
              obj.vendor_status_text = e.entrust.vendor_status_text;

              rtn.push(obj);
            });

            var batch_orders = {};
            rtn.forEach(function(e){
              if (e.batch_no) {
                e.sub_order = e.batch_no;
                (batch_orders[e.batch_no] = batch_orders[e.batch_no] || []).push(e);
              }
            });

            rtn = rtn.sort(function(a, b){
              // return a.batch_no < b.batch_no ? 1 : -1;
              return a.created_at < b.created_at ? 1 : -1;
            })

            var show_batchs = [];
            for(var batch_no in batch_orders){
              if (batch_orders[batch_no].length>1) {

              }
              // 得到批量的显示内容
              var first_order = batch_orders[batch_no].sort(function(o1,o2){
                return o1.updated_at>o2.updated_at ? 1 : -1;
              })[0];

              // todo 这里的参数格式要变一下
              var batch = {
                is_batch: true,

                web_checked: false,
                web_showChildren: false,

                batch_no: first_order.batch_no,
                updated_at: first_order.updated_at,
                created_at: first_order.created_at,

                orders: batch_orders[batch_no],

                // 证券代码
                stock_id : first_order.stock_id,
                // 证券名称
                stock_name : first_order.stock_name,
                // 买卖标志
                entrust_type : first_order.entrust_type,
                // 策略
                product_name : '多策略',//first_order.product_name,
                // 委托价格
                entrust_price : first_order.entrust_price,
                // 委托数量
                entrust_amount : 0, // first_order.entrust_amount,
                // 成交价格
                deal_price : 0, //first_order.deal_price,
                deal_value : 0, //first_order.deal_value,
                // 成交数量
                deal_amount : 0, //first_order.deal_amount,
                // 已撤数量
                // 原有接口找不到该字段，暂时不加
                // 订单状态
                status : 0, //first_order.status,
                // 报价方式
                entrust_model : first_order.entrust_model,
                // 委托时间
                created_at : first_order.created_at,
                // 更新时间 //在已成交的订单中，这就是成交时间
                updated_at : first_order.updated_at,

                product: {
                    name: '多策略',
                    length: batch_orders[batch_no].length
                },

                all_status: [],

                cancel_status: "",
                all_cancel_status: [],
                can_cancel: false,

                all_finish_status: []//,

                // me_can_trade: first_order.me_can_trade
              };

              batch_orders[batch_no].forEach(function(order){
                var deal_price = +$.pullValue(order,'deal_price')||0;
                var deal_amount = +$.pullValue(order,'deal_amount')||0;
                var deal_value = deal_price*deal_amount;

                // $.pushValue(order,'deal_value',deal_value);
                batch.deal_value += deal_value;
                batch.deal_amount += deal_amount;
                batch.deal_price = batch.deal_amount ? batch.deal_value/batch.deal_amount : 0;

                var entrust_amount = +$.pullValue(order,'entrust_amount')||0;
                batch.entrust_amount += entrust_amount;

                batch.all_status.push(+order.status||0);
                batch.all_cancel_status.push(+order.cancel_status||0);

                order.can_cancel = /1|2|4/.test( order.status ) && !/1|2/.test( order.cancel_status );

                order.is_finish = _this.isFinish(order);
                batch.all_finish_status.push(order.is_finish?1:0);

                //########## 断定是否可以撤单
                batch.can_cancel = batch.can_cancel || order.can_cancel;
              });

              //########### Batch 状态处理
              // 这里for循环最终执行的条件似乎是：all_status是全为一个数字元素的数组。比如说：[1,1,1,1,1,1,1]
              [1,2,3,4,5,6,7,8,9].forEach(function(status_no){
                batch.all_status.filter(function(status){return status==status_no}).length == batch.all_status.length && (batch.status = status_no);
              });
              // 这里for循环最终执行的条件似乎是：all_cancel_status是全为一个数字元素的数组。
              [1,2].forEach(function(cancel_status_no){
                batch.all_cancel_status.filter(function(cancel_status){
                  return cancel_status==cancel_status_no
                }).length == batch.all_cancel_status.length && (batch.cancel_status = cancel_status_no);
              });

              // 多策略状态展示逻辑遵守单策略订单状态显示逻辑
              // 以已完成、已完成（有废单）、未完成描述策略订单状态。
              // 1、当策略订单中有待完成的订单时：委托、部分成交、等待撤单等，显示未完成。
              // 2、当策略订单中所有订单操作时：全部成交、全部撤单显示已完成；
              // 3、当策略中有废单，其余订单全部完成时，显示：已完成（有废单）

              // 这里的枚举实在是不清楚什么含义
              if(!batch.status){
                batch.status = /0/.test( batch.all_finish_status.join('') ) ? 101 : (
                  /8/.test( batch.all_status.join('') ) ? 108 : 105
                );
              }

              show_batchs.push(batch);
            }

            // 这里实际上也包含了只有一个元素的带有batch_no的数据列，在随后的插入数据操作中注意过滤
            show_batchs = show_batchs.filter(function(e){
              return e.orders.length > 1;
            });

            show_batchs.forEach(function(e){
              var batch_no = e.batch_no;
              var index = rtn.findIndex(function(el){
                return el.batch_no == batch_no;
              });
              e.orders.forEach(function(el){
                el.is_sub = true;
              });
              rtn.splice(index, 0, e);
            });

            // this[str + '_midGridList'] = [];
            this[str + '_midGridList'] = rtn;
          },
          // 判断是否已经结束
          isFinish: function(order){
              if( order.status == 3 ){ return true; }
              if( order.status == 5 ){ return true; }
              if( order.status == 7 ){ return true; }
              if( order.status == 8 ){ return true; }
              if( order.status == 9 ){ return true; }
              if( order.status == 105 ){ return true; }
              if( order.status == 108 ){ return true; }
              if( order.order_status == 4 ){ return true; }
              if( order.cancel_status == 2 ){ return true; }
              return false;
          },
          entrustTypeCH: function(v){
            switch(v.toString()){
              case '1': return '买入';
              case '2': return '卖出';
              case '101': return '融券';
            }
          },
          entrustTypeClass: function(v){
            switch(v.toString()){
              case '1': return 'red';
              case '2': return 'blue';
              case '101': return '';
            }
          },
          statusCH: function(v){
            switch(v.toString()){
              case '1': return '等待执行';
              case '2': return '已委托';
              case '3': return '已退回';
              case '4': return '部分成交';
              case '5': return '全部成交';
              case '6': return '等待撤单';
              case '7': return '已撤单';
              case '8': return '废单';
              case '9': return '已删除';

              //多策略订单合并状态
              case '101': return '未完成';
              case '105': return '已完成';
              case '108': return '已完成（有废单）';

              //刚刚添加的订单
              case '0': return '提交中..';

              default: return '- -';
            }
          },
          statusClass: function(v){
            if (this.isFinish(v) == false && v.status != 0) {
              return 'red';
            }else{
              return '';
            }
          },
          entrustModelType: function(v){
            switch(v.toString()){
              case '1': return '限价';
              case '2': return '市价';
              case '3': return '市价(对手方最优价格)';
              case '4': return '市价(本方最优价格)';
              case '5': return '市价(即时成交剩余撤单)';
              case '6': return '市价(最优五档即时成交剩余撤单)';
              case '7': return '市价(全额成交或撤单)';
              case '8': return '市价(最优五档即时成交剩余转限)';
            }
          },
          unixTime: function(unixTimeStamp){
            if (undefined == unixTimeStamp) {
              return '--';
            }

            var momentor = /\-/.test(unixTimeStamp) ? moment : moment.unix;// if hyphen is tested, it's sqlTimeStr and use moment, else use moment.unix
            return  moment().format('YYYY-MM-DD') === momentor(unixTimeStamp).format('YYYY-MM-DD')
                ? momentor(unixTimeStamp).format('HH:mm:ss')
                : momentor(unixTimeStamp).format('M月D日 HH:mm:ss');
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
            // 机构版才获取数据
            if (3 == this.orginfo_theme) {
              return
            }

            let _this = this;
            // this.last_loading_timestamp = new Date().valueOf();

            this.query_arr.forEach(function(e){
              var last_loading_timestamp = new Date().valueOf();
              _this[e.gridDataStr].last_loading_timestamp = last_loading_timestamp;

              _this[e.gridDataStr].loadingStatus = 'loading';
              _this.loadingNum += 1;
              var url = e.uri;
              // if ('marketA' == market) {
              //   url += '&market=1';
              // }else if('marketB' == market){
              //   url += '&market=2';
              // }

              var marketType = 1;
              if ('marketA' == market) {
                marketType = 1;
              }else if('marketHSH' == market){
                marketType = 2;
              }else if('marketHSZ' == market){
                marketType = 3;
              }

              $.getJSON(url, {product_id: product_ids, market: marketType}).done(function(res){
                if( _this[e.gridDataStr].last_loading_timestamp != last_loading_timestamp ){return;}

                if (0 == res.code) {
                  var orders = res.data.list || [];
                  // 额外，更新当天所有委托信息
                  if (e.gridDataStr == 'entrustGrid') {
                    window.entrust_info = orders;
                  }
                  mergeOrderStocksInfo(orders).then(function(){
                    mergeProductsBriefInfo(orders).then(function(){
                      _this[e.gridDataStr]['list'] = orders;
                      // _this[e.gridDataStr+ '_listNum'] = orders.length;
                      _this[e.gridDataStr]['last_updated_timestamp'] = res.timestamp;

                      // 判断已有this[str].list是否有web_checked //之前这段代码在ajax调用之前，但是会有一个问题，两段代码之间的时刻，如果用户修改了web_checked，会导致记录下来的与实际不对。
                      if (_this.activeGridList) {
                        _this.activeGridList.forEach(function(e){
                          if (e.web_checked) {
                            _this.selectList.set(e.entrust_id, true);
                          }else{
                            _this.selectList.set(e.entrust_id, false);
                          }
                        });
                      }

                      _this.getGridList(e.gridDataStr);

                      if ('revertGrid' == e.gridDataStr) {
                        $(window).trigger({
                          type:'revertGrid_listNum',
                          num: orders.length
                        });
                      }
                    })
                  })
                }else{
                  if (e.gridDataStr == 'entrustGrid') {
                    window.entrust_info = [];
                  }
                }
              }).always(function(){
                _this.loadingNum -= 1;
                _this[e.gridDataStr].loadingStatus = '';
              });
            });
          }
        }
      })

      // 机构版才获取数据
      doRevert.loadOrderList();

      // 沪深 港股修改 触发修改可撤单
      $(window).on('order_create:market:changed', function(event){
        market = event.market;
        doRevert.market = market;
        doRevert.loadOrderList();
      });

      // 订单下单成功后触发该事件。
      $(window).on('multi_products:create_order:finish', function(e){
        doRevert.loadOrderList();
        setTimeout(function(){
          doRevert.loadOrderList();
        },5000);
      });

      // last_update接口触发刷新事件
      // 单纯搜索自定义事件名称是搜不出来东西的。
      // 因为以前的人用的是字符串拼接的方式。只有在维护了这种代码之后，才能够发现这种处理方式实在是极其难以维护
      // 拼接字符串的代码在 standard.blade.php 文件中
      $(window).on('entrust_update_updated',function(event){
        var flag = false;
        doRevert && doRevert.query_arr && doRevert.query_arr.forEach(function(e){
          if (doRevert[e.gridDataStr].last_updated_timestamp < event.updated_timestamp) {
            flag = true;
          }
        });

        if( flag ){
          doRevert.loadOrderList();
          // setTimeout(function(){
          //   doRevert.loadOrderList();
          // },5000);
        }
      });

      // 产品列表用户点击选中后触发。决定底部菜单的显示效果。
      $(window).on('multi_products:head:updated', function(event){
        tradeMenu.product_list = event.product_list;
        tradeMenu.checked_count = event.checked_count;
      });

      // 买入卖出股票的事件监听
      $(window).on('order_create:by_stock',function(event){
        // 判断股票属于哪个市场，切换菜单
        var stock_code = $.pullValue(event,'stock.stock_code','');
        if (/^\d{6}\.(SZ|SH)$/.test(stock_code.toUpperCase())) {
          tradeMenu.curMarket = 'marketA';
        }
        if (/^\d{5}\.(HKSH)$/.test(stock_code.toUpperCase())) {
          tradeMenu.curMarket = 'marketHSH';
        }
        if (/^\d{5}\.(HKSZ)$/.test(stock_code.toUpperCase())) {
          tradeMenu.curMarket = 'marketHSZ';
        }

        var flag = $.pullValue(event,'stock.direction','sell');
        if ('buy' == flag) {
          tradeMenu.curActive = 'single-buy';
        }else{
          tradeMenu.curActive = 'single-sell';
        }
      });

      // 可撤单数量更新
      $(window).on('revertGrid_listNum', function(event){
        tradeMenu.displayRevertNum = event.num
      });

      // 底部菜单点击后，触发到new_order.blade.php的点击，然后又触发回来，修改外层的样式。
      // 这个地方的处理完全可以在触发点击时就执行
      $(window).on('order_create:direction:changed',function(event){
        var direction = event.direction;
        board.find('>.single-stock').removeClass('sell').removeClass('buy').addClass(direction);
      });

      // 默认保存买入卖出的功能 批量不保存
      board.find('.single-stock').addClass('single').addClass('buy').show();
      var last_order_create_nav_index = $.omsGetLocalJsonData('etc','order_create_nav_index',0);
      if (1 == last_order_create_nav_index) {
        tradeMenu.curActive = 'single-sell';
      }else{
        tradeMenu.curActive = 'single-buy';
      }

    });
  </script>
</section>
