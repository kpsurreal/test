"use strict";

var _Vue$component;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectDestructuringEmpty(obj) { if (obj == null) throw new TypeError("Cannot destructure undefined"); }

/**
 * Author: jiangjian; jiangjian@gmail.com
 * 运营管理
 */

var tableData = [{
  th: "name", //证劵代码
  show_type: "text",
  name: "基金",
  class_name: "vue-product-table__align-left xc__function--ellipsis",
  style: {
    width: '220px',
    'line-height': '36px',
    'display': 'block',
    'margin-left': '0px'
  }
}, {
  th: "net_value",
  show_type: "text",
  decimal_places: 4,
  name: "单位净值",
  class_name: "vue-product-table__align-right"
}, {
  th: "total_assets",
  show_type: "text",
  decimal_places: 2,
  name: "总资产",
  class_name: "vue-product-table__align-right"
}, {
  th: "net_assets",
  show_type: "text",
  decimal_places: 2,
  name: "净资产",
  class_name: "vue-product-table__align-right"
}, {
  th: "begin_capital",
  show_type: "text",
  decimal_places: 2,
  name: "期初规模",
  class_name: "vue-product-table__align-right"
}, {
  th: "volume",
  show_type: "modify-number",
  decimal_places: 4,
  name: "份额",
  class_name: "vue-product-table__align-right",
  tip: '请输入份额',
  ajax_url: '/bms-pub/product/modify_product_group', //ajax 请求地址
  ajax_data: function ajax_data(value) {
    return { group_id: value };
  },
  //ajax默认字段,
  ajax_type: 'POST'
}, {
  th: "total_assets_sec",
  show_type: "text",
  decimal_places: 2,
  name: "证券账户总资产",
  class_name: "vue-product-table__align-right"
}, {
  th: "total_assets_ctp",
  show_type: "text",
  decimal_places: 2,
  name: "期货账户总资产",
  class_name: "vue-product-table__align-right"
  // }, {
  //   th: "total_assets_otc",
  //   show_type: "modify",
  //   name: "场外总资产",
  //   class_name: "custom-table__align-right",
}, {
  th: "cash_bank",
  show_type: "modify-number",
  decimal_places: 2,
  name: "银行存款",
  class_name: "vue-product-table__align-right",
  tip: '请输入银行存款',
  ajax_url: '/bms-pub/estimate/modify_cash', //ajax 请求地址
  ajax_data: function ajax_data(value) {
    return { group_id: value };
  },
  //ajax默认字段,
  ajax_type: 'POST'
}, {
  th: "accumulated_receive",
  show_type: "text",
  decimal_places: 2,
  name: "累计应收",
  class_name: "vue-product-table__align-right"
}, {
  th: "accumulated_pay",
  show_type: "text",
  decimal_places: 2,
  name: "累计应付",
  class_name: "vue-product-table__align-right"
}];
//产品估值列表
Vue.component('vue-operation-table', {
  props: ['tableData'],
  mixins: [numberMixin],
  data: function data() {
    return {
      table_list: [],
      isLogining: false
    };
  },

  template: "\n    <table class=\"newweb-common-grid vue-product-table\">\n      <thead>\n        <tr style=\"height:36px;border-bottom:1px solid #D7D5D5\">\n          <template v-for=\"header in tableData\">\n            <th :class=\"header.class_name\" :style=\"header.style\" style=\"height:30px;padding-left:20px;padding-right:20px;\">{{header.name}}</th>\n          </template>\n        </tr>\n      </thead>\n      <tbody>\n      <template v-if=\"table_list.length != 0\">\n        <tr v-for=\"group in table_list\" style=\"border-bottom:1px solid #D7D5D5\">\n          <template v-for=\"header in tableData\">\n            \n            <td v-if=\"header.show_type=='text'\" :class=\"header.class_name\" :style=\"header.style\" style=\"height:36px;padding-left:20px;padding-right:20px;\" :title=\"numeralNumber(group[header.th], header.decimal_places)\">{{numeralNumber(group[header.th], header.decimal_places)}}</td>\n\n            <td v-if=\"header.show_type=='modify-number'\" :class=\"header.class_name\" style=\"height:36px;padding-left:20px;padding-right:20px;\">\n              <vue-modify-product-number @modify_value=\"modify_value($event,group,header.th)\" :label=\"header.name\" :tip=\"header.tip\" :value_down=\"numeralNumber(group[header.th],header.decimal_places)\"  :ajax_url=\"header.ajax_url\"  :ajax_data=\"header.ajax_data(group.id)\" :id=\"header.th\" :ajax_type=\"header.ajax_type\"></vue-modify-product-number>\n            </td>\n            <td v-if=\"header.show_type=='modify'\" :class=\"header.class_name\" style=\"height:30px;padding-left:20px;padding-right:20px;\">{{group[header.th]}}<a class=\"modify-remark__content__icon\" @click=\"show_setting(group.id)\"></a></td>\n          </template>\n        </tr>\n      </template>\n      <template  v-if=\"table_list.length == 0\">\n        <tr>\n          <td style=\"height:30px;padding-left:20px;padding-right:20px;\">\u6682\u65E0\u57FA\u91D1\u4F30\u503C</td>\n        </tr>\n      </template>\n\n      </tbody>\n    </table>\n  ",
  mounted: function mounted() {
    this.update_list();
  },

  watch: {
    // table_list:{
    //   handler(value,old){
    //     console.log(value,old);
    //     this.update_list();
    //   },
    //   deep:true,
    // }
    // table_list(){
    //    this.update_list();
    // }
  },
  methods: {
    show_setting: function show_setting(id) {
      this.$root.show_setting(id); //修改root的 id并调整
    },
    modify_value: function modify_value(value, group, name) {
      //自定义事件，修改表格数据
      // group[name] = value;
      this.update_list();
    },
    update_list: function update_list() {
      if (this.isLogining) {
        return;
      }
      this.isLogining = true;
      var _this = this;
      $.ajax({
        url: '/bms-pub/estimate/get_list',
        type: 'GET'
      }).done(function (res) {
        if (res.code == 0) {
          _this.table_list = res.data;
        } else {
          $.omsAlert(res.msg);
        }
      }).fail(function () {
        $.omsAlert('网络异常，请重试');
      }).always(function () {
        _this.isLogining = false;
      });
    }
  }
});
//产外资产
Vue.component('vue-operation-outside', {
  props: ['option_list', 'group_id', 'product_info'],
  data: function data() {
    return {
      isLogining: false
    };
  },

  template: "\n    <div style=\"background: white;color:black;\" id=\"outside_asset\">\n      <vue-operation-search :option_list=option_list :group_id=group_id></vue-operation-search>\n      <asset-out-content :product_info=\"product_info\" :product_name=\"product_info.name\" :product_id=\"group_id\" v-if=\"product_info.cash\"></asset-out-content>\n    </div>\n  ",
  watch: {
    group_id: function group_id() {
      this.$root.pageProductInfo();
    }
  },
  methods: {
    // pageProductInfo() {
    //   var _this = this;
    //   if(this.isLogining){
    //     return
    //   }
    //   this.isLogining = true;
    //   $.ajax({
    //     url: '/bms-pub/product/otc/list?group_id=' + this.group_id,
    //     type: 'GET',
    //     success: function success(res) {
    //       if (0 == res.code) {
    //         _this.product_info = res.data;
    //       }
    //     },
    //     error: function error(res) {
    //       $.omsAlert(res.msg);
    //     }
    //   }).always(function() {
    //   _this.isLogining  = false;
    // });;
    // }
  },
  mounted: function mounted() {
    // this.pageProductInfo();
  }
});
Vue.component('asset-out-head', {
  props: ['product_list', 'product_info', 'product_id'],
  template: "\n      <div class=\"asset_out_head\">\n        <ul class=\"asset_out_head_title\">\n          <li>\n            <h1>\u573A\u5916\u8D44\u4EA7</h1>\n            <vue-selectize :options=\"options\" :placeholder=\"'\u8BF7\u5148\u9009\u62E9\u4EA7\u54C1'\" :value=\"value\" v-on:input=\"chgSelected = ($event)\"></vue-selectize>\n          </li>\n        </ul>\n        <p class=\"asset_out_head_disc\" v-if=\"product_list.length == 0\">\u5F53\u524D\u6CA1\u6709\u4EA7\u54C1\u7EC4\uFF0C\u4E0D\u652F\u6301\u573A\u5916\u8D44\u4EA7\u5F55\u5165</p>\n\n      </div>\n    ",
  data: function data() {
    return {
      chgSelected: '',
      // popup: false,
      select_show: false,
      // sele_input_show: false,
      value: ''
    };
  },
  computed: {
    options: function options() {
      //将数据通过options添加到下拉框中
      var product_arr = [];
      this.product_list.forEach(function (e) {
        var obj = {
          type: e.type,
          label: e.name,
          value: e.id
        };
        product_arr.push(obj);
      });
      return product_arr;
    },
    value: function value() {
      //默认选中第一个账户
      return this.product_id;
    }
  },
  watch: { //数据监控
    chgSelected: function chgSelected() {
      //获取选中基金产品的id
      this.$emit('change_selected', this.chgSelected);
    }
  }
});
//录入弹窗
Vue.component('asset-out-popup', {
  props: ['options_pro', "product_id", 'select_show', 'po_pup', 'product_name', 'chgTypeSelected', 'income_cash'],
  template: "\n      <div class=\"asset-out-popup\">\n        <div class=\"asset-out-popup-content\">\n          <h2 class=\"asset-out-popup-content-title\">{{getType()}}</h2>\n          <p class=\"closeBtn\" v-on:click=\"closeBtnFunc()\">x</p>\n          <table class=\"asset-out-popup-content-form\">\n            <thead>\n            <tr v-if=\"false\">\n              <td class=\"padd_bottom_20\">\u6240\u5C5E\u4EA7\u54C1\u7EC4<span>*</span></td>\n              <td style=\"position:relative;\"><input type=\"text\" disabled=\"disabled\" :title=\"product_name\" :value=\"product_name\" class=\"change_product_input\"/><span class=\"change_product_input_after\"></span></td>\n            </tr>\n            </thead>\n            <tbody v-if=\"chgTypeSelected == '1'\">\n              <tr>\n                <td class=\"padd_bottom_10\">\u5B9A\u589E\u80A1\u7968<span>*</span></td>\n                <td class=\"padd_bottom_10\">\n                  <vue-stock-search :custom_cls=\"'asset-out-popup-content-form-num'\" :stock_input_id=\"stock_input_type_id\" v-on:stock_id=\"stock_id = $event\" v-on:stock_input=\"stock_input_type_id = $event\"></vue-stock-search>\n                </td>\n              </tr>\n              <tr>\n                <td class=\"padd_bottom_10\">\u6570\u91CF<span>*</span></td>\n                <td class=\"padd_bottom_10\">\n                  <div class=\"asset-out-popup-content-form-num\"><input type=\"number\" value=\"\" placeholder=\"\u8BF7\u8F93\u5165\u6570\u91CF\" v-on:keydown=\"onlyParseIntNum()\" class=\"stock_quantity_input\"/>\u80A1</div>\n                </td>\n              </tr>\n              <tr>\n                <td class=\"padd_bottom_10\">\u5B9A\u589E\u4EF7\u683C<span>*</span></td>\n                <td class=\"padd_bottom_10\">\n                  <div class=\"asset-out-popup-content-form-num\"><input type=\"number\" value=\"\" v-on:keydown=\"onlyParseFloatNum('.price_input')\" placeholder=\"\u8BF7\u8F93\u5165\u4EF7\u683C\" class=\"price_input\"/>\u5143</div>\n                </td>\n              </tr>\n              <tr>\n                <td class=\"padd_bottom_10\">\u8D77\u59CB\u65E5\u671F<span>*</span></td>\n                <td class=\"padd_bottom_10\">\n                  <vue-zebra_date_picker v-on:clear=\"startDate = $event\" :value=\"startDate\" v-on:select=\"startDate = ($event)\" ></vue-zebra_date_picker>\n                </td>\n              </tr>\n              <tr>\n                <td class=\"padd_bottom_10\">\u89E3\u9501\u65E5\u671F<span>*</span></td>\n                <td class=\"padd_bottom_10\">\n                  <vue-zebra_date_picker :start_date_time=\"currentDate\" :value=\"currentDate\" v-on:select=\"currentDate = ($event)\" ></vue-zebra_date_picker>\n                </td>\n              </tr>\n              <tr>\n                <td colspan=\"2\" class=\"text-center-btn\">\n                  <button class=\"btn setByInputBtn\"  v-on:click=\"setByInput()\">\u786E\u5B9A</button>\n                </td>\n              </tr>\n            </tbody>\n            <tbody v-if=\"chgTypeSelected == '2'\">\n              <tr>\n                <td class=\"padd_bottom_10\">\u4EE3\u7801<span>*</span></td>\n                <td class=\"padd_bottom_10\"><input type=\"text\" value=\"\" placeholder=\"\u8BF7\u8F93\u5165\u8BC1\u5238\u4EE3\u7801\" class=\"stock_code_input\"/></td>\n              </tr>\n              <tr>\n                <td class=\"padd_bottom_10\">\u540D\u79F0<span>*</span></td>\n                <td class=\"padd_bottom_10\"><input type=\"text\" value=\"\" placeholder=\"\u8BF7\u8F93\u5165\u540D\u79F0\" class=\"stock_name\"/></td>\n              </tr>\n              <tr>\n                <td class=\"padd_bottom_10\">\u4EFD\u989D<span>*</span></td>\n                <td class=\"padd_bottom_10\"><input name=\"share\" type=\"number\" value=\"\" placeholder=\"\u8BF7\u8F93\u5165\u4EFD\u989D\" class=\"share\"/></td>\n              </tr>\n              <tr>\n                <td class=\"padd_bottom_10\">\u5E02\u503C<span>*</span></td>\n                <td class=\"padd_bottom_10\"><div class=\"asset-out-popup-content-form-num\"><input type=\"number\" value=\"\" v-on:keydown=\"onlyParseFloatNum('.market_value')\" placeholder=\"\u8BF7\u8F93\u5165\u5E02\u503C\" class=\"market_value\"/>\u5143</div></td>\n              </tr>\n              <tr>\n                <td class=\"padd_bottom_10\">\u6D6E\u76C8\u7387</td>\n                <td class=\"padd_bottom_10\"><div class=\"asset-out-popup-content-form-num\"><input type=\"number\" value=\"\" v-on:keydown=\"onlyParseFloatNum('.profit_rate')\" placeholder=\"\u8BF7\u8F93\u5165\u6D6E\u76C8\u7387\" class=\"profit_rate\"/>%</div></td>\n              </tr>\n              <tr>\n                <td colspan=\"2\" class=\"text-center-btn\"><button class=\"btn\" v-on:click=\"monetaryFundInput()\">\u786E\u5B9A</button></td>\n              </tr>\n            </tbody>\n            <tbody v-if=\"chgTypeSelected == '3'\">\n              <tr>\n                <td class=\"padd_bottom_10\">\u81EA\u52A8\u8BFB\u53D6<span>*</span></td>\n                <td class=\"padd_bottom_10\">\n                  <div class=\"asset-out-popup-content-form-num\">\n                    <form class=\"form_file\">\n                      <input style=\"display: block;\" class=\"input-disabled-file\" disabled=\"disabled\" type=\"text\" :value=\"income_cash && income_cash.read_url\" placeholder=\"\u8BF7\u5F55\u5165\u4F30\u503C\u8868\u6587\u4EF6\u540D\"/>\n                    </form>\n                    <a class=\"input-btn\" v-on:click=\"autoSwapInput()\">\u8BFB\u53D6</a>\n                  </div>\n                </td>\n              </tr>\n              <tr>\n                <td class=\"padd_bottom_10\">\u4E0A\u4F20\u6587\u4EF6<span>*</span></td>\n                <td class=\"padd_bottom_10\">\n                  <div class=\"asset-out-popup-content-form-num\">\n                    <form method=\"post\" id=\"submit_file\" target=\"iframeName\" action=\"/task/uploadxls\">\n                      <input id=\"file-upload\" name=\"file\" type=\"file\" value=\"\" placeholder=\"\u8BF7\u5F55\u5165\u4F30\u503C\u8868\u6587\u4EF6\u540D\"/>\n                    </form>\n                    <a class=\"input-btn\" v-on:click=\"incomeSwapInput()\">\u4E0A\u4F20</a>\n\n                  </div>\n                </td>\n              </tr>\n            </tbody>\n            <tbody v-if=\"chgTypeSelected == '4'\">\n              <tr>\n                <td class=\"padd_bottom_10\">\u91D1\u989D<span>*</span></td>\n                <td class=\"padd_bottom_10\"><div class=\"asset-out-popup-content-form-num\"><input type=\"number\" value=\"\" v-on:keydown=\"onlyParseFloatNum('.amount')\" placeholder=\"\u8BF7\u5F55\u5165\u91D1\u989D\" class=\"amount\"/>\u5143</div></td>\n              </tr>\n              <tr>\n                <td>\u5907\u6CE8</td>\n                <td><textarea placeholder=\"\u8BF7\u5F55\u5165\u5907\u6CE8\" class=\"write_area\"></textarea></td>\n              </tr>\n              <tr>\n                <td colspan=\"2\" class=\"text-center-btn\"><button class=\"btn\" v-on:click=\"cashInput()\">\u786E\u5B9A</button></td>\n              </tr>\n            </tbody>\n          </table>\n        </div>\n      </div>\n    ",
  data: function data() {
    return {
      chgProSelected: '',
      // chgTypeSelected: 1,
      startDate: function () {
        return moment().format('YYYY-MM-DD');
      }(),
      currentDate: '',
      stock_id: '', //股票id给后台传值
      stock_input_type_id: '', //辅助寻找input框中股票id的前6位
      options_type: [{ label: '定增', value: '1' }, { label: '场外货币基金', value: '2' }, { label: '收益互换', value: '3' }, { label: '现金', value: '4' }]
    };
  },
  methods: {
    getType: function getType() {
      if (1 == this.chgTypeSelected) {
        return '定增录入';
      } else if (2 == this.chgTypeSelected) {
        return '货币基金录入';
      } else if (3 == this.chgTypeSelected) {
        return '收益互换录入';
      } else if (4 == this.chgTypeSelected) {
        return '场外现金资产录入';
      }
      return '';
    },
    closeBtnFunc: function closeBtnFunc() {
      //弹窗关闭按钮事件
      this.stock_id = '';
      this.stock_input_type_id = '';
      this.currentDate = '';
      if (this.po_pup == true) {
        this.$emit('change_popup', false);
      }
    },
    onlyParseIntNum: function onlyParseIntNum() {//只可输入整数
      // if ((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 96 && event.keyCode <= 105) || event.keyCode == 8) {
      //   event.returnValue=true;
      // } else {
      //   event.returnValue=false;
      // }
    },
    onlyParseFloatNum: function onlyParseFloatNum(str) {
      //可输入整数和小数点，通过获取单独标签的value值来进行判断小数点的个数
      if (event.keyCode >= 48 && event.keyCode <= 57 || event.keyCode >= 96 && event.keyCode <= 105 || event.keyCode == 8 || event.keyCode == 110 || event.keyCode == 190 || event.keyCode == 189 || event.keyCode == 109) {
        if ($(str).val().indexOf('.') != -1 && event.keyCode == 110 || $(str).val().indexOf('.') != -1 && event.keyCode == 190) {
          event.preventDefault();
          return;
        }
        event.returnValue = true;
      } else {
        event.returnValue = false;
      }
    },
    setByInput: function setByInput() {
      //定增录入
      //产品组id
      if (this.product_id == '') {
        var group_id = this.chgProSelected;
      } else {
        var group_id = this.product_id;
      }
      var _this = this;

      //股票代码
      var stock_id = this.stock_id;
      //volume   持仓数量
      var volume = $(".stock_quantity_input").val();
      //stock_price 定增价格
      var stock_price = $(".price_input").val();
      //start_date 起始日期
      var start_date = this.startDate;
      //unlock_date 解锁日期
      var unlock_date = this.currentDate;
      if (group_id == '') {
        $.omsAlert('产品组id不能为空');
        return false;
      }
      if (stock_id == '') {
        $.omsAlert('请输入正确的股票代码');
        return false;
      }
      if (volume == '') {
        $.omsAlert('持仓数量不能为空');
        return false;
      }
      if (stock_price == '') {
        $.omsAlert('定增价格不能为空');
        return false;
      }
      if (start_date == '') {
        $.omsAlert('起始日期不能为空');
        return false;
      }
      if (unlock_date == '') {
        $.omsAlert('解锁日期不能为空');
        return false;
      }
      //起始日期  和  解锁日期 进行比较
      if (start_date >= unlock_date) {
        $.omsAlert('解锁日期必须大于起始日期');
        return false;
      }
      $.ajax({
        url: '/bms-pub/product/otc/private_placement/add',
        type: 'POST',
        data: {
          group_id: group_id,
          stock_id: stock_id,
          volume: volume,
          stock_price: stock_price,
          start_date: start_date,
          unlock_date: unlock_date
        },
        success: function success(res) {
          if (0 == res.code) {
            _this.$emit('change_popup', false);
            $.omsAlert("录入成功");
            //录入成功之后清空数据
            $(".stock_quantity_input").val('');
            $(".price_input").val('');
            $(".client-stockInput").val('');
            _this.stock_id = '';
            _this.stock_input_type_id = '';
            _this.currentDate = '';
            if (_this.product_id != '') {
              _this.$root.pageProductInfo(group_id);
            }
          } else {
            $.omsAlert(res.msg);
          }
        },
        error: function error() {
          $.omsAlert(res.msg);
        }
      });
    },
    monetaryFundInput: function monetaryFundInput() {
      //货币基金录入
      //产品组id
      if (this.product_id == '') {
        var group_id = this.chgProSelected;
      } else {
        var group_id = this.product_id;
      }
      //股票代码
      var stock_id = $(".stock_code_input").val();
      //stock_name 股票名称
      var stock_name = $(".stock_name").val();
      // share 份额
      var share = $('.share').val();
      //market_value   市值
      var market_value = $(".market_value").val();
      //profit_rate 浮盈率
      var profit_rate = $(".profit_rate").val() / 100;
      var _this = this;
      if (group_id == '') {
        $.omsAlert('产品组id不能为空');
        return false;
      }
      if (stock_id == '') {
        $.omsAlert('证券代码不能为空');
        return false;
      }
      if (stock_name == '') {
        $.omsAlert('名称不能为空');
        return false;
      }
      if (share == '') {
        $.omsAlert('份额不能为空');
        return false;
      }
      if (market_value == '') {
        $.omsAlert('市值不能为空');
        return false;
      }
      // if (profit_rate == '') {
      //   $.omsAlert('浮盈率不能为空');
      //   return false;
      // }
      $.ajax({
        url: '/bms-pub/product/otc/monetary_fund/add',
        type: 'POST',
        data: {
          group_id: group_id,
          stock_id: stock_id,
          stock_name: stock_name,
          volume: share,
          market_value: market_value,
          profit_rate: profit_rate
        },
        success: function success(res) {
          if (0 == res.code) {
            _this.$emit('change_popup', false);
            $.omsAlert('录入成功');
            //清空数据
            $(".stock_code_input").val('');
            $(".stock_name").val('');
            $(".market_value").val('');
            $(".profit_rate").val('');
            $('.share').val('');
            if (_this.product_id != '') {
              _this.$root.pageProductInfo(group_id);
            }
          } else {
            $.omsAlert(res.msg);
          }
        },
        error: function error() {
          $.omsAlert(res.msg);
        }
      });
    },
    autoSwapInput: function autoSwapInput() {
      //收益互换字段录入
      //产品组id
      if (this.product_id == '') {
        var group_id = this.chgProSelected;
      } else {
        var group_id = this.product_id;
      }
      var _this = this;
      //upload_file 标准上传数据流格式
      if (group_id == '') {
        $.omsAlert("产品组id不能为空");
        return false;
      }
      $.startLoading('正在读取');
      $.ajax({
        url: '/bms-pub/product/otc/income_swap/read',
        type: 'post',
        data: {
          group_id: group_id
        },
        success: function success(_ref) {
          var code = _ref.code,
              msg = _ref.msg,
              data = _ref.data;

          if (0 == code) {
            _this.$root.doRefresh();
            $.clearLoading();
            $.omsAlert('读取成功');
          } else {
            $.clearLoading();
            $.omsAlert(msg);
          }
        },
        error: function error() {
          $.clearLoading();
          $.omsAlert('网络异常，请重试');
        }
      });
    },
    incomeSwapInput: function incomeSwapInput() {
      //收益互换录入
      //产品组id
      if (this.product_id == '') {
        var group_id = this.chgProSelected;
      } else {
        var group_id = this.product_id;
      }
      var _this = this;
      //upload_file 标准上传数据流格式
      if (group_id == '') {
        $.omsAlert("产品组id不能为空");
        return false;
      }
      var form = new FormData(document.getElementById("submit_file"));

      var oFile = document.getElementById("submit_file").file.files[0];

      if (undefined == oFile) {
        $.omsAlert('请选择正确的文件');
        return false;
      }
      var reader = new FileReader();
      $.startLoading('正在读取');
      reader.onload = function (oFREvent) {
        $.ajax({
          url: '/task/uploadxls',
          // url: " {{ config('platform.utility_control_uri')}}"  + "/task/uploadxls",
          type: 'POST',
          data: form,
          processData: false,
          contentType: false,
          success: function success(res) {
            res = JSON.parse(res);
            if (res.code == 0) {
              var upload = res.data.upload;
              $.ajax({
                url: '/bms-pub/product/otc/income_swap/add',
                type: 'POST',
                data: {
                  group_id: group_id,
                  upload_file: upload
                },
                success: function success(res) {
                  if (0 == res.code) {
                    _this.$emit('change_popup', false);
                    _this.$root.doRefresh();
                    $.clearLoading();
                    $.omsAlert('录入成功');
                    // if (_this.product_id != '') {
                    //   asset_out.pageProductInfo(group_id);
                    // }
                  } else {
                    $.clearLoading();
                    $.omsAlert(res.msg);
                  }
                },
                error: function error() {
                  $.clearLoading();
                  $.omsAlert(res.msg);
                }
              });
            } else {
              $.clearLoading();
              $.omsAlert(res.msg);
            }
          },
          error: function error() {
            $.clearLoading();
            $.omsAlert('网络异常，请重试');
          }
        });
      };
      reader.onerror = function (oFREvent) {
        $.omsAlert('文件读取失败，请重试');
      };
      reader.readAsDataURL(oFile);
    },
    cashInput: function cashInput() {
      //现金录入
      //产品组id
      if (this.product_id == '') {
        var group_id = this.chgProSelected;
      } else {
        var group_id = this.product_id;
      }
      //amount   资金
      var amount = $(".amount").val();
      //备注
      var remark = $(".write_area").val();
      if (group_id == '') {
        $.omsAlert('产品组id不能为空');
        return false;
      }
      if (amount == '') {
        $.omsAlert('资金不能为空');
        return false;
      }
      var _this = this;
      $.ajax({
        url: '/bms-pub/product/otc/cash/add',
        type: 'POST',
        data: {
          group_id: group_id,
          amount: amount,
          remark: remark
        },
        success: function success(res) {
          if (0 == res.code) {
            _this.$emit('change_popup', false);
            $.omsAlert('录入成功');
            $(".amount").val('');
            $(".write_area").val('');
            if (_this.product_id != '') {
              _this.$root.pageProductInfo(group_id);
            }
          } else {
            $.omsAlert(res.msg);
          }
        },
        error: function error() {
          $.omsAlert(res.msg);
        }
      });
    }
  },
  watch: { //数据监控
    chgProSelected: function chgProSelected() {
      //获取选中基金产品的id
      this.$emit('change_pro_selected', this.chgProSelected);
    },
    chgTypeSelected: function chgTypeSelected() {
      //获取选中基金产品的id
      this.$emit('change_type_selected', this.chgTypeSelected);
    },
    stock_id: function stock_id() {
      //定增股票id
      this.$emit('change_input_id', this.stock_id);
    }
  }
});
//主体  --  子组件
Vue.component('asset-out-content', {
  mixins: [numberMixin], //在component.js中引入numberMixin插件名，就可以直接调用里面的插件内容numeralNumber
  props: ['product_info', 'product_id', 'product_name'],
  template: "\n      <div class=\"asset_out_content\">\n        <div class=\"asset_out_content_set\">\n          <p>\n            <span  v-html=\"'\u5B9A\u589E\uFF08\u5E02\u503C\uFF1A\xA5 '+ numeralNumber(set_by_markert(),2) + '\uFF09'\"></span>\n            <b class=\"trigale trigale_set\" v-on:click=\"trigaleSet()\"></b>\n            <a v-on:click=\"clear_jconfirm = true;action_type = 1;\" class=\"bem-ui-btn\" style=\"float: right;margin-right: 20px;\">\u6E05\u7A7A</a>\n            <a v-on:click=\"popup = true;chgTypeSelected = 1;\" class=\"bem-ui-btn\" style=\"float: right;margin-right: 10px;\">\u5F55\u5165\u8D44\u4EA7</a>\n          </p>\n          <table class=\"asset_out_content_set_table\" v-show=\"trigale_set_table\">\n            <thead>\n              <tr>\n                <td class=\"padd_left\">\u5B9A\u589E\u80A1\u7968</td>\n                <td class=\"padd_right_100\">\u6570\u91CF</td>\n                <td class=\"padd_right\">\u5B9A\u589E\u4EF7\u683C</td>\n                <td class=\"padd_right_150\">\u5E02\u503C</td>\n                <td class=\"padd_left padd_right_60\">\u8D77\u59CB\u65E5\u671F</td>\n                <td class=\"padd_left\">\u89E3\u9501\u65E5\u671F</td>\n                <td class=\"padd_right\"></td>\n              </tr>\n            </thead>\n            <tbody  v-for=\"private_placement in product_info.private_placement\" v-if=\"product_info.private_placement.length > 0\">\n              <tr>\n                <td class=\"padd_left\">{{private_placement.stock_id}}&nbsp;&nbsp;{{private_placement.stock_name}}</td>\n                <td class=\"padd_right_100\">{{private_placement.volume}}</td>\n                <td class=\"padd_right\">{{numeralNumber(private_placement.stock_price,3)}}</td>\n                <td class=\"padd_right_150\">{{numeralNumber(private_placement.market_value,2)}}</td>\n                <td class=\"padd_left padd_right_60\">{{private_placement.start_date}}</td>\n                <td class=\"padd_left\">{{private_placement.unlock_date}}</td>\n                <td class=\"padd_right\">\n                  <a class=\"modify\" v-on:click=\"changeModify(private_placement)\">\u4FEE\u6539</a>\n                  <a class=\"deleted\" v-on:click=\"doSetByDelete(private_placement.id)\">\u5220\u9664</a>\n                </td>\n              </tr>\n              <tr class=\"asset_out_content_set_modify\" v-show=\"change_id == private_placement.id\">\n                <td colspan=\"7\">\n                  <ul>\n                    <li>\n                      <span>\u6570\u91CF</span>\n                      <div>\n                        <input type=\"number\" v-model=\"change_val\" v-on:keydown=\"onlyParseIntNum()\"/>\u80A1\n                      </div>\n                    </li>\n                    <li>\n                      <span>\u5B9A\u589E\u4EF7\u683C</span>\n                      <div>\n                        <input type=\"number\" v-model=\"change_price\" v-on:keydown=\"onlyParseFloatNum(change_price)\"/>\u5143\n                      </div>\n                    </li>\n                    <li>\n                      <span>\u8D77\u59CB\u65E5\u671F</span>\n                      <vue-zebra_date_picker v-on:clear=\"change_start_time = $event\" :value=\"change_start_time\" v-on:select=\"change_start_time = ($event)\"></vue-zebra_date_picker>\n                    </li>\n                    <li>\n                      <span>\u89E3\u9501\u65E5\u671F</span>\n                      <vue-zebra_date_picker v-on:clear=\"change_unlock_time = $event\" :value=\"change_unlock_time\" v-on:select=\"change_unlock_time = ($event)\" ></vue-zebra_date_picker>\n                    </li>\n                    <li>\n                      <button class=\"preservation\" v-on:click=\"setByPreser(private_placement.id)\">\u4FDD\u5B58</button>\n                      <button class=\"cancel\" v-on:click=\"change_id = ''\">\u53D6\u6D88</button>\n                    </li>\n                  </ul>\n                </td>\n              </tr>\n            </tbody>\n            <tbody v-if=\"product_info.private_placement.length == 0\">\n              <tr>\n                <td colspan=\"7\" style=\"text-align:left;padding-left:10px;\"><p>\u6CA1\u6709\u76F8\u5173\u6570\u636E</p></td>\n              </tr>\n            </tbody>\n          </table>\n        </div>\n        <div class=\"asset_out_content_set\">\n          <p>\n            <span v-html=\"'\u8D27\u5E01\u57FA\u91D1\uFF08\u5E02\u503C\uFF1A\xA5 ' + numeralNumber(currency_markert(),2) + '\uFF09'\"></span>\n            <b class=\"trigale trigale_currenty_table\" v-on:click=\"trigaleCurrenty()\"></b>\n            <a v-on:click=\"clear_jconfirm = true;action_type = 2;\" class=\"bem-ui-btn\" style=\"float: right;margin-right: 20px;\">\u6E05\u7A7A</a>\n            <a v-on:click=\"popup = true;chgTypeSelected = 2;\" class=\"bem-ui-btn\" style=\"float: right;margin-right: 10px;\">\u5F55\u5165\u8D44\u4EA7</a>\n          </p>\n          <table class=\"asset_out_content_set_table\" v-show=\"trigale_currenty_table\">\n            <thead>\n              <tr>\n                <td class=\"padd_left\">\u4EE3\u7801</td>\n                <td class=\"padd_left\">\u540D\u79F0</td>\n                <td class=\"padd_right\">\u4EFD\u989D</td>\n                <td class=\"padd_right\">\u5E02\u503C</td>\n                <td class=\"padd_right\">\u6D6E\u76C8\u7387</td>\n                <td class=\"padd_right\"></td>\n              </tr>\n            </thead>\n            <tbody  v-for=\"monetary_fund in product_info.monetary_fund\" v-if=\"product_info.monetary_fund.length > 0\">\n              <tr>\n                <td class=\"padd_left\">{{monetary_fund.stock_id}}</td>\n                <td class=\"padd_left\">{{monetary_fund.stock_name}}</td>\n                <td class=\"padd_right\">{{numeralNumber(monetary_fund.volume,0)}}</td>\n                <td class=\"padd_right\">{{numeralNumber(monetary_fund.market_value,2)}}</td>\n                <td class=\"padd_right\" :class=\"{red: checkPositive(monetary_fund.profit_rate), green: checkNegative(monetary_fund.profit_rate)}\">{{numeralNumber(monetary_fund.profit_rate*100,2)+ '%'}}</td>\n                <td class=\"padd_right\">\n                  <a class=\"modify\" v-on:click=\"change_asset_id = monetary_fund.id, change_asset_market = monetary_fund.market_value, change_asset_profit = monetary_fund.profit_rate*100, change_asset_volume = monetary_fund.volume\">\u4FEE\u6539</a>\n                  <a class=\"deleted\" v-on:click=\"doMonetaryDelete(monetary_fund.id)\">\u5220\u9664</a>\n                </td>\n              </tr>\n              <tr class=\"asset_out_content_set_modify\" v-show=\"change_asset_id == monetary_fund.id\">\n                <td colspan=\"7\">\n                  <ul>\n                    <li>\n                      <span>\u4EFD\u989D</span>\n                      <div>\n                        <input type=\"number\" v-model=\"change_asset_volume\" v-on:keydown=\"onlyParseFloatNum(change_asset_volume)\"/>\n                      </div>\n                    </li>\n                    <li>\n                      <span>\u5E02\u503C</span>\n                      <div>\n                        <input type=\"number\" v-model=\"change_asset_market\" v-on:keydown=\"onlyParseFloatNum(change_asset_market)\"/>\u5143\n                      </div>\n                    </li>\n                    <li>\n                      <span>\u6D6E\u76C8\u7387</span>\n                      <div>\n                        <input type=\"number\" v-model=\"change_asset_profit\" v-on:keydown=\"onlyParseFloatNum(change_asset_profit)\"/>%\n                      </div>\n                    </li>\n                    <li>\n                      <button class=\"preservation\" v-on:click=\"monetaryPreser(monetary_fund.id)\">\u4FDD\u5B58</button>\n                      <button class=\"cancel\" v-on:click=\"change_asset_id = ''\">\u53D6\u6D88</button>\n                    </li>\n                  </ul>\n                </td>\n              </tr>\n            </tbody>\n            <tbody v-if=\"product_info.monetary_fund.length == 0\">\n              <tr>\n                <td colspan=\"7\" style=\"text-align:left;padding-left:10px;\"><p>\u6CA1\u6709\u76F8\u5173\u6570\u636E</p></td>\n              </tr>\n            </tbody>\n          </table>\n        </div>\n        <div class=\"asset_out_content_set\">\n          <p>\n            <span v-html=\"'\u6536\u76CA\u4E92\u6362\uFF08\u5E02\u503C\uFF1A\xA5 ' + numeralNumber(income_swap_markert(),2) + '\uFF09'\"></span>\n            <b class=\"trigale trigale_income_table\" v-on:click=\"trigaleIncome()\"></b>\n            <span class=\"dot-tip exclamation\" v-show=\"product_info.income_cash && product_info.income_cash.err_info != '' && product_info.income_cash.err_info != undefined\" style=\"margin-right: 10px;vertical-align: bottom;\">\n              <div v-on:mouseover=\"language_show()\" v-on:mouseout=\"language_hide()\">\n                <em>i</em>\n                <span class=\"str\">\n                  <span class=\"msg\">\n                    <span v-text=\"product_info.income_cash.err_info\"></span>\n                  </span>\n                </span>\n              </div>\n            </span>\n            <a v-on:click=\"clear_jconfirm = true;action_type = 3;\" class=\"bem-ui-btn\" style=\"float: right;margin-right: 20px;\">\u6E05\u7A7A</a>\n            <a v-on:click=\"popup = true;chgTypeSelected = 3;\" class=\"bem-ui-btn\" style=\"float: right;margin-right: 10px;\">\u5F55\u5165\u8D44\u4EA7</a>\n          </p>\n          <table class=\"asset_out_content_set_table asset_out_content_set_body\" v-show=\"trigale_income_table\">\n            <thead>\n              <tr>\n                <td class=\"padd_left\">\u5BA2\u6237\u53F7</td>\n                <td class=\"padd_left\">\u6E05\u5355\u7F16\u53F7</td>\n                <td class=\"padd_left\">\u4F30\u503C\u65E5\u671F</td>\n                <td class=\"padd_left\">\u8BC1\u5238\u4EE3\u7801</td>\n                <td class=\"padd_left\">\u8BC1\u5238\u540D\u79F0</td>\n                <td class=\"padd_left\">\u6301\u4ED3\u7C7B\u578B</td>\n                <td class=\"padd_right\">\u6807\u7684\u6570\u91CF</td>\n                <td class=\"padd_right\">\u4EA4\u6613\u8D27\u5E01</td>\n                <td class=\"padd_right\">\u671F\u521D\u4EF7\u683C</td>\n                <td class=\"padd_right\">\u5F53\u524D\u4EF7\u683C</td>\n                <td class=\"padd_right\">\u6DA8\u8DCC\u5E45</td>\n                <td class=\"padd_right\">\u603B\u6210\u672C</td>\n                <td class=\"padd_right\">\u7D2F\u8BA1\u5B9E\u73B0\u6536\u76CA</td>\n                <td class=\"padd_right\">\u603B\u6D6E\u52A8\u76C8\u4E8F</td>\n                <td class=\"padd_right\">\u5E02\u503C</td>\n              </tr>\n            </thead>\n            <tbody v-for=\"income_swap in product_info.income_swap\" v-if=\"product_info.income_swap.length > 0\" >\n              <tr>\n                <td class=\"padd_left\">{{income_swap.guest_id}}</td>\n                <td class=\"padd_left\">{{income_swap.list_number}}</td>\n                <td class=\"padd_left\">{{income_swap.valuation_date}}</td>\n                <td class=\"padd_left\">{{income_swap.security_id}}</td>\n                <td class=\"padd_left\">{{income_swap.security_name}}</td>\n                <td class=\"padd_left\" v-if=\"income_swap.position_type == ''\">--</td>\n                <td class=\"padd_left\" v-else>{{income_swap.position_type}}</td>\n                <td class=\"padd_right\">{{income_swap.hold_volume}}</td>\n                <td class=\"padd_right\">{{income_swap.currency}}</td>\n                <td class=\"padd_right\">{{numeralNumber(income_swap.begin_price,3)}}</td>\n                <td class=\"padd_right\">{{numeralNumber(income_swap.current_price,3)}}</td>\n                <td class=\"padd_right\" :class=\"{red: checkPositive(income_swap.rise_fall_rate), green: checkNegative(income_swap.rise_fall_rate)}\">{{numeralNumber(income_swap.rise_fall_rate*100,2)+ '%'}}</td>\n                <td class=\"padd_right\">{{numeralNumber(income_swap.total_cost,2)}}</td>\n                <td class=\"padd_right\">{{numeralNumber(income_swap.accumulate_profit,2)}}</td>\n                <td class=\"padd_right\">{{numeralNumber(income_swap.total_profit,2)}}</td>\n                <td class=\"padd_right\">{{numeralNumber(income_swap.market_value,2)}}</td>\n              </tr>\n            </tbody>\n            <tbody v-if=\"product_info.income_swap.length == 0\">\n              <tr>\n                <td colspan=\"15\" style=\"text-align:left;padding-left:10px;\"><p>\u6CA1\u6709\u76F8\u5173\u6570\u636E</p></td>\n              </tr>\n            </tbody>\n          </table>\n        </div>\n        <div class=\"asset_out_content_set\">\n          <p>\n            <span>\u573A\u5916\u73B0\u91D1\u8D44\u4EA7</span>\n            <b class=\"trigale trigale_asset_table\" v-on:click=\"trigaleAsset()\"></b>\n            <a v-on:click=\"clear_jconfirm = true;action_type = 4;\" class=\"bem-ui-btn\" style=\"float: right;margin-right: 20px;\">\u6E05\u7A7A</a>\n            <a v-on:click=\"popup = true;chgTypeSelected = 4;\" class=\"bem-ui-btn\" style=\"float: right;margin-right: 10px;\">\u5F55\u5165\u8D44\u4EA7</a>\n          </p>\n          <table class=\"asset_out_content_set_table\" v-show=\"trigale_asset_table\">\n            <thead>\n              <tr>\n                <td class=\"padd_left\">\u91D1\u989D</td>\n                <td class=\"padd_left\">\u5907\u6CE8</td>\n                <td class=\"padd_right\"></td>\n              </tr>\n            </thead>\n            <tbody v-for=\"cash in product_info.cash\" v-if=\"product_info.cash.length > 0\">\n              <tr>\n                <td class=\"padd_left\">{{numeralNumber(cash.amount,2)}}</td>\n                <td class=\"padd_left\" v-if=\"cash.remark != ''\">{{cash.remark}}</td>\n                <td class=\"padd_left\" v-else>--</td>\n                <td class=\"padd_right\"><a class=\"modify\" v-on:click=\"change_cash_id = cash.id, change_cash_val = cash.amount, change_cash_remark = cash.remark\">\u4FEE\u6539</a>   <a class=\"deleted\" v-on:click=\"doCashDelete(cash.id)\">\u5220\u9664</a></td>\n              </tr>\n              <tr class=\"asset_out_content_set_modify\" v-show=\"change_cash_id == cash.id\">\n                <td colspan=\"7\">\n                  <ul>\n                    <li>\n                      <span>\u91D1\u989D</span>\n                      <div>\n                        <input type=\"number\" v-model=\"change_cash_val\" v-on:keydown=\"onlyParseFloatNum(change_cash_val)\"/>\u5143\n                      </div>\n                    </li>\n                    <li>\n                      <span>\u5907\u6CE8</span>\n                      <div style=\"width:350px;\">\n                        <input type=\"text\" v-model=\"change_cash_remark\" class=\"cash_remark\" :placeholder=\"'\u6700\u591A\u4E0D\u8D85\u8FC750\u4E2A\u5B57'\"/>\n                      </div>\n                    </li>\n                    <li>\n                      <button class=\"preservation\" v-on:click=\"changePreser(cash.id)\">\u4FDD\u5B58</button>\n                      <button class=\"cancel\" v-on:click=\"change_cash_id = ''\">\u53D6\u6D88</button>\n                    </li>\n                  </ul>\n                </td>\n              </tr>\n            </tbody>\n            <tbody v-if=\"product_info.cash.length == 0\">\n              <tr>\n                <td colspan=\"7\" style=\"text-align:left;padding-left:10px;\"><p>\u6CA1\u6709\u76F8\u5173\u6570\u636E</p></td>\n              </tr>\n            </tbody>\n          </table>\n        </div>\n        <asset_jconfirm v-show=\"jconfirm\"></asset_jconfirm>\n        <clear_jconfirm v-show=\"clear_jconfirm\" :product_name=\"product_name\" :action_type=\"action_type\" v-on:doHide=\"clear_jconfirm = false;\" v-on:doClear=\"doClear()\"></clear_jconfirm>\n        <asset-out-popup v-show=\"popup\" :income_cash=\"product_info.income_cash\" :product_name=\"product_name\" :po_pup=\"popup\" :product_id=\"product_id\" :chgTypeSelected=\"chgTypeSelected\" v-on:change_popup=\"popup = $event\"></asset-out-popup>\n      </div>\n    ",
  data: function data() {
    return {
      clear_jconfirm: false,
      action_type: 1,
      chgTypeSelected: 1,
      popup: false,
      asset_show: false,
      change_id: '',
      change_cash_id: '',
      change_asset_id: '',
      change_start_time: '', //起始时间
      change_unlock_time: '', //解锁时间
      change_val: '', //定增数量
      change_price: '', //定增价格
      change_asset_market: '', //货币基金市值
      change_asset_profit: '', //货币基金浮盈率
      change_asset_volume: '', //货币基金份额
      change_cash_val: '', //场外现金
      change_cash_remark: '',
      trigale_set_table: true,
      trigale_currenty_table: true,
      trigale_income_table: true,
      trigale_asset_table: true,
      jconfirm: false
    };
  },
  methods: {
    language_show: function language_show() {
      $(this.$el).find('.str').show();
      if ($(this.$el).find('.str .msg').css('width').split('px')[0] > 246) {
        $(this.$el).find('.str .msg').addClass('hover-tip-width');
      } else {
        $(this.$el).find('.str .msg').removeClass('hover-tip-width');
      }
    },
    language_hide: function language_hide() {
      $(this.$el).find('.str').hide();
      $(this.$el).find('.str .msg').removeClass('hover-tip-width');
    },
    doClear: function doClear() {
      var _this = this;
      var url = '';
      if (1 == this.action_type) {
        url = '/bms-pub/product/otc/private_placement/clear';
      } else if (2 == this.action_type) {
        url = '/bms-pub/product/otc/monetary_fund/clear';
      } else if (3 == this.action_type) {
        url = '/bms-pub/product/otc/income_swap/clear';
      } else if (4 == this.action_type) {
        url = '/bms-pub/product/otc/cash/clear';
      }

      $.ajax({
        url: url,
        type: 'post',
        data: {
          group_id: this.product_id
        },
        success: function success(_ref2) {
          var code = _ref2.code,
              msg = _ref2.msg,
              data = _ref2.data;

          if (0 == code) {
            _this.clear_jconfirm = false;

            _this.$root.doRefresh();
          } else {
            $.omsAlert(msg);
          }
        },
        error: function error() {
          $.omsAlert('网络异常，请重试');
        }
      });
    },
    checkPositive: function checkPositive(num) {
      //比较数字大小
      return parseFloat(num) > 0;
    },
    checkNegative: function checkNegative(num) {
      //比较数字大小
      return parseFloat(num) < 0;
    },
    onlyParseIntNum: function onlyParseIntNum() {//只可输入整数
      // if ((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 96 && event.keyCode <= 105) || event.keyCode == 8) {
      //   event.returnValue=true;
      // } else {
      //   event.returnValue=false;
      // }
    },
    onlyParseFloatNum: function onlyParseFloatNum(str) {
      //可输入整数和小数点 ,直接通过input框中输入的数字的变化来进行小数点的数字判断
      //event.keyCode>=48 && event.keyCode<=57，代表主键盘0到9的数字
      //event.keyCode>=96 && event.keyCode<=105，代表小键盘0到9的数字
      //event.keyCode=8，代表BackSpace键
      //event.keyCode==110, event.keyCode==190，代表小键盘区和主键盘区的小数点
      var str = '' + str;
      if (event.keyCode >= 48 && event.keyCode <= 57 || event.keyCode >= 96 && event.keyCode <= 105 || event.keyCode == 8 || event.keyCode == 110 || event.keyCode == 190 || event.keyCode == 189 || event.keyCode == 109) {
        //只允许输入一个小数点
        if (str.indexOf('.') != -1 && event.keyCode == 110 || str.indexOf('.') != -1 && event.keyCode == 190) {
          event.preventDefault();
          return;
        }
        event.returnValue = true;
      } else {
        event.returnValue = false;
      }
    },
    changeModify: function changeModify(row) {
      //点击修改,传进一个数组，直接调用数组中的某些参数
      this.change_id = row.id;
      this.change_val = row.volume;
      this.change_price = row.stock_price;
      this.change_start_time = row.start_date;
      this.change_unlock_time = row.unlock_date;
    },
    trigaleSet: function trigaleSet() {
      //定增点击展开与收缩
      if (this.trigale_set_table == true) {
        this.trigale_set_table = false;
        $(".trigale_set").css('transform', 'rotate(180deg)');
      } else if (this.trigale_set_table == false) {
        this.trigale_set_table = true;
        $(".trigale_set").css('transform', 'rotate(360deg)');
      }
    },
    trigaleCurrenty: function trigaleCurrenty() {
      //货币 点击展开与收缩
      if (this.trigale_currenty_table == true) {
        this.trigale_currenty_table = false;
        $(".trigale_currenty_table").css('transform', 'rotate(180deg)');
      } else if (this.trigale_currenty_table == false) {
        this.trigale_currenty_table = true;
        $(".trigale_currenty_table").css('transform', 'rotate(360deg)');
      }
    },
    trigaleIncome: function trigaleIncome() {
      //收益互换点击  展开与收缩
      if (this.trigale_income_table == true) {
        this.trigale_income_table = false;
        $(".trigale_income_table").css('transform', 'rotate(180deg)');
      } else if (this.trigale_income_table == false) {
        this.trigale_income_table = true;
        $(".trigale_income_table").css('transform', 'rotate(360deg)');
      }
    },
    trigaleAsset: function trigaleAsset() {
      //场外现金 点击  展开与收缩
      if (this.trigale_asset_table == true) {
        this.trigale_asset_table = false;
        $(".trigale_asset_table").css('transform', 'rotate(180deg)');
      } else if (this.trigale_asset_table == false) {
        this.trigale_asset_table = true;
        $(".trigale_asset_table").css('transform', 'rotate(360deg)');
      }
    },
    set_by_markert: function set_by_markert() {
      //定增总市值
      var val = 0;
      this.product_info.private_placement.forEach(function (e) {
        val += parseFloat(e.market_value);
      });
      return val;
    },
    currency_markert: function currency_markert() {
      //货币基金总市值
      var val = 0;
      this.product_info.monetary_fund.forEach(function (e) {
        val += parseFloat(e.market_value);
      });
      return val;
    },
    income_swap_markert: function income_swap_markert() {
      //收益互换总市值
      var val = 0;
      this.product_info.income_swap.forEach(function (e) {
        if (e.exchange_rate != 0) {
          var market_value = e.exchange_rate * e.market_value;
          val += parseFloat(market_value);
        } else {
          val += parseFloat(e.market_value);
        }
      });
      return val;
    },
    doSetByDelete: function doSetByDelete(id) {
      //定增删除
      var _this = this;
      _this.jconfirm = true;
      $('.custom-for-delete').off().on('click', '.closeIcon', function () {
        _this.clear_jconfirm = false;
        _this.jconfirm = false;
      }).on('click', '.vue-confirm__btns--submit', function () {
        _this.jconfirm = false;
        $.ajax({
          url: '/bms-pub/product/otc/private_placement/delete',
          type: 'POST',
          data: {
            id: id
          },
          success: function success(res) {
            if (0 == res.code) {
              $.omsAlert('删除成功');
              _this.$root.pageProductInfo(_this.$root.group_id);
            } else {
              $.omsAlert(res.msg);
            }
          },
          error: function error() {
            $.omsAlert('删除失败');
          }
        });
      });
    },
    doMonetaryDelete: function doMonetaryDelete(id) {
      //货币删除
      var _this = this;
      _this.jconfirm = true;
      $('.custom-for-delete').off().on('click', '.closeIcon', function () {
        _this.clear_jconfirm = false;
        _this.jconfirm = false;
      }).on('click', '.vue-confirm__btns--submit', function () {
        _this.jconfirm = false;
        $.ajax({
          url: '/bms-pub/product/otc/monetary_fund/delete',
          type: 'POST',
          data: {
            id: id
          },
          success: function success(res) {
            if (0 == res.code) {
              $.omsAlert('删除成功');
              _this.$root.pageProductInfo(_this.$root.product_id);
            } else {
              $.omsAlert(res.msg);
            }
          },
          error: function error() {
            $.omsAlert('删除失败');
          }
        });
      });
    },
    doCashDelete: function doCashDelete(id) {
      //现金删除
      var _this = this;
      _this.jconfirm = true;
      $('.custom-for-delete').off().on('click', '.closeIcon', function () {
        _this.clear_jconfirm = false;
        _this.jconfirm = false;
      }).on('click', '.vue-confirm__btns--submit', function () {
        _this.jconfirm = false;
        $.ajax({
          url: '/bms-pub/product/otc/cash/delete',
          type: 'POST',
          data: {
            id: id
          },
          success: function success(res) {
            if (0 == res.code) {
              $.omsAlert('删除成功');
              _this.$root.pageProductInfo(_this.$root.group_id);
            } else {
              $.omsAlert(res.msg);
            }
          },
          error: function error() {
            $.omsAlert('删除失败');
          }
        });
      });
    },
    changePreser: function changePreser(id) {
      //现金资产保存
      //金额
      var amount = this.change_cash_val;
      //备注
      var remark = this.change_cash_remark;
      var _this = this;
      $.ajax({
        url: '/bms-pub/product/otc/cash/modify',
        type: 'POST',
        data: {
          id: id,
          amount: amount,
          remark: remark
        },
        success: function success(res) {
          if (0 == res.code) {
            _this.change_cash_id = '';
            //重新获取当前选中基金的内容
            _this.$root.pageProductInfo(_this.$root.group_id);
            //刷新下拉列表
            // asset_out.pageProductList();
            $.omsAlert('修改成功');
          } else {
            $.omsAlert(res.msg);
          }
        },
        error: function error() {
          $.omsAlert('网络异常');
        }
      });
    },
    monetaryPreser: function monetaryPreser(id) {
      //货币基金资产保存
      //市值
      var market_value = this.change_asset_market;
      //浮盈率
      var profit_rate = this.change_asset_profit / 100;
      //份额
      var volume = this.change_asset_volume;
      var _this = this;
      $.ajax({
        url: '/bms-pub/product/otc/monetary_fund/modify',
        type: 'POST',
        data: {
          id: id,
          market_value: market_value,
          profit_rate: profit_rate,
          volume: volume
        },
        success: function success(res) {
          if (0 == res.code) {
            _this.change_asset_id = '';
            //重新获取当前选中基金的内容
            _this.$root.pageProductInfo(_this.$root.group_id);
            //刷新下拉列表
            // asset_out.pageProductList();
            $.omsAlert('修改成功');
          } else {
            $.omsAlert(res.msg);
          }
        },
        error: function error() {
          $.omsAlert('网络异常');
        }
      });
    },
    setByPreser: function setByPreser(id) {
      //定增保存
      //数量
      var volume_val = this.change_val;
      //定增价格
      var stock_price_val = this.change_price;
      //起始日期
      var startDate_time = this.change_start_time;
      //解锁日期
      var currentDate_time = this.change_unlock_time;
      if (startDate_time == '') {
        $.omsAlert('起始日期不能为空');
        return false;
      }
      if (currentDate_time == '') {
        $.omsAlert('解锁日期不能为空');
        return false;
      }
      //起始日期  和  解锁日期 进行比较
      if (startDate_time >= currentDate_time) {
        $.omsAlert('解锁日期必须大于起始日期');
        return false;
      }
      var _this = this;
      $.ajax({
        url: '/bms-pub/product/otc/private_placement/modify',
        type: 'POST',
        data: {
          id: id,
          volume: volume_val,
          stock_price: stock_price_val,
          start_date: startDate_time,
          unlock_date: currentDate_time
        },
        success: function success(res) {
          if (0 == res.code) {
            _this.change_id = '';
            //重新获取当前选中基金的内容
            _this.$root.pageProductInfo(_this.$root.group_id);
            //刷新下拉列表
            // asset_out.pageProductList();
            $.omsAlert('修改成功');
          } else {
            $.omsAlert(res.msg);
          }
        },
        error: function error() {
          $.omsAlert('网络异常');
        }
      });
    }
  }
});

