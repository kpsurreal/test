'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

// vue组件汇总，所有插件标签全部以“vue-”开头命名。
// 此文件包含了jQuery插件转换为vue的组件，也包含了一些通用的自定义的vue组件，特殊处理的自定义组件可以放在这里也可以放在自己的页面。

// 特别注意的是，如果页面使用了jquery插件转的vue组件，那么需要满足其插件的代码依赖。
// 比如说页面使用了通用组件“vue-selectize”，则需要依赖jqery和selectize插件。
// 不过仅在页面使用了该组件时才需要满足依赖。因为，vue的mounted方法不是立即就会执行的。

// 目前来看我们可以粗略的通过是否在mounted方法内执行插件初始化方法来判断是jquery插件还是自定义组件。
// 更多的东西，可以查看vue的生命周期

/**************************** Begin: 公共函数 ****************************/
// 其实公共函数应该另外放一个文件。但是在没有使用webpack打包之前，考虑到减少http请求，所以放在这里。
var VUECOMPONENT = {};
VUECOMPONENT.sort = function (arr, order, order_by) {
  if (order == 'asc' || order == 'desc') {
    arr.sort(function (a, b) {
      var x = a[order_by];
      var y = b[order_by];
      if (x == '--') {
        return -1;
      }
      if (y == '--') {
        return 1;
      }
      if (!isNaN(parseFloat(x)) && !isNaN(parseFloat(y))) {
        x = parseFloat(x);
        y = parseFloat(y);

        if (x > y) {
          return 1;
        }
        if (x < y) {
          return -1;
        }
        return 0;
      }

      x = x.toString();
      y = y.toString();
      return x.localeCompare(y, 'zh-CN');
      // return new Intl.Collator('gb2312').compare(x, y)
      // if (x > y) {
      //   return 1;
      // }
      // if (x < y) {
      //   return -1;
      // }
      // return 0;
    });

    if ('desc' == order) {
      arr.reverse();
    }
    return arr;
  } else {
    return arr;
  }
};
/**************************** End: 公共函数 ****************************/

// 递归将对象的每一个元素的值改为字符串
var commonRecursionToString = function commonRecursionToString(obj) {
  for (var i in obj) {
    if ('string' == typeof obj[i]) {
      ;
    } else if ('number' == typeof obj[i]) {
      obj[i] = obj[i].toString();
    } else if ('object' == _typeof(obj[i])) {
      commonRecursionToString(obj[i]);
    }
  }
};

// 公共ajax
var commonAjax = function commonAjax(url, data) {
  var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'get';

  var promise = new Promise(function (resolve, reject) {
    var client = new XMLHttpRequest();
    client.open(type, url);
    client.onreadystatechange = function () {
      if (this.readyState !== 4) {
        return;
      }
      if (this.status === 200) {
        // 额外处理，将所有的内容全部设置为字符串
        commonRecursionToString(this.response);
        resolve(this.response);
      } else {
        reject(new Error(this.statusText));
      }
    };
    client.responseType = "json";
    client.setRequestHeader("Accept", "application/json");
    // 数据暂时由使用的地方进行拼凑。这里直接使用
    client.send(data);
  });

  return promise;
};

/**************************** Begin: Vue混合 ****************************/
// 自定义数字混合
var numberMixin = {
  methods: {
    numeralNumber: function numeralNumber(arg, num) {
      if ('--' == arg || '' === arg || undefined == arg) {
        return '--';
      }
      if (!isFinite(arg)) {
        return arg;
      }
      if (undefined != num) {
        var str = '0.';
        for (var i = num - 1; i >= 0; i--) {
          str += '0';
        }
        if (0 == num) {
          str = '0';
        }
        return numeral(arg).format('0,' + str);
      }
      return numeral(arg).format('0,0.00');
    },
    numeralPercent: function numeralPercent(arg, num) {
      if ('--' == arg || '' === arg || undefined == arg) {
        return '--';
      }
      if (!isFinite(arg)) {
        return arg;
      }
      if (undefined != num) {
        var str = '0.';
        for (var i = num - 1; i >= 0; i--) {
          str += '0';
        }
        if (0 == num) {
          str = '0';
        }
        return numeral(arg).format('0,' + str + '%');
      }
      return numeral(arg).format('0.00%');
    },
    numeralPercentV2: function numeralPercentV2(arg) {
      if ('--' == arg || '- -' == arg) {
        return arg;
      }
      return numeral(arg).format('0.00%');
    },
    signNumeralNumber: function signNumeralNumber(arg, num) {
      if ('-' == arg || '--' == arg) {
        return arg;
      }

      var noSign = +(arg || 0).toString().replace(/^(\-|\+)/, '');
      return (arg < 0 ? '-' : '+') + this.numeralNumber(noSign, num);
    },
    signNumeralPercent: function signNumeralPercent(arg, num) {
      if ('-' == arg || '--' == arg) {
        return arg;
      }

      var noSign = +(arg || 0).toString().replace(/^(\-|\+)/, '');
      return (arg < 0 ? '-' : '+') + this.numeralPercent(noSign, num);
    }
  }

  // 自定义颜色混合
};var colorMixin = {
  methods: {
    rmgColor: function rmgColor(val, cursor) {
      val = Number(val);
      cursor = Number(cursor);
      if (val > cursor) {
        return 'priceRed';
      }
      if (val < cursor) {
        return 'priceGreen';
      }
      return '';
    }
  }
  /**************************** End: Vue混合 ****************************/

  /**************************** Begin: Vue包含的jq插件 ****************************/
  // 下拉框通用组件 selectize
  // 依赖：jQuery, selectize插件
};Vue.component('vue-selectize', {
  // 新增 is_readonly 属性，用来控制 input 不可手动输入
  props: ['options', 'value', 'place_holder', 'is_readonly'],
  template: '\n      <select>\n        <slot></slot>\n      </select>\n  ',
  mounted: function mounted() {
    var vm = this;
    var selectize = $(this.$el).selectize({
      delimiter: ',',
      persist: true,
      placeholder: this.place_holder,
      valueField: 'value',
      labelField: 'label',
      onChange: function onChange(v) {
        vm.$emit('input', v);
      }
    })[0].selectize;
    selectize.addOption(this.options);
    selectize.setValue(this.value);
    selectize = null;

    if (this.is_readonly) {
      $(this.$el).next().find('input').prop('readonly', true);
    }
  },
  watch: {
    value: function value(_value) {
      // update value
      $(this.$el).selectize()[0].selectize.setValue(_value);
    },
    options: function options(_options) {
      // // update options
      var value = this.value;
      var selectize = $(this.$el).selectize()[0].selectize;
      selectize.clearOptions(true);
      selectize.clearOptions(true);
      selectize.addOption(this.options);
      selectize.setValue(value);
      selectize = null;
    }
    // ,
    // destroyed: function () {
    //   $(this.$el).off().selectize()[0].selectize.destroy();
    // }
  } });

// 下拉框插件 multipleSelect
Vue.component('vue-multiple_select', {
  // isfill --- options 长度为空时，下拉框显示的文本
  props: ['options', 'init_obj', 'flag_check_all', 'chg_opt_flag_check_all', 'options_isnull_info'],
  template: '\n    <select>\n\n    </select>\n  ',
  watch: {
    options: function options(val, old) {
      if (0 === val.length && 0 === old.length) {
        return;
      }
      if ($(this.$el).html() == '') {
        var doUncheckAll = true;
      } else {
        var doUncheckAll = false;
        var checked_arr = $(this.$el).multipleSelect('getSelects');
      }

      var html = '';
      this.options.forEach(function (e) {
        html += '<option value="' + e.value + '">' + e.label + '</option>';
      });
      $(this.$el).html(html).multipleSelect();

      if (doUncheckAll) {
        // $(this.$el).multipleSelect('uncheckAll');
        if (this.flag_check_all) {
          $(this.$el).multipleSelect('checkAll');
        } else {
          $(this.$el).multipleSelect('uncheckAll');
        }
      } else {
        $(this.$el).multipleSelect('setSelects', checked_arr);
      }

      if (this.chg_opt_flag_check_all) {
        $(this.$el).multipleSelect('checkAll');
      }
    },
    init_obj: function init_obj(val, old) {
      if (val.allSelected !== old.allSelected) {
        $(this.$el).multipleSelect('setAllSelected', val.allSelected);
      }
    },
    options_isnull_info: function options_isnull_info(val, old) {
      if (val && val !== old) {
        $(this.$el).multipleSelect('setNoMatchesFound', val);
      }
    }
  },
  mounted: function mounted() {
    var _this = this;
    var html = '';
    this.options.forEach(function (e) {
      html += '<option value="' + e.value + '">' + e.label + '</option>';
    });
    var temp = void 0;
    if (window.LOGIN_INFO.org_info.theme == 3) {
      temp = "产品";
    } else {
      temp = "基金";
    }
    $(this.$el).html(html);
    $(this.$el).multipleSelect({
      filter: true,
      width: '100%',
      ellipsis: 'true',
      allSelected: this.init_obj.allSelected || '全部' + temp,
      selectAllText: '全选',
      noMatchesFound: this.init_obj.noMatchesFound || '未分配任何' + temp,
      countSelected: '已选：#，共：%',
      placeholder: this.init_obj.placeholder || '请选择' + temp,
      onCheckAll: function onCheckAll(view) {
        // onCheckAll事件和onClick事件可能同时触发，由goto方法内部保证只执行一次
        _this.chgSelect();
      },
      onUncheckAll: function onUncheckAll() {
        // onCheckAll事件和onClick事件可能同时触发，由goto方法内部保证只执行一次
        _this.chgSelect();
      },
      onClick: function onClick(view) {
        // onCheckAll事件和onClick事件可能同时触发，由goto方法内部保证只执行一次
        _this.chgSelect();
      }
    });

    if (true == this.flag_check_all) {
      $(this.$el).multipleSelect('checkAll');
    } else {
      $(this.$el).multipleSelect('uncheckAll');
    }
  },
  methods: {
    chgSelect: function chgSelect() {
      var _this = this;
      _this.$nextTick(function () {
        // 代码保证 this.$el 在 document 中
        _this.$emit('multiple_select', $(_this.$el).multipleSelect('getSelects'));
      });
    }
  }
});

// vue使用jquery的日历插件
// 依赖：jquery，zebra_date_picker插件
Vue.component('vue-zebra_date_picker', {
  props: ['value', 'min_date', 'max_date', 'start_date_time'],
  template: '\n    <div>\n      <input size="16" type="text" value="" more-param>\n    </div>\n  ',
  watch: {
    value: function value() {
      var zebra = $(this.$el).find('input').data('Zebra_DatePicker');
      zebra.set_date(this.value);
    },
    start_date_time: function start_date_time() {
      if (this.start_date_time == '') {
        var zebra = $(this.$el).find('input').data('Zebra_DatePicker');
        zebra.clear_date(); //清空所选中的日期
      }
    }
  },
  mounted: function mounted() {
    var vm = this;
    $(this.$el).find('input').val(this.value).Zebra_DatePicker({
      container: $(this.$el),
      months: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
      days: ['日', '一', '二', '三', '四', '五', '六'],
      lang_clear_date: '清空',
      show_select_today: '今天',
      onSelect: function onSelect(value) {
        vm.$emit('select', value);
      },
      onClear: function onClear(value) {
        //点击清空按钮，清空数据
        value = '';
        vm.$emit('clear', value);
      }
    });
    var zebra = $(this.$el).find('input').data('Zebra_DatePicker');
    zebra.update({
      direction: [vm.min_date, vm.max_date]
    });
  }
});

// 自定义股票过滤下拉框
//assets_class 查询的股票类型  e 股票  f 基金 repo为国债 不传为全部类型
Vue.component('vue-stock-search', {
  props: ['custom_cls', 'stock_input_id', 'placeholder', 'disabled', 'assets_class'],
  template: '\n  <div :class="custom_cls" class="client-stockInput" style="z-index: 9;line-height: 35px;">\n    <input style="height: 100%;margin:0;" :disabled="disabled" v-on:focus="focusFlag = true;" v-on:blur="focusFlag = false" class="client-stockInput__input" :placeholder="placeholder" v-model="stock_input" v-on:input="getStockList()"/>\n    <span style="height: 100%;" class="client-stockInput__unit" :class="{\'trade-loading\': true == is_loading}">{{stock_name}}</span>\n    <ul v-show="focusFlag && stockList.length > 0" class="client-suggest" style="bottom: -177px; top: auto; left: -3px;width: 103%;">\n      <li style="padding-left: 10px" class="client-suggest__list" v-for="stock in stockList" v-on:mousedown="selectOneStock(stock.stock_id, stock.stock_name)"> {{stock.stock_id + \'&nbsp\' + stock.stock_name}} </li>\n    </ul>\n  </div>\n  ',
  data: function data() {
    return {
      focusFlag: false,
      stock_id: '',
      stock_input: '',
      stock_name: '',
      stockList: [],
      is_loading: false //查询状态 转圈
    };
  },
  watch: {
    stock_input: function stock_input() {
      this.$emit('stock_input', this.stock_input);
    },
    stock_id: function stock_id() {
      this.$emit('stock_id', this.stock_id);
    },
    stock_input_id: function stock_input_id() {
      if (this.stock_input_id == '') {
        // this.focusFlag = false; //存在一种情况就是当焦点在input上，但是将里面的内容删除时focusFlag不应该改为false
        this.stock_id = '';
        this.stock_input = '';
        this.stock_name = '';
        this.stockList = [];
      }
    }
  },
  methods: {
    selectOneStock: function selectOneStock(id, name) {
      var _this = this;
      // this.inputStockCode = id;
      this.stock_name = name;
      this.stock_input = id.substring(0, 6);
      this.stock_id = id;
      // this.getStockDetail(function(){
      //   if ('buy' == _this.cur_nav) {
      //     _this.submit_price = _this.stock_info.ask1_price;
      //   }else if('sell' == _this.cur_nav){
      //     _this.submit_price = _this.stock_info.bid1_price;
      //   }
      // });
      // // 额外，每五秒刷新
      // clearInterval(this.update_timer);
      // this.update_timer = setInterval(function(){
      //   _this.getStockDetail()
      // },5000);

      this.stockList = [];
    },
    getStockList: function getStockList() {
      var _this = this;
      // 判断stock_input 和 stock_id前六位是否一致
      if (this.stock_input !== this.stock_id.substring(0, 6)) {
        this.stock_id = '';
        this.stock_name = '';
        this.stock_info = '';
      }
      var get_assets_class = '';
      if (this.assets_class) {
        get_assets_class = "&assets_class=" + this.assets_class;
      }
      this.latest_suggest_timestamp = new Date().valueOf();
      var latest_suggest_timestamp = this.latest_suggest_timestamp;
      var str = (window.REQUEST_PREFIX || '') + '/oms/helper/code_genius?stock_code=' + this.stock_input + get_assets_class;
      this.is_loading = true;
      $.ajax({
        url: str,
        success: function success(res) {
          if (latest_suggest_timestamp != _this.latest_suggest_timestamp) {
            return;
          }
          if (res.code == 0 || res.code == 1123124) {
            _this.stockList = res.data;

            if (1 == _this.stockList.length) {
              _this.selectOneStock(_this.stockList[0].stock_id, _this.stockList[0].stock_name);
            }
          } else {
            // $.omsAlert('获取建议证券列表失败！',false,300);
          }

          $('.stock-input').removeClass('loading');
          _this.is_loading = false;
        },
        error: function error() {
          $('.stock-input').removeClass('loading');
          _this.is_loading = false;
        }
      });
    }
  }
});
//自定义显示密码或隐藏密码
Vue.component('vue-input-password', {
  props: ['password_placeholder'],
  template: '\n    <div class="password-box">\n      <img class="password-box__img" v-on:click="hideShowPsw()" src="../images/welcome/hidepassword_icon.png">\n      <input class="password-box__input" type="password" :placeholder="password_placeholder"/>\n    </div>\n  ',
  data: function data() {
    return {};
  },
  methods: {
    hideShowPsw: function hideShowPsw() {
      if ('password' == $(".password-box__input").attr('type')) {
        $(".password-box__input").attr('type', 'text');
        $(".password-box__img").attr('src', '../images/welcome/showpassword_icon.png');
      } else {
        $(".password-box__input").attr('type', 'password');
        $(".password-box__img").attr('src', '../images/welcome/hidepassword_icon.png');
      }
    }
  }
});
/**************************** End: Vue包含的jq插件 ****************************/

// 表格头公共单元格
Vue.component('vue-common-grid-th', {
  mixins: [numberMixin],
  props: ['rule', 'row'],
  template: '\n    <th v-bind:class="rule.class">\n      <span v-if="\'text\' == rule.type || \'\' == rule.type || undefined == rule.type || \'percent\' == rule.type || \'percent2\' == rule.type || \'btn\' == rule.type" class="text">\n        {{rule.label}}\n      </span>\n      <input v-if="\'checkbox\' == rule.type" type="checkbox" :value="row[rule.id]" :checked="row[rule.id]" @change="change(row, rule)" />\n    </th>\n  ',
  data: function data() {
    return {};
  },
  methods: {
    change: function change(row, rule) {
      this.$emit('change', !row[rule.id]);
    }
  }
});

