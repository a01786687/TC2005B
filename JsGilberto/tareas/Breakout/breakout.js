/*
 * Basic Breakout Game
 * Renata Uruchurtu Ransom
 * 2022-03-2026
 */

"use strict";

// GLOBAL VARIABLES

// defining the size of the canvas
const canvasWidth = 640;
const canvasHeight = 480;


// context of the canvas
let ctx;

// Variable to store the time of the previous frame
let oldTime = 0;

// global audio variable
let ping;


// MAIN OBJECTS
/* Paddle object: Represents the player bar, instead of using the GameObject class from the lib, 
  the paddle is implemented as a simple object with basic properties like position, 
  size while following the same idea, this is because I wanted to learn more in depth 
  about the basic concepts
*/

let paddle = { x: 270, y: 430, width: 100, height: 5, color: "white", velocity: {x:0, y:0}, speed: 350 };

/*
Ball object

Ball represents the ball, instead of using the Vector.js lib, it uses a simplified 
version where position is stored with x and y, velocity with x and y

To make the use of the boxOverlap() function from the game_functions lib, I added the position and halfSize properties as objects inside the ball object
The ball now has 2 ways of storing the position, the general one x,y which are used to draw and move the ball
Position and halfSize are used so the library collision function can detect overlaps
*/

let ball = { x: canvasWidth/2, y: canvasHeight/2, radius: 13, color: "black", velocity: {x:220, y:-220}, position: {x: canvasWidth/2, y: canvasHeight/2}, halfSize: {x: 13, y: 13}, speedIncrease: 30, maxSpeed: 500};
// NOTE -> Added speedIncrease and maxSpeed for an extra on the game

let ballImage = new Image();
ballImage.src = "../../assets/sprites/ironwhite.png";

// background
let background = new Image();
background.src = "../../assets/backgrounds/retro.png";

// blocks array, which will be filled by generateBlocks() function, each block also has the object position and halfSize to make use of the lib
let blocks = [];
// let blocks = [{x: 50, y: 100, width: 100, height: 30, color: "white", visible:true}, 
              //{x: 155, y: 100, width: 100, height: 30, color: "white", visible:true}];


// global variables for right and left flags, both initialized in false
let rightOn = false;
let leftOn = false;

// GAME STATE VARIABLES
// player's lives
let lives = 3;

// gameOver status
let gameOver = false;

// gameWon status
let gameWon = false;

// ball status
let ballMoving = false; // ball starts stopped

// destroyed blocks counter
let destroyedBlocks = 0;

/*
main() function:
looks up for the canvas enelemnt in the HTML file
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

    // EVENT LISTENERS

    // right arrow: activates rightOn 
    document.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowRight') {
            rightOn = true;
            //console.log("right");
        }

        else if (event.key === 'ArrowLeft') {
            leftOn = true;
            //console.log("left");
        }
    });

    // left arrow: activates leftOn
    document.addEventListener('keyup', (event) => {
       if (event.key === 'ArrowRight') {
            rightOn = false;
        }

        else if (event.key === 'ArrowLeft') {
            leftOn = false;
        } 
    });

    // spacebar
    document.addEventListener('keydown', (event) => {
    if (event.key === ' ') {
        if (!ballMoving) {
        
            ball.velocity.x = 220; // controls the horizontal speed and direction of the ball (positive -> right, negative -> left)
            ball.velocity.y = -280; // controls the vertical speed and direction of the ball (positive -> down, negative -> up)
            ballMoving = true;
        }
    }
});

    // r letter key
    document.addEventListener('keydown', (event) =>{
        if (event.key === 'r' || 'R') {
            if (gameOver) {
                resetGame();
            } else if (gameWon) {
                resetGame();
            }
        }
    });

    generateBlocks(); // generates blocks
    requestAnimationFrame(drawScene); // starts the game loop
}

/*
function drawScene():
game loop
clears canvas
calls again with requestAnimationFrame
its function is updating the game many times per sencond
*/

