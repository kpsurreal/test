<div id="order_ctrl_history">
    <div rows-body></div>
    <script row-tpl type="text/html">
        <p>
            <span class="msg" data-src="msg"></span><br/>
            <span data-src="created_at|unixTime"></span> · <span data-src="user_info.real_name"></span>（<span data-src="user_info.user_id"></span>）
        </p>
    </script>
</div>
<script>
$(function(){
    $(window).on('order_detail:close',function(){
        $('#order_ctrl_history').renderTable([]).removeClass('loaded').attr('last_loading_timestamp',0);
    }).on('order_detail:open_ctrl_history',function(){
        !$('#order_ctrl_history').is('.loaded') && loadOrderCtrlHistory();
    });

    function loadOrderCtrlHistory(){
        var order = $('#order_detail').getCoreData();
        var last_loading_timestamp = new Date().valueOf();
        $('#order_ctrl_history').renderTable([]).attr('last_loading_timestamp',last_loading_timestamp);

        $.get((window.REQUEST_PREFIX||'')+'/oms/order/deal_history',{
            'product_id': order.product_id,
            'workflow_id': order.id
        },function(res){
            var histories = res.data.forEach ? res.data : [];
            // res.code==0
            // ? window.window.mergeOrderCtrlHistoryUsersInfo(histories).then(function(){
            //     if( $('#order_ctrl_history').attr('last_loading_timestamp')!=last_loading_timestamp ){return;}
            //     $('#order_ctrl_history').renderTable(histories).addClass('loaded');
            // })
            // : $.omsAlert(res.code + ' : '+(res.msg||'网络错误，获取订单信息失败！'),false);

            if (res.code==0) {
                if( $('#order_ctrl_history').attr('last_loading_timestamp')!=last_loading_timestamp ){return;}
                $('#order_ctrl_history').renderTable(histories).addClass('loaded');
            }else{
                $.omsAlert(res.code + ' : '+(res.msg||'网络错误，获取订单信息失败！'),false);
            }
        });
    }
});
</script>
