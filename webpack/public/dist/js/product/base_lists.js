'use strict';

/**
 * author: liuzeyafzy
 * 账户管理页面
 */

function JS_base_lists(prefix) {
  var selectize = {};
  selectize.search_product = $('#search_product').selectize({
    valueField: 'value',
    labelField: 'label',
    create: true,
    createOnBlur: true,
    persist: false,
    allowEmptyOption: true,
    placeholder: '请选择或输入策略名',
    searchField: 'label',
    render: {
      item: function item(_item, escape) {
        return '<div class="item" data-value="' + _item.value + '" title="' + _item.label + '">' + escape(_item.label) + '</div>';
      },
      option: function option(item, escape) {
        var label = item.value;
        return '<div class="option" title="' + item.label + '">' + escape(item.label) + '</div>';
      }
    }
  })[0].selectize;

  var searchProductArr = [];
  // Begin 使用公共部分获取到的组合信息
  PRODUCTS.forEach(function (e) {
    if (e.is_running == true) {
      searchProductArr.push({
        label: e.name,
        value: e.name
      });
    }
  });
  selectize.search_product.addOption(searchProductArr);
  // selectize.search_product.setValue('');
  // End 使用公共部分获取到的组合信息

  var getCanChangeInfo = function getCanChangeInfo(callback) {
    $.ajax({
      url: prefix + '/product/get_canchange_base_pw_account',
      // data: {
      //   base_id: id
      // },
      success: function success(_ref) {
        var code = _ref.code,
            msg = _ref.msg,
            data = _ref.data;

        if (0 == code) {
          if (Object.prototype.toString.call(callback) === '[object Function]') {
            callback(data.lists);
          }
        } else {
          $.omsAlert(msg);
        }
      },
      error: function error() {
        // 列表合并显示的数据，并不需要提示错误信息
        $.clearLoading();
      }
    });
  };

  var accountList = new Vue({
    el: '#accountList',
    data: {
      selectize: selectize,
      // 账户信息
      // roboter_id:
      // name:                    名称
      // securities_id:           不是PB就是资金账户
      // securities_name:         所属证券
      // 初始资金
      // 资产总值                  total_amount
      // 可用余额                  available_amount改成balance_amount
      // able_split               是否可拆分 1可 2不可
      // child[]: product_id产品id, name产品名称, market_value证券市值, tmp_frozen_cash冻结资金, updated_at更新时间,
      //
      accountInfo: [],
      orgInfo: [],
      // 分页信息
      pageInfo: ''
    },
    methods: {
      getShowChildrenFlag: function getShowChildrenFlag(v) {
        return v == 'true';
      },
      toggleShowChildren: function toggleShowChildren(v) {
        v.showChildren = !v.showChildren;
      },
      getAccountInfo: function getAccountInfo() {
        FD.accountInfo.forEach(function (e) {
          e.showChildren = true;
        });
        var _this = this;
        getCanChangeInfo(function (canChangeData) {
          FD.accountInfo.forEach(function (e) {
            canChangeData.forEach(function (el) {
              if (e.id == el.base_id) {
                e.com_pw = el.com_pw;
                e.tx_pw = el.tx_pw;
              }
            });
          });
          _this.accountInfo = FD.accountInfo;
        });
      },
      getOrgInfo: function getOrgInfo() {
        this.orgInfo = FD.orgInfo;
      },
      searchAccountInfo: function searchAccountInfo() {
        var product_name = this.selectize.search_product.getValue();

        var _this = this;
        $.startLoading('正在搜索...');
        $.ajax({
          url: prefix + '/product/base_lists?format=json',
          data: {
            name: product_name
          },
          success: function success(_ref2) {
            var code = _ref2.code,
                msg = _ref2.msg,
                data = _ref2.data;

            if (0 === code) {
              _this.accountInfo.splice(0);
              getCanChangeInfo(function (canChangeData) {
                data.lists.forEach(function (e) {
                  e.showChildren = true;
                  canChangeData.forEach(function (el) {
                    if (e.id == el.base_id) {
                      e.com_pw = el.com_pw;
                      e.tx_pw = el.tx_pw;
                    }
                  });
                  _this.accountInfo.push(e);
                });
                $.clearLoading();
              });
            } else {
              $.omsAlert(msg);
              $.clearLoading();
            }
          },
          error: function error() {
            $.clearLoading();
          }
        });
      },
      getsecuritiesType: function getsecuritiesType(id) {
        if (/pb/i.test(id)) {
          return 'PB账户';
        } else {
          return '账户';
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
        location.href = prefix + '/product/add/' + v;
      },
      doConfig: function doConfig(v, type) {
        // location.href = prefix + '/product/setting_redirect?product_id=' + v;
        if (type) {
          location.href = prefix + '/product/' + type + '?product_id=' + v;
        } else {
          location.href = prefix + '/product/setting_redirect?product_id=' + v;
        }
      },
      showProgress: function showProgress(id, type) {
        // id: 账户id; type: 2为密码 1为通信码


      },
      doChangePassword: function doChangePassword(v, tx_pw) {
        // console.log(tx_pw);
        var jc_warn = $.confirm({
          title: '',
          content: '<div style="text-align: center;height: 150px;line-height: 150px;"><i class="warn-icon"></i>\u614E\u91CD\uFF01\u5BC6\u7801\u4FEE\u6539\u8FC7\u7A0B\u4E2D\u8D26\u53F7\u5C06\u65E0\u6CD5\u4E0B\u5355\uFF0C\u786E\u8BA4\u7EE7\u7EED\uFF1F</div>',
          closeIcon: true,
          confirmButton: ' 确定 ',
          confirm: function confirm() {
            jc_warn.close();
            jc_warn = null;
            var html = '';
            if (tx_pw) {
              html = '<form id="userpassword-form" class="common-form" style="margin-left: 40px;margin-top: 30px;">\n                  <span style="display:none;" class="user_id"></span>\n                  <div class="form-field" style="margin-left: 20px;">\n                      <label class="form-left">\u8D26\u6237</label>\n                      <span>' + v + '</span>\n                  </div>\n                  <div class="form-field" style="margin-left: 20px;">\n                      <label class="form-left">\u8D26\u6237\u5BC6\u7801<b>*</b></label>\n                      <input name="new_password" class="input-text new_password" style="width: 450px;" type="password" autocomplete="new_password" placeholder="\u8BF7\u8F93\u5165\u6B63\u786E\u5BC6\u7801\uFF08\u591A\u6B21\u63D0\u4EA4\u9519\u8BEF\u5BC6\u7801\u53EF\u80FD\u5BFC\u81F4\u7CFB\u7EDF\u88AB\u9501\uFF0C\u8BF7\u8C28\u614E\uFF09"  />\n                  </div>\n                  <div class="form-field" style="margin-left: 20px;">\n                      <label class="form-left">\u901A\u8BAF\u5BC6\u7801<b>*</b></label>\n                      <input name="tx_new_passwd" class="input-text tx_new_passwd" style="width: 450px;" type="password" autocomplete="new_password" placeholder="\u8BF7\u8F93\u5165\u6B63\u786E\u901A\u8BAF\u5BC6\u7801"  />\n                  </div>\n                  <div class="form-btns" style="margin-left: 0;text-align: center;">\n                      <button type="submit" class="submit_btn">\u786E\u5B9A</button>\n                      <div style="display:block;clear:both;"></div>\n                  </div>\n              </form>';
            } else {
              html = '<form id="userpassword-form" class="common-form" style="margin-left: 40px;margin-top: 30px;">\n                  <span style="display:none;" class="user_id"></span>\n                  <div class="form-field" style="margin-left: 20px;">\n                      <label class="form-left">\u8D26\u6237</label>\n                      <span>' + v + '</span>\n                  </div>\n                  <div class="form-field" style="margin-left: 20px;">\n                      <label class="form-left">\u8D26\u6237\u5BC6\u7801<b>*</b></label>\n                      <input name="new_password" class="input-text new_password" style="width: 450px;" type="password" autocomplete="new_password" placeholder="\u8BF7\u8F93\u5165\u6B63\u786E\u5BC6\u7801\uFF08\u591A\u6B21\u63D0\u4EA4\u9519\u8BEF\u5BC6\u7801\u53EF\u80FD\u5BFC\u81F4\u7CFB\u7EDF\u88AB\u9501\uFF0C\u8BF7\u8C28\u614E\uFF09"  />\n                  </div>\n                  <div class="form-btns" style="margin-left: 0;text-align: center;">\n                      <button type="submit" class="submit_btn">\u786E\u5B9A</button>\n                      <div style="display:block;clear:both;"></div>\n                  </div>\n              </form>';
            }
            var jc = $.confirm({
              title: '修改密码',
              content: html,
              closeIcon: true,
              confirmButton: false,
              cancelButton: false
            });
            $("#userpassword-form").validate({
              'errorClass': 'confirm-tips',
              // 'errorElement': 'div',
              'rules': {
                'new_password': {
                  //   checkPassword: true,
                  required: true
                },
                'tx_new_passwd': {
                  //   checkPassword: true,
                  required: true
                }
              },
              messages: {
                'new_password': {
                  //   checkPassword: '只允许输入字母与数字',
                  required: '请输入账户密码'
                },
                'tx_new_passwd': {
                  //   checkPassword: '只允许输入字母与数字',
                  required: '请输入通讯密码'
                }
              },
              errorPlacement: function errorPlacement(error, element) {
                error.appendTo(element.parents(".form-field"));
              },
              // errorElement: function(error, element) {
              //   debugger;
              //   error.appendTo(element.parents(".form-field").next("div"));
              // },
              submitHandler: function submitHandler(form) {
                var login_password = $('.login_password').val();
                var new_password = $('.new_password').val();
                var tx_new_passwd = $('.tx_new_passwd').val();
                $.startLoading('正在添加...');
                $.ajax({
                  url: prefix + '/product/change_base_password',
                  type: 'post',
                  data: {
                    base_id: v,
                    // type: 2,//2为密码，1为通信码
                    // src_passwd: login_password,
                    new_passwd: new_password,
                    tx_new_passwd: tx_new_passwd
                  },
                  success: function success(_ref3) {
                    var code = _ref3.code,
                        msg = _ref3.msg,
                        data = _ref3.data;

                    $.clearLoading();
                    if (0 == code) {
                      // jc_warn.close();
                      jc.close();
                      $.omsAlert(msg);
                      // jc_warn = null;
                      jc = null;
                    } else {
                      $.omsAlert(msg);
                    }
                  },
                  error: function error() {
                    $.clearLoading();
                  }
                });
              }
            });
          },
          cancelButton: false
        });
      },
      doChangeComunicationCode: function doChangeComunicationCode(v) {
        var jc = $.confirm({
          title: '修改通信码',
          content: '<form id="usercode-form" class="common-form" style="margin-left: 40px;margin-top: 30px;">\n              <span style="display:none;" class="user_id"></span>\n              <div class="form-field" style="margin-left: 20px;">\n                  <label class="form-left">\u8D26\u6237</label>\n                  <span>' + v + '</span>\n              </div>\n              <div class="form-field" style="margin-left: 20px;">\n                  <label class="form-left">\u539F\u901A\u4FE1\u7801<b>*</b></label>\n                  <input name="login_code" class="input-text login_code" type="password" placeholder="\u8BF7\u8F93\u5165\u539F\u901A\u4FE1\u7801"  />\n              </div>\n              <div class="form-field" style="margin-left: 20px;">\n                  <label class="form-left">\u65B0\u901A\u4FE1\u7801<b>*</b></label>\n                  <input name="tx_new_passwd" class="input-text tx_new_passwd" type="password" autocomplete="new_password" placeholder="\u8BF7\u8F93\u5165\u65B0\u901A\u4FE1\u7801"  />\n              </div>\n              <div class="form-btns" style="margin-left: 0;text-align: center;">\n                  <button type="submit" class="submit_btn">\u786E\u5B9A</button>\n                  <div style="display:block;clear:both;"></div>\n              </div>\n          </form>',
          closeIcon: true,
          confirmButton: false,
          cancelButton: false
        });

        $("#usercode-form").validate({
          'errorClass': 'confirm-tips',
          // 'errorElement': 'div',
          'rules': {
            'login_code': {
              checkPassword: true,
              required: true
            },
            'tx_new_passwd': {
              checkPassword: true,
              required: true
            }
          },
          messages: {
            'login_code': {
              checkPassword: '只允许输入字母与数字',
              required: '请输入账户密码'
            },
            'tx_new_passwd': {
              checkPassword: '只允许输入字母与数字',
              required: '请输入通讯密码'
            }
          },
          errorPlacement: function errorPlacement(error, element) {
            error.appendTo(element.parents(".form-field"));
          },
          // errorElement: function(error, element) {
          //   debugger;
          //   error.appendTo(element.parents(".form-field").next("div"));
          // },
          submitHandler: function submitHandler(form) {
            var jc_warn = $.confirm({
              title: '',
              content: '<div style="text-align: center;height: 150px;line-height: 150px;"><i class="warn-icon"></i>\u614E\u91CD\uFF01\u901A\u4FE1\u7801\u4FEE\u6539\u8FC7\u7A0B\u4E2D\u8D26\u53F7\u5C06\u65E0\u6CD5\u4E0B\u5355\uFF0C\u786E\u8BA4\u7EE7\u7EED\uFF1F</div>',
              closeIcon: true,
              confirmButton: ' 确定 ',
              confirm: function confirm() {
                var login_code = $('.login_code').val();
                var tx_new_passwd = $('.tx_new_passwd').val();
                $.startLoading('正在添加...');
                $.ajax({
                  url: prefix + '/product/change_base_password',
                  type: 'post',
                  data: {
                    base_id: v,
                    type: 1, //2为密码，1为通信码
                    tx_src_passwd: login_code,
                    tx_new_passwd: tx_new_passwd
                  },
                  success: function success(_ref4) {
                    var code = _ref4.code,
                        msg = _ref4.msg,
                        data = _ref4.data;

                    $.clearLoading();
                    if (0 == code) {
                      jc_warn.close();
                      jc.close();
                      $.omsAlert(msg);
                      jc_warn = null;
                      jc = null;
                    } else {
                      $.clearLoading();
                      $.omsAlert(msg);
                    }
                  },
                  error: function error() {
                    $.clearLoading();
                  }
                });
              },
              cancelButton: false
            });
          }
        });
      }
    }
  });

  accountList.getAccountInfo();
  accountList.getOrgInfo();

  $(document).on('click', '.btn_search', function () {
    accountList.searchAccountInfo();
  });

  // $(document).trigger('stopGetUpdateInfo');
}
//# sourceMappingURL=base_lists.js.map
