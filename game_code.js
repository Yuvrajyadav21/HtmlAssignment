class Example extends Phaser.Scene {
    constructor() {
        super({ key: 'Example' });
        this.appleCount = 0;
    }

    preload() {
        this.load.image('box', 'assets/sprites/rat.png');      // Make sure this file exists at assets/rat.png
        this.load.image('apple', 'assets/sprites/cheese.png'); // Make sure this file exists at assets/cheese.png
    }

    create() {
        // Player box
        this.sprite = this.physics.add.image(400, 550, 'box');
        this.sprite.setCollideWorldBounds(true);

        // Falling apple group
        this.appleGroup = this.physics.add.group();

        // Apple count text
        this.text = this.add.text(10, 10, 'Apples Collected: 0', {
            font: '24px Courier',
            fill: '#ffffff'
        });

        // Controls
        this.cursors = this.input.keyboard.createCursorKeys();

        // Overlap check
        this.physics.add.overlap(this.sprite, this.appleGroup, this.collectApple, null, this);

        // Drop apples at intervals
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

        // Destroy apples that fall beyond screen
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

// Phaser game config
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

const game = new Phaser.Game(config);
