/**
 * Created by buty on 15/8/21.
 */


$(function() {
    $("#savePartial").click(function() {
        var stock_display_partial = $(".favor li.on").attr('attr-data');
        changeVerifyBtnState("#savePartial", false, true);

        $.post('/partial/stock', {stock_display_partial:stock_display_partial}, function(data) {
            if(data.code == 0) {
                operateTips('股票偏好设置成功', '/partial/stock');
            } else {
                changeVerifyBtnState("#savePartial", true, true);
                alert(data.msg);
            }
        }, 'json');
    });

    $(".favor li").click(function() {
        $(".favor li").removeClass('on');
        $(this).addClass('on');
    });
});

