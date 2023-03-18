var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var player;
var stars;
var platforms;
var cursors;
var score = 0;
var scoreText;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('night', 'assets/night.png');
    this.load.image('grass', 'assets/grass.png');
    this.load.image('wood', 'assets/wood.png');
    this.load.image('cat', 'assets/cat.png');
    this.load.image('catcher', 'assets/catcher.png');
}

function create ()
{
    //  Simple Background
    this.add.image(400, 300, 'night');

    // Platforms function
    platforms = this.physics.add.staticGroup();

    // Platforms stuffs
    platforms.create(400, 568, 'grass').setScale(4).refreshBody();
    platforms.create(150, 250, 'wood');
    platforms.create(620, 400, 'wood');
    platforms.create(740, 210, 'wood');

    // Player settings
    player = this.physics.add.sprite(100, 450, 'catcher');

    //  Player Physics "bounce"
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    //  Input Events / Keyboard Functions
    cursors = this.input.keyboard.createCursorKeys();

    // Triple Cat
    stars = this.physics.add.group({
        key: 'cat',
        repeat: 2,
        setXY: { x: 100, y: 0, stepX: 330 }
    });

    //  Scoring UI Text
    scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '40px', fill: '#9ACD32' });

    //  Collider
    this.physics.add.collider(player, platforms);
    this.physics.add.collider(stars, platforms);
    
    //  Physics overlapping
    this.physics.add.overlap(player, stars, collectStar, null, this);
    
}

function update ()
{
    //Keyboard inputs and its function
    if (cursors.left.isDown)
    {
        player.setVelocityX(-160);

        player.anims.play('left', true);
    }
    else if (cursors.right.isDown)
    {
        player.setVelocityX(160);

        player.anims.play('right', true);
    }
    else
    {
        player.setVelocityX(0);

        player.anims.play('turn');
    }

    if (cursors.up.isDown && player.body.touching.down)
    {
        player.setVelocityY(-330);
    }
}

function collectStar (player, star)
{
    star.disableBody(true, true);

    //  Add and update the score
    score += 100;
    scoreText.setText('Score: ' + score);

    if (stars.countActive(true) === 0)
    {
        //  A new batch of stars to collect
        stars.children.iterate(function (child) {

            child.enableBody(true, child.x, 0, true, true);

        });

        var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
    }
}

