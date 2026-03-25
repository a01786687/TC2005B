/*
 * Using sprites to draw more interesting objects
 *
 * Gilberto Echeverria
 * 2025-03-13
 * 
 * 
 * 
 */


// GameObjects a crear:
// 4 paredes
// 2 paletas
// 1 pelota


"use strict";

// Global variables
const canvasWidth = 800;
const canvasHeight = 600;

// Context of the Canvas
let ctx;

// A variable to store the game object
let game;

// Variable to store the time at the previous frame
let oldTime = 0;

let paddleSpeed = 0.5;
// let ballSpeed = 0.5;



// class for the game ball
class Ball extends GameObject {
    constructor(position, width, height, color, sheetCols) {
        super(position, width, height, color, "ball", sheetCols); // super es llamar a el constructor de mi padre, para heredar las propiedades de GameObject, le añadiremos mas cosas
        
        this.velocity = new Vector(1, 0.5); // como queremos que se mueva debe tener un metodo update

        // ball usara una nueva variable global ballSpeed, para esta variable la pelota debe guardar otras variables
        this.baseSpeed = 0.5;
        this.currentSpeed = this.baseSpeed;
        this.speedIncrease = 0.025;
        this.maxSpeed = 1.2;
    }

    update(deltaTime) { // debe estar declarada dentro de la clase ball, por que ball y paddle los dos son gameObject pero cada uno se mueve diferente, el movimiento de ball no depende de los botones
        this.velocity = this.velocity.normalize().times(this.currentSpeed);
        this.position = this.position.plus(this.velocity.times(deltaTime));
    }

    // funcion para incrementar la velocidad
    increaseSpeed(){
        this.currentSpeed += this.speedIncrease; // current speed + 0.5 = this.currentSpeed

        if (this.currentSpeed > this.maxSpeed) { // si la velocidad actual es mayor a la velocidad maxima
            this.currentSpeed = this.maxSpeed; // se actualiza la variable currentSpeed con la velocidad maxima
        }
    }

    // funcion para resetear la velocidad cuando alguien hace un score
    resetSpeed() {
        this.currentSpeed = this.baseSpeed;
    }

    draw(ctx) {
        ctx.fillStyle = "#ff86e7";
        ctx.beginPath();

                // ( x, y, radius, startAngle, endAngle )
                // a full circle is 360 degrees, which is 2 * π radians. In JavaScript, π = Math.PI
        ctx.arc(this.position.x, this.position.y, this.halfSize.x , 0, Math.PI * 2);
        ctx.fill();

    }
}

// Class for the main character in the game, the Paddle
class Paddle extends GameObject {
    constructor(position, width, height, color, sheetCols) {
        super(position, width, height, color, "player", sheetCols);
        this.velocity = new Vector(0, 0);

        this.motion = {
            up: {
                axis: "y",
                sign: -1,
    
            },
            down: {
                axis: "y",
                sign: 1,
            },
        }

        // Keys pressed to move the player
        this.keys = [];
    }

    update(deltaTime) {
        // Restart the velocity
        this.velocity.x = 0;
        this.velocity.y = 0;
        // Modify the velocity according to the directions pressed
        for (const direction of this.keys) {
            const axis = this.motion[direction].axis;
            const sign = this.motion[direction].sign;
            this.velocity[axis] += sign;
        }
        // TODO: Normalize the velocity to avoid greater speed on diagonals

        this.velocity = this.velocity.normalize().times(paddleSpeed);

        this.position = this.position.plus(this.velocity.times(deltaTime));

        this.clampWithinCanvas();
        
    }

    clampWithinCanvas() {
        // Top border
        if (this.position.y - this.halfSize.y < 0) {
            this.position.y = this.halfSize.y;
        // Left border
        }
        if (this.position.x - this.halfSize.x < 0) {
            this.position.x = this.halfSize.x;
        // Bottom border
        }
        if (this.position.y + this.halfSize.y > canvasHeight) {
            this.position.y = canvasHeight - this.halfSize.y;
        // Right border
        }
        if (this.position.x + this.halfSize.x > canvasWidth) {
            this.position.x = canvasWidth - this.halfSize.x;
        }
    }

    /* draw(ctx) {
        ctx.save(); // guardamos el estado actual del canvas
        ctx.shadowColor = "rgba(0, 0, 0, 0.4)";
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 3;
        ctx.shadowOffsetY = 3;

        super.draw(ctx); // super.draw ejecuta el metodo draw de la clase padre, entonces paddle puede usar ese mismo metodo, es decir "usa la forma de draw que ya esta definida en gameObject"
        ctx.restore(); // devuelve el canvas a su estado anterior para q solo el paddle tenga la sombra y no lo demas
    }
        */
}


// Class to keep track of all the events and objects in the game
class Game {
    constructor() {
        this.createEventListeners();
        this.initObjects();

        // variables dentro de game para guardar el score
        this.scoreLeft = 0;
        this.scoreRight = 0;

        // variable booleana para indicar si la pelota debe moverse o no
        this.ballMoving = false;
    }

