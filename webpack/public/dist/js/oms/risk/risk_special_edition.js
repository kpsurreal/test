'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * 风控监控页面 - 专户版
 * Author: liuzeyafzy@gmail.com
 */
//
var permissionArr = {
  'PERMISSION_RISK_HANDLE': 24, //风控监控
  'PERMISSION_PRODUCT_RISK': 26 //风控设置
};
var supportPage = [];
var product_ids = [];
if (window.LOGIN_INFO.permission[permissionArr['PERMISSION_RISK_HANDLE']]) {
  supportPage.push(0);
  product_ids = window.LOGIN_INFO.role_permission[permissionArr['PERMISSION_RISK_HANDLE']];
}
if (window.LOGIN_INFO.permission[permissionArr['PERMISSION_PRODUCT_RISK']]) {
  supportPage.push(1);
  supportPage.push(2);
  product_ids = window.LOGIN_INFO.role_permission[permissionArr['PERMISSION_PRODUCT_RISK']];
}

if (0 == supportPage.length) {
  $.omsAlert('权限异常');
}

var totals = {};
var allStockIdArr = [];
var jc = void 0;
var riskVue;

var common_stockPool = [];
var common_stockPool_v2 = common_stockPool;
var _getStockPool = function _getStockPool(resolve, reject) {
  $.ajax({
    url: '/rms-pub/stock_pool/get_list',
    success: function success(_ref) {
      var code = _ref.code,
          msg = _ref.msg,
          data = _ref.data;

      while (common_stockPool.length > 0) {
        common_stockPool.pop();
      }
      data.forEach(function (e) {
        common_stockPool.push(e);
      });
      if (Object.prototype.toString.call(resolve) == "[object Function]") {
        resolve();
      }
    },
    error: function error() {
      if (Object.prototype.toString.call(reject) == "[object Function]") {
        reject();
      }
    }
  });
};
var promiseGetStockPool = new Promise(function (resolve, reject) {
  // 获取股票池
  _getStockPool(resolve, reject);
});

// 导航组件
Vue.component('risk-nav-li', {
  template: '<li v-bind:class="{active:index==current}" @click="toMe"><slot></slot></li>',
  props: ['index', 'current'],
  data: function data() {
    return {};
  },

  methods: {
    toMe: function toMe() {
      this.$emit('change', this.index);
    }
  }
});

$(window).on('multi_load', function (event) {
  var product_list = event.product_list;
  // var product_ids = event.product_ids;
  var theme = window.LOGIN_INFO.org_info.theme;
  promiseGetStockPool.then(function () {
    riskVue = new Vue({
      el: "#risk",
      data: {
        options_isnull_info: '',
        isShowSet: window.LOGIN_INFO.permission[permissionArr['PERMISSION_PRODUCT_RISK']] ? true : false,
        theme: theme,
        selected_rules: [], //选中的独立风控规则
        union_selected_rules: [], //选中的联合风控规则
        supportPage: supportPage,
        current: supportPage[0] | 0, // 当前导航索引，0，1，2，对应navlist数组索引
        navlist: ['风控监控', '独立风控设置', '联合风控设置'],
        select_all: false,
        totals: {}, // 账户全部风控监控信息在totals之中,其他基于此数据的信息，在computed之中，
        totalsUnion: {},
        displayTotals: {},
        product_change_list: [],
        totalsCopy: JSON.parse(JSON.stringify(totals)),
        checkallstatus: false,
        setdozenarr: [], // 批量设置的product_id
        setsingle: [], // 单个设置时候的product_id
        independentSelected: [], // 依据批量设置或者单个设置来控制,内容为product_id;
        independentSelectedData: {}, //监视independentSelected生产的原始数据
        independentSelectedDataNum: 0, // 默认用户不选择产品进行设置
        isRotate: false, // 刷新时候默认动画class不存在,刷新按钮选择依赖
        inSelectedRisk: [], // [{},{},...,{}],处理得到的每个产品的详细风险数据
        displayUnionRisk: [], //联合风控

        // 产品选中列表
        productSelected: [], //搜索框搜索结果列表
        // 告警类型选中列表
        warnSelected: [],

        // 过滤，产品列表多选框的options
        products: [],
        // 过滤，告警类型列表多选框的options
        warntypes: [{
          value: 1, // risk_type
          label: '禁买股票池风控'
        }, {
          value: 2,
          label: '净值仓位风控'
        }, {
          value: 3,
          label: '个股仓位风控'
        }, {
          value: 4,
          label: '举牌风控'
        }, {
          value: 5,
          label: '对敲风控'
        }],

        multiple_select: [],

        isSlideDown: false, // 继续选择与否
        stockPool: common_stockPool

        // // 修改的规则
        // curEditRule
      },
      beforeMount: function beforeMount() {
        var that = this;
        that.products = [];
        Object.keys(this.totals).forEach(function (e, index) {
          that.products.push({
            value: e,
            label: that.totals[e]['product_name']
          });
        });
      },

      watch: {
        independentSelected: function independentSelected(newArr, oldArr) {
          var _this2 = this;

          // 重置已经选择的产品是否选择，然后再根据目前的arr来添加
          Object.keys(this.totals).forEach(function (e) {
            _this2.totals[e]['checked'] = false;
          });
          newArr.forEach(function (k) {
            if (_this2.totals[k]) {
              _this2.totals[k]['checked'] = true;
            }
          });

          this.inSelectedRisk = [];
          newArr.forEach(function (e) {
            var ruleDetailsArr = _this2.displayRuleDetails(_this2.totals[e].risks, {
              product_name: _this2.totals[e].product_name,
              product_id: _this2.totals[e].product_id
            });
            _this2.inSelectedRisk = _this2.inSelectedRisk.concat(ruleDetailsArr);
          });
        },
        productSelected: function productSelected() {
          this.prepareDisplay();
        },
        warnSelected: function warnSelected() {
          this.prepareDisplay();
        }
      },
      methods: {
        doSaveTpl: function doSaveTpl() {
          // console.log(Vue.independentSelected);
          var product_id = this.independentSelected[0];
          $.startLoading('正在保存...');
          $.ajax({
            url: '/rms-pub/rule/save_tpl',
            type: 'post',
            data: {
              product_id: product_id
            },
            success: function success(_ref2) {
              var code = _ref2.code,
                  msg = _ref2.msg,
                  data = _ref2.data;

              $.clearLoading();
              if (0 == code) {
                $.omsAlert('保存成功');
              } else {
                $.omsAlert(msg);
              }
            },
            error: function error() {
              $.clearLoading();
            }
          });
        },
        getInSelectedRisk: function getInSelectedRisk() {
          var rtn = this.inSelectedRisk.filter(function (e) {
            return 1 == e.risk_type || 2 == e.risk_type || 3 == e.risk_type || 4 == e.risk_type || 5 == e.risk_type;
          });
          return rtn;
        },
        multiDeleteRule: function multiDeleteRule() {
          //不论是独立风控还是联合风控只要没有选择风控规则就给出提示
          if (1 == this.current && 0 == this.selected_rules.length || 2 == this.current && 0 == this.union_selected_rules.length) {
            $.omsAlert('请选择风控规则');
            return false;
          }

          var trStr = '';
          var ruleIdArr = [];
          var change_select = [];
          if (1 == this.current) {
            //独立风控规则
            change_select = this.selected_rules;
          } else if (2 == this.current) {
            //联合风控规则
            change_select = this.union_selected_rules;
          }
          change_select.forEach(function (e) {
            ruleIdArr.push(e.rule_id);
            trStr += '\n              <tr>\n                <td style="padding-left: 50px; width: 110px;"><span class="content__product__name">' + e.product_name + '</span></td>\n                <td style="padding-left: 20px; width: 110px;">' + GetNameByRiskType(e.risk_type) + '</td>\n                <td>' + GetPreVal(e.risk_type, e.pre_val) + GetLimitVal(e.risk_type, e.limit_val) + GetLimitAction(e.risk_type, e.limit_action) + '</td>\n              </tr>';
          });

          var that = this;
          var _this = this;
          // GetNameByRiskType(type)
          var html = '\n            <table>\n              <thead>\n                <tr>\n                  <td style="padding-left: 50px; width: 110px;">\u4EA7\u54C1</td>\n                  <td style="padding-left: 20px; width: 110px;">\u98CE\u63A7\u7C7B\u522B</td>\n                  <td>\u98CE\u63A7\u89C4\u5219</td>\n                </tr>\n              </thead>\n              <tbody>' + trStr + '</tbody>\n            </table>\n          ';

          $.confirm({
            title: '删除确认',
            content: html,
            closeIcon: true,
            confirmButton: '确认',
            cancelButton: false,
            confirm: function confirm() {
              $.startLoading('正在删除...');
              $.ajax({
                url: '/rms-pub/rule/delete',
                type: 'post',
                data: {
                  id: ruleIdArr.join(',')
                },
                success: function success(_ref3) {
                  var code = _ref3.code,
                      msg = _ref3.msg,
                      data = _ref3.data;

                  $.clearLoading();
                  _this.selected_rules = [];
                  _this.union_selected_rules = [];
                  riskVue.getList();
                  riskVue.getListCo();
                  $.omsAlert('删除成功');
                },
                error: function error() {
                  $.clearLoading();
                }
              });
            }
          });
        },

        multi_delete: function multi_delete() {
          var arr = this.multi_delete;
          if (0 == arr.length) {
            $.omsAlert('请选择风控');
            return;
          }
        },
        selectProduct: function selectProduct(id) {
          Vue.set(this.independentSelected, 0, id);
          // this.independentSelected[0] = id;
        },
        checkPermission: function checkPermission(id) {
          if (this.supportPage.some(function (e) {
            return e == id;
          })) {
            return true;
          } else {
            return false;
          }
        },
        displayRuleDetails: function displayRuleDetails(risks, inObj) {
          var _this = this;
          var arr = [];
          Object.keys(risks).forEach(function (e, i) {
            risks[e].forEach(function (el) {
              // if (1 == el.status) {
              arr.push(el);
              // }
            });
          });

          var ruleDetailArr = [];

          arr.forEach(function (e) {
            var pre_val_arr = [];
            var limit_val_arr = [];
            var limit_action_arr = [];

            displayRules.forEach(function (el) {
              // 找到匹配的风控出来
              // 接口处的是risk_type，而前端页面自定义的是type
              if (e.risk_type == el.type) {
                // 准备pre_val，limit_val、limit_action
                el.pre_val.forEach(function (pre) {
                  var obj = {};
                  obj.name = pre.name;
                  if ('select' == pre.type) {
                    common_stockPool.forEach(function (stockPool) {
                      if (e.pre_val[0] == stockPool.id) {
                        obj.value = stockPool.pool_name;
                      }
                    });
                  } else if ('input' == pre.type) {
                    obj.value = pre.operator + e.pre_val[0] + pre.unit;
                  } else if ('select2' == pre.type) {
                    var str = '';
                    pre.options.forEach(function (option) {
                      if (e.pre_val[0] == option.value) {
                        str = option.label;
                      }
                    });
                    obj.value = str;
                  }

                  pre_val_arr.push(obj);
                });

                el.limit_val.forEach(function (limit) {
                  var obj = {};
                  obj.name = limit.name;
                  if ('select' == limit.type) {
                    common_stockPool.forEach(function (stockPool) {
                      if (e.limit_val[0] == stockPool.id) {
                        obj.value = stockPool.pool_name;
                      }
                    });
                  } else if ('input' == limit.type) {
                    obj.value = limit.operator + e.limit_val[0] + limit.unit;
                  }

                  limit_val_arr.push(obj);
                });

                var obj = {};
                obj.name = el.limit_actionInfo.name;
                el.limit_action.forEach(function (action) {
                  if (e.limit_action == action.type) {
                    obj.value = action.name;
                  }
                });
                limit_action_arr.push(obj);
              }
            });

            // 这里千万记得第一个参数是空对象，因为assign会修改第一个参数，导致所有的都是同一份数据。
            var tmpObj = Object.assign({}, inObj, {
              risk_type: e.risk_type,
              rule_id: e.rule_id,
              pre_val: e.pre_val,
              limit_val: e.limit_val,
              limit_action: e.limit_action,

              pre_val_arr: pre_val_arr,
              limit_val_arr: limit_val_arr,
              limit_action_arr: limit_action_arr
            });

            ruleDetailArr.push(tmpObj);
          });

          return ruleDetailArr;
          // console.log(ruleDetailArr);
        },

        getListCo: function getListCo() {
          var _this = this;
          $.ajax({
            url: '/rms-pub/rule/get_list_co',
            success: function success(_ref4) {
              var code = _ref4.code,
                  msg = _ref4.msg,
                  data = _ref4.data;

              if (0 == code) {
                _this.totalsUnion = data;

                _this.displayUnionRisk = [];

                var ruleDetailsArr = _this.displayRuleDetails(_this.totalsUnion, {
                  product_name: '所有产品',
                  product_id: '-1'
                });
                _this.displayUnionRisk = _this.displayUnionRisk.concat(ruleDetailsArr);

                // _this.prepareUnionDisplay();
              } else {
                $.omsAlert(msg);
              }
            },
            error: function error(e) {
              $.omsAlert('网络异常');
            }
          });
        },
        getList: function getList() {
          var _this = this;
          this.isRotate = true;
          if (product_ids.length <= 0) {
            // 没有 ID 的情况下，去修改 options_isnull_info
            this.options_isnull_info = '没有策略可选，请联系管理员';
            return;
          }
          $.ajax({
            url: '/rms-pub/rule/get_risk',
            data: {
              product_id: product_ids.join(',')
            },
            success: function success(_ref5) {
              var code = _ref5.code,
                  msg = _ref5.msg,
                  data = _ref5.data;

              if (0 == code) {
                _this.totals = data;

                _this.products = [];
                Object.keys(_this.totals).forEach(function (e, index) {
                  _this.products.push({
                    value: e,
                    label: _this.totals[e]['product_name']
                  });
                });

                _this.prepareDisplay();
              } else {
                $.omsAlert(msg);
              }
              _this.isRotate = false;
            },
            error: function error(e) {
              $.omsAlert('网络异常');
              _this.isRotate = false;
            }
          });
        },
        prepareDisplay: function prepareDisplay() {
          var _this3 = this;

          // displayTotals productSelected warnSelected
          var rtn = {};
          Object.keys(this.totals).forEach(function (e) {
            var someFlag = _this3.warnSelected.some(function (el) {
              var tmpFlag = false;
              Object.keys(_this3.totals[e].risks).forEach(function (ele) {
                if (_this3.totals[e].risks[ele].some(function (element) {
                  if (1 == element.status) {
                    return element.risk_type == el;
                  }
                })) {
                  tmpFlag = true;
                }
              });
              return tmpFlag;
              // return el == this.totals[e].
            });

            if (_this3.productSelected.some(function (el) {
              return el == e;
            }) && (someFlag || _this3.warnSelected.length == _this3.warntypes.length)) {
              rtn[e] = _this3.totals[e];
            }
          });

          this.displayTotals = rtn;
          this.independentSelected = JSON.parse(JSON.stringify(this.independentSelected));
          //新添加产品排序 放在数组 product_change_list中
          var arr = []; //触警的产品
          var arr1 = []; //所有产品
          var _this = this;
          for (var value in rtn) {
            rtn[value].flag = 0;
            rtn[value].icon_status = 0; //区分产品左上角的标签 1是触警产品 0是正常产品
            Object.keys(rtn[value].risks).forEach(function (e, i) {
              rtn[value].risks[e].forEach(function (el) {
                if (1 == el.status) {
                  rtn[value].flag += 1; //设置一个参数方便后面进行排序
                  rtn[value].icon_status = 1; //区分产品左上角的标签 1是触警产品
                }
              });
            });
            arr.push(rtn[value]); //先获取到所有的产品
          }

          arr.sort(function (a, b) {
            //给产品进行排序,触警的产品在前面
            return b.flag - a.flag;
          });

          this.product_change_list = arr; //排序之后的产品
        },
        changeNav: function changeNav(v) {
          // 导航栏切换
          this.current = v;
        },
        checkall: function checkall() {
          // 全选
          this.checkallstatus = !this.checkallstatus;
        },
        setdozenfn: function setdozenfn(ischeck, product_id) {
          // 只保存选中的产品的product_id
          if (ischeck) {
            // add
            this.setdozenarr.push(product_id);
          } else {
            //del
            for (var i = this.setdozenarr.length - 1; i >= 0; i--) {
              if (this.setdozenarr[i] == product_id) {
                this.setdozenarr.splice(i, 1);
              }
            }
          }
        },
        setdozengo: function setdozengo() {
          // 将选中的product_id 数组传递独立风险控制,并且tabq切换
          if (this.setdozenarr.length < 1) {
            $.omsAlert('请先勾选产品');
            return;
          }
          this.independentSelected = JSON.parse(JSON.stringify(this.setdozenarr));
          this.changeNav(1);
        },
        setsinglefn: function setsinglefn(product_id) {
          this.setsingle = [];
          this.setsingle.push(product_id);
          this.independentSelected = JSON.parse(JSON.stringify(this.setsingle));
          this.changeNav(1);
        },
        refresh: function refresh() {
          // 风控监控页面刷新
          this.getList();

          // this.isRotate = true;
          // let that = this;
          // // 这里用定时器来模拟ajax异步操作,更新totals,以及其副本即可
          // setTimeout(function(){
          //   that.totals = totals;
          //   that.totalsCopy = JSON.parse(JSON.stringify(totals))
          //   that.isRotate = false;
          // },1000)
        },
        productPreviewSilde: function productPreviewSilde() {
          // 风控设置收起与展开
          this.isSlideDown = !this.isSlideDown;
          // console.log("clicked more",this.isSlideDown)
        },
        productPreviewEnsure: function productPreviewEnsure() {
          // 独立风控设置  确定选择产品
          this.isSlideDown = !this.isSlideDown;
          var that = this;

          Object.keys(that.totals).forEach(function (e) {
            that.totals[e]['checked'] = false;
          });
          that.independentSelected.forEach(function (k) {
            that.totals[k]['checked'] = true;
          });

          // // 下面会进行具体数据操作，那么需要保障所操纵的数据是最新的，用ajax重新刷新totals
          // this.$nextTick(function(){
          //   // that.totals = totals;
          //   // 因数据刷新没有绑定选择的状态，需要在此处添加
          //   Object.keys(that.totals).forEach((e)=>{
          //     that.totals[e]['checked'] = false;
          //   })
          //   that.independentSelected.forEach(k=>{
          //     that.totals[k]['checked'] = true;
          //   })
          // });
        },

        // 独立风控设置 取消产品选择
        // 有一个bug，取消之后，this.independentSelected依旧是被修改的状态，不会恢复
        productPreviewCancel: function productPreviewCancel() {
          this.isSlideDown = !this.isSlideDown;
        },

        // 修改选中的产品
        changeindependentSelectedData: function changeindependentSelectedData(product_id) {
          if (this.independentSelected.indexOf(product_id) < 0) {
            this.independentSelected.push(product_id);
          } else {
            var index = this.independentSelected.indexOf(product_id);
            if (index >= 0) {
              this.independentSelected.splice(index, 1);
              // console.log(product_id,JSON.parse(JSON.stringify(this.independentSelected)))
            }
          }
        }
      }
    });

    riskVue.getList();
    riskVue.getListCo();
  });
});

