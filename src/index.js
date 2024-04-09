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

window.addEventListener(
    'resize',
    function () {
        game.scale.resize(config.width, window.innerHeight)
    },
    false,
)

const game = new Phaser.Game(config)
let player
let platforms
let aKey
let dKey
let cursors

function preload() {
    this.load.image('background_img', 'assets/background.png')
    this.load.image('playerSprite', 'assets/player.png')
    this.load.image('platform', 'assets/game-tiles.png')
    this.load.image('playerJumpSprite', 'assets/player_jump.png')
}

function create() {

    this.add.image(0, 0, 'background_img').setOrigin(0, 0).setScrollFactor(0)
    //this.add.image(config.width/2, config.height/2, 'background_img')

    //player
    player = this.physics.add.sprite(325, -100, 'playerSprite')
    player.setBounce(0, 1)
    player.setVelocityY(-400)
    //platforms
    platforms = this.physics.add.staticGroup()
    platforms.create(325, 0, 'platform')
    //animation
        this.anims.create({
            key: 'jump',
            frames: [{ key: 'playerJumpSprite' }, { key: 'playerSprite' }],
            frameRate: 10,
            repeat: 0,
        })

    //colliders
    this.physics.add.collider(player, platforms, () => {
        player.anims.play('jump', true)
    })
    //camera
    this.cameras.main.startFollow(player, false, 0, 1)

    //controls
    aKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A, true, true)
    dKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D, true, true)
    //cursors
    cursors = this.input.keyboard.createCursorKeys()


}

function update() {

    // player movement with A and D keys
    if (aKey.isDown && !dKey.isDown) {
        player.x > 32 ? player.setVelocityX(-300) : player.setVelocityX(0)
    }
    else if (dKey.isDown && !aKey.isDown) {
        player.x < 608 ? player.setVelocityX(300) : player.setVelocityX(0)
    }
    else {
        player.setVelocityX(0)
    }

    // player movement with cursor keys
    if (cursors.left.isDown && !cursors.right.isDown) {
        player.x > 32 ? player.setVelocityX(-300) : player.setVelocityX(0)
    }
    else if (cursors.right.isDown && !cursors.left.isDown) {
        player.x < 608 ? player.setVelocityX(300) : player.setVelocityX(0)
    }
    else {
        player.setVelocityX(0)
    }
}
