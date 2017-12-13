Template.userlist.onRendered(function(){
    $('#tb_userlist').bootstrapTable({
        url: '/userlist/get',         	//请求后台的URL（*）
        method: 'get',                      //请求方式（*）
        toolbar: '#toolbar',                //工具按钮用哪个容器
        striped: true,                      //是否显示行间隔色
        cache: false,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
        pagination: true,                   //是否显示分页（*）

        queryParams: 						//传递参数（*）
            function (params) {
                temp = {
                    limit: params.limit,   //页面大小
                    offset: params.offset,  //页码
                    //下面就是自定义的参数，服务器端GET里要和这里一致才能取到值
                    search: params.search   //表格自带检索框里的值
                };
                return temp;
            },
        sidePagination: "server",           //分页方式：client客户端分页，server服务端分页（*）
        pageNumber:1,                       //初始化加载第一页，默认第一页
        pageSize: 10,                        //每页的记录行数（*）
        pageList: [5, 10, 20],        		//可供选择的每页的行数（*）
        search: true,                       //是否带有检索框
        searchOnEnterKey: true,             //是否允许回车查询
        formatSearch:
            function () {
                return '用户';//搜索框里面的提示文字
            },
        showColumns: false,                 //是否显示所有的列
        showRefresh: true,                  //是否显示刷新按钮
        clickToSelect: true,                //是否启用点击选中行（*）
        singleSelect: false,				//是否只允许选中一行（*）
        checkboxHeader: false,				//是否显示checkbox的表头
        uniqueId: "_id",                    //每一行的唯一标识，一般为主键列
        showToggle: false,                  //是否显示详细视图和列表视图的切换按钮
        cardView: false,                    //是否显示详细视图
        detailView: false,                  //是否显示父子表
        columns: [
            {radio: true },
            {field: 'username', title: '用户', halign: 'center' },
        ]
    });
});

Template.userlist.events({
    'click #btn_add': function(evt, tpl){
        Router.go('/createuser');
    },
    'click #btn_reset': function(evt, tpl){
        var selectedData = tpl.$('#tb_userlist').bootstrapTable('getAllSelections');
        if (selectedData.length === 0){
            Bert.alert('请先选择要重置密码的用户', 'info');
            return;
        };
        var id = selectedData[0]._id;
        var name = selectedData[0].username;
        if (id == ''){
            Bert.alert("用户ID为空，无法重置密码", 'danger');
            return;
        };
        Session.set('resetPassUserId', id);
        Session.set('resetPassUserName', name);
        Router.go('/resetpass');
    },
    'click #btn_del': function(evt, tpl){
        var selectedData = tpl.$('#tb_userlist').bootstrapTable('getAllSelections');
        if (selectedData.length === 0){
            Bert.alert('请先选择要删除的用户', 'info');
            return;
        };
        var id = selectedData[0]._id;
        var name = selectedData[0].username;
        if (id === Meteor.userId()){
            Bert.alert('不能删除当前登录用户', 'info');
            return;
        }
        chumjConfirm('确认要删除【'+name+'】吗？', function(result){
            if (result){
                if (id == ''){
                    Bert.alert("用户ID为空，无法删除", 'danger');
                    return;
                };

                var obj = {'id': id, 'name': name};
                Meteor.call('deleteUser', obj, function(err, result){
                    if (err){
                        Bert.alert(err.message, 'danger');
                    } else {
                        Bert.alert("删除用户成功", 'success', 'growl-top-left');
                        tpl.$('#tb_userlist').bootstrapTable('refresh');
                    };
                });
            };
        });
    },
    'click #btn_role': function(evt, tpl){
        var selectedData = tpl.$('#tb_userlist').bootstrapTable('getAllSelections');
        if (selectedData.length === 0){
            Bert.alert('请先选择要设置权限的用户', 'info');
            return;
        };
        var id = selectedData[0]._id;
        var name = selectedData[0].username;
        if (id == ''){
            Bert.alert("用户ID为空，无法设置权限", 'danger');
            return;
        };
        Session.set('setRoleUserId', id);
        Session.set('setRoleUserName', name);
        Router.go('/setrole');
    },
});

Template.userlist.onCreated(function(){

});