import * as func from '../lib/func/function';
import * as gfunc from './lib/globalFunction';

var commissions = [], indentId = '', deviceindex = 0;

Template.commission.onRendered(function(){
    $('#tb_indent').bootstrapTable({
        height: 200,
        selectItemName: 'rdindent',
        columns: [
            {radio: true },
            {field: 'ddbh', title: '订单编号', halign: 'center' },
            {field: 'xmmc', title: '项目名称', halign: 'center' },
            {field: 'remark', title: '备注', halign: 'center' },
        ],
        onCheck: function(row){
            $('#tb_device').bootstrapTable('uncheckAll');
            indentId = row._id;
            $('#tb_device').bootstrapTable('load', row.device);
            $('#tb_commission').bootstrapTable('load', []);
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
            {field: 'tcxs', title: '提成金额', halign: 'center' },
        ],
        onCheck: function(row, evt){
            $('#tb_commission').bootstrapTable('uncheckAll');
            deviceindex = evt.data('index');
            commissions = row.commission;
            if (commissions == null){
                commissions = [];
            }
            $('#tb_commission').bootstrapTable('load', commissions);
        },
    });

    $('#tb_commission').bootstrapTable({
        height: 240,
        selectItemName: 'rdcommission',
        columns: [
            {radio: true },
            {field: 'ffsj', title: '发放时间', halign: 'center' },
            {field: 'skbl', title: '收款比例', halign: 'center' },
            {field: 'ffbsc', title: '发放部门', halign: 'center'},
			{field: 'ffry', title: '受益人', halign: 'center' },
            {field: 'ffje', title: '发放金额', halign: 'center' },
        ],
    });
});

Template.commission.onDestroyed(function(){
    Session.set('shipmentBh', '');
});

Tracker.autorun(function(){
    var getData = IndentCollection.find({ 'ddbh': {$regex: Session.get('shipmentBh')} });
    $('#tb_indent').bootstrapTable('load', []);
    $('#tb_device').bootstrapTable('load', []);
    $('#tb_commission').bootstrapTable('load', []);
    if (getData) {
        $('#tb_indent').bootstrapTable('load', getData.fetch());
    };
});

function commissionInput(caption, opt, callback){
    $.confirm({
        title: caption,
        content: '' +
        '<form action="" class="formName">' +
        '<div class="form-group">' +
        '<label>请输入发放时间</label>' +
        '<input type="text" id="ffsj" value="'+ opt.ffsj +'" class="form-control">' +
        '<label>请输入收款比例</label>' +
        '<input type="text" id="skbl" value="'+ opt.skbl +'" class="form-control">' +
        '<label>请输入发放部门</label>' +
        '<input type="text" id="ffbsc" value="'+ opt.ffbsc +'" class="form-control">' +
        '<label>请输入受益人</label>' +
        '<input type="text" id="ffry" value="'+ opt.ffry +'" class="form-control">' +
        '<label>请输入发放金额</label>' +
        '<input type="text" id="ffje" value="'+ opt.ffje +'" class="form-control">' +
        '</div>' +
        '</form>',
        theme: 'modern',
        type: 'blue',
        buttons: {
            formSubmit: {
                text: '确定',
                btnClass: 'btn-blue',
                action: function () {
                    var ffsj = this.$content.find('#ffsj').val();
                    if(!ffsj){
                        $.alert('请输入发放时间');
                        return false;
                    };
                    var skbl = this.$content.find('#skbl').val();
                    if(!skbl){
                        $.alert('请输入收款比例');
                        return false;
                    };
                    var ffbsc = this.$content.find('#ffbsc').val();
                    if(!ffbsc){
                        $.alert('请输入发放部门');
                        return false;
                    };
                    var ffry = this.$content.find('#ffry').val();
                    if(!ffry){
                        $.alert('请输入受益人');
                        return false;
                    };
                    var ffje = this.$content.find('#ffje').val();
                    if(!ffje){
                        $.alert('请输入发放金额');
                        return false;
                    };
                    if(typeof callback == "function"){
                        var opt = {'ffsj': ffsj, 'skbl': skbl, 'ffbsc': ffbsc, 'ffry': ffry, 'ffje': ffje};
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

Template.commission.events({
    'click button#btn-find': function(evt, tpl){
        var ddbh = func.trim($('#ddbh').val());
        if (ddbh){
            Meteor.subscribe('indentFromBh', {id: ddbh});
            Session.set('shipmentBh', ddbh);
        }else{
            Session.set('shipmentBh', '');
            Bert.alert('请先输入订单号再查询', 'info');
        };
    },
    'click button#btn-add': function(evt, tpl){
        var data = $('#tb_device').bootstrapTable('getSelections');
        if (data.length === 0){
            Bert.alert('请先选择负责人', 'info');
            return;
        }

        var date = new Date();
        var opt = {ffsj:func.dateToStr1(date), skbl:'', ffbsc: data[0].bsc, ffry:data[0].fzr, ffje:0};
        commissionInput('新增', opt, function(result, obj){
            if (result){
                var commission = {'ffsj': obj.ffsj, 'skbl': obj.skbl, 'ffbsc': obj.ffbsc,
                    'ffry': obj.ffry, 'ffje': Number(obj.ffje)};

                commissions.push(commission);

                Meteor.call('updateIndentCommission', indentId, deviceindex, commissions, function(err, result){
                    if (err){
                        Bert.alert(err.message, 'danger');
                    };
                });
            };
        });
    },
    'click button#btn-edit': function(evt, tpl){
        var data = $('#tb_commission').bootstrapTable('getSelections');
        if (data.length > 0){
            var opt = {'ffsj':data[0].ffsj, 'skbl':data[0].skbl, 'ffbsc':data[0].ffbsc,
                'ffry':data[0].ffry, 'ffje':data[0].ffje};
            var index = commissions.indexOf(data[0]); //保存数组的index
            if (index === -1) return;
        }else {
            Bert.alert('请先选择发放信息', 'info');
            return;
        };
        if ($('#tb_device').bootstrapTable('getSelections').length === 0){
            Bert.alert('请先选择负责人', 'info');
            return;
        };

        commissionInput('修改', opt, function(result, obj){
            if (result){
                var commission = {'ffsj': obj.ffsj, 'skbl': obj.skbl, 'ffbsc': obj.ffbsc,
                    'ffry': obj.ffry, 'ffje': Number(obj.ffje)};

                commissions.splice(index, 1, commission);

                Meteor.call('updateIndentCommission', indentId, deviceindex, commissions, function(err, result){
                    if (err){
                        Bert.alert(err.message, 'danger');
                    };
                });
            };
        });
    },
    'click button#btn-del': function(evt, tpl){
        var data = $('#tb_commission').bootstrapTable('getSelections');
        if (data.length > 0){
            var index = commissions.indexOf(data[0]); //保存数组的index
            if (index === -1) return;
        }else {
            Bert.alert('请先选择发货信息', 'info');
            return;
        };
        if ($('#tb_device').bootstrapTable('getSelections').length === 0){
            Bert.alert('请先选择负责人', 'info');
            return;
        };

        gfunc.chumjConfirm('确实要删除选中的发放信息吗？', function(result){
            if (result){
                commissions.splice(index, 1);

                Meteor.call('updateIndentCommission', indentId, deviceindex, commissions, function(err, result){
                    if (err){
                        Bert.alert(err.message, 'danger');
                    };
                });
            };
        });
    },
});
