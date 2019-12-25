/*说明：用ES6改写2.0的webapp.js
*使用方法：
*1、在组件顶部导入： import  webapp from 'Res/js/webapp'
* */
const webapp = {};
/*url增加参数
* @url url
* @value 参数以及值
* */
webapp.appendUrlPara = (url,value) => {
    if(url.indexOf('?')>-1){
        return url += '?'+value;
    }else{
        return url += '&'+value;
    }
};
/*数组快速排序-升序
* @pivot 基准值，默认为第一个
* @rest 除基准值以外的值的数组。
* Usage: quickSortAsc([2331])
* Result [1233]
* */
webapp.quickSortAsc = (arr) =>{
    if(!arr.length){return []}
    const [pivot,...rest] = arr;
    return [
        ...webapp.quickSortAsc(rest.filter(x=>x<pivot)),
        pivot,
        ...webapp.quickSortAsc(rest.filter(x=>x>=pivot))
    ]
};
/*数组快速排序-降序
 * @pivot 基准值，默认为第一个
 * @rest 除基准值以外的值的数组。
 * Usage: quickSortDesc([2331])
 * Result [3321]
 * */
webapp.quickSortDesc = (arr) =>{
    if(!arr.length){return []}
    const [pivot,...rest] = arr;
    return [
        ...webapp.quickSortDesc(rest.filter(x=>x>pivot)),
        pivot,
        ...webapp.quickSortDesc(rest.filter(x=>x<=pivot))
    ]
};
/*对象属性值-快速排序-升序
 * @arr 数组对象
 * @key 属性名
 * Usage: quickSortObjDesc([{a:2},{a:1},{a:3}],'a'))
 * Result:: [{"a":1},{"a":2},{"a":3}]
 * */
webapp.quickSortObjAsc = (arr,key) =>{
    if(!arr.length){return []}
    let[pivot,...rest] = arr;
    return [
        ...webapp.quickSortObjAsc(rest.filter(x=>x[key]<pivot[key]),key),
        pivot,
        ...webapp.quickSortObjAsc(rest.filter(x=>x[key]>=pivot[key]),key)
    ]
};

/*对象属性值-快速排序-降序
* @arr 数组对象
* @key 属性名
* Usage: quickSortObjDesc([{a:2},{a:1},{a:3}],'a'))
* Result:: [{"a":3},{"a":2},{"a":1}]
* */
webapp.quickSortObjDesc = (arr,key) =>{
    if(!arr.length){return []}
    let[pivot,...rest] = arr;
    return [
        ...webapp.quickSortObjDesc(rest.filter(x=>x[key]>pivot[key]),key),
        pivot,
        ...webapp.quickSortObjDesc(rest.filter(x=>x[key]<=pivot[key]),key)
    ]
};

/**
 * 一维数组去重
 */
webapp.removeDuplicates = (arr)=>{
    if(!arr || arr.constructor!==Array){
        throw new Error('removeDuplicates need a array')
    }
    return [...new Set(arr)]
};
/*一维数组合并去重,
* @order 升降序，取值asc/desc/other,必填
* @arr 数组，可多填
* Usage: unique('asc',[2,3,3,1],[4,3])
* Result [1,2,3,4]
* 字符串和数字之间不重复，'5'和5不重复
* */
webapp.unique = (order = 'default',...arr) => {
    let a;
    let c = [];
    for(let i of arr){
        c.push(...i);
    }
    a = Array.of(...new Set(c));
    switch (order){
        case 'asc':
            a = webapp.quickSortAsc(a);
            break;
        case 'desc':
            a = webapp.quickSortDesc(a);
            break;
        default:
            break;
    }
    return a;
};
/*数组对象去重
* @key,关键字，...arr 多个数组
* */
webapp.arrObjUnique = (key,...arr) => {
    let a;
    let b = [];
    let c = [];
    for(let i of arr){
        c.push(...i);
    }
    b = [];
    c.forEach((i,index)=>{
        let bol = false;
        b.forEach((j)=>{
            if(i[key]===j[key]){
                bol = true
            }
        });
        if(bol) return;
        b.push(i)
    });
    return b;
};
/*删除数组某个元素
* */
webapp.deleteArrMember = (arr,member)=>{
    if(typeof arr !=='object') return arr;
    let index;
    if(arr.includes(member)){
        index = arr.indexOf(member);
        arr.splice(index, 1);
    }
    return arr
};
/*删除数组对象符合条件的对象
*   @key 关键字 @keyValue关键字值 @dataList 数组对象
* */
webapp.deleteArrObjMember = (key,keyValue,dataList)=>{
    if(typeof dataList !=='object') return dataList;
    for(let i=0;i<dataList.length;i++){
        if(dataList[i][key] === keyValue){
            dataList.splice(i,1);
            break;
        }
    }
    return dataList
};
/**
 * 深拷贝，需要考虑sourceObj是数组的情况。
 * @param sourceObj 被拷贝的对象。
 * @returns {*}
 * Usage: deepClone({a:123})
 * Result {a:123}
 */