/**
* 修改、添加列表时候显示不同的内容,自定义准备数据
*/
var displayRules = [{
  name: '禁买股票池风控',
  display: true,
  num: 0,
  type: 1,
  pre_val: [{
    name: '证券属于',
    type: 'select',
    value: '-1',
    required: true,
    placeHolder: '请选择股票池',
    addition: [{
      text: '自定义股票池',
      action: 'addCustomStockPool'
    }]
  }],
  limit_val: [], // 无限制条件
  hideAction: true,
  limit_actionInfo: {
    name: '预警操作',
    required: false,
    value: '0',
    placeHolder: '请选择预警类型'
  },
  limit_action: [{
    //   type: 0,
    //   name: '预警提醒'
    // },{
    type: 1,
    name: '禁止'
  }]
}, {
  name: '净值仓位风控',
  display: true,
  num: 0,
  type: 2,
  pre_val: [{
    // 单位净值
    name: '单位净值',
    type: 'input',
    value: '',
    operator: '<', // 运算符，显示在内容前
    placeHolder: '请输入数字',
    unit: '', // 数量单位
    inputReg: /^\d{1,4}\.?\d{0,4}$/,
    reg: '^[1-9]/d*/./d*|0/./d*[1-9]/d*$' // 正则表达式的字符串，使用的时候记得new RegExp()
  }],
  limit_val: [{
    // 最大仓位限制
    name: '仓位',
    type: 'input',
    operator: '>',
    value: '',
    placeHolder: '请输入数字',
    unit: '%',
    inputReg: /^\d{1,4}\.?\d{0,2}$/,
    reg: '/^\d*$/'
  }],
  limit_actionInfo: {
    name: '预警操作',
    required: true,
    value: '0',
    placeHolder: '请选择预警类型'
  },
  limit_action: [{
    type: 0,
    name: '预警提醒'
  }, {
    type: 1,
    name: '禁止'
  }]
}, {
  name: '个股仓位风控',
  display: true,
  num: 0,
  type: 3,
  pre_val: [{
    name: '证券属于',
    type: 'select',
    value: '-1',
    required: true,
    placeHolder: '请选择股票池',
    addition: [{
      text: '自定义股票池',
      action: 'addCustomStockPool'
    }]
  }],
  limit_val: [{
    name: '个股仓位',
    type: 'input',
    value: '',
    operator: '≥',
    placeHolder: '请输入数字',
    unit: '%',
    inputReg: /^\d{1,4}\.?\d{0,2}$/,
    reg: '^[1-9]/d*/./d*|0/./d*[1-9]/d*$'
  }],
  limit_actionInfo: {
    name: '预警操作',
    required: true,
    value: '0',
    placeHolder: '请选择预警类型'
  },
  limit_action: [{
    type: 0,
    name: '预警提醒'
  }, {
    type: 1,
    name: '禁止'
  }]
}, {
  name: '举牌风控',
  display: true,
  num: 0,
  type: 4,
  pre_val: [{
    name: '监控内容',
    type: 'select2',
    value: '-4',
    required: true,
    placeHolder: '请选择监控内容',
    options: [{
      label: '个股持仓数量／总股本',
      value: '-4'
    }]
  }],
  limit_val: [{
    name: '',
    type: 'input',
    value: '',
    operator: '≥',
    placeHolder: '请输入数字',
    unit: '%',
    inputReg: /^\d{1,4}\.?\d{0,2}$/,
    reg: '^[1-9]/d*/./d*|0/./d*[1-9]/d*$'
  }],
  limit_actionInfo: {
    name: '预警操作',
    required: true,
    value: '0',
    placeHolder: '请选择预警类型'
  },
  limit_action: [{
    type: 0,
    name: '预警提醒'
  }, {
    type: 1,
    name: '禁止'
  }]
}, {
  name: '对敲风控',
  display: true,
  num: 0,
  type: 5,
  pre_val: [{
    name: '监控内容',
    type: 'select2',
    value: '-5',
    required: true,
    placeHolder: '请选择监控内容',
    options: [{
      label: '提交委托与未成交委托反向',
      value: '-5'
    }]
  }],
  limit_val: [],
  limit_actionInfo: {
    name: '预警操作',
    required: true,
    value: '0',
    placeHolder: '请选择预警类型'
  },
  limit_action: [{
    type: 0,
    name: '预警提醒'
  }, {
    type: 1,
    name: '禁止'
  }]
}, {
  name: '个股仓位风控',
  display: true,
  num: 0,
  type: 6,
  pre_val: [{
    name: '证券属于',
    type: 'select',
    value: '-1',
    required: true,
    placeHolder: '请选择股票池',
    addition: [{
      text: '自定义股票池',
      action: 'addCustomStockPool'
    }]
  }],
  limit_val: [{
    name: '个股仓位',
    type: 'input',
    value: '',
    operator: '≥',
    placeHolder: '请输入数字',
    unit: '%',
    inputReg: /^\d{1,4}\.?\d{0,2}$/,
    reg: '^[1-9]/d*/./d*|0/./d*[1-9]/d*$'
  }],
  limit_actionInfo: {
    name: '预警操作',
    required: true,
    value: '0',
    placeHolder: '请选择预警类型'
  },
  limit_action: [{
    type: 0,
    name: '预警提醒'
  }, {
    type: 1,
    name: '禁止'
  }]
}, {
  name: '举牌风控',
  display: true,
  num: 0,
  type: 7,
  pre_val: [{
    name: '监控内容',
    type: 'select2',
    value: '-4',
    required: true,
    placeHolder: '请选择监控内容',
    options: [{
      label: '个股持仓数量／总股本',
      value: '-4'
    }]
  }],
  limit_val: [{
    name: '',
    type: 'input',
    value: '',
    operator: '≥',
    placeHolder: '请输入数字',
    unit: '%',
    inputReg: /^\d{1,4}\.?\d{0,2}$/,
    reg: '^[1-9]/d*/./d*|0/./d*[1-9]/d*$'
  }],
  limit_actionInfo: {
    name: '预警操作',
    required: true,
    value: '0',
    placeHolder: '请选择预警类型'
  },
  limit_action: [{
    type: 0,
    name: '预警提醒'
  }, {
    type: 1,
    name: '禁止'
  }]
}, {
  name: '对敲风控',
  display: true,
  num: 0,
  type: 8,
  pre_val: [{
    name: '监控内容',
    type: 'select2',
    value: '-5',
    required: true,
    placeHolder: '请选择监控内容',
    options: [{
      label: '提交委托与未成交委托反向',
      value: '-5'
    }]
  }],
  limit_val: [],
  limit_actionInfo: {
    name: '预警操作',
    required: true,
    value: '0',
    placeHolder: '请选择预警类型'
  },
  limit_action: [{
    type: 0,
    name: '预警提醒'
  }, {
    type: 1,
    name: '禁止'
  }]
}];

// 复制插件
Vue.component('selectize-stock-pool', {
  props: ['options', 'value'],
  template: '\n    <select>\n      <slot></slot>\n    </select>\n  ',
  mounted: function mounted() {
    var vm = this;
    var selectize = $(this.$el).selectize({
      delimiter: ',',
      persist: true,
      placeholder: '请选择股票池',
      valueField: 'id',
      labelField: 'pool_name',
      addPrecedence: true,
      sortField: [],
      render: {
        'option': function option(data, escape) {
          var field_label = this.settings.labelField;
          // 需要做一个判断，因为需要支持用户点击后新增股票池。
          if (!isFinite(data.id)) {
            return '<div class="option" style="border-top: 1px dashed #000;">' + escape(data[field_label]) + '</div>';
          } else {
            return '<div class="option">' + escape(data[field_label]) + '</div>';
          }
        }
      },
      onChange: function onChange(v) {
        // "自定义股票池"被选中时，不修改父组件的值，同时恢复子组件中selectize的值。仅触发父组件函数显示“自定义股票池”
        if (!isFinite(v)) {
          vm.$emit('show_stock_pool', v);
          this.setValue(vm.value);
        } else {
          vm.$emit('input', v);
        }
      }
    })[0].selectize;
    // selectize.clearOptions(true);
    var newOptions = this.options.concat({
      pool_name: '自定义股票池',
      id: Infinity
    });
    // selectize.addOption(this.options);
    selectize.addOption(newOptions);
    selectize.setValue(this.value);
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
      var newOptions = this.options.concat({
        pool_name: '自定义股票池',
        id: Infinity
      });
      // selectize.addOption(this.options);
      selectize.addOption(newOptions);
      selectize.setValue(value);
      selectize = null;
    }
  },

  destroyed: function destroyed() {
    $(this.$el).off().selectize()[0].selectize.destroy();
  }
});

