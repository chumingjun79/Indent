Template.cdproduct.helpers({
	products: function(){
		return ProductCollection.find({}, {sort:{type:1, product:1}});
	},
});

productInput = function(caption, opt, callback){
    $.confirm({
        title: caption,
        content: '' +
        '<form action="" class="formName">' +
        '<div class="form-group">' +
        '<label>请输入大类</label>' +
        '<input type="text" id="type" value="'+ opt.type +'" class="form-control">' +
        '<label>请输入产品</label>' +
        '<input type="text" id="product" value="'+ opt.product +'" class="form-control">' +
        '</div>' +
        '</form>',
        theme: 'modern',
        type: 'blue',
        buttons: {
            formSubmit: {
                text: '确定',
                btnClass: 'btn-blue',
                action: function () {
                    var type = this.$content.find('#type').val();
                    if(!type){
                        $.alert('请输入大类');
                        return false;
                    };
                    var product = this.$content.find('#product').val();
                    if(!product){
                        $.alert('请输入产品');
                        return false;
                    };
                    if(typeof callback == "function"){
                    	var opt = {'type': type, 'product': product};
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

Template.cdproduct.events({
    'click button#add-code': function(evt, tpl){
    	var opt = {'type':'', 'product': ''};
        productInput('新增', opt, function(result, obj){
            if (result){
                obj['id'] = '';
                Meteor.call('upsertProduct', obj, function(err, result){
                    if (err){
                        Bert.alert(err.message, 'danger');
                    };
                });
            };
        });
    },
});

Template.cdproductBody.events({
    'click button#edit-code': function(evt, tpl){
        var index = evt.currentTarget.getAttribute('data-index');
        var opt = {};
        var obj = $('#type[data-index="'+ index +'"]');
        if (obj){
            opt['type'] = obj[0].innerText;
        };
        var obj = $('#product[data-index="'+ index +'"]');
        if (obj){
            opt['product'] = obj[0].innerText;
        };

        productInput('修改', opt, function(result, obj){
            if (result){
                obj['id'] = index;
                Meteor.call('upsertProduct', obj, function(err, result){
                    if (err){
                        Bert.alert(err.message, 'danger');
                    };
                });
            };
        });
    },
    'click button#del-code': function(evt, tpl){
        var index = evt.currentTarget.getAttribute('data-index');
        var obj = $('#product[data-index="'+ index +'"]');
        var value = '';
        if (obj){
            value = obj[0].innerText;
        };
        chumjConfirm('确实要删除【'+ value +'】吗？', function(result){
            if (result){
                Meteor.call('deleteProduct', index, function(err, result){
                    if (err){
                        Bert.alert(err.message, 'danger');
                    };
                });
            };
        });
    },
});
