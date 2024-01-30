class Play extends Phaser.Scene {
    constructor() {
        super('playScene')
    }
    
    create() {
        // code that places background
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0)
        
        // code that places borders
        // green UI background
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00FF00).setOrigin(0, 0)
        // white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0)
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0)
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0)

        // create rocket (p1)
        this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5, 0)

        // them spaceships (x3)
        this.ship01 = new Spaceship(this, game.config.width + borderUISize*4, borderUISize*5, 'spaceship', 0, 30, game.settings.spaceshipSpeed).setOrigin(0, 0)
        this.ship02 = new Spaceship(this, game.config.width + borderUISize*2, borderUISize*6 + borderPadding, 'spaceship', 0, 20, game.settings.spaceshipSpeed).setOrigin(0,0)
        this.ship03 = new Spaceship(this, game.config.width, borderUISize*6 + borderPadding*5, 'spaceship', 0, 10, game.settings.spaceshipSpeed).setOrigin(0,0)
        // fancy ship (x1)
        this.ship04 = new Spaceship(this, game.config.width + borderUISize*8, borderUISize*3.75, 'fancySpaceship', 0, 70, game.settings.spaceshipSpeed*1.25).setOrigin(0,0)

        // initialize score
        this.p1Score = 0
        let textConfig = {
            fontFamily: 'Courier',
            fontSize: '26px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, this.p1Score, textConfig)
        
        // game over check
        this.gameOver = false

        // clock
        this.secondsRemaining = game.settings.gameTimer
        // styling
        textConfig.align = 'center'
        textConfig.color = '#009900'
        textConfig.backgroundColor = '#00FF00'
        this.clockText = this.add.text(game.config.width/2, borderUISize + borderPadding*2, this.secondsRemaining, textConfig).setOrigin(0.5, 0)
        this.clock = this.time.addEvent({
            delay: 1000,    // 1 second = 1000 milliseconds
            loop: true,
            startAt: 0,
            callback: this.updateClock,
            callbackScope: this,
        })
    }

    update() {
        // check for game over
        if (this.gameOver) {
            this.gameOverScreen()
        }
        // check for restart
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyRESET)) {
            this.scene.restart()
        }
        // return to menu
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene")
        }
        
        // scrolling background
        this.starfield.tilePositionX -= 4
        
        // keybinds
        keyFIRE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F)
        keyRESET = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R)
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT)
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)

        // update intances
        if (!this.gameOver) {
            this.p1Rocket.update()
            this.ship01.update()
            this.ship02.update()
            this.ship03.update()
            this.ship04.update()
        }
    
        // check collisions
        [this.ship01, this.ship02, this.ship03, this.ship04].forEach(ship => {
            if (this.checkCollision(this.p1Rocket, ship)) {
                this.p1Rocket.reset('hit')
                this.shipExplode(ship)
                this.updateClock(1)     // +1 seconds on hit
            }
        })

        // reset rocket on miss
        if (this.p1Rocket.y <= borderUISize * 3 + borderPadding) {
            this.p1Rocket.reset()
            this.updateClock(-5)        // -5 seconds on miss
        }
    }

    checkCollision(rocket, ship) {
        // simple AABB checking
        if (rocket.x < ship.x + ship.width &&
            rocket.x + rocket.width > ship.x && 
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship. y) {
            return true
        } else {
            return false
        }
    }

    shipExplode(ship) {
        // temp hide
        ship.alpha = 0
        // create explosion at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0)
        boom.anims.play('explode')
        boom.on('animationcomplete', () => {
            ship.reset()
            ship.alpha = 1
            boom.destroy()
        })
        // update score
        this.p1Score += ship.points
        this.scoreLeft.text = this.p1Score
        // sfx
        this.sound.play('sfx-explosion')
    }

    // display screen for game over
    gameOverScreen() {
        let textConfig = {
            fontFamily: 'Courier',
            fontSize: '26px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }
        this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', textConfig).setOrigin(0.5)
        this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or ← for Menu', textConfig).setOrigin(0.5)
    }

    // update the timer with x number of seconds
    updateClock(seconds=-1) {
        if (this.secondsRemaining > 0) {
        this.secondsRemaining += seconds
        // prevent seconds remaining from going under 5
        if (this.secondsRemaining > 0) {
            this.clockText.text = this.secondsRemaining
        } else {
            this.clockText.text = 0
        }
        }
        // check game over
        if (this.secondsRemaining <= 0) {
            this.gameOver = true
        }
    }
}
