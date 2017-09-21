!(function(){
    var tipTimer;
    $.extend({
        failNotice: function(url,res,err_code){
            if(err_code){
                // $.omsAlert('网络异常：'+err_code+'_'+moment().format('DDHHmm'),false);
                $.omsAlert('网络异常',false);
                return;
            }
            $.omsAlert($.pullValue(res,'msg','请求异常'),false);
        },
        omsNiceSoundNotice: function(){
            //友好的声音提示，间隔至少两分钟
            var lastTimeStamp = localStorage.lastNiceSoundTimeStamp;
            if(!lastTimeStamp || (new Date().valueOf()-lastTimeStamp > 30*1000)){
                $.omsSoundNotice(6000);
                localStorage.lastNiceSoundTimeStamp = new Date().valueOf();
            }
        },
        omsSoundNotice: function(time,src){
            /**
            * author Alexander Manzyuk <admsev@gmail.com>
            * https://github.com/admsev/jquery-play-sound
            * Goldmf Local Modified by Rango@yuanoook.com
            **/
            var src = (window.REQUEST_PREFIX||'')+(src || '/sound/coin');
            var promise;

            if( $(window).data('oms_sound_lock') ){
                return;
            }else{
                $(window).data('oms_sound_lock',true);
            }

            var ding = $(
                '<audio id="dingding_audio" style="display:none;">\
                    <source class="mp3"/>\
                    <embed class="mp3" loop="false"/>\
                </audio>'
            ).appendTo('body').get(0);

            //reset && play
            $(ding).find('.mp3').attr('src',src+'.mp3');

            // ding start
            ding.addEventListener('loadedmetadata',function(){
              ding.currentTime = 0;
              promise = ding.play();
            });

            // ding stop
            $(ding).attr('dingpausetimer', setTimeout(function(){
                promise ? promise.then(clearSoundNotice) : setTimeout(clearSoundNotice,1000);
            },time || 1000));

            function clearSoundNotice(){
                ding.pause();
                $(ding).find('[src]').attr('src','').end().remove();
                $(ding).remove();
                $(window).data('oms_sound_lock',false);
            }
        },
        omsPrompt: function(){
            var tpl = $.multiline(function(){/*!@preserve
            <div class="wrap" style="position:fixed;width:100%;height:100%;display:table;text-align:center;background:rgba(0,0,0,.3);z-index:100001;top:0;left:0;">
                <div style="display:table-cell;vertical-align:middle;">
                    <div class="content" style="display:inline-block;background:#fff;border-radius:4px;padding:20px 30px;text-align:left;position:relative;box-shadow:0 5px 15px rgba(0,0,0,.5);">
                        <a class="cancel" href="javascript:;" style="position:absolute;top:5px;right:5px;">取消</a>
                        <h4 class="title" style="margin-bottom:20px;"></h4>
                        <form autocomplete="off">
                        </form>
                        <a class="ok" href="javascript:;" style="display:inline-block;width:100%;height:40px;line-height:40px;text-decoration:none;
                                                      border-radius:4px;background:#ffde00;color:#333;font-weight:900;text-align:center;margin-top:20px;">
                            确定
                        </a>
                    </div>
                </div>
            </div>
            */console.log()});

            var inputTpl = $.multiline(function(){/*!@preserve
            <label>
                <span></span> <input>
            </label>
            */console.log()});

            var promptPool = [];

            return function(title, inputs){
                var ok,cancel,result = {ok:function(func){ok=func;return result;},cancel:function(func){cancel=func;return result;}};

                clearPrompt();

                var dom = $('<div>').html(tpl);
                dom.find('.title').text(title);
                dom.find('form').html(
                    inputs.map(function(input){
                        var inputWrap = $('<div>');
                        inputWrap.html(inputTpl);
                        inputWrap.find('span').html( input.label||input.attrs.name );
                        var inputDom = inputWrap.find('input');

                        inputDom.val('').attr(input.attrs);

                        //防止带密码自动填充的问题
                        inputDom.is('[type=password]') && inputDom.attr('type','text').on('focus',dynamicChangeTypeToPasswordPreventAutoComplete);
                        function dynamicChangeTypeToPasswordPreventAutoComplete(){
                            !inputDom.is('[type=password]') && inputDom.attr('type','password').off('focus',dynamicChangeTypeToPasswordPreventAutoComplete);
                        }

                        return inputWrap;
                    })
                );

                dom.find('a').on('click',function(){
                    if( $(this).is('.ok') ){
                        var returnObj = {};
                        dom.find('form').serializeArray().forEach(function(item){
                            returnObj[ item['name'] ] = item['value'].trim();
                        });
                        ok && ok( returnObj );
                    }
                    if( $(this).is('.cancel') ){
                        cancel && cancel();
                    }

                    clearPrompt();
                });

                promptPool.push(dom);

                dom.appendTo($('body'));

                //firefox debug
                /Firefox/.test(navigator.userAgent) && dom.data(
                    'body-modal-open', $('body').is('.modal-open')
                ).data('body-modal-open') && $('body').removeClass('modal-open');

                dom.find('input').first().focus();

                return result;
            }

            function clearPrompt(){
                promptPool.forEach(function(item){
                    /Firefox/.test(navigator.userAgent) && $(item).data('body-modal-open') && $('body').addClass('modal-open');
                    $(item).remove();
                });
            }
        }(),
        omsAlertClear: function(){
            $('.oms-alert-clear-btn span').click();
        },
        omsAlertShutUp: function(){
            $('.oms-alert-msg-wrap').css('display','none');
        },
        omsAlertOpenUp: function(){
            $('.oms-alert-msg-wrap').css('display','block');
        },
        omsAlertDisable: function(){
            $('.oms-alert-msg-wrap').data('disabled',true);
        },
        omsAlertEnable: function(){
            $('.oms-alert-msg-wrap').data('disabled',false);
        },
        omsAlert: function(str){
            if (tipTimer) {
                clearTimeout(tipTimer);
                tipTimer = undefined;
            }
            $('#error_tip').html(str).removeClass('hide');
            tipTimer = setTimeout(function(){
                $('#error_tip').addClass('hide');
            }, 3 * 1000);
        }
        // omsAlert: function(){
        //     var msgWrap = $('<div class="oms-alert-msg-wrap">').css({
        //         position:'fixed',
        //         top:'0',
        //         zIndex:'10000',
        //         width:'30%',
        //         minWidth: '320px',
        //         margin:'auto',
        //         left:0,
        //         right:0,
        //         background:'#fff'
        //     }).appendTo($('body'));
        //
        //     var removeBtn = $('<div class="oms-alert-clear-btn"><span>×</span></div>').css({
        //         textAlign: 'right',
        //         display: 'none',
        //         fontSize: '1.5em'
        //     });
        //
        //     removeBtn.find('span').css({
        //         cursor: 'pointer',
        //         display: 'inline-block',
        //         padding: '0 10px'
        //     }).on('click',function(){
        //         msgWrap.find('.msg').remove();
        //         removeBtn.hide();
        //     });
        //
        //     removeBtn.appendTo(msgWrap);
        //
        //     msgWrap.hover(function(){
        //         removeBtn.slideDown();
        //     },function(){
        //         removeBtn.slideUp();
        //     });
        //
        //     return function(msg,goodNews,showTime,withSound,clear){
        //         if(msgWrap.data('disabled')){return;}
        //
        //         var options = {
        //             msg: msg || 'Jquery Alert, Created by rango@yuanoook.com !',
        //             goodNews: $.type(goodNews)=='boolean' ? goodNews : true,
        //             showTime: showTime,
        //             withSound: withSound || false,
        //             clear: clear || false
        //         };
        //
        //         if($.type(msg)=='object') for(var i in msg) options[i] = msg[i];
        //         options.showTime = options.showTime || (options.goodNews?1000:5000);
        //
        //         options.withSound && $.playSound && $.playSound(430);
        //         options.clear && msgWrap.find('.msg').remove();
        //
        //         var msgDiv = $('<div class="msg">').css({
        //             padding: '10px',
        //             background: options.goodNews ? '#DEFCD5' : '#F1D7D7',
        //             color: options.goodNews ? '#52A954' : '#A95252',
        //             fontWeight: '900',
        //             textAlign: 'center',
        //             overflow: 'hidden',
        //             display: 'none',
        //             boxShadow: '2px 2px 7px #CCC'
        //         }).text(options.msg).appendTo(msgWrap);
        //
        //         msgDiv.slideDown(function(){
        //             setTimeout(function(){
        //                 msgDiv.slideUp(300,function(){
        //                     msgDiv.remove();
        //                     //如果没有消息了，收起 removeBtn
        //                     !msgWrap.find('.msg').length && removeBtn.slideUp();
        //                 });
        //             }, options.showTime);
        //         });
        //     }
        // }()
    });
})();

