import * as func from '../../lib/func/function';
import * as gfunc from '../lib/globalFunction';

Template.paymentStatusCashList.onRendered(function(){
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
					khmc: $("#khmc").val(),
                    skrqb: $("#skrqb").val(),
                    skrqe: $("#skrqe").val(),
				};
				return temp;
			},
		columns: [
			{field: 'ddbh', title: '订单编号', halign: 'center' },
            {field: 'xmmc', title: '项目名称', halign: 'center' },
            {field: 'khmc', title: '客户名称', halign: 'center' },
            {field: 'skrq', title: '收款日期', halign: 'center' },
            {field: 'skje', title: '收款金额', halign: 'center' },
            {field: 'skbfb', title: '百分比', halign: 'center' },
		],
        onLoadSuccess: function(data){
			//console.log(data);
            let ffhj=0, ffje=0;
            for (let i in data) {
                ffje = data[i].skje;
                if (ffje != null){
                    ffhj += func.toDecimal(ffje, 2);
                }
            }
            $('#ffjehj')[0].innerHTML = '收款金额合计：'+ func.toDecimal(ffhj, 2);
		},
	});
});

Template.paymentStatusCashList.events({
	'click button#btn_refresh': function(evt, tpl){
		tpl.$('#tb_list').bootstrapTable('refresh', {url: RootUrl+
            'paymentStatusCashList/get'});
    },
    'mousedown .datepicker': function(){
        $('.datepicker').datepicker('destroy');
        gfunc.setDatePicker();
        $('.datepicker').datepicker('show');
    },    

});