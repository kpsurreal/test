@extends('common.sub_side_nav')

@section('some_extend')
    <?php
        $as_trader = isset($basic) && !empty($basic);
    ?>
    <script>
    (function(){
        var me = this;

        $(window).on('popstate',function(event){
            if( !$.pullValue(window,'PRODUCT.id') ){return;}
            var pop_product_id = $.pullValue(event,'originalEvent.state.product_id',PRODUCT.id);
            var now_product_id = PRODUCT.id;
            pop_product_id!=now_product_id && me.find('.products-nav a.sub-nav[pid='+pop_product_id+']').attr('pop-active','true').click();
        });

        // products-nav样式所在的模块已经被注释掉了，这个事件也不会再触发了。
        me.on('click','.products-nav a.sub-nav',function(){
            var product_id = $(this).attr('pid');
            var product = getProductById(product_id);
            //注意咯，这里会更新全局变量的哦，全局变量就是坑哦
            window.PRODUCT = product;

            !$(this).attr('pop-active') && history.pushState && history.pushState(product,'',window.REQUEST_PREFIX+'/oms/'+product.id);
            $(this).attr('pop-active','');

            window.scrollTo(0,0);
            $(window).trigger({type:'spa_product_change',product:product});
            $('.oms-product-name').html(product.name);
            me.find('.sub-nav').removeClass('active');
            $(this).addClass('active');

            return false;
        });

        function getProductById(id){
            return PRODUCTS.filter(function(x){
                return x.id == id;
            })[0];
        }
    }).call( $(document.scripts[document.scripts.length-1]).parent() );
    </script>
@stop
