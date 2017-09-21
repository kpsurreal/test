@extends('oms.order_detail.main')

@section('ctrl_panel')
    <form class="ctrl-index active">
        <div if="status|inNumsList:3:8:9|isFalse AND product.cup.product_do_alloc">
            <div if="cancel_status|<=:1 AND status|notEqualNum:3">
                <span if="order_status|<:2" allocate-to-machine class="ctrl-btn blue">一键分配给机器</span>
                <span if="order_status|<:2" ctrl-open="allocate" class="ctrl-btn blue">指定分配给下单员</span>
                {{-- <span if="order_status|=:2" ctrl-open="allocate" class="ctrl-btn blue">重新分配</span> --}}
                <span if="order_status|<:4 AND cancel_status|<:1" ctrl-open="cancel" class="ctrl-btn red">撤单</span>

                {{-- <center if="order_status|<:2">
                    <span ctrl-open="reject">退回订单</span>
                </center> --}}
            </div>

            {{-- <center><span ctrl-open="delete">[今日订单] 删除订单</span></center> --}}
            {{-- <center if="order_status|>=:4 AND created_at|unixTimeOnToday">
                <span ctrl-open="delete">[今日订单] 删除订单</span>
            </center> --}}
        </div>
    </form>

    <form class="ctrl-allocate" id="order-allocate-form" autocomplete="off">
        <p class="tip-words">指定给以下人员执行订单</p>
        <div class="select">
            <select name="executor_id"></select>
            <div class="msg" style="color:red;font-size:12px;"></div>
        </div>
        <input data-src="id" type="hidden" name="id" value="">
        <button class="ctrl-btn blue posting-disabled" type="submit">确认分配</button>
        <span class="ctrl-btn white" ctrl-open="index">取消返回</span>
    </form>

    <form class="ctrl-cancel" id="order-cancel-form" autocomplete="off">
        <p class="tip-words red">撤单后不可恢复，确认撤单？</p>
        <button class="ctrl-btn red" type="submit">确认撤单</button>
        <span class="ctrl-btn white" ctrl-open="index">取消</span>
    </form>

    {{-- <form class="ctrl-delete" id="order-delete-form" autocomplete="off">
        <p class="tip-words red">删除属于高危操作，请输入确认信息</p>
        <label>
            <span>删除理由</span>
            <div class="input">
                <input type="text" name="msg" value="" required pattern=".{4,}">
            </div>
        </label>
        <label>
            <span>删除密码</span>
            <div class="input">
                <input class="password" type="text" name="force_pswd" value="" required pattern=".{4,}">
            </div>
        </label>
        <button class="ctrl-btn red" type="submit">确认删除</button>
        <span class="ctrl-btn white" ctrl-open="index">取消</span>
    </form>

    <form class="ctrl-reject" id="order-reject-form" autocomplete="off">
        <p class="tip-words red">退回订单，请备注原因</p>
        <label>
            <span>退回理由</span>
            <div class="input">
                <input type="text" name="msg" value="" required pattern=".{4,}">
            </div>
        </label>
        <button class="ctrl-btn red" type="submit">确认退回</button>
        <span ctrl-open="index" class="ctrl-btn white">取消</span>
    </form> --}}

    <script>
    $(function(){
        //控制面板切换配置
        $('[ctrl-open]').each(function(){
            var class_name = 'ctrl-' + $(this).attr('ctrl-open');
            $('.'+class_name).addClass('active-show');
            $(this).attr('click-active','.'+class_name);
        }).on('click',function(){
            $(window).trigger({type:$(this).attr('ctrl-open')+'_ctrl_open',sponsor:this});
        });

        //一键分配给机器人
        $('[allocate-to-machine]').click(function(){
            $('[name=executor_id]').removeAttr('disabled').val('0');
            $('#order-allocate-form').submit();
        });

        //订单详情打开，控制表单切换处理
        $(window).on('order_open',function(event){
            $('#ctrl-area').find('.ctrl-index').siblings().removeClass('active').end().addClass('active');
            $('#order-allocate-form').removeClass('posting');
            getOrderDealPermissionUsers(event.order);
        }).on('delete_ctrl_open reject_ctrl_open update_ctrl_open',function(event){
            setTimeout(function(){
                $('#order-' + $(event.sponsor).attr('ctrl-open') + '-form input:first').focus();
            });
        });

        //分配订单功能接口
        $('#order-allocate-form').submit(function(){
            if( $('[name=executor_id]').is('[disabled]') ){
                $.omsAlert('当前策略无可用执行员！',false);
                return false;
            }

            if( $(this).is('.posting') ){
                return false;
            }else{
                $(this).addClass('posting');
            }

            var order = $('#order_detail').data('srcData');
            var data = $(this).serialize();
            $.post((window.REQUEST_PREFIX||'')+'/oms/allocation/exec_set_allocation',data).then(function(res){
                if(res.code==0){
                    $(window).trigger({type:'oms_workflow_handle_done',handletype:'allocate',order:order});
                }else{
                    $.omsAlert( res.code+': 分配订单失败，'+(res.msg||'未知错误') ,false );

                    if (5122001 == res.code || 5122002 == res.code) {
                        $.magnificPopup.close();
                    }
                }
            }).always(function(){
                $('#order-allocate-form').removeClass('posting');
            });
            return false;
        });

        //撤回订单功能
        $('#order-cancel-form').submit(function(){
            var order = $('#order_detail').data('srcData');
            var data = $(this).serialize();
            handleOrder('cancel', order, data);
            return false;
        });

        //删除订单功能
        $('#order-delete-form').submit(function(){
            var order = $('#order_detail').data('srcData');
            var data = $(this).serialize();
            handleOrder('delete', order, data);
            return false;
        }).find('[type=submit]').on('click',function(){
            if( $('#order-delete-form input[name=msg]').is('.stuck') ){
                $.omsAlert('删除理由不能少于四个字！',false);
                return false;
            }
        });

        //退回订单功能
        $('#order-reject-form').submit(function(){
            var order = $('#order_detail').data('srcData');
            var data = $(this).serialize();
            handleOrder('reject', order, data);
            return false;
        });

        //更新订单功能
        $('#order-update-form').submit(function(){
            var order = $('#order_detail').data('srcData');
            var data = $(this).serialize();
            handleOrder('update', order, data);
            return false;
        });

        function getOrderDealPermissionUsers(order){
            //获取当前 order 下单员列表
            var product_id = $.pullValue(order,'product.id','');
            var product_name = $.pullValue(order,'product.name','');
            var select = $('[name=executor_id]');
            var select_wrap = select.parent();
            var permission_list;
            var deal_user_list = [];

            resetSelect();

            if(product_id){
                var url = (window.REQUEST_PREFIX||'') + '/oms/permission/get_all_permission';
                select_wrap.addClass('loading');
                select_wrap.removeClass('nothing');

                $.getJSON(url,{product_id:product_id}).done(function(res){
                    res.code==0 ? (permission_list=res.data, displayPermission()) : $.failNotice(url,res);
                }).fail($.failNotice.bind(null,url)).always(function(){
                    select_wrap.removeClass('loading');
                });
            }else{
                select_wrap.addClass('nothing');
                throw new Error(order.id + ' 缺乏有效策略信息！');
            }

            function displayPermission(){
                for(var user_id in permission_list){
                    $.pullValue(permission_list,user_id+'.'+product_id+'.product_do_deal') && deal_user_list.push({user_id:user_id});
                }
                // Begin: bug id 1002782 分配订单弹出窗的人员选项中添加当前登录人
                if (!deal_user_list.some(function(e){
                    return e.user_id == LOGIN_INFO.user_id
                })) {
                    deal_user_list.unshift({
                        user_id: LOGIN_INFO.user_id
                    });
                }
                // End: bug id 1002782 分配订单弹出窗的人员选项中添加当前登录人
                deal_user_list.length && select.html(deal_user_list.map(function(user){
                    return $('<option>').val(user.user_id).html(user.user_id).setCoreData(user);
                })).removeAttr('disabled');

                !deal_user_list.length && select_wrap.find('.msg').html('当前订单所属策略「'+product_id+' '+product_name+'」无可用下单员！');

                mergeBriefUserInfo(deal_user_list).then(function(){
                    select.find('option').each(function(){
                        var user = $(this).getCoreData();
                        var user_name = $.pullValue(user,'user_info.nick_name','');
                        user_name && $(this).html(user.user_id + ' : ' + user_name);
                    });
                });
            }

            function resetSelect(){
                select.html('').attr('disabled',true);
                select_wrap.removeClass('loading').removeClass('nothing').find('.msg').html('');
            }
        }

        function handleOrder(handleType, order, data){
            var callback,result={then:function(func){callback=func;}};
            if( $(window).data('deal_handling') ){
                alert('上次提交尚未完成，可能是你手速太快了，你可以刷新页面或稍后重试！');
                return result;
            };

            var handleTypeCH = {
                'reject':   '退回',
                'cancel':   '撤回',
                'delete':   '删除',
                'update':   '更新'
            }[handleType];

            $(window).data('deal_handling',true);
            $.post((window.REQUEST_PREFIX||'')+'/oms/workflow/' + order.product_id + '/' + order.id + '/' + handleType,
            data,
            function(res){
                if( res.code==0 ){
                    $(window).trigger({type:'oms_workflow_handle_done',handletype:handleType,order:order});
                    callback && callback();

                    handleType=='delete' && $.omsAlert(handleTypeCH+'订单成功！');
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
