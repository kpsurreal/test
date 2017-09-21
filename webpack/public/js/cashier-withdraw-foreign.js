/**
 * Created by buty on 15/9/15.
 */

var withdrawForeignForm_validated;
var new_captcha_expire = new_captcha_interval = '';
$(function() {
    validateWithdrawForeignForm();
});

function validateWithdrawForeignForm() {
    if(withdrawForeignForm_validated) return true;
    withdrawForeignForm_validated = $("#withdrawForeignForm").validate({
        'errorClass': 'tips',
        'errorElement': 'div',
        rules: {
            'withdraw_amount': {
                required: true,
                digits: true,
            },
            'trade_passwd': {
                required: true,
                digits: true,
                rangelength: [6,6]
            }
        },
        messages: {
            'withdraw_amount': {
                required: '请输入提现金额',
                digits: '提现金额只能为数字',
            },
            'trade_passwd': {
                required: '请输入交易密码',
                digits: '交易密码只能为数字',
                rangelength: '交易密码长度为6位字符'
            }
        },
        highlight: function(element, errorClass) {
            $(element).removeClass(errorClass);
        },
        submitHandler: function (form) {
            doWithdrawForeign(form);
        }
    });
}

function doWithdrawForeign(form) {
    var trade_passwd = $("#trade_passwd").val();
    changeVerifyBtnState("#doWithdrawForeign", false, true);
    $.post($(form).attr('action'), $(form).serialize(), function(data) {
        if(data.code == 0) {
            operateTips(
                '你的提现 HK$'+ $('#withdraw_amount').val() +' 已提交系统<br/><p style="font-size:16px;font-weight:400;">客服人员会在2个工作日内确认，请注意查看消息。</p>',
                '/history/trade-list',
                '港股提现'
            );
        } else {
            changeVerifyBtnState("#doWithdrawForeign", true, true);
            data.msg += '<a class="right" href="/user/trade-pwd-reset">忘记交易密码</a>';
            showMsg(form, data.msg);
        }
    }, 'json');
}
