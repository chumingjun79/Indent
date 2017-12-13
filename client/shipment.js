import './indent.js';

var shipments = [], indentId = '', deviceindex = 0;

Template.shipment.onRendered(function(){
    $('#tb_indent').bootstrapTable({
        height: 200,
        selectItemName: 'rdindent',
        columns: [
            {radio: true },
            {field: 'ddbh', title: '订单编号', halign: 'center' },
            {field: 'xmmc', title: '项目名称', halign: 'center' },
        ],
        onCheck: function(row){
            $('#tb_device').bootstrapTable('uncheckAll');
            indentId = row._id;
            $('#tb_device').bootstrapTable('load', row.device);
        },
    });
    /*或者通过on来触发事件，类似下面这种写法
    $('#tb_indent').on('check.bs.table', function(row){
        alert(row);
    }).on('click-cell.bs.table', function (element, field, value, row) {
        alert(field);
    });*/

    $('#tb_device').bootstrapTable({
        height: 240,
        selectItemName: 'rddevice',
        columns: [
            {radio: true },
            {field: 'cpfl', title: '产品分类', halign: 'center' },
            {field: 'sbxh', title: '设备型号', halign: 'center' },
            {field: 'bsc', title: '办事处', halign: 'center' },
            {field: 'fzr', title: '负责人', halign: 'center' },
            {field: 'sbxs', title: '系数', halign: 'center' },
            {field: 'sbsl', title: '数量', halign: 'center' },
            {field: 'sbje', title: '设备金额', halign: 'center' },
        ],
        onCheck: function(row, evt){
            $('#tb_shipment').bootstrapTable('uncheckAll');
            deviceindex = evt.data('index');
            shipments = row.shipment;
            $('#tb_shipment').bootstrapTable('load', shipments);
        },
    });

    $('#tb_shipment').bootstrapTable({
        height: 240,
        selectItemName: 'rdshipment',
        columns: [
            {radio: true },
            {field: 'fhnd', title: '发货年度', halign: 'center' },
            {field: 'fhyf', title: '发货月份', halign: 'center' },
            {field: 'fhsl', title: '发货数量', halign: 'center' },
            {field: 'fhje', title: '发货金额', halign: 'center' },
        ],
    });
});

Template.shipment.onDestroyed(function(){
    Session.set('shipmentBh', '');
});

Tracker.autorun(function(){
    var getData = IndentCollection.find({ 'ddbh': {$regex: Session.get('shipmentBh')} });
    $('#tb_indent').bootstrapTable('load', []);
    $('#tb_device').bootstrapTable('load', []);
    $('#tb_shipment').bootstrapTable('load', []);
    if (getData) {
        $('#tb_indent').bootstrapTable('load', getData.fetch());
    };
});

