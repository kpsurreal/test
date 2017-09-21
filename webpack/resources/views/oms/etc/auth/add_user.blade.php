<div class="add-item">
    <div class="input-field">
        <input placeholder="请输入小金号 ..." pattern="^\d{2,}$">
    </div>
    <span class="btn-loading">添加成员</span>

    <script>
    (function(){
        var me = $(this);
        var all_permission;

        $(window).on('auth:get_all_permission:loaded',function(event){
            all_permission = event.all_permission;
        });

        $(function(){
            me.find('span').on('click',addUser);
        });

        function addUser(){
            if(me.find('input.stuck').focus().length){$.omsAlert('小金号不正确！',false);return;}
            if(me.find('.btn-loading').is('.loading')){return;}

            var user_id = me.find('input').val().trim();

            if(!all_permission){$.omsAlert('权限数据尚未加载成功，请稍候！',false);return;}
            if($.pullValue(all_permission,'user_list',[]).filter(function(user){return user.user_id==user_id;}).length){
                return $.omsAlert('已经在成员列表中，无需重复添加！',false);
            }

            checkUserThenAdd(user_id);
        }

        function checkUserThenAdd(user_id){
            var user = {user_id:user_id};

            me.find('.btn-loading').addClass('loading');
            checkUserExist(user_id,add);

            function checkUserExist(user_id, callback){
                var url = (window.REQUEST_PREFIX||'')+'/oms/helper/user_info?user_id='+user_id;
                $.ajax({
                    type: 'get',
                    url: url,
                    async: false
                }).then(function(res){
                    if(res.code==0){
                        if( $.pullValue(res,'data.0.user_id',NaN)==user_id ){
                            add();
                        }else{
                            $.omsAlert('用户小金号无效，请确认输入系统中存在的小金号！',false);
                            me.find('.btn-loading').removeClass('loading');
                        }
                    }else{
                        $.failNotice(url,res);
                        me.find('.btn-loading').removeClass('loading');
                    }
                }).fail(function(){
                    $.failNotice.bind(url);
                    me.find('.btn-loading').removeClass('loading');
                });
            }

            function add(){
                var url = (window.REQUEST_PREFIX||'')+'/oms/permission/add_user';
                $.post(url,{user_id:user_id}).done(function(res){
                    if(res.code==0){
                        me.find('input').val('').change();
                        $(window).trigger({type:'auth:user_list:added',user:{user_id:user_id}});
                    }else{
                        $.failNotice(url,res);
                    }
                }).fail($.failNotice.bind(null,url)).always(function(){
                    me.find('.btn-loading').removeClass('loading');
                });
            }
        }
    }).call(document.scripts[document.scripts.length-1].parentNode);
    </script>
</div>
