// board
let board;
let boardWidth = 360; // dimensions of the background image
let boardHeight = 640; // dimensions of the background image
let context;

// bird
let birdWidth = 34; // width/heightt = 408/228 -> 17/12
let birdHeight = 24;
let birdX = boardWidth/8; // starting point X of the bird
let birdY = boardHeight/2; // starting point Y of the bird
let birdImage;

// pipes
let pipeArray = [];
let pipeWidth = 64; // width/heightt = 384/3072 -> 1/8
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

// game physics
let velocityX = -2; // pipes moving left speed
let velocityY = 0; // bird jump speed
let gravity = 0.4;

let gameOver = false;
let score = 0;

let bird = {
    x: birdX,
    y: birdY,
    width: birdWidth,
    height: birdHeight
}

window.onload = function(){
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    // context.fillStyle = "white"
    // context.fillRect(bird.x, bird.y, bird.width, bird.height);

    // load images
    birdImage = new Image();
    birdImage.src = "images/flappybird.png"
    birdImage.onload = function() {
        context.drawImage(birdImage, bird.x, bird.y, bird.width, bird.height);
    }

    topPipeImg = new Image();
    topPipeImg.src = "images/toppipe.png"

    bottomPipeImg = new Image();
    bottomPipeImg.src = "images/bottompipe.png"

    requestAnimationFrame(update);
    setInterval(placePipes, 1500); // new pipes every 1.5 seconds

    document.addEventListener("keydown", moveBird);
    document.addEventListener("click", moveBird);
}

// whenever we want to draw on the canvas, we need to clear the previous frames and redraw
function update() {

    requestAnimationFrame(update);
    if(gameOver){
        return;
    }

    context.clearRect(0, 0, board.width, board.height);

    // redraw the bird image
    velocityY += gravity;
    // bird.y += velocityY;
    bird.y = Math.max(bird.y + velocityY, 0); // apply gravity to current bird.y, limit the bird.y to the top of the board
    context.drawImage(birdImage, bird.x, bird.y, bird.width, bird.height);

    if(bird.y > board.height){
        gameOver = true;
    }

    // redraw the pipe images
    for(let i=0; i<pipeArray.length; i++){
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if(!pipe.passed && bird.x > pipe.x + pipe.width){ // when the bird passes the right corner of the pipe
            score += 0.5; // + 0.5 because we have two pipes
            pipe.passed = true;
        }

        if(detectCollision(bird, pipe)){
            gameOver = true;
        }
    }
    
    // clear pipes
    while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
        pipeArray.shift(); // remove first element of the array
    }

    // score
    context.fillStyle = "white";
    context.font = "45px sans-serif";
    context.fillText(score, 5, 45);

    if(gameOver){
        context.fillText("GAME OVER", 5, 90);
    }
}

// calculation of the pipes positioning
function placePipes(){

    if(gameOver){
        return;
    }

    let randomPipeY = pipeY - pipeHeight/4 - Math.random()*(pipeHeight/2);
    let openingSpace = board.height/4;

    let topPipe = {
        img: topPipeImg,
        x: pipeX,
        y: randomPipeY,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    }

    pipeArray.push(topPipe);

    let bottomPipe = {
        img: bottomPipeImg,
        x: pipeX,
        y: randomPipeY + pipeHeight + openingSpace,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    }

    pipeArray.push(bottomPipe);
}

function moveBird(e){
    if(e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX" || e.type == "click"){
        // jump
        velocityY = -6;

        // reset the game
        if(gameOver){
            bird.y = birdY;
            pipeArray = [];
            score = 0;
            gameOver = false;
        }
    }
}

function detectCollision(a, b){
    return a.x < b.x + b.width &&   //a's top left corner doesn't reach b's top right corner
           a.x + a.width > b.x &&   //a's top right corner passes b's top left corner
           a.y < b.y + b.height &&  //a's top left corner doesn't reach b's bottom left corner
           a.y + a.height > b.y;    //a's bottom left corner passes b's top left corner
}