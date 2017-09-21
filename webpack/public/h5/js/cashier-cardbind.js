//	cashier-cardbind.js
//	created by rango on 15/10/9.

//  page: /cashier/deposit
//	template: resources/view_h5/cashier/binding-card.blade.php

//	dependences: jquery.js jquery.validate.min.js

/** 省市地区选择模块 **/
$(function(){
    // 获取并解析地理位置数据 start

    //  数据结构 ... [uid, name, degree, pid], ...
    // [... ["1","北京市","1","0"],["2","天津市","1","0"] ...]

    var provinces = {};

    $.getJSON(window._province_city_data_json_url, function(data){
        setProvincesTree(data);
        renderProvinces();
    });

    function setProvincesTree(data){
        var address_arr = data;
        var uid_to_name = {};

        address_arr.forEach(function(row, i){
            var parent_name;
            var uid = row[0];
            var name = row[1];
            var degree = row[2];
            var pid = parseInt( row[3] );

            uid_to_name[uid] = name;

            if( degree==='1' ){
                //省份级
                provinces[name] = provinces[name] || [];
            }

            if( degree==='2' ){
                //市区级
                parent_name = uid_to_name[pid];

                if(!parent_name) return;

                provinces[parent_name] = provinces[parent_name] || [];
                provinces[parent_name].push(name);
            }
        });
    }

    function renderProvinces(){
        var provincesDomStr = '';
        var citys_dom_catch = {};

        for(province_name in provinces){
            if( provinces.hasOwnProperty(province_name) ){
                provincesDomStr += ('<option value="' +province_name+ '">' +province_name+ '</option>');
            }
        }
        $('#province').append( $(provincesDomStr) );

        $('#province').on('change',function(){
            var province_name = $(this).val();
            var citysDom = ( citys_dom_catch[province_name] = citys_dom_catch[province_name] || getCitysDom(province_name) );
            var citys = provinces[province_name];

            console.log( citys_dom_catch );

            $('#city').empty();
            $('#city').append( citysDom );
        });

        function getCitysDom(province_name){
            var citysDomStr = '';
            var citys = provinces[ province_name ];

            if(citys){
                if(citys.length>1){
                    citysDomStr += '<option value="">请选择开户城市</option>';
                }
                citys.forEach && citys.forEach(function(city_name){
                    citysDomStr += ('<option value="' +city_name+ '">' +city_name+ '</option>');
                });
            }else{
                citysDomStr += '<option value="">请选择开户城市</option>';
            }

            return $(citysDomStr);
        }
    }

    //  获取并解析地理位置数据 end
});

