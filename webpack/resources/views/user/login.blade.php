@extends('adminmanager_standard')
{{-- 这是操盘侠原版的登陆页 --}}
@section('asset-css')
    @if($host_theme == 'standard')
        <link href="{{ asset('/css/oms.login.min.css') }}" rel="stylesheet">
    {{-- @elseif($condition) --}}
    @else
        <link href="{{ asset('/css/theme1/oms.login.min.css') }}" rel="stylesheet">
    @endif
@endsection

@section('content')
    <script type="text/javascript" src="{{ asset('/js/jquery.validate.min.js') }}"></script>
    <script>window.REQUEST_PREFIX = "{{ config('view.path_prefix','') }}";</script>
    <div class="login-container">
        <h1><span>{{ config('custom.app_name') }}</span>资产管理平台</h1>
        <form>
            <label class="login_label">
                <!-- 手机号 -->
                {{-- <input id="login_id" type="tel" name="cellphone" value="" placeholder="手机号" pattern="^\d{11}$" title="请输入正确的手机号" > --}}
                <input id="login_id" type="tel" name="login_id" value="" placeholder="登录ID" pattern="^\w{0,20}$" title="请输入正确的登录ID" >
                <div class="error-tip hide"></div>
            </label>
            <label class="login_label">
                <!-- 密码 -->
                <input id="login_password" type="password" name="password" value="" placeholder="密码" pattern="^.{4,}" title="请输入正确的密码" >
                <div class="error-tip hide"></div>
            </label>
            <button class="loading-loading" type="submit">登录</button>
            <script>

            (function(){
                //登录的特殊处理，因为pattern属性使得浏览器在submit时也会做判断，我们就无法自定义错误提示。
                $('[login-pattern]').on('change keyup focus',function(){
                    var patternStr = $(this).attr('login-pattern');
                    var reg = new RegExp(patternStr);
                    var value = $(this).val().trim();
                    var pass = false;

                    var pattern_pass = reg.test(value);
                    $(this).toggleClass('pattern-pass',pattern_pass).toggleClass('pattern-stuck',!pattern_pass);

                    var limit_rule_pass = true;
                    var limit_rule = $(this).attr('limit-rule');
                    if(limit_rule=='positive'){
                        limit_rule_pass = (+value>0);
                        $(this).toggleClass('limit-rule-pass',limit_rule_pass).toggleClass('limit-rule-stuck',!limit_rule_pass);
                    }

                    pass = (pattern_pass && limit_rule_pass);

                    pass
                        ?   $(this).removeClass('stuck').addClass('pass').trigger({type:'pattern_pass'})
                        :   $(this).removeClass('pass').addClass('stuck').trigger({type:'pattern_stuck'})
                }).change();

                $('.login_label>input').on('click focus',function(){
                    $('.error-tip').addClass('hide');
                    $(this).removeClass('invalid');
                    $(this).parent('label').find('.error-tip').addClass('hide');
                })
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
                        // $.omsAlert($.pullValue(res,'msg','请求异常'),false);
                        if ('10010' == res.code || '10001' == res.code) {
                            $('#login_id').addClass('invalid').parent('label').find('.error-tip').html(res.msg).removeClass('hide');
                        }else if('10003' == res.code){
                            $('#login_password').addClass('invalid').parent('label').find('.error-tip').html(res.msg).removeClass('hide');
                        }else{
                            $('#login_password').addClass('invalid').parent('label').find('.error-tip').html(res.msg).removeClass('hide');
                        }
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
