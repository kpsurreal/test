{{-- Added by liuzeyafzy@gmail.com 标准版而准备的左侧菜单 --}}
<?php
use App\Services\UserService;
$org_info = UserService::getOrgInfo();
?>
<div>
    <div class="section nav-manager" task-info>
        <div>
            <span class="side-nav-status {{ isset($_COOKIE["common_status_sideNav"])?$_COOKIE["common_status_sideNav"]:"close" }}">
                <i></i>
                <script>
                    $(function(){
                        var me = $('.side-nav-status');
                        // var side_nav_status = $.omsGetLocalJsonData('etc','side_nav_status','close');
                        // var side_nav_status = localStorage.getItem('common_status_sideNav') || 'close';
                        var side_nav_status = '{{ isset($_COOKIE["common_status_sideNav"])?$_COOKIE["common_status_sideNav"]:"close" }}';
                        $.cookie('common_status_sideNav', side_nav_status, { path: '/', expires: 7 });
                        // setView();
                        me.on('click', function(){
                            toggle();
                        });
                        function toggle(){
                            $('.title-multi').removeClass('showChildren');

                            side_nav_status = side_nav_status=='close' ? 'open' : 'close';
                            $.cookie('common_status_sideNav', side_nav_status, { path: '/', expires: 7 });
                            $('.status-menu-tip').removeClass('show');
                            // localStorage.setItem('common_status_sideNav', side_nav_status);
                            // localStorage.setItem('common_status_sideNav', 'close');
                            // $.omsUpdateLocalJsonData('etc','side_nav_status', 'open');
                            setView();
                        }

                        function setView(){
                            // localStorage.setItem('common_status_sideNav', 'close');
                            me.addClass(side_nav_status);
                            side_nav_status=='close' ? me.removeClass('open') : me.removeClass('close');
                            $(window).trigger({type:'side_nav_status:changed',side_nav_status:side_nav_status});
                        }

                        $(window).on('side_nav_status:doShow', function(){
                            side_nav_status = 'open';
                            setView();
                        })

                        $(document).on('click', '.menu-tip-cancel', function(){
                            $('.status-menu-tip').removeClass('show');
                        })

                        setTimeout(function(){
                            $('.status-menu-tip').removeClass('show');
                        }, 5 * 1000);

                        var flag = utils.search_get('first_login');
                        if ('true' == flag) {
                            $('.status-menu-tip').addClass('show');
                        }
                    });
                </script>
            </span>
            <div class="status-menu-tip">
                <div style="position:relative;height: 100%;width: 100%;">
                    <span class="menu-tip-cancel">x</span>
                    <span style="width: 100%;height: 100%;padding: 30px 50px 60px;display: block;">点这里可以展开菜单详情哦！</span>
                </div>
            </div>
        </div>
        {{-- {{print_r($nav_permission) 1是有}} --}}
        {{-- {{$nav_permission['ins_exec']}} --}}
        {{--修改菜单 机构版为新菜单 专户暂为修改 按新的序号排序--}}
        @if(isset($org_info) && 3 != $org_info['theme'])
            @if($nav_permission['ins_submit'] || $nav_permission['ins_exec'])
                <div class="title-multi">
                    <a href="#" class="main-title {{(Request::is('oms/instruction/manage') || Request::is('oms/instruction/execute')) ? 'active' : ''}}">
                        <i class="menu_instruction_icon"></i>
                        指令管理
                        <b class="icon-select-down-1"></b>
                    </a>
                    <div class="menu-tip">指令管理</div>
                    @if($nav_permission['ins_submit'])
                        <div class="sub-title">
                            <div style="position:relative;">
                                <a href="{{ config('view.path_prefix','') }}/oms/instruction/manage" class="main-title {{(Request::is('oms/instruction/manage')) ? 'active' : ''}}">
                                    <i></i>
                                    指令提交
                                </a>
                                <div class="menu-tip">指令提交</div>
                            </div>
                        </div>
                    @endif
                    @if($nav_permission['ins_exec'])
                        <div class="sub-title">
                            <div style="position:relative;">
                                <a href="{{ config('view.path_prefix','') }}/oms/instruction/execute " class="main-title {{Request::is('oms/instruction/execute') ? 'active' : ''}}">
                                    <i></i>
                                    指令执行
                                </a>
                                <div class="menu-tip">指令执行</div>
                            </div>
                        </div>
                    @endif
                </div>
            @endif
            @if($nav_permission['ins_notify'])
                <div>
                    <a  href="{{ config('view.path_prefix','') }}/oms/instruction/notification "
                        class="main-title {{Request::is('oms/instruction/notification') ? 'active' : ''}}">
                        <i class="icon-menu-left-15"></i>
                        指令通知
                    </a>
                    <div class="menu-tip">指令通知</div>
                </div>
            @endif
            @if($nav_permission['ins_review'])
                <div>
                    <a  href="{{ config('view.path_prefix','') }}/sync/pb_ins/review"
                        class="main-title {{Request::is('sync/pb_ins/review') ? 'active' : ''}}">
                        <i class="icon-menu-left-13"></i>
                        指令审批
                    </a>
                    <div class="menu-tip">指令审批</div>
                </div>
            @endif
            @if($nav_permission['entrust_add'])
                <div>
                    <a  href="{{ config('view.path_prefix','') }}/oms/multi/is_running"
                        class="main-title {{Request::is('oms/multi/is_running') ? 'active' : ''}}">
                        <i class="icon-menu-left-2"></i>
                        委托管理
                    </a>
                    <div class="menu-tip">委托管理</div>
                </div>
            @endif
            @if($nav_permission['risk_manage'] || $nav_permission['product_risk'])
                <div>
                    <a  href="{{ config('view.path_prefix','') }}/risk"
                        class="main-title {{Request::is('risk') ? 'active' : ''}}">
                        <i class="icon-menu-left-4"></i>
                        风控监控
                    </a>
                    <div class="menu-tip">风控监控</div>
                </div>
            @endif
            @if($nav_permission['account_list'] )
                <div class="title-multi">
                    <a href="{{ config('view.path_prefix','') }}/product/base_lists" class="main-title {{(Request::is('product/base_lists')) ? 'active' : ''}}">
                        <i class="icon-menu-left-5"></i>
                        基金管理
                    </a>
                    <div class="menu-tip">基金管理</div>
                </div>
            @endif
            @if($nav_permission['fund_valuation'] || $nav_permission['cost_set'] || $nav_permission['suspension'] || $nav_permission['otc_capital'])
                    <div>
                        <a  href="{{ config('view.path_prefix','') }}/product/operation" class="main-title {{Request::is('product/operation') ? 'active' : ''}}">
                            <i class="icon-menu-left-16"></i>
                            运营管理
                            <span href="{{ config('view.path_prefix','').'/product/operation' }}" class="{{Request::is('product/operation') ? 'active' : ''}}"></span>
                        </a>
                        <div class="menu-tip">运营管理</div>
                    </div>
            @endif
            @if($nav_permission['report_view'])
                <div>
                    <a  href="{{ config('view.path_prefix','') }}/oms/report/report_group "
                        class="main-title {{Request::is('oms/report/report_group') ? 'active' : ''}}">
                        <i class="icon-menu-left-11"></i>
                        综合报表
                    </a>
                    <div class="menu-tip">综合报表</div>
                </div>
            @endif
            @if($nav_permission['view_instruct'] || $nav_permission['view_entrust'] || $nav_permission['view_deal'] || $nav_permission['view_position'] || $nav_permission['view_fee'] || $nav_permission['view_cash'])
                <div>
                    <a  href="{{ config('view.path_prefix','') }}/oms/report/report_list "
                        class="main-title {{Request::is('oms/report/report_list') ? 'active' : ''}}">
                        <i class="icon-menu-left-7"></i>
                        数据查询
                    </a>
                    <div class="menu-tip">数据查询</div>
                </div>
            @endif

            <div>
                <a  href="{{ config('view.path_prefix','') }}/report/file_center "
                    class="main-title {{Request::is('report/file_center') ? 'active' : ''}}">
                    <i class="icon-menu-left-14"></i>
                    {{-- 文件中心 --}}
                    文件中心
                </a>
                <div class="menu-tip">文件中心</div>
            </div>

            @if($nav_permission['user_manage'])
                <div>
                    <a  href="{{ config('view.path_prefix','') }}/user/list "
                        class="main-title {{Request::is('user/list') ? 'active' : ''}}">
                        <i class="icon-menu-left-6"></i>
                        {{-- 人员权限 --}}
                        人员权限
                    </a>
                    <div class="menu-tip">人员权限</div>
                </div>
            @endif
            @if(isset($nav_permission['sys_setting']) && $nav_permission['sys_setting'])
                <div>
                    <a  href="{{ config('view.path_prefix','') }}/system/page "
                        class="main-title {{Request::is('system/page') ? 'active' : ''}}">
                        <i class="icon-menu-left-12"></i>
                        系统运维
                    </a>
                    <div class="menu-tip">系统运维</div>
                </div>
            @endif
        @else
            @if($nav_permission['ins_submit'] || $nav_permission['ins_exec'])
                <div class="title-multi">
                    <a href="#" class="main-title {{(Request::is('oms/instruction/manage') || Request::is('oms/instruction/execute')) ? 'active' : ''}}">
                        <i class="menu_instruction_icon"></i>
                        指令管理
                        <b class="icon-select-down-1"></b>
                    </a>
                    <div class="menu-tip">指令管理</div>
                    @if($nav_permission['ins_submit'])
                        <div class="sub-title">
                            <div style="position:relative;">
                                <a href="{{ config('view.path_prefix','') }}/oms/instruction/manage" class="main-title {{(Request::is('oms/instruction/manage')) ? 'active' : ''}}">
                                    <i></i>
                                    指令提交
                                </a>
                                <div class="menu-tip">指令提交</div>
                            </div>
                        </div>
                    @endif
                    @if($nav_permission['ins_exec'])
                        <div class="sub-title">
                            <div style="position:relative;">
                                <a href="{{ config('view.path_prefix','') }}/oms/instruction/execute " class="main-title {{Request::is('oms/instruction/execute') ? 'active' : ''}}">
                                    <i></i>
                                    指令执行
                                </a>
                                <div class="menu-tip">指令执行</div>
                            </div>
                        </div>
                    @endif
                </div>
            @endif

            @if(isset($nav_permission['ins_notify']) && $nav_permission['ins_notify'])
                <div>
                    <a  href="{{ config('view.path_prefix','') }}/oms/instruction/notification "
                        class="main-title {{Request::is('oms/instruction/notification') ? 'active' : ''}}">
                        <i class="icon-menu-left-15"></i>
                        指令通知
                    </a>
                    <div class="menu-tip">指令通知</div>
                </div>
            @endif
            @if(isset($nav_permission['ins_review']) && $nav_permission['ins_review'])
                <div>
                    <a  href="{{ config('view.path_prefix','') }}/sync/pb_ins/review"
                        class="main-title {{Request::is('sync/pb_ins/review') ? 'active' : ''}}">
                        <i class="icon-menu-left-13"></i>
                        指令审批
                    </a>
                    <div class="menu-tip">指令审批</div>
                </div>
            @endif

            @if($nav_permission['ins_add'])
                <div>
                    <a  href="{{ config('view.path_prefix','') }}/oms/multi/policy_instruction"
                        class="main-title {{Request::is('oms/multi/policy_instruction') ? 'active' : ''}}">
                        <i class="icon-menu-left-1"></i>
                        指令提交
                    </a>
                    <div class="menu-tip">指令提交</div>
                </div>
            @endif
                @if($nav_permission['instruct_add'])
                    <div>
                        <a  href="{{ config('view.path_prefix','') }}/oms/multi/is_running"
                            class="main-title {{Request::is('oms/multi/is_running') ? 'active' : ''}}">
                            <i class="icon-menu-left-2"></i>
                            投资建议
                        </a>
                        <div class="menu-tip">投资建议</div>
                    </div>
                @endif

            @if($nav_permission['strategy_adv'])
                <div>
                    <a  href="{{ config('view.path_prefix','') }}/oms/allocation/index"
                        class="main-title {{Request::is('oms/allocation/index') ? 'active' : ''}}">
                        <i class="icon-menu-left-8"></i>
                        审核分单
                        <span if="allocations|>:0" data-src="allocations" class="new-count-tip red" style="display:none;"></span>
                    </a>
                    <div class="menu-tip">审核分单</div>
                </div>
            @endif
            @if($nav_permission['strategy_ins'])
                <div>
                    <a  href="{{ config('view.path_prefix','') }}/oms/gather"
                        class="main-title {{Request::is('oms/gather') ? 'active' : ''}}">
                        <i class="icon-menu-left-9"></i>
                        委托管理
                        <span if="orders|>:0" data-src="orders" class="new-count-tip yellow" style="display:none;"></span>
                    </a>
                    <div class="menu-tip">委托管理</div>
                </div>
            @endif
            {{-- @if($nav_permission['ins_exec'])
                <div style="display:none;">
                    <a  href="{{ config('view.path_prefix','') }}/oms/multi/policy_instruction"
                        class="main-title {{Request::is('oms/multi/policy_instruction') ? 'active' : ''}}">
                        <i class="icon-menu-left-3"></i>
                        审核执行
                    </a>
                    <div class="menu-tip">审核执行</div>
                </div>
            @endif --}}
            @if($nav_permission['risk_manage'] || $nav_permission['product_risk'])
                <div>
                    <a  href="{{ config('view.path_prefix','') }}/risk"
                        class="main-title {{Request::is('risk') ? 'active' : ''}}">
                        <i class="icon-menu-left-4"></i>
                        风控监控
                    </a>
                    <div class="menu-tip">风控监控</div>
                </div>
            @endif
            @if(isset($org_info) && 3 == $org_info['theme'])
                @if($nav_permission['advanced_manage'])
                    <div>
                        <a  href="{{ config('view.path_prefix','') }}/oms/advanced/gaosongzhuan"
                            class="main-title {{Request::is('oms/advanced/*') ? 'active' : ''}}">
                            <i class="icon-menu-left-10"></i>
                            高级任务
                            <span if="gaosongzhuans|>:0" data-src="gaosongzhuans" class="new-count-tip red" style="display:none;"></span>
                        </a>
                        <div class="menu-tip">高级任务</div>
                    </div>
                @endif
            @endif
            @if($nav_permission['product_manage'])
                <div>
                    <a href="{{ config('view.path_prefix','') }}/product/base_lists"
                        class="main-title {{(Request::is('product/base_lists') || Request::is('product/*')) ? 'active' : ''}}">
                        <i class="icon-menu-left-5"></i>
                        账户管理
                    </a>
                    <div class="menu-tip">账户管理</div>
                </div>
            @endif
            @if($nav_permission['account_list'] || $nav_permission['otc_capital'] || $nav_permission['suspension'])
                <div class="title-multi">
                    <a href="#" class="main-title {{( Request::is('product/base_lists') || Request::is('suspension/page') ||Request::is('product/otc/page')) ? 'active' : ''}}">
                        <i class="icon-menu-left-5"></i>
                        产品管理
                        <b class="icon-select-down-1"></b>
                    </a>
                    <div class="menu-tip">产品管理</div>
                    {{--@if($nav_permission['account_list'])--}}
                        <div class="sub-title">
                            <div style="position:relative;">
                                <a href="{{ config('view.path_prefix','') }}/product/base_lists" class="main-title {{(Request::is('product/base_lists')) ? 'active' : ''}}">
                                    <i></i>
                                    产品列表
                                </a>
                                <div class="menu-tip">产品列表</div>
                            </div>
                        </div>
                   {{-- @endif --}}
                   {{-- @if($nav_permission['otc_capital'])
                        <div class="sub-title">
                            <div style="position:relative;">
                                <a href="{{ config('view.path_prefix','') }}/product/otc/page " class="main-title {{Request::is('product/otc/page') ? 'active' : ''}}">
                                    <i></i>
                                    场外资产
                                </a>
                                <div class="menu-tip">场外资产</div>
                            </div>
                        </div>
                    @endif
                    @if($nav_permission['suspension'])
                        <div class="sub-title">
                            <div style="position:relative;">
                                <a href="{{ config('view.path_prefix','') }}/suspension/page " class="main-title {{Request::is('suspension/page') ? 'active' : ''}}">
                                    <i></i>
                                    停牌估值
                                </a>
                                <div class="menu-tip">停牌估值</div>
                            </div>
                        </div>
                    @endif --}}
                </div>
            @endif
            @if($nav_permission['report_view'])
                <div>
                    <a  href="{{ config('view.path_prefix','') }}/oms/report/report_group "
                        class="main-title {{Request::is('oms/report/report_group') ? 'active' : ''}}">
                        <i class="icon-menu-left-11"></i>
                        综合报表
                    </a>
                    <div class="menu-tip">综合报表</div>
                </div>
            @endif

            @if($nav_permission['view_instruct'] || $nav_permission['view_entrust'] || $nav_permission['view_deal'] || $nav_permission['view_position'] || $nav_permission['view_fee'] || $nav_permission['view_cash'])
                <div>
                    <a  href="{{ config('view.path_prefix','') }}/oms/report/report_list "
                        class="main-title {{Request::is('oms/report/report_list') ? 'active' : ''}}">
                        <i class="icon-menu-left-7"></i>
                        数据查询
                    </a>
                    <div class="menu-tip">数据查询</div>
                </div>
            @endif
            @if($nav_permission['view_data_v2'])
                <div>
                    <a  href="{{ config('view.path_prefix','') }}/oms/multi/deal_search "
                        class="main-title {{Request::is('oms/multi/deal_search') ? 'active' : ''}}">
                        <i class="icon-menu-left-7"></i>
                        成交查询
                    </a>
                    <div class="menu-tip">成交查询</div>
                </div>
            @endif

            @if($nav_permission['view_instruct'] || $nav_permission['view_entrust'] || $nav_permission['view_deal'] || $nav_permission['view_position'] || $nav_permission['view_fee'] || $nav_permission['view_cash'])
                <div>
                    <a  href="{{ config('view.path_prefix','') }}/report/file_center "
                        class="main-title {{Request::is('report/file_center') ? 'active' : ''}}">
                        <i class="icon-menu-left-14"></i>
                        {{-- 文件中心 --}}
                        文件中心
                    </a>
                    <div class="menu-tip">文件中心</div>
                </div>
            @endif

            @if($nav_permission['user_manage'])
                <div>
                    <a  href="{{ config('view.path_prefix','') }}/user/list "
                        class="main-title {{Request::is('user/list') ? 'active' : ''}}">
                        <i class="icon-menu-left-6"></i>
                        {{-- 人员权限 --}}
                        人员权限
                    </a>
                    <div class="menu-tip">人员权限</div>
                </div>
            @endif
            @if(isset($nav_permission['sys_setting']) && $nav_permission['sys_setting'])
                <div>
                    <a  href="{{ config('view.path_prefix','') }}/system/page "
                        class="main-title {{Request::is('system/page') ? 'active' : ''}}">
                        <i class="icon-menu-left-12"></i>
                        系统运维
                    </a>
                    <div class="menu-tip">系统运维</div>
                </div>
            @endif
            {{-- @if($nav_permission['view_instruct'] || $nav_permission['view_entrust'] || $nav_permission['view_deal'] || $nav_permission['view_position'] || $nav_permission['view_fee'] || $nav_permission['view_cash'])
                <div class="title-multi">
                    <a class="main-title {{Request::is('oms/multi/deal_search') ? 'active' : ''}}">
                        <i class="icon-menu-left-7"></i>
                        数据查询
                    </a>
                    <div class="menu-tip">数据管理</div>
                    @if($nav_permission['view_deal'])
                        <div class="sub-title">
                            <div style="position:relative;">
                                <a href="{{ config('view.path_prefix','').'/oms/multi/deal_search' }}" class="{{Request::is('oms/multi/deal_search') ? 'active' : ''}}">
                                    <i></i>
                                    成交查询
                                </a>
                                <div class="menu-tip">成交查询</div>
                            </div>
                        </div>
                    @endif
                </div>
            @endif --}}
            @if(isset($org_info) && 3 != $org_info['theme'])
                    <div>
                        <a  href="{{ config('view.path_prefix','') }}/product/operation" class="main-title {{Request::is('product/operation') ? 'active' : ''}}">
                            <i class="icon-menu-left-16"></i>
                            运营管理
                            <span href="{{ config('view.path_prefix','').'/product/operation' }}" class="{{Request::is('product/operation') ? 'active' : ''}}"></span>
                        </a>
                        <div class="menu-tip">运营管理</div>
                    </div>
             @endif
        @endif

    </div>
    {{-- 下面是跟通知有关的代码 --}}
    <?php
        $group_id = array_search(true,[
            false,
            Request::is('oms/allocation/index'),
            Request::is('oms/gather'),
            Request::is('oms*')
        ]);
        $group_id = Request::is('risk') ? 3 : $group_id;
        $group_id = Request::is('risk/*') ? 3 : $group_id;
        $group_id = Request::is('oms/advanced/*') ? 4 : $group_id;
        $group_id = Request::is('oms/trade/gather') ? 5 : $group_id;
        $group_id = Request::is('oms/trade/created') ? 5 : $group_id;
    ?>
    <script>
        //轮询检查通知
        (function(){
            var me = $(this);
            var update_group_id = '{{$group_id}}';

            var product_ids = [];//多策略页面刷新 update 接口使用

            // var is_commander = $.pullValue(window,'LOGIN_INFO.my_permission.0.manger_commander',0);
            // var is_executor = $.pullValue(window,'LOGIN_INFO.my_permission.0.manger_executor',0);
            // var is_manger_advanced = $.pullValue(window,'LOGIN_INFO.my_permission.0.manger_advanced',0);    //管理员 role_id 1

            var is_commander = $.pullValue(window,'LOGIN_INFO.role_id', []).some(function(e){ return e == 12 });        //is_commander role_id 12 审核(其实是交易员)
            var is_executor = $.pullValue(window,'LOGIN_INFO.role_id', []).some(function(e){ return e == 12 });         //交易员 role_id 12
            var is_manger_advanced = $.pullValue(window,'LOGIN_INFO.role_id', []).some(function(e){ return e == 1 });   //管理员 role_id 1

            var some_order_is_waiting = false;

            var next_reload = 500; //3000; 先调整为 500 毫秒，等环信启用再做调整
            var reupdate_timer;
            var freeze_timer;
            var last_update_frozen = false; //true; 先调整成 false，等环信启用后再冻结
            var html_version = 1;
            var first_update = true;
            var last_updated_data = {};
            var get_notice_info_timer;

            var flagStopGetUpdateInfo = false;

            $(get_updated_info);
            $(get_notice_info);
            // $(freezeLastUpdate);

            $(function(){
                me.render(LOGIN_INFO);
            });

            $(window).on('load spa_product_change side_nav_product_list:updated',function(){
                setTimeout(function(){
                    var activeLink = me.closest('.side-nav').find('a.active');
                    var title = activeLink.text().replace(/\s/g,'');
                    var tip = activeLink.find('.new-count-tip').text().replace(/\s/g,'');
                    title = title.replace(new RegExp(tip+'$'),'');
                    document.title = title + ' - {{config('custom.app_name')}}资产管理平台';
                });
            }).on('some_order_is_waiting',function(){
                some_order_is_waiting = true;
            }).on('no_order_is_waiting',function(){
                some_order_is_waiting = false;
            }).on('multi_load',function(event){
                product_ids = event.product_ids;
            });

            $(window).on('stopGetUpdateInfo', function(){
                flagStopGetUpdateInfo = true;
            })

            function get_updated_info(force){
                // if(!force){
                //     本次发布先放行继续使用 last_update, 环信被
                //     return;//默认停用 last_updated 接口
                // }
                if (flagStopGetUpdateInfo === true) {
                    return;
                }
                if($(window).data('last_update_loading')){return;}//同时只能有一个
                $(window).data('last_update_loading',true);

                var url = (window.REQUEST_PREFIX_MACHINE_LOOP||'')+'/oms/helper/last_updated';
                var product_id = /\/oms\/multi\/is\_running/.test(location.href) ? product_ids.join(',') : $.pullValue(window,'PRODUCT.id','');
                $.getJSON(url,$.extend({
                    group_id: update_group_id,
                    product_id: product_id
                },last_updated_data),function(res){
                    reupdate();

                    if(res.code==0 && $.type(res.data)=='object'){

                        next_reload = $.pullValue(res.data,'next_reload',next_reload);
                        last_updated_data = res.data;

                        $.dirtyCheck('oms_html_version',$.pullValue(res.data,'html_version',html_version)) && !first_update && top.location.reload();
                        first_update = false;

                        for(var key in res.data){
                            !/next_reload|html_version/.test(key) && $(window).trigger({
                                type: key + '_updated',
                                updated_timestamp: res.data[key]
                            });
                        }
                        $.dirtyCheck(url,res.data) &&  $(window).trigger({
                            type: 'oms_allocation_change'
                        });
                    }
                }).error(reupdate).always(function(){
                    $(window).data('last_update_loading',false);
                });
            }

            $(window).on('oms_allocation_change',get_notice_info).on('keep_silent_change',reupdate);
            $(window).on('oms_workflow_handle_done',
                setTimeout.bind(null,get_notice_info,1500)
            );

            function reupdate(){
                clearTimeout(reupdate_timer);
                if(last_update_frozen){return;}
                if( !/_stop_update/.test(location.search) && !localStorage.____keep_silent____ ){
                    reupdate_timer = setTimeout(get_updated_info,next_reload);
                }
            }

            function freezeLastUpdate(timeout){
                clearTimeout(freeze_timer);
                last_update_frozen = true;
                freeze_timer = setTimeout(function(){
                    last_update_frozen = false;
                    reupdate();
                },timeout||30*1000);//30s 没有收到更新，自动解冻，使用 last_update
                reupdate();
            }

            function get_notice_info() {
                if( $(window).data('notice_info_loading') ){return;}//正在load，就先等着
                $(window).data('notice_info_loading',true);
                $.getJSON((window.REQUEST_PREFIX||'')+'/oms/get_notice', function(res){
                    var newOrders = [];
                    if(res.code==0){
                        res.data.orders = res.data.orders||[];
                        res.data.allocations = res.data.allocations||[];
                        updateNotice(res);
                    }
                }).error(function(){
                    clearTimeout(get_notice_info_timer);
                    get_notice_info_timer = setTimeout(get_notice_info,500);
                }).always(function(){
                    //至少保证每半分钟，查询一次 notice_info 信息
                    clearTimeout(get_notice_info_timer);
                    get_notice_info_timer = setTimeout(get_notice_info,30*1000);
                    $(window).data('notice_info_loading',false);
                });
            }

            function updateNotice(res){
                me.find('[task-info]').render($.extend(res.data,{my_permission:LOGIN_INFO.my_permission}));

                // is_commander && ( +$.pullValue(res,'data.allocations',0) ? startSound('/sound/pulse') : stopSound('/sound/pulse') );
                // is_manger_advanced && ( +$.pullValue(res,'data.gaosongzhuans',0) ? startSound('/sound/pulse') : stopSound('/sound/pulse') );
                // is_executor && ( +$.pullValue(res,'data.orders',0) ? startSound('/sound/coin') : stopSound('/sound/coin') );
                // is_commander && ( +$.pullValue(res,'data.wait_cancel',0) ? startSound('/sound/cancelx',500) : stopSound('/sound/cancelx') );

                if (+$.pullValue(res,'data.allocations',0) || +$.pullValue(res,'data.gaosongzhuans',0) ) {
                    startSound('/sound/pulse');
                }else{
                    stopSound('/sound/pulse');
                }

                if ( +$.pullValue(res,'data.orders',0) ) {
                    startSound('/sound/coin');
                }else{
                    stopSound('/sound/coin');
                }

                if ( +$.pullValue(res,'data.wait_cancel',0) ) {
                    startSound('/sound/cancelx',500);
                }else{
                    stopSound('/sound/cancelx');
                }
            }

            function startSound(src,duration){
                stopSound('/sound/pulse');
                stopSound('/sound/coin');
                stopSound('/sound/cancelx');

                $.omsSoundNotice(duration||1000,src);
                $(window).data('__timer_'+src,setInterval(function(){
                    var can_notice = (src=='/sound/coin' ? some_order_is_waiting : true);
                    !localStorage.____keep_silent____ && can_notice && $.omsSoundNotice(1000,src);
                },1000));
            }

            function stopSound(src){
                clearInterval($(window).data('__timer_'+src));
            }
        }).call( document.scripts[document.scripts.length-1].parentNode );
    </script>
    <script>
    $(document).on('click', '.title-multi .main-title', function(e){
        //添加判断，当点击菜单中的   产品管理   的时候，由于菜单中的其他项是根据路径来判断是否添加active来实现展示效果的，而点击产品管理的时候路径是不会发生变化的，故在此添加一个判断
        $(this).addClass('active').parent().siblings().children($(".main-title")).removeClass('active');
        //点击菜单中的   产品管理   实现下拉菜单的收缩与展示  效果
        if ($(this).parent('.title-multi').hasClass('showChildren')) {
            $(this).parent('.title-multi').removeClass('showChildren');
        } else {
            $(this).parent('.title-multi').addClass('showChildren');
        }
        $(window).trigger({
            type: 'side_nav_status:doShow'
        })
    })
    </script>
</div>
