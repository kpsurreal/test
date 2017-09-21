$(function(){
    !window.console && (window.console = function(){
        var noop = function(){};
        return {log:noop,dir:noop,warn:noop,error:noop}
    }());

    var warning_dom = $(multiline(function(){/*!@preserve
        <div>
            <style>
                .browser-upgrade-warning a{text-decoration:underline;color:#19B955;}
            </style>
            <div class="browser-upgrade-warning" style="display:table;vertical-align:top;position:fixed;bottom:0;left:0;z-index:2147483647;width:100%;background:#ffcc00;overflow:hidden;color:red;">
                <div style="display:table-cell;width=225px;vertical-align:top;">
                    <img width="225" height="225" />
                </div>
                <div style="display:table-cell;vertical-align:top;">
                    <h1 style="margin-top:10px;">请注意：Windows 对 Internet Explorer 早期版本的支持已经结束</h1>
                    <h3>
                        自 2016 年 1 月 12 日起，Microsoft 不再为 IE 11 以下版本提供相应支持和更新。
                        没有关键的浏览器安全更新，您的 PC 可能易受有害病毒、间谍软件和其他恶意软件的攻击，它们可以窃取或损害您的业务数据和信息。
                    </h3>
                    <div style="color:#19B955;">
                        <h1>使用更安全的浏览器</h1>
                        <h3>推荐使用以下浏览器的最新版本。如果你的电脑已有以下浏览器的最新版本则直接使用该浏览器访问即可。</h3>
                        <h1>
                            <a href="https://www.so.com/s?q=360安全浏览器" target="_blank">360安全浏览器</a>
                            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                            <a href="https://www.baidu.com/s?wd=QQ浏览器" target="_blank">QQ浏览器</a>
                            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                            <a href="https://www.baidu.com/s?wd=搜狗高速浏览器" target="_blank">搜狗高速浏览器</a>
                            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                            <a href="https://www.baidu.com/s?wd=谷歌浏览器" target="_blank">谷歌浏览器</a>
                            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                        </h1>
                    </div>
                </div>
            </div>
        </div>
    */console.log()}))

    warning_dom.find('img').attr('src',(window.REQUEST_PREFIX||'')+'/images/warning.png')

    $('body').append(warning_dom);

    function multiline(fn){
        //https://github.com/sindresorhus/multiline
        var reCommentContents = /\/\*!?(?:\@preserve)?[ \t]*(?:\r\n|\n)([\s\S]*?)(?:\r\n|\n)[ \t]*\*\//;
        if(typeof fn !== 'function'){throw new TypeError('Expected a function');}
        var match = reCommentContents.exec(fn.toString());
        if(!match){throw new TypeError('Multiline comment missing.');}
        return match[1];
    }
});
