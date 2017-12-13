Tracker.autorun(function(){
    Meteor.subscribe('userRole', {userid: Meteor.userId()});
    Meteor.subscribe('systemInfo');
});
