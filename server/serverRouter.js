Router.route('/indentlist/get', {where: 'server'}).get(function(){
	var request = this.request.query;
	var limit = request.limit;
	var offset = request.offset;
	var userId = request.userId;
	var ddbh = trim(request.ddbh);
	var ksrq = request.ksrq; 
	var jsrq = request.jsrq; 
	var xmmc = request.xmmc; 
	//console.log(userId);

	var sql = {};
	if (ddbh !== "") {
		sql["ddbh"] = {$regex: ddbh};
	};
	if (xmmc !== ""){
		sql["xmmc"] = {$regex: xmmc};
	};
	//console.log(sql);

	var getData = IndentCollection.find(sql,
		{fields:{ddbh:1, kjnd:1, kjyf:1, xmmc:1, htzje:1, username:1},
		sort: {ddbh: -1}, limit: Number(limit), skip: Number(offset)});
    //console.log(getData);
	if ( getData ) {
		this.response.end(JSON.stringify( {"total": getData.count(), "rows": getData.fetch() } ));
	};
});

Router.route('/paylist/get', {where: 'server'}).get(function(){
    var request = this.request.query;
    var limit = request.limit;
    var offset = request.offset;
    var userId = request.userId;
    var ddbh = trim(request.ddbh);
    var xmmc = request.xmmc;
    //console.log(userId);

    var sql = {};
    if (ddbh !== ""){
        sql["ddbh"] = {$regex: ddbh};
    };
    if (xmmc !== ""){
        sql["xmmc"] = {$regex: xmmc};
    };
    //console.log(sql);

    var getData = IndentCollection.find(sql,
		{fields:{ddbh:1, kjnd:1, kjyf:1, xmmc:1, htzje:1, skzje:1},
		sort: {ddbh: -1}, limit: Number(limit), skip: Number(offset)});
    //console.log(getData.count());
    if ( getData ) {
        this.response.statusCode = 200;
        this.response.end(JSON.stringify( {"total": getData.count(), "rows": getData.fetch() } ));
    };
});

Router.route('/shipmentlist/get', {where: 'server'}).get(function(){
    var request = this.request.query;
    var ddbh = trim(request.ddbh);
    var cpfl = trim(request.cpfl);
    var fhnd = trim(request.fhnd);
    var fhyf = trim(request.fhyf);

    var ddoption = {};
    if (ddbh !== ""){
        ddoption["ddbh"] = {$regex: ddbh};
    };

    var sql = {fhje:{$exists:true}};
    if (cpfl !== ""){
        sql["cpfl"] = {$regex: cpfl};
    };
    if (fhnd !== ""){
        sql["fhnd"] = fhnd;
    };
    if (fhyf !== ""){
        sql["fhyf"] = Number(fhyf);
    };
    //console.log(sql);

    var getData = IndentCollection.aggregate([
        {$match:ddoption},
        {$unwind:"$device"},
        {$project:{ddbh:1, xmmc:1, cpfl:"$device.cpfl", sbxh:"$device.sbxh",
            bsc:"$device.bsc", fzr:"$device.fzr", shipment:"$device.shipment"}},
        {$unwind:{path:"$shipment", preserveNullAndEmptyArrays:true}},
        {$project:{ddbh:1, xmmc:1, cpfl:1, sbxh:1, bsc:1, fzr:1,
            fhnd:"$shipment.fhnd", fhyf:"$shipment.fhyf",
            fhsl:"$shipment.fhsl", fhje:"$shipment.fhje" }},
        {$match:sql},
        {$sort:{ddbh:1}}
    ]);
    //console.log(getData);
    if ( getData ) {
        this.response.statusCode = 200;
        this.response.end(JSON.stringify( getData ));
    };
});

