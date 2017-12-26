LocalIndent = new Mongo.Collection(null); //本地临时数据集

Session.setDefault('selectedIndentId', '');
Session.setDefault('payIndentBh', '');
Session.setDefault('payIndentId', '');
Session.setDefault('shipmentBh', '');

Meteor.startup(() => {
    if (Meteor.isCordova){
        RootUrl = __meteor_runtime_config__.ROOT_URL;
    } else RootUrl = '/';

});