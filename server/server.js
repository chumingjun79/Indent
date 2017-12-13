Meteor.startup(function(){
    if (ItemCollection.find().count() === 0){
        ItemCollection.insert({name: '一般空调'});
        ItemCollection.insert({name: '工业冷冻'});
        ItemCollection.insert({name: '数据中心'});
        ItemCollection.insert({name: '核电'});
        ItemCollection.insert({name: '集采'});
        ItemCollection.insert({name: '供热板块'});
        ItemCollection.insert({name: '节能服务'});
        ItemCollection.insert({name: '多联机'});
    };
    if (OfficeCollection.find().count() === 0){
        OfficeCollection.insert({area: '工业项目组', office: '工业项目组'});
        OfficeCollection.insert({area: '新产品推进室', office: '新产品推进室'});
        OfficeCollection.insert({area: '华北区', office: '石家庄'});
        OfficeCollection.insert({area: '华北区', office: '太原'});
        OfficeCollection.insert({area: '华北区', office: '天津'});
        OfficeCollection.insert({area: '华北区', office: '呼和浩特'});
        OfficeCollection.insert({area: '上海区', office: '上海'});
        OfficeCollection.insert({area: '上海区', office: '杭州'});
        OfficeCollection.insert({area: '上海区', office: '宁波'});
        OfficeCollection.insert({area: '上海区', office: '温州'});
        OfficeCollection.insert({area: '东北区', office: '沈阳'});
        OfficeCollection.insert({area: '东北区', office: '大连'});
        OfficeCollection.insert({area: '东北区', office: '哈尔滨'});
        OfficeCollection.insert({area: '山东区', office: '济南'});
        OfficeCollection.insert({area: '山东区', office: '烟台'});
        OfficeCollection.insert({area: '山东区', office: '青岛'});
        OfficeCollection.insert({area: '山东区', office: '潍坊'});
        OfficeCollection.insert({area: '西北区', office: '西安'});
        OfficeCollection.insert({area: '中区', office: '郑州'});
        OfficeCollection.insert({area: '中区', office: '武汉'});
        OfficeCollection.insert({area: '东区', office: '南京'});
        OfficeCollection.insert({area: '东区', office: '徐州'});
        OfficeCollection.insert({area: '东区', office: '苏州'});
        OfficeCollection.insert({area: '东区', office: '合肥'});
        OfficeCollection.insert({area: '东区', office: '南昌'});
        OfficeCollection.insert({area: '东区', office: '盐城'});
        OfficeCollection.insert({area: '南区', office: '广州'});
        OfficeCollection.insert({area: '南区', office: '深圳'});
        OfficeCollection.insert({area: '南区', office: '长沙'});
        OfficeCollection.insert({area: '南区', office: '厦门'});
        OfficeCollection.insert({area: '南区', office: '福州'});
        OfficeCollection.insert({area: '南区', office: '南宁'});
        OfficeCollection.insert({area: '南区', office: '贵阳'});
        OfficeCollection.insert({area: '西区', office: '重庆'});
        OfficeCollection.insert({area: '西区', office: '成都'});
    };
    if (ProductCollection.find().count() === 0){
        ProductCollection.insert({type: '离心机', product: 'DCLC'});
        ProductCollection.insert({type: '螺杆机', product: 'WCFX'});
        ProductCollection.insert({type: '螺杆机', product: 'A-C'});
        ProductCollection.insert({type: '螺杆机', product: 'WCOX'});
        ProductCollection.insert({type: '末端', product: 'DMA'});
        ProductCollection.insert({type: '末端', product: 'KFP'});
        ProductCollection.insert({type: '末端', product: 'FCU'});
        ProductCollection.insert({type: '末端', product: 'DHER'});
        ProductCollection.insert({type: '轻商产品', product: 'VRV'});
        ProductCollection.insert({type: '轻商产品', product: 'Modular'});
        ProductCollection.insert({type: '轻商产品', product: 'BWHP'});
        ProductCollection.insert({type: '轻商产品', product: 'Unitary'});
        ProductCollection.insert({type: '冷却塔', product: 'SQH'});
        ProductCollection.insert({type: '其它', product: '外购'});
    };
    if (PayTypeCollection.find().count() === 0){
        PayTypeCollection.insert({name: '货到付款'});
        PayTypeCollection.insert({name: '调试付款'});
        PayTypeCollection.insert({name: '质保付款'});
    };

    if (Meteor.users.find().count() === 0){
        var username = 'admin';
        var password = 'admin';
        var options = {
            username: username,
            password: password,
        };
        //调用accounts-password包中的createUser方法来创建用户
        var userId = Accounts.createUser(options);
        if (userId){
            //console.log(userId);
            var obj = {
                userid: userId,
                username: 'admin',
                listOther: true,
                editIndent: true,
                listIndent: true,
                userManage: true
            };
            Meteor.call('upsertUserRole', obj); //创建用户权限
        };
    };
});