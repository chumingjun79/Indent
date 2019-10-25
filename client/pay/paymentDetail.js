import * as func from '../../lib/func/function';
import * as gfunc from '../lib/globalFunction';
import * as check from '../../lib/func/check';
import {updateLocalIndent, changeLocalIndent} from '../lib/localCollection';

var indentId='', bsc='', zfxehj=0, bscfyxehj=0;
var officePayIsOk = true; //是否允许保存，默认true允许保存；如果支付费用超过限额，变为false

//本地数据集获取数据
function LocalpaymentDetail(){
    var id = indentId;
    if (id == ''){id = 'none'};
    LocalIndent.upsert(indentId, IndentCollection.findOne({_id: id}) );
};

//自动计算办事处费用限额合计
function setIndentBscfyxehj(){
    bscfyxehj = 0;
    $('[id=edfyxe]').each(function(index, element){    
        bscfyxehj += parseFloat(this.value);
    });

    let modifier = {$set: {}};
    modifier['$set']['bscfyxehj'] = bscfyxehj;
    updateLocalIndent(indentId, modifier);

    setTimeout(fylbTotalPay, 100); //按费用类别分类统计支付金额
};

//按费用类别分类统计支付合计
function fylbTotalPay(){
    let fylbSum = {}, quota = {}, fylbText='';
    let tempIndent = LocalIndent.findOne(Session.get('paymentId'));

    officePayIsOk = true;
    if (tempIndent && tempIndent.officePay && tempIndent.quota){
        _.map(tempIndent.officePay, function(value, key, list){
            //console.log('value', value); console.log('key', key); console.log('list', list);
            fylbSum[value.fylb] = func.toNumber(fylbSum[value.fylb]) + value.zfje;
        });
        _.map(tempIndent.quota, function(value, key, list){
            quota[value.edfylb] = value.edfyxe;
        });
        //console.log(fylbSum);        
        _.map(fylbSum, function(value, key, list){
            let yue = quota[key] - value;
            fylbText = fylbText + key + '：' + func.toDecimal(value,2) + '，余额：' + func.toDecimal(yue,2)  + '<br/>';
            
            //此处判断是否有余额小于0的情况，如果有则将officePayIsOk设为false，不允许保存
            if (yue < 0 || !check.isFloat(yue)) {officePayIsOk = false}; 
        });
    };    
    $('#bsczfjeflhz')[0].innerHTML = fylbText;
};

Template.paymentDetail.onCreated(function(){    
    Meteor.subscribe('costtype');
});

Template.paymentDetail.onDestroyed(function(){
    Session.set('paymentId', '');
});

Template.paymentDetail.onRendered(function(){    
    $('#tb_indentlist').bootstrapTable({
        //height: 200,
        sidePagination: "server", //分页方式：client客户端分页，server服务端分页
        pageSize: 5,
        pageList: [5],
        pagination: true, //是否显示分页
        queryParams:
			function (params) {
				temp = {
					limit: params.limit,
					offset: params.offset,
					ddbh: $("#ddbh").val(),
					xmmc: $("#xmmc").val(),
                    khmc: $("#khmc").val(),
				};
				return temp;
			},
        columns: [
            {radio: true },
			{field: 'ddbh', title: '订单编号', halign: 'center' },
			{field: 'kjnd', title: '订单年度', halign: 'center' },
			{field: 'kjyf', title: '订单月份', halign: 'center' },
			{field: 'xmmc', title: '项目名称', halign: 'center' },
            {field: 'khmc', title: '客户名称', halign: 'center' },
        ],
        onCheck: function(row){
            indentId = row._id;
            Meteor.subscribe('indentById', {id: indentId}, function onReady(){
                LocalpaymentDetail();
                Session.set('paymentId', indentId);   
            
                setTimeout(fylbTotalPay, 100); //按费用类别分类统计支付金额
            });           
        },
    });

    if (Session.get('paymentId') !== '') {
        $("#ddbh").val(Session.get('paymentId'));
        $("#btn_find").click();
    }; 
});

Template.paymentDetail.helpers({
	selectedIndent: function(){
		return LocalIndent.findOne(Session.get('paymentId'));
    },
    zfxehj: function(){
        zfxehj = 0;
        let tempIndent = LocalIndent.findOne(Session.get('paymentId'));
        if (tempIndent && tempIndent.device[0]) {
            zfxehj = func.toNumber(tempIndent.device[0].fykc) + func.toNumber(tempIndent.device[0].ftjfy);
            bsc = tempIndent.device[0].bsc; //保存办事处到bsc变量，回头填充到支付信息中
        }
        return zfxehj;
    },
    bscfyxehj: function(){
        let tempIndent = LocalIndent.findOne(Session.get('paymentId'));
        if (tempIndent) {
            return func.toNumber(tempIndent.bscfyxehj);
        } else return 0;
    },
    bscfyxeye: function(){
        let tempIndent = LocalIndent.findOne(Session.get('paymentId'));
        if (tempIndent) {
            return zfxehj - func.toNumber(tempIndent.bscfyxehj);
        } else return 0;
    },    
});

