<section class="product-status" style="display:none;">
    <h1 data-src="fund_status_title|--"></h1>
    <p data-src="fund_status_detail|--"></p>
    <script>
    (function(){
        var me = $(this);
        var me_show;

        $(window).on('load spa_product_change',function(event){
            var product = event.product||PRODUCT;
            me_show = !(product.is_stoped || product.is_running);

            me_show ? me.show() : me.hide();
            me_show && me.render(product);
        }).on('product_detail_changed',function(event){
            var product = event.product;
            me_show && me.render(product);
        });

    }).call(document.scripts[document.scripts.length-1].parentNode);
    </script>
</section>
