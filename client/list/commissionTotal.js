Template.commissiontotal.onRendered(function(){
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
				};
				return temp;
			},
		columns: [
            {radio: true },
			{field: 'ddbh', title: '订单编号', halign: 'center' },
			{field: 'xmmc', title: '项目名称', halign: 'center' },
            {field: 'xstc', title: '提成总额', halign: 'center',
                formatter: function (value, row, index) {
                    return toDecimal(value, 2);
                }},
            {field: 'ffje', title: '支付总额', halign: 'center',
                formatter: function (value, row, index) {
                    return toDecimal(value, 2);
                }},
			{field: 'wfye', title: '未付余额', halign: 'center',
				formatter : function(value, row, index){
					return toDecimal(row.xstc - row.ffje, 2);
				} },
		],
        onLoadSuccess: function(data){
			//console.log(data);
            let tchj=0, ffhj=0;
            for (var i in data) {
                tchj += parseFloat(data[i].xstc);
                ffhj += parseFloat(data[i].ffje);
            };
            $('#tcxshj')[0].innerHTML = '提成总额合计：'+ toDecimal(tchj, 2);
            $('#ffjehj')[0].innerHTML = '支付总额合计：'+ toDecimal(ffhj, 2);
            $('#wfjehj')[0].innerHTML = '未付余额合计：'+ toDecimal(tchj-ffhj, 2);
		},
	});
});

Template.commissiontotal.events({
	'click button#btn_refresh': function(evt, tpl){
		tpl.$('#tb_list').bootstrapTable('refresh', {url: RootUrl+
            'commissiontotal/get'});
	},
    'click button#btn_toexcel': function(evt, tpl){
	    chumjConfirm('确认要导出查询数据吗？', function(result){
	        if (result){
                let data = tpl.$('#tb_list').bootstrapTable('getData');
                let postData = {data: data};
                let downFile = 'commissiontotal_'+ Meteor.user().username + '.xlsx';
                HTTP.post(RootUrl+
                    'export/excel?filename=commissiontotal_temp.xlsx&downfile='+ downFile,
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
    'click button#btn_info': function(evt, tpl){
        let selectedData = tpl.$('#tb_list').bootstrapTable('getSelections');
        if (selectedData.length === 0){
            Bert.alert('请先选中想要操作的订单', 'info');
            return '';
        };
        Session.set('commissionIndentBh', selectedData[0].ddbh);
        Router.go('/commissiondetail');
    },
});