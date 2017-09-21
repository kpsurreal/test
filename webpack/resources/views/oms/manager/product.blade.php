@extends('adminmanager_standard')

@section('asset-css')
    <link href="{{ asset('/js/jquery-confirm/jquery-confirm.min.css') }}" rel="stylesheet">
    <link href="{{ asset('/css/oms.min.css') }}" rel="stylesheet">
    <link href="{{ asset('/css/oms_v2/user.min.css') }}" rel="stylesheet">
    <style>
    label>label.tips{
        float: right;
    }
    label.confirm-tips{
        color: #F44336;
        position: absolute;
        display: block;
        right: 15px;
        top: -20px;
    }
    input.tips{
        border-color: #F44336!important;
    }
    input.confirm-tips{
        border-color: #F44336!important;
    }
    .jconfirm-box-container{
        margin-left: 33%;
        width: 380px;
        position: relative;
        min-height: 1px;
        padding-right: 15px;
        padding-left: 15px;
    }
    .jconfirm.jconfirm-white .jconfirm-box .buttons button.btn-default{
        padding: 2px 4px;
        border-radius: 2px;
        background: #fff;
        color: #5b8cf1;
        font-weight: normal;
    }
    .jconfirm.jconfirm-white .jconfirm-box .buttons{
        float: none;
        text-align: center;
    }
    .jconfirm .jconfirm-box .buttons button+button{
        margin-left: 10px;
    }
    .jconfirm .jconfirm-box div.content-pane .content{
        padding-top: 20px;
        /*padding-bottom: 20px;*/
    }
    .confirm-class{
        width: 100px;
        height: 40px;
        background-color: #FFDE00;
        border-radius: 2px;
        color: #333!important;
        font-size: 16px!important;
    }
    .cancel-class{
        width: 100px;
        height: 40px;
        background-color: #f9f9f9;
        border-radius: 2px;
        border: 1px solid #ccc!important;
        color: #333!important;
        font-size: 16px!important;
    }
    .custom-window-width{
        width: 470px;
    }

    tbody {
        display:block;
        max-height: 460px;
        overflow:auto;
        overflow-y:scroll;
    }
    thead, tbody tr {
        display:table;
        width:100%;
        table-layout:fixed;
    }
    thead {
        width: calc( 100% - 1em )
    }
    </style>
@endsection

