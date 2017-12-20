Template.cdoffice.helpers({
	offices: function(){
		return OfficeCollection.find({}, {sort:{area:1, office:1}});
	},
});

officeInput = function(caption, opt, callback){
    $.confirm({
        title: caption,
        content: '' +
        '<form action="" class="formName">' +
        '<div class="form-group">' +
        '<label>请输入区域</label>' +
        '<input type="text" id="area" value="'+ opt.area +'" class="form-control">' +
        '<label>请输入办事处</label>' +
        '<input type="text" id="office" value="'+ opt.office +'" class="form-control">' +
        '</div>' +
        '</form>',
        theme: 'modern',
        type: 'blue',
        buttons: {
            formSubmit: {
                text: '确定',
                btnClass: 'btn-blue',
                action: function () {
                    var area = this.$content.find('#area').val();
                    if(!area){
                        $.alert('请输入区域');
                        return false;
                    };
                    var office = this.$content.find('#office').val();
                    if(!office){
                        $.alert('请输入办事处');
                        return false;
                    };
                    if(typeof callback == "function"){
                    	var opt = {'area': area, 'office': office};
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

Template.cdoffice.events({
    'click button#add-code': function(evt, tpl){
    	var opt = {'area':'', 'office': ''};
        officeInput('新增', opt, function(result, obj){
            if (result){
                obj['id'] = '';
                Meteor.call('upsertOffice', obj, function(err, result){
                    if (err){
                        Bert.alert(err.message, 'danger');
                    };
                });
            };
        });
    },
});

Template.cdofficeBody.events({
    'click button#edit-code': function(evt, tpl){
        var index = evt.currentTarget.getAttribute('data-index');
        var opt = {};
        var obj = $('#area[data-index="'+ index +'"]');
        if (obj){
            opt['area'] = obj[0].innerText;
        };
        var obj = $('#office[data-index="'+ index +'"]');
        if (obj){
            opt['office'] = obj[0].innerText;
        };

        officeInput('修改', opt, function(result, obj){
            if (result){
                obj['id'] = index;
                Meteor.call('upsertOffice', obj, function(err, result){
                    if (err){
                        Bert.alert(err.message, 'danger');
                    };
                });
            };
        });
    },
    'click button#del-code': function(evt, tpl){
        var index = evt.currentTarget.getAttribute('data-index');
        var obj = $('#office[data-index="'+ index +'"]');
        var value = '';
        if (obj){
            value = obj[0].innerText;
        };
        chumjConfirm('确实要删除【'+ value +'】吗？', function(result){
            if (result){
                Meteor.call('deleteOffice', index, function(err, result){
                    if (err){
                        Bert.alert(err.message, 'danger');
                    };
                });
            };
        });
    },
});
