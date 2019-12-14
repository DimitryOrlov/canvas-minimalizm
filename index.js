var canvas;
var ctx;
var FPS = 60;
var startText = "PLAY";
var victorytText = "Completed";
var loseText = "You died D:";

var dX = 3;
var dY = 5;

var scoreTextStyle = "white";

const EARTH_ALTITUDE = 720 - 100;
const PADDLE_HEIGHT = 100;
const PADDLE_THICKNESS = 10;

var img = new Image();
var coinImage = new Image();
//tamamoImage.src = 'F:/NodeJS/canvas-minimalizm/images/tamamoE.png';
coinImage.src = 'http://www.williammalone.com/articles/create-html5-canvas-javascript-sprite-animation/downloads/sprite-animation-demo/images/coin-sprite-animation.png';
var coinWidth = 0;
var tick_count = 0;

var gameTime = 0;
var start = Date.now();
// возвращает временную метку в мс
var perfNow = performance.now();
var times = 0;

var inter;
var gravity = false;
var isGameOver;

var cube = {
    X: 0,
    Y: 500,
    W: 60,
    H: 30
}
var cubePrevious = {
    X: 0,
    Y: 500,
    W: 60,
    H: 30
}

var mouseX,
    mouseY;

var brickRowCount = 1;
var brickColumnCount = 1;
var brickWidth = 375;
var brickHeight = 360;
var brickPadding = 75;
var brickOffsetTop = 60;
var brickOffsetLeft = 60;
var bricks = [];
for(var r = 0; r < brickRowCount; r++) {
    bricks[r] = [];
    for(var c = 0; c < brickColumnCount; c++) {
        bricks[r][c] = { x: 0, y: 0 };
    }
}

var timer = 0;
var intermediateTimer = 0;
var lastTime;
//-------------------------------------------------- LOOP START -----------------------------------------------------//

window.onload = function() {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext('2d');
    canvas.width = 0;
    canvas.height = 720;
    
    // Более совершенный подход в отображении сцены игры.
    function main() {
        // получаем дату в виде миллисекунд
        var now = Date.now();
        // разница между текущим временем и временем последнего обновления(изначально lasttime = 0, делим на 1000 чтобы получить секунды)
        var dt = (now - lastTime) / 1000.0;
        
        // обновляем и отображаем сцены
        update(dt);
        moveEverything();
        drawEverything();
        //drawBricks();
        handleInput();
        drawSprite();
        clickCoin();
        mouseListen();
        gg();
        lastTime = now;
        // постановка в очередь следующего цикла
        requestAnimationFrame(main);
    };

    main();
    
}

//------------------------------------------------ MOUSE EVENTS ----------------------------------------------------//

// startMenu
document.getElementById("start-button").onclick = function() {
    startGame();
}

// endMenu
//document.getElementById("start").onclick = "/*cделать ссылку на нач. страницу*/";

document.getElementById("replay").onclick = function() {
    reset();
}
    
// if(document.getElementById("start-button").clicked = true) {
//     reset();
// }

//------------------------------------------------ GAME LOGIC -----------------------------------------------------//

function handleInput() {
    if(input.isDown("UP") || input.isDown("w")) {
        if(cube.X > 100 && cube.X < 100 + brickWidth && cube.Y > 200 && cube.Y < 200 + brickHeight) {
            cubePrevious.Y = cube.Y;
            cube.Y = 200 + brickHeight;
        } else {
            cubePrevious.Y = cube.Y;
            cube.Y -= 5;
        }
    }

    if(input.isDown("DOWN") || input.isDown("s")) {
        if(cube.X > 100 && cube.X < 100 + brickWidth && cube.Y > 200 && cube.Y < 200 + brickHeight) {
            cubePrevious.Y = cube.Y;
            cube.Y = 200 - cube.H;
        } else {
            cubePrevious.Y = cube.Y;
            cube.Y += 5;
        }    
    }

    if(input.isDown("RIGHT") || input.isDown("d")) {
        if(cube.X > 100 && cube.X < 100 + brickWidth && cube.Y > 200 && cube.Y < 200 + brickHeight) {
            cubePrevious.X = cube.X;
            cube.X = 100 - cube.W;
        } else {
            cubePrevious.X = cube.X;
            cube.X += 5;
        }
    }

    if(input.isDown("LEFT") || input.isDown("a")) {
        if(cube.X > 100 && cube.X < 100 + brickWidth && cube.Y > 200 && cube.Y < 200 + brickHeight) {
            cubePrevious.X = cube.X;
            cube.X = 100 + brickWidth;
        } else {
            cubePrevious.X = cube.X;
            cube.X -= 5;
        }
    }  
    checkPlayerBounds();

}

