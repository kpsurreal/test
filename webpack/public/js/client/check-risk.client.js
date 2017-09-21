/**
 * Created by buty on 15/9/9.
 * Update by rango on 15/10/8.
 */
$(function(){

    // click-active 指令，排他性地为目标DOM元素添加 active 属性
    // 必须加上，表单验证的依赖项目
    $('html').on('click','#checkRiskForm label',function(){
        $(this).addClass('active').siblings().removeClass('active');
        $(this).closest('li').removeClass('no-value').find('.no-value-tip').remove();
    });

    validateCheckRiskForm('/novice-task');

    function validateCheckRiskForm(origin_url) {
        $('#checkRiskForm').submit(function(){
            if( formIsFull() ){
                doCheckRiskForm(origin_url);
            }else{
                $('.no-value')[0].scrollIntoView();
            }

            return false;
        });

        function formIsFull(){
            var result = true;
            $('#checkRiskForm > ol > li').each(function(){
                if( $(this).find('label.active').length === 0 ){
                    result = result && false;
                    $(this).find('.no-value-tip').length === 0 &&  $(this).addClass('no-value').prepend(
                        $('<div class="no-value-tip">请填写此项信息</div>')
                    );
                }
            });
            return result;
        }
    }

    function doCheckRiskForm(origin_url) {
        var select_items = [];
        $(".risk_value:checked").each(function() {
            var name = $(this).attr('name');
            select_items.push($(this).val());
        });
        changeVerifyBtnState("#doCheckRisk", false, true);
        $.post('/risk-task-client', {select_items: select_items}, function(data) {
            if(data.code == 0) {
                $("#risk_divide_msg").html(data.data.divide_msg.level_msg);
                $("#risk_divide_desc").html(data.data.divide_msg.level_desc);
                $("#risk_block").hide();
                $(".final").show();
                $(".bg_grayl > h3.container").addClass("fnt_gree");
                $(".bg_grayl > h3.container > .right").html('');
                window.scrollTo(0,0);
                gmfriskTestResult(data.data.score, data.data.divide_msg.level_msg); //调用客户接口
            } else {
                changeVerifyBtnState("#doCheckRisk", true, true);
                showMsg( $("#checkRiskForm"), data.msg);
            }
        }, 'json');
    }
});
