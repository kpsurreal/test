var isProccess = false;
var timeProccess = false;
$(function() {
	$.validator.addMethod('checkHomePage', function(value, element) {
		var res = true;
		if(element.value) {
			res = element.value.match(/^[a-zA-Z0-9_]+$/);
		}
		return res;
	});

	validateEditProfileForm();

	//$("#cityBlock").citySelect({
	//		nodata:"none",
	//		url: "/js/select-city/city.min.js",
	//		prov: getProv(),
	//		city: getCity(),
	//		required:false
	//});

	$(".upload-avatar a").magnificPopup({
		items: {
			src: "#choice_avatar",
			type: "inline",
			midClick: true
		}
	});

	$(".avatarlist li a").click(function() {
		$(".avatarlist li a.on").removeClass('on');
		$(this).addClass('on');
	});

	$(".choose-avatar").click(function() {
		var current_obj = $(".avatarlist li a.on").children('img');
		var current_val = current_obj.attr('attr-id');
		if(current_val) {
			$("#avatar_url").attr('src', current_obj.attr('src'));
			$("#avatar_val").val(current_val);
		}

		$.magnificPopup.close();
	});

});

function doSaveProfile() {
	if(isProccess) return false;
	isProccess = true;
	//changeSaveState(1);
	var nick_name = $("#nick_name").val();
	var home_page = $("#home_page").val();
	var country = $("#country").val();
	var province = $("#province").val();
	var city = $("#city").val();
	var intruduction = $("#intruduction").val();
	var avatar_val  = $("#avatar_val").val();
	changeVerifyBtnState("#saveProfile", false, true);
	$.post('/user/edit', {nick_name:nick_name, home_page:home_page,
		country:country, province:province, city:city, intruduction:intruduction, avatar_url:avatar_val}, function(data) {
			isProccess = false;
			if(data.code == 0) {
				///changeSaveState(3);
				reloadPage();
			} else {
				changeVerifyBtnState("#saveProfile", true, true);
				//changeSaveState(2, data.msg);
			}
	}, 'json');
}

function reloadPage() {
	location.href = '/user/profile';
}

function changeSaveState(doActionState, msg) {
	if(doActionState == 1){ //正在保存中
		$("#saveProfile").removeClass('red green').addClass('yellow').html('<i class="icon-loading"></i>正在保存');
	} else if(doActionState == 2) { //保存出错
		$("#saveProfile").removeClass('yellow green').addClass('red');
		$("#saveProfile").html(msg);
	} else if(doActionState == 3) { //保存成功
		$("#saveProfile").removeClass('yellow red').addClass('green');
		$("#saveProfile").html('<i class="icon-yes"></i>');
	}
}

function validateEditProfileForm() {
	$("#editProfileForm").validate({
		'errorClass': 'tips',
		'errorElement': 'div',
		'rules': {
			'nick_name': {
				required: true,
				rangelength: [2,12],
			},
			'home_page':  {
				'rangelength': [3,20],
				'checkHomePage': true
			},
			'intruduction': {
				rangelength: [10,200],
			}
		},
		'messages': {
			'nick_name': {
				required: '请输入昵称',
				rangelength: '昵称长度为2~12位字符'
			},
			'home_page': {
				'rangelength': '个性域名长度为3~20个字符',
				'checkHomePage': '个性域名只能包含字母、数字和下划线'
			},
			'intruduction': {
				'rangelength': '个人简介长度为10~200个字符'
			}
		},
		highlight: function(element, errorClass) {
			$(element).removeClass(errorClass);
		},
		submitHandler: function (form) {
			doSaveProfile();
		}
	});
}