webapp.deepClone = (sourceObj)=>{
    if(typeof sourceObj !=='object') return;
    const type = sourceObj.constructor;
    let obj = type===Array?[]:{};
    if(type===Array){
        for(let i of sourceObj){
            if(i.constructor === Array){
                obj.push(this.deepClone(i));
            }else{
                obj.push(i);
            }
        }
    }else{
        for (let i in sourceObj){
            if(typeof sourceObj[i] === 'object'){
                // console.log(true)
                obj[i] = webapp.deepClone(sourceObj[i]);
            }else{
                obj[i] = sourceObj[i];
            }
        }
    }
    return obj;
};
/*url中取参
* 返回一个JSON对象
* */
webapp.getUrlParam = ()=>{
    let url = window.location.href;
    let paraString = url.substring(url.indexOf('?')+1,url.length).split('&');
    let obj = {};
    for(let i of paraString){
        let name = i.substring(0,i.indexOf('='));
        obj[name] = i.substring(i.indexOf('=')+1,i.length);
    }
    return obj
};
/*删除字符串左右两端空格
* @str 字符串
* */
webapp.trim = (str) => {
    if(str===null || str===undefined){
        str = ''
    }
    return str.replace(/(^\s*)|(\s*$)/g, '');
};
/*删除字符串左端空格
* @str 字符串
* */
webapp.trimLeft = (str) => {
    if(str===null || str===undefined){
        str = ''
    }
    str = str.replace(/(^\s*)/g, '');
    return str
};
/*删除字符串右端空格
* @str 字符串
* */
webapp.trimRight = (str) => {
    if(str===null || str===undefined){
        str = ''
    }
    return str.replace(/(\s*$)/g, '');
};
/*批量删除字符串左右两端空格
 * @str 字符串
 * */
webapp.trimAll = (obj) => {
    for(let a in obj){
        if(obj[a] === false){
            obj[a] = '0'
        }else if(obj[a] === true){
            obj[a] = '1'
        }
        obj[a] = webapp.trim(obj[a])
    }
    return obj
    // if(str===null || str===undefined){
    //     str = ''
    // }
    // return str.replace(/(\s*$)/g, '');
};


/*格式化浮点数，保留小数并四舍五入
* @num 浮点数
* @digit 位数,选填,默认为2
* 不对NAN进行处理，方便报错。
* Usage: floatNumFormatted(1)
* Result 1.00
* */
webapp.floatNumFormatted = (num,digit = 2) => Number.parseFloat(num).toFixed(digit);
/*格式化文件大小
* @size 文件大小，单位：字节
* 不对NAN进行处理，方便报错
* Usage: fileSizeFormatted(5439)
* Result 5.31KB
* */
webapp.fileSizeFormatted = (size = 'default') =>{
    size = Number.parseInt(size);
    let i = 0;
    let unit = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB', 'BB'];
    let getIndex = (_size) => {
        if(_size >= 1024){
            i++;
            return getIndex(_size / 1024);
        }
        return _size;
    };
    return  webapp.floatNumFormatted(getIndex(size),2) + ' ' + unit[i];
};
/**
 * 文件类型判断
 * @param file 文件
 * @param suffix 支持的后缀
 * @param fileType 类别
 * 若合法返回true，否则返回false
 */
webapp.fileCheck = (file,suffix = [],fileType)=>{
    if(!file || !file.type) return false;
    const {type,name} = file;
    suffix = suffix.map((i)=>{
        return i.toLowerCase()
    });
    if(suffix.includes(name)){
       return false
    }
    if(fileType === 'video'){
        return webapp.videoTypeCheck(type)
    }
};
/*数字阅读格式化，从右开始，每3位增加一个逗号，小数位不增加逗号
* @num 数字，string或者num都可。
* Usage: commaFormatted(2222.12356)
* Result 2,222.12356
* */
webapp.commaFormatted = (num) =>{
    num = num.toString();
    let a = num.split('.');
    let b = a[0];
    let c = a[1];
    let d = [];
    if(a.length > 2){
        return 'wrong Num'
    }
    while (b.length>3){
        let e = ',' + b.substring(b.length-3,b.length);
        b = b.substring(0,b.length - 3);
        d.unshift(e);
    }
    return b + d  +'.' + c;
};
/*保留小数点n位数并数字阅读格式化
* @num 数字
* @digit 位数
* Usage: moneyFormatted(2222.12356)
* Result 2,222.12
* */
webapp.moneyFormatted = (num,digit) => webapp.commaFormatted(webapp.floatNumFormatted(num,digit));

