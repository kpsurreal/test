var requireForm;

$(".market-select").click(function() {
    $(".market-select").removeClass('checked');
    $(this).addClass('checked');

   fillDefaultData($(this).attr('rel-data'));
});
$(".collect-time-select").click(function() {
    $(".collect-time-select").removeClass('checked');
    $(this).addClass('checked');
    calculateDate();
});
$(".lock-time-select").click(function() {
    $(".lock-time-select").removeClass('checked');
    $(this).addClass('checked');
    calculateDate();
});



function calculateDate() {
    var begin_fundraising_time = $("#begin_fundraising_time").val();

    var current_date = new Date();
    current_date.setTime(Date.parse(begin_fundraising_time.replace("-", "/").replace("-", "/")));
    c_d = parseInt(current_date.getDate());

    var collect_time_select = parseInt(getCheckedValue('collect-time-select'));
    current_date.setDate(collect_time_select + c_d);

    var end_fundraising_time = parseToDate(current_date);

    var start_lock_date = current_date.setDate(collect_time_select + c_d + 1);
    var start_time = parseToDate(current_date);

    var lock_time_select =parseInt(getCheckedValue('lock-time-select'));
    c_m = parseInt(current_date.getMonth());
    stop_lock_date = current_date.setMonth(c_m + lock_time_select);
    var stop_time = parseToDate(current_date);

    c_d = parseInt(current_date.getDate());
    var redeem_time_date = current_date.setDate(c_d + 1);
    var redeem_time = parseToDate(current_date);

    $("#collect_date").html(begin_fundraising_time + '~' + end_fundraising_time);
    $("#lock_date").html(start_time);
    $("#redeem_date").html(redeem_time);
}

function parseToDate(date_time){
    return date_time.getFullYear() + '-' + (date_time.getMonth() + 1) + '-' + date_time.getDate();
}

function checkeParams(uri_data) {
    if(!uri_data.name) {
        alert('名称不能为空');
        return false;
    }
    if(!uri_data.invest_tactics) {
        alert('策略介绍不能为空');
        return false;
    }
    if(!uri_data.target_capital) {
        alert('预期规模不能为空');
        return false;
    }
    if(!uri_data.begin_fundraising_time) {
        alert('募集开始不能为空');
        return false;
    }

    return true;
}


function getEndFundraisingtTime(begin_fundraising_time, collect_time_select){
    return begin_fundraising_time + (collect_time_select * 86400);
}

function getStopTime(start_time, lock_time_select) {
    return start_time + (lock_time_select * 30 * 86400);
}

function getCheckedValue(select_class) {
    data = '';
    $("."+select_class).each(function() {
        if($(this).hasClass('checked')) {
            data = $(this).attr('rel-data');
        }
    });
    return data;
}

function fillDefaultData(market_type) {
    slider = $("#target_capital_sel").data("ionRangeSlider");
    slider && slider.destroy();

    min = 1100000;
    max = 5100000;

    if(market_type == 2){
        min = 100000;
        max = 500000;
    }

    $("#target_capital_sel").ionRangeSlider({
        grid: true,
        min: min,
        max: max,
        from: $("#target_capital_sel").val(),
        step: 100000,
        prettify_enabled: true,
        prettify: function (num) {
            return (num / 10000) + '万';
        },
        onStart: function (data) {
            $('#target_capital_sel_text').html((data.from / 10000) + '万');
        },
        onChange : function (data) {
            $('#target_capital_sel_text').html((data.from / 10000) + '万');
        }
    });

    switch(market_type) {
        case 1: case '1':
            $('.money_type').html('人民币');
            $('p[gmf-action="hk"]').hide(0);
            $('p[gmf-action="cn"]').show(0);
        break;
        case 2: case '2':
            $('.money_type').html('港币');
            $('p[gmf-action="cn"]').hide(0);
            $('p[gmf-action="hk"]').show(0);
        break;
    }

    $.get('/product/apply-qualify', {}, function(data) {
        if(data.code == 0) {
            data = data.data[market_type];
            $("#stop_loss").val(data['stop_loss']*100);
            $("#ipt_stop_loss").val(data['stop_loss']);

            $("#concentration_ratio").val(data['concentration_ratio']*100);
            $("#ipt_concentration_ratio").val(data['concentration_ratio']);

            $("#profit_sharing_ratio").val(data['profit_sharing_ratio']*100);
            $("#ipt_profit_sharing_ratio").val(data['profit_sharing_ratio']);

            $("#profit_sharing_threshhold").val(data['profit_sharing_threshhold']*100);
            $("#ipt_profit_sharing_threshhold").val(data['profit_sharing_threshhold']);
        } else {
            alert(data.msg);
        }
    }, 'json');
}
$().ready(function() {

    $('div[gmf-act="market-select"]').each(function(k, v){
        if($(v).hasClass('checked'))
            fillDefaultData($(v).attr('rel-data'));
    });

    if($("#nextStep").attr('class')) {
        validateForm('createProduct');
    } else if($("#reapply").attr('class')) {
        validateForm('updateProduct');
    }
    // $('#nextStep').click(function(){ validateForm('createProduct'); });
    $("#begin_fundraising_time").datetimepicker({
        timepicker:false,
        lang:'ch',
        format:'Y-m-d',
        onChangeDateTime: function(date) {
            calculateDate();
        },
        scrollMonth:false
    });
    calculateDate();
});