Router.route('/devicedetail/get', {where: 'server'}).get(function(){
    var request = this.request.query;
    var ddbh = trim(request.ddbh);
    var xmmc = trim(request.xmmc);
    var cpfl = trim(request.cpfl);
    var kjnd = trim(request.kjnd);
    var kjyf = trim(request.kjyf);
    var bsc = trim(request.bsc);
    var fzr = trim(request.fzr);

    var ddoption = {};
    if (ddbh !== ""){
        ddoption["ddbh"] = {$regex: ddbh};
    };
    if (xmmc !== ""){
        ddoption["xmmc"] = {$regex: xmmc};
    };
    if (kjnd !== ""){
        ddoption["kjnd"] = kjnd;
    };
    if (kjyf !== ""){
        ddoption["kjyf"] = Number(kjyf);
    };

    var sql = {};
    if (cpfl !== ""){
        sql["cpfl"] = {$regex: cpfl};
    };
    if (bsc !== ""){
        sql["bsc"] = {$regex: bsc};
    };
    if (fzr !== ""){
        sql["fzr"] = {$regex: fzr};
    };
    //console.log(sql);

    var getData = IndentCollection.aggregate([
        {$match:ddoption},
        {$unwind:{path:"$device", includeArrayIndex:"arrayIndex"}},
        {$project:{kjnd:1, kjyf:1, ddbh:1, xmmc:1, htzje:{$cond:[{$eq:["$arrayIndex",0]},"$htzje",0]},
            cpfl:"$device.cpfl", sbxh:"$device.sbxh",
            bsc:"$device.bsc", fzr:"$device.fzr", ygbh:"$device.ygbh",
            sbxs:"$device.sbxs", sbsl:"$device.sbsl", sbje:"$device.sbje",
            tcxs:"$device.tcxs", tcjs:"$device.tcjs", fysc:"$device.fysc", fyqt:"$device.fyqt",
            fyyj:"$device.fyyj", fykc:"$device.fykc", tszbjj:"$device.tszbjj",}},
        {$match:sql},
        {$sort:{ddbh:1}}
    ]);
    //console.log(getData);
    if ( getData ) {
        this.response.statusCode = 200;
        this.response.end(JSON.stringify( getData ));
    };
});

Router.route('/devicelist/get', {where: 'server'}).get(function(){
    var request = this.request.query;
    var ddbh = trim(request.ddbh);
    var xmmc = trim(request.xmmc);
    var cpfl = trim(request.cpfl);
    var kjnd = trim(request.kjnd);
    var kjyf = trim(request.kjyf);
    var bsc = trim(request.bsc);
    var fzr = trim(request.fzr);

    var ddoption = {};
    if (ddbh !== ""){
        ddoption["ddbh"] = {$regex: ddbh};
    };
    if (xmmc !== ""){
        ddoption["xmmc"] = {$regex: xmmc};
    };
    if (kjnd !== ""){
        ddoption["kjnd"] = kjnd;
    };
    if (kjyf !== ""){
        ddoption["kjyf"] = Number(kjyf);
    };

    var sql = {};
    if (cpfl !== ""){
        sql["cpfl"] = {$regex: cpfl};
    };
    if (bsc !== ""){
        sql["bsc"] = {$regex: bsc};
    };
    if (fzr !== ""){
        sql["fzr"] = {$regex: fzr};
    };
    //console.log(sql);

    var getData = IndentCollection.aggregate([
        {$match:ddoption},
        {$unwind:"$device"},
        {$project:{kjnd:1, kjyf:1, ddbh:1, xmmc:1,
            cpfl:"$device.cpfl", sbxh:"$device.sbxh",
            bsc:"$device.bsc", fzr:"$device.fzr", sbxs:"$device.sbxs",
            sbsl:"$device.sbsl", sbje:"$device.sbje", shipment:"$device.shipment"}},
        {$unwind:{path:"$shipment", preserveNullAndEmptyArrays:true}},
        {$group:{_id:{kjnd:"$kjnd", kjyf:"$kjyf", ddbh:"$ddbh", xmmc:"$xmmc",
            cpfl:"$cpfl", sbxh:"$sbxh", bsc:"$bsc", fzr:"$fzr",
            sbxs:"$sbxs", sbsl:"$sbsl", sbje:"$sbje"},
            fhsl:{$sum:"$shipment.fhsl"}, fhje:{$sum:"$shipment.fhje"} }},
        {$project:{_id:0, kjnd:"$_id.kjnd", kjyf:"$_id.kjyf", ddbh:"$_id.ddbh", xmmc:"$_id.xmmc",
            cpfl:"$_id.cpfl", sbxh:"$_id.sbxh", bsc:"$_id.bsc", fzr:"$_id.fzr",
            sbsl:"$_id.sbsl", sbje:"$_id.sbje", fhsl:"$fhsl", fhje:"$fhje" }},
        {$match:sql},
        {$sort:{ddbh:1,cpfl:1,sbxh:1,bsc:1,fzr:1}}
    ]);
    //console.log(getData);
    if ( getData ) {
        this.response.statusCode = 200;
        this.response.end(JSON.stringify( getData ));
    };
});

