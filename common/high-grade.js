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



