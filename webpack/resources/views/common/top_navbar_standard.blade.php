<?php
use App\Services\RoleService;
?>
<div>
    <style>
    .order_div{
        padding: 0 20px;
        float:right;
        position:relative;
        display: inline-block;
        border-left: 1px solid #3A4B5C;
        border-right: 1px solid #3A4B5C;

        height: 50px;
        /*float: left;*/
        line-height: 50px;
        color: #FFFFFF;
        font-family: 'PingFang SC';
        font-size: 18px;
        cursor: pointer;
    }
    .order_div.active{
        background-color: #2a3642;
        color: #FFFFFF;
    }
    /*.order_div>a{
        height: 50px;
        float: left;
        line-height: 50px;
        color: #FFFFFF;
        font-family: 'PingFang SC';
        font-size: 18px;
    }*/
    .pb_div{
        padding: 0 20px;
        float:right;
        position:relative;
        display: inline-block;
        border-left: 1px solid #3A4B5C;
        border-right: 1px solid #3A4B5C;
    }
    .pb_div.active{
        background-color: #2a3642;
    }
    .pb_div>a{
        height: 50px;
        float: left;
        line-height: 50px;
        color: #FFFFFF;
        font-family: 'PingFang SC';
        font-size: 18px;
    }
    .pb_scan{
        float: right;
    }
    .pb_normal{
        color: #4a4a4a;
    }
    .pb_error{
        color: #E74C3C;
    }
    .sub-pb{
        display: none;
        position: absolute;
        /*bottom: 35px;*/
        top: 30px;
        right: 0;/*10px;*/
        line-height: initial;
        padding-top: 20px;
        /*width: 187px;*/
        min-height: 68px;
    }
    .pb_info{
        display: block;
        white-space: nowrap;
        min-width: 160px;
        /*width: 160px;*/
        /*background-color: #fff;*/
        border: 1px solid #ccc;
        /*border-radius: 2px;*/
        /*padding-left: 10px;
        padding-top: 8px;
        padding-bottom: 8px;*/
        /*box-shadow: 0px 1px 4px #999;*/
        font-size: 12px;
        color: #E74C3C;
        padding: 15px 10px;
        background-color: RGBA(59,77,93,.95);
        border-radius: 0 0 4px 4px;
    }
    .pb_info.normal{
        text-align: center;
        color: #999;
    }
    .pb_info>p{
        margin-bottom: 7px;
    }
    .pb_error_num, .order_error_num{
        display: none;
        /*width: 18px;*/
        height: 18px;
        color: white;
        /*display: inline-block;*/
        /*width: 12px;*/
        text-align: center;
        position: absolute;
        top: 6px;
        right: 6px;
        line-height: 12px;
        font-size: 12px;
        border-radius: 100px;
        background-color: rgb(231, 76, 60);
        padding: 4px;
    }
    /*.pb_info:after{
        content: '';
        display: block;
        position: absolute;
        top: -7px;
        right: 7px;
        width: 13px;
        height: 13px;
        background: #fff;
        border: 3px solid #ccc;
        transform: rotate(45deg);
        border-bottom-color: transparent;
        border-right-color: transparent;
    }*/
    </style>
    <nav class="navbar navbar-inverse navbar-fixed-top">
      <div class="container-fluid">
        <div class="navbar-header">
          <span class="navbar-brand">
              <span class="glyphicon glyphicon-dashboard" aria-hidden="true" style="display:none;"></span>
              <span class="yellow">{{ config('custom.app_name') }}</span>资产管理平台
          </span>

         {{-- side-nav 控制 --}}
          {{-- <span class="side-nav-status">
              <i></i>
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
          </span> --}}

          {{-- 测试控制代码 --}}
          <silentCtrl></silentCtrl>
          <RiskCtrl></RiskCtrl>
          <!-- <robotStatus></robotStatus> -->
        </div>
        @if(config('custom.showBasicTop'))
            <div class="navbar-collapse collapse">
                <clearLocalStorage></clearLocalStorage>
                <ul class="nav navbar-nav navbar-right">
                    @if( isset($logined_info) && isset($logined_info['user_id']) && $logined_info['user_id']==config('oms.root_uid') )
                        <li>
                            <a href="{{ config('view.path_prefix','') }}/oms/etc/auth" target="_blank">权限管理</a>

                            {{-- Order 异常监控 --}}
                            <a href="{{ config('view.path_prefix','') }}/oms/etc/order_faild" target="_blank">Order异常<span style="color:red;"></span>
                                <script>
                                    (function(){
                                        var me = $(this);
                                        //三秒钟刷新一次机器人订单异常
                                        updateOrderFailed();
                                        setInterval(updateOrderFailed,30*1000);
                                        function updateOrderFailed(){
                                            $.get('{{ config('view.path_prefix','') }}/oms/helper/get_order_faild_count').done(function(res){
                                                me.find('span').html($.pullValue(res,'data.cnt',''));
                                            });
                                        }
                                    }).call(document.scripts[document.scripts.length-1].parentNode);
                                </script>
                            </a>
                        </li>
                    @endif
                    <li><a href="https://www.caopanman.com" target="_blank">操盘侠首页</a></li>
                    <li>
                        {{-- 用户退出 --}}
                        <a href="javascript:;" target="_blank">
                            <span>退出</span>
                            <script>
                                (function(){
                                    $(this).click(function(){
                                        $.post('/bms-pub/user/logout').always(function(){
                                            $.removeCookie('app_token', {path: '/'});
                                            $.removeCookie('sns_token', {path: '/'});
                                            location.href =  (window.REQUEST_PREFIX||'') + "/user/login";
                                        });
                                        return false;
                                    });
                                }).call(document.scripts[document.scripts.length-1].parentNode);
                            </script>
                        </a>
                    </li>
                </ul>
            </div><!--/.nav-collapse -->
        @endif
        @if(!config('custom.showBasicTop'))
            <div class="navbar-collapse collapse">
                <a class="btn_logout">
                    <i class="icon-menu-3"></i>
                </a>
                <div hover-active=".navbar-avatar" class="navbar-avatar">
                    <a>
                        <img class="avatar_url" />
                        <span class="avatar_nick_name"></span>
                        <i></i>
                    </a>
                    <div class="sub-menu" style="opacity: .95;">
                        <div class="infoDiv">
                            <span class="avatar_nick_name" style="display: block;line-height: initial;margin-bottom:10px;"></span>
                            <span class="avatar_role" style="display: block;line-height: initial;"></span>
                        </div>
                        <a class="btn_personal_info" style="border-radius: 0 0 4px 4px;" href="{{ config('view.path_prefix','') }}/user/get_modify">
                            {{-- <i class="icon-menu-1"></i> --}}
                            个人设置
                        </a>
                        {{--
                        <a class="btn_change_password">
                            <i class="icon-menu-2"></i>
                            修改密码
                        </a> --}}
                        {{-- <a class="btn_logout">
                            <i class="icon-menu-3"></i>
                            退出
                        </a> --}}
                    </div>
                </div>
                @if(false && isset($logined_info) && isset($logined_info['user_id']) && $logined_info['user_id']==config('oms.root_uid') )
                    <a href="{{ config('view.path_prefix','') }}/oms/etc/order_faild" hover-active=".order_div" class="order_div">
                        <div class="order_pic"></div>
                        <span style="color: white;">订单异常</span>
                        <span class="order_error_num"></span>
                        <script>
                            (function(){
                                var me = $(this);
                                //三秒钟刷新一次机器人订单异常
                                updateOrderFailed();
                                setInterval(updateOrderFailed,30*1000);
                                function updateOrderFailed(){
                                    $.get('{{ config('view.path_prefix','') }}/oms/helper/get_order_faild_count').done(function(res){
                                        var num = $.pullValue(res,'data.cnt','');
                                        if (0 == num || '' == num) {
                                            me.find('span.order_error_num').html(num).hide();
                                        }else{
                                            me.find('span.order_error_num').html(num).show();
                                        }
                                    });
                                }
                            }).call(document.scripts[document.scripts.length-1].parentNode);
                        </script>
                    </a>
                @endif
                @if(isset($logined_info) && isset($logined_info['role_id']) && (in_array(RoleService::ROLE_ID_ADMIN, $logined_info['role_id']) || in_array(RoleService::ROLE_ID_TRADER, $logined_info['role_id'])))
                    <div hover-active=".pb_div" class="pb_div">
                        <a>
                            <div class="server_pic"></div>
                            <span class="server_text">账户检测</span>
                            <span class="pb_error_num"></span>
                        </a>
                        <div class="sub-pb" style="opacity: .95;">
                            <div class="pb_info">
                            </div>
                        </div>
                    </div>
                @endif
            </div>
            <script>
                $('.btn_logout').on('click', function(){
                    LogOut();
                    return false;
                })

                var timerLock;
                function getPbIntervel(){
                    setTimeout(function(){
                        getPbData(getPbIntervel);
                    }, 1000 * 10);
                }

                function getPbData(callback){
                    $('.btn_pb_scan').hide();
                    $('.pb_scan').removeClass('pb_error').html('正在检测PB系统...');
                    // $('.pb_error_num').hide();
                    timerLock = new Date().getTime();
                    var tmpLock = timerLock;
                    $.ajax({
                        // url: window.REQUEST_PREFIX + '/user/pb_check_error',//pb_check
                        url: '/bms-pub/system/pb_check_error ',
                        type: 'get',
                        data: {},
                        success: function(res){
                            if (tmpLock != timerLock) {
                                return;
                            }
                            if (0 == res.code) {
                                var count = 0;
                                var htmlArr = [];
                                res.data.lists.forEach(function(e, i){
                                    if (0 == e.status) {

                                    }else if(1 == e.status){
                                        count += 1;
                                        // htmlArr.push('<p>' + e.securities_name + e.pb_account + '【系统异常】' + e.status_msg + '</p>');
                                        htmlArr.push('<p>' + e.securities_name + '【系统异常】' + e.msg + '</p>');
                                    }else if(2 == e.status){
                                        count += 1;
                                        // htmlArr.push('<p>' + e.securities_name + e.pb_account + '【PB账户/资金账户异常】' + e.status_msg + '</p>');
                                        htmlArr.push('<p>' + e.securities_name + '【PB账户/资金账户异常】' + e.msg + '</p>');
                                    }else if(3 == e.status){
                                        count += 1;
                                        htmlArr.push('<p>' + e.msg + '</p>');
                                    }else{
                                        
                                    }
                                });

                                if (0 != count) {
                                    $('.pb_scan').addClass('pb_error').html(htmlArr[0]);
                                    $('.pb_error_num').html(count).show();
                                    $('.pb_info').removeClass('normal').html(htmlArr.join(''));
                                    $('.btn_pb_scan').show();
                                }else{
                                    $('.pb_scan').removeClass('pb_error').html('PB运行正常');
                                    $('.pb_info').addClass('normal').html('无异常');
                                    $('.btn_pb_scan').show();
                                    $('.pb_error_num').hide();
                                }

                            }
                            if ("[object Function]" == Object.prototype.toString.call(callback)) {
                                callback.call();
                            }
                        },
                        error: function(){
                            $('.btn_pb_scan').show();
                            $('.pb_scan').addClass('pb_error').html('网络异常');
                            if ("[object Function]" == Object.prototype.toString.call(callback)) {
                                callback.call();
                            }
                        }
                    });
                }
                $(function(){
                    if (window.LOGIN_INFO) {
                        $('.avatar_url').attr('src', $.pullValue(window, 'LOGIN_INFO.avatar_url'));
                        $('.avatar_nick_name').html($.pullValue(window, 'LOGIN_INFO.real_name'));
                        var tmpStr = '(未分配权限)';
                        var role_id = $.pullValue(window, 'LOGIN_INFO.role_id');
                        var roleStr = '';
                        if(role_id.length > 0){
                            roleStr = utils.getRoleName(role_id);
                        }
                        $('.avatar_role').html(roleStr);

                        getPbData();
                        getPbIntervel();

                        $( '.pb_div' ).mouseenter( function(){
                            $('.sub-pb').show();
                        } ).mouseleave( function(){
                            $('.sub-pb').hide();
                        } );

                        $(document).on('click','.btn_pb_scan', function(){
                            getPbData();
                        });
                    }
                });
            </script>
        @endif
        @if(false == Request::is('user/login'))
            <script type="text/javascript">
                // 用户登陆状态过期时间调整
                $(function(){
                    // 此处判断是否是客户端
                    if (window !== top.window) {
                        function validSystemTime(oldV, newV){
                            // console.log('oldV: ' + oldV + ' newV: ' + newV);
                            // return (newV - oldV) < 10 * 1000;
                            return (newV - oldV) < 8 * 60 * 60 * 1000;
                        }

                        function clearToken(){
                            $.removeCookie('app_token', {path: '/'});
                            $.removeCookie('sns_token', {path: '/'});
                            location.href = (window.REQUEST_PREFIX||'') + "/user/login?alert=timeout";
                        }

                        var localSystemTime = new Date().getTime();
                        $(window).on('mousemove', function(){
                            // 校验记录的系统时间与当前系统时间的差值
                            var thisTime = new Date().getTime();

                            if (localSystemTime == '' || validSystemTime(localSystemTime, thisTime)) {
                                localSystemTime = thisTime;
                            }else{
                                clearToken();
                            }
                        });
                        setInterval(function(){
                            var thisTime = new Date().getTime();
                            if (localSystemTime == '' || validSystemTime(localSystemTime, thisTime)) {
                                // 不需要刷新保存的系统时间
                            }else{
                                clearToken();
                            }
                        }, 1000)
                    }
                })
            </script>
        @endif

      </div>
    </nav>
    <div class="nav-ghost"></div>
</div>
