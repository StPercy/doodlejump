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
// event listener for resizing the game
window.addEventListener(
    'resize',
    function () {
        game.scale.resize(config.width, window.innerHeight)
    },
    false,
)
// element that will contain the game
const game = new Phaser.Game(config)
// elements that will be used in the game
let player
let platforms
let aKey
let dKey
let gameOverDistance = 0
let enemies
let gameOver = false
let spacebar
let ball
let score = 0
let scoreText
// preloaded elements that will be used in the game
function preload() {
    this.load.image('background_img', 'assets2/background.png')
    this.load.image('playerSprite', 'assets2/player.png')
    this.load.image('playerJumpSprite', 'assets2/player_jump.png')
    this.load.image('platform', 'assets2/game-tiles.png')
    this.load.image('enemy', 'assets2/enemy_default.png')
    this.load.spritesheet('enemyAnims', 'assets2/enemy.png', { frameWidth: 161, frameHeight: 95 })  
    this.load.image('ball', 'assets2/ball.png'),
    this.load.image('playerShoot', 'assets2/player_up.png')
}
// create elements that will be used in the game
function create() {
    this.add.image(0, 0, 'background_img').setOrigin(0, 0).setScrollFactor(0)
    //score
    scoreText = this.add.text(16, 16, 'score: 0', 
    { fontSize: '32px',fontStyle: 'bold', fill: '#000' }).setScrollFactor(0).setDepth(5)       

    //animation
    this.anims.create({
        key: 'jump',
        frames: [{ key: 'playerJumpSprite' }, { key: 'playerSprite' }],
        frameRate: 10,
        repeat: 0,
    })
    
    this.anims.create({
        key: 'shoot',
        frames: [{ key: 'playerShoot'}, { key: 'playerSprite'} ],
        frameRate: 10,
        repeat: 0,
    })

    this.anims.create({
        key: 'enemy_fly',
        frames: 'enemyAnims',
        frameRate: 10,
        repeat: -1,
        yoyo: true,
    })

    createPlayer(this.physics)
    createPlatforms(this.physics)
    createEnemies(this.physics)
    createBall(this.physics)
    //colliders
    this.physics.add.collider(player, platforms, (playerObj, platformObj) => {
        if (platformObj.body.touching.up && playerObj.body.touching.down) {
            player.setVelocityY(-400)
            player.anims.play('jump', true)
        }
    })

    this.physics.add.collider(platforms, platforms, collider => {
		collider.x = Phaser.Math.Between(0, 640)
		collider.refreshBody()
	})

    this.physics.add.collider(player, enemies, (_,enemy) => {
        this.physics.pause()
        gameOver = true
        enemy.anims.stop()
    })

    this.physics.add.collider(platforms, enemies, collider => {
		collider.x = Phaser.Math.Between(0, 640)
		collider.refreshBody()
	})
    
    this.physics.add.collider(enemies,ball, (ball, enemy) => {  
        enemy.disableBody(true, true)
        ball.disableBody(true, true)    
        score += 100
        scoreText.setText('Score: ' + score)
    })
    //camera
    this.cameras.main.startFollow(player, false, 0, 1)
    //keyboard
    createKeys(this.input.keyboard)
}