/*基数词序列化为序数词
* @num 数字
* 若有小数部分则小数部分被抹去。
* Usage: ordinalFormatted(22)
* Result 22st
* */
webapp.ordinalFormatted = (num) =>{
    num = Math.trunc(num);
    let a = num.toString();
    a = [...a];
    let b = a[a.length-1]%10;
    let c = ['th', 'st', 'nd', 'rd'];
    c.length = 10;
    c.fill('th',4,10);
    return num + c[b];
};
/*格式百分比化，并保留n位小数
* @数字
* @digit 位数，选填，默认值为2
* Usage: percentFormatted(6.565252)
* Result: 656.53%
* */
webapp.percentFormatted = (num,digit = 2) =>webapp.floatNumFormatted(num*100,digit) + '%';
/*获取cookie
*并转化为json格式
* Usage: cookieGet
* Result: {key:val,key2:val2}
* */
webapp.cookieGetAll = () =>{
    let a = document.cookie.split('; ');
    let c = {};
    if(a.length<1){
        return null
    }
    for(let i of a){
        let d = i.substring(0,i.indexOf('='));
        c[d] = i.substring(i.indexOf('=') + 1,i.length);
    }
    return c;
};
/*获取cookie指定值
* @key 键名
* Usage: cookieGetExact('username')
* Result: val
* */
webapp.cookieGetExact = (key) =>webapp.cookieGetAll()[key];
/*cookie设置
* @key 键名
* @val 键值
* @day 保存时间;单位：天;选填;默认为30天
* Usage: cookieSet('userName','lwz')
* */
webapp.cookieSet = (key,val,day = 30) =>{
    let data = new Date();
    data.setTime(data.getTime() + day * 24 * 60 *60 *1000);
    document.cookie = key + '=' + escape(val) + ';expires=' + data.toUTCString() + ';path = /';
};
/*cookie指定删除
* @keys 键名，支持输入多个，批量删除
* Usage: cookieSet('userName')
* */
webapp.cookieDeleteExact = (...keys) =>{
    for(let key of keys){
        let val = webapp.cookieGetExact(key);
        let data = new Date();
        data.setTime(data.getTime()-1);
        document.cookie = key + '=' + val + ';expires=' + data.toUTCString();
    }
};

/*cookie已有全部删除
 * Usage: cookieSet('userName')
 * */
webapp.cookieDeleteAll = () =>{
    let keys = webapp.cookieGetAll();
    for(let key in keys){
        let data = new Date();
        data.setTime(data.getTime()-1);
        document.cookie = key + '=' + keys[key] + ';expires=' + data.toUTCString();
    }
};

