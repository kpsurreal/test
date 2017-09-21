@extends('adminmanager_standard')

@section('asset-css')
  <link href="{{ asset('/js/jquery-confirm/jquery-confirm.min.css') }}" rel="stylesheet">
  <link href="{{ asset('/css/oms.min.css') }}" rel="stylesheet">
  @if($host_theme == 'standard')
        <link href="{{ asset('/css/oms.min.css') }}" rel="stylesheet">
    {{-- @elseif($condition) --}}
    @else
        <link href="{{ asset('/css/theme1/oms.min.css') }}" rel="stylesheet">
    @endif
  <style>
    .jconfirm-box-container{
      margin-left: 33%;
      width: 380px;
      position: relative;
      min-height: 1px;
      padding-right: 15px;
      padding-left: 15px;
    }
    .jconfirm.jconfirm-white .jconfirm-box .buttons button.btn-default{
      padding: 2px 4px;
      border-radius: 2px;
      background: #fff;
      color: #5b8cf1;
      font-weight: normal;
    }
    .jconfirm.jconfirm-white .jconfirm-box .buttons{
      float: none;
      text-align: center;
    }
    .jconfirm .jconfirm-box .buttons button+button{
      margin-left: 10px;
    }
    .jconfirm .jconfirm-box div.content-pane .content{
      padding-top: 20px;
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
  <script src="{{ asset('/js/jquery-confirm/jquery-confirm.min.js') }}"></script>

  <div class="main-container fc">
    <section class="section-container">
      <div class="container-title">
        <h2 class="page-title">个人设置</h2>
        <div style="clear:both;"></div>
      </div>
      <div class="container-content">
        <div class="container-content-menuV2" id="content-menu">
          <ul>
            <li v-on:click="goto('.userInfo')" :class="[{active: active == '.userInfo'}]">
              <span>个人资料</span>
            </li>
            <li v-on:click="goto('.passwordModify')" :class="[{active: active == '.passwordModify'}]">
              <span>密码修改</span>
            </li>
          </ul>
        </div>
        <div style="margin-top:20px;display: none;" class="user-tab-content userInfo">
            <form id="useredit-form" class="user-form">
                <p class="form-field">
                    <label class="form-left">登录id</label>
                    <span class="user_id"></span>
                </p>
                <p class="form-field">
                    <label class="form-left">角色</label>
                    <span class="role_id"></span>
                </p>
                {{-- <p class="form-field">
                    <label class="form-left">昵称</label>
                    <input name="nick_name" class="input-text nick_name" type="text" placeholder="昵称" />
                </p> --}}
                <p class="form-field">
                    <label class="form-left">用户名<b>*</b></label>
                    <input name="real_name" class="input-text real_name" type="text" placeholder="输入用户名" />
                </p>
                <p class="form-field">
                    <label class="form-left">手机号</label>
                    <input name="cellphone" class="input-text cellphone" type="text" placeholder="输入电话号码" />
                </p>
                <div style="margin-top:50px;">
                    <button type="submit" class="form_submit_btn">保存修改</button>
                    {{-- <button type="button" class="cancel_btn">取消</button> --}}
                </div>
            </form>
        </div>
        <div style="margin-top:20px;display: none;" class="user-tab-content passwordModify">
            <form id="userpassword-form" class="user-form">
                <span style="display:none;" class="user_id"></span>
                <div class="form-field">
                    <label class="form-left">原密码<b>*</b></label>
                    <input name="login_password" class="input-text login_password" type="password" placeholder="请输入原密码"  />
                    <div style="display: inline-block;position: absolute;width: 290px;left: 95px;">
                        <div class="showPasswordIcon"></div>
                    </div>
                </div>
                <div class="form-field">
                    <label class="form-left">新密码<b>*</b></label>
                    <input name="new_password" class="input-text new_password" type="password" placeholder="请输入新密码"  />
                    <div style="display: inline-block;position: absolute;width: 290px;left: 95px;">
                        <div class="showPasswordIcon"></div>
                    </div>
                </div>

                <div style="margin-top:50px;">
                    <button type="submit" class="form_submit_btn">保存修改</button>
                    {{-- <button type="button" class="cancel_btn">取消</button> --}}
                </div>
            </form>
        </div>
      </div>
    </section>
    <span id="page_tip" class="hide"></span>
  </div>
  <script>
    var tipTimer;
    var gridData = {};

    function validateUsereditForm(){
        $("#useredit-form").validate({
            'errorClass': 'tips',
            rules: {
                // 'nick_name':{
                //     checkChineseAlphaNumber: true,
                //     maxlength: 20
                // },
                'real_name':{
                    required: true,
                    checkChineseAlphaNumber: true,
                    maxlength: 16
                },
                'cellphone': {
                    checkphone: true
                }
            },
            messages: {
                // 'nick_name':{
                //     required: '请输入昵称',
                //     checkChineseAlphaNumber: '只允许输入汉字、字母、数字',
                //     maxlength: '最多允许输入20个字'
                // },
                'real_name':{
                    required: '请输入用户名',
                    checkChineseAlphaNumber: '只允许输入汉字、字母、数字',
                    maxlength: '最多允许输入16个字'
                },
                'cellphone': {
                    checkphone: '手机号格式不正确'
                }
            },
            // highlight: function(element, errorClass) {
            //     $(element).removeClass(errorClass);
            // },
            errorPlacement: function(error, element) {
                error.appendTo(element.parent());
            },
            submitHandler: function (form) {
                var user_id = $('#useredit-form .user_id').html();
                var real_name = $('.real_name').val();
                var nick_name = $('.nick_name').val();
                var cellphone = $('#useredit-form .cellphone').val();

                $.ajax({
                    type: 'post',
                    url: '/bms-pub/user/modify_self',
                    data:{
                        user_id: user_id,
                        real_name: real_name,
                        nick_name: nick_name,
                        cellphone: cellphone
                    },
                    success: function(res){
                        if (0 == res.code) {
                            getUserInfo();
                            $('.navbar-avatar .avatar_nick_name').html(real_name);
                            // if(''!=nick_name){
                            //     $('.navbar-avatar .avatar_nick_name').html(nick_name);
                            // }else{
                            //     $('.navbar-avatar .avatar_nick_name').html(real_name);
                            // }
                            $.omsAlert(res.msg);
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

    function validateUserpasswordForm(){
        $("#userpassword-form").validate({
            'errorClass': 'tips',
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
                    required: '请输入密码',
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
                var user_id = $('#userpassword-form .user_id').html();
                var new_password = $('.new_password').val();
                var login_password = $('.login_password').val();
                $.ajax({
                    type: 'post',
                    // url: window.REQUEST_PREFIX + '/user/reset_mine',
                    url: '/bms-pub/user/modify_self_password',
                    data:{
                        user_id: user_id,
                        new_password: new_password,
                        login_password: login_password
                    },
                    success: function(res){
                        if (0 == res.code) {
                            $.omsAlert(res.msg);
                            getUserInfo();
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

    function getUserInfo(){
        var user_id = window.LOGIN_INFO.user_id;
        $.ajax({
            type: 'get',
            url: window.REQUEST_PREFIX + '/oms/helper/user_info',
            data: {
                user_id: user_id
            },
            success: function(res){
                if (0 === res.code) {
                    $('#useredit-form .user_id').html(res.data[0].user_id);
                    var tmpHtml = utils.getRoleName(res.data[0].role_id);
                    $('#useredit-form .role_id').html(tmpHtml);

                    $('#useredit-form .nick_name').val(res.data[0].nick_name);
                    $('#useredit-form .real_name').val(res.data[0].real_name);
                    $('#useredit-form .cellphone').val(res.data[0].cellphone);

                    $('#userpassword-form .user_id').html(user_id);

                }
            }
        });
    }

    // 获取 hash 参数：
    // location.href = ...?market=1
    // _search_get('market'); //output:1
    function _search_get(name){
        return utils.search_get(name);
    }

    $(function(){
      var contentMenu = new Vue({
        el: '#content-menu',
        data: {
          active: '.userInfo'
        },
        methods: {
          goto: function(active){
            if (!active) {
              return;
            }

            this.active = active;
            $(active).show().siblings('.user-tab-content').hide();
          }
        }
      });
      contentMenu.goto('.userInfo')

      if ('user_info' === _search_get('active')) {
          $('.user_info').addClass('active').siblings().removeClass('active');
          $($('.user_info').attr('active-class')).show().siblings('.user-tab-content').hide();
      }else if('user_password' === _search_get('active')){
          $('.user_password').addClass('active').siblings().removeClass('active');
          $($('.user_password').attr('active-class')).show().siblings('.user-tab-content').hide();
      }else{
          var str = 'user_info';
          $('.' + str).addClass('active').siblings().removeClass('active');
          $($('.' + str).attr('active-class')).show().siblings('.user-tab-content').hide();
      }
      getUserInfo();
      validateUsereditForm();
      validateUserpasswordForm();

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
    });
  </script>
@endsection
