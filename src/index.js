const config = {
    type: Phaser.AUTO,
    width: 620,
    height: window.innerHeight,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: true,
        },
    },
    scene: {
        preload: preload,
        create: create,
        update: update,
    },
}

const game = new Phaser.Game(config)
let player
let platforms
let aKey
let dKey
let cursors
let gameOverDistance = 0

window.addEventListener(
    'resize',
    function () {
        game.scale.resize(config.width, window.innerHeight)
    },
    false,
)

function preload() {
    this.load.image('background_img', 'assets2/background.png')
    this.load.image('playerSprite', 'assets2/player.png')
    this.load.image('platform', 'assets2/game-tiles.png')
    this.load.image('playerJumpSprite', 'assets2/player_jump.png')
}

function create() {

    this.add.image(0, 0, 'background_img').setOrigin(0, 0).setScrollFactor(0)
    //this.add.image(config.width/2, config.height/2, 'background_img')

    //player
    player = this.physics.add.sprite(325, -100, 'playerSprite')
    player.setBounce(0, 1)
    player.setVelocityY(-400)
    player.body.setSize(64, 90)
    player.body.setOffset(32, 30)
    player.setDepth(10)

    //animation
        this.anims.create({
            key: 'jump',
            frames: [{ key: 'playerJumpSprite' }, { key: 'playerSprite' }],
            frameRate: 10,
            repeat: 0,
        })

    //platforms
    platforms = this.physics.add.staticGroup()
    platforms.create(Phaser.Math.Between(0, 640), -200, 'platform')
    platforms.create(Phaser.Math.Between(0, 640), -400, 'platform')
    platforms.create(Phaser.Math.Between(0, 640), -600, 'platform')
    platforms.create(Phaser.Math.Between(0, 640), -800, 'platform')
    platforms.create(Phaser.Math.Between(0, 640), -1000, 'platform')
    platforms.create(Phaser.Math.Between(0, 640), -1200, 'platform')
    platforms.create(Phaser.Math.Between(0, 640), -1400, 'platform')
        platforms.children.iterate(function (platform) {
        platform.body.checkCollision.down = true
        platform.body.checkCollision.left = false
        platform.body.checkCollision.right = false
    })


    //colliders
    this.physics.add.collider(platforms, platforms, collider => {
		collider.x = Phaser.Math.Between(0, 640)
		collider.refreshBody()
	})

    this.physics.add.collider(player, platforms, (playerObj, platformObj) => {
        if (platformObj.body.touching.up && playerObj.body.touching.down) {
            player.setVelocityY(-400)
            player.anims.play('jump', true)
        }
    })

    //camera
    this.cameras.main.startFollow(player, false, 0, 1)

    //controls
    aKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A, true, true)
    dKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D, true, true)
    //cursors
    //cursors = this.input.keyboard.createCursorKeys()


}

function update() {

    // player movement with A and D keys
    if (aKey.isDown && !dKey.isDown) {
        if (player.x > 32) {
            player.setVelocityX(-300)
            player.flipX = true
        } else {
            player.setVelocityX(0)
        }
    }
    if (dKey.isDown && !aKey.isDown) {
        if (player.x < 608) {
            player.setVelocityX(300)
            player.flipX = false
        } else {
            player.setVelocityX(0)
        }
    }
    if (!aKey.isDown && !dKey.isDown) {
        player.setVelocityX(0)
    }

    // player movement with cursor keys
    //if (cursors.left.isDown && !cursors.right.isDown) {
    //    player.x > 32 ? player.setVelocityX(-300) : player.setVelocityX(0)
    //}
    //else if (cursors.right.isDown && !cursors.left.isDown) {
    //    player.x < 608 ? player.setVelocityX(300) : player.setVelocityX(0)
    //}
    //else {
    //    player.setVelocityX(0)
    //}

    platforms.children.iterate(function (platform) {
        if (platform.y > player.y && player.body.center.distance(platform.body.center) > 700) {
            platform.x = Phaser.Math.Between(0, 640)
            platform.y = platform.y - Phaser.Math.Between(1150, 1200)
            platform.refreshBody()
        }
    })

    if (player.body.y > gameOverDistance) {
        this.physics.pause()
    } else if (player.body.y * -1 - gameOverDistance * -1 > 600) {
        gameOverDistance = player.body.y + 600
    }
}
