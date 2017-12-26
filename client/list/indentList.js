Template.indentlist.onRendered(function(){
	$('#tb_indentlist').bootstrapTable({
        sidePagination: "server", //分页方式：client客户端分页，server服务端分页
        pageSize: 10,
        pageList: [5, 10, 20],
		pagination: true, //是否显示分页
		queryParams:
			function (params) {
				temp = {
					limit: params.limit,
					offset: params.offset,
					ddbh: $("#ddbh").val(),
					xmmc: $("#xmmc").val()
				};
				return temp;
			},
		columns: [
			{radio: true },
			{field: 'ddbh', title: '订单编号', halign: 'center' },
			{field: 'kjnd', title: '订单年度', halign: 'center' },
			{field: 'kjyf', title: '订单月份', halign: 'center' },
			{field: 'xmmc', title: '项目名称', halign: 'center' },
			{field: 'htzje', title: '合同总金额', halign: 'center' },
			{field: 'username', title: '录入人员', halign: 'center' },
		]
	});
});

Template.indentlist.events({
	'click button#btn_refresh': function(evt, tpl){
		tpl.$('#tb_indentlist').bootstrapTable('refresh', {url: RootUrl+
			'indentlist/get'});
	},
	'click button#btn_info': function(evt, tpl){
		var selectedData = tpl.$('#tb_indentlist').bootstrapTable('getSelections');
		if (selectedData.length === 0){
			Bert.alert('请先选择要查看详细信息的订单', 'info');
			return;
		};
		Session.set('selectedIndentId', selectedData[0]._id);
		Router.go('/indentinfo');
	},
});