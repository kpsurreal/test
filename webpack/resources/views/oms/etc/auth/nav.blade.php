<section class="auth-control">
    <div class="section-nav" style="padding:0;">
        <span class="nav-item black by_product" nav="by_product" click-active=".auth-control .by_product">按策略</span>
        <span class="nav-item black by_user" nav="by_user" click-active=".auth-control .by_user">按成员</span>
        <span class="nav-item black user_list" nav="user_list" click-active=".auth-control .user_list" style="float:right">成员列表</span>
    </div>
    <div class="inner-wrap by_product active-show">
        @include('oms.etc.auth.by_product')
    </div>
    <div class="inner-wrap by_user active-show">
        @include('oms.etc.auth.by_user')
    </div>
    <div class="inner-wrap user_list active-show">
        @include('oms.etc.auth.user_list')
    </div>

    <script>
    (function(){
        var me = $(this);
        var product_list;
        var permission_list;
        var ready = false;

        $(function(){
            me.find('.nav-item').on('click_active',function(event){
                $.omsUpdateLocalJsonData('etc','auth-control:nav-index',me.find('.nav-item').index(this));
                $(window).trigger('auth-control:nav:change');
                $(window).trigger('auth-control:nav:' + $(this).attr('nav'));
            }).eq( $.omsGetLocalJsonData('etc','auth-control:nav-index',0) ).click();

            getAllPermission();
        });

        function getAllPermission(){
            var url = (window.REQUEST_PREFIX||'') + '/oms/permission/get_all_permission';
            me.find('.loading-loading').addClass('loading');
            me.find('.nothing-nothing').removeClass('nothing');

            $.getJSON(url).done(function(res){
                res.code==0 ? (permission_list=res.data, combineAllPermission()) : $.failNotice(url,res);
            }).fail($.failNotice.bind(null,url)).always(function(){
                me.find('.loading-loading').removeClass('loading');
            });
        }

        $(window).on('side_nav_product_list:updated',function(event){
            var new_product_list = $.pullValue(event,'product_list.products',false);
            if(new_product_list.length){
                product_list = new_product_list.filter(function(product){
                    return !product.is_disable;
                });
                product_list.length && combineAllPermission();
            }
        }).on('auth:save_permission',function(event){
            var sets = event.sets;

            if(sets.length>250){
                return $.omsAlert('一次提交数据变更不能超过250条！',false);
            }

            var url = (window.REQUEST_PREFIX||'') + '/oms/permission/set_permission';
            $.startLoading('正在提交保存...');
            $.post(url,{sets:sets}).done(function(res){
                res.code==0 && $(window).trigger({type:'auth:set_permission:success',sets:sets});
                res.code!=0 && $.failNotice(url,res);
            }).fail($.failNotice.bind(null,url)).always(function(){
                $.clearLoading();
            });
        }).on('auth:user_list:added auth:user_list:removed auth:set_permission:success',function(){
            $.omsAlert('更新成功，即将自动刷新 :)');
            setTimeout(function(){
                location.reload();
            },1000);
        }).on('auth:user_list:see_detail',function(event){
            me.find('.nav-item.by_user').click();
        });

        function combineAllPermission(){
            if(!product_list || !permission_list || ready){return;}

            var all_permission = {
                user_list: [],
                product_list: product_list
            };

            for(var user_id in permission_list){
                all_permission.user_list.push({
                    user_id: user_id,
                    permission: permission_list[user_id]
                });
            }

            all_permission.user_list.forEach(function(user){
                for(var product_id in user.permission){
                    if(product_id==0){continue;}
                    var product = getProductById(product_id);
                    product && (product.permission=(product.permission||[])).push({
                        user_id: user_id,
                        permission: user.permission[product_id]
                    })
                }
            });

            ready = true;
            $(window).trigger({type:'auth:get_all_permission:loaded',all_permission:all_permission});

            updateUserInfoInUserList(all_permission.user_list);
        }

        function getProductById(id){
            return product_list.filter(function(x){
                return x.id == id;
            })[0];
        }

        function updateUserInfoInUserList(user_list){
            window.mergeBriefUserInfo(user_list).then(function(){
                $(window).trigger('auth:user_info_in_user_list:updated');
            });
        }
    }).call( document.scripts[document.scripts.length-1].parentNode );
    </script>
</section>
