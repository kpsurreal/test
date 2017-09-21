$(function(){
    window.onbeforeunload = function () {
        if (0 < $('.download-loading').length && !$('.download-loading').hasClass('unvisible')) {
            // $.gmfConfirm('确认终止下载！','<p style="font-weight:bold;color:red;width:280px;">终止下载后无法恢复，是否确认？</p>',2).ok(function(){
            //     $('.download-loading').addClass('unvisible');
            // }).cancel(function(){
            //     return;
            // });
            return '文件下载中，是否离开该页面？';
        }else{

        }
    };

    function intervalAjax(url, text){
        setTimeout(function(){
            $.ajax({
                type: 'get',
                url: url + '&timestamp=' + new Date().getTime()
            }).then(function(res){
                if(res.code==0){
                    if (true == res.data.work_status) {
                        //是否有unvisible样式作为判断依据，用户终止下载时也是以此判断。
                        if(!$('.download-loading').hasClass('unvisible')){
                            $('.download-loading').addClass('unvisible').removeClass('loading');
                            $('#download-link').attr('href', res.data.download_path);
                            document.getElementById('download-link').click();
                            $('#download-link').attr('href', '');
                        }
                    }else{
                        intervalAjax(url, text);//继续轮询
                    }
                }else{
                    $.failNotice(url,res);
                    $('.download-loading').addClass('unvisible').removeClass('loading');
                }
            }).fail(function(){
                $.failNotice.bind(url);
                $('.download-loading').addClass('unvisible').removeClass('loading');
            });
        },1000);
    }

    //用户点击按钮，页面告知后台，准备pdf/excel文件，随后开始每隔1秒轮询，直到成功，弹窗给用户下载地址。
    $('.download-excel, .download-pdf').on('click', function(){
        var url = $(this).attr('data-href');
        var text = $(this).attr('data-text');
        var queryStart = $('#query-start').val();
        if (0 < $('#query-end').length) {
            var queryEnd = $('#query-end').val();
        }else{
            var queryEnd = queryStart;
        }
        url += '&start=' + queryStart + '&end=' + queryEnd;

        $('.download-loading').addClass('loading').removeClass('unvisible');

        $.ajax({
            type: 'get',
            url: url
        }).then(function(res){
            if(res.code==0){
                intervalAjax(url+'&for_wkhtmltopdf=check_status&work_token=' + res.data.work_token, text);
            }else{
                $.failNotice(url,res);
                $('.download-loading').addClass('unvisible').removeClass('loading');
            }
        }).fail(function(){
            $.failNotice.bind(url);
            $('.download-loading').addClass('unvisible').removeClass('loading');
        });
    });
})
