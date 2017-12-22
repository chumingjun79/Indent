Template.report.helpers({
    fileExists: function(filename){
        return true;
    },
});

Template.report.events({
    'click button#btn_refresh': function(evt, tpl){
        $('#btn_refresh').button('loading');
        HTTP.get(__meteor_runtime_config__.ROOT_URL+
            'report/excel?filename='+ this.filename, {}, function(err, result){
            $('#btn_refresh').button('reset');
            $('#btn_refresh').dequeue();
            if (err) {
                Bert.alert(err, 'danger');
            };
        });
    },
    'click button#btn_down': function(evt, tpl){
        downloadByIframe(__meteor_runtime_config__.ROOT_URL+
            'down/excel?downfile='+ this.filename +'.xlsx');
    },
});