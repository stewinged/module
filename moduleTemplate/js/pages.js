/**
 * Created by Administrator on 2016/11/4.
 */
//json是一个{current_page:1,count_page:10}  fn为发送ajax请求的数据回调函数 id是Ul的id
var Page = function (json, id, fn) {
    this.num = 5;
    this.pageA = [];
    this.init(json, id, fn);
}

Page.prototype = {
    init: function (json, id, fn) {
        this.nowPage = json.current_page;
        this.pageCount = json.count_page;
        this.pageWrap = id;
        this.fn = fn;
        this.create();
    },
    create: function () {
        var limit = Math.floor(this.num / 2),
            num = this.num;
        curPage = this.nowPage,
            pageCount = this.pageCount,
            max = curPage < num ? (num > pageCount ? pageCount : num) : (pageCount <= curPage + limit ? pageCount : curPage + limit),
            start = curPage < num ? 1 : max - num + 1,
            pre = curPage == 1 ? 1 : curPage - 1,
            next = curPage == pageCount ? pageCount : curPage + 1,
            pageHtml = '<li><a href="javascript:;" page-num="1">首页</a></li><li><a href="javascript:;" page-num="' + pre + '">上一页</a></li>';

        for (start; start <= max; ++start) {
            if (curPage == start) {
                pageHtml += '<li class="active"><a href="javascript:;" page-num="' + start + '">' + start + '</a></li>';
            } else {
                pageHtml += '<li><a href="javascript:;" page-num="' + start + '">' + start + '</a></li>';
            }
        }
        pageHtml += '<li><a href="javascript:;" page-num="' + next + '">下一页</a></li><li><a href="javascript:;" page-num="' + pageCount + '">尾页</a></li><div><span>共' + pageCount + '页，跳至</span><input id="toPage" type="text"/><span>页</span></div><li><a href="javascript:;" page-num="xx">确定</a></li>';
        this.pageWrap.innerHTML = pageHtml;
        this.pageA = this.pageWrap.getElementsByTagName('a');
        this.redirect();
    },
    redirect: function () {
        var pageA = this.pageA;
        var self = this;
        for (var i = 0; i < pageA.length; ++i) {
            var pA = pageA[i];
            pA.onclick = function () {
                var pageNum = this.getAttribute('page-num');
                var d = document;
                if (pageNum) {
                    if (pageNum == 'xx') {
                        pageNum = document.getElementById('toPage').innerHTML;
                    }
                    pageNum = parseInt(pageNum);
                    if (!isNaN(pageNum)) {
                        if (pageNum > self.pageCount) {
                            pageNum = self.pageCount;
                        }
                        if (pageNum < 1) {
                            pageNum = 1;
                        }
                        if (pageNum != self.nowPage) {
                            self.fn(pageNum);
                        }
                    }
                }
                return false;
            }
        }
    }
};




//     ////getAjaxData 是发送ajax请求   获取数据 创建页面   //json是一个{current_page当前页:1,count_page总页数:10}  fn为回调函数 id是Ul的id
//
//     var URL = '../test.php';
//     var data = {};
//     function getAjaxData(data) {
//         $.post(URL, data, function (e) {
//             var json = eval('('+e+')');
//             var page = json.data.data.page;
//             console.log(page.current_page)
//             new Page(page, pageMode, fn);
//         })
//     }
//     fn(1)
// ////fn(num)  num是第几页   fn是分页的回调函数   data可以设置一个全局变量
//     function fn(num) {
//         ///定义数据   data.p  表示获取第几页的数据
//         data.p = num;
//         getAjaxData(data);
//     }




