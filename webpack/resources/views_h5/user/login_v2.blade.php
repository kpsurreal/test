@extends('app_mobile')
{{-- 这是为了高毅新增的登录页 --}}
@section('asset-css')
    @if($host_theme == 'standard')
        <link href="{{ asset('/css/oms.login_v2.min.css') }}" rel="stylesheet">
    {{-- @elseif($condition) --}}
    @else
        <link href="{{ asset('/css/theme1/oms.login_v2.min.css') }}" rel="stylesheet">
    @endif
		<style>
		  .login-container{
				width: 94%;
			}
		  .login-container form{
				padding: 31px 43px;
			}
		</style>
@endsection

@section('content')
    <script>window.REQUEST_PREFIX = "{{ config('view.path_prefix','') }}";</script>
    <div class="login-container">
        <h1><span>{{ config('custom.app_name') }}</span>资产管理平台</h1>
        <form>
            <label class="login_label">
                <!-- 手机号 -->
                <input id="login_id" type="tel" name="login_id" value="" placeholder="登录ID" login-pattern="^\w{0,20}$" />
                {{-- <input id="login_id" type="tel" name="cellphone" value="" placeholder="登录ID/手机号" login-pattern="^(\w|[\u4E00-\u9FFF]){0,20}$" /> --}}
                <div class="error-tip hide"></div>
            </label>
            <label class="login_label">
                <!-- 密码 -->
                <input id="login_password" type="password" name="password" value="" placeholder="密码" />
                <div class="error-tip hide"></div>
            </label>
            <button class="loading-loading" type="submit">登 录</button>
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
                        var str = '该登录ID或手机号不存在';
                        var thisObj = me.find('input.stuck:first').parent('label');
                        thisObj.find('.error-tip').removeClass('hide').html(str);
                        thisObj.find('input').addClass('invalid');
                        return false;
                    }

                    me.find('.loading-loading').addClass('loading');
                    $.post(url, me.serialize()).done(function(res) {
                        if(res.code == 0) {
                            setLoginToken(res.data);
                            // safe_status 0 表示正常，1时才有“safe_msg（登入安全消息）”和“change_url（建议跳转路径）”
                            var back_url = utils.search_get('back_url')
                            if (1 == res.data.safe_status) {
                                // Begin: 判断是否需要走客户端流程，跳转特殊的登录页面
                                if(window.require && window.require('electron') &&
                                    window.require('electron').remote &&
                                    window.require('electron').remote.require('./main.js')
                                    //  && //下面的判断条件再client上会出现“Uncaught illegal access”，未找到解决版本，目前的判断起始也已经足够了
                                    // window.require('electron').remote.require('./main.js').getLoginUrl instanceof Function
                                ){
                                    var clientUrl = window.require('electron').remote.require('./main.js').getLoginUrl();
                                    if (undefined != clientUrl) {
                                        location.href = res.data.change_url + '?back_url=' + encodeURIComponent((window.REQUEST_PREFIX || '')+clientUrl);
                                        return;
                                    }
                                }
                                // End: 判断是否需要走客户端流程，跳转特殊的登录页面

                                if (back_url) {
                                    location.href = res.data.change_url + '?back_url=' + back_url;
                                }else{
                                    location.href = res.data.change_url + '?back_url=' + encodeURIComponent(window.REQUEST_PREFIX+'/oms');
                                }
                            }else{
                                // Begin: 判断是否需要走客户端流程，跳转特殊的登录页面
                                if(window.require && window.require('electron') &&
                                    window.require('electron').remote &&
                                    window.require('electron').remote.require('./main.js')
                                    //  && //下面的判断条件再client上会出现“Uncaught illegal access”，未找到解决版本，目前的判断起始也已经足够了
                                    //  &&
                                    // window.require('electron').remote.require('./main.js').getLoginUrl instanceof Function
                                ){
                                    var clientUrl = window.require('electron').remote.require('./main.js').getLoginUrl();
                                    if(undefined != clientUrl){
                                        location.href = (window.REQUEST_PREFIX || '') + clientUrl;
                                        return;
                                    }
                                }
                              // End: 判断是否需要走客户端流程，跳转特殊的登录页面

																if (back_url) {
                                    location.href = window.REQUEST_PREFIX + decodeURIComponent(back_url);
                                }else{
																	  location.replace(window.REQUEST_PREFIX+'/oms/instruction/frontend');
															  }

                            }
                        }else{
                            failNotice(res);
                        }
                    }).always(function(){
                        // 不能在这里removeClass，因为成功后立即remove后，可能跳转的url还在一直等待，导致好几秒钟没有转圈等待效果。
                    }).fail(failNotice);

                    function failNotice(res){
                        me.find('.loading-loading').removeClass('loading');
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

                if ('timeout' == utils.search_get('alert')) {
                    var thisObj = me.find('#login_id').parent('label');
                    thisObj.find('.error-tip').removeClass('hide').html('登录状态失效，请重新登录');
                }
            }).call(document.scripts[document.scripts.length-1].parentNode);
            </script>
        </form>
    </div>
@endsection
