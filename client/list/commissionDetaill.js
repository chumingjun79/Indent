Template.commissiondetail.onRendered(function(){
	$('#tb_list').bootstrapTable({
        sidePagination: "client", //分页方式：client客户端分页，server服务端分页
        pageSize: 20,
        pageList: [10, 20, 'All'],
        pagination: true, //是否显示分页
		queryParams:
			function (params) {
				temp = {
					ddbh: $("#ddbh").val(),
					xmmc: $("#xmmc").val(),
					kjnd: $("#kjnd").val(),
					kjyf: $("#kjyf").val(),
                    ffsjb: $("#ffsjb").val(),
                    ffsje: $("#ffsje").val(),
                    ffry: $("#ffry").val(),
				};
				return temp;
			},
		columns: [
			{field: 'ddbh', title: '订单编号', halign: 'center' },
			{field: 'xmmc', title: '项目名称', halign: 'center' },
			{field: 'bsc', title: '办事处', halign: 'center' },
			{field: 'fzr', title: '负责人', halign: 'center' },
            {field: 'xstc', title: '提成金额', halign: 'center' },
            {field: 'ffsj', title: '发放时间', halign: 'center' },
            {field: 'skbl', title: '收款比例', halign: 'center' },
            {field: 'ffbsc', title: '发放部门', halign: 'center'},
			{field: 'ffry', title: '受益人', halign: 'center' },
            {field: 'ffje', title: '发放金额', halign: 'center' },
		],
        onLoadSuccess: function(data){
			//console.log(data);
            let ffhj=0;
            for (let i in data) {
                let ffje = data[i].ffje;
                if (ffje != null){
                    ffhj += parseFloat(ffje);
                }
            }
            $('#ffjehj')[0].innerHTML = '发放金额合计：'+ toDecimal(ffhj, 2);
		},
	});

	let ddbh = Session.get('commissionIndentBh');
	if (ddbh !== '') {
        $("#ddbh").val(ddbh);
        Session.set('commissionIndentBh', '');
        $('button#btn_refresh').click();
    }
});

Template.commissiondetail.events({
	'click button#btn_refresh': function(evt, tpl){
		tpl.$('#tb_list').bootstrapTable('refresh', {url: RootUrl+
            'commissiondetail/get'});
	},
    'click button#btn_toexcel': function(evt, tpl){
	    chumjConfirm('确认要导出查询数据吗？', function(result){
	        if (result){
                let data = tpl.$('#tb_list').bootstrapTable('getData');
                let postData = {data: data};
                let downFile = 'commissiondetail_'+ Meteor.user().username + '.xlsx';
                HTTP.post(RootUrl+
                    'export/excel?filename=commissiondetail_temp.xlsx&downfile='+ downFile,
                    postData, function(err, result){
                        if (err) {
                            Bert.alert(err, 'danger');
                        } else {
                            downloadByIframe(RootUrl+
                                'down/excel?downfile='+ downFile);
                        };
                    });
            };
        });

    },
});