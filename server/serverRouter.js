import * as func from '../lib/func/function';
import * as check from '../lib/func/check';

Router.route('/indentlist/get', {where: 'server'}).get(function(){
	let request = this.request.query;
	let limit = request.limit;
	let offset = request.offset;
	let ddbh = func.trim(request.ddbh);
	let xmmc = request.xmmc;
	let khmc = request.khmc;

	let sql = {};
	if (ddbh !== "") {
		sql["ddbh"] = {$regex: ddbh};
	};
	if (xmmc !== ""){
		sql["xmmc"] = {$regex: xmmc};
	};
    if (khmc !== ""){
        sql["khmc"] = {$regex: khmc};
    };
	//console.log(sql);

	let getData = IndentCollection.find(sql,
		{fields:{ddbh:1, kjnd:1, kjyf:1, xmmc:1, khmc:1, htzje:1, username:1},
		sort: {ddbh: -1}, limit: Number(limit), skip: Number(offset)});
    //console.log(getData);
	if ( getData ) {
		this.response.end(JSON.stringify( {"total": getData.count(), "rows": getData.fetch() } ));
	};
});

Router.route('/paylist/get', {where: 'server'}).get(function(){
    let request = this.request.query;
    let limit = request.limit;
    let offset = request.offset;
    let ddbh = func.trim(request.ddbh);
    let xmmc = request.xmmc;
    let khmc = request.khmc;

    let sql = {};
    if (ddbh !== ""){
        sql["ddbh"] = {$regex: ddbh};
    };
    if (xmmc !== ""){
        sql["xmmc"] = {$regex: xmmc};
    };
    if (khmc !== ""){
        sql["khmc"] = {$regex: khmc};
    };
    //console.log(sql);

    let getData = IndentCollection.find(sql,
		{fields:{ddbh:1, kjnd:1, kjyf:1, xmmc:1, khmc:1, htzje:1, skzje:1},
		sort: {ddbh: -1}, limit: Number(limit), skip: Number(offset)});
    //console.log(getData.count());
    if ( getData ) {
        this.response.statusCode = 200;
        this.response.end(JSON.stringify( {"total": getData.count(), "rows": getData.fetch() } ));
    };
});

Router.route('/shipmentlist/get', {where: 'server'}).get(function(){
    let request = this.request.query;
    let ddbh = func.trim(request.ddbh);
    let fhnd = func.trim(request.fhnd);
    let fhyf = func.trim(request.fhyf);
    let xmmc = func.trim(request.xmmc);
    let khmc = func.trim(request.khmc);
    let cpfl = func.trim(request.cpfl);
    let bsc = func.trim(request.bsc);
    let fzr = func.trim(request.fzr);

    let ddoption = {};
    if (ddbh !== ""){
        ddoption["ddbh"] = {$regex: ddbh};
    };
    if (xmmc !== ""){
        ddoption["xmmc"] = {$regex: xmmc};
    };
    if (khmc !== ""){
        ddoption["khmc"] = {$regex: khmc};
    };

    let sql = {fhje:{$exists:true}};
    if (cpfl !== ""){
        sql["cpfl"] = {$regex: cpfl};
    };
    if (bsc !== ""){
        sql["bsc"] = {$regex: bsc};
    };
    if (fzr !== ""){
        sql["fzr"] = {$regex: fzr};
    };
    if (fhnd !== ""){
        sql["fhnd"] = fhnd;
    };
    if (fhyf !== ""){
        sql["fhyf"] = Number(fhyf);
    };
    //console.log(sql);

    let getData = IndentCollection.aggregate([
        {$match:ddoption},
        {$unwind:"$device"},
        {$project:{ddbh:1, xmmc:1, xmfl:1, khmc:1, dxm:1,
            cpfl:"$device.cpfl", sbxh:"$device.sbxh", sbxs:"$device.sbxs",
            bsc:"$device.bsc", fzr:"$device.fzr", ygbh:"$device.ygbh",
            shipment:"$device.shipment"}},
        {$unwind:{path:"$shipment", preserveNullAndEmptyArrays:true}},
        {$project:{ddbh:1, xmmc:1, xmfl:1, khmc:1, dxm:1,
            cpfl:1, sbxh:1, sbxs:1, bsc:1, fzr:1, ygbh:1,
            fhnd:"$shipment.fhnd", fhyf:"$shipment.fhyf",
            fhsl:"$shipment.fhsl", fhje:"$shipment.fhje" }},
        {$match:sql},
        {$sort:{fhnd:1,fhyf:1,ddbh:1}}
    ]);
    //console.log(getData);
    if ( getData ) {
        this.response.statusCode = 200;
        this.response.end(JSON.stringify( getData ));
    };
});

