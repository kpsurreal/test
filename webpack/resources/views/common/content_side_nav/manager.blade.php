{{-- Added by liuzeyafzy@gmail.com 高毅平台而准备的左侧菜单 --}}
<?php
use App\Services\UserPermissionService;
use App\Models\Permissions;
?>
<div>
    <div class="section nav-manager" task-info>
        @if(UserPermissionService::check_user_permission($logined_info['user_id'], Permissions::PERMISSION_TRADE_VIEW))
            <div>
                <a  href="{{ config('view.path_prefix','') }}/oms/multi/policy_instruction"
                    class="{{Request::is('oms/multi/policy_instruction') ? 'active' : ''}}">
                    <i class="icon-nav-manager-1"></i>
                    策略及交易
                </a>
            </div>
        @endif
        @if(UserPermissionService::check_user_permission($logined_info['user_id'], Permissions::PERMISSION_PRODUCT_VIEW))
            <div>
                <a  href="{{ config('view.path_prefix','') }}/product/index"
                    class="{{Request::is('product/index') ? 'active' : ''}}">
                    <i class="icon-nav-manager-2"></i>
                    产品管理
                </a>
            </div>
        @endif

        @if(UserPermissionService::check_user_permission($logined_info['user_id'], Permissions::PERMISSION_USER_VIEW))
            <div>
                <a  href="{{ config('view.path_prefix','') }}/user/list"
                    class="{{Request::is('user/list') ? 'active' : ''}}">
                    <i class="icon-nav-manager-3"></i>
                    用户管理
                </a>
            </div>
        @endif
        <div>
            <a  href="{{ config('view.path_prefix','') }}/user/get_modify"
                class="{{Request::is('user/get_modify') ? 'active' : ''}}">
                <i class="icon-nav-manager-6"></i>
                个人设置
            </a>
        </div>
        @if(UserPermissionService::check_user_permission($logined_info['user_id'], Permissions::PERMISSION_DEAL_VIEW))
            <div>
                <a  href="{{ config('view.path_prefix','') }}/oms/multi/deal_search"
                    class="{{Request::is('oms/multi/deal_search') ? 'active' : ''}}">
                    <i class="icon-nav-manager-4"></i>
                    数据查询
                </a>
            </div>
        @endif
        <div>
            <a  href="{{ config('view.path_prefix','') }}/user/pb_page"
                class="{{Request::is('user/pb_page') ? 'active' : ''}}">
                <i class="icon-nav-manager-7"></i>
                PB账号维护
            </a>
        </div>

        {{-- <div>
            <a  href="{{ config('view.path_prefix','') }}/oms/trade/created"
                class="{{Request::is('oms/trade/created') ? 'active' : ''}}">
                <i class="icon-nav-manager-5"></i>
                基础配置
            </a>
        </div> --}}
    </div>
</div>
