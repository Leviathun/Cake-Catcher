// ============================================
// Cake Catcher — Tomato (Hazard)
// Falling obstacle that damages player
// (Replaces the old Broccoli)
// ============================================

class Tomato extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x) {
        super(scene, x, -40, 'tomato');
        
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        // Scale — 128px image, we want ~48px in-game
        this.setScale(0.375);
        this.setDepth(6);
        this.body.setAllowGravity(false);
        
        // Adjust physics body for 128px circular tomato
        this.body.setSize(90, 90);
        this.body.setOffset(19, 19);
        
        // Shadow
        this.shadow = new Shadow(scene, x);
        
        // State
        this.isBouncing = false;
        this.hasHitPlayer = false;
        
        // Wobble animation
        scene.tweens.add({
            targets: this,
            angle: { from: -12, to: 12 },
            duration: 400,
            repeat: -1,
            yoyo: true,
            ease: 'Sine.easeInOut'
        });
    }

    setFallSpeed(speed) {
        this.body.setVelocityY(speed);
    }

    /**
     * Handle hitting the player
     */
    onHitPlayer(scene) {
        this.hasHitPlayer = true;
        
        // Red splat effect (tomato!)
        this.createSplat(scene);
        
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
        this.body.setVelocityX(dir * (CONFIG.BOUNCE_SIDE_VELOCITY * 1.2));
        this.body.setBounce(CONFIG.BOUNCE_FACTOR);
        
        // Spin while bouncing
        this.scene.tweens.add({
            targets: this,
            angle: dir * 540,
            duration: 1000,
            ease: 'Linear'
        });
        
        // Fade out
        this.scene.tweens.add({
            targets: this,
            alpha: 0,
            duration: 1200,
            onComplete: () => {
                if (this.shadow) this.shadow.destroy();
                this.destroy();
            }
        });
    }

    /**
     * Red tomato splat particles
     */
    createSplat(scene) {
        for (let i = 0; i < 10; i++) {
            const particle = scene.add.circle(
                this.x + Phaser.Math.Between(-20, 20),
                this.y + Phaser.Math.Between(-20, 20),
                Phaser.Math.Between(3, 7),
                Phaser.Math.RND.pick([0xFF0000, 0xCC0000, 0xFF4444, 0xFF6347, 0xDC143C]),
                0.8
            );
            particle.setDepth(20);
            
            scene.tweens.add({
                targets: particle,
                x: particle.x + Phaser.Math.Between(-40, 40),
                y: particle.y + Phaser.Math.Between(-30, 30),
                alpha: 0,
                scale: 0.2,
                duration: 500 + Phaser.Math.Between(0, 300),
                ease: 'Cubic.easeOut',
                onComplete: () => particle.destroy()
            });
        }
    }

    update() {
        if (this.shadow && this.shadow.active) {
            this.shadow.updateFromItem(this);
        }
        
        if (this.y > CONFIG.GAME_HEIGHT + 50 || 
            this.x < -100 || this.x > CONFIG.GAME_WIDTH + 100) {
            if (this.shadow) this.shadow.destroy();
            this.destroy();
        }
    }
}
