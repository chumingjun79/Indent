import * as func from '../lib/func/function';

function importIndent(workSheets){
    let dqBh = '', syBh = '';
    let indent = {
        username: 'daixiuqin',
        kjnd: '',
        kjyf: '',
        ddbh: '',
        xmmc: '',
        xmfl: '',
        khmc: '',
        lxr: '',
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
    let data, dds = 1;

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
                data['kjnd'] = func.trim(toString(item[0]));
                data['kjyf'] = toNumber(func.trim(toString(item[1])));
                data['ddbh'] = func.trim(toString(item[2]));
                data['xmmc'] = func.trim(toString(item[3]));
                data['htzje'] = func.toDecimal(item[8],2);
            };

            data['device'].push({cpfl:'', sbxh:'', bsc:'', fzr:'', ygbh:'', sbxs:0, sbsl:0, sbje:0,
                tcxs:0, tcjs:0, fysc:0, fyqt:0, fyyj:0, fykc:0, tszbjj:0, shipment:[]});
            data['device'][dds-1]['sbxh'] = func.trim(toString(item[4]));
            data['device'][dds-1]['cpfl'] = func.trim(toString(item[5]));
            data['device'][dds-1]['sbsl'] = func.toDecimal(item[6],1);
            data['device'][dds-1]['sbje'] = func.toDecimal(item[7],2);
            data['device'][dds-1]['tszbjj'] = func.toDecimal(item[9],2);
            data['device'][dds-1]['sbxs'] = func.toDecimal(item[10],4);
            data['device'][dds-1]['bsc'] = func.trim(toString(item[11]));
            data['device'][dds-1]['fzr'] = func.trim(toString(item[15]));
            data['device'][dds-1]['ygbh'] = func.trim(toString(item[16]));
            if (toNumber(item[14]) !== 0) {
                data['device'][dds-1]['shipment'].push({fhnd:'2017', fhyf:0, fhsl:0, fhje:0});
                data['device'][dds-1]['shipment'][0]['fhsl'] = func.toDecimal(item[12],2);
                data['device'][dds-1]['shipment'][0]['fhje'] = func.toDecimal(item[14],2);
            };

            syBh = dqBh; //保存上一编号
            dds++;
        };
    });

    insertIndent(data);
};

