//一些全局初始化的操作
$(function(){
    setPlusInput();
    setRowsHeadSortBy();
    setZebra_DatePicker();
    // setUpDownMonitor(); 本地测试显示，chrome 浏览器严重影响性能
    // setToastrNoticeCenter();
    // setAutoRefresh();
    setDisableOrder();
    setGoSection();

    $(window).on('load beforeunload spa_product_change',$.omsAlertClear);

    //页面结构调整
    function setGoSection(){
        $(window).on('main_window:goto_section', function(event){
            var nav_header_height = 50;
            var section = event.section;
            var section_top_now = section.offset().top;
            window.scrollTo(0,section_top_now-60);
        });
    };

    //订单更新成功后，禁止再次处理当前订单，防止二次处理
    function setDisableOrder(){
        $(window).on('oms_workflow_handle_done',function(event){
            var order = event.order;
            order && $('[rows-body] tr').filter(function(){
                var row_order = $(this).getCoreData();
                return (row_order == order || row_order.id==order.id);
            }).find('.oms-btn').addClass('disabled');
        });
    }

    // 加减值变化控制支持上下键和鼠标滚轮
    function setPlusInput(){
        $('.plus-input').on('focus',function(){
            $(this).addClass('focus');
        }).on('blur',function(){
            $(this).removeClass('focus');
        }).on('keydown',function(event){
            // debugger;
            if (event.keyCode==39) {
                // 支持港股的时候，有两个加减按钮了，所以必须要使用“:not([style="display: none;"]”
                $('[click-value^="#' + $(this).prop('id') + ':+"]:not([style="display: none;"]').click();
                $(this).focus();
                return false;
            }
            if (event.keyCode==37) {
                // 支持港股的时候，有两个加减按钮了，所以必须要使用“:not([style="display: none;"]”
                $('[click-value^="#' + $(this).prop('id') + ':-"]:not([style="display: none;"]').click();
                $(this).focus();
                return false;
            }
            // return false;
        // }).on('mousewheel',function(event){
        //     if($(this).hasClass('focus') && event.originalEvent.wheelDelta){
        //         $('[click-value^="#' + $(this).prop('id') + ':' +
        //         (event.originalEvent.wheelDelta < 0 ? '+' : '-')
        //         + '"]').click();
        //         return false;
        //     }
        }).on('change',function(){
            $(this).val() < 0 && $(this).val(0).change();
        });
    }

    function setRowsHeadSortBy(){
        $('html').on('click','[sort-by]',function(){
            var rows_head = $(this).closest('tr');
            var sort_by = $(this).attr('sort-by');
            var old_sort_type = $(this).attr('sort-type')||'desc';
            var new_sort_type = old_sort_type==='desc' ? 'asc' : 'desc';
            $(this).attr('sort-type', new_sort_type).siblings().removeAttr('sort-type');
            rows_head.trigger('sort_by:changed');
        }).on('table:rendered table:updated sort_by:changed','[inner-sort]',function(event){
            //内部自行排序的表格处理
            var me = $(this);
            var sort_type_th = me.find('[rows-head] [sort-type]');
            if(sort_type_th.length){
                var sort_type_key = sort_type_th.attr('sort-by');
                var sort_type = sort_type_th.attr('sort-type');
                var sort_type_td_index = me.find('[rows-head] th').index(sort_type_th);
                me.find('[rows-body]').append($(me.find('[rows-body] tr').toArray().sort(function(row1,row2){
                    var value1 = $.pullValue($(row1).getCoreData(), sort_type_key);
                    var value2 = $.pullValue($(row2).getCoreData(), sort_type_key);

                    //特殊处理
                    if(value1 == '-'){return 1;}
                    if(value2 == '-'){return -1;}

                    return sort_type=='asc'
                            ?   (value1<value2 ? -1 : 1)
                            :   (value1<value2 ? 1 : -1);
                })));
            }
        });

        $.fn.extend({
            getRowsHeadSortParams: function(){
                var result = {};
                var sort_type_th = $(this).find('[sort-type]:first');
                var sort_type = sort_type_th.attr('sort-type');
                sort_type && $.extend(result,{
                    sort_type: sort_type,
                    sort_by: sort_type_th.attr('sort-by')
                });
                return result;
            },
            getMoreParams: function(){
                var me = $(this);
                var result = {};
                me.find('[more-param]').each(function(){
                    var key = $(this).attr('name');
                    var value = $(this).val();
                    result[key] = value;
                });
                return $.extend(result, me.getRowsHeadSortParams());
            }
        });
    }

    function setZebra_DatePicker(){
        $.fn.Zebra_DatePicker && $(function(){
            var now = new Date();
            var today = [now.getFullYear(),now.getMonth()+1,now.getDate()].map(function(n){
                return n.toString().length<2 ? '0'+n : n;
            }).join('-');
            $('[zebra-datepicker]').each(function(){
                var input = $(this);
                var cache_label = input.attr('zebra-datepicker');
                var last_cache_value = $.omsGetLocalJsonData('etc','zebra-datepicker:'+cache_label,today);
                input.val(last_cache_value).on('change',function(){
                    $.omsCacheLocalJsonData('etc','zebra-datepicker:'+cache_label,input.val());
                }).Zebra_DatePicker({
                    container: $(this).parent(),
                    onSelect: function(value) {
                        input.change();
                    }
                });
            });
        });
    }

    function setUpDownMonitor(){
        $('html').on('data-src:rendered','[updown-monitor] [data-src]',function(event){
            var me = $(this).removeClass('udm-up udm-down udm-equal');
            var monitor = me.closest('[updown-monitor]');

            if(!monitor.length){return;}

            var data = monitor.getCoreData();

            var src = me.attr('data-src').split('|')[0];
            var value = $.pullValue(data,src,0);
            if(+value != value){return;}

            var monitor_pattern = monitor.attr('updown-monitor').split(':');
            var name_space = monitor_pattern[0];
            var private_key = ( monitor.parseString(monitor_pattern[1])+':'+src ).replace(/\./g,'-');

            var oldvalue = $.omsGetLocalJsonData(name_space,private_key);
            $.omsUpdateLocalJsonData(name_space,private_key,value);

            oldvalue && me.addClass(
                oldvalue!=value
                    ? (oldvalue>value ? 'udm-down' : 'udm-up')
                    : 'udm-equal'
            );
        });
    }

    // function setToastrNoticeCenter(){
    //     var notice_timestamp = 0;
    //     $(window).on('notice_updated',function(event){
    //         var new_timestamp = event.timestamp;
    //         if(new_timestamp!=notice_timestamp){
    //             notice_timestamp = new_timestamp;
    //             loadUserNotice();
    //         }
    //     });
    //
    //     function loadUserNotice(){
    //         var url = (window.REQUEST_PREFIX||'') + '/oms/api/notice/get';
    //         $.get(url).done(function(res){
    //             if(res.code==0){
    //                 showNotices(res.data);
    //             }else{$.failNotice(url,res);}
    //         }).fail($.failNotice.bind(null,url))
    //     }
    //
    //     function showNotices(notices){
    //         toastr.options = {
    //           "closeButton": false,
    //           "newestOnTop": false,
    //           "positionClass": "toast-top-right",
    //           "timeOut": 0,
    //           "extendedTimeOut": 0,
    //           "tapToDismiss": false
    //         };
    //
    //         notices.forEach(function(notice){
    //             renderNotice(notice);
    //         });
    //         function renderNotice(notice){
    //             if(notice.type!=324){return console.warn('未能识别的提醒：',notice);}
    //
    //             var msg = $($.multiline(function(){/*!@preserve
    //             <div>
    //                 <div class="msg">你持有的股票（
    //                     <span data-src="stock_id"></span>
    //                     <span data-src="stock_info.name"></span>
    //                 ）在
    //                     <span data-src="triggered_at">7月12日13:21</span>
    //                 已经达到预设止损线</div>
    //                 <div>
    //                     <span class="btn white" handle="sell">卖出</span>
    //                     <span style="float:right;">
    //                         <span class="btn white" handle="next">下次提示</span>
    //                         <span class="btn btn-primary" handle="ignore">忽略</span>
    //                     </span>
    //                 </div>
    //             </div>
    //             */console.log()})).render($.extend({
    //                 stock_id: '股票id',
    //                 stock_info: {
    //                     name: '股票名称'
    //                 },
    //                 triggered_at: '触发时间'
    //             },notice.contain)).on('click','[handle]',function(){
    //                 var btn = $(this);
    //                 var handle_type = btn.attr('handle');
    //                 switch(handle_type){
    //                     case 'sell':
    //                         break;
    //                     case 'next':
    //                         break;
    //                     case 'ignore':
    //                         break;
    //                 }
    //             });
    //
    //             var $toast = window.toastr.info(msg).on('remove',function(){
    //                 window.toastr.clear($toast, { force: true });
    //             });
    //         }
    //     }
    // }

    function setAutoRefresh(){
        var timer;
        var gap = 10*60*1000;//固定 10 minutes  时长自动刷新页面，防止内存爆掉

        $(window).on('load visibilitychange mouseenter scroll keyup',reset);

        function reset(event){
            clearTimeout(timer);
            timer = setTimeout(function(){
                window.location.reload();
            },gap);
        }
    }
});

