/**
 * Created by Administrator on 2016/11/7.
 */
require(['jquery','bootstrap','director'], function ($) {
////当浏览器点击后退和前进的时候
    $(window).on('popstate',function(){
        var name =  '#' +location.href.split('#')[1];
        $('.navside_sec ').removeClass('cur');
        $('.navside_sec ').each(function(i,el){
            var hrefName = $(el).children('a').attr('href');
            if(hrefName == name){
                $(el).addClass('cur')
            }
        })
    })
    $('.navside_first').on('click',function(){
        var oUl = $(this).next('ul');
        if(oUl.length>0){
            if(oUl.hasClass('Ndisplay')){
                oUl.removeClass('Ndisplay')
                $(this).find('img').css({
                    "transform":"rotate(0deg)"
                })
            }else{
                oUl.addClass('Ndisplay')
                $(this).find('img').css({
                    "transform":"rotate(180deg)"
                })

            }


        }

    })
    if(location.href.indexOf('#') == -1){
        if(location.href.indexOf('showmodule') == -1){
            $('.navside_sec').eq(0).addClass('cur');
        }else{
            $('.module-nor').addClass('cur');
        }

    }
    $('.navside_sec').on('click',function(){

        if($(this).children('a').attr('href').indexOf('#') != -1){
            $('.navside_sec').removeClass('cur');
            $(this).addClass('cur');
        }
        event.stopPropagation();

    })
    var  route = {
        "/table/table":moduleChange,
        "/ui/button":moduleChange,
        "/ui/text":moduleChange,
        "/ui/layout":moduleChange,
        "/ui/fontsize":moduleChange,
        "/tab/tab":moduleChange,
        "/model/model":moduleChange,
        "/form/form":moduleChange,
        "/pannel/categroy":moduleChange,
        "/pannel/modal":moduleChange,
        "/js_module/pages":moduleChange,
        "/js_module/regExp":moduleChange,
        "/js_module/calendar":moduleChange,
        "/sdk/index":moduleChange
    }

    //初始化路由
    var router = Router(route)
    router.init();
    function moduleChange(){
        $('#showModule').empty();
        var name = location.href.split('#')[1].substring(1);
        var str = name.indexOf('/');
        var strId = name.split('/')[1];
        if(str != -1){
            //说明是二类页卡
            $('.navside_sec').each(function(i,el){
                if($(el).find('a').attr('href').indexOf('#') != -1){
                    if($(el).find('a').attr('href').split('#')[1].substring(1) == name){
                        $(el).addClass('cur');
                    }
                }
            })

        }
        var URL = name + '.html';
        $('#showModule').load(URL + ' #'+strId,function(){
            var strId = location.href.split('#')[1].substring(1).split('/')[1];
            if(strId == 'pages' || strId == 'regExp'){
                var scriptTag = document.getElementById('modulejs');
                if(scriptTag){
                    $('#modulejs').remove();
                }
                var oHead = document.getElementsByTagName('HEAD').item(0);
                var oScript= document.createElement("script");
                oScript.type = "text/javascript";
                oScript.src='../js/'+strId+'.js';
                oScript.id='modulejs';
                oHead.appendChild(oScript);
            }

        });

    }
    
    

});