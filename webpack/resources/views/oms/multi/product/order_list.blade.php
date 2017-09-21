<!--
委托、成交列表
当前持仓
trigger:
1.open_order_by_order //用户点击订单详情，弹窗显示股票详情

on:
1.entrust_update_updated //并没有找到触发的地方了 从名字上来看 应该是委托更新时触发的事件
2.multi_load
3.multi_products:create_order:finish //触发批量下单已完成事件，此处更新委托/成交列表
4.order_list:add_temporary_order //下单后构造临时数据

 -->

<div id="order_list">
  
</div>

<script type="text/javascript">
  var orderList;
  var orginfo_theme = window.LOGIN_INFO.org_info.theme;//机构版／专户版枚举值 专户版为3，机构版为非3.

  var query_arr = [{
      id: 'entrustAndDeal',
      uri: window.REQUEST_PREFIX + '/oms/order/getEntrustAndDealList?permission_type=product&type=all&count=9999',
      gridDataStr: 'entrustAndDealGrid',
      display_rules: [{
        id: 'product_name',
        label: 3 == orginfo_theme ? '产品' : '交易单元',
        format: '',
        class: 'cell-left'
      },{
        id: 'stock_id',
        label: '证券代码',
        withStockType: true,
        format: ['hideStockType'],
        class: 'cell-left'
      },{
        id: 'stock_name',
        label: '证券名称',
        format: '',
        class: 'cell-left'
      },{
        id: 'entrust_type_name',
        label: '买卖标志',
        class: 'cell-left'
      },{
        id: 'entrust_amount_by_group',
        label: '有效委托数量',
        format: ['numeralNumber', 0],
        tips: '有效委托数量不含废单及已撤销的委托数量',
        class: 'cell-right'
      },{
        id: 'deal_volume_by_group',
        label: '成交数量',
        format: ['numeralNumber', 0],
        class: 'cell-right'
      },{
        id: 'deal_avg_price',
        label: '成交均价',
        format: ['numeralNumber', 3],
        class: 'cell-right'
      }]
    },{
    id: 'entrust',
    uri: window.REQUEST_PREFIX + '/oms/order/get_entrust_list?permission_type=product&type=all&count=9999',
    gridDataStr: 'entrustGrid',
    display_rules: [{
      id: 'stock_id',
      label: '证券代码',
      withMultiIcon: true,
      format: '',
      class: ''
    },{
      id: 'stock_name',
      label: '证券名称',
      format: '',
      class: 'cell-left'
    },{
      id: 'entrust_type',
      label: '买卖标志',
      format: ['entrustTypeCH'],
      classFormat: ['entrustTypeClass'],
      class: 'cell-left'
    },{
      id: 'product_name',
      label: '策略',
      format: '',
      class: 'cell-right'
    },{
      id: 'created_at',
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
      format: ['numeralNumber', 0],
      class: 'cell-right'
    },{
      id: 'deal_price',
      label: '成交均价',
      format: ['numeralNumber', 3],
      class: 'cell-right'
    },{
      id: 'deal_amount',
      label: '成交数量',
      format: ['numeralNumber', 0],
      class: 'cell-right'
    },{
      id: 'status',
      label: '订单状态',
      format: ['statusCH'],
      classFormat: ['statusClass'],
      class: 'cell-left'
    },{
      id: 'entrust_model',
      hide_flag: (3 == orginfo_theme) ? false : true,
      label: '报价方式',
      format: ['entrustModelType'],
      class: 'cell-left'
    },{
      id: 'updated_at',
      label: '更新时间',
      format: ['unixTime'],
      class: 'cell-right'
    }]
  }, {
    id: 'deal',
    uri: window.REQUEST_PREFIX + '/oms/order/get_deal_list?permission_type=product&count=9999',
    gridDataStr: 'dealGrid',
    display_rules: [{
      id: 'stock_id',
      label: '证券代码',
      withMultiIcon: true,
      format: '',
      class: ''
    },{
      id: 'stock_name',
      label: '证券名称',
      format: '',
      class: 'cell-left'
    },{
      id: 'entrust_type',
      label: '买卖标志',
      format: ['entrustTypeCH'],
      classFormat: ['entrustTypeClass'],
      class: 'cell-left'
    },{
      id: 'product_name',
      label: '策略',
      format: '',
      class: 'cell-right'
    },{
    //   id: 'entrust_price',
    //   label: '委托价格',
    //   format: ['numeralNumber', 3],
    //   class: 'cell-right'
    // },{
    //   id: 'entrust_amount',
    //   label: '委托数量',
    //   format: '',
    //   class: 'cell-right'
    // },{
      id: 'deal_price',
      label: '成交均价',
      format: ['numeralNumber', 3],
      class: 'cell-right'
    },{
      id: 'deal_amount',
      label: '成交数量',
      format: ['numeralNumber', 0],
      class: 'cell-right'
    },{
    //   id: 'status',
    //   label: '订单状态',
    //   format: ['statusCH'],
    //   classFormat: ['statusClass'],
    //   class: 'cell-left'
    // },{
    //   id: 'entrust_model',
    //   label: '报价方式',
    //   hide_flag: (3 == orginfo_theme) ? false : true,
    //   format: ['entrustModelType'],
    //   class: 'cell-left'
    // },{
    //   id: 'created_at',
    //   label: '委托时间',
    //   format: ['unixTime'],
    //   class: 'cell-right'
    // },{
      id: 'updated_at',
      label: '成交时间',
      format: ['unixTime'],
      class: 'cell-right'
    }]
  }, {
    id: 'revert',
    uri: window.REQUEST_PREFIX + '/oms/order/get_able_cancel_list?permission_type=product&type=all&count=9999',
    gridDataStr: 'revertGrid',
    display_rules: [{
      id: 'stock_id',
      label: '证券代码',
      withMultiIcon: true,
      format: '',
      class: ''
    },{
      id: 'stock_name',
      label: '证券名称',
      format: '',
      class: 'cell-left'
    },{
      id: 'entrust_type',
      label: '买卖标志',
      format: ['entrustTypeCH'],
      classFormat: ['entrustTypeClass'],
      class: 'cell-left'
    },{
      id: 'product_name',
      label: '策略',
      format: '',
      class: 'cell-right'
    },{
      id: 'entrust_price',
      label: '委托价格',
      format: ['numeralNumber', 3],
      class: 'cell-right'
    },{
      id: 'entrust_amount',
      label: '委托数量',
      format: ['numeralNumber', 0],
      class: 'cell-right'
    },{
      id: 'deal_price',
      label: '成交均价',
      format: ['numeralNumber', 3],
      class: 'cell-right'
    },{
      id: 'deal_amount',
      label: '成交数量',
      format: ['numeralNumber', 0],
      class: 'cell-right'
    },{
      id: 'status',
      label: '订单状态',
      format: ['statusCH'],
      classFormat: ['statusClass'],
      class: 'cell-left'
    },{
      id: 'entrust_model',
      label: '报价方式',
      hide_flag: (3 == orginfo_theme) ? false : true,
      format: ['entrustModelType'],
      class: 'cell-left'
    },{
      id: 'created_at',
      label: '委托时间',
      format: ['unixTime'],
      class: 'cell-right'
    },{
      id: 'updated_at',
      label: '更新时间',
      format: ['unixTime'],
      class: 'cell-right'
    }]
  }];

  // if (3 == orginfo_theme) {
    query_arr.length = 3;
  // }

  // 机构版，重写query_arr
  if (3 != orginfo_theme) {
    query_arr = [{
      id: 'entrustAndDeal',
      uri: window.REQUEST_PREFIX + '/oms/order/getEntrustAndDealList?permission_type=product&type=all&count=9999',
      gridDataStr: 'entrustAndDealGrid',
      display_rules: [{
        id: 'product_name',
        label: '交易单元',
        format: '',
        class: 'cell-left'
      },{
        id: 'stock_id',
        label: '证券代码',
        withStockType: true,
        format: ['hideStockType'],
        class: 'cell-left'
      },{
        id: 'stock_name',
        label: '证券名称',
        format: '',
        class: 'cell-left'
      },{
        id: 'entrust_type_name',
        label: '买卖标志',
        class: 'cell-left'
      },{
        id: 'entrust_amount_by_group',
        label: '有效委托数量',
        format: ['numeralNumber', 0],
        tips: '有效委托数量不含废单及已撤销的委托数量',
        class: 'cell-right'
      },{
        id: 'deal_volume_by_group',
        label: '成交数量',
        format: ['numeralNumber', 0],
        class: 'cell-right'
      },{
        id: 'deal_avg_price',
        label: '成交均价',
        format: ['numeralNumber', 3],
        class: 'cell-right'
      }]
    },{
      id: 'entrustListA',
      // uri: window.REQUEST_PREFIX + '/oms/order/getEntrustList?permission_type=product&type=all&count=9999&market=1',
      uri: window.REQUEST_PREFIX + '/oms/order/get_entrust_list?permission_type=product&type=all&count=9999&market=1',
      gridDataStr: 'entrustListAGrid',
      // 证券代码 证券名称 买卖标志 产品 委托价格 委托数量 成交均价 成交数量 已撤数量 订单状态 报价方式 参考汇率 委托时间 更新时间
      display_rules: [{
        id: 'stock_id',
        label: '证券代码',
        withMultiIcon: true,
        format: '',
        class: ''
      },{
        id: 'stock_name',
        label: '证券名称',
        format: '',
        class: 'cell-left'
      },{
        id: 'bs_symbol_text',
        label: '买卖标志',
        class: 'cell-left'
      },{
        id: 'product_name',
        label: '交易单元',
        class: 'cell-left'
      },{
        id: 'entrust_price',
        label: '委托价格',
        format: ['numeralNumber', 3],
        class: 'cell-right'
      },{
        id: 'entrust_amount',
        label: '委托数量',
        format: ['numeralNumber', 0],
        class: 'cell-right'
      },{
        id: 'deal_price',
        label: '成交均价',
        format: ['numeralNumber', 3],
        class: 'cell-right'
      },{
        id: 'deal_amount',
        label: '成交数量',
        format: ['numeralNumber', 0],
        class: 'cell-right'
      },{
        id: 'cancel_volume',
        label: '已撤数量',
        format: ['numeralNumber', 0],
        class: 'cell-right'
      },{
        id: 'vendor_status_text',
        label: '订单状态',
        class: 'cell-right'
      },{
        id: 'quote_type_text',
        label: '报价方式',
        format: '',
        class: 'cell-right'
      },{
        id: 'exchange_rate',
        label: '参考汇率',
        format: '',
        class: 'cell-right'
      },{
        id: 'created_at',
        label: '委托时间',
        format: ['unixTime', 3],
        class: 'cell-right'
      },{
        id: 'updated_at',
        label: '更新时间',
        format: ['unixTime', 3],
        class: 'cell-right'
      }]
    },{
      id: 'entrustListH',
      uri: window.REQUEST_PREFIX + '/oms/order/get_entrust_list?permission_type=product&type=all&count=9999&market=2',
      gridDataStr: 'entrustListHGrid',
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
        id: 'bs_symbol_text',
        label: '买卖标志',
        class: 'cell-left'
      },{
        id: 'product_name',
        label: '交易单元',
        class: 'cell-left'
      },{
        id: 'entrust_price',
        label: '委托价格',
        format: ['numeralNumber', 3],
        class: 'cell-right'
      },{
        id: 'entrust_amount',
        label: '委托数量',
        format: ['numeralNumber', 0],
        class: 'cell-right'
      },{
        id: 'deal_price',
        label: '成交均价',
        format: ['numeralNumber', 3],
        class: 'cell-right'
      },{
        id: 'deal_amount',
        label: '成交数量',
        format: ['numeralNumber', 0],
        class: 'cell-right'
      },{
        id: 'cancel_volume',
        label: '已撤数量',
        format: ['numeralNumber', 0],
        class: 'cell-right'
      },{
        id: 'vendor_status_text',
        label: '订单状态',
        class: 'cell-right'
      },{
        id: 'quote_type_text',
        label: '报价方式',
        format: '',
        class: 'cell-right'
      },{
        id: 'exchange_rate',
        label: '参考汇率',
        format: '',
        class: 'cell-right'
      },{
        id: 'stock_id',
        label: '交易市场',
        format: ['displayStockType'],
        class: 'cell-right'
      },{
        id: 'created_at',
        label: '委托时间',
        format: ['unixTime', 3],
        class: 'cell-right'
      },{
        id: 'updated_at',
        label: '更新时间',
        format: ['unixTime', 3],
        class: 'cell-right'
      }]
    }]
  }

  $(window).on('multi_load', function(event){
    var product_list = event.product_list;
    var product_ids = event.product_ids;

    orderList = new Vue({
      el: '#order_list',
      template: `
        <section class="order-list new-design">
          <a id="anchor-orderlist" style="position: relative;top:-65px;display: block;height: 0;width:0;"></a>
          <div class="hd">
            <span class="section-title">订单</span>
            
            <span class="order-list-ctrls left loading-loading list-ctrls">
              <label class="order-label" v-bind:class="{'active': curActive == 'entrustAndDeal'}">
                <input v-model="curActive" type="radio" name="display_type" value="entrustAndDeal" />
                委托成交汇总
              </label>

              <label v-if="3 == orginfo_theme" class="order-label" v-bind:class="{'active': curActive == 'entrust'}"><input v-model="curActive" type="radio" name="display_type" value="entrust" />委托明细（@{{entrustGrid_listNum || 0}}笔）</label>
              <label v-if="3 == orginfo_theme" class="order-label" v-bind:class="{'active': curActive == 'deal'}"><input v-model="curActive" type="radio" name="display_type" value="deal" />成交明细（@{{dealGrid_listNum || 0}}笔）</label>
              
              <label v-if="3 != orginfo_theme" class="order-label" v-bind:class="{'active': curActive == 'entrustListA'}">
                <input v-model="curActive" type="radio" name="display_type" value="entrustListA" />
                委托明细A（@{{entrustListAGrid_listNum || 0}}笔）
              </label>
              <label v-if="3 != orginfo_theme" class="order-label" v-bind:class="{'active': curActive == 'entrustListH'}">
                <input v-model="curActive" type="radio" name="display_type" value="entrustListH" />
                委托明细H（@{{entrustListHGrid_listNum || 0}}笔）
              </label>
            </span>
            <span v-if="'entrustListA' == curActive || 'entrustListH' == curActive || (orginfo_theme == 3 && curActive == 'entrust')" class="order-list-ctrls left loading-loading">
              <label style="margin-right: 20px;"><input style="margin-right: 5px;" type="checkbox" v-model="hideRevert" />隐藏已撤</label>
              <label style="margin-right: 20px;"><input style="margin-right: 5px;" type="checkbox" v-model="hideDeal" />隐藏已成</label>
              <label style="margin-right: 20px;"><input style="margin-right: 5px;" type="checkbox" v-model="hideIssue" />隐藏废单</label>
            </span>
            <a class="oms-btn gray refresh-btn loading-loading right" v-bind:class="{'loading': loadingNum > 0}" href="javascript:;" v-on:click="loadOrderList"><i class="oms-icon refresh"></i>刷新</a>
            <a v-if="curActive == 'revert' || (orginfo_theme == 3 && curActive == 'entrust')" class="oms-btn red revert-btn  right" href="javascript:;" v-on:click="doRevert">撤单</a>
          </div>
          <table class="oms-table loading-loading nothing-nothing" v-bind:class="{'nothing': Object.keys(temporary_order).length == 0 && activeGridList.length == 0}">
            <tbody>
              <tr>
                <th v-if="curActive == 'revert' || (orginfo_theme == 3 && curActive == 'entrust')" style="width: 40px;"></th>
                <th v-if="rule.hide_flag != true" v-for="rule in curQueryInfo.display_rules" v-bind:class="rule.class">
                  <span v-text="rule.label"></span>
                  <prompt-language style="width: 15px;display: inline-block;position: absolute;right: -10px;top: 6px;" v-if="'' != rule.tips && undefined != rule.tips" :language_val="rule.tips"></prompt-language>
                </th>
              </tr>
            </tbody>
            <tbody>
              <tr v-if="Object.keys(temporary_order).length > 0">
                <td v-if="curActive == 'revert' || (orginfo_theme == 3 && curActive == 'entrust')">
                  <input :disabled="checkDisabled(temporary_order)" type="checkbox" v-model="temporary_order.web_checked" v-on:change="chgSelect(temporary_order)" />
                </td>
                <td v-on:click="changeShow(temporary_order)" v-if="rule.hide_flag != true" v-for="rule in curQueryInfo.display_rules" v-bind:class="rule.class">
                  <span v-bind:class="displayClass(temporary_order, rule)" v-text="displayValue(temporary_order, rule)"></span>
                  <div v-if="rule.withMultiIcon && temporary_order.is_batch" v-bind:class="{'icon-show': temporary_order.web_showChildren, 'icon-hide': !temporary_order.web_showChildren}"></div>
                </td>
              </tr>
              <tr v-for="(row,index) in activeGridList" :key="index" v-show="checkShow(row)" v-bind:class="{'sub_order': row.is_sub, 'display_multi': row.web_showChildren}">
                <td v-if="curActive == 'revert' || (orginfo_theme == 3 && curActive == 'entrust')">
                  <input :disabled="checkDisabled(row)" type="checkbox" v-model="row.web_checked" v-on:change="chgSelect(row)" />
                </td>
                <td v-on:click="changeShow(row)" v-if="rule.hide_flag != true" v-for="rule in curQueryInfo.display_rules" v-bind:class="rule.class">
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
        // 已经选中的产品信息
        product_list: [],
        checked_count: 0, 

        me_can_trade: true,
        gridData: [],
        // curActive: (3 == orginfo_theme) ? 'entrust' : 'entrustAndDeal',
        curActive: 'entrustAndDeal', // 3.11.0版本，机构专户均支持entrustAndDeal
        // 记录showChildrenList为true的id
        showChildrenList: new Map(),

        orginfo_theme: orginfo_theme,
        temporary_order: {},

        hideRevert: false,
        hideDeal: false,
        hideIssue: false,

        // 委托列表
        entrustGrid: {},
        entrustGrid_listNum: 0,
        entrustGrid_midGridList: [],
        // 机构版撤单相关已无用，已经改到了底部的菜单
        revertGrid: {},
        revertGrid_listNum: 0,
        revertGrid_midGridList: [],
        // 成交列表
        dealGrid: {},
        dealGrid_listNum: 0,
        dealGrid_midGridList: [],
        // 委托成交列表
        entrustAndDealGrid: {},
        entrustAndDealGrid_listNum: 0,
        entrustAndDealGrid_midGridList: [],
        // 委托明细A
        entrustListAGrid:{},
        entrustListAGrid_listNum: 0,
        entrustListAGrid_midGridList: [],
        // 委托明细H
        entrustListHGrid:{},
        entrustListHGrid_listNum: 0,
        entrustListHGrid_midGridList: [],

        query_arr: query_arr,
        orderNum: 0,
        // last_loading_timestamp: '',
        loadingNum: 0
      },
      watch: {
        // entrustGrid_listNum: function(){
        //   $(window).trigger({
        //     type:'entrustGrid_listNum',
        //     num: this.entrustGrid_listNum
        //   });
        // },
        // revertGrid_listNum: function(){
        //   $(window).trigger({
        //     type:'revertGrid_listNum',
        //     num: this.revertGrid_listNum
        //   });
        // },
        // dealGrid_listNum: function(){
        //   $(window).trigger({
        //     type:'dealGrid_listNum',
        //     num: this.dealGrid_listNum
        //   });
        // }
      },
      computed: {
        activeGridList: function(){
          var _this = this;
          if ('entrust' == this.curActive) {
            this.entrustGrid_listNum = this.entrustGridList.length;
            return this.entrustGridList;
          }

          if ('revert' == this.curActive) {
            this.revertGrid_listNum = this.revertGridList.length;
            return this.revertGridList;
          }

          if ('deal' == this.curActive) {
            this.dealGrid_listNum = this.dealGridList.length;
            return this.dealGridList;
          }

          // 新增判断所有列表在当前组合选中情况下的数量
          if (0 != this.checked_count) {
            var tmpRtn1 = [];
            var tmpRtn2 = [];
            var tmpRtn3 = [];
            this.product_list.forEach(function(ele){
              if (true == ele.checked) {
                _this.entrustAndDealGridList.forEach(function(e){
                  if (e.product_id == ele.product_id){
                    tmpRtn1.push(e);
                  }
                });

                _this.entrustListAGridList.forEach(function(e){
                  if (e.product_id == ele.product_id){
                    tmpRtn2.push(e);
                  }
                });

                _this.entrustListHGridList.forEach(function(e){
                  if (e.product_id == ele.product_id){
                    tmpRtn3.push(e);
                  }
                });
              }
            });
            _this['entrustAndDealGrid_listNum'] = tmpRtn1.length;
            _this['entrustListAGrid_listNum'] = tmpRtn2.length;
            _this['entrustListHGrid_listNum'] = tmpRtn3.length;
          }else{
            _this['entrustAndDealGrid_listNum'] = _this.entrustAndDealGridList.length;
            _this['entrustListAGrid_listNum'] = _this.entrustListAGridList.length;
            _this['entrustListHGrid_listNum'] = _this.entrustListHGridList.length;
          }

          // 委托成交汇总
          if ('entrustAndDeal' == this.curActive) {
            if (0 == this.checked_count) {
              _this['entrustAndDealGrid_listNum'] = this.entrustAndDealGridList.length;
              return this.entrustAndDealGridList;
            }else{
              var rtn = [];
              this.product_list.forEach(function(ele){
                if (true == ele.checked) {
                  _this.entrustAndDealGridList.forEach(function(e){
                    if (e.product_id == ele.product_id){
                      rtn.push(e);
                    }
                  });
                }
              });
              _this['entrustAndDealGrid_listNum'] = rtn.length;
              return rtn;
            }
          }

          // 委托A
          if ('entrustListA' == this.curActive) {
            // return this.entrustListAGridList;
            if (0 == this.checked_count) {
              _this['entrustListAGrid_listNum'] = this.entrustListAGridList.length;
              return this.entrustListAGridList;
            }else{
              var rtn = [];
              this.product_list.forEach(function(ele){
                if (true == ele.checked) {
                  _this.entrustListAGridList.forEach(function(e){
                    if (e.product_id == ele.product_id){
                      rtn.push(e);
                    }
                  });
                }
              });
              rtn = rtn.sort(function(a,b){
                return b.created_at - a.created_at;
              });
              _this['entrustListAGrid_listNum'] = rtn.length;
              return rtn;
            }
          }

          // 委托H
          if ('entrustListH' == this.curActive) {
            // return this.entrustListHGridList;
            if (0 == this.checked_count) {
              _this['entrustListHGrid_listNum'] = this.entrustListHGridList.length;
              return this.entrustListHGridList;
            }else{
              var rtn = [];
              this.product_list.forEach(function(ele){
                if (true == ele.checked) {
                  _this.entrustListHGridList.forEach(function(e){
                    if (e.product_id == ele.product_id){
                      rtn.push(e);
                    }
                  });
                }
              });
              rtn = rtn.sort(function(a,b){
                return b.created_at - a.created_at;
              });
              _this['entrustListHGrid_listNum'] = rtn.length;
              return rtn;
            }
          }

          return [];
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
        entrustGridList: function(){
          var _this = this;
          var str = 'entrustGrid';
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
            if (_this.showChildrenList.get(e.batch_no)) {
              e.web_showChildren = true;
            }
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
        },
        dealGridList: function(){
          var str = 'dealGrid';
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
        },
        // 委托成交汇总
        entrustAndDealGridList: function(){
          var str = 'entrustAndDealGrid';
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
        },
        // 委托A
        entrustListAGridList: function(){
          var str = 'entrustListAGrid';
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
        },
        // 委托H
        entrustListHGridList: function(){
          var str = 'entrustListHGrid';
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
        },
        // 可撤单（已废弃）
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

            if (row.web_showChildren == true) {
              this.showChildrenList.set(row.batch_no, true);
            }else{
              this.showChildrenList.set(row.batch_no, false);
            }
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
                '<td class="cell-left">' + _this.entrustTypeCH(e.entrust_type) + '</td>' +
                '<td class="cell-right">' + _this.numeralNumber(e.entrust_price, 3) + '</td>' +
                '<td class="cell-right">' + e.entrust_amount + '</td></tr>');              
            }
          });

          if (doRevertArr.length == 0) {
            $.omsAlert('请选择需要撤单的订单');
            return;
          }

          var html = htmlArr.join('');
          var confirmHtml = '<table class="custom_confirm"><tbody style="width:100%;display: inline-table;"><tr><th class="cell-left">策略</th>'+
            '<th class="cell-left">证券</th>'+
            '<th class="cell-left">买卖标志</th>'+
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

          var htmlArr = [];
          filter_res.fail.forEach(function(e){
            htmlArr.push('<tr style="border-bottom: 1px solid #E2E2E2;"><td class="cell-left max-width-120" title="'+ e.product_name +'">' + e.product_name + '</td>' +
              '<td class="cell-left">' + e.stock_id + ' ' + e.stock_name + '</td>' +
              '<td class="cell-left">' + _this.entrustTypeCH(e.entrust_type) + '</td>' +
              '<td class="cell-right">' + _this.numeralNumber(e.entrust_price, 3) + '</td>' +
              '<td class="cell-right">' + e.entrust_amount + '</td>' +
              '<td>' + e.cancel_res.msg + '</td>' +
              '</tr>');
          });

          var html = htmlArr.join('');
          var confirmHtml = '<table class="custom_confirm"><tbody style="width:100%;display: inline-table;">'+
            '<tr>'+
            '<th class="min-width-40 max-width-120 cell-left">策略</th>'+
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

          // setTimeout(updateActiveOrderList);
          // // setTimeout(updateActiveOrderList,2000);
          // setTimeout(function(){
          //     // 自动刷新的流程，之前的判断流程是：last_update接口告知timestamp，而更新时取用的是loadOrderList接口调用时返回的timestamp。
          //     // 想要在分页情况下非第一页时禁止自动刷新，这里处理即可。
          //     var tmpPage = me.find('.page-ctrls .page-ctrl.active').html();
          //     if (tmpPage == 1 || undefined == tmpPage) {
          //         updateActiveOrderList();
          //         // me.find('.list-ctrls a.active').click();
          //     }
          // }, 2000);
        },
        chgSelect: function(row){
          if (row.is_batch) {
            // 修改批量的选中框之后，修改其子项的选中框
            row.orders.forEach(function(e){
              e.web_checked = row.web_checked;
            })
          }
        },
        getGridList: function(str){
          let _this = this;
          var rtn = [];
          let oldCheck = [];
          // 后端接口返回格式不统一，"委托成交汇总"接口不返回entrust、deal这样的结构，没办法，只能走特殊分支处理
          if('entrustAndDealGrid' == str){
            this[str].list.forEach(function(e){
              var obj = {};
              obj.product_id = e.product_id;
              obj.product_name = e.product_name;
              obj.deal_volume_by_group = e.deal_volume_by_group;
              obj.entrust_amount_by_group = e.entrust_amount_by_group;
              obj.stock_code = e.stock_code;
              obj.stock_id = e.stock_code;
              obj.stock_name = e.stock_name;
              obj.entrust_type_name = e.entrust_type_name;
              obj.deal_avg_price = e.deal_avg_price;
              rtn.push(obj);
            });
            this[str + '_midGridList'] = rtn;
            return;
          }

          this.temporary_order = {};

          this.activeGridList.forEach(function(e){
            if(e.web_checked){
              oldCheck.push(e.id);
            }
          })

          this[str].list.forEach(function(e){
            var obj = {};

            if(oldCheck.indexOf(e.id) != -1){
              obj.web_checked = true;
            }else{
              obj.web_checked = false;
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
            obj.entrust_amount = parseFloat(e.entrust.amount);
            // 成交均价
            obj.deal_price = e.deal.price;
            // 成交数量
            obj.deal_amount = e.deal.amount;
            // 已撤数量
            obj.cancel_volume = e.entrust.cancel_volume;
            // 订单状态
            obj.status = e.status;
            // 报价方式
            obj.entrust_model = e.entrust.model;
            // 委托时间
            obj.created_at = e.created_at;
            // 更新时间 //在已成交的订单中，这就是成交时间
            obj.updated_at = e.updated_at;

            // 汇率
            obj.exchange_rate = e.entrust.exchange_rate;
            // 买卖方向
            obj.bs_symbol_text = e.entrust.bs_symbol_text;
            // 报价方式
            obj.quote_type_text = e.entrust.quote_type_text;
            // 订单状态
            obj.vendor_status_text = e.entrust.vendor_status_text;

            obj.cancel_status = e.cancel_status;
            obj.id = e.id;
            obj.product_id = e.product_id;


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
              // 成交均价
              deal_price : 0, //first_order.deal_price,
              deal_value : 0, //first_order.deal_value,
              // 成交数量
              deal_amount : 0, //first_order.deal_amount,
              // 已撤数量
              cancel_volume: 0,
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
        // // 判断是否已经结束
        // isFinish: function(order){
        //     if( order.status == 3 ){ return true; }
        //     if( order.status == 5 ){ return true; }
        //     if( order.status == 7 ){ return true; }
        //     if( order.status == 8 ){ return true; }
        //     if( order.status == 9 ){ return true; }
        //     if( order.status == 105 ){ return true; }
        //     if( order.status == 108 ){ return true; }
        //     if( order.order_status == 4 ){ return true; }
        //     if( order.cancel_status == 2 ){ return true; }
        //     return false;
        // },
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
          let _this = this;
          // this.last_loading_timestamp = new Date().valueOf();
          this.query_arr.forEach(function(e){
            var last_loading_timestamp = new Date().valueOf();
            _this[e.gridDataStr].last_loading_timestamp = last_loading_timestamp;

            _this[e.gridDataStr].loadingStatus = 'loading';
            _this.loadingNum += 1;
            $.getJSON(e.uri, {product_id: product_ids}).done(function(res){
              if( _this[e.gridDataStr].last_loading_timestamp != last_loading_timestamp ){return;}

              if (0 == res.code) {
                var orders = res.data.list || [];
                // // 额外，更新当天所有委托信息
                // if (e.gridDataStr == 'entrustGrid') {
                //   window.entrust_info = orders;
                // }
                mergeOrderStocksInfo(orders).then(function(){
                  mergeProductsBriefInfo(orders).then(function(){
                    _this[e.gridDataStr]['list'] = orders;
                    // 计算数量，在后面根据选中产品也进行了对改字段的修改。以后面的为准
                    // 但是有些不过滤的就以此处为准
                    if (0 == _this.checked_count) {
                      _this[e.gridDataStr+ '_listNum'] = orders.length;
                    }else{
                      var ordersLength = 0;
                      _this.product_list.forEach(function(ele){
                        if (true == ele.checked) {
                          orders.forEach(function(e){
                            if (e.product_id == ele.product_id){
                              ordersLength++;
                            }
                          });
                        }
                      });
                      _this[e.gridDataStr+ '_listNum'] = ordersLength;
                    }
                    
                    _this[e.gridDataStr]['last_updated_timestamp'] = res.timestamp;
                    _this.getGridList(e.gridDataStr);
                  })
                })
              }
            }).always(function(){
              _this.loadingNum -= 1;
              _this[e.gridDataStr].loadingStatus = '';
            });
          });

          // 额外，更新当天所有委托信息
          $.getJSON(window.REQUEST_PREFIX + '/oms/order/get_entrust_list?permission_type=product&type=all', {
            count: 9999,
            product_id: product_ids
          }).done(function(res){
            if (0 == res.code) {
              var orders = res.data.list || [];
              window.entrust_info = orders;

              // mergeOrderStocksInfo(orders).then(function(){
              //   mergeProductsBriefInfo(orders).then(function(){
              //     window.entrust_info = orders;
              //   });
              // });

            }else{
              // window.entrust_info = [];
            }
          })
        }
      }
    });

    orderList.loadOrderList();
  })

  // 订单下单成功后，构造出一个临时订单，并触发该事件来修改订单页面
  $(window).on('order_list:add_temporary_order', function(e){
    // is_running页面下单完成，新增一个临时订单，需要在订单页面处理。
    var order = e.order;

    order.status = 0;
    var batch_no = $.pullValue(order,'entrust.batch_no');
    var order_id = order.id;
    // var rows_body = me.find('[rows-body]');

    if (orderList.curActive != 'entrust') {
      //当当前显示的是今日成交和历史成交时，不添加临时订单
      return false;
    }

    // 拼接出 新的数据行格式，传入组件中。（重新获取数据时，将该数据行清空）
    var temporary_order = {
      web_checked: false,
      // 批量处理序号
      // batch_no: e.entrust.batch_no,
      // 证券代码
      stock_id: order.stock.code,
      // 证券名称
      stock_name: order.stock_info.stock_name,
      // 买卖标志
      entrust_type: order.entrust.type,
      // 策略
      product_name: order.product.name,
      // 委托价格
      entrust_price: order.entrust.price,
      // 委托数量
      entrust_amount: order.entrust.amount,
      // 成交均价
      deal_price: order.deal.price,
      // 成交数量
      deal_amount: order.deal.amount,
      // 已撤数量
      cancel_volume: order.entrust.cancel_volume,
      // 订单状态
      status: e.status || 0,
      // 报价方式
      entrust_model: order.entrust.model,
      // 委托时间
      created_at: e.created_at,
      // 更新时间 //在已成交的订单中，这就是成交时间
      updated_at: order.updated_at,

      cancel_status: order.cancel_status//,
      // id: e.id,
      // product_id: e.product_id
    };

    orderList.temporary_order = temporary_order;

    // 参照原有逻辑，重新获取数据在'multi_products:create_order:finish'事件中处理，而不是在'order_list:add_temporary_order'中处理。
    // orderList.loadOrderList();
  })

  // 订单下单成功后触发该事件。
  $(window).on('multi_products:create_order:finish multi_batch:create_order:finish', function(e){
    orderList.loadOrderList();
    setTimeout(function(){
      orderList.loadOrderList();
    },5000);
  });

  // 锚点事件触发
  $(window).on('anchor-orderList-entrsut', function(){
    orderList.curActive = 'entrust';
  }).on('anchor-orderList-revert', function(){
    orderList.curActive = 'revert';
  }).on('anchor-orderList-deal', function(){
    orderList.curActive = 'deal';
  });

  // last_update接口触发刷新事件
  // 单纯搜索自定义事件名称是搜不出来东西的。
  // 因为以前的人用的是字符串拼接的方式。只有在维护了这种代码之后，才能够发现这种处理方式实在是极其难以维护
  // 拼接字符串的代码在 standard.blade.php 文件中
  $(window).on('entrust_update_updated',function(event){
    var flag = false;
    orderList && orderList.query_arr && orderList.query_arr.forEach(function(e){
      if (orderList[e.gridDataStr].last_updated_timestamp < event.updated_timestamp) {
        flag = true;
      }
    });

    if( flag ){
      orderList.loadOrderList();
      // setTimeout(function(){
      //   orderList.loadOrderList();
      // },5000);
    }
  });

  // 监听产品列表传过来的表示 用户选中产品更新 的事件
  $(window).on('multi_products:head:updated', function(event){
    orderList.product_list = event.product_list;
    orderList.checked_count = event.checked_count;
  })
</script>


