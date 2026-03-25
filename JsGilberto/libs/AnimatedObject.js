/*
 * Class for a game object that has animation using a spritesheet
 *
 * Gilberto Echeverria
 * 2026-02-10
 */

"use strict";

//import { GameObject } from "./GameObject";


// Class to control the animation of characters and objects
class AnimatedObject extends GameObject {
    constructor(position, width, height, color, type, sheetCols) {
        super(position, width, height, color, type);
        // Animation properties
        this.frame = 0; //  cuadro actual a dibujar
        this.minFrame = 0; // define rango
        this.maxFrame = 0; // define rango
        this.sheetCols = sheetCols; // cuantas columnas hay en el spritesheet

        this.repeat = true; // que se repita la animacion

        // Delay between frames (in milliseconds)
        this.frameDuration = 100; // cuanto tiempo voy a mostrar cada frame, ej. cada 100 ms
        this.totalTime = 0; // tiempo transcurrido, se compara con frame duration para ver si se cambia de frame o no
    }

    setAnimation(minFrame, maxFrame, repeat, duration) { // metodo setAnimation, es el que cambia las animaciones
        this.minFrame = minFrame;
        this.maxFrame = maxFrame;
        this.frame = minFrame;
        this.repeat = repeat;
        this.totalTime = 0;
        this.frameDuration = duration;

        //console.log(`Setting animation frames: ${this.minFrame} - ${this.maxFrame}`);
    }

    /*
     * Change the frame number to the next one.
     * Loop back to the first frame if the animation is set to repeat.
     * Also set the rectangle to be drawn from the spritesheet according to the current frame.
     *
     * Arguments:
     *   deltaTime: Time elapsed since the last frame (in milliseconds)
     */
    updateFrame(deltaTime) { // recibe delta time
        this.totalTime += deltaTime; // al total time se le suma delta time
        if (this.totalTime > this.frameDuration) {
            // Loop around the animation frames if the animation is set to repeat
            // Otherwise stay on the last frame
            // TODO: Set the frame to be used when the frame range ends
            //       Depends on the value of this.repeat
            let restartFrame = this.repeat ? this.minFrame : this.maxFrame; // si la animacion se repite voy a reiniciar con el inicio, si no se repite con el final y me quedare trabado con el final
            // TODO: Change the frame to the next one
            //       Either the next one or the restart
            this.frame = this.frame == this.maxFrame ? restartFrame : this.frame + 1; // es para pasar de una imagen a otra
            // TODO: Determine the top left corner of the frame to draw from the spritesheet
            //       This requires the number of columns in the sheet, multiplied by the dimensions
            
            // calcular en que columna y fila esta el frame actual
            let col = this.frame % this.sheetCols;
            let row = Math.floor(this.frame / this.sheetCols);

            // mover el rectangulo al frame correcto dentro del spritesheet
            this.spriteRect.x = col * this.spriteRect.width; // width y height del rectangulo NO del objeto
            this.spriteRect.y = row * this.spriteRect.height;
            // Restart the time count
            this.totalTime = 0;
            //console.log(`New Rect:`)
            //console.log(this.spriteRect)
        }
    }
}
