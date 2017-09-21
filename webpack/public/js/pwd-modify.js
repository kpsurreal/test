var setTradePasswdForm = modifyPasswdForm = modifyTradePasswdForm = checkOriginCellphoneForm = checkNewCellphoneForm = '';
var origin_captcha_expire = new_captcha_expire = new_captcha_interval = origin_captcha_interval = '';
$(function() {
	if($(".single_set_trade_passwd_page").length)  {
		var back_url = '/novice-task-finished';
		if($("#back_url").length && $("#back_url").val() != '') {
			back_url = $("#back_url").val();
		}
		validateSaveTradePasswdForm(back_url);
	}

	//$("#setCheckIdentity").magnificPopup({
	//	items: {
	//		src: ".check-identity",
	//		type: "inline",
	//		midClick: true
	//	},
	//	callbacks: {
	//		open: function() {
	//			validateCheckIdentityForm();
	//		},
	//		close: function() {
	//			checkIdentityForm.resetForm();
	//		}
	//	}
	//});

	$("#modifyLoginPasswd").magnificPopup({
		items: {
			src: ".modify-login-passwd",
			type: "inline",
			midClick: true
		},
		callbacks: {
			open: function() {
				validateModifyLoginPasswdForm();
			},
			close: function() {
				modifyPasswdForm.resetForm();
				modifyPasswdForm.currentForm.reset();
			}
		}
	});

	$("#setTradePasswd").magnificPopup({
		items: {
			src: ".set-trade-passwd",
			type: "inline",
			midClick: true
		},
		callbacks: {
			open: function() {
				validateSaveTradePasswdForm('/user/secure');
			},
			close: function() {
				setTradePasswdForm.resetForm();
				setTradePasswdForm.currentForm.reset();
			}
		}
	});

	$("#modifyTradePasswd").magnificPopup({
		items: {
			src: ".modify-trade-passwd",
			type: "inline",
			midClick: true
		},
		callbacks: {
			open: function () {
				validateModifyTradePasswdForm();
			},
			close: function() {
				modifyTradePasswdForm.resetForm();
				modifyTradePasswdForm.currentForm.reset();
			}
		}
	});

	$("#modifyCellphone").magnificPopup({
		items: {
			src: ".modify-cellphone",
			type: "inline",
			midClick: true
		},
		callbacks: {
			open: function () {
				validateOriginCellponeForm();
			},
			close: function() {
				checkOriginCellphoneForm.resetForm();
				checkOriginCellphoneForm.currentForm.reset();
			}
		}
	});

	$("#sendOriginVerifyCode").click(function() {
		cellphone = $("#cellphone").val();
		if(!checkCellphoneValidate(cellphone)) {
			alert('手机号格式不正确');
			return false;
		}
		changeVerifyBtnState("#sendOriginVerifyCode", false);

		type = 4;//检验原手机类型
		dom_elem = '#origin_verify_code';
		$.get('/sms-verify-code', {cellphone:cellphone, type:type}, function(data) {
			if(data.code == 0) {
				$(dom_elem).val(data.data.verify_code);
				origin_captcha_expire = data.data.front_expire;
				changeCaptchaOriginChar();
				origin_captcha_interval = setInterval(changeCaptchaOriginChar, 1000);
			} else {
				alert(data.msg);
				changeVerifyBtnState("#sendOriginVerifyCode", true);
			}
		}, 'json');
	});

	$("#sendNewVerifyCode").click(function() {
		cellphone = $("#new_cellphone").val();
		if(!checkCellphoneValidate(cellphone)) {
			alert('手机号格式不正确');
			return false;
		}
		changeVerifyBtnState("#sendNewVerifyCode", false);
		type = 5;//检验新手机类型
		dom_elem = '#new_verify_code';
		$.get('/sms-verify-code', {cellphone:cellphone, type:type}, function(data) {
			if(data.code == 0) {
				$(dom_elem).val(data.data.verify_code);
				new_captcha_expire = data.data.front_expire;
				changeCaptchaNewChar();
				new_captcha_interval = setInterval(changeCaptchaNewChar, 1000);
			} else {
				alert(data.msg);
				changeVerifyBtnState("#sendNewVerifyCode", true);
			}
		}, 'json');
	});

	//form btn状态
	//$("#checkOriginCellphoneForm").keyup(function() {
	//	changeBtnState("#modifyMobileNextStep", checkOriginCellphoneForm.checkForm());
	//});
	//$("#checkNewCellphoneForm").keyup(function() {
	//	changeBtnState("#doModifyMobile", checkNewCellphoneForm.checkForm());
	//});
	//$("#modifyPasswdForm").keyup(function() {
	//	changeBtnState("#doModifyLoginPasswd", modifyPasswdForm.checkForm());
	//});
	//$("#setTradePasswdForm").keyup(function() {
	//	changeBtnState("#doSetTradePasswd", setTradePasswdForm.checkForm());
	//});
	//$("#modifyTradePasswdForm").keyup(function() {
	//	changeBtnState("#doModifyTradePasswd", modifyTradePasswdForm.checkForm());
	//	//modifyTradePasswdForm.showLabel('#confirm_new_trade_passwd', '真的失败了');
	//});
	//$("#checkIdentityForm").change(function() {
	//	changeBtnState("#doCheckIdentity", checkIdentityForm.checkForm());
	//});

    $("#do-bind-weixin").on('click',doBindWeixin);
    $("#do-unbind-weixin").on('click',doUnbindWeixin);
    $(window).on('message',function(event){
      var msg = event.originalEvent.data;
      if( /3dloginSuccess/.test(msg) ){
          $("#3rdlogin-iframe").remove();
          msg = JSON.parse(msg);
          thirdBind(msg.type, msg.unionid).then( window.location.reload );
      }
    });
});

