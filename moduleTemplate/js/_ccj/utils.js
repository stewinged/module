"use strict";

define(function () {
    if (!window.ccj) {
        window.ccj = {};
    }

    /* Current URL function */
    var currentUrl = {};
    currentUrl.getParam = function (name) {
        return new UrlTools().getParam(window.location.href, name);
    };

    /* Current URL function */
    /**
     * 封装成urlTools类
     */
    var UrlTools = (function () {
        function _urlTools() {}
        function getParam(url, name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"),
                r = url.split('?')[1].match(reg);
            return r ? decodeURIComponent(r[2]) : null;
        }

        function hostname(url) {
            var reg = /https?:\/\/(([a-zA-Z0-9_-])+(\.)?)*/i;
            return url.match(reg)[0].split('//')[1];
        }

        function addGetParam(url, getParam) {
            var splitChar = "?";
            if(url.indexOf('?') > -1) {
                splitChar = '&';
            }
            return url + splitChar + getParam;
        }

        _urlTools.prototype = {
            getParam: getParam,
            addGetParam: addGetParam,
            hostname: hostname
        };
        return _urlTools;
    }());

    /**
     * 转换php时间戳为所需格式的时间戳
     * @param timestamp 时间戳
     * @param style 输出的时间的格式（默认为YYYY-MM-DD hh:mm:ss）
     * @returns 所需格式时间
     */
    function dateFormat(timestamp, style) {
        timestamp = timestamp.toString().length === 10 ? timestamp*1000 : timestamp;
        var time = new Date(timestamp);
        if (!style) {
            style = 'YYYY-MM-DD hh:mm:ss';
        }
        var o = {
            "M+" : time.getMonth()+1,                 //月份
            "D+" : time.getDate(),                    //日
            "h+" : time.getHours(),                   //小时
            "m+" : time.getMinutes(),                 //分
            "s+" : time.getSeconds(),                 //秒
            "q+" : Math.floor((time.getMonth()+3)/3), //季度
            "S"  : time.getMilliseconds()             //毫秒
        };
        if(/(Y+)/.test(style))
            style = style.replace(RegExp.$1, (time.getFullYear()+"").substr(4 - RegExp.$1.length));
        for(var k in o)
            if(new RegExp("("+ k +")").test(style))
                style = style.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        return style;
    }

    ccj.utils = {
        currentUrl: currentUrl,
        urlTools: new UrlTools(),
        timeFormat: dateFormat
    };
    return ccj;
});