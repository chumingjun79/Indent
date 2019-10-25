import * as gfunc from '../lib/globalFunction';

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
					xmmc: $("#xmmc").val(),
                    khmc: $("#khmc").val(),
				};
				return temp;
			},
		columns: [
			{radio: true },
			{field: 'ddbh', title: '订单编号', halign: 'center' },
			{field: 'kjnd', title: '订单年度', halign: 'center' },
			{field: 'kjyf', title: '订单月份', halign: 'center' },
			{field: 'xmmc', title: '项目名称', halign: 'center' },
            {field: 'khmc', title: '客户名称', halign: 'center' },
			{field: 'htzje', title: '合同总金额', halign: 'center' },
			{field: 'username', title: '录入人员', halign: 'center' },
		]
	});
});

function getSelection(tpl){
    let selectedData = tpl.$('#tb_indentlist').bootstrapTable('getSelections');
    if (selectedData.length === 0){
        Bert.alert('请先选中想要操作的订单', 'info');
        return '';
    };
    return selectedData[0]._id;
}

function toPayment(tpl, filename){
    let selected = getSelection(tpl);
    if (selected === '') return;

    let option = {};
    option.kjnd = selected;
    option.kjyf = '';

    let downFile = filename+'_'+ Meteor.user().username + '.xlsx';
    HTTP.get(RootUrl+
        'report/excel?filename='+filename+'&downfile='+ downFile,
        {params: option}, function(err, result){
            if (err) {
                Bert.alert(err, 'danger');
            } else {
                gfunc.downloadByIframe(RootUrl+
                    'down/excel?downfile='+ downFile);
            };
        });
}

Template.indentlist.events({
	'click button#btn_refresh': function(evt, tpl){
		tpl.$('#tb_indentlist').bootstrapTable('refresh', {url: RootUrl+
			'indentlist/get'});
	},
	'click button#btn_info': function(evt, tpl){
		let selected = getSelection(tpl);
		if (selected === '') return;
		Session.set('selectedIndentId', selected);
		Router.go('/indentinfo');
	},
	'click button#btn_paymentStatus': function(evt, tpl){
        toPayment(tpl, 'paymentStatus');
	},
    'click button#btn_paymentDetail': function(evt, tpl){
        toPayment(tpl, 'paymentDetail');
    },
});