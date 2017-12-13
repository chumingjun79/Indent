Template.devicedetail.onRendered(function(){
	$('#tb_list').bootstrapTable({
        sidePagination: "client", //分页方式：client客户端分页，server服务端分页
        pageSize: 10,
        pageList: [5, 10, 20],
        pagination: true, //是否显示分页
        fixedColumns: true, //是否冻结列
        fixedNumber: 4, //冻结列的数量
		queryParams:
			function (params) {
				temp = {
					ddbh: $("#ddbh").val(),
					xmmc: $("#xmmc").val(),
					kjnd: $("#kjnd").val(),
					kjyf: $("#kjyf").val(),
                    cpfl: $("#cpfl").val(),
                    bsc: $("#bsc").val(),
                    fzr: $("#fzr").val(),
				};
				return temp;
			},
		columns: [
            {field: 'kjnd', title: '年度', halign: 'center' },
            {field: 'kjyf', title: '月份', halign: 'center' },
			{field: 'ddbh', title: '订单编号', halign: 'center' },
			{field: 'xmmc', title: '项目名称', halign: 'center' },
			{field: 'cpfl', title: '产品分类', halign: 'center' },
			{field: 'sbxh', title: '设备型号', halign: 'center' },
			{field: 'bsc', title: '办事处', halign: 'center' },
			{field: 'fzr', title: '负责人', halign: 'center' },
            {field: 'ygbh', title: '员工编号', halign: 'center' },
            {field: 'sbxs', title: '设备系数', halign: 'center'},
			{field: 'sbsl', title: '设备数量', halign: 'center'},
			{field: 'sbje', title: '设备金额', halign: 'center'},
            {field: 'tszbjj', title: '调试质保加价', halign: 'center'},
            {field: 'htzje', title: '合同总金额', halign: 'center'},
            {field: 'tcxs', title: '提成（销售员）', halign: 'center'},
            {field: 'tcjs', title: '提成（技术支持）', halign: 'center'},
            {field: 'fysc', title: '费用（市场推广）', halign: 'center'},
            {field: 'fyqt', title: '费用（其他）', halign: 'center'},
            {field: 'fyyj', title: '样机费', halign: 'center'},
            {field: 'fykc', title: '考察礼品费', halign: 'center'},
		],
        onLoadSuccess: function(data){
			//console.log(data);
            var sl=0, je=0, htzje=0, zbjj=0, tcxs=0, tcjs=0, fysc=0, fyqt=0, fyyj=0, fykc=0;
            for (var i in data) {
                sl += parseFloat(data[i].sbsl);
                je += parseFloat(data[i].sbje);
                htzje += parseFloat(data[i].htzje);
                zbjj += parseFloat(data[i].tszbjj);
                tcxs += parseFloat(data[i].tcxs);
                tcjs += parseFloat(data[i].tcjs);
                fysc += parseFloat(data[i].fysc);
                fyqt += parseFloat(data[i].fyqt);
                fyyj += parseFloat(data[i].fyyj);
                fykc += parseFloat(data[i].fykc);
            };
            $('#slhj')[0].innerHTML = '设备数量合计：'+ toDecimal(sl, 2);
            $('#jehj')[0].innerHTML = '设备金额合计：'+ toDecimal(je, 2);
            $('#zbjj')[0].innerHTML = '调试质保加价合计：'+ toDecimal(zbjj, 2);
            $('#htzje')[0].innerHTML = '合同总金额合计：'+ toDecimal(htzje, 2);
            $('#tcxs')[0].innerHTML = '提成（销售员）合计：'+ toDecimal(tcxs, 2);
            $('#tcjs')[0].innerHTML = '提成（技术支持）合计：'+ toDecimal(tcjs, 2);
            $('#fysc')[0].innerHTML = '费用（市场推广）合计：'+ toDecimal(fysc, 2);
            $('#fyqt')[0].innerHTML = '费用（其他）合计：'+ toDecimal(fyqt, 2);
            $('#fyyj')[0].innerHTML = '样机费合计：'+ toDecimal(fyyj, 2);
            $('#fykc')[0].innerHTML = '考察礼品费合计：'+ toDecimal(fykc, 2);
		},
	});

	var date = new Date();
	$('#kjnd').val(date.getFullYear());
    $('#kjyf').val(date.getMonth()+1);
});

Template.devicedetail.events({
	'click button#btn_refresh': function(evt, tpl){
		tpl.$('#tb_list').bootstrapTable('refresh', {url: '/devicedetail/get'});
	},
    'click button#btn_toexcel': function(evt, tpl){
	    chumjConfirm('确认要导出查询数据吗？', function(result){
	        if (result){
                var data = tpl.$('#tb_list').bootstrapTable('getData');
                var postData = {data: data};
                HTTP.post('/paywarn/excel?filename=devicedetail_temp.xlsx&downfile=devicedetail.xlsx',
                    postData, function(err, result){
                        if (err) {
                            Bert.alert(err, 'danger');
                        } else {
                            downloadByIframe('/down/excel?downfile=devicedetail.xlsx');
                        };
                    });
            };
        });

    },
});