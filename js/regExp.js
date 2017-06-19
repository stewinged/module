/**
 * Created by Administrator on 2016/11/4.
 */

$(function(){
    $('.firm').on('click',function(){
        var dataid = $(this).attr('data-id');
        if(dataid == 1){
            var reg = /^[\u4E00-\u9FA5\~\`\!\@\#\$\%\^\&\*\(\)\-\_\+\=\|\\\[\]\{\}\;\:\·\"\'\,\<\.\>\/\?\，\。\“\”\；\：\’\‘\！\（\）\【\】\{\}\…\……\￥\~\——\—\、\《\》\？\、\|\.0-9A-Za-z]{1,10}$/g;
        }else if(dataid == 2){
            var reg = /^[0-9A-Za-z\u4E00-\u9FA5]{1,10}$/g;
        }else if(dataid == 3){
            var reg = /^[0-9A-Za-z\u4E00-\u9FA5\"\“\”\，\,\.\。]{1,10}$/g;
        }
        var str = $(this).prev().val();
        if(reg.test(str)){
            $(this).next().text('true')
        }else{
            $(this).next().text('false')
        }
    })
})


