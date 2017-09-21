/**
 * author: liuzeyafzy
 * 账户管理页面
 */

function JS_base_lists(prefix){
  let selectize = {};
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
      item: function(item, escape){
        return '<div class="item" data-value="'+ item.value +'" title="'+ item.label +'">' + escape(item.label) + '</div>';
      },
      option: function(item, escape){
        var label = item.value;
        return '<div class="option" title="'+ item.label +'">' + escape(item.label) +
        '</div>';
      }
    }
  })[0].selectize;

  var searchProductArr = [];
  // Begin 使用公共部分获取到的组合信息
  PRODUCTS.forEach(function(e){
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

  let getCanChangeInfo = function(callback){
    $.ajax({
      url: prefix + '/product/get_canchange_base_pw_account',
      // data: {
      //   base_id: id
      // },
      success: function({code, msg, data}){
        if (0 == code) {
          if (Object.prototype.toString.call(callback) === '[object Function]') {
            callback(data.lists);
          }
        }else{
          $.omsAlert(msg);
        }
      },
      error: function(){
        // 列表合并显示的数据，并不需要提示错误信息
        $.clearLoading();
      }
    });
  }

  let accountList = new Vue({
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
      getShowChildrenFlag: function(v){
        return v == 'true';
      },
      toggleShowChildren: function(v){
        v.showChildren = !v.showChildren;
      },
      getAccountInfo: function(){
        FD.accountInfo.forEach(function(e){
          e.showChildren = true;
        });
        let _this = this;
        getCanChangeInfo(function(canChangeData){
          FD.accountInfo.forEach(function(e){
            canChangeData.forEach(function(el){
              if (e.id == el.base_id) {
                e.com_pw = el.com_pw;
                e.tx_pw = el.tx_pw;
              }
            });
          })
          _this.accountInfo = FD.accountInfo;

        });
      },
      getOrgInfo: function(){
        this.orgInfo = FD.orgInfo;
      },
      searchAccountInfo: function(){
        var product_name = this.selectize.search_product.getValue();

        var _this = this;
        $.startLoading('正在搜索...');
        $.ajax({
          url: prefix + '/product/base_lists?format=json',
          data: {
            name: product_name
          },
          success: function({code, msg, data}){
            if (0 === code) {
              _this.accountInfo.splice(0)
              getCanChangeInfo(function(canChangeData){
                data.lists.forEach(function(e){
                  e.showChildren = true;
                  canChangeData.forEach(function(el){
                    if (e.id == el.base_id) {
                      e.com_pw = el.com_pw;
                      e.tx_pw = el.tx_pw;
                    }
                  });
                  _this.accountInfo.push(e);
                });
                $.clearLoading();
              })

            }else{
              $.omsAlert(msg);
              $.clearLoading();
            }
          },
          error: function(){
            $.clearLoading();
          }
        });
      },
      getsecuritiesType: function(id){
        if (/pb/i.test(id)) {
          return 'PB账户';
        }else{
          return '账户'
        }
      },
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
      checkSplit: function(v){
        return 1 == v;
      },
      checkShow: function(v){
        return 1 == v;
      },
      checkShowSplit: function(){
        return LOGIN_INFO.role_id.some(function(e){
          return e == 1;
        })
      },
      doSplit: function(v){
        location.href = prefix + '/product/add/' + v;
      },
      doConfig: function(v, type){
        // location.href = prefix + '/product/setting_redirect?product_id=' + v;
        if (type) {
          location.href = prefix + '/product/'+ type +'?product_id=' + v;
        }else{
          location.href = prefix + '/product/setting_redirect?product_id=' + v;
        }
      },
      showProgress: function(id, type){
        // id: 账户id; type: 2为密码 1为通信码


      },
      doChangePassword: function(v, tx_pw){
        // console.log(tx_pw);
        var jc_warn = $.confirm({
          title: '',
          content: `<div style="text-align: center;height: 150px;line-height: 150px;"><i class="warn-icon"></i>慎重！密码修改过程中账号将无法下单，确认继续？</div>`,
          closeIcon: true,
          confirmButton: ' 确定 ',
          confirm: function(){
            jc_warn.close();
            jc_warn = null;
            var html = '';
            if (tx_pw) {
              html = `<form id="userpassword-form" class="common-form" style="margin-left: 40px;margin-top: 30px;">
                  <span style="display:none;" class="user_id"></span>
                  <div class="form-field" style="margin-left: 20px;">
                      <label class="form-left">账户</label>
                      <span>`+ v +`</span>
                  </div>
                  <div class="form-field" style="margin-left: 20px;">
                      <label class="form-left">账户密码<b>*</b></label>
                      <input name="new_password" class="input-text new_password" style="width: 450px;" type="password" autocomplete="new_password" placeholder="请输入正确密码（多次提交错误密码可能导致系统被锁，请谨慎）"  />
                  </div>
                  <div class="form-field" style="margin-left: 20px;">
                      <label class="form-left">通讯密码<b>*</b></label>
                      <input name="tx_new_passwd" class="input-text tx_new_passwd" style="width: 450px;" type="password" autocomplete="new_password" placeholder="请输入正确通讯密码"  />
                  </div>
                  <div class="form-btns" style="margin-left: 0;text-align: center;">
                      <button type="submit" class="submit_btn">确定</button>
                      <div style="display:block;clear:both;"></div>
                  </div>
              </form>`
            }else{
              html = `<form id="userpassword-form" class="common-form" style="margin-left: 40px;margin-top: 30px;">
                  <span style="display:none;" class="user_id"></span>
                  <div class="form-field" style="margin-left: 20px;">
                      <label class="form-left">账户</label>
                      <span>`+ v +`</span>
                  </div>
                  <div class="form-field" style="margin-left: 20px;">
                      <label class="form-left">账户密码<b>*</b></label>
                      <input name="new_password" class="input-text new_password" style="width: 450px;" type="password" autocomplete="new_password" placeholder="请输入正确密码（多次提交错误密码可能导致系统被锁，请谨慎）"  />
                  </div>
                  <div class="form-btns" style="margin-left: 0;text-align: center;">
                      <button type="submit" class="submit_btn">确定</button>
                      <div style="display:block;clear:both;"></div>
                  </div>
              </form>`;
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
                'new_password':{
                //   checkPassword: '只允许输入字母与数字',
                  required: '请输入账户密码'
                },
                'tx_new_passwd':{
                //   checkPassword: '只允许输入字母与数字',
                  required: '请输入通讯密码',
                }
              },
              errorPlacement: function(error, element) {
                error.appendTo(element.parents(".form-field"));
              },
              // errorElement: function(error, element) {
              //   debugger;
              //   error.appendTo(element.parents(".form-field").next("div"));
              // },
              submitHandler: function (form) {
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
                  success: function({code, msg, data}){
                    $.clearLoading();
                    if (0 == code) {
                      // jc_warn.close();
                      jc.close();
                      $.omsAlert(msg);
                      // jc_warn = null;
                      jc = null;
                    }else{
                      $.omsAlert(msg);
                    }


                  },
                  error: function(){
                    $.clearLoading();
                  }
                });
              }
            });
          },
          cancelButton: false
        });
      },
      doChangeComunicationCode: function(v){
        var jc = $.confirm({
          title: '修改通信码',
          content: `<form id="usercode-form" class="common-form" style="margin-left: 40px;margin-top: 30px;">
              <span style="display:none;" class="user_id"></span>
              <div class="form-field" style="margin-left: 20px;">
                  <label class="form-left">账户</label>
                  <span>`+ v +`</span>
              </div>
              <div class="form-field" style="margin-left: 20px;">
                  <label class="form-left">原通信码<b>*</b></label>
                  <input name="login_code" class="input-text login_code" type="password" placeholder="请输入原通信码"  />
              </div>
              <div class="form-field" style="margin-left: 20px;">
                  <label class="form-left">新通信码<b>*</b></label>
                  <input name="tx_new_passwd" class="input-text tx_new_passwd" type="password" autocomplete="new_password" placeholder="请输入新通信码"  />
              </div>
              <div class="form-btns" style="margin-left: 0;text-align: center;">
                  <button type="submit" class="submit_btn">确定</button>
                  <div style="display:block;clear:both;"></div>
              </div>
          </form>`,
          closeIcon: true,
          confirmButton: false,
          cancelButton: false
        });

        $("#usercode-form").validate({
          'errorClass': 'confirm-tips',
          // 'errorElement': 'div',
          'rules': {
            'login_code':{
              checkPassword: true,
              required: true
            },
            'tx_new_passwd': {
              checkPassword: true,
              required: true
            }
          },
          messages: {
            'login_code':{
              checkPassword: '只允许输入字母与数字',
              required: '请输入账户密码',
            },
            'tx_new_passwd':{
              checkPassword: '只允许输入字母与数字',
              required: '请输入通讯密码',
            }
          },
          errorPlacement: function(error, element) {
            error.appendTo(element.parents(".form-field"));
          },
          // errorElement: function(error, element) {
          //   debugger;
          //   error.appendTo(element.parents(".form-field").next("div"));
          // },
          submitHandler: function (form) {
            var jc_warn = $.confirm({
              title: '',
              content: `<div style="text-align: center;height: 150px;line-height: 150px;"><i class="warn-icon"></i>慎重！通信码修改过程中账号将无法下单，确认继续？</div>`,
              closeIcon: true,
              confirmButton: ' 确定 ',
              confirm: function(){
                var login_code = $('.login_code').val();
                var tx_new_passwd = $('.tx_new_passwd').val();
                $.startLoading('正在添加...');
                $.ajax({
                  url: prefix + '/product/change_base_password',
                  type: 'post',
                  data: {
                    base_id: v,
                    type: 1,//2为密码，1为通信码
                    tx_src_passwd: login_code,
                    tx_new_passwd: tx_new_passwd,
                  },
                  success: function({code, msg, data}){
                    $.clearLoading();
                    if (0 == code) {
                      jc_warn.close();
                      jc.close();
                      $.omsAlert(msg);
                      jc_warn = null;
                      jc = null;
                    }else{
                      $.clearLoading();
                      $.omsAlert(msg);
                    }
                  },
                  error: function(){
                    $.clearLoading();
                  }
                })
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

  $(document).on('click', '.btn_search', function(){
    accountList.searchAccountInfo();
  });

  // $(document).trigger('stopGetUpdateInfo');
}
