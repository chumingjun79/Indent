Template.shipmentlist.onRendered(function(){
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
					fhnd: $("#fhnd").val(),
					fhyf: $("#fhyf").val(),
                    cpfl: $("#cpfl").val(),
                    bsc: $("#bsc").val(),
                    fzr: $("#fzr").val(),
                    khmc: $("#khmc").val(),
				};
				return temp;
			},
		columns: [
			{field: 'fhnd', title: '发货年度', halign: 'center' },
			{field: 'fhyf', title: '发货月份', halign: 'center' },
            {field: 'ddbh', title: '订单编号', halign: 'center' },
            {field: 'xmmc', title: '项目名称', halign: 'center' },
            {field: 'xmfl', title: '项目分类', halign: 'center' },
			{field: 'cpfl', title: '产品分类', halign: 'center' },
			{field: 'sbxh', title: '设备型号', halign: 'center' },
			{field: 'bsc', title: '办事处', halign: 'center' },
			{field: 'fzr', title: '负责人', halign: 'center' },
            {field: 'ygbh', title: '员工编号', halign: 'center' },
			{field: 'fhsl', title: '发货数量', halign: 'center'},
			{field: 'fhje', title: '发货金额', halign: 'center'},
            {field: 'khmc', title: '客户名称', halign: 'center'},
            {field: 'dxm', title: '大项目个人业绩50%', halign: 'center' },
		],
        onLoadSuccess: function(data){
			//console.log(data);
            var sl = 0, je = 0;
            for (var i in data) {
                sl += parseFloat(data[i].fhsl);
                je += parseFloat(data[i].fhje);
            };
            $('#slhj')[0].innerHTML = '发货数量合计：'+ toDecimal(sl, 2);
            $('#jehj')[0].innerHTML = '发货金额合计：'+ toDecimal(je, 2);
		},
	});

	var date = new Date();
	$('#fhnd').val(date.getFullYear());
    $('#fhyf').val(date.getMonth()+1);
});

Template.shipmentlist.events({
	'click button#btn_refresh': function(evt, tpl){
		tpl.$('#tb_list').bootstrapTable('refresh', {url: RootUrl+
			'shipmentlist/get'});
	},
    'click button#btn_toexcel': function(evt, tpl){
        chumjConfirm('确认要导出查询数据吗？', function(result){
            if (result){
                let data = tpl.$('#tb_list').bootstrapTable('getData');
                let postData = {data: data};
                let downFile = 'shipmentlist_'+ Meteor.user().username + '.xlsx';
                HTTP.post(RootUrl+
                    'export/excel?filename=shipmentlist_temp.xlsx&downfile='+ downFile,
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