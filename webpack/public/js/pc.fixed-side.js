$(function(){
    //小飞机的逻辑
	$(window).on('load scroll',function(){
        !$('.flyToTop').hasClass('animating') && resetFlyToTop();
	});

	$('.flyToTop').on('click',function(){
        var $this = $(this);
        $this.addClass('animating').removeClass('ready');//.find('img').attr("src", "飞.gif");
		$('body,html').animate({scrollTop :0},250,function(){
            !$('.flyToTop').hasClass('flying') && $this.addClass('flying').animate({
                top:'-' + ($('.flyToTop').offset().top-$(window).scrollTop()+120) + 'px',
                opacity:0.25
            },500,'linear',function(){
                $this.removeClass('animating').removeClass('flying');
                setTimeout(resetFlyToTop,0);
            });
        });
	});

    function resetFlyToTop(){
        if( $(window).scrollTop() > 100 ){
            !$('.flyToTop').hasClass('ready') && $('.flyToTop').addClass('ready').css({
                top:'-60px',
                opacity:1,
                cursor:'pointer',
                display:'block'
            });//.find('img').attr('src','静.gif');
        }else{
            $('.flyToTop').removeClass('ready').css({display:'none'});//.find('img').removeAttr('src');
        }
    }
});
