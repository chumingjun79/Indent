import * as gfunc from '../lib/globalFunction';

Template.cdindustry.helpers({
	industrys: function(){
		return IndustryCollection.find();
	},
});

Template.cdindustry.events({
    'click button#add-code': function(evt, tpl){
        var temp = '<input type="text" placeholder="请输入新的所属行业..." class="name form-control">';

        gfunc.chumjInput('新增', temp, '.name', '必须输入所属行业', function(result, value){
            if (result){
                var obj = {
                    id: '',
                    name: value,
                };
                Meteor.call('upsertIndustry', obj, function(err, result){
                    if (err){
                        Bert.alert(err.message, 'danger');
                    };
                });
            };
        });
    },
});

Template.cdindustryBody.events({
    'click button#edit-code': function(evt, tpl){
        var index = evt.currentTarget.getAttribute('data-index');
        var obj = $('#name[data-index="'+ index +'"]');
        var value = '';
        if (obj){
            value = obj[0].innerText;
        };
        var temp = '<input type="text" placeholder="请输入新的所属行业..." class="name form-control"'+
            ' value="'+ value +'">';

        gfunc.chumjInput('修改', temp, '.name', '必须输入所属行业', function(result, value){
            if (result){
                var obj = {
                    id: index,
                    name: value,
                };
                Meteor.call('upsertIndustry', obj, function(err, result){
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
        gfunc.chumjConfirm('确实要删除【'+ value +'】吗？', function(result){
            if (result){
                Meteor.call('deleteIndustry', index, function(err, result){
                    if (err){
                        Bert.alert(err.message, 'danger');
                    };
                });
            };
        });
    },
});
