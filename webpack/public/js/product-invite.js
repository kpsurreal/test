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
        callbacks: {
            open: function() {
                createInviteUrl();
                // initCopyEvent();
            }
        }
    });

});

function createInviteUrl() {
    var product_id = $("#product_id").val();

    $("#invite-qrcode").attr('src', '/qr?url=' + encodeURIComponent(share_url));
    $("#invite-url").val(share_url);
}

// function initCopyEvent() {
//     if(client) return true;
//     client = new ZeroClipboard( document.getElementById("invite-url") );
//
//     client.on('ready', function(readyEvent) {
//         client.on('aftercopy', function(event) {
//             alert('复制链接成功');
//         });
//     });
//     client.on('error', function(e) {
//         $("#invite-url").unbind('click').click(function() {
//             alert('浏览器没有安装flash插件, 无法支持复制，请手动选择复制');
//         });
//     });
// }
