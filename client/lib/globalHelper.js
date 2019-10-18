import {checkPower} from '../lib/router';

Template.registerHelper("goHome", function(){
    Router.go('/');
});

Template.registerHelper("isActive", function(routeName) {
	if (Router.current().route.getName() === routeName) {
		return 'active';
	}
});

Template.registerHelper("isChecked", function(dataVal, value) {
	return (dataVal == value);
});

Template.registerHelper("isSelected", function(dataVal, value) {
    return (dataVal === value) ? 'selected' : '';
});

Template.registerHelper("userObject", function() {
	return {
		id: Meteor.user()._id,
		username: Meteor.user().username,
	}
});

Template.registerHelper("powerDisable", function(powerName){
    return checkPower(powerName) ? '' : 'disabled';
});

Template.registerHelper("checkDisable", function(isCheck){
    if (Meteor.user().username === 'admin'){
        return '';
    } else {
        return isCheck ? 'disabled' : '';
    };
});

//该函数的目的主要是为网格增加顺序号
Template.registerHelper('withIndex', function (list) {
    var withIndex = _.map(list, function (v, i) {
        if (v === null) return;
        v.index = i;
        v.bh = i + 1;
        return v;
    });
    return withIndex;
});
