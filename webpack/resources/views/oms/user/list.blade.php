@extends('adminmanager_standard')

@section('asset-css')
    <link href="{{ asset('/js/jquery-confirm/jquery-confirm.min.css') }}" rel="stylesheet">
    @if($host_theme == 'standard')
        <link href="{{ asset('/css/oms.min.css') }}" rel="stylesheet">
    {{-- @elseif($condition) --}}
    @else
        <link href="{{ asset('/css/theme1/oms.min.css') }}" rel="stylesheet">
    @endif
    <style>


    tbody {
        display:block;
        max-height: 460px;
        overflow:auto;
        overflow-y:scroll;
    }
    thead, tbody tr {
        display:table;
        width:100%;
        table-layout:fixed;
    }
    thead {
        width: calc( 100% - 1em )
    }

    .jconfirm-box-container{
        margin: 0 auto;
        width: 670px;
        position: relative;
        min-height: 1px;
        padding-right: 15px;
        padding-left: 15px;
    }
    .jconfirm.jconfirm-white .jconfirm-box .buttons button.btn-default,.jconfirm.jconfirm-white .jconfirm-box .buttons button.btn-default:hover{
        padding: 2px 4px;
        border-radius: 2px;
        /*background: #fff;
        color: #5b8cf1;*/
        font-weight: normal;

        font-size: 14px;
        color: #fff;
        background-color: #E74C3C;
        width: 100px;
        height: 30px;
    }
    .jconfirm.jconfirm-white .jconfirm-box .buttons{
        float: none;
        text-align: center;
    }
    .jconfirm .jconfirm-box .buttons button+button{
        margin-left: 10px;
    }
    .jconfirm .jconfirm-box div.content-pane .content{
        padding-top: 5px;
        padding-bottom: 20px;
    }
    .confirm-class{
        width: 100px;
        height: 40px;
        background-color: #FFDE00;
        border-radius: 2px;
        color: #333!important;
        font-size: 16px!important;
    }
    .cancel-class{
        width: 100px;
        height: 40px;
        background-color: #f9f9f9;
        border-radius: 2px;
        border: 1px solid #ccc!important;
        color: #333!important;
        font-size: 16px!important;
    }
    a.jquery-confirm-ok:focus{
        background: #f0f0f0;
    }
    .jconfirm .jconfirm-scrollpane{
        background-color: rgba(0,0,0,.4);
    }
    .page-select{
      display: inline-block;
      width: 180px;
      height: 32px;
      line-height: 32px;
      vertical-align: top;
    }
    .list_box{
      line-height: 30px;
      background: white;
      float: right;
      width: 490px;
      margin-right: 10px;
      padding-left: 3px;
    }
    .user-form .form-field input[type="checkbox"]{
      vertical-align: middle;
    }

    </style>
@endsection

