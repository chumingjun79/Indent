import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
    // code to run on server at startup
    WebApp.rawConnectHandlers.use(function(req, res, next) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, content-type");
        res.setHeader("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
        res.setHeader("Content-Type", "application/json;charset=utf-8");
        return next();
    });

});