// 表格内容公共单元格
Vue.component('vue-common-grid-td', {
  mixins: [numberMixin],
  props: ['value', 'rule', 'row'],
  template: '\n    <td v-bind:class="rule.class">\n      <a v-if="\'btn\' == rule.type" v-bind:style="displayStyle(row, rule)" @click="doClickBtn(row, rule)">\n        {{displayBtn(row, rule)}}\n      </a>\n      <div v-if="\'text\' == rule.type || \'\' == rule.type || undefined == rule.type" style="display: flex;display:inline-flex;">\n        <a style="vertical-align: super;margin-right: 3px;margin-top: 16px;" v-if="(\'text\' == rule.type || \'\' == rule.type || undefined == rule.type) && rule.preControl && row.children && row.children.length > 0" v-bind:class="showPreControlClass(row, rule)" @click="chgControllor(row, rule)"></a>\n\n        <span v-if="(\'text\' == rule.type || \'\' == rule.type || undefined == rule.type) && rule.preShow && \'text\' == rule.preShow.type" style="line-height: 36px;">\n\n          {{displayValue(row, rule.preShow)}}\n        </span>\n        <span v-if="\'text\' == rule.type || \'\' == rule.type || undefined == rule.type" :title="displayValue(row, rule)" v-bind:class="rule.subClass" style="text-overflow: ellipsis;white-space: nowrap;overflow: hidden;max-width: 150px;line-height: 36px;display:inline-block;">\n          {{displayValue(row, rule)}}\n        </span>\n      </div>\n      <input v-if="checkDisplayCheckbox(row, rule)" type="checkbox" :disabled="checkDisabled(row, rule)" :value="value" :checked="value" @click="input" />\n      <div v-if="\'percent\' == rule.type && undefined != row[rule.id]" class="vue-percent">\n        <div v-bind:style="\'width: \' + numeralPercent(row[rule.id], 0) + \';\'" class="vue-percent__progress1"></div>\n        <span class="vue-percent__right-text">{{numeralPercent(row[rule.id], 0)}}</span>\n      </div>\n      <div v-if="\'percent2\' == rule.type && undefined != row[rule.id]" class="vue-percent">\n        <div v-bind:style="\'width: \' + numeralPercent(row[rule.id], 0) + \';\'" class="vue-percent__progress2"></div>\n        <span class="vue-percent__left-text">{{numeralPercent(row[rule.id], 0)}}</span>\n\n        <div v-bind:style="\'width: \' + numeralPercent(row[rule.sub_id], 0) + \';\'" class="vue-percent__progress1"></div>\n        <span class="vue-percent__right-text">{{numeralPercent(row[rule.sub_id], 0)}}</span>\n      </div>\n    </td>\n  ',
  data: function data() {
    return {};
  },
  methods: {
    checkDisabled: function checkDisabled(row, rule) {
      var rtn = false;
      if (rule.disabledMapping) {
        rtn = row[rule.disabledMapping];
      }
      return rtn;
    },
    doClickBtn: function doClickBtn(row, rule) {
      this[rule.btnClickFn](row, rule);
    },
    addParenthese: function addParenthese(val, func, arg) {
      return '(' + this[func].call(this, val, arg) + ')';
    },
    checkDisplayCheckbox: function checkDisplayCheckbox(row, rule) {
      if ('checkbox' == rule.type && (true != rule.hideChildren || true == rule.hideChildren && true !== row.isChild)) {
        return true;
      }
      return false;
    },
    chgControllor: function chgControllor(row, rule) {
      row[rule.preControl.id] = !row[rule.preControl.id];
    },
    showPreControlClass: function showPreControlClass(row, rule) {
      // 子行也会使用该公共单元格组件，在这里使其无法显示。
      if (undefined == row[rule.preControl.id]) {
        return '';
      }
      if (0 == row.children.length) {
        return '';
      }
      var rtn = rule.preControl.class || '';
      if (row[rule.preControl.id]) {
        rtn += ' ' + rule.preControl.trueClass;
      } else {
        rtn += ' ' + rule.preControl.falseClass;
      }
      return rtn;
    },
    input: function input() {
      this.$emit('input', !this.value);
    },
    displayValue: function displayValue(row, rule) {
      var value = row[rule.id];
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
    displayStyle: function displayStyle(row, rule) {
      var value = row[rule.id];
      if (2 == value || 3 == value) {
        return 'color:#F44336;cursor: pointer;';
      } else {
        return 'color: #ccc;cursor: not-allowed;';
      }
    },
    displayStatus: function displayStatus(val) {
      if (2 == val || 3 == val) {
        return '撤销';
      }
      if (4 == val) {
        return '完成';
      }
      if (-1 == val) {
        return '已撤销';
      }
    },
    displayStatusForExecute: function displayStatusForExecute(val) {
      if (2 == val || 3 == val) {
        return '执行';
      }
      if (4 == val) {
        return '完成';
      }
      if (-1 == val) {
        return '已撤销';
      }
    },
    doCancel: function doCancel(row, rule) {
      var _this = this;
      if ("[object Function]" == Object.prototype.toString.call(_this.$root.doCancel)) {
        _this.$root.doCancel(row, rule);
      }
    },
    doExecute: function doExecute(row, rule) {
      var _this = this;
      if ("[object Function]" == Object.prototype.toString.call(_this.$root.doExecute)) {
        _this.$root.doExecute(row, rule);
      }
    },
    displayBtn: function displayBtn(row, rule) {
      var value = row[rule.id];
      if (rule.format != '' && rule.format instanceof Array && this[rule.format[0]] instanceof Function) {
        var args = [value].concat(rule.format.slice(1));
        value = this[rule.format[0]].apply(this, args);
      }
      return value;
    }
  }
});

//hover提示语
Vue.component('prompt-language', {
  props: ['language_val'],
  template: '<span class="dot-tip exclamation">\n    <div v-on:mouseover="language_show()" v-on:mouseout="language_hide()">\n      <em>i</em>\n      <div class="str" style="display:none;top: -28px;z-index:2;">\n        <span class="msg">\n          <span>{{language_val}}</span>\n        </span>\n      </div>\n    </div>\n  </span>',
  methods: {
    language_show: function language_show() {
      $(this.$el).find('.str').show();
    },
    language_hide: function language_hide() {
      $(this.$el).find('.str').hide();
    }
  }
});

// 自定义基金行
Vue.component('vue-group-row', {
  mixins: [numberMixin],
  props: ['row', 'is_child', 'top'],
  template: '\n    <tr class="account-table-tr" :style=style>\n      <td class="account-table-tr__align-left" style="width: 20px;">\n        <input :disabled="(is_child || row.child_group.length > 0) ? true : false" class="account-table-tr__input" v-model="row.web_checked" v-on:change="chgSelect($event)" type="checkbox">\n      </td>\n      <td class="account-table-tr__align-left" :style="is_child ? \'width: 190px;\' : \'width: 220px;\'" style="padding-left: 8px;">\n        <vue-modify-top-text :row=row></vue-modify-top-text>\n      </td>\n      <td class="account-table-tr__align-right" v-on:click="userShowClick($event, row)">\n        <vue-modify-text v-if="is_child != true" :row=row></vue-modify-text>\n        <vue-custom-dl v-if="is_child == true" :name="\'\u57FA\u91D1\u7ECF\u7406\'" :value="top.operator"></vue-custom-dl>\n      </td>\n      <td class="account-table-tr__align-right" v-on:click="userShowClick($event, row)">\n        <vue-custom-dl :name="\'\u4EA4\u6613\u5355\u5143\u6570\'" :value="numeralNumber(row.child_product.length, 0)"></vue-custom-dl>\n      </td>\n      <td class="account-table-tr__align-right" v-on:click="userShowClick($event, row)">\n        <vue-custom-dl :name="\'\u5355\u4F4D\u51C0\u503C\'" :value="numeralNumber(row.net_value, 2)"></vue-custom-dl>\n      </td>\n      <td class="account-table-tr__align-right" v-on:click="userShowClick($event, row)">\n        <vue-custom-dl :name="\'\u51C0\u8D44\u4EA7\'" :value="numeralNumber(row.total_amount, 2)"></vue-custom-dl>\n      </td>\n      <td class="account-table-tr__align-right" v-on:click="userShowClick($event, row)">\n        <vue-modify-number :status=row.status :label="\'\u4EFD\u989D\'" :tip="\'\u8BF7\u8F93\u5165\u4EFD\u989D\'" :value_down="numeralNumber(row.volume,4)" :ajax_url="\'/bms-pub/product/modify_product_group\'" :ajax_data="{group_id:row.id}" :id="\'volume\'" :ajax_type="\'POST\'"></vue-modify-number>\n      </td>\n      <td class="account-table-tr__align-right" v-on:click="userShowClick($event, row)">\n        <vue-modify-number :status=row.status :label="\'\u521D\u671F\u89C4\u6A21\'" :tip="\'\u8BF7\u8F93\u5165\u521D\u671F\u89C4\u6A21\'" :value_down="numeralNumber(row.begin_capital,2)"  :ajax_url="\'/bms-pub/product/modify_product_begin_capital\'"  :ajax_data="{group_id:row.id}" :id="\'begin_capital\'" :ajax_type="\'GET\'"></vue-modify-number>\n      </td>\n      <td class="account-table-tr__align-right" v-on:click="userShowClick($event, row)">\n        <vue-custom-dl :name="\'\u6301\u4ED3\u5E02\u503C\'" :value="numeralNumber(row.market_value, 2)"></vue-custom-dl>\n      </td>\n      <td class="account-table-tr__align-right" v-on:click="userShowClick($event, row)">\n        <vue-custom-dl :name="\'\u72B6\u6001\'" :value="showStatus(row)"></vue-custom-dl>\n      </td>\n      <td class="account-table-tr__align-right" style="width: 150px;">\n        <a v-if="(row.status == 6 || row.is_stoped == true)" v-on:click="!(true == is_child && (top.status == 6 || top.status.is_stoped == true)) && doEnd(row.id, 5)" class="table__btn table__btn--red" :class="{\'disabled\': true == is_child && (top.status == 6 || top.status.is_stoped == true)}">\u8FD0\u884C</a>\n        <a v-if="is_child" v-on:click="doUnbind(row.id)" class="table__btn">\u79FB\u51FA</a>\n        <a v-if="(row.status == 5 || row.is_running == true)" v-on:click="doEnd(row.id, 6)" class="table__btn table__btn--red">\u7ED3\u675F</a>\n      </td>\n    </tr>\n  ',
  data: function data() {
    return {};
  },
  methods: {
    showStatus: function showStatus(detail) {
      if (detail.status == 5 || detail.is_running == true) {
        return '运行';
      } else if (detail.status == 6 || detail.is_stoped == true) {
        return '结束';
      } else {
        return '--';
      }
    },
    chgSelect: function chgSelect(e) {
      this.$emit('chg_select', $(e.target).prop('checked'));
    },
    chgSelectByClick: function chgSelectByClick(row) {
      var target = $(this.$el).find('.account-table-tr__input');
      if (!target.prop('disabled')) {
        var value = !target.prop('checked');
        target.prop('checked', value);
        this.$emit('chg_select', value);
        row.web_checked = value;
      }
    },
    userClick: function userClick(e, row) {
      if ($(this.$el).find('.account-table-tr__name')[0] == e.target) {
        this.chgSelectByClick(row);
      } else {
        row.web_hide_child = !row.web_hide_child;
      }
    },
    userShowClick: function userShowClick(e, row) {
      if ($(e.target).is('td')) {
        row.web_hide_child = !row.web_hide_child;
      }
    },
    doEnd: function doEnd(id, status) {
      var _this = this;
      var childName = this.row.name;
      var str = '';
      if (5 == this.row.status) {
        //5是运行，所以显示为设置为结束
        str = '结束';
      } else if (6 == this.row.status) {
        //6是结束，所以显示为设置为运行
        str = '运行';
      }

      $.confirm({
        title: str + '确认',
        content: '\n          <div class="vue-confirm">\n            <div style="font-size: 14px; text-align: center; color: #000000; padding: 60px 0;">\u786E\u5B9A\u5C06\u3010' + childName + '\u3011\u8BBE\u7F6E\u4E3A' + str + '\u72B6\u6001\uFF1F</div>\n          </div>\n        ',
        closeIcon: true,
        columnClass: 'custom-window-width',
        confirmButton: '确定',
        confirmButtonClass: 'vue-confirm__btns--cancel',
        confirm: function confirm() {
          var confirm_window = this;
          _this.submit_end(id, confirm_window, status);
          return false;
        },
        cancelButton: false
      });
    },
    submit_end: function submit_end(id, confirm_window, status) {
      var _this = this;
      $.ajax({
        url: '/bms-pub/product/set_status',
        type: 'post',
        data: {
          group_id: id,
          status: status
        },
        success: function success(_ref) {
          var code = _ref.code,
              msg = _ref.msg,
              data = _ref.data;

          if (0 == code) {
            $.omsAlert('保存成功');
            confirm_window.close();
            _this.$root.getAllData(true);
          } else {
            $.omsAlert(msg);
          }
        },
        error: function error() {
          $.failNotice();
        }
      });
    },
    doUnbind: function doUnbind(id) {
      var _this = this;
      var childName = this.row.name;
      var topName = this.top.name;

      $.confirm({
        title: '移出组',
        content: '\n          <div class="vue-confirm">\n            <div style="font-size: 14px; text-align: center; color: #000000; padding: 60px 0;">\u786E\u5B9A\u5C06\u3010' + childName + '\u3011\u79FB\u51FA\u4EA7\u54C1\u7EC4\u3010' + topName + '\u3011\uFF1F</div>\n          </div>\n        ',
        closeIcon: true,
        columnClass: 'custom-window-width',
        confirmButton: '确定',
        confirmButtonClass: 'vue-confirm__btns--cancel',
        confirm: function confirm() {
          var confirm_window = this;
          _this.submit_unbind(id, confirm_window);
          return false;
        },
        cancelButton: false
      });
    },
    submit_unbind: function submit_unbind(id, confirm_window) {
      var _this = this;
      $.ajax({
        url: '/bms-pub/product/move_product_group',
        type: 'post',
        data: {
          group_id: id
        },
        success: function success(_ref2) {
          var code = _ref2.code,
              msg = _ref2.msg,
              data = _ref2.data;

          if (0 == code) {
            $.omsAlert('移出成功');
            confirm_window.close();
            _this.$root.getAllData(true);
          } else {
            $.omsAlert(msg);
          }
        },
        error: function error() {
          $.failNotice();
        }
      });
    }
  },
  computed: {
    style: function style() {
      if (this.row.status == 6) {
        return {
          color: "hsla(0,0%,60%,.8)"
        };
      }
      if (this.row.status == 5) {
        return {
          color: "#333333"
        };
      }
    }
  }
});

Vue.component('vue-modify-top-text', {
  props: ['row'],
  data: function data() {
    // let value = this.row.name
    return {
      value: this.row.name,
      isShowChangePanel: false

    };
  },

  template: '\n        <div class="modify-text">\n          <span class="account-table-tr__bold account-table-tr__name" style="font-weight: bold;" :title="row.name">{{row.name}}</span>\n          <a  v-if="row.status !=6" class="modify-remark__content__icon" style="position: relative;top: -5px;" @click="showChangePanel"></a>\n          <a class="control-btn" :class="{\'control-btn__display\': row.web_hide_child, \'control-btn__hide\': !row.web_hide_child}" style="vertical-align: super;" @click="userClick($event,row)"></a>\n          <div class="modify-number_showbox" v-show="isShowChangePanel">\n            <input class="modify-number_input" placeholder="\u8BF7\u8F93\u5165\u4EA7\u54C1\u7EC4\u540D\u79F0" v-model=value>\n            <a class="modify-number_save" @click="save()" >\u786E\u5B9A</a>\n            <a class="modify-number_cancel" @click="cancel()" >\u53D6\u6D88</a>\n          </div>\n        </div>\n\n  ',
  watch: {
    row: function row(_row) {
      this.value = this.row.name;
    }
  },
  methods: {
    userClick: function userClick($event, row) {
      this.$parent.userClick($event, row);
    },

    showChangePanel: function showChangePanel() {
      this.isShowChangePanel = true;
      this.value = this.row.name;
      this.$root.isdrag = false; //开启拓展
    },
    cancel: function cancel() {
      this.isShowChangePanel = false;
      this.$root.isdrag = true; //开启拓展
    },

    save: function save() {
      var _this = this;
      if (this.value == '') {
        $.omsAlert('请输入产品组名称');
        return;
      }
      var ajax_data = {
        group_id: this.row.id,
        group_name: this.value
      };
      var ajax_type = 'post';
      //ajax_data[this.id] = ('' == this.value)?0:this.value;
      $.ajax({
        url: '/bms-pub/product/modify_product_name',
        data: ajax_data,
        type: ajax_type,
        success: function success(_ref3) {
          var code = _ref3.code,
              msg = _ref3.msg,
              data = _ref3.data;

          if (0 == code) {
            $.omsAlert('保存成功');
            _this.isShowChangePanel = false;
            _this.row.name = _this.value;
            _this.$emit('modify_value', _this.showstatus);
            _this.$root.getOptionList();
            _this.$root.getProductList();
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

// 点击  修改  的提示语
var vue_modify_click_data = { manager_map: {} };
Vue.component('vue-modify-click', {
  props: ['operatorVal', 'nameVal', 'operatorId', 'productId', 'is_child'],
  template: '\n    <a class="table__btn" v-on:click="doModify()">\u4FEE\u6539</a>\n  ',
  data: function data() {
    return vue_modify_click_data;
  },
  mounted: function mounted() {
    // this.getManagers();
  },
  methods: {
    getManagers: function getManagers(callBack) {
      var _this = this;
      $.ajax({
        type: 'get',
        url: '/bms-pub/user/org_info',
        success: function success(_ref4) {
          var code = _ref4.code,
              msg = _ref4.msg,
              data = _ref4.data;

          if (0 == code) {
            $.ajax({
              type: 'get',
              url: '/bms-pub/user/role_users',
              success: function success(_ref5) {
                var code = _ref5.code,
                    msg = _ref5.msg,
                    data = _ref5.data;

                if (0 == code) {
                  _this.manager_map = data;

                  if (Object.prototype.toString.call(callBack) === '[object Function]') {
                    callBack.apply(this, data);
                  }
                } else {
                  $.omsAlert(msg);
                }
              },
              error: function error() {
                $.omsAlert('网络异常，请重试');
              }
            });
          } else {
            $.omsAlert(msg);
          }
        },
        error: function error() {
          $.failNotice();
        }
      });
    },
    submit_addGroup: function submit_addGroup(confirm_window) {
      var _this = this;
      var group_id = $('[name="name"]').attr('placeholder');
      var name = $('[name="name"]').val();
      var operator_uid = $('[name="operator_uid"]').val();
      $.ajax({
        url: '/bms-pub/product/modify_product_group',
        type: 'post',
        data: {
          group_id: group_id,
          name: name,
          operator_uid: operator_uid
        },
        success: function success(_ref6) {
          var code = _ref6.code,
              msg = _ref6.msg,
              data = _ref6.data;

          if (0 == code) {
            $.omsAlert('保存成功');
            // _this.$emit('create_success')
            _this.$root.searchSelected();
            confirm_window.close();
          } else {
            $.omsAlert(msg);
          }
        },
        error: function error() {
          $.omsAlert('网络异常，请重试');
        }
      });
    },
    doModify: function doModify() {
      var _this = this;
      if (Object.keys(this.manager_map).length > 0) {
        _this.doCreate();
      } else {
        this.getManagers(function () {
          _this.doCreate();
        });
      }
    },
    doCreate: function doCreate() {
      var _this = this;
      var manager_html = '';
      Object.keys(this.manager_map).forEach(function (e) {
        if (_this.operatorId == e) {
          manager_html += '<option selected="selected" value="' + e + '">' + _this.manager_map[e] + '</option>';
        } else {
          manager_html += '<option value="' + e + '">' + _this.manager_map[e] + '</option>';
        }
      });
      var disabled = '';
      var disabledStr = '';
      if (this.is_child) {
        disabled = 'disabled="true"';
        disabledStr = 'disabled';
      }
      $.confirm({
        title: '修改产品组',
        content: '\n          <div class="vue-confirm">\n            <form class="vue-form">\n              <div class="vue-form__field" style="margin-bottom: 5px;">\n                <label class="vue-form__field--left">\u4EA7\u54C1\u7EC4\u540D</label>\n                <input class="vue-form__field--input" name="name" placeholder="' + this.productId + '" value="' + this.nameVal + '" />\n              </div>\n              <div class="vue-form__field">\n                <label class="vue-form__field--left">\u57FA\u91D1\u7ECF\u7406<b>*</b></label>\n                <select ' + disabled + ' class="vue-form__field--select select_manager ' + disabledStr + '" name="operator_uid">' + manager_html + '</select>\n              </div>\n            </form>\n          </div>\n        ',
        closeIcon: true,
        columnClass: 'custom-window-width',
        confirmButton: '确定',
        confirmButtonClass: 'vue-confirm__btns--submit',
        confirm: function confirm() {
          var confirm_window = this;
          _this.submit_addGroup(confirm_window);
          return false;
        },
        cancelButton: false
      });

      $('.vue-confirm').off().on('click', '.do-create-manager', function () {
        createManager(function (data) {
          _this.getManagers(function () {
            var user_id = data.user_id;

            var manager_html = '';
            Object.keys(_this.manager_map).forEach(function (e) {
              manager_html += '<option value="' + e + '">' + _this.manager_map[e] + '</option>';
            });

            $('.select_manager').empty().html(manager_html).val(user_id);
          });
        });
      });
    }
  }
});

// 自定义产品表格 //不论顶级与否都用这个
Vue.component('vue-product-table', {
  mixins: [numberMixin],
  props: ['product', 'is_child', 'childs_child', 'top', 'filter'],
  data: function data() {
    return {
      prefix: window.REQUEST_PREFIX,
      my_product: this.product
    };
  },
  watch: {
    product: function product() {
      this.my_product = this.product;
    }
  },
  template: '\n    <table class="vue-product-table">\n      <thead>\n        <tr class="vue-product-table__thead--tr">\n          <td class="vue-product-table__thead--td" :style="is_child ? (childs_child ? \'width: 190px;\' : \'width: 220px;\') : \'width: 250px;\'">\u4EA4\u6613\u5355\u5143</td>\n          <td class="vue-product-table__thead--td vue-product-table__align-right" style="width: 150px;">\u57FA\u91D1\u7ECF\u7406</td>\n          <td class="vue-product-table__thead--td vue-product-table__align-right">\u4EA4\u6613\u8D26\u6237</td>\n          <td class="vue-product-table__thead--td vue-product-table__align-right">\u5355\u4F4D\u51C0\u503C</td>\n          <td class="vue-product-table__thead--td vue-product-table__align-right">\u51C0\u8D44\u4EA7</td>\n          <td class="vue-product-table__thead--td vue-product-table__align-right"">\u4EFD\u989D</td>\n          <td class="vue-product-table__thead--td vue-product-table__align-right">\u521D\u671F\u89C4\u6A21</td>\n          <td v-if="false" class="vue-product-table__thead--td">\u8D44\u91D1\u4F59\u989D</td>\n          <td class="vue-product-table__thead--td vue-product-table__align-right">\u6301\u4ED3\u5E02\u503C</td>\n          <td v-if="false" class="vue-product-table__thead--td">\u51BB\u7ED3\u8D44\u91D1</td>\n          <td class="vue-product-table__thead--td vue-product-table__align-right">\u72B6\u6001</td>\n          <td class="vue-product-table__thead--td" style="width: 150px;"></td>\n        </tr>\n      </thead>\n      <draggable :element="\'tbody\'" :list="my_product"  @start="onStart" :options="dragOptions" :move="onMove" @end="onEnd" class="product_row">\n        <template v-for="(detail,index) in my_product" v-if="detail">\n          <tr v-if="checkFilter(detail)" class="vue-product-table__tbody--tr" :style=style(detail)>\n            <td class="vue-product-table__tbody--td" v-on:click="chgSelectByClick($event, detail)" :style="is_child ? (childs_child ? \'width: 190px;\' : \'width: 220px;\') : \'width: 250px;\'">\n              <input :disabled="is_child ? \'disabled\' : false" type="checkbox" v-model="detail.web_checked" name="" style="margin-right: 5px;">\n              {{detail.name}}\n            </td>\n            <td  class="vue-product-table__tbody--td vue-product-table__align-right">\n              <vue-modify-text-child v-if="!is_child" :detail=detail></vue-modify-text-child>\n              <span v-else>{{detail.operator}}</span>\n            </td>\n            <td class="vue-product-table__tbody--td vue-product-table__align-right">{{detail.account_id}}</td>\n            <td class="vue-product-table__tbody--td vue-product-table__align-right">{{numeralNumber(detail.net_value)}}</td>\n            <td class="vue-product-table__tbody--td vue-product-table__align-right">{{numeralNumber(detail.total_amount)}}</td>\n            <td class="vue-product-table__tbody--td vue-product-table__align-right"">\n              <vue-modify-product-number  :status=detail.status :label="\'\u4EFD\u989D\'" :tip="\'\u8BF7\u8F93\u5165\u4EFD\u989D\'" :value_down="numeralNumber(detail.volume,4)"  :ajax_url="\'/bms-pub/product/modify_product_volume\'"  :ajax_data="{product_id:detail.id}" :id="\'volume\'" :ajax_type="\'POST\'"></vue-modify-product-number>\n            </td>\n            <td  class="vue-product-table__tbody--td vue-product-table__align-right">\n              <vue-modify-product-number :status=detail.status :label="\'\u521D\u59CB\u8D44\u91D1\'" :tip="\'\u8BF7\u8F93\u5165\u521D\u59CB\u8D44\u91D1\'" :value_down="numeralNumber(detail.begin_capital,2)"  :ajax_url="\'/bms-pub/product/modify_product_begin_capital\'"  :ajax_data="{product_id:detail.id}" :id="\'begin_capital\'" :ajax_type="\'GET\'"></vue-modify-product-number>\n            </td>\n            <td v-if="false" class="vue-product-table__tbody--td">{{numeralNumber(detail.balance_amount)}}</td>\n            <td v-if="false" class="vue-product-table__tbody--td">{{numeralNumber(detail.frozen_amount)}}</td>\n            <td class="vue-product-table__tbody--td vue-product-table__align-right">{{numeralNumber(detail.market_value)}}</td>\n            <td class="vue-product-table__tbody--td vue-product-table__align-right">{{showStatus(detail)}}</td>\n            <td class="vue-product-table__tbody--td vue-product-table__align-right"  style="width: 150px;">\n              <a v-on:click="doConfig(detail.id)" class="table__btn" v-if="false">\u8BBE\u7F6E</a>\n              <a class="table__btn" v-if="false" :style=style(detail)>\u8BBE\u7F6E</a>\n              <a v-if="!is_child && (detail.status == 5 || detail.is_running == true)" v-on:click="doEnd(detail.id, 6, detail.name, detail)" class="table__btn table__btn--red">\u7ED3\u675F</a>\n              <a v-if="!is_child && (detail.status == 6 || detail.is_stoped == true)" v-on:click="doEnd(detail.id, 5, detail.name, detail)" class="table__btn table__btn--red">\u8FD0\u884C</a>\n              <a v-if="is_child" v-on:click="doUnbind(detail.id, detail.name)" class="table__btn table__btn--red">\u79FB\u51FA</a>\n            </td>\n          </tr>\n        </template>\n      </draggable>\n    </table>\n  ',
  methods: {
    checkFilter: function checkFilter(detail) {
      if (undefined == this.filter) {
        return true;
      }
      if ('all' == this.filter) {
        return true;
      } else if ('running' == this.filter) {
        if (detail.status == 5 || detail.is_running == true) {
          return true;
        }
        return false;
      } else if ('finished' == this.filter) {
        if (detail.status == 6 || detail.is_stoped == true) {
          return true;
        }
        return false;
      }
      return false;
    },
    showStatus: function showStatus(detail) {
      if (detail.status == 5 || detail.is_running == true) {
        return '运行';
      } else if (detail.status == 6 || detail.is_stoped == true) {
        return '结束';
      } else {
        return '--';
      }
    },
    chgSelectByClick: function chgSelectByClick(e, row) {
      if ($(e.target).is('td')) {
        var target = $(e.target).parents('tr').find('input');
        if (!target.prop('disabled')) {
          row.web_checked = !row.web_checked;
        }
      }
    },
    doEnd: function doEnd(id, status, name, detail) {
      var _this = this;
      var childName = name;
      var str = '';
      if (5 == detail.status) {
        //5是运行，所以显示为设置为结束
        str = '结束';
      } else if (6 == detail.status) {
        //6是结束，所以显示为设置为运行
        str = '运行';
      }
      $.confirm({
        title: str + '确认',
        content: '\n          <div class="vue-confirm">\n            <div style="font-size: 14px; text-align: center; color: #000000; padding: 60px 0;">\u786E\u5B9A\u5C06\u3010' + childName + '\u3011\u8BBE\u7F6E\u4E3A' + str + '\u72B6\u6001\uFF1F</div>\n          </div>\n        ',
        closeIcon: true,
        columnClass: 'custom-window-width',
        confirmButton: '确定',
        confirmButtonClass: 'vue-confirm__btns--cancel',
        confirm: function confirm() {
          var confirm_window = this;
          _this.submit_end(id, confirm_window, status);
          return false;
        },
        cancelButton: false
      });
    },
    submit_end: function submit_end(id, confirm_window, status) {
      var _this = this;
      $.ajax({
        url: '/bms-pub/product/set_status',
        type: 'post',
        data: {
          product_id: id,
          status: status
        },
        success: function success(_ref7) {
          var code = _ref7.code,
              msg = _ref7.msg,
              data = _ref7.data;

          if (0 == code) {
            $.omsAlert('保存成功');
            confirm_window.close();
            _this.$root.getAllData(true);
          } else {
            $.omsAlert(msg);
          }
        },
        error: function error() {
          $.failNotice();
        }
      });
    },
    doConfig: function doConfig(id) {
      location.href = window.REQUEST_PREFIX + '/product/setting_redirect?product_id=' + id;
    },
    doUnbind: function doUnbind(id, name) {
      var _this = this;
      var childName = name;
      var topName = this.top.name;
      $.confirm({
        title: '移出',
        content: '\n          <div class="vue-confirm">\n            <div style="font-size: 14px; text-align: center; color: #000000; padding: 60px 0;">\u786E\u5B9A\u5C06\u3010' + childName + '\u3011\u79FB\u51FA\u57FA\u91D1\u3010' + topName + '\u3011\uFF1F</div>\n          </div>\n        ',
        closeIcon: true,
        columnClass: 'custom-window-width',
        confirmButton: '确定',
        confirmButtonClass: 'vue-confirm__btns--cancel',
        confirm: function confirm() {
          var confirm_window = this;
          _this.submit_unbind(id, confirm_window);
          return false;
        },
        cancelButton: false
      });
    },
    submit_unbind: function submit_unbind(id, confirm_window) {
      var _this = this;
      $.ajax({
        url: '/bms-pub/product/move_product_group',
        type: 'post',
        data: {
          product_id: id
        },
        success: function success(_ref8) {
          var code = _ref8.code,
              msg = _ref8.msg,
              data = _ref8.data;

          if (0 == code) {
            $.omsAlert('移出成功');
            confirm_window.close();
            _this.$root.getAllData(true);
          } else {
            $.omsAlert(msg);
          }
        },
        error: function error() {
          $.failNotice();
        }
      });
    },
    style: function style(detail) {
      if (detail.status == 6) {
        return {
          color: "hsla(0,0%,60%,.8)"
        };
      }
      if (detail.status == 5) {
        return {
          color: "#333333"
        };
      }
    },
    onStart: function onStart() {},
    onMove: function onMove(_ref9) {
      var relatedContext = _ref9.relatedContext,
          draggedContext = _ref9.draggedContext;


      var relatedElement = relatedContext.element;
      var draggedElement = draggedContext.element;
      return (!relatedElement || !relatedElement.fixed) && !draggedElement.fixed;
      // return true;
    },
    onEnd: function onEnd(_ref10) {
      var oldIndex = _ref10.oldIndex,
          newIndex = _ref10.newIndex;

      this.set_group_product_index();
    },
    set_group_product_index: function set_group_product_index() {
      var self = this;
      var productid_list = [];
      this.my_product.forEach(function (e) {
        if (!e) {
          return;
        }
        productid_list.push(e.id);
      });

      var operation_id = '';
      if (self.top) {
        operation_id = self.top.id;
      }
      productid_list = productid_list.join(',');
      $.ajax({
        url: '/bms-pub/product/modify_product_orderNumber',
        type: 'GET',
        data: {
          product_id: productid_list,
          operation_id: operation_id
        }
      }).done(function (res) {}).fail(function () {}).always(function () {});
    }
  },
  computed: {
    dragOptions: function dragOptions() {
      return {
        animation: 150,
        scroll: true,
        scrollSensitivity: 100,
        // group: 'description',
        disabled: !this.$root.isdrag, //停止拖拽
        handle: '.product_row',
        ghostClass: 'ghost'
      };
    }
  }
});

// 自定义基金表格 // 顶级
Vue.component('vue-group-table', {
  mixins: [numberMixin],
  props: ['accounts_info', 'org_info', 'prefix', 'filter'],
  template: '\n    <div>\n        <draggable :element="\'table\'" :list="accounts_info.group"  @start="onStart" :options="dragOptions" :move="onMove" @end="onEnd" v-if="org_info.theme != 3 && accounts_info.group && accounts_info.group.length > 0" class="account-table bem-table">\n          <tbody v-for="(detail, index) in accounts_info.group" v-if="checkFilter(detail)" class="draggableitem">\n            <vue-group-row :is_child="false" :row="detail" v-on:chg_select="chgSelect(detail, $event)"></vue-group-row>\n            <vue-sub-group v-if="!detail.web_hide_child" :detail="detail" :filter="filter"></vue-sub-group>\n          </tbody>\n        </draggable>\n      <table v-if="org_info.theme != 3 && accounts_info.product && accounts_info.product.length > 0 && checkPassFilter(accounts_info.product)" class="account-table">\n        <tbody>\n          <tr>\n            <td colspan="999">\n              <vue-product-table :product="accounts_info.product" :is_child="false" :filter="filter"></vue-product-table>\n            </td>\n          </tr>\n        </tbody>\n      </table>\n      <div v-if="org_info.theme == 3" class="container-content-grid">\n        <table class="account-table bem-table" style="margin-top: 0;">\n          <thead>\n            <tr>\n              <th class="left10 multi"></th>\n              <th style="color: #999;" class="left10">\u8D26\u6237</th>\n              <th style="color: #999;" class="left20">\u8D26\u6237\u540D\u79F0</th>\n              <th style="color: #999;" class="left20">\u8D26\u6237\u7C7B\u578B</th>\n              <th style="color: #999;" class="left20">\u6240\u5C5E\u5238\u5546</th>\n              <th style="color: #999;width: 190px;" class="right20">\u8D44\u4EA7\u603B\u503C</th>\n              <th style="color: #999;width: 190px;" class="right20">\u8D44\u91D1\u4F59\u989D</th>\n              <th style="color: #999;width: 190px;" class="right20">\u8BC1\u5238\u5E02\u503C</th>\n              <th style="color: #999;width: 190px;" class="right20">\u53EF\u5206\u914D\u91D1\u989D</th>\n              <th class="right40"></th>\n            </tr>\n          </thead>\n          <tbody v-for="account in accounts_info.product">\n            <tr>\n              <td class="left10" v-on:click="toggleShowChildren(account)">\n                <template v-if="account.child_product.length > 0">\n                  <div v-if="account.showChildren" class="icon-hide"></div>\n                  <div v-if="!account.showChildren" class="icon-show"></div>\n                </template>\n              </td>\n              <td class="left10">{{account.account_id}}</td>\n              <td class="left20">{{account.name}}</td>\n              <td class="left20">{{getsecuritiesType(account.securities_id)}}</td>\n              <td class="left20">{{account.securities_name}}</td>\n              <td class="right20">{{numeralNumber(account.total_amount)}}</td>\n              <td class="right20">{{numeralNumber(account.balance_amount)}}</td>\n              <th class="right20">{{numeralNumber(account.market_value)}}</th>\n              <th class="right20">{{numeralNumber(account.available_amount)}}</th>\n              <td class="right40">\n                <a class="do_split" v-if="checkShowSplit() && checkSplit(account.able_split)" v-on:click="doSplit(account.id)">\u65B0\u5EFA\u7B56\u7565</a>\n                <a class="do_split disabled" v-if="checkShowSplit() && !checkSplit(account.able_split)">\u65B0\u5EFA\u7B56\u7565</a>\n                <span class="dot-tip exclamation" v-if="checkShowSplit() && !checkSplit(account.able_split)">\n                  <div>\n                    <em>i</em>\n                    <span class="str">\n                      <span class="msg">\n                        <span>\u8BE5\u8D26\u6237\u4E0D\u652F\u6301\u65B0\u5EFA\u7B56\u7565\uFF0C\u82E5\u9700\u8981\u8BF7\u8054\u7CFB\u6211\u4EEC</span>\n                      </span>\n                    </span>\n                  </div>\n                </span>\n                <a class="do_changePassword" v-if="checkShow(account.com_pw)" v-on:click="doChangePassword(account.id, account.tx_pw)" style="margin-left: 10px;display: inline-block;">\u4FEE\u6539\u5BC6\u7801</a>\n              </td>\n            </tr>\n            <tr v-if="account.showChildren && (account.child_product.length > 0)">\n              <td colspan="10" style="padding-top: 0;padding-bottom: 0;">\n                <table class="sub-table">\n                  <thead>\n                    <tr>\n                      <th style="color: #999;" class="left70">\u7B56\u7565\u540D\u79F0</th>\n                      <th style="color: #999;" class="right20">\u7528\u6237\u8D26\u53F7</th>\n                      <th style="color: #999;" class="right20">\u6760\u6746\u6BD4\u4F8B</th>\n                      <th style="color: #999;" class="right20">\u8D44\u4EA7\u603B\u503C</th>\n                      <th style="color: #999;" class="right20">\u4FDD\u8BC1\u91D1\u91D1\u989D</th>\n                      <th style="color: #999;" class="right20">\u501F\u6B3E\u91D1\u989D</th>\n                      <th style="color: #999;" class="right20">\u8D44\u91D1\u4F59\u989D</th>\n                      <th style="color: #999;width: 190px;" class="right20">\u8BC1\u5238\u5E02\u503C</th>\n                      <th style="color: #999;width: 50px;" class="right20">\u72B6\u6001</th>\n                      <th class="right40"></th>\n                    </tr>\n                  </thead>\n                  <tbody v-for="child in account.child_product">\n                      <tr :class="child.status==6?\'vue_base_list_gray\':\'\'" v-if="child.status==5">\n                        <td class="left70">{{child.name}}</td>\n                        <td class="right20">{{child.operator_uid}}</td>\n                        <td class="right20">{{child.lever_ratio}}</td>\n                        <td class="right20">{{numeralNumber(child.total_amount)}}</td>\n                        <td class="right20">{{numeralNumber(child.assure_capital)}}</td>\n                        <td class="right20">{{numeralNumber(child.loan_capital)}}</td>\n                        <td class="right20">{{numeralNumber(child.balance_amount)}}</td>\n                        <td class="right20">{{numeralNumber(child.market_value)}}</td>\n                        <td class="right20" style="width:50px;">{{getStatus(child.status)}}</td>\n                        <td class="right40" style="max-width: inherit">\n                          <template v-if="child.status==5">\n                            <a v-if="child.permission.base_setting" v-on:click="doConfig(child.product_id, \'base_setting\')">\u57FA\u7840\u4FE1\u606F</a>\n                            <a v-if="child.permission.user_setting" v-on:click="doConfig(child.product_id, \'user_setting\')">\u4EBA\u5458\u5206\u914D</a>\n                            <a v-if="child.permission.risk_setting" v-on:click="doConfig(child.product_id, \'risk_setting\')">\u98CE\u63A7\u8BBE\u7F6E</a>\n                            <a v-if="child.permission.fee_setting" v-on:click="doConfig(child.product_id, \'fee_setting\')">\u8D39\u7528\u8BBE\u7F6E</a>\n                            <a v-if="child.permission.cash_setting" v-on:click="doConfig(child.product_id, \'cash_setting\')">\u8D44\u91D1\u8C03\u6574</a>\n                            <a v-if="child.permission.position_setting" v-on:click="doConfig(child.product_id, \'position_setting\')">\u8BC1\u5238\u8C03\u6574</a>\n                            <a v-if="child.status==5" @click="end_product(child)" style="color:red">\u7ED3\u675F</a>\n                          </template>\n                          <template v-if="child.status==6">\n                            <a v-if="child.permission.base_setting" >\u57FA\u7840\u4FE1\u606F</a>\n                            <a v-if="child.permission.user_setting" >\u4EBA\u5458\u5206\u914D</a>\n                            <a v-if="child.permission.risk_setting" >\u98CE\u63A7\u8BBE\u7F6E</a>\n                            <a v-if="child.permission.fee_setting" >\u8D39\u7528\u8BBE\u7F6E</a>\n                            <a v-if="child.permission.cash_setting" >\u8D44\u91D1\u8C03\u6574</a>\n                            <a v-if="child.permission.position_setting" >\u8BC1\u5238\u8C03\u6574</a>\n                            <a v-if="child.status==6">\u7ED3\u675F</a>\n                          </template>\n\n                        </td>\n                      </tr>\n                  </tbody>\n                </table>\n              </td>\n            </tr>\n          </tbody>\n        </table>\n      </div>\n    </div>\n  ',
  data: function data() {
    return {};
  },
  methods: {
    checkPassFilter: function checkPassFilter(data) {
      var rtn = false;
      if ('all' == this.filter) {
        rtn = true;
      } else if ('running' == this.filter) {
        data.forEach(function (e) {
          if (e.status == 5 || true == e.is_running) {
            rtn = true;
          }
        });
      } else if ('finished' == this.filter) {
        data.forEach(function (e) {
          if (e.status == 6 || true == e.is_stoped) {
            rtn = true;
          }
        });
      }

      return rtn;
    },
    checkFilter: function checkFilter(detail) {
      if ('all' == this.filter) {
        return true;
      } else if ('running' == this.filter) {
        if (detail.status == 5 || detail.is_running == true) {
          return true;
        }
        return false;
      } else if ('finished' == this.filter) {
        if (detail.status == 6 || detail.is_stoped == true) {
          return true;
        }
        return false;
      }

      return false;
    },
    toggleShowChildren: function toggleShowChildren(v) {
      v.showChildren = !v.showChildren;
    },
    doConfig: function doConfig(v, type) {
      // location.href = prefix + '/product/setting_redirect?product_id=' + v;
      if (type) {
        location.href = this.prefix + '/product/' + type + '?product_id=' + v;
      } else {
        location.href = this.prefix + '/product/setting_redirect?product_id=' + v;
      }
    },
    checkSplit: function checkSplit(v) {
      return 1 == v;
    },
    checkShow: function checkShow(v) {
      return 1 == v;
    },
    checkShowSplit: function checkShowSplit() {
      return LOGIN_INFO.role_id.some(function (e) {
        return e == 1;
      });
    },
    doSplit: function doSplit(v) {
      location.href = this.prefix + '/product/add/' + v;
    },
    getsecuritiesType: function getsecuritiesType(id) {
      if (/pb/i.test(id)) {
        return 'PB账户';
      } else {
        return '账户';
      }
    },
    chgSelect: function chgSelect(data, value) {
      data.child_product && data.child_product.forEach(function (e) {
        e.web_checked = value;
        e.child_product && e.child_product.forEach(function (el) {
          el.web_checked = value;
        });
      });
      data.child_group && data.child_group.forEach(function (e) {
        e.web_checked = value;
        e.child_product && e.child_product.forEach(function (el) {
          el.web_checked = value;
        });
        e.child_group && e.child_group.forEach(function (el) {
          el.web_checked = value;
        });
      });
    },
    end_product: function end_product(product) {
      var self = this;
      var contentChild = Vue.extend({
        data: function data() {
          return {
            product: product
          };
        },

        template: '\n         <form class="vue-form">\n            <div style="width: 400px;height: 100px;line-height: 100px;text-align: center;margin-bottom: 20px;">\n              <span class="vue-form__alert"></span>\n              \u786E\u5B9A\u5C06\uFF3B{{product.name}}\uFF3D\u8BBE\u4E3A\u7ED3\u675F\u72B6\u6001\uFF1F\n            </div>\n            <div class="buttons">\n              <button type="button" class="vue-confirm__btns--cancel"  @click=btn_submit>\u786E\u8BA4</button>\n              <button type="button" class="vue-confirm__btns--submit"  @click=btn_cancel>\u53D6\u6D88</button>\n            </div>\n          </form>\n        ',
        methods: {
          btn_submit: function btn_submit() {
            var _this = this;
            $.startLoading('正在提交...');
            if (!_this.isloarding) {
              _this.isloarding = true;
              $.ajax({
                url: '/bms-pub/product/end_product',
                type: 'post',
                data: {
                  product_id: product.product_id
                },
                success: function success(_ref11) {
                  var msg = _ref11.msg,
                      code = _ref11.code,
                      data = _ref11.data;

                  if (code == 0) {
                    _this.isloarding = false;
                    $.omsAlert('保存成功');
                    product.status = 6;
                    $.clearLoading();
                    _this.$parent.close();
                  } else {
                    _this.isloarding = false;
                    $.omsAlert(msg);
                    $.clearLoading();
                    _this.$parent.close();
                  }
                },
                error: function error() {
                  _this.isloarding = false;
                  $.omsAlert('保存失败');
                  $.clearLoading();
                  _this.$parent.close();
                }
              });
            }
          },
          btn_cancel: function btn_cancel() {
            this.$parent.close();
          }
        },
        mounted: function mounted() {}
      });

      this.$confirm({
        title: '结束确认',
        content: contentChild,
        closeIcon: true
      });
    },
    getStatus: function getStatus(status) {
      if (status == 5) {
        return "运行";
      }
      if (status == 6) {
        return "结束";
      }
    },
    onStart: function onStart() {},
    onMove: function onMove(_ref12) {
      var relatedContext = _ref12.relatedContext,
          draggedContext = _ref12.draggedContext;

      var relatedElement = relatedContext.element;
      var draggedElement = draggedContext.element;
      return (!relatedElement || !relatedElement.fixed) && !draggedElement.fixed;
    },
    onEnd: function onEnd(_ref13) {
      var oldIndex = _ref13.oldIndex,
          newIndex = _ref13.newIndex;

      this.set_group_product_index();
    },
    set_group_product_index: function set_group_product_index() {
      var groupid_list = [];
      this.accounts_info.group.forEach(function (e) {
        groupid_list.push(e.id);
      });
      groupid_list = groupid_list.join(',');

      var productid_list = [];
      this.accounts_info.product.forEach(function (e) {
        productid_list.push(e.id);
      });
      productid_list = productid_list.join(',');
      $.ajax({
        url: '/bms-pub/product/modify_product_orderNumber',
        type: 'GET',
        data: {
          group_id: groupid_list,
          product_id: productid_list
        }
      }).done(function (res) {}).fail(function () {}).always(function () {});
    }
  },
  computed: {
    dragOptions: function dragOptions() {
      return {
        animation: 150,
        scroll: true,
        scrollSensitivity: 100,
        // group: 'description',
        disabled: !this.$root.isdrag,
        handle: '.draggableitem',
        ghostClass: 'ghost'
      };
    }
  }
});

// 自定义基金内容 // 子基金
Vue.component('vue-sub-group', {
  mixins: [numberMixin],
  props: ['detail', 'filter'],
  template: '\n    <tr class="vue-sub-group bem-table__no-hover-v2" style="background-color: #f4faff">\n      <td class="vue-sub-group__content" colspan="999">\n        <vue-product-table :top="detail" :product="detail.child_product" :is_child="true" v-if="detail.child_product.length > 0"></vue-product-table>\n        <draggable class="vue-sub-group__table" :element="\'table\'" :list="detail.child_group"  @start="onStart" :options="dragOptions" :move="onMove" @end="onEnd" v-if="detail.child_group && detail.child_group.length > 0">\n          <tbody v-for="child in detail.child_group">\n            <vue-group-row v-if="checkFilter(child)" :row="child" :top="detail" :is_child="true" v-on:chg_select="chgSelect(child, $event)"></vue-group-row>\n            <tr v-if="child.child_product.length > 0 && !child.web_hide_child" class="bem-table__no-hover">\n              <td class="vue-sub-group__table--content" colspan="999">\n                <vue-product-table :top="child" :product="child.child_product" :is_child="true" :childs_child="true"></vue-product-table>\n              </td>\n            </tr>\n          </tbody>\n        </draggable>\n      </td>\n    </tr>\n  ',
  data: function data() {
    return {};
  },
  methods: {
    checkFilter: function checkFilter(detail) {
      if ('all' == this.filter) {
        return true;
      } else if ('running' == this.filter) {
        if (detail.status == 5 || detail.is_running == true) {
          return true;
        }
        return false;
      } else if ('finished' == this.filter) {
        if (detail.status == 6 || detail.is_stoped == true) {
          return true;
        }
        return false;
      }

      return false;
    },
    chgSelect: function chgSelect(data, value) {
      data.child_product && data.child_product.forEach(function (e) {
        e.web_checked = value;
        e.child_product && e.child_product.forEach(function (el) {
          el.web_checked = value;
        });
      });
      data.child_group && data.child_group.forEach(function (e) {
        e.web_checked = value;
        e.child_product && e.child_product.forEach(function (el) {
          el.web_checked = value;
        });
        e.child_group && e.child_group.forEach(function (el) {
          el.web_checked = value;
        });
      });
    },
    onStart: function onStart() {},
    onMove: function onMove(_ref14) {
      var relatedContext = _ref14.relatedContext,
          draggedContext = _ref14.draggedContext;

      var relatedElement = relatedContext.element;
      var draggedElement = draggedContext.element;
      return (!relatedElement || !relatedElement.fixed) && !draggedElement.fixed;
    },
    onEnd: function onEnd(_ref15) {
      var oldIndex = _ref15.oldIndex,
          newIndex = _ref15.newIndex;

      this.set_group_product_index();
    },
    set_group_product_index: function set_group_product_index() {
      var groupid_list = [];
      var self = this;
      this.detail.child_group.forEach(function (ele) {
        groupid_list.push(ele.id);
      });
      groupid_list = groupid_list.join(',');

      $.ajax({
        url: '/bms-pub/product/modify_product_orderNumber',
        type: 'GET',
        data: {
          group_id: groupid_list,
          operation_id: self.detail.id
        }
      }).done(function (res) {}).fail(function () {}).always(function () {});
    }
  },
  computed: {
    dragOptions: function dragOptions() {
      return {
        animation: 150,
        scroll: true,
        scrollSensitivity: 100,
        // group: 'description',
        disabled: !this.$root.isdrag,
        handle: '.draggableitem',
        ghostClass: 'ghost'
      };
    }
  }
});
//账户搜索
Vue.component('vue-account-search', {
  props: ['product_list', 'selete_id'],
  template: '<div class="account_search">\n    <vue-selectize :options="options" :place_holder="\'\u8BF7\u9009\u62E9\u4EA7\u54C1\u7EC4\'" :value="selete_id" v-on:input="select_id($event)"></vue-selectize>\n    <button class="account_search_btn" v-on:click="startSearch()">\u5F00\u59CB\u641C\u7D22</button>\n  </div>',
  data: function data() {
    return {};
  },
  computed: {
    options: function options() {
      var rtn = [];
      this.product_list.forEach(function (e) {
        var obj = {
          type: e.type,
          label: e.name,
          value: e.id
        };
        rtn.push(obj);
      });
      return rtn;
    }
  },
  methods: {
    select_id: function select_id(v) {
      this.$emit('select_id', v);
    },
    startSearch: function startSearch(id) {
      this.$emit('change_selected');
    }
  }
});
// 自定义修改密码(底层账户)
// 依赖：jquery, jquery-confirm
Vue.component('vue-change-system-password', {
  props: ['selected_account_arr'],
  template: '\n    <a class="vue-btn" v-on:click="chgActive()">\u6279\u91CF\u4FEE\u6539\u8D26\u6237\u5BC6\u7801</a>\n  ',
  data: function data() {
    return {
      active: false
    };
  },
  mounted: function mounted() {},
  methods: {
    chgActive: function chgActive() {
      if (this.selected_account_arr.length > 0) {
        this.active = true;
      } else {
        $.omsAlert('请选择账户');
      }
    },
    chgPassword: function chgPassword(new_password, tx_new_passwd) {
      var _this = this;
      $.startLoading('正在提交...');
      this.selected_account_arr.forEach(function (e) {
        e.msg = e.code = e.sign_status = '';
        var type = void 0;
        if (0 == e.is_pb) {
          type = 1;
        } else {
          type = 2;
        }
        $.ajax({
          // url: window.REQUEST_PREFIX + '/product/change_base_password',
          // url: window.REQUEST_PREFIX + '/system/sec_modify_passwd',
          url: '/bms-pub/product/change_base_password',
          type: 'post',
          data: {
            base_id: e.id,
            // src_passwd: login_password,
            new_passwd: new_password,
            tx_new_passwd: tx_new_passwd,
            type: type
          },
          success: function success(_ref16) {
            var msg = _ref16.msg,
                code = _ref16.code,
                data = _ref16.data;

            e.msg = msg;
            e.code = code;
            e.sign_status = 'finished';

            if (_this.selected_account_arr.every(function (el) {
              return el.sign_status == 'finished';
            })) {
              _this.showResult();
            }
          },
          error: function error() {
            e.msg = '网络异常，请重试';
            e.code = -1;
            e.sign_status = 'finished';

            if (_this.selected_account_arr.every(function (el) {
              return el.sign_status == 'finished';
            })) {
              _this.showResult();
            }
          }
        });
      });
    },
    showResult: function showResult() {
      var _this = this;
      $.clearLoading();
      var resultHtml = '';
      var okNum = 0;
      var notOkNum = 0;
      _this.selected_account_arr.forEach(function (e) {
        if (0 == e.code) {
          okNum += 1;
        } else {
          notOkNum += 1;
          resultHtml += '\n          <tr style="color: #000000; font-size: 16px; line-height: 30px;">\n            <td>' + e.name + '</td>\n            <td class="' + (e.code == 0 ? 'statusSuccess' : 'statusFailure') + '">' + (e.code == 0 ? '成功' : '失败') + '</td>\n            <td class="' + (e.code == 0 ? 'statusSuccess' : 'statusFailure') + '">' + (0 == e.code ? '无' : e.msg) + '</td>\n          </tr>\n          ';
        }
        e.code = null;
        e.msg = null;
        e.sign_status = null;
      });
      if (notOkNum > 0) {
        $.confirm({
          title: '失败提示',
          content: '\n            <div style="font-size: 16px; color: #2A2A2A;">\u4EE5\u4E0B\u8D26\u6237\u5BC6\u7801\u4FEE\u6539\u5931\u8D25</div>\n            <table style="width: 100%;">\n              <tbody>\n                <tr style="font-size: 14px; color: #A2A2A2; border-bottom: 1px solid #C5CAD1; line-height: 30px;">\n                  <td>\u8D26\u6237</td>\n                  <td>\u767B\u5F55\u7ED3\u679C</td>\n                  <td>\u5907\u6CE8</td>\n                </tr>\n              </tbody>\n              <tbody>' + resultHtml + '</tbody>\n            </table>\n          ',
          closeIcon: true,
          confirmButton: '确定',
          confirmButtonClass: 'vue-confirm__btns--submit',
          cancelButton: false
        });
      } else {
        $.omsAlert('保存成功');
      }
    }
  },
  watch: {
    active: function active() {
      var _this = this;
      var accountName = this.selected_account_arr.map(function (e) {
        return e.name;
      }).join('、');
      if (true == this.active) {
        $.confirm({
          title: '修改密码',
          content: '\n            <div class="vue-confirm">\n              <form class="vue-form">\n                <div class="vue-form__field" style="margin-bottom: 5px;display:flex;">\n                  <label class="vue-form__field--left" style="line-height: 35px;">\u8D26\u6237</label>\n                  <span>' + accountName + '</span>\n                </div>\n                <div class="vue-form__field">\n                  <label class="vue-form__field--left">\u4EA4\u6613\u5BC6\u7801<b>*</b></label>\n                  <input class="vue-form__field--input" name="new_password" placeholder="\u8BF7\u8F93\u5165\u6B63\u786E\u5BC6\u7801" />\n                </div>\n                <div class="vue-form__field">\n                  <label class="vue-form__field--left">\u901A\u8BAF\u5BC6\u7801</label>\n                  <input class="vue-form__field--input" name="tx_new_passwd" placeholder="\u8BF7\u8F93\u5165\u901A\u8BAF\u5BC6\u7801\uFF08\u82E5\u6709\uFF0C\u5219\u5FC5\u987B\u63D0\u4F9B\uFF09" />\n                </div>\n              </form>\n            </div>\n          ',
          // <div class="vue-confirm__btns">
          //   <a class="vue-confirm__btns--submit">确定</a>
          // </div>
          closeIcon: true,
          columnClass: 'custom-window-width',
          confirmButton: '确定',
          confirmButtonClass: 'vue-confirm__btns--submit',
          confirm: function confirm() {
            var new_password = $('[name="new_password"]').val();
            var tx_new_passwd = $('[name="tx_new_passwd"]').val();
            _this.chgPassword(new_password, tx_new_passwd);
            // return false;
          },
          cancelButton: false,
          onClose: function onClose() {
            _this.active = false;
          }
        });
      }
    }
  }
});

// 自定义单个修改密码组件
Vue.component('vue-single-change-system-password', {
  props: ['selected_account_arr'],
  template: '\n    <a class="custom-table__btn" v-on:click="chgActive()">\u4FEE\u6539\u5BC6\u7801</a>\n  ',
  data: function data() {
    return {
      active: false
    };
  },
  mounted: function mounted() {},
  methods: {
    chgActive: function chgActive() {
      if (this.selected_account_arr.length > 0) {
        this.active = true;
      } else {
        $.omsAlert('请选择账户');
      }
    },
    chgPassword: function chgPassword(new_password, tx_new_passwd) {
      var _this = this;
      $.startLoading('正在提交...');
      this.selected_account_arr.forEach(function (e) {
        e.msg = e.code = e.sign_status = '';
        var type = void 0;
        if (0 == e.is_pb) {
          type = 1;
        } else {
          type = 2;
        }
        $.ajax({
          // url: window.REQUEST_PREFIX + '/product/change_base_password',
          // url: window.REQUEST_PREFIX + '/system/sec_modify_passwd',
          url: '/bms-pub/product/change_base_password',
          type: 'post',
          data: {
            base_id: e.id,
            // src_passwd: login_password,
            new_passwd: new_password,
            tx_new_passwd: tx_new_passwd,
            type: type
          },
          success: function success(_ref17) {
            var msg = _ref17.msg,
                code = _ref17.code,
                data = _ref17.data;

            e.msg = msg;
            e.code = code;
            e.sign_status = 'finished';

            if (_this.selected_account_arr.every(function (el) {
              return el.sign_status == 'finished';
            })) {
              _this.showResult();
            }
          },
          error: function error() {
            e.msg = '网络异常，请重试';
            e.code = -1;
            e.sign_status = 'finished';

            if (_this.selected_account_arr.every(function (el) {
              return el.sign_status == 'finished';
            })) {
              _this.showResult();
            }
          }
        });
      });
    },
    showResult: function showResult() {
      var _this = this;
      $.clearLoading();
      var resultHtml = '';
      var okNum = 0;
      var notOkNum = 0;
      _this.selected_account_arr.forEach(function (e) {
        if (0 == e.code) {
          okNum += 1;
        } else {
          notOkNum += 1;
          resultHtml += '\n          <tr style="color: #000000; font-size: 16px; line-height: 30px;">\n            <td>' + e.name + '</td>\n            <td class="' + (e.code == 0 ? 'statusSuccess' : 'statusFailure') + '">' + (e.code == 0 ? '成功' : '失败') + '</td>\n            <td class="' + (e.code == 0 ? 'statusSuccess' : 'statusFailure') + '">' + (0 == e.code ? '无' : e.msg) + '</td>\n          </tr>\n          ';
        }

        e.code = null;
        e.msg = null;
        e.sign_status = null;
      });
      if (notOkNum > 0) {
        $.confirm({
          title: '失败提示',
          content: '\n            <div style="font-size: 16px; color: #2A2A2A;">\u4EE5\u4E0B\u8D26\u6237\u5BC6\u7801\u4FEE\u6539\u5931\u8D25</div>\n            <table style="width: 100%;">\n              <tbody>\n                <tr style="font-size: 14px; color: #A2A2A2; border-bottom: 1px solid #C5CAD1; line-height: 30px;">\n                  <td>\u8D26\u6237</td>\n                  <td>\u767B\u5F55\u7ED3\u679C</td>\n                  <td>\u5907\u6CE8</td>\n                </tr>\n              </tbody>\n              <tbody>' + resultHtml + '</tbody>\n            </table>\n          ',
          closeIcon: true,
          confirmButton: '确定',
          confirmButtonClass: 'vue-confirm__btns--submit',
          cancelButton: false
        });
      } else {
        $.omsAlert('保存成功');
      }
    }
  },
  watch: {
    active: function active() {
      var _this = this;
      var accountName = this.selected_account_arr.map(function (e) {
        return e.name;
      }).join('、');
      if (true == this.active) {
        $.confirm({
          title: '修改密码',
          content: '\n            <div class="vue-confirm">\n              <form class="vue-form">\n                <div class="vue-form__field" style="margin-bottom: 5px;">\n                  <label class="vue-form__field--left">\u8D26\u6237</label>\n                  <span>' + accountName + '</span>\n                </div>\n                <div class="vue-form__field">\n                  <label class="vue-form__field--left">\u4EA4\u6613\u5BC6\u7801<b>*</b></label>\n                  <input class="vue-form__field--input" name="new_password" placeholder="\u8BF7\u8F93\u5165\u6B63\u786E\u5BC6\u7801" />\n                </div>\n                <div class="vue-form__field">\n                  <label class="vue-form__field--left">\u901A\u8BAF\u5BC6\u7801</label>\n                  <input class="vue-form__field--input" name="tx_new_passwd" placeholder="\u8BF7\u8BBE\u7F6E\u901A\u8BAF\u5BC6\u7801\uFF08\u82E5\u6709\uFF0C\u5219\u5FC5\u987B\u63D0\u4F9B\uFF09" />\n                </div>\n              </form>\n\n            </div>\n          ',
          // <div class="vue-confirm__btns">
          //   <a class="vue-confirm__btns--submit">确定</a>
          // </div>
          closeIcon: true,
          columnClass: 'custom-window-width',
          confirmButton: '确定',
          confirmButtonClass: 'vue-confirm__btns--submit',
          confirm: function confirm() {
            var new_password = $('[name="new_password"]').val();
            var tx_new_passwd = $('[name="tx_new_passwd"]').val();
            _this.chgPassword(new_password, tx_new_passwd);
            // return false;
          },
          cancelButton: false,
          onClose: function onClose() {
            _this.active = false;
          }
        });
      }
    }
  }
});

// 自定义登录组件（底层账户）
// 依赖：jquery, jquery-confirm
Vue.component('vue-login-account', {
  props: ['selected_account_arr'],
  template: '\n    <a class="vue-btn" v-on:click="doLogin()">\u6279\u91CF\u767B\u5F55\u8D26\u6237</a>\n  ',
  data: function data() {
    return {};
  },
  methods: {
    doLogin: function doLogin() {
      var _this = this;
      if (this.selected_account_arr.length > 0) {
        $.startLoading();
        // TODO 登录接口
        this.selected_account_arr.forEach(function (e) {
          e.msg = e.code = e.sign_status = '';
          $.ajax({
            url: '/bms-pub/system/sec_account_login',
            type: 'post',
            data: {
              base_id: e.id
            },
            success: function success(_ref18) {
              var msg = _ref18.msg,
                  code = _ref18.code,
                  data = _ref18.data;

              e.msg = msg;
              e.code = code;
              e.sign_status = 'finished';

              if (_this.selected_account_arr.every(function (el) {
                return el.sign_status == 'finished';
              })) {
                _this.showResult();
              }
            },
            error: function error() {
              e.msg = '网络异常，请重试';
              e.code = -1;
              e.sign_status = 'finished';

              if (_this.selected_account_arr.every(function (el) {
                return el.sign_status == 'finished';
              })) {
                _this.showResult();
              }
            }
          });
        });
      } else {
        $.omsAlert('请选择账户');
      }
    },
    showResult: function showResult() {
      var _this = this;
      $.clearLoading();
      var resultHtml = '';
      var okNum = 0;
      var notOkNum = 0;
      _this.selected_account_arr.forEach(function (e) {
        if (0 == e.code) {
          okNum += 1;
          e.login_status = true;
          e.login_msg = '';
        } else {
          notOkNum += 1;
          resultHtml += '\n          <tr style="color: #000000; font-size: 16px; line-height: 30px;">\n            <td>' + e.name + '</td>\n            <td class="' + (e.code == 0 ? 'statusSuccess' : 'statusFailure') + '">' + (e.code == 0 ? '成功' : '失败') + '</td>\n            <td class="' + (e.code == 0 ? 'statusSuccess' : 'statusFailure') + '">' + (0 == e.code ? '无' : e.msg) + '</td>\n          </tr>\n          ';
        }

        e.code = null;
        e.msg = null;
        e.sign_status = null;
      });
      if (notOkNum > 0) {
        $.confirm({
          title: '失败提示',
          content: '\n            <div style="font-size: 16px; color: #2A2A2A;">\u4EE5\u4E0B\u8D26\u6237\u767B\u5F55\u5931\u8D25</div>\n            <table style="width: 100%;">\n              <tbody>\n                <tr style="font-size: 14px; color: #A2A2A2; border-bottom: 1px solid #C5CAD1; line-height: 30px;">\n                  <td>\u8D26\u6237</td>\n                  <td>\u767B\u5F55\u7ED3\u679C</td>\n                  <td>\u5907\u6CE8</td>\n                </tr>\n              </tbody>\n              <tbody>' + resultHtml + '</tbody>\n            </table>\n          ',
          closeIcon: true,
          confirmButton: '确定',
          confirmButtonClass: 'vue-confirm__btns--submit',
          cancelButton: false
        });
      } else {
        $.omsAlert('账户登录成功');
      }
    }
  }
});

// 自定单个登陆组件
Vue.component('vue-single-login-account', {
  props: ['login_status', 'selected_account_arr'],
  template: '\n    <a v-on:click="doLogin()" class="custom-table__btn" v-text="getText(login_status)">\u767B\u5F55</a>\n  ',
  data: function data() {
    return {};
  },
  methods: {
    getText: function getText(status) {
      if (status == '1') {
        return '退出';
      } else {
        return '登录';
      }
    },
    doLogin: function doLogin() {
      var _this = this;
      if (1 == this.login_status) {
        $.confirm({
          title: '退出确认',
          content: '\n            <div class="vue-confirm">\n              <div style="font-size: 14px; text-align: center; color: #000000; padding: 60px 0;">\u9000\u51FA\u5C06\u65E0\u6CD5\u5BF9\u8BE5\u8D26\u6237\u4E0B\u59D4\u6258\u53CA\u8BFB\u53D6\u6570\u636E\uFF0C\u786E\u5B9A\u9000\u51FA\uFF1F</div>\n            </div>\n          ',
          closeIcon: true,
          columnClass: 'custom-window-width',
          confirmButton: '确定',
          confirmButtonClass: 'vue-confirm__btns--cancel',
          confirm: function confirm() {
            $.startLoading();
            _this.selected_account_arr.forEach(function (e) {
              $.ajax({
                url: '/bms-pub/system/sec_account_loginout',
                type: 'post',
                data: {
                  base_id: e.id
                },
                success: function success(_ref19) {
                  var msg = _ref19.msg,
                      code = _ref19.code,
                      data = _ref19.data;

                  if (0 == code) {
                    if ("[object Function]" == Object.prototype.toString.call(_this.$root.getSystemList)) {
                      _this.$root.getSystemList(true);
                    }
                    $.clearLoading();
                    $.omsAlert('登出成功');
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
            });
          },
          cancelButton: false
        });
        return;
      }
      if (this.selected_account_arr.length > 0) {
        $.startLoading();
        this.selected_account_arr.forEach(function (e) {
          e.msg = e.code = e.sign_status = ''; //点击登录的时候，sign_status改变是因为通过for循环改变sign_status从而知道是否循环结束,主要是为了批量登录
          $.ajax({
            url: '/bms-pub/system/sec_account_login',
            type: 'post',
            data: {
              base_id: e.id
            },
            success: function success(_ref20) {
              var msg = _ref20.msg,
                  code = _ref20.code,
                  data = _ref20.data;

              e.msg = msg;
              e.code = code;
              e.sign_status = 'finished';

              if (_this.selected_account_arr.every(function (el) {
                //循环判断是否sign_status的状态为‘finished’，当循环到最后一个的时候，继续执行下面的操作
                return el.sign_status == 'finished';
              })) {
                _this.showResult();
              }
            },
            error: function error() {
              e.msg = '网络异常，请重试';
              e.code = -1;
              e.sign_status = 'finished';

              if (_this.selected_account_arr.every(function (el) {
                return el.sign_status == 'finished';
              })) {
                _this.showResult();
              }
            }
          });
        });
      } else {
        $.omsAlert('请选择账户');
      }
    },
    showResult: function showResult() {
      var _this = this;
      $.clearLoading();
      var resultHtml = '';
      var okNum = 0;
      var notOkNum = 0;
      _this.selected_account_arr.forEach(function (e) {
        if (0 == e.code) {
          okNum += 1;
          e.login_status = true;
          e.login_msg = '';
        } else {
          notOkNum += 1;
          resultHtml += '\n          <tr style="color: #000000; font-size: 16px; line-height: 30px;">\n            <td>' + e.name + '</td>\n            <td class="' + (e.code == 0 ? 'statusSuccess' : 'statusFailure') + '">' + (e.code == 0 ? '成功' : '失败') + '</td>\n            <td class="' + (e.code == 0 ? 'statusSuccess' : 'statusFailure') + '">' + (0 == e.code ? '无' : e.msg) + '</td>\n          </tr>\n          ';
        }

        e.code = null;
        e.msg = null;
        e.sign_status = null;
      });
      if (notOkNum > 0) {
        $.confirm({
          title: '失败提示',
          content: '\n            <div style="font-size: 16px; color: #2A2A2A;">\u4EE5\u4E0B\u8D26\u6237\u767B\u5F55\u5931\u8D25</div>\n            <table style="width: 100%;">\n              <tbody>\n                <tr style="font-size: 14px; color: #A2A2A2; border-bottom: 1px solid #C5CAD1; line-height: 30px;">\n                  <td>\u8D26\u6237</td>\n                  <td>\u767B\u5F55\u7ED3\u679C</td>\n                  <td>\u5907\u6CE8</td>\n                </tr>\n              </tbody>\n              <tbody>' + resultHtml + '</tbody>\n            </table>\n          ',
          closeIcon: true,
          confirmButton: '确定',
          confirmButtonClass: 'vue-confirm__btns--submit',
          cancelButton: false
        });
      } else {
        $.omsAlert('账户登录成功');
      }
      if ("[object Function]" == Object.prototype.toString.call(_this.$root.getSystemList)) {
        _this.$root.getSystemList(true);
      }
    }
  }
});

//自动登录状态
Vue.component('vue-base-account-auto-sign', {
  props: ['auto_login', 'selected_account_arr'],
  template: '\n    <a style="margin-left:20px;" v-on:click="doChgAutoLogin(auto_login)" class="custom-table__btn" v-text="getText(auto_login)"></a>\n  ',
  data: function data() {
    return {};
  },
  methods: {
    getText: function getText(auto_login) {
      if (1 == auto_login) {
        return '禁用';
      } else {
        return '启用';
      }
    },
    doChgAutoLogin: function doChgAutoLogin(auto_login) {
      var _this = this;
      if (this.selected_account_arr.length > 0) {
        $.startLoading();
        this.selected_account_arr.forEach(function (e) {
          $.ajax({
            url: '/bms-pub/product/set_auto_login',
            type: 'post',
            data: {
              base_id: e.id,
              auto_login: true == auto_login ? 0 : 1 //取反
            },
            success: function success(_ref21) {
              var msg = _ref21.msg,
                  code = _ref21.code,
                  data = _ref21.data;

              $.omsAlert('保存成功');
              $.clearLoading();
              if ("[object Function]" == Object.prototype.toString.call(_this.$root.getSystemList)) {
                _this.$root.getSystemList(true);
              }
            },
            error: function error() {
              $.omsAlert('网络异常，请重试');
              $.clearLoading();
            }
          });
        });
      }
    }
  }
});

Vue.component('vue-base-account', {
  props: ['base_status', 'selected_account_arr'],
  template: '\n    <a style="margin-left:20px;" v-on:click="doChgStatus(base_status)" class="custom-table__btn" v-text="getText(base_status)"></a>\n  ',
  data: function data() {
    return {};
  },
  methods: {
    getText: function getText(status) {
      if (status == 1) {
        return '禁用';
      } else {
        return '启用';
      }
    },
    doChgStatus: function doChgStatus(status) {
      var _this = this;
      if (this.selected_account_arr.length > 0) {
        $.startLoading();
        this.selected_account_arr.forEach(function (e) {
          $.ajax({
            url: '/bms-pub/product/update_base_status',
            type: 'post',
            data: {
              base_id: e.id,
              status: status == true ? 0 : 1 //取反
            },
            success: function success(_ref22) {
              var msg = _ref22.msg,
                  code = _ref22.code,
                  data = _ref22.data;

              if ("[object Function]" == Object.prototype.toString.call(_this.$root.getSystemList)) {
                _this.$root.getSystemList(true);
              }
              $.clearLoading();
              $.omsAlert('保存成功');
            },
            error: function error() {
              $.clearLoading();
              $.omsAlert('网络异常，请重试');
            }
          });
        });
      }
    }
  }
});

// 自定义创建产品组
// 依赖：jquery, jquery-confirm bms的config.js文件内的createManager()
Vue.component('vue-add-group', {
  props: [],
  template: '\n    <a class="vue-btn" v-on:click="doCreate()">\u521B\u5EFA\u57FA\u91D1</a>\n  ',
  data: function data() {
    return {
      manager_map: {}
    };
  },
  mounted: function mounted() {
    this.getManagers();
  },
  methods: {
    getManagers: function getManagers(callBack) {
      var _this = this;
      $.ajax({
        type: 'get',
        url: '/bms-pub/user/org_info',
        success: function success(_ref23) {
          var code = _ref23.code,
              msg = _ref23.msg,
              data = _ref23.data;

          if (0 == code) {
            // max_user = data.max_user;
            // user_num = data.user_num;
            $.ajax({
              type: 'get',
              url: '/bms-pub/user/role_users',
              success: function success(_ref24) {
                var code = _ref24.code,
                    msg = _ref24.msg,
                    data = _ref24.data;

                if (0 == code) {
                  _this.manager_map = data;

                  if (Object.prototype.toString.call(callBack) === '[object Function]') {
                    callBack.apply(this, data);
                  }
                } else {
                  $.omsAlert(msg);
                }
              },
              error: function error() {
                $.omsAlert('网络异常，请重试');
              }
            });
          } else {
            $.omsAlert(msg);
          }
        },
        error: function error() {
          $.failNotice();
        }
      });
    },
    submit_addGroup: function submit_addGroup(confirm_window) {
      var _this = this;
      var name = $('[name="name"]').val();
      var operator_uid = $('[name="operator_uid"]').val();
      $.ajax({
        url: '/bms-pub/product/create_product_group',
        type: 'post',
        data: {
          name: name,
          operator_uid: operator_uid
        },
        success: function success(_ref25) {
          var code = _ref25.code,
              msg = _ref25.msg,
              data = _ref25.data;

          if (0 == code) {
            $.omsAlert('保存成功');
            // _this.$emit('create_success')
            _this.$root.getAllData(true);

            confirm_window.close();
          } else {
            $.omsAlert(msg);
          }
        },
        error: function error() {
          $.omsAlert('网络异常，请重试');
        }
      });
    },
    doCreate: function doCreate() {
      var _this = this;
      var manager_html = '';
      Object.keys(this.manager_map).forEach(function (e) {
        manager_html += '<option value="' + e + '">' + _this.manager_map[e] + '</option>';
      });
      $.confirm({
        title: '新建基金',
        content: '\n          <div class="vue-confirm">\n            <form class="vue-form">\n              <div class="vue-form__field" style="margin-bottom: 5px;">\n                <label class="vue-form__field--left">\u57FA\u91D1</label>\n                <input class="vue-form__field--input" name="name" placeholder="\u8BF7\u8F93\u5165\u540D\u79F0" />\n              </div>\n              <div class="vue-form__field">\n                <label class="vue-form__field--left">\u57FA\u91D1\u7ECF\u7406<b>*</b></label>\n                <select class="vue-form__field--select select_manager" name="operator_uid" placeholder="\u8BF7\u8F93\u5165\u5238\u5546\u540D\u79F0">' + manager_html + '</select>\n              </div>\n\n              <div class="vue-form__field">\n                <div class="vue-form__field--tip">\n                  <label>\u6CA1\u6709\u627E\u5230\u9700\u8981\u7684\u57FA\u91D1\u7ECF\u7406\uFF0C<a class="vue-form__field--tip-btn do-create-manager">\u70B9\u8FD9\u91CC\u521B\u5EFA</a></label>\n                </div>\n              </div>\n            </form>\n          </div>\n        ',
        closeIcon: true,
        columnClass: 'custom-window-width',
        confirmButton: '确定',
        confirmButtonClass: 'vue-confirm__btns--submit',
        confirm: function confirm() {
          var confirm_window = this;
          _this.submit_addGroup(confirm_window);
          return false;
        },
        cancelButton: false
      });

      $('.vue-confirm').off().on('click', '.do-create-manager', function () {
        createManager(function (data) {
          _this.getManagers(function () {
            var user_id = data.user_id;

            var manager_html = '';
            Object.keys(_this.manager_map).forEach(function (e) {
              manager_html += '<option value="' + e + '">' + _this.manager_map[e] + '</option>';
            });

            $('.select_manager').empty().html(manager_html).val(user_id);
          });
        });
      });
    }
  }
});

// 自定义关联产品组
// 依赖：jquery, jquery-confirm
Vue.component('vue-bind-group', {
  props: ['selected_top_group_arr', 'selected_top_base_arr', 'group_list', 'option_list'],
  template: '\n    <a class="vue-btn" v-on:click="doBind()">\u5173\u8054\u57FA\u91D1</a>\n  ',
  data: function data() {
    return {};
  },
  methods: {
    doBind: function doBind() {
      var _this = this;
      if (this.selected_top_group_arr.length + this.selected_top_base_arr.length > 0) {
        var group_html = '';
        if (this.selected_top_group_arr.length == 0) {
          //group_list包含的是顶层的，而option_list则包含的是所有
          _this.option_list.forEach(function (e) {
            if ('group' == e.type) {
              group_html += '<option value="' + e.id + '">' + e.name + '</option>';
            }
          });
        } else {
          _this.group_list.forEach(function (e) {
            // 额外对option_list过滤，去除已选中的产品组
            if ('group' == e.type && !_this.selected_top_group_arr.some(function (el) {
              return el == e.id;
            })) {
              group_html += '<option value="' + e.id + '">' + e.name + '</option>';
            }
          });
        }

        $.confirm({
          title: '关联基金',
          content: '\n            <div class="vue-confirm">\n              <form class="vue-form">\n                <div class="vue-form__field">\n                  <label class="vue-form__field--left">\u5173\u8054\u5230<b>*</b></label>\n                  <select class="vue-form__field--select select_group" name="group_id" placeholder="\u8BF7\u9009\u62E9\u5173\u8054\u5230\u4EA7\u54C1\u7EC4">' + group_html + '</select>\n                </div>\n              </form>\n            </div>\n          ',
          closeIcon: true,
          columnClass: 'custom-window-width',
          confirmButton: '确定',
          confirmButtonClass: 'vue-confirm__btns--submit',
          confirm: function confirm() {
            var confirm_window = this;
            _this.submit_bind(confirm_window);
            return false;
          },
          cancelButton: false
        });
      } else {
        $.omsAlert('请选择交易单元或基金');
      }
    },
    submit_bind: function submit_bind(confirm_window) {
      var _this = this;
      var group_id = this.selected_top_group_arr.sort(function (e) {
        return e.id;
      }).join(',');
      var product_id = this.selected_top_base_arr.sort(function (e) {
        return e.id;
      }).join(',');
      var target_group_id = $('.select_group').val();
      $.ajax({
        url: '/bms-pub/product/move_product_group',
        type: 'post',
        data: {
          group_id: group_id,
          product_id: product_id,
          target_group_id: target_group_id
        },
        success: function success(_ref26) {
          var code = _ref26.code,
              msg = _ref26.msg,
              data = _ref26.data;

          if (0 == code) {
            $.omsAlert('关联成功');
            _this.$emit('do_refresh');
            confirm_window.close();
          } else {
            $.omsAlert(msg);
          }
        },
        error: function error() {
          $.failNotice();
        }
      });
    }
  }
});

// 自定义添加账户组件（底层账户）
// 依赖：jquery, jquery-confirm
Vue.component('vue-add-account', {
  props: [],
  template: '\n    <a class="vue-btn" v-on:click="doConfirm()">\u6DFB\u52A0\u8D26\u6237</a>\n  ',
  data: function data() {
    return {
      securities_map_tdx: {},
      securities_map_pb: {}
    };
  },
  mounted: function mounted() {
    var _this = this;
    $.ajax({
      url: '/bms-pub/product/securities_map',
      data: {
        type: 'tdx'
      },
      success: function success(_ref27) {
        var code = _ref27.code,
            msg = _ref27.msg,
            data = _ref27.data;

        if (0 == code) {
          _this.securities_map_tdx = data;
        }
      },
      error: function error() {
        $.omsAlert('网络异常，请重试');
      }
    });
    $.ajax({
      url: '/bms-pub/product/securities_map',
      data: {
        type: 'pb'
      },
      success: function success(_ref28) {
        var code = _ref28.code,
            msg = _ref28.msg,
            data = _ref28.data;

        if (0 == code) {
          _this.securities_map_pb = data;
        }
      },
      error: function error() {
        $.omsAlert('网络异常，请重试');
      }
    });
  },
  methods: {
    submit_add: function submit_add(confirm_window) {
      var _this = this;
      var type = $('input[name="type"]:checked').val();
      var account = $('input[name="account"]').val();
      var security_id = $('.select_securities').val();
      var com_password = $('[name="com_password"]').val();
      var fund_id = $('[name="fund_id"]').val();
      var tx_password = $('[name="tx_password"]').val();
      var unit_id = $('[name="unit_id"]').val();
      var sh_a_code = $('[name="sh_a_code"]').val();
      var sz_a_code = $('[name="sz_a_code"]').val();
      var seat_id_sh = $('[name="seat_id_sh"]').val();
      var seat_id_sz = $('[name="seat_id_sz"]').val();

      var data = {
        type: type,
        account: account,
        security_id: security_id,
        com_password: com_password
      };
      if ('pb' == type) {
        // data.fund_password = fund_password;
        data.fund_id = fund_id;
        data.unit_id = unit_id;
        data.sh_a_code = sh_a_code;
        data.sz_a_code = sz_a_code;
        data.seat_id_sh = seat_id_sh;
        data.seat_id_sz = seat_id_sz;
      } else {
        data.tx_password = tx_password;
        data.sh_a_code = sh_a_code;
        data.sz_a_code = sz_a_code;
      }

      $.ajax({
        url: '/bms-pub/product/add_base',
        type: 'post',
        data: data,
        success: function success(_ref29) {
          var code = _ref29.code,
              msg = _ref29.msg,
              data = _ref29.data;

          if (0 == code) {
            $.omsAlert('账户添加申请已提交，我们会尽快为您处理');
            if ("[object Function]" == Object.prototype.toString.call(_this.$root.getSystemList)) {
              _this.$root.getSystemList(true);
            }
            confirm_window.close();
          } else {
            $.omsAlert(msg);
            // $.omsAlert('提交失败，请重试')
          }
        },
        error: function error() {
          $.omsAlert('网络异常，请重试');
        }
      });
    },
    validateForm: function validateForm(confirm_window, passwordObj) {
      var _this = this;
      var rules_obj = {};
      var messages_obj = {};
      var value = $('[name="type"]:checked').val();

      if ('tdx' == value) {
        if (passwordObj.needpasswdForTdx) {
          //资金账号判断
          rules_obj = {
            'security_id': {
              required: true
            },
            'account': {
              required: true
            },
            'com_password': {
              required: true
            },
            'tx_password': {
              // required: true
            }
          };
          messages_obj = {
            'security_id': {
              required: '请输入券商名称'
            },
            'account': {
              required: '请输入帐号'
            },
            'com_password': {
              required: '请输入密码'
            },
            'tx_password': {
              // required: ''
            }
          };
        } else {
          rules_obj = {
            'security_id': {
              required: true
            },
            'account': {
              required: true
            },
            'com_password': {
              // required: true
            },
            'tx_password': {
              // required: true
            },
            'sh_a_code': {
              required: true
            },
            'sz_a_code': {
              required: true
            }
          };
          messages_obj = {
            'security_id': {
              required: '请输入券商名称'
            },
            'account': {
              required: '请输入帐号'
            },
            'com_password': {
              // required: '请输入密码'
            },
            'tx_password': {
              // required: ''
            },
            'sh_a_code': {
              required: '请输入股东代码沪A'
            },
            'sz_a_code': {
              required: '请输入股东代码深A'
            }
          };
        }
      } else {
        if (passwordObj.needpasswdForPb) {
          //pb帐号判断
          rules_obj = {
            'security_id': {
              required: true
            },
            'account': {
              required: true
            },
            'com_password': {
              required: true
            },
            'fund_id': {
              required: true
            }
          };
          messages_obj = {
            'security_id': {
              required: '请输入券商名称'
            },
            'account': {
              required: '请输入帐号'
            },
            'com_password': {
              required: '请输入密码'
            },
            'fund_id': {
              required: '请输入产品编号'
            }
          };
        } else {
          rules_obj = {
            'security_id': {
              required: true
            },
            'account': {
              required: true
            },
            'com_password': {
              // required: true
            },
            'fund_id': {
              required: true
            },
            'unit_id': {
              required: true
            },
            'sh_a_code': {
              required: true
            },
            'sz_a_code': {
              required: true
            },
            'seat_id_sh': {
              required: true
            },
            'seat_id_sz': {
              required: true
            }
          };
          messages_obj = {
            'security_id': {
              required: '请输入券商名称'
            },
            'account': {
              required: '请输入帐号'
            },
            'com_password': {
              required: '请输入密码'
            },
            'fund_id': {
              required: '请输入产品编号'
            },
            'unit_id': {
              required: '请输入单元编号'
            },
            'sh_a_code': {
              required: '请输入股东代码沪A'
            },
            'sz_a_code': {
              required: '请输入股东代码深A'
            },
            'seat_id_sh': {
              required: '请输入交易席位沪A'
            },
            'seat_id_sz': {
              required: '请输入交易席位深A'
            }
          };
        }
      }

      $("#add-account").validate().resetForm();
      $("#add-account").validate().destroy();
      $('#add-account').validate({
        'errorClass': 'confirm-tips',
        'rules': rules_obj,
        'messages': messages_obj,
        errorPlacement: function errorPlacement(error, element) {
          error.appendTo(element.parents(".vue-form__field"));
        },
        submitHandler: function submitHandler() {
          _this.submit_add(confirm_window);
        }
      });
    },
    doConfirm: function doConfirm() {
      var _this = this;
      var pb_options = [];
      var tdx_options = [];
      var pb_html = '';
      var tdx_html = '';

      // 初始化的时候，在样式中隐藏资金账号下的选项。等到用户切换的时候再显示。
      var needpasswdForPb = true;
      var needpasswdForTdx = true;

      Object.keys(this.securities_map_pb).forEach(function (e) {
        pb_options.push({
          label: _this.securities_map_pb[e],
          value: e
        });

        pb_html += '<option value="' + e + '">' + _this.securities_map_pb[e] + '</option>';
      });
      Object.keys(this.securities_map_tdx).forEach(function (e) {
        tdx_options.push({
          label: _this.securities_map_tdx[e],
          value: e
        });

        tdx_html += '<option value="' + e + '">' + _this.securities_map_tdx[e] + '</option>';
      });

      $.confirm({
        title: '添加账户',
        content: '\n          <div class="vue-confirm">\n            <form class="vue-form" id="add-account">\n              <div class="vue-form__field" style="margin-bottom: 5px;">\n                <label class="vue-form__field--left">\u8D26\u53F7\u7C7B\u578B</label>\n                <label style="padding-right: 10px;"><input type="radio" checked="checked" style="margin-right: 7px;" value="pb" name="type">PB\u8D26\u53F7</label>\n                <label style="padding-right: 10px;"><input type="radio" style="margin-right: 7px;" value="tdx" name="type">\u8D44\u91D1\u8D26\u53F7</label>\n              </div>\n              <div class="vue-form__field">\n                <label class="vue-form__field--left">\u5238\u5546\u540D\u79F0<b>*</b></label>\n                <select class="vue-form__field--select select_securities" name="security_id" placeholder="\u8BF7\u8F93\u5165\u5238\u5546\u540D\u79F0">' + pb_html + '</select>\n              </div>\n              <div class="vue-form__field">\n                <label class="vue-form__field--left">\u5E10\u53F7<b>*</b></label>\n                <input class="vue-form__field--input" name="account" placeholder="\u8BF7\u8F93\u5165\u5E10\u53F7" />\n              </div>\n              <div class="vue-form__field">\n                <label class="vue-form__field--left">\u5BC6\u7801<b>*</b></label>\n                <input class="vue-form__field--input" name="com_password" placeholder="\u8BF7\u8F93\u5165\u5BC6\u7801" />\n              </div>\n              <div class="vue-form__field">\n                <div class="vue-form__field--tip">\n                  <label style="margin-left: 105px;">\u65E0\u6CD5\u63D0\u4F9B\u5BC6\u7801\uFF0C<a class="vue-form__field--tip-btn do-noneed-password">\u8BF7\u70B9\u51FB\u8FD9\u91CC</a></label>\n                </div>\n              </div>\n              <div class="vue-form__field display-pb">\n                <label class="vue-form__field--left">\u4EA7\u54C1\u7F16\u53F7<b>*</b></label>\n                <input class="vue-form__field--input" name="fund_id" placeholder="\u8BF7\u8F93\u5165\u4EA7\u54C1\u7F16\u53F7" />\n              </div>\n              <div class="vue-form__field display-tdx" style="display: none;">\n                <label class="vue-form__field--left">\u901A\u8BAF\u5BC6\u7801</label>\n                <input class="vue-form__field--input" name="tx_password" placeholder="\u82E5\u6709\uFF0C\u5219\u5FC5\u987B\u63D0\u4F9B" />\n              </div>\n              <div class="vue-form__field display-nopasswd" style="display: none;">\n                <div class="vue-form__field--tip" style="text-align: center;">\n                  <label style="margin-left: 0;margin-top: 55px;">--\u82E5\u65E0\u6CD5\u63D0\u4F9B\u5BC6\u7801\uFF0C\u8BF7\u63D0\u4F9B\u4EE5\u4E0B\u5185\u5BB9--</label>\n                </div>\n              </div>\n              <div class="vue-form__field display-nopasswd-pb" style="display: none;">\n                <label class="vue-form__field--left">\u5355\u5143\u7F16\u53F7<b>*</b></label>\n                <input class="vue-form__field--input" name="unit_id" placeholder="\u8BF7\u8F93\u5165\u5355\u5143\u7F16\u53F7" />\n              </div>\n              <div class="vue-form__field display-nopasswd" style="display: none;">\n                <label class="vue-form__field--left">\u80A1\u4E1C\u4EE3\u7801\u6CAAA<b>*</b></label>\n                <input class="vue-form__field--input" name="sh_a_code" placeholder="\u8BF7\u8F93\u5165\u80A1\u4E1C\u4EE3\u7801\u6CAAA" />\n              </div>\n              <div class="vue-form__field display-nopasswd" style="display: none;">\n                <label class="vue-form__field--left">\u80A1\u4E1C\u4EE3\u7801\u6DF1A<b>*</b></label>\n                <input class="vue-form__field--input" name="sz_a_code" placeholder="\u8BF7\u8F93\u5165\u80A1\u4E1C\u4EE3\u7801\u6DF1A" />\n              </div>\n              <div class="vue-form__field display-nopasswd-pb" style="display: none;">\n                <label class="vue-form__field--left">\u4EA4\u6613\u5E2D\u4F4D\u6CAAA<b>*</b></label>\n                <input class="vue-form__field--input" name="seat_id_sh" placeholder="\u8BF7\u8F93\u5165\u4EA4\u6613\u5E2D\u4F4D\u6CAAA" />\n              </div>\n              <div class="vue-form__field display-nopasswd-pb" style="display: none;">\n                <label class="vue-form__field--left">\u4EA4\u6613\u5E2D\u4F4D\u6DF1A<b>*</b></label>\n                <input class="vue-form__field--input" name="seat_id_sz" placeholder="\u8BF7\u8F93\u5165\u4EA4\u6613\u5E2D\u4F4D\u6DF1A" />\n              </div>\n            </form>\n          </div>\n        ',
        closeIcon: true,
        columnClass: 'custom-window-width',
        confirmButton: '确定',
        confirmButtonClass: 'vue-confirm__btns--submit',
        confirm: function confirm() {
          var confirm_window = this;
          _this.validateForm(confirm_window, {
            needpasswdForPb: needpasswdForPb,
            needpasswdForTdx: needpasswdForTdx
          });
          // _this.submit_add(confirm_window);
          $('#add-account').submit();
          return false;
        },
        cancelButton: false
      });

      var selectCapitalAccount = function selectCapitalAccount() {
        $('.display-tdx').show();
        $('.display-pb').hide();
        $('.select_securities').empty().html(tdx_html);
        if (needpasswdForTdx == true) {
          $('.display-nopasswd').hide();
          $('.display-nopasswd-pb').hide();
        } else {
          $('.display-nopasswd').show();
          $('.display-nopasswd-pb').hide();
        }
      };
      var selectPbAccount = function selectPbAccount() {
        $('.display-tdx').hide();
        $('.display-pb').show();
        $('.select_securities').empty().html(pb_html);
        if (needpasswdForPb == true) {
          $('.display-nopasswd').hide();
          $('.display-nopasswd-pb').hide();
        } else {
          $('.display-nopasswd').show();
          $('.display-nopasswd-pb').show();
        }
      };
      var noNeedPassword = function noNeedPassword() {

        var value = $('[name="type"]:checked').val();
        if ('tdx' == value) {
          needpasswdForTdx = false;
          selectCapitalAccount();
        } else {
          needpasswdForPb = false;
          selectPbAccount();
        }
      };
      $('.vue-confirm').off().on('change', '[name="type"]', function () {
        var value = $(this).val();
        $("#add-account").validate().resetForm();
        if ('tdx' == value) {
          selectCapitalAccount();
        } else {
          selectPbAccount();
        }
      }).on('click', '.do-noneed-password', function () {
        noNeedPassword();
      });
    }
  }
});

Vue.component('vue-account-log', {
  props: [],
  template: '\n    <a class="vue-btn" v-on:click="lookLog()">\u65E5\u5FD7\u67E5\u770B</a>\n  ',
  methods: {
    lookLog: function lookLog() {
      // let _this = this;
      // let logData = [];
      // let html = '';
      // $.ajax({
      //   url: '/bms-pub/system/sec_login_logs',
      //   type: 'GET',
      //   success: ({code,msg,data}) => {
      //     if (0 == code) {
      //       logData = data;
      //       if (data.length > 0) {
      //         data.forEach((e) => {
      //           html += '<p class="vue-log-confirm__log__desc">'+e.desc+'</p>';
      //         })
      //       } else {
      //         html = '<p class="vue-log-confirm__log__desc">数据为空</p>';
      //       }
      //       $(".vue-log-confirm__log").html(html);
      //     }
      //   }
      // })
      // $.confirm({
      //   title: '日志查看',
      //   content: `
      //     <div class="vue-log-confirm__log">
      //       `+html+`
      //     </div>
      //   `,
      //   closeIcon: true,
      //   columnClass: 'custom-window-width',
      //   confirmButton: '',
      //   confirmButtonClass: 'vue-confirm__btns--submit',
      //   cancelButton: false
      // })
      var contentChild = Vue.extend({
        data: function data() {
          return {
            type: 1,
            logUserData: [],
            logOperatorData: [],
            logManagerData: [],
            showData: []
          };
        },

        template: '\n          <div style="position: relative">\n            <select name="" id="" style="position: absolute;left:110px;top:-35px;" v-model="type">\n              <option value="1">\u8D26\u6237\u767B\u5F55\u65E5\u5FD7</option>\n              <option value="2">\u64CD\u4F5C\u5458\u65E5\u5FD7</option>\n              <option value="3">\u7BA1\u7406\u5458\u64CD\u4F5C\u65E5\u5FD7</option>\n            </select>\n            <div class="vue-log-confirm__log" style="width:650px">\n\n                <p class="vue-log-confirm__log__desc" v-for="text in showData">\n                  {{text.desc}}\n                </p>\n\n            </div>\n          </div>\n        ',
        watch: {
          type: function type(val) {
            if (val == 1) {
              this.showData = this.logUserData;
            }
            if (val == 2) {
              this.showData = this.logOperatorData;
            }
            if (val == 3) {
              this.showData = this.logManagerData;
            }
          }
        },
        mounted: function mounted() {
          var _this = this;
          $.ajax({
            url: '/bms-pub/system/sec_login_logs?type=1',
            type: 'GET',
            success: function success(_ref30) {
              var code = _ref30.code,
                  msg = _ref30.msg,
                  data = _ref30.data;

              if (0 == code) {
                _this.logUserData = data;
                _this.showData = data;
              }
            }
          });
          $.ajax({
            url: '/bms-pub/system/sec_login_logs?type=2',
            type: 'GET',
            success: function success(_ref31) {
              var code = _ref31.code,
                  msg = _ref31.msg,
                  data = _ref31.data;

              if (0 == code) {
                _this.logOperatorData = data;
              }
            }
          });
          $.ajax({
            url: '/bms-pub/system/sec_login_logs?type=3',
            type: 'GET',
            success: function success(_ref32) {
              var code = _ref32.code,
                  msg = _ref32.msg,
                  data = _ref32.data;

              if (0 == code) {
                _this.logManagerData = data;
              }
            }
          });
        }
      });

      this.$confirm({
        title: '日志查看',
        content: contentChild,
        closeIcon: true
      });
    }
  }
});
// 自定义内容修改组件
Vue.component('vue-custom-modify', {
  mixins: [numberMixin],
  props: ['id', 'value', 'ajax_url', 'ajax_data', 'digital_num'],
  template: '\n    <div class="custom-modify">\n      <div class="custom-modify__content" v-show="status === \'status_display\'">\n        <span class="custom-modify__content--display-value" :title="numeralNumber(value, digital_num || 0)">{{numeralNumber(value, digital_num || 0)}}</span>\n        <a class="custom-modify__content--btn-modify" v-on:click="chgStatus(\'status_edit\')"></a>\n      </div>\n      <div class="custom-modify__content" v-show="status === \'status_edit\'" >\n        <input class="custom-modify__content--modify-value" v-model="modify_value" v-on:blur="onBlur()" v-focus="status == \'status_edit\'" />\n        <a class="custom-modify__content--btn-save" v-on:mousedown="saveData()">\u4FDD\u5B58</a>\n      </div>\n    </div>\n  ',
  watch: {},
  data: function data() {
    return {
      // 组件状态，区分显示或者修改
      status: 'status_display',
      // 修改值，为了支持用户取消修改而存在，进入修改状态时从value复制过去，其余时候根据用户修改而改变
      modify_value: ''
    };
  },
  directives: {
    focus: {
      update: function update(el, _ref33) {
        var value = _ref33.value;

        if (value) {
          el.focus();
        }
      }
    }
  },
  methods: {
    chgStatus: function chgStatus(status) {
      var _this = this;
      if ('status_edit' == status) {
        // this.modify_value = this.value;
        if (2 == this.digital_num) {
          this.modify_value = numeral(this.value).format('0.00');
        } else {
          this.modify_value = numeral(this.value).format('0');
        }

        this.$nextTick(function () {
          $(_this.$el).find('input.custom-modify__content--modify-value').focus();
        });
      }
      this.status = status;
    },
    onBlur: function onBlur() {
      this.status = 'status_display';
    },
    saveData: function saveData() {
      var _this2 = this;

      var _this = this;
      var ajax_data = this.ajax_data;
      ajax_data[this.id] = this.modify_value;
      $.ajax({
        url: this.ajax_url,
        data: ajax_data,
        type: 'post',
        success: function success(_ref34) {
          var code = _ref34.code,
              msg = _ref34.msg,
              data = _ref34.data;

          if (0 == code) {
            $.omsAlert('保存成功');
            _this2.status = 'status_display';
            _this2.$emit('modify_value', _this2.modify_value);

            if ("[object Function]" == Object.prototype.toString.call(_this2.$root.customRefreshAfterModified)) {
              _this2.$root.customRefreshAfterModified(true);
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

// td子元素 修改数字，确定+取消(基于<vue-remark-modify>)
Vue.component('vue-modify-number', {
  props: ['label', 'id', 'value_down', 'ajax_url', 'ajax_data', 'ajax_type', 'tip', 'status'],
  template: '\n    <div class="modify-number">\n      <div class="modify-number_content">\n        <p class="modify-number_content_label" :title="label">{{label}}</p>\n        <div class="modify-number_content_value">\n        <template v-if="value_down == \'\' || value_down == \'undefined\'">\n        - -\n        </template>\n        <template v-else>\n        {{value_down}}\n        </template>\n          <a  v-if="status != 6" class="modify-remark__content__icon" @click="showChangePanel()"></a>\n        </div>\n      </div>\n      <div class="modify-number_showbox" v-show="isShowChangePanel">\n        <input class="modify-number_input" v-model.number="value" type="number" @keyup="limit_number">\n        <span class="modify-number_mockplaceholder" v-show=" value === \'\' ">{{tip}}</span>\n        <a class="modify-number_save" @click="save()" >\u786E\u5B9A</a>\n    \t  <a class="modify-number_cancel" @click="cancel()" >\u53D6\u6D88</a>\n      </div>\n    </div>\n  ',
  data: function data() {
    return {
      value: "",
      isShowChangePanel: false
    };
  },
  methods: {
    limit_number: function limit_number($event) {

      if (this.label == "份额") {
        var str = $event.target.value;
        if (/^\d+\.\d{5}/.test(str)) {
          this.value = str.slice(0, str.length - 1);
        }
      }

      if (this.label == "初始资金") {
        var _str = $event.target.value;
        if (/^\d+\.\d{3}/.test(_str)) {
          this.value = _str.slice(0, _str.length - 1);
        }
      }
    },

    showChangePanel: function showChangePanel() {
      this.isShowChangePanel = true;
      this.value = this.value_down.replace(/,/g, '');
      this.$root.isdrag = false; //开启拓展
    },
    save: function save() {
      if (!this.value) {
        $.omsAlert(this.tip);
        return;
      }
      var _this = this;
      var reg = /(^\d+\.?\d{1,4}$)||(^\d$)/;;
      if (!reg.test(this.value)) {
        $.omsAlert('输入的格式错误');
        return;
      }
      var ajax_data = this.ajax_data;
      var ajax_type = this.ajax_type;
      ajax_data[this.id] = '' == this.value ? 0 : this.value;
      $.ajax({
        url: this.ajax_url,
        data: ajax_data,
        type: ajax_type,
        success: function success(_ref35) {
          var code = _ref35.code,
              msg = _ref35.msg,
              data = _ref35.data;

          if (0 == code) {
            $.omsAlert('保存成功');
            _this.isShowChangePanel = false;
            _this.value = "";
            _this.$emit('modify_value', _this.showstatus);
            if ("[object Function]" == Object.prototype.toString.call(_this.$root.customRefreshAfterModified)) {
              _this.$root.customRefreshAfterModified(true);
            }
          } else {
            $.omsAlert(msg);
          }
        },
        error: function error() {
          $.omsAlert('网络异常，请重试');
        }
      }).always(function () {
        _this.$root.isdrag = true; //开启拓展
      });
    },
    cancel: function cancel() {
      this.isShowChangePanel = false;
      this.value = "";
      this.$root.isdrag = true; //开启拓展
    }
  }
});

//vue-modify-product-number
// 产品列表中数字修改
Vue.component('vue-modify-product-number', {
  props: ['label', 'id', 'value_down', 'ajax_url', 'ajax_data', 'ajax_type', 'tip', 'status'],
  template: '\n    <div class="modify-number">\n      <div class="modify-number_content">\n        <div class="modify-number_content_value">\n        <template v-if="value_down == \'\' || value_down == \'undefined\'">\n        - -\n        </template>\n        <template v-else>\n        {{value_down}}\n        </template>\n          <a v-if="status != 6" class="modify-remark__content__icon" @click="showChangePanel()"></a>\n        </div>\n      </div>\n      <div class="modify-number_showbox" v-show="isShowChangePanel">\n        <input class="modify-number_input" v-model="value" type="text" @keydown="limit_number($event);">\n        <span class="modify-number_mockplaceholder" v-show=" value === \'\' ">{{tip}}</span>\n        <a class="modify-number_save" @click="save()" >\u786E\u5B9A</a>\n        <a class="modify-number_cancel" @click="cancel()" >\u53D6\u6D88</a>\n      </div>\n    </div>\n  ',
  data: function data() {
    return {
      value: "",
      isShowChangePanel: false
    };
  },
  methods: {
    limit_number: function limit_number(e) {

      var reg = void 0;

      switch (this.label) {
        case "份额":
          reg = /^\d+\.?\d{0,4}$/;
          break;
        case "初始资金":
          reg = /^\d+\.?\d{0,3}$/;
          break;
        case "银行存款":
          reg = /^\d+\.?\d{0,2}$/;
          break;
        default:
          reg = /^\d+\.?\d{0,4}$/;
          break;
      }

      if (8 == e.keyCode) {
        return;
      }

      if (/\S/.test(e.key)) {
        if (reg.test(this.value + e.key)) {
          return true;
        } else {
          e.preventDefault();
          return false;
        }
      }

      // if(this.label == "份额"){
      //   let str =  $event.target.value;
      //   if(/^\d+\.\d{5}/.test(str)){
      //     this.value = str.slice(0,str.length-1);
      //   }
      // }

      // if(this.label == "初始资金"){
      //   let str =  $event.target.value;
      //   if(/^\d+\.\d{3}/.test(str)){
      //     this.value = str.slice(0,str.length-1);
      //   }
      // }

      // if(this.label == "银行存款"){
      //   let str =  $event.target.value;
      //   if(/^\d+\.\d{2}/.test(str)){
      //     this.value = str.slice(0,str.length-1);
      //   }
      // }
    },

    showChangePanel: function showChangePanel() {
      this.isShowChangePanel = true;
      this.value = this.value_down.replace(/,/g, '');
      this.$root.isdrag = false; //禁止拖拽
    },
    save: function save() {
      if (!this.value) {
        $.omsAlert(this.tip);
        return;
      }
      var _this = this;
      var reg = /(^\d+\.?\d{1,4}$)||(^\d$)/;
      if (!reg.test(this.value)) {
        $.omsAlert('输入的格式错误');
        return;
      }
      var ajax_data = this.ajax_data;
      var ajax_type = this.ajax_type;
      ajax_data[this.id] = '' == this.value ? 0 : this.value;
      $.ajax({
        url: this.ajax_url,
        data: ajax_data,
        type: ajax_type,
        success: function success(_ref36) {
          var code = _ref36.code,
              msg = _ref36.msg,
              data = _ref36.data;

          if (0 == code) {
            $.omsAlert('保存成功');
            _this.isShowChangePanel = false;
            _this.$emit('modify_value', _this.value);
            _this.value = "";
            if ("[object Function]" == Object.prototype.toString.call(_this.$root.customRefreshAfterModified)) {
              _this.$root.customRefreshAfterModified(true);
            }
          } else {
            $.omsAlert(msg);
          }
        },
        error: function error() {
          $.omsAlert('网络异常，请重试');
        }
      }).always(function () {
        _this.$root.isdrag = true; //开启拖拽
      });
    },
    cancel: function cancel() {
      this.isShowChangePanel = false;
      this.value = "";
      this.$root.isdrag = true; //开启拖拽
    }
  }
});
// td子元素 修改文字，确定+取消
Vue.component('vue-modify-text', {
  props: ["row"],
  template: '\n    <div class="modify-number">\n      <div class="modify-number_content">\n        <p class="modify-number_content_label">\u57FA\u91D1\u7ECF\u7406</p>\n        <div class="modify-number_content_value">\n          {{row.operator}}\n          <a v-if="status" class="modify-remark__content__icon" @click="showChangePanel()"></a>\n        </div>\n      </div>\n      <div class="modify-number_showbox" v-show="isShowChangePanel">\n        <select class="select-tools" multiple placeholder="\u8BF7\u8F93\u5165\u57FA\u91D1\u7ECF\u7406"></select>\n        <a class="modify-number_save" @click="save()" >\u786E\u5B9A</a>\n        <a class="modify-number_cancel" @click="cancel()" >\u53D6\u6D88</a>\n      </div>\n    </div>\n  ',
  data: function data() {
    return {
      value: "",
      isShowChangePanel: false,
      options: [],
      select: '',
      name: ''
    };
  },
  methods: {
    showChangePanel: function showChangePanel() {
      this.isShowChangePanel = true;
      this.select[0].selectize.setValue([this.row.operator_uid]);
      this.$root.isdrag = false; //禁止拖拽
    },
    save: function save() {
      var _this = this;
      var value = this.select[0].selectize.getValue()[0];
      // let reg = /^\d+$/;
      if (!value) {
        $.omsAlert('请选择基金经理');
        return;
      }
      var name = $(_this.$el).find('.item').text();
      if (name.indexOf('已注销') != -1) {
        $.omsAlert('该基金经理已注销，请重新选择');
        return;
      }
      var ajax_data = {
        group_id: this.row.id,
        operator_uid: value

      };
      var ajax_type = 'post';
      $.ajax({
        url: '/bms-pub/product/modify_product_managers',
        data: ajax_data,
        type: ajax_type,
        success: function success(_ref37) {
          var code = _ref37.code,
              msg = _ref37.msg,
              data = _ref37.data;

          if (0 == code) {
            $.omsAlert('保存成功');
            _this.isShowChangePanel = false;
            _this.value = "";
            _this.row.operator_uid = value, _this.name = $(_this.$el).find('.item').text();
            _this.modify_name(_this.row);
          } else {
            $.omsAlert(msg);
          }
        },
        error: function error() {
          $.omsAlert('网络异常，请重试');
        }
      }).always(function () {
        _this.$root.isdrag = true; //开启拖拽
      });
    },
    cancel: function cancel() {
      this.isShowChangePanel = false;
      this.value = "";
      this.$root.isdrag = true; //开启拖拽
    },
    select_init: function select_init() {
      var options = this.options;
      options.forEach(function (e) {
        if (e.status == 1) {
          e.showTest = e.real_name;
        } else if (e.status == 2) {
          e.showTest = e.real_name + '(已注销)';
        }
      });
      var self = this;
      this.select = $(this.$el).find('.select-tools').selectize({
        maxItems: 1,
        valueField: 'user_id',
        labelField: 'showTest',
        searchField: 'real_name',
        options: options,
        create: false,
        onType: function onType(str) {
          this.$dropdown_content.find('.option[data-value=' + self.row.operator_uid + ']').hide(); //隐藏当前产品经理
          if (this.$dropdown_content.find('.option').length == 0) {
            this.$dropdown_content.html('<div class="option" data-selectable="" >没有匹配的基金经理</div>');
            this.$dropdown.show();
          }
        }
      });
      this.select[0].selectize.setValue([this.row.operator_uid]);
      this.select[0].selectize.$dropdown_content.find('.option[data-value=' + this.row.operator_uid + ']').hide(); //隐藏当前产品经理
    },
    modify_name: function modify_name(row) {
      row.operator = this.name;
      if (row.child_group && row.child_group instanceof Array) {
        for (var i = 0; i < row.child_group.length; i++) {
          this.modify_name(row.child_group[i]);
        }
      }
      if (row.child_product && row.child_product instanceof Array) {
        for (var _i = 0; _i < row.child_product.length; _i++) {
          this.modify_name(row.child_product[_i]);
        }
      }
    },
    updateData: function updateData() {
      var _this = this;
      $.ajax({
        url: '/bms-pub/user/getManagers?operator_uid=' + _this.row.operator_uid,
        type: 'get',
        success: function success(_ref38) {
          var code = _ref38.code,
              msg = _ref38.msg,
              data = _ref38.data;

          if (0 == code) {
            _this.isShowChangePanel = false;
            _this.value = "";
            _this.options = data;
            _this.select_init();
          } else {
            $.omsAlert(msg);
          }
        },
        error: function error() {
          $.omsAlert('网络异常，请重试');
        }
      });
    }
  },
  mounted: function mounted() {
    var _this = this;
    $.ajax({
      url: '/bms-pub/user/getManagers?operator_uid=' + _this.row.operator_uid,
      type: 'get',
      success: function success(_ref39) {
        var code = _ref39.code,
            msg = _ref39.msg,
            data = _ref39.data;

        if (0 == code) {
          _this.isShowChangePanel = false;
          _this.value = "";
          _this.options = data;
          _this.select_init();
        } else {
          $.omsAlert(msg);
        }
      },
      error: function error() {
        $.omsAlert('网络异常，请重试');
      }
    });
  },

  computed: {
    status: function status() {
      if (this.row.status == 6) {
        return false;
      } else {
        return true;
      }
    }
  }
});
Vue.component('vue-modify-text-child', {
  props: ["detail"],
  template: '\n    <div class="modify-number">\n      <div class="modify-number_content">\n        <div class="modify-number_content_value">\n          {{detail.operator}}\n          <a v-if="detail.status !=6" class="modify-remark__content__icon" @click="showChangePanel()"></a>\n        </div>\n      </div>\n      <div class="modify-number_showbox" v-show="isShowChangePanel">\n        <select class="select-tools" multiple placeholder="\u8BF7\u9009\u62E9\u57FA\u91D1\u7ECF\u7406"></select>\n        <a class="modify-number_save" @click="save()" >\u786E\u5B9A</a>\n        <a class="modify-number_cancel" @click="cancel()" >\u53D6\u6D88</a>\n      </div>\n    </div>\n  ',
  data: function data() {
    return {
      value: "",
      isShowChangePanel: false,
      options: [],
      select: ''
    };
  },
  methods: {
    showChangePanel: function showChangePanel() {
      this.isShowChangePanel = true;
      this.select[0].selectize.setValue([this.detail.operator_uid]);
      this.$root.isdrag = false; //禁止拖拽
    },
    save: function save() {
      var _this = this;
      var value = this.select[0].selectize.getValue()[0];
      // let reg = /^\d+$/;
      if (!value) {
        $.omsAlert('请选择基金经理');
        return;
      }
      var name = $(_this.$el).find('.item').text();
      if (name.indexOf('已注销') != -1) {
        $.omsAlert('该基金经理已注销，请重新选择');
        return;
      }
      var ajax_data = {
        product_id: this.detail.id,
        operator_uid: value
      };
      var ajax_type = 'post';
      $.ajax({
        url: '/bms-pub/product/modify_product_managers',
        data: ajax_data,
        type: ajax_type,
        success: function success(_ref40) {
          var code = _ref40.code,
              msg = _ref40.msg,
              data = _ref40.data;

          if (0 == code) {
            $.omsAlert('保存成功');
            _this.isShowChangePanel = false;
            _this.$root.isdrag = true; //开启拓展
            _this.value = "";
            _this.detail.operator_uid = value, _this.detail.operator = $(_this.$el).find('.item').text();
          } else {
            $.omsAlert(msg);
          }
        },
        error: function error() {
          $.omsAlert('网络异常，请重试');
        }
      }).always(function () {
        _this.$root.isdrag = true; //开启拓展
      });
    },
    cancel: function cancel() {
      this.isShowChangePanel = false;
      this.value = "";
      this.$root.isdrag = true; //开启拓展
    },
    select_init: function select_init() {
      var options = this.options;
      options.forEach(function (e) {
        if (e.status == 1) {
          e.showTest = e.real_name;
        } else if (e.status == 2) {
          e.showTest = e.real_name + '(已注销)';
        }
      });
      var self = this;
      this.select = $(this.$el).find('.select-tools').selectize({
        maxItems: 1,
        valueField: 'user_id',
        labelField: 'showTest',
        searchField: 'real_name',
        options: options,
        create: false,
        onType: function onType(str) {
          this.$dropdown_content.find('.option[data-value=' + self.detail.operator_uid + ']').hide(); //隐藏当前产品经理
          if (this.$dropdown_content.find('.option').length == 0) {
            this.$dropdown_content.html('<div class="option" data-selectable="" >没有匹配的基金经理</div>');
            this.$dropdown.show();
          }
        }
      });
      this.select[0].selectize.setValue([this.detail.operator_uid]);
      this.select[0].selectize.$dropdown_content.find('.option[data-value=' + this.detail.operator_uid + ']').hide(); //隐藏当前产品经理
    }
  },
  mounted: function mounted() {
    var _this = this;
    $.ajax({
      url: '/bms-pub/user/getManagers?operator_uid=' + _this.detail.operator_uid,
      type: 'get',
      success: function success(_ref41) {
        var code = _ref41.code,
            msg = _ref41.msg,
            data = _ref41.data;

        if (0 == code) {
          _this.isShowChangePanel = false;
          _this.value = "";
          _this.options = data;
          _this.select_init();
        } else {
          $.omsAlert(msg);
        }
      },
      error: function error() {
        $.omsAlert('网络异常，请重试');
      }
    });
  }
});
// 自定义内容修改组件 文本
Vue.component('vue-custom-modify-text', {
  props: ['id', 'value', 'ajax_url', 'ajax_data'],
  template: '\n    <div class="custom-modify">\n      <div class="custom-modify__content" v-show="status === \'status_display\'">\n        <span class="custom-modify__content--display-value" :title="customDisplay(value)">{{customDisplay(value)}}</span>\n        <a class="custom-modify__content--btn-modify" v-on:click="chgStatus(\'status_edit\')"></a>\n      </div>\n      <div class="custom-modify__content" v-show="status === \'status_edit\'" >\n        <input class="custom-modify__content--modify-value" v-model="modify_value" v-on:blur="onBlur()" v-focus="status == \'status_edit\'" />\n        <a class="custom-modify__content--btn-save" v-on:mousedown="saveData()">\u4FDD\u5B58</a>\n      </div>\n    </div>\n  ',
  data: function data() {
    return {
      // 组件状态，区分显示或者修改
      status: 'status_display',
      // 修改值，为了支持用户取消修改而存在，进入修改状态时从value复制过去，其余时候根据用户修改而改变
      modify_value: ''
    };
  },
  directives: {
    focus: {
      update: function update(el, _ref42) {
        var value = _ref42.value;

        if (value) {
          el.focus();
        }
      }
    }
  },
  methods: {
    customDisplay: function customDisplay(v) {
      if ('' == v || undefined == v) {
        return '--';
      } else {
        return v;
      }
    },
    chgStatus: function chgStatus(status) {
      var _this = this;
      if ('status_edit' == status) {
        this.modify_value = this.value;
        // this.modify_value = numeral(this.value).format('0');
        this.$nextTick(function () {
          $(_this.$el).find('input.custom-modify__content--modify-value').focus();
        });
      }
      this.status = status;
    },
    onBlur: function onBlur() {
      this.status = 'status_display';
    },
    saveData: function saveData() {
      var _this3 = this;

      var _this = this;
      var ajax_data = this.ajax_data;
      ajax_data[this.id] = this.modify_value;
      $.ajax({
        url: this.ajax_url,
        data: ajax_data,
        type: 'post',
        success: function success(_ref43) {
          var code = _ref43.code,
              msg = _ref43.msg,
              data = _ref43.data;

          if (0 == code) {
            $.omsAlert('保存成功');
            _this3.status = 'status_display';
            _this3.$emit('modify_value', _this3.modify_value);

            if ("[object Function]" == Object.prototype.toString.call(_this3.$root.customRefreshAfterModified)) {
              _this3.$root.customRefreshAfterModified(true);
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

// 自定义内容修改组件，新的版本，以弹窗的形式。另外会显示当前的值和预期变化输入框
Vue.component('vue-custom_v2-modify', {
  mixins: [numberMixin],
  props: ['id', 'value', 'ajax_url', 'ajax_data', 'label', 'adjust_value', 'current_value'],
  template: '\n    <div class="custom-v2-modify" style="position:relative;z-index:10;">\n      <div class="custom-v2-modify__content">\n        <span class="custom-v2-modify__content--display-value">{{numeralNumber(value, 2)}}</span>\n        <a class="custom-v2-modify__content--btn-modify" v-on:click="chgStatus(\'status_edit\')"></a>\n      </div>\n      <div class="custom-v2-modify__window" v-show="status === \'status_edit\'" style="position:absolute;">\n        <dl class="custom-v2-modify__window--left-content">\n          <dt>\u5F53\u524D{{label}}</dt>\n          <dd><input disabled="disabled" :value="numeralNumber(current_value, 0)" /></dd>\n        </dl>\n        <dl class="custom-v2-modify__window--right-content">\n          <dt>\u9884\u671F\u53D8\u5316</dt>\n          <dd><input :value="adjust_value" v-on:input="modify_value = $event.target.value" placeholder="\u8BF7\u8F93\u5165\u6B63\u8D1F\u6570\u5B57\uFF0C\u5982+100" style="font-size: 12px; line-height: 23px;" /></dd>\n        </dl>\n        <dl class="custom-v2-modify__window--controller">\n          <dt v-on:click="saveData()" class="custom-v2-modify__window--controller-save">\u786E\u5B9A</dt>\n          <dd v-on:click="cancelEdit()" class="custom-v2-modify__window--controller-cancel">\u53D6\u6D88</dd>\n        </dl>\n      </div>\n    </div>\n  ',
  watch: {
    // 校验

    modify_value: function modify_value(value, old) {
      var arr = value.match(/^(-|\+)?\d*\.?\d*/);
      if (arr && arr.length > 0) {
        this.modify_value = arr[0];
      }
    }
  },
  data: function data() {
    return {
      // 组件状态，区分显示或者修改//status_display status_edit
      status: 'status_display',
      // 修改值，为了支持用户取消修改而存在，进入修改状态时从value复制过去，其余时候根据用户修改而改变
      modify_value: this.adjust_value
    };
  },
  methods: {
    chgStatus: function chgStatus(status) {
      this.status = status;
    },
    cancelEdit: function cancelEdit() {
      this.chgStatus('status_display');
      this.modify_value = '';
    },
    saveData: function saveData() {
      var _this = this;
      var ajax_data = this.ajax_data;
      ajax_data[this.id] = '' == this.modify_value ? 0 : this.modify_value;
      $.ajax({
        url: this.ajax_url,
        data: ajax_data,
        type: 'post',
        success: function success(_ref44) {
          var code = _ref44.code,
              msg = _ref44.msg,
              data = _ref44.data;

          if (0 == code) {
            $.omsAlert('保存成功');
            _this.status = 'status_display';
            _this.$emit('modify_value', _this.modify_value);

            if ("[object Function]" == Object.prototype.toString.call(_this.$root.customRefreshAfterModified)) {
              _this.$root.customRefreshAfterModified(true);
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

//修改公共组件，由给备注展示的组件抽象而来
Vue.component('vue-custom_v3-modify', {
  // value: 显示的值；ajax_url: 请求url; ajax_data: 请求数据（修改的这个id除外）；id: 此组件修改的对应id
  props: ['value', 'ajax_url', 'ajax_data', 'id', 'regexp'],
  template: '\n    <div class="modify-remark">\n      <div class="modify-remark__content">\n        <span class="modify-remark__content__value" v-text="security_remark()" :title="value"></span>\n        <a class="modify-remark__content__icon" v-on:click="toggle()"></a>\n      </div>\n      <div class="modify-remark__describle" v-show="show_modify">\n        <input type="text" placeholder="\u8BF7\u8F93\u5165\u6210\u672C\u4EF7" v-model="modify_value" class="modify-remark__describle__input" v-on:blur="onBlur()" @keydown="checkKeyDown($event, modify_value)"/>\n        <a v-on:mousedown="save()" class="modify-remark__describle__determine">\u786E\u5B9A</a>\n        <a v-on:click="change_show()" class="modify-remark__describle__cancel">\u53D6\u6D88</a>\n      </div>\n    </div>\n  ',
  data: function data() {
    return {
      show_modify: false,
      modify_value: ''
    };
  },
  methods: {
    checkKeyDown: function checkKeyDown(e, value) {
      // if (this.regexp) {
      // var regexp = new RegExp(window.encodeURIComponent(this.regexp.reg));
      // var regexp = new RegExp(/^\d+\.?\d{0,3}$/);
      // var regexp = /^\d+\.?\d{0,3}$/;
      if (8 == e.keyCode) {
        return;
      }

      if (/\S/.test(e.key)) {
        if (/^\d+\.?\d{0,3}$/.test(value + e.key)) {
          // value = value + e.key;
          return true;
        }
        e.preventDefault();
        return false;
      }
      e.preventDefault();
      return false;
      // }else{
      //   return;
      // }
    },
    toggle: function toggle() {
      //当点击输入文字的icon时，应该只能显示修改框，不能隐藏
      this.show_modify = true;
      var _this = this;
      if ('' == this.value || undefined == this.value) {
        this.modify_value = '';
      } else {
        this.modify_value = this.value;
      }
      this.$nextTick(function () {
        $(_this.$el).find('input.modify-remark__describle__input').focus();
      });
    },
    change_show: function change_show() {
      this.show_modify = false;
    },
    onBlur: function onBlur() {
      this.show_modify = false;
    },
    security_remark: function security_remark() {
      if ('' == this.value || undefined == this.value) {
        return '--';
      } else {
        return this.value;
      }
    },
    save: function save() {
      var _this = this;
      // if (this.modify_value.length > 200) {
      //   $.omsAlert('最多支持输入200个字');
      //   return false;
      // }
      // if (!/^\d+(\.\d{1,3})?$/.test(this.modify_value)) {
      //   // value = value + e.key;
      //   $.omsAlert('请输入正确的数字');
      //   _this.show_remark = true;
      //   return false;
      // }

      if ('' == this.modify_value) {
        $.omsAlert('请输入成本价');
        return false;
      }

      $.startLoading('正在修改');

      var req_data = Object.assign({}, this.ajax_data);
      req_data[this.id] = this.modify_value;
      $.ajax({
        url: this.ajax_url,
        type: 'POST',
        data: req_data,
        success: function success(_ref45) {
          var code = _ref45.code,
              msg = _ref45.msg,
              data = _ref45.data;

          $.clearLoading();
          if (0 == code) {
            _this.show_remark = false;
            $.omsAlert('保存成功');

            //刷新页面,方便组件重复利用
            if ("[object Function]" == Object.prototype.toString.call(_this.$root.customRefreshAfterModified)) {
              _this.$root.customRefreshAfterModified(true);
            }
            //刷新页面,方便组件重复利用
            if ("[object Function]" == Object.prototype.toString.call(_this.$root.positionDoRefresh)) {
              _this.$root.positionDoRefresh(true);
            }

            //刷新页面,方便组件重复利用
            if ("[object Function]" == Object.prototype.toString.call(_this.$root.goto)) {
              _this.$root.goto();
            }
          } else {
            $.omsAlert(msg);
          }
        },
        error: function error() {
          $.clearLoading();
          $.omsAlert('网络异常，请重试');
        }
      });
    }
  }
});

// 自定义报表名值对组件
Vue.component('vue-custom-dl', {
  props: ['name', 'value'],
  template: '\n    <dl class="custom-dl">\n      <dt class="custom-dl__dt">{{name}}</dt>\n      <dd class="custom-dl__dd">{{value}}</dd>\n      <slot></slot>\n    </dl>\n  '
});

// 自定义报表名值对组件 ——附带修改功能
Vue.component('vue-custom-dl-modify', {
  props: ['name', 'id', 'value', 'ajax_url', 'ajax_data'],
  template: '\n    <dl class="custom-dl">\n      <dt class="custom-dl__dt">{{name}}</dt>\n      <dd class="custom-dl__dd">\n        <vue-custom-modify :id="id" :value="value" :ajax_url="ajax_url" :ajax_data="ajax_data" v-on:modify_value="modify_value($event)"></vue-custom-modify>\n      </dd>\n    </dl>\n  ',
  methods: {
    modify_value: function modify_value(v) {
      this.$emit('modify_value', v);
    }
  }
});

// 自定义报表名值对组件 ——附带修改功能 第二个版本，使用了新的vue-custom_v2-modify
Vue.component('vue-custom_v2-dl-modify', {
  props: ['name', 'id', 'value', 'ajax_url', 'ajax_data', 'adjust_value', 'current_value'],
  template: '\n    <dl class="custom-dl">\n      <dt class="custom-dl__dt">{{name}}</dt>\n      <dd class="custom-dl__dd">\n        <vue-custom_v2-modify :id="id" :value="value" :adjust_value="adjust_value" :current_value="current_value" :ajax_url="ajax_url" :ajax_data="ajax_data" :label="name" v-on:modify_value="modify_value($event)"></vue-custom_v2-modify>\n      </dd>\n    </dl>\n  ',
  methods: {
    modify_value: function modify_value(v) {
      this.$emit('modify_value', v);
    }
  }
});

// 自定义报表名值对组件 ——附带修改功能
Vue.component('vue-custom-dl-slot-modify', {
  props: ['name'],
  template: '\n    <dl class="custom-dl">\n      <dt class="custom-dl__dt">{{name}}</dt>\n      <dd class="custom-dl__dd">\n        <slot></slot>\n      </dd>\n    </dl>\n  '
});

// 自定义vue-table-content组件，设计的目的仅为提供给表格内部，使表格单元不但能够显示文本，也能显示按钮、checkbox
// 如果是按钮和checkbox，还要能够将用户触发的事件传入到上一层。
Vue.component('vue-table-content', {
  props: ['data', 'controller', 'disabled'],
  template: '\n    <span style="position:relative;">\n      <div v-if="showType(controller) == \'text\'" :style="customStyle(controller, data)">{{ display(controller, data) }}</div>\n      <input v-if="showType(controller) == \'checkbox\'" :checked="data" v-on:change="changeCheckbox()" :disabled="disabled" type="checkbox" />\n      <template v-if="showType(controller) == \'button\'" v-for="(btn, index) in controller.btns">\n        <a v-on:click="clickBtn(btn, index)">\n          {{btn.text}}\n        </a>\n      </template>\n    </span>\n  ',
  // mounted: function(){

  // },
  data: function data() {
    return {};
  },
  methods: {
    customStyle: function customStyle(controller, data) {
      if (Object.prototype.toString.call(controller.display) == '[object Function]') {
        controller.display.call(this, data);
      }
      if (controller.customColor) {
        return 'color: ' + controller.customColor + ';';
      } else if (controller.checkPositive) {
        if (data > 0) {
          return 'color: red;';
        } else if (data < 0) {
          return 'color: green;';
        }
      } else {
        return '';
      }
    },
    display: function display(controller, data) {
      if (Object.prototype.toString.call(controller.display) == '[object Function]') {
        return controller.display.call(this, data);
      } else if (controller.numeralFormat) {
        if (data > 0) {
          if (controller.showPositiveSign) {
            return '+' + numeral(data).format(controller.numeralFormat);
          } else {
            return numeral(data).format(controller.numeralFormat);
          }
        } else {
          return numeral(data).format(controller.numeralFormat);
        }
      } else {
        if (data == undefined) {
          return '';
        }
        return data;
      }
    },
    showType: function showType(controller) {
      if (controller && controller.type) {
        return controller.type;
      } else {
        return 'text';
      }
    },
    clickBtn: function clickBtn(btn, index) {
      this.$emit('clickBtn', index);
    },
    changeCheckbox: function changeCheckbox() {
      this.$emit('checkChange', !this.data);
    }
    // ,
    // destroyed: function(){
    //   console.log(destroyed);
    // }
  } });

// 自定义vue-table组件，头部内容和数据均由父组件传入的数据控制
Vue.component('vue-table', {
  props: ['tableController', 'tableData'],
  data: function data() {
    return {};
  },
  template: '\n    <table class="client-table">\n      <tbody class="client-table__thead">\n        <tr>\n          <td v-for="(v, index) in tableController">\n            <div v-if="tableController[index].type == \'checkbox\'">\n              <input type="checkbox" :checked="totalChecked" v-on:change="onTotalCheckChange" />\n            </div>\n            <span v-if="v.type !== \'checkbox\'">{{ v.tableHead }}</span>\n          </td>\n        </tr>\n      </tbody>\n      <tbody class="client-table__tbody">\n        <tr v-if="tableData.length > 0" v-for="row ,index in tableData" @click="tr_click(index,row)" @dblclick="tr_dbclick(index,row)">\n          <td v-for="v in tableController">\n            <vue-table-content :data="getObjectData(row, v.mapping)" :controller="v" :disabled="checkDisabled(row, v)" v-on:clickBtn="onButtonClick(row, v, $event)" v-on:checkChange="onCheckChange(row, $event)"></vue-table-content>\n          </td>\n        </tr>\n        <tr v-if="tableData.length == 0">\n          <td>\n            \u6682\u65E0\u76F8\u5173\u6570\u636E\n          </td>\n        </tr>\n      </tbody>\n    </table>\n  ',
  methods: {
    checkDisabled: function checkDisabled(row, v) {
      var rtn = false;
      if (v.disabledMapping) {
        rtn = row[v.disabledMapping];
      }
      return rtn;
    },
    getObjectData: function getObjectData(obj, mapping) {
      return $.pullValue(obj, mapping);
    },
    onButtonClick: function onButtonClick(row, controller, value) {
      controller.btns[value].onClick(row.id);
    },
    onCheckChange: function onCheckChange(row, value) {
      if (!row.disabled) {
        row[this.checkedMapping] = value;
      }
    },
    onTotalCheckChange: function onTotalCheckChange() {
      var _this = this;
      var flag = this.totalChecked;
      for (var index in this.tableData) {
        if (!this.tableData[index].disabled) {
          this.tableData[index][this.checkedMapping] = !flag;
        }
      }
    },
    tr_click: function tr_click(index, row) {
      this.$emit('tr_click', index, row);
    },
    tr_dbclick: function tr_dbclick(index, row) {
      this.$emit('tr_dbclick', index, row);
    }
  },
  computed: {
    checkedMapping: function checkedMapping() {
      var mapping = '';
      this.tableController.forEach(function (e, index) {
        if (e.type == 'checkbox') {
          mapping = e.mapping;
        }
      });
      return mapping;
    },
    totalChecked: function totalChecked() {
      var _this = this;
      if (this.tableData.length == 0) {
        return false;
      }
      var tmp = this.tableData.filter(function (e) {
        return e.disabled != true;
      });
      if (tmp.length == 0) {
        return false;
      }
      if (this.tableData.every(function (e) {
        return e[_this.checkedMapping] == true || e.disabled == true;
      })) {
        return true;
      } else {
        return false;
      }
    }
    // ,
    // destroyed: function(){
    //   console.log('destroyed');
    // }
  } });

// 自定义账户管理顶部信息，多个页面使用
Vue.component('vue-product-display', {
  mixins: [numberMixin],
  props: ['user_info', 'group_info', 'balance_info', 'org_info'],
  template: '\n    <ul>\n      <li v-if="org_info.theme != 3">\n        <span class="title">\u5355\u4F4D\u51C0\u503C</span>\n        <span class="content">{{ balance_info.shouldShow == \'--\' ? \'--\' : numeralNumber(balance_info.net_value, 4) }}</span>\n      </li>\n      <li v-if="org_info.theme != 3">\n        <span class="title">\u5F53\u524D\u4ED3\u4F4D</span>\n        <span class="content">{{ numeralPercent(balance_info.position) }}</span>\n      </li>\n      <li v-if="org_info.theme != 3">\n        <span class="title">\u57FA\u91D1\u7ECF\u7406</span>\n        <!-- <span class="content">{{ group_info.operator_info.status == 0 ? (group_info.managers + \'\uFF08\u5DF2\u6CE8\u9500\uFF09\') : group_info.managers }}</span> -->\n        <span class="content">{{ displayManager(user_info.status, group_info.managers) }}</span>\n      </li>\n      <li v-if="org_info.theme != 3">\n        <span class="title">\u8D44\u4EA7\u603B\u503C</span>\n        <span class="content">{{ balance_info.shouldShow == \'--\' ? \'--\' : numeralNumber(balance_info.total_assets) }}</span>\n      </li>\n      <li v-if="org_info.theme != 3">\n        <span class="title">\u521D\u59CB\u8D44\u91D1</span>\n        <span class="content">{{ group_info.is_forever == 1 ? numeralNumber(group_info.begin_capital) : \'--\' }}</span>\n      </li>\n\n      <li v-if="org_info.theme == 3">\n        <span class="title">\u5355\u4F4D\u51C0\u503C</span>\n        <span class="content">{{ balance_info.shouldShow == \'--\' ? \'--\' : numeralNumber(balance_info.net_value, 4) }}</span>\n      </li>\n      <li v-if="org_info.theme == 3">\n        <span class="title">\u5F53\u524D\u4ED3\u4F4D</span>\n        <span class="content">{{ numeralPercent(balance_info.position) }}</span>\n      </li>\n      <li v-if="org_info.theme == 3">\n        <span class="title">\u7528\u6237\u8D26\u53F7</span>\n        <span class="content">{{ group_info.operator_uid }}</span>\n      </li>\n      <li v-if="org_info.theme == 3">\n        <span class="title">\u6760\u6746\u6BD4\u4F8B</span>\n        <span class="content">{{ group_info.lever_ratio }}</span>\n      </li>\n      <li v-if="org_info.theme == 3">\n        <span class="title">\u8D44\u4EA7\u603B\u503C</span>\n        <span class="content">{{ balance_info.shouldShow == \'--\' ? \'--\' : numeralNumber(balance_info.total_assets) }}</span>\n      </li>\n      <li v-if="org_info.theme == 3">\n        <span class="title">\u501F\u6B3E\u91D1\u989D</span>\n        <span class="content">{{ numeralNumber(group_info.loan_capital) }}</span>\n      </li>\n      <li v-if="org_info.theme == 3">\n        <span class="title">\u4FDD\u8BC1\u91D1\u91D1\u989D</span>\n        <span class="content">{{ numeralNumber(group_info.assure_capital) }}</span>\n      </li>\n    </ul>\n  ',
  data: function data() {
    return {};
  },
  methods: {
    displayManager: function displayManager(status, name) {
      if (2 == status) {
        return name + '（已注销）';
      } else {
        return name;
      }
    }
  }
});
//风控设置
// <li v-if="permission.risk_setting" data-str="risk_setting" v-on:click="goto($event)" :class="[{active: active == 'risk_setting'}, {disabled: disabled == 'risk_setting'}]">
//   <div class="img_setting img_risk_setting"></div>
//   <span>风控设置</span>
// </li>

// 自定义账户管理菜单信息，多个页面使用
Vue.component('vue-product-menu', {
  props: ['permission', 'active', 'disabled', 'goto'],
  data: function data() {
    return {
      org_info_theme: window.LOGIN_INFO.org_info.theme
    };
  },
  template: '\n    <ul>\n      <li v-if="permission.base_setting" data-str="base_setting" v-on:click="goto($event)" :class="[{active: active == \'base_setting\'}, {disabled: disabled == \'base_setting\'}]">\n        <div class="img_setting img_base_setting"></div>\n        <span>\u57FA\u7840\u4FE1\u606F</span>\n      </li>\n      <li v-if="permission.user_setting && 3 == org_info_theme" data-str="user_setting" v-on:click="goto($event)" :class="[{active: active == \'user_setting\'}, {disabled: disabled == \'user_setting\'}]">\n        <div class="img_setting img_user_setting"></div>\n        <span>\u4EBA\u5458\u5206\u914D</span>\n      </li>\n      <li v-if="false" data-str="risk_setting" v-on:click="goto($event)" :class="[{active: active == \'risk_setting\'}, {disabled: disabled == \'risk_setting\'}]">\n        <div class="img_setting img_risk_setting"></div>\n        <span>\u98CE\u63A7\u8BBE\u7F6E</span>\n      </li>\n      <li v-if="permission.fee_setting" data-str="fee_setting" v-on:click="goto($event)" :class="[{active: active == \'fee_setting\'}, {disabled: disabled == \'fee_setting\'}]">\n        <div class="img_setting img_fee_setting"></div>\n        <span>\u8D39\u7528\u8BBE\u7F6E</span>\n      </li>\n      <li v-if="permission.cash_setting && 3 == org_info_theme" data-str="cash_setting" v-on:click="goto($event)" :class="[{active: active == \'cash_setting\'}, {disabled: disabled == \'cash_setting\'}]">\n        <div class="img_setting img_cash_setting"></div>\n        <span>\u8D44\u91D1\u8C03\u6574</span>\n      </li>\n      <li v-if="permission.position_setting && false" data-str="position_setting" v-on:click="goto($event)" :class="[{active: active == \'position_setting\'}, {disabled: disabled == \'position_setting\'}]">\n        <div class="img_setting img_position_setting"></div>\n        <span>\u8BC1\u5238\u8C03\u6574</span>\n      </li>\n    </ul>\n  ',
  methods: {
    // goto: function goto(e) {
    //   var li = $(e.currentTarget);
    //   if (!li.hasClass('active') && !li.hasClass('disabled')) {
    //     location.href = prefix + '/product/' + li.attr('data-str') + '?product_id=' + FD.product_id;
    //   }
    // }
  }
});

//滑块按钮 val   为初始状态 true 为选中 show 为显示的文字数组{true:{text:on,value:val},false:{text:off,value:val}}
Vue.component('vue-common-switchbut', {
  props: ['val', 'data', 'show', 'index'],
  watch: {
    val: function (_val) {
      function val(_x2) {
        return _val.apply(this, arguments);
      }

      val.toString = function () {
        return _val.toString();
      };

      return val;
    }(function (v) {
      var temp = void 0;
      if (val == this.show.true.value) {
        temp = true;
      }
      if (val == this.show.false.value) {
        temp = false;
      }
      this.value = temp;
    })
  },
  data: function data() {
    var temp = void 0;
    if (this.val == this.show.true.value) {
      temp = true;
    }
    if (this.val == this.show.false.value) {
      temp = false;
    }
    return {
      value: temp
    };
  },

  template: '\n  <div class="onoffswitch" @click="btn_click">\n    <input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" v-model=value >\n    <label class="onoffswitch-label">\n      <span class="onoffswitch-inner"  :show0="show.true.text" :show1="show.false.text"></span>\n      <span class="onoffswitch-switch"></span>\n    </label>\n  </div>\n  ',
  methods: {
    btn_click: function btn_click() {
      this.value = !this.value;
      this.$emit('btn_click', this.value, this.data, this.index);
    }
  }
});
//////////////////vue弹出框

// 3.10版本加入的弹窗骨架，在使用的地方还得传入内部展示的组件。
var VueConfirm = {};
VueConfirm.install = function (Vue, options) {
  Vue.prototype.$confirm = function (options) {
    var confirmTpll = Vue.extend({
      template: '\n      <div class="jconfirm jconfirm-white vue-confirm">\n        <div class="jconfirm-bg seen" style="transition-duration: 0.5s; transition-timing-function: cubic-bezier(0.36, 1.1, 0.2, 1); opacity: 0.2;"></div>\n        <div class="jconfirm-scrollpane vue-confirm-scrollpane" style="display: flex;align-items: center;justify-content: center;">\n          <div class="jconfirm-box" role="dialog" aria-labelledby="jconfirm-box16086" tabindex="-1" style="transition-duration: 0.5s; transition-timing-function: cubic-bezier(0.36, 1.1, 0.2, 1.2); transition-property: transform, opacity, box-shadow, margin;padding-top:34px;padding-left:20px;padding-right:20px;">\n            <div class="closeIcon" style="display: block;" @click="close" v-show="options.closeIcon">\xD7</div>\n            <div class="title-c">\n              <span class="icon-c"></span>\n              <span class="title" id="jconfirm-box16086">{{options.title}}</span>\n            </div>\n            <div class="content-pane" style="transition-duration: 0.5s; transition-timing-function: cubic-bezier(0.36, 1.1, 0.2, 1);">\n              <div >\n                <vue-confirm-content ref="child"></vue-confirm-content>\n              </div>\n            </div>\n\n          </div>\n        </div>\n      </div>\n      ',
      data: function data() {

        return { options: options };
      },

      methods: {
        // doClose: function(e){
        //   console.log(e);
        //   if ("Escape" == e.code) {
        //     this.close();
        //   }
        // },
        close: function close() {
          // console.log('close');

          if (tpl) {
            document.body.removeChild(tpl);
            this.$destroy();
            if (this.$ref) {
              this.$ref.child = null;
            }

            tpl = false;
          }
        }
      },
      mounted: function mounted() {
        var _this = this;
        var keyUpFn = function keyUpFn(e) {
          if ("Escape" == e.key) {
            _this.close();
          }
        };

        $(document).one('keyup', keyUpFn);
      },

      components: {
        'vue-confirm-content': options.content
      }
    });
    var tpl = new confirmTpll().$mount().$el; // 2、创建实例，挂载到文档以后的地方
    document.body.appendChild(tpl);
  };
};
Vue.use(VueConfirm);

// // 3.11版本，抽象出一个公共的弹窗组件
// Vue.component('vue-common-confirm', {
//   props: [],
//   template: `
//     <div>

//     </div>
//   `,
//   data: function(){
//     return {

//     }
//   },
//   methods: {

//   }
// })
//# sourceMappingURL=vue.component.js.map
