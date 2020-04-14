import * as func from '../lib/func/function';
import * as gfunc from './lib/globalFunction';
import {updateLocalIndent, changeLocalIndent} from './lib/localCollection';

var tempIndent = {
    userid: '',
    username: '',
    kjnd: '',
    kjyf: '',
    ddbh: '',
    xmmc: '',
	xmfl: '',
	khmc: '',
	sshy: '',
    lxr: '',
    dxm: false,
    device: [],
    tcxs: 0,
    tcjs: 0,
    fysc: 0,
    fyqt: 0,
    fyyj: 0,
	fykc: 0,
    remark: '',

    fktk: '',
    fplx: 0,
    fpgsmc: '',
    fpsh: '',
    fpdwdz: '',
    fpdhhm: '',
    fpkhyh: '',
    fpyhzh: '',
    deposit: [],
    pay: [],
    ppp: [],

    sbzje: 0,
    htzje: 0,
    skzje: 0
};

//本地数据集获取数据
function defaultLocalIndent(){
	var id = Session.get('selectedIndentId');
	if (id == ''){id = 'none'};
	var newId = LocalIndent.upsert(Session.get('selectedIndentId'), 
		IndentCollection.findOne({_id: id}) || tempIndent
		).insertedId;
	if (!newId) newId = Session.get('selectedIndentId');
	Session.set('selectedIndentId', newId);
};

//新建订单的函数
function newIndentfunc(){
    var date = new Date();
    tempIndent.kjnd = String(date.getFullYear());
    tempIndent.kjyf = date.getMonth()+1;

	Session.set('selectedIndentId', '');
	defaultLocalIndent();
};

//遍历设备取得设备总金额
function getDeviceTotal(){
	var sum = 0;
    $('.xj').each(function(){
        sum += parseFloat(this.value);
    });
    return func.toDecimal(sum, 0);
};

//自动计算合同总金额
function setIndentTotal(){
	var sbzje = getDeviceTotal();

	var modifier = {$set: {}};
	modifier['$set']['sbzje'] = Number(sbzje);
	updateLocalIndent(Session.get('selectedIndentId'), modifier);
};

//获取员工姓名或编号
function getWorkerInfo(info, xmOrBh){
	if (xmOrBh === 'xm'){
		var getData = WorkerCollection.findOne({'ygxm':info});
		if (getData){
			return getData.ygbh;
		};
	} else {
        var getData = WorkerCollection.findOne({'ygbh':info});
        if (getData){
            return getData.ygxm;
        };
	};
};

Template.indent.onCreated(function(){
	this.autorun(function(){
		Meteor.subscribe('indentById', {id: Session.get('selectedIndentId')});
		defaultLocalIndent();
	});
	
	Meteor.subscribe('item');
	Meteor.subscribe('industry');
	Meteor.subscribe('product');
    Meteor.subscribe('office');
    Meteor.subscribe('worker');
});

Template.indent.onDestroyed(function(){
	Session.set('selectedIndentId', '');
});

Template.indent.helpers({
	selectedIndent: function(){
		return LocalIndent.findOne(Session.get('selectedIndentId'));
	},
});

Template.indent.events({
	'change input': function(evt, tpl){
		evt.stopImmediatePropagation(); //阻止事件传播
		var field = evt.currentTarget.id;
		var modifier = {$set: {}};
		if (field===""){return}; //如果没有设置ID，则退出
		if (field==='dxm'){
			modifier['$set'][field] = evt.currentTarget.checked;
		}
		else {
			var value = evt.currentTarget.value;
			modifier['$set'][field] = (field==='kjyf' || field==='htzje') ? Number(value) : func.trim(value);
		};
		updateLocalIndent(Session.get('selectedIndentId'), modifier);
	},
	'change #remark': function(evt, tpl){
		evt.stopImmediatePropagation(); //阻止事件传播
		var modifier = {$set: {}};
		modifier['$set']['remark'] = evt.currentTarget.value;
		updateLocalIndent(Session.get('selectedIndentId'), modifier);
	},
	'change #fktk': function(evt, tpl){
		evt.stopImmediatePropagation(); //阻止事件传播
		var modifier = {$set: {}};
		modifier['$set']['fktk'] = evt.currentTarget.value;
		updateLocalIndent(Session.get('selectedIndentId'), modifier);
	},
	'change select': function(evt, tpl){
        evt.stopImmediatePropagation(); //阻止事件传播
        var field = evt.currentTarget.id;
        var modifier = {$set: {}};
        if (field===""){return}; //如果没有设置ID，则退出
        modifier['$set'][field] = evt.currentTarget.value;
        updateLocalIndent(Session.get('selectedIndentId'), modifier);
	},
	'click button#btn-add': function(evt, tpl){
		var obj = {cpfl:'', sbxh:'', bsc:'', fzr:'', ygbh:'', sbxs:0, sbsl:0, sbje:0,
            tcxs:0, tcjs:0, fysc:0, fyqt:0, fyyj:0, fykc:0, tszbjj:0, ftjfy:0, shipment: []};
        var getData = LocalIndent.find(Session.get('selectedIndentId')).fetch()[0].device;
        var len = getData.length;
        if (len > 0){
            obj.bsc = getData[len-1].bsc;
            obj.fzr = getData[len-1].fzr;
            obj.ygbh = getData[len-1].ygbh;
            obj.cpfl = getData[len-1].cpfl;
            obj.sbxh = getData[len-1].sbxh;
			obj.sbxs = getData[len-1].sbxs;
			obj.sbsl = getData[len-1].sbsl;
			obj.sbje = getData[len-1].sbje;
			obj.tcxs = getData[len-1].tcxs;
			obj.tszbjj = getData[len-1].tszbjj;
        };
		var modifier = {$push: {'device': obj}};
		updateLocalIndent(Session.get('selectedIndentId'), modifier);
		setTimeout(setIndentTotal, 100); //计算设备总金额和合同总金额
	}
});