window.gmf_confirm = gmf_confirm;

function gmf_confirm(msg){
    var cancel_callback = function(){};
    var ok_callback = function(){};
    var result = {
        cancel:function(callback){cancel_callback=callback;return result;},
        ok:function(callback){ok_callback=callback;return result;}
    }

    $.magnificPopup.open({
        items: {
            src: "#popup-confirm",
            type: "inline",
            midClick: true
        },
        callbacks: {
            beforeOpen: function(){
                $('#popup-confirm').find('.msg').text(msg);
            },
            open: function() {
                $("#popup-confirm").find('.cancel').off().bind("click", function(){
                    $.magnificPopup.close();
                    cancel_callback();
                });
                $("#popup-confirm").find('.ok').off().bind("click", function(){
                    $.magnificPopup.close();
                    ok_callback();
                });
            }
        }
    });

    return result;
}

//function operateTips(content, url, title) {
//	if(title) {
//		$("#tip_title").html(title);
//	}
//	$("#tip_content").html(content);
//	$("#tip_button").click(function() {
//		$.magnificPopup.close();
//		if(url) {
//			location.href = url;
//		}
//	});
//
//	$.magnificPopup.open({
//		items: {
//			src: ".popup-common"
//		},
//		type: 'inline'
//	});
//}

//function validateCheckIdentityForm() {
//	if(checkIdentityForm) return true;
//	checkIdentityForm = $("#checkIdentityForm").validate({
//		'errorClass': 'tips',
//		'errorElement': 'div',
//		rules: {
//			'real_name': {
//				required: true,
//				rangelength:[2,6]
//			},
//			'identity_card': {
//				required: true,
//				isIdCardNo: true
//			}
//		},
//		messages: {
//			'real_name': {
//				required: '请输入真实姓名',
//				rangelength: '真实姓名长度为2-6个字'
//			},
//			'identity_card': {
//				required: '请输入身份证信息',
//			}
//		},
//		highlight: function(element, errorClass) {
//			$(element).removeClass(errorClass);
//		},
//		submitHandler: function (form) {
//			doCheckIdentity();
//		}
//	});
//}

//function checkCellphoneValidate(cellphone) {
//	return cellphone.match(/^(((1[3|4|5|7|8]{1}[0-9]{1}))+\d{8})$/);
//}

function changeCaptchaOriginChar() {
	origin_captcha_expire--;
	if(origin_captcha_expire <=0 && origin_captcha_interval) {
		clearInterval(origin_captcha_interval);
		$("#sendOriginVerifyCode").html('再次发送');
		changeVerifyBtnState("#sendOriginVerifyCode", true);
		return false;
	}
	$("#sendOriginVerifyCode").html('再次发送('+origin_captcha_expire+'s)');
}

function changeCaptchaNewChar() {
	new_captcha_expire--;
	if(new_captcha_expire <=0 && new_captcha_interval) {
		clearInterval(new_captcha_interval);
		$("#sendNewVerifyCode").html('再次发送');
		changeVerifyBtnState("#sendNewVerifyCode", true);
		return false;
	}
	$("#sendNewVerifyCode").html('再次发送('+new_captcha_expire+'s)');
}

