/**
 * Created by buty on 15/9/11.
 */

/**
 * Created by buty on 15/8/21.
 */
$(function() {
    switchWithdraw();
    $("#requestBindCard").click(function() {
        operateTips('请先充值到港股帐户充值', '/cashier/deposit/foreign', '申请提现', '完成', true);
    });
});

function switchWithdraw() {
    $.get('/user/profile', {format: 'json'}, function(data) {
        if(data.code != 0) return ;
        if(data.data.check_real_name_pass == 1 && data.data.check_real_name_pass == 1) {
            changeHrefWithdraw();//开放提现连接点击
        } else {

            //弹出框
            $(".withDraw").click(function (e) {
                location.href = '/novice-task';
            //    operateTips('提现需要完成实名认证，设置交易密码，可前去新手任务完成设置', '/novice-task', '提现需要完成步骤', '前去新手任务', true);
            });
        }
    }, 'json');
}

function changeHrefWithdraw() {
    $(".withDraw").each(function() {
        var rel_href = $(this).attr('rel-href');
        $(this).attr('href', rel_href);
    });
}
