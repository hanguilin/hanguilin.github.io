
var canvas = document.getElementById('bulletchat_canvas'),
    ctx = canvas.getContext('2d'),
    WIDTH,
    HEIGHT,
    stars = [],
    initStarsPopulation = 80,
    dots = [],
    dotsMinDist = 2,
    maxDistFromCursor = 50;


function setCanvasSize() {
    WIDTH = document.documentElement.clientWidth,
        HEIGHT = document.documentElement.clientHeight;

    canvas.setAttribute("width", WIDTH);
    canvas.setAttribute("height", HEIGHT);
}

function startBulletChat($parent) {
    var $div = $parent.find('.bulletchat_area').find('div')
    // var aShowList = document.querySelectorAll('.bulletchat_area div');//获取元素 H5
    for (var i = 0; i < $div.length; i++) {
        init($div.eq(i)[0], $parent);//执行初始化函数
    }
}

function init(obj, $parent) {//接受弹幕对象
    var $bulletchat_screen = $parent

    // 关闭弹幕
    if (!$bulletchat_screen || $bulletchat_screen.length === 0) {
        return
    }
    //确定top值的随机区间
    var elemHeight = $bulletchat_screen[0].offsetHeight
    var maxTop = elemHeight - obj.offsetHeight;//高度差范围
    obj.style.top = maxTop * Math.random() + 'px';
    //控制left值
    var screenWidth = document.documentElement.clientWidth;//获取可视宽度
    var maxLeft = screenWidth - obj.offsetWidth/* - Math.random() * 800 */;//随机宽度差
    obj.style.left = maxLeft + 'px';
    //弹幕的随机颜色
    obj.style.color = randomColor();
    /*setInterval(function(){
        move(obj,maxLeft);
    },1000);*///普通定时器
    move(Math.random() * 5 + 1, obj, maxLeft, $parent);
}
//弹幕移动函数
function move(k, obj, maxLeft, $parent) {
    var speed = k;//控制速度的变量
    maxLeft -= speed;//往左移动
    if (maxLeft > -obj.offsetWidth) {
        obj.style.left = maxLeft + 'px';
        requestAnimationFrame(function () {
            move(k, obj, maxLeft, $parent);
        });//H5新增的动画函数
    } else {
        init(obj, $parent);//重新初始化 营造循环弹幕效果
        /*  oShow.removeChild(obj);//DOM删除子节点 */
    }
}
//随机颜色函数
function randomColor() {
    return '#' + Math.random().toString(16).slice(-6);//一行简化版截取后六位
    /*var str = '#';
    for(var i = 0;i < 6;i++){
        str += Math.floor(Math.random() * 16).toString(16);
    }
    return str;*///普通逻辑版
}

function clearBulletChat ($parent) {
    $parent.find('.bulletchat_area').empty()
}

function getBulletChatList($parent) {
    if ($parent.hasClass('hide')) {
        $parent.removeClass('hide')
    }

    // 情况旧数据
    var $default = $parent.find('.bulletchat_area').find('.default')
    clearBulletChat($parent)

    var QUERY = {"url": CONFIG.leancloud.bulletChatRepoURL}
    $.ajax({
        type: "GET",
        url: `${CONFIG.leancloud.baseURL}/1.1/classes/${CONFIG.leancloud.bulletChatRepo}?where=${JSON.stringify(QUERY)}&order=-createdAt`,
        headers: {
            'X-LC-Id': CONFIG.leancloud.appId,
            'X-LC-Key': CONFIG.leancloud.appKey,
            'Content-Type': 'application/json'
        },
        dataType: "json",
        success: function(data){
            if (data && data.results) {
                var bulletChatArr = []
                // 筛选出去除标签还有字符的评论
                data.results.forEach(e => {
                    var comment = ''
                    if (comment = matchReg(e.comment)) {
                        bulletChatArr.push(comment)
                    }
                })
                if (bulletChatArr) {
                    var bulletChatHtml = ''
                    bulletChatArr.forEach(e => {
                        bulletChatHtml += `<div class="magictime twisterInUp">${e}</div>`
                    })
                    
                    // 将默认弹幕添加到最前面
                    for (var i = 0; i < $default.length; i++) {
                        bulletChatHtml = $default.eq(i).prop("outerHTML") + bulletChatHtml
                    }
                    $parent.find('.bulletchat_area').html(bulletChatHtml)
                    setCanvasSize()
                    startBulletChat($parent)
                }
            }
        }
    })
}

function matchReg(str){
    let reg=/<\/?.+?\/?>/g;
    return str.replace(reg,'').replaceAll(' ', '')
}
