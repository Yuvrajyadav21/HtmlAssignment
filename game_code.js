class Example extends Phaser.Scene {
    constructor() {
        super({ key: 'Example' });
        this.appleCount = 0;
        this.player = null;
        this.cursors = null;
        this.appleGroup = null;
        this.text = null;
    }

    preload() {
        this.load.image('player', 'assets/sprites/box.png');
        this.load.image('apple', 'assets/sprites/apple.png');
        this.load.image('ground', 'assets/sprites/ground.png');
        
        // Create sky background
        const skyColor = this.textures.createCanvas('sky', 800, 600);
        const ctx = skyColor.getContext();
        const gradient = ctx.createLinearGradient(0, 0, 0, 600);
        gradient.addColorStop(0, '#87CEEB');
        gradient.addColorStop(1, '#E0F7FA');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 800, 600);
        skyColor.refresh();
    }

    create() {
        // Add background
        this.add.image(0, 0, 'sky').setOrigin(0);
        
        // Create ground (static physics body)
        this.ground = this.physics.add.staticImage(0, 580, 'ground')
            .setOrigin(0)
            .setDisplaySize(800, 20)
            .refreshBody();
        
        // Create player
        this.player = this.physics.add.sprite(400, 530, 'player')
            .setCollideWorldBounds(true)
            .setBounce(0.2)
            .setScale(0.8)
            .setDragX(300)
            .setSize(40, 40)
            .setOffset(5, 5);

        // Player-ground collision
        this.physics.add.collider(this.player, this.ground);

        // Apple group
        this.appleGroup = this.physics.add.group();

        // Destroy apples when they hit ground
        this.physics.add.collider(
            this.appleGroup, 
            this.ground, 
            function(apple) {
                apple.destroy(); // Only destroys the apple
            }
        );

        // Score display
        this.text = this.add.text(20, 20, 'Apples Collected: 0', {
            font: '28px Arial',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        });

        // Controls
        this.cursors = this.input.keyboard.createCursorKeys();
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // Apple collection
        this.physics.add.overlap(this.player, this.appleGroup, this.collectApple, null, this);

        // Apple spawning (2 per second)
        this.time.addEvent({
            delay: 1000,
            callback: () => {
                if (this.appleGroup.getLength() < 4) {
                    this.dropApple();
                    this.dropApple();
                }
            },
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

        // Clean up apples below screen
        this.appleGroup.getChildren().forEach(apple => {
            if (apple.y > 600) apple.destroy();
        });
    }

    dropApple() {
        const apple = this.appleGroup.create(
            Phaser.Math.Between(50, 750), 
            -30, 
            'apple'
        )
        .setScale(0.7)
        .setVelocity(Phaser.Math.Between(-50, 50), 150)
        .setBounce(0.3);
    }

    collectApple(player, apple) {
        apple.destroy();
        this.appleCount++;
        this.text.setText(`Apples Collected: ${this.appleCount}`);
        
        this.tweens.add({
            targets: player,
            scaleX: 1.1,
            scaleY: 1.1,
            duration: 100,
            yoyo: true
        });
    }
}

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
