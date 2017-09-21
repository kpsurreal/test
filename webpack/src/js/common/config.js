
// $(document).trigger('stopGetUpdateInfo');

let jc;
// 产品头部函数
function initProductHeader(prefix){
  let productHeader = new Vue({
    el: '#productHeader',
    data: {
      org_info: FD.org_info,
      userInfo: {},
      groupInfo: {},
      balanceInfo: {}
    },
    methods: {
      showProductType: function(innerType){
        var rtn = '';
        SD.productType.forEach(function(e){
          if (innerType == e[0]) {
            rtn = e[1];
          }
        });
        return rtn;
      },
      getGroupInfo: function(){
        var last_timestamp = new Date().valueOf();
        $('#productHeader').attr('last_timestamp',last_timestamp);
        $.ajax({
          url: prefix + '/oms/helper/get_products_by_id',
          data: {
            product_id: FD.product_id,
            with_operator: 1,
            with_roboter: 1
          },
          success: function({code, msg, data}){
            if( last_timestamp!=$('#productHeader').attr('last_timestamp') ){return;}
            productHeader.groupInfo = data[0];
            productHeader.userInfo = data[0].operator_info;
            $('.container-title-text').html(productHeader.groupInfo.name);
            var text = productHeader.groupInfo.roboter_info + '-' + productHeader.groupInfo.name;
            $('.page-title').html(text);
          },
          error: function(){

          }
        });

      },
      getBalanceInfo: function(){
        $.ajax({
          url: prefix + '/oms/api/get_settlement_info',
          data: {
            product_id: FD.product_id,
            unuse_cache: 1
          },
          success: function({code, msg, data}){
            if (0 == code) {
              productHeader.balanceInfo = data;
            }else{
              productHeader.balanceInfo = {
                shouldShow: '--',
                balance_amount: '0',
                enable_cash: '0',
                net_value: '0',
                position: '0',
                total_assets: '0'
              }
            }

          },
          error: function(){

          }
        })
      },
      // displayManager: function(status, name){
      //   if (2 == status) {
      //     return name + '（已注销）'
      //   }else{
      //     return name;
      //   }
      // },
      showPbProductName: function(v){
        return v['pb_info']['pb_product_name'];
      }
      // ,
      // numeralNumber: function(arg, num){
      //   if ('--' == arg || '' == arg || undefined == arg) {
      //     return '--'
      //   }
      //   if (undefined != num) {
      //     var str = '0.'
      //     for (let i = num - 1; i >= 0; i--) {
      //       str += '0';
      //     }
      //     return numeral(arg).format( '0,' + str );
      //   }
      //   return numeral(arg).format( '0,0.00' );
      // },
      // numeralPercent: function(arg){
      //   return numeral(arg).format( '0.00%' );
      // }
    }
  });
  productHeader.getGroupInfo();
  productHeader.getBalanceInfo();
  return productHeader;
}

// 获取用户列表（权限）
function getUserList(){
  $.ajax({
    url: '/bms-pub/user/get_user_list',
    data: {

    },
    success: function({code, msg, data}){
      // TODO  剔除已经添加的用户，然后供人员添加的弹窗使用
    },
    error: function(){

    }
  })
}

// 添加基金经理弹窗
function createManager(callBack){
  var html = `<form id="useradd-form" class="common-form" style="margin-top: 0;" autocomplete="off">
    <input style="display:none;" name="hide_name" type="text"/>
    <input style="display:none;" name="hide_password" type="password"  />
    <p class="form-field" style="margin-left: 80px;">
      <label class="form-left" style="margin-left:0;">用户名<b>*</b></label>
      <input name="real_name" class="input-text real_name" type="text" placeholder="输入用户名" />
    </p>
    <p class="form-field" style="margin-left: 80px;">
      <label class="form-left" style="margin-left:0;">手机号</label>
      <input name="cellphone" class="input-text cellphone" type="text" placeholder="输入电话号码" />
    </p>
    <div class="form-field" style="margin-left: 80px;">
      <label class="form-left" style="margin-left:0;">初始密码<b>*</b></label>
      <input name="password" class="input-text password" type="password" autocomplete="new-password" placeholder="输入初始密码，首次登录将提示修改"  />
      <div style="display: inline-block;position: absolute;width: 310px;left: 80px;">
        <div class="showPasswordIcon"></div>
      </div>
    </div>
    <div class="form-field" style="margin-left: 80px;">
      <label class="form-left" style="margin-left:0;">角色<b>*</b></label>
      <label><input checked="checked" type="radio" class="role_id" value="11" />基金经理</label>
    </div>

    <div class="form-btns">
        <button type="submit" class="submit_btn" style="margin-right: 40px;float:right;">添加并选中</button>
        <div style="display:block;clear:both;"></div>
    </div>
  </form>`;
  jc = $.confirm({
    title: '新建基金经理',
    content: html,
    closeIcon: true,
    columnClass: 'custom-window-width',
    confirmButton: false,
    cancelButton: false
  });

  validateUserAddForm(callBack);
}
$(document).on('click', '.showPasswordIcon', function(){
  var passwordInput = $(this).parents('.form-field').find('input');
  if ('password' === passwordInput.attr('type')) {
    passwordInput.attr('type', 'text');
    $(this).addClass('hidePassword');
  }else{
    passwordInput.attr('type', 'password');
    $(this).removeClass('hidePassword');
  }
})

