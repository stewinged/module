/**
 * Created by Administrator on 2016/11/24.
 */
require(['jquery','pages','server'], function ($) {
    var postTextData = {},       ////文字模板的数据
        postPicData = {};       ////图片模板的数据
    //点击范围
    $('.caterange input').on('click',function(){
        var index = $(this).attr('data-index');
        if(index == 1){
            //全类目
            $(this).parent().parent().siblings('ul.popup-category').addClass('Ndisplay').siblings('.checkCate').addClass('Ndisplay');
        }else if(index == 2){
            //ID
            $(this).parent().parent().siblings('ul.popup-category').addClass('Ndisplay').siblings('.checkCate').removeClass('Ndisplay');
        }else if(index == 3){
            //分类目
            $(this).parent().parent().siblings('ul.popup-category').removeClass('Ndisplay').siblings('.checkCate').addClass('Ndisplay');
        }

    });
    //点击 创建通用文字的弹窗  清空所有的样式  为一个空白弹窗
    $('.textModule').on('click',function(){
        //$('#submitText').prev().html('');
        $('#textModule').find('textarea').eq(0).val('');
        emptyAll('textModule');
        $('#textModule').modal('show');
    });
    //点击 创建通用图片的弹窗 清空所有的样式  为一个空白弹窗
    $('.picModule').on('click',function(){
        $('#submitPic').prev().html('');
        $('#picModule').find('img').eq(0).attr('src','../img/addimg360.png');
        //清空下面的全部商品和id和类目内容
        emptyAll('picModule');
        $('#picModule').modal('show');
    });
    //提示错误时 点击知道按钮
    $('#submitText').off().on('click',function(){
        var str='图片的格式不对'
        errorMsg(str)
    });
    judgCid1andCid2('textModule')

    //文字列表的数据   然后获取第一页的数据
    postPageText(1);
    //图片页卡设置一次点击事件 获取一次数据
    $('#picData').one('click',function(){
        // var strHtml = $('#page2').html();
        // if(strHtml){
        //     var numPage = $('#page2').find('li').filter('.select_yes').html();
        //     postPageText(numPage);
        // }else{
        //     postPagePic(1);
        // }
        postPagePic(1);
    });
    //把shopId商家的id放到p标签中
    $('.shopId').html(shopId);
    //一级二级类目的数据
    var category = root_category;
    //把一级二级类目  放到文字弹窗中
    createCidHtml(category,textModule);
    //把一级二级类目  放到图片弹窗中
    createCidHtml(category,picModule);
    //点击图片弹窗里面的图片  上传图片同时判断是否符合规则
    $("#imgUpload").change(function(){
        $("#formPicUpload").submit();
        $('#myIframe').unbind().bind('load',function(){
            var myIframes = $('#myIframe');
            var striFrame = $(myIframes[0]).contents().find("body").html();
            objIfram = $.parseJSON(striFrame);
            if (objIfram.status == 1){
                var imgUrl = objIfram.data;
                $("#imgPre").attr('src', imgUrl);
            }else{
                var str = objIfram.info;
                errorMsg(str);
            }
        });
        $(this).val("");
    });

///获取一级二级类目后

    //点击一级列表 相应展示二级列表
    $('.overAuto').on('click',function(){
        if($(this).siblings('ul').hasClass('curOut')){
            $(this).siblings('ul').removeClass('curOut');
            $(this).siblings('img').attr('src','./publicseller/SQE/img/fl_right.png')
        }else{
            $('.overAuto ul').filter('.curOut').removeClass('curOut').siblings('img').attr('src','./publicseller/SQE/img/fl_right.png');
            $(this).siblings('ul').addClass('curOut');
            $(this).siblings('img').attr('src','./publicseller/SQE/img/fl_down.png')
        }
    });
    //点击二级类目选中框  去判断父级是否是选中还是不选中
    judgCid1andCid2('textModule');
    judgCid1andCid2('picModule');
    //点击文字的提交按钮
    $('#submitText').on('click',function(){
        var bFlag = judgText();
        if(bFlag){
            var shopId = $('.shopId').html();
            var goodAllId = $('.goodAllId').html();
            //console.log(goodAllId)
            var arrPId = goodAllId.split(',');
            arrPId.pop();
            var jsonAdd = {};
            jsonAdd.type = 1;
            var url = '';
            jsonAdd.name = $('#textModule').find('textarea').val();
            judgIdandCid(textModule,arrPId,jsonAdd,shopId,addTextModule);
        }



    });

    //点击的图片的提交按钮
    $('#submitPic').on('click',function(){
        var bFlag = false;
        var imgUrl = $('#picModule').find('img').eq(0).attr('src');
        var imgName =imgUrl.substring((imgUrl.lastIndexOf('/')+1),imgUrl.lastIndexOf('.'));
        if(imgName != 'addimg360'){
            bFlag = true;
        }else{
            var str = '请上传图片，图片不能为空';
            errorMsg(str);
            return false;
        }
        if(bFlag){
            var shopId = $('.shopId').html();
            var goodAllId = $('.goodAllId').html();
            //console.log(goodAllId)
            var arrPId = goodAllId.split(',');
            arrPId.pop();
            var jsonPicAdd = {};
            jsonPicAdd.type = 2;
            jsonPicAdd.name = imgUrl;
            judgIdandCid(picModule,arrPId,jsonPicAdd,shopId,addPicModule);
            // var bTurn = judgIdandCid(picModule,arrPId,jsonPicAdd,shopId);
            // if(bTurn){
            //     if($(this).prev().html()){
            //         var moduleId = $(this).prev().html();
            //         jsonPicAdd.id = moduleId;
            //         url = 'sqe.php?s=ProductDetailCommonTemplate/ajaxUpdateTemplate';
            //     }else{
            //         url = 'sqe.php?s=ProductDetailCommonTemplate/ajaxAddTemplate';
            //     }
            //     addPicModule(jsonPicAdd,url);
            //
            // }
        }



    });

    //提交成功时 点击知道按钮
    $('.msgBtn').off().on('click',function(){
        $('#msgOut').hide();
    });

    //------ajax-----------
//获取文字模板的数据
    function getWord(postTextData){
        ccj.ajax.post('sqe.php?s=ProductDetailCommonTemplate/ajaxGetTemplatelist',postTextData, function (data) {
            var json = eval('('+data+')');
            //console.log(postTextData);
            //console.log(json);
            if(json.status == 1){
                var ary = json.data.list;
                var jsonPage = json.data.page;
                getCreateText(ary);
                new Page(jsonPage,page1,postPageText,0)
            }else{
                alert('获取数据失败，请重新刷新页面')
            }

        });

    }
//获取图片模板的数据
    function getPic(postPicData){
        ccj.ajax.post('sqe.php?s=ProductDetailCommonTemplate/ajaxGetTemplatelist',postPicData, function (data) {
            var json = eval('('+data+')');
            //console.log(postPicData);
            //console.log(json);
            if(json.status == 1){
                var ary = json.data.list;
                var jsonPage = json.data.page;
                getCreatePic(ary);
                new Page(jsonPage,page2,postPagePic,1)
            }else{
                alert('获取数据失败，请重新刷新页面')
            }

        });

    }
//添加和编辑文字模板的数据
    function addTextModule(jsonAdd,url){
        ccj.ajax.post(url,jsonAdd, function (data) {
            var json = eval('('+data+')');
            //console.log(json);
            if(json.status == 1){
                //console.log(jsonAdd);
                if(jsonAdd.id){
                    var numPage = $('#page1').find('li').filter('.select_yes').html();
                    postPageText(numPage);
                }else{
                    postPageText(1);
                }
                $('#textModule').hide();
                $('#msgOut').show().find('.titHead').text('创建通用文字');
                $('#msgOut').show().find('.modueMsg').text('文字模板');

            }else{
                alert(json.info);
            }

        });
    }

//添加和编辑图片模板的数据
    function addPicModule(jsonPicAdd,url){
        ccj.ajax.post(url,jsonPicAdd, function (data) {
            var json = eval('('+data+')');
            //console.log(json);
            if(json.status == 1){
                //console.log(jsonPicAdd);
                if(jsonPicAdd.id){
                    var numPage = $('#page2').find('li').filter('.select_yes').html();
                    postPagePic(numPage);
                }else{
                    postPagePic(1);
                }
                $('#picModule').hide();
                $('#msgOut').show().find('.titHead').text('创建通用图片');
                $('#msgOut').show().find('.modueMsg').text('图片模板');
            }else{
                alert(json.info);
            }

        });
    }

//启用和停用状态接口请求 jsonChangeStatus 是数据   url是接口  fn是回调函数 更新页面   pageid是分页
    function changeStatus(jsonChangeStatus,url,fn,pageId){
        ccj.ajax.post(url,jsonChangeStatus, function (data) {
            var json = eval('('+data+')');
            //console.log(json);
            if(json.status == 1){
                var numPage = $(pageId).find('li').filter('.select_yes').html();
                fn(numPage);
                $('#loadingGet').hide();
            }else{
                $('#loadingGet').hide();
                alert(json.info);
            }

        });
    }
//文字模板的列表创建
    function getCreateText(ary) {
        $('.textModuleHtml').empty();
        //console.log(ary)
        for(var i=0; i<ary.length; i++){
            var status = '';
            var tdStatus = '';
            if(ary[i].status == 1){
                status = '新建';
                tdStatus = '<td width="120"><a href="javascript:;" class="lk bradius bggreen editMod">编辑</a><br>\
                        <a href="javascript:;" class="lk bradius bggreen editMod">启用</a><br>\
                        <a href="javascript:;" class="lk bradius bggreen editMod">删除</a></td>';

            }else if(ary[i].status == 2){
                status = '启用';
                // tdStatus = '<td width="120"><a href="javascript:;" class="lk bradius bggreen editMod">编辑</a><br>\
                //              <a href="javascript:;" class="lk bradius bggreen editMod">停用</a><br>\
                //              <a href="javascript:;" class="lk bradius bggreen editMod">删除</a></td>';
                tdStatus = '<td width="120"><a href="javascript:;" class="lk bradius bggreen editMod">停用</a></td>';
            }else if(ary[i].status == 3){
                status = '停用';
                tdStatus = '<td width="120"><a href="javascript:;" class="lk bradius bggreen editMod">编辑</a><br>\
                        <a href="javascript:;" class="lk bradius bggreen editMod">启用</a><br>\
                        <a href="javascript:;" class="lk bradius bggreen editMod">删除</a></td>';
            }
            var str = '<tr><td width="80" class="wordall"><i>'+ary[i].id+'</i><span style="display: none;">'+ary[i].range_rule+'</span></td><td width="150"><span>';
            if(ary[i].name.length >= 100){
                var name100 = ary[i].name.substring(1,101);
                str += name100 +'</span><span style="display: none;">'+ary[i].name+'</span><a href="javascript:;" class="ftblue unl seeAll">展开全部</a></td>';
            }else{
                str += ary[i].name+'</span></td>';
            }
            str += '<td width="120">'+ary[i].range_name+'</td><td width="100">'+status+'<span style="display: none;">'+ary[i].status+'</span></td>';
            str += '<td width="130">'+ary[i].update_time.split(' ')[0]+'<br>'+ary[i].update_time.split(' ')[1]+'</td>';
            str +=tdStatus + '</tr>';
            $(str).appendTo('.textModuleHtml');
        }


        $('.textModuleHtml').find('.editMod').on('click',function(){
            //这个模板的id
            var moduleId = $(this).parent().parent().children('.wordall').children('i').text();
            //停用和启用的数据
            var jsonChangeStatus = {};
            //删除的数据
            var jsonChangeDelete = {};
            jsonChangeStatus.id = moduleId;
            jsonChangeDelete.id = moduleId;
            //停用和启用的接口
            var url = 'sqe.php?s=ProductDetailCommonTemplate/ajaxChangeStatus';
            //删除的接口
            var urlDelete = 'sqe.php?s=ProductDetailCommonTemplate/ajaxDeleteTemplate';
            if($(this).html() == '编辑'){
                //点击编辑按钮
                var textModule = $(this).parent().parent().children().eq(1).find('span').html();
                $('#textModule').find('textarea').eq(0).val(textModule);
                //清空下面的全部商品和id和类目内容
                emptyAll('textModule');
                $('#submitText').prev().html(moduleId);
                var moduleRuleArr = $(this).parent().parent().children('.wordall').children('span').text().replace(/{|}/g,'').split(':');
                var strIdCate = moduleRuleArr[0].replace(/\"/g,'');
                if(strIdCate == 'shop_id'){
                    $('#textModule').find('label').children().eq(0).get(0).checked = true;
                }else if(strIdCate == 'product_id'){
                    $('#textModule').find('label').children().eq(1).get(0).checked = true;
                    $('#textModule').find('.checkCate').eq(0).removeClass('Ndisplay');
                    var str = moduleRuleArr[1].replace(/^\"|\"$/g,'');
                    $('#textModule').find('.checkCate').find('textarea').val(str);
                }else if(strIdCate == 'category_id'){
                    $('#textModule').find('label').children().eq(2).get(0).checked = true;
                    $('#textModule').find('.checkCate').eq(1).removeClass('Ndisplay');
                    var str = moduleRuleArr[1].replace(/^\"|\"$/g,'');
                    var arrCid2 = str.split(',');
                    var aInputCid2 = $('#textModule').find('.cid2');
                    for(var i=0; i<aInputCid2.length; i++){
                        var dataCid = aInputCid2.eq(i).attr('data-cid');
                        if(findInArr(dataCid,arrCid2)){
                            aInputCid2.eq(i).get(0).checked = true;
                        }
                    }
                    //根据二级类目的数目  相应的一级类目展示的状态
                    judg('textModule');
                }
                $('#textModule').show();
                //查找数字是否在数组中
                function findInArr(n,arr){
                    for(var j=0; j<arr.length; j++){
                        if( n == arr[j]){
                            return true;
                        }
                    }
                    return false;
                }
            }else if($(this).html() == '启用'){
                //点击启用按钮
                var status = 2;
                jsonChangeStatus.status = status;
                $('#loadingGet').show();
                changeStatus(jsonChangeStatus,url,postPageText,page1)
            }else if($(this).html() == '停用'){
                //点击停用按钮
                var status = 3;
                jsonChangeStatus.status = status;
                $('#loadingGet').show();
                changeStatus(jsonChangeStatus,url,postPageText,page1)
            }else if($(this).html() == '删除'){
                //点击删除按钮
                var is_del = 1;
                jsonChangeDelete.is_del = is_del;
                //console.log(jsonChangeDelete)
                changeStatus(jsonChangeDelete,urlDelete,postPageText,page1)
            }


        });
        $('.textModuleHtml').find('.seeAll').on('click',function(){
            if($(this).html() == '展开全部'){
                $(this).siblings().hide();
                $(this).html('向上收缩');
                $(this).prev().show();
            }else if($(this).html() == '向上收缩'){
                $(this).siblings().hide();
                $(this).html('展开全部');
                $(this).prev().prev().show();
            }
        })


    }

//图片模板的列表创建
    function getCreatePic(ary) {
        $('.picModuleHtml').empty();
        //console.log(ary)
        for(var i=0; i<ary.length; i++){
            var status = '';
            var tdStatus = '';
            if(ary[i].status == 1){
                status = '新建';
                tdStatus = '<td width="80"><a href="javascript:;" class="lk bradius bggreen editMod">编辑</a><br>\
                        <a href="javascript:;" class="lk bradius bggreen editMod">启用</a><br>\
                        <a href="javascript:;" class="lk bradius bggreen editMod">删除</a></td>';

            }else if(ary[i].status == 2){
                status = '启用';
                // tdStatus = '<td width="80"><a href="javascript:;" class="lk bradius bggreen editMod">编辑</a><br>\
                //             <a href="javascript:;" class="lk bradius bggreen editMod">停用</a><br>\
                //             <a href="javascript:;" class="lk bradius bggreen editMod">删除</a></td>';
                tdStatus = '<td width="80"><a href="javascript:;" class="lk bradius bggreen editMod">停用</a></td>';
            }else if(ary[i].status == 3){
                status = '停用';
                tdStatus = '<td width="80"><a href="javascript:;" class="lk bradius bggreen editMod">编辑</a><br>\
                        <a href="javascript:;" class="lk bradius bggreen editMod">启用</a><br>\
                        <a href="javascript:;" class="lk bradius bggreen editMod">删除</a></td>';
            }
            var str = '<tr><td width="40" class="wordall"><i>'+ary[i].id+'</i><span style="display: none;">'+ary[i].range_rule+'</span></td><td width="350">';
            str += '<img src="'+ary[i].name+'" width="320" height="120" alt=""></td>';
            str += '<td width="80">'+ary[i].range_name+'</td><td width="50">'+status+'<span style="display: none;">'+ary[i].status+'</span></td>';
            str += '<td width="100">'+ary[i].update_time.split(' ')[0]+'<br>'+ary[i].update_time.split(' ')[1]+'</td>';
            str +=tdStatus + '</tr>';
            $(str).appendTo('.picModuleHtml');
        }


        $('.picModuleHtml').find('.editMod').on('click',function(){
            //这个模板的id
            var moduleId = $(this).parent().parent().children('.wordall').children('i').text();
            //停用和启用的数据
            var jsonChangeStatus = {};
            //删除的数据
            var jsonChangeDelete = {};
            jsonChangeStatus.id = moduleId;
            jsonChangeDelete.id = moduleId;
            //停用和启用的接口
            var url = 'sqe.php?s=ProductDetailCommonTemplate/ajaxChangeStatus';
            //删除的接口
            var urlDelete = 'sqe.php?s=ProductDetailCommonTemplate/ajaxDeleteTemplate';
            if($(this).html() == '编辑'){
                //点击编辑按钮
                var picSrc = $(this).parent().parent().children().eq(1).find('img').attr('src');
                $('#picModule').find('img').eq(1).attr('src',picSrc);
                //清空下面的全部商品和id和类目内容
                emptyAll('picModule');
                $('#submitPic').prev().html(moduleId);
                var moduleRuleArr = $(this).parent().parent().children('.wordall').children('span').text().replace(/{|}/g,'').split(':');
                var strIdCate = moduleRuleArr[0].replace(/\"/g,'');
                if(strIdCate == 'shop_id'){
                    $('#picModule').find('label').children().eq(0).get(0).checked = true;
                }else if(strIdCate == 'product_id'){
                    $('#picModule').find('label').children().eq(1).get(0).checked = true;
                    $('#picModule').find('.checkCate').eq(0).removeClass('Ndisplay');
                    var str = moduleRuleArr[1].replace(/^\"|\"$/g,'');
                    $('#picModule').find('.checkCate').find('textarea').val(str);
                }else if(strIdCate == 'category_id'){
                    $('#picModule').find('label').children().eq(2).get(0).checked = true;
                    $('#picModule').find('.checkCate').eq(1).removeClass('Ndisplay');
                    var str = moduleRuleArr[1].replace(/^\"|\"$/g,'');
                    var arrCid2 = str.split(',');
                    var aInputCid2 = $('#picModule').find('.cid2');
                    for(var i=0; i<aInputCid2.length; i++){
                        var dataCid = aInputCid2.eq(i).attr('data-cid');
                        if(findInArr(dataCid,arrCid2)){
                            aInputCid2.eq(i).get(0).checked = true;
                        }
                    }
                    //根据二级类目的数目  相应的一级类目展示的状态
                    judg('picModule');
                }
                $('#picModule').show();
                //查找数字是否在数组中
                function findInArr(n,arr){
                    for(var j=0; j<arr.length; j++){
                        if( n == arr[j]){
                            return true;
                        }
                    }
                    return false;
                }
            }else if($(this).html() == '启用'){
                //点击启用按钮
                var status = 2;
                jsonChangeStatus.status = status;
                $('#loadingGet').show();
                changeStatus(jsonChangeStatus,url,postPagePic,page2)
            }else if($(this).html() == '停用'){
                //点击停用按钮
                var status = 3;
                jsonChangeStatus.status = status;
                $('#loadingGet').show();
                changeStatus(jsonChangeStatus,url,postPagePic,page2)
            }else if($(this).html() == '删除'){
                //点击删除按钮
                var is_del = 1;
                jsonChangeDelete.is_del = is_del;
                changeStatus(jsonChangeDelete,urlDelete,postPagePic,page2)
            }


        });

    }

//文字模板页码的回调函数
    function postPageText(nowN){
        postTextData['p'] = nowN;
        postTextData.type = 1;
        getWord(postTextData)
    }
//图片模板页码的回调函数
    function postPagePic(nowN){
        postPicData['p'] = nowN;
        postPicData.type = 2;
        getPic(postPicData);
    }

//点击一级和二级类目  相应的选中状态改变  id为模块id
    function judgCid1andCid2(id){
        //点击二级类目选中框  去判断父级是否是选中还是不选中
        $('#'+id).find('.cid2').on('click',function(){
            //num为总个数
            if($(this).find('span').hasClass('Bdisplay')){
                $(this).find('span').removeClass('Bdisplay')
            }else{
                $(this).find('span').addClass('Bdisplay')
            }
            var numAll = $(this).parents('.second-menu').find('.cid2').children('span').length;
            var numChecked = $(this).parents('.second-menu').find('.cid2').children('span').filter('.Bdisplay').length;
            //numCheck 为选中的个数
            if(numChecked == 0){
                $(this).parents('.second-menu').prev().find('span').removeClass('Bdisplay').removeClass('block');
            }else{
                if(numChecked == numAll){
                    $(this).parents('.second-menu').prev().find('span').addClass('Bdisplay').removeClass('block');
                }else{
                    $(this).parents('.second-menu').prev().find('span').removeClass('Bdisplay').addClass('block');
                }
            }

        });
        //点击一级类目选中框  去判断子级是否是选中还是不选中
        $('#'+id).find('.cid1').on('click',function(){
            if($(this).find('span').hasClass('Bdisplay')){
                $(this).find('span').removeClass('Bdisplay').removeClass('block');
                $(this).parent().next().find('.cid2').children('span').removeClass('Bdisplay')
            }else{
                $(this).find('span').addClass('Bdisplay').removeClass('block');
                $(this).parent().next().find('.cid2').children('span').addClass('Bdisplay')
            }
        })

    }
    ////根据二级类目的选中个数  判断一级类目是否选中
    function judg(id){
        var aInputCid1 = $('#'+id).find('.cid1');
        for(var i=0; i<aInputCid1.length; i++){
            var cid2Num  = aInputCid1.eq(i).parent().siblings('ul').find('.cid2').length;
            var cid2CheckedNum  = aInputCid1.eq(i).parent().siblings('ul').find('.cid2').children('span').filter('.Bdisplay').length;
            if(cid2CheckedNum == 0){
                aInputCid1.eq(i).find('span').removeClass('Bdisplay').removeClass('block');
            }else{
                if(cid2CheckedNum == cid2Num){
                    aInputCid1.eq(i).find('span').addClass('Bdisplay').removeClass('block');
                }else{
                    aInputCid1.eq(i).find('span').removeClass('Bdisplay').addClass('block');
                }
            }
        }
    }
///提交的时候 获取一级类目 二级类目选中的   返回一个含有类目cid的数组
    function getArrCidId(id){
        var arrCid = [];
        //先获取所有的 cid1元素数目
        var num = $('#'+id).find('.cid1').length;
        for(var i=0; i<num; i++){
            var oInput = $('#'+id).find('.cid1').eq(i);
            if(oInput.get(0).checked == true){
                arrCid.push(oInput.attr('data-cid'));
            }else{
                var numCid2 = oInput.siblings('ul').find('.cid2').length;
                for(var j=0; j<numCid2; j++){
                    var oInputCid2 = oInput.siblings('ul').find('.cid2').eq(j);
                    if(oInputCid2.get(0).checked == true){
                        arrCid.push(oInputCid2.attr('data-cid'));
                    }
                };
            }
        };
        return arrCid;
    }
//获取一级二级的类目推送到相应的模板中
    function createCidHtml(category,id){
        $(id).find('ul.overAuto').empty();
        var arr = category;
        for(var i=0; i<arr.length; i++){
            var str = '<li><input type="checkbox" class="cid1" data-cid="'+arr[i].cid+'"/><em class="noWrap">'+arr[i].name+'</em>';
            str+='<img class="ml155" src="./publicseller/SQE/img/fl_right.png"/><ul class="pl20 mt5"></ul></li>';
            $(id).find('ul.overAuto').append(str);
            var arrCid2 = arr[i].cats;
            for(var j=0; j<arrCid2.length; j++){
                var str2 = '<li><input type="checkbox" data-cid="'+arrCid2[j].cid+'" data-parent-cid="'+arrCid2[j].parent_cid+'" class="cid2"><span class="noWrap">'+arrCid2[j].name+'</span></li>';
                $(id).find('ul.mt5').eq(i).append(str2);
            }
        }
        $(id).find('ul.mt5').eq(0).addClass('curOut').prev().attr('src','./publicseller/SQE/img/fl_down.png')
    }

//点击提交按钮  判断范围和判断id和类目   给出相应的提示框  参数id是textModule等   arrPId是商家的所有商品id  shopID是商户的id
    function judgIdandCid(id,arrPId,jsonAdd,shopId,fn) {
        var oInput = $(id).find('label').children().filter(':checked');
        var arrErrorId = [];
        if(oInput.length == 0){
            var str = '请选中商品范围';
            errorMsg(str);
            return false;
        }else{
            var str = oInput.attr('data-cate');
            if(str == 'shopAll'){
                //说明选中的是所有商品
                jsonAdd.range = 'shop';
                jsonAdd.range_rule = '{\"shop_id\":\"'+shopId+'\"}';
                if($(id).find('.shopIdSave').html()){
                    var moduleId = $(id).find('.shopIdSave').html();
                    jsonAdd.id = moduleId;
                    url = 'sqe.php?s=ProductDetailCommonTemplate/ajaxUpdateTemplate';
                }else{
                    url = 'sqe.php?s=ProductDetailCommonTemplate/ajaxAddTemplate';
                }
                fn(jsonAdd,url)

            }else if(str == 'shopId'){
                //说明以商品id为选择的类目
                var strId = $(id).find('.checkCate').find('textarea').eq(0).val();
                if(strId.length == 0){
                    var str = 'id不能为空';
                    errorMsg(str);
                    return false;
                }
                var judgId = {};
                judgId.productIds = strId;
                $.post('sqe.php?s=ProductDetailCommonTemplate/ajaxExistProductIds',judgId, function (data) {
                    var json = eval('('+data+')');
                    //console.log(json);
                    if(json.status == 1){
                        //数组去重 arrId为最终的 商品id 传给后台
                        var strId = $(id).find('.checkCate').find('textarea').eq(0).val();
                        var arrId = strId.split(',');
                        deleteSame(arrId);
                        var strId = arrId.join(',')
                        jsonAdd.range = 'product_id_list';
                        jsonAdd.range_rule = '{\"product_id\":\"'+strId+'\"}';
                        if($(id).find('.shopIdSave').html()){
                            var moduleId = $(id).find('.shopIdSave').html();
                            jsonAdd.id = moduleId;
                            url = 'sqe.php?s=ProductDetailCommonTemplate/ajaxUpdateTemplate';
                        }else{
                            url = 'sqe.php?s=ProductDetailCommonTemplate/ajaxAddTemplate';
                        }
                        fn(jsonAdd,url)
                    }else{
                        var str = '这些id是错误的:['+ json.info +']';
                        errorMsg(str);
                        return false;
                    }

                });

            }else if(str == 'shopCate'){
                //说明以类目为选择依据
                if($(id).find('.cid2').filter(':checked').length == 0){
                    var str = '请选中类目范围';
                    errorMsg(str);
                    return false;
                };
                var aInputCid1 = $(id).find('.cid1');
                var arrCid12 = [];
                for(var i=0; i<aInputCid1.length; i++){
                    if($(id).find('.cid1').eq(i).get(0).checked == true){
                        var aInputCid2Checked = $(id).find('.cid1').eq(i).siblings('ul').find('.cid2').filter(':checked');
                        for(var j=0; j<aInputCid2Checked.length; j++){
                            arrCid12.push(aInputCid2Checked.eq(j).attr('data-cid'));
                        }
                    }else{
                        var aInputCid2Checked = $(id).find('.cid1').eq(i).siblings('ul').find('.cid2').filter(':checked');
                        for(var j=0; j<aInputCid2Checked.length; j++){
                            arrCid12.push(aInputCid2Checked.eq(j).attr('data-cid'));
                        }
                    }

                };
                var strCid = arrCid12.join(',');
                jsonAdd.range = 'category';
                jsonAdd.range_rule = '{\"category_id\":\"'+strCid+'\"}';
                if($(id).find('.shopIdSave').html()){
                    var moduleId = $(id).find('.shopIdSave').html();
                    jsonAdd.id = moduleId;
                    url = 'sqe.php?s=ProductDetailCommonTemplate/ajaxUpdateTemplate';
                }else{
                    url = 'sqe.php?s=ProductDetailCommonTemplate/ajaxAddTemplate';
                }
                fn(jsonAdd,url)


            }
        }



        //查找数字是否在数组中
        function findInArr(n,arr){
            for(var j=0; j<arr.length; j++){
                if( n == arr[j]){
                    return true;
                }
            }
            return false;
        }
        //删除数组中重复的数字
        function deleteSame(arr){
            arr.sort();
            for(var i=0; i<arr.length; i++){
                if(arr[i] == arr[i+1]){
                    arr.splice(i,1);
                    i--;
                }
            }
        }

    }

//错误的时候的提示信息
    function errorMsg(str){
        $('#errorMsg').modal('show').find('.errmsgShow').html(str);
    }
///判断文字模块是否 符合要求
    function judgText(){
        var strContent = $('#textModule').find('textarea').val();
        var reg = /^[\u4E00-\u9FA5\~\`\!\@\#\$\%\^\&\*\(\)\-\_\+\=\|\\\[\]\{\}\;\:\·\"\'\,\<\.\>\/\?\，\。\“\”\；\：\’\‘\！\（\）\【\】\{\}\…\……\￥\~\——\—\、\《\》\？\、\|\.0-9A-Za-z]{1,50}$/g;
        if(reg.test(strContent) == false){
            var str = '文字不能为空而且字数不超过50，文字格式包括中英文和常用的标点符号，暂不支持其他字符';
            errorMsg(str);
            return false;
        };
        return true;
    }
///点击创建的时候  要清空已经有的 范围类目和id类目 商品类目
    function emptyAll(id){
        $('#'+id).find('label').children().removeAttr("checked");
        $('#'+id).find('.checkCate').find('textarea').val('');
        $('#'+id).find('.checkCate').addClass('Ndisplay');
        $('#'+id).find('.checkCate').find('.cid1').removeAttr("checked");
        $('#'+id).find('.checkCate').find('.cid2').removeAttr("checked");
    }

})