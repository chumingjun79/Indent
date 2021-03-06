import * as func from '../lib/func/function';

//下载excel通用路由，需要指定downfile
Router.route('/down/excel', {where: 'server'}).get(function(){
    let req = this.request, res = this.response;
    let fs = require("fs");
    let path = require("path");
    let fileName = req.query.downfile;
    if (! fileName){
        res.statusCode = 500;
        res.setHeader("Content-type","text/plain;charset=UTF-8");
        res.end("request downfile not defined!");
    };
    let currFile = path.normalize(process.env.HOME+'/indent/excel/down/'+fileName);
    //console.log(currFile);

    fs.exists(currFile, function(exist) {
        if(exist) {
            res.setHeader("Content-type", "application/octet-stream");
            res.setHeader("Content-Disposition", "attachment;filename=" + encodeURI(fileName));
            fs.createReadStream(currFile).pipe(res);
        }else{
            res.statusCode = 404;
            res.setHeader("Content-type","text/plain;charset=UTF-8");
            res.end(currFile+" not found!");
        };
    });
});

Router.route('/export/excel', {where: 'server'}).post(function(){
    //console.log(this.request.body);
    //console.log('dirname:'+__dirname);
    //console.log('filename:'+__filename);
    //console.log('process.env.HOME:'+process.env.HOME);
    let req = this.request, res = this.response;
    let ejsExcel = require("ejsExcel");
    let fs = require("fs");
    let path = require("path");

    let fileName = req.query.filename;
    if (! fileName){
        res.statusCode = 500;
        res.setHeader("Content-type","text/plain;charset=utf-8");
        res.end("request filename not defined!");
    };
    let downFile = req.query.downfile;
    if (! downFile){
        res.statusCode = 500;
        res.setHeader("Content-type","text/plain;charset=utf-8");
        res.end("request downfile not defined!");
    };

    let currFile = path.normalize(process.env.HOME+'/indent/excel/'+ fileName);
    fs.exists(currFile, function(exist) {
        if(exist) {
            let exlBuf = fs.readFileSync(currFile);
            let data = req.body;
            //console.log(data);

            ejsExcel.renderExcel(exlBuf, data).then(function(exlBuf2) {
                let file = path.normalize(process.env.HOME+'/indent/excel/down/'+ downFile);
                fs.writeFileSync(file, exlBuf2);

                res.statusCode = 200;
                res.end();
            }).catch(function(err) {
                console.error(err);
                res.statusCode = 500;
                res.setHeader("Content-type","text/plain;charset=utf-8");
                res.end(err);
            });
        }else{
            res.statusCode = 404;
            res.setHeader("Content-type","text/plain;charset=utf-8");
            res.end(currFile+" not found!");
        };
    });
});