function checkPlayerBounds() {
    if(cube.X < 0) {
        cube.X = 0;
    } else if(cube.X > canvas.width - cube.W) {
        cube.X = canvas.width - cube.W;
    } else if(cube.Y < 0){
        cube.Y = 0;
    } else if(cube.Y > EARTH_ALTITUDE - cube.H) {
        cube.Y = EARTH_ALTITUDE - cube.H;
    }
}

function collisionDetection() {
    for(var r = 0; r < brickRowCount; r++) {
        for(var c=0; c < brickColumnCount; c++) {
            var b = bricks[r][c];
            if(cube.X > b.x && cube.X < b.x+brickWidth && cube.Y > b.y && cube.Y < b.y+brickHeight) {
                cube.X -= 5;
            }
        }
    }    
}

function clickCoin() {
    canvas.addEventListener("click", function(e) {
        if((mouseX > 0 && mouseX < 100) && (mouseY > 0 && mouseY < 100)) {
            coinImage.src = "";
            isGameOver = true;
        }
    });
}

function mouseListen() {
    canvas.addEventListener('mouseup', function (e) {
        mouseX = e.pageX - e.target.offsetLeft,
        mouseY = e.pageY - e.target.offsetTop;
    });
}

// отрисовка спрайта
function tick() {
    if(tick_count > 24){
        drawSprite();
        tick_count = 0;
    }
    tick_count++;
    //tick();
    requestAnimationFrame(tick);
}

function drawSprite() {
    //ctx.clearRect(0, 0, 100, 100);
    //ctx.colorRect(0, 0, 100, 100, "black");
    if(coinWidth === 900){
        coinWidth = 0;
    } else {
        coinWidth = coinWidth + 100;
    }

    //ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
    // монета
    ctx.drawImage(coinImage, coinWidth, 0, 100, 100, 0, 0, 100, 100);
    // kitsune
    //ctx.drawImage(tamamoImage, widthTamamo, 0, 96, 96, 0, 0, 96, 96);
}

// function init() {
//     document.getElementById("replay").addEventListener("click", function() {
//         reset();
//     });

//     reset();
//     lastTime = Date.now();
//     //main();
// }


// Обновление состояния объектов игры
function update(dt) {
    gameTime += dt;
    handleInput(dt);
}

function moveEverything() {
    //main cube condition
    if(cube.Y < canvas.height - 100 - cube.H) {
        //cube.Y = cube.Y + cubeSpeedY;
        //gravity = true;
    }

    // пробное столкновение
    if(cube.X > 85 - cube.W) {
        // cube.Y = cubeY + cubeSpeedY;
        //cube.X = cube.X - cubeSpeedX;
    }
    
    if(cube.Y < 100) {
        //gameOver();
    }
}

function startGame() {
    document.getElementById("start-menu").style.display = "none";
    document.getElementById("start-menu").style.zIndex = "1";
    canvas.width = 1280;
    isGameOver = false;
    gameTime = 0;
    inter = false;
}

function gameOver() {
    document.getElementById("game-over").style.display = "block";
    document.getElementById("game-over").style.zIndex = "10";
    canvas.width = 0;
    isGameOver = true;
}

function reset() {
    document.getElementById("game-over").style.display = "none";
    document.getElementById("game-over").style.zIndex = "1";
    canvas.width = 1280;
    isGameOver = false;
    gameTime = 0;
    inter = false;
    cube.Y = EARTH_ALTITUDE - cube.H;
    cube.X = 0;
}

function gg() {
    if(isGameOver == true){
        gameOver();
    }
}
function drawBricks() {
    for(var r = 0; r < brickRowCount; r++) {
        for(var c = 0; c < brickColumnCount; c++) {
            var brickX = (r * (brickWidth+brickPadding)) + brickOffsetLeft;
            var brickY = (c * (brickHeight+brickPadding)) + brickOffsetTop;
            bricks[r][c].x = 0;
            bricks[r][c].y = 0;
            ctx.beginPath();
            ctx.rect(brickX, brickY, brickWidth, brickHeight);
            ctx.fillStyle = "#0095DD";
            ctx.fill();
            ctx.closePath();
        }
    }
}