function validateOriginCellponeForm() {
	if(checkOriginCellphoneForm) return true;
	checkOriginCellphoneForm = $("#checkOriginCellphoneForm").validate({
		'errorClass': 'tips',
		'errorElement': 'div',
		rules: {
			'origin_verify_code': {
				required: true,
				rangelength: [6,6]
			}
		},
		messages: {
			'origin_verify_code': {
				required: '请输入验证码',
				rangelength: '验证码长度为6位字符'
			}
		},
		highlight: function(element, errorClass) {
			$(element).removeClass(errorClass);
		},
		submitHandler: function (form) {
			doCheckOriginCellphone();
		}
	});
}

function validateNewCellponeForm() {
	if(checkNewCellphoneForm) return true;
	checkNewCellphoneForm = $("#checkNewCellphoneForm").validate({
		'errorClass': 'tips',
		'errorElement': 'div',
		rules: {
			'new_cellphone': {
				required: true,
				checkphone: true
			},
			'new_verify_code': {
				required: true,
				rangelength: [6,6]
			}
		},
		messages: {
			'new_cellphone': {
				required: '请输入新的手机号',
				checkphone: '手机号格式不正确'
			},
			'new_verify_code': {
				required: '请输入验证码',
				rangelength: '验证码长度为6位字符'
			}
		},
		highlight: function(element, errorClass) {
			$(element).removeClass(errorClass);
		},
		submitHandler: function (form) {
			doModifyCellphone();
		}
	});
}

