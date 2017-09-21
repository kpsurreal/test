'use strict';

function _objectDestructuringEmpty(obj) { if (obj == null) throw new TypeError("Cannot destructure undefined"); }

// 场外停牌估值调整js
function suspensionFn() {
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
  };

  var suspension = new Vue({
    el: '#suspension',
    data: {
      active_stock: '',
      display_rules: comGridSortData.display_rules,
      order: comGridSortData.order,
      order_by: comGridSortData.order_by,
      stock_list: []
    },
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
    },
    methods: {
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
        console.log('v: ' + v);
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
      onMove: function onMove(_ref) {
        var relatedContext = _ref.relatedContext,
            draggedContext = _ref.draggedContext;

        var relatedElement = relatedContext.element;
        var draggedElement = draggedContext.element;
        return (!relatedElement || !relatedElement.fixed) && !draggedElement.fixed;
      },
      onEnd: function onEnd(_ref2) {
        // // 用户切换表格排序，需要保存新的排序
        // let obj = {};
        // obj.field_sort = this.display_rules.map(function(e){
        //   return e.id
        // });
        // obj.order_by = this.order_by;
        // obj.order = this.order;
        // common_storage.setItem('report_group__grid_order', obj);

        _objectDestructuringEmpty(_ref2);
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
          success: function success(_ref3) {
            var code = _ref3.code,
                msg = _ref3.msg,
                data = _ref3.data;

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
          success: function success(_ref4) {
            var code = _ref4.code,
                msg = _ref4.msg,
                data = _ref4.data;

            if (0 == code) {
              data.forEach(function (e) {
                e.fund_list = [];
              });
              _this.stock_list = data;

              // 同时获取保存的排序规则
              common_storage.getItem('suspension_page__grid_order', function (_ref5) {
                var code = _ref5.code,
                    msg = _ref5.msg,
                    data = _ref5.data;

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
    }
  });

  suspension.getStockList();
}
//# sourceMappingURL=page.js.map
