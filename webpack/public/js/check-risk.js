/**
 * Created by buty on 15/9/9.
 */

var checkRiskForm = '';
validateCheckRiskForm('/novice-task');
function validateCheckRiskForm(origin_url) {
    if(checkRiskForm) return true;
    checkRiskForm = $("#checkRiskForm").validate({
        'errorClass': 'tips',
        'errorElement': 'div',

        highlight: function(element, errorClass) {
            $(element).removeClass(errorClass);
        },
        submitHandler: function (form) {
            doCheckRiskForm(origin_url);
        }
    });
}

$(".risk_value").each(function() {
    $(this).removeAttr('checked');
    $(this).rules("add", { required: true, messages: { required: "请填写此项信息"}});
});

$(".check-box").click(function(){
    $(this).parent().children().removeClass('checked');
    $(this).addClass('checked');
    $(this).children('.risk_value').attr('checked', 'checked');
});
$("#checkRiskForm > ol li > label > i").each(function(){
     var num = $(this).html().toString();
     var l = num.length;
     if(l < 2){
        num = "0" + num;
        $(this).html(num);
     }
 });

function doCheckRiskForm(origin_url) {
    var select_items = [];
    $(".risk_value:checked").each(function() {
        var name = $(this).attr('name');
        select_items.push($(this).val());
    });
    changeVerifyBtnState("#doCheckRisk", false, true);
    $.post('/risk-task', {select_items: select_items}, function(data) {
        if(data.code == 0) {
            $("#risk_result").html(data.data.msg);
            $("#risk_block").hide();
            $(".final").show();
            $(".bg_grayl > h3.container").addClass("fnt_gree");
            $(".bg_grayl > h3.container > .right").html('');
        } else {
            changeVerifyBtnState("#doCheckRisk", true, true);
            showMsg(checkRiskForm.currentForm, data.msg);
        }
    }, 'json');
}