function update() {
    if (gameOver) return
    checkMovement()
    checkBall()
    checkShoot()
    refactorEnemies()
    refactorPlatforms()
    checkGameOver(this.physics)
    updateScore()
}
// player helper functions
function createPlayer(physics) {
       player = physics.add.sprite(325, -100, 'playerSprite')
       player.setBounce(0, 1)
       player.setVelocityY(-400)
       player.body.setSize(64, 90)
       player.body.setOffset(32,30)
       player.setDepth(10)
}
// platform helper function
function createPlatforms(physics) {
        platforms = physics.add.staticGroup()
        platforms.create( 325, 0, 'platform')
        platforms.create(Phaser.Math.Between(0, 640), -200, 'platform')
        platforms.create(Phaser.Math.Between(0, 640), -400, 'platform')
        platforms.create(Phaser.Math.Between(0, 640), -600, 'platform')
        platforms.create(Phaser.Math.Between(0, 640), -800, 'platform')
        platforms.create(Phaser.Math.Between(0, 640), -1000, 'platform')
        platforms.create(Phaser.Math.Between(0, 640), -1200, 'platform')
        platforms.create(Phaser.Math.Between(0, 640), -1400, 'platform')
        platforms.create(Phaser.Math.Between(0, 640), -1600, 'platform')
        platforms.create(Phaser.Math.Between(0, 640), -1800, 'platform')
        platforms.create(Phaser.Math.Between(0, 640), -2000, 'platform')
        platforms.create(Phaser.Math.Between(0, 640), -2200, 'platform')
        platforms.create(Phaser.Math.Between(0, 640), -2400, 'platform')
        platforms.children.iterate(function (platform) {
            platform.body.checkCollision.down = false
            platform.body.checkCollision.left = false
            platform.body.checkCollision.right = false
        })
}
// enemy helper functions
function createEnemies(physics) {
    enemies = physics.add.group()
    enemies.create(Phaser.Math.Between(0, 640), Phaser.Math.Between(-950, -1300), 'enemy')
    enemies.children.iterate(function (enemy) {
        enemy.body.setSize(60, 60)
        enemy.body.setOffset(50, 10)
        enemy.body.setAllowGravity(false)
        enemy.anims.play('enemy_fly')
    })
}
// ball helper function
function createBall(physics) {
    ball = physics.add.sprite(0, 0, 'ball')
    ball.active = false
    ball.body.setAllowGravity(false)
}
// keyboard helper functions
function createKeys(keyboard) {
    //controls
    aKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A, true, true)
    dKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D, true, true)
    spacebar = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)     
}
// movement helper functions
function checkMovement() {
   // player movement with A and D keys
   if (aKey.isDown && !dKey.isDown) {
        player.setVelocityX(-300)
        player.flipX = true
        if (player.x < 15) {
            player.x = 615
        }
    }
    if (dKey.isDown && !aKey.isDown) {
        player.setVelocityX(300)
        player.flipX = false
        if (player.x > 615){
            player.x = 15
        }
    }
    if (!aKey.isDown && !dKey.isDown) { player.setVelocityX(0) }
}
// shoot helper functions
function checkBall() {
    if (ball.active && ball.startPosition - ball.y > config.height) {
        ball.disableBody(true, true)
    }  
}

function checkShoot() {
    if (spacebar.isDown && !ball.active) {
        ball.x = player.x
        ball.y = player.y - 45
        player.anims.play('shoot', true)
        ball.enableBody(true, ball.x, ball.y, true, true)
        ball.setVelocityY(-1000)
        ball.startPosition = ball.y
    }
}
// platform helper functions
function refactorPlatforms() {
    let minY = 0
    platforms.children.iterate(function (platform) {
        if (platform.y < minY)  minY = platform.y
    })
    platforms.children.iterate(function (platform) {
        if (platform.y > player.y && player.body.center.distance(platform.body.center) > 700) {
            platform.x = Phaser.Math.Between(0, 640)
            platform.y = minY - 200
            platform.refreshBody()
        }
    })
}
    
function refactorEnemies() {
    enemies.children.iterate(function (enemy) {
        if (enemy.y > player.y && player.body.center.distance(enemy.body.center) > 700) {
            enemy.x = Phaser.Math.Between(0, 640)
            enemy.y = enemy.y - Phaser.Math.Between(1600, 1200)
            enemmy.enableBody(true, enemy.x, enemy.y, true, true)
        }
    })
}
// game over helper functions
function checkGameOver(physics) {
    if (player.body.y > gameOverDistance) {
        physics.pause()
        gameOver = true
    } else if (player.body.y * -1 - gameOverDistance * -1 > 600) {
        gameOverDistance = player.body.y + 600
    }
}
// score helper functions
function updateScore() {
    if (player.y * -1 > score) {
        score += 10
        scoreText.setText('Score: ' + score)
    }
}