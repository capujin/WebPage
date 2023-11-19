var intervalId; //计时器的id
intervalId = setInterval(autoPlay, 3000);   //设置自动播放
var body = document.querySelector("body");
console.log(body);
var index = 0;  //全局索引
var imgparent = document.getElementById("imglist"); //图片父元素
console.log(imgparent);
var img = imgparent.querySelectorAll("img");//图片
var offX = img[0].clientWidth;
var imgTurnTime = 1000; // 翻页时间
var li = document.querySelectorAll(".show .li")
// var isAddOrDown = true;
const IMGLEN = img.length - 1;  //图片数量，最后一张为实现循环效果不算做总数量

window.addEventListener("load", () => {
    autoShow(); // 默认第一个小圆点高亮
});
function autoPlay() {    // 播放图片
    index++;
    restartIndex(); //换页就检查索引
    transImg(index * -offX);    //移动图片
    autoShow();
    //平滑过渡
    if (index - 1 == -1) {
        transImg(-offX * IMGLEN);
        setTimeout(() => {
            imgparent.setAttribute("style", "transition:all 0s;transform: translateX(" + 0 + "px)");
        }, imgTurnTime);
    }
}
function autoShow() {    // 切换圆点
    for (var i = 0; i < IMGLEN; i++) {
        li[i].removeAttribute("style");
    }
    li[index % 3].setAttribute("style", "background-color: aquamarine");    // 高亮圆点
}
li[0].parentNode.addEventListener("click", e => {   // 监听圆点按下事件
    restartTimer();
    switch (e.target?.id) {
        case "a":
            index = 0;
            break;
        case "b":
            index = 1;
            break;
        case "c":
            restartTimer();
            index = 2;
            break;
    }
    transImg(-index * offX);
    autoShow();
})

function restartTimer() {   //  重置计时器
    clearInterval(intervalId); // 清除之前的计时器
    intervalId = setInterval(autoPlay, 3000);   // 每3秒自动轮播图片
}
function restartIndex() {   //   重置索引
    if (Math.abs(index) >= IMGLEN) {
        index = 0;
    }
}
function transImg(x) { // 图片移动
    imgparent.setAttribute("style", "transform: translateX(" + parseInt(x) + "px)");
}