/** 绑卡功能模块 **/
$(function() {
    //检查是否绑卡
    $.get("/cashier/query_bank_card", {
        format:"json"
    },function(data){
        if(data.code == 0 && data.data.status == 0) {
            window.location.reload();
        }
    },'json');
    $("#send_valid_code").click(function () {
        //检查是否实名认证
        var real_name_input = $("#real_name_input").val();
        if(!real_name_input){
            return false;
        }
        $("#valid_code-error").hide();
        var is_validate = validateSendValidCodeForm();
        if(is_validate == false) {
            return false;
        }
        doSendValidCode();
        return false;
    });
    $("#binding_bank_card").click(function(){
        //alert(123);
        var is_validate = validateSendValidCodeForm();
        if(is_validate == false) {
            return false;
        }
        var binding_ticket = $("#binding_ticket").val();
        if( binding_ticket == "" || binding_ticket == 0 ) {
            $("#valid_code-error").html("先发获取验证码").show();
            return false;
        }
        var valid_code = $("#valid_code").val();
        if(valid_code=="") {
            $("#valid_code-error").html("请输入验证码").show();
            return false;
        }
        $(this).html('<i class="icon-loading" id="icon-loading-id"></i>正在绑定...');
        doBindingBank();
        return false;
    });
    $("#valid_code").on('input',function(){
        $("#valid_code-error").hide();
    });

    $("#bank_code").change(function(){
        $("#bank_code-error").hide();
    });
    $("#province").change(function(){
        $("#province-error").hide();
    });
    $("#city").change(function(){
        $("#city-error").hide();
    });
    $("#bank_account_no").on('input',function(){
        $("#bank_account_no-error").hide();
    });
    $("#phone_no").on('input',function(){
        $("#phone_no-error").hide();
    });
    function validateSendValidCodeForm() {
        //bindingBankCardForm
        var bank_code = $("#bank_code").val();
        if(bank_code == "" || bank_code == 0) {
            $("#bank_code-error").html("请选择开户银行").show();
            return false;
        }

        var province = $("#province").val();
        if(province == "" || province == 0) {
            $("#province-error").html("请选择开户省份").show();
            return false;
        }
        var city = $("#city").val();
        if(city == "" || city == 0) {
            $("#city-error").html("请选择开户城市").show();
            return false;
        }

        var bank_account_no = $("#bank_account_no").val();
        if(bank_account_no == "" || bank_account_no == 0 ) {
            $("#bank_account_no-error").html("银行卡不能为空").show();
            return false;
        }
        var re = /^[0-9]*[1-9][0-9]*$/;
        if( isNaN(bank_account_no) || !re.test(bank_account_no) ) {
            $("#bank_account_no-error").html("银行卡格式不对").show();
            return false;
        }
        var phone_no = $("#phone_no").val();
        var re = /^[0-9]*[1-9][0-9]*$/;
        if( phone_no =="" || phone_no == 0 || isNaN(phone_no) || !re.test(phone_no) || phone_no.length != 11 ) {
            $("#phone_no-error").html("手机号格式不对").show();
            return false;
        }
        return true;
    }

    var sms_verify_locker = 0;

    function doSendValidCode() {
        //尝试添加短信发送验证锁
        if( sms_verify_locker > 0 ){
            return;
        }
        sms_verify_locker = 1;

        var bank_account_no = $("#bank_account_no").val();
        var bank_code = $("#bank_code").val();
        var phone_no = $("#phone_no").val();
        //var province_city = $("#province_city").val();
        //var province = $("#province_city").find("option:selected").attr("name");
        //var city = $("#province_city").find("option:selected").text();
        var province = $("#province").val();
        var city = $("#city").val();
        var card_type = $("#card_type").val();
        var click_action = $("#qick-pay-action").val();
        if(click_action == "deposit") {
            var post_url = "/cashier/create_hosting_deposit";
        }else{
            var post_url = "/cashier/binding_bank_card";
        }

        setResendValidCodeTime();
        !$("#popup-bind-tip").hasClass("opened") && popup2YuanTip();

        $.post(post_url, {
            bank_account_no: bank_account_no,
            bank_code: bank_code,
            phone_no: phone_no,
            province: province,
            city: city,
            card_type: card_type,
            pay_method: "quick_pay"
        }, function (data) {
            if (data.code == 0) {
                $("#binding_bank_card").removeAttr("disabled").addClass("yellow");
                $("#binding_ticket").val(data.data.ticket);
                $("#order_out_trade_no").val(data.data.pay_order_id);
            } else {
                countdown = 0;
                //todo: 验证码发送失败or绑卡失败？待确认
                $("#bind-card-title").text("银行卡绑定失败");
                $("#bind-card-msg").text(data.msg);
                $.magnificPopup.open({
                    items: {
                        src: "#popup-bind-card",
                        type: "inline",
                        midClick: true
                    },
                    callbacks: {
                        open: function() {
                            $("#cancel").bind("click", function(){
                                $.magnificPopup.close();
                            })
                        },
                        afterClose :function() {
                        }
                    }
                });
            }
        }, 'json');
    }

    var countdown_init_value = 90;
    var countdown = countdown_init_value;
    function setResendValidCodeTime() {
        var send_valid_code = $('#send_valid_code');
        if (countdown == 0) {
            send_valid_code.attr('disabled',false).addClass("yellow").removeClass("disabled");
            send_valid_code.text("发送验证码");
            countdown = countdown_init_value;

            //释放短信验证锁
            sms_verify_locker = 0;
        } else {
            send_valid_code.removeAttr("disabled").removeClass("yellow").addClass("disabled");
            send_valid_code.text("重新发送(" + countdown + ")");
            countdown--;
            setTimeout(function() {setResendValidCodeTime()},1000)
        }
    }

    function doBindingBank() {
        var valid_code = $("#valid_code").val();
        var ticket = $("#binding_ticket").val();
        var out_advance_no = $("#order_out_trade_no").val();
        var click_action = $("#qick-pay-action").val();
        if(click_action == "deposit") {
            var post_url = "/cashier/advance_hosting_pay";
        }else{
            var post_url = "/cashier/binding_bank_card_advance";
        }

        $.post(post_url, {
            valid_code: valid_code,
            ticket: ticket,
            pay_order_id: out_advance_no
        }, function (data) {
            // console.log(data);
            if (data.code == 0) {
                //window.location.reload();
                $("#bind-card-title").text("银行卡绑定成功");
                $("#bind-card-msg").text("你现在可以选择快捷支付充值到帐户中了");
                var is_success = true;
            } else {
                $("#bind-card-title").text("银行卡绑定失败");
                $("#bind-card-msg").text(data.msg);
                var is_success = false;
            }
            $.magnificPopup.open({
                items: {
                    src: "#popup-bind-card",
                    type: "inline",
                    midClick: true
                },
                callbacks: {
                    open: function() {
                        $("#cancel").bind("click", function(){
                            $.magnificPopup.close();
                            //window.location.reload();
                        })
                    },
                    afterClose :function() {
                        if(is_success) {
                            window.location.reload();
                        }else {
                            $("#valid_code").val("").focus();
                            $("#binding_bank_card").html('绑定');
                        }
                    }
                }
            });
        }, 'json');
    }

    function popup2YuanTip() {
        //弹出2块钱提示
        $.magnificPopup.open({
            items: {
                src: "#popup-bind-tip",
                type: "inline",
                midClick: true
            },
            callbacks: {
                open: function() {
                    $("#tip_cancel").bind("click", function(){
                        $.magnificPopup.close();
                    });
                    $("#popup-bind-tip").addClass("opened");
                },
                afterClose :function() {
                    $("#valid_code").focus();
                }
            }
        });
    }
});
