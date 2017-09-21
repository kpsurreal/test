/**
 * Created by buty on 15/8/21.
 */
var checkIdentityForm = '';
var isGetRemote = false;
$(function() {
    if(!$(".single_check_name_page").length) {
        switchChargeAndWidthdraw();
    } else {
        validateCheckIdentityForm('/novice-task');
    }
});

function getRemoteHtml(origin_url) {
    $.get('/user/real-name-pop', function(data) {
        if(!isGetRemote) {
            $(".check-identity").append(data);
            isGetRemote = true;
            //$("#checkIdentityForm").keyup(function() {
            //    changeBtnState("#doCheckIdentity", checkIdentityForm.checkForm());
            //});
            validateCheckIdentityForm(origin_url);

        }
    });
}

function validateCheckIdentityForm(origin_url) {
    if(checkIdentityForm) return true;
    checkIdentityForm = $("#checkIdentityForm").validate({
        'errorClass': 'tips',
        'errorElement': 'div',
        rules: {
            'real_name': {
                required: true,
                rangelength:[2,6]
            },
            'identity_card': {
                required: true,
                isIdCardNo: true
            }
        },
        messages: {
            'real_name': {
                required: '请输入真实姓名',
                rangelength: '真实姓名长度为2-6个字'
            },
            'identity_card': {
                required: '请输入身份证信息',
            }
        },
        highlight: function(element, errorClass) {
            $(element).removeClass(errorClass);
        },
        submitHandler: function (form) {
            doCheckIdentity(origin_url);
        }
    });

    $('#real_name,#identity_card').on('change click input',function(){
        $(this).next('.tips').hide();
    });
}

function doCheckIdentity(origin_url) {
    var real_name = $("#real_name").val();
    var identity_card = $("#identity_card").val();
    changeVerifyBtnState("#doCheckIdentity", false, true);
    $.post('/user/real-name-check', {real_name:real_name, identity_card:identity_card}, function(data) {
        if(data.code == 0) {
            operateTips('实名认证已通过', origin_url, '实名认证');
        } else {
            changeVerifyBtnState("#doCheckIdentity", true, true);
            showMsg(checkIdentityForm.currentForm, data.msg);
        }
    }, 'json');
}

function switchChargeAndWidthdraw() {
    $.get('/user/real-name-check', {format: 'json'}, function(data) {
        if(data.code != 0) return ;
        if(data.data.check_real_name_pass == 1) {
            changeHrefRecharge();
        } else {
            $(".chargeMoney, #setCheckIdentity").click(function (e) {
                var origin_url = $(this).attr('rel-href');
                $.magnificPopup.open({
                    items: {
                        src: ".check-identity",
                        type: "inline",
                        midClick: true
                    },
                    callbacks: {
                        open: function() {
                            getRemoteHtml(origin_url);
                        },
                        close: function() {
                            if(checkIdentityForm) {
                                checkIdentityForm.resetForm();
                                checkIdentityForm.currentForm.reset();
                            }

                        }
                    }
                });
            });
        }
    }, 'json');
}

function changeHrefRecharge() {
    $(".chargeMoney").each(function() {
        var rel_href = $(this).attr('rel-href');
        $(this).attr('href', rel_href);
    });
}
