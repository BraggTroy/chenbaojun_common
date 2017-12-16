// 面试中常常涉及的前端问题

/**
 * 数组去重
 * 如何消除一个数组里面重复的元素？
 */
function noDouble() {
    var arr1 = [1,2,2,2,3,4,4,5,6,6,7],
        arr2 = [];
    for(var i=0; i<arr1.length; i++){
        if(arr2.indexOf(arr1[i]) < 0){
            arr2.push(arr[i]);
        }
    }
    return arr2;
}

/**
 * 精确判断对象的类型
 */
function getType() {
    var a = [];
    var res = Object.prototype.toString.call(a);  // 输出："[object Array]"
    // res.slice(8, -1) 可返回实际类型
    // res.indexOf('Array') > 0 返回true
    return res.slice(8, -1);
}
// instanceof
// 构造函数，判断某实例是否属于该类
function Person(){};
var p =new Person();
console.log(p instanceof Person)


/**
 * 数值型数组排序 js中sort方法
 */
function sorto() {
    var arrSimple2 = new Array(1,8,7,6);
    arrSimple2.sort(function(a,b){
        return a-b});  // 增序
    console.log(arrSimple2.join());

    arrSimple2.sort(function(a,b){
        return b-a}); // 降序
    console.log(arrSimple2.join());
}
// arr.reverse(); //将数组中元素倒置
// arr.slice(); arr.concat(); //实现复制数组
// arr.slice(startIndex,length); //截取数组从startIndex开始的length个元素


/**
 * http状态码
 */
/*
1**	信息，服务器收到请求，需要请求者继续执行操作
2**	成功，操作被成功接收并处理
3**	重定向，需要进一步的操作以完成请求
4**	客户端错误，请求包含语法错误或无法完成请求
5**	服务器错误，服务器在处理请求的过程中发生了错误
*/
// 常见状态码


/**
 * 正则表达式
 */











