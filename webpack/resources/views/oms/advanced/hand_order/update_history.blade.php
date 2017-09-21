<div>
    <div>
        <br/>
        <font size="3">变更历史</font><hr/>
        <div style="max-height:300px;overflow-y:scroll;" rows-body></div>
        <script type="text/html" row-tpl>
            <p>
                <b data-src="updated_at"></b>
                <str style="color:#aaa;">by</str>
                <b>
                    <span data-src="handler_uid"></span>
                    <str if="user_info">: <span data-src="user_info.nick_name"></span></str>
                </b>
                <br/>

                <str style="color:#aaa;">从</str>
                <span data-src="contain.old_fee|numeral:0,0.00"></span>
                <str style="color:#aaa;">变更至</str>
                <span data-src="contain.total_fee|numeral:0,0.00"></span>
            </p>
        </script>
    </div>
    <script>
    (function(){
        var me = $(this);

        $(window).on('hand_order_detail_opened',function(event){
            var hand_order = event.hand_order;
            var hand_order_id = hand_order.id;
            updateList(hand_order_id);
        });

        function updateList(hand_order_id){
            var url = (window.REQUEST_PREFIX||'')+'/oms/advanced/get_hand_order_logs';
            me.find('.loading-loading').addClass('loading');

            renderList([]);

            var last_posting_timestamp = new Date().valueOf();
            me.attr('last_posting_timestamp',last_posting_timestamp);

            $.getJSON(url,{
                id: hand_order_id,
            }).done(function(res){
                res.code==0 ? renderList(res.data) : $.failNotice(url,res);
            }).fail($.failNotice.bind(null,url)).always(function(){
                me.find('.loading-loading').removeClass('loading');
            });

            function renderList(list){
                mergeBriefHandlerInfo(list).then(function(){
                    if(me.attr('last_posting_timestamp')!=last_posting_timestamp){return;}
                    me.renderTable(list);
                });
            }
        }

    }).call( document.scripts[document.scripts.length-1].parentNode );
    </script>
</div>