Router.route('/devicedetail/get', {where: 'server'}).get(function(){
    let request = this.request.query;
    let ddbh = func.trim(request.ddbh);
    let xmmc = func.trim(request.xmmc);
    let khmc = func.trim(request.khmc);
    let cpfl = func.trim(request.cpfl);
    let kjnd = func.trim(request.kjnd);
    let kjyf = func.trim(request.kjyf);
    let bsc = func.trim(request.bsc);
    let fzr = func.trim(request.fzr);
    let xmfl = func.trim(request.xmfl);
    let sshy = func.trim(request.sshy);

    let ddoption = {};
    if (ddbh !== ""){
        ddoption["ddbh"] = {$regex: ddbh};
    };
    if (xmmc !== ""){
        ddoption["xmmc"] = {$regex: xmmc};
    };
    if (khmc !== ""){
        ddoption["khmc"] = {$regex: khmc};
    };
    if (kjnd !== ""){
        ddoption["kjnd"] = kjnd;
    };
    if (kjyf !== ""){
        ddoption["kjyf"] = Number(kjyf);
    };

    let sql = {};
    if (cpfl !== ""){
        sql["cpfl"] = {$regex: cpfl};
    };
    if (bsc !== ""){
        sql["bsc"] = {$regex: bsc};
    };
    if (fzr !== ""){
        sql["fzr"] = {$regex: fzr};
    };
    if (xmfl !== ""){
        sql["xmfl"] = {$regex: xmfl};
    };
    if (sshy !== ""){
        sql["sshy"] = {$regex: sshy};
    };
    //console.log(sql);

    /*let getData = IndentCollection.aggregate([
        {$match:ddoption},
        {$unwind:{path:"$device", includeArrayIndex:"arrayIndex"}},
        {$project:{kjnd:1, kjyf:1, ddbh:1, xmmc:1, khmc:1,
                htzje:{$cond:[{$eq:["$arrayIndex",0]},"$htzje",0]},
                cpfl:"$device.cpfl", sbxh:"$device.sbxh",
                bsc:"$device.bsc", fzr:"$device.fzr", ygbh:"$device.ygbh",
                sbxs:"$device.sbxs", sbsl:"$device.sbsl", sbje:"$device.sbje",
                tcxs:"$device.tcxs", tcjs:"$device.tcjs", fysc:"$device.fysc", fyqt:"$device.fyqt",
                fyyj:"$device.fyyj", fykc:"$device.fykc", tszbjj:"$device.tszbjj",
                shipment:"$device.shipment"}},
        {$unwind:{path:"$shipment", preserveNullAndEmptyArrays:true}},
        {$group:{_id:{kjnd:"$kjnd", kjyf:"$kjyf", ddbh:"$ddbh",
                xmmc:"$xmmc", khmc:"$khmc", htzje:"$htzje",
                cpfl:"$cpfl", sbxh:"$sbxh", bsc:"$bsc", fzr:"$fzr", ygbh:"$ygbh",
                sbxs:"$sbxs", sbsl:"$sbsl", sbje:"$sbje",
                tcxs:"$tcxs", tcjs:"$tcjs", fysc:"$fysc", fyqt:"$fyqt",
                fyyj:"$fyyj", fykc:"$fykc", tszbjj:"$tszbjj"},
                fhsl:{$sum:"$shipment.fhsl"}, fhje:{$sum:"$shipment.fhje"} }},
        {$project:{_id:0, kjnd:"$_id.kjnd", kjyf:"$_id.kjyf", ddbh:"$_id.ddbh",
                xmmc:"$_id.xmmc", khmc:"$_id.khmc", htzje:"$_id.htzje",
                cpfl:"$_id.cpfl", sbxh:"$_id.sbxh", bsc:"$_id.bsc", fzr:"$_id.fzr",
                ygbh:"$_id.ygbh", sbxs:"$_id.sbxs", sbsl:"$_id.sbsl", sbje:"$_id.sbje",
                tcxs:"$_id.tcxs", tcjs:"$_id.tcjs", fysc:"$_id.fysc", fyqt:"$_id.fyqt",
                fyyj:"$_id.fyyj", fykc:"$_id.fykc", tszbjj:"$_id.tszbjj",
                fhsl:"$fhsl", fhje:"$fhje" }},
        {$match:sql},
        {$sort:{kjnd:1,kjyf:1,ddbh:1,htzje:-1}}
    ]);*/
    let getData = IndentCollection.aggregate([
        {$match:ddoption},
        {$unwind:{path:"$device", includeArrayIndex:"arrayIndex", preserveNullAndEmptyArrays:true}},
        {$project:{kjnd:1, kjyf:1, ddbh:1, xmmc:1, sshy:1, xmfl:1, khmc:1, dxm:1,
                htzje:{$cond:[{$eq:["$arrayIndex",0]}, "$htzje", {$cond:[{$eq:["$arrayIndex",null]},"$htzje", 0]} ]},
                cpfl:"$device.cpfl", sbxh:"$device.sbxh",
                bsc:"$device.bsc", fzr:"$device.fzr", ygbh:"$device.ygbh",
                sbxs:"$device.sbxs", sbsl:"$device.sbsl", sbje:"$device.sbje",
                tcxs:"$device.tcxs", tcjs:"$device.tcjs", fysc:"$device.fysc", fyqt:"$device.fyqt",
                fyyj:"$device.fyyj", fykc:"$device.fykc", ftjfy:"$device.ftjfy", tszbjj:"$device.tszbjj",
                fhsl:{$sum:"$device.shipment.fhsl"}, fhje:{$sum:"$device.shipment.fhje"} }},
        {$match:sql},
        {$sort:{kjnd:1,kjyf:1,ddbh:1,htzje:-1}}
    ]);
    //console.log(getData);
    if ( getData ) {
        this.response.statusCode = 200;
        this.response.end(JSON.stringify( getData ));
    };
});

