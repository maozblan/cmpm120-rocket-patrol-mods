/**
 * Lyssa Li
 * Project Name: 
 * Project hours: approx 5
 * Mods included:
 *      (5pts) create a new enemy spaceship w/ new sprite & new point value that moves faster
 *      (5pts) add time on hit and subtract time on miss
 *      (3pts) a timer with seconds remaining
 *      (3pts) parallax background
 *      (1pts) new tile sprite for background
 * Citations:
 *      how to make a timer https://stackoverflow.com/questions/52063815/how-to-add-countdown-timer-to-phaser-game
 *      portions of the clock code was generated by chatGPT, coversation link https://chat.openai.com/share/df0ed833-fcef-4287-9793-11476f6a4851
 */

let config = {
    type: Phaser.AUTO,
    width: 640, 
    height: 480,
    pixelPerfect: true,
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            debug: true
        }
    },
    scene: [ Menu, Play ]
}
let game = new Phaser.Game(config)

// set UI sizes
let borderUISize = game.config.height / 15
let borderPadding = borderUISize / 3

// keyboard bindings
let keyFIRE, keyRESET, keyLEFT, keyRIGHT
