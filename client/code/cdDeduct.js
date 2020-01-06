import * as gfunc from '../lib/globalFunction';

Template.cddeduct.helpers({
	deducts: function(){
		return DeductCollection.find();
	},
});

function deductInput(caption, opt, callback){
    $.confirm({
        title: caption,
        content: '' +
        '<form action="" class="formName">' +
        '<div class="form-group">' +
        '<label>请输入货款回收比例</label>' +
        '<input type="text" id="hkhsbl" value="'+ opt.hkhsbl +'" class="form-control">' +
        '<label>请输入提成发放比例</label>' +
        '<input type="text" id="tcffbl" value="'+ opt.tcffbl +'" class="form-control">' +
        '</div>' +
        '</form>',
        theme: 'modern',
        type: 'blue',
        buttons: {
            formSubmit: {
                text: '确定',
                btnClass: 'btn-blue',
                action: function () {
                    var hkhsbl = this.$content.find('#hkhsbl').val();
                    if(!hkhsbl){
                        $.alert('请输入货款回收比例');
                        return false;
                    };
                    var tcffbl = this.$content.find('#tcffbl').val();
                    if(!tcffbl){
                        $.alert('请输入提成发放比例');
                        return false;
                    };
                    if(typeof callback == "function"){
                    	var opt = {'hkhsbl': hkhsbl, 'tcffbl': tcffbl};
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

Template.cddeduct.events({
    'click button#add-code': function(evt, tpl){
    	var opt = {'hkhsbl':'%', 'tcffbl': 0};
        deductInput('新增', opt, function(result, obj){
            if (result){
                obj['id'] = '';
                Meteor.call('upsertDeduct', obj, function(err, result){
                    if (err){
                        Bert.alert(err.message, 'danger');
                    };
                });
            };
        });
    },
});

Template.cddeductBody.events({
    'click button#edit-code': function(evt, tpl){
        var index = evt.currentTarget.getAttribute('data-index');
        var opt = {};
        var obj = $('#hkhsbl[data-index="'+ index +'"]');
        if (obj){
            opt['hkhsbl'] = obj[0].innerText;
        };
        obj = $('#tcffbl[data-index="'+ index +'"]');
        if (obj){
            opt['tcffbl'] = obj[0].innerText;
        };

        deductInput('修改', opt, function(result, obj){
            if (result){
                obj['id'] = index;
                Meteor.call('upsertDeduct', obj, function(err, result){
                    if (err){
                        Bert.alert(err.message, 'danger');
                    };
                });
            };
        });
    },
    'click button#del-code': function(evt, tpl){
        var index = evt.currentTarget.getAttribute('data-index');
        var obj = $('#hkhsbl[data-index="'+ index +'"]');
        var value = '';
        if (obj){
            value = obj[0].innerText;
        };
        gfunc.chumjConfirm('确实要删除【'+ value +'】吗？', function(result){
            if (result){
                Meteor.call('deleteDeduct', index, function(err, result){
                    if (err){
                        Bert.alert(err.message, 'danger');
                    };
                });
            };
        });
    },
});
