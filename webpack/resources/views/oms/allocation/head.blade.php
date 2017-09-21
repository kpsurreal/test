<section class="allocation-head" id="allocation-head-section">
    <div class="hd">
        @if(isset($is_commander) && $is_commander)
            <span class="section-title">我的分单任务</span>
            <span class="title-tip">待当前分单员审核及分配</span>
        @endif

        @if(isset($is_executor) && $is_executor)
            <span class="section-title">我的下单任务</span>
            <span class="title-tip">待当前下单员委托及回报</span>
        @endif

        @if(isset($is_trader) && $is_trader)
            <span class="section-title">我的委托任务</span>
            <span class="title-tip">所有策略的订单委托任务</span>
        @endif

        @if(isset($is_creator) && $is_creator)
            <span class="section-title">我创建的委托</span>
            <span class="title-tip">我创建的订单委托任务</span>
        @endif
    </div>
    <div class="bd {{ (isset($is_commander) && $is_commander) ? 'four-cards' : 'three-cards' }}">
        @if(isset($is_commander) && $is_commander)
            <div class="card">
                <h2 class="red" data-src="count_unallocated|--">- -</h2>
                <span>今日未处理分单</span>
            </div>
        @endif

        @if((isset($is_commander) && $is_commander) || (isset($is_executor) && $is_executor))
            <div class="card">
                <h2 class="yellow" data-src="count_order|--">- -</h2>
                <span>今日未处理下单</span>
            </div>
            <div class="card">
                <h2 data-src="count_allocated_today|--">- -</h2>
                <span>今日已完成订单</span>
            </div>
            <div class="card">
                <h2 data-src="count_allocated_all|--">- -</h2>
                <span>全部已完成订单</span>
            </div>
        @endif

        @if((isset($is_trader) && $is_trader) || (isset($is_creator) && $is_creator))
            <div class="card">
                <h2 class="yellow" data-src="count_order|--">- -</h2>
                <span>今日待处理委托及回报</span>
            </div>
            <div class="card">
                <h2 data-src="count_doned_today|--">- -</h2>
                <span>今日已处理订单</span>
            </div>
            <div class="card">
                <h2 data-src="count_doned_all|--">- -</h2>
                <span>全部已结束订单</span>
            </div>
        @endif
    </div>
</section>
<?php
    $group_id = array_search(true,[
        false,
        Request::is('oms/allocation/index'),
        Request::is('oms/gather'),
        Request::is('oms/*')
    ]);

    $group_id = Request::is('oms/trade/created') ? 4 : $group_id;
?>
<script>
//轮询检查头部数量
$(function(){
    refreshHeadInfo();
    function refreshHeadInfo() {
        $.getJSON(window.REQUEST_PREFIX+'/oms/get_count?group_id={{$group_id}}', function(res){
            if(res.code==0){
                $('#allocation-head-section').render(res.data);
            }else{
                $.omsAlert(res.code+': /oms/get_count '+res.msg, false);
            }
        });
    }
    $(window).on('oms_allocation_change',refreshHeadInfo);
    $(window).on('oms_workflow_handle_done',
        setTimeout.bind(null,refreshHeadInfo,1500)
    );
});
</script>
