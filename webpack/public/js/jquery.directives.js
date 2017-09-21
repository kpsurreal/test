/*
Create by Rango [ yuanoook@foxmail.com yuanoook.com ]
Dependences:
	jquery.js
	jquery.cookie.js
	jquery.marquee.js
	jquery.slides.min.js
	jquery.magnific-popup.min.js
*/

// 自定义指令集合，click 触发生效
$(function(){
  //  click-active 指令，排他性地为目标DOM元素添加 active 属性
    $('html').on('click','[click-active]:not(.disabled)',function(){
        var select = $(this).attr('click-active');
        select = select=="_self" ? this : select;
        $(select).trigger({type:'click_active',sponsor:this});
        $(select).siblings().removeClass('active');
        $(select).addClass('active');
    });


    $('html').on('change','[change-active]:not(.disabled)',function(){
        var select = $(this).find(':checked').attr('method-type');
        select = select=="_self" ? this : select;
        $(select).trigger({type:'click-active',sponsor:this});
        $(select).siblings().removeClass('active');
        $(select).addClass('active');

    })


    $('html').on('mouseover','[mouseover-active]',function(){
        var select = $(this).attr('mouseover-active');
        $(select).addClass('active').siblings().removeClass('active');
    });

    $('[hover-active]').hover(function(){
        var select = $(this).attr('hover-active');
        $(select=="_self" ? this : select).addClass('active');
    },function(){
        var select = $(this).attr('hover-active');
        $(select=="_self" ? this : select).removeClass('active');
    });

    // click-toggleclass 指令，点击切换指定类名
    $('html').on('click','[click-toggleclass]',function(){
        var className = $(this).attr('click-toggleclass');
        $(this).toggleClass(className);
    });

    // clickout-removeclass 指令，点击切换类名
    $('html').on('click',function($event){
    	$('[clickout-removeclass]').each(function(){
    		if( $(this)[0] === $event.target || $(this)[0].contains($event.target) ){
    			return;
    		}
	        var className = $(this).attr('clickout-removeclass');
	        $(this).removeClass(className);
    	});
    });

    // click-logout 登出指令
    $('html').on('click','[click-logout]',function(e){
		e.preventDefault();
		$.post('/bms-pub/user/logout', {}, function() {
			$.removeCookie('app_token', {path: '/'});
            location.href = '/user/login';
		});
    });

    // gmf-action:contact_customer_service
    $('html').on('click','[gmf-action="contact_customer_service"]',function(){
		if( !$.magnificPopup ){ window.console.log('缺乏 jquery.magnific-popup 模块'); return; };

		setTimeout(function(){
			$.magnificPopup.instance.open({
	            items: {
	                src: "#win_contact_customer_service",
	                type: "inline",
	                midClick: true
	            }
			}, 0);
		}, 10);
    });
});

// 自定义组件集合，页面初次渲染完成之后自动生效
$(function(){

	// focus-class 指令组件，获得焦点时添加 class，失去焦点时 移除 class
	$('[focus-class]').each(function(){
		var className = $(this).attr('focus-class');
		$(this).attr({
			'click-toggleclass': className,
			'clickout-removeclass': className
		});
	});

	// active-slide 指令组件，激活时
	$('[active-slide]').each(function(){
		var $this = $(this);
		$('html').on('click',function(){
		    var targetSelector = $this.attr('active-slide');
			setTimeout(function(){
				if( $this.hasClass('active') ){
					$(targetSelector).slideDown(300);
				}else{
					$(targetSelector).slideUp(300);
				}
			},0);
		});
	});

	// marquee-scroll 组件，文字翻滚效果，参数 暂无
	$('[marquee-scroll]').each(function(){
        //新增一个判断条件，当不多于一条数据时，不进行翻滚效果。
        var len = $(this).find('ul').children('li').length
        if(1 >= len){
            if(0 === len){
                $(this).hide();
            }
            return;
        }

        var params = $(this).attr('marquee-scroll').split(':');
        var line = params[0] || 1;
        var timer = params[1] || 5000;
        var noAnimate = params[2] || 'false';

        if( !$.fn.MarqueeScroll ){ window.console.log('缺乏 jquery.marquee 模块'); return; };

        $(this).MarqueeScroll({
            line: line,
            timer: timer,
            noAnimate: noAnimate
        });
	});

	// jquery-slide 组件，轮播图特效，参数 fade/slide:1000
	$('[jquery-slide]').each(function(){
		if( !$.fn.slidesjs ){ window.console.log('缺乏 jquery.slides 模块'); return; };

		var params = $(this).attr('jquery-slide').split(':');
		var effect = params[0] || 'fade';
		var interval = params[1] || 5000;
		var pauseOnHover = !!params[2] || false;
        var auto = params[3]=='noAuto' ? false : true;
		var options = {
		    play: {
				auto: auto,
		        effect: effect,
		        interval: interval,
		        pauseOnHover: pauseOnHover
		    },
		    pagination: {
		    	effect: effect,
		    	active: true
		    },
		    effect: {
		    	fade: {
		    		speed: 500
		    	},
		    	slide: {
		    		speed: 500
		    	}
		    }
		};
		$(this).slidesjs(options);
	});

    $(window).on('message',function(event){
        event.originalEvent.data == 'reRenderJquerySlides' && $('[jquery-slide]').each(function(){
            $.data(this,'plugin_slidesjs').update();
            $.data(this,'plugin_slidesjs')._setuptouch();
        });
    });

    // script-src 组件，异步加载 script 资源，用于不紧急的功能模块，如侧边栏
    $('[script-src]').each(function(){
        $.getScript( $(this).attr('script-src') );
    });

    // 加载更多组件，由于数据过多，页面初次只显示一部分，用户点击“查看更多”后，将所有显示出来。
    // 目前并不走ajax的形式，实际上页面初始化就已经获取到了全部数据。
    $('[click-more]').each(function(){
        var params = $(this).attr('click-more').split(':');
        var limit = params[0] || 9;

        var ul = $(this).find('ul');
        var len = ul.children().length;
        if(len <= limit){
            $(this).find('li').show();
            $(this).children('a').hide();
        }else{
            for(var i = 0; i < len; i++){
                if(i < limit){
                    ul.children().eq(i).show();
                }
            }
            $(this).find('a.btn-more').on('click', function(e){
                e.preventDefault();
                $(this).prev().children().show();
                $(this).hide();
            });
        }
    });

});
