// spaceship prefab
class Spaceship extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, pointValue, speed) {
        super(scene, x, y, texture, frame, pointValue, speed)
        scene.physics.add.existing(this)
        scene.add.existing(this)
        this.points = pointValue
        this.moveSpeed = speed
    }

    update() {
        // scroll spaceships left
        this.x -= this.moveSpeed

        // wrap around
        if (this.x <= 0 - this.width) {
            this.x = game.config.width
        }
    }

    reset() {
        this.x = game.config.width
    }
}