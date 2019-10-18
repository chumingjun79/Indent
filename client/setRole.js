import * as gfunc from './lib/globalFunction';

Template.setrole.helpers({
    'getUserName': function(){
        return Session.get('setRoleUserName');
    },
    'userRoles': function(){
        return UserRoleCollection.findOne({"_id": Session.get('setRoleUserId')});
    }
});

Template.setrole.onCreated(function(){
    Meteor.subscribe('userRole', {userid: Session.get('setRoleUserId')});
    Meteor.subscribe('function');
});

Template.setrole.events({
    'click button#btn-init': function(evt, tpl){
        evt.preventDefault();
        gfunc.chumjConfirm("确实要初始化全部权限吗？", function(result){
            if (result){
                var obj = {
                    userid: Session.get('setRoleUserId'),
                    username: Session.get('setRoleUserName'),
                };
                Meteor.call('initUserRole', obj, function(err, result){
                    if (err){
                        Bert.alert(err.message, 'danger');
                    } else {
                        Bert.alert("初始化权限成功", 'success', 'growl-left-top');
                        //Router.go('/userlist');
                    };
                });
            };
        });
    },
    'click button#btn-add': function(evt, tpl){
        //先将目前有的权限组合在一起，选择时进行判断，有的权限就不列出来
        var getData = UserRoleCollection.findOne({"_id": Session.get('setRoleUserId')});
        var gnmclist = '';
        if (getData){
            for(var i=0; i<getData.roles.length; i++){
                gnmclist = gnmclist + getData.roles[i].gnmc + ',';
            };
        };

        var temp = '';
        FunctionCollection.find({}, {sort:{gnmc:1}}).forEach((data) => {
            if (gnmclist.indexOf(data.gnmc + ',') === -1) {
                temp = temp + '<option value="' + data.gnmc + '">' + data.gnmc + '</option>';
            };
        });
        var select = '<select class="form-control col-sm-6" id="select">' +
            temp + '</select>';

        gfunc.chumjInput('选择', select, '#select', '必须选择一项内容', function(result, value){
            if (result){
                var data = FunctionCollection.findOne({gnmc: value});
                var role = {};
                for(var i in data ) {
                    role[i] = data[i];
                };
                var modifier = {$push: {'roles': role}};

                Meteor.call('upsertUserRole', Session.get('setRoleUserId'), modifier, function(err, result){
                    if (err){
                        Bert.alert(err.message, 'danger');
                    };
                });
            };
        });
    },
});

Template.setroleBody.events({
    'click button#del-code': function(evt, tpl){
        var id = evt.currentTarget.getAttribute('data-index');
        var modifier = {$pull: {'roles': {'_id': id}}};

        Meteor.call('upsertUserRole', Session.get('setRoleUserId'), modifier, function(err, result){
            if (err){
                Bert.alert(err.message, 'danger');
            };
        });
    },
});