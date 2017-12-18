/**
 * $方法扩展
 */
(function ($) {

    $.fn.showTips = function (text) {
        var self = $(this);
        var sw = self.get(0).switch;
        if (!sw) {
            sw = true;
            var htmlDom = $("<div class='tooltips'>")
                .addClass("tooltipsred")
                .html("<p class='content'></p>"
                    + "<p class='triangle-front'></p>"
                    + "<p class='triangle-back'></p>");
            htmlDom.find("p.content").html(text);
        }

        setTimeout(function () {
            $("body").append(htmlDom);
            var left = self.offset().left - htmlDom.outerWidth() / 2 + self.outerWidth() / 2;
            var top = self.offset().top - htmlDom.outerHeight() - parseInt(htmlDom.find(".triangle-front").css("border-width"));
            htmlDom.css({"left": left, "top": top - 10, "display": "block"});
            htmlDom.stop().animate({"top": top, "opacity": 1}, 300);
        },100);

        self.on("focus click", function () {
            var top = parseInt(htmlDom.css("top"));
            htmlDom.stop().animate({"top": top - 10, "opacity": 0}, 300, function () {
                htmlDom.remove();
                sw = false;
            });
        });
    }

    // 获取value
    $.fn.getValue = function () {
        return MD.getValue($(this))
    }
    //
    $.fn.setValue = function (data, callback) {
        MD.setValue(this, data, callback)
    }

    // 查找特定元素,cont元素id或class，index元素的索引
    $.fn.get_ele = function (cont, index) {
        cont = ""+ cont + ""
        return $(this).find( cont )[index]
    }

    // 查找元素，用于解析页面
    $.fn.find_ele = function (cont, index) {
        cont = ""+ cont + ""
        if(index){
            return $(this).find( cont )[index]
        }else{
            return $(this).find( cont )
        }
    }

    // 上传图片预览
    $.fn.upload_preview = function (callback , config) {
        MD.upload_preview(this, callback, config)
    }

})(jQuery)

/**
 * 父级页面调整
 */
function resize_index() {
    var height = $("body").outerHeight()
    var menu_height = $(".menu_box",parent.document).outerHeight()

    if(height > menu_height){
        $(".main_box",parent.document).css({height: height+'px'})
    }else{
        $(".main_box",parent.document).css({height: menu_height +'px'})
    }
}

window.onload = function () {
    if(location.href.indexOf("/admin/index") < 0)
    resize_index();
}



/**
 * 自定义全局方法
 */