//策略id对应用户信息本地缓存，和股票id对应用户信息
(function(){
    // 优先配置机器人
    $.omsUpdateLocalJsonData('user_id_info_cache','0',{
        user_id: '0',
        nick_name: '机器'
    });

    // 配置，通过工厂函数达到目的
    [
        {key: 'stock_id', src: (window.REQUEST_PREFIX||'')+'/oms/helper/stock_brief?stock_id=${ids}', pull_base: 'stock_id', push_base: 'stock_info', global: ['mergeBriefStocksInfo','mergeHandOrderStocksInfo']},
        {key: 'stock_id', src: (window.REQUEST_PREFIX||'')+'/oms/helper/stock_brief?stock_id=${ids}', pull_base: 'stock_id', push_base: 'stock_info', global: ['mergeGaosongzhuanStocksInfo','mergeFreshStocksInfo'], refresh: true},
        {key: 'stock_id', src: (window.REQUEST_PREFIX||'')+'/oms/helper/stock_brief?stock_id=${ids}', pull_base: 'stock.code', push_base: 'stock_info', global: 'mergeOrderStocksInfo'},
        {key: 'user_id',  src: (window.REQUEST_PREFIX||'')+'/oms/helper/user_info?user_id=${ids}',    pull_base: 'user_id',    push_base: 'user_info',  global: ['mergeBriefUserInfo','mergeOrderCtrlHistoryUsersInfo']},,
        {key: 'user_id',  src: (window.REQUEST_PREFIX||'')+'/oms/helper/user_info?user_id=${ids}',    pull_base: 'handler_uid',    push_base: 'user_info',  global: ['mergeBriefHandlerInfo']},
        {key: 'user_id',  src: (window.REQUEST_PREFIX||'')+'/oms/helper/user_info?user_id=${ids}',    pull_base: 'last_handler.user_id',    push_base: 'last_handler',  global: 'mergeOrderLastHandlersInfo'},
        {key: 'product_id', src: (window.REQUEST_PREFIX||'')+'/oms/helper/get_products_by_id?product_id=${ids}',pull_base: 'product_id', push_base: 'product', global: 'mergeProductsBriefInfo', dont_touch_push_base: true}
    ].forEach(function(x){
        var getInfoByIds = getInfoByIdsFactory(x);
        var globalFunc = mergeInfoFactory(getInfoByIds, x);
        $.type(x.global)=='string' && (window[x.global] = globalFunc);

        $.type(x.global)=='array' && x.global.forEach(function(func_name){
            window[func_name] = globalFunc;
        });
    });

    //额外，code_genius 接口返回的股票数据也加入 stock_id 缓存
    $(window).ajaxComplete(function(event, xhr, settings) {
        if( /code\_genius/.test(settings.url) && xhr.status==200 && xhr.responseJSON && xhr.responseJSON.code == 0 ){
            var stock_id_info_cache = $.omsGetLocalJsonData('stock_id_info_cache') || {};
            xhr.responseJSON.data && xhr.responseJSON.data.forEach && xhr.responseJSON.data.forEach(function(stock){
                stock_id_info_cache[ stock['stock_id'] ] = stock;
            });
            $.omsSaveLocalJsonData('stock_id_info_cache',stock_id_info_cache);
        }
    }).on('side_nav_product_list:updated',function(event){
        // 因为“product_id_info_cache”被存下来没有看到其他地方使用，又，本来是全局变量的“fetched_products”也没有别的地方使用
        // 所以该回调函数内部的操作没有意义。

        // //额外，保证缓存组合信息更新
        // var products = $.pullValue(event,'product_list.products',[]);
        // // 注意，这里是浅拷贝
        // var fetched_products = {};
        // products.forEach(function(product){
        //     fetched_products[product.id] = product;
        // });
        //
        // var product_id_info_cache = $.omsGetLocalJsonData('product_id_info_cache') || {};
        // for(var product_id in product_id_info_cache){
        //     product_id_info_cache[product_id] = $.extend(product_id_info_cache[product_id],(
        //         fetched_products[product_id]||{}
        //     ));
        // }
        // $.omsSaveLocalJsonData('product_id_info_cache',product_id_info_cache);
    });

    function mergeInfoFactory(getInfoByIds, options){
        var cache_key = options.key;
        var pull_base = options.pull_base || options.key;
        var push_base = options.push_base;
        var dont_touch_push_base = options.dont_touch_push_base || false;

        return mergeInfo;

        function mergeInfo(objs_arr){
            var callback,result = {then:function(func){callback=func}};
            var ids = [];
            objs_arr.forEach(function(obj){ids.push( $.pullValue(obj,pull_base,cache_key) )})

            getInfoByIds(ids).then(function(infos){
                objs_arr.forEach(function(obj,index){
                    if(dont_touch_push_base && !$.isEmptyObject(obj[push_base])){return;}
                    $.pushValue(obj, push_base, infos[index]);
                });
                callback && callback();
            });

            return result;
        }
    }

    function getInfoByIdsFactory(options){
        var cache_src = options.src;
        var cache_key = options.key; // cache_key 需要和返回数组的 对象中的 key 一一对应
        var local_storage_cache_key = cache_key+'_info_cache';
        var info_cache = $.omsGetLocalJsonData(local_storage_cache_key) || {};
        var refresh = $.pullValue(options, 'refresh', false); //如果为true，强制刷新缓存

        return getInfoByIds;

        //可能会调用两次 callback 的异步函数哦，吊吊的
        function getInfoByIds(ids,only_from_cache){
            var callback,result = {then:function(func){callback=func;}};

            var uncached_ids = [];
            ids.forEach(function(id){
                (!info_cache[id] || refresh) && uncached_ids.push(id);
            });
            $.unique(uncached_ids);

            //居然有的股票信息没有缓存，快去取吧
            uncached_ids.length && !only_from_cache && $.get( cache_src.replace('${ids}',uncached_ids.join(',')) ,function(res){
                if(res.code == 0 && res.data && res.data.length){
                    res.data.forEach(function(info_obj){
                        //cache_key 如果没有，按 id
                        info_cache[ info_obj[cache_key]||info_obj['id'] ] = info_obj;
                    });
                    $.omsSaveLocalJsonData(local_storage_cache_key,info_cache);
                    //取完再来一次回调
                    getInfoByIds(ids,true).then(callback);
                }

                res.code !=0 && $.omsAlert(res.code + ' : ' + cache_src + ' ' + (res.msg||''),false);
            });

            //先来一次回调吧，有多少数据返回少数据
            (!refresh || only_from_cache) && (window.requestAnimationFrame || window.setTimeout)(function(){
                callback && callback(ids.map(function(id){
                    return info_cache[id];
                }));
            });

            return result;
        }
    }
}());

function getProductInfoById(product_id){
    var callback,result = {then:function(func){callback=func;}};
    $.get((window.REQUEST_PREFIX||'')+'/oms/api/get_product_info?product_id='+product_id,function(res){
        if( res.code==0 ){
            callback && callback(res.data);
        }else{
            $.omsAlert('获取策略信息出错：' + (res.msg || '未知错误') + '，请稍候重试！');
        }
    }).error(function(){$.omsAlert('获取策略详情的接口挂了 :(')});
    return result;
}

// 获取 hash 参数：
// location.href = ...#market=1
// _hash_get('market'); //output:1
function _hash_get(name){
    var params = {};
    location.hash.replace(/^\#/,'').split('&').forEach(function(x){
        params[ x.replace(/\=.*/,'') ] = decodeURIComponent( x.replace(/.*\=/,'') );
    });
    return params[name];
}