// 添加用户弹窗，包含基金经理
function createUser(callBack){
  var html = `<form id="useradd-form" class="common-form" style="margin-top: 0;" autocomplete="off">
    <input style="display:none;" name="hide_name" type="text"/>
    <input style="display:none;" name="hide_password" type="password"  />
    <p class="form-field" style="margin-left: 80px;">
      <label class="form-left" style="margin-left:0;">用户名<b>*</b></label>
      <input name="real_name" class="input-text real_name" type="text" placeholder="输入用户名" />
    </p>
    <p class="form-field" style="margin-left: 80px;">
      <label class="form-left" style="margin-left:0;">手机号</label>
      <input name="cellphone" class="input-text cellphone" type="text" placeholder="输入电话号码" />
    </p>
    <div class="form-field" style="margin-left: 80px;">
      <label class="form-left" style="margin-left:0;">初始密码<b>*</b></label>
      <input name="password" class="input-text password" type="password" autocomplete="new-password" placeholder="输入初始密码，首次登录将提示修改"  />
      <div style="display: inline-block;position: absolute;width: 290px;left: 80px;">
        <div class="showPasswordIcon"></div>
      </div>
    </div>
    <div class="form-field" style="margin-left: 80px;">
      <label class="form-left" style="margin-left:0;">角色<b>*</b></label>
      <div style="width:290px;display:inline-block;">
        <label class="label-input"><input type="checkbox" name="role_id" class="role_id" value="11" />基金经理</label>
        <label class="label-input"><input type="checkbox" name="role_id" class="role_id" value="12" />交易员</label>
        <label class="label-input"><input type="checkbox" name="role_id" class="role_id" value="13" />风控员</label>
      </div>
    </div>
    <div class="form-btns">
        <button type="submit" class="submit_btn" style="margin-right: 40px;float:right;">添加并选中</button>
        <div style="display:block;clear:both;"></div>
    </div>
  </form>`;
  jc = $.confirm({
    title: '新建用户',
    content: html,
    closeIcon: true,
    columnClass: 'custom-window-width',
    confirmButton: false,
    cancelButton: false
  });

  validateUserAddForm(callBack);
}

// 人员添加弹窗
// 注意与添加用户区分，
// 注意，已添加的人员不要显示
function addPerson(){
  $.confirm({
    title: '人员添加',
    content: 'html',
    closeIcon: true,
    columnClass: 'custom-window-width',
    confirmButton: false,
    cancelButton: false
  });

}

// 添加用户校验
function validateUserAddForm(callBack){
  $("#useradd-form").validate({
    'errorClass': 'confirm-tips',
    // 'errorElement': 'div',
    'rules': {
      'real_name':{
        required: true,
        checkChineseAlphaNumber: true,
        maxlength: 16
      },
      'password': {
        checkPassword: true,
        required: true,
        maxlength: 20
      },
      'cellphone': {
        checkphone: true,
      },
      'role_id': {
        required: true
      }
    },
    messages: {
      'real_name':{
        required: '请输入用户名',
        checkChineseAlphaNumber: '只允许输入汉字、字母、数字',
        maxlength: '最多允许输入16个字'
      },
      'password':{
        checkPassword: '只允许输入字母与数字',
        required: '请输入密码',
        maxlength: '最多允许输入20个字符'
      },
      'cellphone': {
        checkphone: '手机号格式不正确'
      },
      'role_id': {
        required: '请选择用户角色'
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
        var real_name = $('#useradd-form .real_name').val();
        var password = $('#useradd-form .password').val();
        var cellphone = $('#useradd-form .cellphone').val();
        var roleArr = [];
        $('#useradd-form .role_id:checked').each(function(){
          roleArr.push(this.value);
        });
        var role_id = roleArr.join(',');
        // var is_specify = $('#useradd-form .is_specify').prop('checked')?1:0;

        $.startLoading('正在添加...');
        $.ajax({
            type: 'post',
            url: '/bms-pub/user/register',
            data:{
                real_name: real_name,
                nick_name: real_name,
                password: password,
                cellphone: cellphone,
                role_id: role_id//,
                // is_specify: is_specify
            },
            success: function({code, msg, data}){
              if (0 == code) {
                $.clearLoading();
                //隐藏弹窗，然后提示

                $('#useradd-form')[0].reset();
                jc.close();
                $.omsAlert(msg);
                // TODO 用户列表新增一个用户，然后选中
                // var html = '<label class="checkbox-oneLine"><input type="checkbox" checked="checked" name="role_id" class="role_id" value="'+ res.data.user_id +'" />'+ res.data.real_name +'</label>';
                // $('#productAdd-form .manager_list').prepend(html);
                // $('#productEdit-form .manager_list').prepend(html);
                if (Object.prototype.toString.call(callBack) === '[object Function]') {
                  callBack(data);
                }
              }else{
                $.clearLoading();
                $.omsAlert(msg);
              }
            },
            error: function(){
              $.clearLoading();
            }
        });
      }
  });
};
