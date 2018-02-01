import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
    // code to run on server at startup
    //用来解决跨域访问的问题
    WebApp.rawConnectHandlers.use(function(req, res, next) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, content-type");
        res.setHeader("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
        res.setHeader("Content-Type", "application/json;charset=utf-8");
        return next();
    });

});

//用来解决上传json数据过大超过node默认100kb限制的问题
Router.configureBodyParsers = function() {
    Router.onBeforeAction(
        Iron.Router.bodyParser.json({limit: '10mb'}),
        Iron.Router.bodyParser.urlencoded({
            extended: true,
            limit: '10mb'
        })
    );
};