Template.indentHandle.events({
	'click button#baocundd': function(evt, tpl){
		gfunc.resetBootstrapValidator('.form-horizontal');
        if (!gfunc.touchBootstrapValidator('.form-horizontal')){
            return; //错误的话退出
        };


		gfunc.chumjConfirm("确实要保存订单吗？", function(result){
			if (result){
				//alert($(evt.currentTarget).attr('id'));
				//alert($("#dxm").get(0).checked);
				let id = Session.get('selectedIndentId');
				if (changeLocalIndent(id)) {
					Bert.alert('订单已经被其他用户修改，无法保存', 'danger');
					return;
				};

				let modifier = {
					$set: {
						'userid': Meteor.userId(),
						'username': Meteor.user().username,
					}
				};
				updateLocalIndent(id, modifier); //先保存用户到本地数据集
				Meteor.call('upsertIndent', id, LocalIndent.findOne(id),
					function (err, result) {
						if (err) {
							Bert.alert(err.message, 'danger');
						} else {
							Bert.alert("保存订单成功", 'success', 'growl-top-left');
							//如果是新增的单据，则取得新增单据的ID
							if (result.insertedId) {
								Session.set('selectedIndentId', result.insertedId);
							} else defaultLocalIndent();
						};
					});

			};
        });
	},
	'click button#xinzengdd': function(evt, tpl){
		//新增订单
        gfunc.resetBootstrapValidator('.form-horizontal'); //重置一下验证状态
        newIndentfunc();
	},
	'click button#shanchudd': function(evt, tpl){
		gfunc.chumjConfirm("确实要删除订单吗？", function(result){
			if (result){
				if (Session.get('selectedIndentId') == ''){
                    Bert.alert("订单ID为空，无法删除");
					return;
				};

				var obj = {id: Session.get('selectedIndentId')};	
				Meteor.call('deleteIndent', obj, function(err, result){
					if (err){
						Bert.alert(err.message, 'danger');
					} else {
						Bert.alert("删除订单成功", 'success', 'growl-top-left');
						LocalIndent.remove(obj.id);
						newIndentfunc();
					};
				});
			};
		});
	},
});

