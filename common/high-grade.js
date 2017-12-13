"use strict";
// JavaScript高级程序设计， JS中高级方法的使用
// 搜索方法，'.'+方法名+'()'

// 官方网站：https://developer.mozilla.org/zh-CN/docs/Web/JavaScript

/**
 * fun.call(thisArg, arg1, arg2, ...);
 * 第一个参数为this
 * ======================.call()=====================
 */

/**
 * throw RangeError('Cannot create product ' +
    this.name + ' with a negative price');
    表现为控制台报错，“Uncaught RangeError:”
 * @param name
 * @param price
 * @constructor
 */
function Product(name, price) {
    this.name = name;  // this指的是Product
    this.price = price;

    if (price < 0) {
        throw RangeError('Cannot create product ' +
            this.name + ' with a negative price');
    }
}
function Food(name, price) {
    Product.call(this, name, price);
    this.category = 'food';
}

//等同于
function Food2(name, price) {
    this.name = name;
    this.price = price;
    if (price < 0) {
        throw RangeError('Cannot create product ' +
            this.name + ' with a negative price');
    }

    this.category = 'food';
}


/**
 * 使用call方法调用函数并且指定上下文的'this'
 * 当调用 greet 方法的时候，该方法的 this 值会绑定到 i 对象。
 */
function greet() {
    var reply = [this.person, 'Is An Awesome', this.role].join(' ');
    console.log(reply);
}
var i = {
    person: 'Bragg Troy', role: 'Javascript Developer'
};
greet.call(i); // Bragg Troy Is An Awesome Javascript Developer


/**
 * 使用call方法调用匿名函数
 * 在下例中的for循环体内，我们创建了一个匿名函数，这个匿名函数的主要目的是给每个数组元素对象添加一个print方法
 */
var animals = [
    {species: 'Lion', name: 'King'},
    {species: 'Whale', name: 'Fail'}
];

for (var i = 0; i < animals.length; i++) {
    (function (i) {
        this.print = function () {
            console.log('#' + i  + ' ' + this.species + ': ' + this.name);
        }
        // this.print();
    }).call(animals[i], i);
}
// 调用 如： animals[0].print() -> 输出：#0 Lion: King


/**
 * 数组相关的方法 Array
 * ===========================Array.prototype.fun EcmaScript5.js======================
 */
// .every()方法测试数组中的所有元素是否通过了由提供的函数实现的测试。
function isBelowThreshold(currentValue) {
    return currentValue < 40;
}
var array1 = [1, 30, 39, 29, 10, 13];
console.log(array1.every(isBelowThreshold));
console.log(array1.every(i => i < 30));


// .filter()方法创建一个新的数组，其中包含所有通过所提供函数实现的测试的元素。
function lengthFilter(currentValue) {
    return currentValue.length > 6 ? currentValue : ''
}
var words = ['spray', 'limit', 'elite', 'exuberant', 'destruction', 'present'];
const result = words.filter(i => i.length > 6);
console.log(result);
const result2 = words.filter(lengthFilter);
console.log(result2);


// 常用循环
// .map(function(currentValue, index) 生成包含返回值的新的对象
// .forEach(function(currentValue, index)) 调用数组的每个元素，并将元素传递给回调函数
// 内部处理，不影响原数组
var materials = [
    'Hydrogen',
    'Helium',
    'Lithium',
    'Beryllium'
];
materials.map(function(material) {
    return material.length;
}); // 有返回值，[8, 6, 7, 9]
materials.forEach(function(material) {
    // return material.length;  // 接收不到的
}); // 无返回值 undefined


// .reduce()方法接收一个函数作为累加器，数组中的每个值（从左到右）开始缩减，最终计算为一个值。
// array.reduce(function(total, currentValue, currentIndex))
// 方案一
var arr = [5, 6, 13, 0, 1, 18, 23];
var sum = arr.reduce((a, b) => a + b);
// 方案二
function getSum(total, num) {
    return total + num;
}
arr.reduce(getSum);



/**
 * 箭头函数 =>
 * 箭头函数表达式的语法比函数表达式更短，并且不绑定自己的this，arguments，super或 new.target。
 * 这些函数表达式最适合用于非方法函数，并且它们不能用作构造函数。
 * 箭头函数没有prototype属性。
 * 参考网址： https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/Arrow_functions
 */
var obj = {
    i: 10,
    b: () => console.log(this.i, this),  // 该this指向了window
    c: function() {
        console.log( this.i, this)
    }
}
//obj.b();  // undefined
//obj.c();  // 10, Object {...}

// 鉴于 this 是词法层面上的，严格模式中与 this 相关的规则都将被忽略。
var f = () => {'use strict'; return this};
//f() === window; // 或全局对象 返回true






/**
 * 高级程序设计之 Object
 * 参考网址： https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object
 *
 */