//确认删除的弹窗
Vue.component('asset_jconfirm', {
  props: ['delete_name'],
  template: "\n    <div class=\"jconfirm jconfirm-white custom-for-delete\">\n      <div class=\"jconfirm-bg seen\" style=\"transition-duration: 0.5s; transition-timing-function: cubic-bezier(0.36, 1.1, 0.2, 1); opacity: 0.2;\"></div>\n      <div class=\"jconfirm-scrollpane\">\n        <div class=\"container\">\n          <div class=\"row\">\n            <div class=\"jconfirm-box-container custom-window-width\">\n              <div class=\"jconfirm-box\" role=\"dialog\" aria-labelledby=\"jconfirm-box20474\" tabindex=\"-1\" style=\"transition-duration: 0.5s; transition-timing-function: cubic-bezier(0.36, 1.1, 0.2, 1.2); margin-top: 260px; transition-property: transform, opacity, box-shadow, margin;\">\n                <div class=\"closeIcon\" style=\"display: block;\">\xD7</div>\n                <div class=\"title-c\" style=\"text-align: left;\">\n                  <span class=\"icon-c\"></span>\n                  <span class=\"title\" id=\"jconfirm-box20474\">\u786E\u8BA4\u5220\u9664</span>\n                </div>\n                <div class=\"content-pane\" style=\"transition-duration: 0.5s; transition-timing-function: cubic-bezier(0.36, 1.1, 0.2, 1); height: 168px;\">\n                  <div class=\"content\" style=\"clip: rect(0px 750px 168px -100px);\">\n                    <div class=\"vue-confirm\">\n                      <div style=\"font-size: 14px; text-align: center; color: #000000; padding: 60px 0;\">\u786E\u8BA4\u5220\u9664\u8BE5{{delete_name}}\u8D44\u4EA7\uFF1F</div>\n                    </div>\n                  </div>\n                </div>\n                <div class=\"buttons\">\n                  <button type=\"button\" class=\"btn vue-confirm__btns--submit vue-confirm__btns--warn\">\u786E\u5B9A</button>\n                </div>\n                <div class=\"jquery-clear\">\n                </div>\n              </div>\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n  "
});
//确认清空的弹窗
// 从父组件获取到的props有：产品名称、场外资产类型
// 上报给父组件的事件有：隐藏组件、确认清空
Vue.component('clear_jconfirm', {
  props: ['product_name', 'action_type'],
  template: "\n    <div class=\"jconfirm jconfirm-white custom-for-delete\">\n      <div class=\"jconfirm-bg seen\" style=\"transition-duration: 0.5s; transition-timing-function: cubic-bezier(0.36, 1.1, 0.2, 1); opacity: 0.2;\"></div>\n      <div class=\"jconfirm-scrollpane\">\n        <div class=\"container\">\n          <div class=\"row\">\n            <div class=\"jconfirm-box-container custom-window-width\">\n              <div class=\"jconfirm-box\" role=\"dialog\" aria-labelledby=\"jconfirm-box20474\" tabindex=\"-1\" style=\"transition-duration: 0.5s; transition-timing-function: cubic-bezier(0.36, 1.1, 0.2, 1.2); margin-top: 260px; transition-property: transform, opacity, box-shadow, margin;\">\n                <div v-on:click=\"doHide\" class=\"closeIcon\" style=\"display: block;\">\xD7</div>\n                <div class=\"title-c\" style=\"text-align: left;\">\n                  <span class=\"icon-c\"></span>\n                  <span class=\"title\" id=\"jconfirm-box20474\">\u786E\u8BA4\u6E05\u7A7A</span>\n                </div>\n                <div class=\"content-pane\" style=\"transition-duration: 0.5s; transition-timing-function: cubic-bezier(0.36, 1.1, 0.2, 1); height: 168px;\">\n                  <div class=\"content\" style=\"clip: rect(0px 750px 168px -100px);\">\n                    <div class=\"vue-confirm\">\n                      <div style=\"font-size: 14px; text-align: center; color: #000000; padding: 60px 0;\">\u786E\u8BA4\u6E05\u7A7A{{product_name}}\u6240\u6709\u7684{{getActionTypeName}}\u8D44\u4EA7\uFF1F</div>\n                    </div>\n                  </div>\n                </div>\n                <div class=\"buttons\">\n                  <button v-on:click=\"doClear\" type=\"button\" class=\"btn vue-confirm__btns--warn\">\u786E\u5B9A</button>\n                </div>\n                <div class=\"jquery-clear\">\n                </div>\n              </div>\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n  ",
  data: function data() {
    return {
      options_type: [{ label: '定增', value: '1' }, { label: '场外货币基金', value: '2' }, { label: '收益互换', value: '3' }, { label: '现金', value: '4' }]
    };
  },
  computed: {
    getActionTypeName: function getActionTypeName() {
      var _this = this;
      var rtn = '';
      this.options_type.forEach(function (e) {
        if (e.value == _this.action_type) {
          rtn = e.label;
        }
      });

      return rtn;
    }
  },
  methods: {
    // 上报事件隐藏该组件
    doHide: function doHide() {
      this.$emit('doHide');
    },
    // 上报事件清空
    doClear: function doClear() {
      this.$emit('doClear');
    }
  }
});

