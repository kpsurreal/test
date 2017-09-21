//	cashier-quickpay.js
//	created by rango on 2015.10.10

//  page: /cashier/deposit
//	template: resources/view_h5/cashier/deposit/quick-pay.blade.php

//	dependences: jquery.js jquery.validate.min.js

$(function(){

    // 下面的全局变量由 php 提供，已经放在 quick-pay.blade.php 处理
    // var limit = "{{ $limit }}";
    // var day_limit = "{{ $day_limit }}";
    // var today_deposit = "{{ $today_deposit }}";
    // var auto_invest = "{{ $auto_invest }}";
    // var product_name = "{{ isset($product_name)?$product_name:'' }}";
    // var product_id = "{{ isset($product_id)?$product_id:'' }}";
    // var invest_tr = "{{ isset($invest_tr)?$invest_tr:'' }}";
    // var invest_amount = "{{ isset($invest_amount)?$invest_amount:0 }}";
    // var has_invested_amount = "{{ isset($has_invested_amount)?$has_invested_amount:0 }}";

    //轮询
    var _pay_order_poll_i = 1;
    var _pay_order_poll_interval;
    //判断是否跳转页面 - 自动投资完成
    if( auto_invest == 1 && parseInt(has_invested_amount) >= parseInt(invest_amount) ) {
        location.href = "/mine-gmf/account-list";
    }
    //popup-recharge-success
    var chargeSendValidCodeForm = '';
    $(function() {
        //getPayOrder("4914414375858879", 3);
        $("#amount_input").on('input',function(){
            $("#amount_input-error").hide();
        });
        $("#send_valid_code").click(function () {
            var amount_input = $("#amount_input").val();
            if( auto_invest != 1 && (amount_input == "" || amount_input==0) ) {
                $("#amount_input-error").text("请输入充值金额").show();
                return false;
            }
            var re = /^[0-9]*[1-9][0-9]*$/;
            if( auto_invest != 1 && (amount_input < 100 || isNaN(amount_input) || !re.test(amount_input)) ) {
                $("#amount_input-error").text("充值最低100元起，最小单位为1元").show();
                return false;
            }
            //自动投资时提示信息。
            if(auto_invest == 1 && amount_input==0) {
                $("#amount_input-error").html("本日累积充值"+day_limit+"元, 已达到单日限额").show();
                return false;
            }
            if(amount_input > parseInt(limit)) {
                $("#amount_input-error").text("充值金额超过单笔限额:"+limit).show();
                return false;
            }

            //浮点数计算不准修正
            var fixDemicalHelper = 10000;
            var today_deposit_remain = (day_limit*fixDemicalHelper - today_deposit*fixDemicalHelper)/fixDemicalHelper;

            if( amount_input > today_deposit_remain ) {
                $("#amount_input-error").text("单日限额:"+day_limit+", 本日还可以充值:"+today_deposit_remain.toFixed(2)).show();
                return false;
            }
            validateChargeSendValidCodeForm();
            return false;
        });
        $("#charge").click(function(){
            var valid_code = $("#valid_code").val();
            if(valid_code=="") {
                $("#valid_code-error").html("请输入验证码").show();
                return false;
            }
            var amount_input = $("#amount_input").val();
            if(amount_input=="" || amount_input==0) {
                $("#amount_input-error").html("本日累积充值"+day_limit+"万, 已达到单日限额").show();
                return false;
            }
            var binding_ticket = $("#binding_ticket").val();
            if(binding_ticket == "" || binding_ticket == 0) {
                $("#valid_code-error").html("还没发送验证码").show();
                return false;
            }
            if(auto_invest == "1" || auto_invest == 1) {
                var trade_pwd_input = $("#trade_pwd_input").val();
                if(trade_pwd_input=="") {
                    $("#trade_pwd_input-error").html("请输入交易密码").show();
                    return false;
                }
                check_trade_pwd(trade_pwd_input);
            }else{
                doCharge();
            }
            //doCharge();
            return false;
        });
        $("#valid_code").on('input',function(){
            $("#valid_code-error").hide();
        });
        $("#trade_pwd_input").on('input',function(){
            $("#trade_pwd_input-error").hide();
        });

        function check_trade_pwd(trade_passwd) {
            $.post('/trade/auth', {
                trade_passwd: trade_passwd,
            }, function (data) {
                if(data.code != 0) {
                    $("#trade_pwd_input-error").html(data.msg).show();
                }else{
                    doCharge();
                }
            }, 'json');
        }

        function validateChargeSendValidCodeForm() {
            $("#charge").removeAttr("disabled").addClass("yellow");
            setResendValidCodeTime();
            doSendValidCode();
        }

        var sms_verify_locker = 0;
        function doSendValidCode() {

            //尝试添加短信发送验证锁
            if( sms_verify_locker > 0 ){
                return;
            }
            sms_verify_locker = 1;

            var account_type = "SAVING_POT";
            var pay_method = "binding_pay";
            var amount = $("#amount_input").val();
            //向下取整
            //amount = Math.floor( amount );
            //$("#amount_input").val( amount );

            $("#valid_code").val("").focus();
            var binding_pay_card_id = $("#binding_pay_card_id").val();
            //alert(binding_pay_card_id);
            $.post('/cashier/create_hosting_deposit', {
                account_type: account_type,
                pay_method: pay_method,
                amount: amount,
                bank_card_id: binding_pay_card_id,
                product_id:product_id,
                invest_tr:invest_tr
            }, function (data) {
                // console.log(data);
                if (data.code == 0) {
                    $("#binding_ticket").val(data.data.ticket);
                    $("#out_trade_no").val(data.data.pay_order_id);
                } else {
                    //alert(data.msg);
                    countdown = 0;
                    //alert(data.msg);
                    $("#quick-pay-title").text("发送验证码失败");
                    $("#quick-pay-msg").text(data.msg);
                    $.magnificPopup.open({
                        items: {
                            src: "#popup-quick-pay",
                            type: "inline",
                            midClick: true
                        },
                        callbacks: {
                            beforeOpen: function(){
                                $('#popup-quick-pay .success_show').hide();
                            },
                            open: function() {
                                $("#cancel").off().bind("click", function(){
                                    $.magnificPopup.close();
                                    return false;
                                });
                            },
                            afterClose :function() {
                            }
                        }
                    });
                }
            }, 'json');
        }

        var countdown_init_value = 90;
        var countdown = countdown_init_value
        function setResendValidCodeTime() {
            var send_valid_code = $('#send_valid_code');
            if (countdown == 0) {
                send_valid_code.removeAttr('disabled').addClass("yellow");
                send_valid_code.text("发送验证码");
                countdown = countdown_init_value;

                //释放短信验证锁
                sms_verify_locker = 0;
            } else {
                send_valid_code.attr("disabled",true).removeClass("yellow").addClass("disabled");
                send_valid_code.text("重新发送(" + countdown + ")");
                countdown--;


                setTimeout(function() {setResendValidCodeTime()},1000)
            }
        }

        function doCharge() {
            $("#charge").html('<i class="icon-loading" id="icon-loading-id"></i>正在充值...');

            var valid_code = $("#valid_code").val();
            var ticket = $("#binding_ticket").val();
            var out_trade_no = $("#out_trade_no").val();
            var amount = $("#amount_input").val();

            $.post('/cashier/advance_hosting_pay', {
                valid_code: valid_code,
                ticket: ticket,
                amount: amount,
                pay_order_id: out_trade_no
            }, function (data) {
                // console.log(data);
                if (data.code == 0) {
                    //alert("充值成功");
                    //window.location.reload();
                    //getPayOrder(out_trade_no, 3);
                    //console.log("getPayOrder('"+out_trade_no+"', 10)");
                    _pay_order_poll_interval = setInterval(function(){
                        getPayOrder(out_trade_no, 5);
                    },2000);
                } else {
                    //alert(data.msg);
                    $("#quick-pay-title").html('<font class="fnt_red">充值失败</font>');
                    $("#quick-pay-msg").text(data.msg);
                    var is_success = false;
                    popup_quick_pay(is_success);
                }
            }, 'json');
        }
    });

    function getPayOrder(pay_order_id, n) {
        var is_success = true;
        //sleep(5000);
        _pay_order_poll_i++;
        $.get("/cashier/query_pay_order", {
            pay_order_id : pay_order_id
        }, function(data) {
            $('#finish-download').hide();
            $('#finish-default').show();

            if(data.code==0) {
                $("#show_cash_remain_id").val( data.data.cash_remain );
                if(auto_invest == 1) {
                    $("#quick-pay-title").text("￥" + data.data.amount + "充值并投资成功");
                    var has_invested_amount = parseInt(data.data.has_invested_amount);
                    var invest_amount = parseInt(data.data.invest_amount);
                    if( has_invested_amount >= invest_amount ) {
                        $("#quick-pay-msg").text('');
                        //跳转到我的资产页： mine-gmf/account-list

                        $('#finish-download').show();
                        $('#finish-default').hide();
                    }else {
                        $("#quick-pay-msg").text("单笔限额￥" + limit + ",还需充值￥" + (invest_amount-has_invested_amount) + "完成投资");
                    }
                }else {
                    $("#quick-pay-title").text("￥" + data.data.amount + "已经充值到你的账号");
                    $("#quick-pay-msg").text("快去投资你的操盘乐吧");
                }
                clearInterval(_pay_order_poll_interval);
                popup_quick_pay(is_success);
            }else{
                if ( _pay_order_poll_i > n ) {
                    $("#quick-pay-title").text("充值已提交，正在处理中...");
                    if (auto_invest == 1) {
                        $("#quick-pay-msg").text("成功到帐后将自动投资到些策略中");
                    } else {
                        $("#quick-pay-msg").text("成功到帐后，请注意查看消息");
                    }
                    clearInterval(_pay_order_poll_interval);
                    popup_quick_pay(is_success);
                }
            }
        });
        //结束轮询
        if ( _pay_order_poll_i > n ) {
            clearInterval(_pay_order_poll_interval);
            popup_quick_pay(is_success);
        }
    }

    function popup_quick_pay(is_success) {
        $.magnificPopup.open({
            items: {
                src: "#popup-quick-pay",
                type: "inline",
                midClick: true
            },
            callbacks: {
                beforeOpen: function(){
                    is_success ? $('#popup-quick-pay .success_show').show() : $('#popup-quick-pay .success_show').hide();
                },
                open: function() {
                    $("#cancel").off().bind("click", function(){
                        $.magnificPopup.close();
                        return is_success;
                    })
                },
                afterClose :function() {
                    $("#charge").html('充值');
                    if(is_success) {
                        window.location.reload();
                    }
                }
            }
        });
    }
});
