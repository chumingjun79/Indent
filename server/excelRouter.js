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

getReportData = function(report, kjnd, kjyf){
    let resData, getData, chanpin;

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
            resData.qnsbje = toDecimal(getData[0].sum_value, 0);
        }

        //获取截止到去年年底的发货金额
        getData = IndentCollection.aggregate([
            {$unwind:"$device"},
            {$unwind:"$device.shipment"},
            {$match:{'device.shipment.fhnd':{$lt: String(kjnd)}}},
            {$group:{_id: 'sum',sum_value:{$sum:"$device.shipment.fhje"}}}
        ]);
        if (getData[0]) {
            resData.qnfhje = toDecimal(getData[0].sum_value, 0);
        }

        getData = IndentCollection.aggregate([
            {$unwind:"$device"},
            {$match:{kjnd: String(kjnd)}},
            {$group:{_id: 'sum',sum_value:{$sum:"$device.sbje"}}}
        ]);
        if (getData[0]) {
            resData.jnsbje = toDecimal(getData[0].sum_value, 0);
        }

        getData = IndentCollection.aggregate([
            {$unwind:"$device"},
            {$unwind:"$device.shipment"},
            {$match:{'device.shipment.fhnd': String(kjnd)}},
            {$group:{_id: 'sum',sum_value:{$sum:"$device.shipment.fhje"}}}
        ]);
        if (getData[0]) {
            resData.jnfhje = toDecimal(getData[0].sum_value, 0);
        }

        return resData;
    case 'monthly':
        resData = [{}, {}, {}];

        getData = IndentCollection.aggregate([
            {$unwind:"$device"},
            {$match:{kjnd: String(kjnd)}},
            {$group:{_id: '$kjyf',sum_value:{$sum:"$device.sbje"}}}
        ]);
        for (let i=0; i<getData.length; i++){
            resData[0]['sb'+String(getData[i]._id)] = Math.round(getData[i].sum_value);
        };

        getData = IndentCollection.aggregate([
            {$match:{kjnd: String(kjnd)}},
            {$group:{_id: '$kjyf',sum_value:{$sum:"$htzje"}}}
        ]);
        for (i=0; i<getData.length; i++){
            resData[1]['ht'+String(getData[i]._id)] = Math.round(getData[i].sum_value);
        };

        getData = IndentCollection.aggregate([
            {$unwind:"$device"},
            {$unwind:"$device.shipment"},
            {$match:{'device.shipment.fhnd': String(kjnd)}},
            {$group:{_id:'$device.shipment.fhyf',sum_value:{$sum:"$device.shipment.fhje"}}}
        ]);
        for (let i=0; i<getData.length; i++){
            resData[2]['fh'+String(getData[i]._id)] = Math.round(getData[i].sum_value);
        };

        return resData;
    case 'officereport':
        resData = [{}, {}];

        getData = IndentCollection.aggregate([
            {$unwind:"$device"},
            {$match:{kjnd: String(kjnd)}},
            {$group:{_id: '$device.bsc',sum_value:{$sum:"$device.sbje"}}}
        ]);
        for (let i=0; i<getData.length; i++){
            resData[0][String(getData[i]._id)] = Math.round(getData[i].sum_value)/10000;
        };

        getData = IndentCollection.aggregate([
            {$unwind:"$device"},
            {$unwind:"$device.shipment"},
            {$match:{"device.shipment.fhnd": String(kjnd)}},
            {$group:{_id: '$device.bsc',sum_value:{$sum:"$device.shipment.fhje"}}}
        ]);
        for (let i=0; i<getData.length; i++){
            resData[1][String(getData[i]._id)] = Math.round(getData[i].sum_value)/10000;
        };

        return resData;
    case 'productreport':
        resData = [{}, {}];

        getData = IndentCollection.aggregate([
            {$unwind:"$device"},
            {$match:{kjnd: String(kjnd)}},
            {$group:{_id:{yuefen:"$kjyf", chanpin:'$device.cpfl'}, sum_value:{$sum:"$device.sbje"}}}
        ]);
        for (let i=0; i<getData.length; i++){
            chanpin = getData[i]._id.chanpin;
            if (chanpin === 'A-C') chanpin = 'AC'; //ejsExcel中字段名带有'-'的话会报错
            resData[0][chanpin + String(getData[i]._id.yuefen)] = toDecimal(getData[i].sum_value, 2);
        };

        getData = IndentCollection.aggregate([
            {$unwind:"$device"},
            {$match:{kjnd: String(kjnd)}},
            {$group:{_id:{yuefen:"$kjyf", chanpin:'$device.cpfl'}, sum_value:{$sum:"$device.sbsl"}}}
        ]);
        for (let i=0; i<getData.length; i++){
            chanpin = getData[i]._id.chanpin;
            if (chanpin === 'A-C') chanpin = 'AC'; //ejsExcel中字段名带有'-'的话会报错
            resData[1][chanpin + String(getData[i]._id.yuefen)] = toDecimal(getData[i].sum_value, 3);
        };

        return resData;
    case 'monthcost':
        resData = [{}];

        getData = IndentCollection.aggregate([
            {$unwind:"$device"},
            {$match:{kjnd: String(kjnd)}},
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

        getData = IndentCollection.aggregate([
            {$unwind:"$device"},
            {$match:{kjnd: String(kjnd)}},
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
            resData[0][chanpin] = toDecimal(getData[i].jjhj / getData[i].mjhj, 4);
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
            resData[1][chanpin] = toDecimal(getData[i].jjhj / getData[i].mjhj, 4);
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
    };
};

Router.route('/report/excel', {where: 'server'}).get(function(){
    let req = this.request, res = this.response;
    let ejsExcel = require("ejsExcel");
    let fs = require("fs");
    let path = require("path");

    let downFile = req.query.downfile;
    let tempFile = req.query.filename + '_temp.xlsx';
    let data = getReportData(req.query.filename, req.query.kjnd, req.query.kjyf);
    //console.log('%j', data);

    let currFile = path.normalize(process.env.HOME+'/indent/excel/'+ tempFile);
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
            res.end(currFile+" not found!");
        };
    });
});