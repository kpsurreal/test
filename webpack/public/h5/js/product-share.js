/**
 * Created by buty on 15/8/14.
 */
var client = '';
$(function () {
    $("#btn-share").magnificPopup({
        items: {
            src: "#popup-share",
            type: "inline",
            midClick: true
        },
        disableOn: function(){
          if( /MicroMessenger/.test(window.navigator.userAgent) ){
            window._link = share_url;
            $('#popup-weixin-share').show();
            return false;
          }else{
            return true;
          }
        },
        callbacks: {
            beforeOpen: function(){
              $('html').addClass('share-state');
            },
            open: function() {
                createShareUrl();
            },
            afterClose: function(){
              $('html').removeClass('share-state');
            }
        }
    });
});

function createShareUrl() {
    $("#share-qrcode").attr('src', '/qr?url=' + encodeURIComponent(share_url));
    $("#share-url").text(share_url);
}