Router.route('/commissiontotal/get', {where: 'server'}).get(function(){
    let request = this.request.query;
    let ddbh = func.trim(request.ddbh);
    let xmmc = func.trim(request.xmmc);
    let kjnd = func.trim(request.kjnd);
    let kjyf = func.trim(request.kjyf);

    let ddoption = {};
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

    let getData = IndentCollection.aggregate([
        {$match:ddoption},
        {$unwind:"$device"},
        {$project:{ddbh:1, xmmc:1,
                xstc:{$sum:"$device.tcxs"}, ffje:{$sum:"$device.commission.ffje"} }},
        {$group:{_id:{ddbh:"$ddbh", xmmc:"$xmmc"},
                xstc:{$sum:"$xstc"}, ffje:{$sum:"$ffje"} }},
        {$project:{_id:0, ddbh:"$_id.ddbh", xmmc:"$_id.xmmc",
                xstc:"$xstc", ffje:"$ffje" }},
        {$sort:{ddbh:1}}
    ]);
    //console.log(getData);
    if ( getData ) {
        this.response.statusCode = 200;
        this.response.end(JSON.stringify( getData ));
    };
});

Router.route('/commissiondetail/get', {where: 'server'}).get(function(){
    let request = this.request.query;
    let ddbh = func.trim(request.ddbh);
    let xmmc = func.trim(request.xmmc);
    let kjnd = func.trim(request.kjnd);
    let kjyf = func.trim(request.kjyf);
    let ffsjb = func.trim(request.ffsjb);
    let ffsje = func.trim(request.ffsje);
    let ffry = func.trim(request.ffry);

    let ddoption = {};
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

    let sql = {};
    if (ffsjb !== ""){
        sql["ffsj"] = {$gte: ffsjb};
    };
    if (ffsje !== ""){
        sql["ffsj"] = {$lte: ffsje};
    };
    if (ffry !== ""){
        sql["ffry"] = {$regex: ffry};
    };
    //console.log(sql);

    let getData = IndentCollection.aggregate([
        {$match:ddoption},
        {$unwind:"$device"},
        {$project:{ddbh:1, xmmc:1,
                bsc:"$device.bsc", fzr:"$device.fzr", xstc:"$device.tcxs",
                commission:"$device.commission" }},
        {$unwind:{path:"$commission", preserveNullAndEmptyArrays:true}},
        {$project:{ddbh:1, xmmc:1, bsc:1, fzr:1, xstc:1,
                ffsj:"$commission.ffsj", skbl:"$commission.skbl",
                ffje:"$commission.ffje", ffry:"$commission.ffry",
                ffbsc:"$commission.ffbsc"}},
        {$match:sql},
        {$sort:{ddbh:1}}
    ]);
    //console.log(getData);
    if ( getData ) {
        this.response.statusCode = 200;
        this.response.end(JSON.stringify( getData ));
    };
});