function getReportData(report, kjnd, kjyf){
    let resData, getData, chanpin, xmfl, sshy;

    switch (report){
    case 'orderstatus':
        resData = {};

        //获取截止到去年年底的设备金额
        getData = IndentCollection.aggregate([
            {$unwind:"$device"},
            {$match:{kjnd: {$lt: String(kjnd)}}},
            {$group:{_id: 'sum',sum_value:{$sum:"$device.sbje"}}}
        ]);
        if (getData[0]) {
            resData.qnsbje = func.toDecimal(getData[0].sum_value, 0);
        }

        //获取截止到去年年底的发货金额
        getData = IndentCollection.aggregate([
            {$unwind:"$device"},
            {$unwind:"$device.shipment"},
            {$match:{'device.shipment.fhnd':{$lt: String(kjnd)}}},
            {$group:{_id: 'sum',sum_value:{$sum:"$device.shipment.fhje"}}}
        ]);
        if (getData[0]) {
            resData.qnfhje = func.toDecimal(getData[0].sum_value, 0);
        }

        getData = IndentCollection.aggregate([
            {$unwind:"$device"},
            {$match:{kjnd: String(kjnd), kjyf:{$lte: Number(kjyf)}}},
            {$group:{_id: 'sum',sum_value:{$sum:"$device.sbje"}}}
        ]);
        if (getData[0]) {
            resData.jnsbje = func.toDecimal(getData[0].sum_value, 0);
        }

        getData = IndentCollection.aggregate([
            {$unwind:"$device"},
            {$unwind:"$device.shipment"},
            {$match:{'device.shipment.fhnd': String(kjnd), 'device.shipment.fhyf':{$lte: Number(kjyf)}}},
            {$group:{_id: 'sum',sum_value:{$sum:"$device.shipment.fhje"}}}
        ]);
        if (getData[0]) {
            resData.jnfhje = func.toDecimal(getData[0].sum_value, 0);
        }

        return resData;
    case 'monthly':
        resData = [{}, {}, {}];

        getData = IndentCollection.aggregate([
            {$unwind:"$device"},
            {$match:{kjnd: String(kjnd), kjyf:{$lte: Number(kjyf)}}},
            {$group:{_id: '$kjyf',sum_value:{$sum:"$device.sbje"}}}
        ]);
        for (let i=0; i<getData.length; i++){
            resData[0]['sb'+String(getData[i]._id)] = Math.round(getData[i].sum_value);
        };

        getData = IndentCollection.aggregate([
            {$match:{kjnd: String(kjnd), kjyf:{$lte: Number(kjyf)}}},
            {$group:{_id: '$kjyf',sum_value:{$sum:"$htzje"}}}
        ]);
        for (i=0; i<getData.length; i++){
            resData[1]['ht'+String(getData[i]._id)] = Math.round(getData[i].sum_value);
        };

        getData = IndentCollection.aggregate([
            {$unwind:"$device"},
            {$unwind:"$device.shipment"},
            {$match:{'device.shipment.fhnd': String(kjnd), 'device.shipment.fhyf':{$lte: Number(kjyf)}}},
            {$group:{_id:'$device.shipment.fhyf',sum_value:{$sum:"$device.shipment.fhje"}}}
        ]);
        for (let i=0; i<getData.length; i++){
            resData[2]['fh'+String(getData[i]._id)] = Math.round(getData[i].sum_value);
        };

        return resData;
    case 'officereport':
        resData = [{}, {}, {}, {}];
        //先初始化办事处
        getData = OfficeCollection.find({}).fetch();
        for (let i=0; i<getData.length; i++){
            resData[0][String(getData[i].office)] = 0;
            resData[1][String(getData[i].office)] = 0;
            resData[2][String(getData[i].office)] = 0;
            resData[3][String(getData[i].office)] = 0;
        }

        getData = IndentCollection.aggregate([
            {$unwind:"$device"},
            {$match:{kjnd: String(kjnd), kjyf:{$lte: Number(kjyf)}}},
            {$group:{_id: '$device.bsc',sum_value:{$sum:"$device.sbje"}}}
        ]);
        for (let i=0; i<getData.length; i++){
            resData[0][String(getData[i]._id)] = Math.round(getData[i].sum_value)/10000;
        }

        getData = IndentCollection.aggregate([
            {$unwind:"$device"},
            {$unwind:"$device.shipment"},
            {$match:{"device.shipment.fhnd": String(kjnd), 'device.shipment.fhyf':{$lte: Number(kjyf)}}},
            {$group:{_id: '$device.bsc',sum_value:{$sum:"$device.shipment.fhje"}}}
        ]);
        for (let i=0; i<getData.length; i++){
            resData[1][String(getData[i]._id)] = Math.round(getData[i].sum_value)/10000;
        }

        getData = IndentCollection.aggregate([
            {$unwind:"$device"},
            {$match:{kjnd: String(kjnd), kjyf:{$lte:Number(kjyf)}, "device.cpfl":'DCLC' }},
            {$group:{_id:{bsc:"$device.bsc"}, sbsl:{$sum:"$device.sbsl"} }}
        ]);
        for (let i=0; i<getData.length; i++){
            resData[2][String(getData[i]._id.bsc)] = resData[2][String(getData[i]._id.bsc)]+getData[i].sbsl;
        }

        getData = IndentCollection.aggregate([
            {$unwind:"$device"},
            {$match:{kjnd: String(kjnd), kjyf:{$lte:Number(kjyf)}, "device.cpfl":'Modular' }},
            {$group:{_id:{bsc:"$device.bsc", sbxh:"$device.sbxh"}, sbsl:{$sum:"$device.sbsl"} }}
        ]);
        for (let i=0; i<getData.length; i++){
            resData[3][String(getData[i]._id.bsc)] = 0;
        }
        for (let i=0; i<getData.length; i++){
            if (String(getData[i]._id.sbxh).indexOf('130') !== -1) //130的模块机需要折算成两台
            {
                resData[3][String(getData[i]._id.bsc)] = resData[3][String(getData[i]._id.bsc)]+getData[i].sbsl*2;
            } else {
                resData[3][String(getData[i]._id.bsc)] = resData[3][String(getData[i]._id.bsc)]+getData[i].sbsl;
            }
        }

        return resData;
    case 'productreport':
        resData = [{}, {}];

        getData = IndentCollection.aggregate([
            {$unwind:"$device"},
            {$match:{kjnd: String(kjnd), kjyf:{$lte: Number(kjyf)}}},
            {$group:{_id:{yuefen:"$kjyf", chanpin:'$device.cpfl'}, sum_value:{$sum:"$device.sbje"}}}
        ]);
        for (let i=0; i<getData.length; i++){
            chanpin = getData[i]._id.chanpin;
            if (chanpin === 'A-C') chanpin = 'AC'; //ejsExcel中字段名带有'-'的话会报错
            resData[0][chanpin + String(getData[i]._id.yuefen)] = func.toDecimal(getData[i].sum_value, 2);
        };

        getData = IndentCollection.aggregate([
            {$unwind:"$device"},
            {$match:{kjnd: String(kjnd), kjyf:{$lte: Number(kjyf)}}},
            {$group:{_id:{yuefen:"$kjyf", chanpin:'$device.cpfl'}, sum_value:{$sum:"$device.sbsl"}}}
        ]);
        for (let i=0; i<getData.length; i++){
            chanpin = getData[i]._id.chanpin;
            if (chanpin === 'A-C') chanpin = 'AC'; //ejsExcel中字段名带有'-'的话会报错
            resData[1][chanpin + String(getData[i]._id.yuefen)] = func.toDecimal(getData[i].sum_value, 3);
        };

        return resData;
    case 'monthcost':
        resData = [{}];

        getData = IndentCollection.aggregate([
            {$unwind:"$device"},
            {$match:{kjnd: String(kjnd), kjyf:{$lte:Number(kjyf)}}},
            {$group:{_id: '$kjyf', sbje:{$sum:"$device.sbje"}, tcxs:{$sum:"$device.tcxs"},
                tcjs:{$sum:"$device.tcjs"}, fysc:{$sum:"$device.fysc"}, fyqt:{$sum:"$device.fyqt"},
                fycgkcyj:{$sum:{$add:["$device.fykc","$device.fyyj"]}}}}
        ]);
        for (let i=0; i<getData.length; i++){
            resData[0]['sbje'+String(getData[i]._id)] = Math.round(getData[i].sbje);
            resData[0]['tcxs'+String(getData[i]._id)] = Math.round(getData[i].tcxs);
            resData[0]['tcjs'+String(getData[i]._id)] = Math.round(getData[i].tcjs);
            resData[0]['fysc'+String(getData[i]._id)] = Math.round(getData[i].fysc);
            resData[0]['fyqt'+String(getData[i]._id)] = Math.round(getData[i].fyqt);
            resData[0]['fycgkcyj'+String(getData[i]._id)] = Math.round(getData[i].fycgkcyj);
        };

        return resData;
    case 'officecost':
        resData = [{}, {}];
        //先初始化办事处
        getData = OfficeCollection.find({}).fetch();
        for (let i=0; i<getData.length; i++){
            resData[0][String(getData[i].office)] = 0;
            resData[1][String(getData[i].office)] = 0;
        }

        getData = IndentCollection.aggregate([
            {$unwind:"$device"},
            {$match:{kjnd: String(kjnd), kjyf:{$lte:Number(kjyf)}}},
            {$group:{_id: '$device.bsc', sbje:{$sum:"$device.sbje"},
                fyhj:{$sum:{$add:["$device.tcxs","$device.tcjs",
                "$device.fysc","$device.fyqt","$device.fykc","$device.fyyj"]}}}}
        ]);
        for (let i=0; i<getData.length; i++){
            resData[0][String(getData[i]._id)] = Math.round(getData[i].sbje);
            resData[1][String(getData[i]._id)] = Math.round(getData[i].fyhj);
        };

        return resData;
    case 'averagemf':
        resData = [{}, {}];

        getData = IndentCollection.aggregate([
            {$unwind:"$device"},
            {$match:{kjnd:String(kjnd), kjyf:Number(kjyf), "device.sbxs":{$gt:0} }},
            {$project:{cpfl:"$device.cpfl", xs:"$device.sbxs",
                jingjia:{$subtract:["$device.sbje","$device.tszbjj"]}}},
            {$project:{cpfl:"$cpfl", jingjia:"$jingjia", mianjia:{$divide:["$jingjia","$xs"]}}},
            {$group:{_id: '$cpfl', jjhj:{$sum:"$jingjia"}, mjhj:{$sum:"$mianjia"}}}
        ]);
        for (let i=0; i<getData.length; i++){
            chanpin = getData[i]._id;
            if (chanpin === 'A-C') chanpin = 'AC'; //ejsExcel中字段名带有'-'的话会报错
            resData[0][chanpin] = func.toDecimal(getData[i].jjhj / getData[i].mjhj, 4);
        };

        getData = IndentCollection.aggregate([
            {$unwind:"$device"},
            {$match:{kjnd:String(kjnd), kjyf:{$lte:Number(kjyf)}, "device.sbxs":{$gt:0} }},
            {$project:{cpfl:"$device.cpfl", xs:"$device.sbxs",
                jingjia:{$subtract:["$device.sbje","$device.tszbjj"]}}},
            {$project:{cpfl:"$cpfl", jingjia:"$jingjia", mianjia:{$divide:["$jingjia","$xs"]}}},
            {$group:{_id: '$cpfl', jjhj:{$sum:"$jingjia"}, mjhj:{$sum:"$mianjia"}}}
        ]);
        for (let i=0; i<getData.length; i++){
            chanpin = getData[i]._id;
            if (chanpin === 'A-C') chanpin = 'AC'; //ejsExcel中字段名带有'-'的话会报错
            resData[1][chanpin] = func.toDecimal(getData[i].jjhj / getData[i].mjhj, 4);
        };

        return resData;
    case 'paymentStatus': //导出报销一览表，这里的kjnd变量里存放的是_id
        getData = IndentCollection.aggregate([
            {$match:{_id:String(kjnd)}},
            {$project:{xmmc:"$xmmc", ddbh:"$ddbh", htzje:"$htzje", fyqt:{$sum:"$device.fyqt"}}},
        ]);

        //console.log('%j', getData[0]);
        return getData[0];
    case 'paymentDetail': //导出报销明细表，这里的kjnd变量里存放的是_id
        getData = IndentCollection.aggregate([
            {$match:{_id:String(kjnd)}},
            {$project:{xmmc:"$xmmc", ddbh:"$ddbh", fykc:{$sum:"$device.fykc"}}},
        ]);

        return getData[0];
    case 'itemorder':
        resData = [{}];

        getData = IndentCollection.aggregate([
            {$unwind:"$device"},
            {$match:{kjnd: String(kjnd), kjyf:{$lte: Number(kjyf)}}},
            {$group:{_id:{yuefen:"$kjyf", xmfl:'$xmfl'}, sum_value:{$sum:"$device.sbje"}}}
        ]);
        for (let i=0; i<getData.length; i++){
            xmfl = getData[i]._id.xmfl;
            resData[0][xmfl + String(getData[i]._id.yuefen)] = func.toDecimal(getData[i].sum_value, 2);
        };

        return resData;
    case 'industryorder':
        resData = [{}];

        getData = IndentCollection.aggregate([
            {$unwind:"$device"},
            {$match:{kjnd: String(kjnd), kjyf:{$lte: Number(kjyf)}}},
            {$group:{_id:{yuefen:"$kjyf", sshy:'$sshy'}, sum_value:{$sum:"$device.sbje"}}}
        ]);
        for (let i=0; i<getData.length; i++){
            sshy = func.toString(getData[i]._id.sshy);   
            if (sshy !== '')
            {
                sshy = sshy.replace(/、/g, ''); //ejsExcel中字段名带有'、'的话会报错
            }        
            resData[0][sshy + String(getData[i]._id.yuefen)] = func.toDecimal(getData[i].sum_value, 2);
        };

        return resData;
    };
};

