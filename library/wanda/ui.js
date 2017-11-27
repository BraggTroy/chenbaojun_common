// 用于移动端
// 仿mui
if(!window.util){
    window.util = {};

    // 页面rem
    // util.rem = function () {
    //     (function (doc, win) {
    //         var docEl = doc.documentElement,
    //             resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
    //             recalc = function () {
    //                 var clientWidth = docEl.clientWidth;
    //                 if (!clientWidth) return;
    //                 docEl.style.fontSize = clientWidth / 20 + 'px';
    //             };
    //
    //         if (!doc.addEventListener) return;
    //         win.addEventListener(resizeEvt, recalc, false);
    //         doc.addEventListener('DOMContentLoaded', recalc, false);
    //     })(document, window)
    // }

    // $.extend()
    util.merger =  function(){

        var inner_merge = function (obj1, obj2) {
            for (var key in obj2) {
                if (obj2.hasOwnProperty(key)) {
                    obj1[key] = obj2[key]
                }
            }
            return obj1
        }
        var ret = {}
        for (var i = 0, l = arguments.length; i < l; i++) {
            inner_merge(ret, arguments[i])
        }
        return ret
    }

    // 获取值
    util.getValue = function (container) {
        var el;
        if(typeof container == 'string'){
            el = $(container);
        }else{
            el = container
        }

        var items = el.find('input,select,textarea');
        if(items.length == 0){
            if(el.prop('name') != undefined || el.prop('name') != ""){
                var k = el.attr('name');
                var v = el.val();
                var rs = {};
                rs[k] = v;
                return rs;
            }
            else{
                return "";
            }
        }
        var config = {};
        for(var i=0;i<items.length;i++){
            var that = items[i]
            var key = $(that).attr('name');
            var value = ""
            if(that.type == 'checkbox'){
                if($(that).prop("checked")){
                    value = $(that).val();
                }
                config[key] = value;

            }else if(that.type == 'radio'){
                if(!config.hasOwnProperty(that.name) && $(that).prop("checked")){
                    value = $(that).val();
                    config[key] = value;
                }
            }else{
                value = $(that).val();
                config[key] = value;
            }

        }
        return config;
    },

    // ajax
    util.ajax = function (config, callback, error) {
        var conf = {
            url: '',
            dataType: 'json',
            type: "GET",
            async: true,
            data: {}
        }
        config = $.extend(conf, config);
        $.ajax({
            type: config.type,
            url: config.url,
            cache: false,
            dataType: config.dataType,
            data: config.data,
            async: config.async,
            success: function (res) {
                typeof callback == "function" && callback(res);
            },
            error: function(res){
                ui.toast("网络错误")
                typeof error == "function" && error();
            }
        })
    }


}
if(!window.ui){
    window.ui = {};



    // 为ui添加属性，操作手势
    (function ($) {
        if ('ontouchstart' in window) {
            $.isTouchable = true;
            $.EVENT_START = 'touchstart';
            $.EVENT_MOVE = 'touchmove';
            $.EVENT_END = 'touchend';
        } else {
            $.isTouchable = false;
            $.EVENT_START = 'mousedown';
            $.EVENT_MOVE = 'mousemove';
            $.EVENT_END = 'mouseup';
        }
        $.EVENT_CANCEL = 'touchcancel';
        $.EVENT_CLICK = 'click';
    })(ui)


    // 查找元素
    ui.get_ele = function (ele, parent) {
        if(parent)
            return $(ele, parent)
        return $(ele)
    }
    // 获取元素
    ui.get = function (dom) {
        return $(dom)
    }

    // 小提示文字
    ui.toast = function (message, option) {

        var cof = { time: 1500, type: '' },
        CLASS_ACTIVE = "toast-active"

        option = util.merger(cof, option);
        var toast = document.createElement('div');
        toast.classList.add('toast');
        toast.innerHTML = '<div class="' + 'toast-message' + '">' + message + '</div>';
        toast.addEventListener('webkitTransitionEnd', function() {
            if (!toast.classList.contains(CLASS_ACTIVE)) {
                toast.parentNode.removeChild(toast);
                toast = null;
            }
        });

        //点击则自动消失
        toast.addEventListener('click', function() {
            toast.parentNode.removeChild(toast);
            toast = null;
        });
        document.body.appendChild(toast);

        toast.classList.add(CLASS_ACTIVE);
        setTimeout(function() {
            toast && toast.classList.remove(CLASS_ACTIVE);
        }, option.time);

    };


}
// 交互弹窗
// ui.confirm('提示内容', '标题', ["取消", "确定"], function(e) {
//     // e.index表示按钮组中的索引
//     e.index == 0 ? ui.toast('UI 没有得到你的认可,继续加油!') : ui.toast('感谢您的支持!')
// })
// ui.alert("弹窗信息",function(e){
//     // 回调函数可以省略，直接写为ui.alert("弹窗信息")
// })
(function(ui, window, document) {
    var CLASS_POPUP = 'mui-popup';
    var CLASS_POPUP_BACKDROP = 'mui-popup-backdrop';
    var CLASS_POPUP_IN = 'mui-popup-in';
    var CLASS_POPUP_OUT = 'mui-popup-out';
    var CLASS_POPUP_INNER = 'mui-popup-inner';
    var CLASS_POPUP_TITLE = 'mui-popup-title';
    var CLASS_POPUP_TEXT = 'mui-popup-text';
    // var CLASS_POPUP_INPUT = 'mui-popup-input';
    var CLASS_POPUP_BUTTONS = 'mui-popup-buttons';
    var CLASS_POPUP_BUTTON = 'mui-popup-button';
    var CLASS_POPUP_BUTTON_BOLD = 'mui-popup-button-bold';
    var CLASS_ACTIVE = 'mui-active';

    var backdrop = (function() {  // 背景
        var element = document.createElement('div');
        element.classList.add(CLASS_POPUP_BACKDROP);
        // element.addEventListener(ui.EVENT_MOVE, ui.preventDefault);
        element.addEventListener('webkitTransitionEnd', function() {
            if (!this.classList.contains(CLASS_ACTIVE)) {
                element.parentNode && element.parentNode.removeChild(element);
            }
        });
        return element;
    }());

    // var createInput = function(placeholder) {
    //     return '<div class="' + CLASS_POPUP_INPUT + '"><input type="text" autofocus placeholder="' + (placeholder || '') + '"/></div>';
    // };
    var createInner = function(message, title) {
        return '<div class="' + CLASS_POPUP_INNER + '"><div class="' + CLASS_POPUP_TITLE + '">' + title + '</div><div class="' + CLASS_POPUP_TEXT + '">' + message + '</div></div>';
    };
    var createButtons = function(btnArray) {
        var length = btnArray.length;
        var btns = [];
        for (var i = 0; i < length; i++) {
            btns.push('<span class="' + CLASS_POPUP_BUTTON + (i === length - 1 ? (' ' + CLASS_POPUP_BUTTON_BOLD) : '') + '">' + btnArray[i] + '</span>');
        }
        return '<div class="' + CLASS_POPUP_BUTTONS + '">' + btns.join('') + '</div>';
    };

    var createPopup = function(html, callback) {
        var popupElement = document.createElement('div');
        popupElement.className = CLASS_POPUP;
        popupElement.innerHTML = html;  // html = inner + btns
        var removePopupElement = function() {
            popupElement.parentNode && popupElement.parentNode.removeChild(popupElement);
            popupElement = null;
        };
        popupElement.addEventListener(ui.EVENT_MOVE, ui.preventDefault);
        popupElement.addEventListener('webkitTransitionEnd', function(e) {
            if (popupElement && e.target === popupElement && popupElement.classList.contains(CLASS_POPUP_OUT)) {
                removePopupElement();
            }
        });

        popupElement.style.display = 'block';
        document.body.appendChild(popupElement);
        popupElement.offsetHeight;
        popupElement.classList.add(CLASS_POPUP_IN);
        if (!backdrop.classList.contains(CLASS_ACTIVE)) {
            backdrop.style.display = 'block';
            document.body.appendChild(backdrop);
            backdrop.offsetHeight;
            backdrop.classList.add(CLASS_ACTIVE);
        }
        var btns = ui.get_ele('.' + CLASS_POPUP_BUTTON, popupElement);
        // var input = popupElement.querySelector('.' + CLASS_POPUP_INPUT + ' input');
        var popup = {
            element: popupElement,
            close: function(index, animate) {
                if (popupElement) {

                    var result = callback && callback({
                        index: index || 0,
                        // value: input && input.value || ''
                    });
                    if (result === false) { //返回false则不关闭当前popup
                        return;
                    }
                    popupElement.classList.remove(CLASS_POPUP_IN);
                    popupElement.classList.add(CLASS_POPUP_OUT);
                    backdrop.classList.remove(CLASS_ACTIVE)

                    /*if (animate !== false) {
                        popupElement.classList.remove(CLASS_POPUP_IN);
                        popupElement.classList.add(CLASS_POPUP_OUT);
                    } else {
                        removePopupElement();
                    }
                    popupStack.pop();
                    //如果还有其他popup，则不remove backdrop
                    if (popupStack.length) {
                        popupStack[popupStack.length - 1]['show'](animate);
                    } else {
                        backdrop.classList.remove(CLASS_ACTIVE);
                    }*/
                }
            }
        };
        var handleEvent = function(e) {
            for(var i=0; i<btns.length; i++){
                if(btns[i].innerHTML == e.target.innerHTML){
                    popup.close(i);
                }
            }
        };
        $(popupElement).on('click', '.' + CLASS_POPUP_BUTTON, handleEvent);  // 按钮点击
        /*if (popupStack.length) {
            popupStack[popupStack.length - 1]['hide']();
        }
        popupStack.push({
            close: popup.close,
            show: function(animate) {
                popupElement.style.display = 'block';
                popupElement.offsetHeight;
                popupElement.classList.add(CLASS_POPUP_IN);
            },
            hide: function() {
                popupElement.style.display = 'none';
                popupElement.classList.remove(CLASS_POPUP_IN);
            }
        });*/
        return popup;
    };
    var createAlert = function(message, title, btnValue, callback, type) {
        if (typeof message === 'undefined') {
            return;
        } else {
            if (typeof title === 'function') {
                callback = title;
                type = btnValue;
                title = null;
                btnValue = null;
            } else if (typeof btnValue === 'function') {
                type = callback;
                callback = btnValue;
                btnValue = null;
            }
        }
        return createPopup(createInner(message, title || '提示') + createButtons([btnValue || '确定']), callback);
    };
    var createConfirm = function(message, title, btnArray, callback, type) {
        if (typeof message === 'undefined') {
            return;
        } else {
            if (typeof title === 'function') {
                callback = title;
                type = btnArray;
                title = null;
                btnArray = null;
            } else if (typeof btnArray === 'function') {
                type = callback;
                callback = btnArray;
                btnArray = null;
            }
        }
        return createPopup(createInner(message, title || '提示') + createButtons(btnArray || ['取消', '确认']), callback);
    };
    /*var createPrompt = function(message, placeholder, title, btnArray, callback, type) {
        if (typeof message === 'undefined') {
            return;
        } else {
            if (typeof placeholder === 'function') {
                callback = placeholder;
                type = title;
                placeholder = null;
                title = null;
                btnArray = null;
            } else if (typeof title === 'function') {
                callback = title;
                type = btnArray;
                title = null;
                btnArray = null;
            } else if (typeof btnArray === 'function') {
                type = callback;
                callback = btnArray;
                btnArray = null;
            }
        }
        // if (!$.os.plus || type === 'div') {
        return createPopup(createInner(message, title || '提示', createInput(placeholder)) + createButtons(btnArray || ['取消', '确认']), callback);
        // }
        // return plus.nativeUI.prompt(message, callback, title || '提示', placeholder, btnArray || ['取消', '确认']);
    };*/
    /*var closePopup = function() {
        if (popupStack.length) {
            popupStack[popupStack.length - 1]['close']();
            return true;
        } else {
            return false;
        }
    };
    var closePopups = function() {
        while (popupStack.length) {
            popupStack[popupStack.length - 1]['close']();
        }
    };*/

    // ui.closePopup = closePopup;
    // ui.closePopups = closePopups;
    ui.alert = createAlert;
    ui.confirm = createConfirm;
    // ui.prompt = createPrompt;
})(ui, window, document);





//
//
//
// // 全局dom初始化操作
// $(function () {
//     // 输入框 如果有清除，则添加清除效果并初始化
//     var input = $(".ui-input-clear");
//     (function (input) {
//         input.after("<span class=\"input-close hide\"><span>X</span></span>");
//         input.on("focus keyup", function () {
//             var val = $(this).val();
//             if(val.length > 0)
//                 $(this).next().removeClass("hide");
//         });
//         input.on("blur", function () {
//             var that = $(this);
//             setTimeout(function () {
//                 that.next().addClass("hide")
//             },150)
//
//         });
//         $(".input-close").on("click", function () {
//             $(this).prev().val("")
//             $(this).addClass("hide");
//         })
//     })(input)
// })