    resetBall() {
        this.ball.position = new Vector(canvasWidth/2, canvasHeight/2);
        this.ball.velocity = new Vector(0, 0);
        this.ball.resetSpeed(); //la velocidad de la pelota se resetea despues de cada score
        this.ballMoving = false;
    }

    checkScore() {
        // el borde izquierdo de la pelota ya paso x = 0?
        if (this.ball.position.x + this.ball.halfSize.x < 0) {
            this.scoreRight += 1;
            this.resetBall();
        } 
        
        if (this.ball.position.x - this.ball.halfSize.x > canvasWidth) {
            this.scoreLeft += 1;
            this.resetBall();
        }
    }


    initObjects() {
        // Add another object to draw a background
        this.background = new GameObject(new Vector(canvasWidth / 2, canvasHeight / 2), canvasWidth, canvasHeight);
        this.background.setSprite("../../assets/sprites/gato.jpg");

        this.paddleLeft = new Paddle(new Vector(50, canvasHeight / 2), 50, 200, "#ff4a3d"); // vector() posicion 50 en x, la mitad del canvas en y

        this.paddleRight = new Paddle(new Vector(canvasWidth - 50, canvasHeight / 2), 50, 200, "#2d8fe3"); 

        this.ball = new Ball(new Vector(canvasWidth / 2, canvasHeight / 2), 20, 20, "black");

        this.wallTop = new GameObject(new Vector(canvasWidth / 2, 20/2), canvasWidth , 20, "white");

        this.wallBottom = new GameObject(new Vector(canvasWidth / 2, canvasHeight - 10), canvasWidth , 20, "white");

        // new argument where we indicate new rect -> new rectangle, and we give the coordenates
    }

    draw(ctx) {
        // Draw the background first, so everything else is drawn on top
        this.background.draw(ctx);

        this.paddleLeft.draw(ctx);

        this.paddleRight.draw(ctx); // POR AHORA EL AZUL NO SE MUEVE

        this.ball.draw(ctx);

        this.wallTop.draw(ctx);

        this.wallBottom.draw(ctx);

        this.drawScore(ctx);


        /* ctx.font = "40px Arial";
        ctx.fillStyle = "white";
        ctx.fillText(this.scoreLeft, canvasWidth / 2 - 60, 60);
        ctx.fillText(this.scoreRight, canvasWidth / 2 + 40, 60);
        */  
    }

    // funcion para dibujar el scoreboard
    drawScore(ctx){
        // variables locales de drawScore
        const boardWidth = 220;
        const boardHeight = 90; 
                    // canvasWidth -> centro del canvas, boardWidth / 2 -> mitad del ancho del scoreboard, todo junto lo pone justo en el centro
        const boardX = canvasWidth / 2 - boardWidth / 2; // posicion horizontal (x) donde empieza el scoreboard
        const boardY = 20; // posicion vertical (y) del scoreboard, lo pone 20 px arriba del canvas
    
        ctx.save(); // evitan q el clip afecte otras cosas del juego

        ctx.beginPath();
        // sombra ligera
        ctx.shadowColor = "rgba(0, 0, 0, 0.25)";
        ctx.shadowBlur = 10;

        ctx.roundRect(boardX, boardY, boardWidth, boardHeight, 15);
        ctx.clip(); // hace que los colores tengan las esquinas redondeadas

        // dibujamos los dos colores dentro

        // lado izq
        ctx.fillStyle = "#ff4a3d";
        ctx.fillRect(boardX, boardY, boardWidth / 2, boardHeight);

        // lado derecho
        ctx.fillStyle = "#2d8fe3";
        ctx.fillRect(boardX + boardWidth/2, boardY, boardWidth/2, boardHeight);
        
        // texto
        ctx.font = "80px 'Bebas Neue'";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";


        // Score izq
        ctx.fillText(this.scoreLeft, boardX + boardWidth / 4, boardY + boardHeight / 1.74);

        //Score der
        ctx.fillText(this.scoreRight, boardX + boardWidth * 3 / 4, boardY + boardHeight / 1.74);

        ctx.restore(); // evitan q el clip afecte otras cosas del juego
    }

    update(deltaTime) {
        // Move the player
        this.paddleLeft.update(deltaTime);
        this.paddleRight.update(deltaTime);
        // this.ball.update(deltaTime);

        if(this.ballMoving == true){
            this.ball.update(deltaTime);
        }

        this.checkWallCollisions();
        this.checkPaddleCollisions();
        this.checkScore();

    }

