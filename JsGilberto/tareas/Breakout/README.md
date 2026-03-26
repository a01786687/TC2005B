# Breakout

## How to run
Open the 'index.html' file on your prefered browser.

## Controls

Arrow Left/Right: move the paddle
Spacebar: launch the ball
R or r: restart the game

## Rules
- Break all the blocks to win
- The ball bounces off the walls (top, left, right)
- If the ball falls at the bottom wall you lose a life
- You have 3 lives, if you lose them all, the game ends

## Extra features
- Each row of blocks has a different color to match the aesthetic
- The ball gets faster every time it hits the paddle, so the game gets harder

## Dev notes
- Blocks are stored in an array and can be changed in `breakout.js` inside `generateBlocks()` function
- Some features include changing the number of rows and columns, and adding or changing the colors
- Ball speed can be adjusted in the `ball` object at the top (`speedIncrease` & `maxSpeed`)

