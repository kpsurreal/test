// 公共基础函数定义
// 依赖jquery
// 特别注意，localStorage在其他地方有被清空的处理，属性名包含“user_id_”可以免于被清空。
var utils = {};

// 全局常量 gobal variable
var GV = {};
GV.permissions = {
    'PERMISSION_ENTRUST_ADD': 20, //委托提交
    'PERMISSION_INSTRUCT_ALLOCATE': 21, //指令分配
    'PERMISSION_INSTRUCT_EXEC': 22, //指令执行
    'PERMISSION_SEND_STOCK': 23, //派股送股处理
    'PERMISSION_RISK_HANDLE': 24, //风控页面
    'PERMISSION_ERRORS_HANDLE': 25, //异常单处理
    'PERMISSION_PRODUCT_RISK': 26, //组合风控设置
    'PERMISSION_PRODUCT_SPLIT': 27,  //组合拆分
    'PERMISSION_PRODUCT_BASE': 28,  //组合基本信息修改
    'PERMISSION_PRODUCT_USER': 29, //组合用户修改
    'PERMISSION_PRODUCT_FEE': 30, //组合费用修改
    'PERMISSION_PRODUCT_CASH': 31, //组合资金调整
    'PERMISSION_USER_EDIT': 32,   //用户编辑
    'PERMISSION_PASSWORD_RESET': 33, //用户重置密码
    'PERMISSION_USER_DELETE': 34, //删除用户
    'PERMISSION_SELECT_INSTRUCT': 35, //查看指令
    'PERMISSION_SELECT_ENTRUST': 36, //查看委托
    'PERMISSION_SELECT_DEAL': 37, //查看成交
    'PERMISSION_SELECT_POSITION': 38, //查看持仓
    'PERMISSION_SELECT_FEE': 39, //查看费用 //清算查询
    'PERMISSION_SELECT_CASH': 40, //查看资金 //资产查询
    'PERMISSION_MONITOR_DATA': 41, //数据监控页面
    'PERMISSION_INSTRUCT_ADD': 42, //指令提交
    'PERMISSION_UNLOCK_USER': 43, //用户解锁
    'PERMISSION_ACCOUNT_LIST': 44, //基金管理
    'PERMISSION_OTC_CAPITAL': 45, //场外资产
    'PERMISSION_SUSPENSION': 46, //停牌估值
    'PERMISSION_REPORT_VIEW': 47,  //产品报表
    'PERMISSION_SYS_SETTING': 48,  //系统运维
    'PERMISSION_VIEW_DATA_V2': 49,  //成交查询
    'PERMISSION_PISITION_REPORT_VIEW': 50, //持仓报表
    'PERMISSION_CONCERN_STOCK': 51, //关注股票
    'PERMISSION_INS_NOTIFY': 53, //指令通知
    'PERMISSION_INS_REVIEW': 54, //指令审核
    'PERMISSION_INS_SUBMIT': 55, //指令提交
    'PERMISSION_INS_EXEC': 56, //指令执行
    'PERMISSION_FUND_VALUATION': 57, //基金估值
    'PERMISSION_COST_SET': 58, //费用设置

};


utils.common = (function(){
    return {
        getData: function(data, key, dValue){
            var value = '';
            data.forEach(function(e){
                if (e[0] == key) {
                    value = e[1];
                    return;
                }
            });

            if (undefined !== dValue) {
                value = dValue;
            }

            return value;
        }
    }
})();