function validateModifyTradePasswdForm() {
	if(modifyTradePasswdForm) return true;
	modifyTradePasswdForm = $("#modifyTradePasswdForm").validate({
		'errorClass': 'tips',
		'errorElement': 'div',
		rules: {
			'old_trade_passwd': {
				required: true,
				digits: true,
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
			'old_trade_passwd': {
				required: '请输入原交易密码',
				digits: '交易密码只能为数字',
				rangelength: '原交易密码长度为6位字符'
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
			doModifyTradePasswd();
		}
	});
}

function validateSaveTradePasswdForm(origin_url) {
	if(setTradePasswdForm) return true;
	setTradePasswdForm = $("#setTradePasswdForm").validate({
		'errorClass': 'tips',
		'errorElement': 'div',
		rules: {
			'trade_passwd': {
				required: true,
				digits: true,
				rangelength: [6,6]
			},
			'confirm_trade_passwd': {
				required: true,
				digits: true,
				equalTo: '#trade_passwd'
			}
		},
		messages: {
			'trade_passwd': {
				required: '请输入交易密码',
				digits: '交易密码只能为数字',
				rangelength: '交易长度为6位字符'
			},
			'confirm_trade_passwd': {
				required: '请输入确认密码',
				digits: '交易密码只能为数字',
				equalTo: '两次密码输入不一致'
			}
		},
		highlight: function(element, errorClass) {
			$(element).removeClass(errorClass);
		},
		submitHandler: function (form) {
			doSaveTradePasswd(origin_url);
		}
	});
}

function validateModifyLoginPasswdForm() {
	if(modifyPasswdForm) return true;
	modifyPasswdForm = $("#modifyPasswdForm").validate({
		'errorClass': 'tips',
		'errorElement': 'div',
		debug: true,
		rules: {
			'old_passwd': {
				required: true,
				minlength: 6
			},
			'new_passwd': {
				required: true,
				minlength: 6
			},
			'confirm_passwd': {
				required: true,
				equalTo: '#new_passwd'
			}
		},
		messages: {
			'old_passwd': {
				required: '请输入旧密码',
				minlength: '旧密码长度至少为6位字符'
			},
			'new_passwd': {
				required: '请输入新密码',
				minlength: '新密码长度为至少6位字符'
			},
			'confirm_passwd': {
				required: '请输入确认密码',
				equalTo: '两次密码输入不一致'
			}
		},
		highlight: function(element, errorClass) {
			$(element).removeClass(errorClass);
		},
		submitHandler: function (form) {
			doModifyLoginPasswd();
		}
	});
}

//function doCheckIdentity() {
//	var real_name = $("#real_name").val();
//	var identity_card = $("#identity_card").val();
//	$.post('/user/real-name-check', {real_name:real_name, identity_card:identity_card}, function(data) {
//		if(data.code == 0) {
//			operateTips('通过实名认证', '/user/secure');
//		} else {
//			alert(data.msg);
//		}
//	}, 'json');
//}

function doModifyCellphone() {
	var new_cellphone = $("#new_cellphone").val();
	var new_verify_code = $("#new_verify_code").val();
	changeVerifyBtnState("#doModifyMobile", false, true);
	$.post('/user/cellphone-modify-check-new', {new_cellphone:new_cellphone, new_verify_code:new_verify_code}, function(data) {
		if(data.code == 0) {
			operateTips('修改手机号成功', '/user/secure');
		} else {
			changeVerifyBtnState("#doModifyMobile", true, true);
			showMsg(checkNewCellphoneForm.currentForm, data.msg);
		}
	}, 'json');
}

function goModifyCellphoneNextStep() {
	$("#origin_cellphone_block").hide(function() {
		validateNewCellponeForm();
		$("#new_cellphone_block").show();
	});
}

function doCheckOriginCellphone() {
	var origin_verify_code = $("#origin_verify_code").val();
	changeVerifyBtnState("#modifyMobileNextStep", false, true);
	$.post('/user/cellphone-modify-check-origin', {origin_verify_code:origin_verify_code}, function(data) {
		if(data.code == 0) {
			goModifyCellphoneNextStep();
		} else {
			changeVerifyBtnState("#modifyMobileNextStep", true, true);
			showMsg(checkOriginCellphoneForm.currentForm, data.msg);
		}
	}, 'json');
}

function doModifyTradePasswd() {
	var old_trade_passwd = $("#old_trade_passwd").val();
	var new_trade_passwd = $("#new_trade_passwd").val();
	changeVerifyBtnState("#doModifyTradePasswd", false, true);
	$.post('/user/trade-pwd-modify', {old_trade_passwd:old_trade_passwd, new_trade_passwd:new_trade_passwd}, function(data) {
		if(data.code == 0) {
			operateTips('交易密码修改成功', '/user/secure');
		} else {
			changeVerifyBtnState("#doModifyTradePasswd", true, true);
			showMsg(modifyTradePasswdForm.currentForm, data.msg);
		}
	}, 'json');
}

function doSaveTradePasswd(origin_url) {
	var trade_passwd = $("#trade_passwd").val();
	changeVerifyBtnState("#doSetTradePasswd", false, true);
	$.post('/user/trade-pwd-set', {trade_passwd:trade_passwd}, function(data) {
		if(data.code == 0) {
			operateTips('交易密码设置成功', origin_url);
		} else {
			changeVerifyBtnState("#doSetTradePasswd", true, true);
			showMsg(setTradePasswdForm.currentForm, data.msg);
		}
	}, 'json');
}

function doModifyLoginPasswd() {
	var old_passwd = $("#old_passwd").val();
	var new_passwd = $("#new_passwd").val();
	var confirm_passwd = $("#confirm_passwd").val();
	changeVerifyBtnState("#doModifyLoginPasswd", false, true);
	$.post('/user/pwd-modify', {old_passwd:old_passwd, new_passwd:new_passwd,
		confirm_passwd:confirm_passwd}, function(data) {
		if(data.code == 0) {
			operateTips('登录密码修改成功', '/user/secure');
		} else {
			changeVerifyBtnState("#doModifyLoginPasswd", true, true);
			showMsg(modifyPasswdForm.currentForm, data.msg);
		}
	}, 'json');
}

//去绑定
function doBindWeixin(){
	$('#qrcode-login-container').html('');
	$('<iframe id="3rdlogin-iframe">')
		.attr('src', $('#qrcode-login-container').data('iframe-url'))
		.css('height', '350px')
		.css('border', '0')
		.appendTo('#qrcode-login-container');

    $.magnificPopup.open({
        items: {
            src: "#popup-3rdbind-weixin",
            type: "inline",
            midClick: true
        }
    });
}

//发送绑定请求
function thirdBind(type, unionid){
    var bind_callback = function(){};
    var result = {then:function(func){bind_callback=func;}};

    $.get('/3rd_login/bind',{
        unionid: unionid,
        type: type
    },function(data){
        if(data.code=='0'){
            bind_callback();
        }else{
            alert(data.msg);
            bind_callback();
        }
    });

    return result;
}

//去解绑
function doUnbindWeixin(){
    gmf_confirm("确定要解除绑定关系？").ok(function(){
        $.get('/3rd_login/bind?unionid=-1&type=wx',function(data){
            if(data.code == "0"){
                window.location = "/user/secure";
            }else{
                alert(data.msg||'解除绑定失败！');
            }
        })
    });
}
