Template.cdworker.helpers({
	workers: function(){
		return WorkerCollection.find({}, {sort:{ygbm:1, ygxm:1}});
	},
});

workerInput = function(caption, opt, callback){
    $.confirm({
        title: caption,
        content: '' +
        '<form action="" class="formName">' +
        '<div class="form-group">' +
        '<label>请输入部门</label>' +
        '<input type="text" id="ygbm" value="'+ opt.ygbm +'" class="form-control">' +
        '<label>请输入员工姓名</label>' +
        '<input type="text" id="ygxm" value="'+ opt.ygxm +'" class="form-control">' +
        '<label>请输入员工编号</label>' +
        '<input type="text" id="ygbh" value="'+ opt.ygbh +'" class="form-control">' +
        '</div>' +
        '</form>',
        theme: 'modern',
        type: 'blue',
        buttons: {
            formSubmit: {
                text: '确定',
                btnClass: 'btn-blue',
                action: function () {
                    var ygbm = this.$content.find('#ygbm').val();
                    if(!ygbm){
                        $.alert('请输入部门');
                        return false;
                    };
                    var ygxm = this.$content.find('#ygxm').val();
                    if(!ygxm){
                        $.alert('请输入员工姓名');
                        return false;
                    };
                    var ygbh = this.$content.find('#ygbh').val();
                    if(!ygbh){
                        $.alert('请输入员工编号');
                        return false;
                    };
                    if(typeof callback == "function"){
                    	var opt = {'ygbm': ygbm, 'ygxm': ygxm, 'ygbh': ygbh};
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

Template.cdworker.events({
    'click button#add-code': function(evt, tpl){
    	var opt = {'ygbm':'', 'ygxm': '', 'ygbh': ''};
        workerInput('新增', opt, function(result, obj){
            if (result){
                obj['id'] = '';
                Meteor.call('upsertWorker', obj, function(err, result){
                    if (err){
                        Bert.alert(err.message, 'danger');
                    };
                });
            };
        });
    },
});

Template.cdworkerBody.events({
    'click button#edit-code': function(evt, tpl){
        var index = evt.currentTarget.getAttribute('data-index');
        var opt = {};
        var obj = $('#ygbm[data-index="'+ index +'"]');
        if (obj){
            opt['ygbm'] = obj[0].innerText;
        };
        var obj = $('#ygxm[data-index="'+ index +'"]');
        if (obj){
            opt['ygxm'] = obj[0].innerText;
        };
        var obj = $('#ygbh[data-index="'+ index +'"]');
        if (obj){
            opt['ygbh'] = obj[0].innerText;
        };

        workerInput('修改', opt, function(result, obj){
            if (result){
                obj['id'] = index;
                Meteor.call('upsertWorker', obj, function(err, result){
                    if (err){
                        Bert.alert(err.message, 'danger');
                    };
                });
            };
        });
    },
    'click button#del-code': function(evt, tpl){
        var index = evt.currentTarget.getAttribute('data-index');
        var obj = $('#ygxm[data-index="'+ index +'"]');
        var value = '';
        if (obj){
            value = obj[0].innerText;
        };
        chumjConfirm('确实要删除【'+ value +'】吗？', function(result){
            if (result){
                Meteor.call('deleteWorker', index, function(err, result){
                    if (err){
                        Bert.alert(err.message, 'danger');
                    };
                });
            };
        });
    },
});
