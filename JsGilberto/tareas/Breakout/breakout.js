/*
 * Basic Breakout Game
 * Renata Uruchurtu Ransom
 * 2022-03-2026
 */

"use strict";

// Global variables
const canvasWidth = 640;
const canvasHeight = 480;


// context of the canvas
let ctx;

// Variable to store the time at the previous frame
let oldTime = 0;

// global audio variable
let ping;

/* Paddle object
  Paddle represents the player bar, instead of using the GameObject class from the lib, 
  the paddle is implemented as a simple object with basic properties like position, 
  size while following the same idea, this is because I wanted to learn more in depth 
  about the basic concepts
*/

let paddle = { x: 270, y: 430, width: 100, height: 20, color: "white", velocity: {x:0, y:0}, speed: 350 };

/*
Ball object
Ball represents the ball, instead of using the Vector.js lib, it uses a simplified 
version where position is stored with x and y, velocity with x and y
*/

let ball = { x: canvasWidth/2, y: canvasHeight/2, radius: 13, color: "black", velocity: {x:220, y:-220}};
let ballImage = new Image();
ballImage.src = "../../assets/sprites/gog.png";

// background
let background = new Image();
background.src = "../../assets/backgrounds/retro.png";

/* blocks array object
*/
let blocks = [];
// let blocks = [{x: 50, y: 100, width: 100, height: 30, color: "white", visible:true}, 
              //{x: 155, y: 100, width: 100, height: 30, color: "white", visible:true}];

// global variables for right and left flags, both initialized in false
let rightOn = false;
let leftOn = false;

// global variable for the player's lives
let lives = 3;

// global variable for gameOver status
let gameOver = false;

// global variable for gameWon status
let gameWon = false;

// global variable for ball status
let ballMoving = false; // ball starts stopped

// global variable for destroyed blocks counter
let destroyedBlocks = 0;

/*
Function main:
looks up for the canvas in the HTML file
sets the canvas width
sets the canvas height
gets the 2d context
calls the game loop by calling the drawScene() function
 */

function main(){
    const canvas = document.getElementById('canvas'); // grabs the canvas element with the ID 'canvas' and stores it in a variable named 'canvas' so the js can use it to draw the game
    canvas.width = canvasWidth; // sets width of the canvas element to the value stored in canvasWidth, same for canvasHeight
    canvas.height = canvasHeight; // . -> member access operator, allows access to properties/methods of an object
    ctx = canvas.getContext("2d");

    // add audio element
    ping = document.createElement("audio");
    ping.src = "../../assets/audio/bubblepop.mp3";

    // we use document because the keys belong to the website, not the paddle
    // the key interacts with the whole web
    // => arrow function
    // const functionName = (parameters) => { // function body };

    document.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowRight') {
            rightOn = true;
            console.log("derecha jiji");
        }

        else if (event.key === 'ArrowLeft') {
            leftOn = true;
            console.log("izquierda jiji");
        }
    });

    document.addEventListener('keyup', (event) => {
       if (event.key === 'ArrowRight') {
            rightOn = false;
        }

        else if (event.key === 'ArrowLeft') {
            leftOn = false;
        } 
    });

    document.addEventListener('keydown', (event) => {
    if (event.key === ' ') {
        if (!ballMoving) {
            ball.velocity.x = 200;
            ball.velocity.y = -200;
            ballMoving = true;
        }
    }
});

    document.addEventListener('keydown', (event) =>{
        if (event.key === 'r') {
            if (gameOver) {
                resetGame();
            } else if (gameWon) {
                resetGame();
            }
        }
    });

    generateBlocks();
    requestAnimationFrame(drawScene);
}

/*
function drawScene():
base of the game loop
clears canvas
calls again with requestAnimationFrame
its function is updating the game many times per sencond
*/

// Main loop function to be called once per frame
function drawScene(newTime){

    // Compute the time elapsed since the last frame, in milliseconds
    let deltaTime = (newTime - oldTime) / 1000; // changed to secongs by dividing by 1000 
    oldTime = newTime;
    console.log(deltaTime);

    // clean the canvas so we can draw everything again
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    
    ctx.fillStyle = "#FFD1DC";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.drawImage(background, 0, 0, canvasWidth, canvasHeight);

    // update objects
    movePaddle(deltaTime);
    moveBall(deltaTime);

    // draw objects
    drawPaddle();
    drawBall();
    drawBlocks();
    drawHUD();

    // winner screen
    // win
    if (gameWon) {
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        ctx.font = "60px 'Bebas Neue'";
        ctx.fillStyle = "black";
        ctx.fillText("VICTORY", canvasWidth/2, canvasHeight/2);
        resetPaddle();
        resetBall();

        // restart
        ctx.font = "20px 'Bebas Neue'";
        ctx.fillText("Press R to restart the game", canvasWidth/2, canvasHeight/ 2 + 50);
    }

    // lost
    if (gameOver) {
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        ctx.font = "60px 'Bebas Neue'";
        ctx.fillStyle = "black";
        ctx.fillText("GAME OVER", canvasWidth/2, canvasHeight/2);

        // restart
        ctx.font = "20px 'Bebas Neue'";
        ctx.fillText("Press R to restart the game", canvasWidth/2, canvasHeight/ 2 + 50);
    }

    requestAnimationFrame(drawScene);
}   

