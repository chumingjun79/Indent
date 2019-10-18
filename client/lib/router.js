//判断普通用户是否具有权限
export function checkUserRole(roleName){
	var obj = UserRoleCollection.findOne({"_id": Meteor.userId()});
	if (obj) {
		for (var i=0; i<obj.roles.length; i++){
		    data = obj.roles[i];
			if (data.gnnm === roleName){
				return true;
			};
		};
	};
	return false;
};

//判断权限的函数（先判断是否系统管理员，再判断普通用户的权限）
function checkSystemRole(obj, gnnm, gnmc){
    if (!Meteor.user()) return false;
    if (Meteor.user().username === 'admin'){
        obj.render(gnnm);
        return true;
    }else {
        if (checkUserRole(gnnm)){
            obj.render(gnnm);
            return true;
        } else {
            Bert.alert('对不起，您没有' + gnmc + '的权限', 'danger');
            Router.go('/');
        };
    };
    return false;
};

//判断是否具有powerName对应的权限，如果有返回true，没有返回false
export function checkPower(powerName){
    if (Meteor.user().username === 'admin'){
        return true;
    } else {
        return checkUserRole(powerName);
    }; 
};

Router.configure({ layoutTemplate: 'layout' });

Router.route('/', function(){
	this.render('homepage');
});

Router.route('/logout', function(){
	Meteor.logout();
    this.render('homepage');
});

Router.route('/login', function(){
	this.render('login');
});

Router.route('/indent', function(){
    if (checkSystemRole(this, 'indent', '订单录入')){
        Session.set('selectedIndentId', '');
    };
});

//订单浏览
Router.route('/indentinfo', function(){
    this.render('indent');
});

Router.route('/indentlist', function(){
    checkSystemRole(this, 'indentlist', '订单查询');
});

Router.route('/devicedetail', function(){
    checkSystemRole(this, 'devicedetail', '订单明细查询');
});

Router.route('/shipment', function(){
    checkSystemRole(this, 'shipment', '订单发货');
});

Router.route('/shipmentlist', function(){
    checkSystemRole(this, 'shipmentlist', '发货明细查询');
});

Router.route('/devicelist', function(){
    checkSystemRole(this, 'devicelist', '查看设备发货信息');
});

Router.route('/orderstatus', function(){
    checkSystemRole(this, 'orderstatus', '查看订单状态比较');
});

Router.route('/monthly', function(){
    checkSystemRole(this, 'monthly', '查看订单月度比较');
});

Router.route('/officereport', function(){
    checkSystemRole(this, 'officereport', '查看办事处业绩');
});

Router.route('/productreport', function(){
    checkSystemRole(this, 'productreport', '查看分产品订货');
});

Router.route('/averagemf', function(){
    checkSystemRole(this, 'averagemf', '查看平均系数对比');
});

Router.route('/monthcost', function(){
    checkSystemRole(this, 'monthcost', '查看分月份费用率');
});

Router.route('/officecost', function(){
    checkSystemRole(this, 'officecost', '查看办事处费用率');
});

Router.route('/paymentStatus', function(){
    checkSystemRole(this, 'paymentStatus', '利润表报销');
});

Router.route('/paymentStatusCashList', function(){
    checkSystemRole(this, 'paymentStatusCashList', '查看利润表收款明细');
});

Router.route('/paymentStatusPayList', function(){
    checkSystemRole(this, 'paymentStatusPayList', '查看利润表支付明细');
});

Router.route('/paymentDetail', function(){
    checkSystemRole(this, 'paymentDetail', '费用表报销');
});

Router.route('/paymentDetailList', function(){
    checkSystemRole(this, 'paymentDetailList', '查看费用表支付明细');
});

//用户管理
Router.route('/userlist', function(){
    checkSystemRole(this, 'userlist', '用户管理');
});

//更改口令
Router.route('/changepass', {name: 'changepass'});
//重置口令
Router.route('/resetpass', {name: 'resetpass'});
//创建用户
Router.route('/createuser', {name: 'createuser'});
//设置权限
Router.route('/setrole', {name: 'setrole'});

Router.route('/indentpay', function(){
    checkSystemRole(this, 'indentpay', '订单收款');
});

Router.route('/paylist', function(){
    checkSystemRole(this, 'paylist', '收款查询');
});

Router.route('/paywarn', function(){
    checkSystemRole(this, 'paywarn', '收款到期查询');
});

Router.route('/pppwarn', function(){
    checkSystemRole(this, 'pppwarn', 'PPP到期查询');
});

Router.route('/commissiontotal', function(){
    checkSystemRole(this, 'commissiontotal', '提成发放汇总');
});

Router.route('/commissiondetail', function(){
    checkSystemRole(this, 'commissiondetail', '提成发放明细');
});

Router.route('/commission', function(){
    checkSystemRole(this, 'commission', '提成发放');
});

Router.route('/systeminfo', function(){
    checkSystemRole(this, 'systeminfo', '系统信息');
});

Router.route('/item', {
    waitOn: function(){
        return Meteor.subscribe('item');
    },
    action: function(){
        checkSystemRole(this, 'cditem', '项目分类维护');
    },
});

Router.route('/product', {
    waitOn: function(){
        return Meteor.subscribe('product');
    },
    action: function(){
        checkSystemRole(this, 'cdproduct', '产品分类维护');
    },
});

Router.route('/office', {
    waitOn: function(){
        return Meteor.subscribe('office');
    },
    action: function(){
        checkSystemRole(this, 'cdoffice', '办事处维护');
    },
});

Router.route('/worker', {
    waitOn: function(){
        return Meteor.subscribe('worker');
    },
    action: function(){
        checkSystemRole(this, 'cdworker', '员工维护');
    },
});

Router.route('/function', {
    waitOn: function(){
        return Meteor.subscribe('function');
    },
    action: function(){
        checkSystemRole(this, 'cdfunction', '功能维护');
    },
});

Router.route('/costtype', {
    waitOn: function(){
        return Meteor.subscribe('costtype');
    },
    action: function(){
        checkSystemRole(this, 'cdcosttype', '费用类别');
    },
});

if (Meteor.isClient){
	var requireLogin = function(){
		if (!Meteor.userId()) {
			this.render('homepage');
		} else {
			this.next();
		}	
	};

	Router.onBeforeAction(requireLogin, {
	  	except: ['login']
	});
};

