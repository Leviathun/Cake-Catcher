// ============================================
// Cake Catcher — Mimic (Ground Obstacle)
// Animated treasure chest that runs across
// the ground — instant Game Over on contact!
// (Replaces the old Cat)
// ============================================

class Mimic extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, fromLeft) {
        const startX = fromLeft ? -80 : CONFIG.GAME_WIDTH + 80;
        const y = CONFIG.GROUND_Y - 40;
        
        super(scene, startX, y, 'mimic', 0);
        
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        // Scale — 351px per frame, we want ~72px in-game
        this.setScale(0.2);
        this.setDepth(8);
        this.body.setAllowGravity(false);
        this.body.setSize(300, 350);
        this.body.setOffset(25, 50);
        
        this.fromLeft = fromLeft;
        this.speed = CONFIG.MIMIC_SPEED;
        
        // Flip sprite based on direction
        if (!fromLeft) {
            this.setFlipX(true);
        }
        
        // NOTE: velocity is set via setSpeed() after being added to physics group
        
        // Play mimic animation
        this.play('mimic_run');
        
        // Bob animation (hopping feel)
        scene.tweens.add({
            targets: this,
            y: y - 8,
            duration: 200,
            repeat: -1,
            yoyo: true,
            ease: 'Sine.easeInOut'
        });
        
        // Warning indicator
        this.createWarning(scene, fromLeft);
    }

    /**
     * Set speed (for difficulty scaling)
     */
    setSpeed(speed) {
        this.speed = speed;
        const vx = this.fromLeft ? speed : -speed;
        this.body.setVelocityX(vx);
    }

    /**
     * Create exclamation warning before mimic appears
     */
    createWarning(scene, fromLeft) {
        const warningX = fromLeft ? 40 : CONFIG.GAME_WIDTH - 40;
        const warningY = CONFIG.GROUND_Y - 60;
        
        const warning = scene.add.text(warningX, warningY, '⚠', {
            fontSize: '28px',
        });
        warning.setOrigin(0.5);
        warning.setDepth(15);
        
        scene.tweens.add({
            targets: warning,
            alpha: { from: 1, to: 0.3 },
            scale: { from: 1.2, to: 0.8 },
            duration: 200,
            repeat: 3,
            yoyo: true,
            onComplete: () => warning.destroy()
        });
    }

    update() {
        // Destroy when off screen
        if ((this.fromLeft && this.x > CONFIG.GAME_WIDTH + 100) ||
            (!this.fromLeft && this.x < -100)) {
            this.destroy();
        }
    }
}
