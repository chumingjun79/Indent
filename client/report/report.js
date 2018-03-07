Template.report.onRendered(function(){
    let date = new Date();
    $('#kjnd').val(date.getFullYear());
    $('#kjyf').val(date.getMonth()+1);
});

Template.report.events({
    'click button#btn_refresh': function(evt, tpl){
        let option = {};
        option.kjnd = $('#kjnd').val();
        option.kjyf = $('#kjyf').val();

        $('#btn_refresh').button('loading');
        let downFile = this.filename + '_'+ Meteor.user().username + '.xlsx';
        HTTP.get(RootUrl+
            'report/excel?filename='+ this.filename + '&downfile='+ downFile,
            {params: option}, function(err, result){
                $('#btn_refresh').button('reset');
                $('#btn_refresh').dequeue();
                if (err) {
                    Bert.alert(err, 'danger');
                } else {
                    downloadByIframe(RootUrl+
                        'down/excel?downfile='+ downFile);
                };
            });
    },
});
