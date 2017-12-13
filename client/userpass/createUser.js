Template.createUserForm.onRendered(function(){
    $('.form').bootstrapValidator({
        message: '输入的值不符合要求',
        excluded: [],//表示对所有情况都验证，包括禁用域和隐藏域
        submitButtons: '#chuangjian',
        fields: {
            username: {
                validators: {
                    notEmpty: {message: '用户名不允许为空'},
                    stringLength: {
                        min: 1,
                        max: 15,
                        message: '用户名不能超过15个字符'
                    },
                    regexp: {
                        regexp: /^[a-zA-Z0-9]+$/,
                        message: '用户名只能是字母或数字'
                    },
                },
            },
            pass: {
                validators: {
                    notEmpty: {message: '密码不允许为空'},
                    identical: {
                        field: 'passtwo',
                        message: '两次密码不一致'
                    },
                },
            },
            passtwo: {
                validators: {
                    notEmpty: {message: '密码确认不允许为空'},
                    identical: {
                        field: 'pass',
                        message: '两次密码不一致'
                    },
                },
            },
        },
    });
});

Template.createUserForm.events({
    'click #chuangjian': function(evt, tpl){
        //手动触发验证
        var bootstrapValidator = $('.form').data('bootstrapValidator');
        bootstrapValidator.resetForm(false); //重置状态
        bootstrapValidator.validate();
        if (!bootstrapValidator.isValid()){
            return; //错误的话退出
        };
        evt.preventDefault();
        $('#chuangjian').button('loading');

        var username = $('#username').val();
        var pass = $('#pass').val();
        var hash = Accounts._hashPassword(pass); //先在客户端用SHA256加密，之后在服务端用bcrypt加密
        var options = {
            username: username,
            password: hash,
        };

        //调用accounts-password包中的createUser方法来创建用户
        Meteor.call('createUser', options, function(err, result){
            $('#chuangjian').button('reset');
            $('#chuangjian').dequeue();
            if (err){
                var msg = err.message;
                if (msg.indexOf('Username already exists') >= 0){
                    msg = '用户名已经存在，创建用户失败';
                };
                Bert.alert(msg, 'danger');
            } else {
                Bert.alert("创建用户成功", 'success', 'growl-top-left');
                //下面的两行代码是解决创建用户后，Meteor.user()变成空的问题，如果造成性能的影响，就取消这两行
                Meteor.disconnect();
                Meteor.reconnect();
                Router.go('/userlist');
            };
        });
    },
});
