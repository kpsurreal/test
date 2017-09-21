//	cashier-withdraw.js
//	created by rango on 2015.10.10

//  page: /cashier/withdraw
//	template: resources/view_h5/cashier/withdraw/withdraw.blade.php

//	dependences: jquery.js jquery.validate.min.js

$(function(){
    var submit_locker = 0;
    $("#withdraw").click(function () {
        if( submit_locker > 0 ) return false;

        //validateOnlinePayFormForm();
        var withdraw_amount = $("#withdraw_amount").val();
        var is_check = check_withdraw_amount(withdraw_amount);
        if(!is_check){
            return false;
        }

        //检查有没有交易密码
        $.get(
                '/user/profile',
                {
                    "format":"json"
                },
                function (data) {
                    //console.log(data);
                    if(data.data.set_trade_passwd == 1) {
                        //console.log("ok");
                    }else{
                        //popup-no-trade-passwd
                        $.magnificPopup.open({
                            items : {
                                src: "#popup-no-trade-passwd",
                                type: "inline",
                                midClick: true
                            },
                            callbacks: {
                                beforeOpen: function(){
                                    $('.body').hide();
                                },
                                open: function() {alert();
                                    $("#no-set-passwd-btn").bind("click", function(){
                                        $.magnificPopup.close();
                                    });
                                },
                                afterClose :function() {
                                    $('.body').show();
                                }
                            }
                        });
                        return false;
                    }
                }
        );

        $.magnificPopup.open({
            items : {
                src: "#popup-set-submit-order",
                type: "inline",
                midClick: true
            },
            callbacks: {
                beforeOpen: function(){
                    $('.body').hide();
                },
                afterClose: function(){
                    $('.body').show();
                }
            }
        });
        return false;
    });
    $("#set_trade_pwd_btn").click(function(){

        var trade_passwd = $("#trade_passwd").val().trim();

        //前端预验证
        if( !/^\d{6}$/.test(trade_passwd) ){
            $("#trade_passwd-error").text('交易密码错误').show();
            return false;
        }

        //进入后端验证流程
        if( submit_locker > 0 ) return false;

        submit_locker = 1;

        $.post('/trade/auth', {
            trade_passwd: trade_passwd,
        }, function (data) {
            if(data.code != 0) {
                if(data.code == 5022103) {
                    window.location.href="/novice-task";
                }
                $("#trade_passwd-error").text(data.msg);
                $("#trade_passwd-error").show();
                submit_locker = 0;
                return false;
            }else {
                var magnificPopup = $.magnificPopup.instance;
                magnificPopup.close();
                submit_locker = 0;
                doWithdraw();
            }
        }, 'json').done(function() {
            //
        });
        $("#trade_passwd").val("");
        //validateOnlinePayFormForm();
        return false;
    });
    $("#withdraw_amount").on('input',function(){
        $("#valid_code-error").hide();
        $(".withdraw_fee_block").hide();
        $("#show_withdraw_fee").text("0.00");
        var withdraw_amount = $(this).val();
        var is_check = check_withdraw_amount(withdraw_amount);
        if(!is_check)
            return false;
        $.get('/cashier/get_withdraw_fee', {
            market: 1,
            format: "json",
            amount: withdraw_amount
        }, function (data) {
            if(data.code == 0) {
                var real_withdraw_amount = withdraw_amount - data.data.fee;
                $("#show_withdraw_fee").text( data.data.fee );
                $("#show_real_withdraw").text( real_withdraw_amount );
                $("#real_withdraw_input").val(real_withdraw_amount);
                if( data.data.fee == 0 ) {
                    $(".withdraw_fee_block").hide();
                }else{
                    $(".withdraw_fee_block").show();
                }
            }else{
                $("#valid_code-error").html(data.msg).show();
            }
        }, 'json');
    });
    function check_withdraw_amount(withdraw_amount) {
        if(withdraw_amount=="") {
            $("#valid_code-error").html("请输入提现金额").show();
            return false;
        }
        if(isNaN(withdraw_amount)) {
            $("#valid_code-error").text("请填入数字").show();
            return false;
        }
        var cash_remain = $("#cash_remain_input").text();
        if(parseFloat(withdraw_amount) > parseFloat(cash_remain)) {
            $("#valid_code-error").text("余额不足，已超过提现金额").show();
            return false;
        }
        if(parseFloat(withdraw_amount) > 50000) {
            $("#valid_code-error").text("提现金额超过单笔限额：5万").show();
            return false;
        }
        if(parseFloat(withdraw_amount) <= 4) {
            $("#valid_code-error").text("提现金额低于手续费").show();
            return false;
        }
        return true;
    }
    $("#trade_passwd").on('input',function(){
        $("#trade_passwd-error").hide();
    });
    function doWithdraw() {
        $("#withdraw").html('<i class="icon-loading" id="icon-loading-id"></i>正在提现...');

        var account_type = $("#account_type").val();
        var amount = $("#withdraw_amount").val();
        var bank_card_id = $("#withdraw_card_id").val();
        var real_withdraw_input = $("#real_withdraw_input").val(); //真实提现金额

        if( submit_locker > 0 ) return false;

        submit_locker = 1;

        $.post('/cashier/create_hosting_withdraw', {
            account_type: account_type,
            amount: amount,
            bank_card_id: bank_card_id
        }, function (data) {
            if (data.code == 0) {
                //window.location.reload();
                $("#withdraw-title").text("你的提现￥"+data.data.real_amount+"已提交系统");
                $("#withdraw-msg").text(data.msg);
                $("#withdraw_amount").val("");
                $(".withdraw_fee_block").hide();
                $("#show_withdraw_fee").text("0.00");
                submit_locker = 0;
            } else {
                //alert(data.msg);
                $("#withdraw-title").text("提现失败");
                $("#withdraw-msg").text(data.msg);

                submit_locker = 0;
            }
            $.magnificPopup.open({
                items: {
                    src: "#popup-withdraw",
                    type: "inline",
                    midClick: true
                },
                callbacks: {
                    open: function() {
                        $("#cancel").bind("click", function(){
                            $("#cash_remain_input").text(data.data.cash_remain);
                            $.magnificPopup.close();
                        })
                    }
                }
            });
        }, 'json').done(function() {
            //alert( "icon-loading-id" );
            //$("#icon-loading-id").removeClass("icon-loading");
            $("#withdraw").html('提现');
        });
    }
    function openBlank(action,data,n){
        var form = $("<form/>").attr('action',action).attr('method','post');
        if(n)
            form.attr('target','_blank');
        var input = '';
        $.each(data, function(i,n){
            input += '<input type="hidden" name="'+ i +'" value="'+ n +'" />';
        });
        form.append(input).appendTo("body").css('display','none').submit();
    }
    function validateOnlinePayFormForm() {
        if (onlinePayForm) return true;
        onlinePayForm = $("#onlinePayForm").validate({
            'errorClass': 'tips',
            'errorElement': 'div',
            rules: {
                'charge_amount': {
                    required: true
                }
            },
            messages: {
                'charge_amount': {
                    required: '请输入充值金额'
                }
            },
            highlight: function (element, errorClass) {
                $(element).removeClass(errorClass);
            },
            submitHandler: function (form) {
            }
        });
    }
});