//策略指令相关，gaoyi项目使用
utils.policyGrid = (function($){
    var CheckValid, CheckInArray, UpdateArray, InitArray, InsertArray, AddCustomData, CheckTime, prefix_user_id, ChangeNoNeedAlert;
    CheckValid = function(arr){
        return arr.every(function(e, index){
            return e.id&&(Number(e.id) > 0);
        });
    };
    CheckInArray = function(arr, id){
        return arr.some(function(e, index){
            return (Number(e.id) == Number(id));
        })
    };
    UpdateArray = function(dst, data){
        dst.forEach(function(e, index){
            if (parseInt(e.id, 10) == parseInt(data.id, 10)) {
                if (e.childrens && data.childrens) {
                    // e.childrens = data.childrens;
                    for (var i = e.childrens.length - 1; i >= 0; i--) {
                        if (!data.childrens.some(function(ele){return ele.id == e.childrens[i].id})) {
                            e.childrens.splice(i, 1);
                        }
                    }
                }
                $.extend(true, e, data);
            }
        });
    };
    InitArray = function(value){
        value.forEach(function(e){
            AddCustomData(e);
        });
        ChangeNoNeedAlert(value);
        localStorage.setItem(prefix_user_id + 'policyGridData', JSON.stringify(value));
    };
    InsertArray = function(dst, data){
        AddCustomData(data);
        dst.push(data);
    };
    AddCustomData = function(data){
        if (!data.hasOwnProperty('webFlag_is_unread') && !data.hasOwnProperty('webFlag_has_alert')) {
            // data['webFlag_is_unread'] = true;
            if ('true' == localStorage.getItem(prefix_user_id + 'webFlag_show_unread')) {
                data['webFlag_is_unread'] = true;
            }else{
                data['webFlag_is_unread'] = false;
            }
            data['webFlag_has_alert'] = false;
            data.childrens&&data.childrens.forEach(function(e){
                if ('true' == localStorage.getItem(prefix_user_id + 'webFlag_show_unread')) {
                    e['webFlag_is_unread'] = true;
                }else{
                    e['webFlag_is_unread'] = false;
                }
                e['webFlag_has_alert'] = false;
            })

        }else{
            throw new Error('系统异常，获取到的数据包含前端使用的特殊字段');
        }
    };
    CheckTime = function(){
        var newDate = new Date();
        var newDateStr = '' + newDate.getFullYear()+newDate.getMonth()+newDate.getDate();
        if (!localStorage.getItem(prefix_user_id + 'webFlag_data_time')) {
            localStorage.setItem(prefix_user_id + 'webFlag_data_time', newDateStr);
            localStorage.removeItem(prefix_user_id + 'policyGridData');
        }else{
            var oldDateStr = localStorage.getItem(prefix_user_id + 'webFlag_data_time');
            if (oldDateStr == newDateStr) {
                ;
            }else{
                localStorage.setItem(prefix_user_id + 'webFlag_data_time', newDateStr);
                localStorage.removeItem(prefix_user_id + 'policyGridData');
            }
        }
    };

    ChangeNoNeedAlert = function(data){
        data.forEach(function(e){
            //更新完成数据之后，根据状态判断是否需要将unread设置为false。已撤销和提交失败均不需要提示用户
            // 另外，仅在该条指令不是自己下发的时候才设置为未读 e.sponor_user_id  LOGIN_INFO.user_id
            if (e.childrens) {
                e.childrens.forEach(function(el){
                    if ('-1' == el.ins_status || '3' == el.ins_status) {
                        el.webFlag_is_unread = false;
                    }
                    if (el.sponor_user_id == LOGIN_INFO.user_id) {
                        el.webFlag_is_unread = false;
                    }
                });

                if (e.childrens.some(function(el){return true == el.webFlag_is_unread})) {
                    e.webFlag_is_unread = true;
                }else{
                    e.webFlag_is_unread = false;
                }
            }else{
                if ('-1' == e.ins_status || '3' == e.ins_status) {
                    e.webFlag_is_unread = false;
                }
                if (e.sponor_user_id == LOGIN_INFO.user_id) {
                    e.webFlag_is_unread = false;
                }
            }
        })
    }

    return {
        init: function(id, role_id){
            prefix_user_id = 'user_id_' + id + '.';

            //设置默认值
            if (!localStorage.getItem(prefix_user_id + 'webFlag_show_unread')) {
                localStorage.setItem(prefix_user_id + 'webFlag_show_unread', 'true');
            }
            if (!localStorage.getItem(prefix_user_id + 'webFlag_sound_unread')) {
                localStorage.setItem(prefix_user_id + 'webFlag_sound_unread', 'true');
            }

            if (1 != parseInt(role_id, 10) && 13 != parseInt(role_id, 10)) {
                localStorage.setItem(prefix_user_id + 'webFlag_show_unread', 'false');
                localStorage.setItem(prefix_user_id + 'webFlag_sound_unread', 'false');
            }
        },
        //设置数据
        setItem: function(value){
            //判断入参格式是否正确
            if (!CheckValid(value)) {
                throw new Error('系统异常，策略指令表格的数据格式需要检查');
            }

            // CheckTime();

            //根据入参得到最终数据，进行保存
            if (!localStorage.getItem(prefix_user_id + 'policyGridData')) {
                InitArray(value);
            }else{
                var oldData = JSON.parse(localStorage.getItem(prefix_user_id + 'policyGridData'));
                value.forEach(function(e, index){
                    if (CheckInArray(oldData, e.id)) {
                        //更新oldData
                        UpdateArray(oldData, e);
                    }else{
                        //新数据插入到oldData
                        InsertArray(oldData, e);
                    }

                });
                //如果oldData中包含有接口返回的新数据所没有的数据，那么去除
                for (var i = oldData.length - 1; i >= 0; i--) {
                    if (!value.some(function(el){return el.id == oldData[i].id})) {
                        oldData.splice(i, 1);
                    }
                }

                ChangeNoNeedAlert(oldData);

                oldData.sort(function(a, b){
                    return b.id - a.id;
                })
                localStorage.setItem(prefix_user_id + 'policyGridData', JSON.stringify(oldData));
            }
        },
        //获取数据
        getItem: function(){
            return JSON.parse(localStorage.getItem(prefix_user_id + 'policyGridData'));
        },
        //根据id修改已读情况，传0则修改所有数据
        changeItem: function(id, ps_id){
            var defaultAll = 0;
            if (localStorage.getItem(prefix_user_id + 'policyGridData')) {
                var data = JSON.parse(localStorage.getItem(prefix_user_id + 'policyGridData'));
                data.forEach(function(e){
                    if (e.childrens) {
                        e.childrens.forEach(function(el){
                            if (defaultAll == id || (el.id == id && el.ps_id == ps_id)) {
                                el.webFlag_is_unread = false;
                            }
                        })
                    }else{
                        if (defaultAll == id || (e.id == id && e.ps_id == ps_id)) {
                            e.webFlag_is_unread = false;
                        }
                    }
                });

                //重新遍历所有数据，当多产品策略的所有子策略均已读，则修改自身为已读
                data.forEach(function(e){
                    if (e.childrens) {
                        if (e.childrens.some(function(el){return true == el.webFlag_is_unread;})) {
                            e.webFlag_is_unread = true;
                        }else {
                            e.webFlag_is_unread = false;
                        }
                    }
                });

                localStorage.setItem(prefix_user_id + 'policyGridData', JSON.stringify(data));
            }
        },
        changeAlertItem: function(obj){
            var data = JSON.parse(localStorage.getItem(prefix_user_id + 'policyGridData'));
            data.forEach(function(e){
                if (e.id == obj.id && e.ps_id == obj.ps_id) {
                    e.webFlag_has_alert = true;
                }
                if (e.childrens) {
                    e.childrens.forEach(function(el){
                        if (el.id == obj.id && el.ps_id == obj.ps_id) {
                            el.webFlag_has_alert = true;
                        }
                    })
                }
            });
            localStorage.setItem(prefix_user_id + 'policyGridData', JSON.stringify(data));
        },
        getUnreadNum: function(){
            var data = JSON.parse(localStorage.getItem(prefix_user_id + 'policyGridData'));
            var num = 0;
            data.forEach(function(e){
                if (e.childrens) {
                    e.childrens.forEach(function(el){
                        if (true == el.webFlag_is_unread) {
                            num += 1;
                        }
                    });
                }else{
                    if (true == e.webFlag_is_unread) {
                        num += 1;
                    }
                }
            });
            return num;
        },
        getColorDisplayFlag: function(){
            if ('true' == localStorage.getItem(prefix_user_id + 'webFlag_show_unread')) {
                return true;
            }else{
                return false;
            }
        },
        setColorDisplayFlag: function(flag){
            localStorage.setItem(prefix_user_id + 'webFlag_show_unread', flag);
        },
        getSoundDisplayFlag: function(){
            if ('true' == localStorage.getItem(prefix_user_id + 'webFlag_sound_unread')) {
                return true;
            }else{
                return false;
            }
        },
        setSoundDisplayFlag: function(flag){
            localStorage.setItem(prefix_user_id + 'webFlag_sound_unread', flag);
        },
        //维护方法，删除表格存入的localStorage数据
        removeItem: function(){
            localStorage.removeItem(prefix_user_id + 'webFlag_data_time');
            localStorage.removeItem(prefix_user_id + 'policyGridData');
            localStorage.removeItem(prefix_user_id + 'webFlag_show_unread');
            localStorage.removeItem(prefix_user_id + 'webFlag_sound_unread');
        },
        //维护方法，校验已有的localStorage是否符合要求
        checkItem: function(){
            if (!localStorage.getItem(prefix_user_id + 'policyGridData')) {
                console.log('localStorage未保存policyGridData数据');
            }else {
                var data = JSON.parse(localStorage.getItem(prefix_user_id + 'policyGridData'));
                console.log('数组长度为' + data.length);
                data.forEach(function(e){
                    if (e.childrens) {
                        e.childrens.forEach(function(el){
                            if (!el.hasOwnProperty('webFlag_is_unread')) {
                                console.log('id: ' + e.id + ' 没有设置webFlag_is_unread，该字段表示是否已读')
                            }
                        });
                    }else{
                        if (!e.hasOwnProperty('webFlag_is_unread')) {
                            console.log('id: ' + e.id + ' 没有设置webFlag_is_unread，该字段表示是否已读')
                        }
                    }
                });
            }
        }
    };
})($);