Router.route('/paymentDetailList/get', {where: 'server'}).get(function(){
    let request = this.request.query;
    let ddbh = func.trim(request.ddbh);
    let xmmc = func.trim(request.xmmc);
    let khmc = func.trim(request.khmc);
    let zfrqb = func.trim(request.zfrqb);
    let zfrqe = func.trim(request.zfrqe);
    let zfbsc = func.trim(request.zfbsc);
    let xszjbwsh = request.xszjbwsh;

    let ddoption = {};
    if (ddbh !== ""){
        ddoption["ddbh"] = {$regex: ddbh};
    };
    if (xmmc !== ""){
        ddoption["xmmc"] = {$regex: xmmc};
    };
    if (khmc !== ""){
        ddoption["khmc"] = {$regex: khmc};
    };

    let sql = {}, rq = {};
    if (zfrqb !== ""){
        rq["$gte"] = zfrqb;
    };
    if (zfrqe !== ""){
        rq["$lte"] = zfrqe;
    };
    if (!check.isObjectNull(rq)){
        sql["zfrq"] = rq;
    };
    
    if (zfbsc !== ""){
        sql["zfbsc"] = {$regex: zfbsc};
    };
    if (xszjbwsh === "true"){
        sql["zjbsh"] = false;
    };
        
    //console.log(sql);
    let getData = IndentCollection.aggregate([
        {$match:ddoption},
        {$unwind:"$officePay"},
        {$project:{ddbh:1, xmmc:1, khmc:1,
                zfbsc:"$officePay.zfbsc", zfrq:"$officePay.zfrq", fylb:"$officePay.fylb",
                zfje:"$officePay.zfje", zfbz:"$officePay.zfbz", zjbsh:"$officePay.zjbsh" }},
        {$match:sql},
        {$sort:{ddbh:1}}
    ]);
    //console.log(getData);
    if ( getData ) {
        this.response.statusCode = 200;
        this.response.end(JSON.stringify( getData ));
    };
});

Router.route('/paymentStatusPayList/get', {where: 'server'}).get(function(){
    let request = this.request.query;
    let ddbh = func.trim(request.ddbh);
    let xmmc = func.trim(request.xmmc);
    let khmc = func.trim(request.khmc);
    let zfrqb = func.trim(request.zfrqb);
    let zfrqe = func.trim(request.zfrqe);
    let xszjbwsh = request.xszjbwsh;

    let ddoption = {};
    if (ddbh !== ""){
        ddoption["ddbh"] = {$regex: ddbh};
    };
    if (xmmc !== ""){
        ddoption["xmmc"] = {$regex: xmmc};
    };
    if (khmc !== ""){
        ddoption["khmc"] = {$regex: khmc};
    };

    let sql = {}, rq = {};
    if (zfrqb !== ""){
        rq["$gte"] = zfrqb;
    };
    if (zfrqe !== ""){
        rq["$lte"] = zfrqe;
    };
    if (!check.isObjectNull(rq)){
        sql["zfrq"] = rq;
    };
    
    if (xszjbwsh === "true"){
        sql["zjbsh"] = false;
    };
        
    //console.log(sql);
    let getData = IndentCollection.aggregate([
        {$match:ddoption},
        {$unwind:"$dealerPay"},
        {$project:{ddbh:1, xmmc:1, khmc:1,
                zfrq:"$dealerPay.zfrq", zfje:"$dealerPay.zfje", zfbz:"$dealerPay.zfbz", 
                zfbfb:"$dealerPay.zfbfb", zjbsh:"$dealerPay.zjbsh" }},
        {$match:sql},
        {$sort:{ddbh:1}}
    ]);
    //console.log(getData);
    if ( getData ) {
        this.response.statusCode = 200;
        this.response.end(JSON.stringify( getData ));
    };
});