    createEventListeners() {
        window.addEventListener('keydown', (event) => {
           
            if (event.key == 'w') { 
                this.addKey('up', this.paddleLeft);
            } else if (event.key == 's') {
                this.addKey('down', this.paddleLeft);
            }

            if (event.key == 'ArrowUp') {
                this.addKey('up', this.paddleRight);
            } else if (event.key == 'ArrowDown') {
                this.addKey('down', this.paddleRight);
            }

            if (event.key == ' ') {
                if (!this.ballMoving) {
                    this.ball.velocity = new Vector(1, 0.5);
                    this.ballMoving = true;

                }
            }
        });

        window.addEventListener('keyup', (event) => {
            if (event.key == 'w') { 
                this.delKey('up', this.paddleLeft);
            } else if (event.key == 's') {
                this.delKey('down', this.paddleLeft);
            }

            if (event.key == 'ArrowUp') {
                this.delKey('up', this.paddleRight);
            } else if (event.key == 'ArrowDown') {
                this.delKey('down', this.paddleRight);
            }
        });
    }

    addKey(direction, paddle) { // voy a usar el paddle q se indicque que tengo que mover
        if (!paddle.keys.includes(direction)) {
            paddle.keys.push(direction);
        }
    }

    // estas funciones esperan un argumento

    delKey(direction, paddle) { // 
        if (paddle.keys.includes(direction)) {
            paddle.keys.splice(paddle.keys.indexOf(direction), 1);
        }
    }

    // collisions

    // NOTA: y = 0, es el techo del canvas

    // Si la parte de arriba de la pelota toca el techo: mueve la pelota justo debajo del techo invierte su dirección vertical

    // metodo que revisa si la pelota chocó con las paredes
    // si toca pared de arriba o abajo, cambia la dirección en Y
    // si toca izquierda o derecha, cambia la dirección en X
    checkWallCollisions() {

        // despues de invertir la direccion se agrega el aumento de velocidad para que cada rebote vaya mas rapido

        // collision 1. ball vs wallTop
        // si la pelota toca arriba, se regresa justo al borde y se cambia el signo de velocity.y

        if(boxOverlap(this.ball, this.wallTop)) { // if ball touches wallTop
            this.ball.velocity.y *= -1; // se invierte la velocidad en Y
            this.ball.position.y = this.wallTop.position.y + this.wallTop.halfSize.y + this.ball.halfSize.y; // se recoloca la pelota debajo de la pared
            this.ball.increaseSpeed();
        }

        // collision 1. ball vs wallBottom
        if(boxOverlap(this.ball, this.wallBottom)) { // if ball touches wallBottom
            this.ball.velocity.y *= -1; // se invierte la velocidad en Y
            this.ball.position.y = this.wallBottom.position.y - this.wallBottom.halfSize.y - this.ball.halfSize.y; // se recoloca la pelota arriba de la pared
            this.ball.increaseSpeed();
        }
    }

    // metodo que revisa si la pelota chocó con las paddles
    // si toca un paddle, cambia la dirección en X
    checkPaddleCollisions() {
        if(boxOverlap(this.ball, this.paddleLeft)) {

            //movemos la pelota justo fuera de la paddle
            this.ball.position.x =
            this.paddleLeft.position.x +
            this.paddleLeft.halfSize.x +
            this.ball.halfSize.x;

            // cambiar dirección horizontal
            this.ball.velocity.x *= -1;
            this.ball.increaseSpeed();
        }

        // choque con paddle derecho
        if (boxOverlap(this.ball, this.paddleRight)) {

            this.ball.position.x =
                this.paddleRight.position.x -
                this.paddleRight.halfSize.x -
                this.ball.halfSize.x;

            this.ball.velocity.x *= -1;
            this.ball.increaseSpeed();
        }
    }
}



// Starting function that will be called from the HTML page
function main() {
    // Get a reference to the object with id 'canvas' in the page
    const canvas = document.getElementById('canvas');
    // Resize the element
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    // Get the context for drawing in 2D
    ctx = canvas.getContext('2d');

    // Create the game object
    game = new Game();

    drawScene(0);
}


// Main loop function to be called once per frame
function drawScene(newTime) {
    // Compute the time elapsed since the last frame, in milliseconds
    let deltaTime = newTime - oldTime;

    // Clean the canvas so we can draw everything again
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    game.update(deltaTime);

    game.draw(ctx);

    oldTime = newTime;
    requestAnimationFrame(drawScene);
}

/*
SIGUIENTES PASOS:

[X] Borrar cajas de madera y lo de actors

[X] Dejar únicamente los objetos principales del juego:
    - background
    - paddleLeft
    - paddleRight
    - ball
    - wallTop
    - wallBottom

[X] Crear paredes superior e inferior como new GameObject en distintas posiciones

[X] Dibujar las paredes en draw() con los demás objetos del juego.

[X] Collisions usando boxOverlap():
    - pelota con wallTop y wallBottom -> rebote en Y
    - pelota con paddleLeft y paddleRight -> rebote en X

[X] Detectar cuándo la pelota sale por la izquierda o por la derecha:
    - si sale por la izq, anota el jugadpr derecho
    - si sale por la derecha, anota el jugador izq

[X] Reiniciar la posición de la pelota al centro después de cada score

[X] Agregar un nuevo event listener para el saque:
    - la pelota inicia quieta
    - al presionar spacebar se le asigna una velocidad y comienza a moverse

[X] Hacer que al tocar los paddles la pelota rebote correctamente en X

[X] Dibujar el score counter en pantalla
*/