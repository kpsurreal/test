//弹窗相关功能
$(function(){
    var gmfAlert = function(){
        var tpl = '<div class="gmf-alert" style="display:none;">\
                        <div class="alert-body">\
                            <h3 class="title"></h3>\
                            <div class="content"></div>\
                            <a class="link ui-btn ui-btn-block yellow" href="javascript:;"></a>\
                        </div>\
                    </div>';
        var popup = $(tpl);
        popup.on('touchmove',function(){return false;});
        popup.find('.alert-body').on('click',function(event){event.originalEvent.cancelBubble=true;})
        popup.on('click',function(){$(this).hide();})

        return function(params){
            for(var key in params) popup.find('.'+key).html(params[key]);
            popup.appendTo('body').show().find('[href]').attr('href',params.href);
        };
    }();

    window.showDownload = showDownload;
    window.showRules = showRules;

    function showDownload(){
        gmfAlert({
            title: '你已经注册操盘侠',
            content: '立即下载客户端，为你的分红乐加息',
            link: '下载客户端',
            href: $('.download-btn').attr('href')||'/download'
        });
    }

    function showRules(min,max){
        gmfAlert({
            title: '分红乐加息规则',
            content:   '<p>1 本活动分享到微信平台有效；</p>\
                        <p>2 分享分红乐加息页面给好友，每一个好友帮忙点加息，均可获得本期分红乐牛人牛股年化收益率随机加息（保底收益和预期最高收益同时加），最高可增加至'+min+'% ~ '+max+'%；</p>\
                        <p>3 同一期分红乐单个好友可帮忙加息1次，本期分红乐结束投资前加息有效；</p>\
                        <p>4 通过加息页面成功注册的新用户算你邀请的好友，好友投资你还可获得额外现金佣金。详细规则见佣金模块。</p>\
                        <p>5 操盘侠保留对以上规则进行解释的权利。</p>',
            link: '我知道了',
            href: 'javascript:$(\'.gmf-alert\').hide();'
        });
    }
});
