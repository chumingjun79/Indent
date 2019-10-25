import * as func from '../../lib/func/function';
import * as gfunc from '../lib/globalFunction';
import * as check from '../../lib/func/check';
import {updateLocalIndent, changeLocalIndent} from '../lib/localCollection';

var indentId='', zjbyxzfxe=0, htzje=0, skhj=0, zfhj=0;
var dealerPayIsOk = true; //是否允许保存，默认true允许保存；如果支付费用超过限额，变为false

//本地数据集获取数据
function LocalpaymentStatus(){
    let id = indentId;
    if (id == ''){id = 'none'};
    let tempIndent = IndentCollection.findOne({_id: id});
    LocalIndent.upsert(indentId, tempIndent);
    if (tempIndent){
        htzje = func.toNumber(tempIndent.htzje);  
        zjbyxzfxe = func.toNumber(tempIndent.zjbyxzfxe);  
    } else {
        htzje = 0;
        zjbyxzfxe = 0;
    };
};

//自动计算收款合计
function setIndentSkhj(){
    skhj = 0;
    $('[id=skje]').each(function(index, element){    
        skhj += parseFloat(this.value);
    });    
    $('#skjeflhz')[0].innerHTML = '收款合计：' + func.toDecimal(skhj,2) + '，余额：' + func.toDecimal(htzje-skhj,2) + 
        '，百分比：' + func.toDecimal(skhj/htzje*100) + '%';
};

//自动计算支付合计
function setIndentZfhj(){
    zfhj = 0;
    $('[id=zfje]').each(function(index, element){    
        zfhj += parseFloat(this.value);
    });    
    $('#zfjeflhz')[0].innerHTML = '支付合计：' + func.toDecimal(zfhj,2) + '，余额：' + func.toDecimal(zjbyxzfxe-zfhj,2) + 
        '，百分比：' + func.toDecimal(zfhj/zjbyxzfxe*100) + '%';
    
    dealerPayIsOk = zfhj <= zjbyxzfxe;
};

//设置默认的总经办允许支付相关信息
function setIndentZjbyxzf(){
    let tempIndent = LocalIndent.findOne(Session.get('paymentId'));
    if (!tempIndent) return;
    if (tempIndent.zjbyxzf == null){
        if (tempIndent && tempIndent.device[0]) {
            zjbyxzfxe = func.toNumber(tempIndent.device[0].fyqt);
        } else zjbyxzfxe = 0;

        let modifier = {$set: {}};
        modifier['$set']['zjbyxzf'] = false; //默认不允许支付费用
        modifier['$set']['zjbyxzfxe'] = zjbyxzfxe; 
        updateLocalIndent(indentId, modifier);
    };
};

Template.paymentStatus.onCreated(function(){    
    
});

Template.paymentStatus.onDestroyed(function(){
    Session.set('paymentId', '');
});

Template.paymentStatus.onRendered(function(){    
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
            {field: 'htzje', title: '合同总金额', halign: 'center' },
        ],
        onCheck: function(row){
            indentId = row._id;
            Meteor.subscribe('indentById', {id: indentId}, function onReady(){
                LocalpaymentStatus();
                Session.set('paymentId', indentId);   
            
                setTimeout(setIndentSkhj, 100); 
                setTimeout(setIndentZfhj, 100); 
                setTimeout(setIndentZjbyxzf, 100); 
            });           
        },
    });

    if (Session.get('paymentId') !== '') {
        $("#ddbh").val(Session.get('paymentId'));
        $("#btn_find").click();
    };    
});

Template.paymentStatus.helpers({
	selectedIndent: function(){
		return LocalIndent.findOne(Session.get('paymentId'));
    },
    zfxehj: function(){
        let zfxehj = 0;
        let tempIndent = LocalIndent.findOne(Session.get('paymentId'));
        if (tempIndent && tempIndent.device[0]) {
            zfxehj = func.toNumber(tempIndent.device[0].fyqt);
        }
        return zfxehj;
    },    
});

Template.paymentStatus.events({
    'click button#btn_find': function(evt, tpl){
		tpl.$('#tb_indentlist').bootstrapTable('refresh', {url: RootUrl+
			'indentlist/get'});
	},
    'click button#add-cash': function(evt, tpl){
        var obj = {skrq: func.getToday(), skje: 0, skbfb: '0%'};
        var modifier = {$push: {'cash': obj}};
        updateLocalIndent(indentId, modifier);
        setTimeout(setIndentSkhj, 100); //计算收款合计
    },
    'click button#add-dealerPay': function(evt, tpl){
        if (!$('#zjbyxzf')[0].checked) {
            Bert.alert('暂不允许支付费用', 'danger');
            return;
        }
        var obj = {zfrq: func.getToday(), zfje: 0, zfbfb: '0%', zjbsh: false};
        var modifier = {$push: {'dealerPay': obj}};
        updateLocalIndent(indentId, modifier);    
        setTimeout(setIndentZfhj, 100); //计算支付合计            
    },

    'mousedown .datepicker': function(){
        $('.datepicker').datepicker('destroy');
        gfunc.setDatePicker();
        $('.datepicker').datepicker('show');
    },
});