/*时间戳转日期
*@time 时间戳
* Usage timeFormatted(1503027486)
* Result 2017-7-18-11:38:06
* */
webapp.timeFormatted = (time,detail,ensp_)=>{
    time = time + '';
    if(time.length===0){
        return ''
    }
    if(time.length>10){
        time = time.substring(0,10)
    }
    time = Number.parseInt(time);
    time = new Date(time*1000);
    let [year,month,Data] = [time.getFullYear(),time.getMonth()+1,time.getDate()];
    let [hour,minute,second] = [time.getHours(),time.getMinutes(),time.getSeconds()].map(x => {
        if(x<10){
            return '0' + x;
        }else{
            return x
        }
    });
    if(detail){
        return year + '-' + month + '-' + Data + '-' + hour+ ':' + minute + ':' + second;
    }
    if(ensp_){
        return year + '-' + month + '-' + Data + ' ' + hour+ ':' + minute + ':' + second;
    }
    return year + '-' + month + '-' + Data;

};
/*时间戳之差，返回天，时，分，或秒
*@v1,@v2时间戳，顺序可以互换
*@unit 单位，可取值为d,h,m,s 对应天，时，分，秒。默认为秒。
* Usage getDiffStamp(1502854686,1503027486,'d');
* Result 2
* */
webapp.getDiffStamp = (v1,v2,unit = 's')=>{
    [v1,v2] = [new Date(parseInt(v1)*1000),new Date(parseInt(v2)*1000)];
    const a = {};
    a.s = Math.abs(v1 - v2);
    a.d = a.s/(1000 * 60 * 60 * 24);
    a.h = a.d * 24;
    a.m = a.d * 24 * 60;
    return a[unit]
};
/*提取文件后缀名
* @name 文件名
* Usage getSuffix('123.html')
* Result html
* */
webapp.getSuffix =(x)=> x.split('.').pop();
/*检查图片文件的类型是否正确
*
* */
webapp.imageTypeCheck = (x)=>{
    if(!x) return;
    let arr = ['image/png','image/bmp','image/jpeg','image/gif'];
    return arr.includes(x);
};
webapp.videoTypeCheck = (x)=>{
    if(!x) return;
    let arr = ['video/mp4','video/avi','video/mov','video/flv'];
    return arr.includes(x);
};
/*输入负数从后面读取数组数据
* @elements 数组
* Usage: let a = reArrayGet(['a','b','c']);a[-1]
* Result: c
* 把数组放进去就可，吐出来的数组就可以拥有这个特性。
* */
webapp.reArrayGet = (elements)=>{
    let handler = {
        get(target,propKey){
            let index = Number(propKey);
            if(index<0){
                propKey = String(target.length + index);
            }
            return Reflect.get(target,propKey);//获取数组默认行为
        }
    };
    return new Proxy(elements,handler)
};
/*中序遍历一棵二叉树
* @tree 二叉树数组
* Usage: binaryTree([[['a'], 'b', ['c']], 'd', [['e'], 'f', ['g']]])
* Result:  ["a", "b", "c", "d", "e", "f", "g"]
* */
webapp.binaryTree =(tree)=>{
    let trees = make(tree);
    let treeArr = [];
    function Tree(left,label,right) {
        this.left = left;
        this.label = label;
        this.right = right;
    }
    function* inorder(t){
        if(t){
            yield* inorder(t.left);
            yield t.label;
            yield* inorder(t.right);
        }
    }
    function make(array){
        if(array.length===1){
            return new Tree(null,array[0],null);
        }else{
            return new Tree(make(array[0]),array[1],make(array[2]));
        }
    }
    for(let i of inorder(trees)){
        treeArr.push(i);
    }
    return treeArr;
};


/**
 *  将字符串转成 数组, 移除 [ ] 空格
 * @param str :'[a,b,c]' => [a,b,c]
 */
webapp.str2Arr = function (str) {
    if(typeof str === 'string'){
        return str.replace(/[\[\]\s]/g,"").split(",");
    }
    return str;
}
/*清除cookie以及sessionStorage以及localStorage
* */
webapp.quit = ()=>{
    webapp.cookieDeleteAll();
    window.sessionStorage.clear();
    window.localStorage.clear();
};
/*sleep方法。
*@msec 毫秒
* Usage：sleep(1000) 1000毫秒后执行后续程序。
* */
webapp.sleep =(msec)=>{
   let a = new Date().getTime();
   while (new Date().getTime() < a + msec);
} ;
/*将post请求初始化成fetch的body能接受的结构
 *@obj 对象
 *usage:postObjInit({name:'oak160',age:18})
 *result: name=oak160&age=18
 * */
webapp.postObjInit = (obj)=>{
    let a = '';
    if(typeof obj !== 'object'){
        return
    }
    for(let i in obj){
        a += '&' + i + '=' + obj[i]
    }
    return a.substring(1,a.length)
};
/**
 * 生成网页端数据guid
 * 以A开头
 */
webapp.getGUID = ()=> {
    var d = new Date().getTime();
    var uuid = 'Axxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    uuid = `A${uuid}`.toUpperCase();
    return uuid;
};
/** 格式化字符串
 *   Usage:  format_number(12345.678, 2);
 *   result: 12345.68
 **/
