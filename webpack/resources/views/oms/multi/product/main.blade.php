<div>
    @if($product_status=='is_running')
        @include('oms.multi.product.head.is_running')
        <div style="position: absolute; bottom: 0;width: 100%;display: none;" class="multi-product-deal-menu">
            @include('oms.multi.product.order_create')
            <script>
            (function(){
                var me = $(this);
                $('html').css('background','#fff');
                $(function(){
                    var section_height = 271;
                    var section = me.find('section.create-order').first();

                    // 兼容测试方案
                    // return section.find('>.head').hide();

                    if(/mobile/i.test(navigator.userAgent)){return section.find('>.head').hide();}

                    $('html').addClass('black-turnoff');//全局使用 黑色主题
                    $('section.create-order').first().addClass('fixed transition');
                    // section.addClass('fixed transition').css({
                    //     marginBottom: 0,
                    //     minHeight: section_height,
                    //     boxShadow: '0 -2px 4px rgba(0,0,0,.2)'
                    // });
                    var container = me.closest('.main-container');
                    var side_nav = $('html').find('.side-nav').first();
                    var scroll_reable_transition;

                    strategy_scrollbar_full();

                    function strategy_scrollbar_full(){
                        var ghost_section = $('<div>').appendTo(container);
                        $(window).on('table:rendered order_create:nav:change side_nav_status:changed resize scroll',resize);

                        resize({type:null});
                        function resize(event){
                            if(event.type=='scroll'){
                                clearTimeout(scroll_reable_transition);
                                section.removeClass('transition');
                                scroll_reable_transition = setTimeout(function(){
                                    event.type == 'scroll' && section.addClass('transition');
                                });
                            }

                            var side_nav_status = side_nav.is('.open') ? 'open' : 'close';
                            var left = side_nav_status=='close' ? 60 : (side_nav.width()||255);
                            var side_nav_width = side_nav_status=='close' ? 60 : (side_nav.width()||255);
                            // var left = 60;
                            left -= window.scrollX;
                            // console.log(container.outerWidth() - side_nav.width());
                            var tmpWidth = container.outerWidth();
                            // if (tmpWidth < 1300) {
                            //     tmpWidth = 1300
                            // }
                            section.css({
                                'left': left
                                // ,
                                // width: tmpWidth
                            });
                            // section.parents('div').css({
                            //     left: left
                            // })
                            ghost_section.height(section.height());

                            section.find('.left-nav').css({
                                width: Math.max($('.container-fluid').outerWidth() + window.scrollX - side_nav_width, 1080)
                            });
                            section.find('.right-board').css({
                                width: tmpWidth
                            });
                            section.find('.foot').css({
                                width: tmpWidth
                            });
                        }
                    }
                });
                $(function(){
                    $('.multi-product-deal-menu').show();
                })
            }).call(document.scripts[document.scripts.length-1].parentNode);
            </script>
        </div>
        @include('oms.multi.product.position_list')
        @include('oms.multi.product.order_list',['is_running'=>true,'is_stoped'=>false])
        <p class="foot-note">金额单位:元 股票单位:股</p>
    @endif

    @if($product_status=='policy_instruction')
        @include('oms.multi.product.head.policy_instruction')
        <div>
            {{-- 这里需要加上js才能正常显示。 --}}
            @include('oms.multi.product.policy_create')
            <script>
            (function(){
                var me = $(this);
                $('html').css('background','#fff');
                $(function(){
                    var section_height = 271;
                    var section = me.find('section.create-order').first();

                    // 兼容测试方案
                    // return section.find('>.head').hide();

                    if(/mobile/i.test(navigator.userAgent)){return section.find('>.head').hide();}

                    $('html').addClass('black-turnoff');//全局使用 黑色主题
                    $('section.create-order').first().addClass('fixed transition');
                    // section.addClass('fixed transition').css({
                    //     marginBottom: 0,
                    //     minHeight: section_height,
                    //     boxShadow: '0 -2px 4px rgba(0,0,0,.2)'
                    // });
                    var container = me.closest('.main-container');
                    var side_nav = $('html').find('.side-nav').first();
                    var scroll_reable_transition;

                    strategy_scrollbar_full();

                    function strategy_scrollbar_full(){
                        var ghost_section = $('<div>').appendTo(container);
                        $(window).on('table:rendered order_create:nav:change side_nav_status:changed resize scroll',resize);

                        resize({type:null});
                        function resize(event){
                            if(event.type=='scroll'){
                                clearTimeout(scroll_reable_transition);
                                section.removeClass('transition');
                                scroll_reable_transition = setTimeout(function(){
                                    event.type == 'scroll' && section.addClass('transition');
                                });
                            }

                            var side_nav_status = side_nav.is('.open') ? 'open' : 'close';
                            var left = side_nav_status=='close' ? 60 : (side_nav.width()||255);
                            // var left = 60;
                            left -= window.scrollX;
                            // console.log(container.outerWidth() - side_nav.width());
                            var tmpWidth = container.outerWidth();
                            // if (tmpWidth < 1300) {
                            //     tmpWidth = 1300
                            // }
                            section.css({
                                'left': left,
                                width: tmpWidth
                            });
                            // section.parents('div').css({
                            //     left: left
                            // })
                            ghost_section.height(section.height());
                        }
                    }
                });
            }).call(document.scripts[document.scripts.length-1].parentNode);
            </script>
        </div>
    @endif
    @if($product_status=='deal_search')
        @include('oms.multi.product.head.deal_search')
    @endif
    <script>
    (function(){
        var me = $(this);
    }).call(document.scripts[document.scripts.length-1].parentNode);
    </script>
</div>
