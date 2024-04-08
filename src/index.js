const config = {
    type: Phaser.AUTO,
    width: 640,
    height: window.innerHeight,
    scene: {
        preload: preload,
        create: create,
        update: update,
    },
 }
 
 const game = new Phaser.Game(config)
 
 window.addEventListener(
    'resize',
    function () {
        game.scale.resize(config.width, window.innerHeight)
    },
    false,
 )
 
 function preload() {
    this.load.image('background_img', 'assets/background.png')
 }
 
 function create() {
    this.add.image(0, 0, 'background_img').setOrigin(0, 0)
    //this.add.image(config.width/2, config.height/2, 'background_img')
 }
 
 function update() {}