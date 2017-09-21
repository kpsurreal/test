/**
 * 前补0操作
 * @param number String 待操作字符串
 * @param length int 目标长度
 */
function addZero(number, length) {
    var buffer = "";
    if (number ==  "") {
        for (var i = 0; i < length; i ++) {
            buffer += "0";
        }
    } else {
        if (length < number.length) {
            return "";
        } else if (length == number.length) {
            return number;
        } else {
            for (var i = 0; i < (length - number.length); i ++) {
                buffer += "0";
            }
            buffer += number;
        }
    }
    return buffer;
}
$.fn.extend({
    omsEval: function(expression){
        var me = this;

        if( /\sOR\s/.test(expression) ){
            var exprs = expression.split('OR');
            var result = false;
            exprs.forEach(function(expr){
                expr = expr.trim();
                result = (result || $(me).omsEval(expr));
            });
            return result;
        }

        if( /\sAND\s/.test(expression) ){
            var exprs = expression.split('AND');
            var result = true;
            exprs.forEach(function(expr){
                expr = expr.trim();
                result = (result && $(me).omsEval(expr));
            });
            return result;
        }

        var data = $(this).getCoreData();

        var dataSrcArray = expression.split('|');
        var srcFlag = dataSrcArray.shift();
        var filterFlagArray = dataSrcArray;

        //获取目标数据
        var subData = data;
        srcFlag.split('.').forEach(function(item){
            /object|array/.test($.type(subData))
                ? (subData = subData[item])
                : (subData = '');
        });

        filterFlagArray.forEach(function(filterFlag){
            //数据过滤
            if(filterFlag){
                var filterArray = filterFlag.split(':');
                var filterFuncName = filterArray.shift();
                try{
                    filterFuncName && (
                        subData = $.omsFilters[filterFuncName].apply( $(me),[subData].concat(filterArray) )
                    );
                }catch(e){
                    subData = '';
                    (window.requestAnimationFrame||setTimeout)(function(){console.warn(filterArray+' '+filterFuncName);throw e;});
                }
            }
        });

        return $.type(subData) == 'undefined' ? '' : subData;
    },
    omsEvalAttr: function(attrName){
        return $(this).omsEval( $(this).attr(attrName) );
    },
    parseString: function(str){
        var me = $(this);
        var prefix = '\\$\\{';
        var suffix = '\\}';
        var regexp = new RegExp(prefix + '([^' +suffix+ ']*)?' + suffix,'g');

        return str.replace(regexp,function(str,expr,startIndex,wholeStr){
            return me.omsEval(expr);
        });
    },
    parseAttr: function(attrName){
        return $(this).parseString( $(this).attr(attrName) );
    },
    render: function(data){
        var me = this;
        //保存原数据
        $(me).setCoreData(data);

        //装载数据
        $(me).find('[data-src]').addBack('[data-src]').each(function(){
            var $this = $(this);
            var expr = $this.attr('data-src');
            var result = $(me).omsEval(expr);
            var tagName = $this.prop('tagName').toLowerCase();

            switch (tagName) {
                case 'input':
                    var input_type = $this.prop('type');
                    switch ( input_type ) {
                        case 'checkbox':
                            result = (result==1||result===true);
                            // 特殊处理，以免runtime没有时依旧可以提交下单
                            if (Object.prototype.toString.call(data.runtime) == '[object Object]' && Object.keys(data.runtime).length == 0) {
                                $this.prop('disabled','disabled');
                                $this.attr('data-disabled', 'true');
                                $this.prop('checked',false);
                            }else{
                                $this.prop('disabled',false);
                                $this.attr('data-disabled', 'false');
                                $this.prop('checked',result);

                                if (('marketHSH' == data.market || 'marketHSZ' == data.market) && data.support_market) {
                                    var marketSupportArr = addZero(data.support_market.toString(2), 4).split('');
                                    var marketSupport = marketSupportArr[marketSupportArr.length - 1 - 1];
                                    if (1 != marketSupport) {
                                        $this.prop('disabled','disabled');
                                        $this.attr('data-disabled', 'true');
                                        $this.prop('checked',false);
                                        // data.checked = false;
                                        // $(me).setCoreData(data);
                                        // $(me).removeClass('checked');
                                    }
                                }
                            }
                            break;
                        case 'radio':
                            result = (result==1||result===true);
                            $this.prop('checked',result);
                            break;
                        // case 'date':
                        //     result = result.toString().substr(0,10);
                        //     $this.val(result);
                        //     break;
                        default:
                            $this.val(result);
                    }

                    $this.on('change',function(){
                        var new_result = /checkbox|radio/.test(input_type) ? $(this).prop('checked') : $(this).val().trim();
                        $(this).toggleClass('dirty',(new_result!=result));
                    });

                    break;
                case 'option':
                    // $this.val(result).html(result);
                    if(typeof result == 'string'){
                        $this.val(result)[0].innerHTML = result;
                    }else{
                        $this.val(result).html(result);
                    }
                    break;
                case 'img':
                    $this.attr('src',result);
                    break;
                default:
                    if(typeof result == 'string'){
                        $this[0].innerHTML = result;
                    }else{
                        $this.html(result)
                    }
            }

            var render_once = $this.is('[render-once]');
            render_once && $this.removeAttr('data-src');
            $this = null;
        });

        (window.requestAnimationFrame||window.setTimeout)(function(){
            $(me).find('[data-src]').trigger('data-src:rendered');
        });

        $(me).find('[if]').addBack('[if]').each(function(){
            var expr = $(this).attr('if');
            var result = $(me).omsEval(expr);
            result ? $(this).removeClass('if-stuck').addClass('if-pass').show() : $(this).addClass('if-stuck').removeClass('if-pass').hide();
            $(this).is('[render-once].if-stuck') && $(this).remove();
        });

        $(me).find('[data-href]').addBack('[data-href]').each(function(){
            var expr = $(this).attr('data-href');
            var result = $(me).omsEval(expr);
            $(this).attr('href',result).on('click',function(event){
                event.originalEvent.cancelBubble = true;
            });
        });

        $(me).find('[data-class]').addBack('[data-class]').each(function(){
            var expr = $(this).attr('data-class');
            var result = $(me).omsEval(expr);
            $(this).removeClass( $(this).attr('oms-class')||'' ).attr('oms-class',result);
            $(this).addClass(result);
        });

        me.trigger('rendered');

        return me;
    },
    getCoreData: function(){
        return $(this).data('srcData');
    },
    setCoreData: function(data){
        //本地调试处理
        (/192\.168\.0/.test(location.host) || /127\.0\.0/.test(location.host)) && $(this).off('dblclick').on('dblclick',function(){
            console && console.log && console.log( $(this).getCoreData() );
        });

        return $(this).data('srcData',data);
    },
    reRender: function(){
        var data = $(this).getCoreData();
        $(this).render(data);
    },
    renderTable: function(arr){
        arr = $.type(arr)=='array' ? arr : [];

        var table = $(this);
        var row_tpl = table.find('[row-tpl]').html();
        var rows_body = table.find('[rows-body]');
        var rows_total = table.find('[rows-total]');
        rows_body.html(
            arr.map(function(rowData){
                return $(row_tpl).render(rowData);
            })
        );

        var total_info = {};
        arr.forEach(function(item){
            for(var i in item){
                if( /id$/.test(i) ){ //id 特别保留处理
                    !total_info[i] && (total_info[i] = item[i]);
                    continue;
                }else{
                    total_info['total_'+i] = (total_info['total_'+i]||0)+(+(item[i]));
                }
            }
        });
        rows_total.render(total_info).show();

        !arr.length && rows_total.hide();
        table.find('.nothing-nothing').toggleClass('nothing', !arr.length);

        this.trigger('table:rendered');
        return this;
    }
});

$.extend({
    omsRender: function(tpl,data){
        return $(tpl).render(data);
    }
});
