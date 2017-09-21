var captcha_expire = forget_captcha_expire = 0;
var captcha_interval = forget_captcha_interval = null;
var has_validate_login_form = has_validate_forget_passwd_form = has_validate_register_form = false;

$(function() {
    //是否已经完成第三方登录
    window.isThirdLogined = !!_search_get('third');
    window.userAccountType = 0;

	$.validator.addMethod('checkphone', function(value, element) {
		return checkCellphoneValidate(value);
	});
	$("#checkCellphone").click(function(e) {
		e.preventDefault();
		needCellphone = $("#needCellphone").val();
		if(validatePhone(needCellphone, 'needCellphone')) {
			$.get('/user/reg-qualify', {cellphone: needCellphone}, function(data) {
				if(data.code == 0) {
                    window.userAccountType = data.data && data.data.registered && parseInt(data.data.account_type);
					dispatchPage(needCellphone, data.data);
				} else {
					alert(data.msg);
				}
			}, 'json');
		}
	});


	$("#needCellphone, #loginCellphone, #failureCellphone, #forgetCellphone, #cellphone").keyup(function(e) {
		if(e.keyCode == 224 || e.keyCode == 17 || e.keyCode == 91) {
			return true;
		}
		var cellphone = $(this).val();
		$("#needCellphone").val(cellphone);
		if(checkCellphoneValidate(cellphone)) {
			$("#checkCellphone").click();
		} else {
			document.title = '{{config('custom.app_name')}}－欢迎您';
			hiddenInitPage();
			$("#checkCellphoneBlock").show();
			$("#needCellphone").val('').focus().val(cellphone);
		}
	});

    //第三方登录回调
    if( window.isThirdLogined ){
        thirdLoginSuccess( decodeURIComponent(_search_get('nickname')) );
    }

	//初始化手机号检测
	if( checkCellphoneValidate($("#needCellphone").val()) ) {
		$("#checkCellphone").click();
	}

	//form btn状态
	//$("#loginForm").keyup(function() {
	//	changeBtnState("#doLogin", has_validate_login_form.checkForm());
	//});
	//$("#forgetPasswdForm").keyup(function() {
	//	changeBtnState("#doForgetPasswd", has_validate_forget_passwd_form.checkForm());
	//});
	//$("#registerForm").keyup(function() {
	//	changeBtnState("#doRegister", has_validate_register_form.checkForm());
	//});
});

function validateLoginForm() {
	if(!has_validate_login_form) {
		has_validate_login_form = $("#loginForm").validate({
			'errorClass': 'tips',
			'errorElement': 'div',
			rules: {
				'loginCellphone':{
					required: true,
					checkphone: true,
				},
				'loginPassword': {
					required: true,
					//minlength: 6
				}
			},
			messages: {
				'loginCellphone':{
					required: '请输入手机号',
					checkphone: '手机号格式不正确',
				},
				'loginPassword': {
					required: '请输入密码',
					//minlength: '密码长度为至少6位字符'
				}
			},
			// highlight: function(element, errorClass) {
			// 	$(element).removeClass(errorClass);
			// },
			errorPlacement: function(error, element) {
				error.appendTo(element.parent());
			},
			submitHandler: function (form) {
				cellphone = $("#loginCellphone").val();
				password  = $("#loginPassword").val();
				remember = $("input[name=remember]:checked").val();
				currentForm = this.currentForm;
				changeVerifyBtnState("#doLogin", false, true);
				$.post('/bms-pub/user/login', {cellphone:cellphone, password:password, remember:remember}, function(data) {
					if(data.code == 0) {
						//登录后的逻辑
                        setLoginToken(data.data.app_token);
                        window.isThirdLogined ? thirdBind().then( thirdLoginBindSuccess ) : afterLogin();
					} else {
						changeVerifyBtnState("#doLogin", true, true);
						showMsg(currentForm, data.msg);
					}
				}, 'json');
			}
		});
	}
}