//策略指令页面：回车及方向键监听，还需要考虑不要与另外的查询功能不冲突，目前并没有很完整的剥离开。——gaoyi项目使用
utils.tab = (function($){
    var CaptureKeypress,tabOrder;
    CaptureKeypress = function(){
        // 3.11版本将这里的keydown修改成了keyup,避免长按导致二次确认框实效。
        $(document).on('keyup', ':input[tabIndex]', function(e){
            if (e.which == 13 || e.which == 38 || e.which == 40 || e.which == 9) {
                //当是上下键或回车键时，如果magic-suggest不为none，且其子元素数量不为0，
                if (e.which == 38 || e.which == 40 || e.which == 13) {
                    if (undefined == $('.magic-suggest').attr('style') || $('.magic-suggest').children().length === 0) {

                    }else{
                        if ('' === $('.magic-suggest').attr('style') || (!!$('.magic-suggest').attr('style') && -1 === $('.magic-suggest').attr('style').indexOf('none')) ||
                            (-1 !== $('.magic-suggest').attr('style').indexOf('none') && $('.magic-suggest').children().length == 0)) {
                            return false;
                        }
                    }

                }
                if (e.which == 13 && '-1' == $(':input[tabIndex=0]').parents('.submit-wrap').attr('style').indexOf('none')) {
                    $(':input[tabIndex=0]').click();
                    return false;
                }
                //并不能因为保存了tabOrder就不重新获取了，因为用户可能改变input状态
                // if (!tabOrder) {
                var els = $(':input[tabIndex]'),
                    ti = [],
                    rest = [];
                for (var i = 0, il = els.length; i < il; i++) {
                    if (els[i].tabIndex > 0 &&
                        !els[i].disabled &&
                        !els[i].hidden &&
                        !els[i].readOnly &&
                        els[i].type !== 'hidden') {
                        ti.push(els[i]);
                    }
                }
                ti.sort(function(a,b){ return a.tabIndex - b.tabIndex; });
                for (i = 0, il = els.length; i < il; i++) {
                    if (els[i].tabIndex == 0 &&
                        !els[i].disabled &&
                        !els[i].hidden &&
                        !els[i].readOnly &&
                        els[i].type !== 'hidden') {
                        rest.push(els[i]);
                    }
                }
                // tabOrder = ti.concat(rest);
                var tabOrder = ti;
                // }
                for (var j = 0, jl = tabOrder.length; j < jl; j++) {
                    if (this === tabOrder[j]) {
                        if (e.which == 13 || e.which == 40 || e.which == 9) {
                            if (j+1 < jl) {
                                $(tabOrder[j+1]).focus();
                                // $(tabOrder[j+1]).focus();

                                (function($){
                                    setTimeout(function(){$.focus()}, 200);
                                })($(tabOrder[j+1]));
                            } else {
                                // $(this).blur();
                                // $(':input[tabIndex=0]').click();
                            }
                        }else if(e.which == 38){
                            if (j == 0) {

                            }else{
                                $(tabOrder[j-1]).focus();
                            }
                        }
                    }
                }
                e.stopPropagation();
                e.preventDefault();
                return false;
            }
        });
    }

    return {
        init: function(){
            CaptureKeypress();
        }
    };
})($)

