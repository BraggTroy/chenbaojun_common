

var txt1 = document.createTextNode('123')
document.getElementById("txtNode").appendChild(txt1);


var div1 = document.createElement('div')
div1.innerHTML = '<p>创造div元素</p>'
document.getElementById("txtNode").appendChild(div1);

var ins = document.getElementById("ins")
var li1 = document.createElement('li')
ins.insertBefore(li1,ins.childNodes[0])

''.trim()



// var fd = new Food2('肉',100)
// console.log(fd)




// 数据的双向绑定测试
var obj = {
    pwd: '123'
}
Object.defineProperty(obj,'name', {
    get: function (val) {
        console.log('get-val',val)
        console.log("obj get");

    },
    set: function (val) {
        console.log('set-val', val)
        console.log("obj set");
        document.getElementById("name-span").innerText = val;
    }
})
Object.defineProperty(obj,'pwd', {
    get: function (val) {
        console.log('get-val',val)
        console.log("obj get");

    },
    set: function (val) {
        console.log('set-val', val)
        console.log("obj set");
        document.getElementById("name-span").innerText = val;
    }
})

document.getElementById("name").addEventListener("keyup", function (e) {
    obj.name = e.target.value;
})








