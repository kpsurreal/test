@extends('adminmanager_standard')

@section('asset-css')
    <link href="{{ asset('/css/oms.min.css') }}" rel="stylesheet">
@endsection

@section('content')
    <script>
    //全局配置
    window.REQUEST_PREFIX = "{{ config('view.path_prefix','') }}";
    </script>
    <script src="{{ asset('/js/oms/oms.app.js') }}"></script>

    {{-- <div class="new-oms-container">
        @include('common.sub_side_nav') --}}
        <div class="main-container">
            <div class="center-form">
                <div class="form-content-wrap">
                    <div class="form-content">
                        <form>
                            <h1>券商系统所需信息</h1>
                            <div class="field">
                                <label>营业部名称</label>
                                <div class="content">
                                    <input name="yybmc" required>
                                </div>
                            </div>
                            <div class="field">
                                <label>资金帐号</label>
                                <div class="content">
                                    <input name="zjzh" required>
                                </div>
                            </div>
                            <div class="field">
                                <label>资金密码</label>
                                <div class="content">
                                    <input name="zjmm" class="password" type="password" required>
                                </div>
                            </div>
                            <div class="field">
                                <label>深A 股东代码</label>
                                <div class="content">
                                    <input name="gddm_sz" required>
                                </div>
                            </div>
                            <div class="field">
                                <label>沪A 股东代码</label>
                                <div class="content">
                                    <input name="gddm_sh" required>
                                </div>
                            </div>
                            <div class="field">
                                <label></label>
                                <div class="content">
                                    <button class="oms-btn yellow loading-loading" type="submit">提交</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                <script>
                (function(){
                    var me = $(this);
                    var form = me.find('form');

                    form.on('submit',function(){
                        if(me.find('.loading-loading.loading').length){return false;}else{me.find('.loading-loading').addClass('loading');}
                        postStockMarketAcount();
                        return false;
                    });

                    function postStockMarketAcount(){
                        var url = (window.REQUEST_PREFIX||'') + '/oms/other/save_sec_info';
                        me.find('.loading-loading').addClass('loading');

                        $.post(url,form.serialize()).done(function(res){
                            res.code==0 ? success() : $.failNotice(url,res);
                        }).fail($.failNotice.bind(null,url)).always(function(){
                            me.find('.loading-loading').removeClass('loading');
                        });
                    }

                    function success(){
                        form.find('input').val('');
                        $.omsAlert('提交券商信息成功！',true,10000);
                    }

                }).call( document.scripts[document.scripts.length-1].parentNode );
                </script>
            </div>

        </div>
    {{-- </div> --}}
@endsection