function drawPaddle(){
    ctx.fillStyle = paddle.color;
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
}


function movePaddle(deltaTime) {

    // reset each frame
    paddle.velocity.x = 0;

    // if right key is pressed and the right border of the paddle is smaller than the canvasWidth
    if (rightOn && paddle.x + paddle.width < canvasWidth) {
        paddle.velocity.x += paddle.speed; // paddle moves to the right
    }

    // if left key is pressed and the paddle position on the x axis is greater than 0
    if (leftOn && paddle.x > 0) {
        paddle.velocity.x -= paddle.speed; // paddle moves to the left
    }

    // apply velocity to position
    paddle.x += paddle.velocity.x * deltaTime;

    clampWithinCanvasPaddle();

}

function drawBall() {
    /*ctx.fillStyle = ball.color;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius , 0, Math.PI * 2);
    ctx.fill();
    */

    ctx.drawImage(ballImage, ball.x - ball.radius, ball.y - ball.radius, ball.radius * 2, ball.radius * 2);
}

function moveBall(deltaTime) { // all the functions that imply movement, must have delta time

    // these are the same as position.plus(velocity.times(deltaTime)) but instead we do it manually here:
    ball.x += ball.velocity.x * deltaTime;
    ball.y += ball.velocity.y * deltaTime;

    clampWithinCanvasBall();
    checkBlockCollisions();
    checkPaddleCollisions();

    // condition for checking if the player won the game
    if (destroyedBlocks == blocks.length) {
        gameWon = true;
        console.log("game won jijiji");
    }

}

function clampWithinCanvasPaddle() {
    // Top border
    if (paddle.x < 0) {
        paddle.x = 0;   
    }

    if (paddle.x + paddle.width > canvasWidth) {
        paddle.x = canvasWidth - paddle.width;
    }
}

function clampWithinCanvasBall() {
    // Top border
    if (ball.y - ball.radius < 0) {
        ball.velocity.y *= -1; // se invierte la velocidad en Y
        playSound();
    }

    // Left border
    if (ball.x - ball.radius < 0) {
        ball.velocity.x *= -1;
        playSound();
    }

    // Bottom border
    if (ball.y + ball.radius > canvasHeight) {
        lives--;
        if (lives > 0){
            resetPaddle();
            resetBall();
        } else if (lives <= 0) {
            console.log("u lost jiji")
            gameOver = true;
            resetPaddle();
            resetBall();
        }
    }

    // Right border
    if (ball.x + ball.radius > canvasWidth) {
        ball.velocity.x *= -1;
        playSound();
    }

}

// function for checking collisions with paddle and ball

/*

left = paddle.x
right = paddle .x + paddle.width
top = paddle.y

*/

function checkPaddleCollisions() {

    // is the bottom part of the ball touching the paddle?
    let ballTouchesPaddle = ball.y + ball.radius >= paddle.y;

    // ball not on the left AND ball not on the right = then the ball is within the width of the paddle
    // basically ball on top of the paddle x axis
    let ballInsidePaddleWidth = ball.x >= paddle.x && ball.x <= paddle.x + paddle.width

    // if the ball is going down AND the ball touches the top of the paddle it must bounce
    if (ball.velocity.y > 0 && ballTouchesPaddle && ballInsidePaddleWidth) {
        ball.y = paddle.y - ball.radius; // place the ball on top of the paddle
        ball.velocity.y *= -1; // invert direction
        playSound();
    }

}

function resetPaddle() {
    // repositioning the paddle to the center of the canvas
    paddle.x = canvasWidth/2 - paddle.width/2;
    paddle.y = 430;
}


