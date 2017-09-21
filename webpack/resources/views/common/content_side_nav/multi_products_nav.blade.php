<div>
    {{-- <a show-multi="is_running" click-active="_self"
        href="{{ config('view.path_prefix','') }}/oms/multi/is_running"
        class="{{Request::is('oms/multi/is_running') ? 'active' : ''}}"
    >
        运行中的组合
    </a>
    <a show-multi="is_waiting" click-active="_self"
        href="{{ config('view.path_prefix','') }}/oms/multi/is_waiting"
        class="{{Request::is('oms/multi/is_waiting') ? 'active' : ''}}"
    >
        投资中的组合
    </a>
    <a show-multi="is_stoped" click-active="_self"
        href="{{ config('view.path_prefix','') }}/oms/multi/is_stoped"
        class="{{Request::is('oms/multi/is_stoped') ? 'active' : ''}}"
    >
        已结束的组合
    </a> --}}
    <script>
    (function(){
        // var me = $(this);

        // var multi_status = me.find('a.active').attr('show-multi');

        // 旧的逻辑也就是从这里获取状态，然后筛选出符合状态（is_running）的组合进行显示。
        // 新的逻辑，仅在“is_running”页面起作用
        // if(location.pathname.includes('multi/is_running')){
            // 原本只有is_running页面在使用，现在呢，指令相关页面也要使用
            $(window).on('side_nav_product_list:updated:fresh',function(event){
                var list = [];
                var product_ids = [];
                var product_list = event.product_list;
                list = product_list['is_running'];

                //多账户管理数量不支持70个以上
                list.length = Math.min(list.length,70);

                product_ids = list.map(function(product){
                    return product.id;
                });

                // 旧有逻辑，用来区分正在运行、已结束、等待运行三种状态的，
                // 自从菜单改版之后，功能上来说只有展示正在运行的组合的必要，所以，这里是可以精简优化的，
                // 所有状态相关代码（或者页面）都是可以去除的，multi_status当然也是可以删除的（只是要全部一起删除，已注释，待删除）
                $(window).trigger({
                    type: 'multi_load',
                    // multi_status: multi_status,
                    product_list: list,
                    product_ids: product_ids
                });
            });
        // }
    }).call(document.scripts[document.scripts.length-1].parentNode);
    </script>
</div>