Vue.component('risk-monitoring-row', {
  mixins: [numberMixin, colorMixin],
  props: ['row', 'checkboxall', 'isShowSet'], // row:totols 中的每一行的信息, isShowSet 根据用户权限判断是否出现设置按钮
  template: '\n    <div class="risk-monitoring_row" style="padding-left:0;">\n      <div class="risk-monitor_td_first ellipsis" style="width:12%;text-align:left;">\n        <span v-bind:class="[1 == row.icon_status?\'icon-alert\':\'icon-normal\']" style="top:0;left:0;">\n          <label class="icon-style" v-text="product_type"></label>\n        </span>\n        <input v-if="false" type="checkbox" :checked="ischeck" style="margin-right:5px" @click="checktocheck">\n        <span v-text="row.product_name" :title="row.product_name" style="padding-left:30px;"></span>\n      </div>\n      <div class="risk-monitor_td al risk_ellispis" style="width:7%;text-align:left;padding-left:30px;">\n        {{row.name}}\n      </div>\n      <div class="risk-monitor_td al" style="width:7%;text-align:right;" v-bind:class="rmgColor(row.net_value, 1)">\n        {{numeralNumber(row.net_value, 4)}}\n      </div>\n      <div class="risk-monitor_td ac" style="width:11%;text-align:right;padding-right:50px;">\n        {{numeralPercent(row.position)}}\n      </div>\n      <div class="risk-monitor_td ac" style="width:10%;text-align:right;padding-right:50px;">\n        {{numeralNumber(row.total_assets, 2)}}\n      </div>\n      <div class="risk-monitor_td ac" style="width:7%;text-align:right;">\n        {{risknum}}\n      </div>\n      <div class="risk-monitor_td al" style="width:15%;position:relative;text-align:left;" @mouseover="showtypedetails" @mouseout="showtypedetails" >\n        <div class="risk-monitor_short risk_ellispis" style="padding-left:50px;width:190px;text-overflow:ellipsis;overflow:hidden;">\n          {{risktypes}}\n        </div>\n        <div class="risk-monitor_shadow" v-show="show_risk_type_details" style="left:9%;">\n          {{risktypes_html}}\n        </div>\n      </div>\n      <div class="risk-monitor_td ac" style="width:25%;position:relative;text-align:left;" @mouseover="showdescsdetails" @mouseout="showdescsdetails">\n        <div class="risk-monitor_short risk_ellispis" style="padding-left:20px;">\n          <div v-for="(singleDesc, descIndex) in riskDesc" class="risk_ellispis__single">\n            <span v-if="1 == singleDesc.risk_type">\n              {{(descIndex + 1) + \': \' + singleDesc.stock_id + \' \' + singleDesc.stock_name + \' \u89E6\u53D1\u72EC\u7ACB\u98CE\u63A7\uFF1A\u80A1\u7968\u5C5E\u4E8E\' + singleDesc.pool_name + \' \' + getLimitAction(singleDesc.risk_type, singleDesc.limit_action) }}\n            </span>\n            <span v-if="2 == singleDesc.risk_type">\n              {{(descIndex + 1) + \': \' + \'\u5F53\u524D\u4ED3\u4F4D=\' + numeralPercent(singleDesc.position) + \'\uFF0C\u89E6\u53D1\u72EC\u7ACB\u98CE\u63A7\uFF1A\u51C0\u503C<\' + numeralNumber(singleDesc.net_value_rule, 4) + \' \u4ED3\u4F4D>\' + numeralPercent(singleDesc.factor) + \' \' + getLimitAction(singleDesc.risk_type, singleDesc.limit_action) }}\n            </span>\n            <span v-if="3 == singleDesc.risk_type">\n              {{(descIndex + 1) + \': \' + singleDesc.stock_id + \' \' + singleDesc.stock_name + \' \u4ED3\u4F4D=\' + numeralPercent(singleDesc.position) + \'\uFF0C\u89E6\u53D1\u72EC\u7ACB\u98CE\u63A7\uFF1A\u80A1\u7968\u5C5E\u4E8E\' + singleDesc.pool_name + \' \u4ED3\u4F4D>\' + numeralPercent(singleDesc.factor) + \' \' + getLimitAction(singleDesc.risk_type, singleDesc.limit_action) }}\n            </span>\n            <span v-if="4 == singleDesc.risk_type">\n              {{(descIndex + 1) + \': \' + singleDesc.stock_id + \' \' + singleDesc.stock_name + \' \u4E2A\u80A1\u6301\u4ED3\u6570\u91CF/\u603B\u80A1\u672C=\' + numeralPercent(singleDesc.position) + \'\uFF0C\u89E6\u53D1\u72EC\u7ACB\u98CE\u63A7\uFF1A\u4E2A\u80A1\u6301\u4ED3\u6570\u91CF/\u603B\u80A1\u672C\u2265\' + singleDesc.factor + \' \' + getLimitAction(singleDesc.risk_type, singleDesc.limit_action) }}\n            </span>\n            <span v-if="5 == singleDesc.risk_type">\n              {{(descIndex + 1) + \': \' + singleDesc.stock_id + \' \' + singleDesc.stock_name + \' \u89E6\u53D1\u72EC\u7ACB\u98CE\u63A7\uFF1A\u63D0\u4EA4\u59D4\u6258\u4E0E\u672A\u6210\u4EA4\u59D4\u6258\u53CD\u5411\' + \' \' + getLimitAction(singleDesc.risk_type, singleDesc.limit_action) }}\n            </span>\n            <span v-if="6 == singleDesc.risk_type">\n              {{(descIndex + 1) + \': \' + singleDesc.stock_id + \' \' + singleDesc.stock_name + \' \u4ED3\u4F4D=\' + numeralPercent(singleDesc.position) + \'\uFF0C\u89E6\u53D1\u8054\u5408\u98CE\u63A7\uFF1A\u80A1\u7968\u5C5E\u4E8E\'+ singleDesc.pool_name + \' \u4ED3\u4F4D>\' + numeralPercent(singleDesc.factor) + \' \' + getLimitAction(singleDesc.risk_type, singleDesc.limit_action) }}\n            </span>\n            <span v-if="7 == singleDesc.risk_type">\n              {{(descIndex + 1) + \': \' + singleDesc.stock_id + \' \' + singleDesc.stock_name + \' \u4E2A\u80A1\u6301\u4ED3\u6570\u91CF/\u603B\u80A1\u672C=\' + numeralPercent(singleDesc.position) + \'\uFF0C\u89E6\u53D1\u8054\u5408\u98CE\u63A7\uFF1A\u4E2A\u80A1\u6301\u4ED3\u6570\u91CF/\u603B\u80A1\u672C\u2265\' + singleDesc.factor + \' \' + getLimitAction(singleDesc.risk_type, singleDesc.limit_action) }}\n            </span>\n            <span v-if="8 == singleDesc.risk_type">\n              {{(descIndex + 1) + \': \' + singleDesc.stock_id + \' \' + singleDesc.stock_name + \' \u89E6\u53D1\u8054\u5408\u98CE\u63A7\uFF1A\u63D0\u4EA4\u59D4\u6258\u4E0E\u672A\u6210\u4EA4\u59D4\u6258\u53CD\u5411\' + \' \' + getLimitAction(singleDesc.risk_type, singleDesc.limit_action) }}\n            </span>\n          </div>\n        </div>\n        <!-- \u9F20\u6807\u653E\u5728\u6B64\u5904\u663E\u793A\u63D0\u793A\u4FE1\u606F -->\n        <div class="risk-monitor_shadow al"  v-show="show_risk_descs_details" style="width:82%;">\n\n          <div v-for="(singleDesc, descIndex) in riskDesc">\n            <span v-if="1 == singleDesc.risk_type">\n              {{(descIndex + 1) + \': \' + singleDesc.stock_id + \' \' + singleDesc.stock_name + \' \u89E6\u53D1\u72EC\u7ACB\u98CE\u63A7\uFF1A\u80A1\u7968\u5C5E\u4E8E\' + singleDesc.pool_name + \' \' + getLimitAction(singleDesc.risk_type, singleDesc.limit_action) }}\n            </span>\n            <span v-if="2 == singleDesc.risk_type">\n              {{(descIndex + 1) + \': \' + \'\u5F53\u524D\u4ED3\u4F4D=\' + numeralPercent(singleDesc.position) + \'\uFF0C\u89E6\u53D1\u72EC\u7ACB\u98CE\u63A7\uFF1A\u51C0\u503C<\' + numeralNumber(singleDesc.net_value_rule, 4) + \' \u4ED3\u4F4D>\' + numeralPercent(singleDesc.factor) + \' \' + getLimitAction(singleDesc.risk_type, singleDesc.limit_action) }}\n            </span>\n            <span v-if="3 == singleDesc.risk_type">\n              {{(descIndex + 1) + \': \' + singleDesc.stock_id + \' \' + singleDesc.stock_name + \' \u4ED3\u4F4D=\' + numeralPercent(singleDesc.position) + \'\uFF0C\u89E6\u53D1\u72EC\u7ACB\u98CE\u63A7\uFF1A\u80A1\u7968\u5C5E\u4E8E\' + singleDesc.pool_name + \' \u4ED3\u4F4D>\' + numeralPercent(singleDesc.factor) + \' \' + getLimitAction(singleDesc.risk_type, singleDesc.limit_action) }}\n            </span>\n            <span v-if="4 == singleDesc.risk_type">\n              {{(descIndex + 1) + \': \' + singleDesc.stock_id + \' \' + singleDesc.stock_name + \' \u4E2A\u80A1\u6301\u4ED3\u6570\u91CF/\u603B\u80A1\u672C=\' + numeralPercent(singleDesc.position) + \'\uFF0C\u89E6\u53D1\u72EC\u7ACB\u98CE\u63A7\uFF1A\u4E2A\u80A1\u6301\u4ED3\u6570\u91CF/\u603B\u80A1\u672C\u2265\' + singleDesc.factor + \' \' + getLimitAction(singleDesc.risk_type, singleDesc.limit_action) }}\n            </span>\n            <span v-if="5 == singleDesc.risk_type">\n              {{(descIndex + 1) + \': \' + singleDesc.stock_id + \' \' + singleDesc.stock_name + \' \u89E6\u53D1\u72EC\u7ACB\u98CE\u63A7\uFF1A\u63D0\u4EA4\u59D4\u6258\u4E0E\u672A\u6210\u4EA4\u59D4\u6258\u53CD\u5411\' + \' \' + getLimitAction(singleDesc.risk_type, singleDesc.limit_action) }}\n            </span>\n            <span v-if="6 == singleDesc.risk_type">\n              {{(descIndex + 1) + \': \' + singleDesc.stock_id + \' \' + singleDesc.stock_name + \' \u4ED3\u4F4D=\' + numeralPercent(singleDesc.position) + \'\uFF0C\u89E6\u53D1\u8054\u5408\u98CE\u63A7\uFF1A\u80A1\u7968\u5C5E\u4E8E\'+ singleDesc.pool_name + \' \u4ED3\u4F4D>\' + numeralPercent(singleDesc.factor) + \' \' + getLimitAction(singleDesc.risk_type, singleDesc.limit_action) }}\n            </span>\n            <span v-if="7 == singleDesc.risk_type">\n              {{(descIndex + 1) + \': \' + singleDesc.stock_id + \' \' + singleDesc.stock_name + \' \u4E2A\u80A1\u6301\u4ED3\u6570\u91CF/\u603B\u80A1\u672C=\' + numeralPercent(singleDesc.position) + \'\uFF0C\u89E6\u53D1\u8054\u5408\u98CE\u63A7\uFF1A\u4E2A\u80A1\u6301\u4ED3\u6570\u91CF/\u603B\u80A1\u672C\u2265\' + singleDesc.factor + \' \' + getLimitAction(singleDesc.risk_type, singleDesc.limit_action) }}\n            </span>\n            <span v-if="8 == singleDesc.risk_type">\n              {{(descIndex + 1) + \': \' + singleDesc.stock_id + \' \' + singleDesc.stock_name + \' \u89E6\u53D1\u8054\u5408\u98CE\u63A7\uFF1A\u63D0\u4EA4\u59D4\u6258\u4E0E\u672A\u6210\u4EA4\u59D4\u6258\u53CD\u5411\' + \' \' + getLimitAction(singleDesc.risk_type, singleDesc.limit_action) }}\n            </span>\n          </div>\n\n        </div>\n      </div>\n      <div style="flex: 1;text-align: right;padding-right:20px;">\n        <div v-if="false" class="risk-monitor_td_btn" @click="decrease">\n          <span class="risk-monitor_decrease">\u964D\u4ED3</span>\n        </div>\n        <div v-if="isShowSet" class="risk-monitor_td_btn" @click="set">\n          <span class="risk-monitor_increase">\u8BBE\u7F6E</span>\n        </div>\n      </div>\n    </div>\n  ',
  mounted: function mounted() {
    // console.log(this.row)
  },
  data: function data() {
    return {
      show_risk_type_details: false,
      show_risk_descs_details: false,
      ischeck: false
    };
  },

  watch: {
    checkboxall: function checkboxall(n, o) {
      // 根元素，全选与非全选
      this.ischeck = n;
    },
    ischeck: function ischeck(n, o) {
      this.$emit('setdozen', n, this.row.product_id);
    }
  },
  computed: {
    product_type: function product_type() {
      return 1 == this.row.icon_status ? '触警' : '正常';
    },
    // 风控条数,status == 1 为触发，status == 0 为不触发
    risknum: function risknum() {
      var n = 0;
      var _this = this;

      Object.values(_this.row.risks).forEach(function (e) {
        e.forEach(function (el) {
          // 测试已经与产品确认，这里展示的是配置的风控，而不是触警的风控
          // if (1 == el.status) {
          n++;
          // }
        });
      });

      return n;
    },

    // 触发风险类别，一般字符串
    risktypes: function risktypes() {
      return this.tranformtypes(true);
    },

    // 触发风险类别，弹框形式
    risktypes_html: function risktypes_html() {
      return this.tranformtypes(false);
    },
    riskDetails: function riskDetails() {
      return this.displayRuleDetails();
      // let ruleDetailArr = this.displayRuleDetails();
    },
    riskDetailsV2: function riskDetailsV2() {
      var _this = this;
      var arr = [];
      Object.keys(this.row.risks).forEach(function (e, i) {
        _this.row.risks[e].forEach(function (el) {
          if (1 == el.status) {
            arr.push(el);
          }
        });
      });

      return arr;
    },
    riskDesc: function riskDesc() {
      var _this = this;
      var arr = [];
      Object.values(this.row.desc).forEach(function (e) {
        arr.push(e);
      });
      return arr;
    }
  },
  methods: {
    getLimitAction: function getLimitAction(type, limit_action) {
      // GetLimitAction(type, limit_action);
      if (0 == limit_action) {
        return '预警提醒';
      }
      if (1 == limit_action) {
        return '禁止';
      }
    },
    showtypedetails: function showtypedetails() {
      this.show_risk_type_details = !this.show_risk_type_details;
    },
    showdescsdetails: function showdescsdetails() {
      this.show_risk_descs_details = !this.show_risk_descs_details;
    },

    // 获取已触发风控的风控数组
    getActiveRulesArr: function getActiveRulesArr() {
      var _this = this;
      var arr = [];
      var riskInfo = {
        target: '禁买股票池风控',
        wholePosition: '净值仓位风控',
        onePosition: '个股仓位风控',
        placards: '举牌风控',
        controTrade: '对敲风控',
        onePositionCo: '个股仓位风控',
        placardsCo: '举牌风控',
        controTradeCo: '对敲风控'
      };

      Object.keys(this.row.risks).forEach(function (e, i) {
        if (_this.row.risks[e].some(function (el) {
          return 1 == el.status;
        })) {
          arr.push(riskInfo[e]);
        }
      });

      return arr;
    },

    unique: function unique(arr) {
      var seen = new Map();
      return arr.filter(function (a) {
        return !seen.has(a) && seen.set(a, 1);
      });
    },
    // flag 为true 时显示普通文本，为false显示弹出框文本
    tranformtypes: function tranformtypes(flag) {
      var riskArr = this.getActiveRulesArr();
      riskArr = this.unique(riskArr);
      var str = '';

      if (riskArr.length == 0) {
        str = '- -';
      } else {
        str = riskArr.join('、');
      }

      return str;
    },

    // 给定risks结构，计算出所有的风控
    displayRuleDetails: function displayRuleDetails() {
      var _this = this;
      var arr = [];
      Object.keys(this.row.risks).forEach(function (e, i) {
        _this.row.risks[e].forEach(function (el) {
          if (1 == el.status) {
            arr.push(el);
          }
        });
      });

      var ruleDetailArr = [];

      arr.forEach(function (e) {
        var pre_val_arr = [];
        var limit_val_arr = [];
        var limit_action_arr = [];

        displayRules.forEach(function (el) {
          // 找到匹配的风控出来
          // 接口处的是risk_type，而前端页面自定义的是type
          if (e.risk_type == el.type) {
            // 准备pre_val，limit_val、limit_action
            el.pre_val.forEach(function (pre) {
              var obj = {};
              obj.name = pre.name;
              if ('select' == pre.type) {
                common_stockPool.forEach(function (stockPool) {
                  if (e.pre_val[0] == stockPool.id) {
                    obj.value = stockPool.pool_name;
                  }
                });
              } else if ('input' == pre.type) {
                obj.value = pre.operator + e.pre_val[0] + pre.unit;
              } else if ('select2' == pre.type) {
                var str = '';
                pre.options.forEach(function (option) {
                  if (e.pre_val[0] == option.value) {
                    str = option.label;
                  }
                });
                obj.value = str;
              }

              pre_val_arr.push(obj);
            });

            el.limit_val.forEach(function (limit) {
              var obj = {};
              obj.name = limit.name;
              if ('select' == limit.type) {
                common_stockPool.forEach(function (stockPool) {
                  if (e.limit_val[0] == stockPool.id) {
                    obj.value = stockPool.pool_name;
                  }
                });
              } else if ('input' == limit.type) {
                obj.value = limit.operator + e.limit_val[0] + limit.unit;
              }

              limit_val_arr.push(obj);
            });

            var obj = {};
            obj.name = el.limit_actionInfo.name;
            el.limit_action.forEach(function (action) {
              if (e.limit_action == action.type) {
                obj.value = action.name;
              }
            });
            limit_action_arr.push(obj);
          }
        });

        ruleDetailArr.push({
          risk_type: e.risk_type,
          pre_val: e.pre_val,
          limit_val: e.limit_val,
          limit_action: e.limit_action,
          rule_id: e.rule_id,
          status: e.status,
          pre_val_arr: pre_val_arr,
          limit_val_arr: limit_val_arr,
          limit_action_arr: limit_action_arr
        });
      });

      return ruleDetailArr;
      // console.log(ruleDetailArr);
    },
    checktocheck: function checktocheck() {
      // 选中checkbox,选中自己，发送事件
      this.ischeck = !this.ischeck;
    },
    decrease: function decrease() {// 降仓跳转,跳转到委托管理页面,待完善
      // console.log(this.row.product_id)

    },
    set: function set() {
      // 设置，跳转到独立风控页面，并勾选(只设置单选项)
      this.$emit('setsingle', this.row.product_id);
    }
  }
});