function format_number(pnumber, decimals) {
    if (isNaN(pnumber)) {
        return 0
    };
    if (pnumber == '') {
        return 0
    };
    //判断是否是负数,先转成正数
    var isMinus = false;
    if (pnumber < 0) {
        isMinus = true;
        pnumber = Math.abs(pnumber);
    }
    var snum = new String(pnumber);
    var sec = snum.split('.');
    var whole = parseFloat(sec[0]);
    var result = '';

    if (sec.length > 1) {
        var dec = new String(sec[1]);
        dec = String(parseFloat(sec[1]) / Math.pow(10, (dec.length - decimals)));
        dec = String(whole + Math.round(parseFloat(dec)) / Math.pow(10, decimals));
        var dot = dec.indexOf('.');
        if (dot == -1) {
            dec += '.';
            dot = dec.indexOf('.');
        }
        while (dec.length <= dot + decimals) {
            dec += '0';
        }
        result = dec;
    } else {
        var dot;
        var dec = new String(whole);
        dec += '.';
        dot = dec.indexOf('.');
        while (dec.length <= dot + decimals) {
            dec += '0';
        }
        result = dec;
    }
    //防止1.7392078638076782-0.34743452072143555 这种情况出现1.3900000000000001
    result = result.substring(0, result.indexOf(".") + decimals + 1);
    //把负号补回
    if (isMinus) {
        result = "-" + result;
    }
    return result;
}
/**
 * 格式化文件大小,基础单位是字节,如3240791 -> 3.08 M
 * @param size
 * @returns
 */
webapp.formatFileSizeByByte = (size)=> {
    if (size == undefined || size == '') {
        return "";
    }
    if (isNaN(size)) {
        return size;
    }
    var i = 0;

    function getIndex(_size) {
        var step = 1024;
        if (_size >= step) {
            i++;
            return getIndex(_size / step);
        }
        return _size;
    }
    var unit = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB", "BB"];
    var rs = getIndex(size);
    return format_number(rs, 2) + " " + unit[i];
};

//将二级制文件另存为图片并下载
webapp.downloadFile = (fileName, content) => {
    let aLink = document.createElement('a');
    let blob = base64ToBlob(content); //new Blob([content]);

    let evt = document.createEvent("HTMLEvents");
    evt.initEvent("click", true, true);//initEvent 不加后两个参数在FF下会报错  事件类型，是否冒泡，是否阻止浏览器的默认行为
    aLink.download = fileName;
    aLink.href = URL.createObjectURL(blob);
    aLink.click()
}
//base64转blob
function base64ToBlob(code) {
    let parts = code.split(';base64,');
    let contentType = parts[0].split(':')[1];
    let raw = window.atob(parts[1]);
    let rawLength = raw.length;

    let uInt8Array = new Uint8Array(rawLength);

    for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
    }
    return new Blob([uInt8Array], {type: contentType});
}
webapp.base64ToBlob = base64ToBlob;
/*正则表达式匹配draft产生的content中的src。*/
webapp.getImgFromContentState = (str)=>{
    let img = /"url":\"([^\"]*?)\"/gi;
    let arr  = str.match(img);
    arr = arr===null?[]:arr;
    let imgArr = [];
    for(let i of arr){
        let a = i.split("\\");
        let b = a[a.length-1];
        b = b.substring(0,b.length-1);
        imgArr.push(b);
    }
    return imgArr
};
export default webapp;
/*让对象部署iterator接口
* @obj 对象
* Usage:
* let myObj = {'for':3,'bar':7}; iterEntries(myObj);
* for(let i of iterEntries(myObj)){
    log(i);
 }
* Result: ['foo':3] ['bar':7]
* */
// function* iterEntries(obj){
//     let keys = Object.keys(obj);//获取键名
//     for(let i=0;i<keys.length;i++){
//         let key = keys[i]; //键值
//         yield [key,obj[key]]; //部署next()
//     }
// }
//
// class Point{
//     constructor(x,y){
//         this.x = 'Px';
//         this.y = 'Py';
//         this.color = 'Pcolor'
//     }
//     toP(){
//         return this.y;
//     }
// }
// class P extends Point{
//     constructor(x){
//         // log(this.x); //报错 此时还没有通过super让this指向父类
//         super(x);
//         // log(this.x) //px
//         log(this.x);
//         log(x); //b   可见，super中的括号其实是传入的参数。和this是没有区别的。
//         this.x = 2;
//         this.y = 3;
//         log(super.toP());
//         //运行过程： super === 父类。 因此super.top()是调用父类的top()方法，
//         //于是，上面的代码变成log( return this.y;)
//         //但是，在super的内部，this是指向子类。因此this.y = 3
//         //所以运行结果为3
//     }
//     toString(){
//         return this.color + super.toP();
//         //this.color === 'Pcolor'
//         //super.toP()，调用的是父类的toP();
//         //super.toP() === 'this.y'
//         //this此时是P的this；
//         //this.y = 3;
//         //toString() return Pcolor3
//     }
// }
// let a = new P('b');
// // log(a.toString());