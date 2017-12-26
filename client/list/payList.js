Template.paylist.onRendered(function(){
	$('#tb_list').bootstrapTable({
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
			{field: 'skzje', title: '收款总金额', halign: 'center' },
			{field: 'skbl', title: '收款比例%', halign: 'center',
				formatter : function(value, row, index){
					return toDecimal(row.skzje / row.htzje, 2)*100;
				} },
		]
	});
});

Template.paylist.events({
	'click button#btn_refresh': function(evt, tpl){
		tpl.$('#tb_list').bootstrapTable('refresh', {url: RootUrl+
			'paylist/get'});
	},
	'click button#btn_info': function(evt, tpl){
		var selectedData = tpl.$('#tb_list').bootstrapTable('getAllSelections');
		if (selectedData.length === 0){
			Bert.alert('请先选择要查看详细信息的订单', 'info');
			return;
		};

		var ddbh = selectedData[0].ddbh;
        Meteor.subscribe('indentByBh', {id: ddbh});
		Session.set('payIndentBh', ddbh);
		Router.go('/indentPay');
	},
});