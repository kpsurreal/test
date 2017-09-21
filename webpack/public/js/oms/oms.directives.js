// 自定义指令集合，click 触发生效
$(function(){
    // click-value 指令，为指定元素指定 value 值
    $('html').on('click','[click-value]:not(.disabled)',function(){
        var select = $(this).attr('click-value').split(':')[0];
        var value = $(this).attr('click-value').split(':')[1];

        //增加对操作符的支持
        var operator = value.match(/^\+|\-/);
        if(operator){
            value = value.slice(1)*1;
            switch (operator[0]) {
                case '+':
                    value = +(+$(select).val()+(+value)).toPrecision(12);
                    break;
                case '-':
                    value = +(+$(select).val()-(+value)).toPrecision(12);
                    break;
            }
        }

        var input = $(select);

        if( input.is('[oms_max_value]') ){
            var max_value = +input.attr('oms_max_value');
            if( value>max_value ){
                return;
            }
        }

        input.val(value).change();
    }).on('click','[click-trigger-msg]',function(){
        var params = $(this).attr('click-trigger-msg').split(':');
        $(window).trigger({
            type: params.shift(),
            more_data: params
        });
    }).on('click','[click-click]',function(){
        var select = $(this).attr('click-click');
        $(select).click();
    });

    $('html').on('click','[click-toggleactive]',function(){
        var select = $(this).attr('click-toggleactive');
        select = select=="_self" ? this : select;
        $(select).toggleClass('active');
    });

    //点击切 toggle 目标元素classname
    $('html').on('click','[click-toggle]',function(){
        var _this = this;
        var command = $(this).attr('click-toggle');
        var selectors = command.split(':')[0];
        var className = command.split(':')[1];

        selectors.split(',').forEach(function(selector){
            selector = selector=="_self" ? _this : selector;
            $(selector).toggleClass(className);
        });
    });

    $('html').on('change','select',function(){
        var old_value = $(this).attr('old_value')||NaN;
        var new_value = $(this).val();
        if(old_value==new_value){return;}
        $(this).attr('old_value',new_value).trigger('real_change');
    });

    // input[range] 控件
    $('input[range]').attr('readonly','').on('real_change',function(event){
        var real_value = event.real_value;
        var show_value = Math.round( (+real_value||0)*10000 )/100;
        $(this).attr('real_value',real_value).val(show_value);
    }).parent().attr('range-wrap','');

    $('html').on('click',function(event){
        var dom = $(event.target);
        if( dom.is('.disabled')||dom.is('[disabled]') ){return;}
        var range_wrap = dom.closest('[range-wrap]');
        range_wrap.is('.active') && !dom.closest('.range-input').length
            ? range_wrap.removeClass('active').find('.range-input').hide()
            : range_wrap.find('input').trigger('range_focus');
        $('[range-wrap] .range-input').not( range_wrap.find('.range-input') ).hide().closest('[range-wrap]').removeClass('active');
    }).on('range_focus','input[range]',function(){
        var input = $(this);
        var value = (+input.val()||0)/100;
        var range_ctrl = input.next('.range-input');
        if(!range_ctrl.length){
            var tags_num = 3;
            range_ctrl = $('<div class="range-input" data-src="value|getRangeInput:'+tags_num+'" render-once>').render({value:value});
            range_ctrl.insertAfter(input);

            range_ctrl.on('changed',function(event){
                var new_value = (+event.value||0);
                new_value = Math.min(new_value,1);
                if(value!=new_value){
                    input.trigger({type:'real_change',real_value:new_value});
                    value = new_value;
                }
            });

            input.on('real_change',function(event){
                var new_value = (+event.real_value||0);
                new_value = Math.min(new_value,1);
                if(value!=new_value){
                    range_ctrl.trigger({type:'setValue',value:new_value})
                    value = new_value;
                }
            });
        }
        range_ctrl.show().closest('[range-wrap]').addClass('active');
    });
});

$(function(){
    //pattern 表单验证
    $('[pattern]').on('change keyup focus',function(){
        var patternStr = $(this).attr('pattern');
        var reg = new RegExp(patternStr);
        var value = $(this).val().trim();
        var pass = false;

        var pattern_pass = reg.test(value);
        $(this).toggleClass('pattern-pass',pattern_pass).toggleClass('pattern-stuck',!pattern_pass);

        var limit_rule_pass = true;
        var limit_rule = $(this).attr('limit-rule');
        if(limit_rule=='positive'){
            limit_rule_pass = (+value>0);
            $(this).toggleClass('limit-rule-pass',limit_rule_pass).toggleClass('limit-rule-stuck',!limit_rule_pass);
        }

        pass = (pattern_pass && limit_rule_pass);

        pass
            ?   $(this).removeClass('stuck').addClass('pass').trigger({type:'pattern_pass'})
            :   $(this).removeClass('pass').addClass('stuck').trigger({type:'pattern_stuck'})
    }).change();
});