shipmentInput = function(caption, opt, callback){
    $.confirm({
        icon: 'fa fa-smile-o',
        title: caption,
        content: '' +
        '<form action="" class="formName">' +
        '<div class="form-group">' +
        '<label>请输入发货年度</label>' +
        '<input type="text" id="fhnd" value="'+ opt.fhnd +'" class="form-control">' +
        '<label>请输入发货月份</label>' +
        '<input type="text" id="fhyf" value="'+ opt.fhyf +'" class="form-control">' +
        '<label>请输入发货数量</label>' +
        '<input type="text" id="fhsl" value="'+ opt.fhsl +'" class="form-control">' +
        '<label>请输入发货金额</label>' +
        '<input type="text" id="fhje" value="'+ opt.fhje +'" class="form-control">' +
        '</div>' +
        '</form>',
        theme: 'modern',
        type: 'blue',
        buttons: {
            formSubmit: {
                text: '确定',
                btnClass: 'btn-blue',
                action: function () {
                    var fhnd = this.$content.find('#fhnd').val();
                    if(!fhnd){
                        $.alert('请输入发货年度');
                        return false;
                    };
                    var fhyf = this.$content.find('#fhyf').val();
                    if(!fhyf){
                        $.alert('请输入发货月份');
                        return false;
                    };
                    var fhsl = this.$content.find('#fhsl').val();
                    if(!fhsl){
                        $.alert('请输入发货数量');
                        return false;
                    };
                    var fhje = this.$content.find('#fhje').val();
                    if(!fhje){
                        $.alert('请输入发货金额');
                        return false;
                    };
                    if(typeof callback == "function"){
                        var opt = {'fhnd': fhnd, 'fhyf': fhyf, 'fhsl': fhsl, 'fhje': fhje};
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

Template.shipment.events({
    'click button#btn-find': function(evt, tpl){
        var ddbh = trim($('#ddbh').val());
        if (ddbh){
            Meteor.subscribe('indentFromBh', {id: ddbh});
            Session.set('shipmentBh', ddbh);
        }else{
            Session.set('shipmentBh', '');
        };
    },
    'click button#btn-add': function(evt, tpl){
        var data = $('#tb_indent').bootstrapTable('getSelections');
        if ($('#tb_device').bootstrapTable('getSelections').length === 0){
            Bert.alert('请先选择设备', 'info');
            return;
        };

        var date = new Date();
        var opt = {'fhnd': date.getFullYear(), 'fhyf': date.getMonth()+1, 'fhsl': '', 'fhje': ''};
        shipmentInput('新增', opt, function(result, obj){
            if (result){
                var shipment = {'fhnd': obj.fhnd, 'fhyf': Number(obj.fhyf),
                    'fhsl': Number(obj.fhsl), 'fhje': Number(obj.fhje)};

                shipments.push(shipment);

                Meteor.call('updateIndentShipment', indentId, deviceindex, shipments, function(err, result){
                    if (err){
                        Bert.alert(err.message, 'danger');
                    };
                });
            };
        });
    },
    'click button#btn-edit': function(evt, tpl){
        var data = $('#tb_shipment').bootstrapTable('getSelections');
        if (data.length > 0){
            var opt = {'fhnd':data[0].fhnd, 'fhyf':data[0].fhyf, 'fhsl':data[0].fhsl, 'fhje':data[0].fhje};
            var index = shipments.indexOf(data[0]); //保存数组的index
            if (index === -1) return;
        }else {
            Bert.alert('请先选择发货信息', 'info');
            return;
        };
        if ($('#tb_device').bootstrapTable('getSelections').length === 0){
            Bert.alert('请先选择设备', 'info');
            return;
        };

        shipmentInput('修改', opt, function(result, obj){
            if (result){
                var shipment = {'fhnd': obj.fhnd, 'fhyf': Number(obj.fhyf),
                    'fhsl': Number(obj.fhsl), 'fhje': Number(obj.fhje)};

                shipments.splice(index, 1, shipment);

                Meteor.call('updateIndentShipment', indentId, deviceindex, shipments, function(err, result){
                    if (err){
                        Bert.alert(err.message, 'danger');
                    };
                });
            };
        });
    },
    'click button#btn-del': function(evt, tpl){
        var data = $('#tb_shipment').bootstrapTable('getSelections');
        if (data.length > 0){
            var index = shipments.indexOf(data[0]); //保存数组的index
            if (index === -1) return;
        }else {
            Bert.alert('请先选择发货信息', 'info');
            return;
        };
        if ($('#tb_device').bootstrapTable('getSelections').length === 0){
            Bert.alert('请先选择设备', 'info');
            return;
        };

        chumjConfirm('确实要删除选中的发货信息吗？', function(result){
            if (result){
                var data = $('#tb_indent').bootstrapTable('getSelections');
                if (data.length > 0){
                    var id = data[0]._id; //取订单id
                }else return;

                shipments.splice(index, 1);

                Meteor.call('updateIndentShipment', indentId, deviceindex, shipments, function(err, result){
                    if (err){
                        Bert.alert(err.message, 'danger');
                    };
                });
            };
        });
    },
});
