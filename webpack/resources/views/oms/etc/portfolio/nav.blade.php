<section class="portfolio">
    <div class="section-nav section-loading loading-loading" style="padding:0;">
        <span class="nav-item black by_product" nav="by_product" click-active=".portfolio .by_product" style="float:right">按策略</span>
        <span class="nav-item black by_robot" nav="by_robot" click-active=".portfolio .by_robot" style="float:right">按机器人</span>
        <span class="nav-item black product_list" nav="product_list" click-active=".portfolio .product_list">概览汇总</span>
        {{-- <span class="nav-item black robot_list" nav="robot_list" click-active=".portfolio .robot_list" style="float:right">机器人列表</span> --}}
    </div>
    <div class="inner-wrap by_robot active-show">
        @include('oms.etc.portfolio.by_robot')
    </div>
    <div class="inner-wrap by_product active-show">
        @include('oms.etc.portfolio.by_product')
    </div>
    <div class="inner-wrap product_list active-show">
        @include('oms.etc.portfolio.all_brief_list')
    </div>
    <div class="inner-wrap robot_list active-show">
        {{-- @include('oms.etc.portfolio.robot_list') --}}
    </div>

    <script>
    (function(){
        var me = $(this);
        var ready = false;
        var portfolio_list;

        $(function(){
            me.find('.nav-item').on('click_active',function(event){
                $.omsUpdateLocalJsonData('etc','portfolio:nav-index',me.find('.nav-item').index(this));
                $(window).trigger('portfolio:nav:change');
                $(window).trigger('portfolio:nav:' + $(this).attr('nav'));
            }).eq( $.omsGetLocalJsonData('etc','portfolio:nav-index',0) ).click();

            getAllPortfolio();
        });

        $(window).on('portfolio:robot_list:see_detail',function(event){
            me.find('.nav-item.by_robot').click();
        }).on('portfolio:product_list:see_detail',function(event){
            me.find('.nav-item.by_product').click();
        }).on('portfolio:reload',function(event){
            var params = event.params;console.log(params);
            ready = false;
            getAllPortfolio(params);
        });

        function getAllPortfolio(params){
            var url = (window.REQUEST_PREFIX||'') + '/portfolio/robot-account';
            me.find('.loading-loading').addClass('loading');
            me.find('.nothing-nothing').removeClass('nothing');

            $.getJSON(url,params).done(function(res){
                res.code==0 ? (portfolio_list=$.pullValue(res,'data.0',[]), combineAllPortfolio()) : $.failNotice(url,res);
            }).fail($.failNotice.bind(null,url)).always(function(){
                me.find('.loading-loading').removeClass('loading');
            });

            function combineAllPortfolio(){
                if(!portfolio_list || ready){return;}
                var robots = {};

                portfolio_list.sort(function(p1,p2){
                    return +$.pullValue(p1,'robot_profile.product_id',0) < +$.pullValue(p2,'robot_profile.product_id',0) ? -1 : 1;
                });

                var all_portfolio = {
                    product_list: portfolio_list,
                    robot_list: []
                };

                portfolio_list.forEach(function(portfolio){
                    portfolio.product_id = portfolio.robot_profile.product_id;
                    var roboter_id = portfolio.robot_profile.roboter_id;
                    if( !robots[roboter_id] ){
                        robots[roboter_id] = {
                            roboter_id: portfolio.robot_profile.roboter_id,
                            broker_id: portfolio.robot_profile.broker_id,
                            status: portfolio.robot_profile.status,
                            created_at: portfolio.robot_profile.created_at,
                            updated_at: portfolio.robot_profile.updated_at,
                            product_list: []
                        }
                    }

                    var robot = robots[roboter_id];
                    robot.product_list.push(portfolio);
                });

                for(var i in robots) all_portfolio.robot_list.push(robots[i]);

                ready = true;
                $(window).trigger({type:'portfolio:get_portfolio:loaded',all_portfolio:all_portfolio});

                updateProductInfoInProductList(all_portfolio.product_list);

                function updateProductInfoInProductList(product_list){
                    window.mergeProductsBriefInfo(product_list).then(function(){
                        $(window).trigger('portfolio:product_list:updated');
                    });
                }
            }
        }

    }).call( document.scripts[document.scripts.length-1].parentNode );
    </script>
</section>
