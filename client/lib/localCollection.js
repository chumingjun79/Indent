LocalIndent = new Mongo.Collection(null); //本地临时数据集

//更新本地数据集的通用函数
export function updateLocalIndent(id, modifier){
	LocalIndent.update({'_id': id}, modifier);
};

//判断本地数据的保存时间是否与服务器上的不一致，如果不一致为true
export function changeLocalIndent(id){
    let savetime = LocalIndent.findOne(id).savetime;
    let databasetime = IndentCollection.findOne(id).savetime;
    if (!databasetime) return false; 
    if (!savetime && databasetime) return true;
    return savetime - databasetime !== 0; 
};