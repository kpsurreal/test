@extends('oms.order_detail.main')

@section('ctrl_panel')
    <div if="status|inNumsList:3:7:8:9|isFalse AND order_status|<:4 AND cancel_status|<:2 AND product.cup.product_do_deal">
        <form class="ctrl-index" id="order-entrust2broker-form" style="padding-top:60px;">
            <button type="submit" class="ctrl-btn blue">已提交到券商系统</button>
            <span if="cancel_status|=:1" class="ctrl-btn red" ctrl-open="do_cancel">完成撤单</span>
            <center if="order_status|=:2">
                <span ctrl-open="bind_entrust_id" style="cursor:pointer;">输入委托订单</span>
            </center>
        </form>
        <form class="ctrl-deal" id="order-deal-form" autocomplete="off">
            <div>
                <center if="is_auto" style="margin-top:35px;color:red;">
                    <b>** 机器人已托管当前订单 ** 正常情况无需人工回报 **</b>
                </center>
                <p class="tip-words">输入新的委托价格及数量</p>
                <label>
                    <span>成交价</span>
                    <div class="input">
                        <input class="plus-input" type="text" id="per_deal_price" name="price" pattern="^\d*\.?\d*$" required placeholde r="请输入成交价格">
                        <div class="plus-ctrls">
                            <span class="plus-ctrl" click-value="#per_deal_price:+.01"><i>+</i><br/>0.01</span>
                            <span class="plus-ctrl" click-value="#per_deal_price:-.01"><i>-</i><br/>0.01</span>
                        </div>
                    </div>
                </label>
                <label>
                    <span>成交量</span>
                    <div class="input">
                        <input class="plus-input" type="text" id="per_deal_volume" name="volume" pattern="^\d+$" required placeholde r="请输入成交数量">
                        <div class="plus-ctrls">
                            <span class="plus-ctrl" click-value="#per_deal_volume:+100"><i>+</i><br/><span>100</span></span>
                            <span class="plus-ctrl" click-value="#per_deal_volume:-100"><i>-</i><br/><span>100</span></span>
                        </div>
                    </div>
                </label>
                <span if="is_auto|isFalse" class="ctrl-btn blue" id="deal-btn">设置成交</span>
                <span if="is_auto|isFalse" class="ctrl-btn white" id="deal-all-btn">全部成交</span>
                <span if="is_auto" class="ctrl-btn blue" ctrl-open="do_deal">设置成交</span>
                <span if="is_auto" class="ctrl-btn white" ctrl-open="do_deal_all">全部成交</span>
            </div>
            <span if="cancel_status|=:1" class="ctrl-btn red" id="do_post_cancel">向券商发撤单请求</span>
            <span if="cancel_status|=:1 AND is_auto|isFalse" class="ctrl-btn red" ctrl-open="do_cancel">完成撤单</span>
            <span if="cancel_status|=:1 AND is_auto" class="ctrl-btn red" ctrl-open="do_cancel_confirm">完成撤单确认</span>
        </form>
        <form class="ctrl-do_deal" id="order-do_deal-form" autocomplete="off">
            <p class="tip-words red">当前订单处于自动回报状态，为避免数据出错，人工提交回报后将取消自动回报，确定提交？</p>
            <button class="ctrl-btn red" type="submit">确认成交</button>
            <span if="order_status|!=:3" class="ctrl-btn white" ctrl-open="index">取消</span>
            <span if="order_status|=:3" class="ctrl-btn white" ctrl-open="deal">取消</span>
        </form>
        <form class="ctrl-do_deal_all" id="order-do_deal_all-form" autocomplete="off">
            <p class="tip-words red">当前订单处于自动回报状态，为避免数据出错，人工提交回报后将取消自动回报，确定提交？</p>
            <button class="ctrl-btn red" type="submit">确认全部成交</button>
            <span if="order_status|!=:3" class="ctrl-btn white" ctrl-open="index">取消</span>
            <span if="order_status|=:3" class="ctrl-btn white" ctrl-open="deal">取消</span>
        </form>
        <form class="ctrl-do_cancel" id="order-do_cancel-form" autocomplete="off">
            <p class="tip-words red">撤单后不可恢复，确认撤单？</p>
            <button class="ctrl-btn red" type="submit">确认撤单</button>
            <span if="order_status|!=:3" class="ctrl-btn white" ctrl-open="index">取消</span>
            <span if="order_status|=:3" class="ctrl-btn white" ctrl-open="deal">取消</span>
        </form>
        <form class="ctrl-do_cancel_confirm" id="order-do_cancel_confirm-form" autocomplete="off">
            <p class="tip-words red">请核实当前委托撤单成功，确认后将取消委托单并释放对应锁定资金。</p>
            <button class="ctrl-btn red" type="submit">确认撤单</button>
            <span if="order_status|!=:3" class="ctrl-btn white" ctrl-open="index">取消</span>
            <span if="order_status|=:3" class="ctrl-btn white" ctrl-open="deal">取消</span>
        </form>
        <form class="ctrl-bind_entrust_id" id="order-bind_entrust_id-form" autocomplete="off">
            <p class="tip-words">输入委托编号，
                <str if="order_status|=:2">系统将会自动更新订单状态</str>
                <str if="order_status|=:4">订单完整信息</str>
            </p>
            <label>
                <span>编号</span>
                <div class="input">
                    <input type="text" name="order_id" value="" required pattern=".{4,}">
                </div>
            </label>
            <button class="ctrl-btn blue" type="submit">确认此编号</button>
            <span if="order_status|=:2" class="ctrl-btn white" ctrl-open="index">取消</span>
        </form>
    </div>

    <script>
    $(function(){
        //控制面板切换配置
        $('[ctrl-open]').each(function(){
            var class_name = 'ctrl-' + $(this).attr('ctrl-open');
            $('.'+class_name).addClass('active-show');
            $(this).attr('click-active','.'+class_name);
        });

        $(window).on('order_open',function(event){
            var order = event.order;
            $.pushValue(order, 'deal.remain', order.entrust.amount - $.pullValue(order,'deal.amount',0));

            order.order_status=='4' && !order.order_id && checkout('ctrl-bind_entrust_id');
            order.order_status=='3' && checkout('ctrl-deal');
            order.order_status=='2' && checkout('ctrl-index');

            $('#order-deal-form').find('input').val('');

            setTimeout(function(){
                $('#per_deal_price').focus();
            },350);
        });

        function checkout(class_name){
            $('#ctrl-area').find('.'+class_name).siblings().removeClass('active').end().addClass('active');
        }

        $('#order-entrust2broker-form').submit(function(){
            var order = $('#order_detail').data('srcData');
            var data = $(this).serialize();
            handleOrder('entrust2broker', order, data);
            return false;
        });

        //更新订单功能
        $('#deal-all-btn').click(function(){
            var order = $('#order_detail').getCoreData();
            $('#order-deal-form').find('input[name=volume]').val(order.deal.remain).end().find('#deal-btn').click();
        });
        $('#deal-btn').click(function(){
            var order = $('#order_detail').data('srcData');
            var data = $('#order-deal-form').serialize();
            handleOrder('deal', order, data);
            return false;
        });

        $('#order-do_deal-form').submit(function(){
            var order = $('#order_detail').data('srcData');
            var data = $('#order-deal-form').serialize();
            handleOrder('deal', order, data);
            return false;
        });
        $('#order-do_deal_all-form').submit(function(){
            var order = $('#order_detail').getCoreData();
            $('#order-deal-form').find('input[name=volume]').val(order.deal.remain);

            var order = $('#order_detail').data('srcData');
            var data = $('#order-deal-form').serialize();
            handleOrder('deal', order, data);
            return false;
        });

        //更新委托编号功能
        $('#order-bind_entrust_id-form').submit(function(){
            var order = $('#order_detail').data('srcData');
            var data = $(this).serialize();
            // 设置委托并绑定委托编号
            var handleType = 'entrust2broker'; // order.order_status==2 ? 'entrust2broker' : 'bind_entrust_id';
            handleOrder(handleType, order, data);
            return false;
        });

        // 向券商发送撤单请求
        $('#do_post_cancel').click(function(){
            var order = $('#order_detail').getCoreData();

            $.ajax({
                url: window.REQUEST_PREFIX + '/oms/workflow/manual_cancel/' + order.id,
                type: 'post',
                success: function(res){
                    if (0 == res.code) {
                        $.omsAlert( '发送撤单请求成功');
                        $(window).trigger({type:'oms_workflow_handle_done',order:order});
                    }else{
                        $.omsAlert( res.code + ': ' + '发送撤单请求失败：' + (res.msg || '未知错误！'),false);
                    }
                },
                error: function(){
                    $.failNotice();
                }
            })
        })

        //撤回订单功能
        $('#order-do_cancel-form').submit(function(){
            var order = $('#order_detail').data('srcData');
            var data = $(this).serialize();
            handleOrder('do_cancel', order, data);
            return false;
        });
        $('#order-do_cancel_confirm-form').submit(function(){
            var order = $('#order_detail').data('srcData');
            var data = $(this).serialize();
            var is_force = true;
            handleOrder('do_cancel', order, data, is_force);
            return false;
        });

        function handleOrder(handleType, order, data, is_force){
            var callback,result={then:function(func){callback=func;}};
            if( $(window).data('deal_handling') ){
                alert('上次提交尚未完成，可能是你手速太快了，你可以刷新页面或稍后重试！');
                return result;
            };

            var handleTypeCH = {
                'entrust2broker': '接受',
                'deal':           '更新成交',
                'reject':         '退回',
                'cancel':         '撤回',
                'do_cancel':      '撤回',
                'update':         '更新'
            }[handleType];

            $(window).data('deal_handling',true);
            var url = '';
            url = (window.REQUEST_PREFIX||'')+'/oms/workflow/' + order.product_id + '/' + order.id + '/' + handleType
                    + '?workflow_id=' + order.id + (is_force == true ? '&is_force=1' : '');


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
            });

            return result;
        }
    });
    </script>
@stop