@section('content')
  <script>
    //全局配置
    window.ENV = window.ENV || {};
    window.REQUEST_PREFIX = "{{ config('view.path_prefix','') }}";
  </script>
  <script src="{{ asset('/js/plugin/vue/vue.js') }}"></script>
  <script src="{{ asset('/dist/js/common/vue.component.js') }}"></script>
  <script src="{{asset('/js/jquery.validate.min.js')}}" type="text/javascript"></script>
  <script src="{{asset('/js/oms/custom.validate.js')}}" type="text/javascript"></script>
  <script src="{{asset('/js/plugin/doT.min.js')}}" type="text/javascript"></script>
  <script src="{{ asset('/js/jquery-confirm/jquery-confirm.min.js') }}"></script>

  <div class="main-container fc">
    <section class="section-container">
      <div class="container-title">
        <h2 class="page-title">人员权限</h2>
        <div style="display: inline-block; font-size: 14px; color: #4A4A4A;">
          （用户数/上限数：
          <span class="user_num"></span>
          /
          <span class="max_user_num"></span>
          ）
        </div>
        <select class="page-select">
          <option value="all">全部</option>
          <option value="actived" selected = "selected">激活</option>
          <option value="deactived">已注销</option>
        </select>
        <!-- <span style="font-size: 26px;color: #000000;">（用户数／上限数：</span>
        <span class="user_num" style="font-size: 26px;color: #000000;"></span>
        <span class="user_num" style="font-size: 26px;color: #000000;"></span>
        <span style="font-size: 26px;color: #000000;">）</span> -->
        @if(isset($logined_info['role_permission']) && isset($logined_info['role_permission']['32']) && $logined_info['role_permission']['32'] == true)
        <a class="btn_add userAdd_btn"><i></i>新建用户</a>
        @endif
        <div style="clear:both;"></div>
      </div>
      <div class="container-content">
        <!-- <div>
          <span class="content-tip">用户总数：</span>
          <span class="content-tip user_num"></span>
        </div> -->
        <div class="container-content-grid" id="userList">
          <table>
            <thead>
              <tr rows-head>
                <td style="color: #999;" class="cell-left left30">登录id</td>
                <td style="color: #999;" class="cell-left left30">用户名</td>
                <td style="color: #999;" class="cell-left left30">角色</td>
                <td style="color: #999;" class="cell-left left30">手机号</td>
                <td style="color: #999;" class="cell-left left30">状态</td>
                <td style="color: #999;" class="cell-left left30">创建时间</td>
                <td style="color: #999;" class="cell-left left30">最近登录</td>
                <td style="color: #999;" class="cell-left left30" style="width:250px;padding-left:20px;"></td>
              </tr>
            </thead>
            <tbody rows-body id="user_list_content">

            </tbody>
          </table>
        </div>
      </div>
    </section>
    <section class="section_window useradd_container">
      <div class="container-content">
        <div>
          <span class="content-title">新建用户</span>
          <form id="useradd-form" class="user-form" autocomplete="off">
            <input style="display:none;" name="hide_name" type="text"/>
            <input style="display:none;" name="hide_password" type="password"  />
            <p class="form-field">
              <label class="form-left">用户名<b>*</b></label>
              <input name="real_name" class="input-text real_name" type="text" placeholder="输入用户名" />
            </p>
            <p class="form-field">
              <label class="form-left">手机号</label>
              <input name="cellphone" class="input-text cellphone" type="text" placeholder="输入电话号码" />
            </p>
            <div class="form-field">
              <label class="form-left">初始密码<b>*</b></label>
              <input name="password" autocomplete="new-password" class="input-text password" type="password" placeholder="输入初始密码，首次登录将提示修改"  />
              <div style="display: inline-block;position: absolute;width: 290px;left: 95px;">
                  <div class="showPasswordIcon"></div>
              </div>
            </div>
            <div class="form-field">
              <label class="form-left">角色<b>*</b></label>
              <label style="padding-right: 10px;"><input type="checkbox" class="role_id" value="1" name="role_id" />管理员</label>
              <label style="padding-right: 10px;"><input type="checkbox" class="role_id" value="11" name="role_id" />基金经理</label>
              <label style="padding-right: 10px;"><input type="checkbox" class="role_id" value="12" name="role_id" />交易员</label>
              <label style="padding-right: 10px;"><input type="checkbox" class="role_id" value="13" name="role_id"/>风控员</label>
              @if($_SERVER['QUERY_STRING'] == 'permission=special')
                  <label style="padding-right: 10px;"><input type="checkbox" class="role_id" value="20" name="role_id"/>交易总监</label>
              @endif
            </div>
            <div class="form-field">
              <label class="form-left"></label>
              <div class="permissions" >
                <span class="title">权限</span>
                <div class="permissions-content" style="display: block;"></div>
              </div>
            </div>
            <div>
              <button type="submit" class="form_submit_btn">添加并返回</button>
              <button type="button" class="cancel_btn">取消</button>
            </div>
          </form>
        </div>
      </div>
    </section>
    <section class="section_window useredit_container">
      <div class="container-content">
        <div>
          <span class="content-title">编辑用户</span><span class="display-real_name"></span>
          <form id="useredit-form" class="user-form" autocomplete="off">
            <input style="display:none;" name="hide_name" type="text"/>
            <input style="display:none;" name="hide_password" type="password"  />
            <p class="form-field">
              <label class="form-left">登录id</label>
              <span class="user_id"></span>
              {{-- <input name="real_name" class="input-text real_name" type="text" placeholder="输入用户名" /> --}}
            </p>
            <p class="form-field">
              <label class="form-left">用户名</label>
              <span class="real_name"></span>
            </p>
            <p class="form-field">
              <label class="form-left">手机号</label>
              <input name="cellphone" class="input-text cellphone" type="text" placeholder="输入电话号码" />
            </p>
            <div class="form-field">
              <label class="form-left">角色<b>*</b></label>
              <label style="padding-right: 10px;"><input type="checkbox" class="role_id" value="1" name="role_id" />管理员</label>
              <label style="padding-right: 10px;"><input type="checkbox" class="role_id" value="11" name="role_id" />基金经理</label>
              <label style="padding-right: 10px;"><input type="checkbox" class="role_id" value="12" name="role_id" />交易员</label>
              <label style="padding-right: 10px;"><input type="checkbox" class="role_id" value="13" name="role_id" />风控员</label>
              @if($_SERVER['QUERY_STRING'] == 'permission=special')
                  <label style="padding-right: 10px;"><input type="checkbox" class="role_id" value="20" name="role_id"/>交易总监</label>
              @endif
            </div>
            <div class="form-field">
              <label class="form-left"></label>
              <div class="permissions" style="display: none;">
                <span class="title">选中角色具有以下权限</span>
                <div class="permissions-content"></div>
              </div>
            </div>
            <div>
              <button type="submit" class="form_submit_btn">修改并返回</button>
              <button type="button" class="cancel_btn">取消</button>
            </div>
          </form>
        </div>
      </div>
    </section>
    <section class="section_window userreset_container">
      <div class="container-content">
        <div>
          <span class="content-title">重置密码</span><span class="display-real_name"></span>
          <form id="userreset-form" class="user-form" autocomplete="off">
            <input style="display:none;" name="hide_name" type="text"/>
            <input style="display:none;" name="hide_password" type="password"  />
            <span style="none" class="user_id"></span>
            <div class="form-field">
              <label class="form-left">用户名</label>
              <label class="real_name"></label>
            </div>
            <div class="form-field">
              <label class="form-left">新密码<b>*</b></label>
              <input name="new_password" class="input-text new_password" type="password" placeholder="请输入密码"  />
              <div style="display: inline-block;position: absolute;width: 290px;left: 95px;">
                <div class="showPasswordIcon"></div>
              </div>
            </div>
            <div class="form-field">
              <label class="form-left">验证密码<b>*</b></label>
              <input name="login_password" class="input-text login_password" type="password" placeholder="请输入您的登录密码进行验证"  />
              <div style="display: inline-block;position: absolute;width: 290px;left: 95px;">
                <div class="showPasswordIcon"></div>
              </div>
            </div>
            <div style="margin-top:50px;">
              <button type="submit" class="form_submit_btn">修改并返回</button>
              <button type="button" class="cancel_btn">取消</button>
            </div>
          </form>
        </div>
      </div>
    </section>
    <span id="page_tip" class="hide"></span>
  </div>
    <script id="tabletmpl" type="text/x-dot-template">
      @{{~it.array:v:i}}
        <tr>
          <td class="cell-left left30 table_user_id">@{{=v.user_id||'--'}}</td>
          <td class="cell-left left30 table_real_name">@{{=v.real_name||'--'}}</td>
          <td class="cell-left left30">
          @{{=utils.getRoleName(v.role_id)}}

          </td>
          <td class="cell-left left30">@{{=v.cellphone||'--'}}</td>
          <td class="cell-left left30">@{{=utils.getUserStatus(v.status)||'--'}}</td>
          <td class="cell-left left30">@{{=v.created_at||'--'}}</td>
          <td class="cell-left left30">@{{=v.last_login_time||'--'}}</td>
          <td class="cell-left right30">
            @{{?it.permission[GV.permissions.PERMISSION_USER_EDIT] == true}}
            <a class="table_btn edit">编辑</a>
            @{{?}}
            @{{?it.permission[GV.permissions.PERMISSION_PASSWORD_RESET] == true}}
            <a class="table_btn reset">重置密码</a>
            @{{?}}
            @{{?it.permission[GV.permissions.PERMISSION_USER_DELETE] == true}}
              @{{? window.LOGIN_INFO.user_id == v.user_id}}
                <a class="table_btn destroy disabled">注销</a>
              @{{??}}
                @{{? v.status == 1}}
                  <a class="table_btn destroy">注销</a>
                @{{?}}
                @{{? v.status == 2}}
                  <a class="table_btn doActive">激活</a>
                @{{?}}
              @{{?}}
            @{{?}}
          </td>
        </tr>
      @{{~}}
    </script>
    <script id="permissionTmpl" type="text/x-dot-template">

    </script>
    <script>
    Array.prototype.unique = function(){
     var res = [];
     var json = {};
     for(var i = 0; i < this.length; i++){
      if(!json[this[i]]){
       res.push(this[i]);
       json[this[i]] = 1;
      }
     }
     return res;
    }

    var permissionData;
    var commonCheckArr = [];

    var tipTimer;
    var gridData = {};
    var tablefn = doT.template(document.getElementById('tabletmpl').text, undefined, undefined);
    var max_user = 0;
    var curUserNum = 0;
    function getTableData(){
      $.ajax({
        url: window.REQUEST_PREFIX + '/user/get_user_list',
        type: 'get',
        data: {},
        success: function(res){
            if (0 == res.code) {
                gridData.array = res.data.user_list;
                gridData.permission = window.LOGIN_INFO.role_permission;
                max_user = res.data.max_user;
                curUserNum = gridData.array.length;
                $('.user_num').html(curUserNum);
                $('.max_user_num').html(max_user);
                showTable(gridData);
            }else{
                $.omsAlert(res.msg);
            }
        },
        error: function(){

        }
      });
    }
    //新增用户
    function validateUseraddForm(){
      $("#useradd-form").validate({
        'errorClass': 'tips',
        // focusCleanup:true,
        // 'errorElement': 'div',
        rules: {
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
        // errorPlacement: function(error, element) {
        //     error.appendTo(element.parent());
        // },
        submitHandler: function (form) {
          var real_name = $('#useradd-form .real_name').val();
          var password = $('#useradd-form .password').val();
          var cellphone = $('#useradd-form .cellphone').val();
          // var role_id = $('#useradd-form .role_id').val();
          var is_specify = $('#useradd-form .is_specify').prop('checked')?1:0;

          var permissionArr = [];
          $('#useradd-form .permissions-content :checked').each(function(){
            if($(this).val != 'undefined'){
              permissionArr.push($(this).val())
            }
          })
          permissionArr = permissionArr.unique();

          var roleArr = [];
          $('#useradd-form .role_id:checked').each(function(){
            roleArr.push(this.value);
          });

          if(permissionArr.length == 0){
            $.omsAlert("请选择权限");
            return false;
          }
          var role_id = roleArr.join(',');
          $.ajax({
            type: 'post',
            // url: '/bms-pub/user/register',
            url: window.REQUEST_PREFIX + '/user/create_user',
            data:{
              real_name: real_name,
              password: password,
              cellphone: cellphone,
              role_id: role_id,
              is_specify: is_specify,
              permission: permissionArr.join(',')
            },
            success: function(res){
              if (0 == res.code) {
                //隐藏弹窗，然后提示
                $('#useradd-form')[0].reset();
                $('.section_window').hide();
                $('.userAdd_btn').show();
                getTableData();
              }else{
                $.omsAlert(res.msg);
              }
              // if (tipTimer) {
              //   clearTimeout(tipTimer);
              //   tipTimer = undefined;
              // }
              // $('#page_tip').html(res.msg).removeClass('hide');
              // tipTimer = setTimeout(function(){
              //     $('#page_tip').addClass('hide');
              // }, 3 * 1000);
            },
            error: function(){
              $.failNotice()
            }
          });
        }
      });
    }
    function validateUsereditForm(){
      $("#useredit-form").validate({
        'errorClass': 'tips',
        // 'errorElement': 'div',
        rules: {
          'cellphone': {
            checkphone: true,
          },
          'role_id': {
            required: true
          }
        },
        messages: {
          'cellphone': {
            checkphone: '手机号格式不正确'
          },
          'role_id': {
            required: '请选择用户角色'
          }
        },
        // highlight: function(element, errorClass) {
        //     $(element).removeClass(errorClass);
        // },
        errorPlacement: function(error, element) {
          error.appendTo(element.parents(".form-field"));
        },
        // errorPlacement: function(error, element) {
        //     error.appendTo(element.parent());
        // },
        submitHandler: function (form) {
          // var real_name = $('.real_name').val();
          // var password = $('#useredit-form .password').val();
          var user_id = $('#useredit-form .user_id').html();
          var cellphone = $('#useredit-form .cellphone').val();
          // var role_id = $('#useredit-form .role_id:checked').val();
          var roleArr = [];

          
          var is_specify = $('#useredit-form .is_specify').prop('checked')?1:0;
          var permissionArr = [];
          $('#useredit-form .permissions-content :checked').each(function(){
            if($(this).val != 'undefined'){
              permissionArr.push($(this).val())
            }
          })
          permissionArr = permissionArr.unique();

          var roleArr = [];
          $('#useredit-form .role_id:checked').each(function(){
            roleArr.push(this.value);
          });
          var role_id = roleArr.join(',');
          if(permissionArr.length == 0){
            $.omsAlert("请选择权限");
            return false;
          }
          permissionArr = permissionArr.unique();

          $.ajax({
              type: 'post',
              // url: '/bms-pub/user/modify',
              url: window.REQUEST_PREFIX + '/user/modify_user',
              data:{
                user_id: user_id,
                cellphone: cellphone,
                role_id: role_id,
                is_specify: is_specify,
                permission: permissionArr.join(',')
              },
              success: function(res){
                if (0 == res.code) {
                  $.omsAlert(res.msg);
                  //隐藏弹窗，然后提示
                  $('#useradd-form')[0].reset();
                  $('.section_window').hide();
                  $('.userAdd_btn').show();
                  getTableData();
                }else{
                  $.omsAlert(res.msg);
                }
              },
              error: function(){
                $.failNotice();
              }
          });
        }
      });
    }

    function validateUserresetForm(){
      $("#userreset-form").validate({
        'errorClass': 'tips',
        // 'errorElement': 'div',
        rules: {
          'new_password': {
            checkPassword: true,
            required: true,
            maxlength: 20
          },
          'login_password': {
            checkPassword: true,
            required: true,
            maxlength: 20
          }
        },
        messages: {
          'new_password': {
            checkPassword: '只允许输入字母与数字',
            required: '请输入密码',
            maxlength: '最多允许输入20个字符'
          },
          'login_password': {
            checkPassword: '只允许输入字母与数字',
            required: '请输入您的登录密码进行验证',
            maxlength: '最多允许输入20个字符'
          }
        },
        // highlight: function(element, errorClass) {
        //     $(element).removeClass(errorClass);
        // },
        errorPlacement: function(error, element) {
          error.appendTo(element.parent());
        },
        submitHandler: function (form) {
          // var real_name = $('.real_name').val();
          // var password = $('#useredit-form .password').val();
          var user_id = $('#userreset-form .user_id').val();
          var new_password = $('#userreset-form .new_password').val();
          var login_password = $('#userreset-form .login_password').val();

          $.ajax({
            type: 'post',
            url: '/bms-pub/user/modify_password',
            data:{
              login_user: user_id,
              user_id: user_id,
              new_password: new_password,
              login_password: login_password
            },
            success: function(res){
              if (0 == res.code) {
                $.omsAlert(res.msg);
                //隐藏弹窗，然后提示
                $('#userreset-form')[0].reset();
                $('.section_window').hide();
                $('.userAdd_btn').show();
                getTableData();
              }else{
                $.omsAlert(res.msg);
              }
            },
            error: function(){
              $.failNotice();
            }
          });
        }
      });
    }
    function validateUserpermissionForm(){
      // $("#userpermission-form").validate({
      //   submitHandler: function (form) {
      //     // var real_name = $('.real_name').val();
      //     // var password = $('#useredit-form .password').val();
      //     var user_id = $('#userpermission-form .user_id').val();
      //     var permissions = {};
      //     $('label.checkbox-single>input[name="permission-trade"]').each(function(){
      //       permissions[$(this).val()] = (true === $(this).prop('checked')) ? 1 : 0;
      //     });
      //     $.ajax({
      //       type: 'post',
      //       url: window.REQUEST_PREFIX + '/user/modify_permissions',
      //       data:{
      //         user_id: user_id,
      //         permissions: permissions
      //       },
      //       success: function(res){
      //         if (0 == res.code) {
      //           //隐藏弹窗，然后提示
      //           $('.section_window').hide();
      //           $('.userAdd_btn').show();
      //           getTableData();
      //         }else{

      //         }
      //         if (tipTimer) {
      //           clearTimeout(tipTimer);
      //           tipTimer = undefined;
      //         }
      //         $('#page_tip').html(res.msg).removeClass('hide');
      //         tipTimer = setTimeout(function(){
      //           $('#page_tip').addClass('hide');
      //         }, 3 * 1000);
      //       }
      //     });
      //   }
      // });
    }

    function showTable(data){
      var flag = $('.page-select').val();
      var obj = [];
      obj.permission = data.permission;
      obj.array = data.array.filter(function(e){
        if ('all' == flag) {
          return true;
        }else if('actived' == flag){
          return e.status == 1
        }else if('deactived' == flag){
          return e.status == 2
        }
      })

      obj.array.sort(function(a, b){
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
      document.getElementById('user_list_content').innerHTML = tablefn(obj);//历史列表
    }

    function getPermissions(callback){
      $.ajax({
        url: window.REQUEST_PREFIX + '/product/user_setting?format=json',
        data: {

        },
        success: function(res){
          if (0 == res.code) {
            permissionData = res.data.role_permissions;
            if (Object.prototype.toString.call(callback) === '[object Function]') {
              callback.call();
            }
          }else{
            $.omsAlert(res.msg);
          }
        },
        error: function(){

        }
      })

    }
    function getUserPermissions(callback,user_id,name){
      $.ajax({
          url: '/bms-pub/user/permissions?user_id='+user_id,
          type: 'GET',
      })
      .done(function(res) {
          if(res.code == 0){
            if(callback){
              callback(res.data,name);
            }
          }else{
             $.omsAlert(res.msg);
          }
        })
      .fail(function() {
           $.omsAlert('网络异常，请重试');
        })
      .always(function() {
      })
    }
    function randerPermissions(arr,name){
      //设置全局权限列表
      permissionsList  = arr ;
      $('.permissions').hide();
       $('#'+name+' .permissions').show();
      var node = $('#'+name+' .permissions-content').html('');
      arr.forEach((e)=>{
        var dlNode =$('<dl><dt style="font-weight:bold;"><label><input name="grandparent" type="checkbox" >'+e.category+'</label></dt>' );
        var divNode = $('<div>').addClass('list_box');
        e.sub.forEach((sub)=>{
          var ddNode = $('<dd><label><input name="parent" type="checkbox" value="'+sub.id+'">'+sub.name+'</label></dd>');
          ddNode.find(':checkbox').prop('checked',sub.status)
          dlNode.append(ddNode);
          sub.sub.forEach((ele)=>{
            var child = $('<dd><label><input name="child" parent='+sub.id+' type="checkbox" value="'+ele.id+'">'+ele.name+'</label></dd>');
            child.find(':checkbox').prop('checked',ele.status)
            divNode.append(child)
            if(sub.status == 0){
              child.hide();
            }else{
              child.show();
            }
          })
        })
        dlNode.append(divNode);
        node.append(dlNode);
      })

    }
    $(function(){
      validateUseraddForm();
      validateUsereditForm();
      validateUserresetForm();
      validateUserpermissionForm();
      getPermissions(function(){
        getTableData();
      })
      //权限列表
      var permissionsList = [];
      //checkbox 交互
      $(document).on('change','[name=grandparent]',function(){
        // console.log(this.checked);
        // var self = this;
        // permissionsList.forEach(ele){
        //   if(ele.category == self.nextSibling.textContent){

        //   }
        // }
        $(this).closest('dl').find(':checkbox').show().prop('checked',this.checked);
        $(this).closest('dl').find('[name=parent]').trigger('change')
      })

      $(document).on('change','[name=parent]',function(){
        var parentCode =  $(this).attr('value')
        $(this).closest('dl').find('.list_box [parent='+parentCode+']').prop('checked',this.checked);
        if(this.checked){
          $(this).closest('dl').find('.list_box [parent='+parentCode+']').closest('dd').show();
        }else{
          $(this).closest('dl').find('.list_box [parent='+parentCode+']').closest('dd').hide();
        }
      })


      //getUserPermissions(randerPermissions);

      $('.userAdd_btn').click(function(){
        var user_id = '';
        // todo 判断最大用户数
        if (curUserNum >= max_user) {
          $.confirm({
            title: '已达上限',
            content: '<div style="text-align: center;height: 150px;line-height: 150px;"><i class="warn-icon"></i>当前用户数已达上限'+ max_user +'，如需增加，请联系我们。</div>',
            closeIcon: true,
            confirmButton: false,
            cancelButton: ' 确定 '
          });
        }else{
          //$('.permissions').hide();
          $('.useradd_container').show();
          $('.userAdd_btn').hide();
        }
        getUserPermissions(randerPermissions,user_id,'useradd-form');
      })

      $(document).on('click','.cancel_btn', function(){
        $('.section_window form').each(function(){
          $(this)[0].reset();
          $(this).validate().resetForm()
        });
        $('.section_window').hide();
        $('.userAdd_btn').show();
      });

      // 新建用户和编辑用户时均需要用到该函数，
      // 区别在于新建用户时需要默认全选所有的可选权限，而编辑用户时第一次要仅选中自己有的权限，之后切换身份时才全选新增的身份权限。
      // 所以，新增第二个入参，数组形式，表明所需要选中的权限颗粒。 //commonCheckArr
      function showPermissions(roleArr, flag, checkArr){
        // var rtn = [];
        // Object.keys(permissionData).forEach(function(e){
        //   // 已选中的角色进行处理
        //   if (roleArr.some(function(el){
        //     return el == e
        //   })) {
        //     // 如果rtn没有包含该类风控，则添加。如果有，则合并
        //     permissionData[e].forEach(function(single){
        //       if (rtn.some(function(r){
        //         return r.category == single.category
        //       })) {
        //         rtn.forEach(function(r){
        //           if (r.category == single.category) {
        //             r.permissions = $.extend(true, {}, r.permissions, single.permissions);
        //           }
        //         })
        //       }else{
        //         rtn.push($.extend(true, {}, single));
        //       }
        //     })
        //   }
        // });

        // // var html = '';
        // // rtn.forEach(function(e){
        // //   html += '<dl>'
        // //   html += '<dt style="font-weight:bold;">' + e.category + '</dt>';
        // //   Object.keys(e.permissions).forEach(function(permission){
        // //     html += '<dd><label><input name="permission_checkbox" type="checkbox" value="'+ permission +'">' + e.permissions[permission] + '</label></dd>';
        // //   });
        // //   html += '</dl>';
        // // });
        // // $('.permissions-content').html(html);

        // if (true == flag) {
        //   commonCheckArr.forEach(function(e){
        //     $('[name="permission_checkbox"]').each(function(){
        //       if (e == $(this).val()) {
        //         $(this).prop('checked', 'checked');
        //       }
        //     })
        //   });

        //   checkArr.forEach(function(e){
        //     $('[name="permission_checkbox"]').each(function(){
        //       if (e == $(this).val()) {
        //         $(this).prop('checked', 'checked');
        //       }
        //     })
        //   });

        //   commonCheckArr.length = 0;
        //   $('[name="permission_checkbox"]').each(function(){
        //     if ($(this).prop('checked')) {
        //       commonCheckArr.push( $(this).val() );
        //     }
        //   });
        //   commonCheckArr = commonCheckArr.unique();
        // }else if(false == flag){
        //   commonCheckArr.forEach(function(e){
        //     $('[name="permission_checkbox"]').each(function(){
        //       if (e == $(this).val()) {
        //         $(this).prop('checked', 'checked');
        //       }
        //     })
        //   });

        //   checkArr.forEach(function(e){
        //     $('[name="permission_checkbox"]').each(function(){
        //       if (e == $(this).val()) {
        //         $(this).prop('checked', 'false');
        //       }
        //     })
        //   });

        //   commonCheckArr.length = 0;
        //   $('[name="permission_checkbox"]').each(function(){
        //     if ($(this).prop('checked')) {
        //       commonCheckArr.push( $(this).val() );
        //     }
        //   });
        //   commonCheckArr = commonCheckArr.unique();
        // }

        // if (roleArr.length == 0) {
        //   $('.permissions').hide();
        // }else{
        //   $('.permissions').show();
        // }
      }


      // $(document).on('change', '#useredit-form .role_id', function(){
      //   var roleArr = [];
      //   $('#useredit-form .role_id:checked').each(function(){
      //     roleArr.push(this.value);
      //   });

      //   // 新增处理，权限颗粒
      //   // 用户选中时，勾选该角色的所有颗粒
      //   // 取消选中时，去除勾选该角色所！特有！的颗粒 所谓特有，是指其自身拥有而其他已经勾选的角色所没有的权限
      //   var flag =  $(this).prop('checked');
      //   var cur_role_id = $(this).val();
      //   var needCheckArr = [];
      //   if (true == flag) {
      //     permissionData[cur_role_id].forEach(function(e){
      //       Object.keys(e.permissions).forEach(function(el){
      //         needCheckArr.push(el);
      //       })
      //     })

      //     // 新增第二个入参checkArr，用来传入需要选中的权限颗粒
      //     showPermissions(roleArr, true, needCheckArr);
      //   }else{
      //     var specialCheckArr = [];
      //     // 根据roleArr计算出取消之后选中的角色
      //     var afterRoleArr = roleArr.filter(function(e){
      //       return cur_role_id != e;
      //     });
      //     // 计算取消之后所有的权限颗粒
      //     var afterAllPermissons = [];
      //     afterRoleArr.forEach(function(ele){
      //       permissionData[ele].forEach(function(e){
      //         Object.keys(e.permissions).forEach(function(el){
      //           afterAllPermissons.push(el);
      //         })
      //       })
      //     })

      //     // 遍历取消的角色的权限颗粒，如果不在上一个数组中，则记录为特有颗粒。
      //     permissionData[cur_role_id].forEach(function(e){
      //       Object.keys(e.permissions).forEach(function(el){
      //         if (afterAllPermissons.indexOf(el) == -1) {
      //           specialCheckArr.push(el);
      //         }
      //         // afterAllPermissons.push(el);
      //       })
      //     })

      //     // 新增第二个入参checkArr，用来传入需要选中的权限颗粒
      //     showPermissions(roleArr, false, specialCheckArr);
      //   }
      // });

      $(document).on('change', '[name="permission_checkbox"]', function(){
        var thisVal = $(this).val();
        if ($(this).prop('checked')) {
          commonCheckArr.push(thisVal)
        }else{
          commonCheckArr = commonCheckArr.filter(function(e){
            return e != thisVal;
          })
        }
      });

      //begin 注销用户
      $(document).on('click', '.table_btn.destroy', function(){
        if ($(this).hasClass('disabled')) {
          return;
        }
        var name = $(this).parents('tr').find('.table_real_name').html();
        var user_id = $(this).parents('tr').find('.table_user_id').html();
        $.confirm({
          title: '注销确认',
          // content: '您确定要注销用户【'+ name +'】吗？',
          content: '<div style="text-align: center;height: 150px;line-height: 150px;"><i class="warn-icon"></i>您确定要注销用户【'+ name +'】吗？</div>',
          closeIcon: true,
          confirmButton: ' 继续 ',
          // confirmButtonClass: 'confirm-class',
          // cancelButton: ' 取消 ',
          cancelButton: false,
          // cancelButtonClass: 'cancel-class',
          confirm: function(){
            $.ajax({
              // url: '/bms-pub/user/cancel_user',
              url: '/bms-pub/user/modify',
              type: 'post',
              data:{
                user_id: user_id,
                status: 2
              },
              success: function(res){
                // if (tipTimer) {
                //   clearTimeout(tipTimer);
                //   tipTimer = undefined;
                // }
                if (0 == res.code) {
                  $.omsAlert('注销成功');
                }else{
                  $.omsAlert(res.msg);
                }

                getTableData();
              }
            });
          }
        })
      });
      //end 注销用户

      // begin 激活用户
      $(document).on('click', '.table_btn.doActive', function(){
        if ($(this).hasClass('disabled')) {
          return;
        }
        var name = $(this).parents('tr').find('.table_real_name').html();
        var user_id = $(this).parents('tr').find('.table_user_id').html();
        $.confirm({
          title: '激活确认',
          // content: '您确定要激活用户【'+ name +'】吗？',
          content: '<div style="text-align: center;height: 150px;line-height: 150px;"><i class="warn-icon"></i>您确定要激活用户【'+ name +'】吗？</div>',
          closeIcon: true,
          confirmButton: ' 继续 ',
          // confirmButtonClass: 'confirm-class',
          // cancelButton: ' 取消 ',
          cancelButton: false,
          // cancelButtonClass: 'cancel-class',
          confirm: function(){
            $.ajax({
              url: '/bms-pub/user/modify',
              type: 'post',
              data:{
                user_id: user_id,
                status: 1
              },
              success: function(res){
                // if (tipTimer) {
                //   clearTimeout(tipTimer);
                //   tipTimer = undefined;
                // }
                if (0 == res.code) {
                  $.omsAlert('激活成功');
                }else{
                  $.omsAlert(res.msg);
                }

                getTableData();
              }
            });
          }
        })
      });
      // end 激活用户

      //begin：新增用户
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
      //end：新增用户

      //begin: 编辑用户
      $(document).on('click', '.table_btn.edit', function(){
       // $('.permissions').hide();
        $('#useredit-form .role_id').prop('checked', false);
        $('#useredit-form .is_specify').parents('.form-field').hide().siblings('hr').hide();

        var user_id = $(this).parents('tr').find('.table_user_id').html();
        $('.useredit_container').show();
        $('.userAdd_btn').hide();
        $.ajax({
          type: 'get',
          url: window.REQUEST_PREFIX + '/oms/helper/user_info',
          data: {
            with_permission: 1,
            user_id: user_id
          },
          success: function(res){
            if (0 === res.code) {
              // var tmpUserList = res.data.user_list;
              var tmpUserList = res.data;
              $('#useredit-form .user_id').html(user_id);
              $('#useredit-form .real_name').html(tmpUserList[0].real_name);
              $('#useredit-form .cellphone').val(tmpUserList[0].cellphone);
              // $('#useredit-form .role_id').val(res.data[0].role_id);
              // $('#useredit-form .role_id[value="'+ res.data[0].role_id +'"]').attr('value', res.data[0].role_id);

              tmpUserList[0].role_id.forEach(function(e){
                $('#useredit-form .role_id[value="'+ e +'"]').prop('checked', true);
              });

              $('#useredit-form .is_specify').prop('checked', (1 == tmpUserList[0].is_specify)?true:false);

              $('#useredit-form .display-real_name').html(tmpUserList[0].real_name);

              var roleArr = [];
              $('#useredit-form .role_id:checked').each(function(){
                roleArr.push(this.value);
              });
              if (window.LOGIN_INFO.user_id == user_id) {
                $('#useredit-form .role_id[value="1"]').prop('disabled', true);
              }else{
                $('#useredit-form .role_id[value="1"]').prop('disabled', false);
              }

              // 新增第二个入参checkArr，用来传入需要选中的权限颗粒
              commonCheckArr = Object.keys(tmpUserList[0].permission);
              showPermissions(roleArr, true, commonCheckArr);
            }
          }
        })
        getUserPermissions(randerPermissions,user_id,'useredit-form');
      });
      //end: 编辑用户

      //begin: 重置密码
      $(document).on('click', '.table_btn.reset', function(){
        var user_name = $(this).parents('tr').find('.table_real_name').html();
        $('.userreset_container .real_name').html(user_name);
        var user_id = $(this).parents('tr').find('.table_user_id').html();
        $('.userreset_container .user_id').val(user_id);
        $('.userreset_container').show();
        $('.userAdd_btn').hide();
      });
      //end: 重置密码

      // 切换显示
      $(document).on('change', '.page-select', function(){
        showTable(gridData);
      });
    });
    </script>
@endsection