Router.route('/report/excel', {where: 'server'}).get(function(){
    let req = this.request, res = this.response;
    let ejsExcel = require("ejsExcel");
    let fs = require("fs");
    let path = require("path");

    let filename = req.query.filename;
    let downFile = req.query.downfile;
    let tempFile, currFile;
    if (filename === 'paymentStatus' || filename === 'paymentDetail')
    {
        tempFile = filename + '_temp.xlsx';
        currFile = path.normalize(process.env.HOME+'/indent/excel/'+ tempFile);
    } else {
        tempFile = filename + '_' + req.query.kjyf + '.xlsx';
        currFile = path.normalize(process.env.HOME+'/indent/excel/'+ req.query.kjnd + '/' + tempFile);
    }

    let data = getReportData(filename, req.query.kjnd, req.query.kjyf);
    //console.log('%j', data);

    fs.exists(currFile, function(exist) {
        if(exist) {
            let exlBuf = fs.readFileSync(currFile);
            ejsExcel.renderExcel(exlBuf, data).then(function(exlBuf2) {
                let file = path.normalize(process.env.HOME+'/indent/excel/down/'+ downFile);
                fs.writeFileSync(file, exlBuf2);

                res.statusCode = 200;
                res.end();
            }).catch(function(err) {
                console.error(err);
                res.statusCode = 500;
                res.setHeader("Content-type","text/plain;charset=utf-8");
                res.end(err);
            });
        }else{
            res.statusCode = 404;
            res.setHeader("Content-type","text/plain;charset=utf-8");
            res.end('对不起，系统不提供'+ req.query.kjnd + '年度'+ req.query.kjyf + '月份的报表');
        };
    });
});