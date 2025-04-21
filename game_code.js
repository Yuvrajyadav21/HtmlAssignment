class Example extends Phaser.Scene {
    constructor() {
        super({ key: 'Example' });
        this.appleCount = 0;
        this.player = null;
        this.cursors = null;
        this.appleGroup = null;
        this.text = null;
        this.background = null;
        this.ground = null;
    }

    preload() {
        // Load assets
        this.load.image('player', 'assets/sprites/box.png');
        this.load.image('apple', 'assets/sprites/apple.png');
        this.load.image('sky', 'assets/sprites/Sky.png');
        this.load.image('ground', 'assets/sprites/Ground.png');
    }

    create() {
        // Add background - make sure these images exist in your folder
        this.background = this.add.image(0, 0, 'sky').setOrigin(0).setDisplaySize(800, 600);
        this.ground = this.physics.add.staticImage(0, 550, 'ground').setOrigin(0).setDisplaySize(800, 50);
        
        // Create player with physics
        this.player = this.physics.add.sprite(400, 500, 'player')
            .setCollideWorldBounds(true)
            .setBounce(0.2)
            .setScale(0.8)
            .setDragX(300);

        // Enable physics for ground
        this.physics.add.collider(this.player, this.ground);

        // Group for falling apples
        this.appleGroup = this.physics.add.group();

        // Display collected apples count
        this.text = this.add.text(20, 20, 'Apples Collected: 0', {
            font: '28px Arial',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        });

        // Enable keyboard controls
        this.cursors = this.input.keyboard.createCursorKeys();
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // Collision detection
        this.physics.add.overlap(this.player, this.appleGroup, this.collectApple, null, this);

        // Drop apples less frequently (every 2-3 seconds)
        this.time.addEvent({
            delay: Phaser.Math.Between(2000, 3000),
            callback: this.dropApple,
            callbackScope: this,
            loop: true
        });
    }

    update() {
        // Movement
        this.player.setVelocityX(0);
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-300);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(300);
        }

        // Jumping
        if (Phaser.Input.Keyboard.JustDown(this.spaceKey) && this.player.body.touching.down) {
            this.player.setVelocityY(-400);
        }
    }

    dropApple() {
        // Create fewer apples (only 1 at a time)
        if (this.appleGroup.getLength() < 3) { // Maximum 3 apples on screen
            const apple = this.appleGroup.create(
                Phaser.Math.Between(50, 750), 
                -50, 
                'apple'
            ).setScale(0.7);
            
            apple.setVelocityY(150);
        }
    }

    collectApple(player, apple) {
        apple.destroy();
        this.appleCount++;
        this.text.setText(`Apples Collected: ${this.appleCount}`);
        
        // Visual feedback
        this.tweens.add({
            targets: player,
            scaleX: 1.1,
            scaleY: 1.1,
            duration: 100,
            yoyo: true
        });
    }
}

// Game config
const config = {
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
    scene: Example
};

const game = new Phaser.Game(config);
