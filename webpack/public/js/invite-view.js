$(function() {
	$.validator.addMethod('checkphone', function(value, element) {
		return checkCellphoneValidate(value);
	});
	$("#acceptForm").validate({
		'errorClass': 'tips',
		'errorElement': 'div',
		rules: {
			'cellphone': {
				required: true,
				checkphone: true
			}
		},
		messages: {
			'cellphone': {
				required: '请输入验证码',
				checkphone: '手机号格式错误'
			}
		},
		highlight: function(element, errorClass) {
			$(element).removeClass(errorClass);
		},
		submitHandler: function (form) {
			var cellphone = $("#cellphone").val();

			$.get('/user/reg-qualify', {cellphone:cellphone}, function(data) {
				if(data.code == 0) {
					if(typeof get_invite == 'function')
						get_invite(data.data);
					else handleDispatchPage(data.data, cellphone);
				} else {
					alert(data.msg);
				}
			}, 'json');
		}
	});
});

// function checkCellphoneValidate(cellphone) {
// 	return cellphone.match(/^(((1[3|4|5|7|8]{1}[0-9]{1}))+\d{8})$/);
// }

function handleDispatchPage(data, cellphone) {
	if(data.registered) {
		if($.cookie('app_token')) { //已登录
			alert('此用户已经注册过，可直接去到产品参与页面');
			var product_id  = $("#product_id").val();
			location.href = '/product/detail?product_id=' + product_id;
		} else {  //未登录
			location.href = '/user/login?step=2&cellphone=' + cellphone; //登录
		}
	} else {
		accpetInvite(cellphone);
	}
}

function accpetInvite(cellphone) {
	var invite_code = $("#invite_code").val();
	var product_id  = $("#product_id").val();
	$.post("/invite/accept", {cellphone:cellphone, invite_code:invite_code, product_id:product_id}, function(data) {
		if(data.code == 0) {
			location.href = '/user/login?step=3&cellphone=' + cellphone; //注册
		} else {
			alert(data.msg);
			if(data.code == 12004) { //已经接收邀请，直接定位到登录
				location.href = '/user/login?step=2&cellphone=' + cellphone; //注册
			}
		}
	}, 'json');
}