// Main loop function to be called once per frame
function drawScene(newTime){

    // Compute the time elapsed since the last frame, in milliseconds
    let deltaTime = (newTime - oldTime) / 1000; // changed to secongs by dividing by 1000 
    oldTime = newTime;
    //console.log(deltaTime);

    // clean the canvas so we can draw everything again, every frame everything is erased and drawn again
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    
    ctx.fillStyle = "#FFD1DC";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.drawImage(background, 0, 0, canvasWidth, canvasHeight);

    // update object positions
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

        ctx.shadowColor = "#64dcff";
        ctx.shadowBlur = 30;

        ctx.font = "60px 'Bebas Neue'";
        ctx.fillStyle = "#64dcff";
        ctx.fillText("VICTORY", canvasWidth/2, canvasHeight/2);

        // restart
        ctx.shadowBlur = 10;
        ctx.font = "22px 'Bebas Neue'";
        ctx.fillStyle = "white";
        ctx.fillText("Press r to restart the game", canvasWidth/2, canvasHeight/2 + 55);

        ctx.shadowBlur = 0;
    }

    // lost
    if (gameOver) {
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        ctx.shadowColor = "#df629e";
        ctx.shadowBlur = 30;

        ctx.font = "60px 'Bebas Neue'";
        ctx.fillStyle = "#da3786";
        ctx.fillText("GAME OVER", canvasWidth/2, canvasHeight/2);

        // restart
        ctx.shadowBlur = 10;
        ctx.font = "22px 'Bebas Neue'";
        ctx.fillStyle = "white";
        ctx.fillText("Press R to restart the game", canvasWidth/2, canvasHeight/ 2 + 50);

        // reset shadow
        ctx.shadowBlur = 0;
    }

    // gives the current time in miliseconds, turns it into seconds, gives how many seconds 
    // passed between frames helping the movement stay smooth even if the FPS change
    requestAnimationFrame(drawScene); // drawScene called again on the next frame creating an endless loop
}   

