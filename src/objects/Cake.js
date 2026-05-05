// ============================================
// Cake Catcher — Cake (Collectible)
// Strawberry Shortcake falling item
// ============================================

class Cake extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x) {
        super(scene, x, -40, 'cake');
        
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        // Scale — 1024px image, we want ~48px in-game
        this.setScale(0.05);
        this.setDepth(6);
        this.body.setAllowGravity(false);
        
        // Adjust physics body
        this.body.setSize(800, 800);
        this.body.setOffset(112, 112);
        
        // Shadow
        this.shadow = new Shadow(scene, x);
        
        // State
        this.isBouncing = false;
        this.hasBeenCaught = false;
        
        // Slight rotation animation
        scene.tweens.add({
            targets: this,
            angle: { from: -8, to: 8 },
            duration: 600,
            repeat: -1,
            yoyo: true,
            ease: 'Sine.easeInOut'
        });
    }

    /**
     * Set fall speed
     */
    setFallSpeed(speed) {
        this.body.setVelocityY(speed);
    }

    /**
     * Handle being caught by player
     */
    onCaught(scene) {
        this.hasBeenCaught = true;
        
        // Sparkle effect
        this.createSparkle(scene);
        
        // Destroy shadow
        if (this.shadow) this.shadow.destroy();
        
        this.destroy();
    }

    /**
     * Handle bounce when hitting ground
     */
    startBounce() {
        if (this.isBouncing) return;
        this.isBouncing = true;
        
        this.body.setAllowGravity(true);
        this.body.setVelocityY(-CONFIG.BOUNCE_UP_VELOCITY);
        
        const dir = Phaser.Math.Between(0, 1) ? 1 : -1;
        this.body.setVelocityX(dir * CONFIG.BOUNCE_SIDE_VELOCITY);
        this.body.setBounce(CONFIG.BOUNCE_FACTOR);
        
        // Spin while bouncing
        this.scene.tweens.add({
            targets: this,
            angle: dir * 360,
            duration: 800,
            ease: 'Linear'
        });
        
        // Fade out and destroy
        this.scene.tweens.add({
            targets: this,
            alpha: 0,
            duration: 1000,
            onComplete: () => {
                if (this.shadow) this.shadow.destroy();
                this.destroy();
            }
        });
    }

    /**
     * Create sparkle particles on catch
     */
    createSparkle(scene) {
        for (let i = 0; i < 8; i++) {
            const particle = scene.add.circle(
                this.x + Phaser.Math.Between(-15, 15),
                this.y + Phaser.Math.Between(-15, 15),
                Phaser.Math.Between(2, 5),
                Phaser.Math.RND.pick([0xFFD700, 0xFFFFFF, 0xFFB6C1, 0xFF69B4]),
                1
            );
            particle.setDepth(20);
            
            scene.tweens.add({
                targets: particle,
                x: particle.x + Phaser.Math.Between(-30, 30),
                y: particle.y - Phaser.Math.Between(20, 50),
                alpha: 0,
                scale: 0,
                duration: 400 + Phaser.Math.Between(0, 200),
                ease: 'Cubic.easeOut',
                onComplete: () => particle.destroy()
            });
        }
    }

    /**
     * Update shadow position
     */
    update() {
        if (this.shadow && this.shadow.active) {
            this.shadow.updateFromItem(this);
        }
        
        // Check if out of bounds
        if (this.y > CONFIG.GAME_HEIGHT + 50 || 
            this.x < -100 || this.x > CONFIG.GAME_WIDTH + 100) {
            if (this.shadow) this.shadow.destroy();
            this.destroy();
        }
    }
}
