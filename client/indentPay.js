import * as func from '../lib/func/function';
import * as gfunc from './lib/globalFunction';
import {updateLocalIndent} from './lib/localCollection';

//本地数据集获取数据
function LocalIndentPay(){
    var id = Session.get('payIndentId');
    if (id == ''){id = 'none'};
    LocalIndent.upsert(Session.get('payIndentId'),
        IndentCollection.findOne({_id: id})
    );
};

Tracker.autorun(function(){
    var getData = IndentCollection.find({"ddbh": Session.get('payIndentBh')});
    if (getData.count() > 0){
        Session.set('payIndentId', getData.fetch()[0]._id);
        LocalIndentPay();
    }else{
        Session.set('payIndentId', '');
        LocalIndent.findOne({_id: 'none'});
    };
});

//自动计算收款总金额
function setIndentSkzje(){
    //$('[id=djsfsd]').each(function(index, element){alert($(this)[0].checked)})
    //$('[id=djsfsd]').each(function(index, element){alert(element.checked)});

    var djSum = 0;
    $('[id=djsfsd]').each(function(index, element){
        if (element.checked){
            djSum = djSum + Number($('[data-index='+index+'][id=djysdj]').val());
        };
    });

    var skSum = 0;
    $('[id=sksfsk]').each(function(index, element){
        if (element.checked){
            skSum = skSum + Number($('[data-index='+index+'][id=skysje]').val());
        };
    });

    var modifier = {$set: {}};
    modifier['$set']['skzje'] = djSum + skSum;
    updateLocalIndent(Session.get('payIndentId'), modifier);
};

Template.indentpay.onCreated(function(){
    Meteor.subscribe('paytype');
});

Template.indentpay.onDestroyed(function(){
    Session.set('payIndentBh', '');
	Session.set('payIndentId', '');
});

Template.indentpay.onRendered(function(){
    $('.form-horizontal').bootstrapValidator({
        message: '输入的值不符合要求',
        excluded:[],//表示对所有情况都验证，包括禁用域和隐藏域
        submitButtons: '#baocundd',
        fields: {
            ddbh: {
                trigger:"change",
                validators: {
                    notEmpty: {message: '订单编号不允许为空'},
                }
            },
        }
    });
    if (Session.get('payIndentBh') !== ''){
        $('#ddbh').val(Session.get('payIndentBh'));
    };
});

Template.indentpay.helpers({
	selectedIndent: function(){
		return LocalIndent.findOne(Session.get('payIndentId'));
	},
});

Template.indentpay.events({
    'keypress #ddbh': function(evt, tpl){
        if (evt.keyCode !== 13) return;
        evt.preventDefault();
        var ddbh = evt.currentTarget.value;

        if (ddbh){
            Meteor.subscribe('indentByBh', {id: ddbh});
            Session.set('payIndentBh', ddbh);
        }else{
            Session.set('payIndentBh', '');
        };
    },
    'change #fktk': function(evt, tpl){
        evt.stopImmediatePropagation(); //阻止事件传播
        var modifier = {$set: {}};
        modifier['$set']['fktk'] = evt.currentTarget.value;
        updateLocalIndent(Session.get('payIndentId'), modifier);
    },
    'click button#add-deposit': function(evt, tpl){
        var obj = {djdjbl: '', djysdj: 0, djsfsd: false, djpcrq: '', djchrq: '', djtsrq:''};
        var modifier = {$push: {'deposit': obj}};
        updateLocalIndent(Session.get('payIndentId'), modifier);
    },
    'click button#add-pay': function(evt, tpl){
        var obj = {skysje: 0, skdqr: '', sktxr: '', sklx: '货到付款', sksfsk: false, skbz:''};
        var modifier = {$push: {'pay': obj}};
        updateLocalIndent(Session.get('payIndentId'), modifier);
    },
    'click button#add-ppp': function(evt, tpl){
        var obj = {ppsbxh: '', ppmm: '', ppdqr: '', pptxr: '', ppmmjb: '0级密码', ppsfgb:false, ppbz: ''};
        var modifier = {$push: {'ppp': obj}};
        updateLocalIndent(Session.get('payIndentId'), modifier);
    },
    'mousedown .datepicker': function(){
        $('.datepicker').datepicker('destroy');
        gfunc.setDatePicker();
        $('.datepicker').datepicker('show');
    },
});

Template.payHandle.events({
	'click button#baocundd': function(evt, tpl){
        gfunc.resetBootstrapValidator('.form-horizontal');
        if (!gfunc.touchBootstrapValidator('.form-horizontal')){
            return; //错误的话退出
        };

		gfunc.chumjConfirm("确实要保存订单吗？", function(result){
			if (result){
				var id = Session.get('payIndentId');
				Meteor.call('updateIndentPay', id, LocalIndent.findOne(id),
					function(err, result){
					if (err){
						Bert.alert(err.message, 'danger');
					} else {	
						Bert.alert("保存收款信息成功", 'success', 'growl-top-left');
					};
				});
			};
		});
	},
});

