/**
 * Created by buty on 15/9/15.
 */

var resetTradePasswdForms;
var new_captcha_expire = new_captcha_interval = '';
$(function() {

    validateResetTradePasswdForm();

    $("#sendForgetTradeCaptcha").click(function() {
        cellphone = $("#forget_trade_cellphone").val();
        if(!checkCellphoneValidate(cellphone)) {
            resetTradePasswdForms.element("#forget_trade_cellphone");
            $("#forget_trade_cellphone").focus();
            return false;
        }
        changeVerifyBtnState("#sendForgetTradeCaptcha", false);

        type = 6;//重置交易密码类型

        $.get('/sms-verify-code', {cellphone:cellphone, type:type}, function(data) {
            if(data.code == 0) {
                new_captcha_expire = data.data.front_expire;
                changeCaptchaTradeChar();
                new_captcha_interval = setInterval(changeCaptchaTradeChar, 1000);
            } else {
                showMsg(resetTradePasswdForms.currentForm, data.msg);
                changeVerifyBtnState("#sendForgetTradeCaptcha", true);
            }
        }, 'json');
    });
});

function changeCaptchaTradeChar() {
    new_captcha_expire--;
    if(new_captcha_expire <=0 && new_captcha_interval) {
        clearInterval(new_captcha_interval);
        $("#sendForgetTradeCaptcha").html('再次发送');
        changeVerifyBtnState("#sendForgetTradeCaptcha", true);
        return false;
    }
    $("#sendForgetTradeCaptcha").html('再次发送('+new_captcha_expire+'s)');
}


function validateResetTradePasswdForm() {
    if(resetTradePasswdForms) return true;
    resetTradePasswdForms = $("#resetTradePasswdForm").validate({
        'errorClass': 'tips',
        'errorElement': 'div',
        rules: {
            'forget_trade_cellphone': {
                required: true,
                checkphone: true
            },
            'forget_trade_captcha': {
                required: true,
                rangelength: [6,6]
            },
            'new_trade_passwd': {
                required: true,
                digits: true,
                rangelength: [6,6]
            },
            'confirm_new_trade_passwd': {
                required: true,
                digits: true,
                equalTo: '#new_trade_passwd'
            }
        },
        messages: {
            'forget_trade_cellphone': {
                required: '手机号不能为空',
                checkphone: '手机号格式不正确'
            },
            'forget_trade_captcha': {
                required: '短信验证码不能为空',
                rangelength: '短信验证码长度为6位字符'
            },
            'new_trade_passwd': {
                required: '请输入新交易密码',
                digits: '交易密码只能为数字',
                rangelength: '新交易密码长度为6位字符'
            },
            'confirm_new_trade_passwd': {
                required: '请输入确认密码',
                digits: '交易密码只能为数字',
                equalTo: '两次密码输入不一致'
            }
        },
        highlight: function(element, errorClass) {
            $(element).removeClass(errorClass);
        },
        submitHandler: function (form) {
            doResetTradePasswd();
        }
    });
}

function doResetTradePasswd() {
    var new_trade_passwd = $("#new_trade_passwd").val();
    var verify_code = $("#forget_trade_captcha").val();
    changeVerifyBtnState("#doForgetTradePasswd", false, true);
    $.post('/user/trade-pwd-reset', {new_trade_passwd:new_trade_passwd, verify_code:verify_code}, function(data) {
        if(data.code == 0) {
            operateTips('重置交易密码成功', back_url, '忘记交易密码');
        } else {
            changeVerifyBtnState("#doForgetTradePasswd", true, true);
            showMsg(resetTradePasswdForms.currentForm, data.msg);
        }
    }, 'json');
}