// 页面混合，vue的语法
var reportMixin = {
  // mounted: function(){
  //   // 切换菜单时，会触发mounted事件，
  //   let sortData = '';
  //   common_storage.getItem(this.typeStr, (rtn) => {
  //     if (0 == rtn.code) {
  //       this.order = rtn.data.order;
  //       this.order_by = rtn.data.order_by;
  //       // display_rules 根据保存的field_sort进行排序
  //       // rtn.data.field_sort 从尾到头遍历，一旦匹配则unshift添加到display_rules数组前面，且删除原来那个元素。（注意，display_rules长度及元素位置在变化，所以应该从0开始计数）
  //       for (let i = rtn.data.field_sort.length - 1; i >= 0; i--) {
  //         for (let j = 0, length = this.display_rules.length; j < length; j++) {
  //           if (this.display_rules[j].id == rtn.data.field_sort[i]) {
  //             let obj = this.display_rules[j];
  //             this.display_rules.splice(j, 1);
  //             this.display_rules.unshift(obj);
  //           }
  //         }
  //       }

  //       // // console.log('typeStr: ' + this.typeStr);
  //       // this.$emit('order', {
  //       //   order: this.order,
  //       //   order_by: this.order_by,
  //       //   typeStr: this.typeStr,
  //       //   display_rules: this.display_rules
  //       // });
  //     }

  //     this.$emit('order', {
  //       order: this.order,
  //       order_by: this.order_by,
  //       typeStr: this.typeStr,
  //       display_rules: this.display_rules
  //     });

  //   });

  // },
  computed: {
    // 可拖动插件的入参
    dragOptions: function dragOptions() {
      return {
        animation: 0,
        // group: 'description',
        // disabled: !this.editable,
        ghostClass: 'ghost'
      };
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

      this.$emit('order', { order: this.order,
        order_by: this.order_by,
        typeStr: this.typeStr,
        display_rules: this.display_rules
      });
      common_storage.setItem(this.typeStr, obj);
    },
    onMove: function onMove(_ref6) {
      var relatedContext = _ref6.relatedContext,
          draggedContext = _ref6.draggedContext;

      var relatedElement = relatedContext.element;
      var draggedElement = draggedContext.element;
      return (!relatedElement || !relatedElement.fixed) && !draggedElement.fixed;
    },
    onEnd: function onEnd() {
      // 用户切换表格排序，需要保存新的排序
      var obj = {};
      obj.field_sort = this.display_rules.map(function (e) {
        return e.id;
      });
      obj.order_by = this.order_by;
      obj.order = this.order;
      common_storage.setItem(this.typeStr, obj);
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
    checkPositive: function checkPositive(num) {
      return parseFloat(num) > 0;
    },
    checkNegative: function checkNegative(num) {
      return parseFloat(num) < 0;
    }
  }
};
var riskDetailData = {
  typeStr: 'risk_detail_data',
  order: '',
  order_by: '',
  display_rules: [{
    id: 'product_name',
    label: '产品',
    format: '',
    class: 'left20 width250'
  }, {
    id: 'risk_type_str',
    label: '风控类别',
    showOrder: true,
    format: '',
    class: 'left20 width250'
  }, {
    id: 'risk_rule',
    label: '风控规则',
    format: '',
    class: 'left20'
  }]
};
Vue.component('vue-risk-detail', {
  mixins: [reportMixin],
  props: ['in_selected_risk', 'independent_selected', 'current'], // in_selected_risk是风控数据，independent_selected是选中的产品，independent_selected主要是为了解决列表为空的显示
  template: '\n    <table class="newweb-common-grid">\n      <thead>\n        <tr>\n          <th>\n            <input type="checkbox" v-model="selectAll" @change="chgSelectAll()" />\n          </th>\n          <th v-for="rule in display_rules" v-bind:class="rule.class">\n            <span>{{rule.label}}</span>\n            <a v-if="rule.showOrder" class="icon-sortBy" v-on:click="chgSort(rule.id)">\n              <i class="icon-asc" :class="{active: (order_by == rule.id && order == \'asc\')}"></i>\n              <i class="icon-desc" :class="{active: (order_by == rule.id && order == \'desc\')}"></i>\n            </a>\n          </th>\n          <th></th>\n        </tr>\n      </thead>\n      <tbody v-if="display_data && display_data.length > 0">\n        <template v-for="row in display_data">\n          <tr>\n            <td>\n              <input type="checkbox" v-model="row.web_checked" @change="chgSelectedRules()" />\n            </td>\n            <td v-for="rule in display_rules" v-if="rule.id != \'risk_rule\'" v-bind:class="rule.class" :title="displayValue(row, rule)" style="text-overflow: ellipsis;overflow: hidden;white-space: nowrap;">\n              {{displayValue(row, rule)}}\n            </td>\n            <td v-for="rule in display_rules" v-if="rule.id == \'risk_rule\'" class="left20">\n              <div v-for="pre_val in row.pre_val_arr" style="margin-right: 5px;">\n                <span>{{pre_val.name}}</span>\n                <span style="color: rgb(33, 150, 243)">{{pre_val.value}}</span>\n              </div>\n              <div v-for="limit_val in row.limit_val_arr" style="margin-right: 5px;">\n                <span>{{limit_val.name}}</span>\n                <span style="color: rgb(33, 150, 243)">{{limit_val.value}}</span>\n              </div>\n              <div v-for="limit_action in row.limit_action_arr" style="margin-right: 5px;">\n                <span style="color: rgb(244, 67, 54);">{{limit_action.value}}</span>\n              </div>\n            </td>\n            <td>\n              <a class="details_list_btn_modify" @click="editRule(row, row.rule_id, row.risk_type)">\u4FEE\u6539</a>\n              <a class="details_list_btn_del" @click="deleteRule(row.rule_id, row.risk_type)">\u5220\u9664</a>\n            </td>\n          </tr>\n          <tr v-if="row.rule_id == curEditRule.rule_id" style="height: 84px;">\n            <td colspan="999" style="background: #F7F7F7;">\n              <template v-for="rule in rulesNeedShow" v-if="rule.type == row.risk_type">\n                <!-- Begin\uFF1Apre_val\u6761\u4EF6 -->\n                <template v-for="(val, index) in rule.pre_val">\n                  <label class="rules-label">\n                    <span v-text="val.name"></span>\n                    <template v-if="\'input\' == val.type">\n                      <div class="rules_input" style="display: inline-block;">\n                        <span v-text="val.operator"></span>\n                        <input :placeholder="val.placeHolder" type="text" v-model="curEditRule.pre_val[index]" @keydown="checkKeyDown($event, val.inputReg, curEditRule.pre_val[index]);return false;" />\n                        <span class="rules_input_unit" v-text="val.unit"></span>\n                      </div>\n                    </template>\n                    <template v-if="\'select\' == val.type">\n                      <select :value="val.value" v-model="curEditRule.pre_val[index]">\n                        <option v-if="val.required" disabled="disabled" value="default" v-text="val.placeHolder"></option>\n                        <option v-if="!val.required" value="default" v-text="val.placeHolder"></option>\n                        <option v-for="(v, i) in stockPool" v-text="v.pool_name" :value="v.id"></option>\n                      </select>\n                    </template>\n                    <template v-if="\'select2\' == val.type">\n                      <select style="font-size: 12px;" :value="val.value" v-model="curEditRule.pre_val[index]">\n                        <option v-for="option in val.options" v-text="option.label" :value="option.value"></option>\n                      </select>\n                    </template>\n                  </label>\n                </template>\n                <!-- End\uFF1Apre_val\u6761\u4EF6 -->\n\n                <!-- Begin\uFF1Alimit_val\u6761\u4EF6 -->\n                <template v-for="(val, index) in rule.limit_val">\n                  <label class="rules-label">\n                    <span v-text="val.name"></span>\n                    <template v-if="\'input\' == val.type">\n                      <div class="rules_input" style="display: inline-block;">\n                          <span v-text="val.operator"></span>\n                          <input type="text" :placeholder="val.placeHolder" v-model="curEditRule.limit_val[index]" @keydown="checkKeyDown($event, val.inputReg, curEditRule.limit_val[index]);return false;" />\n                          <span class="rules_input_unit" v-text="val.unit"></span>\n                      </div>\n                    </template>\n                    <template v-if="\'select\' == val.type">\n                      <select :value="val.value" v-model="curEditRule.limit_val[index]">\n                          <option v-if="val.required" disabled="disabled" value="default" v-text="val.placeHolder"></option>\n                          <option v-if="!val.required" value="default" v-text="val.placeHolder"></option>\n                          <option v-for="(v, i) in stockPool" v-text="v.pool_name" :value="v.id"></option>\n                      </select>\n                    </template>\n                  </label>\n                </template>\n                <!-- End\uFF1Alimit_val\u6761\u4EF6 -->\n\n                <!-- Begin\uFF1Alimit_actionInfo\u6761\u4EF6 -->\n                <label v-if="rule.hideAction !== true" class="rules-label">{{rule.limit_actionInfo.name}}\n                  <select :value="rule.limit_actionInfo.value" v-model="curEditRule.limit_action">\n                    <option v-if="rule.limit_actionInfo.required" disabled="disabled" value="default" v-text="rule.limit_actionInfo.placeHolder"></option>\n                    <option v-if="!rule.limit_actionInfo.required" value="default" v-text="rule.limit_actionInfo.placeHolder"></option>\n                    <option v-for="(val, index) in rule.limit_action" v-text="val.name" :value="val.type"></option>\n                  </select>\n                </label>\n                <!-- End\uFF1Alimit_actionInfo\u6761\u4EF6 -->\n\n                <div class="btnDiv" style="float: right;">\n                  <a class="ui-btn btn-save" v-on:click="saveEdit()">\u4FDD\u5B58</a>\n                  <a class="ui-btn btn-cancel" v-on:click="cancelEdit()">\u53D6\u6D88</a>\n                </div>\n              </template>\n            </td>\n          </tr>\n        </template>\n      </tbody>\n      <tbody v-if="display_data && Object.keys(display_data).length == 0 && 0 == independent_selected.length">\n        <tr>\n          <td class="left30" colspan="99" style="justify-content: flex-start;">\u6682\u672A\u6DFB\u52A0\u4EFB\u4F55\u98CE\u63A7</td>\n        </tr>\n      </tbody>\n      <tbody v-if="display_data && Object.keys(display_data).length == 0 && 0 != independent_selected.length">\n        <tr>\n          <td class="left30" colspan="99" style="justify-content: flex-start;">\u6682\u672A\u6DFB\u52A0\u4EFB\u4F55\u98CE\u63A7</td>\n        </tr>\n      </tbody>\n    </table>\n  ',
  data: function data() {
    return Object.assign({
      selectAll: false,
      displayRules: displayRules,
      stockPool: common_stockPool,
      display_data: [],
      source_data: [],
      curEditRule: {
        product_id: '',
        rule_id: '',
        risk_type: '',
        pre_val: [],
        limit_val: [],
        limit_action: 0
      },
      display_check_all: [] //联合风控设置选中的风控规则
    }, riskDetailData);
    // return riskDetailData;
  },

  watch: {
    in_selected_risk: function in_selected_risk() {
      var _this4 = this;

      this.source_data = this.in_selected_risk.map(function (e) {
        e.web_checked = false;
        e.risk_type_str = _this4.displayRiskType(e.risk_type);
        return e;
      });

      var arr = JSON.parse(JSON.stringify(this.source_data));
      this.display_data = VUECOMPONENT.sort(arr, this.order, this.order_by);
    },
    order: function order() {
      var arr = JSON.parse(JSON.stringify(this.source_data));
      this.display_data = VUECOMPONENT.sort(arr, this.order, this.order_by);
    },
    order_by: function order_by() {
      var arr = JSON.parse(JSON.stringify(this.source_data));
      this.display_data = VUECOMPONENT.sort(arr, this.order, this.order_by);
    }
  },
  computed: {
    // display_data(){
    //   return this.in_selected_risk.map(e => {
    //     e.web_checked = false;
    //     return e;
    //   });
    // },
    rulesNeedShow: function rulesNeedShow() {
      var rtn = [];
      // var tmpType = parseInt(this.curentRuleType);
      this.displayRules.forEach(function (e) {
        rtn.push(e);
      });

      return rtn;
    }
  },
  methods: {
    checkKeyDown: function checkKeyDown(e, reg, value) {
      if (8 == e.keyCode) {
        return;
      }

      if (/\S/.test(e.key)) {
        if (reg.test(value + e.key)) {
          // value = value + e.key;
          return true;
        }
        e.preventDefault();
        return false;
      }
      e.preventDefault();
      return false;
    },
    chgSelectAll: function chgSelectAll() {
      var _this5 = this;

      var _this = this;
      var arr = []; //独立风控
      this.$nextTick(function () {
        _this5.display_data.forEach(function (e) {
          //独立风控
          e.web_checked = _this.selectAll;
          if (true == e.web_checked) {
            arr.push(e);
          }
        });
        if (1 == _this.current) {
          _this5.$emit('chg_select_rules', arr); //独立风控
          return;
        }
        if (2 == _this.current) {
          _this5.$emit('union_select_rules', arr); //联合风控
          return;
        }
      });
    },
    chgSelectedRules: function chgSelectedRules() {
      var arr = [];
      this.display_data.forEach(function (e) {
        if (e.web_checked) {
          arr.push(e);
        }
      });
      // console.log(arr);

      if (this.display_data.length > 0 && this.display_data.every(function (e) {
        return e.web_checked == true;
      })) {
        this.selectAll = true;
      } else {
        this.selectAll = false;
      }
      if (1 == this.current) {
        this.$emit('chg_select_rules', arr); //独立风控
        return;
      }
      if (2 == this.current) {
        this.$emit('union_select_rules', arr); //联合风控
        return;
      }
    },
    displayRiskType: function displayRiskType(val) {
      var rtn = '';
      displayRules.forEach(function (e) {
        if (e.type == val) {
          rtn = e.name;
        }
      });
      return rtn;
    },
    editRule: function editRule(row, id, type) {
      var _this = this;
      this.curEditRule.rule_id = id;
      this.curEditRule.risk_type = type;
      this.curEditRule.product_id = row.product_id;

      this.curEditRule.pre_val = row.pre_val;
      this.curEditRule.limit_val = row.limit_val;
      this.curEditRule.limit_action = row.limit_action;
    },
    deleteRule: function deleteRule(id, type) {
      // GetNameByRiskType(type)
      var thisRule;
      this.in_selected_risk.forEach(function (e) {
        if (e.rule_id == id) {
          thisRule = e;
        }
      });

      var that = this;
      // GetNameByRiskType(type)
      var html = '\n        <table>\n          <thead>\n            <tr>\n              <td style="padding-left: 50px; width: 110px;">\u4EA7\u54C1</td>\n              <td style="padding-left: 20px; width: 110px;">\u98CE\u63A7\u7C7B\u522B</td>\n              <td>\u98CE\u63A7\u89C4\u5219</td>\n            </tr>\n          </thead>\n          <tbody>\n            <tr>\n              <td style="padding-left: 50px; width: 110px;">' + thisRule.product_name + '</td>\n              <td style="padding-left: 20px; width: 110px;">' + GetNameByRiskType(thisRule.risk_type) + '</td>\n              <td>' + GetPreVal(type, thisRule.pre_val) + GetLimitVal(type, thisRule.limit_val) + GetLimitAction(type, thisRule.limit_action) + '</td>\n            </tr>\n          </tbody>\n        </table>\n      ';

      $.confirm({
        title: '删除确认',
        content: html,
        closeIcon: true,
        confirmButton: '确认',
        cancelButton: false,
        confirm: function confirm() {
          $.startLoading('正在删除...');
          $.ajax({
            url: '/rms-pub/rule/delete',
            type: 'post',
            data: {
              id: id
            },
            success: function success(_ref7) {
              var code = _ref7.code,
                  msg = _ref7.msg,
                  data = _ref7.data;

              $.clearLoading();
              riskVue.getList();
              riskVue.getListCo();
              $.omsAlert('删除成功');
            },
            error: function error() {
              $.clearLoading();
            }
          });
        }
      });
    },

    resetEditRule: function resetEditRule() {
      this.curEditRule = {
        product_id: '',
        rule_id: '',
        risk_type: '',
        pre_val: [],
        limit_val: [],
        limit_action: 0
      };
    },
    cancelEdit: function cancelEdit() {
      this.resetEditRule();
    },
    saveEdit: function saveEdit() {
      var tmpEditRule = this.curEditRule;

      var pre_val_arr = tmpEditRule.pre_val.filter(function (e) {
        return e != undefined;
      });
      var pre_val = pre_val_arr.join(',');
      var limit_val_arr = tmpEditRule.limit_val.filter(function (e) {
        return e != undefined;
      });
      var limit_val = limit_val_arr.join(',');
      var status = true;
      if (pre_val_arr.length < tmpEditRule.pre_val.length || limit_val_arr.length < tmpEditRule.limit_val.length) {
        status = false;
      }

      pre_val_arr.forEach(function (e) {
        if (isNaN(Number(e)) || false == /^\-?\d+(\.\d{1,4})?$/.test(e) || '' == e) {
          status = false;
        }
      });
      limit_val_arr.forEach(function (e) {
        if (isNaN(Number(e)) || false == /^\-?\d+(\.\d{1,4})?$/.test(e) || '' == e) {
          status = false;
        }
      });
      if (false == status) {
        $.omsAlert('请输入正确的数字');
        return;
      }

      // console.log(this.curEditRule);

      var _this = this;
      $.startLoading('正在修改...');
      $.ajax({
        url: '/rms-pub/rule/modify',
        type: 'post',
        data: {
          id: tmpEditRule.rule_id,
          product_id: tmpEditRule.product_id,
          risk_type: tmpEditRule.risk_type,
          pre_val: tmpEditRule.pre_val.join(','),
          limit_val: tmpEditRule.limit_val.join(',') || '-1',
          limit_action: tmpEditRule.limit_action
        },
        success: function success(_ref8) {
          var code = _ref8.code,
              msg = _ref8.msg,
              data = _ref8.data;

          $.clearLoading();
          if (0 == code) {
            riskVue.getList();
            riskVue.getListCo(); //保存之后刷新修改的数据
            $.omsAlert('修改成功');
            _this.resetEditRule();
          } else {
            $.omsAlert('修改失败，请重试。');
          }
        },
        error: function error() {
          $.clearLoading();
        }
      });
    }
  }
});

// 风控规则说明 点击展开面板
Vue.component('vue-risk-description', {
  props: ['cur_display_rule'],
  template: '\n    <div>\n      <img class="risk__description--img" :src="\'/omsv2/images/oms_client/risk-description-sp-\' + cur_display_rule.type + \'.png\'">\n    </div>\n  '
});

// 新增风控
Vue.component('vue-single-addrisk', {
  props: ['independent_selected', 'display_rules_arr', 'products', 'in_selected_risk'], //productId list
  template: '\n    <div class="risk_rules" id="risk_rules">\n      <div class="junior_rules">\n        <ul>\n          <template v-for="display_type in display_rules_arr">\n            <li v-if="display_type == display.type" v-for="(display, i) in displayRules" v-on:mouseup="setSelected(display.type)">\n               <label :class="[{selected: checkSelected(display.type)}]">\n                   <span class="rules_name">{{display.name}}</span>\n                   <input class="rules_selected" name="rules_selected" type="radio" />\n                   <span class="rules_status">\u5DF2\u8BBE\u7F6E\uFF1A{{ getDisplayRulesNum(display.type) }}\u6761</span>\n               </label>\n            </li>\n          </template>\n        </ul>\n        <template v-if="0 >= selected">\n          <p class="empty-text">\n             \u8BF7\u5148\u9009\u62E9\u98CE\u63A7\u7C7B\u522B\n          </p>\n        </template>\n        <template v-else>\n          <div class="rules_describe">\n            <div class="rules_describe_title" :class="[{displayed: showDescription}]">\n              <span class="rules_describe_span">\u98CE\u63A7\u89C4\u5219\u8BF4\u660E</span>\n              <span class="rules_describe_display" v-on:click="changeDescription">{{showDescription?\'\u6536\u8D77\':\'\u5C55\u5F00\'}}<i></i></span>\n            </div>\n\n            <vue-risk-description :cur_display_rule="curDisplayRule" class="rules_describe_content" :class="[{displayed: showDescription}]"></vue-risk-description>\n          </div>\n\n          <div class="rules_add" style="display: block;">\n            <!-- \u65B0\u589E\u89C4\u5219\u9009\u62E9 -->\n            <template v-for="(val, index) in curDisplayRule.pre_val">\n              <label>{{val.name}}\n                <template v-if="\'input\' == val.type">\n                  <div class="rules_input">\n                    <span v-text="val.operator"></span>\n                    <input :placeholder="val.placeHolder" type="text" :value="val.value" v-model="addRule_preVal[index]" @keydown="checkKeyDown($event, val.inputReg, addRule_preVal[index]);return false;" />\n                    <span class="rules_input_unit" v-text="val.unit"></span>\n                  </div>\n                </template>\n                <template v-if="\'select\' == val.type">\n                  <div class="rules_select">\n                    <selectize-stock-pool :options="stockPool" v-model="addRule_preVal[index]" v-on:show_stock_pool="showStockPool" >\n                    </selectize-stock-pool>\n                  </div>\n                </template>\n                <template v-if="\'select2\' == val.type">\n                  <select style="font-size: 12px;" :value="val.value" v-model="addRule_preVal[index]">\n                    <option v-for="option in val.options" v-text="option.label" :value="option.value"></option>\n                  </select>\n                </template>\n              </label>\n            </template>\n            <template v-for="(val, index) in curDisplayRule.limit_val">\n              <label>{{val.name}}\n                <template v-if="\'input\' == val.type">\n                  <div class="rules_input">\n                    <span v-text="val.operator"></span>\n                    <input type="text" :placeholder="val.placeHolder" :value="val.value" v-model="addRule_limitVal[index]" @keydown="checkKeyDown($event, val.inputReg, addRule_limitVal[index]);return false;" />\n                    <span class="rules_input_unit" v-text="val.unit"></span>\n                  </div>\n                </template>\n                <template v-if="\'select\' == val.type">\n                  <select :value="val.value" v-model="addRule_limitVal[index]">\n                    <option v-if="val.required" disabled="disabled" value="default" v-text="val.placeHolder"></option>\n                    <option v-if="!val.required" value="default" v-text="val.placeHolder"></option>\n                    <option v-for="(v, i) in stockPool" v-text="v.pool_name" :value="v.id"></option>\n                  </select>\n                </template>\n              </label>\n            </template>\n            <label v-if="curDisplayRule.hideAction !== true">{{curDisplayRule.limit_actionInfo.name}}\n              <select :value="addRule_actionValue" v-model="addRule_actionValue">\n                <option v-if="curDisplayRule.limit_actionInfo.required" disabled="disabled" value="default" v-text="curDisplayRule.limit_actionInfo.placeHolder"></option>\n                <option v-if="!curDisplayRule.limit_actionInfo.required" value="default" v-text="curDisplayRule.limit_actionInfo.placeHolder"></option>\n                <option v-for="(val, index) in curDisplayRule.limit_action" v-text="val.name" :value="val.type"></option>\n               </select>\n             </label>\n          </div>\n\n          <h3 class="vue-common-title" style="margin-left: 30px; margin-top: 30px;">\u65B0\u589E\u98CE\u63A7\u9884\u89C8</h3>\n          <div class="rules_added" style="min-height: initial;padding: 0;">\n            <table class="newweb-common-grid">\n              <thead>\n                <tr>\n                  <th class="left20 width250">\u4EA7\u54C1</th>\n                  <th class="left20 width250">\u98CE\u63A7\u7C7B\u522B</th>\n                  <th class="left20">\u98CE\u63A7\u89C4\u5219</th>\n                  <th></th>\n                </tr>\n              </thead>\n              <tbody>\n                <tr v-for="product in independent_selected">\n                  <td class="left20 width250" style="text-overflow: ellipsis;overflow: hidden;white-space: nowrap;">{{showProductName(product)}}</td>\n                  <td class="left20 width250">{{showRuleType(curDisplayRule.type)}}</td>\n                  <td class="left20">\n                    <div class="risk_details_text">\n                      <template v-if="undefined !== addRule_preVal[index]" v-for="(val, index) in curDisplayRule.pre_val">\n                        <span v-if="curDisplayRule.hideAction !== true" v-text="val.name"></span>\n                        <template v-if="\'input\' == val.type">\n                          <span style="color: #2196F3;" v-text="val.operator + \' \' + addRule_preVal[index] + val.unit"></span>\n                          <span>\uFF0C</span>\n                        </template>\n                        <template v-if="\'select\' == val.type">\n                          <span style="color: #2196F3;" v-text="getStockPoolByCode(addRule_preVal[index])"></span>\n                          <span v-if="curDisplayRule.hideAction !== true">\uFF0C</span>\n                        </template>\n                        <template v-if="\'select2\' == val.type">\n                          <span style="color: #2196F3;" v-text="getRulesDisplayByValue(val, addRule_preVal[index])"></span>\n                          <span v-if="curDisplayRule.hideAction !== true">\uFF0C</span>\n                        </template>\n                      </template>\n                      <template v-if="undefined !== addRule_limitVal[index]" v-for="(val, index) in curDisplayRule.limit_val">\n                        <span v-text="val.name"></span>\n                        <template v-if="\'input\' == val.type">\n                            <span style="color: #2196F3;" v-text="val.operator + \' \' + addRule_limitVal[index] + val.unit"></span>\n                            <span>\uFF0C</span>\n                        </template>\n                        <template v-if="\'select\' == val.type">\n                          <span style="color: #2196F3;" v-text="rule.limit_val[addRule_limitVal[index]]"></span>\n                          <span>\uFF0C</span>\n                        </template>\n                      </template>\n                      <template v-if="\'\' !== addRule_actionValue">\n                        <template v-if="curDisplayRule.hideAction !== true && false">\n                          <span>\u63D0\u4EA4\u6307\u4EE4\u53CA\u59D4\u6258\u65F6</span>\n                          <span>\uFF0C</span>\n                        </template>\n                        <template v-for="(val, index) in curDisplayRule.limit_action">\n                          <span v-if="val.type == addRule_actionValue" v-text="val.name" style="color:#F44336;margin-right: 20px;"></span>\n                        </template>\n                      </template>\n                      <span style="color:#a29e9e;">\uFF08\u65B0\u589E\u89C4\u5219\u9884\u89C8\uFF09</span>\n                    </div>\n                  </td>\n                  <td></td>\n                </tr>\n              </tbody>\n            </table>\n          </div>\n          <div class="rules_btns" style="text-align:right">\n            <a v-bind:class="{\'disabled\': checkSubmitDisabled()}" class="ui-btn add" v-on:click="rule_add" style="margin-right:45px">\u786E\u8BA4\u6DFB\u52A0</a>\n          </div>\n        </template>\n      </div>\n    </div>\n  ',
  data: function data() {
    var _ref9;

    return _ref9 = {
      isNormal: true,
      selected: 0,
      showDescription: true

    }, _defineProperty(_ref9, 'selected', 0), _defineProperty(_ref9, 'value', 0), _defineProperty(_ref9, 'options', [{ id: 1, text: 'Hello' }, { id: 2, text: 'World' }]), _defineProperty(_ref9, 'stockPool', common_stockPool), _defineProperty(_ref9, 'addRule_preVal', new Array(10)), _defineProperty(_ref9, 'addRule_limitVal', new Array(10)), _defineProperty(_ref9, 'addRule_actionValue', 1), _defineProperty(_ref9, 'displayRules', displayRules), _defineProperty(_ref9, 'curDisplayRule', {}), _defineProperty(_ref9, 'rules', []), _defineProperty(_ref9, 'curRules', []), _ref9;
  },
  created: function created() {
    // $(document).on('keydown', '.rules_input>input', function (e) {
    //   if (8 == e.keyCode) {
    //     return;
    //   }
    //   if (/\S/.test(e.key)) {
    //     if (/^\d+\.?\d{0,3}$/.test($(this).val() + e.key)) {
    //       return true;
    //     }
    //     return false;
    //   }
    //   return false;
    // });
  },

  methods: {
    checkKeyDown: function checkKeyDown(e, reg, value) {
      if (8 == e.keyCode) {
        return;
      }

      if (/\S/.test(e.key)) {
        if (reg.test(value + e.key)) {
          // value = value + e.key;
          return true;
        }
        e.preventDefault();
        return false;
      }
      e.preventDefault();
      return false;
    },
    checkSubmitDisabled: function checkSubmitDisabled() {
      var that = this;
      var pre_val_arr = this.addRule_preVal.filter(function (e) {
        return e != undefined;
      });
      var pre_val = pre_val_arr.join(',');
      var limit_val_arr = this.addRule_limitVal.filter(function (e) {
        return e != undefined;
      });
      var limit_val = limit_val_arr.join(',');
      var status = true;
      if (pre_val_arr.length < this.curDisplayRule.pre_val.length || limit_val_arr.length < this.curDisplayRule.limit_val.length) {
        status = false;
      }
      pre_val_arr.forEach(function (e) {
        if (isNaN(Number(e)) || false == /^\-?\d+(\.\d{1,4})?$/.test(e) || '' == e) {
          status = false;
        }
      });
      limit_val_arr.forEach(function (e) {
        if (isNaN(Number(e)) || false == /^\-?\d+(\.\d{1,4})?$/.test(e) || '' == e) {
          status = false;
        }
      });
      return !status;
    },
    showRuleType: function showRuleType(type) {
      var str = '';
      this.displayRules.forEach(function (e) {
        if (e.type == type) {
          str = e.name;
        }
      });
      return str;
    },
    showProductName: function showProductName(id) {
      var name = '';
      this.products.forEach(function (e) {
        if (e.value == id) {
          name = e.label;
        }
      });
      return name;
    },
    getOptions: function getOptions(v) {
      var rtn = [];
      v.forEach(function (e) {
        rtn.push({
          id: e.type,
          text: e.name
        });
      });
      return rtn;
    },
    getStockOptions: function getStockOptions(v) {
      var rtn = [];
      v.forEach(function (e) {
        rtn.push({
          id: e.id,
          text: e.pool_name
        });
      });
      return rtn;
    },
    getDisplayRulesData: function getDisplayRulesData() {
      return this.curDisplayRule;
      // var rtn = {};
      // var selected = this.selected;
      // this.displayRules.forEach(function(e){
      //   if (selected == e.type) {
      //     rtn = e;
      //   }
      // });
      // return rtn;
    },
    showStockPool: function showStockPool() {
      allStockIdArr = [];
      var html = '\n      <div class="custom-stock-pool">\n        <div class="custom-stock-pool-add">\n          <div class="stock-input">\n            <input class="custom-stock-pool-input" placeHolder="\u8BF7\u8F93\u5165\u8BC1\u5238\u4EE3\u7801\u6216\u540D\u79F0" />\n            <ul class="custom-stock-suggest">\n            </ul>\n            <span class="custom-stock-suggested"></span>\n          </div>\n          <span class="custom-stock-add" style="display:none;">\u6DFB\u52A0</span>\n        </div>\n        <div class="custom-stock-pool-display">\n          <ul style="height: 170px; display: block; overflow-y: scroll; overflow-x: hidden;">\n\n          </ul>\n          <div class="stock-empty">\n            <a><i></i>\u6E05\u7A7A\u9009\u62E9</a>\n          </div>\n        </div>\n        <div class="custom-stock-pool-info">\n          <input class="custom-stock-pool-name" maxlength="20" placeholder="\u8BF7\u8F93\u5165\u65B0\u5EFA\u80A1\u7968\u6C60\u540D\u79F0(\u4E0D\u5F97\u8D85\u8FC720\u4E2A\u5B57)" />\n          <span class="error-tip hidden"></span>\n        </div>\n        <div class="custom-stock-pool-btn">\n          <a class="ui-btn btn-save">\u786E\u5B9A</a>\n        </div>\n      </div>\n      ';
      jc = $.confirm({
        title: '自定义股票池',
        boxWidth: '680px',
        content: html,
        closeIcon: true,
        columnClass: 'custom-stockpool-width',
        confirmButton: false,
        cancelButton: false
      });
    },
    setTypeJunior: function setTypeJunior() {
      this.isNormal = true;
    },
    setTypeSenior: function setTypeSenior() {
      this.isNormal = false;
    },
    getStockPoolByCode: function getStockPoolByCode(i) {
      var rtn = '';
      this.stockPool.forEach(function (e) {
        if (parseInt(e.id) == parseInt(i)) {
          rtn = e.pool_name;
        }
      });
      return rtn;
    },
    getRulesDisplayByValue: function getRulesDisplayByValue(pre_rule, value) {
      var rtn = '';
      pre_rule.options.forEach(function (e) {
        if (e.value == value) {
          rtn = e.label;
        }
      });
      return rtn;
    },
    getStockPool: function getStockPool() {
      _getStockPool();
    },
    doCustom: function doCustom() {
      // 无用
      // console.log(111111);
    },
    checkSelected: function checkSelected(i) {
      return this.selected == i;
    },
    chgCurDisplayRuleByNum: function chgCurDisplayRuleByNum(i) {
      // 修改当前显示规则模版
      var rtn = {};
      var selected = i;
      this.displayRules.forEach(function (e) {
        if (selected == e.type) {
          rtn = e;
        }
      });
      this.curDisplayRule = rtn;

      // 修改下发值记录默认值
      this.addRule_preVal = new Array(10);
      this.addRule_limitVal = new Array(10);
      this.addRule_actionValue = 1;

      var _this = this;
      this.curDisplayRule.pre_val.forEach(function (e, index) {
        // _this.addRule_preVal[index] = e.value;
        _this.addRule_preVal.splice(index, 1, e.value);
      });

      this.curDisplayRule.limit_val.forEach(function (e, index) {
        // _this.addRule_limitVal[index] = e.value;
        _this.addRule_limitVal.splice(index, 1, e.value);
      });
    },
    setSelected: function setSelected(i) {
      this.selected = i;
      if ('true' == localStorage.getItem('user_id_' + window.LOGIN_INFO.user_id + '.rules_displayed_' + i)) {
        this.showDescription = false;
      } else {
        localStorage.setItem('user_id_' + window.LOGIN_INFO.user_id + '.rules_displayed_' + i, 'true');
        this.showDescription = true;
      }
      this.chgCurDisplayRuleByNum(i);
      this.chgCurRulesByNum(i);
      this.$forceUpdate();
    },
    getDisplayRulesNum: function getDisplayRulesNum(type) {
      var rtn = 0;
      this.in_selected_risk.forEach(function (e) {
        if (type == e.risk_type) {
          rtn++;
        }
      });
      return rtn;
    },
    changeDescription: function changeDescription() {
      this.showDescription = !this.showDescription;
      return this.showDescription;
    },
    chgCurRulesByNum: function chgCurRulesByNum(i) {
      var that = this;
      var tmpArr = [];
      Object.keys(that.rules).forEach(function (e) {
        Object.values(that.rules[e]).forEach(function (el) {
          if (el.risk_type == i) {
            tmpArr.push(el);
          }
        });
      });
      this.curRules = tmpArr;
    },
    rule_add: function rule_add() {
      var that = this;
      var _this = this;
      if (this.checkSubmitDisabled()) {
        return false;
      }
      var pre_val_arr = this.addRule_preVal.filter(function (e) {
        return e != undefined;
      });
      var pre_val = pre_val_arr.join(',');
      var limit_val_arr = this.addRule_limitVal.filter(function (e) {
        return e != undefined;
      });
      var limit_val = limit_val_arr.join(',');
      var status = true;
      if (pre_val_arr.length < this.curDisplayRule.pre_val.length || limit_val_arr.length < this.curDisplayRule.limit_val.length) {
        status = false;
      }
      pre_val_arr.forEach(function (e) {
        if (isNaN(Number(e)) || false == /^\-?\d+(\.\d{1,4})?$/.test(e) || '' == e) {
          status = false;
        }
      });
      limit_val_arr.forEach(function (e) {
        if (isNaN(Number(e)) || false == /^\-?\d+(\.\d{1,4})?$/.test(e) || '' == e) {
          status = false;
        }
      });
      // // 针对禁买股票池的特殊处理
      // if (1 == this.curDisplayRule.type && false == status) {
      //   $.omsAlert('请选择股票池');
      //   return;
      // }
      // if (false == status) {
      //   $.omsAlert('请输入正确的数字');
      //   return;
      // }
      $.startLoading();
      $.ajax({
        url: '/rms-pub/rule/add',
        type: 'post',
        data: {
          product_id: this.independent_selected.join(','),
          risk_type: this.curDisplayRule.type,
          pre_val: pre_val,
          limit_val: limit_val || '-1',
          limit_action: this.addRule_actionValue
        },
        success: function success(_ref10) {
          var code = _ref10.code,
              msg = _ref10.msg,
              data = _ref10.data;

          $.clearLoading();
          if (0 == code) {
            riskVue.getList();

            // $('.junior_rules label.selected').click();
            $.omsAlert('添加成功');
            // productRules.setSelected(productRules.selected);

            _this.setSelected(_this.selected);
            // let oldSelected = _this.selected;
            // _this.selected = 0;
            // _this.$nextTick(function(){
            //   _this.selected = oldSelected;
            // })
            // _this.addRule_preVal = new Array(10)
            // _this.addRule_limitVal = new Array(10)
            // _this.addRule_actionValue = 1
          } else {
            $.omsAlert(msg);
          }
        },
        error: function error() {
          $.clearLoading();
          $.omsAlert('网络异常');
        }
      });
    }
  }

});

Vue.component('vue-combined-addrisk', {
  props: ['independent_selected', 'display_rules_arr', 'products', 'in_selected_risk'], //productId list
  template: '\n    <div class="risk_rules" id="risk_rules">\n      <div class="junior_rules">\n        <ul>\n          <template v-for="display_type in display_rules_arr">\n            <li v-if="display_type == display.type" v-for="(display, i) in displayRules" v-on:mouseup="setSelected(display.type)">\n               <label :class="[{selected: checkSelected(display.type)}]">\n                   <span class="rules_name">{{display.name}}</span>\n                   <input class="rules_selected" name="rules_selected" type="radio" />\n                   <span class="rules_status">\u5DF2\u8BBE\u7F6E\uFF1A{{ getDisplayRulesNum(display.type) }}\u6761</span>\n               </label>\n            </li>\n          </template>\n        </ul>\n        <template v-if="0 >= selected">\n          <p class="empty-text">\n             \u8BF7\u5148\u9009\u62E9\u98CE\u63A7\u7C7B\u522B\n          </p>\n        </template>\n        <template v-else>\n          <div class="rules_describe">\n            <div class="rules_describe_title" :class="[{displayed: showDescription}]">\n              <span class="rules_describe_span">\u98CE\u63A7\u89C4\u5219\u8BF4\u660E</span>\n              <span class="rules_describe_display" v-on:click="changeDescription">{{showDescription?\'\u6536\u8D77\':\'\u5C55\u5F00\'}}<i></i></span>\n            </div>\n\n            <vue-risk-description :cur_display_rule="curDisplayRule" class="rules_describe_content" :class="[{displayed: showDescription}]"></vue-risk-description>\n          </div>\n\n          <div class="rules_add" style="display: block;">\n            <!-- \u65B0\u589E\u89C4\u5219\u9009\u62E9 -->\n            <template v-for="(val, index) in curDisplayRule.pre_val">\n              <label>{{val.name}}\n                <template v-if="\'input\' == val.type">\n                  <div class="rules_input">\n                    <span v-text="val.operator"></span>\n                    <input :placeholder="val.placeHolder" type="text" :value="val.value" v-model="addRule_preVal[index]" @keydown="checkKeyDown($event, val.inputReg, addRule_preVal[index]);return false;" />\n                    <span class="rules_input_unit" v-text="val.unit"></span>\n                  </div>\n                </template>\n                <template v-if="\'select\' == val.type">\n                  <div class="rules_select">\n                    <selectize-stock-pool :options="stockPool" v-model="addRule_preVal[index]" v-on:show_stock_pool="showStockPool" >\n                    </selectize-stock-pool>\n                  </div>\n                </template>\n                <template v-if="\'select2\' == val.type">\n                  <select style="font-size: 12px;" :value="val.value" v-model="addRule_preVal[index]">\n                    <option v-for="option in val.options" v-text="option.label" :value="option.value"></option>\n                  </select>\n                </template>\n              </label>\n            </template>\n            <template v-for="(val, index) in curDisplayRule.limit_val">\n              <label>{{val.name}}\n                <template v-if="\'input\' == val.type">\n                  <div class="rules_input">\n                    <span v-text="val.operator"></span>\n                    <input type="text" :placeholder="val.placeHolder" :value="val.value" v-model="addRule_limitVal[index]" @keydown="checkKeyDown($event, val.inputReg, addRule_limitVal[index]);return false;" />\n                    <span class="rules_input_unit" v-text="val.unit"></span>\n                  </div>\n                </template>\n                <template v-if="\'select\' == val.type">\n                  <select :value="val.value" v-model="addRule_limitVal[index]">\n                    <option v-if="val.required" disabled="disabled" value="default" v-text="val.placeHolder"></option>\n                    <option v-if="!val.required" value="default" v-text="val.placeHolder"></option>\n                    <option v-for="(v, i) in stockPool" v-text="v.pool_name" :value="v.id"></option>\n                  </select>\n                </template>\n              </label>\n            </template>\n            <label v-if="curDisplayRule.hideAction !== true">{{curDisplayRule.limit_actionInfo.name}}\n              <!-- <select2 :options="getOptions(curDisplayRule.limit_action)" v-model="addRule_actionValue">\n                <option v-if="curDisplayRule.limit_actionInfo.required" disabled="disabled" value="default" v-text="curDisplayRule.limit_actionInfo.placeHolder"></option>\n                <option v-if="!curDisplayRule.limit_actionInfo.required" value="default" v-text="curDisplayRule.limit_actionInfo.placeHolder"></option>\n              </select2> -->\n              <select :value="addRule_actionValue" v-model="addRule_actionValue">\n                <option v-if="curDisplayRule.limit_actionInfo.required" disabled="disabled" value="default" v-text="curDisplayRule.limit_actionInfo.placeHolder"></option>\n                <option v-if="!curDisplayRule.limit_actionInfo.required" value="default" v-text="curDisplayRule.limit_actionInfo.placeHolder"></option>\n                <!-- <template> -->\n                <option v-for="(val, index) in curDisplayRule.limit_action" v-text="val.name" :value="val.type"></option>\n                <!-- </template> -->\n               </select>\n             </label>\n          </div>\n\n          <h3 class="vue-common-title" style="margin-left: 30px; margin-top: 30px;">\u65B0\u589E\u98CE\u63A7\u9884\u89C8</h3>\n          <div class="rules_added" style="min-height: initial;padding: 0;">\n            <table class="newweb-common-grid">\n              <thead>\n                <tr>\n                  <th class="left20 width250">\u4EA7\u54C1</th>\n                  <th class="left20 width250">\u98CE\u63A7\u7C7B\u522B</th>\n                  <th class="left20">\u98CE\u63A7\u89C4\u5219</th>\n                  <th></th>\n                </tr>\n              </thead>\n              <tbody>\n                <tr v-for="product in independent_selected">\n                  <td class="left20 width250" style="text-overflow: ellipsis;overflow: hidden;white-space: nowrap;">{{showProductName(product)}}</td>\n                  <td class="left20 width250">{{showRuleType(curDisplayRule.type)}}</td>\n                  <td class="left20">\n                    <div class="risk_details_text">\n                      <template v-if="undefined !== addRule_preVal[index]" v-for="(val, index) in curDisplayRule.pre_val">\n                        <span v-if="curDisplayRule.hideAction !== true" v-text="val.name"></span>\n                        <template v-if="\'input\' == val.type">\n                          <span style="color: #2196F3;" v-text="val.operator + \' \' + addRule_preVal[index] + val.unit"></span>\n                          <span>\uFF0C</span>\n                        </template>\n                        <template v-if="\'select\' == val.type">\n                          <span style="color: #2196F3;" v-text="getStockPoolByCode(addRule_preVal[index])"></span>\n                          <span v-if="curDisplayRule.hideAction !== true">\uFF0C</span>\n                        </template>\n                        <template v-if="\'select2\' == val.type">\n                          <span style="color: #2196F3;" v-text="getRulesDisplayByValue(val, addRule_preVal[index])"></span>\n                          <span v-if="curDisplayRule.hideAction !== true">\uFF0C</span>\n                        </template>\n                      </template>\n                      <template v-if="undefined !== addRule_limitVal[index]" v-for="(val, index) in curDisplayRule.limit_val">\n                        <span v-text="val.name"></span>\n                        <template v-if="\'input\' == val.type">\n                            <span style="color: #2196F3;" v-text="val.operator + \' \' + addRule_limitVal[index] + val.unit"></span>\n                            <span>\uFF0C</span>\n                        </template>\n                        <template v-if="\'select\' == val.type">\n                          <span style="color: #2196F3;" v-text="rule.limit_val[addRule_limitVal[index]]"></span>\n                          <span>\uFF0C</span>\n                        </template>\n                      </template>\n                      <template v-if="\'\' !== addRule_actionValue">\n                        <template v-if="curDisplayRule.hideAction !== true && false">\n                          <span>\u63D0\u4EA4\u6307\u4EE4\u53CA\u59D4\u6258\u65F6</span>\n                          <span>\uFF0C</span>\n                        </template>\n                        <template v-for="(val, index) in curDisplayRule.limit_action">\n                          <span v-if="val.type == addRule_actionValue" v-text="val.name" style="color:#F44336;margin-right: 20px;"></span>\n                        </template>\n                      </template>\n                      <span style="color:#a29e9e;">\uFF08\u65B0\u589E\u89C4\u5219\u9884\u89C8\uFF09</span>\n                    </div>\n                  </td>\n                  <td></td>\n                </tr>\n              </tbody>\n            </table>\n          </div>\n          <div class="rules_btns" style="text-align:right">\n            <a v-bind:class="{\'disabled\': checkSubmitDisabled()}" class="ui-btn add" v-on:click="rule_add" style="margin-right:45px">\u786E\u8BA4\u6DFB\u52A0</a>\n          </div>\n        </template>\n      </div>\n    </div>\n  ',
  data: function data() {
    var _ref11;

    return _ref11 = {
      isNormal: true,
      selected: 0,
      showDescription: true

    }, _defineProperty(_ref11, 'selected', 0), _defineProperty(_ref11, 'value', 0), _defineProperty(_ref11, 'options', [{ id: 1, text: 'Hello' }, { id: 2, text: 'World' }]), _defineProperty(_ref11, 'stockPool', common_stockPool), _defineProperty(_ref11, 'addRule_preVal', new Array(10)), _defineProperty(_ref11, 'addRule_limitVal', new Array(10)), _defineProperty(_ref11, 'addRule_actionValue', 1), _defineProperty(_ref11, 'displayRules', displayRules), _defineProperty(_ref11, 'curDisplayRule', {}), _defineProperty(_ref11, 'rules', []), _defineProperty(_ref11, 'curRules', []), _ref11;
  },
  created: function created() {
    // $(document).on('keydown', '.rules_input>input', function (e) {
    //   if (8 == e.keyCode) {
    //     return;
    //   }
    //   if (/\S/.test(e.key)) {
    //     if (/^\d+\.?\d{0,3}$/.test($(this).val() + e.key)) {
    //       return true;
    //     }
    //     return false;
    //   }
    //   return false;
    // });
  },

  methods: {
    checkKeyDown: function checkKeyDown(e, reg, value) {
      if (8 == e.keyCode) {
        return;
      }

      if (/\S/.test(e.key)) {
        if (reg.test(value + e.key)) {
          // value = value + e.key;
          return true;
        }
        e.preventDefault();
        return false;
      }
      e.preventDefault();
      return false;
    },
    checkSubmitDisabled: function checkSubmitDisabled() {
      var that = this;
      var pre_val_arr = this.addRule_preVal.filter(function (e) {
        return e != undefined;
      });
      var pre_val = pre_val_arr.join(',');
      var limit_val_arr = this.addRule_limitVal.filter(function (e) {
        return e != undefined;
      });
      var limit_val = limit_val_arr.join(',');
      var status = true;
      if (pre_val_arr.length < this.curDisplayRule.pre_val.length || limit_val_arr.length < this.curDisplayRule.limit_val.length) {
        status = false;
      }
      pre_val_arr.forEach(function (e) {
        if (isNaN(Number(e)) || false == /^\-?\d+(\.\d{1,3})?$/.test(e) || '' == e) {
          status = false;
        }
      });
      limit_val_arr.forEach(function (e) {
        if (isNaN(Number(e)) || false == /^\-?\d+(\.\d{1,3})?$/.test(e) || '' == e) {
          status = false;
        }
      });
      return !status;
    },
    showRuleType: function showRuleType(type) {
      var str = '';
      this.displayRules.forEach(function (e) {
        if (e.type == type) {
          str = e.name;
        }
      });
      return str;
    },
    showProductName: function showProductName(id) {
      var name = '';
      this.products.forEach(function (e) {
        if (e.value == id) {
          name = e.label;
        }
      });

      if ('' == name && -1 == id) {
        name = '全部产品';
      }
      return name;
    },
    getOptions: function getOptions(v) {
      var rtn = [];
      v.forEach(function (e) {
        rtn.push({
          id: e.type,
          text: e.name
        });
      });
      return rtn;
    },
    getStockOptions: function getStockOptions(v) {
      var rtn = [];
      v.forEach(function (e) {
        rtn.push({
          id: e.id,
          text: e.pool_name
        });
      });
      return rtn;
    },
    getDisplayRulesData: function getDisplayRulesData() {
      return this.curDisplayRule;
      // var rtn = {};
      // var selected = this.selected;
      // this.displayRules.forEach(function(e){
      //   if (selected == e.type) {
      //     rtn = e;
      //   }
      // });
      // return rtn;
    },
    showStockPool: function showStockPool() {
      allStockIdArr = [];
      var html = '\n      <div class="custom-stock-pool">\n        <div class="custom-stock-pool-add">\n          <div class="stock-input">\n            <input class="custom-stock-pool-input" placeHolder="\u8BF7\u8F93\u5165\u8BC1\u5238\u4EE3\u7801\u6216\u540D\u79F0" />\n            <ul class="custom-stock-suggest">\n            </ul>\n            <span class="custom-stock-suggested"></span>\n          </div>\n          <span class="custom-stock-add" style="display:none;">\u6DFB\u52A0</span>\n        </div>\n        <div class="custom-stock-pool-display">\n          <ul style="height: 170px; display: block; overflow-y: scroll; overflow-x: hidden;">\n\n          </ul>\n          <div class="stock-empty">\n            <a><i></i>\u6E05\u7A7A\u9009\u62E9</a>\n          </div>\n        </div>\n        <div class="custom-stock-pool-info">\n          <input class="custom-stock-pool-name" maxlength="20" placeholder="\u8BF7\u8F93\u5165\u65B0\u5EFA\u80A1\u7968\u6C60\u540D\u79F0(\u4E0D\u5F97\u8D85\u8FC720\u4E2A\u5B57)" />\n          <span class="error-tip hidden"></span>\n        </div>\n        <div class="custom-stock-pool-btn">\n          <a class="ui-btn btn-save">\u786E\u5B9A</a>\n        </div>\n      </div>\n      ';
      jc = $.confirm({
        title: '自定义股票池',
        boxWidth: '680px',
        content: html,
        closeIcon: true,
        columnClass: 'custom-stockpool-width',
        confirmButton: false,
        cancelButton: false
      });
    },
    setTypeJunior: function setTypeJunior() {
      this.isNormal = true;
    },
    setTypeSenior: function setTypeSenior() {
      this.isNormal = false;
    },
    getStockPoolByCode: function getStockPoolByCode(i) {
      var rtn = '';
      this.stockPool.forEach(function (e) {
        if (parseInt(e.id) == parseInt(i)) {
          rtn = e.pool_name;
        }
      });
      return rtn;
    },
    getRulesDisplayByValue: function getRulesDisplayByValue(pre_rule, value) {
      var rtn = '';
      pre_rule.options.forEach(function (e) {
        if (e.value == value) {
          rtn = e.label;
        }
      });
      return rtn;
    },
    getStockPool: function getStockPool() {
      _getStockPool();
    },
    doCustom: function doCustom() {
      // 无用
      // console.log(111111);
    },
    checkSelected: function checkSelected(i) {
      return this.selected == i;
    },
    chgCurDisplayRuleByNum: function chgCurDisplayRuleByNum(i) {
      // 修改当前显示规则模版
      var rtn = {};
      var selected = i;
      this.displayRules.forEach(function (e) {
        if (selected == e.type) {
          rtn = e;
        }
      });
      this.curDisplayRule = rtn;

      // 修改下发值记录默认值
      this.addRule_preVal = new Array(10);
      this.addRule_limitVal = new Array(10);
      this.addRule_actionValue = 1;

      var _this = this;
      this.curDisplayRule.pre_val.forEach(function (e, index) {
        // _this.addRule_preVal[index] = e.value;
        _this.addRule_preVal.splice(index, 1, e.value);
      });

      this.curDisplayRule.limit_val.forEach(function (e, index) {
        // _this.addRule_limitVal[index] = e.value;
        _this.addRule_limitVal.splice(index, 1, e.value);
      });
    },
    setSelected: function setSelected(i) {
      this.selected = i;
      if ('true' == localStorage.getItem('user_id_' + window.LOGIN_INFO.user_id + '.rules_displayed_' + i)) {
        this.showDescription = false;
      } else {
        localStorage.setItem('user_id_' + window.LOGIN_INFO.user_id + '.rules_displayed_' + i, 'true');
        this.showDescription = true;
      }
      this.chgCurDisplayRuleByNum(i);
      this.chgCurRulesByNum(i);
      this.$forceUpdate();
    },
    getDisplayRulesNum: function getDisplayRulesNum(type) {
      var rtn = 0;
      this.in_selected_risk.forEach(function (e) {
        if (type == e.risk_type) {
          rtn++;
        }
      });
      return rtn;
    },
    changeDescription: function changeDescription() {
      this.showDescription = !this.showDescription;
      return this.showDescription;
    },
    chgCurRulesByNum: function chgCurRulesByNum(i) {
      var that = this;
      var tmpArr = [];
      Object.keys(that.rules).forEach(function (e) {
        Object.values(that.rules[e]).forEach(function (el) {
          if (el.risk_type == i) {
            tmpArr.push(el);
          }
        });
      });
      this.curRules = tmpArr;
    },
    rule_add: function rule_add() {
      var that = this;
      if (this.checkSubmitDisabled()) {
        return false;
      }
      var pre_val_arr = this.addRule_preVal.filter(function (e) {
        return e != undefined;
      });
      var pre_val = pre_val_arr.join(',');
      var limit_val_arr = this.addRule_limitVal.filter(function (e) {
        return e != undefined;
      });
      var limit_val = limit_val_arr.join(',');
      var status = true;
      if (pre_val_arr.length < this.curDisplayRule.pre_val.length || limit_val_arr.length < this.curDisplayRule.limit_val.length) {
        status = false;
      }
      pre_val_arr.forEach(function (e) {
        if (isNaN(Number(e)) || false == /^\-?\d+(\.\d{1,3})?$/.test(e) || '' == e) {
          status = false;
        }
      });
      limit_val_arr.forEach(function (e) {
        if (isNaN(Number(e)) || false == /^\-?\d+(\.\d{1,3})?$/.test(e) || '' == e) {
          status = false;
        }
      });
      // // 针对禁买股票池的特殊处理
      // if (1 == this.curDisplayRule.type && false == status) {
      //   $.omsAlert('请选择股票池');
      //   return;
      // }
      // if (false == status) {
      //   $.omsAlert('请输入正确的数字');
      //   return;
      // }
      $.startLoading();
      $.ajax({
        url: '/rms-pub/rule/add_co',
        type: 'post',
        data: {
          // product_id: this.productId,
          risk_type: this.curDisplayRule.type,
          pre_val: pre_val,
          limit_val: limit_val || '-1',
          limit_action: this.addRule_actionValue
        },
        success: function success(_ref12) {
          var code = _ref12.code,
              msg = _ref12.msg,
              data = _ref12.data;

          $.clearLoading();
          if (0 == code) {
            riskVue.getListCo();

            // $('.junior_rules label.selected').click();
            $.omsAlert('添加成功');
            // productRules.setSelected(productRules.selected);
          } else {
            $.omsAlert(msg);
          }
        },
        error: function error() {
          $.clearLoading();
          $.omsAlert('网络异常');
        }
      });
    }
  }

});

/**
 * 用到的老版本的函数
 */
function GetNameByRiskType(type) {
  type = Number(type);
  var rtn = '';
  displayRules.forEach(function (e) {
    if (type == e.type) {
      rtn = e.name;
    }
  });
  return rtn;
};

function GetPreVal(type, pre_val) {
  type = Number(type);
  var rtn = '';
  displayRules.forEach(function (e) {
    if (type == Number(e.type)) {
      e.pre_val.forEach(function (el, index) {
        if ('select' == el.type) {
          rtn += el.name + '<span style="margin-left: 5px;margin-right: 5px;color:#2196F3;">' + GetPoolNameById(pre_val[index]) + '</span>，';
        } else if ('input' == el.type) {
          rtn += el.name + '<span style="margin-left: 5px;margin-right: 5px;color:#2196F3;">' + (el.operator || '') + pre_val[index] + (el.unit || '') + '</span>，';
        } else if ('select2' == el.type) {
          rtn += el.name + '<span style="margin-left: 5px;margin-right: 5px;color:#2196F3;">' + (el.options[index].label || '') + (el.unit || '') + '</span>，';
        }
      });
    }
  });
  return rtn;
}

function GetLimitVal(type, limit_val) {
  type = Number(type);
  var rtn = '';
  displayRules.forEach(function (e) {
    if (type == e.type) {
      e.limit_val.forEach(function (el, index) {
        rtn += el.name + '<span style="margin-left: 5px;margin-right: 5px;color:#2196F3;">' + (el.operator || '') + limit_val[index] + (el.unit || '') + '</span>，';
      });
    }
  });
  return rtn;
}

function GetLimitAction(type, limit_action) {
  type = Number(type);
  var rtn = '';
  displayRules.forEach(function (e) {
    if (type == e.type) {
      e.limit_action.forEach(function (el) {
        if (el.type == limit_action) {
          rtn += '<span style="color:#F44048">' + el.name + '</span>';
        }
      });
    }
  });
  return rtn;
}

function GetPreValType(type, index) {
  type = Number(type);
  var rtn = '';
  displayRules.forEach(function (e) {
    if (type == e.type) {
      rtn = e.pre_val[index].type;
    }
  });
  return rtn;
}

function GetLimitValType(type, index) {
  type = Number(type);
  var rtn = '';
  displayRules.forEach(function (e) {
    if (type == e.type) {
      if (e.limit_val[index] == undefined) {
        rtn = 'select';
      } else {
        rtn = e.limit_val[index].type;
      }
    }
  });
  return rtn;
}

function GetPoolNameById(id) {
  var rtn = '';
  common_stockPool.forEach(function (e) {
    if (Number(e.id) == Number(id)) {
      rtn = e.pool_name;
    }
  });

  return rtn;
}

/**
 * 老代码jq部分
 */
var validPreVal;
$(document).on('keydown', '.rules_input>input', function (e) {
  validPreVal = $(this).val();
}).on('keyup', '.rules_input>input', function (e) {
  validPreVal = undefined;
});

$(document).on('keyup', '.custom-stock-pool-input', function (e) {
  $(this).attr('data-id', '').attr('data-name', '');
  searchStock($(this));
});
$(document).on('focus', '.custom-stock-pool-input', function (e) {
  $('.custom-stock-suggested').hide();
  var stock_id = $(this).attr('data-id');
  stock_id && $(this).val(stock_id.match(/\d*/)[0]);

  searchStock($('.custom-stock-pool-input'));
}).on('blur', '.custom-stock-pool-input', function (e) {
  // 焦点离开时，如果stock_id以及保存了，那么显示正确的stock_name
  // 所以，当stock_id不正确时，需要清空stock_id
  var stock_id = $(this).attr('data-id');
  var stock_name = $(this).attr('data-name');
  if ('' != stock_id) {
    $(this).val(stock_id);
    $('.custom-stock-suggested').html(stock_name).show();
  }
}).on('blur', '.stock-input', function (e) {
  // blur与click事件顺序问题，已将click修改为mousedown
  $('.custom-stock-suggest').slideUp(200);
});
$(document).on('mousedown', '.custom-stock-suggest>li', function () {
  selectOneStock(this);

  var customInput = $('.custom-stock-pool-input');
  var stock_id = customInput.attr('data-id');
  var stock_name = customInput.attr('data-name');
  if ('' == stock_id || '' == stock_name) {
    return;
  }
  customInput.attr('data-id', '').attr('data-name', '').val('');
  $('.custom-stock-suggested').html('');
  if (allStockIdArr.some(function (e) {
    return e == stock_id;
  })) {
    return;
  }
  allStockIdArr.push(stock_id);
  $('.custom-stock-pool-display>ul').append('<li><span class="stock-name" data-id="' + stock_id + '">' + stock_id.match(/\d*/)[0] + ' &nbsp; ' + stock_name + '</span><span class="btn-del">删除</span></li>');
});
$(document).on('click', '.btn-del', function () {
  var stock_id = $(this).parents('li').find('.stock-name').attr('data-id');
  allStockIdArr = allStockIdArr.filter(function (e) {
    return e != stock_id;
  });
  $(this).parents('li').remove();
});
$(document).on('click', '.stock-empty>a', function () {
  allStockIdArr = [];
  $('.custom-stock-pool-display>ul').empty();
});

$(document).on('focus', '.custom-stock-pool-name', function () {
  $('.custom-stock-pool-info>.error-tip').html('').addClass('hidden');
});

$(document).on('click', '.btn-save', function () {
  var stock_id_arr = [];
  $('.custom-stock-pool-display>ul>li').each(function (index, e) {
    stock_id_arr.push($(e).find('.stock-name').attr('data-id'));
  });
  if (0 == stock_id_arr.length) {
    $('.custom-stock-pool-info>.error-tip').html('请先添加证券').removeClass('hidden');
    return;
  }

  var pool_name = $('.custom-stock-pool-name').val();
  if ('' == pool_name) {
    $('.custom-stock-pool-info>.error-tip').html('请输入股票池名称').removeClass('hidden');
    return;
  }
  if (pool_name.length > 20) {
    $('.custom-stock-pool-info>.error-tip').html('股票池名称不得超过20个字').removeClass('hidden');
    return;
  }

  $.ajax({
    url: '/rms-pub/stock_pool/add',
    type: 'post',
    data: {
      stock_id: stock_id_arr.join(','),
      pool_name: pool_name
    },
    success: function success(_ref13) {
      var msg = _ref13.msg,
          code = _ref13.code,
          data = _ref13.data;

      if (0 == code) {
        _getStockPool();
        jc.close();
        $.omsAlert('自定义股票池成功');
      } else {
        $('.custom-stock-pool-info>.error-tip').html(msg).removeClass('hidden');
      }
    },
    error: function error() {
      $.failNotice();
    }
  });
});

function searchStock(_this) {
  var inputStockCode = $(_this).val();
  var last_suggest_timestamp = new Date().valueOf();
  $('.custom-stock-pool-input').attr('last_suggest_timestamp', last_suggest_timestamp);
  $('.stock-input').addClass('loading');
  var str = (window.REQUEST_PREFIX || '') + '/oms/helper/code_genius?stock_code=' + inputStockCode;
  $.getJSON(str).done(function (res) {
    if (last_suggest_timestamp != $('.custom-stock-pool-input').attr('last_suggest_timestamp')) {
      return;
    }
    if (res.code == 0 || res.code == 1123124) {
      var html = '';
      res.data.forEach(function (e) {
        html += '<li data-id="' + e.stock_id + '" data-name="' + e.stock_name + '">' + e.stock_id + ' &nbsp; ' + e.stock_name + '</li>';
      });
      $('.custom-stock-suggest').html(html).slideDown(300);

      // 当只有一个符合条件时，默认选中该项。
      if (1 == res.code.length) {
        selectOneStock($('.custom-stock-suggest>li'));
      }
    } else {
      $.omsAlert('获取建议证券列表失败！', false, 300);
    }
  }).always(function () {
    if (last_suggest_timestamp != $('.custom-stock-pool-input').attr('last_suggest_timestamp')) {
      return;
    }
    $('.stock-input').removeClass('loading');
  });
}

function selectOneStock(_this) {
  // 用户选择时，记录正确的stock_id和stock_name
  var stock_id = $(_this).attr('data-id');
  var stock_name = $(_this).attr('data-name');
  $('.custom-stock-pool-input').attr('data-id', stock_id).attr('data-name', stock_name).val(stock_id);
  $('.custom-stock-suggested').html(stock_name).show();
  $('.custom-stock-suggest').slideUp(200);
}
//# sourceMappingURL=risk_special_edition.js.map