if(!window.MD)
window.MD = {
    protocol: window.location.protocol,
    hostname: window.location.hostname,
    url: window.location.protocol + "//" + window.location.hostname + "/",
    https: 'https://shtongnian.com/',

    /**
     * 实现表单元素UI效果
     * @param elem
     * @param config
     */
    Form : function (elem,config) {
        var dom = $(elem);
        var opts = {
            type : "checkbox"
        }

        opts = $.extend(opts, config||{});

        (function () {
            var aims = dom.find('input[type='+ opts.type +']');
            var wrapDom = $('<div class="md-'+ opts.type +'"></div>');
            var itype = opts.type == 'checkbox' ? 'fa-check' : ''

            $.each(aims, function (i, v) {
                var afterDom = $('<i class="fa '+ itype +'"></i><span>'+ $(v).attr("mdtext") +'</span>')

                if(v.checked){
                    $(v).wrap(wrapDom.addClass("on")).after(afterDom);
                }else{
                    $(v).wrap(wrapDom.removeClass("on")).after(afterDom);
                }

                /*$(v).on("change", function () {
                    if(opts.type == "checkbox"){
                        $(this).parent().toggleClass("on")
                    }

                    if(opts.type == "radio"){
                        $(this).parent().addClass("on")
                        $(this).parent().siblings().removeClass("on")
                    }
                })*/
                if(opts.type == "checkbox"){
                    $(v).on("click",function () {
                        $(this).parent().toggleClass("on")
                    })
                }

                if(opts.type == "radio"){
                    $(v).on("click",function () {
                        $(this).parent().addClass("on")
                        $(this).parent().siblings().removeClass("on")
                    })
                }

            })
        })()
    },

    /**
     * 获取某一容器内全部表单元素值,
     * 或者某个表单的value
     * @param container
     * @returns {*}
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
     *  callback 针对编辑器的操作，ue非全局变量
     */
    setValue: function ( container, data, callback) {
        var group = $(container).find("input,select,textarea") || []
        $.each(group,function (_,v) {
            if(data[v.name])
            v.value = data[v.name] || ""
        })

        typeof callback == "function" && callback(data)
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


    /**
     * ajax_get
     * 使用注意，若需要自定义弹窗提示，需要借助jedate插件
     */
    ajax_get: function (config, callback, error) {
        var conf = {
            url: '',
            dataType: 'json',
            async: true,
            data: {}
        }
        config = MD.merger(conf, config);
        $.ajax({
            type: 'GET',
            url: MD.url + config.url,
            cache: false,
            dataType: config.dataType,
            data: config.data,
            async: config.async,
            success: function (res) {
                typeof callback == "function" && callback(res);
            },
            error: function(res){
                console.log("接口请求错误");
                alert("网络错误");
                typeof error == "function" && error();
            }
        })
    },

    /**
     * ajax_post post请求，实际实现待定
     */
    ajax_post: function (config, callback, error) {
        var conf = {
            url: MD.url + config.url,
            dataType: 'json',
            async: true,
            data: {}
        }
        config = MD.merger(conf, config);
        $.ajax({
            type: 'POST',
            url: MD.url + config.url,
            cache: false,
            dataType: config.dataType,
            data: config.data,
            async: config.async,
            success: function (res) {
                typeof callback == "function" && callback(res);
            },
            error: function(res){
                console.log("接口请求错误");
                alert("网络错误");
                typeof error == "function" && error();
            }
        })
    },

    // 为编辑器添加微信图标
    //
    wechat: function () {
        var src = MD.url + 'storage/icons/uedit-wechat.png';
        var img = $("<img id='wechat-preview' src=" + src +" title='微信编辑模式' alt='wechat'>")

        img.on("click", function () {
            var this_ = $(this)
            this_.toggleClass('we-chat');
            if(this_.hasClass('we-chat')){
                $("#myEditor").css({width: '400px', border: '1px solid #ddd'})
                $("#edui1_iframeholder").css({height: '700px'})
            }else{
                $("#myEditor").css({width: '100%', border: 'none'})
                $("#edui1_iframeholder").css({height: 'auto'})
            }

        })

        $(".edui-editor-toolbarboxinner ").append(img)

        setTimeout(function(){
            resize_index()
            console.log("123466")
        },500)
    },

    // 回到顶部
    //
    scrollTop: function () {
        var fix = $('<div class="fixed"></div>');
        var arr = $('<div class="fixed-arr"><i class="fa fa-arrow-up"></i></div>')

        arr.on('click',function () {
            $('html, body').animate({scrollTop: 0}, 500);
        })

        fix.append(arr)
        $('body').append(fix)
    },

    /**
     * 手动number表单设置
     */
    input_number: function () {
        $(".number").on("keyup",function () {
            var val = $(this).val();
            val = val.replace(/[^0-9]/g,"");
            $(this).val(Number(val))
        })
    },

    /**
     * iframe加载完成后（onload）
     * 页面解析时，是否需要特殊的解析规则
     * 如： 微信公众号文章中的figure标签为自定义标签，innerHTML无法解析，所以需要特殊处理
     * $doc 为目标iframe,document
     */
    release_before: function ($doc, current_rule) {
        if(current_rule.url == 'https://mp.weixin.qq.com' || current_rule.url == 'http://mp.weixin.qq.com'){
            // 解决微信 的figure标签无法解析问题
            var f = $doc.find(current_rule.content).find('figure')
            $.each(f, function (i, v) {
                var wp = $(v).wrap("<div class='md-wrap'></div>")
                // $(v).find('img').attr({'src': MD.url+'/'+ MD.rule_image[i], 'width':'100%'})
                wp.parent().html($(v).html())
            });
        }


        // 每个解析规则下，都执行
        MD.change_images($doc, current_rule)
    },

    //
    release_after: function ($doc, current_rule) {
        var f = $doc.find('img')
        $.each(f, function (i, v) {
            $(v).css({'max-width':'100%'})
        });
    },

    /**
     * 替换源页面中全部图片后台
     */
    change_images: function ($doc, current_rule) {
        if(MD.rule_image && MD.rule_image.length > 0){
            var imgs = $doc.find(current_rule.content).find('img')
            $.each(imgs, function (i, v) {
                $(v).attr({'src': MD.url + MD.rule_image[i]})

            })
        }
    },

    /**
     * 上传图片，实现图片预览
     * @param that 需要上传图片的input
     * @param callback 回调函数
     * @param config 可能需要的额外数据
     */
    upload_preview: function (that,callback,config) {
        var file = that.files[0];
        var fileReader = new FileReader();
        // 监听
        fileReader.onabort = function(){
            jeBox.msg("图片读取中断，请重试", {icon: 2,time:1});
        }
        fileReader.onerror = function(){
            jeBox.msg("图片读取失败，请重试", {icon: 2,time:1});
        }
        fileReader.onload = function(e){
            // $(".banner-img-prev").attr("src",e.target.result);
            typeof callback == "function" && callback(e)
        }
        try{
            fileReader.readAsDataURL(file);
        }catch (Exception){
            console.log(Exception.name +":"+ Exception.message);
        }
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
        req.open("POST", MD.url + action);
        req.onreadystatechange = function() {
            if (this.status === 200 && this.readyState === 4) {
                var res = this.response;
                typeof callback == "function" && callback(res)
            }
        };
        //将form数据发送出去
        req.send(formData);
        //避免内存泄漏
        req = null;

        return req;
    },

    /**
     * 将时间戳转化为标准时间，时间戳数量级问题*1000
     */
    time_format: function (timestamp) {
        if (/^\d{10}$/.test(timestamp)) {
            timestamp *= 1000;
        } else if (/^\d{13}$/.test(timestamp)) {
            timestamp = parseInt(timestamp);
        } else {
            console.log('时间戳格式不正确！'+ timestamp);
            return;
        }
        var time = new Date(timestamp);
        var year = time.getFullYear();
        var month = (time.getMonth() + 1) > 9 && (time.getMonth() + 1) || ('0' + (time.getMonth() + 1))
        var date = time.getDate() > 9 && time.getDate() || ('0' + time.getDate())
        var hour = time.getHours() > 9 && time.getHours() || ('0' + time.getHours())
        var minute = time.getMinutes() > 9 && time.getMinutes() || ('0' + time.getMinutes())
        var second = time.getSeconds() > 9 && time.getSeconds() || ('0' + time.getSeconds())
        var YmdHis = year + '-' + month + '-' + date + ' ' + hour + ':' + minute + ':' + second;
        return YmdHis;
    },

    /**
     * 将时间转换为时间戳，前提（必须已经加载了lirary/common/moment.js）
     */
    date_format: function (date) {
        return (moment(date, 'YYYY-MM-DD HH:mm:ss')).unix();
    },

    /**
     * 性别转换
     */
    sex_format: function (num) {
        var sex = "";
        if(num == 2){
            sex = "女"
        }else if(num == 1){
            sex = "男"
        }else {
            sex = "未知"
        }
        return sex;
    },


    /**
     * 获取全部菜单项
     */
    getMenusJson: function(callback){
        MD.ajax_get({url: 'admin/manager/showgrant'}, function (res) {
            var data = {parent: [], child: []}
            $.each(res, function (i, v) {
                if(v.pid == 0){
                    data.parent.push(v);
                }else{
                    data.child.push(v)
                }
            })
            // 将原始数据分组
            callback(data);
        })
    },


    /**
     * 实现用户菜单的动态显示
     * all 全部数据
     */
    showMenu: function (all,menu) {

        var result = [], rmenu = []
        // 获取可展示菜单
        $.each(menu, function (i, v) {
            $.each(all.child, function (j, k) {
                if(v == k.id){
                    rmenu.push(k);
                    return;
                }
            })
        })

        // 父级与子级整合
        $.each(all.parent, function (j, k) {
            var p = {id: k.id,pname: k.name,child: [], cls: k.cls}
            $.each(rmenu, function (i, v) {
                if(v.pid == k.id){
                    p.child.push(v);
                }
            })

            if(p.child.length>0)
                result.push(p);
        })

        MD.show_menu_list(result)
    },
    /**
     * 通过最终result数组，输出菜单
     */
    show_menu_list: function (result) {
        // console.log(result)
        var def = '<li>\n' +
            '                <ul class="sub_menu">\n' +
            '                    <li class="on menu_index"><a href="'+MD.url+"admin/info"+'" target="main"><i class="fa fa-fw fa-home"></i>首页</a></li>\n' +
            '                </ul>\n' +
            '            </li>';
        var m_html = ""
        $.each(result, function (i, v) {
            var p_menu ='<li>\n' +
                        '    <h3><i class="'+ v.cls +'"></i>'+ v.pname +'</h3>\n' +
                        '<ul class="sub_menu">\n';

            var c_menu = '';

            $.each(v.child, function (_, k) {
                var href = k.url.indexOf("http") < 0 ? (MD.url + k.url) : k.url;
                c_menu += '<li><a href="'+ href +'" target="main">'+ k.name +'</a></li>'
            });


            m_html += p_menu + c_menu + '</ul></li>'
        })
        $(".menu_box_ul").html(def + m_html);
        resize_index();
    },

    /**
     * 父级与子级整合
     */
    menu_result: function (all) {
        var result = []
        $.each(all.parent, function (j, k) {
            var p = {id: k.id,pname: k.name,child: []}
            $.each(all.child, function (i, v) {
                if(v.pid == k.id){
                    p.child.push(v);
                }
            })
            result.push(p);
        })
        return result;
    },



}


/**
 * 全局页面元素绑定方法
 * 自动执行
 */
$(function () {
    //数字输入控制
    $(".number").on("keyup",function () {
        var val = $(this).val();
        val = val.replace(/[^0-9]/g,"");
        $(this).val(Number(val))
    })
})































