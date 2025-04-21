class Example extends Phaser.Scene {
    constructor() {
        super({ key: 'Example' });
        this.appleCount = 0;
        this.sprite = null;
        this.cursors = null;
        this.appleGroup = null;
        this.text = null;
    }

    preload() {
        this.load.on('loaderror', function (file) {
    console.error('❌ Failed to load:', file.src);
});

        this.load.image('box', 'assets/sprites/box.png');
        this.load.image('apple', 'assets/sprites/apple.png');
    }

    create() {
        // Create player sprite
        this.sprite = this.physics.add.image(400, 550, 'box');
        this.sprite.setCollideWorldBounds(true);

        // Group for falling apples
        this.appleGroup = this.physics.add.group();

        // Display collected apples count
        this.text = this.add.text(10, 10, 'Apples Collected: 0', {
            font: '24px Courier',
            fill: '#ffffff'
        });

        // Enable keyboard controls
        this.cursors = this.input.keyboard.createCursorKeys();

        // Collision detection between player and apples
        this.physics.add.overlap(this.sprite, this.appleGroup, this.collectApple, null, this);

        // Repeatedly drop apples
        this.time.addEvent({
            delay: 1000,
            callback: this.dropApple,
            callbackScope: this,
            loop: true
        });
    }

    update() {
        this.sprite.setVelocityX(0);

        if (this.cursors.left.isDown) {
            this.sprite.setVelocityX(-200);
        } else if (this.cursors.right.isDown) {
            this.sprite.setVelocityX(200);
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
        const apple = this.appleGroup.create(x, 0, 'apple');
        apple.setVelocityY(150);
    }

    collectApple(player, apple) {
        apple.destroy();
        this.appleCount++;
        this.text.setText(`Apples Collected: ${this.appleCount}`);
    }
}

// Phaser game configuration
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#2d6b2d',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: Example
};

// Launch the game
const game = new Phaser.Game(config);
