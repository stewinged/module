"use strict";


define(function () {
    if (!window.ccj) {
        window.ccj = {};
    }

    var kPrefix = "m_ccj_";
    var kTimeout = "m_ccj_t_";

    /**
     * 获取localStorage值
     * @param key
     */
    function getItem(key) {
        var timeout = localStorage.getItem(kTimeout + key);
        if (timeout) {
            if (timeout < new Date().getTime()) {
                removeItem(key);
            }
        }
        return localStorage.getItem(kPrefix + key);
    }

    /**
     * 设置localStorage值
     * @param key
     * @param value
     * @param expire [可选]过期时间(秒)
     */
    function setItem(key, value, expire) {
        localStorage.setItem(kPrefix + key, value);
        if (expire) {
            setExpire(key, expire);
        }
    }

    /**
     * 设置key的过期时间
     * @param key
     * @param expire 过期时间(秒)
     */
    function setExpire(key, expire) {
        localStorage.setItem(kTimeout + key, (new Date().getTime()) + expire * 1000);
    }

    /**
     * 删除key
     * @param key
     */
    function removeItem(key) {
        localStorage.removeItem(kPrefix + key);
        localStorage.removeItem(kTimeout + key);
    }

    /**
     * 获取Cookie
     * @param name
     * @returns {null}
     */
    function getCookie(name) {
        var reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)"),
            r = document.cookie.match(reg);
        return r ? decodeURIComponent(r[2]) : null;
    }

    /**
     * 设置Cookie
     * @param name
     * @param value
     * @param days
     */
    function setCookie (name, value, days) {
        var d = new Date();
        d.setTime(d.getTime() + (days * 24 * 3600 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = name + "=" + value + "; " + expires;
    }
    
    function removeCookie(name) {
        setCookie(name,null,-1);
    }


    ccj.db = {
        getItem: getItem,
        setItem: setItem,
        setExpire: setExpire,
        removeItem: removeItem,
        getCookie: getCookie,
        setCookie: setCookie,
        removeCookie: removeCookie
    };
    return ccj;
});
