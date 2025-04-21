class Example extends Phaser.Scene {
    constructor() {
        super({ key: 'Example' });
    }

    preload() {
        this.load.image('player', 'assets/sprites/box.png');
        this.load.image('apple', 'assets/sprites/apple.png');
        this.load.image('ground', 'assets/sprites/ground.png');
        
        // Create sky background programmatically
        const skyTexture = this.textures.createCanvas('sky', 800, 600);
        const ctx = skyTexture.getContext('2d');
        const gradient = ctx.createLinearGradient(0, 0, 0, 600);
        gradient.addColorStop(0, '#87CEEB');
        gradient.addColorStop(1, '#E0F7FA');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 800, 600);
        skyTexture.refresh();
    }

    create() {
        // Add background behind everything
        this.add.image(0, 0, 'sky').setOrigin(0).setDepth(-1);
        
        // Create GROUND - truly static and immovable
        this.ground = this.physics.add.staticGroup();
        const ground = this.ground.create(400, 580, 'ground')
            .setScale(2, 0.5)
            .refreshBody();
        
        ground.body.immovable = true;
        ground.body.moves = false;

        // Create PLAYER
        this.player = this.physics.add.sprite(400, 500, 'player')
            .setCollideWorldBounds(true)
            .setBounce(0.1)
            .setScale(0.8)
            .setDragX(500)
            .setSize(40, 40)
            .setOffset(5, 5);

        // Player-ground collision
        this.physics.add.collider(this.player, this.ground);

        // APPLES group
        this.apples = this.physics.add.group();

        // Apple-ground collision (only destroys apples)
        this.physics.add.collider(
            this.apples,
            this.ground,
            (apple, ground) => {
                apple.destroy(); // Only destroy the apple, not the ground!
            }
        );

        // Score display
        this.appleCount = 0;
        this.scoreText = this.add.text(20, 20, 'Apples: 0', {
            font: '28px Arial',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        });

        // Controls
        this.cursors = this.input.keyboard.createCursorKeys();

        // Apple collection
        this.physics.add.overlap(this.player, this.apples, this.collectApple, null, this);

        // Apple spawner (2 per second)
        this.time.addEvent({
            delay: 1000,
            callback: this.dropApples,
            callbackScope: this,
            loop: true
        });
    }

    dropApples() {
        if (this.apples.getLength() < 4) {
            this.dropApple();
            this.dropApple();
        }
    }

    dropApple() {
        const apple = this.apples.create(
            Phaser.Math.Between(100, 700),
            -50,
            'apple'
        )
        .setScale(0.7)
        .setBounce(0.3)
        .setVelocity(Phaser.Math.Between(-50, 50), 200);
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
        if (this.cursors.up.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-400);
        }

        // Clean up fallen apples
        this.apples.getChildren().forEach(apple => {
            if (apple.y > 600) apple.destroy();
        });
    }

    collectApple(player, apple) {
        apple.destroy();
        this.appleCount++;
        this.scoreText.setText(`Apples: ${this.appleCount}`);

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
            debug: false // Set to true to see collision boxes
        }
    },
    scene: Example
};

const game = new Phaser.Game(config);