function validateForgetPasswdForm() {
	if(!has_validate_forget_passwd_form) {
		has_validate_forget_passwd_form = $("#forgetPasswdForm").validate({
			'errorClass': 'tips',
			'errorElement': 'div',
			errorPlacement: function(error, element) {
				error.appendTo(element.parent());
			},
			rules: {
				'forgetCellphone':{
					required: true,
					checkphone: true,
				},
				'forgetCaptcha': {
					required: true,
					rangelength: [6,6]
				},
				'new_passwd': {
					required: true,
					minlength: 6,
				},
				'confirm_passwd': {
					required: true,
					equalTo: '#new_passwd'
				}
			},
			messages: {
				'forgetCellphone':{
					required: '请输入手机号',
					checkphone: '手机号格式不正确',
				},
				'forgetCaptcha': {
					required: '请输入验证码',
					rangelength: '验证码长度为6位字符'
				},
				'new_passwd': {
					required: '请输入密码',
					minlength: '密码长度为至少6位字符'
				},
				'confirm_passwd': {
					required: '请输入密码',
					equalTo: '两次密码输入不一致'
				}
			},
			// highlight: function(element, errorClass) {
			// 	$(element).removeClass(errorClass);
			// },
			submitHandler: function (form) {
				currentForm = this.currentForm;
				postForgetPasswd(currentForm);
			}
		});
	}
}

function validateRegisterForm() {
	if(!has_validate_register_form) {
		has_validate_register_form = $("#registerForm").validate({
			'errorClass': 'tips',
			'errorElement': 'div',
			rules: {
				'cellphone':{
					required: true,
					checkphone: true,
				},
				'captcha': {
					required: true,
					rangelength: [6,6]
				},
				'nick_name': {
					required: true,
					rangelength: [2,12],
				},
				'password': {
					required: true,
					minlength: 6,
				}
			},
			messages: {
				'cellphone':{
					required: '请输入手机号',
					checkphone: '手机号格式不正确',
				},
				'captcha': {
					required: '请输入验证码',
					rangelength: '验证码长度为6位字符'
				},
				'nick_name': {
					required: '请输入昵称',
					rangelength: '昵称长度为2~12位字符'
				},
				'password': {
					required: '请输入密码',
					minlength: '密码最短为6位'
				}
			},
			// highlight: function(element, errorClass) {
			// 	$(element).removeClass(errorClass);
			// },
			submitHandler: function (form) {
				var with_invited = true;
				submitRegister(with_invited);
			}
		});
	}
}

function submitRegister(with_invited){
	var cellphone = $("#cellphone").val();
	var nick_name = $("#nick_name").val();
	var verify_code = $("#captcha").val();
	var password = $("#password").val();
	var currentForm = $("#registerForm");
	var invited_id = $("#invited_id").val();
	changeVerifyBtnState("#doRegister", false, true);

	var post_data = {cellphone:cellphone,
		 nick_name:nick_name,
		 verify_code:verify_code,
		 password:password
	}

	if(with_invited){
		post_data.invited_id = invited_id
	}

	$.post('/user/register', post_data , function(data) {
			if(data.code == 0) {
				//有渠道的情况自动跳转
				if($("#channel_need_jump_back_url").length && $("#channel_need_jump_back_url").val() == '1') {
					jumpHomeUrl(data.data.app_token);
					return;
				}

				//注册完后的逻辑
				setLoginToken(data.data.app_token);

                //第三方登录先行判断
                    //如果有第三方登录，绑定当前帐号后，处理后事
                    //如果没有，直接处理后事
                window.isThirdLogined ? thirdBind().then( afterRegister ) : afterRegister();
				return;
			}

			changeVerifyBtnState("#doRegister", true, true);

			if(data.code == 4022011 && confirm('邀请手机号不存在，是否要继续注册？')){
				submitRegister(false);
				return;
			}

			if(data.code == 5022010 && confirm('小金号不存在，是否要继续注册？')){
				submitRegister(false);
				return;
			}

			showMsg(currentForm, data.msg);
	}, 'json');
}

function afterRegister(){
	//获取注册佣金情况
	$.get('/user/register/bounty').success(function(data){
		var amount = 0;
		if(data.code == 0 && data.data.amount > 0){
			amount = data.data.amount;
			$('#register_bounty_span').text( amount+'元' );
			$('#registeredBlock').addClass('bounty');
		}

		hiddenInitPage();
		$('#registeredBlock').show();

        setTimeout(function(){
            if( afterRegisterSouldGoBack() ){
        	    location.href = back_url.replace(/&amp;/g, "&");
            }
        });
	});
}

function afterRegisterSouldGoBack(){
    //回跳白名单 path 设置在这里
    return [
        '/bounty/add-quiz'
    ].filter(function(path){
        return back_url.replace(location.origin,'').indexOf(path) == 0;
    }).length;
}