Template.paymentDetail.events({
    'click button#btn_find': function(evt, tpl){
		tpl.$('#tb_indentlist').bootstrapTable('refresh', {url: RootUrl+
			'indentlist/get'});
	},
    'click button#add-quota': function(evt, tpl){
        var obj = {edfylb: CostTypeCollection.find().fetch()[0].name, edfyxe: 0};
        var modifier = {$push: {'quota': obj}};
        updateLocalIndent(indentId, modifier);
        setTimeout(setIndentBscfyxehj, 100); //计算办事处费用限额合计
    },
    'click button#add-officePay': function(evt, tpl){
        let temp = '';
        let tempIndent = LocalIndent.findOne(Session.get('paymentId'));
        _.map(tempIndent.quota, function(value){
            temp = temp + '<option value="'+value.edfylb+'">'+value.edfylb+'</option>';
        });
        let select = '<select class="form-control col-sm-6" id="select">' + temp + '</select>';
        gfunc.chumjInput('选择', select, '#select', '必须选择一项内容', function(result, value){
            if (result){
                var obj = {zfrq: func.getToday(), fylb: value, zfje: 0, zjbsh: false, zfbsc:bsc};
                var modifier = {$push: {'officePay': obj}};
                updateLocalIndent(indentId, modifier);                
            };
        });
    },

    'mousedown .datepicker': function(){
        $('.datepicker').datepicker('destroy');
        gfunc.setDatePicker();
        $('.datepicker').datepicker('show');
    },
});

Template.paymentDetailHandle.events({
	'click button#baocundd': function(evt, tpl){
		gfunc.chumjConfirm("确实要保存吗？", function(result){
			if (result){
                if (bscfyxehj > zfxehj){
                    Bert.alert('费用限额合计超标，不允许保存', 'danger');
                    return;
                };
                if (!officePayIsOk){
                    Bert.alert('支付金额合计超标，不允许保存', 'danger');
                    return; 
                };

				if (changeLocalIndent(indentId)) {
					Bert.alert('订单已经被其他用户修改，无法保存', 'danger');
					return;
                };
				Meteor.call('updatePaymentDetail', indentId, LocalIndent.findOne(indentId),
					function(err, result){
                        if (err){
                            Bert.alert(err.message, 'danger');
                        } else {	
                            Bert.alert("保存成功", 'success', 'growl-top-left');
                            LocalpaymentDetail();
                        };
                    }
				);
			};
		});
	},
});

Template.paymentDetailQuota.helpers({
    costtypes: function(){
        return CostTypeCollection.find();
    },    
});

Template.paymentDetailQuota.events({
    'change': function(evt, tpl){
        evt.stopImmediatePropagation(); //阻止事件传播
        var index = evt.currentTarget.getAttribute('data-index');
        var field = evt.currentTarget.id;
        if (field===""){return}; //如果没有设置ID，则退出

        var property = 'quota.' + index + '.' + field;
        var modifier = {$set: {}};
        var value = func.trim(evt.currentTarget.value);
        modifier['$set'][property] = (field === 'edfyxe') ? Number(value) : value;

        updateLocalIndent(indentId, modifier);
        if (field==='edfyxe'){
            setTimeout(setIndentBscfyxehj, 100); //计算办事处费用限额合计
        };
    },
    'click button#del-quota': function(evt, tpl){
        var index = evt.currentTarget.getAttribute('data-index');
        var arrays = Template.parentData(1).quota;
        arrays.splice(index, 1);
        var modifier = {$set: {'quota': arrays}};
        updateLocalIndent(indentId, modifier);

        setTimeout(setIndentBscfyxehj, 100); //计算办事处费用限额合计
    },
});

Template.paymentDetailOfficePay.helpers({
    costtypes: function(){
        return CostTypeCollection.find();
    },
});

Template.paymentDetailOfficePay.events({
    'change': function(evt, tpl){
        evt.stopImmediatePropagation(); //阻止事件传播
        var index = evt.currentTarget.getAttribute('data-index');
        var field = evt.currentTarget.id;
        if (field===""){return}; //如果没有设置ID，则退出

        var property = 'officePay.' + index + '.' + field;
        var modifier = {$set: {}};
        var value = func.trim(evt.currentTarget.value);
        if (field==='zjbsh'){
            modifier['$set'][property] = evt.currentTarget.checked;
        }
        else {
            modifier['$set'][property] = (field === 'zfje') ? Number(value) : value;
        };

        updateLocalIndent(indentId, modifier);
        if (field==='zfje'){
            setTimeout(fylbTotalPay, 100); //按费用类别分类统计支付金额
        };
    },
    'click button#del-officePay': function(evt, tpl){
        var index = evt.currentTarget.getAttribute('data-index');
        var arrays = Template.parentData(1).officePay;
        arrays.splice(index, 1);
        var modifier = {$set: {'officePay': arrays}};
        updateLocalIndent(indentId, modifier);

        setTimeout(fylbTotalPay, 100); //按费用类别分类统计支付金额
    },
});
