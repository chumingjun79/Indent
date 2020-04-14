import * as check from '../lib/func/check';

Accounts._options.forbidClientAccountCreation = false; //允许客户端创建用户

Meteor.methods({
	'upsertIndent': function(id, data){
		if (check.emptyString(id)) {
			throw new Meteor.Error(403, "传入的id不允许为空");
		};
        if (check.emptyString(data.ddbh)) {
            throw new Meteor.Error(403, "订单编号不允许为空");
        };
        if (check.emptyString(data.kjnd)) {
            throw new Meteor.Error(403, "订单年度不允许为空");
        };
        if (check.emptyString(data.kjyf)) {
            throw new Meteor.Error(403, "订单月份不允许为空");
        };
        if (check.emptyString(data.xmmc)) {
            throw new Meteor.Error(403, "项目名称不允许为空");
        };
        if (data.device.length <= 0){
            throw new Meteor.Error(403, "设备列表不允许为空"); 
        }
		for(var i=0; i<data.device.length; i++){
            var temp = data.device[i].bsc;
            if (check.emptyString(temp)){
                throw new Meteor.Error(403, "办事处不允许为空");
            };
            var getData = OfficeCollection.find({office: temp});
            if (getData.count() === 0){
                throw new Meteor.Error(403, "办事处没有定义");
            };
            if (check.emptyString(data.device[i].fzr)){
                throw new Meteor.Error(403, "负责人不允许为空");
            };
            temp = data.device[i].cpfl;
            if (check.emptyString(temp)){
                throw new Meteor.Error(403, "产品分类不允许为空");
            };
            getData = ProductCollection.find({product: temp});
            if (getData.count() === 0){
                throw new Meteor.Error(403, "产品分类没有定义");
            };
            if (!check.isFloat(data.device[i].sbxs)){
                throw new Meteor.Error(403, "系数必须是数字");
            };
            if (!check.isFloat(data.device[i].sbsl)){
                throw new Meteor.Error(403, "数量必须是数字");
            };
            if (!check.isFloat(data.device[i].sbje)){
                throw new Meteor.Error(403, "设备金额必须是数字");
            };
            if (!check.isFloat(data.device[i].tcxs)){
                throw new Meteor.Error(403, "提成（销售员）必须是数字");
            };
            if (!check.isFloat(data.device[i].tcjs)){
                throw new Meteor.Error(403, "提成（技术支持）必须是数字");
            };
            if (!check.isFloat(data.device[i].fysc)){
                throw new Meteor.Error(403, "费用（市场推广）必须是数字");
            };
            if (!check.isFloat(data.device[i].fyqt)){
                throw new Meteor.Error(403, "费用（其他）必须是数字");
            };
            if (!check.isFloat(data.device[i].fykc)){
                throw new Meteor.Error(403, "考察礼品费必须是数字");
            };
            if (!check.isFloat(data.device[i].fyyj)){
                throw new Meteor.Error(403, "样机费必须是数字");
            };
            if (!check.isFloat(data.device[i].tszbjj)){
                throw new Meteor.Error(403, "调试质保加价必须是数字");
            };
            if (!check.isFloat(data.device[i].ftjfy)){
                throw new Meteor.Error(403, "非统计费用必须是数字");
            };
		};
        if (!check.isFloat(data.sbzje)){
            throw new Meteor.Error(403, "设备总金额必须是数字");
        };
        if (!check.isFloat(data.htzje)){
            throw new Meteor.Error(403, "合同总金额必须是数字");
        };
        if (data.device[0].fykc+data.device[0].ftjfy < data.bscfyxehj){
            throw new Meteor.Error(403, "考察礼品费与非统计费用的合计不能低于费用表限额");
        };
        if (data.device[0].fyqt < data.zjbyxzfxe){
            throw new Meteor.Error(403, "费用（其他）不能低于利润表费用限额");
        };

        if (IndentCollection.find({ "_id":{$ne: id}, "ddbh":data.ddbh }).count() > 0){
            throw new Meteor.Error(403, "订单编号重复");
        };

        data.savetime = new Date();
		return IndentCollection.upsert({"_id": id}, data);
	},
    'updateIndentPay': function(id, data){
        if (check.emptyString(id)) {
            throw new Meteor.Error(403, "传入的id不允许为空");
        };
        for(var i=0; i<data.deposit.length; i++){
            if (!check.isPositiveFloat(data.deposit[i].djysdj)){
                throw new Meteor.Error(403, "应收定金必须是大于零的数字");
            };
        };
        for(var i=0; i<data.pay.length; i++){
            if (!check.isPositiveFloat(data.pay[i].skysje)){
                throw new Meteor.Error(403, "应收金额必须是大于零的数字");
            };
            if (check.emptyString(data.pay[i].skdqr)){
                throw new Meteor.Error(403, "应收款项到期日不允许为空");
            };
            if (check.emptyString(data.pay[i].sktxr)){
                throw new Meteor.Error(403, "应收款项提醒日不允许为空");
            };
        };
        for(var i=0; i<data.ppp.length; i++){
            if (check.emptyString(data.ppp[i].ppmm)){
                throw new Meteor.Error(403, "PPP密码不允许为空");
            };
            if (check.emptyString(data.ppp[i].ppdqr)){
                throw new Meteor.Error(403, "PPP到期日不允许为空");
            };
            if (check.emptyString(data.ppp[i].pptxr)){
                throw new Meteor.Error(403, "PPP提醒日不允许为空");
            };
        };
        if (!check.isFloat(data.skzje)){
            throw new Meteor.Error(403, "收款总金额必须是数字");
        };

        data.savetime = new Date();
        return IndentCollection.update({"_id": id}, data);
    },
    'updateIndentShipment': function(id, index, data){
        if (check.emptyString(id)) {
            throw new Meteor.Error(403, "传入的id不允许为空");
        };
        var deviceProperty = 'device.' + index + '.shipment';
        var modifier = {$set: {}};
        modifier['$set'][deviceProperty] = data;
        modifier['$set']['savetime'] = new Date();
        return IndentCollection.update({"_id": id}, modifier);
    },
    'updateIndentCommission': function(id, index, data){
        if (check.emptyString(id)) {
            throw new Meteor.Error(403, "传入的id不允许为空");
        };
        var deviceProperty = 'device.' + index + '.commission';
        var modifier = {$set: {}};
        modifier['$set'][deviceProperty] = data;
        modifier['$set']['savetime'] = new Date();
        return IndentCollection.update({"_id": id}, modifier);
    },
    'updatePaymentDetail': function(id, data){
        if (check.emptyString(id)) {
            throw new Meteor.Error(403, "传入的id不允许为空");
        };        
        if (data.quota){
            for(var i=0; i<data.quota.length; i++){
                if (!check.isPositiveFloat(data.quota[i].edfyxe)){
                    throw new Meteor.Error(403, "费用限额必须是大于零的数字");
                };
            };
        };
        if (data.officePay){
            for(var i=0; i<data.officePay.length; i++){
                if (!check.isFloat(data.officePay[i].zfje)){
                    throw new Meteor.Error(403, "支付金额必须是数字");
                };
                if (check.emptyString(data.officePay[i].zfrq)){
                    throw new Meteor.Error(403, "支付日期不允许为空");
                };
            };
        };        
        if (!check.isFloat(data.bscfyxehj)){
            throw new Meteor.Error(403, "费用限额合计必须是数字");
        };

        data.savetime = new Date();
        return IndentCollection.update({"_id": id}, data);
    },
    'updatePaymentStatus': function(id, data){
        if (check.emptyString(id)) {
            throw new Meteor.Error(403, "传入的id不允许为空");
        };
        if (!check.isFloat(data.zjbyxzfxe)){
            throw new Meteor.Error(403, "允许支付限额必须是数字");
        };
        if (data.zjbyxzfxe > data.device[0].fyqt){
            throw new Meteor.Error(403, "允许支付限额不能大于订单中项目费用");
        };

        if (data.cash){
            for(var i=0; i<data.cash.length; i++){
                if (!check.isFloat(data.cash[i].skje)){
                    throw new Meteor.Error(403, "收款金额必须是数字");
                };
                if (check.emptyString(data.cash[i].skrq)){
                    throw new Meteor.Error(403, "收款日期不允许为空");
                };
            };
        };
        if (data.dealerPay){
            for(var i=0; i<data.dealerPay.length; i++){
                if (!check.isFloat(data.dealerPay[i].zfje)){
                    throw new Meteor.Error(403, "支付金额必须是数字");
                };
                if (check.emptyString(data.dealerPay[i].zfrq)){
                    throw new Meteor.Error(403, "支付日期不允许为空");
                };
            };
        };

        data.savetime = new Date();
        return IndentCollection.update({"_id": id}, data);
    },
	'deleteIndent': function(data){
		if (check.emptyString(data.id)) {
			throw new Meteor.Error(403, "传入的id不允许为空");
		};

        let getData = IndentCollection.aggregate([
            {$match:{"_id": data.id}},
            {$unwind:"$device"},
            {$unwind:"$device.shipment"}
        ]);
        //console.log('%j', getData);
        if (getData.length > 0){
            throw new Meteor.Error(403, "订单已经发货，不允许删除");
        }

		getData = IndentCollection.findOne({"_id": data.id});
		if (getData){
            if (getData.skzje > 0){
                throw new Meteor.Error(403, "订单已经收款，不允许删除");
            };

            if (getData.quota){
                if (getData.quota.length > 0){
                    throw new Meteor.Error(403, "订单已经录入费用表限额信息，不允许删除");
                }                
            };
            if (getData.officePay){
                if (getData.officePay.length > 0){
                    throw new Meteor.Error(403, "订单已经录入费用表支付信息，不允许删除");
                }                
            };
            if (getData.cash){
                if (getData.cash.length > 0){
                    throw new Meteor.Error(403, "订单已经录入利润表收款信息，不允许删除");
                }                
            };
            if (getData.dealerPay){
                if (getData.dealerPay.length > 0){
                    throw new Meteor.Error(403, "订单已经录入利润表支付信息，不允许删除");
                }                
            };
        };

		return IndentCollection.remove({"_id": data.id});
	},
    'deleteUser': function(data){
        if (check.emptyString(data.id)) {
            throw new Meteor.Error(403, "传入的用户id不允许为空");
        };
        if (check.emptyString(data.name)) {
            throw new Meteor.Error(403, "传入的用户名称不允许为空");
        };
        if (IndentCollection.find({ "username":data.name }).count() > 0){
            throw new Meteor.Error(403, "该用户已经录入订单，不允许删除");
        };

        UserRoleCollection.remove({"_id": data.id}); //先删除用户的权限
        return Meteor.users.remove({"_id": data.id});
    },
    'resetPass': function(userId, newPassword){
        if (check.emptyString(userId)) {
            throw new Meteor.Error(403, "传入的用户id不允许为空");
        };
        if (check.emptyString(newPassword)) {
            throw new Meteor.Error(403, "传入的用户密码不允许为空");
        };

        Accounts.setPassword(userId, newPassword);
    },
    'initUserRole': function(data){
        if (check.emptyString(data.userid)) {
            throw new Meteor.Error(403, "传入的用户id不允许为空");
        };
        UserRoleCollection.remove({"_id": data.userid});

        var roles = [];
        FunctionCollection.find({}, {sort:{gndl:1,gnmc:1}}).forEach((data) => {
            var role = {};
            for(var i in data ) {
                role[i] = data[i];
            };
            //console.log('%j', role);
            roles.push(role);
        });

        var modifier = {$set: {}};
        modifier['$set']['username'] = data.username;
        modifier['$set']['roles'] = roles;
        //console.log('%j', modifier);

        return UserRoleCollection.upsert({"_id": data.userid}, modifier);
    },
    'upsertUserRole': function(id, modifier){
        return UserRoleCollection.upsert({"_id": id}, modifier);
    },
    'upsertItem': function(data){
        if (check.emptyString(data.name)) {
            throw new Meteor.Error(403, "传入的项目分类不允许为空");
        };
        if (ItemCollection.find({ "name":data.name }).count() > 0){
            throw new Meteor.Error(403, "项目分类重复");
        };

        var modifier = {$set: {}};
        modifier['$set']['name'] = data.name;
        return ItemCollection.upsert({"_id": data.id}, modifier);
    },
    'deleteItem': function(id){
        if (check.emptyString(id)) {
            throw new Meteor.Error(403, "传入的ID不允许为空");
        };

        return ItemCollection.remove({"_id": id});
    },
    'upsertIndustry': function(data){
        if (check.emptyString(data.name)) {
            throw new Meteor.Error(403, "传入的所属行业不允许为空");
        };
        if (IndustryCollection.find({ "name":data.name }).count() > 0){
            throw new Meteor.Error(403, "所属行业重复");
        };

        var modifier = {$set: {}};
        modifier['$set']['name'] = data.name;
        return IndustryCollection.upsert({"_id": data.id}, modifier);
    },
    'deleteIndustry': function(id){
        if (check.emptyString(id)) {
            throw new Meteor.Error(403, "传入的ID不允许为空");
        };

        return IndustryCollection.remove({"_id": id});
    },
    'upsertProduct': function(data){
        if (check.emptyString(data.type)) {
            throw new Meteor.Error(403, "传入的大类不允许为空");
        };
        if (check.emptyString(data.product)) {
            throw new Meteor.Error(403, "传入的产品不允许为空");
        };
        if (ProductCollection.find({ "product":data.product }).count() > 0){
            throw new Meteor.Error(403, "产品重复");
        };

        var modifier = {$set: {}};
        for(var i in data ) {
            if (i !== 'id'){
                modifier['$set'][i] = data[i];
            };
        };
        return ProductCollection.upsert({"_id": data.id}, modifier);
    },
    'deleteProduct': function(id){
        if (check.emptyString(id)) {
            throw new Meteor.Error(403, "传入的ID不允许为空");
        };

        return ProductCollection.remove({"_id": id});
    },
    'upsertOffice': function(data){
        if (check.emptyString(data.area)) {
            throw new Meteor.Error(403, "传入的区域不允许为空");
        };
        if (check.emptyString(data.office)) {
            throw new Meteor.Error(403, "传入的办事处不允许为空");
        };
        if (OfficeCollection.find({ "office":data.office }).count() > 0){
            throw new Meteor.Error(403, "办事处重复");
        };

        var modifier = {$set: {}};
        for(var i in data ) {
            if (i !== 'id'){
                modifier['$set'][i] = data[i];
            };
        };
        return OfficeCollection.upsert({"_id": data.id}, modifier);
    },
    'deleteOffice': function(id){
        if (check.emptyString(id)) {
            throw new Meteor.Error(403, "传入的ID不允许为空");
        };

        return OfficeCollection.remove({"_id": id});
    },
    'upsertWorker': function(data){
        if (check.emptyString(data.ygbm)) {
            throw new Meteor.Error(403, "传入的部门不允许为空");
        };
        if (check.emptyString(data.ygxm)) {
            throw new Meteor.Error(403, "传入的员工姓名不允许为空");
        };
        if (check.emptyString(data.ygbh)) {
            throw new Meteor.Error(403, "传入的员工编号不允许为空");
        };

        var modifier = {$set: {}};
        for(var i in data ) {
            if (i !== 'id'){
                modifier['$set'][i] = data[i];
            };
        };
        return WorkerCollection.upsert({"_id": data.id}, modifier);
    },
    'deleteWorker': function(id){
        if (check.emptyString(id)) {
            throw new Meteor.Error(403, "传入的ID不允许为空");
        };

        return WorkerCollection.remove({"_id": id});
    },
    'upsertFunction': function(data){
        if (check.emptyString(data.gndl)) {
            throw new Meteor.Error(403, "传入的功能大类不允许为空");
        };
        if (check.emptyString(data.gnmc)) {
            throw new Meteor.Error(403, "传入的功能名称不允许为空");
        };
        if (check.emptyString(data.gnnm)) {
            throw new Meteor.Error(403, "传入的功能内码不允许为空");
        };

        var modifier = {$set: {}};
        for(var i in data ) {
            if (i !== 'id'){
                modifier['$set'][i] = data[i];
            };
        };
        return FunctionCollection.upsert({"_id": data.id}, modifier);
    },
    'deleteFunction': function(id){
        if (check.emptyString(id)) {
            throw new Meteor.Error(403, "传入的ID不允许为空");
        };

        return FunctionCollection.remove({"_id": id});
    },
    'upsertSystemInfo': function(id, info){
        if (check.emptyString(info)) {
            throw new Meteor.Error(403, "传入的系统信息不允许为空");
        };

        var modifier = {$set: {info: info}};
        return SystemInfoCollection.upsert({"_id": id}, modifier);
    },
    'deleteSystemInfo': function(id){
        if (check.emptyString(id)) {
            throw new Meteor.Error(403, "传入的ID不允许为空");
        };

        return SystemInfoCollection.remove({"_id": id});
    },
    'upsertCostType': function(data){
        if (check.emptyString(data.name)) {
            throw new Meteor.Error(403, "传入的费用类别不允许为空");
        };
        if (CostTypeCollection.find({ "name":data.name }).count() > 0){
            throw new Meteor.Error(403, "费用类别重复");
        };

        var modifier = {$set: {}};
        modifier['$set']['name'] = data.name;
        return CostTypeCollection.upsert({"_id": data.id}, modifier);
    },
    'deleteCostType': function(id){
        if (check.emptyString(id)) {
            throw new Meteor.Error(403, "传入的ID不允许为空");
        };

        return CostTypeCollection.remove({"_id": id});
    },
    'upsertDeduct': function(data){
        if (check.emptyString(data.hkhsbl)) {
            throw new Meteor.Error(403, "传入的货款回收比例不允许为空");
        };
        if (!check.isFloat(data.tcffbl)) {
            throw new Meteor.Error(403, "传入的提成发放比例必须是数字");
        };

        var modifier = {$set: {}};
        for(var i in data ) {
            if (i !== 'id'){
                modifier['$set'][i] = data[i];
            };
        };
        return DeductCollection.upsert({"_id": data.id}, modifier);
    },
    'deleteDeduct': function(id){
        if (check.emptyString(id)) {
            throw new Meteor.Error(403, "传入的ID不允许为空");
        };

        return DeductCollection.remove({"_id": id});
    },
});