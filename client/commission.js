import * as func from '../lib/func/function';
import * as gfunc from './lib/globalFunction';

var commissions = [], indentId = '', deviceindex = 0, commissionIndex = 0, tcje = 0, updateMode = '';

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
            deviceindex = evt.data('index'); //这里取index是为了保存时更新数据
            tcje = row.tcxs; //这里保存提成金额，是为了后面根据所选比例自动计算出所发提成
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

Template.commission.onCreated(function(){
    Session.set('shipmentBh', '');
    Session.set('skxx', []);

	Meteor.subscribe('deduct');
});

Template.commission.onDestroyed(function(){
    Session.set('shipmentBh', '');
    Session.set('skxx', []);
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

function commissionInput(mode){
    updateMode = mode;
    $('#myModal').modal('show');
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
        var opt = {ffsj:func.dateToStr1(date), skbl:'<90%', ffbsc:data[0].bsc, ffry:data[0].fzr, ffje:0};
        Session.set("skxx", opt);

        commissionInput('Add');
    },
    'click button#btn-edit': function(evt, tpl){
        var data = $('#tb_commission').bootstrapTable('getSelections');
        if (data.length > 0){
            commissionIndex = commissions.indexOf(data[0]); //保存数组的index
            if (commissionIndex === -1) return;

            var opt = {'ffsj':data[0].ffsj, 'skbl':data[0].skbl, 'ffbsc':data[0].ffbsc,
                'ffry':data[0].ffry, 'ffje':data[0].ffje};
            Session.set("skxx", opt);
        }else {
            Bert.alert('请先选择发放信息', 'info');
            return;
        };
        if ($('#tb_device').bootstrapTable('getSelections').length === 0){
            Bert.alert('请先选择负责人', 'info');
            return;
        };

        commissionInput('Edit');
    },
    'click button#btn-del': function(evt, tpl){
        var data = $('#tb_commission').bootstrapTable('getSelections');
        if (data.length > 0){
            commissionIndex = commissions.indexOf(data[0]); //保存数组的index
            if (commissionIndex === -1) return;
        }else {
            Bert.alert('请先选择发放信息', 'info');
            return;
        };
        if ($('#tb_device').bootstrapTable('getSelections').length === 0){
            Bert.alert('请先选择负责人', 'info');
            return;
        };

        gfunc.chumjConfirm('确实要删除选中的发放信息吗？', function(result){
            if (result){
                commissions.splice(commissionIndex, 1);

                Meteor.call('updateIndentCommission', indentId, deviceindex, commissions, function(err, result){
                    if (err){
                        Bert.alert(err.message, 'danger');
                    };
                });
            };
        });
    },
});

Template.commissionModal.helpers({
	selectedCommission: function(){
		return Session.get("skxx");
    },
    deducts: function(){
        return DeductCollection.find();
    },
});

Template.commissionModal.events({
    'click button#btn-saveDeduct': function(evt, tpl){
        var ffsj = $('#ffsj').val();
        if(!ffsj){
            $.alert('请输入发放时间');
            return false;
        };
        var skbl = $('#skbl').val();
        if(!skbl){
            $.alert('请输入收款比例');
            return false;
        };
        var ffbsc = $('#ffbsc').val();
        if(!ffbsc){
            $.alert('请输入发放部门');
            return false;
        };
        var ffry = $('#ffry').val();
        if(!ffry){
            $.alert('请输入受益人');
            return false;
        };
        var ffje = $('#ffje').val();
        if(!ffje){
            $.alert('请输入发放金额');
            return false;
        };

        var commission = {'ffsj': ffsj, 'skbl': skbl, 'ffbsc': ffbsc, 'ffry': ffry, 'ffje': Number(ffje)};
        if (updateMode == 'Add'){
            commissions.push(commission);
        } else if (updateMode == 'Edit'){
            commissions.splice(commissionIndex, 1, commission);
        };        

        Meteor.call('updateIndentCommission', indentId, deviceindex, commissions, function(err, result){
            if (err){
                Bert.alert(err.message, 'danger');
            } else {
                $('#myModal').modal('hide');
                Session.set("skxx", '');
            }
        });        
    },
    'change select#skbl': function(evt, tpl){
        var skbl = evt.currentTarget.value;
        if (skbl != '') {
            var even = _.find(DeductCollection.find().fetch(), function(obj){ return obj.hkhsbl == skbl; });
            if (even != undefined){
                var ffje = func.toTwoDecimal(tcje * even.tcffbl);
                $('#ffje').val(ffje);
            }
        } else {
            $('#ffje').val(0);
        } 
    },
});