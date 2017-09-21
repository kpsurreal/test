/**
 * Created by buty on 15/8/14.
 */
var client = '';
$(function () {
    $(".btn-invite").magnificPopup({
        items: {
            src: ".popup-invite",
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

    $(".btn-share").magnificPopup({
        items: {
            src: ".popup-share",
            type: "inline",
            midClick: true
        },
        callbacks: {
            open: function() {
                // initCopyEvent();
            }
        }
    });

});

function createInviteUrl() {
    var product_id = $("#product_id").val();
    $.get('/invite/gen', {product_id:product_id}, function(data) {
        if(data.code == 0) {
            $(".invite-qrcode").attr('src', data.data['qr_code_url']);
            $(".invite-url").val(data.data['invite_page']);
        } else {
            alert(data.msg);
        }
    }, 'json');
}

// function initCopyEvent() {
//     if(client) return true;
//     client = new ZeroClipboard( document.getElementById("copy-url") );
//
//     client.on('ready', function(readyEvent) {
//         client.on('aftercopy', function(event) {
//             alert('复制链接成功');
//         });
//     });
//     client.on('error', function(e) {
//         $("#copy-url").unbind('click').click(function() {
//             alert('浏览器没有安装flash插件, 无法支持复制，请手动选择复制');
//         });
//     });
// }
