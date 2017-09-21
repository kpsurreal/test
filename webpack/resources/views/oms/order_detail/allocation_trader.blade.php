@extends('oms.order_detail.main')

@section('ctrl_panel')
    <div if="status|inNumsList:1:2:4 AND order_status|!=:4 AND cancel_status|<:1 AND product.cup.product_do_trade">
        <form class="active-show default-active exclusive-active ctrl-index">
            <span class="ctrl-btn red" ctrl-open="do_cancel">撤单</span>
        </form>
        <form class="ctrl-do_cancel active-show exclusive-active" id="order-do_cancel-form" autocomplete="off">
            <p class="tip-words red">撤单后不可恢复，确认撤单？</p>
            <button class="ctrl-btn red" type="submit">确认撤单</button>
            <span class="ctrl-btn white" ctrl-open="index">取消</span>
        </form>
    </div>

    <script>
    $(function(){
        $('[ctrl-open]').each(function(){
            var class_name = 'ctrl-' + $(this).attr('ctrl-open');
            $('.'+class_name).addClass('active-show');
            $(this).attr('click-active','.'+class_name);
        });

        //撤回订单功能
        $('#order-do_cancel-form').submit(function(){
            var order = $('#order_detail').data('srcData');
            var data = $(this).serialize();
            handleOrder('do_cancel', order, data);
            return false;
        });

        function handleOrder(handleType, order, data){
            var callback,result={then:function(func){callback=func;}};
            if( $(window).data('deal_handling') ){
                alert('上次提交尚未完成，可能是你手速太快了，你可以刷新页面或稍后重试！');
                return result;
            };

            var handleTypeCH = {
                'cancel':    '撤回',
                'do_cancel': '撤回'
            }[handleType];

            $(window).data('deal_handling',true);

            if('do_cancel' == handleType && window.LOGIN_INFO.org_info.theme != 3){
              url = (window.REQUEST_PREFIX||'')+'/oms/workflow/' + order.product_id + '/direct_cancel?entrust_id=' + order.entrust_id + '&stock_id=' + order.stock.code;
            }else{
              url = (window.REQUEST_PREFIX||'')+'/oms/workflow/' + order.product_id + '/' + order.id + '/' + handleType
                      + '?workflow_id=' + order.id;
            }
            $.post(url,
            data,
            function(res){
                if( res.code==0 ){
                    $(window).trigger({type:'oms_workflow_handle_done',handletype:handleType,order:order});
                    callback && callback(res);
                }else{
                    $.omsAlert( res.code + ': ' + handleTypeCH + '订单失败：' + (res.msg || '未知错误！'),false);
                }
            }).always(function(){
                $(window).data('deal_handling',false);
                $(window).trigger({type:'productList:reset'});
                $(window).trigger({type:'order_list:update_active_arder_list'});
            });

            return result;
        }
    });
    </script>
@stop