// 下面的代码，主要处理单次请求的问题。
// 应用场景，gmfConfirm -> startLoading -> ajax -> clearLoading -> gmfConfirm
// loading 控制

!function(){
    var isLoading,
        loadingTimer,
        loadingDom;

    $.extend({
        isLoading: function(){
            return isLoading;
        },
        startLoading: function(title){
            $.clearLoading();
            isLoading = true;
            loadingDom = $.gmfLoading(title);
        },
        clearLoading: function(){
            isLoading = false;
            clearTimeout( loadingTimer );
            loadingDom && loadingDom.remove();
        },
        gmfLoading: function(){
            var template = $.multiline(function(){/*!@preserve
            <div style="position:fixed;width:100%;height:100%;display:table;text-align:center;background:rgba(0,0,0,.3);z-index:999999999;top:0;left:0;">
                <div style="display:table-cell;vertical-align:middle;">
                    <div style="display:inline-block;background:#fff;border-radius:10px;text-align:left;overflow:hidden;max-width:90%;">
                        <div style="text-align:left;padding:20px;line-height:1.5;">
                            <div class="sns-loading-content" style="font-size:14px;text-align:center;">
                                <div class="sns-loading-img"></div>
                                <p class="sns-loading-words" style="margin:.7em 0 0;padding:0;"></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            */console.log()});

            return function(words){
                var words = words||'loading...';
                var dom = $('<div>').html(template);
                dom.on('touchmove',function(){return false;});
                dom.find('.sns-loading-words').html(words);
                dom.appendTo( $('body') );
                return dom;
            }
        }()
    });
}();

