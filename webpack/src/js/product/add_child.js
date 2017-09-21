/**
 * author: liuzeyafzy
 * 账户管理页面
 */
function JS_add_child(prefix){
  $('.page-title').html('新建策略-' + FD.base_info.name);
  let permissionsData = [];
  let max_user = 0;
  let user_num = 0;
  let formAdd = new Vue({
    el: '#form_add_vue',
    data: {
      managerInfo: [],
      org_info: FD.org_info,
      init_capital: FD.init_capital
    },
    methods: {
      numeralNumber: function(arg, num){
        if (undefined != num) {
          var str = '0.'
          for (let i = num - 1; i >= 0; i--) {
            str += '0';
          }
          return numeral(arg).format( '0,' + str );
        }
        return numeral(arg).format( '0,0.00' );
      },
      getManagers: function(callBack){
        let _this = this;
        $.ajax({
          type: 'get',
          url: '/bms-pub/user/org_info',
          success: function({code, msg, data}){
            if (0 == code) {
              max_user = data.max_user;
              user_num = data.user_num;
              $.ajax({
                type: 'get',
                url: '/bms-pub/user/role_users',
                success: function({code, msg, data}){
                  if (0 == code) {
                    let managerArr = [];
                    Object.keys(data).forEach(function(e){
                      managerArr.push({
                        name: data[e],
                        value: e
                      });
                    });
                    _this.managerInfo = managerArr;

                    if (Object.prototype.toString.call(callBack) === '[object Function]') {
                      callBack.apply(this, data);
                    }
                  }else{
                    $.omsAlert(msg);
                  }
                },
                error: function(){
                  $.failNotice();
                }
              });
            }
          },
          error: function(){
            $.failNotice();
          }
        });

      },
      createManager: function(){
        if (user_num >= max_user) {
          $.confirm({
            title: '已达上限',
            content: '<div style="text-align: center;height: 150px;line-height: 150px;"><i class="warn-icon"></i>当前用户数已达上限'+ max_user +'，如需增加，请联系我们。</div>',
            closeIcon: true,
            confirmButton: false,
            cancelButton: ' 确定 '
          });
        }else{
          var _this = this;
          // 这里调用的事config.js里面的方法
          createManager(function(data){
            _this.getManagers(function(){
              var user_id = data.user_id;

              Vue.nextTick(function () {
                $('#form_add [name=operator_uid').val(user_id);
                // Vue.set(_this.FD, 'operator_uid', user_id);
              });
            });

          });
        }
      },
      // doSplit: function(){

      // },
      doCancel: function(){
        location.href = prefix + '/product/base_lists';
      }
    }
  });

  if (FD.org_info.theme == 3) {
    // 专户版
    validateAccountSplitV2();
  }else{
    // 机构版
    formAdd.getManagers();
    // getRolePermissions(prefix);
    validateAccountSplit();
  }

  function doSubmit(base_id, name, init_capital, operator_uid){
    $.startLoading('正在保存...');
    $.ajax({
      type: 'post',
      url: prefix + '/product/add_child/',
      data: {
        base_id: base_id,
        name: name,
        collect_capital: init_capital,
        operator_uid: operator_uid,
        auto_verify: $('#form_add [name=autoVerify]').prop('checked') == true ? 1 : 0
      },
      success: function({code, msg, data}){
        $.clearLoading();
        if (0 == code) {
          location.href = prefix + '/product/user_setting?showTip=true&product_id=' + data.id;
        }else{
          $.omsAlert(msg);
        }
      },
      error: function(){
        $.clearLoading();
        $.failNotice();
      }
    });
  }
  function doSubmitV2(base_id, name, password, lever_ratio){
    $.startLoading('正在保存...');
    $.ajax({
      type: 'post',
      url: prefix + '/product/add_child/',
      data: {
        base_id: base_id,
        name: name,
        password: password,
        lever_ratio: lever_ratio,
        operator_uid: 'create',
        auto_verify: $('#form_add [name=autoVerify]').prop('checked') == true ? 1 : 0
      },
      success: function({code, msg, data}){
        $.clearLoading();
        if (0 == code) {
          location.href = prefix + '/product/user_setting?showTip=true&product_id=' + data.id;
        }else{
          $.omsAlert(msg);
        }
      },
      error: function(){
        $.clearLoading();
        $.failNotice();
      }
    });
  }

  function validateAccountSplit(){
    $("#form_add").validate({
      errorClass: 'confirm-tips',
      rules: {
        'name': {
          required: true
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
        'init_capital': {
          required: '请输入初始资金',
          checkNumberTwoPad: '请输入正确的数字'
        },
        'operator_uid': {
          required: '请选择基金经理'
        }
      },
      errorPlacement: function(error, element) {
          error.appendTo(element.parent());
      },
      submitHandler: function (form) {
        var name = $('#form_add [name=name]').val();
        var init_capital = $('#form_add [name=init_capital').val();
        var cashAvailable = $('.cash-available').html();
        var operator_uid = $('#form_add [name=operator_uid').val();
        var base_id = location.pathname.split('/').pop();

        if (init_capital > parseFloat(cashAvailable.replace(/,/g, ''))) {
          $.confirm({
            title: '已达上限',
            content: '<div style="text-align: center;height: 150px;line-height: 150px;"><i class="warn-icon"></i>慎重！账户可分配余额不足，或将导致无法买入证券，确定继续？</div>',
            closeIcon: true,
            confirmButton: ' 确定 ',
            confirm: function(){
              doSubmit(base_id, name, init_capital, operator_uid);
            },
            cancelButton: false
          });
          return false;
        }else{
          doSubmit(base_id, name, init_capital, operator_uid);
        }
      }
    });
  };

  function validateAccountSplitV2(){
    $("#form_add").validate({
      errorClass: 'confirm-tips',
      rules: {
        'name': {
          required: true
        },
        'password': {
          checkPassword: true,
          maxlength: 20
        },
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
        'password': {
          checkPassword: '只允许输入字母与数字',
          maxlength: '最多允许输入20个字符'
        },
        'lever_ratio': {
          min: '请输入大于或等于0的两位小数',
          checkNumberTwoPad: '请输入两位小数',
          required: '请输入杠杆比例'
        }
      },
      errorPlacement: function(error, element) {
          error.appendTo(element.parent());
      },
      submitHandler: function (form) {
        var name = $('#form_add [name=name]').val();
        var password = $('#form_add [name=password').val();
        var lever_ratio = $('#form_add [name=lever_ratio').val();
        // var operator_uid = $('#form_add [name=operator_uid').val();
        var base_id = location.pathname.split('/').pop();

        doSubmitV2(base_id, name, password, lever_ratio);
      }
    });
  }

  $(document).on('change', '.checkbox-all', function(){
    var bool = $(this).find('input').prop('checked');
    $(this).siblings().find('input').prop('checked', bool);
  }).on('change', '.checkbox-single', function(){
    var bool = $(this).find('input').prop('checked');
    if (true == bool && true === $(this).siblings('.checkbox-single').find('input').toArray().every(function(a){return bool == $(a).prop('checked');})) {
      $(this).siblings('.checkbox-all').find('input').prop('checked', true);
    }else{
      $(this).siblings('.checkbox-all').find('input').prop('checked', false);
    }
  });

  // $(document).trigger('stopGetUpdateInfo');
}
