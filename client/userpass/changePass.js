Template.changePassForm.onRendered(function(){
    $('.form').bootstrapValidator({
        message: '输入的值不符合要求',
        excluded: [],//表示对所有情况都验证，包括禁用域和隐藏域
        submitButtons: '#genggai',
        fields: {
            oldpass: {
                validators: {
                    notEmpty: {message: '当前密码不允许为空'},
                },
            },
            pass: {
                validators: {
                    notEmpty: {message: '新密码不允许为空'},
                    identical: {
                        field: 'passtwo',
                        message: '两次密码不一致'
                    },
                },
            },
            passtwo: {
                validators: {
                    notEmpty: {message: '新密码确认不允许为空'},
                    identical: {
                        field: 'pass',
                        message: '两次密码不一致'
                    },
                },
            },
        },
    });
});

Template.changePassForm.events({
    'click #genggai': function(evt, tpl){
        //手动触发验证
        var bootstrapValidator = $('.form').data('bootstrapValidator');
        bootstrapValidator.resetForm(false); //重置状态
        bootstrapValidator.validate();
        if (!bootstrapValidator.isValid()){
            return; //错误的话退出
        };
        evt.preventDefault();

        var current_password = $('#oldpass').val();
        var password = $('#pass').val();
        Accounts.changePassword(current_password, password, function(err){
            if (err){
                var msg = err.message;
                if (msg.indexOf('Incorrect password') >= 0){
                    msg = '当前密码错误，不能更改密码';
                };
                Bert.alert(msg, 'danger');
            } else {
                Bert.alert("密码更改成功", 'success', 'growl-top-left');
                Router.go('/');
            };
        });
    },
});

