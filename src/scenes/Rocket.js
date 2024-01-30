// rocket prefab
class Rocket extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame)

        // add to scene 
        scene.physics.add.existing(this)
        scene.add.existing(this)

        // some data about it
        this.isFiring = false
        this.moveSpeed = 2      // in pixels/frame
        this.sfxShot = scene.sound.add('sfx-shot')
    }

    update() {
        // left/right movement
        if (!this.isFiring) {
            if (keyLEFT.isDown && this.x >= borderUISize + this.width) {
                this.x -= this.moveSpeed
            } else if (keyRIGHT.isDown && this.x <= game.config.width - borderUISize - this.width) {
                this.x += this.moveSpeed
            }
        }
        // fire button
        if (Phaser.Input.Keyboard.JustDown(keyFIRE)) {
            this.isFiring = true
            this.sfxShot.play()
        }
        // if fired, move up
        if (this.isFiring && this.y >= borderUISize * 3 + borderPadding) {
            this.y -= this.moveSpeed
        }
    }

    reset() {
        this.isFiring = false
        this.y = game.config.height - borderUISize - borderPadding
    }
}