Template.paymentStatusEdit.events({
    'change input': function(evt, tpl){
        evt.stopImmediatePropagation(); //阻止事件传播
        let field = evt.currentTarget.id;
        if (field===""){return}; //如果没有设置ID，则退出
        let modifier = {$set: {}};
        let value = func.trim(evt.currentTarget.value);
        modifier['$set'][field] = (field === 'zjbyxzf') ? evt.currentTarget.checked : value;
        updateLocalIndent(indentId, modifier);

        if (field === 'zjbyxzfxe') {
            zjbyxzfxe = value;
        };
        setTimeout(setIndentZfhj, 100); //计算支付合计
    },
});

Template.paymentStatusHandle.events({
	'click button#baocundd': function(evt, tpl){
		gfunc.chumjConfirm("确实要保存吗？", function(result){
			if (result){
                if (!dealerPayIsOk){
                    Bert.alert('支付金额合计超标，不允许保存', 'danger');
                    return; 
                };

				if (changeLocalIndent(indentId)) {
					Bert.alert('订单已经被其他用户修改，无法保存', 'danger');
					return;
                };
				Meteor.call('updatePaymentStatus', indentId, LocalIndent.findOne(indentId),
					function(err, result){
                        if (err){
                            Bert.alert(err.message, 'danger');
                        } else {	
                            Bert.alert("保存成功", 'success', 'growl-top-left');
                            LocalpaymentStatus();
                        };
                    }
				);
			};
		});
	},
});

Template.paymentStatusCash.helpers({
        
});

Template.paymentStatusCash.events({
    'change': function(evt, tpl){
        evt.stopImmediatePropagation(); //阻止事件传播
        var index = evt.currentTarget.getAttribute('data-index');
        var field = evt.currentTarget.id;
        if (field===""){return}; //如果没有设置ID，则退出

        var property = 'cash.' + index + '.' + field;
        var modifier = {$set: {}};
        var value = func.trim(evt.currentTarget.value);
        modifier['$set'][property] = (field === 'skje') ? Number(value) : value;

        if (field==='skje'){
            modifier['$set']['cash.' + index + '.skbfb'] = func.toDecimal(value/htzje*100) + '%';
        };
        updateLocalIndent(indentId, modifier);
        if (field==='skje'){
            setTimeout(setIndentSkhj, 100); //计算收款合计
        };
    },
    'click button#del-cash': function(evt, tpl){
        var index = evt.currentTarget.getAttribute('data-index');
        var arrays = Template.parentData(1).cash;
        arrays.splice(index, 1);
        var modifier = {$set: {'cash': arrays}};
        updateLocalIndent(indentId, modifier);

        setTimeout(setIndentSkhj, 100); //计算收款合计
    },
});

Template.paymentStatusDealerPay.helpers({

});

Template.paymentStatusDealerPay.events({
    'change': function(evt, tpl){
        evt.stopImmediatePropagation(); //阻止事件传播
        var index = evt.currentTarget.getAttribute('data-index');
        var field = evt.currentTarget.id;
        if (field===""){return}; //如果没有设置ID，则退出

        var property = 'dealerPay.' + index + '.' + field;
        var modifier = {$set: {}};
        var value = func.trim(evt.currentTarget.value);
        if (field==='zjbsh'){
            modifier['$set'][property] = evt.currentTarget.checked;
        }
        else {
            modifier['$set'][property] = (field === 'zfje') ? Number(value) : value;
        };

        if (field==='zfje'){
            modifier['$set']['dealerPay.' + index + '.zfbfb'] = func.toDecimal(value/zjbyxzfxe*100) + '%';
        };
        updateLocalIndent(indentId, modifier);
        if (field==='zfje'){
            setTimeout(setIndentZfhj, 100); //计算支付合计
        };
    },
    'click button#del-dealerPay': function(evt, tpl){
        var index = evt.currentTarget.getAttribute('data-index');
        var arrays = Template.parentData(1).dealerPay;
        arrays.splice(index, 1);
        var modifier = {$set: {'dealerPay': arrays}};
        updateLocalIndent(indentId, modifier);

        setTimeout(setIndentZfhj, 100); //计算支付合计
    },
});
