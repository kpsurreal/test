/**
 * Created by butyss on 15/8/28.
 */
//环境变量定义
var GMF_ENV = {
    isMobile: /Mobile/.test(window.navigator.userAgent),
    isSogou: /SE.*MetaSr/.test(window.navigator.userAgent)
};

!function(){
    var gmfClientTask = [];
    window.gmfClientOnReady = gmfClientOnReady;

    function gmfClientOnReady(func){
        GMF_ENV.isClient ? func() : gmfClientTask.push(func);
    }

    //客户端环境判断，ios 时间有延迟，轮询判断，成功/2.5s中断
    var start = new Date().valueOf();
    var rollPolingTimer = setInterval(clientEnvAnalysis,250);
    function clientEnvAnalysis(){
        GMF_ENV.isClient = Object.hasOwnProperty.call(window.common || window,'nativeopen');
        if(GMF_ENV.isClient){
            clearInterval(rollPolingTimer);
            gmfClientTask.forEach(function(func){
                func();
            });
        }
        (new Date().valueOf()-start)>2500 && clearInterval(rollPolingTimer);
    }
}();

$(function() {
    if($.validator)  {
        $.validator.addMethod('checkphone', function(value, element) {
            return checkCellphoneValidate(value);
        });
        $.validator.addMethod("isIdCardNo", function (value, element) {
            return this.optional(element) || isIdCardNo(value);
        }, "请正确输入您的身份证号码");
    }

    //set_invite_id 设置预订邀请 id
    if($.cookie){
        //setter
        if( typeof _search_get('set_invite_id') !== 'undefined' ){
            $.cookie('set_invite_id', _search_get('set_invite_id'), {path:'/'} );
        }
        //getter
        if( $.cookie('set_invite_id') && !$('input#invited_id').val() ){
            $('input#invited_id').val( $.cookie('set_invite_id') );
        }
    }

    //popup 里面如果没有输入框，禁用触摸滑动
    $('html').on('touchmove','.mfp-wrap',function(){
        if( $(this).find('input').length === 0 ){
            return false;
        }
    });

    //Sogou 浏览器防止自动填充处理
    //自动填充会触发 change 事件
    //检测自动填充缓冲期内 change 事件，超过缓冲时间自动忽略
    var autocompletePeriod = 800;
    var startTime = new Date().valueOf();
    if( GMF_ENV.isSogou ){
        $('input[autocomplete="off"]').one('change',function(){
            new Date().valueOf()-startTime < autocompletePeriod && $(this).val('');
        });
    }

    //客户端独立逻辑
    window.gmfClientOnReady(function(){
      $('[hideShareBtn]').length && (window.common || window).nativeopen('cmd=hideShareBtn');
      $('body').on('click','a',function(){
        var params = {};
        this.search.replace(/^\?/,'').split('&').forEach(function(x){
            params[ x.replace(/\=.*/,'') ] = decodeURIComponent( x.replace(/.*\=/,'') );
        });

        if( /^\/trader\//.test(this.pathname) ){
          (window.common || window).nativeopen("cmd=trader&id=" + this.pathname.split('/')[2]);
          return false;
        }

        if( /^\/product\/detail/.test(this.pathname) ){
          (window.common || window).nativeopen("cmd=portfolio&id=" + params['product_id']);
          return false;
        }

        if( $(this).is('[native-target=_blank]') ){
            var encodeUrl = encodeURIComponent( $(this).attr('href') );
            (window.common || window).nativeopen( 'cmd=web&url=' + encodeUrl );
            return false;
        }
      });
    });

    //把全局状态读取到 html，方便样式调用
    gmfClientOnReady(function(){$('html').addClass('gmfclient');});
    $('html').addClass(/mobile/i.test(navigator.userAgent) ? 'mobile' : 'pc');
    $('html').addClass(/micromessenger/i.test(navigator.userAgent) ? 'weixin' : '');
    $('html').addClass('path' + location.pathname.replace(/\//g,'-'));
    $(window).on('load hashchange popstate',function(){
        var prehash = $('html').attr('hash') || '';
        var newhash = location.hash.replace(/^\#/,'');
        $('html').removeClass('hash_'+prehash).addClass('hash_'+newhash).attr('hash',newhash);
    });
});

function changeVerifyBtnState(dom_id, success, tips) {
    var btn_text = $(dom_id).html();
    var btn_loading = '<i class="icon-loading" id="icon-loading-id"></i>';
    if(success) {
        if(tips) {
            //if($(".icon-loading").length) {
            //    $(dom_id).find(".icon-loading").remove();
            //}
            btn_text = submitButtonText(btn_text, false);
            $(dom_id).html(btn_text);
            //$(dom_id).html(btn_text.substr(0, btn_text.length - '(提交中...)'.length));
        }
        $(dom_id).removeAttr('disabled');
    } else {
        if(tips) {
            btn_text = submitButtonText(btn_text, true);
            $(dom_id).html(btn_text);
            //$(dom_id).html(btn_loading + btn_text + '(提交中...)');
            //$(dom_id).prepend(btn_loading);
        }
        $(dom_id).attr('disabled', true);
    }
    if(!tips)
        changeBtnState(dom_id, success);
}

function submitButtonText(btn_text, is_submitting) {
    var btn_loading = '<i class="icon-loading" id="icon-loading-id"></i>';
    if(is_submitting) {
        btn_text = btn_loading + '正在' + btn_text + '...';
    } else {
        btn_text = btn_text.substring( (btn_loading + '正在').length);
        btn_text = btn_text.substring(0, btn_text.length - '...'.length);
    }

    return btn_text;
}


function changeBtnState(dom_id, success) {
    if(success) {
        $(dom_id).removeClass('yellow').addClass('yellow');
    } else {
        $(dom_id).removeClass('yellow');
    }
}

function checkCellphoneValidate(cellphone) {
    return cellphone.match(/^(((1[3|4|5|7|8]{1}[0-9]{1}))+\d{8})$/);
}

function operateTips(content, url, title, button_text, close_ac) {
    if(title) {
        $("#tip_title").html(title);
    }
    $("#tip_content").html(content);
    if(button_text) {
        $("#tip_button").html(button_text);
    }
    $("#tip_button").click(function() {
        $.magnificPopup.close();
        if(url) {
            location.href = url;
        }
    });
    $.magnificPopup.close();
    $.magnificPopup.open({
        items: {
            src: ".popup-common"
        },
        type: 'inline',
        callbacks: {
            beforeOpen: function(){
                GMF_ENV.isMobile && $('.body').hide();
            },
            close: function() {
                if(!close_ac) {
                    if(url) {
                        location.href = url;
                    }
                }

                GMF_ENV.isMobile && $('.body').show();
            }
        }
    });
}

//增加身份证验证
function isIdCardNo(num) {
    var factorArr = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1);
    var parityBit = new Array("1", "0", "X", "9", "8", "7", "6", "5", "4", "3", "2");
    var varArray = new Array();
    var intValue;
    var lngProduct = 0;
    var intCheckDigit;
    var intStrLen = num.length;
    var idNumber = num;
    // initialize
    if ((intStrLen != 15) && (intStrLen != 18)) {
        return false;
    }
    // check and set value
    for (i = 0; i < intStrLen; i++) {
        varArray[i] = idNumber.charAt(i);
        if ((varArray[i] < '0' || varArray[i] > '9') && (i != 17)) {
            return false;
        } else if (i < 17) {
            varArray[i] = varArray[i] * factorArr[i];
        }
    }

    if (intStrLen == 18) {
        //check date
        var date8 = idNumber.substring(6, 14);
        if (isDate8(date8) == false) {
            return false;
        }
        // calculate the sum of the products
        for (i = 0; i < 17; i++) {
            lngProduct = lngProduct + varArray[i];
        }
        // calculate the check digit
        intCheckDigit = parityBit[lngProduct % 11];
        // check last digit
        if (varArray[17] != intCheckDigit) {
            return false;
        }
    }
    else {        //length is 15
        //check date
        var date6 = idNumber.substring(6, 12);
        if (isDate6(date6) == false) {
            return false;
        }
    }
    return true;
}
function isDate6(sDate) {
    if (!/^[0-9]{6}$/.test(sDate)) {
        return false;
    }
    var year, month, day;
    year = sDate.substring(0, 4);
    month = sDate.substring(4, 6);
    if (year < 1700 || year > 2500) return false
    if (month < 1 || month > 12) return false
    return true
}

function isDate8(sDate) {
    if (!/^[0-9]{8}$/.test(sDate)) {
        return false;
    }
    var year, month, day;
    year = sDate.substring(0, 4);
    month = sDate.substring(4, 6);
    day = sDate.substring(6, 8);
    var iaMonthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    if (year < 1700 || year > 2500) return false
    if (((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0)) iaMonthDays[1] = 29;
    if (month < 1 || month > 12) return false
    if (day < 1 || day > iaMonthDays[month - 1]) return false
    return true
}

function showMsg(currentForm, msg) {
    if($(currentForm).find('.error_hint').length) {
        var error_msg = $(currentForm).find('.error_hint');
        $(currentForm).find('.error_hint').html(msg);
    } else {
        var error_msg = $("<p class='error_hint fnt_red'>"+msg+"</p>");
        $(currentForm).find(':submit').parent().prepend(error_msg);
    }
    //error_msg.fadeIn();
    //error_msg.delay(3000).fadeOut();

}

function handleDropSelect(dom_id, default_str) {
    var  select_plugin = $(dom_id).selectize();

    select_plugin[0].selectize.setValue(default_str);
}

// 获取 hash 参数：
// location.href = ...?market=1
// _search_get('market'); //output:1
function _search_get(name){
    var params = {};
    location.search.replace(/^\?/,'').split('&').forEach(function(x){
        params[ x.replace(/\=.*/,'') ] = decodeURIComponent( x.replace(/.*\=/,'') );
    });

    _search_get = function(name){
        return params[name];
    };

    return _search_get(name);
}

// 获取 hash 参数：
// location.href = ...#market=1
// _hash_get('market'); //output:1
function _hash_get(name){
    var params = {};
    location.hash.replace(/^\#/,'').split('&').forEach(function(x){
        params[ x.replace(/\=.*/,'') ] = decodeURIComponent( x.replace(/.*\=/,'') );
    });
    return params[name];
}