function afterLogin() {
    // back_url 黑名单设定
	if(!back_url || /login/.test(back_url))
		back_url = '/user/secure';
	location.href = back_url.replace(/&amp;/g, "&");
}

function setLoginToken(token) {
	$.cookie('app_token', token, { path: '/', expires: 7 });
}

function validatePhone(cellphone, attr_id) {
	pass = checkCellphoneValidate(cellphone);
	if(!pass) {
		$("#" + attr_id).parent().removeClass('error').addClass('error');
		$("#" + attr_id + "_tips").show();
	} else {
		$("#" + attr_id).parent().removeClass('error');
		$("#" + attr_id + "_tips").hide();
	}

	return pass;
}

function changeCaptchaChar() {
	captcha_expire--;
	if(captcha_expire <=0 && captcha_interval) {
		clearInterval(captcha_interval);
		$("#sendCaptcha").html('再次发送');
		changeVerifyBtnState("#sendCaptcha", true);
		return false;
	}
	$("#sendCaptcha").html('再次发送('+captcha_expire+'s)');
}

function changeForgetCaptchaChar() {
	forget_captcha_expire--;
	if(forget_captcha_expire <=0 && forget_captcha_interval) {
		clearInterval(forget_captcha_interval);
		$("#sendForgetCaptcha").html('再次发送');
		changeVerifyBtnState("#sendForgetCaptcha", true);
		return false;
	}
	$("#sendForgetCaptcha").html('再次发送('+forget_captcha_expire+'s)');
}



function dispatchPage(cellphone, data) {
	hiddenInitPage();
	//去登录
	if(data.registered) {
		startLogin(cellphone, data.nick_name);
	} else { //去注册
		if(data.allow_register) { //允许注册
			startRegister(cellphone, data.invited_info);
		} else { //不允许注册
			notAllowRegister(cellphone);
		}
	}
}

function startLogin(cellphone, nick_name) {
	// document.title = '操盘侠－帐户登录';
	$("#loginCellphone").val(cellphone);
	$("#nickName,.nickName").html(nick_name);
	$("#checkSuccessBlockLogin").show();

	if(typeof(gmf_platform_type_mobile) == "undefined") {
		$("#loginPassword").focus();
	}

	validateLoginForm(); //登录表单处理

	$("#doForget").click(function(e) {
		e.preventDefault();
		startForgetPasswd(cellphone);
	});
}

/*---------------------------------------------------
-------------支持第三方登录的新增函数--------------------
-----------------------------------------------------*/

//手机号登录
function startCheckCellphone(){
    hiddenInitPage();
    $("#checkCellphoneBlock").show();
    $("#needCellphone").val('').focus();
}

//第三方登录
function startWeixinLogin(){
    hiddenInitPage();
	$('#qrcode-login-container').html('');
	$('<iframe>')
		.attr('src', $('#qrcode-login-container').data('iframe-url'))
		.css('height', '500px')
		.css('border', '0')
		.appendTo('#qrcode-login-container');
    $("#weixinLoginBlock").show();
}

//第三方登录成功回调
function thirdLoginSuccess(thirdNickName){
    $(".thirdNickName").html(thirdNickName);
    $("#loginRegisterBoard").addClass('with-third');
}

//发送绑定请求
function thirdBind(){
    var bind_callback = function(){};
    var result = {then:function(func){bind_callback=func;}};

    $.get('/3rd_login/bind',{
        unionid: _search_get('unionid'),
        type: _search_get('type')
    },function(data){
        if(data.code=='0'){
            bind_callback();
        }else if(data.code=='5029002'){
            alert('你已经绑定微信，解绑后才可以重新绑定！');
            afterLogin();
        }else{
            alert(data.msg);
            afterLogin();
        }
    });

    return result;
}

//登录绑定成功后调用，主要调用
function thirdLoginBindSuccess(){
    //如果是操盘手，绑定完成直接跳过
    if(window.userAccountType){
        afterLogin();
        return;
    }

    hiddenInitPage();
    $("#thirdBindedBlock").show();
    // setTimeout(afterLogin,3000);
}
//绑定成功后第一个按钮「使用第三方昵称」的操作
function useThirdNickName(){
    var thirdNickName = $(".thirdNickName").html();
    $.post('/user/edit', {nick_name: thirdNickName}, function(data) {
		if(data.code == 0) {
			afterLogin();
		} else {
			alert(data.msg);
            afterLogin();
		}
	}, 'json');
}
//绑定成功后第二个按钮「使用原有昵称」的操作
function useOldNickName(){
    afterLogin();
}
//-------------------------------------------------------

