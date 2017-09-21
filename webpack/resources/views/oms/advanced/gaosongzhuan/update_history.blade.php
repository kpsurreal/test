<div>
    <div style="margin-top:20px;">
        <font size="3">变更历史</font><hr/>
        <div style="max-height:200px;overflow-y:scroll;" rows-body></div>
        <script type="text/html" row-tpl>
            <p>
                <b data-src="updated_at"></b>
                <str style="color:#aaa;">by</str>
                <b>
                    <span data-src="handler_uid"></span>
                    <str if="user_info">: <span data-src="user_info.nick_name"></span></str>
                </b>
                <br/>

                <str style="color:#aaa;">数量 </str><span data-src="contain.sec.amount|numeral:0,0"></span> &nbsp;
                <str style="color:#aaa;">现金 </str><span data-src="contain.sec.unforzen_cash|numeral:0,0.00"></span> &nbsp;
                <str style="color:#aaa;">当日冻结 </str><span data-src="contain.sec.frozen_today|是不是"></span>
                <str if="contain.msg"><br/>
                    <str style="color:#aaa;">备注 </str><span data-src="contain.sec.msg"></span>
                </str>
            </p>
        </script>
    </div>
    <script>
    (function(){
        var me = $(this);

        $(window).on('gaosongzhuan_detail_opened',function(event){
            var gaosongzhuan = event.gaosongzhuan;
            var gaosongzhuan_id = gaosongzhuan.gaosongzhuan_id;
            updateList(gaosongzhuan_id);
        });

        function updateList(gaosongzhuan_id){
            var url = (window.REQUEST_PREFIX||'')+'/oms/advanced/get_gaosongzhuan_logs';
            me.find('.loading-loading').addClass('loading');

            renderList([]);

            var last_posting_timestamp = new Date().valueOf();
            me.attr('last_posting_timestamp',last_posting_timestamp);

            $.getJSON(url,{
                id: gaosongzhuan_id,
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
