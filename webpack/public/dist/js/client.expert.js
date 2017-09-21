'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * author: liuzeyafzy
 * 专户版交易端
 */
$(function () {
  function doClose(num) {
    $('.custom-confirm-form__btn--close').html('关闭(' + num + '秒)');

    if (0 == num) {
      $('.custom-confirm__content').empty();
      $('.custom-confirm').addClass('hide');
    }
  }

  var refresh_timer = setInterval(function () {
    $.ajax({
      url: (window.REQUEST_PREFIX || '') + '/test-cosnis/active',
      type: 'get',
      success: function success(_ref) {
        //

        var code = _ref.code,
            msg = _ref.msg,
            data = _ref.data;
      },
      error: function error() {
        console.log('error');
      }
    });
  }, 1000 * 10);

  // 顶部菜单
  Vue.component('client-header', {
    props: ['product_list', 'cur_product_id', 'cur_nav', 'begin_date', 'end_date', 'query_stock'],
    template: '\n      <header class="client-header">\n        <h1 class="client-header__title">' + APP_NAME + '\u8D44\u4EA7\u7BA1\u7406\u5E73\u53F0</h1>\n        <select v-if="product_list.length > 1" :value="cur_product_id" v-on:change="changeProduct($event)" class="client-header__sub-title--multiple">\n          <option v-for="product in product_list" :value="product.id">\u8D26\u6237\uFF1A{{product.name}}</option>\n        </select>\n        <span v-if="product_list.length == 1" class="client-header__sub-title--single">\u8D26\u6237\uFF1A{{product_list[0].name}}</span>\n        <div class="client-header__controller--main">\n          <a class="client-header__btn--login" v-on:click="doNewWindow()"><i></i>\u767B\u5F55</a>\n          <a class="client-header__btn--logout" v-on:click="doLogout()"><i></i>\u9000\u51FA</a>\n          <a class="client-header__btn--refresh" v-on:click="doRefresh()"><i></i>\u5237\u65B0</a>\n        </div>\n        <div v-if="\'account\' == cur_nav || \'position\' == cur_nav || \'entrust_today\' == cur_nav || \'deal_today\' == cur_nav || \'entrust_history\' == cur_nav || \'deal_history\' == cur_nav" class="client-header__controller--export">\n          <a v-on:click="doExport()" class="client-header__btn--export"><i></i>\u5BFC\u51FA</a>\n        </div>\n      </header>\n    ',
    data: function data() {
      return {};
    },
    computed: {},
    methods: {
      doNewWindow: function doNewWindow() {
        if (window.require && window.require('electron') && window.require('electron').remote && window.require('electron').remote.require('./main.js')
        // 下面的判断条件再client上会出现“Uncaught illegal access”，未找到解决版本，目前的判断起始也已经足够了
        //  && window.require('electron').remote.require('./main.js').createNewWindow instanceof Function
        ) {
            window.require('electron').remote.require('./main.js').createNewWindow();
          } else {
          $.omsAlert('请使用最新版本的客户端软件！');
        }
      },
      doLogout: function doLogout() {
        LogOut();
      },
      doRefresh: function doRefresh() {
        this.$emit('refresh');
      },
      doExport: function doExport() {
        // location.href = 'http://192.168.0.20:26080/omsv2/oms/pb/get_deal_list_file?start_date=2017-03-29&stop_date=2017-03-29&product_id=100232'
        var location_url = '';
        var location_data = {};
        if ('account' == this.cur_nav) {
          location_url = (window.REQUEST_PREFIX || '') + '/oms/report/download_report/today_position';
          location_data.product_id = this.cur_product_id;
          // location.href = (window.REQUEST_PREFIX||'') + '/oms/report/download_report/today_position?product_id=' + this.cur_product_id;
        } else if ('position' == this.cur_nav) {
          location_url = (window.REQUEST_PREFIX || '') + '/oms/report/download_report/today_position';
          location_data.product_id = this.cur_product_id;
          // location.href = (window.REQUEST_PREFIX||'') + '/oms/report/download_report/today_position?product_id=' + this.cur_product_id;
        } else if ('entrust_today' == this.cur_nav) {
          location_url = (window.REQUEST_PREFIX || '') + '/oms/report/download_report/entrust';
          location_data.export_format = 'expert';
          location_data.product_id = this.cur_product_id;
          location_data.start = moment().format('YYYY-MM-DD');
          location_data.stock_id = this.query_stock;
          // location.href = (window.REQUEST_PREFIX||'') + '/oms/report/download_report/entrust?export_format=expert&product_id=' + this.cur_product_id + '&start=' + moment().format('YYYY-MM-DD') + '&stock_id=' + this.query_stock;
        } else if ('deal_today' == this.cur_nav) {
          location_url = (window.REQUEST_PREFIX || '') + '/oms/report/download_report/deal';
          location_data.export_format = 'expert';
          location_data.product_id = this.cur_product_id;
          location_data.start = moment().format('YYYY-MM-DD');
          location_data.stock_id = this.query_stock;
          // location.href = (window.REQUEST_PREFIX||'') + '/oms/report/download_report/deal?export_format=expert&product_id=' + this.cur_product_id + '&start=' + moment().format('YYYY-MM-DD') + '&stock_id=' + this.query_stock;
        } else if ('entrust_history' == this.cur_nav) {
          location_url = (window.REQUEST_PREFIX || '') + '/oms/report/download_report/entrust';
          location_data.export_format = 'expert';
          location_data.product_id = this.cur_product_id;
          location_data.start = this.begin_date;
          location_data.end = this.end_date;
          location_data.stock_id = this.query_stock;
          // location.href = (window.REQUEST_PREFIX||'') + '/oms/report/download_report/entrust?export_format=expert&product_id=' + this.cur_product_id + '&start=' + this.begin_date + '&end=' + this.end_date + '&stock_id=' + this.query_stock;
        } else if ('deal_history' == this.cur_nav) {
          location_url = (window.REQUEST_PREFIX || '') + '/oms/report/download_report/deal';
          location_data.export_format = 'expert';
          location_data.product_id = this.cur_product_id;
          location_data.start = this.begin_date;
          location_data.end = this.end_date;
          location_data.stock_id = this.query_stock;
          // location.href = (window.REQUEST_PREFIX||'') + '/oms/report/download_report/deal?export_format=expert&product_id=' + this.cur_product_id + '&start=' + this.begin_date + '&end=' + this.end_date + '&stock_id=' + this.query_stock;
        }

        $.startLoading();
        $.ajax({
          url: location_url,
          type: 'GET',
          data: location_data,
          success: function success() {
            $.clearLoading();
            $.omsAlert('正为您生成报表，成功后可进入文件中心下载');
          },
          error: function error() {
            $.omsAlert('网络异常，请重试');
          }
        });
      },
      changeProduct: function changeProduct(event) {
        this.$emit('select_product', event.target.value);
      }
    }
  });

  // 左侧菜单
  Vue.component('client-nav', {
    props: ['cur_nav'],
    template: '\n      <nav class="client-nav">\n        <div class="client-nav__main-nav">\n          <a v-on:click="selectOne(\'account\')" :class="cur_nav == \'account\' ? \'active\' : \'\'" class="client-nav__main-nav--account"><i></i>\u8D26\u6237</a>\n        </div>\n        <div class="client-nav__main-nav">\n          <a v-on:click="selectOne(\'buy\')" :class="cur_nav == \'buy\' ? \'active\' : \'\'" class="client-nav__main-nav--buy"><i></i>\u4E70\u5165</a>\n\n        </div>\n        <div class="client-nav__main-nav">\n          <a v-on:click="selectOne(\'sell\')" :class="cur_nav == \'sell\' ? \'active\' : \'\'" class="client-nav__main-nav--sell"><i></i>\u5356\u51FA</a>\n\n        </div>\n        <div class="client-nav__main-nav">\n          <a v-on:click="selectOne(\'revert\')" :class="cur_nav == \'revert\' ? \'active\' : \'\'" class="client-nav__main-nav--revert"><i></i>\u64A4\u5355</a>\n        </div>\n        <div class="client-nav__main-nav">\n          <a :class="(cur_nav == \'query\' || cur_nav == \'position\' || cur_nav == \'entrust_today\' || cur_nav == \'deal_today\' || cur_nav == \'entrust_history\' || cur_nav == \'deal_history\') ? \'active\' : \'\'" class="client-nav__main-nav--query"><i></i>\u67E5\u8BE2\n          </a>\n          <div class="client-subNav" :class="(cur_nav == \'position\' || cur_nav == \'entrust_today\' || cur_nav == \'deal_today\' || cur_nav == \'entrust_history\' || cur_nav == \'deal_history\') ? \'active\' : \'\'">\n            <a v-on:click="selectOne(\'position\')" :class="cur_nav == \'position\' ? \'active\' : \'\'" class="client-subNav__item">\u8D44\u91D1\u80A1\u4EFD</a>\n            <a v-on:click="selectOne(\'entrust_today\')" :class="cur_nav == \'entrust_today\' ? \'active\' : \'\'" class="client-subNav__item">\u5F53\u65E5\u59D4\u6258</a>\n            <a v-on:click="selectOne(\'deal_today\')" :class="cur_nav == \'deal_today\' ? \'active\' : \'\'" class="client-subNav__item">\u5F53\u65E5\u6210\u4EA4</a>\n            <a v-on:click="selectOne(\'entrust_history\')" :class="cur_nav == \'entrust_history\' ? \'active\' : \'\'" class="client-subNav__item">\u5386\u53F2\u59D4\u6258</a>\n            <a v-on:click="selectOne(\'deal_history\')" :class="cur_nav == \'deal_history\' ? \'active\' : \'\'" class="client-subNav__item">\u5386\u53F2\u6210\u4EA4</a>\n          </div>\n        </div>\n        <div class="client-nav__main-nav">\n          <a v-on:click="selectOne(\'file_center\')" :class="cur_nav == \'changePassword\' ? \'active\' : \'\'" class="client-nav__main-nav--fileCenter"><i></i>\u6587\u4EF6\u4E2D\u5FC3</a>\n        </div>\n        <div class="client-nav__main-nav">\n          <a v-on:click="selectOne(\'changePassword\')" :class="cur_nav == \'changePassword\' ? \'active\' : \'\'" class="client-nav__main-nav--changePassword"><i></i>\u4FEE\u6539\u5BC6\u7801</a>\n        </div>\n      </nav>\n    ',
    methods: {
      selectOne: function selectOne(v) {
        if (this.cur_nav !== v) {
          this.$emit('input', v);
        }
      }
    }
  });

  // 交易模块
  Vue.component('client-trader', {
    props: ['cur_nav', 'enable_cash', 'cur_product_id', 'need_show_arr', 'position_realtime'],
    template: '\n      <section v-show="showTrader(cur_nav)" class="client-body__trader client-trader" style="border: 1px solid #ccc" @keyup="listenKeyboard">\n        <div class="client-trader__form">\n          <form>\n            <div>\n              <label class="client-trader__form--label" :class="cur_nav == \'sell\' ? \'sell\' : \'\'">\u80A1\u7968\u4EE3\u7801</label>\n              <div class="client-trader__form--rightContent client-stockInput">\n                <input ref=0 v-on:focus="focusFlag = true;clearErrorTip();keyup_index=0" v-on:blur="focusFlag = false" class="client-stockInput__input" v-model="stock_input" v-on:input="getStockList()" />\n                <span class="client-stockInput__unit">{{stock_name}}</span>\n                <ul v-if="focusFlag" class="client-suggest">\n                  <li class="client-suggest__list" v-for="stock in stockList" v-on:mousedown="selectOneStock(stock.stock_id, stock.stock_name)"> {{stock.stock_id + \'&nbsp\' + stock.stock_name}} </li>\n                </ul>\n              </div>\n            </div>\n            <div>\n              <label class="client-trader__form--label" :class="cur_nav == \'sell\' ? \'sell\' : \'\'">\u62A5\u4EF7\u65B9\u5F0F</label>\n              <button  :class="[\'client-trader__form--btn\',type_deal2?\'active\':\'\']" @click.prevent.stop="mothod_deal(1)">\u9650\u4EF7 <i class="oms-icon"></i></button>\n              <button  :class="[\'client-trader__form--btn\',type_deal1?\'active\':\'\']" @click.prevent.stop="mothod_deal(2)">\u5E02\u4EF7 <i class="oms-icon"></i></button>\n            </div>\n            <div>\n              <label class="client-trader__form--label" :class="cur_nav == \'sell\' ? \'sell\' : \'\'" v-text="cur_nav == \'sell\' ? \'\u5356\u51FA\u4EF7\u683C\' : \'\u4E70\u5165\u4EF7\u683C\'"></label>\n              <div class="client-trader__form--rightContent client-numberInput">\n                <div class="client-numberInput__input">\n\n                  <input v-if="trade_mode==1" ref=1 v-model="submit_price" v-on:focus="clearErrorTip();keyup_index=1" />\n                  <span v-if="trade_mode==2">\u5E02\u4EF7</span>\n                  <span class="client-numberInput__unit">\u5143</span>\n                </div>\n                <div class="client-numberInput__btn" v-on:click="calcSubmitPrice(-0.01)">\n                  <div class="client-numberInput__btn--sign">\uFF0D</div><span class="client-numberInput__btn--unit">0.01</span>\n                </div>\n                <div class="client-numberInput__btn" v-on:click="calcSubmitPrice(+0.01)">\n                  <div class="client-numberInput__btn--sign">\uFF0B</div><span class="client-numberInput__btn--unit">0.01</span>\n                </div>\n              </div>\n            </div>\n            <div>\n              <label class="client-trader__form--label" :class="cur_nav == \'sell\' ? \'sell\' : \'\'">\u53EF\u7528\u8D44\u91D1</label>\n              <div class="client-trader__form--rightContent client-disabledInput">\n                <input disabled="disabled" class="client-disabledInput__input" :value="show_enable_cash" />\n                <span class="client-disabledInput__unit">\u5143</span>\n              </div>\n            </div>\n            <div v-if="cur_nav == \'buy\'">\n              <label class="client-trader__form--label" :class="cur_nav == \'sell\' ? \'sell\' : \'\'">\u6700\u5927\u53EF\u4E70</label>\n              <div class="client-trader__form--rightContent client-disabledInput">\n                <input disabled="disabled" class="client-disabledInput__input" :value="max_amount" />\n                <span class="client-disabledInput__unit">\u80A1</span>\n              </div>\n            </div>\n            <div v-if="cur_nav == \'sell\'">\n              <label class="client-trader__form--label" :class="cur_nav == \'sell\' ? \'sell\' : \'\'">\u6700\u5927\u53EF\u5356</label>\n              <div class="client-trader__form--rightContent client-disabledInput">\n                <input disabled="disabled" class="client-disabledInput__input" :value="max_sell_amount" />\n                <span class="client-disabledInput__unit">\u80A1</span>\n              </div>\n            </div>\n            <div>\n              <label v-if="cur_nav == \'buy\'" class="client-trader__form--label" :class="cur_nav == \'sell\' ? \'sell\' : \'\'">\u4E70\u5165\u6570\u91CF</label>\n              <label v-if="cur_nav == \'sell\'" class="client-trader__form--label" :class="cur_nav == \'sell\' ? \'sell\' : \'\'">\u5356\u51FA\u6570\u91CF</label>\n              <div class="client-trader__form--rightContent client-numberInput">\n                <div class="client-numberInput__input">\n                  <input ref=2 v-model="submit_amount" v-on:focus="clearErrorTip();keyup_index=2" />\n                  <span class="client-numberInput__unit">\u80A1</span>\n                </div>\n                <div class="client-numberInput__btn" v-on:click="calcSubmitAmount(-100)">\n                  <div class="client-numberInput__btn--sign">\uFF0D</div><span class="client-numberInput__btn--unit">100</span>\n                </div>\n                <div class="client-numberInput__btn" v-on:click="calcSubmitAmount(+100)">\n                  <div class="client-numberInput__btn--sign">\uFF0B</div><span class="client-numberInput__btn--unit">100</span>\n                </div>\n              </div>\n            </div>\n            <div style="padding-top: 6px;">\n              <label class="client-trader__form--radio">\n                <input class="client-trader__form--radio-input" name="set_amount_radio" :value="\'type_1\'" v-model="amount_radio_value" type="radio" v-on:input="setSubmitAmount(1/1)" />\u5168\u90E8\n              </label>\n              <label class="client-trader__form--radio">\n                <input class="client-trader__form--radio-input" name="set_amount_radio" :value="\'type_2\'" v-model="amount_radio_value" type="radio" v-on:input="setSubmitAmount(1/2)" />1/2\n              </label>\n              <label class="client-trader__form--radio">\n                <input class="client-trader__form--radio-input" name="set_amount_radio" :value="\'type_3\'" v-model="amount_radio_value" type="radio" v-on:input="setSubmitAmount(1/3)" />1/3\n              </label>\n              <label class="client-trader__form--radio">\n                <input class="client-trader__form--radio-input" name="set_amount_radio" :value="\'type_5\'" v-model="amount_radio_value" type="radio" v-on:input="setSubmitAmount(1/5)" />1/5\n              </label>\n            </div>\n            <div v-show="\'buy\' == cur_nav" style="padding-top: 6px;">\u51BB\u7ED3\u91D1\u989D\uFF1A<span>{{frozen_amount}}</span></div>\n            <div class="client-trader__form--submit_info">\n                <div>\n                <a class="client-trader__btn--reset" v-on:click="resetForm()">\u91CD\u7F6E</a>\n                <a v-if="cur_nav == \'buy\'" class="client-trader__btn--save" :class="cur_nav == \'sell\' ? \'sell\' : \'\'" v-on:click="add_hand_order()">\u4E70\u5165\u80A1\u7968</a>\n                <a v-if="cur_nav == \'sell\'" class="client-trader__btn--save" :class="cur_nav == \'sell\' ? \'sell\' : \'\'" v-on:click="add_hand_order()">\u5356\u51FA\u80A1\u7968</a>\n              </div>\n              <div class="client-trader__form--error_tip">\n                <span>{{error_tip}}</span>\n              </div>\n            </div>\n          </form>\n        </div>\n        <div class="client-trader__market5 client-market5">\n          <div class="client-market5__line">\n            <span class="client-market5__line--firstChild">\u53565</span>\n            <span class="client-market5__line--middleChild" style="cursor: pointer;" v-on:click="setSubmitPrice(stock_info.ask5_price)" :class="getColorByPrice(stock_info.ask5_price, stock_info.prev_close_price)">{{parsePrice(stock_info.ask5_price)}}</span>\n            <span class="client-market5__line--lastChild">{{parseNumber(stock_info.ask5_volume)}}</span>\n          </div>\n          <div class="client-market5__line">\n            <span class="client-market5__line--firstChild">\u53564</span>\n            <span class="client-market5__line--middleChild" style="cursor: pointer;" v-on:click="setSubmitPrice(stock_info.ask4_price)" :class="getColorByPrice(stock_info.ask4_price, stock_info.prev_close_price)">{{parsePrice(stock_info.ask4_price)}}</span>\n            <span class="client-market5__line--lastChild">{{parseNumber(stock_info.ask4_volume)}}</span>\n          </div>\n          <div class="client-market5__line">\n            <span class="client-market5__line--firstChild">\u53563</span>\n            <span class="client-market5__line--middleChild" style="cursor: pointer;" v-on:click="setSubmitPrice(stock_info.ask3_price)" :class="getColorByPrice(stock_info.ask3_price, stock_info.prev_close_price)">{{parsePrice(stock_info.ask3_price)}}</span>\n            <span class="client-market5__line--lastChild">{{parseNumber(stock_info.ask3_volume)}}</span>\n          </div>\n          <div class="client-market5__line">\n            <span class="client-market5__line--firstChild">\u53562</span>\n            <span class="client-market5__line--middleChild" style="cursor: pointer;" v-on:click="setSubmitPrice(stock_info.ask2_price)" :class="getColorByPrice(stock_info.ask2_price, stock_info.prev_close_price)">{{parsePrice(stock_info.ask2_price)}}</span>\n            <span class="client-market5__line--lastChild">{{parseNumber(stock_info.ask2_volume)}}</span>\n          </div>\n          <div class="client-market5__line">\n            <span class="client-market5__line--firstChild">\u53561</span>\n            <span class="client-market5__line--middleChild" style="cursor: pointer;" v-on:click="setSubmitPrice(stock_info.ask1_price)" :class="getColorByPrice(stock_info.ask1_price, stock_info.prev_close_price)">{{parsePrice(stock_info.ask1_price)}}</span>\n            <span class="client-market5__line--lastChild">{{parseNumber(stock_info.ask1_volume)}}</span>\n          </div>\n          <div>\n            <hr class="client-market5__hr">\n          </div>\n          <div class="client-market5__line">\n            <span class="client-market5__line--firstChild">\u4E701</span>\n            <span class="client-market5__line--middleChild" style="cursor: pointer;" v-on:click="setSubmitPrice(stock_info.bid1_price)" :class="getColorByPrice(stock_info.bid1_price, stock_info.prev_close_price)">{{parsePrice(stock_info.bid1_price)}}</span>\n            <span class="client-market5__line--lastChild">{{parseNumber(stock_info.bid1_volume)}}</span>\n          </div>\n          <div class="client-market5__line">\n            <span class="client-market5__line--firstChild">\u4E702</span>\n            <span class="client-market5__line--middleChild" style="cursor: pointer;" v-on:click="setSubmitPrice(stock_info.bid2_price)" :class="getColorByPrice(stock_info.bid2_price, stock_info.prev_close_price)">{{parsePrice(stock_info.bid2_price)}}</span>\n            <span class="client-market5__line--lastChild">{{parseNumber(stock_info.bid2_volume)}}</span>\n          </div>\n          <div class="client-market5__line">\n            <span class="client-market5__line--firstChild">\u4E703</span>\n            <span class="client-market5__line--middleChild" style="cursor: pointer;" v-on:click="setSubmitPrice(stock_info.bid3_price)" :class="getColorByPrice(stock_info.bid3_price, stock_info.prev_close_price)">{{parsePrice(stock_info.bid3_price)}}</span>\n            <span class="client-market5__line--lastChild">{{parseNumber(stock_info.bid3_volume)}}</span>\n          </div>\n          <div class="client-market5__line">\n            <span class="client-market5__line--firstChild">\u4E704</span>\n            <span class="client-market5__line--middleChild" style="cursor: pointer;" v-on:click="setSubmitPrice(stock_info.bid4_price)" :class="getColorByPrice(stock_info.bid4_price, stock_info.prev_close_price)">{{parsePrice(stock_info.bid4_price)}}</span>\n            <span class="client-market5__line--lastChild">{{parseNumber(stock_info.bid4_volume)}}</span>\n          </div>\n          <div class="client-market5__line">\n            <span class="client-market5__line--firstChild">\u4E705</span>\n            <span class="client-market5__line--middleChild" style="cursor: pointer;" v-on:click="setSubmitPrice(stock_info.bid5_price)" :class="getColorByPrice(stock_info.bid5_price, stock_info.prev_close_price)">{{parsePrice(stock_info.bid5_price)}}</span>\n            <span class="client-market5__line--lastChild">{{parseNumber(stock_info.bid5_volume)}}</span>\n          </div>\n          <div>\n            <hr class="client-market5__hr">\n          </div>\n          <div class="client-market5__line">\n            <span class="client-market5__line--firstChild">\u73B0\u4EF7</span>\n            <span class="client-market5__line--lastChild" style="cursor: pointer;" v-on:click="setSubmitPrice(stock_info.last_price)" :class="getColorByPrice(stock_info.last_price, stock_info.prev_close_price)">{{parsePrice(stock_info.last_price)}}</span>\n          </div>\n          <div class="client-market5__line">\n            <span class="client-market5__line--firstChild">\u6DA8\u5E45</span>\n            <span class="client-market5__line--lastChild" :class="getColorByPrice(stock_info.last_price, stock_info.prev_close_price)">{{parsePercent(stock_info.change_ratio)}}</span>\n          </div>\n          <div class="client-market5__line">\n            <span class="client-market5__line--firstChild">\u6DA8\u505C</span>\n            <span class="client-market5__line--lastChild" style="cursor: pointer;" v-on:click="setSubmitPrice(stock_info.stop_top)" :class="getColorByPrice(stock_info.stop_top, stock_info.prev_close_price)">{{parsePrice(stock_info.stop_top)}}</span>\n          </div>\n          <div class="client-market5__line">\n            <span class="client-market5__line--firstChild">\u8DCC\u505C</span>\n            <span class="client-market5__line--lastChild" style="cursor: pointer;" v-on:click="setSubmitPrice(stock_info.stop_down)" :class="getColorByPrice(stock_info.stop_down, stock_info.prev_close_price)">{{parsePrice(stock_info.stop_down)}}</span>\n          </div>\n        </div>\n      </section>\n    ',
    data: function data() {
      return {
        // 可以通过showArr内部添加字段来控制显示效果
        showArr: [{
          cur_nav: 'buy'
        }, {
          cur_nav: 'sell'
        }],
        focusFlag: false,
        stock_id: '',
        stock_name: '',
        // inputStockCode: '',
        stock_input: '',
        stockList: [],
        stock_info: {},
        // frozen_amount: '',
        latest_suggest_timestamp: '',

        submit_price: '',
        submit_amount: '',
        amount_radio_value: '',
        error_tip: '',
        // max_sell_amount: '', //如果computed中的方法名不能在data中定义
        update_timer: '',
        end: '',
        keyup_arr: [0, 1, 2],
        keyup_index: 0,
        type_deal1: false,
        type_deal2: true,
        trade_mode: 1,
        temp_price: '' //缓存切换时的限价价格
      };
    },
    computed: {
      show_enable_cash: function show_enable_cash() {
        var _this = this;
        if ('buy' == this.cur_nav) {
          if ('' == this.stock_id) {
            return '';
          } else {
            return numeral(_this.enable_cash).format('0.00');
          }
        } else if ('sell' == this.cur_nav) {
          if ('' == this.stock_id) {
            return '';
          } else {
            return numeral(_this.enable_cash).format('0.00');
          }
        }
      },
      max_amount: function max_amount() {
        var _this = this;
        if ('buy' == this.cur_nav) {

          if (!this.submit_price || this.submit_price == 0) {
            // 当价格不存在时 返回空
            return '';
          }
          if ('' == this.stock_id) {
            return '';
          } else if (0 == this.submit_price || '' == this.submit_price) {
            // 涨停价计算 stock_info.stop_top
            var tmpStopTop = this.stock_info.stop_top;
            if (undefined == tmpStopTop) {
              return '';
            }
            return Math.floor(this.show_enable_cash / this.stock_info.stop_top / 100) * 100;
          } else {
            return Math.floor(this.show_enable_cash / this.submit_price / 100) * 100;
          }
        } else if ('sell' == this.cur_nav) {
          if ('' == this.stock_id) {
            return '';
          } else {
            // 从持仓中获取当前股票的可卖数量
            var rtn = 0;
            this.position_realtime.forEach(function (e) {
              if (_this.stock_id == e.stock_id) {
                rtn = e.enable_sell_volume;
              }
            });
            return rtn;
          }
        }
      },
      max_sell_amount: function max_sell_amount() {
        var _this = this;
        if ('sell' == this.cur_nav) {
          if ('' == this.stock_id) {
            return '';
          } else {
            // 从持仓中获取当前股票的可卖数量
            var rtn = 0;
            this.position_realtime.forEach(function (e) {
              if (_this.stock_id == e.stock_id) {
                rtn = e.enable_sell_volume;
              }
            });
            return rtn;
          }
        }
      },
      frozen_amount: function frozen_amount() {
        var _this = this;
        if ('buy' == this.cur_nav) {
          if (this.submit_amount) {
            if (0 == this.submit_price || '' == this.submit_price) {
              return numeral(this.submit_amount * this.stock_info.stop_top).format('0.00');
            } else {
              return numeral(this.submit_amount * this.submit_price).format('0.00');
            }
          } else {
            return 0;
          }
        } else {
          return 0;
        }
      }
    },
    watch: {
      stock_id: function stock_id() {
        var _this = this;
        var rtn = '';
        // 从持仓中获取当前股票的可卖数量
        this.position_realtime.forEach(function (e) {
          if (_this.stock_id == e.stock_id) {
            rtn = e.enable_sell_volume;
          }
        });
        // this.max_sell_amount = rtn;

        if (undefined == this.stock_id || '' == this.stock_id) {
          console.log('this.stock_id: ' + this.stock_id);
          clearInterval(this.update_timer);
        }
      },
      submit_price: function submit_price() {
        if (this.submit_price < 0) {
          this.submit_price = 0;
        }
      },
      submit_amount: function submit_amount() {
        if (this.submit_amount > this.max_amount) {
          this.submit_amount = this.max_amount;
        }
        if (this.submit_amount < 0) {
          this.submit_amount = 0;
        }
        // this.amount_radio_value = '';
      },
      amount_radio_value: function amount_radio_value() {
        if ('' == this.amount_radio_value) {
          return;
        } else if ('type_1' == this.amount_radio_value) {
          this.submit_amount = this.max_amount;
          this.clearErrorTip();
        } else if ('type_2' == this.amount_radio_value) {
          this.submit_amount = Math.floor(this.max_amount * (1 / 2) / 100) * 100;
          this.clearErrorTip();
        } else if ('type_3' == this.amount_radio_value) {
          this.submit_amount = Math.floor(this.max_amount * (1 / 3) / 100) * 100;
          this.clearErrorTip();
        } else if ('type_5' == this.amount_radio_value) {
          this.submit_amount = Math.floor(this.max_amount * (1 / 5) / 100) * 100;
          this.clearErrorTip();
        }
      }
    },
    methods: {
      mothod_deal: function mothod_deal(val) {
        if (val == 2) {
          this.type_deal1 = true;
          this.type_deal2 = false; //市价
          this.temp_price = this.submit_price;
          this.setSubmitPrice(this.stock_info.stop_top);
        }
        if (val == 1) {
          this.type_deal1 = false;
          this.type_deal2 = true;
          this.setSubmitPrice(this.temp_price);
        }
        this.trade_mode = val;
      },

      setSubmitPrice: function setSubmitPrice(v) {
        if (v) {
          this.submit_price = v;
        }
      },
      getColorByPrice: function getColorByPrice(v, line) {
        if (v > line) {
          return 'num_red';
        } else if (v < line) {
          return 'num_green';
        } else {
          return '';
        }
      },
      getMaxSellAmount: function getMaxSellAmount() {
        // console.log(this.need_show_arr);
        var _this = this;
        var rtn = '';
        // this.need_show_arr.forEach(function(e){
        //   if (e.type == 'positionGrid') {
        //     e.tableData.forEach(function(el){
        //       if (_this.stock_id  == el.stock_id) {
        //         rtn = el.enable_sell_volume;
        //       }
        //     })
        //   }
        // });
        // 从持仓中获取当前股票的可卖数量
        this.position_realtime.forEach(function (e) {
          if (_this.stock_id == e.stock_id) {
            rtn = e.enable_sell_volume;
          }
        });
        return rtn;
      },
      clearErrorTip: function clearErrorTip() {
        this.error_tip = '';
      },
      add_hand_order: function add_hand_order() {
        var _this = this;
        var trade_mode = this.trade_mode;
        if ('' == this.stock_id) {
          _this.error_tip = '请输入股票代码';
          return;
        }
        // if ('' == this.submit_price) {
        //   _this.error_tip = '请输入交易价格'
        //   return;
        // }
        if ('' == this.submit_amount) {
          _this.error_tip = '请输入交易数量';
          return;
        }
        if (0 == this.submit_price || '' == this.submit_price) {
          if (/sz/i.test(this.stock_id)) {
            trade_mode = 3;
          } else if (/sh/i.test(this.stock_id)) {
            trade_mode = 8;
          } else {
            $.omsAlert('股票代码错误');
          }
        }

        var total_amount = 0;
        if ('buy' == this.cur_nav) {
          if (1 !== trade_mode) {
            total_amount = numeral(this.submit_amount * this.stock_info.stop_top).format('0.00');
          } else {
            total_amount = numeral(this.submit_amount * this.submit_price).format('0.00');
          }
        } else {
          if (1 !== trade_mode) {
            total_amount = numeral(this.submit_amount * this.stock_info.stop_down).format('0.00');
          } else {
            total_amount = numeral(this.submit_amount * this.submit_price).format('0.00');
          }
        }

        var html = '\n          <article class="custom-confirm__body">\n            <header class="custom-confirm__header">\n              <h2>' + ('buy' == _this.cur_nav ? '买入确认' : '卖出确认') + '</h2>\n            </header>\n            <main>\n              <form class="custom-confirm-form">\n                <div class="custom-confirm-form__item">\n                  <label class="custom-confirm-form__label">\u80A1\u7968\u4EE3\u7801/\u540D\u79F0</label>\n                  <div style="font-weight: bold;" class="custom-confirm-form__value ' + ('buy' == _this.cur_nav ? '' : 'sell') + '">' + this.stock_id.substring(0, 6) + ' ' + this.stock_name + '</div>\n                </div>\n                <div class="custom-confirm-form__item">\n                  <label class="custom-confirm-form__label">\u4EA4\u6613\u4EF7\u683C<span>(\u5143/\u80A1)</span></label>\n                  <div class="custom-confirm-form__value ' + ('buy' == _this.cur_nav ? '' : 'sell') + '">' + (1 == trade_mode ? this.submit_price : '市价') + '</div>\n                </div>\n                <div class="custom-confirm-form__item">\n                  <label class="custom-confirm-form__label">\u4EA4\u6613\u6570\u91CF<span>(\u80A1)</span></label>\n                  <div class="custom-confirm-form__value ' + ('buy' == _this.cur_nav ? '' : 'sell') + '">' + this.submit_amount + '</div>\n                </div>\n                <div class="custom-confirm-form__item">\n                  <label class="custom-confirm-form__label">\u4EA4\u6613\u91D1\u989D<span>(\u5143)</span></label>\n                  <div class="custom-confirm-form__value ' + ('buy' == _this.cur_nav ? '' : 'sell') + '">' + total_amount + '</div>\n                </div>\n                <div class="custom-confirm-form__button">\n                  <a class="custom-confirm-form__btn doAddHandOrder ' + ('buy' == _this.cur_nav ? '' : 'sell') + '">' + ('buy' == _this.cur_nav ? '确认买入' : '确认卖出') + '</a>\n                </div>\n             </form>\n            </main>\n            <button class="custom-confirm__cancel-icon">X</button>\n          </article>\n        ';
        $('.custom-confirm__content').empty().html(html);
        $('.custom-confirm').removeClass('hide');
        // return;
        $('.custom-confirm__cancel-icon').on('click', function () {
          $('.custom-confirm__content').empty();
          $('.custom-confirm').addClass('hide');
        });
        $('.doAddHandOrder').on('click', function () {

          // $.startLoading('正在提交...');
          $.ajax({
            url: (window.REQUEST_PREFIX || '') + '/oms/workflow/' + _this.cur_product_id + '/add_hand_order',
            type: 'post',
            data: {
              stock_code: _this.stock_id,
              trade_mode: _this.trade_mode, //1 限价 3\8 市价(深圳 上海)
              trade_direction: 'buy' == _this.cur_nav ? 1 : 2, //1 买入 2 卖出
              price: _this.submit_price, //价格
              volume: _this.submit_amount, //数量
              is_manual_order: 0, //是否自动委托 0 为自动委托 1为手动
              ignore_tips: 0,
              market: 1
            },
            success: function success(res) {
              // _this.$root.getPositionRealtimeInfo()
              // _this.$root.getEntrustInfo()
              // _this.$root.refresh();//刷新页面数据

              $.clearLoading();
              _this.result_order(res);
              // 提交后刷新
              // _this.resetForm();
            },
            error: function error() {
              _this.submit_amount = '';
              $.clearLoading();
              console.log('error');
            }
          });
        });
      },
      result_order: function result_order(res) {

        $('.custom-confirm__content').empty();
        $('.custom-confirm').addClass('hide');
        var _this = this;
        var row = {};

        //是否显示继续购买按钮
        if (res.code == 0) {
          //购买成功
          row.btnType = false;
          row.entrustStatus = "pass";
          row.style = {};
        } else if (res.code == 5022111) {
          if (res.data[this.stock_id]) {
            var temp = res.data[this.stock_id];
            if (temp.code == 0) {
              row.btnType = false;
              row.entrustStatus = "pass";
              row.style = {};
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
                  };
                } else {
                  //购买失败
                  row.btnType = false;
                  row.entrustStatus = "fail";
                  row.style = {
                    color: "red"
                  };
                  if (temp.msg == "") {
                    row.msg = temp.data.msg;
                  } else {
                    row.msg = [temp.msg];
                  }
                }
              } else {
                //购买失败
                row.btnType = false;
                row.entrustStatus = "fail";
                row.style = {
                  color: "red"
                };
                if (temp.msg == "") {
                  row.msg = [];
                } else {
                  row.msg = [temp.msg];
                }
              }
            } else if (temp.code == 5022110) {
              //禁止性风控
              row.btnType = false;
              row.msg = [temp.msg];
              row.msg.unshift("委托失败");
              row.entrustStatus = "fail";
              row.style = {
                color: "＃F44336"
              };
            } else {
              //禁止性风控
              row.btnType = false;
              row.msg = temp.data.msg;
              row.entrustStatus = "fail";
              row.style = {
                color: "red"
              };
            }
          } else {
            //购买成功
            row.btnType = false;
            row.msg = ["委托成功"];
            row.entrustStatus = "pass";
            row.style = {};
          }
        } else {
          //购买失败
          row.btnType = false;
          row.entrustStatus = "fail";
          row.style = {
            color: "red"
          };
          if (res.msg == "") {
            row.msg = [];
          } else {
            row.msg = [res.msg];
          }
        }
        var contentChild = Vue.extend({
          data: function data() {
            var total = +_this.submit_price * +_this.submit_amount;
            var submit_amount = _this.submit_amount;
            _this.submit_amount = ''; //清空数量
            total = total.toFixed(2);
            return {
              stock_id: _this.stock_id.substring(0, 5),
              stock_name: _this.stock_name,
              submit_price: _this.submit_price,
              submit_amount: submit_amount,
              total: total,
              result: row,
              trade_mode: _this.trade_mode
            };
          },

          template: '\n                <form class="custom-confirm-form" style="padding:0;width:222px;">\n                <template v-if="result.entrustStatus==\'pass\'">\n                  <div class="custom-confirm__status">\n                    <i></i> \u63D0\u4EA4\u6210\u529F\n                  </div>\n                </template>\n                <template v-else>\n                  <div class="custom-confirm__status custom-confirm__status--failure">\n                    <i></i> \u63D0\u4EA4\u5931\u8D25\n                    <span v-for="msg in result.msg" class="custom-confirm__status--failure-reason">{{msg}}</br></span>\n                  </div>\n                </template>\n                <div class="custom-confirm-form__item">\n                  <label class="custom-confirm-form__label">\u80A1\u7968\u4EE3\u7801/\u540D\u79F0</label>\n                  <div style="font-weight: bold;" class="custom-confirm-form__value ">{{stock_id}} {{stock_name}}</div>\n                </div>\n                <div class="custom-confirm-form__item">\n                  <label class="custom-confirm-form__label">\u4EA4\u6613\u4EF7\u683C<span>(\u5143/\u80A1)</span></label>\n                  <div class="custom-confirm-form__value ">{{trade_mode==2?"\u5E02\u4EF7":submit_price}}</div>\n                </div>\n                <div class="custom-confirm-form__item">\n                  <label class="custom-confirm-form__label">\u4EA4\u6613\u6570\u91CF<span>(\u80A1)</span></label>\n                  <div class="custom-confirm-form__value ">{{submit_amount}}</div>\n                </div>\n                <div class="custom-confirm-form__item">\n                  <label class="custom-confirm-form__label">\u4EA4\u6613\u91D1\u989D<span>(\u5143)</span></label>\n                  <div class="custom-confirm-form__value ">{{total}}</div>\n                </div>\n                <div class="buttons" style="margin-top:30px">\n                  <template v-if="result.entrustStatus ==\'alert\'">\n                    <button  type="button" class="vue-confirm__btns--cancel"  @click=btn_submit style="width:60px">\u786E\u5B9A</button>\n                    <button type="button" class="vue-confirm__btns--submit"  @click=btn_cancel style="width:60px">\u53D6\u6D88</button>\n                  </template>\n                  <template v-if="result.entrustStatus ==\'pass\'">\n                    <button type="button" class="vue-confirm__btns--cancel"  @click=btn_cancel style="width:60px">\u786E\u8BA4</button>\n                  </template>\n                  <template v-if="result.entrustStatus ==\'fail\'">\n                    <button type="button" class="vue-confirm__btns--submit"  @click=btn_cancel style="width:60px">\u53D6\u6D88</button>\n                  </template>\n                </div>\n             </form>\n\n            ',
          methods: {
            btn_submit: function btn_submit() {
              //忽略提示性风控 继续购买
              var self = this;
              $.post((window.REQUEST_PREFIX || '') + '/oms/workflow/' + _this.cur_product_id + '/add_hand_order', {
                stock_code: _this.stock_id,
                trade_mode: this.trade_mode, //1 限价 3\8 市价(深圳 上海)
                trade_direction: 'buy' == _this.cur_nav ? 1 : 2, //1 买入 2 卖出
                price: this.submit_price, //价格
                volume: this.submit_amount, //数量
                is_manual_order: 0, //是否自动委托 0 为自动委托 1为手动
                market: 1,
                ignore_tips: 1 //忽略提示风控

              }).done(function (res) {
                if (res.code == 0) {
                  $.omsAlert("委托成功");
                } else {
                  $.omsAlert(res.msg);
                }
                setTimeout(function () {
                  self.$parent.close();
                }, 500);
                //_this.tableData = Object.assign({}, _this.tableData)
              }).fail(function () {
                $.omsAlert("委托失败");
                setTimeout(function () {
                  self.$parent.close();
                }, 500);
              }).always(function () {
                _this.$root.refresh();
              });
            },
            btn_cancel: function btn_cancel() {
              this.$parent.close();
              _this.$root.refresh();
            }
          },
          mounted: function mounted() {
            $.clearLoading();
          }
        });

        Vue.prototype.$confirm({
          title: '',
          content: contentChild,
          closeIcon: false
        });
      },

      resetForm: function resetForm() {
        this.stock_id = '';
        this.stock_name = '';
        this.stock_input = '';
        this.stockList = '';
        this.stock_info = '';
        this.submit_price = '';
        this.submit_amount = '';
        this.amount_radio_value = '';
      },
      setSubmitAmount: function setSubmitAmount(v) {
        this.clearErrorTip();
        var oldValue = this.submit_amount;
        if (!this.submit_amount) {
          oldValue = 0;
        }
        this.submit_amount = Math.floor(parseFloat(oldValue) * v / 100) * 100;
      },
      calcSubmitPrice: function calcSubmitPrice(v) {
        this.clearErrorTip();
        var oldValue = this.submit_price;
        if (!this.submit_price) {
          oldValue = 0;
        }
        this.submit_price = parseFloat((parseFloat(oldValue) * 1000 + parseFloat(v) * 1000) / 1000);
      },
      calcSubmitAmount: function calcSubmitAmount(v) {
        this.clearErrorTip();
        var oldValue = this.submit_amount;
        if (!this.submit_amount) {
          oldValue = 0;
        }
        this.submit_amount = parseFloat(oldValue) + parseFloat(v);
      },
      parsePrice: function parsePrice(v) {
        if (undefined == v) {
          return '- -';
        }
        return numeral(v).format('0.000');
        // if (/\.\d{3}/.test(v)) {
        //   return numeral(v).format('0.000');
        // }else{
        //   return numeral(v).format('0.00');
        // }
      },
      parseNumber: function parseNumber(v) {
        if (undefined == v) {
          return '- -';
        }
        // if (v >= 1000) {
        //   return numeral(v / 1000).format('0.0') + 'K';
        // }else{
        //   return numeral(v).format('0,0');
        // }
        var reg = /(?=(?!\b)(\d{3})+$)/g;
        return String(v).replace(reg, ',');
      },
      parsePercent: function parsePercent(v) {
        if (v == undefined) {
          return '- -';
        } else {
          return numeral(v).format('0.00%');
        }
      },
      selectOneStock: function selectOneStock(id, name) {
        var _this = this;
        // this.inputStockCode = id;
        this.stock_name = name;
        this.stock_input = id.substring(0, 6);
        this.stock_id = id;
        this.getStockDetail(function () {
          if ('buy' == _this.cur_nav) {
            _this.submit_price = _this.stock_info.ask1_price;
          } else if ('sell' == _this.cur_nav) {
            _this.submit_price = _this.stock_info.bid1_price;
          }
        });
        // 额外，每五秒刷新
        clearInterval(this.update_timer);
        this.update_timer = setInterval(function () {
          _this.getStockDetail();
        }, 5000);

        this.stockList = [];
      },
      showTrader: function showTrader(cur_nav) {
        if (this.showArr.some(function (e) {
          return e.cur_nav == cur_nav;
        })) {
          return true;
        }

        return false;
      },
      getStockDetail: function getStockDetail(callback) {
        var _this = this;
        $.ajax({
          url: (window.REQUEST_PREFIX || '') + '/oms/helper/stock_detail',
          type: 'get',
          data: {
            stock_id: this.stock_id
          },
          success: function success(_ref2) {
            var code = _ref2.code,
                msg = _ref2.msg,
                data = _ref2.data;

            if (0 == code) {
              _this.stock_info = data[0];
              if (Object.prototype.toString.call(callback) == '[object Function]') {
                callback();
              }
            } else {
              //$.failNotice(msg);
              _this.resetForm(); //请求异常时清空股票详情
            }
          },
          error: function error() {
            console.log('error');
          }
        });
      },
      getStockList: function getStockList(event) {
        var _this = this;
        // 判断stock_input 和 stock_id前六位是否一致
        if (this.stock_input !== this.stock_id.substring(0, 6)) {
          this.stock_id = '';
          this.stock_name = '';
          this.stock_info = '';
        }
        this.latest_suggest_timestamp = new Date().valueOf();
        var latest_suggest_timestamp = this.latest_suggest_timestamp;
        var str = (window.REQUEST_PREFIX || '') + '/oms/helper/code_genius?stock_code=' + this.stock_input;
        $.getJSON(str).done(function (res) {
          if (latest_suggest_timestamp != _this.latest_suggest_timestamp) {
            return;
          }
          if (res.code == 0 || res.code == 1123124) {
            _this.stockList = res.data;
            // var html = '';
            // res.data.forEach(function(e){
            //   html += '<li data-id="' + e.stock_id +'" data-name="'+ e.stock_name +'">' + e.stock_id + ' &nbsp; ' + e.stock_name + '</li>';
            // });
            // $('.custom-stock-suggest').html(html).slideDown(300);

            // // 当只有一个符合条件时，默认选中该项。
            // if(1 == res.code.length){
            //   selectOneStock($('.custom-stock-suggest>li'));
            // }

            if (1 == _this.stockList.length) {
              _this.selectOneStock(_this.stockList[0].stock_id, _this.stockList[0].stock_name);
            }
          } else {
            // $.omsAlert('获取建议证券列表失败！',false,300);
          }
        }).always(function () {
          $('.stock-input').removeClass('loading');
        });
      },
      listenKeyboard: function listenKeyboard($event) {
        //监听键盘事件
        if ($event.code == "ArrowDown") {
          //向下
          this.keyup_index++;
        }
        if ($event.code == "ArrowUp") {
          //向下
          this.keyup_index--;
        }
        this.keyup_index = this.keyup_index % 3;
        this.$refs[this.keyup_index].focus();
        if ($event.code == "ArrowLeft") {
          //向左
          if (this.keyup_index == 1) {
            this.calcSubmitPrice(-0.01);
          }
          if (this.keyup_index == 2) {
            this.calcSubmitAmount(-100);
          }
        }
        if ($event.code == "ArrowRight") {
          //向右
          if (this.keyup_index == 1) {
            this.calcSubmitPrice(+0.01);
          }
          if (this.keyup_index == 2) {
            this.calcSubmitAmount(+100);
          }
        }
        if ($event.code == "Enter") {
          this.add_hand_order();
        }
      }
    }
  });
  // 表格显示模块
  Vue.component('client-grid', {
    props: ['cur_nav', 'cur_product_info', 'need_show_arr', 'profit_of_today_v2', 'profit_of_today_v2_id', 'center_list'],
    template: '\n      <section class="client-body__grid client-grid" :class="{\'file-bgd\': \'file_center\' == cur_nav}" style="display: flex;flex-direction:column;">\n        <div class="client-body__gather">\n          <template v-if="cur_nav == \'account\' || cur_nav == \'position\' || cur_nav == \'buy\' || cur_nav == \'sell\'">\n            <div>\u8D44\u4EA7\uFF1A</br><span>{{ parseNumber(cur_product_info.total_assets, \'0.00\') }}</span></div>\n            <div>\u8D44\u91D1\u4F59\u989D\uFF1A</br><span>{{ parseNumber(cur_product_info.balance_amount, \'0.00\') }}</span></div>\n            <div>\u80A1\u7968\u5E02\u503C\uFF1A</br><span>{{ parseNumber(cur_product_info.security, \'0.00\') }}</span></div>\n            <div>\u603B\u76C8\u4E8F\uFF1A</br><span :class="checkPositive(cur_product_info.net_profite)">{{ parseNumber(cur_product_info.net_profite, \'0.00\') }}</span></div>\n            <div>\u4ECA\u65E5\u76C8\u4E8F\uFF1A</br><span :class="checkPositive(getProfitOfToday(cur_product_info))">{{ getProfitOfToday(cur_product_info) }}</span></div>\n            <div>\u501F\u6B3E\uFF1A</br><span>{{ parseNumber(cur_product_info.loan_capital, \'0.00\') }}</span></div>\n            <div>\u6743\u76CA\uFF1A</br><span>{{ parseNumber(cur_product_info.right_capital, \'0.00\') }}</span></div>\n            <div>\u5355\u4F4D\u51C0\u503C\uFF1A</br><span>{{ parseNumber(cur_product_info.net_value, \'0.00\') }}</span></div>\n            <div>\u6B62\u635F\u7EBF\uFF1A</br><span>{{ parseNumber(cur_product_info.closing_line_data_net_value, \'0.00\') }}</span></div>\n            <div>\u9884\u8B66\u7EBF\uFF1A</br><span>{{ parseNumber(cur_product_info.risk_line_data_net_value, \'0.00\') }}</span></div>\n            <div v-if="false">\u725B\u4EBA\u76C8\u4E8F\uFF1A</br><span>{{ parseNumber(cur_product_info.trader_profite, \'0.00\') }}</span></div>\n          </template>\n          <template v-if="cur_nav == \'revert\'">\n            <div class="client-revert" style="line-height:50px;padding:0">\n              <label class="">\u80A1\u7968\u4EE3\u7801</label>\n              <div class="client-stockQuery">\n                <input v-model="queryStock" class="client-stockQuery__input" />\n              </div>\n              <a class="client-revert__btn" v-on:click="selectAll">\u5168\u9009</a>\n              <a class="client-revert__btn" v-on:click="deselectAll">\u5168\u4E0D\u9009</a>\n              <a class="client-revert__btn client-revert__btn--revert" v-on:click="doRevert(null)">\u64A4\u5355</a>\n            </div>\n          </template>\n          <template v-if="cur_nav == \'deal_today\' || cur_nav == \'entrust_today\'">\n            <div class="client-revert" style="line-height:50px;padding:0">\n              <label class="">\u80A1\u7968\u4EE3\u7801</label>\n              <div class="client-stockQuery">\n                <input v-model="queryStock" class="client-stockQuery__input" />\n              </div>\n            </div>\n          </template>\n          <template v-if="cur_nav == \'entrust_history\' || cur_nav == \'deal_history\'">\n            <div style="display: flex;line-height:50px;padding:0">\n              <label>\u8D77\u59CB\u65E5\u671F</label>\n              <div style="position: relative;margin-right: 20px;margin-left: 5px;">\n                <vue-zebra_date_picker :value="beginDate" :minDate="minDate" :maxDate="maxDate" v-on:select="beginDate = ($event)"></vue-zebra_date_picker>\n              </div>\n              <label>\u7ED3\u675F\u65E5\u671F</label>\n              <div style="position: relative;margin-right: 20px;margin-left: 5px;">\n                <vue-zebra_date_picker :value="endDate" :minDate="minDate" :maxDate="maxDate" v-on:select="endDate = ($event)"></vue-zebra_date_picker>\n              </div>\n              <label>\u80A1\u7968\u4EE3\u7801</label>\n              <div class="client-stockQuery">\n                <input v-model="queryStock" class="client-stockQuery__input" />\n              </div>\n            </div>\n          </template>\n          <template v-if="\'file_center\' == cur_nav">\n            <div class="file-center-head fileCenterHead">\n              <div class="file-center-head__report fileCenterSelect">\n                <vue-multiple_select :options="options" :flag_check_all="true" :checked_arr="select_id" :init_obj="init_obj" v-on:multiple_select="select_id = ($event)"></vue-multiple_select>\n              </div>\n              <div class="file-center-head__data fileCenterData">\n                <vue-zebra_date_picker :value="currentDate" v-on:select="currentDate = ($event)"  :min_date="minDate" :max_date="maxDate"></vue-zebra_date_picker>\n              </div>\n              <div style="flex-grow: 1;"></div>\n              <button class="file-center-head__botchDown fileBotchDown" @click="batch_down()">\u6279\u91CF\u4E0B\u8F7D</button>\n            </div>\n          </template>\n        </div>\n        <div style="display: flex;flex: 1;">\n          <slot></slot>\n          <div style="flex: 1;">\n            <vue-table v-if="!showDisplayTableData() && !showDisplayTableDataV2()" v-for="show in need_show_arr" :tableController="show.tableController" :tableData="show.tableData" @tr_click="tr_click" @tr_dbclick=tr_dbclick></vue-table>\n            <vue-table v-if="showDisplayTableDataV2()" v-for="show in need_show_arr" :tableController="show.tableController" :tableData="displayTableDataV2" @tr_click="tr_click" @tr_dbclick=tr_dbclick></vue-table>\n            <vue-table v-if="showDisplayTableData()" v-for="show in need_show_arr" :tableController="show.tableController" :tableData="displayTableData" @tr_click="tr_click" @tr_dbclick=tr_dbclick></vue-table>\n            <file-center-content v-if="\'file_center\' == cur_nav" @batch_down_report_id="batch_down_list = $event" :product_list="center_list" :product_data="currentDate"></file-center-content>\n          </div>\n\n        </div>\n\n      </section>\n    ',
    data: function data() {
      return {
        minDate: '2015-01-01',
        maxDate: function () {
          return moment().format('YYYY-MM-DD');
        }(),
        beginDate: function () {
          return moment().format('YYYY-MM-DD');
        }(),
        endDate: function () {
          return moment().format('YYYY-MM-DD');
        }(),
        currentDate: function () {
          return moment().format('YYYY-MM-DD');
        }(), //针对文件中心
        queryStock: '',
        focusFlag: '',
        stockList: [],
        init_obj: {
          allSelected: '全部报表',
          noMatchesFound: '未选择任何报表',
          placeholder: '请先选择报表'
        },
        select_id: '',
        batch_down_fn: false,
        batch_down_list: []
      };
    },
    watch: {
      select_id: function select_id() {
        this.$emit('select_report_id', this.select_id);
      },
      queryStock: function queryStock() {
        this.need_show_arr[0].tableData.forEach(function (e) {
          e.checked = false;
        });
        this.$emit('change_query_stock', this.queryStock);
      },
      beginDate: function beginDate() {
        this.$emit('change_begin_date', this.beginDate);
      },
      endDate: function endDate() {
        this.$emit('change_end_date', this.endDate);
      },
      currentDate: function currentDate() {
        this.batch_down_list = [];
        this.$emit('current_date_change', this.currentDate);
      },
      cur_nav: function cur_nav() {
        this.batch_down_list = [];
      }
    },
    computed: {
      displayTableData: function displayTableData() {
        var _this = this;
        if ('deal_today' == this.cur_nav || 'entrust_today' == this.cur_nav) {
          var rtn = [];
          this.need_show_arr[0].tableData.forEach(function (e) {
            if (new RegExp(_this.queryStock).test(e.stock.code)) {
              rtn.push(e);
            }
          });
          return rtn;
        } else {
          return [];
        }
      },
      options: function options() {
        if ('file_center' != this.cur_nav) {
          //主要是为了防止离开文件中心页面之后batch_down_list数组里面还有原先选中的报表id
          this.batch_down_list = [];
        }
        var report_file_center = [];
        //机构版专户版报表
        if (3 == window.LOGIN_INFO.org_info.theme) {
          report_file_center = [{
            value: '资产查询数据',
            label: '资产查询数据',
            num: '0'
          }, {
            value: '持仓查询数据',
            label: '持仓查询数据',
            num: '1'
          }, {
            value: '委托查询数据',
            label: '委托查询数据',
            num: '2'
          }, {
            value: '成交查询数据',
            label: '成交查询数据',
            num: '3'
          }, {
            value: '清算查询数据',
            label: '清算查询数据',
            num: '4'
          }];
        } else {
          report_file_center = [{
            value: '产品报表',
            label: '产品报表',
            num: '0'
          }, {
            value: '股票持仓报表',
            label: '股票持仓报表',
            num: '1'
          }, {
            value: '资产查询数据',
            label: '资产查询数据',
            num: '2'
          }, {
            value: '持仓查询数据',
            label: '持仓查询数据',
            num: '3'
          }, {
            value: '委托查询数据',
            label: '委托查询数据',
            num: '4'
          }, {
            value: '成交查询数据',
            label: '成交查询数据',
            num: '5'
          }];
        }
        return report_file_center;
      },
      displayTableDataV2: function displayTableDataV2() {
        var _this = this;
        if ('revert' == this.cur_nav || 'entrust_history' == this.cur_nav || 'deal_history' == this.cur_nav) {
          var rtn = [];
          if (this.need_show_arr[0].tableData) {
            this.need_show_arr[0].tableData.forEach(function (e) {
              if (new RegExp(_this.queryStock).test(e.stock_code)) {
                rtn.push(e);
              } else if (e.stock && new RegExp(_this.queryStock).test(e.stock.code)) {
                rtn.push(e);
              }
            });
            return rtn;
          } else {
            return [];
          }
        } else {
          return [];
        }
      }
    },
    methods: {
      //文件中心  批量下载
      batch_down: function batch_down() {
        var _this2 = this;

        var _this = this;
        this.batch_down_fn = true;
        // 如果没有选中的报表id,禁止点击
        if (undefined == this.batch_down_list || '' == this.batch_down_list || 0 == this.batch_down_list.length) {
          $.omsAlert('请先选择报表');
          return false;
        }

        var down_url_arr = [];
        this.batch_down_list.forEach(function (e) {
          _this.center_list.forEach(function (i) {
            if (e == i.id) {
              var obj = '';
              obj = i.down_url.split('storage/')[1];
              down_url_arr.push(decodeURI(obj));
            }
          });
        });
        if (0 == down_url_arr.length) {
          $.omsAlert('请先选择报表');
          return false;
        }
        $.ajax({
          url: '/utility/downloadzip',
          type: 'GET',
          data: {
            user_id: window.LOGIN_INFO.user_id,
            file_name: down_url_arr.join(','),
            date: this.currentDate.split('-').join('')
          },
          success: function success(_ref3) {
            var code = _ref3.code,
                msg = _ref3.msg,
                data = _ref3.data;

            window.location.href = '/utility/downloadzip?user_id=' + window.LOGIN_INFO.user_id + '&file_name=' + down_url_arr.join(',') + '&date=' + _this2.currentDate.split('-').join('');
            return false;
          },
          error: function error() {
            $.omsAlert('网络异常，请尝试');
          }
        });
      },
      showDisplayTableData: function showDisplayTableData() {
        return this.cur_nav == 'deal_today' || this.cur_nav == 'entrust_today';
      },
      showDisplayTableDataV2: function showDisplayTableDataV2() {
        return this.cur_nav == 'revert' || this.cur_nav == 'entrust_history' || this.cur_nav == 'deal_history';
      },
      doRevert: function doRevert(stock) {
        // TODO  撤单需要支持批量，目前只取了最后一个
        // let order_id;
        var _this = this;
        var orderArr = [];
        var trHtml = '';
        if (stock == null) {
          //没有单只股票时 为批量交易
          this.displayTableDataV2.forEach(function (e) {
            if (e.checked == true) {
              // order_id = e.id;
              orderArr.push({
                order_id: e.id,
                stock_code: e.stock_info.stock_code,
                stock_name: e.stock_info.stock_name,
                type: e.entrust.type //买卖方向
              });
            }
          });
        } else {
          orderArr.push({
            order_id: stock.id,
            stock_code: stock.stock_info.stock_code,
            stock_name: stock.stock_info.stock_name,
            type: stock.entrust.type //买卖方向
          });
        }
        if (orderArr.length == 0) {
          $.omsAlert('请选择需要撤单的委托');
          return;
        }
        orderArr.forEach(function (e) {
          trHtml += '<tr>\n            <td>' + e.stock_code + '</td>\n            <td>' + e.stock_name + '</td>\n            <td class="' + (e.type == 1 ? 'red' : 'blue') + '">' + (e.type == 1 ? '买入' : '卖出') + '</td>\n            <td>' + e.order_id + '</td>\n          </tr>';
        });

        var html = '\n          <article class="custom-confirm__body" style="width: 390px;">\n            <header class="custom-confirm__header">\n              <h2>\u64A4\u5355\u786E\u8BA4</h2>\n            </header>\n            <main>\n              <form class="custom-confirm-form">\n                <div class="custom-confirm-form__title">\u5F85\u64A4\u5355\u59D4\u6258\uFF1A' + orderArr.length + '\u6761\uFF0C\u786E\u5B9A\u64A4\u9500\u4EE5\u4E0B\u59D4\u6258\uFF1F</div>\n                <table class="custom-confirm-form__table">\n                  <tbody>\n                    <tr>\n                      <td>\u80A1\u7968\u4EE3\u7801</td>\n                      <td>\u80A1\u7968\u540D\u79F0</td>\n                      <td>\u4E70\u5356\u65B9\u5411</td>\n                      <td>\u7F16\u53F7</td>\n                    </tr>\n                  </tbody>\n                  <tbody>\n                    ' + trHtml + '\n                  </tbody>\n                </table>\n                <div class="custom-confirm-form__button">\n                  <a class="doRevertOrder custom-confirm-form__btn custom-confirm-form__btn--doCancel">\u786E\u8BA4\u64A4\u5355</a>\n                </div>\n             </form>\n            </main>\n            <button class="custom-confirm__cancel-icon">X</button>\n          </article>\n        ';
        $('.custom-confirm__content').empty().html(html);
        $('.custom-confirm').removeClass('hide');

        $('.custom-confirm__cancel-icon').on('click', function () {
          $('.custom-confirm__content').empty();
          $('.custom-confirm').addClass('hide');
        });

        var showRevertResult = function showRevertResult() {
          $.clearLoading();
          _this.$root.refresh();
          var resultHtml = '';
          var okNum = 0;
          var notOkNum = 0;
          orderArr.forEach(function (e) {
            resultHtml += '\n            <tr>\n              <td>' + e.stock_code + '</td>\n              <td>' + e.stock_name + '</td>\n              <td class="' + (e.type == 1 ? 'red' : 'blue') + '">' + (e.type == 1 ? '买入' : '卖出') + '</td>\n              <td>' + e.order_id + '</td>\n              <td class="' + (e.code == 0 ? 'statusSuccess' : 'statusFailure') + '">' + (e.code == 0 ? '成功' : '撤单失败') + '</td>\n              <td class="' + (e.code == 0 ? '' : 'statusFailure') + '">' + (0 == e.code ? '无' : e.msg) + '</td>\n            </tr>\n            ';

            if (0 == e.code) {
              okNum += 1;
            } else {
              notOkNum += 1;
            }
          });
          var html = '\n          <article class="custom-confirm__body" style="width: 552px;">\n            <main>\n              <form class="custom-confirm-form">\n                <div class="custom-confirm-form__title">\u5F53\u524D' + okNum + '\u6761<span class="statusSuccess">\u64A4\u5355\u6210\u529F</span>\uFF0C' + notOkNum + '\u6761<span class="statusFailure">\u64A4\u5355\u5931\u8D25</span></div>\n                <table class="custom-confirm-form__table">\n                  <tbody>\n                    <tr>\n                      <td>\u80A1\u7968\u4EE3\u7801</td>\n                      <td>\u80A1\u7968\u540D\u79F0</td>\n                      <td>\u4E70\u5356\u65B9\u5411</td>\n                      <td>\u7F16\u53F7</td>\n                      <td>\u64A4\u5355\u72B6\u6001</td>\n                      <td>\u5907\u6CE8</td>\n                    </tr>\n                  </tbody>\n                  <tbody>\n                    ' + resultHtml + '\n                  </tbody>\n                </table>\n                <div class="custom-confirm-form__button">\n                  <a class="custom-confirm-form__btn custom-confirm-form__btn--close">\u5173\u95ED</a>\n                </div>\n             </form>\n            </main>\n          </article>\n          ';
          $('.custom-confirm__content').empty().html(html);
          $('.custom-confirm').removeClass('hide');
          $('.custom-confirm-form__btn--close').on('click', function () {
            $('.custom-confirm__content').empty();
            $('.custom-confirm').addClass('hide');
          });

          // var secs =3; //倒计时的秒数
          // for(let i=secs;i>=0;i--) {
          //   // 这里使用的i是通过let定义的。
          //   window.setTimeout(function(){
          //     doClose(i);
          //   }, (secs-i) * 1000);
          // }
        };

        $('.doRevertOrder').on('click', function () {
          // 批量处理之后，修改列表
          $.startLoading();
          orderArr.forEach(function (e) {
            var order_id = e.order_id;
            $.ajax({
              url: (window.REQUEST_PREFIX || '') + '/oms/workflow/' + _this.cur_product_info.id + '/' + order_id + '/do_cancel',
              type: 'post',
              data: {
                workflow_id: e.order_id
              },
              success: function success(_ref4) {
                var code = _ref4.code,
                    msg = _ref4.msg,
                    data = _ref4.data;

                if (0 == code) {} else {
                  // $.omsAlert(msg);
                }
                e.msg = msg;
                e.code = code;
                e.status = 'finished';

                if (orderArr.every(function (el) {
                  return el.status == 'finished';
                })) {
                  showRevertResult();
                }
              },
              error: function error() {
                console.log('error');
                e.msg = '网络异常';
                e.code = -1;
                e.status = 'finished';

                if (orderArr.every(function (el) {
                  return el.status == 'finished';
                })) {
                  showRevertResult();
                }
              }
            });
          });
        });

        // $.ajax({
        //   url: (window.REQUEST_PREFIX||'')+'/oms/workflow/'+this.cur_product_info.id+'/'+order_id +'/do_cancel',
        //   type: 'post',
        //   data: {
        //     workflow_id: order_id
        //   },
        //   success: function({code, msg, data}){
        //     if (0 == code) {
        //       // TODO
        //       debugger;
        //     }else{
        //       $.omsAlert(msg);
        //     }
        //   },
        //   error: function(){
        //     console.log('error')
        //   }
        // })
      },
      selectAll: function selectAll() {
        // 这里需要把tableData动态的到，因为要通过股票代码遍历
        this.need_show_arr.forEach(function (e) {
          e.tableData.forEach(function (el) {
            if (!el.disabled) {
              el.checked = true;
            }
          });
        });
      },
      deselectAll: function deselectAll() {
        // 这里需要把tableData动态的到，因为要通过股票代码遍历
        this.need_show_arr.forEach(function (e) {
          e.tableData.forEach(function (el) {
            if (!el.disabled) {
              el.checked = false;
            }
          });
        });
      },
      parseNumber: function parseNumber(v, rule) {
        if (!v) {
          return "- -";
        }
        return numeral(v).format(rule);
      },
      checkPositive: function checkPositive(v) {
        if (parseFloat(v) > 0) {
          return 'num_positive';
        } else if (parseFloat(v) < 0) {
          return 'num_negative';
        }

        return '';
      },
      getProfitOfToday: function getProfitOfToday(info) {
        if (info.id != this.profit_of_today_v2_id) {
          return '- -';
        }
        if (info.redeem_fee == undefined || info.manage_fee == undefined || info.other_fee == undefined) {
          return '- -';
        }
        return numeral(this.profit_of_today_v2 - info.redeem_fee - info.manage_fee - info.other_fee).format('0.00');
      },
      tr_click: function tr_click(index, row) {
        //子模块的点击事件
        //表格内的tr被点击
        if (this.cur_nav != "revert") {
          //撤单页面不需要点击
          this.$emit("tr_click", index, row); //将index 和row 传递给 根节点
        }
      },
      tr_dbclick: function tr_dbclick(index, row) {
        if (this.cur_nav == "revert") {
          //撤单页面双击撤单
          this.$emit('tr_dbclick', index, row);
          // 双击撤单
          this.doRevert(row);
        }
      }
    }
  });

  // 重置密码
  Vue.component('client-form-password', {
    props: [],
    template: '\n      <section class="client-body__password section-resetPassword">\n        <div class="section-resetPassword__content">\n          <h1>' + APP_NAME + '\u8D44\u4EA7\u7BA1\u7406\u5E73\u53F0</h1>\n          <form>\n            <div class="section-resetPassword__item"><span class="section-resetPassword__error-tip">{{error_tip}}</span></div>\n            <div class="section-resetPassword__item"><label><input autocomplete="new-password" type="password" v-model="old_password" placeHolder="\u8BF7\u8F93\u5165\u539F\u5BC6\u7801" /></label></div>\n            <div class="section-resetPassword__item"><label><input autocomplete="new-password" type="password" v-model="new_password" placeHolder="\u8BF7\u8F93\u5165\u65B0\u5BC6\u7801" /></label></div>\n\n            <div class="section-resetPassword__controller">\n              <a class="section-resetPassword__controller--btn" v-on:click="doSubmit">\u786E\u8BA4\u4FEE\u6539</a>\n            </div>\n          </form>\n        </div>\n      </section>\n    ',
    data: function data() {
      return {
        error_tip: '',
        old_password: '',
        new_password: ''
      };
    },
    methods: {
      resetForm: function resetForm() {
        this.error_tip = '';
        this.old_password = '';
        this.new_password = '';
      },
      doSubmit: function doSubmit() {
        var _this = this;
        var old_password = this.old_password;
        var new_password = this.new_password;
        if (new_password.length > 20 || new_password.length < 1) {
          this.error_tip = '提示：1-20个字符，只允许字母和数字';
          return;
        }
        if (null === new_password.match(/^([a-zA-Z0-9])*$/)) {
          this.error_tip = '提示：1-20个字符，只允许字母和数字';
          return;
        }
        // if (new_password !== new_password) {
        //   this.error_tip = '提示：您输入的密码不一致';
        //   return;
        // }
        $.startLoading('正在提交...');
        $.ajax({
          type: 'post',
          url: '/bms-pub/user/modify_self_password',
          data: {
            user_id: LOGIN_INFO.user_id,
            login_password: old_password,
            new_password: new_password
          },
          success: function success(res) {
            $.clearLoading();
            if (0 == res.code) {
              _this.resetForm();
              $.omsAlert(res.msg);
            } else {
              _this.error_tip = res.msg;
            }
          },
          error: function error() {
            $.clearLoading();
            $.failNotice();
          }
        });
      }
    }
  });

  //文件中心
  //input 点击事件，方便传值全选
  Vue.component('report-input-checkout', {
    props: ['reportItem', 'reportAllSelected', 'change_selected_id'],
    template: '\n      <div>\n        <input type="checkbox" v-model="change_model" :disabled="disabledFn(reportItem)" @click="change_selected_model()"/>\n        {{reportItem.category}}\n      </div>\n    ',
    data: function data() {
      return {
        change_model: false, //单个报表选中判断
        change_model_id: this.reportItem.id //当前报表id
      };
    },
    watch: {
      change_model: function change_model() {
        //通过是否勾选来得到选中的报表id
        var _this = this;
        if (false == this.change_model) {
          this.change_selected_id.forEach(function (e, index) {
            if (_this.reportItem.id == e) {
              _this.change_selected_id.splice(index, 1);
            }
          });
        } else {
          this.change_selected_id.push(this.reportItem.id);
        }
        this.$emit('change_model_report', this.change_model);
      },
      change_model_id: function change_model_id() {
        this.$emit('change_model_report_id', this.change_model_id);
      },
      reportAllSelected: function reportAllSelected() {
        //通过是否勾选来判断是否全部选中报表
        if (1 != this.reportItem.status) {
          return false;
        }
        this.change_model = this.reportAllSelected;
      }
    },
    methods: {
      change_selected_model: function change_selected_model() {
        if (false == this.change_model) {
          return this.change_model = false;
        }
        return this.change_model = true;
      },
      disabledFn: function disabledFn(reportItem) {
        if (1 != reportItem.status) {
          return 'disabled';
        }
      }
    }
  });
  //文件中心表格
  Vue.component('file-center-content', {
    props: ['product_list', 'product_data'],
    template: '\n      <table class="file-center-content">\n        <tr>\n          <th><input type="checkbox" v-model="reportAllSelected"/>\u7C7B\u522B</th>\n          <th>\u62A5\u8868\u540D</th>\n          <th>\u72B6\u6001</th>\n          <th>\u751F\u6210\u65F6\u95F4</th>\n          <th></th>\n          <th></th>\n          <th></th>\n        </tr>\n        <tr v-for="reportItem in product_list">\n          <td>\n            <report-input-checkout :change_selected_id="change_selected_id" :reportAllSelected="reportAllSelected" :reportItem="reportItem"></report-input-checkout>\n          </td>\n          <td>{{reportItem.report_name}}</td>\n          <td v-text="reportStatus(reportItem)"></td>\n          <td>{{reportItem.down_time}}</td>\n          <td><a :id="\'report_id\'+reportItem.id" :class="{click_change: 1==reportItem.status,no_click_change:1!=reportItem.status}" @click="reportDoenLoad(reportItem)">\u4E0B\u8F7D</a></td>\n          <td><a class="file-center-content__reGenerate" :class="{click_change: 1!=reportItem.status,no_click_change:1==reportItem.status || 0 == reportItem.status}" @click="regenerate(reportItem)">\u91CD\u65B0\u751F\u6210</a></td>\n          <td><a class="file-center-content__delete" @click="deleteReport(reportItem)">\u5220\u9664</a></td>\n        </tr>\n        <tr v-if="0 == product_list.length">\n          <td colspan="7">\u8BE5\u65F6\u6BB5\u6682\u65E0\u5339\u914D\u8BB0\u5F55</td>\n        </tr>\n      </table>\n    ',
    data: function data() {
      return {
        reportAllSelected: false, //全选
        change_selected_id: []
      };
    },
    watch: {
      change_selected_id: function change_selected_id() {
        this.$emit('batch_down_report_id', this.change_selected_id);
      },
      product_data: function product_data() {
        this.reportAllSelected = false;
      }
    },
    methods: {
      reportStatus: function reportStatus(itemId) {
        if (0 == itemId.status) {
          return '生成中';
        } else if (1 == itemId.status) {
          return '已生成';
        } else if (2 == itemId.status) {
          return '已失败';
        }
      },
      deleteReport: function deleteReport(item) {
        //删除报表文件
        var _this = this;
        $.confirm({
          title: '退出确认',
          content: '\n            <div class="vue-confirm">\n              <div style="font-size: 14px; text-align: center; color: #000000; padding: 60px 0;">\u786E\u8BA4\u5220\u9664\u8BE5\u6587\u4EF6\uFF1F</div>\n            </div>\n          ',
          closeIcon: true,
          columnClass: 'custom-window-width',
          confirmButton: '确定',
          confirmButtonClass: 'vue-confirm__btns--cancel',
          confirm: function confirm() {
            $.startLoading();
            $.ajax({
              url: '/bms-pub/report/file_delete',
              type: 'POST',
              data: {
                id: item.id
              },
              success: function success(_ref5) {
                var code = _ref5.code,
                    msg = _ref5.msg,
                    data = _ref5.data;

                if (0 == code) {
                  //刷新页面,方便组件重复利用
                  if ("[object Function]" == Object.prototype.toString.call(_this.$root.doRefresh)) {
                    _this.$root.doRefresh(true);
                  }
                  $.clearLoading();
                  $.omsAlert('删除成功');
                }
              },
              error: function error() {
                $.omsAlert('网络异常');
              }
            });
          },
          cancelButton: false
        });
      },
      reportDoenLoad: function reportDoenLoad(reportItem) {
        //下载
        var _this = this;
        if (1 != reportItem.status) {
          //如果是生成不成功的报表，下载不可点击
          return false;
        }
        window.location.href = reportItem.down_url + '?n=' + reportItem.report_name;
      },
      regenerate: function regenerate(reportItem) {
        var _this3 = this;

        if (1 == reportItem.status || 0 == reportItem.status) {
          //如果是报表生成成功的时候，重新生成不可点
          return false;
        }
        //由于各种类型的报表的参数结构不一致，与后台确认，只能根据数据的类型来得到数据
        var data = [];
        $.each(reportItem.request_url.data, function (key, val) {
          var str = '';
          if ('string' == typeof val) {
            str = key + '=' + val;
            data.push(str);
          } else if ('object' == (typeof val === 'undefined' ? 'undefined' : _typeof(val))) {
            $.each(val, function (key1, val1) {
              if ('string' == typeof val1) {
                str = key1 + '=' + val1;
                data.push(str);
              }
            });
          }
        });
        $.ajax({
          url: reportItem.request_url.url + '?' + data.join('&'),
          type: 'GET',
          data: {
            file_id: reportItem.id
          },
          success: function success(_ref6) {
            var code = _ref6.code,
                msg = _ref6.msg,
                data = _ref6.data;

            if (0 == code) {
              $.omsAlert('重新生成成功');
              //刷新页面,方便组件重复利用
              if ("[object Function]" == Object.prototype.toString.call(_this3.$root.doRefresh)) {
                _this3.$root.doRefresh(true);
              }
            } else {
              $.omsAlert(msg);
            }
          },
          error: function error() {
            $.omsAlert('网络异常，请重试');
          }
        });
      }
    }
  });

  // 页面底部
  Vue.component('client-footer', {
    props: ['security', 'total_assets', 'right_capital'],
    template: '\n      <footer class="client-footer">\n        <div class="client-footer__content">\u80A1\u7968\u5E02\u503C\uFF1A{{parseNumber(security, \'0.00\')}}</div>\n        <div class="client-footer__content client-footer__content--warn">\u98CE\u9669\u7CFB\u6570\uFF1A{{getRiskRatio()}}</div>\n      </footer>\n    ',
    data: function data() {
      return {};
    },
    methods: {
      parseNumber: function parseNumber(v, rule) {
        return numeral(v).format(rule);
      },
      getRiskRatio: function getRiskRatio() {
        if (this.right_capital == 0 || undefined == this.right_capital) {
          return 0;
          // return '- -';
        } else {
          return numeral(this.total_assets / this.right_capital).format('0.00');
        }
      }
    }
  });

  var client_body = new Vue({
    el: '#client-body',
    data: {
      product_list: [],
      productInfo: {},
      cur_product_index: 0,
      cur_nav: 'account',
      profit_of_today_v2: 0,
      profit_of_today_v2_id: '',
      position_realtime: [],
      beginDate: function () {
        return moment().format('YYYY-MM-DD');
      }(),
      endDate: function () {
        return moment().format('YYYY-MM-DD');
      }(),
      current_data: function () {
        return moment().format('YYYY-MM-DD');
      }(),
      queryStock: '',
      chgSelected: '', //选中的报表类型
      center_list: [], //文件中心所有报表
      // cur_product_info: {},
      showArr: [{
        type: 'positionGrid',
        display_nav: ['account', 'buy', 'sell'],
        getDataFn: function getDataFn(id) {
          this.getPositionRealtimeInfo(id);
        },
        tableController: [{
          tableHead: '股票代码',
          type: 'text',
          mapping: 'stock_code'
        }, {
          tableHead: '股票名称',
          type: 'text',
          mapping: 'stock_name'
        }, {
          tableHead: '当前数量',
          type: 'text',
          mapping: 'real_total_amount',
          numeralFormat: '0,0'
        }, {
          tableHead: '可卖数量',
          type: 'text',
          mapping: 'enable_sell_volume',
          numeralFormat: '0,0'
        }, {
          tableHead: '成本价',
          type: 'text',
          mapping: 'cost_price',
          numeralFormat: '0,0.000'
        }, {
          tableHead: '最新价',
          type: 'text',
          mapping: 'market_price',
          numeralFormat: '0,0.000'
        }, {
          tableHead: '当前市值',
          type: 'text',
          mapping: 'market_value',
          numeralFormat: '0,0.00'
        }, {
          tableHead: '浮动盈亏',
          type: 'text',
          mapping: 'earning',
          numeralFormat: '0,0.00',
          showPositiveSign: true,
          display: function display(value) {
            if (value > 0) {
              this.controller.customColor = 'red';
              if (this.controller.showPositiveSign) {
                return '+' + numeral(value).format(this.controller.numeralFormat);
              } else {
                return numeral(value).format(this.controller.numeralFormat);
              }
            } else if (value < 0) {
              this.controller.customColor = 'green';
              return numeral(value).format(this.controller.numeralFormat);
            } else {
              this.controller.customColor = '';
              return numeral(value).format(this.controller.numeralFormat);
            }
          }
        }, {
          tableHead: '盈亏比例',
          type: 'text',
          mapping: 'earning_ratio',
          numeralFormat: '0,0.00%',
          showPositiveSign: true,
          display: function display(value) {
            if (value > 0) {
              this.controller.customColor = 'red';
              if (this.controller.showPositiveSign) {
                return '+' + numeral(value).format(this.controller.numeralFormat);
              } else {
                return numeral(value).format(this.controller.numeralFormat);
              }
            } else if (value < 0) {
              this.controller.customColor = 'green';
              return numeral(value).format(this.controller.numeralFormat);
            } else {
              this.controller.customColor = '';
              return numeral(value).format(this.controller.numeralFormat);
            }
          }
        }, {
          tableHead: '卖出冻结',
          type: 'text',
          mapping: 'sell_frozen_volume',
          numeralFormat: '0,0'
        }, {
          tableHead: '今日买入',
          type: 'text',
          mapping: 'today_buy_volume',
          numeralFormat: '0,0'
        }, {
          tableHead: '今日卖出',
          type: 'text',
          mapping: 'today_sell_volume',
          numeralFormat: '0,0'
        }, {
          tableHead: '市场类别',
          type: 'text',
          mapping: 'stock_id',
          display: function display(value) {
            var tmp = value.match(/[^\d\.]+/)[0].toLowerCase();
            if (tmp == 'sh') {
              return '上海';
            } else if (tmp == 'sz') {
              return '深圳';
            } else {
              return '';
            }
          }
        }],
        tableData: []
      }, {
        display_nav: ['buy', 'sell'],
        type: 'entrustGrid',
        getDataFn: function getDataFn(id) {
          this.getEntrustInfo(id);
        },
        tableController: [{
          tableHead: '日期',
          type: 'text',
          mapping: 'created_at',
          display: function display(value) {
            return moment(value * 1000).format('YYYYMMDD');
          }
        }, {
          tableHead: '委托时间',
          type: 'text',
          mapping: 'created_at',
          display: function display(value) {
            return moment(value * 1000).format('HH:mm:ss');
          }
        }, {
          tableHead: '编号',
          type: 'text',
          mapping: 'id'
        }, {
          tableHead: '股票代码',
          type: 'text',
          mapping: 'stock_info.stock_code'
        }, {
          tableHead: '股票名称',
          type: 'text',
          mapping: 'stock_info.stock_name'
        }, {
          tableHead: '买卖方向',
          type: 'text',
          mapping: 'entrust.type',
          display: function display(value) {
            if (1 == value) {
              this.controller.customColor = 'red';
              return '买入';
            } else if (2 == value) {
              this.controller.customColor = 'blue';
              return '卖出';
            } else {
              return '--';
            }
          }
        }, {
          //   tableHead: '操作方式',
          //   type: 'text',
          //   mapping: '',
          //   display: function(){
          //     return '交易端';
          //   }
          // },{
          tableHead: '委托状态',
          type: 'text',
          mapping: 'status',
          display: function display(value) {
            switch (value.toString()) {
              case '1':
                return '等待执行';
              case '2':
                return '已委托';
              case '3':
                return '已退回';
              case '4':
                return '部分成交';
              case '5':
                return '全部成交';
              case '6':
                return '等待撤单';
              case '7':
                return '已撤单';
              case '8':
                return '废单';
              case '9':
                return '已删除';

              //多策略订单合并状态
              case '101':
                return '未完成';
              case '105':
                return '已完成';
              case '108':
                return '已完成（有废单）';

              //刚刚添加的订单
              case '0':
                return '提交中..';

              default:
                return '- -';
            }
          }
        }, {
          tableHead: '委托价格',
          type: 'text',
          mapping: 'entrust.price',
          numeralFormat: '0,0.000'
        }, {
          tableHead: '委托数量',
          type: 'text',
          mapping: 'entrust.amount',
          numeralFormat: '0,0'
        }, {
          tableHead: '成交数量',
          type: 'text',
          mapping: 'deal.amount'
        }, {
          tableHead: '成交价格',
          type: 'text',
          numeralFormat: '0.000',
          mapping: 'deal.price'
        }, {
          tableHead: '成交金额',
          type: 'text',
          mapping: 'deal.total',
          numeralFormat: '0,0.00'
        }, {
          tableHead: '市场类别',
          type: 'text',
          mapping: 'stock.code',
          display: function display(value) {
            var tmp = value.match(/[^\d\.]+/)[0].toLowerCase();
            if (tmp == 'sh') {
              return '上海';
            } else if (tmp == 'sz') {
              return '深圳';
            } else {
              return '';
            }
          }
        }],
        tableData: []
      }, {
        display_nav: ['revert'],
        type: 'entrustGridForRevert',
        getDataFn: function getDataFn(id) {
          this.getEntrustInfo(id);
        },
        tableController: [{
          type: 'checkbox',
          mapping: 'checked',
          disabledMapping: 'disabled'
        }, {
          tableHead: '委托时间',
          type: 'text',
          mapping: 'created_at',
          display: function display(value) {
            return moment(value * 1000).format('HH:mm:ss');
          }
        }, {
          tableHead: '编号',
          type: 'text',
          mapping: 'id'
        }, {
          tableHead: '股票代码',
          type: 'text',
          mapping: 'stock_info.stock_code'
        }, {
          tableHead: '股票名称',
          type: 'text',
          mapping: 'stock_info.stock_name'
        }, {
          tableHead: '买卖方向',
          type: 'text',
          mapping: 'entrust.type',
          display: function display(value) {
            if (1 == value) {
              this.controller.customColor = 'red';
              return '买入';
            } else if (2 == value) {
              this.controller.customColor = 'blue';
              return '卖出';
            } else {
              return '--';
            }
          }
        }, {
          //   tableHead: '操作方式',
          //   type: 'text',
          //   mapping: '',
          //   display: function(){
          //     return '交易端';
          //   }
          // },{
          tableHead: '委托状态',
          type: 'text',
          mapping: 'status',
          display: function display(value) {
            switch (value.toString()) {
              case '1':
                return '等待执行';
              case '2':
                return '已委托';
              case '3':
                return '已退回';
              case '4':
                return '部分成交';
              case '5':
                return '全部成交';
              case '6':
                return '等待撤单';
              case '7':
                return '已撤单';
              case '8':
                return '废单';
              case '9':
                return '已删除';

              //多策略订单合并状态
              case '101':
                return '未完成';
              case '105':
                return '已完成';
              case '108':
                return '已完成（有废单）';

              //刚刚添加的订单
              case '0':
                return '提交中..';

              default:
                return '- -';
            }
          }
        }, {
          tableHead: '委托价格',
          type: 'text',
          mapping: 'entrust.price',
          numeralFormat: '0,0.000'
        }, {
          tableHead: '委托数量',
          type: 'text',
          mapping: 'entrust.amount',
          numeralFormat: '0,0'
        }, {
          tableHead: '成交数量',
          type: 'text',
          mapping: 'deal.amount'
        }, {
          tableHead: '成交价格',
          type: 'text',
          numeralFormat: '0.000',
          mapping: 'deal.price'
        }, {
          tableHead: '成交金额',
          type: 'text',
          mapping: 'deal.total',
          numeralFormat: '0,0.00'
        }, {
          tableHead: '市场类别',
          type: 'text',
          mapping: 'stock.code',
          display: function display(value) {
            var tmp = value.match(/[^\d\.]+/)[0].toLowerCase();
            if (tmp == 'sh') {
              return '上海';
            } else if (tmp == 'sz') {
              return '深圳';
            } else {
              return '';
            }
          }
        }],
        tableData: []
      }, {
        // 持仓／资金股份
        display_nav: ['position'],
        type: 'reportPositionGrid',
        getDataFn: function getDataFn(id) {
          // 改为以下接口查询
          this.getPositionRealtimeInfo(id);
        },
        tableController: [{
          tableHead: '股票代码',
          type: 'text',
          mapping: 'stock_code'
        }, {
          tableHead: '股票名称',
          type: 'text',
          mapping: 'stock_name'
        }, {
          tableHead: '当前数量',
          type: 'text',
          mapping: 'real_total_amount',
          numeralFormat: '0,0'
        }, {
          tableHead: '可卖数量',
          type: 'text',
          mapping: 'enable_sell_volume',
          numeralFormat: '0,0'
        }, {
          tableHead: '成本价',
          type: 'text',
          mapping: 'cost_price',
          numeralFormat: '0,0.000'
        }, {
          tableHead: '最新价',
          type: 'text',
          mapping: 'market_price',
          numeralFormat: '0,0.000'
        }, {
          tableHead: '当前市值',
          type: 'text',
          mapping: 'market_value',
          numeralFormat: '0,0.00'
        }, {
          tableHead: '浮动盈亏',
          type: 'text',
          mapping: 'earning',
          numeralFormat: '0,0.00',
          showPositiveSign: true,
          display: function display(value) {
            if (value > 0) {
              this.controller.customColor = 'red';
              if (this.controller.showPositiveSign) {
                return '+' + numeral(value).format(this.controller.numeralFormat);
              } else {
                return numeral(value).format(this.controller.numeralFormat);
              }
            } else if (value < 0) {
              this.controller.customColor = 'green';
              return numeral(value).format(this.controller.numeralFormat);
            } else {
              this.controller.customColor = '';
              return numeral(value).format(this.controller.numeralFormat);
            }
          }
        }, {
          tableHead: '盈亏比例',
          type: 'text',
          mapping: 'earning_ratio',
          numeralFormat: '0,0.00%',
          showPositiveSign: true,
          display: function display(value) {
            if (value > 0) {
              this.controller.customColor = 'red';
              if (this.controller.showPositiveSign) {
                return '+' + numeral(value).format(this.controller.numeralFormat);
              } else {
                return numeral(value).format(this.controller.numeralFormat);
              }
            } else if (value < 0) {
              this.controller.customColor = 'green';
              return numeral(value).format(this.controller.numeralFormat);
            } else {
              this.controller.customColor = '';
              return numeral(value).format(this.controller.numeralFormat);
            }
          }
        }, {
          tableHead: '卖出冻结',
          type: 'text',
          mapping: 'sell_frozen_volume',
          numeralFormat: '0,0'
        }, {
          tableHead: '今日买入',
          type: 'text',
          mapping: 'today_buy_volume',
          numeralFormat: '0,0'
        }, {
          tableHead: '今日卖出',
          type: 'text',
          mapping: 'today_sell_volume',
          numeralFormat: '0,0'
        }, {
          tableHead: '市场类别',
          type: 'text',
          mapping: 'stock_id',
          display: function display(value) {
            var tmp = value.match(/[^\d\.]+/)[0].toLowerCase();
            if (tmp == 'sh') {
              return '上海';
            } else if (tmp == 'sz') {
              return '深圳';
            } else {
              return '';
            }
          }
        }],
        tableData: []
      }, {
        // 当日委托
        display_nav: ['entrust_today'],
        type: 'reportEntrustTodayGrid',
        getDataFn: function getDataFn(id) {
          this.getEntrustInfo(id);
        },
        tableController: [{
          tableHead: '日期',
          type: 'text',
          mapping: 'created_at',
          display: function display(value) {
            return moment(value * 1000).format('YYYYMMDD');
          }
        }, {
          tableHead: '委托时间',
          type: 'text',
          mapping: 'created_at',
          display: function display(value) {
            return moment(value * 1000).format('HH:mm:ss');
          }
        }, {
          tableHead: '编号',
          type: 'text',
          mapping: 'id'
        }, {
          tableHead: '股票代码',
          type: 'text',
          mapping: 'stock_info.stock_code'
        }, {
          tableHead: '股票名称',
          type: 'text',
          mapping: 'stock_info.stock_name'
        }, {
          tableHead: '买卖方向',
          type: 'text',
          mapping: 'entrust.type',
          display: function display(value) {
            if (1 == value) {
              this.controller.customColor = 'red';
              return '买入';
            } else if (2 == value) {
              this.controller.customColor = 'blue';
              return '卖出';
            } else {
              return '--';
            }
          }
        }, {
          //   tableHead: '操作方式',
          //   type: 'text',
          //   mapping: '',
          //   display: function(){
          //     return '交易端';
          //   }
          // },{
          tableHead: '委托状态',
          type: 'text',
          mapping: 'status',
          display: function display(value) {
            switch (value.toString()) {
              case '1':
                return '等待执行';
              case '2':
                return '已委托';
              case '3':
                return '已退回';
              case '4':
                return '部分成交';
              case '5':
                return '全部成交';
              case '6':
                return '等待撤单';
              case '7':
                return '已撤单';
              case '8':
                return '废单';
              case '9':
                return '已删除';

              //多策略订单合并状态
              case '101':
                return '未完成';
              case '105':
                return '已完成';
              case '108':
                return '已完成（有废单）';

              //刚刚添加的订单
              case '0':
                return '提交中..';

              default:
                return '- -';
            }
          }
        }, {
          tableHead: '委托价格',
          type: 'text',
          mapping: 'entrust.price',
          numeralFormat: '0,0.000'
        }, {
          tableHead: '委托数量',
          type: 'text',
          mapping: 'entrust.amount',
          numeralFormat: '0,0'
        }, {
          tableHead: '成交数量',
          type: 'text',
          mapping: 'deal.amount'
        }, {
          tableHead: '成交价格',
          type: 'text',
          numeralFormat: '0.000',
          mapping: 'deal.price'
        }, {
          tableHead: '成交金额',
          type: 'text',
          mapping: 'deal.total',
          numeralFormat: '0,0.00'
        }, {
          tableHead: '市场类别',
          type: 'text',
          mapping: 'stock.code',
          display: function display(value) {
            var tmp = value.match(/[^\d\.]+/)[0].toLowerCase();
            if (tmp == 'sh') {
              return '上海';
            } else if (tmp == 'sz') {
              return '深圳';
            } else {
              return '';
            }
          }
        }],
        tableData: []
      }, {
        // 当日成交
        display_nav: ['deal_today'],
        type: 'reportDealTodayGrid',
        getDataFn: function getDataFn(id) {
          this.getReportDealTodayInfo(id);
        },
        tableController: [{
          tableHead: '日期',
          type: 'text',
          mapping: 'created_at',
          display: function display(value) {
            return moment(value * 1000).format('YYYYMMDD');
          }
        }, {
          tableHead: '成交时间',
          type: 'text',
          mapping: 'created_at',
          display: function display(value) {
            return moment(value * 1000).format('HH:mm:ss');
          }
          // ,{
          //   tableHead: '流水号',
          //   type: 'text',
          //   mapping: 'created_at'
          // },{
          //   tableHead: '成交编号',
          //   type: 'text',
          //   mapping: 'id'
          // }
        }, {
          tableHead: '股票代码',
          type: 'text',
          mapping: 'stock_info.stock_code'
        }, {
          tableHead: '股票名称',
          type: 'text',
          mapping: 'stock_info.stock_name'
        }, {
          tableHead: '买卖方向',
          type: 'text',
          mapping: 'entrust.type',
          display: function display(value) {
            if (1 == value) {
              this.controller.customColor = 'red';
              return '买入';
            } else if (2 == value) {
              this.controller.customColor = 'blue';
              return '卖出';
            } else {
              return '--';
            }
          }
        }, {
          tableHead: '成交数量',
          type: 'text',
          mapping: 'deal.amount'
        }, {
          tableHead: '成交价格',
          type: 'text',
          numeralFormat: '0.000',
          mapping: 'deal.price'
        }, {
          tableHead: '成交金额',
          type: 'text',
          mapping: 'deal.total',
          numeralFormat: '0,0.00'
          // ,{
          //   tableHead: '委托号',
          //   type: 'text',
          //   mapping: 'id'
          // },{
          //   tableHead: '申报号',
          //   type: 'text',
          //   mapping: 'id'
          // }
        }],
        tableData: []
      }, {
        // 历史委托
        display_nav: ['entrust_history'],
        type: 'reportEntrustHistoryGrid',
        getDataFn: function getDataFn(id) {
          this.getReportEntrustHistoryInfo(id);
        },
        tableController: [{
          tableHead: '日期',
          type: 'text',
          mapping: 'entrust_date'
        }, {
          tableHead: '委托时间',
          type: 'text',
          mapping: 'entrust_time'
        }, {
          tableHead: '编号',
          type: 'text',
          mapping: 'id'
        }, {
          tableHead: '股票代码',
          type: 'text',
          mapping: 'entrust_stock_code'
        }, {
          tableHead: '股票名称',
          type: 'text',
          mapping: 'entrust_stock_name'
        }, {
          tableHead: '买卖方向',
          type: 'text',
          mapping: 'entrust_type',
          display: function display(value) {
            if (1 == value) {
              this.controller.customColor = 'red';
              return '买入';
            } else if (2 == value) {
              this.controller.customColor = 'blue';
              return '卖出';
            } else {
              return '--';
            }
          }
        }, {
          //   tableHead: '委托类别',
          //   type: 'text',
          //   mapping: 'entrust_system'
          // }, {
          tableHead: '委托状态',
          type: 'text',
          mapping: 'status_desc'
        }, {
          tableHead: '委托价格',
          type: 'text',
          mapping: 'entrust_price',
          numeralFormat: '0,0.000'
        }, {
          tableHead: '委托数量',
          type: 'text',
          mapping: 'entrust_amount',
          numeralFormat: '0,0'
        }, {
          tableHead: '成交数量',
          type: 'text',
          mapping: 'deal_volume'
        }, {
          tableHead: '成交价格',
          type: 'text',
          numeralFormat: '0.000',
          mapping: 'deal_price'
        }, {
          tableHead: '成交金额',
          type: 'text',
          mapping: 'deal_amount',
          numeralFormat: '0,0.00'
        }, {
          tableHead: '市场类别',
          type: 'text',
          mapping: 'entrust_stock_code',
          display: function display(value) {
            var tmp = value.match(/[^\d\.]+/)[0].toLowerCase();
            if (tmp == 'sh') {
              return '上海';
            } else if (tmp == 'sz') {
              return '深圳';
            } else {
              return '';
            }
          }
        }],
        tableData: []
      }, {
        // 历史成交
        display_nav: ['deal_history'],
        type: 'reportDealHistoryGrid',
        getDataFn: function getDataFn(id) {
          this.getReportDealHistoryInfo(id);
        },
        tableController: [{
          tableHead: '日期',
          type: 'text',
          mapping: 'deal_date'
        }, {
          tableHead: '成交时间',
          type: 'text',
          mapping: 'deal_time'
        }, {
          //   tableHead: '流水号',//与alen确认，流水号和成交编号都不要用
          //   type: 'text',
          //   mapping: ''
          // },{
          //   tableHead: '成交编号',
          //   type: 'text',
          //   mapping: ''
          // },{
          tableHead: '股票代码',
          type: 'text',
          mapping: 'stock_code'
        }, {
          tableHead: '股票名称',
          type: 'text',
          mapping: 'stock_name'
        }, {
          tableHead: '买卖方向',
          type: 'text',
          mapping: 'deal_type',
          display: function display(value) {
            if (1 == value) {
              this.controller.customColor = 'red';
              return '买入';
            } else if (2 == value) {
              this.controller.customColor = 'blue';
              return '卖出';
            } else {
              return '--';
            }
          }
        }, {
          //   tableHead: '委托类别',
          //   type: 'text',
          //   mapping: '',
          //   display: function(){
          //     return '交易端';
          //   }
          // },{
          //   tableHead: '委托状态',
          //   type: 'text',
          //   mapping: 'status'
          // },{
          //   tableHead: '委托价格',
          //   type: 'text',
          //   mapping: 'entrust.price',
          // numeralFormat: '0,0.000'
          // },{
          //   tableHead: '委托数量',
          //   type: 'text',
          //   mapping: 'entrust.amount',
          // numeralFormat: '0,0'
          // },{
          tableHead: '成交数量',
          type: 'text',
          mapping: 'deal_volume'
        }, {
          tableHead: '成交价格',
          type: 'text',
          numeralFormat: '0.000',
          mapping: 'deal_price'
        }, {
          tableHead: '成交金额',
          type: 'text',
          mapping: 'deal_amount',
          numeralFormat: '0,0.00'
          // },{
          //   tableHead: '委托号',
          //   type: 'text',
          //   mapping: 'entrust_id'
          // },{
          //   tableHead: '申报号',
          //   type: 'text',
          //   mapping: 'id'
        }],
        tableData: []

      }]
    },
    watch: {
      cur_nav: function cur_nav() {
        var _this = this;
        // // 只对需要显示的数据进行获取
        // _this.need_show_arr.forEach(function(e){
        //   e.tableData = [];
        //   e.getDataFn.call(_this);
        // })

        // 为了刷新product的信息
        this.getProductInfo(this.product_list[this.cur_product_index].id);
      },
      beginDate: function beginDate() {
        if (this.cur_nav == 'entrust_history') {
          this.getReportEntrustHistoryInfo();
        } else if (this.cur_nav == 'deal_history') {
          this.getReportDealHistoryInfo(this.product_list[this.cur_product_index].id);
        }
      },
      endDate: function endDate() {
        if (this.cur_nav == 'entrust_history') {
          this.getReportEntrustHistoryInfo();
        } else if (this.cur_nav == 'deal_history') {
          this.getReportDealHistoryInfo(this.product_list[this.cur_product_index].id);
        }
      },
      chgSelected: function chgSelected() {
        this.getCenterList(this.current_data, this.chgSelected);
      },
      current_data: function current_data() {
        this.getCenterList(this.current_data, this.chgSelected);
      }

    },
    computed: {
      cur_product_info: function cur_product_info() {

        var product = this.product_list[this.cur_product_index];

        // if (product) {
        //   riskCheck.getRulesData([product.id], function(){
        //     var obj = riskCheck.getPositionInfo({
        //       total_assets: Infinity,
        //       net_value: Infinity,
        //       product_id: product.id
        //     });
        //     var risk_arr = [];
        //     obj.forEach(function(e){
        //         risk_arr.push({
        //             net_value: Number(e.net_value),
        //             position: e.position / 100
        //         })
        //     });
        //     product.risk_line_data = risk_arr.sort(function(a, b){
        //         return a.net_value < b.net_value;// 排序取出净值最大的数据
        //     })[0];

        //     product.closing_line_data = risk_arr.filter(function(e){
        //         return e.position == 0; //取出清仓的数据
        //     })[0];
        //   });
        // }
        return $.extend({}, product, this.productInfo);
      },
      need_show_arr: function need_show_arr() {
        var _this = this;
        var tmpArr = [];
        this.showArr.forEach(function (e) {
          if (e.display_nav.some(function (el) {
            return el == _this.cur_nav;
          })) {
            tmpArr.push(e);
          }
        });
        return tmpArr;
      }
    },
    methods: {
      //下拉列表中产品的数据 文件中心
      getCenterList: function getCenterList(current_data, reportType) {
        var _this = this;
        var date = current_data.split('-').join('');
        $.startLoading('正在查询');
        $.ajax({
          url: '/bms-pub/report/file_list?date=' + parseFloat(date) + '&category=' + reportType,
          type: 'GET',
          success: function success(_ref7) {
            var code = _ref7.code,
                msg = _ref7.msg,
                data = _ref7.data;

            if (0 == code) {
              _this.center_list = data;
            } else {
              $.omsAlert(msg);
            }
            $.clearLoading();
          },
          error: function error() {
            $.omsAlert('网络异常');
            $.clearLoading();
          }
        });
      },
      doRefresh: function doRefresh() {
        //文件中心刷新
        this.getCenterList(this.current_data, this.chgSelected);
      },
      changeSelectProduct: function changeSelectProduct(product_id) {
        var _this = this;
        this.product_list.forEach(function (e, index) {
          if (e.id == product_id) {
            _this.cur_product_index = index;
            _this.getProductInfo(_this.product_list[_this.cur_product_index].id);
            _this.cur_nav = 'account';
          }
        });
      },
      refresh: function refresh() {
        // this.getProductInfo(this.product_list[this.cur_product_index].id);
        this.getProductList();
      },
      getProductList: function getProductList() {
        var _this = this;
        $.ajax({
          url: (window.REQUEST_PREFIX || '') + '/oms/helper/get_all_products',
          data: {},
          success: function success(_ref8) {
            var code = _ref8.code,
                data = _ref8.data,
                msg = _ref8.msg;

            if (0 == code) {
              _this.product_list = data.filter(function (e) {
                return e.is_running == true;
              });
              if (_this.product_list.length == 0) {
                return;
              }
              if (_this.product_list.length > _this.cur_product_index) {
                ;
              } else {
                _this.cur_product_index = 0;
              }
              _this.getRiskList();

              _this.getProductInfo(_this.product_list[_this.cur_product_index].id);
            }
          },
          error: function error() {
            console.log('error');
          }
        });
      },
      getRiskList: function getRiskList() {
        //获取所有产品的预警线和止损线
        var product_id_list = this.product_list.map(function (product) {
          return product.id;
        });
        var self = this;
        riskCheck.getRulesData(product_id_list, function () {
          self.product_list.forEach(function (product) {
            var obj = riskCheck.getPositionInfo({
              total_assets: Infinity,
              net_value: Infinity,
              product_id: product.id
            });
            var risk_arr = [];
            obj.forEach(function (e) {
              risk_arr.push({
                net_value: Number(e.net_value),
                position: e.position / 100
              });
            });
            //计算预警线
            var tempArr = risk_arr.sort(function (a, b) {
              //预警线
              return a.net_value > b.net_value; // 从小往大排
            });
            var obj; //保存当前的预警线对象
            tempArr.forEach(function (e) {
              if (self.productInfo.net_value > e.net_value) {
                obj = e;
              }
            });
            //判断仓位是否为0
            if (obj && obj.position != 0) {
              product.risk_line_data_net_value = obj.net_value;
            }
            //止损线
            product.closing_line_data = risk_arr.filter(function (e) {
              return e.position == 0; //取出清仓的数据
            })[0];
            if (product.closing_line_data) {
              product.closing_line_data_net_value = product.closing_line_data.net_value;
            }
          });
        });
      },

      getProductInfo: function getProductInfo(id) {
        var _this = this;
        $.startLoading('正在加载');
        $.ajax({
          url: (window.REQUEST_PREFIX || '') + '/oms/api/get_settlement_info',
          data: {
            product_id: id
          },
          success: function success(_ref9) {
            var code = _ref9.code,
                data = _ref9.data,
                msg = _ref9.msg;

            _this.productInfo = data;
            // 只对需要显示的数据进行获取
            _this.need_show_arr.forEach(function (e) {
              e.getDataFn.call(_this, id);
              $.clearLoading();
            });

            if (_this.need_show_arr.length == 0) {
              $.clearLoading();
            }
          },
          error: function error() {
            console.log('error');
          }
        });
      },
      getPositionRealtimeInfo: function getPositionRealtimeInfo(id) {
        var _this = this;
        $.ajax({
          url: (window.REQUEST_PREFIX || '') + '/oms/api/position_realtime',
          data: {
            product_id: id
          },
          success: function success(_ref10) {
            var code = _ref10.code,
                msg = _ref10.msg,
                data = _ref10.data;

            if (0 == code) {
              data.forEach(function (e) {
                e.real_total_amount = e.total_amount - e.entrust_volume;
              });

              // 额外计算today_earning汇总 － (redeem_fee － manage_fee － other_fee)汇总，得到今日收益
              var profit_of_today = 0;
              data.forEach(function (e) {
                profit_of_today += e.today_earning;
              });
              _this.profit_of_today_v2 = profit_of_today;
              _this.profit_of_today_v2_id = _this.cur_product_info.id;

              // 额外记录position_realtime
              _this.position_realtime = data;

              var newData = data.filter(function (e) {
                return e.real_total_amount != 0;
              });
              _this.showArr.forEach(function (e) {
                if (e.type == 'positionGrid') {
                  e.tableData = newData;
                }
                if (e.type == 'reportPositionGrid') {
                  e.tableData = newData;
                }
              });
            }
          },
          error: function error() {
            console.log('error');
          }
        });
      },
      getEntrustInfo: function getEntrustInfo(id) {
        var _this = this;
        $.ajax({
          url: (window.REQUEST_PREFIX || '') + '/oms/order/get_entrust_list',
          data: {
            permission_type: 'product',
            product_id: id,
            type: 'all'
          },
          success: function success(_ref11) {
            var code = _ref11.code,
                msg = _ref11.msg,
                data = _ref11.data;

            if (0 == code) {
              // 获取所有的股票id，查询股票信息，附到tableData上
              var stock_id_arr = [];
              data.list.forEach(function (e) {
                if (!stock_id_arr.some(function (el) {
                  return el == e.stock.code;
                })) {
                  stock_id_arr.push(e.stock.code);
                }
              });

              $.ajax({
                url: (window.REQUEST_PREFIX || '') + '/oms/helper/stock_brief',
                data: {
                  stock_id: stock_id_arr.join(',')
                },
                success: function success(res) {
                  if (0 == res.code) {
                    data.list.forEach(function (e) {
                      res.data.forEach(function (el) {
                        if (el.stock_id == e.stock.code) {
                          e.stock_info = el;
                        }
                      });
                      e.checked = false;
                    });

                    _this.showArr.forEach(function (e) {
                      if (e.type == 'entrustGrid') {
                        e.tableData = data.list;
                      }
                      if (e.type == 'entrustGridForRevert') {
                        var afterFilter = data.list.filter(function (el) {
                          // 等待执行 1
                          // 已委托  2
                          // 部分成交 4
                          // 等待撤单 6
                          // 另外 cancel_status不为1或者2
                          return (el.status == 1 || el.status == 2 || el.status == 4 || el.status == 6) && el.cancel_status != 2;
                        });
                        afterFilter.forEach(function (el) {
                          if (el.status == 6) {
                            el.disabled = true;
                          } else {
                            el.disabled = false;
                          }
                        });
                        e.tableData = afterFilter;
                      }
                      if (e.type == 'reportEntrustTodayGrid') {
                        e.tableData = data.list;
                      }
                    });
                  }
                },
                error: function error() {
                  console.log('error');
                }
              });
            }
          },
          error: function error() {
            console.log('error');
          }
        });
      },
      getReportDealTodayInfo: function getReportDealTodayInfo(id) {
        var _this = this;
        $.ajax({
          url: (window.REQUEST_PREFIX || '') + '/oms/order/get_deal_list',
          data: {
            permission_type: 'product',
            product_id: id
          },
          success: function success(_ref12) {
            var code = _ref12.code,
                msg = _ref12.msg,
                data = _ref12.data;

            if (0 == code || 500901 == code) {
              // _this.showArr.forEach(function(e){
              //   if (e.type == 'reportDealTodayGrid') {
              //     e.tableData = data.list;
              //   }
              // })

              // 获取所有的股票id，查询股票信息，附到tableData上
              var stock_id_arr = [];
              data.list.forEach(function (e) {
                if (!stock_id_arr.some(function (el) {
                  return el == e.stock.code;
                })) {
                  stock_id_arr.push(e.stock.code);
                }
              });

              $.ajax({
                url: (window.REQUEST_PREFIX || '') + '/oms/helper/stock_brief',
                data: {
                  stock_id: stock_id_arr.join(',')
                },
                success: function success(res) {
                  if (0 == res.code) {
                    data.list.forEach(function (e) {
                      res.data.forEach(function (el) {
                        if (el.stock_id == e.stock.code) {
                          e.stock_info = el;
                        }
                      });
                      e.checked = false;
                    });

                    _this.showArr.forEach(function (e) {
                      if (e.type == 'reportDealTodayGrid') {
                        e.tableData = data.list;
                      }
                    });
                  }
                },
                error: function error() {
                  console.log('error');
                }
              });
            } else {
              $.omsAlert(msg);
              // if (500901 == code) {
              //   _this.showArr.forEach(function(e){
              //     if (e.type == 'reportDealTodayGrid') {
              //       e.tableData = data.list;
              //     }
              //   })
              // }
            }
          },
          error: function error() {
            console.log('error');
          }
        });
      },
      getReportEntrustHistoryInfo: function getReportEntrustHistoryInfo() {
        var _this = this;
        $.ajax({
          url: (window.REQUEST_PREFIX || '') + '/oms/report/report_list/entrust',
          type: 'get',
          data: {
            page: 1,
            count: 999,
            start: this.beginDate,
            end: this.endDate,
            product_id: this.cur_product_info.id
          },
          success: function success(res) {
            if (0 == res.code) {
              _this.showArr.forEach(function (e) {
                if (e.type == 'reportEntrustHistoryGrid') {
                  e.tableData = res.data.data;
                }
              });
            } else {
              if (500901 == res.code) {
                _this.showArr.forEach(function (e) {
                  if (e.type == 'reportEntrustHistoryGrid') {
                    e.tableData = [];
                  }
                });
              } else {
                $.omsAlert(res.msg);
              }
            }
          },
          error: function error() {
            console.log('error');
          }
        });
      },
      getReportDealHistoryInfo: function getReportDealHistoryInfo(id) {
        var _this = this;
        $.ajax({
          url: (window.REQUEST_PREFIX || '') + '/oms/report/report_list/deal',
          type: 'get',
          data: {
            page: 1,
            count: 999,
            start: this.beginDate,
            end: this.endDate,
            product_id: id
          },
          success: function success(res) {
            if (0 == res.code) {
              _this.showArr.forEach(function (e) {
                if (e.type == 'reportDealHistoryGrid') {
                  e.tableData = res.data.data;
                }
              });
            } else {
              if (500901 == res.code) {
                _this.showArr.forEach(function (e) {
                  if (e.type == 'reportDealHistoryGrid') {
                    e.tableData = [];
                  }
                });
              } else {
                $.omsAlert(res.msg);
              }
            }
          },
          error: function error() {
            console.log('error');
          }
        });
      },
      tr_click: function tr_click(index, row) {
        //调用子节点的方法 修改交易模块的股票代码id和股票名称
        var stock = row.stock_id;
        var name = row.stock_name;
        if (!stock) {
          stock = row.stock_info.stock_id;
        }
        if (!name) {
          name = row.stock_info.stock_name;
        }
        this.$refs.client_trader.selectOneStock(stock, name);
      }
    }
  });

  client_body.getProductList();
});
//# sourceMappingURL=client.expert.js.map
