Template.resetPassForm.helpers({
    'getUserName': function(){
        return Session.get('resetPassUserName');
    }
});

Template.resetPassForm.events({
    'click #chongzhi': function(evt, tpl){
        //手动触发验证
        var bootstrapValidator = $('.form').data('bootstrapValidator');
        bootstrapValidator.resetForm(false); //重置状态
        bootstrapValidator.validate();
        if (!bootstrapValidator.isValid()){
            return; //错误的话退出
        };
        evt.preventDefault();

        var userId = Session.get('resetPassUserId');
        if (userId == ''){
            Bert.alert('用户ID不允许为空', 'info');
            return;
        };
        var pass = $('#pass').val();
        Meteor.call('resetPass', userId, pass, function(err, result){
            if (err){
                Bert.alert(err.message, 'danger');
            } else {
                Bert.alert("用户密码重置成功", 'success', 'growl-top-left');
                Router.go('/userlist');
            };
        });
    },
});

Template.resetPassForm.onRendered(function(){
    $('.form').bootstrapValidator({
        message: '输入的值不符合要求',
        excluded: [],//表示对所有情况都验证，包括禁用域和隐藏域
        submitButtons: '#chongzhi',
        fields: {
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