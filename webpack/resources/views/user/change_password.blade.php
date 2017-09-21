@extends('adminmanager_standard')
{{-- 这是为了高毅新增的登录页 --}}
@section('asset-css')
    @if($host_theme == 'standard')
        <link href="{{ asset('/css/oms.login_v2.min.css') }}" rel="stylesheet">
    {{-- @elseif($condition) --}}
    @else
        <link href="{{ asset('/css/theme1/oms.login_v2.min.css') }}" rel="stylesheet">
    @endif
@endsection

@section('content')
    <!-- <script>window.REQUEST_PREFIX = "{{ config('view.path_prefix','') }}";</script> -->
    <div class="login-container">
        <h1><span>{{ config('custom.app_name') }}</span>资产管理平台</h1>
        <form style="padding-top: 28px;">
            <label style="text-align: center;font-weight: bold;margin-bottom: 40px;">首次登录，请修改登录密码</label>
            <!-- <label class="login_label">
                <input id="login_id" type="tel" name="cellphone" value="" placeholder="登录ID/手机号" login-pattern="^(\d{11}|\w{0,20})$" />
                <div class="error-tip hide"></div>
            </label> -->
            <label class="login_label">
                <!-- 密码 -->
                <input id="new_password" type="password" name="password" value="" placeholder="请设置新密码" login-pattern="^([a-zA-Z0-9])*$" />
                <div class="error-tip hide"></div>
            </label>
            <label class="login_label">
                <!-- 密码 -->
                <input id="new_password_bak" type="password" name="password" value="" placeholder="请再次确认新密码" />
                <div class="error-tip hide"></div>
            </label>
            <button class="loading-loading" type="submit">确认修改</button>
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
                    var url = '/bms-pub/user/modify_self_password';
                    var new_password = $('#new_password').val();
                    var new_password_bak = $('#new_password_bak').val();
                    if(me.find('.loading-loading').is('.loading')){return false;}

                    me.find('input').change();

                    if( me.find('input.stuck:first').length ){
                        var str = '只允许输入字母与数字';
                        var thisObj = me.find('input.stuck:first').parent('label');
                        thisObj.find('.error-tip').removeClass('hide').html(str);
                        thisObj.find('input').addClass('invalid');
                        return false;
                    }

                    if (new_password_bak !== new_password) {
                        var thisObj = me.find('#new_password_bak').parent('label');
                        thisObj.find('.error-tip').removeClass('hide').html('两次密码输入不一致');
                        // preventDefault()
                        return false;
                    }

                    me.find('.loading-loading').addClass('loading');
                    $.post(url, {
                        new_password: new_password
                    }).done(function(res) {
                        if(res.code == 0) {
                            var back_url = utils.search_get('back_url')
                            if (back_url.match(/\?/)) {
                                back_url += '&first_login=true';
                            }else{
                                back_url += '?first_login=true';
                            }
                            location.href = back_url;
                        }else{
                            // failNotice(res.msg);
                            var thisObj = me.find('#new_password').parent('label');
                            thisObj.find('.error-tip').removeClass('hide').html(res.msg);
                        }
                    }).always(function(){
                        me.find('.loading-loading').removeClass('loading');
                    }).fail(function(){
                        $('#new_password').addClass('invalid').parent('label').find('.error-tip').html(res.msg).removeClass('hide');

                        // if ('10010' == res.code || '10001' == res.code) {
                        //     $('#new_password').addClass('invalid').parent('label').find('.error-tip').html(res.msg).removeClass('hide');
                        // }else if('10003' == res.code){
                        //     $('#new_password').addClass('invalid').parent('label').find('.error-tip').html(res.msg).removeClass('hide');
                        // }else{
                        //     $('#new_password').addClass('invalid').parent('label').find('.error-tip').html(res.msg).removeClass('hide');
                        // }
                    });

                    return false;
                });
            }).call(document.scripts[document.scripts.length-1].parentNode);
            </script>
        </form>
    </div>
@endsection
