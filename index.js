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
    setInterval(placePipes, 1500); // every 1.5 seconds
}

// whenever we want to draw on the canvas, we need to clear the previous frames and redraw
function update() { 
    requestAnimationFrame(update);
    context.clearRect(0, 0, board.width, board.height);

    // redraw the bird image
    context.drawImage(birdImage, bird.x, bird.y, bird.width, bird.height);

    // redraw the pipes
    for(let i=0; i<pipeArray.length; i++){
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);
    }
}

function placePipes(){

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