

var txt1 = document.createTextNode('123')
document.getElementById("txtNode").appendChild(txt1);


var div1 = document.createElement('div')
div1.innerHTML = '<p>创造div元素</p>'
document.getElementById("txtNode").appendChild(div1);

var ins = document.getElementById("ins")
var li1 = document.createElement('li')
ins.insertBefore(li1,ins.childNodes[0])





// var fd = new Food2('肉',100)
// console.log(fd)













