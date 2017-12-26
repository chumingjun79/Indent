Template.devicelist.onRendered(function(){
	$('#tb_list').bootstrapTable({
        sidePagination: "client", //分页方式：client客户端分页，server服务端分页
        pageSize: 10,
        pageList: [5, 10, 20],
        pagination: true, //是否显示分页
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
			{field: 'sbsl', title: '设备数量', halign: 'center'},
			{field: 'sbje', title: '设备金额', halign: 'center'},
			{field: 'fhsl', title: '发货数量', halign: 'center'},
			{field: 'fhje', title: '发货金额', halign: 'center'},
		],
        onLoadSuccess: function(data){
            var sbsl = 0, sbje = 0; fhsl = 0, fhje = 0;
            for (var i in data) {
                sbsl += toNumber(data[i].sbsl);
                sbje += toNumber(data[i].sbje);
                fhsl += toNumber(data[i].fhsl);
                fhje += toNumber(data[i].fhje);
            };
            $('#sbslhj')[0].innerHTML = '设备数量合计：'+ toDecimal(sbsl, 2);
            $('#sbjehj')[0].innerHTML = '设备金额合计：'+ toDecimal(sbje, 2);
            $('#fhslhj')[0].innerHTML = '发货数量合计：'+ toDecimal(fhsl, 2);
            $('#fhjehj')[0].innerHTML = '发货金额合计：'+ toDecimal(fhje, 2);
		},
	});

    var date = new Date();
    $('#kjnd').val(date.getFullYear());
    $('#kjyf').val(date.getMonth()+1);
});

Template.devicelist.events({
	'click button#btn_refresh': function(evt, tpl){
        tpl.$('#tb_list').bootstrapTable('refresh', {url:RootUrl+
            'devicelist/get'});
	},
    'click button#btn_toexcel': function(evt, tpl){
        chumjConfirm('确认要导出查询数据吗？', function(result){
            if (result){
                var data = tpl.$('#tb_list').bootstrapTable('getData');
                var postData = {data: data};
                HTTP.post(RootUrl+
                    'export/excel?filename=devicelist_temp.xlsx&downfile=devicelist.xlsx',
                    postData, function(err, result){
                        if (err) {
                            Bert.alert(err, 'danger');
                        } else {
                            downloadByIframe(RootUrl+
                                'down/excel?downfile=devicelist.xlsx');
                        };
                    });
            };
        });

    },
});