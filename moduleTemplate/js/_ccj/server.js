"use strict";

define(['jquery', 'db'], function ($, ccj) {
    if (!window.ccj) {
        window.ccj = {};
    }

    function getShopApiCommonParam() {
        return {};
        // return {
        //     "imei": "0",  //待修改
        //     "channel": "QD_appstore",
        //     "package_name": "com.culiu.huanletao",  //待修改
        //     "platform": "iphone",  //待修改
        //     "client_version": "2.9",  //待修改
        //     "sdkVersion": "9.3.2",  //待修改
        //     "ageGroup": "AG_0to24",  //待修改
        //
        //     "api_version": "v3",    //马上修改成v5版本，测试先用V3
        //     "method": "",
        //
        //     "gender": "1",
        //     "token": "",
        //     "userId": ""
        // };
    }

    function getShopApiParam(data) {
        var postData = $.extend({}, getShopApiCommonParam(), data);
        return postData;
    }

    /**
     * 实际发送ajax请求函数
     * @param url   请求地址
     * @param type  GET or POST
     * @param data  请求参数（暂时未知会是什么形式，先写成最通用的）
     * @param success   请求成功回调函数
     * @param fail  请求失败回调函数
     */
    function shopAPI(url, type, data, success, fail) {
        var postData = getShopApiParam(data);
        $.ajax({
            url: url,
            data: data,
            type: type
        }).done(function(data){
            if (typeof(data) == 'string') {
                data = JSON.parse(data);
            }
            if (success) {
                success(data);
            }
        }).fail(function(err) {
            if (typeof(err) == 'string') {
                err = JSON.parse(data);
            }
            if (fail) {
                fail(err);
            } else {
                console.log(err.info);
            }
        });
    }

    shopAPI.shopDetail = function (shopId, success, fail) {
        var param = {"shop_id": "" + shopId};
        shopAPI("shop_detail", param, success, fail);
    };

    function getShopAPI(url, data, success, fail) {
        shopAPI(url, 'GET', data, success, fail);
    }

    function postShopAPI(url, data, success, fail) {
        shopAPI(url, 'POST', data, success, fail);
    }

    ccj.ajax = {
        get: getShopAPI,
        post: postShopAPI
    };

    return ccj;
});




