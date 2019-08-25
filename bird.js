;window.onload = function () {
    function $(idName) {
        return document.getElementById(idName);
    }
    var gameStart  = $('gameStart'), gameEnter = $('gameEnter'),
        myBird = $('myBird'), pipes = $('pipes'), scores = $('scores');
    var allPipes = [];
    var s = false, flyHeight = 20, a = null, distance = 100, score = 0;
    btn = $('btn');
    btn.onclick = function () {
        gameStart.style.display = 'none';
        gameEnter.style.display = 'block';
        document.onkeyup = function (evt) {
            var e = evt || window.event;
            var c = e.keyCode;
            if (c === 32) {
                if (!s) {
                    // 游戏开始
                    console.log('开始');
                    birdFly();
                    gameEnter.onclick = function () {
                        birdFly(true);
                    };
                    create();
                    continueGame();
                } else {
                    //
                    console.log('暂停');
                    stop();
                }
                s = !s;
            }
        }
    };
    // 落体和飞翔,flag => true飞翔,flag => false 落体
    function birdFly(flag) {
        if (myBird.timer) {
            clearInterval(myBird.timer);
            delete myBird.timer;
        }
        var speed = flag ? -1 : 1.5;
        var end = getStyle(myBird, 'top') - flyHeight;
        myBird.timer = setInterval(function () {
            var moveVal = getStyle(myBird, 'top');
            if (moveVal <= 0) {
              speed = 1.5;
            }
            if (moveVal === end) {
                speed = 1.5;
                myBird.style.top = moveVal + speed + 'px';
            } else {
                myBird.style.top = Math.min(480 - 26 - 42 - 14, moveVal + speed) + 'px';
                // var imgName = birdImg.src.match(/\/([a-zA-Z]+)\./)[0];
                // if (speed > 0 && imgName !== 'down') {
                //     birdImg.src = 'img/down.gif';
                // } else if (speed < 0 && imgName !== 'up') {
                //     birdImg.src = 'img/up.gif';
                // }
                if (moveVal >= 480 - 26 - 42 - 14) {
                    clearInterval(myBird.timer);
                    delete myBird.timer;
                }
            }
            impact();
        }, 10)
    }
    //单位时间创建管道
    function create() {
        a = setInterval(function () {
            createPipe();
        }, 2000);
    }
    function createPipe() {
        var div = document.createElement('div');
        div.className = 'p';
        div.s = true; // 管道属性为真时，需要检测小鸟和管道的碰撞
        var randUp_modH = randHeight();
        var randDown_modH = 480 - 42 -14 - distance - randUp_modH - 60 - 60;
        div.innerHTML = `<div class="up"><div class="up_mod" style="height:${randUp_modH}px"></div> <div class="up_pipe"></div> </div> <div class="down"> <div class="down_pipe"></div> <div class="down_mod" style="height:${randDown_modH}px"></div> </div>`
        pipes.appendChild(div);
        pipeMove(div);
        allPipes.push(div);
    }
    //管道的运动
    function pipeMove(p) {
        var speed = -1;
        p.timer = setInterval(function () {
            var moveVal = getStyle(p, 'left');
            if (moveVal <= -62) {
                clearInterval(p.timer);
                p.timer = undefined;
                pipes.removeChild(p);
                allPipes.splice(0, 1);
            } else {
                if (moveVal + speed <= 60 - 62 && p.s) {
                    p.s = false; // 管道失效
                    scores.innerHTML = ++score;
                }
                p.style.left = moveVal + speed + 'px';
            }
            impact();
        }, 10)
    }
    //小鸟和管道的碰撞
    function impact() {
        var myBirdT = getStyle(myBird, 'top');
        for(var i = 0; i < allPipes.length; i++) {
            if (allPipes[i].s) {
                var pipLeft = getStyle(allPipes[i], 'left');
                var upH = getStyle(allPipes[i].firstElementChild, 'height');
                if ((60 + 40) >= pipLeft && 60 <= pipLeft + 62 && (myBirdT <= upH || myBirdT + 26 >= upH + distance)) {
                    alert('Game Over：' + score);
                    gameOver();
                }
            }
        }
    }

    // 游戏结束函数
    function gameOver() {
        clearInterval(a);
        clearInterval(myBird.timer);
        gameEnter.style.display = 'none';
        gameStart.style.display = 'block';
        gameEnter.onclick = null;
        score = 0;
        scores.innerHTML =  0;
        s = false;
        for (var i = allPipes.length - 1; i >= 0; i--) {
            clearInterval(allPipes[i].timer);
            pipes.removeChild(allPipes[i]);
        }
        allPipes = [];
    }

    // 随机高度
    function randHeight() {
        return Math.floor(Math.random() * (480 - 42 - 14 - 60 - 60 - 100 + 1))
    }

    //游戏暂停
    function stop() {
        clearInterval(a);
        clearInterval(myBird.timer);
        gameEnter.onclick = null;
        for (var i = allPipes.length - 1; i >= 0; i--) {
            clearInterval(allPipes[i].timer);
        }
    }
    // 暂停之后的继续开始游戏
    function continueGame() {
        for (var i = allPipes.length - 1; i >= 0; i--) {
            pipeMove(allPipes[i]);
        }
    }
    function getStyle(ele, attr) {
        var res = null;
        if (ele.currentStyle) {
            res = ele.currentStyle[attr];
        } else {
            res = window.getComputedStyle(ele, null)[attr];
        }
        return parseFloat(res);
    }
};