function drawEverything() {
    let drawCount = 0;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    //!!!black field
    colorRect(0, 0, canvas.width, canvas.height, "black");

    //img.src = 'F:/NodeJS/canvas-minimalizm/images/aliceGH_st01.png';
    //ctx.drawImage(img, 365, 40, 500, 350);

    //tamamoImage.src = 'F:/NodeJS/canvas-minimalizm/images/tamamoE.png';
    //ctx.drawImage(tamamoImage, 365, 40, 386, 96);
    //tick();

    //!!!earth
    colorRect(0, EARTH_ALTITUDE, canvas.width, 25, "gray");

    //!!!obstacles
    ctx.fillStyle = "white";
    ctx.strokeStyle = "blue";

    //ctx.fillRect(100, 0, 200, 350);   //for the best image
    ctx.strokeRect(100, 0, 200, 350);

    ctx.beginPath();
    ctx.moveTo(100, EARTH_ALTITUDE);
    ctx.lineTo(100, EARTH_ALTITUDE - 145);
    ctx.lineTo(150, EARTH_ALTITUDE - 145);
    ctx.lineTo(150, EARTH_ALTITUDE - 90);
    ctx.lineTo(300, EARTH_ALTITUDE - 90);
    ctx.lineTo(300, EARTH_ALTITUDE);
    ctx.moveTo(400, EARTH_ALTITUDE);
    ctx.lineTo(400, EARTH_ALTITUDE - 90);
    ctx.lineTo(625, EARTH_ALTITUDE - 90);
    ctx.lineTo(625, EARTH_ALTITUDE - 145);
    ctx.lineTo(850, EARTH_ALTITUDE - 145);
    ctx.lineTo(850, EARTH_ALTITUDE - 220);
    ctx.lineTo(canvas.width, EARTH_ALTITUDE - 220);
    ctx.stroke();
    //ctx.fill();   //for the best image
    ctx.closePath();

    ctx.beginPath();
    ctx.moveTo(370, 0);
    ctx.lineTo(370, 350);
    ctx.lineTo(550, 350);
    ctx.lineTo(550, 0);
    ctx.moveTo(625, 0)
    ctx.lineTo(625, 250);
    ctx.lineTo(820, 250);
    ctx.lineTo(820, 0);
    ctx.moveTo(870, 0);
    ctx.lineTo(870, 150);
    ctx.lineTo(canvas.width, 150);
    ctx.stroke();
    //ctx.fill();   //for the best image
    ctx.closePath();

    //!!!door
    ctx.setLineDash([]);
    ctx.lineWidth = 3;
    ctx.strokeStyle = "rgb(87, 42, 7)";
    ctx.strokeRect(1150, EARTH_ALTITUDE - 220 - 50, 20, 50);
    ctx.fillStyle = "rgba(57, 236, 238, 0.7)";
    ctx.fillRect(1150, EARTH_ALTITUDE - 220 - 50, 20, 50);
    ctx.beginPath();
    ctx.arc(1163, EARTH_ALTITUDE - 247, 2, 0, 2 * Math.PI);
    ctx.strokeStyle = "rgb(87, 42, 7)";
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.fillStyle = "rgb(18, 34, 208)";
    ctx.fill();
    ctx.closePath();

    //!!!cube
    ctx.setLineDash([2]);
    ctx.fillStyle = "rgba(255, 255, 255, 1)";
    ctx.lineWidth = 3;
    ctx.strokeStyle = "red";
    ctx.fillRect(cube.X, cube.Y, cube.W, cube.H);
    ctx.strokeRect(cube.X, cube.Y, cube.W, cube.H);
    ctx.strokeStyle = scoreTextStyle;

}

// круг с центром в точке (x,y) радиусом r начиная с угла startAngle в направлении по часовой(или против) antiClockWise
function colorCircle(centerX, centerY, radius, startAngle, endAngle, antiClockWise, drawColor) {
    ctx.beginPath();
    ctx.fillStyle = drawColor;
    ctx.arc(centerX, centerY, radius, startAngle, endAngle, antiClockWise);
    ctx.fill();
    ctx.closePath();
}

function colorRect(leftX, topY, width, height, drawColor) {
    ctx.fillStyle = drawColor;
    ctx.fillRect(leftX, topY, width, height);
}
