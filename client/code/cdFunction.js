import * as gfunc from '../lib/globalFunction';

Template.cdfunction.helpers({
	functions: function(){
		return FunctionCollection.find({}, {sort:{gndl:1, gnmc:1}});
	},
});

function functionInput(caption, opt, callback){
    $.confirm({
        title: caption,
        content: '' +
        '<form action="" class="formName">' +
        '<div class="form-group">' +
        '<label>请输入功能大类</label>' +
        '<input type="text" id="gndl" value="'+ opt.gndl +'" class="form-control">' +
        '<label>请输入功能名称</label>' +
        '<input type="text" id="gnmc" value="'+ opt.gnmc +'" class="form-control">' +
        '<label>请输入功能内码</label>' +
        '<input type="text" id="gnnm" value="'+ opt.gnnm +'" class="form-control">' +
        '</div>' +
        '</form>',
        theme: 'modern',
        type: 'blue',
        buttons: {
            formSubmit: {
                text: '确定',
                btnClass: 'btn-blue',
                action: function () {
                    var gndl = this.$content.find('#gndl').val();
                    if(!gndl){
                        $.alert('请输入功能大类');
                        return false;
                    };
                    var gnmc = this.$content.find('#gnmc').val();
                    if(!gnmc){
                        $.alert('请输入功能名称');
                        return false;
                    };
                    var gnnm = this.$content.find('#gnnm').val();
                    if(!gnnm){
                        $.alert('请输入功能内码');
                        return false;
                    };
                    if(typeof callback == "function"){
                    	var opt = {'gndl': gndl, 'gnmc': gnmc, 'gnnm': gnnm};
                        callback(true, opt);
                    }
                }
            },
            cancel: {
                text: '取消',
                action: function () {
                }
            },
        },
        onContentReady: function () {
            // bind to events
            var jc = this;
            this.$content.find('form').on('submit', function (e) {
                // if the user submits the form by pressing enter in the field.
                e.preventDefault();
                jc.$$formSubmit.trigger('click'); // reference the button and click it
            });
        }
    });
};

Template.cdfunction.events({
    'click button#add-code': function(evt, tpl){
    	var opt = {'gndl':'', 'gnmc': '', 'gnnm': ''};
        functionInput('新增', opt, function(result, obj){
            if (result){
                obj['id'] = '';
                Meteor.call('upsertFunction', obj, function(err, result){
                    if (err){
                        Bert.alert(err.message, 'danger');
                    };
                });
            };
        });
    },
});

Template.cdfunctionBody.events({
    'click button#del-code': function(evt, tpl){
        var index = evt.currentTarget.getAttribute('data-index');
        var obj = $('#gnmc[data-index="'+ index +'"]');
        var value = '';
        if (obj){
            value = obj[0].innerText;
        };
        gfunc.chumjConfirm('确实要删除【'+ value +'】吗？', function(result){
            if (result){
                Meteor.call('deleteFunction', index, function(err, result){
                    if (err){
                        Bert.alert(err.message, 'danger');
                    };
                });
            };
        });
    },
});
