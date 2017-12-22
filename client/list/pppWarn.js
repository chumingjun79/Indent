Template.pppwarn.onRendered(function(){
	$('#tb_list').bootstrapTable({
        sidePagination: "client", //分页方式：client客户端分页，server服务端分页
        pageSize: 10,
        pageList: [5, 10, 20],
        pagination: true, //是否显示分页
		queryParams:
			function (params) {
				temp = {
					ddbh: $("#ddbh").val(),
					xmmc: $("#xmmc").val()
				};
				return temp;
			},
		columns: [
			{radio: true },
			{field: 'ddbh', title: '订单编号', halign: 'center' },
			{field: 'xmmc', title: '项目名称', halign: 'center' },
			{field: 'ppsbxh', title: '设备型号', halign: 'center' },
			{field: 'ppdqr', title: '到期日', halign: 'center' },
			{field: 'ppmmjb', title: '密码级别', halign: 'center' },
			{field: 'ppbz', title: '备注', halign: 'center' },
		]
	});
});

Template.pppwarn.events({
	'click button#btn_refresh': function(evt, tpl){
		tpl.$('#tb_list').bootstrapTable('refresh', {url: __meteor_runtime_config__.ROOT_URL+
			'pppwarn/get'});
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