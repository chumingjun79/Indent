importIndent = function(workSheets){
    var dqBh = '', syBh = '';
    var indent = {
        username: 'daixiuqin',
        kjnd: '',
        kjyf: '',
        ddbh: '',
        xmmc: '',
        xmfl: '',
        lxr: '',
        lxdh: '',
        dxm: false,
        device: [],
        remark: '',

        fktk: '',
        fplx: 0,
        fpgsmc: '',
        fpsh: '',
        fpdwdz: '',
        fpdhhm: '',
        fpkhyh: '',
        fpyhzh: '',
        deposit: [],
        pay: [],
        ppp: [],

        sbzje: 0,
        htzje: 0,
        skzje: 0
    };
    var data, dds = 1;

    workSheets.forEach((item, index)=>{
        if (index > 0) //第一行是标题，所以跳过
        {
            dqBh = item[2]; //取得当前订单号
            if (dqBh !== syBh && syBh !== '') //说明遇到了新订单，需要保存前面的订单
            {
                insertIndent(data);
                dds = 1;
            };
            if (dds === 1) { //说明当前订单位于首行
                data = cloneObject(indent); //初始化新订单
                data['kjnd'] = trim(toString(item[0]));
                data['kjyf'] = toNumber(trim(toString(item[1])));
                data['ddbh'] = trim(toString(item[2]));
                data['xmmc'] = trim(toString(item[3]));
                data['htzje'] = toDecimal(item[8],2);
            };

            data['device'].push({cpfl:'', sbxh:'', bsc:'', fzr:'', ygbh:'', sbxs:0, sbsl:0, sbje:0,
                tcxs:0, tcjs:0, fysc:0, fyqt:0, fyyj:0, fykc:0, tszbjj:0, shipment:[]});
            data['device'][dds-1]['sbxh'] = trim(toString(item[4]));
            data['device'][dds-1]['cpfl'] = trim(toString(item[5]));
            data['device'][dds-1]['sbsl'] = toDecimal(item[6],1);
            data['device'][dds-1]['sbje'] = toDecimal(item[7],2);
            data['device'][dds-1]['tszbjj'] = toDecimal(item[9],2);
            data['device'][dds-1]['sbxs'] = toDecimal(item[10],4);
            data['device'][dds-1]['bsc'] = trim(toString(item[11]));
            data['device'][dds-1]['fzr'] = trim(toString(item[15]));
            data['device'][dds-1]['ygbh'] = trim(toString(item[16]));
            if (toNumber(item[14]) != 0) {
                data['device'][dds-1]['shipment'].push({fhnd:'2017', fhyf:0, fhsl:0, fhje:0});
                data['device'][dds-1]['shipment'][0]['fhsl'] = toDecimal(item[12],2);
                data['device'][dds-1]['shipment'][0]['fhje'] = toDecimal(item[14],2);
            };

            syBh = dqBh; //保存上一编号
            dds++;
        };
    });

    insertIndent(data);
};

insertIndent = function(data){
    try {
        IndentCollection.insert(data);
    } catch(err){
        console.log(err);
        return;
    };
};
/*
importIndent1 = function(workSheets){
    var xhl = '', xh = '';
    var dds = 1;
    var data = '';

    workSheets.forEach((item, index)=>{
        if (index > 0) //第一行是标题，所以跳过
        {
            //console.log('%s', item);
            xhl = item[15];
            if (xhl != '') {
                var i = xhl.indexOf('型号');
                if (i > 0) {
                    xh = xhl.substring(i);
                    data = data + xh + '\n';
                } else {
                    data = data + '\n';
                };
            } else data = data + '\n';

            dds++;
        };
    });

    var fs = require("fs");
    var path = require("path");
    var currFile = path.normalize(process.env.HOME+'/indent/excel/111.txt');
    fs.writeFileSync(currFile, data);
};
*/
Router.route('/importindent', {where: 'server'}).get(function(){
    var req = this.request, res = this.response;
    var fs = require("fs");
    var path = require("path");
    var currFile = path.normalize(process.env.HOME+'/indent/excel/importIndent.xlsx');
    var ejsExcel = require('ejsExcel');

    var exBuf = fs.readFileSync(currFile);
    ejsExcel.getExcelArr(exBuf).then(exlJson=>{

        importIndent(exlJson[0]);
        res.statusCode = 200;
        res.setHeader("Content-type","text/html");
        res.end("indent data import OK!");
    }).catch(error=>{
        console.log(error);
        res.statusCode = 500;
        res.setHeader("Content-type","text/html");
        res.end(error);
    });
});