$.extend({
    gmfConfirm: function(){
        var template = $.multiline(function(){/*!@preserve
            <style>
                .jquery-confirm-content p{margin:.7em 0 0;}
                .jquery-confirm-cancel:hover,.jquery-confirm-ok:hover{background:#f0f0f0;}
                .jquery-confirm-ok.disabled{width:50%;cursor:not-allowed;color:gray!important;}
            </style>
            <div style="position:fixed;width:100%;height:100%;display:table;text-align:center;background:rgba(0,0,0,.3);z-index:100001;top:0;left:0;">
                <div style="display:table-cell;vertical-align:middle;">
                    <div class="jquery-confirm-body" style="display:inline-block;background:#fff;border-radius:10px;text-align:left;overflow:hidden;max-width:90%;">
                        <div style="text-align:left;padding:20px;line-height:1.5;">
                            <h4 class="jquery-confirm-title" style="margin:0;font-size:16px;"></h4>
                            <div class="jquery-confirm-content" style="font-size:14px;padding:1em 0 0;"></div>
                        </div>
                        <div style="display:inline-table;width:100%;line-height:48px;height:48px;border-top:1px solid rgba(0,0,0,.1);font-size:16px;text-align:center;">
                            <a class="jquery-confirm-cancel" href="javascript:;" style="display:table-cell;box-sizing:border-box;color:#3498DB;text-decoration:none;text-align:center;">
                                取消
                            </a>
                            <a class="jquery-confirm-ok" href="javascript:;" style="display:table-cell;box-sizing:border-box;color:#3498DB;text-decoration:none;text-align:center;">
                                确定<span class="delay-seconds"></span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        */console.log()});

        return function(title,content,btns_num,click_bg_cancel,confirm_delay_seconds){
            var title = title||'你确认要进行该操作？',
                content = content||'',
                btns_num = btns_num||1,
                click_bg_cancel = click_bg_cancel||false,
                confirm_delay_seconds = confirm_delay_seconds||0,
                ok,cancel,result = {
                    ok:function(func){ok=func;return result;},
                    cancel:function(func){cancel=func;return result;}
                };

            var dom = $('<div>').html(template);

            btns_num==1
                ? dom.find('.jquery-confirm-cancel').remove()
                : dom.find('.jquery-confirm-ok').css('border-left','1px solid rgba(0,0,0,.1)');

            dom.on('touchmove',function(){return false;});
            dom.find('.jquery-confirm-title').html(title);
            dom.find('.jquery-confirm-content').html(content);

            click_bg_cancel && dom.on('click',function(){
                cancel && cancel();
                distroyAll();
            }).find('.jquery-confirm-body').on('click',function(){
                return false;
            });
            $(window).on('keyup', tryEscape);

            dom.find('.jquery-confirm-ok').on('click',function(){
                if( $(this).is('.disabled') ){return false;}
                $(this).addClass('disabled');

                ok && ok();
                distroyAll();
            });
            dom.find('.jquery-confirm-cancel').one('click',function(){
                cancel && cancel();
                distroyAll();
            });

            confirm_delay_seconds && dom.find('.jquery-confirm-ok').addClass('disabled');
            var delay_seconds_timer = confirm_delay_seconds && setInterval(function(){
                if(confirm_delay_seconds<0){
                    clearInterval(delay_seconds_timer);
                    renderDelaySeconds(0);
                    dom.find('.jquery-confirm-ok').removeClass('disabled');
                    return;
                }
                renderDelaySeconds(confirm_delay_seconds);
                confirm_delay_seconds--;
            },1000);

            dom.appendTo( $('body') );

            function renderDelaySeconds(seconds){
                dom.find('.delay-seconds').html(
                    seconds ? ('&nbsp;( ' + seconds + 's )') : ''
                );
            }

            function tryEscape(event){
                (event.key === 'Escape' || event.key === 'Enter') && distroyAll();
            }

            function distroyAll(){
                $(window).off('keyup',tryEscape);
                clearInterval(delay_seconds_timer);
                dom.remove();
            }

            return result;
        }
    }()
});
