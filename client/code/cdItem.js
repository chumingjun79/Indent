Template.cditem.helpers({
	items: function(){
		return ItemCollection.find();
	},
});

Template.cditem.events({
    'click button#add-code': function(evt, tpl){
        var temp = '<input type="text" placeholder="请输入新的项目分类..." class="name form-control">';

        chumjInput('新增', temp, '.name', '必须输入项目分类', function(result, value){
            if (result){
                var obj = {
                    id: '',
                    name: value,
                };
                Meteor.call('upsertItem', obj, function(err, result){
                    if (err){
                        Bert.alert(err.message, 'danger');
                    };
                });
            };
        });
    },
});

Template.cditemBody.events({
    'click button#edit-code': function(evt, tpl){
        var index = evt.currentTarget.getAttribute('data-index');
        var obj = $('#name[data-index="'+ index +'"]');
        var value = '';
        if (obj){
            value = obj[0].innerText;
        };
        var temp = '<input type="text" placeholder="请输入新的项目分类..." class="name form-control"'+
            ' value="'+ value +'">';

        chumjInput('修改', temp, '.name', '必须输入项目分类', function(result, value){
            if (result){
                var obj = {
                    id: index,
                    name: value,
                };
                Meteor.call('upsertItem', obj, function(err, result){
                    if (err){
                        Bert.alert(err.message, 'danger');
                    };
                });
            };
        });
    },
    'click button#del-code': function(evt, tpl){
        var index = evt.currentTarget.getAttribute('data-index');
        var obj = $('#name[data-index="'+ index +'"]');
        var value = '';
        if (obj){
            value = obj[0].innerText;
        };
        chumjConfirm('确实要删除【'+ value +'】吗？', function(result){
            if (result){
                Meteor.call('deleteItem', index, function(err, result){
                    if (err){
                        Bert.alert(err.message, 'danger');
                    };
                });
            };
        });
    },
});
