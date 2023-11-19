window.addEventListener('scroll', function () { // 回到顶部功能的事件监听器
    var div = document.getElementsByClassName('gototop')[0];
    if (window.pageYOffset > 0 && div) {
        div.style.display = 'block';
    } else if (div) {
        div.style.display = 'none';
    }
});
// the end
var isShowDown = false;
function showDown(e) {
    // var ben = document.getElementById(e?.id);
    var nav = document.querySelector("nav");
    if (!isShowDown) {
        isShowDown = true;
        nav.style.display = "block";
    }
    else {
        isShowDown = false;
        nav.style.display = "none";
    }
}


// 轮播图代码