utils.deadline = (function(){
    var prefix_user_id, CheckTime;
    //注意，调用CheckTime将会修改内容，也就是说函数
    CheckTime = function(){
        var newDate = new Date();
        var newDateStr = '' + newDate.getFullYear()+newDate.getMonth()+newDate.getDate();
        if (!localStorage.getItem(prefix_user_id + 'deadline_data_time')) {
            localStorage.setItem(prefix_user_id + 'deadline_data_time', newDateStr);
            localStorage.setItem(prefix_user_id + 'deadline_need_display', 'true');
        }else {
            if(newDateStr == localStorage.getItem(prefix_user_id + 'deadline_data_time')){
                ;//不修改是否需要显示
            }else{
                localStorage.setItem(prefix_user_id + 'deadline_data_time', newDateStr);
                localStorage.setItem(prefix_user_id + 'deadline_need_display', 'true');
            }
        }
    }
    return {
        init: function(id){
            prefix_user_id = 'user_id_' + id + '.';
            CheckTime();
        },
        needDisplay: function(){
            if ('true' === localStorage.getItem(prefix_user_id + 'deadline_need_display')) {
                // localStorage.setItem(prefix_user_id + 'deadline_need_display', false);
                return true;
            }else{
                return false;
            }
        },
        setNeedDisplay: function(flag){
            localStorage.setItem(prefix_user_id + 'deadline_need_display', flag);
        }
    }
})();

