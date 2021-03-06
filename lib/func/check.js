//判断是否字符长度大于零
export function emptyString(str)
{
	if (str){
		return str.length = 0;
	}else{
		return true;
	};	
};

// 判断字符全部由a-Z或者是A-Z的字字母组成
export function isLetters(str)
{
    var reg=/^[A-Za-z]+$/;
    return reg.test(str);
};

// 判断字符由字母和数字组成。
export function isLetterOrNum(str)
{
    var reg=/^[A-Za-z0-9]+$/;
    return reg.test(str);
};

//是否为整数组成的字符串
export function isDigitals(str) 
{ 
	var reg=/^[0-9]*$/;
	return reg.test(str); 
};

//验证是否为整数，包括正负数； 
export function isInt(str) 
{ 
	var reg=/^(-|\+)?\d+$/; 
	return reg.test(str); 
};

//验证是否为大于0的整数
export function isPositiveNum(str) 
{ 
	var reg=/^[1-9][0-9]*$/;
	return reg.test(str); 
};

//验证是否为大于0的浮点数或整数
export function isPositiveFloat(str)
{
    var reg=/^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/;
    return reg.test(str);
};

//验证是否为浮点数或整数
export function isFloat(str)
{
	var reg=/^(-?\d+)(\.\d+)?$/;
    return reg.test(str);
};

//负整数的验证
export function isMinusNum(str)
{ 
	var reg=/^-\d+$/;
	return reg.test(str); 
};

//负浮点数的验证
export function isMinusFloat(str)
{
    var reg=/^-([1-9]\d*\.\d*|0\.\d*[1-9]\d*)$/;
    return reg.test(str);
};

//手机号码验证，验证1开头的号码，长度11位 
export function isMobe(str) 
{ 
	var reg = /^1\d{10}$/; 
	return (reg.test(str));
};

//验证是否为中文 
export function isChinese(str) 
{ 
	var reg=/^[\u0391-\uFFE5]+$/; 
	return reg.test(str); 
};

//验证是否为email 
export function isEmail(str) 
{ 
	var reg=/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/; 
	return reg.test(str); 
};

//验证是否为日期格式，形如 (2003-12-05)
export function isDate(str) 
{ 
    var reg=/^\d{4}-\d{2}-\d{2}/;
    return reg.test(str);
};

//验证object对象是否为空，如果为空返回true
export function isObjectNull(obj) 
{ 
    return Object.keys(obj).length === 0;
};