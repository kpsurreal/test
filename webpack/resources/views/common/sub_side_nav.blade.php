<div class="side-nav {{ isset($_COOKIE["common_status_sideNav"])?$_COOKIE["common_status_sideNav"]:"close" }}" style="z-index:100;">
    <?php
        $nav_list = config('custom.nav_view');
    ?>
    @foreach($nav_list as $key => $value)
         @include($value)
    @endforeach
    {{-- @include('common.content_side_nav.user_head')
    @include('common.content_side_nav.tasks')
    @include('common.content_side_nav.product_list') --}}

    <script>
        (function(){
            var me = $(this);
            $(window).on('side_nav_status:changed',setView);

            $(window).on('load resize',function(){
                $('.main-container').first().add(me).css('min-height',
                    $(window).height()-$('.navbar').first().height()
                )
                // $('.main-container').children('div').css('height',
                //     $(window).height()-$('.navbar').first().height() - 20
                // ).css('overflow', 'auto');
                $('.policy-product-head').css('min-height',
                    $(window).height()-$('.navbar').first().height() - 20
                )
            });

            toggledom = me.add(me.parent());

            function setView(e){
                var side_nav_status = e.side_nav_status;
                toggledom.addClass(side_nav_status);
                side_nav_status=='close' ? toggledom.removeClass('open') : toggledom.removeClass('close');
            }

            setTimeout(function(){
                toggledom.addClass('transition');
            },100);
        }).call(document.scripts[document.scripts.length-1].parentNode);
    </script>
</div>
