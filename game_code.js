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
        // Add background
        this.background = this.add.tileSprite(0, 0, 800, 600, 'sky').setOrigin(0);
        this.ground = this.add.tileSprite(0, 550, 800, 50, 'ground').setOrigin(0);
        
        // Create player with physics
        this.player = this.physics.add.sprite(400, 500, 'player')
            .setCollideWorldBounds(true)
            .setBounce(0.2)
            .setScale(0.8)
            .setDragX(300);

        // Group for falling apples
        this.appleGroup = this.physics.add.group();

        // Display collected apples count with better styling
        this.text = this.add.text(20, 20, 'Apples Collected: 0', {
            font: '28px Arial',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4,
            shadow: {
                offsetX: 2,
                offsetY: 2,
                color: '#000000',
                blur: 2,
                stroke: true
            }
        });

        // Enable keyboard controls
        this.cursors = this.input.keyboard.createCursorKeys();
        
        // Add spacebar for jump
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // Collision detection between player and apples
        this.physics.add.overlap(this.player, this.appleGroup, this.collectApple, null, this);

        // Repeatedly drop apples with random timing
        this.time.addEvent({
            delay: Phaser.Math.Between(800, 1500),
            callback: this.dropApple,
            callbackScope: this,
            loop: true
        });

        // Set world bounds
        this.physics.world.setBounds(0, 0, 800, 600);
    }

    update() {
        // Reset horizontal movement
        this.player.setVelocityX(0);

        // Handle movement
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-300);
            this.player.setFlipX(false);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(300);
            this.player.setFlipX(true);
        }

        // Handle jumping
        if (Phaser.Input.Keyboard.JustDown(this.spaceKey) && this.player.body.onFloor()) {
            this.player.setVelocityY(-400);
        }

        // Destroy apples that fall off the screen
        this.appleGroup.getChildren().forEach(apple => {
            if (apple.y > 600) {
                apple.destroy();
            }
        });
    }

    dropApple() {
        const x = Phaser.Math.Between(50, 750);
        const apple = this.appleGroup.create(x, -50, 'apple')
            .setScale(0.7)
            .setBounce(0.3)
            .setCollideWorldBounds(true);
        
        apple.setVelocity(
            Phaser.Math.Between(-50, 50), 
            Phaser.Math.Between(100, 200)
        );
        
        // Set new random delay for next apple
        this.time.delayedCall(Phaser.Math.Between(800, 1500), this.dropApple, [], this);
    }

    collectApple(player, apple) {
        apple.destroy();
        this.appleCount++;
        this.text.setText(`Apples Collected: ${this.appleCount}`);
        
        // Add visual feedback
        this.tweens.add({
            targets: player,
            scaleX: 1.1,
            scaleY: 1.1,
            duration: 100,
            yoyo: true
        });
    }
}

// Phaser game configuration
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

// Launch the game
const game = new Phaser.Game(config);
