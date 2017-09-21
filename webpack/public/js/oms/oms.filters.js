$.extend({
    omsFilters:{
        '--': function(res){
            return (!/^\d+$/.test(res) && !res) ? '- -' : res;
        },
        '+': function(num1,num2){
            return (+num1||0) + (+num2||0);
        },
        'plus': function(num1,expr){
            return (+num1||0) + (+$(this).omsEval(expr)||0);
        },
        '-': function(num1,num2){
            return (+num1||0) - (+num2||0);
        },
        'minus': function(num1,expr){
            return (+num1||0) - (+$(this).omsEval(expr)||0);
        },
        '/': function(num1,num2){
            return (+num2||0) ? (+num1||0)/(+num2) : 0;
        },
        'devided_by': function(num1,expr){
            var divisor = +$(this).omsEval(expr)||0;
            return divisor ? (+num1||0)/divisor : 0;
        },
        'multiply_by': function(num1,expr){
            var by = +$(this).omsEval(expr)||0;
            return (+num1||0)*by || 0;
        },
        '=': function(num1,num2){
            return parseFloat(num1)===parseFloat(num2);
        },
        '!=': function(num1,num2){
            return parseFloat(num1)!==parseFloat(num2);
        },
        '<': function(num1,num2){
            return (parseFloat(num1)||0)<parseFloat(num2);
        },
        'smallThan': function(num1,expr){
            var num2 = +$(this).omsEval(expr)||0;
            return (+num1||0) < num2;
        },
        '<=': function(num1,num2){
            return (parseFloat(num1)||0)<=parseFloat(num2);
        },
        'smallThanOrEqual': function(num1,expr){
            var num2 = +$(this).omsEval(expr)||0;
            return (+num1||0) <= num2;
        },
        '>': function(num1,num2){
            return (parseFloat(num1)||0)>parseFloat(num2);
        },
        'largeThan': function(num1,expr){
            var num2 = +$(this).omsEval(expr)||0;
            return (+num1||0) > num2;
        },
        '>=': function(num1,num2){
            return (parseFloat(num1)||0)>=parseFloat(num2);
        },
        'largeThanOrEqual': function(num1,expr){
            var num2 = +$(this).omsEval(expr)||0;
            return (+num1||0) >= num2;
        },
        '是不是': function(val){
            return +val ? '是' : '否';
        },
        '?': function(val,result1,result2){
            return val ? result1 : result2;
        },
        length: function(x){
            return (x).toString().length;
        },
        parseString: function(noop,str){
            return $(this).parseString(str);
        },
        subString: function(str,start,length){
            return str.toString().substr(start,length);
        },
        equalNum: function(num1,num2){
            return parseFloat(num1)===parseFloat(num2);
        },
        equalString: function(x,str){
            return x==str;
        },
        notNum: function(num){
            return !/^\d+$/.test(num);
        },
        notEqualNum: function(num1,num2){
            return parseFloat(num1)!==parseFloat(num2);
        },
        numEqual: function(num1,num2){
            return /^\d+$/.test(num1) && parseFloat(num1)==parseFloat(num2);
        },
        numNotEqual: function(num1,num2){
            return /^\d+$/.test(num1) && parseFloat(num1)!==parseFloat(num2);
        },
        inNumsList: function(){
            var numslist = Array.prototype.splice.call(arguments,0);
            var num = numslist.shift();
            return numslist.filter(function(item){return $.omsFilters.equalNum(num,item)}).length > 0;
        },
        outNumsList: function(){
            var numslist = Array.prototype.splice.call(arguments,0);
            var num = numslist.shift();
            return numslist.filter(function(item){return $.omsFilters.equalNum(num,item)}).length <= 0;
        },
        isFalse: function(bool){
            return !bool;
        },
        numFormat: function(num,formator){
            return numeral(num).format( formator||'0,0' );
        },
        toFixed: function(num,demicalCount){
            var result = parseFloat(num).toFixed(demicalCount);
            return result.toString()=='NaN' ? '- -' : result;
        },
        unixTime: function(unixTimeStamp){
            var momentor = /\-/.test(unixTimeStamp) ? moment : moment.unix;// if hyphen is tested, it's sqlTimeStr and use moment, else use moment.unix
            return  moment().format('YYYY-MM-DD') === momentor(unixTimeStamp).format('YYYY-MM-DD')
                    ? momentor(unixTimeStamp).format('HH:mm:ss')
                    : momentor(unixTimeStamp).format('M月D日 HH:mm:ss')
        },
        unixTimeOnToday: function(unixTimeStamp){
            return  moment().format('YYYY-MM-DD') === moment.unix(unixTimeStamp).format('YYYY-MM-DD');
        },
        moment: function(sqlTimeStr,formator){
            var result = moment(sqlTimeStr||'').format(formator||'MM/DD');
            return result=="Invalid date" ? "--" : result;
        },
        sqlTimeDay: function(sqlTime,formator){
            var result = moment(sqlTime).format(formator||'YYYY-MM-DD');
            return result=="Invalid date" ? "--" : moment().format(formator||'YYYY-MM-DD');
        },
        unixDay: function(unixTimeStamp){
            return Number(unixTimeStamp) ? moment.unix(unixTimeStamp).format('YYYY-MM-DD') : '--';
        },
        numeral: function(num,formator){
            if (num === '' || num === '--') {
                return '--';
            }
            return /null|undefined/.test($.type(num)) ? '--' : numeral(num).format(formator);
        },
        numeralTrade5: function(num,formator){
            if (num === '' || num === '--' || num === '-') {
                return '- -';
            }
            return /null|undefined/.test($.type(num)) ? '- -' : numeral(num).format(formator);
        },
        signNumeral: function(num,formator){
            if(num=='-'){return num;}

            noSign = +(num||0).toString().replace(/^(\-|\+)/,'');
            return (num<0 ? '-' : '+') + numeral(noSign).format(formator);
        },
        mSignNumeral: function(num,formator){
            noSign = +(num||0).toString().replace(/^(\-|\+)/,'');
            return ((num||0)==0 ? '' : ((num||0)<0 ? '-' : '+')) + numeral(noSign).format(formator);
        },
        rgColor: function(num,middle){
            return num<(middle||0) ? 'green' : 'red';
        },
        rmgColor: function(num,middle){
            return +(num||0)==(middle||0) ? '' : (num<(middle||0) ? 'green' : 'red');
        },
        rmgColorTrade5: function(num,expr){
            var middle = (+$(this).omsEval(expr)||0);
            if ('-' == num) {
                return ''
            }else{
                return +(num||0)==(middle||0) ? '' : (num<(middle||0) ? 'green' : 'red');
            }
        },
        checkBlackList: function(status){
            return true === status ? 'blackList' : '';
        },
        getPureCode: function(code){
            return code.replace(/\D/g,'');
        },
        showUserName: function(real_name){
            if (!/^\d+$/.test(real_name) && !real_name) {
                real_name = '- -';
            }
            var info = $(this).getCoreData();
            if (2 == info.last_handler.status) {
                return real_name + '（已注销）';
            }else{
                return real_name;
            }
        },
        fundTypeCH: function(fund_type){
            if (undefined == fund_type) {
                return '';
            }
            switch(fund_type.toString()){
                case '1': return '进取型操盘乐'; //进取型
                case '2': return '分红乐';
                case '3': return '公益乐';
                case '4': return '无忧型操盘乐'; //无忧型
                case '5': return '稳赢型操盘乐'; //稳赢型
            }
            return '';
        },
        settlementTypeCH: function(settlement_type){
            if (undefined == settlement_type) {
                return '';
            }
            switch(settlement_type.toString()){
                case '1': return '进取'; //进取型
                case '2': return '分红';
                case '3': return '分红';
                case '4': return '公益';
                case '6': return '无忧'; //无忧型
                case '7': return '稳盈'; //稳盈型
            }
            return '';
        },
        entrustModelCH: function(modelCode){
            //1003740 个股交易历史 交易方向 不用显示委托方式
            switch(modelCode.toString()){
                case '1': return '限价';
                case '2': return '市价';
                case '3': return '市价';
                case '4': return '市价';
                case '5': return '市价';
                case '6': return '市价';
                case '7': return '市价';
                case '8': return '市价';
                case '9': return '强平';
            }
        },
        entrustModelType: function(modelCode){
            switch(modelCode.toString()){
                case '2': return '市价';
                case '3': return '市价(对手方最优价格)';
                case '4': return '市价(本方最优价格)';
                case '5': return '市价(即时成交剩余撤单)';
                case '6': return '市价(最优五档即时成交剩余撤单)';
                case '7': return '市价(全额成交或撤单)';
                case '8': return '市价(最优五档即时成交剩余转限)';
            }
        },
        entrustTypeCH: function(typeCode){
            switch(typeCode.toString()){
                case '1': return '买入';
                case '2': return '卖出';
                case '101': return '融券';
            }
        },
        isFinish: function(order){
            var order = $(this).getCoreData();
            if( order.status == 3 ){ return true; }
            if( order.status == 5 ){ return true; }
            if( order.status == 7 ){ return true; }
            if( order.status == 8 ){ return true; }
            if( order.status == 9 ){ return true; }
            if( order.status == 105 ){ return true; }
            if( order.status == 108 ){ return true; }
            if( order.order_status == 4 ){ return true; }
            if( order.cancel_status == 2 ){ return true; }
            return false;
        },
        //这是新的状态流转代码
        statusCH: function(statusCode){
            switch(statusCode.toString()){
                case '1': return '等待执行';
                case '2': return '已委托';
                case '3': return '已退回';
                case '4': return '部分成交';
                case '5': return '全部成交';
                case '6': return '等待撤单';
                case '7': return '已撤单';
                case '8': return '废单';
                case '9': return '已删除';

                //多策略订单合并状态
                case '101': return '未完成';
                case '105': return '已完成';
                case '108': return '已完成（有废单）';

                //刚刚添加的订单
                case '0': return '提交中..';

                default: return '- -';
            }
        },
        orderStatusCH: function(statusCode){
            switch((parseInt(statusCode)+1).toString()){
                case '1': return '提交订单';
                case '2': return '等待分配';
                case '3': return '等待委托';
                case '4': return '等待回报';
                default: return '- -';
            }
        },
        cancelStatusCH: function(statusCode){
            switch((parseInt(statusCode)+1).toString()){
                case '1': return '执行撤单';
                case '2': return '等待撤单';
                default: return '- -';
            }
        },
        orderWorkFlow: function(done_statuscode){
            var done_statuscode = parseInt(done_statuscode);
            var tpl = $.multiline(function(){/*!@preserve
                <span class="title">下单流程</span>
                <span class="gray" statuscode="1">提交订单</span>
                <span class="gray" statuscode="2">审核分配</span>
                <span class="gray" statuscode="3">委托订单</span>
                <span class="gray" statuscode="4">成交回报</span>
            */console.log()});
            var dom = $(tpl);
            dom.filter('[statuscode]').each(function(){
                var statuscode = parseInt($(this).attr('statuscode'));
                statuscode <= done_statuscode && $(this).removeClass('gray').addClass('green');
                statuscode == done_statuscode+1 && $(this).removeClass('gray').addClass('red');
            });
            return dom;
        },
        cancelWorkFlow: function(done_statuscode){
            var done_statuscode = parseInt(done_statuscode);
            var tpl = $.multiline(function(){/*!@preserve
                <span class="title">撤单流程</span>
                <span class="gray" statuscode="1">提交撤单</span>
                <span class="gray" statuscode="2">执行撤单</span>
                <span></span>
                <span></span>
            */console.log()});
            var dom = $(tpl);
            dom.filter('[statuscode]').each(function(){
                var statuscode = parseInt($(this).attr('statuscode'));
                statuscode <= done_statuscode && $(this).removeClass('gray').addClass('green');
                statuscode == done_statuscode+1 && $(this).removeClass('gray').addClass('red');
            });
            return dom;
        },
        getProductLink: function(product){
            if(!product){
                var core_data = $(this).getCoreData();
                if(core_data.id && core_data.name){
                    product = core_data;
                }
            }
            var host = "";
            return product ? '<span>' + product.name + '</span>' : '';
            // return product ? '<a target="_blank" href="'+host+(window.REQUEST_PREFIX||'')+'/oms/'+product.id+'">'+product.name+'</a>' : '';
        },
        getRowProductLink: function(){
            var product = $(this).getCoreData();
            var host = "";
            return product ? '<span>' + product.name + '</span>' : '';
            // return product ? '<a target="_blank" href="'+host+(window.REQUEST_PREFIX||'')+'/oms/'+product.id+'">'+product.name+'</a>' : '';
        },
        getRiskDegreeBg: function(degree){
            if( (+degree||0)<=0 ){
                return 'red';
            }
            if( (+degree||0)<=1 ){
                return 'yellow';
            }
            return '';
        },
        getRunningDay: function(val){
            var order = $(this).getCoreData();
            var is_forever = order.is_forever;
            if (1 == is_forever) {
                val = '--';
            }
            return val;
        },
        orDefault: function(val,expression){
            return parseFloat(val) ? val : $(this).omsEval( expression );
        },
        mapVal: function(val,map){
            var result = '';
            map.split(',').forEach(function(item){
                var itemArr = item.split('->');
                result = itemArr[0]==val ? itemArr[1] : result;
            });
            return result;
        },
        getString: function(noop,str){
            //依赖 omsEval
            //解析 abc${expr}def，求出 expr 的值并合并到字符串中
            var _this = this;

            var prefix = '\\$\\{';
            var suffix = '\\}';
            var regexp = new RegExp(prefix + '([^' +suffix+ ']*)?' + suffix,'g');

            return str.replace(regexp,function(str,expr,startIndex,wholeStr){
                return _this.omsEval(expr);
            });
        },
        getMangerHref: function(noop,str){
            var host = /^192\.168\.0/.test(location.host) ? "http://192.168.0.21:32080" : "http://10.172.2.205:16801";
            return host + $.omsFilters.getString.call(this,null,str);
        },
        getHostHref: function(noop,str){
            var host = /^192\.168\.0/.test(location.host) ? "http://192.168.0.21:32080" : "https://www.caopanman.com";
            return host + $.omsFilters.getString.call(this,null,str);
        },
        unixTimeSpan: function(noop,expr){
            var timestamp = $(this).omsEval(expr)*1000;
            var result = Math.floor( Math.abs(new Date().valueOf()-timestamp)/(24*3600*1000) );
            return result;
        },
        getBalanceAmount: function(num){
            return num>0 ? num : $.pullValue(window,'PRODUCT.runtime.balance_amount',0);
        },
        submitPeriod: function(){
            // var timeStr = moment().hours();
            // //16-17点，禁止下单
            // if (timeStr == 16) {
            //     return false;
            // }
            return true;
        },
        notSubmitPeriod: function(){
            // var timeStr = moment().hours();
            // //16-17点，禁止下单
            // if (timeStr == 16) {
            //     return true;
            // }
            return false;
        },
        runningPeriod: function(){
            var product = $(this).getCoreData();
            if (product.is_forever == 1 || (product.range <= 1 && product.left_running_day > 0)) {
                return true;
            }
            return false;
        },
        notRunningPeriod: function(){
            var product = $(this).getCoreData();
            if (product.is_forever == 1 || (product.range <= 1 && product.left_running_day > 0)) {
                return false;
            }
            return true;
        },
        getPageControls: function(){
            var me = this;
            var page_info = $(this).getCoreData();

            //默认：鱼尾提供的分页 {page:1, max:10, total:100, count:10}

            if(page_info.current_page){
                //buty 提供的分页 {current_page:1, last_page:10, total:100, per_page:10}
                page_info.page = page_info.current_page;
                page_info.max = page_info.last_page;
                page_info.count = page_info.per_page;
            }

            if($.pullValue(page_info,'max',0)<=1){return '';}

            var tpl = $.multiline(function(){/*!@preserve
                <div>
                    <span class="first">首页</span>
                    <span class="pre">上一页</span>

                    <b class="navs"></b>

                    <span class="next">下一页</span>
                    <span class="last">末页</span>

                    <b class="total"></b>
                </div>
            */console.log()});

            var ctrls = $(tpl);

            var navs = [];navs.length = page_info.max;navs=navs.join('.').split('.');//创建含空字符串的数组
            ctrls.find('.navs').html(navs.map(function(x,i){
                var page_num = i+1;
                return (
                    // 策略1: 展示首页，尾页，当前页面临近页面
                    // page_num==1 ||
                    // page_num==page_info.max ||
                    // Math.abs(page_num-page_info.page)<=3

                    // 策略2: 展示首尾及当前页面 临近页面
                    Math.min(
                        Math.abs(page_num-1),
                        Math.abs(page_num-page_info.max),
                        Math.abs(page_num-page_info.page)
                    ) < 3
                ) ? $('<span class="page-ctrl '+(page_num==page_info.page?'active':'')+'" page-num="'+page_num+'">'+page_num+'</span>')
                  : $('<i>· · ·<i>');
            }));

            ctrls.find('.navs i+i').remove();

            ctrls.find('.total').html('总记录：'+page_info.total);
            ctrls.on('click','>span',function(){
                var class_name = $(this).attr('class');
                class_name=='first' && ctrls.find('.page-ctrl:first').click();
                class_name=='last' && ctrls.find('.page-ctrl:last').click();
                class_name=='pre' && ctrls.find('.page-ctrl.active').prev().click();
                class_name=='next' && ctrls.find('.page-ctrl.active').next().click();
            });

            ctrls.on('click','.page-ctrl',function(){
                if($(this).is('.active')){return;}
                $(this).addClass('active').siblings().removeClass('active');
                me.trigger({
                    type: 'nav',
                    sponsor: $(this),
                    page_num: $(this).attr('page-num')
                });
            });

            me.one('refresh',function(){
                me.trigger({
                    type: 'nav',
                    page_num: ctrls.find('.page-ctrl.active').attr('page-num')
                });
            });

            return ctrls;
        },
        getRangeInput: function(initValue,tags_num){
            var range,container,new_range,drag,start_screenX,start_screenY,start_top,start_left,max_width,progress;
            var tpl = $.multiline(function(){/*!@preserve
                <div class="range-component">
                    <div class="stick-wrap">
                        <div class="stick">
                            <span class="bar"></span>
                            <span class="dot"></span>
                        </div>
                    </div>
                    <div class="tags"></div>
                </div>
            */console.log()});
            var ctrl = $(tpl).css('position','relative').addClass($(this).attr('color')||'blue');

            var stickwrap = ctrl.find('.stick-wrap');
            var stick = ctrl.find('.stick');
            var bar = ctrl.find('.bar');
            var dot = ctrl.find('.dot');

            dot.on('mousedown',mousedown).on('click',function(){return false;});
            stickwrap.on('click',wrapclick);
            $(window).on('mouseup',mouseup);
            $(window).on('mousemove',mousemove);
            $(window).on('resize',resize);
            ctrl.on('destroy',function(){
                $(window).off('mouseup',mouseup);
                $(window).off('mousedown',mousedown);
                $(window).off('resize',resize);
                mouseup();
            });

            tags_num = +tags_num || 5;
            var tags = [];tags.length = tags_num;tags=tags.join('.').split('.');//创建含空字符串的数组
            ctrl.find('.tags').append(tags.map(function(x,i,a){
                var value = i/(tags_num-1);
                return $('<span class="tag">').html(value*100 + '%').css('left',value*100 + '%').on('click',setValue.bind(null,value));
            }));

            setTimeout(function(){
                max_width = $(stick).width();
                container = ctrl.parent();
                setValue(initValue||0);

                container.on('setValue',function(event){
                    setValue(event.value);
                });
            },50);

            return ctrl;

            function mousedown(event){
                drag = true;
                start_screenX = event.screenX;
                start_screenY = event.screenY;
                start_left = (parseInt(dot.css('left')) || 0);
                start_top = (parseInt(dot.css('top')) || 0);

                dot.addClass('mousedown');
                $('body').addClass('range-mousedown');
            }

            function mouseup(){
                drag = false;
                $('body').removeClass('range-mousedown');
                dot.removeClass('mousedown');

                setValue(new_range);
            }

            function mousemove(event){
                max_width = max_width || $(stick).width();
                if(drag){
                    var diff_screenX = event.screenX - start_screenX;
                    var diff_screenY = event.screenY - start_screenY;
                    var diff_range = diff_screenX/max_width;
                    new_range = Math.max(Math.min(range+diff_range,1),0);
                    changeRangeView( new_range );
                }
            }

            function wrapclick(event){
                var new_progress = event.offsetX;
                var diff_progress = new_progress - progress;
                var diff_range = diff_progress/max_width;
                var new_value = Math.max(Math.min(+range+diff_range,1),0);
                setValue( new_value );
            }

            function setValue( value ){
                if(range==value){return;}
                container.attr('old_value',range);//展示初始值，方便大燕测试
                range = new_range = value;
                container = container || getContainer();
                changeRangeView( new_range );
                container.attr('value',range).trigger({type:'changed',value:range});
            }

            function changeRangeView( new_range ){
                progress = new_range*max_width;

                var show_progress = Math.min(+new_range||0,1)*max_width;
                dot.css('left',show_progress-8);
                bar.css('width',show_progress);
            }

            function resize(){
                max_width = $(stick).width();
                changeRangeView( new_range );
            }

            function getContainer(){
                return ctrl.parent();
            }
        },
        getMagicSuggest: function(){
            var tpl = $.multiline(function(){/*!@preserve
                <div>
                    <ul class="magic-suggest"></ul>
                </div>
            */console.log()});

            var me = $(tpl);
            var opt = {};
            var scrollNum = 0;
            var market = 'marketA';
            setTimeout(function(){
                opt.container = me.parent();
                opt.input = opt.container.prev('input');
                
                opt.input.on('keyup',stockCodeSmartSuggest);

                var ul_id = $.randomId('magic-suggest-');
                me.find('ul').attr('id',ul_id);
                opt.input.attr('active-slide','#'+ul_id);

                opt.input.on('click',function(){
                    if( $(this).is('.pass') ){
                        var last_value = $(this).val();
                        $(this).attr('last_value', last_value);
                        $(this).val( last_value.replace(/[^\d]/g,'') ).change();
                    }
                }).on('blur',function(){
                    var last_value = $(this).attr('last_value') || '';
                    last_value.indexOf(opt.input.val().trim())===0 && $(this).val( last_value ).change();
                });
            },50);

            return me;

            //股票代码智能建议
            function stockCodeSmartSuggest(event){
                var keyCode = event.keyCode;
                if(keyCode==38){//上
                    if (0 != me.find('.magic-suggest').find('li.active').prev('li').length && 'none' !==  me.find('.magic-suggest').css('display') ) {
                        scrollNum -= 1;
                        me.find('.magic-suggest').find('li.active').prev('li').addClass('active').siblings().removeClass('active');
                        if ($('.magic-suggest').scrollTop() < scrollNum * 29 && $('.magic-suggest').scrollTop() > (scrollNum - 5) * 29) {

                        }else{
                            me.find('.magic-suggest').scrollTop((scrollNum) * 29);
                        }
                    }

                    return false;
                }
                if(keyCode==40){//下
                    if (0 != me.find('.magic-suggest').find('li.active').next('li').length && 'none' !==  me.find('.magic-suggest').css('display')) {
                        scrollNum += 1;

                        me.find('.magic-suggest').find('li.active').next('li').addClass('active').siblings().removeClass('active');
                        if ($('.magic-suggest').scrollTop() < scrollNum * 29 && $('.magic-suggest').scrollTop() > (scrollNum - 5) * 29) {

                        }else{
                            me.find('.magic-suggest').scrollTop((scrollNum-5) * 29);
                        }
                    }

                    return false;
                }
                if(keyCode==13){//return
                    if ('none' !==  me.find('.magic-suggest').css('display')) {
                        me.find('.magic-suggest').find('li.active').click();
                        me.find('.magic-suggest').scrollTop(0);
                    }
                    // opt.input && opt.input.blur();
                    return false;
                }
                scrollNum = 0;
                me.find('.magic-suggest').scrollTop((scrollNum) * 29);

                var last_suggest_timestamp = new Date().valueOf();
                me.find('.magic-suggest').attr('last_suggest_timestamp',last_suggest_timestamp);
                opt.container.addClass('loading');

                var str = (window.REQUEST_PREFIX||'')+'/oms/helper/code_genius?stock_code='+opt.input.val();
                if (undefined != opt.input.attr('data-market')) {
                    market = opt.input.attr('data-market');
                }
                //allow_asset 可以判断用户查看股票代码的权限
                if ('marketA' == market) {
                    //repo 显示国债证券 
                    //机构版条件国债证券
                    if(window.LOGIN_INFO.org_info.theme != 3){
                        str += '&assets_class=e,f,repo';
                    }else{
                        str += '&assets_class=e,f';
                    }
                    
                }else if('marketHSH' == market){
                    str += '&assets_class=ehksh';
                }else if('marketHSZ' == market){
                    str += '&assets_class=ehksz';
                }
                // if (location.pathname.includes('policy_instruction')) {
                //     str += '&assets_class=E';
                // }
                $.getJSON(str).done(function(res){
                    if( last_suggest_timestamp!=me.find('.magic-suggest').attr('last_suggest_timestamp') ){return;}

                    if(res.code==0 || res.code==1123124){
                        me.find('.magic-suggest').html(
                            res.data.map(function(stock,index){
                                var li = $('<li>').attr({
                                    'class': !index ? 'active' : '',
                                    'click-active': '_self'
                                }).html(stock.stock_code + '.' + stock.exchange.slice(0,2) +' &nbsp; '+ stock.stock_name).on('click',function(){
                                    opt.input && opt.input.trigger({type:'stock_code:suggest',stock:stock});
                                    me.find('.magic-suggest').slideUp(200);
                                });
                                return li.get(0);
                            })
                        );

                        //唯一指定推荐项处理
                        var first_stock = $.pullValue(res,'data.0','');
                        if( first_stock && res.data.length===1 && opt.input && first_stock.stock_id.indexOf(opt.input.val())===0 ){
                            opt.input.trigger({type:'stock_code:suggest',stock:first_stock});
                            return me.find('.magic-suggest').slideUp();
                        }

                        me.find('.magic-suggest').slideDown(300);
                    }else{
                        $.omsAlert('获取建议证券列表失败！',false,300);
                    }
                }).always(function(){
                    if( last_suggest_timestamp!=me.find('.magic-suggest').attr('last_suggest_timestamp') ){return;}
                    opt.container.removeClass('loading');
                });
            }
        },
        getPositionWords: function(arr){
            if (!arr) {
                return '--';
            }
            if ('false' == arr) {
                return '--';
            }
            var obj = JSON.parse(arr);
            if (obj.length == 0) {
                return '--';
            }

            var product = $(this).getCoreData();
            var risk_arr = [];
            obj.forEach(function(e){
                risk_arr.push({
                    net_value: e.net_value,
                    position: e.position / 100
                })
            });
            //白名单特殊待遇啊
            var white_list = [
                11308,    //钟杰操盘专户02期
                11319,    //钟杰操盘专户03期
                11333,    //黎明02期
                11258     //清楚理财01期
            ];
            if( white_list.indexOf(product.id)>-1 ){return '--';}

            var tpl = $.multiline(function(){/*!@preserve
                <span>
                    <span data-class="position|=:0|?:red:">
                        <span data-class="position|=:0|?:red:" data-src="net_diff|numeral:0.0000" render-once></span> / <span data-class="position|=:0|?:red:" data-src="position|numeral:0%" render-once></span>
                    </span>
                    <span class="dot-tip exclamation">
                        <div>
                            <em>i</em>
                            <str>
                                <span class="msg">
                                    <span>
                                        风险提示：净值再下降<span data-src="net_diff|numeral:0.0000" render-once></span>则需要将仓位下调至<span data-src="position|numeral:0%" render-once></span>
                                    </span>
                                </span>
                            </str>
                        </div>
                    </span>
                </span>
            */console.log()});

            var result = $(tpl);
            var net_value = $.pullValue(product,'runtime.net_value',1);
            var net_diff;
            var position;

            // var risk_line = [
            //     {net_value: 1.10,     position: 0.6},
            //     {net_value: 1.03,     position: 0.5},
            //     {net_value: 0.85,     position: 0.3},
            //     {net_value: 0.80,     position: 0.1},
            //     {net_value: 0.768,    position: 0}
            // ].filter(function(line){
            //     return net_value>line.net_value;
            // })[0] || {net_value: 0.768,    position: 0};
            var risk_line = risk_arr.filter(function(line){
                return net_value>line.net_value;
            })[0] || risk_arr.sort(function(a, b){
                return a.net_value>b.net_value;
            })[0];
            position = risk_line.position;
            net_diff = net_value-risk_line.net_value;

            result.render({
                net_diff: net_diff,
                position: position
            });

            result.find('[data-class]').removeAttr('data-class');

            return result;
        },
        // 判断是否触发风控线
        getPositionTips: function(arr){


            if(window.LOGIN_INFO.org_info.theme != 3){
                return false;
            }


            if (!arr) {

                return false;
            }
            if ('false' == arr) {
                return false;
            }
            var obj = JSON.parse(arr);
            if (obj.length == 0) {
                return false;

            }

            var product = $(this).getCoreData();
            var risk_arr = [];
            obj.forEach(function(e){
                risk_arr.push({
                    net_value: e.net_value,
                    position: e.position / 100
                })
            });
            //白名单特殊待遇啊
            var white_list = [
                11308,    //钟杰操盘专户02期
                11319,    //钟杰操盘专户03期
                11333,    //黎明02期
                11258     //清楚理财01期
            ];
            if( white_list.indexOf(product.id)>-1 ){return '--';}

            var result = '';
            var net_value = $.pullValue(product,'runtime.net_value',1);
            var net_diff;
            var position = $.pullValue(product,'runtime.position',1);


            var risk_line = risk_arr.filter(function(line){
                return net_value < line.net_value && position > line.position;
            })

            if (risk_line.length > 0) {

                return risk_line;
            }else{
                return false;
            }
            
        },

        getTips:function(arr){
            if (!arr) {
                return [];
            }
            if ('false' == arr) {
                return [];
            }
            var obj = JSON.parse(arr);
            if (obj.length == 0) {
                return [];
            }

            var product = $(this).getCoreData();
            var risk_arr = [];
            obj.forEach(function(e){
                risk_arr.push({
                    net_value: e.net_value,
                    position: e.position / 100
                })
            });
            //白名单特殊待遇啊
            var white_list = [
                11308,    //钟杰操盘专户02期
                11319,    //钟杰操盘专户03期
                11333,    //黎明02期
                11258     //清楚理财01期
            ];
            if( white_list.indexOf(product.id)>-1 ){return '--';}

            var result = '';
            var net_value = $.pullValue(product,'runtime.net_value',1);
            var net_diff;
            var position = $.pullValue(product,'runtime.position',1);


            var risk_line = risk_arr.filter(function(line){
                return net_value < line.net_value && position > line.position;
            })

            var result = risk_line[0];
            risk_line.forEach(function(ele){
                if(ele.position<result.position){
                    result = ele
                }
            })
            if (risk_line.length > 0) {

                return '当前已触发风控规则“单位净值<'+result.net_value+'，仓位不得≥'+result.position*100+'%”';
            }else{
                return '';
            }

        },

        getRiskLineWords: function(settlementCH){
            var product = $(this).getCoreData();

            //白名单特殊待遇啊
            var white_list = [
                11308,    //钟杰操盘专户02期
                11319,    //钟杰操盘专户03期
                11333,    //黎明02期
                11258     //清楚理财01期
            ];
            if( white_list.indexOf(product.id)>-1 ){return '--';}

            var tpl = $.multiline(function(){/*!@preserve
                <span>
                    <span data-class="position|=:0|?:red:">
                        <span data-class="position|=:0|?:red:" data-src="net_diff|numeral:0.0000" render-once></span> / <span data-class="position|=:0|?:red:" data-src="position|numeral:0%" render-once></span>
                    </span>
                    <span class="dot-tip exclamation">
                        <div>
                            <em>i</em>
                            <str>
                                <span class="msg">
                                    <span>
                                        风险提示：净值再下降<span data-src="net_diff|numeral:0.0000" render-once></span>则需要将仓位下调至<span data-src="position|numeral:0%" render-once></span>
                                    </span>
                                </span>
                            </str>
                        </div>
                    </span>
                </span>
            */console.log()});

            var result = $(tpl);
            var net_value = $.pullValue(product,'runtime.net_value',1);
            var net_diff;
            var position;

            if(settlementCH=='进取'||settlementCH=='公益'){
                // 净值范围：<0.768，限制仓位小于0。清盘结算
                // 净值范围：<0.80，限制仓位小于0.1。
                // 净值范围：<0.85，限制仓位小于0.3。
                // 净值范围：<1.03，限制仓位小于0.5。
                // 净值范围：<1.10，限制仓位小于0.6。
                // 净值范围：>=1.1，限制仓位小于1.0。

                var risk_line = [
                    {net_value: 1.10,     position: 0.6},
                    {net_value: 1.03,     position: 0.5},
                    {net_value: 0.85,     position: 0.3},
                    {net_value: 0.80,     position: 0.1},
                    {net_value: 0.768,    position: 0}
                ].filter(function(line){
                    return net_value>line.net_value;
                })[0] || {net_value: 0.768,    position: 0};
                position = risk_line.position;
                net_diff = net_value-risk_line.net_value;
            }

            if(settlementCH=='分红'){
                // 净值范围：<0.87，限制仓位小于0。清盘结算
                // 净值范围：<0.91，限制仓位小于0.1。
                // 净值范围：<1.02，限制仓位小于0.3。
                // 净值范围：<1.10，限制仓位小于0.5。
                // 净值范围：>=1.1，限制仓位小于1.0。
                var risk_line = [
                    {net_value: 1.10,     position: 0.5},
                    {net_value: 1.02,     position: 0.3},
                    {net_value: 0.91,     position: 0.1},
                    {net_value: 0.87,     position: 0}
                ].filter(function(line){
                    return net_value>line.net_value;
                })[0] || {max: 0.87,     position: 0};
                position = risk_line.position;
                net_diff = net_value-risk_line.net_value;
            }

            if(settlementCH=='无忧'||settlementCH=='稳盈'){
                var early_warning = +$.pullValue(product,'early_warning')||0;
                var stop_loss = +$.pullValue(product,'stop_loss')||0;
                if(net_value > early_warning){
                    position = 0.4;
                    net_diff = net_value-early_warning;
                }else{
                    position = 0;
                    net_diff = net_value-stop_loss;
                }
            }

            result.render({
                net_diff: net_diff,
                position: position
            });

            result.find('[data-class]').removeAttr('data-class');

            return result;
        }
    }
});
