import * as func from '../../lib/func/function';
import * as gfunc from '../lib/globalFunction';

Template.paymentStatusPayList.onRendered(function(){
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
                    zfrqb: $("#zfrqb").val(),
                    zfrqe: $("#zfrqe").val(),
                    xszjbwsh: $("#xszjbwsh").get(0).checked,
				};
				return temp;
			},
		columns: [
			{field: 'ddbh', title: '订单编号', halign: 'center' },
            {field: 'xmmc', title: '项目名称', halign: 'center' },
            {field: 'khmc', title: '客户名称', halign: 'center' },
            {field: 'zfrq', title: '支付日期', halign: 'center' },
            {field: 'zfje', title: '支付金额', halign: 'center' },
            {field: 'zfbfb', title: '百分比', halign: 'center' },
            {field: 'zfbz', title: '备注', halign: 'center' },
            {field: 'zjbsh', title: '是否审核', halign: 'center'},
		],
        onLoadSuccess: function(data){
			//console.log(data);
            let ffhj=0, ffje=0;
            for (let i in data) {
                ffje = data[i].zfje;
                if (ffje != null){
                    ffhj += func.toDecimal(ffje, 2);
                }
            }
            $('#ffjehj')[0].innerHTML = '支付金额合计：'+ func.toDecimal(ffhj, 2);
		},
	});
});

Template.paymentStatusPayList.events({
	'click button#btn_refresh': function(evt, tpl){
		tpl.$('#tb_list').bootstrapTable('refresh', {url: RootUrl+
            'paymentStatusPayList/get'});
    },
    'mousedown .datepicker': function(){
        $('.datepicker').datepicker('destroy');
        gfunc.setDatePicker();
        $('.datepicker').datepicker('show');
    },    

});