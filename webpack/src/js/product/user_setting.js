/**
 * author: liuzeyafzy
 * 人员分配页面
 */
function JS_user_setting(prefix){
  let selectize = {};
  let managerArr = [];

  initProductHeader(prefix);

  // FD.org_info
  let productMenu = new Vue({
    el: '#productMenu',
    data: {
      active: 'user_setting',
      permission: FD.permission,
      disabled: (FD.fee_mode == 1) ? 'fee_setting' : ''
    },
    methods: {
      goto: function goto(e) {
        var li = $(e.currentTarget);
        if (!li.hasClass('active') && !li.hasClass('disabled')) {
          location.href = prefix + '/product/' + li.attr('data-str') + '?product_id=' + FD.product_id;
        }
      }
    }
  });

  let userSetting = new Vue({
    el: '#user_setting',
    data: {
      editPermission: {
        user_id: '',
        role_id: '',
        permissions: []
      },
      usersInfo: FD.usersInfo,
      rolePermissions: FD.rolePermissions
    },
    methods: {
      displayPermissionsStr: function(v){
        let rtn = '';
        Object.keys(v).forEach(function(e){
          rtn += v[e] + '；';
        });
        return rtn;
      },
      hasPermission: function(permissions, v){
        return Object.keys(permissions).some(function(e){
          return v == e;
        })
      },
      getUserSetting: function(callBack){
        var _this = this;
        $.ajax({
          url: prefix + '/product/user_setting?format=json&product_id=' + FD.product_id,
          success: function({code, msg, data}){
            if (0 == code) {
              _this.usersInfo.splice(0);
              data.lists.forEach(function(e){
                _this.usersInfo.push(e);
              });

              if (Object.prototype.toString.call(callBack) === '[object Function]') {
                callBack(data);
              }
            }else{
              $.omsAlert(msg);
            }

          },
          error: function(){
            $.failNotice();
          }
        })
      },
      doEdit: function(v){
        var _this = this;
        // 取出匹配到的用户id和角色枚举值
        this.usersInfo.forEach(function(e){
          if (e.user_info.user_id == v) {
            _this.editPermission.user_id = e.user_info.user_id;
            _this.editPermission.role_id = e.user_info.role_id;
          }
        });

        // 根据枚举值填充权限颗粒
        let permissions = [];
        if (v == _this.editPermission.user_id) {
          Object.keys(_this.rolePermissions).forEach(function (e) {
            if ( _this.editPermission.role_id.some(function(v){ return v == e }) ) {
              _this.rolePermissions[e].forEach(function(el){
                Object.keys(el.permissions).forEach(function (ele) {
                  // 需要去重，value值已经存在，则不需要添加
                  if (!permissions.some(function(per){
                    return per.value == ele;
                  })) {
                    permissions.push({
                      name: el.permissions[ele],
                      value: ele
                    });
                  }
                });
              });
            }
          });
        }

        permissions.sort(function(a, b){
          return a.value - b.value;
        });

        if (permissions.length === 0) {
          console.log('用户id为' + v + '的用户拥有错误的角色枚举值');
        }

        _this.editPermission.permissions = permissions;
      },
      doDelete: function(user_id){
        var html = `<div style="text-align: center;height: 150px;line-height: 150px;"><i class="warn-icon"></i>删除后该用户不再有权限操作此账户，确定删除？</div>`;
        $.confirm({
          title: '删除确认',
          content: html,
          closeIcon: true,
          columnClass: 'custom-window-width',
          confirmButton: '确定',
          confirm: function(){
            $.startLoading('正在删除...');
            $.ajax({
              url: prefix + '/product/del_user',
              type: 'post',
              data: {
                product_id: FD.product_id,
                user_id: user_id
              },
              success: function({code, msg, data}){
                $.clearLoading();
                if (0 == code) {
                  $.omsAlert('用户删除成功');

                  // 删除成功后，要更新已添加人员信息
                  userSetting.getUserSetting(function(){
                    // 删除成功后，要更新底部的用户数据，以便被删除的用户显示在列表中
                    getRoleUsers();
                  });
                }else{
                  $.omsAlert('用户删除失败，请重试');
                }
              },
              error: function(){
                $.clearLoading();
                $.failNotice('网络异常，用户删除失败，请重试')
              }
            })
          },
          cancelButton: false
        });
      },
      saveEdit: function(user_id){
        var _this = this;
        var permissionsArr = [];
        $('.editTd').find('input:checked').each(function(){
          // console.log($(this).val())
          permissionsArr.push($(this).val());
        });
        $.startLoading('正在修改...');
        $.ajax({
          url: prefix + '/user/set_product_permissions',
          type: 'post',
          data: {
            product_id: FD.product_id,
            user_id: user_id,
            permission_ids: permissionsArr.join(',')
          },
          success: function({code, msg, data}){
            $.clearLoading();
            if (0 == code) {
              $.omsAlert('权限修改成功')
            }else{
              $.omsAlert(msg);
            }
            _this.getUserSetting();
            _this.cancelEdit();
          },
          error: function(){
            $.clearLoading();
            $.failNotice('权限修改失败，请重试')
          }
        })

      },
      cancelEdit: function(){
        this.editPermission = {
          user_id: '',
          role_id: '',
          permissions: []
        };
      }
    }
  });

  var rolesArr = [{
    label: '管理员',
    value: 1
  },{
    label: '基金经理',
    value: 11
  },{
    label: '交易员',
    value: 12
  },{
    label: '风控员',
    value: 13
  }];
  selectize.add_user_name = $('.add_user_name').selectize({
    valueField: 'value',
    labelField: 'label',
    // delimiter: ',',
    // maxItems: 1,
    // plugins: ['remove_button'],
    create: false,
    placeholder: '输入用户名搜索',
    searchField: 'label',
    onChange: function(value){
      changeUserName(value);

    },
    render: {
      item: function(item, escape){
        return '<div class="item" data-role-id="'+ item.role_id +'" data-value="'+ item.value +'" title="'+ item.label +'">' + escape(item.label) + '</div>';
      },
      option: function(item, escape){
        var label = item.value;
        return '<div class="option" title="'+ item.label +'">' + escape(item.label) + '</div>';
      }
    }
  })[0].selectize;

  function changeUserName(value){
    var tmpArr = [];
    managerArr.forEach(function(e){
      if (e.value == value) {
        e.role_id.forEach(function(el){
          rolesArr.forEach(function(ele){
            if (ele.value == el) {
              tmpArr.push({
                label: ele.label,
                value: ele.value
              })
            }
          })
        });
      }
    })
    selectize.add_user_roles.clearOptions();
    selectize.add_user_roles.addOption(tmpArr);

    if (tmpArr.length === 1) {
      selectize.add_user_roles.setValue(tmpArr[0].value);
    }
  }

  selectize.add_user_roles = $('.add_user_roles').selectize({
    valueField: 'value',
    labelField: 'label',
    delimiter: ',',
    maxItems: 10,
    plugins: ['remove_button'],
    create: false,
    placeholder: '请选择用户角色',
    searchField: 'label',
    render: {
      item: function(item, escape){
        return '<div class="item" data-value="'+ item.value +'" title="'+ item.label +'">' + escape(item.label) + '</div>';
      },
      option: function(item, escape){
        var label = item.value;
        return '<div class="option" title="'+ item.label +'">' + escape(item.label) +
        '</div>';
      }
    }
  })[0].selectize;

  let max_user = 0;
  let user_num = 0;
  getRoleUsers();
  function getRoleUsers(){
    $.ajax({
      type: 'get',
      url: '/bms-pub/user/org_info',
      success: function({code, msg, data}){
        if (0 == code) {
          max_user = data.max_user;
          user_num = data.user_num;

          $.ajax({
            type: 'get',
            url: '/bms-pub/user/all_users',
            success: function({code, msg, data}){
              if (0 == code) {
                managerArr = [];
                selectize.add_user_name.clearOptions();
                data.forEach(function(e){
                  if ( e.role_id.some(function(role){
                    return role == 1;//管理员身份不显示
                  }) ) {
                    ;
                  }else{
                    if ( !userSetting.usersInfo.some(function(info){
                      return info.user_info.user_id == e.user_id;
                    })) {
                      managerArr.push({
                        label: e.nick_name,
                        value: e.user_id,
                        role_id: e.role_id
                      });
                    }
                  }

                });
                selectize.add_user_name.addOption(managerArr);
              }else{
                $.omsAlert(msg);
              }
            },
            error: function(){
              $.failNotice();
            }
          });
        }
      },
      error: function(){
        $.failNotice();
      }
    });
  }

  $(document).on('click', '.doCreateUser', function(){
    if (user_num >= max_user) {
      $.confirm({
        title: '已达上限',
        content: '<div style="text-align: center;height: 150px;line-height: 150px;"><i class="warn-icon"></i>当前用户数已达上限'+ max_user +'，如需增加，请联系我们。</div>',
        closeIcon: true,
        confirmButton: false,
        cancelButton: ' 确定 '
      });
    }else{
      createUser(function(data){
        var tmpManager = {
          label: data.nick_name,
          value: data.user_id,
          role_id: data.role_id
        };

        managerArr.push(tmpManager);
        selectize.add_user_name.addOption(tmpManager);
        selectize.add_user_name.setValue(data.user_id);
      });
    }

  });
  $(document).on('click', '.doAddUser', function(){
    let user_id = selectize.add_user_name.getValue();
    let product_id = FD.product_id;
    let role_id = selectize.add_user_roles.getValue();
    if ('' == user_id) {
      $.omsAlert('请选择用户');
      return;
    }
    if (role_id.length == 0) {
      $.omsAlert('请选择用户角色');
      return;
    }
    $.startLoading('正在添加...');
    $.ajax({
      url: prefix + '/user/set_role_permissions',
      type: 'post',
      data: {
        user_id: user_id,
        product_id: product_id,
        role_id: role_id.join(',')
      },
      success: function({code, msg, data}){
        $.clearLoading();
        if (code == 0) {
          $.omsAlert('添加成功');
          // 添加成功后，要更新已添加人员信息
          userSetting.getUserSetting(function(){
            // 添加成功后，要更新底部的用户数据，以便被删除的用户显示在列表中
            getRoleUsers();
          });

          // 添加成功后，要清空添加人员时填充的数据
          selectize.add_user_name.setValue('');
          selectize.add_user_roles.setValue('');

        }else{
          $.omsAlert(msg);
        }
      },
      error: function(){
        $.clearLoading();
      }
    });
  });
  $(document).on('click', '.doCancel', function(){
    location.href = prefix + '/product/base_lists';
  });

  if (/showTip=true/.test(location.search)) {
    $.omsAlert(`新建策略成功！<br />您可以继续完成其它相关设置！`);
  }

}
