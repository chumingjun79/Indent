Template.systeminfo.helpers({
	systeminfo: function(){
		return SystemInfoCollection.findOne({});
	},
});

Template.systeminfo.events({
    'click button#default': function(evt, tpl){
        evt.preventDefault();
        $('#info').val('注意：系统将在一分钟后进行维护，请抓紧时间保存数据！');
    },
    'click button#baocun': function(evt, tpl){
        evt.preventDefault();
    	var getData = SystemInfoCollection.findOne({});
    	var id = '';
		if (getData){
    		id = getData._id;
		};
    	var info = $('#info').val();

		Meteor.call('upsertSystemInfo', id, info, function (err, result) {
			if (err) {
				Bert.alert(err.message, 'danger');
			};
		});
    },
    'click button#shanchu': function(evt, tpl){
    	evt.preventDefault();
        var getData = SystemInfoCollection.findOne({});
        if (getData){
            var id = getData._id;
        } else {
        	Bert.alert('没有系统信息，无法删除', 'danger');
        	return;
        };

        Meteor.call('deleteSystemInfo', id, function (err, result) {
            if (err) {
                Bert.alert(err.message, 'danger');
            };
		});
    },
});