Template.invoice.events({
	'change input': function(evt, tpl){
		evt.stopImmediatePropagation(); //阻止事件传播
		var field = evt.currentTarget.id;
		var modifier = {$set: {}};
		if (field===""){return}; //如果没有设置ID，则退出
        if (field==='fplxpt' || field==='fplxzzs'){
            modifier['$set']['fplx'] = evt.currentTarget.value;
        }
        else {
            modifier['$set'][field] = evt.currentTarget.value;
        };
		
		//每一个输入控件的改变都将更新本地数据集
		updateLocalIndent(Session.get('payIndentId'), modifier);
	}
});

Template.deposit.events({
    'change input': function(evt, tpl){
        evt.stopImmediatePropagation(); //阻止事件传播
        var index = evt.currentTarget.getAttribute('data-index');
        var field = evt.currentTarget.id;
        if (field===""){return}; //如果没有设置ID，则退出

        var property = 'deposit.' + index + '.' + field;
        var modifier = {$set: {}};
        var value = func.trim(evt.currentTarget.value);
        if (field==='djsfsd'){
            modifier['$set'][property] = evt.currentTarget.checked;
        }
        else {
            modifier['$set'][property] = (field === 'djysdj') ? Number(value) : value;
        };

        updateLocalIndent(Session.get('payIndentId'), modifier);
        if (field==='djysdj' || field==='djsfsd'){
            setIndentSkzje(); //计算收款总金额
        };
    },
    'click button#del-deposit': function(evt, tpl){
        var index = evt.currentTarget.getAttribute('data-index');
        var arrays = Template.parentData(1).deposit;
        $('#djysdj[data-index="'+ index +'"]').val(0); //先设为零，避免出现删除后统计的错误
        arrays.splice(index, 1);
        var modifier = {$set: {'deposit': arrays}};
        updateLocalIndent(Session.get('payIndentId'), modifier);

        setIndentSkzje(); //计算收款总金额
    },
});

Template.pay.helpers({
    paytypes: function(){
        return PayTypeCollection.find();
    },
});

Template.pay.events({
    'change': function(evt, tpl){
        evt.stopImmediatePropagation(); //阻止事件传播
        var index = evt.currentTarget.getAttribute('data-index');
        var field = evt.currentTarget.id;
        if (field===""){return}; //如果没有设置ID，则退出

        var property = 'pay.' + index + '.' + field;
        var modifier = {$set: {}};
        var value = func.trim(evt.currentTarget.value);
        if (field==='sksfsk'){
            modifier['$set'][property] = evt.currentTarget.checked;
        }
        else {
            modifier['$set'][property] = (field === 'skysje') ? Number(value) : value;
        };
        if (field==='skdqr'){
            gfunc.setDatePicker();
            $('[data-index='+ index +'][id=sktxr]').datepicker('update', addDay(strToDate(value), -7));
        };

        updateLocalIndent(Session.get('payIndentId'), modifier);
        if (field==='skysje' || field==='sksfsk'){
            setIndentSkzje(); //计算收款总金额
        };
    },
    'click button#del-pay': function(evt, tpl){
        var index = evt.currentTarget.getAttribute('data-index');
        var arrays = Template.parentData(1).pay;
        $('#skysje[data-index="'+ index +'"]').val(0); //先设为零，避免出现删除后统计的错误
        arrays.splice(index, 1);
        var modifier = {$set: {'pay': arrays}};
        updateLocalIndent(Session.get('payIndentId'), modifier);

        setIndentSkzje(); //计算收款总金额
    },
});

Template.ppp.events({
    'change': function(evt, tpl){
        evt.stopImmediatePropagation(); //阻止事件传播
        var index = evt.currentTarget.getAttribute('data-index');
        var field = evt.currentTarget.id;
        if (field===""){return}; //如果没有设置ID，则退出

        var property = 'ppp.' + index + '.' + field;
        var modifier = {$set: {}};
        var value = func.trim(evt.currentTarget.value);
        if (field==='ppsfgb'){
            modifier['$set'][property] = evt.currentTarget.checked;
        }
        else {
            modifier['$set'][property] = value;
        };
        if (field==='ppdqr'){
            gfunc.setDatePicker();
            $('[data-index='+ index +'][id=pptxr]').datepicker('update', addDay(strToDate(value), -7));
        };

        updateLocalIndent(Session.get('payIndentId'), modifier);
    },
    'click button#del-ppp': function(evt, tpl){
        var index = evt.currentTarget.getAttribute('data-index');
        var arrays = Template.parentData(1).ppp;
        arrays.splice(index, 1);
        var modifier = {$set: {'ppp': arrays}};
        updateLocalIndent(Session.get('payIndentId'), modifier);
    },
});