Template.device.events({
	'change input': function(evt, tpl){
		evt.stopImmediatePropagation(); //阻止事件传播
		var index = evt.currentTarget.getAttribute('data-index');
		var field = evt.currentTarget.id;
		if (field===""){return}; //如果没有设置ID，则退出

		var deviceProperty = 'device.' + index + '.' + field;
		var modifier = {$set: {}};
		var value = func.trim(evt.currentTarget.value);
		modifier['$set'][deviceProperty] = ((field === 'cpfl')||(field === 'sbxh')||(field === 'bsc')
            ||(field === 'fzr')||(field === 'ygbh')) ? func.trim(value) : Number(value);
		updateLocalIndent(Session.get('selectedIndentId'), modifier);

		if (field === 'sbje'){
			setIndentTotal(); //计算设备总金额和合同总金额
		};

		//根据员工姓名得到编号，或根据编号得到姓名
		if (field === 'fzr' || field === 'ygbh') {
            if (field === 'fzr') {
                var xmOrBh = 'ygbh';
                var info = getWorkerInfo(value, 'xm');
            } else {
                var xmOrBh = 'fzr';
                var info = getWorkerInfo(value, 'bh');
            };
            deviceProperty = 'device.' + index + '.' + xmOrBh;
            modifier = {$set: {}};
            modifier['$set'][deviceProperty] = info;
            updateLocalIndent(Session.get('selectedIndentId'), modifier);
        };
	},
	'click button#btn-del': function(evt, tpl){
		var index = evt.currentTarget.getAttribute('data-index');
	    var devices = Template.parentData(1).device;
	    if (devices[index].shipment.length > 0) {
            Bert.alert("当前订单有发货记录，无法删除", 'danger');
	    	return;
		}

	    devices.splice(index, 1);
	    var modifier = {$set: {'device': devices}};
	    updateLocalIndent(Session.get('selectedIndentId'), modifier);

	    setTimeout(setIndentTotal, 100); //计算设备总金额和合同总金额
	},
	'click button#btn-fcbl': function(evt, tpl){
		var index = evt.currentTarget.getAttribute('data-index');
		var device = Template.parentData(0);
		if (!device) return;

	    var temp = '<input type="text" placeholder="请输入分成比例..." class="name form-control">';
        gfunc.chumjInput('计算', temp, '.name', '必须输入分成比例', function(result, value){
            if (result){
				let sbsl = func.toDecimal(device.sbsl*value, 2); 
				let sbje = func.toDecimal(device.sbje*value, 2);
				let tcxs = func.toDecimal(device.tcxs*value, 2);
				let tszbjj = func.toDecimal(device.tszbjj*value, 2);

                var modifier = {$set: {}};
				modifier['$set']['device.' + index + '.sbsl'] = sbsl;
				modifier['$set']['device.' + index + '.sbje'] = sbje;
				modifier['$set']['device.' + index + '.tcxs'] = tcxs;
				modifier['$set']['device.' + index + '.tszbjj'] = tszbjj;
                updateLocalIndent(Session.get('selectedIndentId'), modifier);

                setTimeout(setIndentTotal, 100); //计算设备总金额和合同总金额
            };
        });	    
	},
	'click span': function(evt, tpl){
        //OfficeCollection.find({}, {limit: 5}).forEach((post) =>{alert(`办事处: ${post.office}`);})
        var index = evt.currentTarget.getAttribute('data-index');
        var field = evt.currentTarget.id;
        if (field===""){return}; //如果没有设置ID，则退出

        var temp = '';
        if (field === 'span-bsc'){
        	var id = 'bsc';
            OfficeCollection.find({}, {sort:{area:1, office:1}}).forEach((post) => {
                temp = temp + '<option value="'+post.office+'">'+post.office+'</option>';
            });
        }else if (field === 'span-cpfl'){
        	var id = 'cpfl';
            ProductCollection.find({}, {sort:{product:1}}).forEach((post) => {
                temp = temp + '<option value="'+post.product+'">'+post.product+'</option>';
            });
		}else if (field === 'span-fzr'){
            var id = 'fzr';
            var bsc = $('#bsc[data-index="'+ index +'"]').val();
            WorkerCollection.find({'ygbm':bsc}).forEach((post) => {
                temp = temp + '<option value="'+post.ygxm+'">'+post.ygxm+'</option>';
            });
        };
        var select = '<select class="form-control col-sm-6" id="select">' +
            temp + '</select>';

		gfunc.chumjInput('选择', select, '#select', '必须选择一项内容', function(result, value){
            if (result){
                var deviceProperty = 'device.' + index + '.' + id;
                var modifier = {$set: {}};
                modifier['$set'][deviceProperty] = value;
                updateLocalIndent(Session.get('selectedIndentId'), modifier);

                //根据员工姓名得到编号
                if (field === 'span-fzr') {
                    var info = getWorkerInfo(value, 'xm');
                    deviceProperty = 'device.' + index + '.ygbh';
                    modifier = {$set: {}};
                    modifier['$set'][deviceProperty] = info;
                    updateLocalIndent(Session.get('selectedIndentId'), modifier);
                };
            };
        });
	}
});

Template.indentBody.helpers({
    items: function(){
        return ItemCollection.find();
	},
	industrys: function(){
        return IndustryCollection.find();
    },
});

Template.indent.onRendered(function(){
	gfunc.setDatePicker();

	$('.form-horizontal').bootstrapValidator({
		message: '输入的值不符合要求',
		excluded:[],//表示对所有情况都验证，包括禁用域和隐藏域
		submitButtons: '#baocun',
		fields: {
			ddbh: {
				trigger:"change",
				validators: {
					notEmpty: {message: '订单编号不允许为空'},
				}
			},
			kjnd: {
				validators: {
					notEmpty: {message: '订单年度不允许为空'},
				}
			},
            kjyf: {
                validators: {
                    notEmpty: {message: '订单月份不允许为空'},
                }
            },
			xmmc: {
				validators: {
					notEmpty: {message: '项目名称不允许为空'},
				}
			},
            xmfl: {
                validators: {
                    notEmpty: {message: '项目分类不允许为空'},
                }
			},
			sshy: {
                validators: {
                    notEmpty: {message: '所属行业不允许为空'},
                }
            },
		}
	});
});

Template.showIndent.helpers({
    getUserRole: function(){
		//判断单据是否为当前用户所有
		/*let tempUserid = LocalIndent.findOne(Session.get('selectedIndentId')).username;
		if ( tempUserid !== '' && tempUserid !== Meteor.user().username ){
			return false;
		};*/
        return true;
    },
});