@section('content')
    <script>
    //全局配置
    window.ENV = window.ENV || {};
    window.REQUEST_PREFIX = "{{ config('view.path_prefix','') }}";
    </script>
    <script src="{{asset('/js/jquery.validate.min.js')}}" type="text/javascript"></script>
    <script src="{{asset('/js/oms/custom.validate.js')}}" type="text/javascript"></script>
    <script src="{{asset('/js/plugin/doT.min.js')}}" type="text/javascript"></script>
    <script src="{{ asset('/js/jquery-confirm/jquery-confirm.min.js') }}"></script>

    {{-- <div class="new-oms-container">
        @include('common.side_nav') --}}
        <div class="main-container fc">
            <section class="section-container">
                <div>
                    <h2 class="container-title">产品管理</h2>
                    <a class="btn_add productAdd_btn"><i></i>新建产品</a>
                    <div style="clear:both;"></div>
                </div>
                <div class="container-content">
                    <div>
                        <span class="content-title">产品列表</span>
                        <span class="content-tip">产品总数：</span>
                        <span class="content-tip product_num"></span>
                    </div>
                    <div style="padding-bottom: 20px;">
                        <p style="margin-left:10px;display:none;"><span class="cancel_num color-red">2个</span>产品的基金经理已<span class="color-red">被注销</span>，可点击<span class="color-red">编辑</span>重新分配</p>
                    </div>
                    <table class="oms-table nothing-nothing loading-loading">
                        <thead>
                            <tr rows-head>
                                <th class="cell-left">产品名称</th>
                                <th class="cell-right" style="width: 80px;">产品编号</th>
                                <th class="cell-left">单元名称</th>
                                <th class="cell-right" style="width: 80px;">单元编号</th>
                                <th class="cell-left" style="width: 120px;">券商</th>
                                <th class="cell-left">基金经理</th>
                                <th class="cell-right">创建日期</th>
                                <th class="cell-left" style="width:80px;padding-left:20px;"></th>
                            </tr>
                        </thead>
                        <tbody rows-body id="product_list_content">

                        </tbody>
                    </table>
                </div>

            </section>
            <section class="section_window productAdd_container">
                <div class="container-content">
                    <div>
                        <span class="content-title">新建产品</span>
                        <form id="productAdd-form" class="gaoyi-form" autocomplete="off">
                            {{-- <input style="display:none;" name="hide_name" type="text"/>
                            <input style="display:none;" name="hide_password" type="password"  /> --}}
                            <div class="form-field">
                                <label class="form-left">券商<b>*</b></label>
                                <select name="securities_id" class="input-text pb_name" placeholder="请选择券商">

                                </select>
                                {{-- <input name="real_name" class="input-text " type="text" placeholder="请选择券商" /> --}}
                            </div>
                            <div class="form-field">
                                <label class="form-left">pb账号<b>*</b></label>
                                <div class="account_list">
                                </div>
                            </div>
                            <div class="form-field">
                                <label class="form-left">产品名称<b>*</b></label>
                                <input name="pb_product_name" class="input-text " type="text" placeholder="请输入pb中的产品名称" />
                            </div>
                            <div class="form-field">
                                <label class="form-left">产品编号<b>*</b></label>
                                <input name="pb_product_id" class="input-text " type="text" placeholder="请输入pb中的产品编号" />
                            </div>
                            <div class="form-field">
                                <label class="form-left">单元名称<b>*</b></label>
                                <input name="unit_name" class="input-text " type="text" placeholder="请输入pb中的单元名称" />
                            </div>
                            <div class="form-field">
                                <label class="form-left">单元编号<b>*</b></label>
                                <input name="unit_id" class="input-text " type="text" placeholder="请输入pb中的单元编号" />
                            </div>
                            <div class="form-field">
                                <label class="form-left">操作人<b>*</b></label>
                                <div style="width: 320px;display: inline-block;vertical-align: top;">
                                    <div class="manager_list">

                                    </div>
                                    <hr style="margin-bottom: 10px;">
                                    <span style="color: #9B9B9B;font-size: 14px;">没有找到需要的操作人</span><a class="btn_manager_add" style="margin-left:10px;color:#4A90E2;cursor:pointer;">去添加</a>
                                </div>

                            </div>

                            {{-- <p class="form-field">
                                <label class="form-left">pb账号<b>*</b></label>
                                <input name="real_name" class="input-text real_name" type="text" placeholder="请输入账号" />
                            </p>
                            <div class="form-field">
                                <label class="form-left">密码<b>*</b></label>
                                <input name="password" class="input-text password" type="text" placeholder="请输入密码"  />
                                <div style="display: inline-block;position: absolute;width: 290px;left: 95px;">
                                    <div class="showPasswordIcon"></div>
                                </div>
                            </div> --}}
                            {{-- <hr style="margin-left: 100px;width: 320px;margin-bottom: 10px;" />
                            <div class="form-field">
                                <label class="form-left"></label>
                                <label><input type="checkbox" class="is_specify" />指定为所有新建产品的基金经理</label>
                            </div> --}}
                            <div>
                                <button type="submit" class="form_submit_btn">添加并返回</button>
                                <button type="button" class="cancel_btn">取消</button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
            <section class="section_window productEdit_container">
                <div class="container-content">
                    <div>
                        <span class="content-title">编辑产品</span>
                        <form id="productEdit-form" class="gaoyi-form" autocomplete="off">
                            {{-- <input style="display:none;" name="hide_name" type="text"/>
                            <input style="display:none;" name="hide_password" type="password"  /> --}}
                            <span style="display:none;" class="product_id"></span>
                            <div class="form-field">
                                <label class="form-left">券商</label>
                                <span class="securities_name"></span>
                            </div>
                            <div class="form-field">
                                <label class="form-left">pb账号<b>*</b></label>
                                <div class="account_list">
                                </div>
                            </div>
                            <div class="form-field">
                                <label class="form-left">产品编号</label>
                                <span class="pb_product_id"></span>
                                {{-- <input name="pb_product_id" class="input-text " type="text" placeholder="请输入pb中的产品编号" /> --}}
                            </div>
                            <div class="form-field">
                                <label class="form-left">单元编号</label>
                                <span class="unit_id"></span>
                                {{-- <input name="unit_id" class="input-text " type="text" placeholder="请输入pb中的单元编号" /> --}}
                            </div>

                            <div class="form-field">
                                <label class="form-left">产品名称<b>*</b></label>
                                <input name="pb_product_name" class="input-text pb_product_name" type="text" placeholder="请输入pb中的产品名称" />
                            </div>
                            <div class="form-field">
                                <label class="form-left">单元名称<b>*</b></label>
                                <input name="unit_name" class="input-text unit_name" type="text" placeholder="请输入pb中的单元名称" />
                            </div>

                            <div class="form-field">
                                <label class="form-left">操作人<b>*</b></label>
                                <div style="width: 320px;display: inline-block;vertical-align: top;">
                                    <div class="manager_list">

                                    </div>
                                    <hr style="margin-bottom: 10px;">
                                    <span style="color: #9B9B9B;font-size: 14px;">没有找到需要的操作人</span><a class="btn_manager_add" style="margin-left:10px;color:#4A90E2;cursor:pointer;">去添加</a>
                                </div>
                            </div>

                            {{-- <p class="form-field">
                                <label class="form-left">pb账号<b>*</b></label>
                                <input name="real_name" class="input-text real_name" type="text" placeholder="请输入账号" />
                            </p>
                            <div class="form-field">
                                <label class="form-left">密码<b>*</b></label>
                                <input name="password" class="input-text password" type="text" placeholder="请输入密码"  />
                                <div style="display: inline-block;position: absolute;width: 290px;left: 95px;">
                                    <div class="showPasswordIcon"></div>
                                </div>
                            </div> --}}
                            {{-- <hr style="margin-left: 100px;width: 320px;margin-bottom: 10px;" />
                            <div class="form-field">
                                <label class="form-left"></label>
                                <label><input type="checkbox" class="is_specify" />指定为所有新建产品的基金经理</label>
                            </div> --}}
                            <div>
                                <button type="submit" class="form_submit_btn">修改并返回</button>
                                <button type="button" class="cancel_btn">取消</button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
            <span id="page_tip" class="hide"></span>
        </div>
    {{-- </div> --}}
    <script id="tabletmpl" type="text/x-dot-template">
        @{{~it.array.lists:v:i}}
            <tr>
                <td class="cell-left">
                    <span class="table-ellipsis" title="@{{=v.pb_info.pb_product_name||'--'}}">@{{=v.pb_info.pb_product_name||'--'}}</span>
                </td>
                <td class="cell-right pb_product_id" style="width: 80px;">@{{=v.pb_info.pb_product_id||'--'}}</td>
                <td style="display:none;" class="product_id">@{{=v.pb_info.product_id}}</td>
                <td class="cell-left">
                    <span class="table-ellipsis" title="@{{=v.pb_info.unit_name||'--'}}">@{{=v.pb_info.unit_name||'--'}}</span>
                </td>
                <td class="cell-right" style="width: 80px;">@{{=v.pb_info.unit_id||'--'}}</td>
                <td class="cell-left" style="width: 120px;">@{{=v.securities_name||'--'}}</td>
                <td class="cell-left">
                    <span class="table-ellipsis" title="@{{=v.users_str||'--'}}">@{{=v.users_str||'--'}}</span>
                </td>
                <td class="cell-right">@{{=v.created_at||'--'}}</td>
                <td class="cell-left" style="width: 80px;">
                    <a class="table_btn edit">编辑</a>
                </td>
            </tr>
        @{{~}}
    </script>
    <script>
    var jc;
    var gridData = {};
    var tipTimer;
    var product_add_data = {};
    var tablefn = doT.template(document.getElementById('tabletmpl').text, undefined, undefined);

    function InitEditTable(){
        $('#productEdit-form .pb_name').html()
        $('#productEdit-form .securities_name').html();
        $('#productEdit-form .product_id').html();
        $('#productEdit-form .account_list').html();
        $('#productEdit-form .pb_product_id').html();
        $('#productEdit-form .unit_id').html();
        $('#productEdit-form .pb_product_name').val();
        $('#productEdit-form .unit_name').val();
        $('#productEdit-form .manager_list').html('');
    }

    function getTableData(){
        $.ajax({
            type: 'get',
            url: window.REQUEST_PREFIX + '/product/lists',
            success: function(res){
                gridData.array = res.data;
                showTable(gridData);
                // debugger;
            },
            error: function(){

            }
        });
    }

    function showTable(data){
        $('.product_num').html(data.array.lists.length);
        var cancel_count = Number(data.array.cancel_count);
        if(0 !== cancel_count){
            $('.cancel_num').html(data.array.cancel_count + '个').parent().show();
        }else{
            $('.cancel_num').parent().hide();
        }

        document.getElementById('product_list_content').innerHTML = tablefn(data);//历史列表
    }

    $(function(){
        getTableData();

        $(document).on('click', '#productAdd-form .cancel_btn, #productEdit-form .cancel_btn', function(){
            $('.section_window form').each(function(){
                $(this)[0].reset();
                $(this).validate().resetForm();
            });
            $('.section_window').hide();
            $('.manager_list').html('');
            InitEditTable();
            $('.productAdd_btn').show();
        });

        //begin: 新建产品
        $('.productAdd_btn').click(function(){
            $('.productAdd_container').find('form').validate().resetForm();
            $('.productAdd_btn').hide();
            $('.productAdd_container').show();
            $.ajax({
                url: window.REQUEST_PREFIX + '/product/get_add',
                type: 'get',
                success: function(res){
                    if (0 === res.code) {
                        product_add_data.pb = [];
                        Object.keys(res.data.sec_list).forEach(function(e, index){
                            product_add_data.pb.push({'id':e, 'name':res.data.sec_list[e], 'account_list': res.data.account_list[e]})
                        });
                        product_add_data.manager_list = res.data.manager_list;
                    }

                    /**
                     * 排序处理，将默认指定的基金经理排列到前面
                     * is_specify为1则是指定，为0则是未指定
                     */
                    product_add_data.manager_list.sort(function(a,b){
                        return b.is_specify - a.is_specify;
                    });

                    // 修改券商下拉框
                    var html = '';
                    product_add_data.pb.forEach(function(e){
                        html += '<option value="'+ e.id +'">'+ e.name +'</option>';
                    });
                    $('#productAdd-form .pb_name').html(html).change();

                    //修改基金经理多选框
                    var html = '';
                    product_add_data.manager_list.forEach(function(e){
                        var phoneStr = '';
                        if ('' == e.cellphone) {
                            ;
                        }else{
                            phoneStr = ' ('+ e.cellphone +')';
                        }
                        if (1 == e.is_specify) {
                            html += '<label class="checkbox-oneLine"><input type="checkbox" checked="checked" name="role_id" class="role_id" value="'+ e.user_id +'" />'+ e.real_name + phoneStr +'</label>';
                        }else{
                            html += '<label class="checkbox-oneLine"><input type="checkbox" class="role_id" name="role_id" value="'+ e.user_id +'" />'+ e.real_name + phoneStr +'</label>';
                        }

                    });
                    $('#productAdd-form .manager_list').html(html)
                }
            })
        });
        $(document).on('change', '#productAdd-form .pb_name', function(){
            var html = '';
            product_add_data.pb.forEach(function(e){
                if (e.id == $('#productAdd-form .pb_name').val()) {
                    e.account_list.forEach(function(el){
                        html += '<label class="radio-sameLine"><input name="permission-trade" type="radio" class="pb_account" value="'+ el +'" />'+ el +'</label>';
                    })
                }
            });
            $('#productAdd-form .account_list').html(html);
        }).on('click', '#productAdd-form .btn_manager_add, #productEdit-form .btn_manager_add', function(){
            var html = `<form id="useradd-form" class="gaoyi-form" autocomplete="off">
                <input style="display:none;" name="hide_name" type="text"/>
                <input style="display:none;" name="hide_password" type="password"  />
                <p class="form-field">
                    <label class="form-left" style="margin-left:0;">用户名<b>*</b></label>
                    <input name="real_name" class="input-text real_name" type="text" placeholder="输入用户名" />
                </p>
                <p class="form-field">
                    <label class="form-left" style="margin-left:0;">手机号</label>
                    <input name="cellphone" class="input-text cellphone" type="text" placeholder="输入电话号码" />
                </p>
                <div class="form-field">
                    <label class="form-left" style="margin-left:0;">初始密码<b>*</b></label>
                    <input name="password" class="input-text password" type="text" placeholder="输入初始密码，首次登录将提示修改"  />
                    <div style="display: inline-block;position: absolute;width: 320px;left: 80px;display:none;">
                        <div class="showPasswordIcon"></div>
                    </div>
                </div>
                <div class="form-field">
                    <label class="form-left" style="margin-left:0;">角色<b>*</b></label>
                    <label><input checked="checked" type="radio" class="role_id" value="11" />基金经理</label>
                </div>
                <div>
                    <button type="submit" class="form_submit_btn" style="margin-left: 40px;">添加并选中</button>
                    <button type="button" class="cancel_btn">取消</button>
                </div>
            </form>`;
            jc = $.confirm({
                title: '添加用户',
                content: html,
                closeIcon: true,
                columnClass: 'custom-window-width',
                confirmButton: false,
                cancelButton: false
            });
            validateUseraddForm();
        });

        function validateUseraddForm(){
            $("#useradd-form").validate({
                'errorClass': 'confirm-tips',
                // 'errorElement': 'div',
                rules: {
                    'real_name':{
                        required: true,
                        checkChineseAlphaNumber: true,
                        maxlength: 16
                    },
                    'password': {
                        checkPassword: true,
                        required: true,
                        maxlength: 20
                    },
                    'cellphone': {
                        checkphone: true,
                    }
                },
                messages: {
                    'real_name':{
                        required: '请输入用户名',
                        checkChineseAlphaNumber: '只允许输入汉字、字母、数字',
                        maxlength: '最多允许输入16个字'
                    },
                    'password':{
                        checkPassword: '只允许输入字母与数字',
                        required: '请输入密码',
                        maxlength: '最多允许输入20个字符'
                    },
                    'cellphone': {
                        checkphone: '手机号格式不正确'
                    }
                },
                errorPlacement: function(error, element) {
                    error.appendTo(element.parent());
                },
                submitHandler: function (form) {
                    var real_name = $('#useradd-form .real_name').val();
                    var password = $('#useradd-form .password').val();
                    var cellphone = $('#useradd-form .cellphone').val();
                    var role_id = $('#useradd-form .role_id').val();
                    var is_specify = $('#useradd-form .is_specify').prop('checked')?1:0;

                    $.ajax({
                        type: 'post',
                        url: window.REQUEST_PREFIX + '/user/create_user',
                        data:{
                            real_name: real_name,
                            password: password,
                            cellphone: cellphone,
                            role_id: role_id,
                            is_specify: is_specify
                        },
                        success: function(res){
                            if (0 == res.code) {
                                //隐藏弹窗，然后提示
                                $('#useradd-form')[0].reset();
                                jc.close();
                                // 用户列表新增一个用户，然后选中
                                var html = '<label class="checkbox-oneLine"><input type="checkbox" checked="checked" name="role_id" class="role_id" value="'+ res.data.user_id +'" />'+ res.data.real_name +'</label>';
                                $('#productAdd-form .manager_list').prepend(html);
                                $('#productEdit-form .manager_list').prepend(html);
                            }else{

                            }
                            if (tipTimer) {
                                clearTimeout(tipTimer);
                                tipTimer = undefined;
                            }
                            $('#page_tip').html(res.msg).removeClass('hide');
                            tipTimer = setTimeout(function(){
                                $('#page_tip').addClass('hide');
                            }, 3 * 1000);
                        }
                    });
                }
            });
        }

        function validateProductAddForm(){
            $("#productAdd-form").validate({
                'errorClass': 'tips',
                // 'errorElement': 'div',
                rules: {
                    'pb_product_id': {
                        //pb产品编号
                        required: true,
                        number: true
                    },
                    'pb_product_name': {
                        //pb产品名称
                        required: true,
                        checkChineseAlphaNumber: true,
                        maxlength: 50
                    },
                    'unit_id': {
                        //单元id
                        required: true,
                        number: true
                    },
                    'unit_name': {
                        //单元名称
                        required: true,
                        checkChineseAlphaNumber: true,
                        maxlength: 50
                    },
                    'role_id': {
                        required: true
                    }
                },
                messages: {
                    'pb_product_id': {
                        //pb产品编号
                        required: '产品编号不能为空',
                        number: '产品编号必须为数字'
                    },
                    'pb_product_name': {
                        //pb产品名称
                        required: '产品名称不能为空',
                        checkChineseAlphaNumber: '只允许输入汉字、字母、数字',
                        maxlength: '最多不得超过50个字'
                    },
                    'unit_id': {
                        //单元id
                        required: '单元编号不能为空',
                        number: '单元编号必须为数字'
                    },
                    'unit_name': {
                        //单元名称
                        required: '单元名称不能为空',
                        checkChineseAlphaNumber: '只允许输入汉字、字母、数字',
                        maxlength: '最多不得超过50个字'
                    },
                    'role_id': {
                        required: '基金经理不能为空'
                    }
                },
                errorPlacement: function(error, element) {
                    error.appendTo(element.parent());
                },
                submitHandler: function (form) {
                    var fund_manager = '';
                    var fund_manager_arr = [];
                    $("#productAdd-form .manager_list").find('input:checked').each(function(e){
                        fund_manager_arr.push($(this).val());
                    });
                    fund_manager = fund_manager_arr.join(',');
                    $.ajax({
                        type: 'post',
                        url: window.REQUEST_PREFIX + '/product/post_add',
                        data:{
                            securities_id: $("#productAdd-form .pb_name").val(),
                            pb_account: $("#productAdd-form .account_list").find('input:checked').val(),
                            pb_product_id: $("#productAdd-form [name='pb_product_id']").val(),
                            pb_product_name: $("#productAdd-form [name='pb_product_name']").val(),
                            unit_id: $("#productAdd-form [name='unit_id']").val(),
                            unit_name: $("#productAdd-form [name='unit_name']").val(),
                            fund_manager: fund_manager
                        },
                        success: function(res){
                            if (0 == res.code) {
                                //隐藏弹窗，然后提示
                                getTableData();
                                $('#productAdd-form')[0].reset();
                                $('.section_window').hide();
                                $('.manager_list').html('');
                                $('.productAdd_btn').show();
                            }else{

                            }
                            if (tipTimer) {
                                clearTimeout(tipTimer);
                                tipTimer = undefined;
                            }
                            $('#page_tip').html(res.msg).removeClass('hide');
                            tipTimer = setTimeout(function(){
                                $('#page_tip').addClass('hide');
                            }, 3 * 1000);
                        }
                    });
                }
            });
        }
        validateProductAddForm();

        $(document).on('click', '#useradd-form .cancel_btn', function(){
            jc.close();
        })
        //end: 新建产品

        //Begin: 编辑产品
        function validateProductEditForm(){
            $("#productEdit-form").validate({
                'errorClass': 'tips',
                // 'errorElement': 'div',
                rules: {
                    'pb_product_name': {
                        //pb产品名称
                        required: true,
                        checkChineseAlphaNumber: true,
                        maxlength: 50
                    },
                    'unit_name': {
                        //单元名称
                        required: true,
                        checkChineseAlphaNumber: true,
                        maxlength: 50
                    },
                    'role_id': {
                        required: true
                    }
                },
                messages: {
                    'pb_product_name': {
                        //pb产品名称
                        required: '产品名称不能为空',
                        checkChineseAlphaNumber: '只允许输入汉字、字母、数字',
                        maxlength: '最多不得超过50个字'
                    },
                    'unit_name': {
                        //单元名称
                        required: '单元名称不能为空',
                        checkChineseAlphaNumber: '只允许输入汉字、字母、数字',
                        maxlength: '最多不得超过50个字'
                    },
                    'role_id': {
                        required: '基金经理不能为空'
                    }
                },
                errorPlacement: function(error, element) {
                    error.appendTo(element.parent());
                },
                submitHandler: function (form) {
                    var fund_manager = '';
                    var fund_manager_arr = [];
                    $("#productEdit-form .manager_list").find('input:checked').each(function(e){
                        fund_manager_arr.push($(this).val());
                    });
                    if(fund_manager_arr.some(function(e){return e == 0})){
                        if (tipTimer) {
                            clearTimeout(tipTimer);
                            tipTimer = undefined;
                        }
                        $('#page_tip').html('您选择了已注销的基金经理，请重新分配').removeClass('hide');
                        tipTimer = setTimeout(function(){
                            $('#page_tip').addClass('hide');
                        }, 3 * 1000);
                        return false;
                    }

                    fund_manager = fund_manager_arr.join(',');
                    $.ajax({
                        type: 'post',
                        url: window.REQUEST_PREFIX + '/product/modify',
                        data:{
                            product_id: $('#productEdit-form .product_id').html(),
                            //securities_id: $("#productAdd-form .pb_name").val(),
                            pb_account: $("#productEdit-form .account_list").find('input:checked').val(),
                            //pb_product_id: $("#productAdd-form [name='pb_product_id']").val(),
                            pb_product_name: $("#productEdit-form [name='pb_product_name']").val(),
                            //unit_id: $("#productAdd-form [name='unit_id']").val(),
                            unit_name: $("#productEdit-form [name='unit_name']").val(),
                            fund_manager: fund_manager
                        },
                        success: function(res){
                            if (0 == res.code) {
                                //隐藏弹窗，然后提示
                                $('#productEdit-form')[0].reset();
                                $('.section_window').hide();
                                InitEditTable();
                                $('.productAdd_btn').show();
                                getTableData();
                            }else{

                            }
                            if (tipTimer) {
                                clearTimeout(tipTimer);
                                tipTimer = undefined;
                            }
                            $('#page_tip').html(res.msg).removeClass('hide');
                            tipTimer = setTimeout(function(){
                                $('#page_tip').addClass('hide');
                            }, 3 * 1000);
                        }
                    });
                }
            });
        }
        validateProductEditForm();
        $(document).on('click', '.table_btn.edit', function(){
            var product_id = $(this).parents('tr').find('.product_id').html();
            if ('undefined' ==  product_id) {
                return;
            }
            $.ajax({
                type: 'get',
                url: window.REQUEST_PREFIX + '/product/detail/' + product_id,
                success: function(res){
                    if (0 == res.code) {
                        $('#productEdit-form .securities_name').html(res.data.pb_info.securities_name);
                        var html = '';
                        res.data.pb_accounts.forEach(function(e){
                            if (res.data.pb_info.pb_account === e) {
                                html += '<label class="radio-sameLine"><input checked="checked" name="permission-trade" type="radio" class="pb_account" value="'+ e +'" />'+ e +'</label>';
                            }else{
                                html += '<label class="radio-sameLine"><input name="permission-trade" type="radio" class="pb_account" value="'+ e +'" />'+ e +'</label>';
                            }
                        });
                        $('#productEdit-form .product_id').html(product_id);
                        $('#productEdit-form .account_list').html(html);
                        $('#productEdit-form .pb_product_id').html(res.data.pb_info.pb_product_id);
                        $('#productEdit-form .unit_id').html(res.data.pb_info.unit_id);
                        $('#productEdit-form .pb_product_name').val(res.data.pb_info.pb_product_name);
                        $('#productEdit-form .unit_name').val(res.data.pb_info.unit_name);

                        //修改基金经理多选框
                        var html = '';
                        /**
                         * 排序处理，将已注销和已选中的排列到前排
                         * 对状态进行排序，1为正常 2为已注销
                         * 对是否选中进行排序，0为未选中 1为选中——状态的优先级高于是否选中
                         * 特别主意，不能通过两次sort分别对这两个判断条件进行排序
                         */
                        res.data.users.sort(function(a,b){
                            // return a.status < b.status;
                            if(a.status === b.status){
                                return b.is_manager - a.is_manager;//why b - a? 因为b-a得到的是从大到小的排序，而这里需要较大的数（is_manager=1 选中）在前面
                            }else{
                                return b.status - a.status;//why b - a? 因为b-a得到的是从大到小的排序，而这里需要较大的数（status=2 已注销）在前面
                            }
                        });
                        res.data.users.forEach(function(e, i){
                            var str = '';
                            if (1 == e.is_manager) {
                                str = ' checked="checkde"';
                            }else{
                                ;
                            }
                            var phoneStr = '';
                            if ('' == e.cellphone) {
                                ;
                            }else{
                                phoneStr = ' ('+ e.cellphone +')';
                            }
                            if (1 == e.status) {
                                html += '<label class="checkbox-oneLine"><input'+ str +' type="checkbox" name="role_id" class="role_id" value="'+ e.user_id +'" />'+ e.real_name + phoneStr +'</label>';
                            }else{
                                //已注销用户，value值人为设置为0，用于编辑提交时的校验
                                html += '<label class="checkbox-oneLine"><input'+ str +' type="checkbox" name="role_id" class="role_id" value="'+ 0 +'" />'+ e.real_name + phoneStr + '(已注销)' +'</label>';
                            }

                        });
                        $('#productEdit-form .manager_list').html(html)
                    }
                }
            })
            $('.productEdit_container').show();
            $('.productAdd_btn').hide();
        })
        //End：编辑产品
    })
    </script>
@endsection
