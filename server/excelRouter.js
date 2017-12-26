//下载excel通用路由，需要指定downfile
Router.route('/down/excel', {where: 'server'}).get(function(){
    var req = this.request, res = this.response;
    var fs = require("fs");
    var path = require("path");
    var fileName = req.query.downfile;
    if (! fileName){
        res.statusCode = 500;
        res.setHeader("Content-type","text/plain;charset=UTF-8");
        res.end("request downfile not defined!");
    };
    var currFile = path.normalize(process.env.HOME+'/indent/excel/'+fileName);
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
    var req = this.request, res = this.response;
    var ejsExcel = require("ejsExcel");
    var fs = require("fs");
    var path = require("path");

    var fileName = req.query.filename;
    if (! fileName){
        res.statusCode = 500;
        res.setHeader("Content-type","text/plain;charset=utf-8");
        res.end("request filename not defined!");
    };
    var downFile = req.query.downfile;
    if (! downFile){
        res.statusCode = 500;
        res.setHeader("Content-type","text/plain;charset=utf-8");
        res.end("request downfile not defined!");
    };

    var currFile = path.normalize(process.env.HOME+'/indent/excel/'+ fileName);
    fs.exists(currFile, function(exist) {
        if(exist) {
            var exlBuf = fs.readFileSync(currFile);
            var data = req.body;
            //console.log(data);

            ejsExcel.renderExcel(exlBuf, data).then(function(exlBuf2) {
                var file = path.normalize(process.env.HOME+'/indent/excel/'+ downFile);
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

getReportData = function(report){
    switch (report){
    case 'orderstatus':
        var date = new Date();
        var kjnd = date.getFullYear();
        var resData = {zdje:0, ddjezj:0, fyje:0};

        var getData = IndentCollection.aggregate([
            {$unwind:"$device"},
            {$match:{kjnd: {$lt: String(kjnd)}}},
            {$group:{_id: 'sum',sum_value:{$sum:"$device.sbje"}}}
        ]);
        resData.zdje = toDecimal(getData[0].sum_value, 0);

        var getData = IndentCollection.aggregate([
            {$unwind:"$device"},
            {$group:{_id: 'sum',sum_value:{$sum:"$device.sbje"}}}
        ]);
        //console.log('%j', getData);
        resData.ddjezj = toDecimal(getData[0].sum_value, 0);

        var getData = IndentCollection.aggregate([
            {$unwind:"$device"},
            {$unwind:"$device.shipment"},
            {$group:{_id: 'sum',sum_value:{$sum:"$device.shipment.fhje"}}}
        ]);
        resData.fyje = toDecimal(getData[0].sum_value, 0);

        return resData;
        break;
    case 'monthly':
        var date = new Date();
        var kjnd = date.getFullYear();
        var resData = [{}, {}, {}];

        var getData = IndentCollection.aggregate([
            {$unwind:"$device"},
            {$match:{kjnd: String(kjnd)}},
            {$group:{_id: '$kjyf',sum_value:{$sum:"$device.sbje"}}}
        ]);
        for (var i=0; i<getData.length; i++){
            resData[0]['sb'+String(getData[i]._id)] = Math.round(getData[i].sum_value);
        };

        var getData = IndentCollection.aggregate([
            {$match:{kjnd: String(kjnd)}},
            {$group:{_id: '$kjyf',sum_value:{$sum:"$htzje"}}}
        ]);
        for (var i=0; i<getData.length; i++){
            resData[1]['ht'+String(getData[i]._id)] = Math.round(getData[i].sum_value);
        };

        var getData = IndentCollection.aggregate([
            {$unwind:"$device"},
            {$unwind:"$device.shipment"},
            {$match:{'device.shipment.fhnd': String(kjnd)}},
            {$group:{_id:'$device.shipment.fhyf',sum_value:{$sum:"$device.shipment.fhje"}}}
        ]);
        for (var i=0; i<getData.length; i++){
            resData[2]['fh'+String(getData[i]._id)] = Math.round(getData[i].sum_value);
        };

        return resData;
        break;
    case 'officereport':
        var date = new Date();
        var kjnd = date.getFullYear();
        var resData = [{}, {}];

        var getData = IndentCollection.aggregate([
            {$unwind:"$device"},
            {$match:{kjnd: String(kjnd)}},
            {$group:{_id: '$device.bsc',sum_value:{$sum:"$device.sbje"}}}
        ]);
        for (var i=0; i<getData.length; i++){
            resData[0][String(getData[i]._id)] = Math.round(getData[i].sum_value)/10000;
        };

        var getData = IndentCollection.aggregate([
            {$unwind:"$device"},
            {$unwind:"$device.shipment"},
            {$match:{"device.shipment.fhnd": String(kjnd)}},
            {$group:{_id: '$device.bsc',sum_value:{$sum:"$device.shipment.fhje"}}}
        ]);
        for (var i=0; i<getData.length; i++){
            resData[1][String(getData[i]._id)] = Math.round(getData[i].sum_value)/10000;
        };

        return resData;
        break;
    case 'productreport':
        var date = new Date();
        var kjnd = date.getFullYear();
        var resData = [{}, {}];
        var chanpin = '';

        var getData = IndentCollection.aggregate([
            {$unwind:"$device"},
            {$match:{kjnd: String(kjnd)}},
            {$group:{_id:{yuefen:"$kjyf", chanpin:'$device.cpfl'}, sum_value:{$sum:"$device.sbje"}}}
        ]);
        for (var i=0; i<getData.length; i++){
            chanpin = getData[i]._id.chanpin;
            if (chanpin === 'A-C') chanpin = 'AC'; //ejsExcel中字段名带有'-'的话会报错
            resData[0][chanpin + String(getData[i]._id.yuefen)] = toDecimal(getData[i].sum_value, 2);
        };

        var getData = IndentCollection.aggregate([
            {$unwind:"$device"},
            {$match:{kjnd: String(kjnd)}},
            {$group:{_id:{yuefen:"$kjyf", chanpin:'$device.cpfl'}, sum_value:{$sum:"$device.sbsl"}}}
        ]);
        for (var i=0; i<getData.length; i++){
            chanpin = getData[i]._id.chanpin;
            if (chanpin === 'A-C') chanpin = 'AC'; //ejsExcel中字段名带有'-'的话会报错
            resData[1][chanpin + String(getData[i]._id.yuefen)] = toDecimal(getData[i].sum_value, 3);
        };

        return resData;
        break;
    case 'monthcost':
        var date = new Date();
        var kjnd = date.getFullYear();
        var resData = [{}];

        var getData = IndentCollection.aggregate([
            {$unwind:"$device"},
            {$match:{kjnd: String(kjnd)}},
            {$group:{_id: '$kjyf', sbje:{$sum:"$device.sbje"}, tcxs:{$sum:"$device.tcxs"},
                tcjs:{$sum:"$device.tcjs"}, fysc:{$sum:"$device.fysc"}, fyqt:{$sum:"$device.fyqt"},
                fycgkcyj:{$sum:{$add:["$device.fykc","$device.fyyj"]}}}}
        ]);
        for (var i=0; i<getData.length; i++){
            resData[0]['sbje'+String(getData[i]._id)] = Math.round(getData[i].sbje);
            resData[0]['tcxs'+String(getData[i]._id)] = Math.round(getData[i].tcxs);
            resData[0]['tcjs'+String(getData[i]._id)] = Math.round(getData[i].tcjs);
            resData[0]['fysc'+String(getData[i]._id)] = Math.round(getData[i].fysc);
            resData[0]['fyqt'+String(getData[i]._id)] = Math.round(getData[i].fyqt);
            resData[0]['fycgkcyj'+String(getData[i]._id)] = Math.round(getData[i].fycgkcyj);
        };

        return resData;
        break;
    case 'officecost':
        var date = new Date();
        var kjnd = date.getFullYear();
        var resData = [{}, {}];

        var getData = IndentCollection.aggregate([
            {$unwind:"$device"},
            {$match:{kjnd: String(kjnd)}},
            {$group:{_id: '$device.bsc', sbje:{$sum:"$device.sbje"},
                fyhj:{$sum:{$add:["$device.tcxs","$device.tcjs",
                "$device.fysc","$device.fyqt","$device.fykc","$device.fyyj"]}}}}
        ]);
        for (var i=0; i<getData.length; i++){
            resData[0][String(getData[i]._id)] = Math.round(getData[i].sbje);
            resData[1][String(getData[i]._id)] = Math.round(getData[i].fyhj);
        };

        return resData;
        break;
    case 'averagemf':
        var date = new Date();
        var kjnd = date.getFullYear(), kjyf = date.getMonth()+1;
        var resData = [{}, {}];
        var chanpin = '';

        var getData = IndentCollection.aggregate([
            {$unwind:"$device"},
            {$match:{kjnd:String(kjnd), kjyf:kjyf, "device.sbxs":{$gt:0} }},
            {$project:{cpfl:"$device.cpfl", xs:"$device.sbxs",
                jingjia:{$subtract:["$device.sbje","$device.tszbjj"]}}},
            {$project:{cpfl:"$cpfl", jingjia:"$jingjia", mianjia:{$divide:["$jingjia","$xs"]}}},
            {$group:{_id: '$cpfl', jjhj:{$sum:"$jingjia"}, mjhj:{$sum:"$mianjia"}}}
        ]);
        for (var i=0; i<getData.length; i++){
            chanpin = getData[i]._id;
            if (chanpin === 'A-C') chanpin = 'AC'; //ejsExcel中字段名带有'-'的话会报错
            resData[0][chanpin] = toDecimal(getData[i].jjhj / getData[i].mjhj, 4);
        };

        var getData = IndentCollection.aggregate([
            {$unwind:"$device"},
            {$match:{kjnd:String(kjnd), "device.sbxs":{$gt:0} }},
            {$project:{cpfl:"$device.cpfl", xs:"$device.sbxs",
                jingjia:{$subtract:["$device.sbje","$device.tszbjj"]}}},
            {$project:{cpfl:"$cpfl", jingjia:"$jingjia", mianjia:{$divide:["$jingjia","$xs"]}}},
            {$group:{_id: '$cpfl', jjhj:{$sum:"$jingjia"}, mjhj:{$sum:"$mianjia"}}}
        ]);
        for (var i=0; i<getData.length; i++){
            chanpin = getData[i]._id;
            if (chanpin === 'A-C') chanpin = 'AC'; //ejsExcel中字段名带有'-'的话会报错
            resData[1][chanpin] = toDecimal(getData[i].jjhj / getData[i].mjhj, 4);
        };

        return resData;
        break;
    };
};

Router.route('/report/excel', {where: 'server'}).get(function(){
    var req = this.request, res = this.response;
    var ejsExcel = require("ejsExcel");
    var fs = require("fs");
    var path = require("path");

    var fileName = req.query.filename + '.xlsx';
    var tempFile = req.query.filename + '_temp.xlsx';
    var data = getReportData(req.query.filename);
    //console.log('%j', data);

    var currFile = path.normalize(process.env.HOME+'/indent/excel/'+ tempFile);
    fs.exists(currFile, function(exist) {
        if(exist) {
            var exlBuf = fs.readFileSync(currFile);
            ejsExcel.renderExcel(exlBuf, data).then(function(exlBuf2) {
                var file = path.normalize(process.env.HOME+'/indent/excel/'+ fileName);
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