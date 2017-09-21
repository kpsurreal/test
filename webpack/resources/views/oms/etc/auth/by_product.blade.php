<section class="order-list advanced">
    <div class="hd">
        <span>
            选择策略：
            <select style="font-size:18px;"></select>
        </span>
        <span style="width:6.5em;" class="oms-btn disabled right" handle="save">保存修改</span>
        <span style="float:right" change-status>
            <span if="changed_length">
                变更记录：<str data-src="changed_length"></str>个
            </span>
            <span if="changed_length|>:250" style="color:red;"> 超过服务器接受限制 250 个！</span>
        </span>
    </div>

    <table class="oms-table ghost-head"></table>
    <div style="max-height:560px;overflow-y:scroll;position:relative;" sheet>
        <table class="oms-table loading-loading nothing-nothing hidden-head">
            <tr class="hd hidden-head" rows-head>
                <th class="cell-left" style="width:200px;">成员权限</th>
                <th><input type="checkbox">查看策略</th>

                <th><input type="checkbox">策略下发</th>
                <th><input type="checkbox">策略审核</th>
                <th><input type="checkbox">策略执行</th>
                <th><input type="checkbox">风控管理</th>
                <th><input type="checkbox">高级管理</th>
                <th>&nbsp;</th>
            </tr>
            <tbody class="rows-body nothing-nothing loading-loading" rows-body></tbody>
            <script type="text/html" row-tpl>
                <tr auth-row>
                    <td class="cell-left" user-info style="white-space:nowrap;">
                        <span data-src="user_id"></span>
                        <str if="user_info.nick_name">: <span data-src="user_info.nick_name"></span></str>
                        <span class="title trader-show">投资经理</span>
                        <span class="title vip-show">公司管理</span>
                    </td>
                    <td><input type="checkbox" data-src='npp.product_view'></td>

                    <td><input type="checkbox" data-src='npp.product_do_trade'></td>
                    <td><input type="checkbox" data-src='npp.product_do_alloc'></td>
                    <td><input type="checkbox" data-src='npp.product_do_deal'></td>
                    <td><input type="checkbox" data-src='npp.product_do_risk'></td>

                    <td><input type="checkbox" data-src='npp.product_manger'></td>
                    <th><span handle="all">全选</span></th>
                </tr>
            </script>
        </table>
    </div>

    <script>
    (function(){
        var me = $(this);
        var me_head = me.find('> .hd');
        var me_table = me.find('table.oms-table');
        var me_table_head = me_table.find('[rows-head]');
        var clone_head;
        var me_table_ghost_head = me.find('.ghost-head');
        var all_permission;
        var now_product_id;
        var timeout_timer = [];
        var vip_uids = [];
        try{vip_uids = JSON.parse('{!! json_encode(config("oms.auth_highlight_vip")) !!}');
        }catch(e){console.warn(e);}

        $(window).on('auth:get_all_permission:loaded',function(event){
            all_permission = event.all_permission;
            me_head.find('select').html(all_permission.product_list.map(function(product){
                return $('<option></option>').val(product.id).html(product.id + ' : ' + product.name);
            }));
            if( me_head.find('select option').length ){
                var last_selected_value = $.omsGetLocalJsonData('etc','auth:by_product:last_selected_value',false);
                last_selected_value && hasProduct(last_selected_value) && me_head.find('select').val(last_selected_value);

                me_head.find('select').change();
            }
        }).on('auth-control:nav:change',
            clearTimer
        ).on('resize auth-control:nav:by_product',
            resetRowsHeadCss
        ).on('auth:user_info_in_user_list:updated',function(event){
            $('[rows-body] tr').each(function(){
                var user = $(this).getCoreData();
                $(this).find('[user-info]').render(user);
            });
        });

        $(function(){
            me_head.find('select').on('change',function(){
                var old_value = $(this).attr('old_value')||NaN;
                var new_value = $(this).val();
                if(old_value==new_value){return;}

                $.omsCacheLocalJsonData('etc','auth:by_product:last_selected_value',new_value);
                $(this).attr('old_value',new_value);
                display(new_value);
            });

            me.on('change','[rows-head] input[type=checkbox]',function(){
                var checked = $(this).prop('checked');
                var col_index = $(this).closest('tr').find('th').index( $(this).closest('th') );
                me.find('[rows-body] tr').each(function(){
                    $(this).find('td').eq(col_index).find('input[type=checkbox]').prop('checked',checked).change();
                });
            });

            me.find('[rows-body]').on('change','input[type=checkbox]',checkHandleSaveEnable);

            me.on('click','[handle=all]',function(){
                $(this).data('checked', !$(this).data('checked'));
                $(this).html( $(this).data('checked')?'全不选':'全选' );
                $(this).closest('tr').find('input[type=checkbox]').prop('checked',$(this).data('checked')).change();
            }).on('click','[handle=save]:not(.disabled)',saveChange);

            me.find('[sheet]').on('scroll',function(){
                var sheet = $(this).get(0);
                $.omsCacheLocalJsonData('etc','auth:by_product:sheet_scrollTop',(sheet ? sheet.scrollTop : 0));
            });
        });

        function saveChange(){
            var save_data = [];
            me.find('[auth-row] input.dirty').each(function(){
                var input = $(this);
                var auth_row = input.closest('[auth-row]');
                var user = auth_row.getCoreData();
                save_data.push({
                    user_id: user.user_id,
                    product_id: now_product_id,
                    method_name: input.attr('data-src').replace('npp.',''),
                    set: input.prop('checked') ? 'on' : 'off'
                });
            });
            if(!save_data.length){return $.omsAlert('无可保存更改！',false);}
            $(window).trigger({type:'auth:save_permission',sets:save_data});
        }

        function display(product_id){
            now_product_id = product_id;
            var product = all_permission.product_list.filter(function(product){
                return product.id == product_id;
            })[0];
            if(!product){return clear();}
            showPermission(product.permission);
            highlightVIP(product);
        }

        function showPermission(permission){
            all_permission.user_list.forEach(function(user){
                user.now_product_permission = user.npp = user.permission[now_product_id] ? user.permission[now_product_id] : null;
            });

            me_table.renderTable(all_permission.user_list);
            setInitAllSelectStatus();
            resetRowsHeadCss();
            recoverySheetScrollTop();
        }

        function clear(){
            me.find('[handle=save]').addClass('disabled');
            me_table.renderTable([]);
        }

        function highlightVIP(product){
            var trader_id = $.pullValue(product,'operator_uid','');
            me.find('[rows-body] tr').removeClass('vip trader').each(function(){
                var row = $(this);
                var user = row.getCoreData();
                var user_id = $.pullValue(user,'user_id',NaN);
                if(vip_uids && vip_uids.indexOf && vip_uids.indexOf(user_id)>-1){
                    row.addClass('vip');
                }
                user_id==trader_id && row.addClass('trader');
            });

            me.find('[rows-body]').prepend( me.find('[rows-body] tr.vip') ).prepend( me.find('[rows-body] tr.trader') );
        }

        function checkHandleSaveEnable(){
            var changed_rows = me.find('[rows-body]').find('.dirty');
            me.find('[change-status]').render({
                changed_length: changed_rows.length
            });
            me.find('[handle=save]').toggleClass('disabled', (!changed_rows.length)||(changed_rows.length>250));
        }

        function hasProduct(id){
            return $.pullValue(all_permission,'product_list',[]).filter(function(product){
                return product.id == id;
            }).length;
        }

        function recoverySheetScrollTop(){
            var sheet = me.find('[sheet]').get(0);
            sheet && (sheet.scrollTop = $.omsGetLocalJsonData('etc','auth:by_product:sheet_scrollTop', 0));
        }

        function resetRowsHeadCss(){
            if(!clone_head){
                clone_head = me_table_head.clone().css('visibility','visible');
                me_table_ghost_head.html(clone_head);
            }

            timeout_timer.push(setTimeout(resetCloneHead,100));
            timeout_timer.push(setTimeout(resetCloneHead,500));
            timeout_timer.push(setTimeout(resetCloneHead,1500));
            timeout_timer.push(setTimeout(resetCloneHead,2500));
            timeout_timer.push(setTimeout(resetCloneHead,7500));

            function resetCloneHead(){
                me_table_ghost_head.css('width',me_table_head.width());
                clone_head && clone_head.find('th').each(function(index,th){
                    $(this).css('width',me_table_head.find('th').eq(index).outerWidth());
                });
            }
        }

        function setInitAllSelectStatus(){
            me.find('[rows-head]:first').find('[type=checkbox]').each(function(){
                var th_index = me.find('[rows-head]:first').find('th').index( $(this).closest('th') );
                $(this).prop('checked',
                    !me_table.find('[rows-body]').find('td:nth-of-type('+(th_index+1)+') input[type=checkbox]').filter(':not(:checked)').length
                );
            });
            me.find('[rows-body] tr').each(function(){
                var row = $(this);
                !row.find('[type=checkbox]:not(:checked)').length && row.find('[handle=all]').data('checked',true).html('全不选');
            });
        }

        function clearTimer(){
            timeout_timer.forEach(function(timer){
                clearTimeout(timer);
            });
        }
    }).call( document.scripts[document.scripts.length-1].parentNode );
    </script>
</section>
