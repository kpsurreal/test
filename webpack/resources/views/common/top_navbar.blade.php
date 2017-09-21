<div>
    <nav class="navbar navbar-inverse navbar-fixed-top">
      <div class="container-fluid">
        <div class="navbar-header">
          <span class="navbar-brand"><span class="glyphicon glyphicon-dashboard" aria-hidden="true"></span>
              <span class="yellow">{{ config('custom.app_name') }}</span>资产管理平台
          </span>

         {{-- side-nav 控制 --}}
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

          {{-- 测试控制代码 --}}
          <silentCtrl></silentCtrl>
          <RiskCtrl></RiskCtrl>
          <!-- <robotStatus></robotStatus> -->
        </div>
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
                {{-- <li><a href="https://www.caopanman.com" target="_blank">操盘侠首页</a></li> --}}
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
      </div>
    </nav>
    <div class="nav-ghost"></div>
</div>