/**
 *
 */
utils.stock_custom = (function(){
    var prefix;
    return {
        init: function(id){
            prefix = 'stock_custom.user_id_' + id + '.';

            // if (!localStorage.getItem(prefix + 'SZ_market_type')) {
            //     localStorage.setItem(prefix + 'SZ_market_type', 5);//上海五档即成剩撤 深圳五档即成剩撤
            // }
            //
            // if (!localStorage.getItem(prefix + 'SH_market_type')) {
            //     localStorage.setItem(prefix + 'SH_market_type', 5);//上海五档即成剩撤 深圳五档即成剩撤
            // }
        },
        setMarketData: function(market, data){
            sessionStorage.setItem(prefix + market+'_market_data', JSON.stringify(data));
        },
        getMarketData: function(market){
            return JSON.parse(sessionStorage.getItem(prefix + market+'_market_data'));
        },
        chgMarketData:function(market, type){
            // debugger;
            var data = JSON.parse(sessionStorage.getItem(prefix + market+'_market_data'));
            data.forEach(function(e){
                if (type != e.key) {
                    e.is_default = 0;
                }else{
                    e.is_default = 1;
                }
            });
            sessionStorage.setItem(prefix + market+'_market_data', JSON.stringify(data));
        },
        getMarketType: function(market){
            var data = JSON.parse(sessionStorage.getItem(prefix + market+'_market_data'));
            var key = -1;
            data.forEach(function(e){
                if (1 == e.is_default) {
                    key = e.key;
                    return;
                }
            })

            return key;
        }
    }
})()

utils.getRoleName = function(idArr){
    var roleStrArr = [];
    idArr.forEach(function(e){
      if (1 == e) {
        roleStrArr.push('管理员');
      }
      if (11 == e) {
        roleStrArr.push('基金经理');
      }
      if (12 == e) {
        roleStrArr.push('交易员');
      }
      if (13 == e) {
        roleStrArr.push('风控员');
      }
    });
    var tmpHtml = roleStrArr.join('、');
    if (idArr.length == 0) {
        tmpHtml = '--';
    }
    return tmpHtml;
}

utils.getUserStatus = function(status){
    var str = '--';
    if (1 == status) {
        str = '激活';
    }else if(2 == status){
        str = '已注销';
    }

    return str;
}

utils.search_get = function(name){
    var params = {};
    location.search.replace(/^\?/,'').split('&').forEach(function(x){
        params[ x.replace(/\=.*/,'') ] = decodeURIComponent( x.replace(/.*\=/,'') );
    });

    _search_get = function(name){
        return params[name];
    };

    return _search_get(name);
}

/* 质朴长存法  by lifesinger */
function toPad(num, n) {
    var len = num.toString().length;
    while(len < n) {
        num = "0" + num;
        len++;
    }
    return num;
}