// PADDLE
function drawPaddle(){
    ctx.fillStyle = paddle.color;
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

// function for moving the paddle
function movePaddle(deltaTime) {

    // paddle velocity resets every frame
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

// BALL

function drawBall() {
    /*ctx.fillStyle = ball.color;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius , 0, Math.PI * 2);
    ctx.fill();
    */

    ctx.drawImage(ballImage, ball.x - ball.radius, ball.y - ball.radius, ball.radius * 2, ball.radius * 2);
}

function moveBall(deltaTime) { // all the functions that imply movement, must have delta time

    if (!ballMoving) { // if the ball hasn´t moved or been launched with the spacebar

        // it gets positioned on top of the paddle right in the middle
        ball.x = paddle.x + paddle.width/2;
        ball.y = paddle.y - ball.radius;

        // position update
        ball.position.x = ball.x;
        ball.position.y = ball.y;
        return; // exits so the ball follows the paddle
    }

    // these are the same as position.plus(velocity.times(deltaTime)) but instead we do it manually here:
    // moves the ball and position is the same way as it is set up in the game_functions lib so boxOverlap has the correct coords
    ball.x += ball.velocity.x * deltaTime;
    ball.y += ball.velocity.y * deltaTime;

    ball.position.x = ball.x; // this is for the boxOverlap() function, so it has coherence
    ball.position.y = ball.y; 

    // COLLISIONS
    clampWithinCanvasBall(); 
    checkBlockCollisions(); 
    checkPaddleCollisions();

    // condition for checking if the player won the game
    if (destroyedBlocks == blocks.length) {
        gameWon = true;
        //console.log("game won");
    }

}

// COLLISIONS

function clampWithinCanvasPaddle() {
    
    // left wall
    if (paddle.x < 0) { // is the paddle position on the x axis (left side) trying to go past the left side where x = 0
        paddle.x = 0;   // if so, reposition the paddle so the left side of it is exactly at x = 0
    }

    // right wall
    if (paddle.x + paddle.width > canvasWidth) { // is the paddle position on the x axis (right side: position + width) trying to go past the right side past the edge 
        paddle.x = canvasWidth - paddle.width; // if so, reposition the paddle so the right side of it its exactly where the canvas ends on the x axis
    } 
}

// checks all 4 borders of the canvas, top, left, right and bottom (collision with the bottom takes a life)
function clampWithinCanvasBall() {

    // Top border
    if (ball.y - ball.radius < 0) {
        ball.y = ball.radius; // repositions the ball to fix the bug of the ball getting stuck on the canvas sides
        ball.velocity.y *= -1; // velocity inverts on the y axis
        playSound();
    }

    // Left border
    if (ball.x - ball.radius < 0) {
        ball.x = ball.radius; 
        ball.velocity.x *= -1;
        playSound();
    }

    // Bottom border
    if (ball.y + ball.radius > canvasHeight) {
        lives--; // removes a life
        if (lives > 0){ // if the player has less than 0 lives
            resetPaddle(); // resets the paddle position
            resetBall(); // resets the ball position
        } else if (lives <= 0) {
            //console.log("you lost")
            gameOver = true; 
            resetPaddle();
            resetBall();
        }
    }

    // Right border
    if (ball.x + ball.radius > canvasWidth) {
        ball.x = canvasWidth - ball.radius;
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

// checks 3 conditions, DOES NOT USE THE LIBRARY (decided not to use it since the implementation seemed more simple to me and more achievable for practicing purposes)

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
        increaseSpeed();
        playSound();
    }

}

function resetPaddle() {
    // repositioning the paddle to the center of the canvas
    paddle.x = canvasWidth/2 - paddle.width/2;
    paddle.y = 430;
}

// this one uses the game_functions lib
// it iterates through every VISIBLE block of the array
function checkBlockCollisions() {
    // for every block in the blocks array one by one 
    for (let block of blocks) { // check if
        // if the block is still visible and the ball's hitbox is overlapping with the block's hitbox
        if (block.visible && boxOverlap(ball, block)) {
            ball.velocity.y *= -1; // invert the ball's velocity on the y axis (bounce)
            block.visible = false; // sets the block to invisible so it disappears
            destroyedBlocks++; // increase the score counter
            //increaseSpeed(); // increasing the speed
            playSound(); // play the pop sound
            break; // if the ball destroyed a block already it breaks so it only breaks one block per bounce
        }
    }
}


function resetBall() {

    // repositioning the ball to the center of the canvas
    ball.x = paddle.x + paddle.width/2;
    ball.y = paddle.y - ball.radius;

    //
    ball.position.x = ball.x;
    ball.position.y = ball.y;

    // stopping the ball so it doesn´t move
    ball.velocity.x = 0;
    ball.velocity.y = 0;

    ballMoving = false;

    // resetting the direction
    //ball.velocity.x = 200
    //ball.velocity.y = -200  
}

// BLOCKS

// function that draws on the canvas every block that is generated and visible
function drawBlocks() {
    // for each block OF the block array of objects 
    for (let block of blocks) {
        if (block.visible) { // if the block is visible: true it gets drawn in the canvas
            ctx.fillStyle = block.color;

            // shadow blur 
            ctx.shadowColor = block.color;
            ctx.shadowBlur = 15;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;

            ctx.fillRect(block.x, block.y, block.width, block.height);
            
        }
    }

    // reset shadow so it doesn't affect other objects, only the blocks
    ctx.shadowBlur = 0;
}

// function for generating the blocks automatically, it puts them in the array of objects for the blocks while drawBlocks() draws them
// generates a grid of rows and columns
function generateBlocks() {

    // block properties
    let blockWidth = 55;
    let blockHeight = 30;

    let blockPadding = 7; // space between the blocks

    let blockRows = 4;
    let blockCols = 7;

    // variables for defining where the blocks are starting, defines the position as the first one to be placed in the top left corner
    let startX = canvasWidth/6; 
    let startY = 80;

    // implementing colors as an extra for the game
    // row 0: pink
    // row 1: yellow
    // row 2: blue
    // row 3: purple

    // #a75bffb3

    let rowColors = ["rgba(255, 100, 150, 0.85)", "rgba(255, 200, 80, 0.85)", "rgba(100, 220, 255, 0.85)", "rgba(180, 100, 255, 0.85)"];

    // loop that iterates through each row
    for (let row = 0; row < blockRows; row++) { // while the number of rows are less than the defined number of blockRows, keep adding rows

        // loop that iterates through each col
        for (let col = 0; col < blockCols; col++) { // while the numer of cols are less than the defined number of blockCols, keep adding cols

            // position on the right
            // starting point + width of the blocks before it + padding (gaps)
            let x = startX + col * (blockWidth + blockPadding); // blockWidth + blockpadding is how much the block moves to the right 

            // position below
            let y = startY + row * (blockHeight + blockPadding);

            // create block here
            // added halfSize and position objects so the boxOverlap() function could be used for this collisions
            let block = {x, y, width: blockWidth, height: blockHeight, color: rowColors[row], visible: true, position: {x: x + blockWidth/2, y: y + blockHeight/2}, halfSize: { x: blockWidth/2, y: blockHeight/2 } };

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

        // glowy effect
        ctx.shadowColor = "#b464ffe6";
        ctx.shadowBlur = 15;

        // text style
        ctx.font = "25px 'Bebas Neue'";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        // BLOCKS left
        ctx.fillStyle = "#6400b4bf";
        ctx.fillRect(blocksX, boardY, boardWidth, boardHeight);

        ctx.fillStyle = "white";
        ctx.fillText("Blocks: " + destroyedBlocks, boardX + boardWidth / 2, boardY + boardHeight / 1.8);

        // LIVES right
        ctx.fillStyle = "#6400b4bf";
        ctx.fillRect(livesX, boardY, boardWidth, boardHeight);

        ctx.shadowBlur = 0;

        // neon borders
        ctx.strokeStyle = "rgba(180, 100, 255, 0.9)"; // stroke color
        ctx.lineWidth = 2;
        ctx.strokeRect(blocksX, boardY, boardWidth, boardHeight);
        ctx.strokeRect(livesX, boardY, boardWidth, boardHeight);

        ctx.fillStyle = "white";
        ctx.fillText("Lives: " + lives, livesX + boardWidth / 2, boardY + boardHeight /1.8);

        ctx.shadowBlur = 0;

}

function resetGame() {

    // reset global variables lives, destroyed blocks, game over, game won etc

    lives = 3;
    destroyedBlocks = 0;
    gameOver = false;
    gameWon = false;
    ballMoving = false;
    ball.velocity.x = 0;
    ball.velocity.y = 0
    resetPaddle();
    resetBall();
    blocks = []; // reset blocks
    generateBlocks();
}

function playSound() {
    ping.currentTime = 0; // currentTime property: used to get or set the current playback position in secs, acts as a command to restart the audio from the beginning
    ping.play();
}


// increasing the ball's speed every time it bounces with the paddle
function increaseSpeed() {

    // Math.hypot(x ,y) calculates the speed of the ball by combining x and y velocity components
    // this is the equivalent of magnitude() from Vector.js -> Math.sqrt(this.x ** 2 + this.y ** 2)
    // I used Math.hypot instead of the libs because of how my ball object stores the velocity as x and y, not as Vector objects
    let currentSpeed = Math.hypot(ball.velocity.x, ball.velocity.y);

    // only increases the speed if the ball hasn't reached the max speed yet
    if (currentSpeed < ball.maxSpeed) {

        // add the speed increase (declared in the ball object) to the current speed to get the new speed
        let newSpeed = currentSpeed + ball.speedIncrease;

        // divide each velocity component by the current speed to get the direction, the unitary vector
        // then multiply by newSpeed to apply the new speed while keeping the same direction
        // this follows the same idea as normalize().times(newSpeed) -> return new Vector(this.x / mag, this.y / mag); <- thats the normalize() method from the Vector lib
        // again I didn't use the lib because the velocity I declared in the ball object is not a vector object
        ball.velocity.x = (ball.velocity.x / currentSpeed) * newSpeed;
        ball.velocity.y = (ball.velocity.y / currentSpeed) * newSpeed

        //console.log("Speed:", Math.hypot(ball.velocity.x, ball.velocity.y));

    }
}

/* 
REFERENCES:
Math.hypot() calculates the square root of the sum of squares of its arguments, equivalent to the magnitude() method in Vector.js
https://www.educative.io/answers/what-is-mathhypot-in-javascript
*/