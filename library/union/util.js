/**
 * $方法扩展
 */
(function ($) {
    $.fn.getValue = function () {
        return UN.getValue($(this));
    }
    $.fn.setValue = function (para,callback) {
        return UN.setValue(this,para,callback);
    }
    $.fn.touch_event = function(para){
        return UN.touch_event(this, para);
    }

})(jQuery)

String.prototype.get_query = function () {
    var that = this;
    var arr = that.split("?")
    var result = {};
    if(arr[1] != undefined){
        var arr_2 = arr[1].split('&');
        var config = {};

        $.each(arr_2, function (i, v) {
            var lin = v.split('=')
            config[lin[0]] = lin[1]
        })
        result =  config;
    }
    return result;
}

if(!window.UN){
    window.UN = {
        protocol: window.location.protocol,
        hostname: window.location.hostname,
        https: 'https://',
        url: function () {
          if(window.UN && window.UN.hostname){
              return window.UN.protocol + "//" + window.UN.hostname + "/"
          }
          return window.location.protocol + "//" + window.location.hostname + "/"
        },

        /**
         * JS自定义表单提交
         * @param formid
         * @param action 表单提交路径
         * @param callback
         */
        form_submit: function (formid, action, callback) {
            var formDom = document.getElementById(formid);
            var formData = new FormData(formDom);
            //
            var req = new XMLHttpRequest();
            req.open("POST",  action);
            req.onreadystatechange = function() {
                if (this.status === 200 && this.readyState === 4) {
                    var res = this.response;
                    typeof callback == "function" && callback(res)
                }else{
                    console.log("错误");
                }
            };
            req.upload.onprogress = function (event) {
                // 进度条
                if (event.lengthComputable) {
                    var complete = (event.loaded / event.total * 100 | 0);
                    var progress = document.getElementById('uploadprogress');
                    progress.value = progress.innerHTML = complete;
                    // if(complete >= 100){
                    //     document.getElementById('uploadprogress').style.display = 'none'
                    // }
                }
            };
            // req.addEventListener('loadend' , function () {
            //      document.getElementById('uploadprogress').style.display = 'none'
            // })

            //将form数据发送出去
            req.send(formData);
            //避免内存泄漏
            req = null;

            return req;
        },

        /**
         * 实现图片预览
         * @param that 需要上传图片的input
         * @param callback 回调函数
         * @param config 可能需要的额外数据
         */
        upload_preview: function (that,callback,config) {
            var file = that.files[0];
            var fileReader = new FileReader();
            // 监听
            fileReader.onabort = function(){
            }
            fileReader.onerror = function(){
            }
            fileReader.onload = function(e){
                typeof callback == "function" && callback(e)
            }
            try{
                fileReader.readAsDataURL(file);
            }catch (Exception){
                console.log(Exception.name +":"+ Exception.message);
            }
        },

        /**
         * 获取某一容器内全部表单元素值, 或者某个表单的value
         * @param container
         */
        getValue: function (container) {
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
                var key = $(items[i]).attr('name');
                var value = $(items[i]).val();
                config[key] = value;
            }
            return config;
        },

        /**
         *  data 表单元素的name与data的key对应
         */
        setValue: function ( container, data, callback) {
            var group = $(container).find("input, select, textarea") || []
            $.each(group,function (_,v) {
                if(data[v.name])
                    v.value = data[v.name] || ""
            });
            typeof callback == 'function' && callback()
        },

        /**
         * ajax
         * @param config 参数
         * @param callback success
         * @param error fail
         */
        ajax_get: function (config, callback, error) {
            var conf = {
                url: '',
                dataType: 'json',
                async: true,
                data: {}
            }
            config = $.extend(conf, config);
            $.ajax({
                type: 'GET',
                url: config.url,
                cache: false,
                dataType: config.dataType,
                data: config.data,
                async: config.async,
                success: function (res) {
                    typeof callback == "function" && callback(res);
                },
                error: function(res){
                    console.log("接口请求错误");
                    typeof error == "function" && error();
                }
            })
        },
        ajax_post: function (config, callback, error) {
            var conf = {
                url: '',
                dataType: 'json',
                async: true,
                data: {}
            }
            config = $.extend(conf, config);
            $.ajax({
                type: 'POST',
                url: config.url,
                cache: false,
                dataType: config.dataType,
                data: config.data,
                async: config.async,
                success: function (res) {
                    typeof callback == "function" && callback(res);
                },
                error: function(res){
                    console.log("接口请求错误");
                    typeof error == "function" && error();
                }
            })
        },

        /**
         * 获取，写入cookie，有value值则为写入，没有value值则获取对应name的cookie
         * @param name
         * @param value
         * @param options
         * @returns {*}
         */
        cookie : function(name, value, options) {
            if (typeof value != 'undefined') { // name and value given, set cookie
                options = options || {};
                if (value === null) {
                    value = '';
                    options.expires = -1;
                }
                var expires = '';
                if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
                    var date;
                    if (typeof options.expires == 'number') {
                        date = new Date();
                        date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
                    } else {
                        date = options.expires;
                    }
                    expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
                }
                var path = options.path ? '; path=' + options.path : '';
                var domain = options.domain ? '; domain=' + options.domain : '';
                var secure = options.secure ? '; secure' : '';
                document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
            } else { // only name given, get cookie
                var cookieValue = null;
                if (document.cookie && document.cookie != '') {
                    var cookies = document.cookie.split(';');
                    for (var i = 0; i < cookies.length; i++) {
                        var cookie = jQuery.trim(cookies[i]);
                        // Does this cookie string begin with the name we want?
                        if (cookie.substring(0, name.length + 1) == (name + '=')) {
                            cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                            break;
                        }
                    }
                }
                return cookieValue;
            }
        },

        /**
         * 获取url携带的 查询字符串
         */
        get_query: function (para) {
            var arr = location.href.split('?');
            var result = {};
            if(arr[1] != undefined){
                var arr_2 = arr[1].split('&');
                var config = {};

                $.each(arr_2, function (i, v) {
                    var lin = v.split('=')
                    config[lin[0]] = lin[1]
                })
                result =  config;

                if(para){
                    var cof = {}
                    cof[para] = config[para]
                    result = cof;
                }
            }
            return result;
        },

        // url解析
        url_release : function (url) {
            var arr = url.split('?');
            var result = {};
            if(arr[1] != undefined){
                var arr_2 = arr[1].split('&');
                $.each(arr_2, function (i, v) {
                    var lin = v.split('=');
                    result[lin[0]] = lin[1];
                })
            }
            result.url = arr[0];
            return result;
        },

        dialogRemove: function () {
            $("body").removeClass("modal-open")
            $(".modal-backdrop").remove()
            $("#myModal").remove()
            $("#myModelBtn").remove()
        },
        alertRemove: function () {
            $("body").removeClass("modal-open")
            $(".modal-backdrop").remove()
            $("#un-alert").remove();
            $(".bs-example-modal-sm").remove()
        },
        /**
         * 警告弹窗，msg为弹出信息，size默认为small
         */
        alert: function (config) {
            UN.alertRemove();
            config.title = config.title || "提示"
            var btn = '<button type="button" class="btn btn-primary" id="un-alert" style="display: none;" data-toggle="modal" data-target=".bs-example-modal-sm"></button>'
            var alert = '<div class="modal fade bs-example-modal-sm" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel">\n' +
                '  <div class="modal-dialog modal-sm" role="document">\n' +
                '    <div class="modal-content">\n' +
                '<div class="modal-header">\n' +
                '        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>\n' +
                '        <h4 class="modal-title" id="myModalLabel">'+ config.title +'</h4>\n' +
                '      </div>\n' +
                '      <div class="modal-body">\n' +
                config.content +
                '      </div>'+
                '    </div>\n' +
                '  </div>\n' +
                '</div>'

            btn += alert
            if($("#un-alert").length<=0){
                $("body").append($(btn));
            }
            $("#un-alert").click()
        },


        /**
         * 交互弹窗，基于bootstrap和jquery，先添加弹窗dom结构，然后依赖bootstrap的内置事件显示modal
         * @param that 触发弹窗显示的标签元素
         * @param option 配置项
         * @param success 如果option未自定义button属性，success
         */
        dialog : function (option) {
            UN.dialogRemove()
            var config = {};

            option = $.extend({
                title: "提示",  // 可选
                content: "内容"  // 可选，弹窗的主题内容
            },config,option);

            var btn = '<button type="button" class="btn btn-primary btn-lg" id="myModelBtn" style="display: none;" data-toggle="modal" data-target="#myModal"></button>'
            var modalHtml = '<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">\n' +
                '            <div class="modal-dialog" role="document">\n' +
                '                <div class="modal-content">\n' +
                '                    <div class="modal-header">\n' +
                '                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>\n' +
                '                        <h4 class="modal-title" id="myModalLabel">'+ option.title +'</h4>\n' +
                '                    </div>\n' +
                '                    <div class="modal-body">\n' +
                option.content +
                '                    </div>\n' +
                '                    <div class="modal-footer">\n' +
                '                   <button type="button" class="btn btn-default dialog-cancel" data-dismiss="modal" >取消</button>'+
                '<button type="button" class="btn btn-primary dialog-confirm">确定</button>'+
                '                    </div>\n' +
                '                </div>\n' +
                '            </div>\n' +
                '        </div>';

            modalHtml = btn + modalHtml;

            if($("#myModal").length <=0){
                $("body").append($(modalHtml));
            }

            if(typeof option.before == "function"){
                option.before()
            }

            $("#myModelBtn").click()

            $(".dialog-confirm").on("click", function () {
                if(typeof option.confirm == 'function'){
                    var bl = option.confirm();
                }
            })
            $(".dialog-cancel").on('click', function () {
                if(typeof option.cancel == 'function'){
                    var bl = option.cancel();
                }
            })
        },

        modalClose: function () {
            $("#myModal").modal('hide')
        },


        /**
         * 合并多个对象，与 $.extend({})效果一致
         * @returns {{}}
         */
        merger: function(){

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
        },

        get_direction: function (dom) {


        },
        /**
         * 左滑动时间
         */
        touch_event: function (dom,para) {
            var startX, endX, X
            $(dom).on("touchstart", function (e) {
                e.preventDefault();
                startX = e.originalEvent.changedTouches[0].pageX;
            })
            $(dom).on("touchend", function (e) {
                e.preventDefault();
                endX = e.originalEvent.changedTouches[0].pageX;

                X = endX - startX;
                console.log(X)
                if(X < 0){
                    typeof para.left == 'function' && para.left()
                }
                if(X > 0){
                    typeof para.right == 'function' && para.right()
                }
            })


        },

        // 参考
        touch: function(dom){
            var startX, startY, moveEndX, moveEndY,
                X, Y


            $(".group-box").on("touchstart", function(e) {
                e.preventDefault();
                startX = e.originalEvent.changedTouches[0].pageX;
                // startY = e.originalEvent.changedTouches[0].pageY;
            });
            $(".group-box").on("touchmove", function(e) {
                e.preventDefault();
                moveEndX = e.originalEvent.changedTouches[0].pageX;
                // moveEndY = e.originalEvent.changedTouches[0].pageY,
                X = moveEndX - startX;
                // Y = moveEndY - startY;

                if( X > 0 ) {
                    console.log("right");
                } else if  ( X < 0 ) {
                    console.log("left");
                } else{
                    console.log("just touch");
                }
            });
        },

    }
}