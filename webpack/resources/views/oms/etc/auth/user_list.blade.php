<section class="order-list advanced">
    <div>
        <table class="oms-table loading-loading nothing-nothing">
            <tr class="hd">
                <th class="cell-left">小金号</th>
                <th>用户昵称</th>
                {{-- <th>真实姓名</th>
                <th>手机号</th> --}}
                <th></th>
            </tr>
            <tbody class="rows-body nothing-nothing loading-loading" rows-body></tbody>
            <script type="text/html" row-tpl>
                <tr row>
                    <td class="cell-left"><span data-src="user_id"></span></td>
                    <td><span data-src="user_info.nick_name"></span></td>
                    <!-- <td data-src="user_info.name"></td>
                    <td data-src="user_info.phone"></td> -->
                    <td class="cell-right">
                        <span class="blue" handle="see_detail">查看权限</span>
                        <span class="red" handle="delete">删除用户</span>
                    </td>
                </tr>
            </script>
        </table>

        <script>
        (function(){
            var me = $(this);
            var user_list;

            $(function(){
                me.on('click','[rows-body] [handle=delete]',function(){
                    var btn = $(this);
                    var row = $(this).closest('tr');
                    var user = row.getCoreData();
                    var nick_name = $.pullValue(user,'user_info.nick_name','');
                    var user_id = user.user_id;
                    if( btn.is('.loading') ){return;}

                    $.gmfConfirm(
                        '你确认要删除用户 '+user_id+( nick_name ? (' : '+nick_name) : '' )+' ?','<p style="color:red;font-size:20px;">删除后无法恢复，请确认后删除！<\/p>',2,false,10
                    ).ok(deleteUser);

                    function deleteUser(){
                        btn.addClass('loading');
                        var url = (window.REQUEST_PREFIX||'')+'/oms/permission/remove_user';
                        $.post(url,{user_id: user_id}).done(function(res){
                            if(res.code==0){
                                row.remove();
                                !me.find('[rows-body] tr[row]').length && me.find('.nothing-nothing').addClass('nothing');
                                $(window).trigger({type:'auth:user_list:removed',user:user});
                            }else{
                                $.failNotice(url,res);
                            }
                        }).fail($.failNotice.bind(null,url)).always(function(){
                            btn.removeClass('loading');
                        });
                    }
                }).on('click','[rows-body] [handle=see_detail]',function(){
                    var row = $(this).closest('tr');
                    var user = row.getCoreData();
                    $(window).trigger({type:'auth:user_list:see_detail',user:user});
                });
            });

            $(window).on('auth:get_all_permission:loaded',function(event){
                user_list = $.pullValue(event, 'all_permission.user_list', []);
                display();
            }).on('auth:user_list:added',function(event){
                var user = event.user;
                var new_row = $(me.find('[row-tpl]').html()).render(user);
                me.find('[rows-body]').append(new_row);
                me.find('nothing-nothing').removeClass('nothing');
            }).on('auth:user_info_in_user_list:updated',function(event){
                me.find('[rows-body] tr').each(function(){
                    $(this).reRender();
                });
            });

            function display(){
                me.renderTable(user_list);
            };
        }).call( document.scripts[document.scripts.length-1].parentNode );
        </script>
    </div>
    @include('oms.etc.auth.add_user')
</section>
