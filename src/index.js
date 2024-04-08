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
 
 function preload() {}
 
 function create() {}
 
 function update() {}