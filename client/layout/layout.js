Template.layout.onRendered(function(){
    //$.backstretch("/img/1.jpg");
});

Template.layout.helpers({
    systemInfo: function(){
        return SystemInfoCollection.findOne();
    },
});