function checkBlockCollisions() {

    for (let block of blocks) {

        // if the block isn't visible
        if (!block.visible) continue;

        // VERTICAL checks
        let ballBottomTouchesBlock = ball.y + ball.radius >= block.y;
        let ballTopTouchesBlock = ball.y - ball.radius <= block.y + block.height;
        let ballTouchesBlockY = ballBottomTouchesBlock && ballTopTouchesBlock;

        // HORIZONTAL checks
        let ballLeft = ball.x - ball.radius;
        let ballRight = ball.x + ball.radius;
        let ballTouchesBlockX = ballRight >= block.x && ballLeft <= block.x + block.width;
        
        if (ballTouchesBlockY && ballTouchesBlockX) {
            block.visible = false;
            destroyedBlocks++;

            // ball coming from the top, bottom or the sides?
            let hitFromTop    = ball.velocity.y > 0 && ball.y + ball.radius >= block.y;
            let hitFromBottom = ball.velocity.y < 0 && ball.y - ball.radius <= block.y + block.height;
            let hitFromRight  = ball.velocity.x > 0 && ballRight >= block.x;
            let hitFromLeft   = ball.velocity.x < 0 && ballLeft <= block.x + block.width;

            // if separated so corners are handled correctly
            if (hitFromTop || hitFromBottom) {
                ball.velocity.y *= -1;

                if (hitFromTop) {
                    ball.y = block.y - ball.radius;
                } else {
                    ball.y = block.y + block.height + ball.radius;
                }
            }

            if (hitFromRight || hitFromLeft) {
                ball.velocity.x *= -1;

                if (hitFromRight) {
                    ball.x = block.x - ball.radius;
                } else {
                    ball.x = block.x + block.width + ball.radius;
                }
            }

            playSound();
            break;
        }
    }
}


function resetBall() {

    // repositioning the ball to the center of the canvas
    ball.x = paddle.x + paddle.width/2;
    ball.y = paddle.y - ball.radius;

    // stopping the ball so it doesn´t move
    ball.velocity.x = 0;
    ball.velocity.y = 0;

    ballMoving = false;

    // resetting the direction
    //ball.velocity.x = 200
    //ball.velocity.y = -200  
}

// function that draws on the canvas every block that is generated and visible
function drawBlocks() {
    // for each block OF the block array of objects 
    for (let block of blocks) {
        if (block.visible) { // if the block is visible: true it gets drawn in the canvas
            ctx.fillStyle = block.color;

            // Configuración de la sombra para el Canvas
            ctx.shadowColor = "rgba(101, 15, 158, 0.7)";
            ctx.shadowBlur = 8;
            ctx.shadowOffsetX = 1;
            ctx.shadowOffsetY = 1;

            ctx.fillRect(block.x, block.y, block.width, block.height);
            
        }
    }
}

// function for generating the blocks automatically, it puts them in the array of objects for the blocks while drawBlocks() draws them
function generateBlocks() {

    let blockWidth = 55;
    let blockHeight = 30;

    let blockPadding = 7; // space between the blocks

    let blockRows = 4;
    let blockCols = 7;

    // variables for defining where the blocks are starting
    let startX = canvasWidth/6; 
    let startY = 80;

    // loop that iterates through each row
    for (let row = 0; row < blockRows; row++) {

        // loop that iterates through each col
        for (let col = 0; col < blockCols; col++) {

            // position on the right
            let x = startX + col * (blockWidth + blockPadding); // blockWidth + blockpadding is how much the block moves to the right 

            // position below
            let y = startY + row * (blockHeight + blockPadding);

            // create block here
            let block = {x, y, width: blockWidth, height: blockHeight, color: "rgba(167, 91, 255, 0.7)", visible: true};

            blocks.push(block);
        } 
    }

}


function drawHUD() {
        // local variables for the size
        const boardWidth = 220;
        const boardHeight = 40; 
        
        const boardX = 30; // posicion horizontal (x) donde empieza el scoreboard
        const boardY = 20; // posicion vertical (y) del scoreboard, lo pone 20 px arriba del canvas

        // positions

        const blocksX = 30; // left
        const livesX = canvasWidth - boardWidth - 30;

        // text style
        ctx.font = "25px 'Bebas Neue'";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        // BLOCKS left
        ctx.fillStyle = "#ff4a3d";
        ctx.fillRect(blocksX, boardY, boardWidth, boardHeight);

        ctx.fillStyle = "white";
        ctx.fillText("Blocks: " + destroyedBlocks, boardX + boardWidth / 2, boardY + boardHeight / 1.8);

        // LIVES right
        ctx.fillStyle = "#ff4a3d";
        ctx.fillRect(livesX, boardY, boardWidth, boardHeight);

        ctx.fillStyle = "white";
        ctx.fillText("Lives: " + lives, livesX + boardWidth / 2, boardY + boardHeight /1.8);

}

function resetGame() {

    // reset global variables lives, destroyed blocks, game over, game won etc

    lives = 3;
    destroyedBlocks = 0;
    gameOver = false;
    gameWon = false;
    resetPaddle();
    resetBall();
    blocks = []; // reset blocks
    generateBlocks();
}

function playSound() {
    ping.currentTime = 0; // currentTime property: used to get or set the current playback position in secs, acts as a command to restart the audio from the beginning
    ping.play();
}

