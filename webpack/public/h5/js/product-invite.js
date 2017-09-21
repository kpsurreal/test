/**
 * Created by buty on 15/8/14.
 */
var client = '';
$(function () {
    $("#btn-invite").magnificPopup({
        items: {
            src: "#popup-invite",
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
              $('html').addClass('invite-state');
            },
            open: function() {
                createInviteUrl();
            },
            afterClose: function(){
              $('html').removeClass('invite-state');
            }
        }
    });
});

function createInviteUrl() {
    $("#invite-qrcode").attr('src', '/qr?url=' + encodeURIComponent(share_url));
    $("#invite-url").text(share_url);
}
