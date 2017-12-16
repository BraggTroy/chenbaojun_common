
var test1 = new Vue({
    el: '#test1',
    data: {
        name: '陈宝俊',
        dynamicId: 'textId',
        isText: 'istxt',
        div: 'span',
        ok: false,
        seen: true,
    },
    methods: {
        click: function () {
            alert("click")
        },
        rev: function () {
            this.name = this.name.split("").reverse().join("");
        },
        returndate2: function () {
            return this.name
        }

    },
    computed: {
        returndate: function () {
            return this.name
        },
    }
})