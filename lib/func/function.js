//转换为数字，如果转换错位则返回0
toNumber = function(num){
    var f = Number(num);
    if (isNaN(f)) {
        return 0;
    };
    return f;
};

//四舍五入，n-保留的位数
toDecimal = function (num, n){ 
	var f = parseFloat(num);
	if (isNaN(f)) {
		return 0; 
	};
	if (isNaN(n)) {
		n = 0;
	};
	f = Math.round(num*Math.pow(10,n))/Math.pow(10,n); 
	return f; 
};

//四舍五入，强制保留两位小数
toTwoDecimal = function(num){
	var num = toDecimal(num, 2);
	var xsd = num.toString().split(".");
	if(xsd.length==1){
		num = num.toString()+".00";
		return num;
	};
	if(xsd.length>1){
		if(xsd[1].length<2){
			num = num.toString()+"0";
		};
		return num;
	};
};

//转换为字符串，如果为null则返回''
toString = function(str){
    var s = String(str);
    if (s == "undefined" || s == "null") {
        return '';
    };
    return s;
};

//去除左侧空格
lTrim = function (str)
{
    return str.replace(/^\s*/g,"");
};

//去右空格
rTrim = function (str)
{
    return str.replace(/\s*$/g,"");
};

//去掉字符串两端的空格
trim = function (str)
{
    return str.replace(/(^\s*)|(\s*$)/g, "");
};

//去除字符串中间空格
cTrim = function (str)
{
    return str.replace(/\s/g,'');
};

//将格式为'yyyy-mm-dd'的字符串转为日期
strToDate = function (str)
{
    s = str.replace(/-/g,"/");
    return new Date(s);
};

//将日期转为格式为'yyyy-mm-dd'的字符串
dateToStr = function (curDate)
{
    var year = curDate.getFullYear();
    var month =(curDate.getMonth() + 1).toString();
    var day = (curDate.getDate()).toString();
    if (month.length == 1) {
        month = "0" + month;
    }
    if (day.length == 1) {
        day = "0" + day;
    }
    return year + '-' + month + '-' + day;
};

//日期加n天(如果n是负数，则表示减n天)
addDay = function (curDate, n)
{
    return new Date(curDate.getTime() + 24*60*60*1000*n);
};

//深度克隆一个对象，因为对象是引用赋值，所以不能简单用=来赋值一个对象
cloneObject = function (obj)
{
    var o,i,j,k;
    if(typeof(obj)!="object" || obj===null)return obj;
    if(obj instanceof(Array))
    {
        o=[];
        i=0;j=obj.length;
        for(;i<j;i++)
        {
            if(typeof(obj[i])=="object" && obj[i]!=null)
            {
                o[i]=arguments.callee(obj[i]);
            }
            else
            {
                o[i]=obj[i];
            }
        }
    }
    else
    {
        o={};
        for(i in obj)
        {
            if(typeof(obj[i])=="object" && obj[i]!=null)
            {
                o[i]=arguments.callee(obj[i]);
            }
            else
            {
                o[i]=obj[i];
            }
        }
    };

    return o;
};


