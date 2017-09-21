'use strict';

/**
 * author: liuzeyafzy
 * 账户基础信息页面
 */
function JS_base_setting(prefix) {
  var productHeader = initProductHeader(prefix);

  // FD.org_info
  var productMenu = new Vue({
    el: '#productMenu',
    data: {
      active: 'base_setting',
      permission: FD.permission,
      disabled: FD.fee_mode == 1 ? 'fee_setting' : '' //1是同步 2是2清
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

  var max_user = 0;
  var user_num = 0;
  var formAdd = new Vue({
    el: '#form_add_vue',
    // computed: {
    //   FD_operator_uid: function(){
    //     return FD.operator_uid;
    //   }
    // },
    data: {
      FD: {
        product_id: FD.product_id,
        product_name: FD.product_name,
        volume: parseInt(FD.volume) || 0,
        base_name: FD.base_name,
        is_forever: FD.is_forever,
        operator_uid: FD.operator_uid,
        auto_verify: FD.auto_verify,
        begin_capital: FD.begin_capital,
        collect_capital: FD.collect_capital,
        is_running: FD.is_running,
        org_info: FD.org_info,
        lever_ratio: FD.lever_ratio,
        available_amount: FD.available_amount
      },
      managerInfo: []
    },
    methods: {
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
      getManagers: function getManagers(callBack) {
        var _this = this;
        $.ajax({
          type: 'get',
          url: '/bms-pub/user/org_info',
          success: function success(_ref) {
            var code = _ref.code,
                msg = _ref.msg,
                data = _ref.data;

            if (0 == code) {
              max_user = data.max_user;
              user_num = data.user_num;
              $.ajax({
                type: 'get',
                url: '/bms-pub/user/role_users',
                success: function success(_ref2) {
                  var code = _ref2.code,
                      msg = _ref2.msg,
                      data = _ref2.data;

                  if (0 == code) {
                    var managerArr = [];
                    Object.keys(data).forEach(function (e) {
                      managerArr.push({
                        name: data[e],
                        value: e
                      });
                    });
                    if ('' == _this.FD.operator_uid || undefined == _this.FD.operator_uid || 0 == _this.FD.operator_uid) {
                      managerArr.push({
                        name: '请选择基金经理',
                        value: _this.FD.operator_uid,
                        status: 2
                      });
                    } else {
                      if (managerArr.some(function (e) {
                        return e.value == _this.FD.operator_uid;
                      })) {
                        ;
                      } else {
                        managerArr.push({
                          name: productHeader.userInfo.nick_name + '（已注销）',
                          value: _this.FD.operator_uid,
                          status: productHeader.userInfo.status
                        });
                      }
                    }

                    _this.managerInfo = managerArr;

                    if (Object.prototype.toString.call(callBack) === '[object Function]') {
                      callBack.apply(this, data);
                    }
                  } else {
                    $.omsAlert(msg);
                  }
                },
                error: function error() {}
              });
            }
          },
          error: function error() {
            $.failNotice();
          }
        });
      },
      createManager: function (_createManager) {
        function createManager() {
          return _createManager.apply(this, arguments);
        }

        createManager.toString = function () {
          return _createManager.toString();
        };

        return createManager;
      }(function () {
        if (user_num >= max_user) {
          $.confirm({
            title: '已达上限',
            content: '<div style="text-align: center;height: 150px;line-height: 150px;"><i class="warn-icon"></i>当前用户数已达上限' + max_user + '，如需增加，请联系我们。</div>',
            closeIcon: true,
            confirmButton: false,
            cancelButton: ' 确定 '
          });
        } else {
          var _this = this;
          // 这里调用的事config.js里面的方法
          createManager(function (data) {
            _this.getManagers(function () {
              var user_id = data.user_id;

              Vue.nextTick(function () {
                Vue.set(_this.FD, 'operator_uid', user_id);
              });
            });
          });
        }
      }),
      doCancel: function doCancel() {
        location.href = prefix + '/product/base_lists';
      }
    }
  });

  if (FD.org_info.theme == 3) {
    // 专户版
    validateAccountSplitV2();
  } else {
    // 机构版
    formAdd.getManagers();
    // getRolePermissions(prefix);
    validateAccountSplit();
  }

  function validateAccountSplit() {
    $("#form_add").validate({
      errorClass: 'confirm-tips',
      rules: {
        'name': {
          required: true
        },
        'volume': {
          required: true,
          digits: true
        },
        'init_capital': {
          required: true,
          checkNumberTwoPad: true
        },
        'operator_uid': {
          required: true
        }
      },
      messages: {
        'name': {
          required: '请输入策略名称'
        },
        'volume': {
          required: '请输入份额',
          digits: '请输入整数'
        },
        'init_capital': {
          required: '请输入初始资金',
          checkNumberTwoPad: '请输入正确的数字'
        },
        'operator_uid': {
          required: '请选择基金经理'
        }
      },
      errorPlacement: function errorPlacement(error, element) {
        error.appendTo(element.parent());
      },
      submitHandler: function submitHandler(form) {
        var name = $('#form_add [name=name]').val();
        var init_capital = $('#form_add [name=init_capital]').val();
        var operator_uid = $('#form_add [name=operator_uid]').val();
        var volume = $('#form_add [name=volume]').val();

        $.startLoading('正在保存...');
        $.ajax({
          type: 'post',
          url: prefix + '/product/edit',
          data: {
            product_id: FD.product_id,
            name: name,
            volume: volume,
            collect_capital: FD.begin_capital,
            operator_uid: operator_uid,
            auto_verify: $('#form_add [name=autoVerify]').prop('checked') == true ? 1 : 0
          },
          success: function success(_ref3) {
            var code = _ref3.code,
                msg = _ref3.msg,
                data = _ref3.data;

            if (0 == code) {
              $.clearLoading();
              productHeader.getGroupInfo();
              productHeader.getBalanceInfo();
              $.omsAlert('修改成功');
            } else {
              $.clearLoading();
              $.omsAlert(msg);
            }
          },
          error: function error() {
            $.clearLoading();
            $.failNotice('网络异常，请重试');
          }
        });

        return false;
      }
    });
  };

  function validateAccountSplitV2() {
    $("#form_add").validate({
      errorClass: 'confirm-tips',
      rules: {
        'name': {
          required: true
        },
        // 'password': {
        //   // checkPassword: true
        // },
        'lever_ratio': {
          min: 0,
          checkNumberTwoPad: true,
          required: true
        }
      },
      messages: {
        'name': {
          required: '请输入策略名称'
        },
        // 'password': {
        //   // checkNumberTwoPad: '请输入正确的数字'
        // },
        'lever_ratio': {
          min: '请输入大于或等于0的两位小数',
          checkNumberTwoPad: '请输入两位小数',
          required: '请输入杠杆比例'
        }
      },
      errorPlacement: function errorPlacement(error, element) {
        error.appendTo(element.parent());
      },
      submitHandler: function submitHandler(form) {
        var name = $('#form_add [name=name]').val();
        var password = $('#form_add [name=password]').val();
        var lever_ratio = $('#form_add [name=lever_ratio]').val();
        // var operator_uid = $('#form_add [name=operator_uid]').val();
        var base_id = location.pathname.split('/').pop();

        // doSubmitV2(base_id, name, password, lever_ratio);
        $.startLoading('正在保存...');
        $.ajax({
          type: 'post',
          url: prefix + '/product/edit',
          data: {
            product_id: FD.product_id,
            name: name,
            lever_ratio: lever_ratio,
            // collect_capital: FD.begin_capital,
            // operator_uid: operator_uid,
            auto_verify: $('#form_add [name=autoVerify]').prop('checked') == true ? 1 : 0
          },
          success: function success(_ref4) {
            var code = _ref4.code,
                msg = _ref4.msg,
                data = _ref4.data;

            if (0 == code) {
              $.clearLoading();
              productHeader.getGroupInfo();
              productHeader.getBalanceInfo();
              $.omsAlert('修改成功');
            } else {
              $.clearLoading();
              $.omsAlert(msg);
            }
          },
          error: function error() {
            $.clearLoading();
            $.failNotice('网络异常，请重试');
          }
        });
      }
    });
  }
}
//# sourceMappingURL=base_setting.js.map