Router.route('/paymentStatusCashList/get', {where: 'server'}).get(function(){
    let request = this.request.query;
    let ddbh = func.trim(request.ddbh);
    let xmmc = func.trim(request.xmmc);
    let khmc = func.trim(request.khmc);
    let skrqb = func.trim(request.skrqb);
    let skrqe = func.trim(request.skrqe);

    let ddoption = {};
    if (ddbh !== ""){
        ddoption["ddbh"] = {$regex: ddbh};
    };
    if (xmmc !== ""){
        ddoption["xmmc"] = {$regex: xmmc};
    };
    if (khmc !== ""){
        ddoption["khmc"] = {$regex: khmc};
    };

    let sql = {}, rq = {};
    if (skrqb !== ""){
        rq["$gte"] = skrqb;
    };
    if (skrqe !== ""){
        rq["$lte"] = skrqe;
    };
    if (!check.isObjectNull(rq)){
        sql["skrq"] = rq;
    };
            
    //console.log(sql);
    let getData = IndentCollection.aggregate([
        {$match:ddoption},
        {$unwind:"$cash"},
        {$project:{ddbh:1, xmmc:1, khmc:1,
                skrq:"$cash.skrq", skje:"$cash.skje", skbfb:"$cash.skbfb" }},
        {$match:sql},
        {$sort:{ddbh:1}}
    ]);
    //console.log(getData);
    if ( getData ) {
        this.response.statusCode = 200;
        this.response.end(JSON.stringify( getData ));
    };
});

Router.route('/paywarn/get', {where: 'server'}).get(function(){
    let request = this.request.query;
    let ddbh = func.trim(request.ddbh);
    let xmmc = request.xmmc;

    let date = func.dateToStr(new Date()); //获取当天的日期
    let sql = {sktxr:{$lte:date}, sksfsk:false};
    if (ddbh !== ""){
        sql["ddbh"] = {$regex: ddbh};
    };

    if (xmmc !== ""){
        sql["xmmc"] = {$regex: xmmc};
    };
    //console.log(sql);

    let getData = IndentCollection.aggregate([
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
    let request = this.request.query;
    let ddbh = func.trim(request.ddbh);
    let xmmc = request.xmmc;

    let date = func.dateToStr(new Date()); //获取当天的日期
    let sql = {pptxr:{$lte:date}, ppsfgb:false};
    if (ddbh !== ""){
        sql["ddbh"] = {$regex: ddbh};
    };

    if (xmmc !== ""){
        sql["xmmc"] = {$regex: xmmc};
    };
    //console.log(sql);

    let getData = IndentCollection.aggregate([
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
    let request = this.request.query;
    let limit = request.limit;
    let offset = request.offset;
    let yhmc = request.search;
    //console.log(yhmc);

    let sql = {};
    if (yhmc) {
        if (yhmc !== ""){
            sql["username"] = {$regex: yhmc};
        };
    };
    //console.log(sql);

    let getData = Meteor.users.find(sql, {fields:{username:1},
    	sort: {username: 1}, limit: Number(limit), skip: Number(offset)});
    if ( getData ) {
        this.response.statusCode = 200;
        this.response.end(JSON.stringify( {"total": getData.count(), "rows": getData.fetch() } ));
    };
});

