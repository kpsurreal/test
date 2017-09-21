{{--
此页面之前是在菜单左下角显示，改版之后显示已经全部被隐藏了。
但是js部分，设置全局的变量PRODUCTS，同时触发了多个自定义事件，算得上是其他页面的入口。
 --}}
<div class="section products-info" style="display:none;">
    <i class="title">全部策略</i>

    @include('common.content_side_nav.multi_products_nav')

    {{-- <div class="nav-group" style="display:none;">
        <a sup-nav="is_running" class="sup-nav is_running" href="javascript:;">运行中的组合<i class="arrow"></i></a>
        <div class="products-nav is_running">
            <div rows-body></div>
            <script type="text/html" row-tpl>
                <a class="sub-nav" data-src="|setNavProductLink"></a>
            </script>
        </div>

        <a sup-nav="is_waiting" class="sup-nav is_waiting" href="javascript:;">投资中的策略<i class="arrow"></i></a>
        <div class="products-nav is_waiting">
            <div rows-body></div>
            <script type="text/html" row-tpl>
                <a class="sub-nav" data-src="|setNavProductLink"></a>
            </script>
        </div>

        <a sup-nav="is_stoped" class="sup-nav is_stoped" href="javascript:;">已结束的组合<i class="arrow"></i></a>
        <div class="products-nav is_stoped">
            <div rows-body></div>
            <script type="text/html" row-tpl>
                <a class="sub-nav" data-src="|setNavProductLink"></a>
            </script>
        </div>
    </div> --}}
    <script>
    (function(){
        $.extend($.omsFilters,{
            //有副作用的 filter 单独定义
            setNavProductLink: function(){
                var product = this.getCoreData();

                this.attr('href', (window.REQUEST_PREFIX||'')+'/oms/'+product.id).attr('pid',product.id);
                product.id==$.pullValue(window,'PRODUCT.id') && this.addClass('active');

                return product.name;
            }
        });

        //########################################//

        var user_id = "{{$logined_info['user_id']}}";
        var me = $(this);

        $(function(){
            // renderProductList();
            var product_list = $.omsCacheLocalJsonData('nav_product_list',user_id,product_list);
            //全局变量哦，又是一个坑
            window.PRODUCTS = $.pullValue(product_list,'products',[]);
            getProductList();

        });

        //first，Get Product list
        function getProductList(){
            // var url = (window.REQUEST_PREFIX||'') + '/oms/helper/get_all_products';
            var url = (window.REQUEST_PREFIX||'') + '/oms/api/get_permission_products';
            me.find('.loading-loading').addClass('loading');
            $.get(url).done(function(res){
                res.code==0 && filterProductList(res.data);
                res.code!=0 && failNotice(res);
            }).fail(failNotice).always(function(){
                me.find('.loading-loading').removeClass('loading');
            });

            function failNotice(res){
                $.omsAlert($.pullValue(res,'msg','请求失败'),false);
            }
        }

        //second, Filter product list
        function filterProductList(products){
            var product_list = {
                products: products,
                able_list: [],
                is_waiting: [],
                is_running: [],
                is_stoped: []
            };

            products.forEach(function(product){
                product.product_id = product.id;
                product.is_waiting = !product.is_running && !product.is_stoped;

                // 机构版，当group_id为0时，隐藏
                if (3 != window.LOGIN_INFO.org_info.theme && 0 == product.group_id) {
                    return;
                }

                //不展示无权限的策略
                var product_current_user_permission = $.pullValue(window,'LOGIN_INFO.my_permission.'+product.id,{});
                if(!product_current_user_permission.product_do_trade){return;}

                ['is_waiting','is_running','is_stoped'].forEach(function(key){
                    !product.is_disable && product[key] && product_list[key].push(product);
                });

                !product_list.is_disable && product_list.able_list.push(product);
            });

            renderProductList(product_list);
        }

        //third, Render product list
        function renderProductList(product_list){
            var from_cache = !product_list;

            //update cache by user_id as key.
            product_list = $.omsCacheLocalJsonData('nav_product_list',user_id,product_list);

            //全局变量哦，又是一个坑
            window.PRODUCTS = $.pullValue(product_list,'products',[]);

            $(window).trigger({type:'side_nav_product_list:updated',product_list:product_list});
            $(window).trigger({type:'side_nav_product_list:updated:' + (from_cache?'from_cache':'fresh'),product_list:product_list});

            $(window).trigger({type:'nav_side:reset_scrollTop'});
        }
    }).call(document.scripts[document.scripts.length-1].parentNode);
    </script>

    {{-- 下面是跟单页扩展有关的代码，用在：product/side_nav.blade.php --}}
    @yield('some_extend')
</div>
