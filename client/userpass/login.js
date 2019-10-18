Template.loginForm.events({
    'click #denglu': function(evt, tpl){
        //手动触发验证
        var bootstrapValidator = $('.form').data('bootstrapValidator');
        bootstrapValidator.resetForm(false); //重置状态
        bootstrapValidator.validate();
        if (!bootstrapValidator.isValid()){
            return; //错误的话退出
        };
        evt.preventDefault();
        $('#denglu').button('loading');

        var username = $('#username').val();
        var pass = $('#pass').val();
        Meteor.loginWithPassword(username, pass, function(err, result) {
            $('#denglu').button('reset');
            $('#denglu').dequeue();
            if (err){
                var msg = err.message;
                if (msg.indexOf('Incorrect password') >= 0){
                    msg = '密码错误，无法登录系统';
                };
                if (msg.indexOf('User not found') >= 0){
                    msg = '用户名错误，无法登录系统';
                };
                Bert.alert(msg, 'danger');
            }else{
                Router.go('/');
            }
        });
    },
    'keypress #pass': function(evt, tpl){
        if (evt.keyCode !== 13) return;
        $('#denglu').click();
    },
});

Template.loginForm.onRendered(function(){
    $('.form').bootstrapValidator({
        message: '输入的值不符合要求',
        excluded: [],//表示对所有情况都验证，包括禁用域和隐藏域
        submitButtons: '#denglu',
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
                },
            },
        },
    });
});

