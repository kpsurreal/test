// 组件化：通过自定义标签引入组件
// 示例：<component_name></component_name>

$.extend({
    defineComponent: function(component_name,fn){
        var component_id = $.randomId('oms-component-');

        $(component_name).each(function(){
            $(this).replaceWith(
                ('<!--**  oms-component:$$component_name  start    -->' + $.multiline(fn) + '<!--    oms-component:$$component_name  end    **-->')
                .replace(/\$\$component_id/g,component_id)
                .replace(/\$\$component_name/g,component_name)
            );
        });

        return $('#'+component_id);
    }
});

$(function(){
    var env_dev = /192\.168\.0/.test(location.origin);

    $.defineComponent('robotStatus',function(){/*!@preserve
        <style>
            #$$component_id {cursor:pointer;}
            #$$component_id .status,
            #$$component_id .status-detail{color:red;}
            #$$component_id .hover-show{display:none;}
            #$$component_id .green{color:inherit;}
            #$$component_id .status-detail.green{color:#fff;}
            #$$component_id .hover:hover .hover-show{display:inline-block;}
        </style>
        <span id="$$component_id" style="display:none;line-height:50px;">
            <span class="hover">执行端口<span class="status"></span>
                <span class="hover-show">
                    <span class="status-detail robot_get_mine">接受委托</span>
                    <span class="status-detail robot_update_3">上报成交</span>
                    <a href="" style="color:white;text-decoration:underline;">详情 ></a>
                </span>
            </span>
        </span>
        <script>
        $(function(){
            var me = $('#$$component_id');
            var robot_list_timer;

            me.find('a').attr('href', (window.REQUEST_PREFIX||'')+'/oms/etc/robot_list');

            //全局 ajax 意外处理
            $(window).ajaxComplete(function(event, xhr, settings) {
                if( xhr.responseJSON && xhr.responseJSON.hasOwnProperty('robot_get_mine') ){
                    //showDetail
                    ['robot_get_mine','robot_update_12','robot_update_3'].forEach(function(key){
                        me.show().find('.status-detail.'+key).toggleClass('green',xhr.responseJSON[key]);
                    });
                    var all_is_ok = !me.find('.status-detail:not(.green)').length;
                    me.find('.status').text(all_is_ok ? '正常' : '异常').toggleClass('green',all_is_ok);
                }
            });
        });
        </script>
    */console.log()});

    $.defineComponent('clearLocalStorage',function(){/*!@preserve
        <span id="$$component_id" style="display:none;line-height:50px;cursor:pointer;"></span>
        <script for="$$component_id">
        $(function(){
            //dependences: jquery, localStorage, moment

            var expire = 1000*60*60*24; //过期时间设置为1天，1天之后缓存强制清空更新
            var component = $("#$$component_id");
            var last_cache_timestamp = $.omsGetLocalJsonData('etc','last_cache_timestamp',0);
            component.html('本地缓存：'+moment(last_cache_timestamp).format('MM-DD HH:mm:ss')).click(resetCache);

            new Date().valueOf() - last_cache_timestamp > expire && component.click();

            //用户切换之后清空缓存
            var user_id = $.pullValue(window,'LOGIN_INFO.user_id',0);
            $.omsGetLocalJsonData('etc', 'last_user_id', 0)!=user_id && resetCache();
            $.omsCacheLocalJsonData('etc', 'last_user_id', user_id);

            function resetCache(){
                for(var i in localStorage){
                    //针对所有属性名包涵‘user_id_’的存储数据，不进行清空
                    if(/user_id_/.test(i)){
                        continue;
                    }
                    //针对所有属性名包含‘common_status_’的存储数据，不进行清空
                    if(/common_status_/.test(i)){
                        continue;
                    }
                    // 针对localStorage.json的存储数据，不进行清空
                    if(/localStorage\.json/.test(i)){
                        continue;
                    }

                    delete localStorage[i]
                };
                component.html('本地缓存：'+moment(
                    $.omsCacheLocalJsonData('etc','last_cache_timestamp',new Date().valueOf())
                ).format('MM-DD HH:mm:ss'));
            }
        });
        </script>
    */console.log()}).css('display', env_dev ? 'inline-block' : 'none');

    env_dev && $.defineComponent('silentCtrl',function(){/*!@preserve
        <span id="$$component_id" style="display:none;line-height:50px;cursor:pointer;"></span>
        <script for="$$component_id">
        $(function(){
            var silent_cache_key = '____keep_silent____';
            var component = $("#$$component_id");
            component.click(function(){
                $.pushValue(
                    localStorage,
                    silent_cache_key,
                    $.pullValue(localStorage,silent_cache_key,false) ? '' : true
                );
                resetCtrl();
                $(window).trigger({type:'keep_silent_change'});
            });

            resetCtrl();

            function resetCtrl(){
                component.css('display','inline').html( $.pullValue(localStorage,silent_cache_key,false) ? '安静模式' : '正常模式' );
            }
        });
        </script>
    */console.log()});

    env_dev && $.defineComponent('RiskCtrl',function(){/*!@preserve
        <span id="$$component_id" style="display:none;line-height:50px;cursor:pointer;"></span>
        <script for="$$component_id">
        $(function(){
            var risk_toggle_key = '____be_risk_check____';
            var component = $("#$$component_id");
            component.click(function(){
                $.pushValue(
                    localStorage,
                    risk_toggle_key,
                    $.pullValue(localStorage,risk_toggle_key,false) ? '' : true
                );
                resetCtrl();
                $(window).trigger({type:'risk_toggle_change'});
            });

            resetCtrl();

            function resetCtrl(){
                component.css('display','inline').html( $.pullValue(localStorage,risk_toggle_key,false) ? '后端风控' : '前端风控' );
            }
        });
        </script>
    */console.log()});
});
