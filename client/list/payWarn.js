Template.paywarn.onRendered(function(){
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
            {field: 'ddbh', title: '订单编号', halign: 'center', printIgnore: false },
            {field: 'xmmc', title: '项目名称', halign: 'center' },
            {field: 'skysje', title: '应收金额', halign: 'center' },
            {field: 'skdqr', title: '收款到期日', halign: 'center' },
            {field: 'sklx', title: '收款类型', halign: 'center' },
            {field: 'skbz', title: '备注', halign: 'center' },
        ]
	});
});

Template.paywarn.events({
	'click button#btn_refresh': function(evt, tpl){
		tpl.$('#tb_list').bootstrapTable('refresh', {url: RootUrl+
            'paywarn/get'});
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