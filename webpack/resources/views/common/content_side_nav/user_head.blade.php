<div class="section user-info">
    <div class="hd">
        <img data-src="trader_info.avatar_operator OR avatar_url" src="{{asset('/images/avatar/user_avatar_01.png')}}">
        <b data-src="nick_name"></b>
    </div>
    <div class="titles">
        <str if="my_permission.0.manger_commander" render-once>交易总监</str>
        <str if="my_permission.0.manger_risk OR my_permission.0.manger_advanced" render-once>风控总监</str>
        <str if="my_permission.0.manger_executor" render-once>交易员</str>
        <str if="my_permission.0.manger_trader" render-once>基金经理</str>
    </div>

    <script>
    (function(){
        var me = $(this);
        $(function(){
            me.render( $.pullValue(window,'LOGIN_INFO',null) );
            me.find('.titles').toggleClass('multi-titles', me.find('str.if-pass').length>1);
        });
    }).call(document.scripts[document.scripts.length-1].parentNode);
    </script>
</div>
