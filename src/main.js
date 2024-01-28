/**
 * Lyssa Li
 * Project Name: 
 * Project hours: approx 2
 * Mods included:
 *      (5pts) create a new enemy spaceship w/ new sprite & new point value that moves faster
 * Citations:
 */

let config = {
    type: Phaser.AUTO,
    width: 640, 
    height: 480,
    pixelPerfect: true,
    scene: [ Menu, Play ]
}
let game = new Phaser.Game(config)

// set UI sizes
let borderUISize = game.config.height / 15
let borderPadding = borderUISize / 3

// keyboard bindings
let keyFIRE, keyRESET, keyLEFT, keyRIGHT