//费用设置
Vue.component('vue-operation-cost', {
  props: ['option_list', 'group_id'],
  template: "\n    <div style=\"background: white;color:black;\">\n      <vue-operation-search :option_list=option_list :group_id=group_id></vue-operation-search>\n      <vue-operation-cost-list :group_id=group_id></vue-operation-cost-list>\n    </div>\n  "
});

//费用设置列表
Vue.component('vue-operation-cost-list', {
  props: ['group_id'],
  data: function data() {
    return {
      isLogining: false,
      fee_list: [],
      collection: {
        pay: {
          down: true,
          hide: true
        },
        charge: {
          down: true,
          hide: true
        }
      },
      exempt: {
        pay: {
          down: true,
          hide: true
        },
        charge: {
          down: true,
          hide: true
        }
      },
      temp_row: {},
      modify_hide: false
    };
  },

  template: "\n      <div class=\"operation-cost\">\n        <template v-if=\"root_product_id\">\n          <div class=\"operation-cost__title\"><span>\u5F81\u6536\u8D39\u7528({{fee_list_collection.length}})</span></div>\n          <div class=\"operation-cost__list\">\n            <template v-if=\"pay_num(fee_list_collection) > 0\">\n              <div class=\"operation-cost__list-title\">\n                <span>\u4EA7\u54C1\u5E94\u4ED8\u8D39\uFF08{{pay_num(fee_list_collection)}}\uFF09</span><i :class=\"['operation-cost__list-icon',{down:collection.pay.down}]\" @click=\"change_icon(collection.pay)\"></i>\n              </div>\n              <ul class=\"operation-cost__list-ul\" v-show=\"collection.pay.hide\">\n                <template v-for=\"row ,index in fee_list_pay(fee_list_collection)\">\n                  <li class=\"operation-cost__list-li\">\n                    <div class=\"operation-cost__list-cell\">{{show_index(index)}}</div>\n                    <div class=\"operation-cost__list-cell\">{{show_fee_type(row)}}</div>\n                    <div class=\"operation-cost__list-cell\">\n                      {{show_fee_charging_depend(row.charging_depend)}}<span style=\"margin-left: 5px;\">{{row.fee_rate*100}}%</span>\n                    </div>\n                    <div class=\"operation-cost__list-cell\">{{show_fee_charging_type(row)}}</div>\n                    <div class=\"operation-cost__list-op operation-cost__list-cell\">\n                      <span class=\"util__cp\" @click=\"modify_row(row)\">\u4FEE\u6539</span>\n                      <span class=\"util__cp\" style=\"color: red;margin-left: 30px;\" @click=\"set_type(row)\">\u8BBE\u4E3A\u514D\u5F81</span>\n                    </div>\n                  </li>\n                </template>\n              </ul>\n            </template>\n            <template v-if=\"charge_num(fee_list_collection) > 0\">\n              <div class=\"operation-cost__list-title\">\n                <span>\u4EA7\u54C1\u5E94\u6536\u8D39\uFF08{{charge_num(fee_list_collection)}}\uFF09</span><i :class=\"['operation-cost__list-icon',{down:collection.charge.down}]\" @click=\"change_icon(collection.charge)\"></i>\n              </div>\n              <ul class=\"operation-cost__list-ul\" v-show=\"collection.charge.hide\">\n                <template v-for=\"row ,index in fee_list_charge(fee_list_collection)\">\n                  <li class=\"operation-cost__list-li\">\n                    <div class=\"operation-cost__list-cell\">{{show_index(index)}}</div>\n                    <div class=\"operation-cost__list-cell\">{{show_fee_type(row)}}</div>\n                    <div class=\"operation-cost__list-cell\">\n                      {{show_fee_charging_depend(row.charging_depend)}}<span style=\"margin-left: 5px;\">{{row.fee_rate*100}}%</span>\n                    </div>\n                    <div class=\"operation-cost__list-cell\">{{show_fee_charging_type(row)}}</div>\n                    <div class=\"operation-cost__list-op operation-cost__list-cell\">\n                      <span class=\"util__cp\" @click=\"modify_row(row)\">\u4FEE\u6539</span>\n                      <span class=\"util__cp\" style=\"color: red;margin-left: 30px;\" @click=\"set_type(row)\">\u8BBE\u4E3A\u514D\u5F81</span>\n                    </div>\n                  </li>\n                </template>\n              </ul>\n            </template>\n          </div>\n          <div class=\"operation-cost__title\"><span>\u514D\u5F81\u8D39\u7528({{fee_list_exempt.length}})</span></div>\n          <div class=\"operation-cost__list\">\n            <template v-if=\"pay_num(fee_list_exempt) > 0\">\n              <div class=\"operation-cost__list-title\">\n                <span>\u4EA7\u54C1\u5E94\u4ED8\u8D39\uFF08{{pay_num(fee_list_exempt)}}\uFF09</span><i :class=\"['operation-cost__list-icon',{down:exempt.pay.down}]\" @click=\"change_icon(exempt.pay)\"></i>\n              </div>\n              <ul class=\"operation-cost__list-ul\" v-show=\"exempt.pay.hide\">\n                <template v-for=\"row ,index in fee_list_pay(fee_list_exempt)\">\n                  <li class=\"operation-cost__list-li\">\n                    <div class=\"operation-cost__list-cell\">{{show_index(index)}}</div>\n                    <div class=\"operation-cost__list-cell\">{{show_fee_type(row)}}</div>\n                    <div class=\"operation-cost__list-cell\">\n                      {{show_fee_charging_depend(row.charging_depend)}}<span style=\"margin-left: 5px;\">{{row.fee_rate*100}}%</span>\n                    </div>\n                    <div class=\"operation-cost__list-cell\">{{show_fee_charging_type(row)}}</div>\n                    <div class=\"operation-cost__list-op operation-cost__list-cell\">\n                      <span class=\"util__cp\" @click=\"modify_row(row)\">\u4FEE\u6539</span>\n                      <span class=\"util__cp\" style=\"margin-left: 30px;\" @click=\"set_type(row)\">\u8BBE\u4E3A\u5F81\u6536</span>\n                    </div>\n                  </li>\n                </template>\n              </ul>\n            </template>\n            <template v-if=\"charge_num(fee_list_exempt) > 0\">\n            <div class=\"operation-cost__list-title\">\n              <span>\u4EA7\u54C1\u5E94\u6536\u8D39\uFF08{{charge_num(fee_list_exempt)}}\uFF09</span><i :class=\"['operation-cost__list-icon',{down:exempt.charge.down}]\" @click=\"change_icon(exempt.charge)\"></i>\n            </div>\n            <ul class=\"operation-cost__list-ul\" v-show=\"exempt.charge.hide\">\n              <template v-for=\"row ,index in fee_list_charge(fee_list_exempt)\">\n                <li class=\"operation-cost__list-li\">\n                  <div class=\"operation-cost__list-cell\">{{show_index(index)}}</div>\n                  <div class=\"operation-cost__list-cell\">{{show_fee_type(row)}}</div>\n                  <div class=\"operation-cost__list-cell\">\n                    {{show_fee_charging_depend(row.charging_depend)}}<span style=\"margin-left: 5px;\">{{row.fee_rate*100}}%</span>\n                  </div>\n                  <div class=\"operation-cost__list-cell\">{{show_fee_charging_type(row)}}</div>\n                  <div class=\"operation-cost__list-op operation-cost__list-cell\">\n                    <span class=\"util__cp\" @click=\"modify_row(row)\">\u4FEE\u6539</span>\n                    <span class=\"util__cp\" style=\"margin-left: 30px;\" @click=\"set_type(row)\">\u8BBE\u4E3A\u5F81\u6536</span>\n                  </div>\n                </li>\n              </template>\n            </ul>\n            </template>\n          </div>\n          <div class=\"operation-cost__modify\" v-if=\"modify_hide\">\n            <label for=\"rate\">\u8D39\u7387\n              <input type=\"text\" name=\"rate\" v-model=\"temp_row.fee_rate\" style=\"text-indent: 9px;\" />\n              <span style=\"position: relative;left: -27px;;color: gray;\">%</span>\n            </label>\n            <label for=\"charging_basis\">\u8BA1\u8D39\u4F9D\u636E\n              <select name=\"charging_basis\" v-model=\"temp_row.charging_depend\">\n                <option value=1>\u671F\u521D\u89C4\u6A21</option>\n                <option value=2>\u51C0\u8D44\u4EA7</option>\n              </select>\n            </label>\n            <label for=\"layout_method\">\u8BA1\u63D0\u65B9\u5F0F\n              <select name=\"layout_method\" v-model=\"temp_row.charging_type\">\n                <option value=1>\u6309\u65E5\u8BA1\u8D39\u6309\u6708\u8BA1\u63D0</option>\n                <option value=2>\u6309\u65E5\u8BA1\u8D39\u6309\u5B63\u8BA1\u63D0</option>\n                <option value=3>\u6309\u65E5\u8BA1\u8D39\u6309\u5E74\u8BA1\u63D0</option>\n              </select>\n            </label>\n            <div class=\"operation-cost__modify-btn\">\n              <button class=\"operation-cost__modify-submit\" @click=\"set_setting\">{{ temp_row.status == 0 ? '\u4FDD\u5B58' : '\u4FDD\u5B58\u4E3A\u5F81\u6536' }}</button>\n              <button class=\"operation-cost__modify-cancel\" @click=\"hide\">\u53D6\u6D88</button>\n            </div>\n          </div>\n        </template>\n      </div>\n  ",
  methods: {
    set_setting: function set_setting() {
      if (this.isLogining) {
        return;
      }

      if (!this.temp_row.fee_rate) {
        $.omsAlert('请输入费率');
        return;
      }

      this.isLogining = true;
      var _this = this;
      $.ajax({
        url: '/bms-pub/portfolio/fee-modify',
        type: 'POST',
        data: {
          id: _this.temp_row.id,
          fee_rate: _this.temp_row.fee_rate / 100,
          charging_depend: _this.temp_row.charging_depend,
          charging_type: _this.temp_row.charging_type
        }
      }).done(function (res) {
        _this.isLogining = false;
        if (res.code == 0) {
          _this.get_fee_list();
          $.omsAlert('修改成功');
        } else {
          $.omsAlert(res.msg);
        }
      }).fail(function () {
        _this.isLogining = false;
        $.omsAlert('网络错误，请重试');
      }).always(function () {
        _this.modify_hide = false;
      });
    },
    set_type: function set_type(row) {
      if (this.isLogining) {
        return;
      }
      this.isLogining = true;
      var _this = this;
      var status = void 0;
      if (row.status == 0) {
        status = 1;
      }
      if (row.status == 1) {
        status = 0;
      }
      $.ajax({
        url: '/bms-pub/portfolio/fee-update-status',
        type: 'POST',
        data: {
          id: row.id,
          status: status
        }
      }).done(function (res) {
        if (res.code == 0) {
          row.status = status;
          $.omsAlert('保存成功');
        } else {
          $.omsAlert(res.msg);
        }
      }).fail(function () {
        $.omsAlert('网络错误，请重试');
      }).always(function () {
        _this.isLogining = false;
      });
    },
    hide: function hide() {
      this.modify_hide = false;
    },
    modify_row: function modify_row(row, index) {
      this.temp_row = Object.assign({}, row);
      this.temp_row.fee_rate = this.temp_row.fee_rate * 100;
      this.modify_hide = true;
    },
    get_fee_list: function get_fee_list() {
      if (this.isLogining) {
        return;
      }
      //获取所有的基金费用信息
      this.isLogining = true;
      var _this = this;
      if (!this.$root.group_id) {
        _this.isLogining = false;
        return;
      }
      $.ajax({
        url: '/bms-pub/portfolio/fee_list/' + this.group_id,
        type: 'GET'
      }).done(function (res) {
        if (0 == res.code) {

          _this.fee_list = res.data;
        } else {
          $.omsAlert(res.msg);
        }
      }).fail(function () {
        $.omsAlert('网络错误，请重试');
      }).always(function () {
        _this.isLogining = false;
        // _this.fee_list = [
        //   {
        //       "id": 10026, //id
        //       "fee_rate": 1.000,   //费率,
        //       "fee_type": 1, //费用类型，1管理费，2退出费，3风控顾问费，4信托通道费，5其他应付费
        //       "status": 0,//0征收，1免征
        //        "earning_type": 2,//1应付，2应收          
        //       "charging_depend": 1,        //计费依据，1期初规模，2前一日净资产
        //       "charging_type": 1,//1按日计费按月计提、2按日计费按季计提、3按日计费按年计提
        //   },{
        //       "id": 10026, //id
        //       "fee_rate": 1.000,   //费率,
        //       "fee_type": 2, //费用类型，1管理费，2退出费，3风控顾问费，4信托通道费，5其他应付费
        //       "status": 1,//0征收，1免征
        //        "earning_type": 1,//1应付，2应收          
        //       "charging_depend": 2,        //计费依据，1期初规模，2前一日净资产
        //       "charging_type": 3,//1按日计费按月计提、2按日计费按季计提、3按日计费按年计提
        //   },{
        //       "id": 10026, //id
        //       "fee_rate": 1.000,    //费率,
        //       "fee_type": 3, //费用类型，1管理费，2退出费，3风控顾问费，4信托通道费，5其他应付费
        //       "status": 0,//0征收，1免征
        //       "earning_type": 1,//1应付，2应收          
        //       "charging_depend": 1,        //计费依据，1期初规模，2前一日净资产
        //       "charging_type": 2,//1按日计费按月计提、2按日计费按季计提、3按日计费按年计提
        //   },{
        //       "id": 10026, //id
        //       "fee_rate": 1.000,   //费率,
        //       "fee_type": 4, //费用类型，1管理费，2退出费，3风控顾问费，4信托通道费，5其他应付费
        //       "status": 0,//0征收，1免征
        //        "earning_type": 2,//1应付，2应收          
        //       "charging_depend": 2,        //计费依据，1期初规模，2前一日净资产
        //       "charging_type": 1,//1按日计费按月计提、2按日计费按季计提、3按日计费按年计提
        //   },{
        //       "id": 10026, //id
        //       "fee_rate": 1.000,  //费率,
        //       "fee_type": 5, //费用类型，1管理费，2退出费，3风控顾问费，4信托通道费，5其他应付费
        //       "status": 0,//0征收，1免征
        //        "earning_type": 2,//1应付，2应收          
        //       "charging_depend": 1,        //计费依据，1期初规模，2前一日净资产
        //       "charging_type": 3,//1按日计费按月计提、2按日计费按季计提、3按日计费按年计提
        //   },{
        //       "id": 10026, //id
        //       "fee_rate": 1.000,   //费率,
        //       "fee_type": 1, //费用类型，1管理费，2退出费，3风控顾问费，4信托通道费，5其他应付费
        //       "status": 1,//0征收，1免征
        //       "earning_type": 1,//1应付，2应收          
        //       "charging_depend": 1,        //计费依据，1期初规模，2前一日净资产
        //       "charging_type": 2,//1按日计费按月计提、2按日计费按季计提、3按日计费按年计提
        //   },{
        //       "id": 10026, //id
        //       "fee_rate": 1.000,    //费率,
        //       "fee_type": 2, //费用类型，1管理费，2退出费，3风控顾问费，4信托通道费，5其他应付费
        //       "status": 0,//0征收，1免征
        //       "earning_type": 2,//1应付，2应收          
        //       "charging_depend":1,//计费依据，1期初规模，2前一日净资产
        //       "charging_type": 1,//1按日计费按月计提、2按日计费按季计提、3按日计费按年计提
        //   },
        // ];
      });
    },
    pay_num: function pay_num(arr) {
      var temp = arr.filter(function (ele) {
        return ele.earning_type == 1;
      });
      return temp.length;
    },
    charge_num: function charge_num(arr) {
      var temp = arr.filter(function (ele) {
        return ele.earning_type == 2;
      });
      return temp.length;
    },
    show_index: function show_index(index) {
      index = index + 1;
      if (index < 10) {
        return '0' + index;
      } else {
        return index;
      }
    },
    change_icon: function change_icon(ele) {
      ele.down = !ele.down;
      ele.hide = !ele.hide;
    },
    fee_list_charge: function fee_list_charge(list) {
      return list.filter(function (ele) {
        return ele.earning_type == 2;
      }) || [];
    },
    fee_list_pay: function fee_list_pay(list) {
      return list.filter(function (ele) {
        return ele.earning_type == 1;
      }) || [];
    },
    show_fee_type: function show_fee_type(row) {
      var type = row.fee_type;
      var earning_type = row.earning_type;

      if (earning_type == 1) {
        switch (type) {
          case '1':
            return '管理费';
          case '2':
            return '托管费';
          case '3':
            return '投顾费';
          case '4':
            return '风控顾问费';
          case '5':
            return '信托报酬';
          case '6':
            return '销售服务费';
          case '7':
            return '其他应付费';
          default:
            break;
        }
      } else if (earning_type == 2) {
        switch (type) {
          case '1':
            return '信保';
          case '2':
            return '其他应收费';
          default:
            break;
        }
      }
    },
    show_fee_charging_type: function show_fee_charging_type(row) {
      var temp = +row.fee_rate * 100;
      switch (row.charging_type) {
        case '1':
          return '按日计费按月计提【每日费用＝（' + this.show_fee_charging_depend(row.charging_depend) + '×' + temp + '%）÷当年天数】';
        case '2':
          return '按日计费按季计提【每日费用＝（' + this.show_fee_charging_depend(row.charging_depend) + '×' + temp + '%）÷当年天数】';
        case '3':
          return '按日计费按年计提【每日费用＝（' + this.show_fee_charging_depend(row.charging_depend) + '×' + temp + '%）÷当年天数】';
        default:
          break;
      }
    },
    show_fee_charging_depend: function show_fee_charging_depend(type) {
      switch (type) {
        case '1':
          return '期初规模';
        case '2':
          return '净资产';
        default:
          break;
      }
    }
  },
  computed: {
    fee_list_exempt: function fee_list_exempt() {
      return this.fee_list.filter(function (ele) {
        return ele.status == 1; //免征
      });
    },
    fee_list_collection: function fee_list_collection() {
      return this.fee_list.filter(function (ele) {
        return ele.status == 0; //征收
      });
    },
    root_product_id: function root_product_id() {
      return this.$root.group_id;
    }
  },
  watch: {
    group_id: function group_id() {
      this.get_fee_list();
    }
  },
  mounted: function mounted() {
    this.get_fee_list();
  }
});
//下拉框
Vue.component('vue-operation-search', {
  props: ['option_list', 'group_id'],
  data: function data() {
    return {
      select: '',
      isLogining: false
    };
  },

  template: "\n  <div class=\"operation-header\">\n    <h2 class=\"operation-header__h2\">\u9009\u62E9\u57FA\u91D1</h2>\n    <select class=\"operation-header__select\" multiple placeholder=\"\u8BF7\u9009\u62E9\u57FA\u91D1\"></select>\n  </div>\n  ",
  methods: {
    select_init: function select_init() {
      var self = this;
      var options = this.option_list;
      this.select = $(this.$el).find('.operation-header__select').selectize({
        maxItems: 1,
        valueField: 'id',
        labelField: 'name',
        searchField: 'name',
        options: options,
        create: false,
        onChange: function onChange() {
          self.$root.group_id = this.getValue()[0];
        }
      });
      //设置默认值
      if (this.$root.group_id) {
        this.select[0].selectize.setValue([this.$root.group_id]);
      }
    }
  },
  watch: {
    group_id: function group_id(val) {
      this.select[0].selectize.setValue([val]);
      this.$root.pageProductInfo(val);
    },

    // option_list(){

    //   this.select_init();;
    // }
    option_list: {
      handler: function handler() {
        this.select[0].selectize.clearOptions();
        this.select[0].selectize.addOption(this.option_list);
        if (this.$root.group_id) {
          this.select[0].selectize.setValue([this.$root.group_id]);
        }
      },

      deep: true
    }
  },
  mounted: function mounted() {
    this.select_init();
  }

});
//停牌估值
//数据
var comGridSortData = {
  order: '',
  order_by: '',
  display_rules: [{
    id: 'name', // 变量id
    label: '持仓产品', // 变量显示名称
    format: '', // 格式化处理函数，不能提前进行处理，因为数据还要用来排序什么的。此处的处理理解为只为显示，脱离于逻辑 （函数定义于vue中）
    class: 'left20' // 样式
  }, {
    id: 'operator',
    label: '基金经理',
    hideSort: true,
    format: '',
    class: 'left20'
  }, {
    id: 'stock_display', // stock_id和stock_name拼起来
    label: '停牌股票',
    format: '',
    class: 'left20'
  }, {
    id: 'influence_rate',
    label: '指数变动对净值影响比例',
    format: ['numeralPercent'],
    class: 'right20'
  }, {
    id: 'weight',
    label: '持仓权重',
    format: ['numeralPercent'],
    class: 'right20'
  }, {
    id: 'suspend_date',
    label: '停牌日',
    hideSort: true,
    format: '', //['numeralNumber', 2],
    class: 'right20'
  }, {
    id: 'market_value',
    label: '停牌日市值',
    hideSort: true,
    format: ['numeralNumber', 2],
    class: 'right20'
  }, {
    id: 'amac_display', // amac_name和amac_index拼起来
    label: '行业代码',
    hideSort: true,
    format: '',
    class: 'left20'
  }, {
    id: 'amac_price',
    label: '今日指数',
    hideSort: true,
    format: ['numeralNumber', 4],
    class: 'left20',
    unit: '' // 附带后缀单位
  }, {
    id: 'amac_last_price',
    label: '停牌日指数',
    hideSort: true,
    format: ['numeralNumber', 4],
    class: 'left20',
    unit: '' // 附带后缀单位
  }, {
    //   id: 'adjust_market_value',
    //   label: '调整前市值',
    //   hideSort: true,
    //   format: ['numeralNumber', 2],
    //   class: 'left20',
    //   unit: ''                   // 附带后缀单位
    // },{
    id: 'modify_market_value',
    label: '调整后市值',
    hideSort: true,
    // format: ['numeralNumber', 2],
    class: 'left20',
    modify_component: true,
    unit: '' // 附带后缀单位
  }]
  //控件
};Vue.component('vue-operation-suspension', (_Vue$component = {
  props: ['product_info'],
  data: function data() {
    return {
      active_stock: '',
      display_rules: comGridSortData.display_rules,
      order: comGridSortData.order,
      order_by: comGridSortData.order_by,
      stock_list: []
    };
  },

  template: "\n    <section v-cloak id=\"suspension\" class=\"section-container\" style=\"padding-bottom: 120px;\">\n    <table class=\"journel-sheet-grid\">\n      <thead>\n        <tr>\n        <!-- <draggable :list=\"display_rules\" element=\"tr\" :options=\"dragOptions\" @move=\"onMove\" @end=\"onEnd\"> -->\n          <th v-bind:class=\"rule.class\" v-for=\"rule in display_rules\">\n            <span v-html=\"rule.label\"></span>\n            <a v-if=\"!rule.hideSort\" class=\"icon-sortBy\" v-on:click=\"chgSort(rule.id)\">\n              <i class=\"icon-asc\" :class=\"{active: (order_by == rule.id && order == 'asc')}\"></i>\n              <i class=\"icon-desc\" :class=\"{active: (order_by == rule.id && order == 'desc')}\"></i>\n            </a>\n          </th>\n        <!-- </draggable> -->\n          <th></th>\n        </tr>\n      </thead>\n      <tbody>\n        <tr v-if=\"display_stocks.length > 0\" v-for=\"sub_value in display_stocks\">\n          <td v-for=\"rule in display_rules\" v-bind:class=\"rule.class\">\n            <span v-if=\"sub_value.is_adjust == 0 || rule.modify_component != true\" v-text=\"displayValue(sub_value, rule)\"></span>\n            <vue-custom-modify v-if=\"(sub_value.is_adjust == 1 || sub_value.is_adjust == 2) && rule.modify_component == true\" :id=\"'market_value'\" :value=\"displayValue(sub_value, rule)\" :ajax_url=\"getAjaxUrl()\" :ajax_data=\"{id: sub_value.id}\" :digital_num=\"2\" v-on:modify_value=\"modify_value($event)\"></vue-custom-modify>\n          </td>\n          <td>\n            <a v-if=\"sub_value.is_adjust == 0\" v-on:click=\"doConfigAdjust(sub_value.id, true)\" class=\"newweb-common-grid__config-btn\">\u4F30\u503C\u8C03\u6574</a>\n            <a v-if=\"sub_value.is_adjust == 1 || sub_value.is_adjust == 2\" v-on:click=\"doConfigAdjust(sub_value.id, false)\" class=\"newweb-common-grid__cancel-btn\">\u53D6\u6D88\u8C03\u6574</a>\n          </td>\n        </tr>\n        <tr v-if=\"display_stocks.length == 0\">\n          <td colspan=\"999\">\u6682\u65E0\u505C\u724C\u80A1\u7968</td>\n        </tr>\n      </tbody>\n    </table>\n\n    <div class=\"left-right-grid\">\n    <!--\n      <dl class=\"left-right-grid__left\">\n        <dt class=\"left-right-grid__sub-grid--title\" v-text=\"'\u7B2C\u4E00\u6B65\uFF1A\u9009\u62E9\u505C\u724C\u80A1\u7968'\"></dt>\n        <dd v-show=\"stock_list.length > 0\" v-for=\"stock in stock_list\" v-on:click=\"setActiveStock(stock.stock_id)\" class=\"left-right-grid__sub-grid--content\" :class=\"active_stock == stock.stock_id ? 'left-right-grid__sub-grid--active' : ''\">\n          <div>\n            <span class=\"left-right-grid__font--active\" v-text=\"stock.stock_id\"></span>\n            <span class=\"left-right-grid__font--active\" v-text=\"stock.stock_name\"></span>\n          </div>\n          <div>\n            <span class=\"left-right-grid__font--grey\" v-text=\"'\u884C\u4E1A\u4EE3\u7801'\"></span>\n            <span class=\"left-right-grid__font--normal\" v-text=\"stock.industry_code\"></span>\n            <span class=\"left-right-grid__font--normal\" v-text=\"stock.industry_class\"></span>\n          </div>\n          <div>\n            <span class=\"left-right-grid__font--grey\" v-text=\"'\u505C\u724C\u65E5'\"></span>\n            <span class=\"left-right-grid__font--normal\" v-text=\"stock.suspension_date\"></span>\n          </div>\n        </dd>\n        <dd v-show=\"stock_list.length == 0\">\n          <div style=\"font-size: 14px; color: #000; padding: 15px 35px;\" v-text=\"'\u6CA1\u6709\u505C\u724C\u80A1\u7968'\"></div>\n        </dd>\n      </dl>\n      <dl class=\"left-right-grid__right\">\n        <dt class=\"left-right-grid__sub-grid--title\" v-text=\"'\u7B2C\u4E8C\u6B65\uFF1A\u9009\u62E9\u9700\u4F5C\u4F30\u503C\u8C03\u6574\u7684\u8BE5\u80A1\u6301\u4ED3\u4EA7\u54C1'\"></dt>\n        <dd v-if=\"active_stock != ''\" v-for=\"fund in cur_fund_list\" class=\"left-right-grid__sub-grid--content left-right-grid__sub-grid--active\">\n          <div>\n            <input :disabled=\"fund.web_disabled\" v-model=\"fund.is_adjust\" class=\"left-right-grid__sub-grid--checkbox\" type=\"checkbox\" />\n            <span class=\"left-right-grid__font--normal\" v-text=\"fund.fund_name\"></span>\n          </div>\n          <div>\n            <span class=\"left-right-grid__font--grey\" v-text=\"'\u6301\u4ED3\u6743\u91CD'\"></span>\n            <span class=\"left-right-grid__font--normal\" v-text=\"numeralPercent(fund.position_weight)\"></span>\n          </div>\n          <div>\n            <span class=\"left-right-grid__font--grey\" v-text=\"'\u6307\u6570\u53D8\u52A8\u5BF9\u51C0\u503C\u5F71\u54CD\u6BD4\u4F8B'\"></span>\n            <span class=\"left-right-grid__font--normal\" v-text=\"numeralPercent(fund.susp_factor)\"></span>\n          </div>\n        </dd>\n        <dd v-if=\"active_stock == ''\">\n          <div style=\"font-size: 14px; color: #000; padding: 15px 35px;\" v-text=\"'\u8BF7\u5148\u5728\u5DE6\u4FA7\u70B9\u9009\u9700\u8981\u8C03\u6574\u4F30\u503C\u7684\u505C\u724C\u80A1\u7968'\"></div>\n        </dd>\n      </dl>\n\n    -->\n    </div>\n    <div class=\"word-tip\">\n      <p class=\"word-tip__content\">1.\u4EE5\u4E0A\u6570\u636E\u4EC5\u542B\u573A\u5185A\u80A1\u90E8\u5206\uFF0C\u5176\u4ED6\u8D44\u4EA7\u505C\u724C\u4F30\u503C\u8C03\u6574\u6682\u4E0D\u652F\u6301</p>\n      <p class=\"word-tip__content\">2.\u6307\u6570\u53D8\u52A8\u5BF9\u51C0\u503C\u5F71\u54CD\u6BD4\u4F8B=\u505C\u724C\u80A1\u4ECA\u65E5\u884C\u4E1A\u6307\u6570/\u505C\u724C\u65E5\u884C\u4E1A\u6307\u6570*\u6743\u91CD</p>\n      <p class=\"word-tip__content\">3.\u7CFB\u7EDF\u5C06\u5BF9\u9009\u4E2D\u4EA7\u54C1\u6307\u5B9A\u505C\u724C\u80A1\u8FDB\u884C\u4F30\u503C\u8C03\u6574\uFF0C\u8C03\u6574\u540E\u8BE5\u80A1\u5E02\u503C=\u505C\u724C\u65E5\u5E02\u503C*\u4ECA\u65E5\u884C\u4E1A\u6307\u6570/\u505C\u724C\u65E5\u884C\u4E1A\u6307\u6570\uFF0C\u82E5\u8981\u53D6\u6D88\u4F30\u503C\u8C03\u6574\uFF0C\u8BF7\u53BB\u6389\u52FE\u9009\u540E\u63D0\u4EA4</p>\n    </div>\n    <!--\n    <div style=\"display: flex; justify-content: flex-end;\">\n      <a style=\"margin-right: 60px;\" class=\"custom-btn\" v-on:click=\"doSave\">\u786E\u5B9A</a>\n    </div>\n    -->\n  </section>\n  ",
  methods: {},
  computed: {
    dragOptions: function dragOptions() {
      return {
        animation: 0,
        // group: 'description',
        // disabled: !this.editable,
        ghostClass: 'ghost'
      };
    },


    display_stocks: function display_stocks() {
      var _this = this;
      var rtn = [];
      // 步骤1，根据接口数据进行准备
      this.stock_list.forEach(function (e) {
        var obj = {};
        // 是否估值调整，1为是，0为否
        obj.is_adjust = e.is_adjust;
        // id
        obj.id = e.id;
        // 持仓产品
        obj.name = e.name;
        // 基金经理
        obj.operator = e.operator;
        // 停牌股票
        obj.stock_display = e.stock_name + ' ' + e.stock_id;
        // 指数变动对净值影响比例
        obj.influence_rate = e.influence_rate;
        // 持仓权重
        obj.weight = e.weight;
        // 停牌日
        obj.suspend_date = e.suspend_date;
        // 停牌日市值
        obj.market_value = e.market_value;
        // 行业代码
        obj.amac_display = e.amac_name + ' ' + e.amac_index;
        // 今日指数
        obj.amac_price = e.amac_price;
        // 停牌日指数
        obj.amac_last_price = e.amac_last_price;
        // 调整前市值
        obj.adjust_market_value = e.adjust_market_value;
        // 调整后市值
        obj.modify_market_value = e.modify_market_value;

        rtn.push(obj);
      });

      // 步骤2，根据排序逻辑进行排序
      rtn = VUECOMPONENT.sort(rtn, _this.order, _this.order_by);
      return rtn;
      // if (_this.order == 'asc' || _this.order == 'desc') {
      //   rtn.sort((a, b) => {
      //     let x = a[_this.order_by];
      //     let y = b[_this.order_by];
      //     if ( !isNaN(parseFloat(x)) && !isNaN(parseFloat(y)) ) {
      //       x = parseFloat(x);
      //       y = parseFloat(y);
      //     }
      //     if (x > y) {
      //       return 1;
      //     }
      //     if (x < y) {
      //       return -1;
      //     }
      //     return 0;
      //   })

      //   if ('desc' == _this.order) {
      //     rtn.reverse();
      //   }
      //   return rtn;
      // }else{
      //   return rtn;
      // }
    }
  }
}, _defineProperty(_Vue$component, "methods", {
  chgSort: function chgSort(id) {
    if (id == this.order_by) {
      if (this.order == 'asc') {
        this.order = 'desc';
      } else if (this.order == 'desc') {
        this.order = '';
      } else {
        this.order = 'asc';
      }
    } else {
      this.order_by = id;
      this.order = 'asc';
    }
    // 用户切换排序命令，需要保存新的排序
    var obj = {};
    obj.field_sort = this.display_rules.map(function (e) {
      return e.id;
    });
    obj.order_by = this.order_by;
    obj.order = this.order;
    common_storage.setItem('suspension_page__grid_order', obj);
  },
  getAjaxUrl: function getAjaxUrl() {
    return '/bms-pub/suspension/edit_market_value';
  },
  modify_value: function modify_value(v) {
    this.getStockList();
  },
  displayValue: function displayValue(sub_value, rule) {
    var value = sub_value[rule.id];
    if (rule.format != '' && rule.format instanceof Array && this[rule.format[0]] instanceof Function) {
      // value = this[rule.format].call(this, value, )
      var args = [value].concat(rule.format.slice(1));
      value = this[rule.format[0]].apply(this, args);
    }
    if (rule.unit) {
      return value + rule.unit;
    } else {
      return value;
    }
  },
  onMove: function onMove(_ref3) {
    var relatedContext = _ref3.relatedContext,
        draggedContext = _ref3.draggedContext;

    var relatedElement = relatedContext.element;
    var draggedElement = draggedContext.element;
    return (!relatedElement || !relatedElement.fixed) && !draggedElement.fixed;
  },
  onEnd: function onEnd(_ref4) {
    // // 用户切换表格排序，需要保存新的排序
    // let obj = {};
    // obj.field_sort = this.display_rules.map(function(e){
    //   return e.id
    // });
    // obj.order_by = this.order_by;
    // obj.order = this.order;
    // common_storage.setItem('report_group__grid_order', obj);

    _objectDestructuringEmpty(_ref4);
  },

  numeralNumber: function numeralNumber(arg, num) {
    if ('--' == arg || '' == arg || undefined == arg) {
      return '--';
    }
    if (undefined != num) {
      var str = '0.';
      for (var i = num - 1; i >= 0; i--) {
        str += '0';
      }
      return numeral(arg).format('0,' + str);
    }
    return numeral(arg).format('0,0.00');
  },
  numeralPercent: function numeralPercent(arg) {
    return numeral(arg).format('0.00%');
  },
  doConfigAdjust: function doConfigAdjust(id, adjustFlag) {
    var _this = this;
    $.ajax({
      url: '/bms-pub/suspension/set_market_value',
      type: 'post',
      data: {
        id: id,
        is_adjust: adjustFlag == true ? 1 : 0
      },
      success: function success(_ref5) {
        var code = _ref5.code,
            msg = _ref5.msg,
            data = _ref5.data;

        if (0 == code) {
          $.omsAlert('提交成功');
          _this.getStockList();
        } else {
          $.omsAlert(msg);
        }
      },
      error: function error() {
        $.omsAlert('网络异常，请重试。');
      }
    });
  },
  customRefreshAfterModified: function customRefreshAfterModified() {
    this.getStockList();
  },
  getStockList: function getStockList() {
    var _this = this;
    $.ajax({
      url: '/bms-pub/suspension/stock_list',
      type: 'get',
      data: {},
      success: function success(_ref6) {
        var code = _ref6.code,
            msg = _ref6.msg,
            data = _ref6.data;

        if (0 == code) {
          data.forEach(function (e) {
            e.fund_list = [];
          });
          _this.stock_list = data;

          // 同时获取保存的排序规则
          common_storage.getItem('suspension_page__grid_order', function (_ref7) {
            var code = _ref7.code,
                msg = _ref7.msg,
                data = _ref7.data;

            if (0 == code) {
              comGridSortData.order = data.order;
              comGridSortData.order_by = data.order_by;
              _this.order = data.order;
              _this.order_by = data.order_by;
              // comGridSortData.field_sort = data.field_sort;
              for (var i = data.field_sort.length - 1; i >= 0; i--) {
                for (var j = 0, length = comGridSortData.display_rules.length; j < length; j++) {
                  if (comGridSortData.display_rules[j].id == data.field_sort[i]) {
                    var obj = comGridSortData.display_rules[j];
                    comGridSortData.display_rules.splice(j, 1);
                    comGridSortData.display_rules.unshift(obj);
                  }
                }
              }
            }
          });
        } else {
          $.omsAlert(msg);
        }
      },
      error: function error() {
        $.omsAlert('网络异常，请重试。');
      }
    });
  }
}), _defineProperty(_Vue$component, "mounted", function mounted() {
  this.getStockList();
}), _Vue$component));
var review_vm = new Vue({
  el: '[operation]',
  data: {
    tab_index: 'base', // base 产品估值    cost 费用设置  suspension 停牌估值   outside 产外资产,
    tableData: tableData,
    group_id: '',
    option_list: [],
    product_info: {}
  },
  template: "\n  <div id=\"operation_form\" class=\"report_form\">\n    <div class=\"report-form-type\">\n      <ul class=\"report-form-type__content\">\n        <li :class=\"['report-form-type__content__describle',{active: tab_index == 'base'}]\" @click=\"reportChange('base')\" style=\"margin-left: 10px;\" v-if=\"base_type\">\u57FA\u91D1\u4F30\u503C</li> \n        <li :class=\"['report-form-type__content__describle',{active: tab_index == 'cost'}]\" @click=\"reportChange('cost')\" v-if=\"cost_type\">\u8D39\u7528\u8BBE\u7F6E</li>\n        <li :class=\"['report-form-type__content__describle',{active: tab_index == 'suspension'}]\" @click=\"reportChange('suspension')\"  v-if=\"suspension_type\">\u505C\u724C\u4F30\u503C</li>\n        <li :class=\"['report-form-type__content__describle',{active: tab_index == 'outside'}]\" @click=\"reportChange('outside')\" v-if=\"outside_type\">\u573A\u5916\u8D44\u4EA7</li>\n      </ul>\n    </div>\n    <template v-if=\"tab_index == 'base'\">\n      <div style=\"background: white;color:black\"  v-if=\"base_type\">\n        <vue-operation-table  :tableData=tableData></vue-operation-table>\n      </div>\n    </template>\n    <template v-if=\"tab_index == 'cost'\">\n        <vue-operation-cost :option_list=option_list :group_id=group_id v-if=\"cost_type\"></vue-operation-cost>\n    </template>\n    <template v-if=\"tab_index == 'outside'\">\n        <vue-operation-outside :option_list=option_list :group_id=group_id :product_info=product_info v-if=\"outside_type\"></vue-operation-outside>\n    </template>\n    <template v-if=\"tab_index == 'suspension'\" :product_info=product_info>\n      <vue-operation-suspension v-if=\"suspension_type\"></vue-operation-suspension>\n    </template>\n  </div>\n  ",
  watch: {},
  methods: {
    reportChange: function reportChange(val) {
      this.tab_index = val;
    },
    get_groups: function get_groups() {
      if (this.isLogining) {
        return;
      }
      //初始化下拉列表
      this.isLogining = true;
      var _this = this;
      $.ajax({
        url: '/bms-pub/product/get_product_group',
        type: 'GET',
        data: {
          only_top: 0
        }
      }).done(function (res) {
        if (0 == res.code) {
          if (res.data != '') {
            _this.option_list = res.data.lists;
          }
        }
      }).fail(function () {}).always(function () {
        _this.isLogining = false;
      });
    },
    show_setting: function show_setting(id) {
      //修改root的 id并调弹框
      var self = this;
      var contentChild = Vue.extend({
        data: function data() {
          return {
            id: id
          };
        },

        template: "\n         <form class=\"vue-form\">\n            <div class=\"operation-confirm\">\n              \u573A\u5916\u8D44\u4EA7\u9700\u8981\u524D\u5F80\u3010\u573A\u5916\u8D44\u4EA7\u3011\u9875\u9762\u4FEE\u6539\n            </div>\n            <div class=\"buttons\" style=\"text-align: center;    float: inherit;\">\n              <button type=\"button\" class=\"vue-confirm__btns--submit\" style=\"background-color: rgb(255, 222, 0);\" @click=btn_submit>\u524D\u5F80\u4FEE\u6539</button>\n              <button type=\"button\" class=\"vue-confirm__btns--cancel\" style=\" background-color: rgb(204, 204, 204);\" @click=btn_cancel>\u53D6\u6D88</button>\n            </div>\n          </form>\n        ",
        methods: {
          btn_submit: function btn_submit() {
            self.group_id = this.id;
            self.tab_index = "cost";
            this.$parent.close();
          },
          btn_cancel: function btn_cancel() {
            this.$parent.close();
          }
        }
      });
      this.$confirm({
        title: '场外总资产修改',
        content: contentChild,
        closeIcon: true
      });
    },

    doRefresh: function doRefresh() {
      this.pageProductInfo(this.group_id);
    },
    pageProductInfo: function pageProductInfo(id) {
      var _this = this;
      $.startLoading('正在查询');
      $.ajax({
        url: '/bms-pub/product/otc/list?group_id=' + id,
        type: 'GET',
        success: function success(res) {
          if (0 == res.code) {
            _this.product_info = res.data;
          }
          $.clearLoading();
        },
        error: function error(res) {
          $.omsAlert(res.msg);
          $.clearLoading();
        }
      });
    }
  },
  computed: {
    base_type: function base_type() {
      return window.LOGIN_INFO.role_permission[GV.permissions['PERMISSION_FUND_VALUATION']];
    },
    cost_type: function cost_type() {
      return window.LOGIN_INFO.role_permission[GV.permissions['PERMISSION_COST_SET']];
    },
    suspension_type: function suspension_type() {
      return window.LOGIN_INFO.role_permission[GV.permissions['PERMISSION_SUSPENSION']];
    },
    outside_type: function outside_type() {
      return window.LOGIN_INFO.role_permission[GV.permissions['PERMISSION_OTC_CAPITAL']];
    }
  },
  mounted: function mounted() {
    this.get_groups();
    this.pageProductInfo(this.group_id);
    if (this.base_type) {
      this.tab_index = 'base';
    } else if (this.cost_type) {
      this.tab_index = 'cost';
    } else if (this.suspension_type) {
      this.tab_index = 'suspension';
    } else if (this.outside_type) {
      this.tab_index = 'outside';
    }
  }
});
//# sourceMappingURL=operation.js.map
