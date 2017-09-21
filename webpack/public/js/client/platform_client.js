/**
 * Created by buty on 15/10/10.
 */

var getNativeContext = function() {
    if(window.common != null) {
        //for Android
        return window.common;
    }
    //for Ios
    return window;
}

function gmfAppSystem(t, m) {
    var ctx = getNativeContext();
    ctx.nativeAlert(t,m);
}

function gmfRiskTestFinish() {
    var ctx = getNativeContext();
    ctx.riskTestFinish();
}

function gmfriskTestResult(score, msg) {
    var ctx = getNativeContext();
    ctx.riskTestResult(score, msg);
}

function gmfNativeOpen(url) {
    var ctx = getNativeContext();
    ctx.nativeopen && ctx.nativeopen(url);
}

function gmfGoHome(){
    gmfNativeOpen("cmd=invest");
}

function gmfShare(title,subtitle,url,image){
    var shareCmd = "cmd=share";
    shareCmd += "&title=" + title;
    shareCmd += "&subtitle=" + subtitle;
    shareCmd += "&url=" + escape(url);
    shareCmd += "&image=" + escape(image);
    gmfNativeOpen(shareCmd);
}

//jquery.directives

$(function(){

    $('[command]').on('click',function(){
      var command = $(this).attr('command');

      //广播消息，pc 端的 webview iframe 窗体要用到
      //pc 端具体页面 /bounty/profile
      window.parent.postMessage(command,'*');

      if(command==="gotoInviteByShare"){
          var title = $(this).attr('share-title');
          var subtitle = $(this).attr('share-subtitle');
          var url = $(this).attr('share-url');
          var image = $(this).attr('share-image');

          gmfShare(title,subtitle,url,image);
      }

      if(command==="gotoInvest"){
          gmfGoHome();
      }
    });

    // 下面代码迁移到 common.js
    // $('a[href^="/trader/"]').on('click',function(){
    //   var trader_id = $(this).attr('href').split('/')[2];
    //   gmfNativeOpen("cmd=trader&id=" + trader_id);
    //   return false;
    // });
});