importCost = function(workSheets){
    var tcxs, tcjs, fysc, fyyj, fykc, fyqt;
    var ddh, cpfl, bsc, sbzje;

    workSheets.forEach((item, index)=>{
        if (index > 0) //第一行是标题，所以跳过
        {
            ddh = trim(toString(item[0])); //取得当前订单号
            cpfl = trim(toString(item[2]));
            sbzje = toDecimal(item[3],2);
            tcxs = toDecimal(item[5],2);
            tcjs = toDecimal(item[6],2);
            fysc = toDecimal(item[7],2);
            fyqt = toDecimal(item[8],2);
            fyyj = toDecimal(item[9],2);
            fykc = toDecimal(item[10],2);
            bsc = trim(toString(item[11]));

            var flag = false;
            var data = IndentCollection.findOne({'ddbh': ddh});
            if (data){
                var modifier = {$set: {'sbzje': sbzje}};

                for(var i=0; i<data.device.length; i++){
                    if (data.device[i].bsc === bsc && data.device[i].cpfl === cpfl){
                        modifier['$set']['device.' + i + '.tcxs'] = tcxs;
                        modifier['$set']['device.' + i + '.tcjs'] = tcjs;
                        modifier['$set']['device.' + i + '.fysc'] = fysc;
                        modifier['$set']['device.' + i + '.fyqt'] = fyqt;
                        modifier['$set']['device.' + i + '.fyyj'] = fyyj;
                        modifier['$set']['device.' + i + '.fykc'] = fykc;

                        IndentCollection.update({'_id': data._id}, modifier);
                        i = data.device.length; //退出循环
                        flag = true;
                    };
                };
                //如果失败，基本上都是产品类型不一致造成的，所以去掉这个条件再次更新数据
                if (!flag){
                    for(var i=0; i<data.device.length; i++){
                        if (data.device[i].bsc === bsc){
                            modifier['$set']['device.' + i + '.tcxs'] = tcxs;
                            modifier['$set']['device.' + i + '.tcjs'] = tcjs;
                            modifier['$set']['device.' + i + '.fysc'] = fysc;
                            modifier['$set']['device.' + i + '.fyqt'] = fyqt;
                            modifier['$set']['device.' + i + '.fyyj'] = fyyj;
                            modifier['$set']['device.' + i + '.fykc'] = fykc;

                            IndentCollection.update({'_id': data._id}, modifier);
                            i = data.device.length; //退出循环
                            flag = true;
                        };
                    };
                };
                if (!flag){
                    console.log(ddh+ ' is not cost!');
                };
            }else{
                console.log(ddh+ ' is not find!');
            };
        };
    });
};

Router.route('/importcost', {where: 'server'}).get(function(){
    var req = this.request, res = this.response;
    var fs = require("fs");
    var path = require("path");
    var currFile = path.normalize(process.env.HOME+'/indent/excel/importCost.xlsx');
    var ejsExcel = require('ejsExcel');

    var exBuf = fs.readFileSync(currFile);
    ejsExcel.getExcelArr(exBuf).then(exlJson=>{
        importCost(exlJson[0]);
        res.statusCode = 200;
        res.setHeader("Content-type","text/html");
        res.end("cost data import OK!");
    }).catch(error=>{
        console.log(error);
        res.statusCode = 500;
        res.setHeader("Content-type","text/html");
        res.end(error);
    });
});

importWorker = function(workSheets){
    var worker = {
        ygbm: '',
        ygxm: '',
        ygbh: ''
    };
    var data;

    workSheets.forEach((item, index)=>{
        data = cloneObject(worker);
        data['ygbm'] = trim(toString(item[0]));
        data['ygxm'] = trim(toString(item[1]));
        data['ygbh'] = trim(toString(item[2]));

        try {
            WorkerCollection.insert(data);
        } catch(err){
            console.log(err);
        };
    });
};

Router.route('/importworker', {where: 'server'}).get(function(){
    var req = this.request, res = this.response;
    var fs = require("fs");
    var path = require("path");
    var currFile = path.normalize(process.env.HOME+'/indent/excel/importWorker.xlsx');
    var ejsExcel = require('ejsExcel');

    var exBuf = fs.readFileSync(currFile);
    ejsExcel.getExcelArr(exBuf).then(exlJson=>{
        importWorker(exlJson[0]);
        res.statusCode = 200;
        res.setHeader("Content-type","text/html");
        res.end("worker data import OK!");
    }).catch(error=>{
        console.log(error);
        res.statusCode = 500;
        res.setHeader("Content-type","text/html");
        res.end(error);
    });
});