function validateForm(form_id) {
    $("#" + form_id).validate({
        'errorClass': 'tips',
        'errorElement': 'div',
        rules: {
            'name': {
                'required': true,
                'minlength': 3,
                'maxlength': 15
            },
            'invest_tactics': {
                'required': true,
                'minlength': 3,
                'maxlength': 300
            },
            'target_capital': {
                'required': true,
                'number': true,
                'range': [1000, 100000000]
            },
            'begin_fundraising_time': {
                'required': true,
                'date': true
            }
        },
        messages: {
            'name': {
                'required': '策略名称不能为空',
                'minlength': '策略名称至少为3个字',
                'maxlength': '策略名称最多15个字',
            },
            'invest_tactics': {
                'required': '策略介绍不能为空',
                'minlength': '策略介绍至少为3个字',
                'maxlength': '策略介绍最多300个字',
            },
            'target_capital': {
                'required': '预期规模不能为空',
                'number': '预期规模必须为数字',
                'range': '预期规模范围1000-1亿'
            },
            'begin_fundraising_time': {
                'required': '投资开始日期不能为空',
                'date': '请输入日期格式'
            }

        },
        //showErrors: function(errorMap, errorList) {
        //    //if(this.checkForm()) {
        //    //    $(".button").removeClass('disabled');
        //    //} else {
        //    //    $(".button").removeClass('disabled').addClass('disabled');
        //    //}
        //    //checkSubmitButtonState();
        //    this.defaultShowErrors();
        //},
        //success: function(error) {
        //    alert(checkSubmitButtonState());
        //    alert(error.attr('id'));
        //},
        highlight: function(element, errorClass) {
            $(element).removeClass(errorClass);
        },
        submitHandler: function (form) {
            if(form.id == 'createProduct') {
                $(form).find('#ipt_market').val(getCheckedValue('market-select'));
                $(form).append($('<input type="hidden">').attr('name', 'market').val(getCheckedValue('market-select')));

                var begin_fundraising_time = $("#begin_fundraising_time").val();
                begin_fundraising_time = Date.parse(begin_fundraising_time.replace("-", "/").replace("-", "/")  + ' 00:00:00 GMT+0800') / 1000;
                $(form).find('#ipt_begin_fundraising_time').val(begin_fundraising_time);

                var end_fundraising_time = getEndFundraisingtTime(begin_fundraising_time, getCheckedValue('collect-time-select'));
                $(form).find('#ipt_end_fundraising_time').val(end_fundraising_time);

                var start_time = end_fundraising_time + 86400;
                $(form).find('#ipt_start_time').val(start_time);

                var stop_time = getStopTime(start_time, getCheckedValue('lock-time-select'));
                $(form).find('#ipt_stop_time').val(stop_time);

                return true;
                // $(form).submit();
                // goNextPage();
            }
            // else if(form.id == 'updateProduct') {
            //     doEditPage();
            // }
        }
    });
}

// function doEditPage() {
//     var market = getCheckedValue('market-select');
//     var name = $("#name").val();
//     var invest_tactics = $("#invest_tactics").val();
//     var target_capital = $("#target_capital").val();
//     var begin_fundraising_time = $("#begin_fundraising_time").val();

//     begin_fundraising_time = Date.parse(begin_fundraising_time + ' 00:00:00 GMT+0800') / 1000;
//     var collect_time_select = getCheckedValue('collect-time-select');
//     end_fundraising_time = getEndFundraisingtTime(begin_fundraising_time, collect_time_select);
//     start_time = end_fundraising_time + 86400;
//     var lock_time_select = getCheckedValue('lock-time-select');
//     stop_time = getStopTime(start_time, lock_time_select);

//     var product_id = $("#product_id").val();

//     $.post('/product/edit', {market:market, name:name, invest_tactics:invest_tactics, target_capital:target_capital, begin_fundraising_time:begin_fundraising_time,
//     	end_fundraising_time:end_fundraising_time, start_time:start_time, stop_time:stop_time, product_id:product_id}, function(data){
//     		if(data.code == 0) {
//     			location.href = "/product/detail?product_id=" + product_id;
// 			} else {
// 				alert(data.msg);
// 			}
//     }, 'json');
// }

// function goNextPage() {
//     var market = getCheckedValue('market-select');
//     var name = $("#name").val();
//     var invest_tactics = $("#invest_tactics").val();
//     var target_capital = $("#target_capital").val();
//     var begin_fundraising_time = $("#begin_fundraising_time").val();

//     begin_fundraising_time = Date.parse(begin_fundraising_time + ' 00:00:00 GMT+0800') / 1000;
//     var collect_time_select = getCheckedValue('collect-time-select');
//     end_fundraising_time = getEndFundraisingtTime(begin_fundraising_time, collect_time_select);
//     start_time = end_fundraising_time + 86400;
//     var lock_time_select = getCheckedValue('lock-time-select');
//     stop_time = getStopTime(start_time, lock_time_select);

//     uri_url = "/product/pre-apply";
//     var uri_data = {market:market, name:name, invest_tactics:invest_tactics, target_capital:target_capital, begin_fundraising_time:begin_fundraising_time,
//         end_fundraising_time:end_fundraising_time, start_time:start_time, stop_time:stop_time};

//     if(!checkeParams(uri_data)) {
//         return false;
//     }
//     var uri_str = ''; colm = '?';
//     for (var i in uri_data) {
//         uri_str += colm + i + '=' + encodeURIComponent(uri_data[i]);
//         colm = '&';
//     };
//     uri_url += uri_str;

//     location.href = uri_url;
// }
