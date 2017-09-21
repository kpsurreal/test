'use strict';

function _objectDestructuringEmpty(obj) { if (obj == null) throw new TypeError("Cannot destructure undefined"); }

function reportGroupFn() {
  /*报表页面*/
  // 综合报表页面
  // Author: xueke.song, andrew.liu

  // 产品组排序的公共数据
  // 每一次ajax获取到产品组信息时，获取保存的排序规则进行排序       已实现
  // 每一次用户拖动之后，计算出交换的步骤，修改后保存               保存已实现，但是计算过程还没有
  var productSortData = {
    field_sort: []
  };
  // 表格列拖动的公共数据
  // 每一次ajax获取到产品组信息时，获取保存的排序规则进行排序       已实现
  // 每一次用户拖动之后（或者点击排序方式修改），修改保存           已实现
  var comGridSortData = {
    // field_sort 变量在显示时无用，只是保存及与后端交互时需要用到该变量名。保存的field_sort是要用来决定display_rules的数组元素顺序的。
    // 譬如，可以在浏览器console中执行“comGridSortData.display_rules.shift()”，可以看到表格的动态变化
    // field_sort: ['security_type_name', 'security_id', 'security_name', 'security_market', 'pos_direction_name', 'hold_volume', 'market_value', 'contract_value', 'profit_rate', 'weight'],
    order: '',
    order_by: '',
    display_rules: [{
      id: 'security_type_name', // 变量id
      label: '证券类别', // 变量显示名称
      format: '', // 格式化处理函数，不能提前进行处理，因为数据还要用来排序什么的。此处的处理理解为只为显示，脱离于逻辑 （函数定义于vue中）
      class: 'left60' // 样式
    }, {
      id: 'security_id',
      label: '证券代码',
      format: '',
      class: 'left60'
    }, {
      id: 'security_name',
      label: '证券名称',
      format: '',
      class: 'left60'
    }, {
      id: 'pos_direction_name',
      label: '持仓方向',
      format: '',
      class: 'left60'
    }, {
      id: 'hold_volume',
      label: '持仓数量',
      format: '',
      class: 'right60'
    }, {
      id: 'market_value',
      label: '持仓市值',
      format: ['numeralNumber', 2],
      addition_icon: 'market_value_icon',
      class: 'right60'
    }, {
      id: 'contract_value',
      label: '合约价值',
      format: ['numeralNumber', 2],
      class: 'right60'
    }, {
      id: 'profit_rate',
      label: '浮盈率',
      format: ['numeralNumber', 2],
      class: 'right60',
      unit: '%'
    }, {
      id: 'weight',
      label: '权重',
      format: ['numeralNumber', 2],
      class: 'right60',
      unit: '%' // 附带后缀单位
    }, {
      id: 'remark_change',
      label: '备注',
      class: 'remark_left'
    }]
  };

  //持仓股票 完整模式,含有positionModel:1代表是精简模式
  var positionSortData = {
    order: 'desc', //默认按降序排列，desc降序，asc升序
    order_by: 'proportion_capital', //默认按照什么进行排序，这儿填写的是display_rules下的某一个id名
    display_rules: [{
      id: 'stock_code',
      label: '证券代码',
      format: '',
      class: 'left60',
      style: 'padding-left:40px;'
    }, {
      id: 'stock_name',
      label: '证券名称',
      format: '',
      class: 'left60',
      positionModel: 1,
      style: 'padding-left:40px;'
    }, {
      id: 'hold_volume',
      label: '持仓数量',
      format: '',
      class: 'right60',
      style: 'padding-right:40px;'
    }, {
      id: 'market_value',
      label: '持仓市值',
      format: ['numeralNumber', 2],
      addition_icon: 'market_value_icon',
      class: 'right60',
      style: 'padding-right:40px;'
    }, {
      id: 'proportion_capital',
      label: '占总股本',
      format: ['numeralNumber', 2],
      class: 'right60',
      unit: '%',
      positionModel: 1,
      style: ''
    }, {
      id: 'position_capital_5',
      label: '5%总股本',
      format: ['numeralNumber', 2],
      class: 'right60',
      style: 'padding-right:40px;'
    }, {
      id: 'total_share_capital',
      label: '总股本量',
      format: ['numeralNumber', 2],
      class: 'right60',
      style: 'padding-right:40px;'
    }, {
      id: 'position_placards',
      label: '举牌差值',
      format: ['numeralNumber', 2],
      addition_icon: 'market_value_icon',
      class: 'right60',
      style: 'padding-right:40px;'
    }, {
      id: 'remark',
      label: '备注',
      class: 'remark_left ',
      positionModel: 1
    }]
  };

  var positionGridSortData = {
    field_sort: []
  };

  var reportActive = '';
  if (window.LOGIN_INFO.role_permission[GV.permissions['PERMISSION_PISITION_REPORT_VIEW']]) {
    //持仓报表
    reportActive = 'position';
  }
  if (window.LOGIN_INFO.role_permission[GV.permissions['PERMISSION_REPORT_VIEW']]) {
    //产品报表
    reportActive = 'product';
  }
  //修改备注新样式
  Vue.component('vue-remark-modify', {
    props: ['remark', 'ajax_url', 'ajax_data', 'remark_name'],
    template: '\n      <div class="modify-remark">\n        <div class="modify-remark__content">\n          <span class="modify-remark__content__value" v-text="security_remark()" :title="remark"></span>\n          <a class="modify-remark__content__icon" v-on:click="toggle()"></a>\n        </div>\n        <div class="modify-remark__describle" v-show="show_remark">\n    \t    <input type="text" :value="remark_modify" v-on:input="remark_modify = $event.target.value" class="modify-remark__describle__input" v-on:blur="onBlur()"/>\n    \t    <a v-on:mousedown="save()" class="modify-remark__describle__determine">\u786E\u5B9A</a>\n    \t    <a v-on:click="change_show()" class="modify-remark__describle__cancel">\u53D6\u6D88</a>\n    \t  </div>\n      </div>\n    ',
    data: function data() {
      return {
        show_remark: false,
        remark_modify: ''
      };
    },
    methods: {
      toggle: function toggle() {
        //当点击输入文字的icon时，应该只能显示修改框，不能隐藏
        this.show_remark = true;
        var _this = this;
        if ('' == this.remark || undefined == this.remark) {
          this.remark_modify = '';
        } else {
          this.remark_modify = this.remark;
        }
        this.$nextTick(function () {
          $(_this.$el).find('input.modify-remark__describle__input').focus();
        });
      },
      change_show: function change_show() {
        this.show_remark = false;
      },
      onBlur: function onBlur() {
        this.show_remark = false;
      },
      security_remark: function security_remark() {
        if ('' == this.remark || undefined == this.remark) {
          return '--';
        } else {
          return this.remark;
        }
      },
      save: function save() {
        var _this = this;
        if (this.remark_modify.length > 200) {
          $.omsAlert('最多支持输入200个字');
          return false;
        }

        $.startLoading('正在查询');

        $.ajax({
          url: this.ajax_url + '?' + this.remark_name + '=' + this.remark_modify,
          type: 'POST',
          data: this.ajax_data,
          success: function success(_ref) {
            var code = _ref.code,
                msg = _ref.msg,
                data = _ref.data;

            if (0 == code) {
              _this.show_remark = false;
              $.omsAlert('修改成功');

              //刷新页面,方便组件重复利用
              if ("[object Function]" == Object.prototype.toString.call(_this.$root.customRefreshAfterModified)) {
                _this.$root.customRefreshAfterModified(true);
              }
              //刷新页面,方便组件重复利用
              if ("[object Function]" == Object.prototype.toString.call(_this.$root.positionDoRefresh)) {
                _this.$root.positionDoRefresh(true);
              }
            } else {
              $.omsAlert(msg);
            }
            $.clearLoading();
          },
          error: function error() {
            $.omsAlert('网络异常，请重试');
            $.clearLoading();
          }
        });
      }
    }
  });

  // 下拉框插件 selectize  专属于产品标记
  Vue.component('vue-selectize-sign', {
    props: ['options', 'value', 'place_holder'],
    template: '\n        <select>\n          <slot></slot>\n        </select>\n    ',
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
        },
        render: {
          option: function option(item, escape) {
            var label = item.label;
            return '<div class="option select_sign">' + '<span class="select_sign_icon ' + item.color + '"></span>' + '<span class="label">' + escape(label) + '</span>' + '</div>';
          }
        }
      })[0].selectize;
      selectize.addOption(this.options);
      selectize.setValue('all');
      selectize = null;
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
    }
  });

  //子基金产品详细内容
  Vue.component('report-table-sub-funds', {
    props: ['position_list', 'pos_total', 'product_info', 'current_product_remark'],
    template: '\n    <table class="journel-sheet-grid">\n      <draggable :list="display_rules" element="tr" :options="dragOptions" :move="onMove" @end="onEnd">\n        <th v-bind:class="rule.class" v-for="rule in display_rules">\n          <span>{{rule.label}}</span>\n          <a class="icon-sortBy" v-on:click="chgSort(rule.id)" v-if="rule.label != \'\u5907\u6CE8\'">\n            <i class="icon-asc" :class="{active: (order_by == rule.id && order == \'asc\')}"></i>\n            <i class="icon-desc" :class="{active: (order_by == rule.id && order == \'desc\')}"></i>\n          </a>\n        </th>\n      </draggable>\n      <tbody>\n        <tr v-for="sub_value in display_position" :class="{lavender: sub_value.security_type==5&&pos_total==true, light_blue: sub_value.security_type==2&&pos_total==true, asset_yellow: sub_value.security_type==4&&pos_total==true}" :title="onmousePromit(sub_value)">\n          <td v-for="rule in display_rules" v-bind:class="rule.class">\n            <vue-remark-modify v-if="rule.class==\'remark_left\'" :remark_name="\'remark\'" :remark="getReportRemark(product_info.id,sub_value.security_id,product_info.type)" :ajax_url="getRemarksUrl()" :ajax_data="{stock_id:sub_value.security_id,product_id:product_info.id,type:product_info.type}"></vue-remark-modify>\n            <span v-else>\n              {{displayValue(sub_value, rule)}}\n              <prompt-language v-if="\'market_value_icon\' == rule.addition_icon && 1== sub_value.market_status" :language_val="\'\u7CFB\u7EDF\u5DF2\u5BF9\u5176\u4E2D\'+sub_value.hold_volume+\'\u80A1\u8FDB\u884C\u505C\u724C\u80A1\u7968\u4F30\u503C\u8C03\u6574\uFF0C\u505C\u724C\u65E5\u5E02\u503C\u4E3A\'+numeralNumber(sub_value.market_value_before,2)+\'\uFF0C\u8C03\u6574\u540E\u5E02\u503C\u4E3A\'+numeralNumber(sub_value.market_value,2)" style="width: 15px;display: inline-block;left: 0;"></prompt-language>\n            </span>\n          </td>\n        </tr>\n      </tbody>\n    </table>\n    ',
    data: function data() {
      return comGridSortData;
    },
    computed: {
      // 可拖动插件的入参
      dragOptions: function dragOptions() {
        return {
          animation: 0,
          // group: 'description',
          // disabled: !this.editable,
          ghostClass: 'ghost'
        };
      },

      // 显示数据准备
      display_position: function display_position() {
        var _this = this;
        var rtn = [];
        this.position_list.forEach(function (e) {
          var obj = {};
          obj.security_type = e.security_type;

          // 证券类别
          obj.security_type_name = e.security_type_name;
          // 证券代码
          var arrSecurityId = e.security_id.split(/\..*/);
          obj.security_id = arrSecurityId[0];
          // 证券名称
          obj.security_name = e.security_name;
          // 持仓方向
          obj.pos_direction_name = e.pos_direction_name;
          // 持仓数量
          obj.hold_volume = _this.parseIntNumber(e.exclude_sub && e.exclude_sub.hold_volume);

          // 持仓市值 针对股票，需要判断是否计算停牌股票
          if (e.security_type_name == '期货') {
            obj.market_value = '--';
          } else {
            if (e.exclude_sub.suspension_info.status == 1) {
              obj.market_value = e.exclude_sub && e.exclude_sub.suspension_info.valuation; //停牌估值后的市值
              obj.market_status = e.exclude_sub.suspension_info.status; //是否停牌估值1停牌估值
              obj.market_value_before = e.exclude_sub && e.exclude_sub.market_value;
            } else {
              obj.market_value = e.exclude_sub && e.exclude_sub.market_value;
            }
          }

          // 合约价值
          // obj.contract_value = e.exclude_sub && e.exclude_sub.contract_value;
          if (e.security_type_name == '期货') {
            obj.contract_value = e.exclude_sub && e.exclude_sub.market_value;
          } else {
            obj.contract_value = '--';
          }

          // 浮盈率
          if (e.exclude_sub.profit_rate == '--') {
            obj.profit_rate = '--';
          } else {
            obj.profit_rate = e.exclude_sub.profit_rate * 100;
          }

          // 权重
          if (1 == e.exclude_sub.suspension_info.status == 1) {
            obj.weight = e.exclude_sub.suspension_info.weight * 100;
          } else {
            obj.weight = e.exclude_sub.weight * 100;
          }

          rtn.push(obj);
        });

        // 步骤2，根据排序逻辑进行排序
        rtn = VUECOMPONENT.sort(rtn, _this.order, _this.order_by);
        return rtn;
      }
    },
    methods: {
      getRemarksUrl: function getRemarksUrl() {
        return '/bms-pub/report/remark/add_remark';
      },
      getReportRemark: function getReportRemark(remark_id, security_id, type) {
        //通过方法得到相对应的备注  remark_id是产品id security_id是股票id
        var get_remark;
        this.current_product_remark.forEach(function (e) {
          if (remark_id == e.product_id && security_id == e.stock_id && type == e.type) {
            get_remark = e.remark;
          }
        });
        return get_remark;
      },
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
        common_storage.setItem('report_group__grid_order', obj);
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
      onMove: function onMove(_ref2) {
        var relatedContext = _ref2.relatedContext,
            draggedContext = _ref2.draggedContext;

        if ('备注' == draggedContext.element.label) {
          return false;
        }
        var relatedElement = relatedContext.element;
        var draggedElement = draggedContext.element;

        return (!relatedElement || !relatedElement.fixed) && !draggedElement.fixed;
      },
      onEnd: function onEnd(_ref3) {
        _objectDestructuringEmpty(_ref3);

        // 用户切换表格排序，需要保存新的排序
        var obj = {};
        obj.field_sort = this.display_rules.map(function (e) {
          return e.id;
        });
        obj.order_by = this.order_by;
        obj.order = this.order;
        common_storage.setItem('report_group__grid_order', obj);
      },

      getDescInfo: function getDescInfo() {
        //备注
        var _this = this;
        this.product_info.sub_product.forEach(function (e) {
          _this.id = e.id;
          if (_this.id == e.id) {
            _this.ajax_url = window.REQUEST_PREFIX + 'omsv2/report/product_group_report_remark?id=' + e.id + '&type=' + e.type + '&stock_id=' + e.net_pos.stock_id + '&desc=' + _this.value;
          }
        });
      },
      parseIntNumber: function parseIntNumber(num) {
        //将数字变为整数
        return parseInt(num);
      },
      onmousePromit: function onmousePromit(sub_value) {
        //
        if (this.pos_total == false) {
          return false;
        } else {
          if (sub_value.security_type == 5) {
            return '定增持仓';
          } else if (sub_value.security_type == 2) {
            return '收益互换持仓';
          } else if (sub_value.security_type == 4) {
            return '场外货币基金';
          }
        }
      },
      numeralNumber: function numeralNumber(arg, num) {
        if ('--' == arg || '' === arg || undefined == arg) {
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
      checkPositive: function checkPositive(num) {
        return parseFloat(num) > 0;
      },
      checkNegative: function checkNegative(num) {
        return parseFloat(num) < 0;
      }
    }
  });

  //基金产品详情
  Vue.component('report-table-securities', {
    props: ['product_info', 'show', 'pos_total', 'current_product_remark'],
    template: '\n      <table class="journel-sheet-grid">\n        <draggable :list="display_rules" element="tr" :options="dragOptions" :move="onMove" @end="onEnd">\n          <th v-bind:class="rule.class" v-for="rule in display_rules">\n            <span>{{rule.label}}</span>\n            <a class="icon-sortBy" v-on:click="chgSort(rule.id)" v-if="rule.label != \'\u5907\u6CE8\'">\n              <i class="icon-asc" :class="{active: (order_by == rule.id && order == \'asc\')}"></i>\n              <i class="icon-desc" :class="{active: (order_by == rule.id && order == \'desc\')}"></i>\n            </a>\n          </th>\n        </draggable>\n        <tbody>\n          <tr v-for="fund_content in display_position" :class="{lavender:  fund_content.security_type==5&&pos_total==true, light_blue: fund_content.security_type==2&&pos_total==true, asset_yellow: fund_content.security_type==4&&pos_total==true}" :title="onmousePromit(fund_content)" v-if="show || (!show && !(fund_content.hold_volume == 0 && fund_content.market_value == 0))">\n            <td v-for="rule in display_rules" v-bind:class="rule.class">\n              <vue-remark-modify  v-if="rule.class==\'remark_left\'" :remark_name="\'remark\'" :remark="getReportRemark(product_info.id,fund_content.security_id,product_info.type)" :ajax_url="getRemarksUrl()" :ajax_data="{stock_id:fund_content.security_id,product_id:product_info.id,type:product_info.type}"></vue-remark-modify>\n              <span v-else>\n                {{displayValue(fund_content, rule)}}\n                <prompt-language v-if="\'market_value_icon\' == rule.addition_icon && 1== fund_content.market_status" :language_val="\'\u7CFB\u7EDF\u5DF2\u5BF9\u5176\u4E2D\'+fund_content.hold_volume+\'\u80A1\u8FDB\u884C\u505C\u724C\u80A1\u7968\u4F30\u503C\u8C03\u6574\uFF0C\u505C\u724C\u65E5\u5E02\u503C\u4E3A\'+numeralNumber(fund_content.market_value_before,2)+\'\uFF0C\u8C03\u6574\u540E\u5E02\u503C\u4E3A\'+numeralNumber(fund_content.market_value,2)" style="width: 15px;display: inline-block;left: 0;"></prompt-language>\n              </span>\n            </td>\n          </tr>\n        </tbody>\n      </table>\n    ',
    data: function data() {
      return comGridSortData;
    },
    computed: {
      // 可拖动插件的入参
      dragOptions: function dragOptions() {
        return {
          animation: 0,
          // group: 'description',
          // disabled: !this.editable,
          ghostClass: 'ghost'
        };
      },

      // 显示数据准备
      display_position: function display_position() {
        var _this = this;
        var rtn = [];
        var subData_str = '';
        if (this.show) {
          subData_str = 'include_sub';
        } else {
          subData_str = 'exclude_sub';
        }

        // 步骤1，根据接口数据进行准备
        this.product_info.position_list.forEach(function (e) {
          var obj = {};
          obj.security_type = e.security_type;

          // 证券类别
          obj.security_type_name = e.security_type_name;
          // 证券代码
          var arrSecurityId = e.security_id.split(/\..*/);
          obj.security_id = arrSecurityId[0];
          // 证券名称
          obj.security_name = e.security_name;
          // 持仓方向
          obj.pos_direction_name = e.pos_direction_name;
          // 持仓数量
          obj.hold_volume = _this.parseIntNumber(e[subData_str] && e[subData_str].hold_volume);

          // 持仓市值 针对股票，需要判断是否计算停牌股票
          if (e.security_type_name == '期货') {
            obj.market_value = '--';
          } else {
            if (e[subData_str].suspension_info.status == 1) {
              obj.market_value = e[subData_str] && e[subData_str].suspension_info.valuation;
              obj.market_status = e[subData_str] && e[subData_str].suspension_info.status;
              obj.market_value_before = e[subData_str] && e[subData_str].market_value;
            } else {
              obj.market_value = e[subData_str] && e[subData_str].market_value;
            }
          }

          // 合约价值
          // obj.contract_value = e[subData_str].market_value;
          if (e.security_type_name == '期货') {
            obj.contract_value = e[subData_str].market_value;
          } else {
            obj.contract_value = '--';
          }

          // 浮盈率
          if (e[subData_str].profit_rate == '--') {
            obj.profit_rate = '--';
          } else {
            obj.profit_rate = e[subData_str].profit_rate * 100;
          }

          // 权重
          if (1 == e[subData_str].suspension_info.status == 1) {
            obj.weight = e[subData_str].suspension_info.weight * 100;
          } else {
            obj.weight = e[subData_str].weight * 100;
          }

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
        //     if (x == '--') {
        //       return -1
        //     }
        //     if (y == '--') {
        //       return 1
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
    },
    methods: {
      getRemarksUrl: function getRemarksUrl() {
        return '/bms-pub/report/remark/add_remark';
      },
      getReportRemark: function getReportRemark(remark_id, security_id, type) {
        //通过方法得到相对应的备注  remark_id是产品id security_id是股票id
        var get_remark;
        this.current_product_remark.forEach(function (e) {
          if (remark_id == e.product_id && security_id == e.stock_id && type == e.type) {
            get_remark = e.remark;
          }
        });
        return get_remark;
      },
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
        common_storage.setItem('report_group__grid_order', obj);
      },
      displayValue: function displayValue(sub_value, rule) {
        var value = sub_value[rule.id];
        if (rule.format != '' && rule.format instanceof Array && this[rule.format[0]] instanceof Function) {
          // value = this[rule.format].call(this, value, )
          var args = [value].concat(rule.format.slice(1));
          value = this[rule.format[0]].apply(this, args);
        }
        if (rule.unit) {
          //针对浮盈率和权重
          if ('--' == value) {
            return value;
          } else {
            return value + rule.unit;
          }
        } else {
          return value;
        }
      },
      onMove: function onMove(_ref4) {
        var relatedContext = _ref4.relatedContext,
            draggedContext = _ref4.draggedContext;

        if ('备注' == draggedContext.element.label) {
          return false;
        }
        var relatedElement = relatedContext.element;
        var draggedElement = draggedContext.element;

        return (!relatedElement || !relatedElement.fixed) && !draggedElement.fixed;
      },
      onEnd: function onEnd() {
        // 用户切换排序命令，需要保存新的排序
        var obj = {};
        obj.field_sort = this.display_rules.map(function (e) {
          return e.id;
        });
        obj.order_by = this.order_by;
        obj.order = this.order;
        common_storage.setItem('report_group__grid_order', obj);
      },

      getDescInfo: function getDescInfo() {
        var _this = this;
        this.product_info.forEach(function (e) {
          _this.id = e.id;
          if (_this.id == e.id) {
            _this.ajax_url = window.REQUEST_PREFIX + 'omsv2/report/product_group_report_remark?id=' + e.id + '&type=' + e.type + '&stock_id=' + e.net_pos.stock_id + '&desc=' + _this.value;
          }
        });
      },
      onmousePromit: function onmousePromit(fund_content) {
        //判断基金类型
        if (this.pos_total == false) {
          return false;
        } else {
          if (fund_content.security_type == 5) {
            return '定增持仓';
          } else if (fund_content.security_type == 2) {
            return '收益互换持仓';
          } else if (fund_content.security_type == 4) {
            return '场外货币基金';
          }
        }
      },
      parseIntNumber: function parseIntNumber(num) {
        return parseInt(num);
      },
      numeralNumber: function numeralNumber(arg, num) {
        if ('--' == arg || '' === arg || undefined == arg) {
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
      checkPositive: function checkPositive(num) {
        return parseFloat(num) > 0;
      },
      checkNegative: function checkNegative(num) {
        return parseFloat(num) < 0;
      }
    }
  });

  //hover提示语
  Vue.component('prompt-language', {
    props: ['language_val'],
    template: '<span class="dot-tip exclamation">\n      <div v-on:mouseover="language_show()" v-on:mouseout="language_hide()">\n        <em>i</em>\n        <div class="str" style="display:none;">\n          <span class="msg">\n            <span>{{language_val}}</span>\n          </span>\n        </div>\n      </div>\n    </span>',
    methods: {
      language_show: function language_show() {
        $(this.$el).find('.str').show();
        if ($(this.$el).find('.str .msg').css('width').split('px')[0] > 300) {
          $(this.$el).find('.str .msg').addClass('hover-tip-width');
        } else {
          $(this.$el).find('.str .msg').removeClass('hover-tip-width');
        }
      },
      language_hide: function language_hide() {
        $(this.$el).find('.str').hide();
        $(this.$el).find('.str .msg').removeClass('hover-tip-width');
      }
    }
  });

  //页面头部
  Vue.component('report-table-head', {
    props: ['product_list', 'current_data', 'current_procut_id', 'product_info_arr', 'product_current_sign', 'product_sign_pole_all', 'product_sign_arr'], //slot 具名标签
    template: '\n      <div class="journel_sheet_head" style="display:block;padding-bottom:10px;">\n        <div style="display:flex;">\n            <select name="product_type" class="journel_sheet_head--select" v-model="show_type">\n              <option value="running">\u8FD0\u884C\u4E2D</option>\n              <option value="end">\u5DF2\u7ED3\u675F</option>\n              <option value="">\u5168\u90E8\u72B6\u6001</option>\n            </select>\n          <div class="journel_sheet_head--select">\n            <vue-multiple_select :options="options" :flag_check_all="true" :chg_opt_flag_check_all="true" :checked_arr="chgSelected" :init_obj="init_obj" v-on:multiple_select="chgSelected = ($event)"></vue-multiple_select>\n          </div>\n          <div class="journel_sheet_head--date">\n            <vue-zebra_date_picker :value="currentDate" v-on:select="currentDate = ($event)"  :min_date="\'2015-01-01\'" :max_date="currentDate"></vue-zebra_date_picker>\n          </div>\n          <div class="report_form_head_security">\n            <input id="pos_total" type="checkbox" v-model="pos_total" style="margin-right: 5px;" /><label v-on:click="checkbox_pos_total()" style="margin-right:10px;">\u533A\u5206\u573A\u5916\u6301\u4ED3</label>\n            <template v-if="!disabled_type">\n              <input id="cal_expect" type="checkbox" v-model="cal_expect" style="margin-right: 5px;" /><label v-on:click="checkbox_cal_expect()" style="margin-right:10px;">\u5C55\u793A\u9884\u4F30\u503C</label>\n            </template>\n            <template v-else>\n              <div style="display: inline-block;" @mouseenter="show_tip" @mouseleave="hide_tip">\n                <input id="cal_expect" type="checkbox" v-model="cal_expect" style="margin-right: 5px;" disabled /><label style="margin-right:10px;position: relative;"  >\u5C55\u793A\u9884\u4F30\u503C\n                  <div v-show="tip_show" style="position: absolute;width: 160px;border: 1px solid  #d7d5d5;text-align: center;border-radius: 4px;left: -20px;position: absolute;diplay:block">\u4EC5\u652F\u6301\u67E5\u770B\u5F53\u5929\u9884\u4F30\u503C</div>\n                </label>\n              </div>\n            </template> \n          </div>\n          <div style="flex-grow: 1;"></div>\n          <div class="journel_sheet_head--select">\n            <vue-selectize-sign :options="sign_arr" :placeholder="\'\u8BF7\u9009\u62E9\u6807\u8BB0\u4EA7\u54C1\'" :value="select_id" v-on:input="select_id = ($event)"></vue-selectize-sign>\n          </div>\n          <a v-on:click="export_report()" :class="\'custom-grey-btn custom-grey-btn__export\'" style="margin-right:15px;">\n            <i class="oms-icon oms-icon-export"></i>\u5BFC\u51FA\n          </a>\n          <a v-on:click="refresh()" class="custom-grey-btn custom-grey-btn__refresh">\n            <i class="oms-icon refresh"></i>\u5237\u65B0\n          </a>\n        </div>\n        <div class="journel_sheet_head__types">\n          <div class="journel_sheet_head__type3">\n            <i></i>\u8D27\u5E01\u57FA\u91D1\n          </div>\n          <div class="journel_sheet_head__type2">\n            <i></i>\u6536\u76CA\u4E92\u6362\n          </div>\n          <div class="journel_sheet_head__type1">\n            <i></i>\u573A\u5916\u5B9A\u589E\n          </div>\n        </div>\n        <div class="open-close" v-on:click="all_show()">\n          <span class="open-close__icon">\n            <i class="open-close__icon__bgd"></i>\n          </span>\n          <p class="open-close__describle" v-text="all_show_describle"></p>\n        </div>\n      </div>\n    ',
    data: function data() {
      return {
        currentDate: function () {
          return moment().format('YYYY-MM-DD');
        }(),
        chgSelected: '',
        checked_arr: '',
        chgSignSelected: '',
        checked_sign_arr: '',
        pos_total: true,
        cal_expect: false,
        end_product: true, //是否隐藏已结束产品
        all_show_describle: '收起全部',
        show_open_close: true, //是否全部展开
        // init_obj: {
        //   allSelected: '全部产品',
        //   noMatchesFound: '未选择任何产品',
        //   placeholder: '请选择产品'
        // },
        select_id: '',
        show_type: this.$root.end_product,
        disabled_type: false,
        tip_show: false
      };
    },
    computed: {
      options: function options() {
        var rtn = [];
        this.product_list.forEach(function (e) {
          var obj = {
            type: e.type,
            label: e.name,
            status: e.status,
            value: e.id + '&' + e.type
          };
          rtn.push(obj);
        });
        if (this.$root.end_product === 'running') {
          rtn = rtn.filter(function (item) {
            if (item.status == 5) {
              return item;
            }
          });
        } else if (this.$root.end_product === 'end') {
          rtn = rtn.filter(function (item) {
            if (item.status == 6) {
              return item;
            }
          });
        }
        return rtn;
      },
      sign_arr: function sign_arr() {
        var sign_arr = [{ 'value': 'all', 'label': '查看"全部标记"', 'color': 'hide' }];
        this.product_current_sign.forEach(function (e) {
          var obj = {
            type: e.status,
            label: '查看"' + e.keyword + '"标记',
            value: e.sign_id,
            color: e.sign_color
          };
          if (1 == obj.value) {
            obj.label = '查看"' + e.keyword + '"';
          }
          sign_arr.push(obj);
        });
        return sign_arr;
      },
      init_obj: function init_obj() {
        var obj = {
          allSelected: '全部基金',
          noMatchesFound: '未选择任何基金',
          placeholder: '请选择基金'
        };
        if (this.$root.end_product === 'running') {
          obj['allSelected'] = '全部运行中基金';
        } else if (this.$root.end_product === 'end') {
          obj['allSelected'] = '全部已结束基金';
        }
        return obj;
      }
    },
    methods: {
      show_tip: function show_tip() {
        this.tip_show = true;
      },
      hide_tip: function hide_tip() {
        this.tip_show = false;
      },

      all_show: function all_show() {
        if (true == this.show_open_close) {
          this.show_open_close = false;
          this.all_show_describle = '展开全部';
          $(".open-close__icon__bgd").css('transform', 'rotate(180deg)');
        } else {
          this.show_open_close = true;
          this.all_show_describle = '收起全部';
          $(".open-close__icon__bgd").css('transform', 'rotate(0deg)');
        }
      },
      export_report: function export_report() {
        //导出
        var _this = this;
        if (this.current_procut_id.length == 0) {
          $.omsAlert('请先选择产品组或账户');
        } else {
          var _change_id_type = '';
          //lists下面的id存储数组
          var lists_id = [];
          //base下面的id存储数组
          var product_id = [];
          //根据到处按钮的背景色来判断是否导出报表
          if ($(".custom-grey-btn__export").hasClass('doBtnExport_bgd')) {
            return false;
          }
          //是否汇总证券
          var _security_summary;
          if (_this.pos_total == false) {
            _security_summary = 1;
          } else if (_this.pos_total == true) {
            _security_summary = 0;
          }

          var cal_expect; //是否掺看预期变化
          if (false == this.cal_expect) {
            cal_expect = 0;
          } else {
            cal_expect = 1;
          }

          var end_product; //是否隐藏已结束产品
          if (false == this.end_product) {
            end_product = '';
          } else {
            end_product = 'running';
          }

          var product_sign = void 0; //由于标记筛选需要特殊处理
          var productAarr = [];
          this.product_sign_arr.forEach(function (e) {
            if (1 == e.type) {
              productAarr.push(e.id + "&group");
            } else if (2 == e.type) {
              productAarr.push(e.id + "&base");
            }
          });
          //如果标记为空或者all时，导出所选中的产品id
          if (this.select_id == '' || 'all' == this.select_id) {
            product_sign = _this.current_procut_id;
          } else {
            product_sign = productAarr;
          }
          product_sign.forEach(function (i) {
            if ('group' == i.split('&')[1]) {
              lists_id.push(i.split('&')[0]);
            }
            if ('base' == i.split('&')[1]) {
              product_id.push(i.split('&')[0]);
            }
          });
          if (lists_id.length === 0) {
            _change_id_type = 'product_id=' + product_id.join(',');
          }
          if (product_id.length === 0) {
            _change_id_type = 'group_id=' + lists_id.join(',');
          }

          if (lists_id.length > 0 && product_id.length > 0) {
            _change_id_type = 'group_id=' + lists_id.join(',') + '&product_id=' + product_id.join(',');
          }

          //
          var sorted = {};
          sorted.field_sort = comGridSortData.display_rules.map(function (e) {
            return e.id;
          });
          sorted.order = comGridSortData.order;
          sorted.order_by = comGridSortData.order_by;
          sorted.include_sub = 1; //是否包含子产品
          var arr = [];
          this.product_info_arr.forEach(function (e) {
            var id = '';
            if (e.type == 1) {
              id += 'g'; // group 产品组
            } else if (e.type == 2) {
              id += 'b'; // base 底层账户
            } else {
                ; // 匹配失败，不带前缀
              }

            id += e.id;
            arr.push(id);
          });
          sorted.group = arr;

          //筛选标记
          var product_sign_id = void 0;
          if ('all' == this.select_id) {
            product_sign_id = '';
          } else {
            product_sign_id = this.select_id;
          }
          $.startLoading();
          $.ajax({
            url: '/bms-pub/report/export_product_group_report?' + _change_id_type + '&date=' + this.currentDate + '&sorted[field_sort]=' + sorted.field_sort.join(',') + '&sorted[order]=' + sorted.order + '&sorted[order_by]=' + sorted.order_by + '&sorted[group]=' + sorted.group.join(','),
            type: 'GET',
            data: {
              date: _this.currentDate,
              cal_expect: cal_expect,
              security_summary: _security_summary,
              end_product: this.show_type,
              product_sign_id: product_sign_id
            },
            success: function success(_ref5) {
              var code = _ref5.code,
                  msg = _ref5.msg,
                  data = _ref5.data;

              $.clearLoading();
              $.omsAlert('正为您生成报表，成功后可进入文件中心下载');
            },
            error: function error() {
              $.omsAlert('网络异常，请重试');
            }
          });
        }
      },
      refresh: function refresh() {
        //刷新
        if ($('.refresh-btn').hasClass('loading')) {
          return;
        }
        $('.refresh-btn').addClass('loading');
        //刷新页面,方便组件重复利用
        if ("[object Function]" == Object.prototype.toString.call(this.$root.customRefreshAfterModified)) {
          this.$root.customRefreshAfterModified(true);
        }
      },
      checkbox_pos_total: function checkbox_pos_total() {
        //汇总证券的点击区域扩大
        if (true == this.pos_total) {
          this.pos_total = false;
        } else {
          this.pos_total = true;
        }
      },
      checkbox_cal_expect: function checkbox_cal_expect() {
        //展示预期变化
        if (true == this.cal_expect) {
          this.cal_expect = false;
        } else {
          this.cal_expect = true;
        }
      },
      judge_date: function judge_date() {
        //判断是否当前时间 
        var date = new Date();
        var arr = this.currentDate.split('-');
        if (date.getFullYear() == arr[0] && date.getMonth() + 1 == arr[1] && date.getDate() == arr[2]) {
          //时间为当前时间
          return true;
        } else {
          return false;
        }
      }
    },
    watch: { //监听数据变化
      currentDate: function currentDate() {
        //获取时间
        if (!this.judge_date()) {
          this.disabled_type = true;
          this.cal_expect = false;
        } else {
          this.disabled_type = false;
        }
        this.$emit('change_begin_data', this.currentDate);
      },
      chgSelected: function chgSelected() {
        //获取选中基金产品的id
        this.$emit('change_selected', this.chgSelected);
      },
      pos_total: function pos_total() {
        //是否汇总基金
        this.$emit('change_total', this.pos_total);
      },
      cal_expect: function cal_expect() {
        //是否按预期汇总
        this.$emit('cal_expect', this.cal_expect);
      },
      end_product: function end_product() {
        //是否隐藏已结束产品
        this.$emit('change_end_product', this.end_product);
      },
      show_open_close: function show_open_close() {
        this.$emit('control_show_hide', this.show_open_close);
      },

      select_id: function select_id() {
        this.$emit('select_sign_id', this.select_id);
      },
      show_type: function show_type(val) {
        //显示产品的状态  running 运行中 空 所有   end结束
        this.end_product = val;
      }
    }
  });
  //基金自身
  Vue.component('report-table-content', {
    props: ['product_info', 'current_data', 'pos_total', 'moving', 'control_show', 'cal_expect', 'current_product_remark', 'product_current_sign', 'curren_sign_pole', 'product_sign_pole_all', 'product_info_arr'],
    template: '\n    <div>\n      <div class="journel-sheet-content__head" style="position: relative;" :class="{\'journel-sheet-content__head--display\': display_detail}">\n        <dl style="width:22%;">\n          <dt>\n            <span :title="product_info.name">{{product_info.name}}(<span v-text="currentData()">{{current_data}}</span>)</span>\n            <a class="icon-display-hide" :class="{\'icon-display-hide__display\': display_detail, \'icon-display-hide__hide\': !display_detail}" v-on:click="toggleDisplay()"><i></i></a>\n          </dt>\n          <dd>\u6570\u636E\u66F4\u65B0\u65F6\u95F4\uFF1A{{product_info.update_time}}</dd>\n        </dl>\n\n        <div style="width:16%;">\n          <vue-custom_v2-dl-modify v-if="cal_expect" :name="\'\u9884\u4F30\u51C0\u8D44\u4EA7\'" :adjust_value="product_info.adjust_assets" :current_value="product_info.total_assets" :value="product_info.estimate_asset" :id="\'adjust_assets\'" :ajax_url="getAdjustAssetsUrl()" :ajax_data="{group_id: product_info.id, type: (1==product_info.type)?\'group\':\'base\'}"></vue-custom_v2-dl-modify>\n          <vue-custom-dl v-else :name="\'\u51C0\u8D44\u4EA7\'" :value="numeralNumber(product_info.total_assets,2)"></vue-custom-dl>\n        \n        </div>\n        <div style="width:14%;">\n          <vue-custom_v2-dl-modify v-if="cal_expect" :name="\'\u9884\u4F30\u4EFD\u989D\'" :adjust_value="product_info.adjust_volume" :current_value="product_info.volume" :value="product_info.estimate_volume" :id="\'adjust_volume\'" :ajax_url="getAdjustVolumeUrl()" :ajax_data="{group_id: product_info.id, type: (1==product_info.type)?\'group\':\'base\'}"></vue-custom_v2-dl-modify>\n          <vue-custom-dl v-else :name="\'\u4EFD\u989D\'" :value="numeralNumber(product_info.volume,0)" v-if=""></vue-custom-dl>\n        \n        </div>\n        <div style="width:8%;">\n          <vue-custom-dl  v-if="cal_expect" :name="\'\u9884\u4F30\u51C0\u503C\'" :value="numeralNumber(product_info.estimate_net_value,4)"></vue-custom-dl>\n          <vue-custom-dl v-else :name="\'\u5355\u4F4D\u51C0\u503C\'" :value="numeralNumber(product_info.net_value,4)"></vue-custom-dl>\n        </div>\n        <div style="width:7%;">\n          <vue-custom-dl :name="\'\u80A1\u7968\u4ED3\u4F4D\'" :value="numeralNumber(product_info.stock_position*100,2)+\'%\'"></vue-custom-dl>\n        </div>\n        <div style="width:6%;">\n          <vue-custom-dl :name="\'\u51C0\u591A\u5934\'" v-if="product_info.type == \'1\'" :value="numeralNumber(product_info.net_bullish*100,2)+\'%\'"></vue-custom-dl>\n          <vue-custom-dl :name="\'\u51C0\u591A\u5934\'" v-if="product_info.type == \'2\'" :value="\'--\'"></vue-custom-dl>\n        </div>\n        <div style="width:8%;">\n          <vue-custom-dl :name="\'\u504F\u79BB\u5EA6\'" :value="poleDeviation(product_info.deviation_degree)">\n            <div class="start-sign">\n              <span v-if="undefined != curren_sign_pole.sign_color" :class="\'start-sign__product productInfoId_\'+product_info.id+\' \'+curren_sign_pole.sign_color" v-on:click="change_sign_list()" @mouseenter="product_scrible_hover=true" @mouseleave="product_scrible_hover=false"></span>\n              <span v-if="undefined == curren_sign_pole.sign_color" :class="\'start-sign__product productInfoId_\'+product_info.id+\' sign_normal\'" v-on:click="change_sign_list()" @mouseenter="product_scrible_hover=true" @mouseleave="product_scrible_hover=false"></span>\n\n              <span v-if="1 == curren_sign_pole.is_benchmarking" :class="\'start-sign__pole pole_start_light\'" v-on:click="product_sign_pole(curren_sign_pole.sign_id,curren_sign_pole.is_benchmarking)"></span>\n              <span v-else :class="\'start-sign__pole pole_normal\'" v-on:click="product_sign_pole(curren_sign_pole.sign_id,curren_sign_pole.is_benchmarking)"></span>\n\n              <p class="start-sign__hover" v-show="product_scrible_hover" v-text="product_scrible_content(curren_sign_pole.sign_id)"></p>\n              <div class="start-sign__change" v-show="change_sign_show">\n                <ul class="start-sign__change__list" @mouseleave="change_sign_show=false">\n                  <li>\u9009\u62E9\u6807\u8BB0<a class="start-sign__change__list__management" v-on:click="add_sign_popup=true,change_sign_show=false">\u6807\u8BB0\u7BA1\u7406</a></li>\n                  <li v-for="signItem in product_current_sign" v-on:click="change_sign_color(signItem)"><span :class="\'start-sign__change__list__type \'+signItem.sign_color"></span><span v-text="signItem_describle(signItem,curren_sign_pole.is_benchmarking)"></span></li>\n                </ul>\n              </div>\n            </div>\n          </vue-custom-dl>\n        </div>\n        <div style="width:11%;">\n          <vue-custom-dl-slot-modify :name="\'\u5907\u6CE8\'">\n            <vue-remark-modify :remark_name="\'remarks\'" :remark="product_info.remarks" :ajax_url="getRemarksUrl()" :ajax_data="{group_id:product_info.id,type:(1 == product_info.type)?\'group\':\'base\'}"></vue-remark-modify>\n          </vue-custom-dl-slot-modify>\n        </div>\n        <div style="text-align: right;width:8%;z-index:10;position:relative;">\n          <label :for="\'showSubProduct_\' + product_info.id">\n            <input v-model="show" type="checkbox" :id="\'showSubProduct_\' + product_info.id" />\u542B\u5B50\u4EA7\u54C1\n          </label>\n        </div>\n\n        <div class="journel-sheet-content__head--move"></div>\n      </div>\n      <div v-show="display_detail && (true != moving)" class="journel-sheet-content__detail" :class="{\'journel-sheet-content__detail--display\': display_detail}">\n        <!-- <vue-custom-dl :name="\'\u573A\u5185\u671F\u8D27\u8D44\u4EA7\'" :value="numeralNumber(product_info.futures_assets,2)"></vue-custom-dl> -->\n        <vue-custom-dl :name="\'\u80A1\u7968\u5E02\u503C\'" :value="numeralNumber(product_info.stock_market_value,2)"></vue-custom-dl>\n        <vue-custom-dl :name="\'A\u80A1\u4ED3\u4F4D\'" :value="numeralNumber(product_info.stock_A_position*100,2)+ \'%\'"></vue-custom-dl>\n\n        <vue-custom-dl :name="\'A\u80A1\u51C0\u591A\u5934\'" v-if="product_info.type == \'1\'" :value="numeralNumber(product_info.A_net_bullish*100,2)+\'%\'"></vue-custom-dl>\n        <vue-custom-dl :name="\'A\u80A1\u51C0\u591A\u5934\'" v-if="product_info.type == \'2\'" :value="\'--\'"></vue-custom-dl>\n\n        <vue-custom-dl :name="\'\u98CE\u9669\u5EA6\'" :value="numeralNumber(product_info.risk_degree*100,2)+\'%\'"></vue-custom-dl>\n\n        <vue-custom-dl :name="\'\u6536\u76CA\u4E92\u6362\u8D44\u4EA7\'" v-if="product_info.type == \'1\'" :value="numeralNumber(product_info.income_swap_assets,2)">\n          <prompt-language v-show="\'\' != product_info.income_swap_error_tip" :language_val="product_info.income_swap_error_tip"></prompt-language>\n        </vue-custom-dl>\n        <vue-custom-dl :name="\'\u6536\u76CA\u4E92\u6362\u8D44\u4EA7\'" v-if="product_info.type == \'2\'" :value="\'--\'">\n          <prompt-language v-show="\'\' != product_info.income_swap_error_tip" :language_val="product_info.income_swap_error_tip"></prompt-language>\n        </vue-custom-dl>\n\n        <vue-custom-dl :name="\'\u6536\u76CA\u4E92\u6362\u4ED3\u4F4D\'" v-if="product_info.type == \'1\'" :value="numeralNumber(product_info.income_swap_position*100,2)+\'%\'">\n          <prompt-language v-show="\'\' != product_info.income_swap_error_tip" :language_val="product_info.income_swap_error_tip"></prompt-language>\n        </vue-custom-dl>\n        <vue-custom-dl :name="\'\u6536\u76CA\u4E92\u6362\u4ED3\u4F4D\'" v-if="product_info.type == \'2\'" :value="\'--\'">\n          <prompt-language v-show="\'\' != product_info.income_swap_error_tip" :language_val="product_info.income_swap_error_tip"></prompt-language>\n        </vue-custom-dl>\n\n        <vue-custom-dl :name="\'\u573A\u5916\u8D27\u5E01\u57FA\u91D1\'" v-if="product_info.type == \'1\'" :value="numeralNumber(product_info.monetary_fund_assets,2)"></vue-custom-dl>\n        <vue-custom-dl :name="\'\u573A\u5916\u8D27\u5E01\u57FA\u91D1\'" v-if="product_info.type == \'2\'" :value="\'--\'"></vue-custom-dl>\n\n        <vue-custom-dl :name="\'\u573A\u5916\u8D27\u5E01\u57FA\u91D1\u4ED3\u4F4D\'" v-if="product_info.type == \'1\'" :value="numeralNumber(product_info.monetary_fund_position*100,2)+\'%\'"></vue-custom-dl>\n        <vue-custom-dl :name="\'\u573A\u5916\u8D27\u5E01\u57FA\u91D1\u4ED3\u4F4D\'" v-if="product_info.type == \'2\'" :value="\'--\'"></vue-custom-dl>\n      </div>\n      <report-table-securities :current_product_remark="current_product_remark" v-show="display_detail && (true != moving)" :product_info="product_info" v-if="product_info.position_list.length > 0" :pos_total="pos_total" :show="show"></report-table-securities>\n      <div v-if="0 == product_info.position_list.length" v-show="display_detail && (true != moving)" class="journel-sheet-content__no-detail">\n        <span>\u8BE5\u65F6\u6BB5\u6682\u65E0\u5339\u914D\u8BB0\u5F55</span>\n      </div>\n      <div class="report-sign-popup" v-show="add_sign_popup">\n        <div class="report-sign-popup__content">\n          <h2 class="report-sign-popup__content__title">\u6807\u8BB0\u7BA1\u7406</h2>\n          <span class="report-sign-popup__content__closeBtn" v-on:click="signPupManager()">x</span>\n          <div class="report-sign-popup__content__describle">\n            <dl class="report-sign__modify">\n              <dt class="report-sign__modify__dt">\u6807\u8BB0\u7B26\u53F7</dt>\n              <dd class="report-sign__modify__dd">\u6807\u8BB0\u540D\u79F0</dd>\n            </dl>\n            <div class="report-sign-popup__content__describle__auto">\n              <dl class="report-sign__modify" v-for="signManager in product_current_sign">\n                <dt class="report-sign__modify__dt" v-if="signManager.sign_id > 1">\n                  <span :class="\'report-sign__modify__dt_color \'+signManager.sign_color "></span>\n                </dt>\n                <dd class="report-sign__modify__dd" v-if="signManager.sign_id > 1">\n                  <input type="text" :value="signManager.keyword" v-on:input="modify_sign_value = $event.target.value" @focus="signDelete(signManager.sign_id,signManager.keyword)" @blur="modifyPole(signManager.sign_id,signManager.keyword)" :class="\'report-sign__modify__dd__describle modifyPole_\'+signManager.sign_id"/>\n                  <a v-if="signManager.sign_id > 100" :class=\'"hide report-sign__modify__dd__delete signManager_"+signManager.sign_id\' v-on:mousedown="productSignDelete(signManager.sign_id)">\u5220\u9664</a>\n                  <p :class=\'" hide signPole_"+signManager.sign_id\'></p>\n                </dd>\n              </dl>\n              <dl class="report-sign__modify addReport" v-show="addCustomShow">\n                <dt class="report-sign__modify__dt">\n                  <span class="report-sign__modify__dt_color sign_product_add"></span>\n                </dt>\n                <dd class="report-sign__modify__dd">\n                  <input type="text" v-model="customDescrible" class="report-sign__modify__dd__describle addReportDescrible" v-on:focus="customFocus()" v-on:blur="customBlur()"/>\n                  <a class="report-sign__modify__dd__delete addReportDelete" v-on:mousedown="customDelete()">\u5220\u9664</a>\n                  <p class="addReportName" style="color:#F44048;">\u8BF7\u8F93\u5165\u6807\u8BB0\u540D\u79F0</p>\n                </dd>\n              </dl>\n              <dl class="report-sign__modify addReportSign">\n                <dt class="report-sign__modify__dt"></dt>\n                <dd class="report-sign__modify__dd"><button class="report-sign-popup__content__describle__add" v-on:click="addProductSign()">\u6DFB\u52A0\u65B0\u6807\u8BB0</button></dd>\n              </dl>\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>',
    data: function data() {
      return {
        display_detail: true,
        show: true,
        chang_sub_id: '',
        change_sign_show: false, //产品标记选择列表是否显示
        add_sign_popup: false, //标记管理的弹窗，可增加标记
        product_scrible_hover: false, //当hover当前产品标记的时候显示文案
        is_pole: false,
        addCustomShow: false, //是否自定义添加的
        customDescrible: '', //自定义添加的input内容
        modify_sign_value: ''
      };
    },
    watch: {
      control_show: function control_show() {
        this.display_detail = this.control_show;
      },

      show: function show() {
        this.$emit('change_sub_fund', this.show);
      },
      chang_sub_id: function chang_sub_id() {
        this.$emit('change_sub_fund_id', this.chang_sub_id);
      },
      cal_expect: function cal_expect() {}
    },
    methods: {
      signPupManager: function signPupManager() {
        this.add_sign_popup = false;
        //刷新页面,方便组件重复利用
        if ("[object Function]" == Object.prototype.toString.call(this.$root.customRefreshAfterModified)) {
          this.$root.customRefreshAfterModified(true);
        }
      },
      currentData: function currentData() {
        //数据更新时间处理
        return this.current_data.split('-').join('/');
      },
      poleDeviation: function poleDeviation(deviation) {
        //得到偏离度
        if (-1 == deviation) {
          return '--';
        } else {
          return this.numeralNumber(deviation * 100, 1) + '%';
        }
      },
      signDelete: function signDelete(sign_id, keyword) {
        $(".signManager_" + sign_id).show();
        this.modify_sign_value = keyword;
      },
      product_scrible_content: function product_scrible_content(sign_id) {
        //标记产品的hover内容
        var _this = this;
        if (1 == sign_id) {
          return '点击可对产品进行标记';
        } else {
          var sign_keyword = '';
          this.product_current_sign.forEach(function (e) {
            if (sign_id == e.sign_id) {
              sign_keyword = e.keyword;
            }
          });
          var signProductArr = []; //通过判断标记id是否相同得到一致的产品id和type
          this.product_sign_pole_all.forEach(function (e) {
            var obj = {};
            if (e.sign_id == sign_id) {
              obj.product_id = e.product_id;
              obj.type = e.type;
            }
            signProductArr.push(obj);
          });

          var signTotal = 0; //相同标记的总资产
          signProductArr.forEach(function (i) {
            _this.product_info_arr.forEach(function (e) {
              if (i.product_id == e.id && i.type == e.type) {
                signTotal += e.total_assets;
              }
            });
          });
          //需要获取相同标记id下的所有产品的id和type类型，然后获取他们各自的总资产
          return '"' + sign_keyword + '"，该标记所有产品总资产为' + this.numeralNumber(signTotal, 2);
        }
      },
      product_sign_pole: function product_sign_pole(sign_id, is_benchmarking) {
        //标杆产品
        var _this = this;
        var str = '';

        if (1 == sign_id || undefined == sign_id) {
          $.omsAlert('请先选择产品标记');
          return false;
        }
        var product_type_id = {};
        if (1 == _this.product_info.type) {
          product_type_id = {
            'group_id': _this.product_info.id,
            'type': _this.product_info.type,
            'sign_id': sign_id,
            'is_benchmarking': 0 == is_benchmarking ? 1 : 0
          };
        } else if (2 == _this.product_info.type) {
          product_type_id = {
            'product_id': _this.product_info.id,
            'type': _this.product_info.type,
            'sign_id': sign_id,
            'is_benchmarking': 0 == is_benchmarking ? 1 : 0
          };
        }
        $.startLoading('正在修改');
        $.ajax({
          url: '/bms-pub/report/add_sign',
          type: 'POST',
          data: product_type_id,
          success: function success(_ref6) {
            var code = _ref6.code,
                msg = _ref6.msg,
                data = _ref6.data;

            if (0 == code) {
              if (0 == is_benchmarking) {
                //0不是标杆产品，1是标杆产品
                str = '标杆产品设置成功';
              } else if (1 == is_benchmarking) {
                str = '标杆产品取消成功';
              }
              $.omsAlert(str);
              //刷新页面,方便组件重复利用
              if ("[object Function]" == Object.prototype.toString.call(_this.$root.customRefreshAfterModified)) {
                _this.$root.customRefreshAfterModified(true);
              }
              $.clearLoading();
            }
          },
          error: function error(_ref7) {
            var code = _ref7.code,
                msg = _ref7.msg,
                data = _ref7.data;

            $.omsAlert(msg);
          }
        });
      },
      addProductSign: function addProductSign() {
        //用户自定义添加产品
        var _this = this;
        $(".report-sign__modify__dd__describle").each(function () {
          if ('' == $(this).val() || undefined == $(this).val()) {
            return false;
          }
        });
        this.addCustomShow = true;

        this.$nextTick(function () {
          $(_this.$el).find('input.addReportDescrible').focus();
        });
        this.customDescrible = '';
        $(".addReportName").html('请输入标记名称').show();
      },
      customFocus: function customFocus() {
        //自定义添加的input的focus
        $(".addReportDelete").show();
      },
      customBlur: function customBlur() {
        //自定义添加的input 的blur
        $(".addReportDelete").hide();
        var val = this.customDescrible;
        var _this = this;
        if ('' == val || undefined == val) {
          $(".addReportName").html('请输入标记名称');
          $(".addReportDescrible").css('border', '1px solid #F44048');
          return false;
        }

        var currentKeyword = void 0; //判断是否重名
        this.product_current_sign.forEach(function (e) {
          if (e.keyword == val) {
            currentKeyword = e.keyword;
          }
        });

        if (val == currentKeyword) {
          $(".addReportName").html('标记不得重名');
          $(".addReportDescrible").css('border', '1px solid #F44048');
          return false;
        }
        //标记成功
        $(".addReportName").hide();
        $(".addReportDescrible").css('border', '1px solid #BEBEBE');
        $.ajax({
          url: '/bms-pub/report/add_sign_group',
          type: 'POST',
          data: {
            keyword: val
          },
          success: function success(_ref8) {
            var code = _ref8.code,
                msg = _ref8.msg,
                data = _ref8.data;

            $.omsAlert('标记创建成功');
            //刷新页面,方便组件重复利用
            if ("[object Function]" == Object.prototype.toString.call(_this.$root.customRefreshAfterModified)) {
              _this.$root.customRefreshAfterModified(true);
            }
            _this.addCustomShow = false;
          }
        });
      },
      modifyPole: function modifyPole(sign_id, sign_keyword) {
        //修改标记的信息
        var val = this.modify_sign_value;
        var _this = this;
        var currentKeyword = void 0;
        $(".signManager_" + sign_id).hide();

        if ('' == val || undefined == val) {
          $(".signPole_" + sign_id).html('请输入标记名称').css('color', '#F44048').show();
          $(".modifyPole_" + sign_id).css('border', '1px solid #F44048');
          return false;
        }

        if (val == sign_keyword) {
          return false;
        }

        if (val.length > 20) {
          $.omsAlert('最多支持输入20个字');
          $(".modifyPole_" + sign_id).css('border', '1px solid #F44048');
          $(".signPole_" + sign_id).html('最多支持输入20个字').css('color', '#F44048').show();
          return false;
        }

        this.product_current_sign.forEach(function (e) {
          if (val == e.keyword) {
            currentKeyword = e.keyword;
          }
        });

        if (val == currentKeyword) {
          $(".signPole_" + sign_id).html('标记不得重名').css('color', '#F44048').show();
          $(".modifyPole_" + sign_id).css('border', '1px solid #F44048');
          return false;
        }
        $(".modifyPole_" + sign_id).css('border', '1px solid #BEBEBE');
        $(".signPole_" + sign_id).hide();
        $.ajax({
          url: '/bms-pub/report/add_sign_group',
          type: 'POST',
          data: {
            sign_id: sign_id,
            keyword: val
          },
          success: function success(_ref9) {
            var code = _ref9.code,
                msg = _ref9.msg,
                data = _ref9.data;

            if (0 == code) {
              //刷新页面,方便组件重复利用
              if ("[object Function]" == Object.prototype.toString.call(_this.$root.customRefreshAfterModified)) {
                _this.$root.customRefreshAfterModified(true);
              }

              $(".signPole_" + sign_id).show().html('标记"' + val + '"修改成功').css({ 'color': '#FB8927' }); //成功
              setTimeout(function () {
                $(".signPole_" + sign_id).hide();
              }, 3000);
            } else {
              $(".modifyPole_" + sign_id).show().css({ 'border': '1px solid #F44048' });
              $(".signPole_" + sign_id).html('<span class="sign_error"></span>标记"' + val + '"修改失败').css({ 'color': '#FC2727' }); //失败
            }
          },
          error: function error() {}
        });
      },
      productSignDelete: function productSignDelete(sign_id) {
        //删除用户添加的标记
        var _this = this;
        $.ajax({
          url: '/bms-pub/report/del_sign_group',
          type: 'POST',
          data: {
            sign_id: sign_id
          },
          success: function success(_ref10) {
            var code = _ref10.code,
                msg = _ref10.msg,
                data = _ref10.data;

            if (0 == code) {
              $.omsAlert('标记删除成功');
              //刷新页面,方便组件重复利用
              if ("[object Function]" == Object.prototype.toString.call(_this.$root.customRefreshAfterModified)) {
                _this.$root.customRefreshAfterModified(true);
              }
            }
          }
        });
      },
      customDelete: function customDelete() {
        //自定义删除
        this.addCustomShow = false;
        //刷新页面,方便组件重复利用
        if ("[object Function]" == Object.prototype.toString.call(_this.$root.customRefreshAfterModified)) {
          _this.$root.customRefreshAfterModified(true);
        }
      },
      change_sign_list: function change_sign_list() {
        if (false == this.change_sign_show) {
          this.change_sign_show = true;
        } else {
          this.change_sign_show = false;
        }
        this.product_scrible_hover = false;
      },
      signItem_describle: function signItem_describle(signItem) {
        if (1 == signItem.id) {
          return signItem.keyword;
        } else {
          return '"' + signItem.keyword + '"标记';
        }
      },
      change_sign_color: function change_sign_color(signItem) {
        var _this2 = this;

        //修改产品的标记
        $.startLoading('正在修改');
        var _this = this;

        var product_type_id = {};
        if (1 == _this.product_info.type) {
          product_type_id = {
            'group_id': _this.product_info.id,
            'type': _this.product_info.type,
            sign_id: signItem.sign_id,
            is_benchmarking: 0
          };
        } else if (2 == _this.product_info.type) {
          product_type_id = {
            'product_id': _this.product_info.id,
            'type': _this.product_info.type,
            sign_id: signItem.sign_id,
            is_benchmarking: 0
          };
        }

        $.ajax({
          url: '/bms-pub/report/add_sign',
          type: 'POST',
          data: product_type_id,
          success: function success(_ref11) {
            var code = _ref11.code,
                msg = _ref11.msg,
                data = _ref11.data;

            $.clearLoading();

            if (0 == code) {
              _this2.change_sign_show = false;
              //刷新页面,方便组件重复利用
              if ("[object Function]" == Object.prototype.toString.call(_this.$root.customRefreshAfterModified)) {
                _this.$root.customRefreshAfterModified(true);
              }
              $.omsAlert('标记修改成功');
            } else {
              $.omsAlert(msg);
            }
          },
          error: function error(_ref12) {
            var code = _ref12.code,
                msg = _ref12.msg,
                data = _ref12.data;

            $.clearLoading();
            $.omsAlert(msg);
          }
        });
      },
      getAdjustValue: function getAdjustValue() {//当前净资产
        // if (true == this.cal_expect) {
        //   return this.product_info.total_assets-this.product_info.adjust_assets;
        // }
        // if (false == this.cal_expect){
        //   return this.product_info.total_assets;
        // }
      },
      getAdjustVolume: function getAdjustVolume() {//当前份额
        // if (true == this.cal_expect) {
        //   return parseFloat(this.product_info.volume)-parseFloat(this.product_info.adjust_volume);
        // }
        // if (false == this.cal_expect){
        //   return this.product_info.volume;
        // }
      },
      getAdjustAssetsUrl: function getAdjustAssetsUrl() {
        return '/bms-pub/report/modify_product_assets';
      },
      getAdjustVolumeUrl: function getAdjustVolumeUrl() {
        return '/bms-pub/report/modify_product_volume';
      },
      getRemarksUrl: function getRemarksUrl() {
        return '/bms-pub/report/modify_product_remarks';
      },
      toggleDisplay: function toggleDisplay() {
        this.display_detail = !this.display_detail;
        this.$emit('display_detail', this.display_detail);
      },
      numeralNumber: function numeralNumber(arg, num) {
        if (undefined != num) {
          var str = '0.';
          for (var i = num - 1; i >= 0; i--) {
            str += '0';
          }
          return numeral(arg).format('0,' + str);
        }
        return numeral(arg).format('0,0.00');
      },
      showSubFund: function showSubFund() {
        if (this.show == true) {
          this.show = false;
          $(".closebtn .show_sub_fund" + this.product_info.id).css('transform', 'rotate(180deg)');
        } else {
          this.show = true;
          $(".closebtn .show_sub_fund" + this.product_info.id).css('transform', 'rotate(360deg)');
        }
      }
    }
  });
  //基金子基金部分
  Vue.component('report-sub-content', {
    props: ['product_info', 'pos_total', 'current_product_remark', 'cal_expect'],
    template: '<div class="report_form_sub_funds" v-if="product_info.sub_product != \'\'">\n      <ul class="report_form_sub_funds_content journel-sheet-sub-funds">\n        <li v-for="fund in product_info.sub_product" class="journel-sheet-sub-fund">\n          <div class="journel-sheet-sub-fund__header">\n            <div class="journel-sheet-sub-fund__header--main">\n              <div style="width: 250px;">\n                <div class="journel-sheet-sub-fund__header--title" style="overflow:hidden;text-overflow: ellipsis;white-space: nowrap;" :title="fund.name">{{fund.name}}</div>\n              </div>\n              <vue-custom_v2-dl-modify v-if="cal_expect" :name="\'\u9884\u4F30\u51C0\u8D44\u4EA7\'" :adjust_value="fund.adjust_assets" :current_value="fund.estimate_asset" :value="fund.estimate_asset" :id="\'adjust_assets\'" :ajax_url="getAdjustAssetsUrl()" :ajax_data="{group_id: fund.id, type: (1==fund.type)?\'group\':\'base\'}"></vue-custom_v2-dl-modify>\n              <vue-custom-dl v-else :name="\'\u51C0\u8D44\u4EA7\'" :value="numeralNumber(fund.total_assets,2)"></vue-custom-dl>\n             \n              <vue-custom_v2-dl-modify v-if="cal_expect" :name="\'\u9884\u4F30\u4EFD\u989D\'" :adjust_value="fund.adjust_volume" :current_value="fund.volume" :value="fund.estimate_volume"  :id="\'adjust_volume\'" :ajax_url="getAdjustVolumeUrl()" :ajax_data="{group_id: fund.id, type: (1==fund.type)?\'group\':\'base\'}"></vue-custom_v2-dl-modify>\n              <vue-custom-dl v-else :name="\'\u4EFD\u989D\'" :value="numeralNumber(fund.volume,0)" v-if=""></vue-custom-dl>\n            \n\n              <vue-custom-dl v-if="cal_expect" :name="\'\u9884\u4F30\u51C0\u503C\'" :value="numeralNumber(fund.estimate_net_value,4)"></vue-custom-dl>\n              <vue-custom-dl :name="\'\u5355\u4F4D\u51C0\u503C\'" :value="numeralNumber(fund.net_value,4)"></vue-custom-dl>\n              <vue-custom-dl :name="\'\u80A1\u7968\u4ED3\u4F4D\'" :value="numeralNumber(fund.stock_position*100,2)+\'%\'"></vue-custom-dl>\n              <vue-custom-dl :name="\'\u51C0\u591A\u5934\'" :value="numeralNumber(fund.net_bullish*100,2)+\'%\'"></vue-custom-dl>\n\n              <!-- <vue-custom-dl :name="\'\u5907\u6CE8\'" :value="fund.remark"></vue-custom-dl> -->\n              <!-- <vue-custom-dl-modify :name="\'\u5907\u6CE8\'" :value="fund.remarks" :id="\'remarks\'" :ajax_url="getRemarksUrl()" :ajax_data="{group_id: fund.id, type: (1==fund.type)?\'group\':\'base\'}"></vue-custom-dl-modify> -->\n              <vue-custom-dl-slot-modify :name="\'\u5907\u6CE8\'">\n                <vue-remark-modify :remark_name="\'remarks\'" :remark="fund.remarks" :ajax_url="getRemarksUrl()" :ajax_data="{group_id:fund.id,type:(1 == fund.type)?\'group\':\'base\'}"></vue-remark-modify>\n              </vue-custom-dl-slot-modify>\n\n              <div style="visibility: hidden;">\n                <label>\n                  <input type="checkbox" />\u542B\u5B50\u4EA7\u54C1\n                </label>\n              </div>\n            </div>\n            <div class="journel-sheet-sub-fund__header--detail">\n              <vue-custom-dl :name="\'\u80A1\u7968\u5E02\u503C\'" :value="numeralNumber(fund.stock_market_value,2)"></vue-custom-dl>\n              <vue-custom-dl :name="\'A\u80A1\u4ED3\u4F4D\'" :value="numeralNumber(fund.stock_A_position*100,2)+\'%\'"></vue-custom-dl>\n              <vue-custom-dl :name="\'A\u80A1\u51C0\u591A\u5934\'" :value="numeralNumber(fund.A_net_bullish*100,2)+\'%\'"></vue-custom-dl>\n              <vue-custom-dl :name="\'\u98CE\u9669\u5EA6\'" :value="numeralNumber(fund.risk_degree*100,2)+\'%\'"></vue-custom-dl>\n              <vue-custom-dl :name="\'\u6536\u76CA\u4E92\u6362\u8D44\u4EA7\'" :value="numeralNumber(fund.income_swap_assets,2)">\n                <prompt-language v-show="\'\' != fund.income_swap_error_tip" :language_val="fund.income_swap_error_tip"></prompt-language>\n              </vue-custom-dl>\n              <vue-custom-dl :name="\'\u6536\u76CA\u4E92\u6362\u4ED3\u4F4D\'" :value="numeralNumber(fund.income_swap_position*100,2)+ \'%\'">\n                <prompt-language v-show="\'\' != fund.income_swap_error_tip" :language_val="fund.income_swap_error_tip"></prompt-language>\n              </vue-custom-dl>\n              <vue-custom-dl :name="\'\u573A\u5916\u8D27\u5E01\u57FA\u91D1\'" :value="numeralNumber(fund.monetary_fund_assets,2)"></vue-custom-dl>\n              <vue-custom-dl :name="\'\u573A\u5916\u8D27\u5E01\u57FA\u91D1\u4ED3\u4F4D\'" :value="numeralNumber(fund.monetary_fund_position*100,2)+\'%\'"></vue-custom-dl>\n            </div>\n          </div>\n\n          <report-table-sub-funds :current_product_remark="current_product_remark" :product_info="product_info" :position_list="fund.position_list" v-if="fund.position_list != \'\'" :pos_total="pos_total"></report-table-sub-funds>\n        </li>\n      </ul>\n    </div>',
    methods: {
      getAdjustAssetsUrl: function getAdjustAssetsUrl() {
        return '/bms-pub/report/modify_product_assets';
      },
      getAdjustVolumeUrl: function getAdjustVolumeUrl() {
        return '/bms-pub/report/modify_product_volume';
      },
      getRemarksUrl: function getRemarksUrl() {
        return '/bms-pub/report/modify_product_remarks';
      },
      getAdjustValue: function getAdjustValue(fund) {
        //当前净资产
        if (true == this.cal_expect) {
          return fund.total_assets - fund.adjust_assets;
        }
        if (false == this.cal_expect) {
          return fund.total_assets;
        }
      },
      getAdjustVolume: function getAdjustVolume(fund) {
        //当前份额
        if (true == this.cal_expect) {
          return parseFloat(fund.volume) - parseFloat(fund.adjust_volume);
        }
        if (false == this.cal_expect) {
          return fund.volume;
        }
      },
      numeralNumber: function numeralNumber(arg, num) {
        if (undefined != num) {
          var str = '0.';
          for (var i = num - 1; i >= 0; i--) {
            str += '0';
          }
          return numeral(arg).format('0,' + str);
        }
        return numeral(arg).format('0,0.00');
      }
    }
  });

  //基金主体
  Vue.component('report-content', {
    props: ['product_info', 'current_data', 'pos_total', 'moving', 'control_show', 'cal_expect', 'current_product_remark', 'product_current_sign', 'product_sign_pole_all', 'product_select_sign', 'product_info_arr'],
    template: '\n      <div class="journel-sheet-content" v-show="productSelectShow()">\n        <report-table-content :curren_sign_pole="curren_sign_pole" :product_current_sign="product_current_sign" :product_sign_pole_all="product_sign_pole_all" :current_product_remark="current_product_remark" :product_info_arr="product_info_arr" :cal_expect="cal_expect" :control_show="control_show" :moving="moving" :product_info="change_sub_data()" :current_data="current_data" v-on:change_sub_fund="sub_show = $event" v-on:change_sub_fund_id="sub_fund_id = $event" :pos_total="pos_total" v-on:display_detail="display_detail = $event"></report-table-content>\n        <report-sub-content :cal_expect="cal_expect" :current_product_remark="current_product_remark" :control_show="control_show" v-show="display_detail && sub_show && (true !== moving)" :product_info="product_info" v-if="product_info.sub_product != \'\'" :pos_total="pos_total"></report-sub-content>\n      </div>\n    ',
    data: function data() {
      return {
        display_detail: true,
        sub_show: true,
        sub_fund_id: ''
        // curren_sign_pole: {}
      };
    },
    computed: {
      curren_sign_pole: function curren_sign_pole() {
        var _this = this;
        var obj = { 'sign_id': 1 };
        this.product_sign_pole_all.forEach(function (e) {
          if (e.product_id == _this.product_info.id && e.type == _this.product_info.type) {
            obj = e;
            if (e.sign_id <= 100) {
              if (1 == e.sign_id) {
                obj.sign_color = 'sign_normal';
              } else if (2 == e.sign_id) {
                obj.sign_color = 'sign_red';
              } else if (3 == e.sign_id) {
                obj.sign_color = 'sign_pink';
              } else if (4 == e.sign_id) {
                obj.sign_color = 'sign_citrus';
              } else if (5 == e.sign_id) {
                obj.sign_color = 'sign_orange';
              } else if (6 == e.sign_id) {
                obj.sign_color = 'sign_yellow';
              } else if (7 == e.sign_id) {
                obj.sign_color = 'sign_dlackish_green';
              } else if (8 == e.sign_id) {
                obj.sign_color = 'sign_green';
              } else if (9 == e.sign_id) {
                obj.sign_color = 'sign_indigo';
              } else if (10 == e.sign_id) {
                obj.sign_color = 'sign_blue';
              } else if (11 == e.sign_id) {
                obj.sign_color = 'sign_cyan';
              } else if (12 == e.sign_id) {
                obj.sign_color = 'sign_purple';
              } else if (13 == e.sign_id) {
                obj.sign_color = 'sign_brown';
              } else if (14 == e.sign_id) {
                obj.sign_color = 'sign_gray';
              } else if (15 == e.sign_id) {
                obj.sign_color = 'sign_black';
              }
            } else if (e.sign_id > 100) {
              obj.sign_color = 'sign_product_add';
            }
            if (0 == e.is_benchmarking) {
              obj.pole_style = 'pole_normal';
            } else if (1 == e.is_benchmarking) {
              obj.pole_style = 'pole_start_light';
            }
          }
        });
        if ('' == obj) {
          obj.sign_id = 1;
        }
        return obj;
      }
    },
    watch: {
      control_show: function control_show() {
        this.display_detail = this.control_show;
      }
    },
    methods: {
      productSelectShow: function productSelectShow() {
        if ('' == this.product_select_sign || 'all' == this.product_select_sign || this.product_select_sign == this.curren_sign_pole.sign_id) {
          return true;
        } else {
          return false;
        }
      },
      change_sub_data: function change_sub_data() {
        if (true == this.sub_show) {
          return this.product_info;
        } else {
          //由于底层账户是不存在子产品的，所以再次要加一个判断（查看是否包含main_product）
          if (2 == this.product_info.type) {
            return this.product_info;
          } else {
            this.product_info.main_product.update_time = this.product_info.update_time;
            return this.product_info.main_product;
          }
        }
      }
    }
  });

  // 上面部分是产品报表，下面是持仓报表
  //单选，默认选中某一个
  Vue.component('vue-selectize-radio-selected', {
    props: ['options', 'value', 'place_holder', 'defaultSelected'],
    template: '\n        <select>\n          <slot></slot>\n        </select>\n    ',
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
      selectize.setValue(this.defaultSelected); //默认选中某一个,填写相对应的value
      selectize = null;
    },
    watch: {
      value: function value(_value2) {
        // update value
        $(this.$el).selectize()[0].selectize.setValue(_value2);
      },
      options: function options(_options2) {
        // // update options
        var value = this.value;
        var selectize = $(this.$el).selectize()[0].selectize;
        selectize.clearOptions(true);
        selectize.clearOptions(true);
        selectize.addOption(this.options);
        selectize.setValue(value);
        selectize = null;
      }
    }
  });

  //各基金经理持仓股票
  Vue.component('report-position-stock', {
    props: ['managerItem', 'totalCapitalOptions', 'is_starter', 'position_show', 'position_stock_data', 'position_user_display_detail', 'moving', 'select_id', 'positionDataShowSort'],
    template: '\n      <div class="journel-sheet-content">\n        <div class="journel-sheet-content__head" :class="{\'journel-sheet-content__head--display\': user_stock_display}" style="position: relative;">\n          <dl style="width:22%;">\n            <dt>\n              <span v-text="position_user_name(managerItem)"></span>\n              <a class="icon-display-hide" :class="{\'icon-display-hide__display\': user_stock_display, \'icon-display-hide__hide\': !user_stock_display}" v-on:click="togglePositionUserDisplay()"><i></i></a>\n            </dt>\n            <dd>\u6570\u636E\u66F4\u65B0\u65F6\u95F4\uFF1A<span v-text="componey_upDate(managerItem)"></span></dd>\n          </dl>\n\n          <div>\n            <vue-custom-dl :name="\'\u80A1\u7968\u6301\u4ED3\uFF08\u53EA\uFF09\'" :value="stock_total.length"></vue-custom-dl>\n          </div>\n          <div v-for="stock_num in totalCapitalOptions">\n            <vue-custom-dl v-if="stock_num.value > 0" :name="\'\u6301\u4ED3\u8D85\u8FC7\'+stock_num.value+\'%\u603B\u80A1\u672C\uFF08\u53EA\uFF09\'" :value="position_stock_volume(managerItem,stock_num.value)"></vue-custom-dl>\n          </div>\n          <div class="journel-sheet-content__head--move"></div>\n        </div>\n        <report-position-securities v-show="user_stock_display && (true !== moving)" :is_starter="is_starter" :user_id="user_id" :select_id="select_id" :managerItem="managerItem" :position_user_display_detail="position_user_display_detail" :moving="moving" :position_stock_data="position_stock_data" :positionDataShowSort="positionDataShowSort"></report-position-securities>\n      </div>\n    ',
    data: function data() {
      return {
        user_stock_display: true,
        user_id: '',
        stock_total: []
      };
    },
    watch: {
      position_show: function position_show() {
        this.user_stock_display = this.position_show;
      },
      user_stock_display: function user_stock_display() {
        this.$emit('display_stock_change', this.user_stock_display);
      }
    },
    methods: {
      position_user_name: function position_user_name(user_name) {
        //基金经理名称处理
        var _this = this;
        this.user_id = user_name.id;
        if ('total' == user_name.id) {
          return '公司持仓';
        } else {
          return user_name.name + '持仓';
        }
      },
      componey_upDate: function componey_upDate(managerItem) {
        var userId = managerItem.id; //相对应的基金经理
        var stock_arr = this.position_stock_data; //所有基金经理的股票
        var upDate = ''; // 数据更新时间
        $.each(stock_arr, function (key, value) {
          if (userId == key) {
            upDate = value.updated_time; //只需要获取第一只股票下的时间就可以
          }
        });
        //时间处理
        var dataTime = new Date(upDate * 1000);
        var hour = dataTime.getHours() < 10 ? '0' + dataTime.getHours() : dataTime.getHours();
        var minutes = dataTime.getMinutes() < 10 ? '0' + dataTime.getMinutes() : dataTime.getMinutes();
        var seconds = dataTime.getSeconds() < 10 ? '0' + dataTime.getSeconds() : dataTime.getSeconds();
        return hour + ':' + minutes + ':' + seconds;
      },
      position_stock_volume: function position_stock_volume(managerItem, item) {
        //item代表持仓超过item%总股本，item没传值为undefined代表股票之和
        var userId = managerItem.id; //相对应的基金经理
        var stock_arr = this.position_stock_data; //所有基金经理的股票
        var position_user_stock = []; //各个基金经理自己名下的股票
        var _this = this;
        var position_acc_1 = 0,
            position_acc_2 = 0,
            position_acc_3 = 0,
            position_acc_4 = 0,
            position_acc_5 = 0;
        $.each(stock_arr, function (key, val) {
          if (userId == key) {
            position_user_stock = val.stocks;
            _this.stock_total = val.stocks;
          }
        });
        position_user_stock.forEach(function (e) {
          if (e.position_acc_1 <= 0) {
            position_acc_1 += 1;
          }
          if (e.position_acc_2 <= 0) {
            position_acc_2 += 1;
          }
          if (e.position_acc_3 <= 0) {
            position_acc_3 += 1;
          }
          if (e.position_acc_4 <= 0) {
            position_acc_4 += 1;
          }
          if (e.position_acc_5 <= 0) {
            position_acc_5 += 1;
          }
        });

        if (1 == item) {
          return position_acc_1;
        } else if (2 == item) {
          return position_acc_2;
        } else if (3 == item) {
          return position_acc_3;
        } else if (4 == item) {
          return position_acc_4;
        } else if (5 == item) {
          return position_acc_5;
        }
      },
      togglePositionUserDisplay: function togglePositionUserDisplay() {
        this.user_stock_display = !this.user_stock_display;
      }
    }
  });

  Vue.component('report-position-securities', {
    props: ['moving', 'position_stock_data', 'managerItem', 'is_starter', 'position_user_display_detail', 'select_id', 'positionDataShowSort', 'user_id'],
    template: '\n      <div>\n        <table class="journel-sheet-grid" v-if="position_data_display.length>0">\n          <draggable :list="positionDataShowSort.display_rules" element="tr" :options="dragOptions" :move="onMove" @end="onEnd">\n            <th v-bind:class="rule.class" v-for="rule in positionDataShowSort.display_rules" v-if="(1 == select_id && rule.positionModel) || (0 == select_id)" :class="styleType(select_id,rule)" v-bind:style="rule.style">\n              <span>{{rule.label}}</span>\n              <a class="icon-sortBy" @click="positionSort(rule.id)" v-if="rule.label != \'\u5907\u6CE8\'">\n                <i class="icon-asc" :class="{active: (positionDataShowSort.order_by == rule.id && positionDataShowSort.order == \'asc\')}"></i>\n                <i class="icon-desc" :class="{active: (positionDataShowSort.order_by == rule.id && positionDataShowSort.order == \'desc\')}"></i>\n              </a>\n              <prompt-language v-if="\'position_placards\' == rule.id" :language_val="\'\u4E3E\u724C\u5DEE\u503C\uFF1D5%\u603B\u80A1\u672C\uFF0D\u6301\u4ED3\u6570\u91CF\'" style="width: 15px;display: inline-block;left: 0;"></prompt-language>\n            </th>\n            <th v-if="true == is_starter" style="width:10%;"></th>\n          </draggable>\n          <tbody>\n            <tr v-for="sub_value in position_data_display">\n              <td v-for="rule in positionDataShowSort.display_rules" v-bind:class="rule.class" v-if="(1 == select_id && rule.positionModel) || (0 == select_id)"  :class="styleType(select_id,rule)" v-bind:style="rule.style">\n                <vue-remark-modify  v-if="\'remark\' == rule.id" :remark_name="\'msg\'" :remark="sub_value.remark" :ajax_url="getPositionRemarksUrl()" :ajax_data="{stock_code:sub_value.stock_code_full_name,target_id:user_id}"></vue-remark-modify>\n                <span v-else>{{displayValue(sub_value, rule)}}</span>\n              </td>\n              <td  v-if="true == is_starter" style="width:10%;" class="leftRightPadding"><button style="margin-right:20px;" :class="{\'add_follow\':0 ==sub_value.is_star,\'cancel_follow\':1 ==sub_value.is_star}" v-text="follow_text(sub_value.is_star)" @click="followFn(sub_value.stock_code_full_name,user_id,sub_value.is_star)"></button></td>\n            </tr>\n          </tbody>\n        </table>\n        <div v-if="0 == position_data_display.length" class="journel-sheet-content__no-detail">\n          <span>\u8BE5\u65F6\u6BB5\u6682\u65E0\u5339\u914D\u8BB0\u5F55</span>\n        </div>\n      </div>\n    ',
    data: function data() {
      return {};
    },
    computed: {
      // 可拖动插件的入参
      dragOptions: function dragOptions() {
        return {
          animation: 0,
          // group: 'description',
          // disabled: !this.editable,
          ghostClass: 'ghost'
        };
      },
      // 显示数据准备
      position_data_display: function position_data_display() {
        var _this = this;
        var rtn = [];
        var userId = this.managerItem.id;
        var stock_arr = this.position_stock_data; //所有基金经理的股票
        var position_user_stock = []; //各个基金经理自己名下的股票
        $.each(stock_arr, function (key, value) {
          if (userId == key) {
            position_user_stock = value.stocks;
          }
        });
        position_user_stock.forEach(function (e) {
          var obj = {};
          //证券名称
          obj.stock_name = e.stock_name;
          //持仓数量
          obj.hold_volume = e.hold_volume;
          //持仓市值
          obj.market_value = e.market_value;
          //证券代码
          var stockCode = ('' + e.stock_code).split(/\..*/);
          obj.stock_code = stockCode[0];

          obj.stock_code_full_name = e.stock_code;
          obj.position_acc = e.position_acc;
          obj.position_acc_1 = e.position_acc_1;
          obj.position_acc_2 = e.position_acc_2;
          obj.position_acc_3 = e.position_acc_3;
          obj.position_acc_4 = e.position_acc_4;
          obj.position_acc_5 = e.position_acc_5;
          obj.is_star = e.is_star;
          //总股本量
          obj.total_share_capital = e.total_share_capital;
          //占总股本
          obj.proportion_capital = e.proportion_capital;
          //5%总股本
          obj.position_capital_5 = e.position_capital_5;
          //备注
          obj.remark = e.remark;
          //举牌差值
          obj.position_placards = obj.position_acc_5;
          rtn.push(obj);
        });

        // 步骤2，根据排序逻辑进行排序
        rtn = VUECOMPONENT.sort(rtn, _this.positionDataShowSort.order, _this.positionDataShowSort.order_by);
        return rtn;
      }
    },
    methods: {
      styleType: function styleType(select_id, rule) {
        if (1 == select_id && 1 == rule.positionModel) {
          if ('stock_name' == rule.id) {
            return 'width_30';
          }
          if ('proportion_capital' == rule.id) {
            return 'width_30_right';
          }
          if ('remark' == rule.id) {
            return 'width_30_left';
          }
        } else {
          return rule.class;
        }
      },
      getPositionRemarksUrl: function getPositionRemarksUrl() {
        return '/bms-pub/report/stats/set_stock_position_remark';
      },
      follow_text: function follow_text(is_star) {
        if (1 == parseFloat(is_star)) {
          return '取消关注';
        } else {
          return '添加关注';
        }
      },
      followFn: function followFn(stock_code, target_id, is_star) {
        var _this3 = this;

        var _this = this;
        var _is_val = void 0;
        if (0 == is_star) {
          _is_val = 1;
        } else {
          _is_val = 0;
        }
        var stock_arr = [target_id + '-' + stock_code];
        $.ajax({
          url: '/bms-pub/report/stats/set_stock_position_star',
          type: 'POST',
          data: {
            target_id: stock_arr,
            val: _is_val
          },
          success: function success(_ref13) {
            var code = _ref13.code,
                msg = _ref13.msg,
                data = _ref13.data;

            if (0 == code) {
              //刷新页面,方便组件重复利用
              if ("[object Function]" == Object.prototype.toString.call(_this3.$root.positionDoRefresh)) {
                _this3.$root.positionDoRefresh(true);
              }
            }
          },
          error: function error(_ref14) {
            var code = _ref14.code,
                msg = _ref14.msg,
                data = _ref14.data;
          }
        });
      },
      positionSort: function positionSort(id) {
        if (id == this.positionDataShowSort.order_by) {
          if ('asc' == this.positionDataShowSort.order) {
            this.positionDataShowSort.order = 'desc';
          } else if ('desc' == this.positionDataShowSort.order) {
            this.positionDataShowSort.order = '';
          } else {
            this.positionDataShowSort.order = 'asc';
          }
        } else {
          this.positionDataShowSort.order_by = id;
          this.positionDataShowSort.order = 'asc';
        }
        // 用户切换排序命令，需要保存新的排序
        var obj = {};
        obj.field_sort = this.positionDataShowSort.display_rules.map(function (e) {
          return e.id;
        });
        obj.order_by = this.positionDataShowSort.order_by;
        obj.order = this.positionDataShowSort.order;
        common_storage.setItem('report_position__grid_order', obj);
      },
      displayValue: function displayValue(sub_value, rule) {
        var value = sub_value[rule.id];
        if (rule.format != '' && rule.format instanceof Array && this[rule.format[0]] instanceof Function) {
          // value = this[rule.format].call(this, value, )
          var args = [value].concat(rule.format.slice(1));
          value = this[rule.format[0]].apply(this, args);
        }
        if (rule.unit) {
          //针对浮盈率和权重
          if ('--' == value) {
            return value;
          } else {
            return value + rule.unit;
          }
        } else {
          return value;
        }
      },
      onMove: function onMove(_ref15) {
        var relatedContext = _ref15.relatedContext,
            draggedContext = _ref15.draggedContext;

        if ('备注' == draggedContext.element.label) {
          return false;
        }
        //目前暂时先把拖动去掉
        return false;

        var relatedElement = relatedContext.element;
        var draggedElement = draggedContext.element;
        return (!relatedElement || !relatedElement.fixed) && !draggedElement.fixed;
      },
      onEnd: function onEnd() {
        // 用户切换排序命令，需要保存新的排序
        var obj = {};
        obj.field_sort = this.positionDataShowSort.display_rules.map(function (e) {
          return e.id;
        });

        obj.order_by = this.positionDataShowSort.order_by;
        obj.order = this.positionDataShowSort.order;
        common_storage.setItem('report_position__grid_order', obj);
      },
      togglePositionUserDisplay: function togglePositionUserDisplay() {
        this.position_user_display_detail = !this.position_user_display_detail;
      },
      numeralNumber: function numeralNumber(arg, num) {
        if (undefined != num) {
          var str = '0.';
          for (var i = num - 1; i >= 0; i--) {
            str += '0';
          }
          return numeral(arg).format('0,' + str);
        }
        return numeral(arg).format('0,0.00');
      }
    }
  });

  //持仓报表汇总
  Vue.component('report-position-form', {
    props: ['position_real_name', 'position_stock_data', 'is_starter', 'change_position_users', 'position_data_show_sort', 'position_form_data'],
    template: '\n      <div class="report-position-form">\n        <div class="report-position-form__header">\n          <div class="report-position-form__header__selecte">\n            <vue-selectize-radio-selected :options="modelOptions" :place_holder="\'\u8BF7\u9009\u62E9\u6A21\u5F0F\'" :defaultSelected="\'0\'" :value="select_id" v-on:input="select_id = $event"></vue-selectize-radio-selected>\n          </div>\n          <div class="report-position-form__header__selecte">\n            <vue-multiple_select :options="managerOptions" :flag_check_all="true" :checked_arr="managerSelected" :init_obj="init_manager_obj" v-on:multiple_select="managerSelected = ($event)"></vue-multiple_select>\n          </div>\n          <div class="report-position-form__header__selecte">\n            <vue-selectize-radio-selected :options="totalCapitalOptions" :place_holder="\'\u8BF7\u9009\u62E9\u6301\u4ED3\u91CF\'" :defaultSelected="\'0\'" :value="totalSelected" v-on:input="totalSelected = $event"></vue-selectize-radio-selected>\n          </div>\n          <div class="report-position-form__header__label">\n            <input id="concern" type="checkbox" v-model="concernStock"/><label @click="isConcernStock()">\u53EA\u5C55\u793A\u5173\u6CE8\u80A1\u7968</label>\n          </div>\n\n          <div style="flex-grow: 1;"></div>\n\n          <a @click="positionExpert()" :class="\'custom-grey-btn custom-grey-btn__export\'" style="margin-right:15px;line-height:34px;">\n            <i class="oms-icon oms-icon-export"></i>\u5BFC\u51FA\n          </a>\n          <a @click="positionRefresh()" class="custom-grey-btn custom-grey-btn__refresh" style="line-height:34px;">\n            <i class="oms-icon refresh"></i>\u5237\u65B0\n          </a>\n        </div>\n        <div class="report-position-form__banner">\n          <div class="report-position-form__banner__products">\n            <div class="open-close" @click="position_all_show()">\n              <span class="open-close__icon">\n                <i class="open-close__icon__bgd"></i>\n              </span>\n              <p class="open-close__describle" v-text="position_describle"></p>\n            </div>\n          </div>\n\n          <div style="flex-grow: 1;"></div>\n\n          <button v-if="true == is_starter" class="report-position-form__banner__concern add_concern" @click="add_follow_all(\'1\')">\u5168\u90E8\u6DFB\u52A0\u5173\u6CE8</button>\n          <button v-if="true == is_starter" class="report-position-form__banner__concern cancel_concern" @click="add_follow_all(\'0\')">\u5168\u90E8\u53D6\u6D88\u5173\u6CE8</button>\n        </div>\n        <!-- <draggable :list="change_position_users" :options="dragOptions" @start="startFn" :move="onMove" @end="onEnd"> -->\n          <div class="journel-sheet-content" style="margin-bottom:10px;" v-for="managerItem in change_position_users">\n            <report-position-stock :moving="moving" :is_starter="is_starter" :select_id="select_id" :positionDataShowSort="position_data_show_sort" :position_user_display_detail="position_user_display_detail" :position_show="position_show" :managerItem="managerItem" :position_stock_data="position_stock_data" :totalCapitalOptions="totalCapitalOptions"></report-position-stock>\n          </div>\n        <!-- </draggable> -->\n      </div>\n    ',
    data: function data() {
      return {
        modelOptions: [{ //模式筛选
          value: '0',
          label: '详细数据'
        }, {
          value: '1',
          label: '精简数据'
        }],
        moving: false,
        managerOptions: [], //基金经理筛选
        totalCapitalOptions: [//总股本筛选
        {
          value: '0',
          label: '不限持仓量'
        }, {
          value: '1',
          label: '持仓≥1%总股本股票'
        }, { //总股本筛选
          value: '2',
          label: '持仓≥2%总股本股票'
        }, { //总股本筛选
          value: '3',
          label: '持仓≥3%总股本股票'
        }, { //总股本筛选
          value: '4',
          label: '持仓≥4%总股本股票'
        }, { //总股本筛选
          value: '5',
          label: '持仓≥5%总股本股票'
        }],
        init_capital_obj: {
          allSelected: '不限持仓量',
          noMatchesFound: '未选择任何股本股票',
          placeholder: '请选择股本股票'
        },
        init_manager_obj: {
          allSelected: '全部基金经理',
          noMatchesFound: '未选择任何基金经理',
          placeholder: '请选择基金经理'
        },
        select_id: '', //模式选中id
        managerSelected: '', //基金经理选中id
        totalSelected: '', //持仓占股本
        concernStock: false, //是否关注股票
        position_show: true,
        position_describle: '收起全部产品',
        // componey_stock: [], //公司股票   持仓报表
        position_display_detail: true, //股票收起与展示 公司
        position_user_display_detail: true, //基金经理的股票收起与展示
        componeyUpDate: '' //公司数据更新时间
      };
    },
    computed: {
      // managerOptions: function () {  //下拉框－－基金经理
      //   let userArr = [];
      //   let _this = this;
      //   let real_name = _this.position_real_name;
      //   if (undefined == real_name) {
      //     return userArr;
      //   }
      //   $.each(real_name, (key, val) => {
      //     let obj = {
      //       value: key+'&'+val.real_name,
      //       label: val.real_name,
      //       type: key
      //     }
      //     userArr.push(obj);
      //   })
      //   return userArr;
      // },
      componey_stock: function componey_stock() {
        var commoney_data = this.position_stock_data.total;
        return commoney_data;
      },
      dragOptions: function dragOptions() {
        //拖动的详细设置
        return {
          animation: 150,
          scroll: true,
          scrollSensitivity: 100,
          handle: '.journel-sheet-content__head--move', //拖动句柄选择器
          ghostClass: 'ghost'
        };
      }
    },
    watch: {
      position_real_name: function position_real_name() {
        if (undefined == this.position_real_name) {
          return [];
        }
        // 规避循环刷新的问题，options只需要查到一次就可以了。
        if (this.managerOptions.length > 0) {
          return;
        }
        var userArr = [];
        $.each(this.position_real_name, function (key, val) {
          var obj = {
            value: key + '&' + val.real_name,
            label: val.real_name,
            type: key
          };
          userArr.push(obj);
        });
        this.managerOptions = userArr;
      },
      select_id: function select_id() {
        this.$emit('select_position_id', this.select_id);
      },
      managerSelected: function managerSelected() {
        //获取选中基金产品的id
        this.$emit('change_manager_selected', this.managerSelected);
      },
      totalSelected: function totalSelected() {
        //获取选中基金产品的id
        this.$emit('change_total_selected', this.totalSelected);
      },
      position_show: function position_show() {
        //全部展开与收起
        this.position_display_detail = this.position_show; //公司
        this.position_user_display_detail = this.position_show; //基金经理
      },
      concernStock: function concernStock() {
        // 是否显示全部股票
        this.$emit('change_concern_stock', this.concernStock);
      }
    },
    methods: {
      isConcernStock: function isConcernStock() {
        //是否关注股票
        this.concernStock = !this.concernStock;
      },
      positionExpert: function positionExpert() {
        //导出
        $.startLoading();
        var ManagerSelectedArr = ['total'];
        var _this = this;
        this.managerSelected.forEach(function (e) {
          ManagerSelectedArr.push(e.split('&')[0]);
        });
        //totalSelected持仓比例筛选
        //ManagerSelectedArr选中的基金经理id
        //concernStock  只显示关注股票
        var only_star = 0;
        if (true == this.concernStock) {
          only_star = 1;
        } else {
          only_star = 0;
        }

        var sorted = {};
        sorted.field_sort = this.position_data_show_sort.display_rules.map(function (e) {
          return e.id;
        });
        sorted.order = this.position_data_show_sort.order;
        sorted.order_by = this.position_data_show_sort.order_by;
        var arr = [];
        this.change_position_users.forEach(function (e) {
          var id = '';
          id = e.id;
          arr.push(id);
        });
        sorted.user_id = arr;

        $.ajax({
          //当产品可以拖动的时候导出需要传值
          // url: '/bms-pub/report/stats/get_stock_position?sorted[field_sort]=' +
          //   sorted.field_sort.join(',') + '&sorted[order]=' + sorted.order + '&sorted[order_by]=' + sorted.order_by + '&sorted[user_id]=' + sorted.user_id.join(','),
          url: '/bms-pub/report/stats/get_stock_position?sorted[order]=' + sorted.order + '&sorted[order_by]=' + sorted.order_by,
          type: 'GET',
          data: {
            user_id: ManagerSelectedArr.join(','),
            position_rate: _this.totalSelected,
            is_only_star: only_star,
            is_tiny: _this.select_id,
            is_explode_mode: 1
          },
          success: function success(_ref16) {
            var code = _ref16.code,
                msg = _ref16.msg,
                data = _ref16.data;
            //因为在文件中心不管文件生成与否都会显示，故再次不需要判断0==code
            $.clearLoading();
            $.omsAlert('正为您生成报表，成功后可进入文件中心下载');
          },
          error: function error() {
            $.omsAlert('网络异常，请重试');
          }
        });
      },
      positionRefresh: function positionRefresh() {
        //刷新
        if ($('.refresh-btn').hasClass('loading')) {
          return;
        }

        //刷新页面,方便组件重复利用
        if ("[object Function]" == Object.prototype.toString.call(this.$root.positionDoRefresh)) {
          this.$root.positionDoRefresh(true);
        }

        $('.refresh-btn').addClass('loading');
      },
      position_all_show: function position_all_show() {
        //展开／收起全部产品
        if (true == this.position_show) {
          this.position_show = false;
          this.position_describle = '展开全部产品';
          $(".open-close__icon__bgd").css('transform', 'rotate(180deg)');
        } else {
          this.position_show = true;
          this.position_describle = '收起全部产品';
          $(".open-close__icon__bgd").css('transform', 'rotate(0deg)');
        }
      },
      togglePositionDisplay: function togglePositionDisplay() {
        //是否展示公司股票
        this.position_display_detail = !this.position_display_detail;
      },
      togglePositionUserDisplay: function togglePositionUserDisplay() {
        //基金经理股票是否收缩
        this.position_user_display_detail = !this.position_user_display_detail;
      },
      add_follow_all: function add_follow_all(val) {
        //全部添加关注
        var manager_follow_id = ['total'];
        this.managerOptions.forEach(function (e) {
          manager_follow_id.push(e.type);
        });
        var _this = this;
        var stocks_arr = [];
        $.each(this.position_stock_data, function (key, val) {
          if (val.stocks.length > 0) {
            val.stocks.forEach(function (e) {
              stocks_arr.push(key + '-' + e.stock_code);
            });
          }
        });
        //分批处理
        var temp_arr = [];
        var temp_len = Math.ceil(stocks_arr.length / 200);
        for (var i = 0; i < temp_len; i++) {
          if ((i + 1) * 200 > stocks_arr.length) {
            temp_arr.push(stocks_arr.slice(i * 200, stocks_arr.length));
          } else {
            temp_arr.push(stocks_arr.slice(i * 200, (i + 1) * 200));
          }
        }
        for (var n = 0; n < temp_arr.length; n++) {
          $.ajax({
            url: '/bms-pub/report/stats/set_stock_position_star',
            type: 'POST',
            data: {
              target_id: temp_arr[n],
              val: val
            },
            success: function success(_ref17) {
              var code = _ref17.code,
                  msg = _ref17.msg,
                  data = _ref17.data;

              if (0 == code) {
                //刷新页面,方便组件重复利用
                // if ("[object Function]" == Object.prototype.toString.call(this.$root.positionDoRefresh)) {
                //   this.$root.positionDoRefresh(true);
                // }
                _this.$root.positionDoRefresh(true);
              }
            },
            error: function error(_ref18) {
              var code = _ref18.code,
                  msg = _ref18.msg,
                  data = _ref18.data;

              $.omsAlert('网络异常');
            }
          });
        }
      },
      startFn: function startFn() {
        this.moving = true;
      },
      onMove: function onMove(_ref19) {
        var relatedContext = _ref19.relatedContext,
            draggedContext = _ref19.draggedContext;

        return true;
      },
      onEnd: function onEnd(_ref20) {
        var oldIndex = _ref20.oldIndex,
            newIndex = _ref20.newIndex;

        this.moving = false;
        // onEnd函数执行时，this.product_info_arr已经是调整过后的数组。
        // 判断oldIndex与newIndex的大小值，决定是如何修改
        var moveId = '';
        var cursorId = '';
        moveId += this.change_position_users[newIndex].id;

        if (oldIndex == newIndex) {
          return;
        }

        if (oldIndex > newIndex) {
          cursorId += this.change_position_users[newIndex + 1].id;
        } else {
          cursorId += this.change_position_users[newIndex - 1].id;
        }

        // 因为每次修改都会保存，所以当成this.product_info_arr 与 productSortData.field_sort 的差别只是修改内容的差别。如果有this.product_info_arr拥有更多数据的情况，在 field_sort 后面push进去即可。

        var cursorIndex = positionGridSortData.field_sort.indexOf(cursorId);
        if (-1 == cursorIndex) {
          // 当标尺不存在时，列表中删除需要移动的节点，再将其添加到队列头或者尾部
          var moveIndex = positionGridSortData.field_sort.indexOf(moveId);
          if (-1 == moveIndex) {
            if (oldIndex > newIndex) {
              positionGridSortData.field_sort.unshift(cursorId);
              positionGridSortData.field_sort.unshift(moveId);
            } else {
              positionGridSortData.field_sort.push(moveId);
              positionGridSortData.field_sort.push(cursorId);
            }
          } else {
            if (oldIndex > newIndex) {
              positionGridSortData.field_sort.splice(moveIndex, 1);
              positionGridSortData.field_sort.unshift(moveId);
            } else {
              positionGridSortData.field_sort.splice(moveIndex, 1);
              positionGridSortData.field_sort.push(moveId);
            }
          }
        } else {
          var _moveIndex = positionGridSortData.field_sort.indexOf(moveId);
          if (-1 == _moveIndex) {
            // positionDataShowSort.field_sort.splice(moveIndex, 1);
            // 重新计算cursorIndex
            cursorIndex = positionGridSortData.field_sort.indexOf(cursorId);
            if (oldIndex > newIndex) {
              positionGridSortData.field_sort.splice(cursorIndex, 0, moveId);
            } else {
              positionGridSortData.field_sort.splice(cursorIndex + 1, 0, moveId);
            }
          } else {
            positionGridSortData.field_sort.splice(_moveIndex, 1);
            // 重新计算cursorIndex
            cursorIndex = positionGridSortData.field_sort.indexOf(cursorId);
            if (oldIndex > newIndex) {
              positionGridSortData.field_sort.splice(cursorIndex, 0, moveId);
            } else {
              positionGridSortData.field_sort.splice(cursorIndex + 1, 0, moveId);
            }
          }
        }

        var arr = [].concat(positionGridSortData.field_sort);

        this.change_position_users.forEach(function (e) {
          var id = e.id;

          if (arr.indexOf(id) == -1) {
            arr.push(id);
          }
        });
        common_storage.setItem('report_position_group_order', { field_sort: arr });
      },
      componey_stock_volume: function componey_stock_volume(item) {
        //item代表持仓超过item%总股本，item没传值为undefined代表股票之和
        var stock_arr = this.componey_stock; //所有基金经理的股票
        var num = 0;
        stock_arr.forEach(function (e) {
          if (parseFloat(e.position_acc_ + item) <= 0) {
            num++;
          }
        });
        if (undefined == item) {
          num = stock_arr.length;
        }
        return num;
      },
      componeyDate: function componeyDate() {
        var upDate = this.componey_stock[0].updated_time; // 数据更新时间
        //时间处理
        var dataTime = new Date(upDate * 1000);
        var hour = dataTime.getHours() < 10 ? '0' + dataTime.getHours() : dataTime.getHours();
        var minutes = dataTime.getMinutes() < 10 ? '0' + dataTime.getMinutes() : dataTime.getMinutes();
        var seconds = dataTime.getSeconds() < 10 ? '0' + dataTime.getSeconds() : dataTime.getSeconds();
        return hour + ':' + minutes + ':' + seconds;
      }
    }
  });

  var ajaxTime = null;

  var report_form = new Vue({
    el: '#report_form',
    data: {
      moving: false,
      // 产品组列表数据
      product_list: [],
      // 查询日期
      current_data: function () {
        return moment().format('YYYY-MM-DD');
      }(),
      // 当前选中产品id
      current_procut_id: [],
      // 当前产品信息
      product_info_arr: [],
      //是否汇总基金  0 不汇总   1  汇总
      pos_total: true,
      //是否查看预期变化  0 否   1  是
      cal_expect: false,
      //是否全部收起/展开
      control_show: true,
      //是否隐藏已结束产品
      end_product: "running",
      //根据当前选中的产品id获取备注信息
      current_product_remark: [],
      //获取最新的产品标记
      product_current_sign: [],
      //获取所有的产品的标杆和标记信息
      product_sign_pole_all: [],
      //筛选标记产品
      product_select_sign: '',
      //标记筛选之后的产品数组
      product_sign_arr: [],
      //active 控制显示哪份报表  //此处为分界线   以上的变量是产品报表的，，active以下是持仓列表的
      active: reportActive,
      position_form_data: {}, //持仓报表获取数据
      changeManagerSelected: [], //基金经理选中id
      modelPositionId: '', //模式id
      position_rate: '', //持仓比例筛选
      is_only_star: '', //是否显示全部股票
      change_position_users: [], //选中的基金经理名称，为了排序
      is_starter: true, //是否有关注股票权限
      position_data_show_sort: positionSortData //由于模式不同数据展示不同，故需要一个变量来接收下面的判断
      // product_promise: false, //产品报表权限
      // position_promise: false //持仓报表权限
    },
    computed: {
      dragOptions: function dragOptions() {
        return {
          animation: 150,
          scroll: true,
          scrollSensitivity: 100,
          // group: 'description',
          // disabled: !this.editable,
          handle: '.journel-sheet-content__head--move',
          ghostClass: 'ghost'
        };
      },
      // 虽然没有用到product_promise，但是里面的处理逻辑修改了active和is_starter，所以暂时不能去掉
      product_promise: function product_promise() {
        if (window.LOGIN_INFO.role_permission[GV.permissions['PERMISSION_REPORT_VIEW']]) {
          //产品报表
          // this.product_promise = true;
          this.active = 'product';
        }
        if (window.LOGIN_INFO.role_permission[GV.permissions['PERMISSION_PISITION_REPORT_VIEW']]) {
          //持仓报表
          // this.position_promise = true;
          this.active = 'position';
          if (window.LOGIN_INFO.role_permission[GV.permissions['PERMISSION_CONCERN_STOCK']]) {
            //关注股票
            this.is_starter = true;
          } else {
            this.is_starter = false;
          }
        }
      }
    },
    methods: {
      checkDisplay: function checkDisplay(active) {
        if ('product' == active) {
          return window.LOGIN_INFO.role_permission[GV.permissions['PERMISSION_REPORT_VIEW']];
        }
        if ('position' == active) {
          if (window.LOGIN_INFO.role_permission[GV.permissions['PERMISSION_CONCERN_STOCK']]) {
            //关注股票
            this.is_starter = true;
          } else {
            this.is_starter = false;
          }
          return window.LOGIN_INFO.role_permission[GV.permissions['PERMISSION_PISITION_REPORT_VIEW']];
        }
      },
      reportChange: function reportChange(change) {
        //报表页面切换模式
        if (change) {
          $.startLoading('正在查询');
          this.active = change;
          if ('product' == change) {
            this.doRefresh();
          } else {
            if (window.LOGIN_INFO.role_permission[GV.permissions['PERMISSION_PISITION_REPORT_VIEW']]) {
              //持仓报表
              // this.position_promise = true;
              this.active = 'position';
              if (window.LOGIN_INFO.role_permission[GV.permissions['PERMISSION_CONCERN_STOCK']]) {
                //关注股票
                this.is_starter = true;
              } else {
                this.is_starter = false;
              }
            }
            this.positionDoRefresh();
          }
          $.clearLoading();
        }
      },
      onStart: function onStart() {
        this.moving = true;
      },
      onMove: function onMove(_ref21) {
        var relatedContext = _ref21.relatedContext,
            draggedContext = _ref21.draggedContext;

        var relatedElement = relatedContext.element;
        var draggedElement = draggedContext.element;
        return (!relatedElement || !relatedElement.fixed) && !draggedElement.fixed;
      },
      onEnd: function onEnd(_ref22) {
        var oldIndex = _ref22.oldIndex,
            newIndex = _ref22.newIndex;

        this.moving = false;
        // onEnd函数执行时，this.product_info_arr已经是调整过后的数组。
        // 判断oldIndex与newIndex的大小值，决定是如何修改
        var moveId = '';
        var cursorId = '';
        if (this.product_info_arr[newIndex].type == 1) {
          moveId += 'g';
        } else if (this.product_info_arr[newIndex].type == 2) {
          moveId += 'b';
        } else {
          ;
        }
        moveId += this.product_info_arr[newIndex].id;

        if (oldIndex == newIndex) {
          return;
        }

        if (oldIndex > newIndex) {
          if (this.product_info_arr[newIndex + 1].type == 1) {
            cursorId += 'g';
          } else if (this.product_info_arr[newIndex + 1].type == 2) {
            cursorId += 'b';
          } else {
            ;
          }
          cursorId += this.product_info_arr[newIndex + 1].id;
        } else {
          if (this.product_info_arr[newIndex - 1].type == 1) {
            cursorId += 'g';
          } else if (this.product_info_arr[newIndex - 1].type == 2) {
            cursorId += 'b';
          } else {
            ;
          }
          cursorId += this.product_info_arr[newIndex - 1].id;
        }

        // 因为每次修改都会保存，所以当成this.product_info_arr 与 productSortData.field_sort 的差别只是修改内容的差别。如果有this.product_info_arr拥有更多数据的情况，在 field_sort 后面push进去即可。

        var cursorIndex = productSortData.field_sort.indexOf(cursorId);
        if (-1 == cursorIndex) {
          // 当标尺不存在时，列表中删除需要移动的节点，再将其添加到队列头或者尾部
          var moveIndex = productSortData.field_sort.indexOf(moveId);
          if (-1 == moveIndex) {
            if (oldIndex > newIndex) {
              productSortData.field_sort.unshift(cursorId);
              productSortData.field_sort.unshift(moveId);
            } else {
              productSortData.field_sort.push(moveId);
              productSortData.field_sort.push(cursorId);
            }
          } else {
            if (oldIndex > newIndex) {
              productSortData.field_sort.splice(moveIndex, 1);
              productSortData.field_sort.unshift(moveId);
            } else {
              productSortData.field_sort.splice(moveIndex, 1);
              productSortData.field_sort.push(moveId);
            }
          }
        } else {
          var _moveIndex2 = productSortData.field_sort.indexOf(moveId);
          if (-1 == _moveIndex2) {
            // productSortData.field_sort.splice(moveIndex, 1);
            // 重新计算cursorIndex
            cursorIndex = productSortData.field_sort.indexOf(cursorId);
            if (oldIndex > newIndex) {
              productSortData.field_sort.splice(cursorIndex, 0, moveId);
            } else {
              productSortData.field_sort.splice(cursorIndex + 1, 0, moveId);
            }
          } else {
            productSortData.field_sort.splice(_moveIndex2, 1);
            // 重新计算cursorIndex
            cursorIndex = productSortData.field_sort.indexOf(cursorId);
            if (oldIndex > newIndex) {
              productSortData.field_sort.splice(cursorIndex, 0, moveId);
            } else {
              productSortData.field_sort.splice(cursorIndex + 1, 0, moveId);
            }
          }
        }

        var arr = [].concat(productSortData.field_sort);
        this.product_info_arr.forEach(function (e) {
          var id = '';
          if (e.type == 1) {
            id += 'g'; // group 产品组
          } else if (e.type == 2) {
            id += 'b'; // base 底层账户
          } else {
              ; // 匹配失败，不带前缀
            }

          id += e.id;

          if (arr.indexOf(id) == -1) {
            arr.push(id);
          }
        });

        common_storage.setItem('report_group__group_order', { field_sort: arr });
      },

      //下拉列表中产品标记的信息
      getProductSign: function getProductSign() {
        var _this = this;
        $.ajax({
          url: '/bms-pub/report/get_sign_group', //用户新增加的标记接口
          type: 'GET',
          success: function success(_ref23) {
            var code = _ref23.code,
                msg = _ref23.msg,
                data = _ref23.data;

            if (0 == code) {
              _this.product_current_sign = data;
              _this.product_current_sign.forEach(function (e) {
                if (e.sign_id <= 100) {
                  if (1 == e.sign_id) {
                    e.sign_color = 'sign_normal';
                  } else if (2 == e.sign_id) {
                    e.sign_color = 'sign_red';
                  } else if (3 == e.sign_id) {
                    e.sign_color = 'sign_pink';
                  } else if (4 == e.sign_id) {
                    e.sign_color = 'sign_citrus';
                  } else if (5 == e.sign_id) {
                    e.sign_color = 'sign_orange';
                  } else if (6 == e.sign_id) {
                    e.sign_color = 'sign_yellow';
                  } else if (7 == e.sign_id) {
                    e.sign_color = 'sign_dlackish_green';
                  } else if (8 == e.sign_id) {
                    e.sign_color = 'sign_green';
                  } else if (9 == e.sign_id) {
                    e.sign_color = 'sign_indigo';
                  } else if (10 == e.sign_id) {
                    e.sign_color = 'sign_blue';
                  } else if (11 == e.sign_id) {
                    e.sign_color = 'sign_cyan';
                  } else if (12 == e.sign_id) {
                    e.sign_color = 'sign_purple';
                  } else if (13 == e.sign_id) {
                    e.sign_color = 'sign_brown';
                  } else if (14 == e.sign_id) {
                    e.sign_color = 'sign_gray';
                  } else if (15 == e.sign_id) {
                    e.sign_color = 'sign_black';
                  }
                } else if (e.sign_id > 100) {
                  e.sign_color = 'sign_product_add';
                }
              });
            } else {
              $.omsAlert(msg);
            }
          },
          error: function error(_ref24) {
            var code = _ref24.code,
                msg = _ref24.msg,
                data = _ref24.data;

            $.omsAlert(msg);
          }
        });
      },
      //下拉列表中产品的数据
      getProductList: function getProductList() {
        var _this = this;
        $.ajax({
          //47 报表权限
          url: window.REQUEST_PREFIX + '/user/get_products_by_permissions',
          data: {
            permission_id: 47
          },
          type: 'get',
          success: function success(res) {
            if (0 == res.code) {
              if (res.data != '') {
                res.data.group.forEach(function (e) {
                  e.type = 'group';
                });
                _this.product_list = res.data.group;
                res.data.product.forEach(function (e) {
                  e.type = 'base';
                  _this.product_list.push(e); //获取下拉列表的信息
                });
              }
            }

            $('.refresh-btn').removeClass('loading');
          },
          error: function error() {
            $('.refresh-btn').removeClass('loading');
          }
        });
      },
      product_report_info: function product_report_info(_data, _security_summary, cal_expect, end_product) {
        //通过下拉列表选择的产品获取产品的详细信息
        clearTimeout(ajaxTime);
        var _this = this;
        //产品id 的类型
        var _change_id_type = '';
        //lists下面的id存储数组
        var lists_id = [];
        //base下面的id存储数组
        var product_id = [];
        _this.current_procut_id.forEach(function (i) {
          if ('group' == i.split('&')[1]) {
            lists_id.push(i.split('&')[0]);
          }
          if ('base' == i.split('&')[1]) {
            product_id.push(i.split('&')[0]);
          }
        });

        if (lists_id.length === 0) {
          _change_id_type = 'product_id=' + product_id.join(',');
        }
        if (product_id.length === 0) {
          _change_id_type = 'group_id=' + lists_id.join(',');
        }
        if (lists_id.length > 0 && product_id.length > 0) {
          _change_id_type = 'group_id=' + lists_id.join(',') + '&product_id=' + product_id.join(',');
        }

        // 优化 综合报表 - 产品列表 ajax 请求次数，切换下拉框时，请求次数太多。导致数据不正确。
        ajaxTime = setTimeout(function () {
          $.startLoading('正在查询');
          $.ajax({
            url: '/bms-pub/report/get_product_group_report?' + _change_id_type + '&date=' + _data + '&security_summary=' + _security_summary + '&cal_expect=' + cal_expect + '&end_product=' + end_product,
            type: 'GET',
            success: function success(res) {
              if (0 == res.code) {
                _this.product_info_arr = res.data;
                if (0 == _this.product_info_arr.length) {
                  $(".custom-grey-btn__export").addClass('doBtnExport_bgd');
                } else {
                  $(".custom-grey-btn__export").removeClass('doBtnExport_bgd');
                }
                // 同时获取保存的排序规则。
                common_storage.getItem('report_group__group_order', function (rtn) {
                  if (0 == rtn.code) {
                    productSortData.field_sort = rtn.data.field_sort;

                    for (var i = productSortData.field_sort.length - 1; i >= 0; i--) {
                      for (var j = 0, length = _this.product_info_arr.length; j < length; j++) {
                        var verify_id = '';
                        var cur_info = _this.product_info_arr[j];
                        if (cur_info.type == '1') {
                          verify_id += 'g';
                        }
                        if (cur_info.type == '2') {
                          verify_id += 'b';
                        }
                        verify_id += cur_info.id;
                        if (verify_id == productSortData.field_sort[i]) {
                          var obj = _this.product_info_arr[j];
                          _this.product_info_arr.splice(j, 1);
                          _this.product_info_arr.unshift(obj);
                        }
                      }
                    }
                  } else {
                    // 否则覆盖排序信息
                    var arr = [];
                    _this.product_info_arr.forEach(function (e) {
                      var id = '';
                      if (e.type == 1) {
                        id += 'g'; // group 产品组
                      } else if (e.type == 2) {
                        id += 'b'; // base 底层账户
                      } else {
                          ; // 匹配失败，不带前缀
                        }

                      id += e.id;
                      arr.push(id);
                    });
                    common_storage.setItem('report_group__group_order', { field_sort: arr });
                  }

                  common_storage.getItem('report_group__grid_order', function (rtn) {
                    if (0 == rtn.code) {
                      comGridSortData.order = rtn.data.order;
                      comGridSortData.order_by = rtn.data.order_by;
                      // display_rules 根据保存的field_sort进行排序
                      // rtn.data.field_sort 从尾到头遍历，一旦匹配则unshift添加到display_rules数组前面，且删除原来那个元素。（注意，display_rules长度及元素位置在变化，所以应该从0开始计数）
                      for (var _i = rtn.data.field_sort.length - 1; _i >= 0; _i--) {
                        for (var _j = 0, _length = comGridSortData.display_rules.length; _j < _length; _j++) {
                          if (comGridSortData.display_rules[_j].id == rtn.data.field_sort[_i]) {
                            var _obj = comGridSortData.display_rules[_j];
                            comGridSortData.display_rules.splice(_j, 1);
                            comGridSortData.display_rules.unshift(_obj);
                          }
                        }
                      }
                    }
                  });
                });
              }
              $.clearLoading();
            },
            error: function error() {
              $.clearLoading();
            }
          });

          //下面是为了获取备注信息
          $.ajax({
            url: '/bms-pub/report/remark/get_report_remark?' + _change_id_type,
            type: 'GET',
            success: function success(_ref25) {
              var code = _ref25.code,
                  msg = _ref25.msg,
                  data = _ref25.data;

              if (0 == code) {
                _this.current_product_remark = data;
              }
            }
          });

          //下面是为了获取所有产品的标记标杆信息
          $.ajax({
            url: '/bms-pub/report/get_sign?' + _change_id_type,
            type: 'GET',
            success: function success(_ref26) {
              var code = _ref26.code,
                  msg = _ref26.msg,
                  data = _ref26.data;

              _this.product_sign_pole_all = data;
            }
          });
        }, 100);
      },
      customRefreshAfterModified: function customRefreshAfterModified() {
        this.doRefresh();
      },
      doRefresh: function doRefresh() {
        if (this.current_procut_id.length > 0) {
          var _security_summary, cal_expect, end_product;
          if (this.pos_total == false) {
            _security_summary = 1;
          } else if (this.pos_total == true) {
            _security_summary = 0;
          }

          if (this.cal_expect == false) {
            cal_expect = 0;
          } else if (this.cal_expect == true) {
            cal_expect = 1;
          }

          //是否隐藏已结束产品
          // if (false == this.end_product) {
          //   end_product = '';
          // } else {
          //   end_product = 'running';
          // }

          this.getProductSign();
          this.product_report_info(this.current_data, _security_summary, cal_expect, this.end_product);

          //获取标记筛选下的产品，每次筛选之前首先要清空原有产品
          var sign_product_arr = [];
          var _this4 = this;
          _this4.product_sign_arr = [];
          var all_sign_arr0 = _this4.product_info_arr;
          var atr_sign = _this4.product_sign_pole_all;
          //特殊情况 0
          if (1 == _this4.product_select_sign) {
            _this4.product_sign_pole_all.forEach(function (j, index) {
              if (1 == j.sign_id) {
                atr_sign.splice(index, 1);
              }
            });
            all_sign_arr0.forEach(function (e, index) {
              atr_sign.forEach(function (j) {
                if (parseFloat(e.id) == parseFloat(j.product_id) && parseFloat(e.type) == parseFloat(j.type)) {
                  all_sign_arr0.splice(index, 1);
                }
              });
            });
            _this4.product_sign_arr = all_sign_arr0;
          } else {
            _this4.product_info_arr.forEach(function (e) {
              atr_sign.forEach(function (ele) {
                if (_this4.product_select_sign == ele.sign_id && e.id == ele.product_id && e.type == ele.type) {
                  _this4.product_sign_arr.push(e);
                }
              });
            });
          }
        }
      },
      getPositionData: function getPositionData(position_rate, is_only_star, is_tiny, user_id) {
        //position_rate持仓比例筛选条件,is_only_star关注股票筛选条件,is_tiny展示模式,user_id展示指定基金经理的持仓报表
        var _this = this;
        $.startLoading('正在查询');
        $.ajax({
          url: '/bms-pub/report/stats/get_stock_position?position_rate=' + position_rate + '&is_only_star=' + is_only_star + '&is_tiny=' + is_tiny + '&user_id=' + user_id,
          type: 'GET',
          success: function success(_ref27) {
            var code = _ref27.code,
                msg = _ref27.msg,
                data = _ref27.data;

            if (0 == code) {
              _this.position_form_data = data;
              if ('' == data.users) {
                _this.change_position_users = [];
              } else {
                _this.change_position_users = [{ 'id': 'total', 'name': '公司' }];
              }

              $.each(data.reports, function (key, val) {
                $.each(data.users, function (key1, val1) {
                  if (key == key1) {
                    var obj = {
                      id: key1,
                      name: val1.real_name
                    };
                    _this.change_position_users.push(obj);
                  }
                });
              });
              //排序
              common_storage.getItem('report_position_group_order', function (rtn) {
                if (0 == rtn.code) {
                  positionGridSortData.field_sort = rtn.data.field_sort;

                  for (var i = positionGridSortData.field_sort.length - 1; i >= 0; i--) {
                    for (var j = 0, length = _this.change_position_users.length; j < length; j++) {
                      var verify_id = '';
                      var cur_info = _this.change_position_users[j].id;
                      verify_id += cur_info;

                      if (verify_id == positionGridSortData.field_sort[i]) {
                        var obj = _this.change_position_users[j];
                        _this.change_position_users.splice(j, 1);
                        _this.change_position_users.unshift(obj);
                      }
                    }
                  }
                } else {
                  // 否则覆盖排序信息
                  var arr = [];
                  var reportData = _this.change_position_users;
                  reportData.forEach(function (e) {
                    var id = e.id;
                    arr.push(id);
                  });

                  common_storage.setItem('report_position_group_order', { field_sort: arr });
                }

                common_storage.getItem('report_position__grid_order', function (rtn) {
                  if (0 == rtn.code) {
                    _this.position_data_show_sort.order = rtn.data.order;
                    _this.position_data_show_sort.order_by = rtn.data.order_by;
                    // display_rules 根据保存的field_sort进行排序
                    // rtn.data.field_sort 从尾到头遍历，一旦匹配则unshift添加到display_rules数组前面，且删除原来那个元素。（注意，display_rules长度及元素位置在变化，所以应该从0开始计数）
                    for (var _i2 = rtn.data.field_sort.length - 1; _i2 >= 0; _i2--) {
                      for (var _j2 = 0, _length2 = _this.position_data_show_sort.display_rules.length; _j2 < _length2; _j2++) {
                        if (_this.position_data_show_sort.display_rules[_j2].id == rtn.data.field_sort[_i2]) {
                          var _obj2 = _this.position_data_show_sort.display_rules[_j2];
                          _this.position_data_show_sort.display_rules.splice(_j2, 1);
                          _this.position_data_show_sort.display_rules.unshift(_obj2);
                        }
                      }
                    }
                  }
                });
              });
            } else {
              $.omsAlert(msg);
            }

            $.clearLoading();
          },
          error: function error(_ref28) {
            var code = _ref28.code,
                msg = _ref28.msg,
                data = _ref28.data;

            $.omsAlert(msg);
            $.clearLoading();
          }
        });
      },
      positionDoRefresh: function positionDoRefresh() {
        // if ('' == this.position_form_data.users) {
        //   return false;
        // }
        var position_rate = this.position_rate; //持仓比例筛选条件
        var is_only_star = void 0; //是否显示全部股票
        if (false == this.is_only_star) {
          is_only_star = 0;
        } else {
          is_only_star = 1;
        }
        var selectedArr = [];
        this.changeManagerSelected.forEach(function (e) {
          selectedArr.push(e.split('&')[0]);
        });
        var is_tiny = this.modelPositionId; //模式筛选id
        var user_id = selectedArr.join(','); //基金经理
        this.getPositionData(position_rate, is_only_star, is_tiny, user_id);
      }
    },
    watch: {
      //当current_procut_id和current_data改变的时候，里面的函数调用
      current_procut_id: function current_procut_id() {
        this.doRefresh();
      },
      //当日期变化的时候调用该函数
      current_data: function current_data() {
        this.doRefresh();
      },
      //当判断是否汇总证券的时候调用该函数
      pos_total: function pos_total() {
        this.doRefresh();
      },
      //查看预期变化
      cal_expect: function cal_expect() {
        this.doRefresh();
      },
      //是否隐藏已结束产品
      end_product: function end_product() {
        this.doRefresh();
      },
      product_select_sign: function product_select_sign() {
        this.doRefresh();
      },
      is_only_star: function is_only_star() {
        this.positionDoRefresh();
      },
      position_rate: function position_rate() {
        this.positionDoRefresh();
      },
      modelPositionId: function modelPositionId() {
        this.positionDoRefresh();
      },
      changeManagerSelected: function changeManagerSelected() {
        this.positionDoRefresh();
      }
    }
  });

  //获取下拉列表
  if (report_form.checkDisplay('position')) {
    report_form.getPositionData(0, 0, 0, '');
  }
  if (report_form.checkDisplay('product')) {
    report_form.getProductList();
  }
}
//# sourceMappingURL=report_group.js.map