function insertIndent(data){
    try {
        IndentCollection.insert(data);
    } catch(err){
        console.log(err);
        return;
    };
};
/*
function importIndent1(workSheets){
    let xhl = '', xh = '';
    let dds = 1;
    let data = '';

    workSheets.forEach((item, index)=>{
        if (index > 0) //第一行是标题，所以跳过
        {
            //console.log('%s', item);
            xhl = item[15];
            if (xhl != '') {
                let i = xhl.indexOf('型号');
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

    let fs = require("fs");
    let path = require("path");
    let currFile = path.normalize(process.env.HOME+'/indent/excel/111.txt');
    fs.writeFileSync(currFile, data);
};
*/
Router.route('/importindent', {where: 'server'}).get(function(){
    let req = this.request, res = this.response;
    let fs = require("fs");
    let path = require("path");
    let currFile = path.normalize(process.env.HOME+'/indent/excel/importIndent.xlsx');
    let ejsExcel = require('ejsExcel');

    let exBuf = fs.readFileSync(currFile);
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

function importCost(workSheets){
    let tcxs, tcjs, fysc, fyyj, fykc, fyqt;
    let ddh, cpfl, bsc, fzr, sbzje, khmc;

    workSheets.forEach((item, index)=>{
        if (index > 0) //第一行是标题，所以跳过
        {
            ddh = func.trim(toString(item[0])); //取得当前订单号
            cpfl = func.trim(toString(item[2]));
            sbzje = func.toDecimal(item[3],2);
            tcxs = func.toDecimal(item[5],2);
            tcjs = func.toDecimal(item[6],2);
            fysc = func.toDecimal(item[7],2);
            fyqt = func.toDecimal(item[8],2);
            fyyj = func.toDecimal(item[9],2);
            fykc = func.toDecimal(item[10],2);
            bsc = func.trim(toString(item[11]));
            fzr = func.trim(toString(item[12]));
            khmc = func.trim(toString(item[13]));

            if (tcxs!==0 || tcjs!==0 || fysc!==0 || fyqt!==0 || fyyj!==0 || fykc!==0) {
                let flag = false;
                let data = IndentCollection.findOne({'ddbh': ddh});
                if (data) {
                    let modifier = {$set: {'sbzje':sbzje, 'khmc':khmc}};

                    for (let i = 0; i < data.device.length; i++) {
                        if (data.device[i].bsc === bsc && data.device[i].fzr === fzr &&
                            data.device[i].cpfl === cpfl) {
                            modifier['$set']['device.' + i + '.tcxs'] = tcxs;
                            modifier['$set']['device.' + i + '.tcjs'] = tcjs;
                            modifier['$set']['device.' + i + '.fysc'] = fysc;
                            modifier['$set']['device.' + i + '.fyqt'] = fyqt;
                            modifier['$set']['device.' + i + '.fyyj'] = fyyj;
                            modifier['$set']['device.' + i + '.fykc'] = fykc;

                            IndentCollection.update({'_id': data._id}, modifier);
                            i = data.device.length; //退出循环
                            flag = true;
                        }
                    }
                    //如果失败，基本上都是产品类型或负责人不一致造成的，所以去掉这个条件再次更新数据
                    if (!flag) {
                        for (let i = 0; i < data.device.length; i++) {
                            if (data.device[i].bsc === bsc && data.device[i].cpfl === cpfl) {
                                modifier['$set']['device.' + i + '.tcxs'] = tcxs;
                                modifier['$set']['device.' + i + '.tcjs'] = tcjs;
                                modifier['$set']['device.' + i + '.fysc'] = fysc;
                                modifier['$set']['device.' + i + '.fyqt'] = fyqt;
                                modifier['$set']['device.' + i + '.fyyj'] = fyyj;
                                modifier['$set']['device.' + i + '.fykc'] = fykc;

                                IndentCollection.update({'_id': data._id}, modifier);
                                i = data.device.length; //退出循环
                                flag = true;
                            }
                        }

                        if (!flag) {
                            for (let i = 0; i < data.device.length; i++) {
                                if (data.device[i].bsc === bsc) {
                                    modifier['$set']['device.' + i + '.tcxs'] = tcxs;
                                    modifier['$set']['device.' + i + '.tcjs'] = tcjs;
                                    modifier['$set']['device.' + i + '.fysc'] = fysc;
                                    modifier['$set']['device.' + i + '.fyqt'] = fyqt;
                                    modifier['$set']['device.' + i + '.fyyj'] = fyyj;
                                    modifier['$set']['device.' + i + '.fykc'] = fykc;

                                    IndentCollection.update({'_id': data._id}, modifier);
                                    i = data.device.length; //退出循环
                                    flag = true;
                                }
                            }
                        }
                    }
                    if (!flag) {
                        console.log(ddh + ' is not cost!');
                    }
                } else {
                    console.log(ddh + ' is not find!');
                }
            }
        }
    });
};

Router.route('/importcost', {where: 'server'}).get(function(){
    let req = this.request, res = this.response;
    let fs = require("fs");
    let path = require("path");
    let currFile = path.normalize(process.env.HOME+'/indent/excel/importCost.xlsx');
    let ejsExcel = require('ejsExcel');

    let exBuf = fs.readFileSync(currFile);
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

function importWorker(workSheets){
    let worker = {
        ygbm: '',
        ygxm: '',
        ygbh: ''
    };
    let data;

    workSheets.forEach((item, index)=>{
        data = cloneObject(worker);
        data['ygbm'] = func.trim(toString(item[0]));
        data['ygxm'] = func.trim(toString(item[1]));
        data['ygbh'] = func.trim(toString(item[2]));

        try {
            WorkerCollection.insert(data);
        } catch(err){
            console.log(err);
        };
    });
};

Router.route('/importworker', {where: 'server'}).get(function(){
    let req = this.request, res = this.response;
    let fs = require("fs");
    let path = require("path");
    let currFile = path.normalize(process.env.HOME+'/indent/excel/importWorker.xlsx');
    let ejsExcel = require('ejsExcel');

    let exBuf = fs.readFileSync(currFile);
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

function importCommission(workSheets){
    let tcxs, tcjs, fysc, fyyj, fykc, fyqt;
    let ddh, cpfl, bsc, fzr, sbzje, khmc;

    workSheets.forEach((item, index)=>{
        if (index > 0) //第一行是标题，所以跳过
        {
            ddh = func.trim(toString(item[0])); //取得当前订单号
            bsc = func.trim(toString(item[1]));
            skbl = toString(func.toDecimal(item[4],2)*100) + '%';
            ffry = func.trim(toString(item[5]));
            ffje = func.toDecimal(item[6],2);

            let flag = false;
            let data = IndentCollection.findOne({'ddbh': ddh});
            if (data) {
                let id = data._id;

                for (let i = 0; i < data.device.length; i++) {
                    if (data.device[i].bsc === bsc && data.device[i].fzr === ffry) {
                        let commission = [{ffsj:'20171201', skbl:skbl, ffbsc: bsc, ffry:ffry, ffje:ffje}];
                        let deviceProperty = 'device.' + i + '.commission';
                        let modifier = {$set: {}};
                        modifier['$set'][deviceProperty] = commission;
                        IndentCollection.update({"_id": id}, modifier);

                        i = data.device.length; //退出循环
                        flag = true;
                    }
                }

                if (!flag) {
                    console.log(ddh + ' is not commission!');
                }
            } else {
                console.log(ddh + ' is not find!');
            }
        }
    });
};

Router.route('/importcommission', {where: 'server'}).get(function(){
    let req = this.request, res = this.response;
    let fs = require("fs");
    let path = require("path");
    let currFile = path.normalize(process.env.HOME+'/indent/excel/importCommission.xlsx');
    let ejsExcel = require('ejsExcel');

    let exBuf = fs.readFileSync(currFile);
    ejsExcel.getExcelArr(exBuf).then(exlJson=>{
        importCommission(exlJson[0]);
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