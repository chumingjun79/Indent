//根据订单id返回一张订单
Meteor.publish('indentById', function(options){
	//console.log(options.id);
	return IndentCollection.find({"_id": options.id});
});

//根据订单编号返回一张订单
Meteor.publish('indentByBh', function(options){
    //console.log(options.id);
    return IndentCollection.find({"ddbh": options.id});
});

//根据订单编号返回若干张订单
Meteor.publish('indentFromBh', function(options){
    var ddbh = options.id;
    if (ddbh !== ""){
        return IndentCollection.find({ 'ddbh':{$regex: ddbh} });
    };
});

Meteor.publish('item', function(options){
    return ItemCollection.find({});
});

Meteor.publish('industry', function(options){
    return IndustryCollection.find({});
});

Meteor.publish('product', function(options){
    return ProductCollection.find({});
});

Meteor.publish('office', function(options){
    return OfficeCollection.find({});
});

Meteor.publish('paytype', function(options){
    return PayTypeCollection.find({});
});

Meteor.publish('worker', function(options){
    return WorkerCollection.find({});
});

Meteor.publish('function', function(options){
    return FunctionCollection.find({});
});

Meteor.publish('userRole', function(options){
    return UserRoleCollection.find({"_id": options.userid});
});

Meteor.publish('systemInfo', function(){
    return SystemInfoCollection.find({});
});

Meteor.publish('costtype', function(){
    return CostTypeCollection.find({});
});

Meteor.publish('deduct', function(){
    return DeductCollection.find({});
});