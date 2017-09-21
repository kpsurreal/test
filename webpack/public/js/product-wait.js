/**
 * Created by buty on 15/8/14.
 */
$(function() {
    $.validator.addMethod('checkWhyCancel', function(value, element) {
        var res = true;
        if( ($("input[name=why_cancel]:checked").val() == 3) && !element.value) {
            res = false;
        }

        return res;
    });
    $("#CancelForm").validate({
        'errorClass': 'tips',
        'errorElement': 'div',
        'rules': {
            'why_cancel': {
                'required': true
            },
            'why_cancel_txt':  {
                'checkWhyCancel': true
            }
        },
        'messages': {
            'why_cancel': {
                'required': '请选择撤销原因'
            },
            'why_cancel_txt': {
                'checkWhyCancel': '撤销原因不能为空'
            }
        },
        highlight: function(element, errorClass) {
            $(element).removeClass(errorClass);
        },
        //errorLabelContainer: "#messageBox",
        submitHandler: function (form) {
            var why_cancel     = $("input[name=why_cancel]:checked").val();
            var why_cancel_txt = $("#why_cancel_txt").val();
            var product_id     = $("#product_id").val();
            $.post("/product/cancel", {product_id:product_id, why_cancel:why_cancel, why_cancel_txt:why_cancel_txt}, function(data) {
                if(data.code == 0) {
                    location.href = '/trader/my_run';
                } else {
                    alert(data.msg);
                }
            }, 'json');
        }
    });
    $(".btn-cancle").magnificPopup({
        items: {
            src: ".mod-popup",
            type: "inline",
            midClick: true
        }
    });
});