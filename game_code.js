class Example extends Phaser.Scene {
    constructor() {
        super({ key: 'Example' });
    }

    preload() {
        this.load.image('player', 'assets/sprites/box.png');
        this.load.image('apple', 'assets/sprites/apple.png');

        // Create sky background
        const skyTexture = this.textures.createCanvas('sky', 800, 600);
        const skyCtx = skyTexture.getContext('2d');
        const gradient = skyCtx.createLinearGradient(0, 0, 0, 600);
        gradient.addColorStop(0, '#87CEEB');
        gradient.addColorStop(1, '#E0F7FA');
        skyCtx.fillStyle = gradient;
        skyCtx.fillRect(0, 0, 800, 600);
        skyTexture.refresh();

        // Create ground background (flat green platform)
        const groundTexture = this.textures.createCanvas('groundCanvas', 800, 40);
        const groundCtx = groundTexture.getContext('2d');
        groundCtx.fillStyle = '#228B22'; // Forest green
        groundCtx.fillRect(0, 0, 800, 40);
        groundTexture.refresh();
    }

    create() {
        this.add.image(0, 0, 'sky').setOrigin(0);

        // GROUND
        this.ground = this.physics.add.staticGroup();
        const ground = this.ground.create(400, 580, 'groundCanvas'); // 580 = bottom
        ground.refreshBody();

        // CREDIT TEXT - Top Right Corner
this.add.text(780, 20, 'Made By Yuvraj Yadav', {
    font: '20px Arial',
    fill: '#ffffff',
    stroke: '#000000',
    strokeThickness: 3
}).setOrigin(1, 0); // Align right top


        // PLAYER
        this.player = this.physics.add.sprite(400, 500, 'player')
            .setCollideWorldBounds(true)
            .setBounce(0.1)
            .setScale(0.8)
            .setDragX(500)
            .setSize(40, 40)
            .setOffset(5, 5);

        this.physics.add.collider(this.player, this.ground);

        // APPLES
        this.apples = this.physics.add.group();

        this.physics.add.collider(
            this.apples,
            this.ground,
            (apple, ground) => apple.destroy()
        );

        // SCORE
        this.appleCount = 0;
        this.scoreText = this.add.text(20, 20, 'Apples: 0', {
            font: '28px Arial',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        });

        this.cursors = this.input.keyboard.createCursorKeys();

        this.physics.add.overlap(this.player, this.apples, this.collectApple, null, this);

        // SPAWN
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
            -20,
            'apple'
        )
        .setScale(0.7)
        .setBounce(0.3)
        .setVelocity(Phaser.Math.Between(-50, 50), 200);
    }

    update() {
        this.player.setVelocityX(0);
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-300);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(300);
        }

        if (this.cursors.up.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-400);
        }

        this.apples.getChildren().forEach(apple => {
            if (apple.y > 600) apple.destroy();
        });
    }

    collectApple(player, apple) {
        apple.destroy();
        this.appleCount++;
        this.scoreText.setText(`Apples: ${this.appleCount}`);

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