function startForgetPasswd(cellphone) {
	document.title = '{{config('custom.app_name')}}－找回密码';
	$("#forgetCellphone").val(cellphone);
	$("#checkSuccessBlockLogin").hide();
	$("#forgetPasswd").show();

	validateForgetPasswdForm();
	$("#forgetCaptcha").focus();
	$("#sendForgetCaptcha").unbind('click').click(function() {
		changeVerifyBtnState("#sendForgetCaptcha", false);
		type = 2;//注册码类型
		if(cellphone) {  //前端的发送周期逻辑 待完成
			$.get('/sms-verify-code', {cellphone:cellphone, type:type}, function(data) {
				if(data.code == 0) {
					//$("#forgetCaptcha").val(data.data.verify_code);
					forget_captcha_expire = data.data.front_expire;
					changeForgetCaptchaChar();
					forget_captcha_interval = setInterval(changeForgetCaptchaChar, 1000);
				} else {
					alert(data.msg);
					changeVerifyBtnState("#sendForgetCaptcha", true);
				}
			}, 'json');
		}
	});
}

function postForgetPasswd(currentForm) {
	var verify_code = $("#forgetCaptcha").val();
	var new_passwd = $("#new_passwd").val();
	var confirm_passwd = $("#confirm_passwd").val();
	changeVerifyBtnState("#doForgetPasswd", false, true);
	if(checkDoForgetPasswd(verify_code, new_passwd, confirm_passwd)) {
		$.post('/user/pwd-reset', {verify_code:verify_code, new_passwd:new_passwd,
		 	confirm_passwd:confirm_passwd}, function(data) {
		 		if(data.code == 0) {
		 			clearForgetPasswdData();
		 			$("#forgetPasswd").hide();
		 			$("#checkSuccessBlockLogin").show();
		 		} else {
					changeVerifyBtnState("#doForgetPasswd", true, true);
					showMsg(currentForm, data.msg);
		 		}
		 	}, 'json');
	}
}

function clearForgetPasswdData() {
	$("#forgetCaptcha").val('');
	$("#new_passwd").val('');
	$("#confirm_passwd").val('');
	$("#loginPassword").val('');
}

function checkDoForgetPasswd(verify_code, new_passwd, confirm_passwd) {
	return true;
}

function hiddenInitPage() {
	$("#checkCellphoneBlock, #checkSuccessBlockLogin, #checkFailureBlock, #forgetPasswd, #checkSuccessBlockRegister, #registeredBlock, #weixinLoginBlock, #thirdBindedBlock").hide();
}

function notAllowRegister(cellphone) {
	document.title = '{{config('custom.app_name')}}－非邀请用户';
	$("#checkFailureBlock").show();
	$("#failureCellphone").focus();
	$("#failureCellphone").val(cellphone);
}

function startRegister(cellphone, invited_info) {
	document.title = '{{config('custom.app_name')}}－注册帐户';
	$("#cellphone").val(cellphone);
	$("#checkSuccessBlockRegister").show();

    //邀请 ID 逻辑
    $("#invited_id").val( window.INVITE_UID || '' );
	invited_info && !$("#invited_id").val() && $("#invited_id").val(invited_info.user_id);

	$("#sendCaptcha").focus(); //修改注册时的焦点
	$("#sendCaptcha").unbind('click').click(function() {
		changeVerifyBtnState("#sendCaptcha", false);
		$("#sendCaptcha").html('正在发送...');
		cellphone = $("#cellphone").val();
		type = 1;//注册码类型
		if(cellphone) {  //前端的发送周期逻辑 待完成
			$.get('/sms-verify-code', {cellphone:cellphone, type:type}, function(data) {
				if(data.code == 0) {
					//$("#captcha").val(data.data.verify_code);
					captcha_expire = data.data.front_expire;
					changeCaptchaChar();
					captcha_interval = setInterval(changeCaptchaChar, 1000);
				} else {
					alert(data.msg);
					changeVerifyBtnState("#sendCaptcha", true);
				}
			}, 'json');
		}
	});

	validateRegisterForm();
}
