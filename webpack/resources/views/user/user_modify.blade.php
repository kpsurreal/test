@extends('adminmanager_standard')
{{-- 这是操盘侠原版的登陆页 --}}
@section('asset-css')
    <link href="{{ asset('/css/oms.login.min.css') }}" rel="stylesheet">
@endsection

@section('content')
    <script>window.REQUEST_PREFIX = "{{ config('view.path_prefix','') }}";</script>
    <div class="login-container">
        <h1><span>{{ config('custom.app_name') }}</span>资产管理平台</h1>
        <form>
            <label>
                <!-- 手机号 -->
                <input type="tel" name="cellphone" value="" placeholder="手机号" pattern="^\d{11}$" >
            </label>
            <label>
                <!-- 密码 -->
                <input type="password" name="password" value="" placeholder="密码" pattern="^.{4,}" >
            </label>
            <button class="loading-loading" type="submit">登录</button>
            <script>
            (function(){
                var me = $(this);

                me.submit(function(){
                    var url = '/bms-pub/user/login';
                    if(me.find('.loading-loading').is('.loading')){return false;}

                    me.find('input').change();

                    if( me.find('input.stuck:first').length ){
                        $.omsAlert( me.find('input.stuck:first').focus().attr('placeholder') + '不正确！',false );
                        return false;
                    }

                    me.find('.loading-loading').addClass('loading');
                    $.post(url, me.serialize()).done(function(res) {
                        if(res.code == 0) {
                            setLoginToken(res.data);
                            location.replace(window.REQUEST_PREFIX+'/oms');
                        }else{
                            failNotice(res);
                        }
                    }).always(function(){
                        me.find('.loading-loading').removeClass('loading');
                    }).fail(failNotice);

                    function failNotice(res){
                        $.omsAlert($.pullValue(res,'msg','请求异常'),false);
                    }

                    return false;
                });

                function setLoginToken(tokens) {
                    var root_domain = location.hostname.replace(/^(www|sns)\./,'');
                    tokens.app_token && $.cookie('app_token', tokens.app_token, { path: '/', expires: 7 });
                    tokens.sns_token && $.cookie('sns_token', tokens.sns_token, { path: '/', expires: 7, domain: root_domain });
                }
            }).call(document.scripts[document.scripts.length-1].parentNode);
            </script>
        </form>
        <div class="copyright">
            2016 ©  {{ config('custom.company') }}
        </div>
    </div>
@endsection
