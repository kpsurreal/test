<div>
    <nav class="navbar navbar-inverse navbar-fixed-top">
      <div class="container-fluid">
        <div class="navbar-header">
          <span class="navbar-brand"><span class="glyphicon glyphicon-dashboard" aria-hidden="true"></span>
              <span class="yellow">{{ config('custom.app_name') }}</span>资产管理平台
          </span>


         {{-- side-nav 控制按钮 --}}
          <span class="side-nav-status"><i></i>
              <script>
                  (function(){
                      var me = $(this);
                      var side_nav_status = $.omsGetLocalJsonData('etc','side_nav_status','close');
                      me.on('click',toggle);

                      setView();

                      function toggle(){
                          side_nav_status = side_nav_status=='close' ? 'open' : 'close';
                          $.omsUpdateLocalJsonData('etc','side_nav_status',side_nav_status);
                          setView();
                      }

                      function setView(){
                          me.addClass(side_nav_status);
                          side_nav_status=='close' ? me.removeClass('open') : me.removeClass('close');
                          $(window).trigger({type:'side_nav_status:changed',side_nav_status:side_nav_status});
                      }
                  }).call(document.scripts[document.scripts.length-1].parentNode);
              </script>
          </span>

          {{-- 测试控制代码 正常模式/安静模式 前端风控／后台风控 --}}
          {{-- <silentCtrl></silentCtrl>
          <RiskCtrl></RiskCtrl> --}}
          <!-- <robotStatus></robotStatus> -->
        </div>
        <div class="navbar-collapse collapse">
            <div hover-active=".navbar-avatar" class="navbar-avatar">
                <a>
                    <img class="avatar_url" />
                    <span class="avatar_nick_name"></span>
                </a>
                <div class="sub-menu">
                    <div><span class="avatar_nick_name"></span><span class="avatar_role"></span></div>
                    {{-- <a class="btn_personal_info">
                        <i class="icon-menu-1"></i>
                        个人资料
                    </a>
                    <a class="btn_change_password">
                        <i class="icon-menu-2"></i>
                        修改密码
                    </a> --}}
                    <a class="btn_logout">
                        <i class="icon-menu-3"></i>
                        退出
                    </a>
                </div>
            </div>

        </div><!--/.nav-collapse -->
        <script>
        $('.avatar_url').attr('src', $.pullValue(window, 'LOGIN_INFO.avatar_url'));
        $('.avatar_nick_name').html($.pullValue(window, 'LOGIN_INFO.real_name'));
        // if ('' != $.pullValue(window, 'LOGIN_INFO.nick_name')) {
        //     $('.avatar_nick_name').html($.pullValue(window, 'LOGIN_INFO.nick_name'));
        // }else{
        //     $('.avatar_nick_name').html($.pullValue(window, 'LOGIN_INFO.real_name'));
        // }
        var tmpStr = '(未分配权限)';
        var role_id = $.pullValue(window, 'LOGIN_INFO.role_id');
        if (1 == role_id) {
            tmpStr = '(管理员)';
        }else if(11 == role_id){
            tmpStr = '(基金经理)';
        }else if(12 == role_id){
            tmpStr = '(交易总监)';
        }else if(13 == role_id){
            tmpStr = '(交易员)';
        }else if(14 == role_id){
            tmpStr = '(风控总监)';
        }
        $('.avatar_role').html(tmpStr);

        $('.btn_logout').on('click', function(){
            LogOut();
            return false;
        })
        </script>
      </div>
    </nav>
    <div class="nav-ghost"></div>
</div>