Router.route('/paywarn/get', {where: 'server'}).get(function(){
    var request = this.request.query;
    var ddbh = trim(request.ddbh);
    var xmmc = request.xmmc;

    var date = dateToStr(new Date()); //获取当天的日期
    var sql = {sktxr:{$lte:date}, sksfsk:false};
    if (ddbh !== ""){
        sql["ddbh"] = {$regex: ddbh};
    };

    if (xmmc !== ""){
        sql["xmmc"] = {$regex: xmmc};
    };
    //console.log(sql);

    var getData = IndentCollection.aggregate([
        {$unwind:"$pay"},
        {$project:{ddbh:1, xmmc:1, skysje:"$pay.skysje", sktxr:"$pay.sktxr",
            skdqr:"$pay.skdqr", sksfsk:"$pay.sksfsk", sklx:"$pay.sklx", skbz:"$pay.skbz"}},
        {$match:sql},
        {$sort:{skdqr:1, ddbh:1}},
        ]);
    //console.log(getData);
    if ( getData ) {
        this.response.statusCode = 200;
        this.response.end(JSON.stringify( {"data": getData } ));
    };
});

Router.route('/pppwarn/get', {where: 'server'}).get(function(){
    var request = this.request.query;
    var ddbh = trim(request.ddbh);
    var xmmc = request.xmmc;

    var date = dateToStr(new Date()); //获取当天的日期
    var sql = {pptxr:{$lte:date}, ppsfgb:false};
    if (ddbh !== ""){
        sql["ddbh"] = {$regex: ddbh};
    };

    if (xmmc !== ""){
        sql["xmmc"] = {$regex: xmmc};
    };
    //console.log(sql);

    var getData = IndentCollection.aggregate([
        {$unwind:"$ppp"},
        {$project:{ddbh:1, xmmc:1, ppsbxh:"$ppp.ppsbxh", pptxr:"$ppp.pptxr",
            ppdqr:"$ppp.ppdqr", ppsfgb:"$ppp.ppsfgb", ppmmjb:"$ppp.ppmmjb", ppbz:"$ppp.ppbz"}},
        {$match:sql},
        {$sort:{ppdqr:1, ddbh:1}},
    ]);
    //console.log(getData);
    if ( getData ) {
        this.response.statusCode = 200;
        this.response.end(JSON.stringify( {"data": getData } ));
    };
});

Router.route('/userlist/get', {where: 'server'}).get(function(){
    var request = this.request.query;
    var limit = request.limit;
    var offset = request.offset;
    var yhmc = request.search;
    //console.log(yhmc);

    var sql = {};
    if (yhmc) {
        if (yhmc !== ""){
            sql["username"] = {$regex: yhmc};
        };
    };
    //console.log(sql);

    var getData = Meteor.users.find(sql, {fields:{username:1},
    	sort: {username: 1}, limit: Number(limit), skip: Number(offset)});
    if ( getData ) {
        this.response.statusCode = 200;
        this.response.end(JSON.stringify( {"total": getData.count(), "rows": getData.fetch() } ));
    };
});

