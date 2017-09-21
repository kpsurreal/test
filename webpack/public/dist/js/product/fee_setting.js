'use strict';

/**
 * author: liuzeyafzy
 * 费用信息页面
 */
function JS_fee_setting(prefix) {
  var validPreVal = void 0;
  // market 1股票 2基金 0公关费用
  var feeStaticData = [{
    type: 1,
    market: 1,
    name: '印花税',
    sh_fee_prefix: '上交所：',
    sz_fee_prefix: '深交所：',
    fee_prefix: '按成交金额的',
    fee_suffix: '收取',
    fee_unit: '‰',
    has_upper_limit: false,
    has_lower_limit: false,
    fee_limit_unit: '元',
    fee_text: '收取规则：卖出时单向收取' //、上交所/深交所收取
  }, {
    type: 2,
    market: 1,
    name: '过户费',
    sh_fee_prefix: '上交所：',
    sz_fee_prefix: '深交所：',
    fee_prefix: '按成交金额的',
    fee_suffix: '收取',
    fee_unit: '‰',
    has_upper_limit: false,
    has_lower_limit: false,
    fee_limit_unit: '元',
    fee_text: '收取规则：买卖双方收取' //、上交所/深交所收取
  }, {
    type: 3,
    market: 1,
    name: '经手费',
    sh_fee_prefix: '上交所：',
    sz_fee_prefix: '深交所：',
    fee_prefix: '按成交金额的',
    fee_suffix: '收取',
    fee_unit: '‰',
    has_upper_limit: false,
    has_lower_limit: false,
    fee_limit_unit: '元',
    fee_text: '收取规则：买卖双向收取' //、上交所收取
  }, {
    type: 3,
    market: 2, //基金
    name: '经手费',
    sh_fee_prefix: '上交所：',
    sz_fee_prefix: '深交所：',
    fee_prefix: '按成交金额的',
    fee_suffix: '收取',
    fee_unit: '‰',
    has_upper_limit: false,
    has_lower_limit: false,
    fee_limit_unit: '元',
    fee_text: '收取规则：买卖双向收取（货币ETF、债券ETF暂免）'
  }, {
    type: 4,
    market: 1,
    name: '证管费',
    sh_fee_prefix: '上交所：',
    sz_fee_prefix: '深交所：',
    fee_prefix: '按成交金额的',
    fee_suffix: '收取',
    fee_unit: '‰',
    has_upper_limit: false,
    has_lower_limit: false,
    fee_limit_unit: '元',
    fee_text: '收取规则：买卖双向收取' //、上交所收取
  }, {
    type: 5,
    market: 1,
    name: '交易佣金',
    sh_fee_prefix: '上交所：',
    sz_fee_prefix: '深交所：',
    fee_prefix: '按成交金额的',
    fee_suffix: '收取',
    fee_unit: '‰',
    has_upper_limit: false,
    has_lower_limit: true,
    fee_limit_unit: '元',
    fee_text: '收取规则：买卖双向收取' //、上交所/深交所收取
  }, {
    type: 5,
    market: 2, //基金
    name: '交易佣金',
    sh_fee_prefix: '上交所：',
    sz_fee_prefix: '深交所：',
    fee_prefix: '按成交金额的',
    fee_suffix: '收取',
    fee_unit: '‰',
    has_upper_limit: false,
    has_lower_limit: true,
    fee_limit_unit: '元',
    fee_text: '收取规则：买卖双向收取'
  }, {
    type: 6,
    market: 0,
    name: '管理费',
    fee_prefix: '净资产的年化',
    fee_suffix: '',
    fee_unit: '‰',
    has_upper_limit: false,
    has_lower_limit: false,
    fee_limit_unit: '元',
    showRate: true,
    fee_text: '收取规则：每日计提（每日计提管理费=当前资产总值*',
    fee_textNext: '‰）/当年天数'
  }, {
    type: 7,
    market: 0,
    name: '退出费',
    fee_prefix: '净资产的年化',
    fee_suffix: '',
    fee_unit: '‰',
    has_upper_limit: false,
    has_lower_limit: false,
    fee_limit_unit: '元',
    showRate: true,
    fee_text: '收取规则：每日计提（每日计退出费=当前资产总值*',
    fee_textNext: '‰）/当年天数'
  }];

  initProductHeader(prefix);

  // FD.org_info
  var productMenu = new Vue({
    el: '#productMenu',
    data: {
      active: 'fee_setting',
      permission: FD.permission,
      disabled: FD.fee_mode == 1 ? 'fee_setting' : ''
    },
    methods: {
      goto: function goto(e) {
        var li = $(e.currentTarget);
        if (!li.hasClass('active') && !li.hasClass('disabled')) {
          location.href = prefix + '/product/' + li.attr('data-str') + '?product_id=' + FD.product_id;
        }
      }
    }
  });

  var feeList = new Vue({
    el: '#rules_content',
    computed: {
      rulesStockLevy: function rulesStockLevy() {
        var arr = [];
        this.rulesInfo.forEach(function (e) {
          if (e.market == 1 && e.status == 0) {
            //status 0征收 1免征； market 1股票 2基金 0公共费用
            e.fee_rate = numeral(e.fee_rate).format('0,0.000000');
            e.fee_lower_limit = numeral(e.fee_lower_limit).format('0,0.000');
            e.fee_upper_limit = numeral(e.fee_upper_limit).format('0,0.000');
            e.sh_fee_rate = numeral(e.sh_fee_rate).format('0,0.000000');
            e.sh_fee_lower_limit = numeral(e.sh_fee_lower_limit).format('0,0.000');
            e.sh_fee_upper_limit = numeral(e.sh_fee_upper_limit).format('0,0.000');
            e.sz_fee_rate = numeral(e.sz_fee_rate).format('0,0.000000');
            e.sz_fee_lower_limit = numeral(e.sz_fee_lower_limit).format('0,0.000');
            e.sz_fee_upper_limit = numeral(e.sz_fee_upper_limit).format('0,0.000');
            arr.push(e);
          }
        });
        return arr;
      },
      rulesFundLevy: function rulesFundLevy() {
        var arr = [];
        this.rulesInfo.forEach(function (e) {
          if (e.market == 2 && e.status == 0) {
            e.fee_rate = numeral(e.fee_rate).format('0,0.000000');
            e.fee_lower_limit = numeral(e.fee_lower_limit).format('0,0.000');
            e.fee_upper_limit = numeral(e.fee_upper_limit).format('0,0.000');
            e.sh_fee_rate = numeral(e.sh_fee_rate).format('0,0.000000');
            e.sh_fee_lower_limit = numeral(e.sh_fee_lower_limit).format('0,0.000');
            e.sh_fee_upper_limit = numeral(e.sh_fee_upper_limit).format('0,0.000');
            e.sz_fee_rate = numeral(e.sz_fee_rate).format('0,0.000000');
            e.sz_fee_lower_limit = numeral(e.sz_fee_lower_limit).format('0,0.000');
            e.sz_fee_upper_limit = numeral(e.sz_fee_upper_limit).format('0,0.000');
            arr.push(e);
          }
        });
        return arr;
      },
      rulesCommonLevy: function rulesCommonLevy() {
        var arr = [];
        this.rulesInfo.forEach(function (e) {
          if (e.market == 0 && e.status == 0) {
            e.fee_rate = numeral(e.fee_rate).format('0,0.000000');
            e.fee_lower_limit = numeral(e.fee_lower_limit).format('0,0.000');
            e.fee_upper_limit = numeral(e.fee_upper_limit).format('0,0.000');
            arr.push(e);
          }
        });
        return arr;
      },
      rulesStockExempt: function rulesStockExempt() {
        var arr = [];
        this.rulesInfo.forEach(function (e) {
          if (e.market == 1 && e.status == 1) {
            e.fee_rate = numeral(e.fee_rate).format('0,0.000000');
            e.fee_lower_limit = numeral(e.fee_lower_limit).format('0,0.000');
            e.fee_upper_limit = numeral(e.fee_upper_limit).format('0,0.000');
            e.sh_fee_rate = numeral(e.sh_fee_rate).format('0,0.000000');
            e.sh_fee_lower_limit = numeral(e.sh_fee_lower_limit).format('0,0.000');
            e.sh_fee_upper_limit = numeral(e.sh_fee_upper_limit).format('0,0.000');
            e.sz_fee_rate = numeral(e.sz_fee_rate).format('0,0.000000');
            e.sz_fee_lower_limit = numeral(e.sz_fee_lower_limit).format('0,0.000');
            e.sz_fee_upper_limit = numeral(e.sz_fee_upper_limit).format('0,0.000');
            arr.push(e);
          }
        });
        return arr;
      },
      rulesFundExempt: function rulesFundExempt() {
        var arr = [];
        this.rulesInfo.forEach(function (e) {
          if (e.market == 2 && e.status == 1) {
            e.fee_rate = numeral(e.fee_rate).format('0,0.000000');
            e.fee_lower_limit = numeral(e.fee_lower_limit).format('0,0.000');
            e.fee_upper_limit = numeral(e.fee_upper_limit).format('0,0.000');
            e.sh_fee_rate = numeral(e.sh_fee_rate).format('0,0.000000');
            e.sh_fee_lower_limit = numeral(e.sh_fee_lower_limit).format('0,0.000');
            e.sh_fee_upper_limit = numeral(e.sh_fee_upper_limit).format('0,0.000');
            e.sz_fee_rate = numeral(e.sz_fee_rate).format('0,0.000000');
            e.sz_fee_lower_limit = numeral(e.sz_fee_lower_limit).format('0,0.000');
            e.sz_fee_upper_limit = numeral(e.sz_fee_upper_limit).format('0,0.000');
            arr.push(e);
          }
        });
        return arr;
      },
      rulesCommonExempt: function rulesCommonExempt() {
        var arr = [];
        this.rulesInfo.forEach(function (e) {
          if (e.market == 0 && e.status == 1) {
            e.fee_rate = numeral(e.fee_rate).format('0,0.000000');
            e.fee_lower_limit = numeral(e.fee_lower_limit).format('0,0.000');
            e.fee_upper_limit = numeral(e.fee_upper_limit).format('0,0.000');
            arr.push(e);
          }
        });
        return arr;
      }
    },
    data: {
      editData: {
        id: '',
        market: '',
        fee_type: '',
        fee_rate: '',
        fee_upper_limit: '',
        fee_lower_limit: ''
      },
      displayInfo: {
        rulesStockLevy: true,
        rulesFundLevy: true,
        rulesCommonLevy: true,
        rulesStockExempt: true,
        rulesFundExempt: true,
        rulesCommonExempt: true
      },
      rulesInfo: [],
      a: []
    },
    watch: {
      editData: {
        handler: function handler(val, oldVal) {
          var flag = false;
          if (/^\d+\.?\d{0,6}$/.test(val.fee_rate) || val.fee_rate == '' || val.fee_rate == 0) {
            ;
          } else {
            flag = true;
            val.fee_rate = numeral(validPreVal).format('0,0.000000');
          }

          if (/^\d+\.?\d{0,3}$/.test(val.fee_upper_limit) || val.fee_upper_limit == '' || val.fee_upper_limit == 0) {
            ;
          } else {
            flag = true;
            val.fee_upper_limit = numeral(validPreVal).format('0,0.000');
          }

          if (/^\d+\.?\d{0,3}$/.test(val.fee_lower_limit) || val.fee_lower_limit == '' || val.fee_lower_limit == 0) {
            ;
          } else {
            flag = true;
            val.fee_lower_limit = numeral(validPreVal).format('0,0.000');
          }

          // market不为0，则不是“其他费用”，那么额外判断 sh_ 和 sz_ 开头的数据
          if (val.market != 0) {
            if (/^\d+\.?\d{0,6}$/.test(val.sh_fee_rate) || val.sh_fee_rate == '' || val.sh_fee_rate == 0) {
              ;
            } else {
              flag = true;
              val.sh_fee_rate = numeral(validPreVal).format('0,0.000000');
            }

            if (/^\d+\.?\d{0,3}$/.test(val.sh_fee_upper_limit) || val.sh_fee_upper_limit == '' || val.sh_fee_upper_limit == 0) {
              ;
            } else {
              flag = true;
              val.sh_fee_upper_limit = numeral(validPreVal).format('0,0.000');
            }

            if (/^\d+\.?\d{0,3}$/.test(val.sh_fee_lower_limit) || val.sh_fee_lower_limit == '' || val.sh_fee_lower_limit == 0) {
              ;
            } else {
              flag = true;
              val.sh_fee_lower_limit = numeral(validPreVal).format('0,0.000');
            }

            if (/^\d+\.?\d{0,6}$/.test(val.sz_fee_rate) || val.sz_fee_rate == '' || val.sz_fee_rate == 0) {
              ;
            } else {
              flag = true;
              val.sz_fee_rate = numeral(validPreVal).format('0,0.000000');
            }

            if (/^\d+\.?\d{0,3}$/.test(val.sz_fee_upper_limit) || val.sz_fee_upper_limit == '' || val.sz_fee_upper_limit == 0) {
              ;
            } else {
              flag = true;
              val.sz_fee_upper_limit = numeral(validPreVal).format('0,0.000');
            }

            if (/^\d+\.?\d{0,3}$/.test(val.sz_fee_lower_limit) || val.sz_fee_lower_limit == '' || val.sz_fee_lower_limit == 0) {
              ;
            } else {
              flag = true;
              val.sz_fee_lower_limit = numeral(validPreVal).format('0,0.000');
            }
          }

          if (true == flag) {
            this.editData = Object.assign({}, this.editData, val);
          }
        },
        deep: true
      }
    },
    methods: {
      toggleDidplay: function toggleDidplay(v) {
        this.displayInfo[v] = !this.displayInfo[v];
      },
      doEdit: function doEdit(id) {
        var _this = this;
        this.rulesInfo.forEach(function (e) {
          if (e.id == id) {
            _this.editData = {
              id: id,
              market: e.market,
              fee_type: e.fee_type,
              fee_rate: numeral(e.fee_rate).format('0,0.000000'),
              fee_upper_limit: numeral(e.fee_upper_limit).format('0,0.000'),
              fee_lower_limit: numeral(e.fee_lower_limit).format('0,0.000'),

              sh_fee_rate: numeral(e.sh_fee_rate).format('0,0.000000'),
              sh_fee_lower_limit: numeral(e.sh_fee_lower_limit).format('0,0.000'),
              sh_fee_upper_limit: numeral(e.sh_fee_upper_limit).format('0,0.000'),
              sz_fee_rate: numeral(e.sz_fee_rate).format('0,0.000000'),
              sz_fee_lower_limit: numeral(e.sz_fee_lower_limit).format('0,0.000'),
              sz_fee_upper_limit: numeral(e.sz_fee_upper_limit).format('0,0.000')
            };
          }
        });
      },
      doExempt: function doExempt(id) {
        var _this = this;
        this.rulesInfo.forEach(function (e) {
          if (e.id == id) {
            // e.status = 1;
            _this.changeStatus(id, 1);
          }
        });
      },
      doLevy: function doLevy(id) {
        var _this = this;
        this.rulesInfo.forEach(function (e) {
          if (e.id == id) {
            // e.status = 0;
            _this.changeStatus(id, 0);
          }
        });
      },
      changeStatus: function changeStatus(id, status) {
        var _this = this;
        $.startLoading('正在修改...');
        $.ajax({
          url: prefix + '/portfolio/fee-update-status',
          type: 'post',
          data: {
            id: id,
            status: status
          },
          success: function success(_ref) {
            var code = _ref.code,
                msg = _ref.msg,
                data = _ref.data;

            $.clearLoading();
            if (0 == code) {
              $.omsAlert('修改成功');
              _this.getRulesInfo();
            } else {
              $.omsAlert(msg);
            }
          },
          error: function error() {
            $.clearLoading();
            $.failNotice('网络失败，请重试');
          }
        });
      },
      cancelEdit: function cancelEdit() {
        this.editData = {
          id: '',
          market: '',
          fee_type: '',
          fee_rate: '',
          fee_upper_limit: '',
          fee_lower_limit: ''
        };
      },
      saveEdit: function saveEdit() {
        var _this = this;
        var id = this.editData.id;
        var fee_rate = this.editData.fee_rate;
        var fee_upper_limit = this.editData.fee_upper_limit;
        var fee_lower_limit = this.editData.fee_lower_limit;

        var sh_fee_rate = this.editData.sh_fee_rate;
        var sh_fee_upper_limit = this.editData.sh_fee_upper_limit;
        var sh_fee_lower_limit = this.editData.sh_fee_lower_limit;
        var sz_fee_rate = this.editData.sz_fee_rate;
        var sz_fee_upper_limit = this.editData.sz_fee_upper_limit;
        var sz_fee_lower_limit = this.editData.sz_fee_lower_limit;

        var status = true;
        if (isNaN(Number(fee_rate)) || false == /^\-?\d+(\.\d{1,6})?$/.test(fee_rate) || '' == fee_rate) {
          status = false;
        }
        if (isNaN(Number(fee_upper_limit)) || false == /^\-?\d+(\.\d{1,3})?$/.test(fee_upper_limit) || '' == fee_upper_limit) {
          status = false;
        }
        if (isNaN(Number(fee_lower_limit)) || false == /^\-?\d+(\.\d{1,3})?$/.test(fee_lower_limit) || '' == fee_lower_limit) {
          status = false;
        }

        var ajaxData = {
          id: id,
          fee_rate: fee_rate,
          fee_upper_limit: fee_upper_limit,
          fee_lower_limit: fee_lower_limit
        };

        // market不为0，则不是“其他费用”，那么额外判断 sh_ 和 sz_ 开头的数据
        if (!(0 == this.editData.market)) {
          if (isNaN(Number(sh_fee_rate)) || false == /^\-?\d+(\.\d{1,6})?$/.test(sh_fee_rate) || '' == sh_fee_rate) {
            status = false;
          }
          if (isNaN(Number(sh_fee_upper_limit)) || false == /^\-?\d+(\.\d{1,3})?$/.test(sh_fee_upper_limit) || '' == sh_fee_upper_limit) {
            status = false;
          }
          if (isNaN(Number(sh_fee_lower_limit)) || false == /^\-?\d+(\.\d{1,3})?$/.test(sh_fee_lower_limit) || '' == sh_fee_lower_limit) {
            status = false;
          }

          if (isNaN(Number(sz_fee_rate)) || false == /^\-?\d+(\.\d{1,6})?$/.test(sz_fee_rate) || '' == sz_fee_rate) {
            status = false;
          }
          if (isNaN(Number(sz_fee_upper_limit)) || false == /^\-?\d+(\.\d{1,3})?$/.test(sz_fee_upper_limit) || '' == sz_fee_upper_limit) {
            status = false;
          }
          if (isNaN(Number(sz_fee_lower_limit)) || false == /^\-?\d+(\.\d{1,3})?$/.test(sz_fee_lower_limit) || '' == sz_fee_lower_limit) {
            status = false;
          }
          ajaxData.fee_rate = sh_fee_rate;
          ajaxData.fee_upper_limit = sh_fee_upper_limit;
          ajaxData.fee_lower_limit = sh_fee_lower_limit;
          ajaxData.sz_fee_rate = sz_fee_rate;
          ajaxData.sz_fee_upper_limit = sz_fee_upper_limit;
          ajaxData.sz_fee_lower_limit = sz_fee_lower_limit;
        }

        if (false == status) {
          $.omsAlert('请输入正确的数字');
          return;
        }
        $.startLoading('正在修改...');
        $.ajax({
          url: prefix + '/portfolio/fee-modify',
          data: ajaxData,
          type: 'post',
          success: function success(_ref2) {
            var code = _ref2.code,
                msg = _ref2.msg,
                data = _ref2.data;

            $.clearLoading();
            if (0 == code) {
              _this.cancelEdit();
              _this.getRulesInfo();
            } else {
              $.omsAlert(msg);
            }
          },
          error: function error() {
            $.clearLoading();
            $.failNotice('网络错误，请重试');
          }
        });
      },
      hasFeeLowerLimit: function hasFeeLowerLimit(type, market) {
        var rtn = false;
        feeStaticData.forEach(function (e) {
          if (e.type == type && e.market == market && e.has_lower_limit) {
            rtn = e.name;
          }
        });
        return rtn;
      },
      hasFeeUpperLimit: function hasFeeUpperLimit(type, market) {
        var rtn = false;
        feeStaticData.forEach(function (e) {
          if (e.type == type && e.market == market && e.has_upper_limit) {
            rtn = e.name;
          }
        });
        return rtn;
      },
      getFeeName: function getFeeName(type, market) {
        var rtn = '';
        feeStaticData.forEach(function (e) {
          if (e.type == type && e.market == market) {
            rtn = e.name;
          }
        });
        return rtn;
      },
      getFeePrefix: function getFeePrefix(type, market, preStr) {
        var rtn = '';
        feeStaticData.forEach(function (e) {
          if (e.type == type && e.market == market) {
            if (preStr) {
              rtn = e[preStr + 'fee_prefix'] + e.fee_prefix;
            } else {
              rtn = e.fee_prefix;
            }
          }
        });
        return rtn;
      },
      getFeeUnit: function getFeeUnit(type, market) {
        var rtn = '';
        feeStaticData.forEach(function (e) {
          if (e.type == type && e.market == market) {
            rtn = e.fee_unit;
          }
        });
        return rtn;
      },
      getFeeSuffix: function getFeeSuffix(type, market) {
        var rtn = '';
        feeStaticData.forEach(function (e) {
          if (e.type == type && e.market == market) {
            rtn = e.fee_suffix;
          }
        });
        return rtn;
      },
      getFeeText: function getFeeText(type, rate, market) {
        var rtn = '';
        feeStaticData.forEach(function (e) {
          if (e.type == type && e.market == market) {
            if (e.showRate == true) {
              rtn = e.fee_text + rate + e.fee_textNext;
            } else {
              rtn = e.fee_text;
            }
          }
        });
        return rtn;
      },
      urlBack: function urlBack() {
        location.href = prefix + '/product/base_lists';
      },
      doSaveTpl: function doSaveTpl() {
        $.startLoading('正在保存...');
        $.ajax({
          url: prefix + '/portfolio/fee-save-template',
          type: 'post',
          data: {
            product_id: FD.product_id
          },
          success: function success(_ref3) {
            var code = _ref3.code,
                msg = _ref3.msg,
                data = _ref3.data;

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
      getRulesInfo: function getRulesInfo() {
        var _this = this;
        $.ajax({
          url: prefix + '/portfolio/fee-list/' + FD.product_id,
          type: 'get',
          success: function success(_ref4) {
            var code = _ref4.code,
                msg = _ref4.msg,
                data = _ref4.data;

            data.forEach(function (e) {
              e.sh_fee_rate = e.fee_rate;
              e.sh_fee_lower_limit = e.fee_lower_limit;
              e.sh_fee_upper_limit = e.fee_upper_limit;
            });
            feeList.rulesInfo = data;
          },
          error: function error() {}
        });
      }
    }
  });

  feeList.getRulesInfo();

  $(document).on('keydown', '.rules_input>input', function (e) {
    validPreVal = $(this).val();
  });
}
//# sourceMappingURL=fee_setting.js.map
