// ============================================
// Cake Catcher — Player (Celia)
// Mouse-follow movement + Variable jump
// Uses idle/run spritesheet animations
// ============================================

class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'idle', 0);
        
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        // Physics setup
        this.setCollideWorldBounds(true);
        
        // Scale sprite — sprites are now 128px, we want ~96px in-game
        this.setScale(0.75);
        
        // Physics body — adjusted for 128px sprite
        this.body.setSize(80, 110);
        this.body.setOffset(24, 14);
        this.setDepth(10);
        
        // Movement
        this.targetX = x;
        this.isMoving = false;
        this.facingRight = true;
        
        // Jump
        this.isCharging = false;
        this.jumpPower = 0;
        this.canJump = true;
        
        // Health
        this.hp = CONFIG.INITIAL_HP;
        this.isInvincible = false;
        this.invincibleTimer = 0;
        
        // State
        this.isDead = false;
        
        // Start idle animation
        this.play('celia_idle');
    }

    /**
     * Update target X from mouse position
     */
    followMouse(pointerX) {
        this.targetX = Phaser.Math.Clamp(
            pointerX,
            CONFIG.PLATFORM_LEFT,
            CONFIG.PLATFORM_RIGHT
        );
    }

    /**
     * Start charging jump
     */
    startJumpCharge() {
        if (this.body.blocked.down && !this.isDead) {
            this.isCharging = true;
            this.jumpPower = CONFIG.JUMP_MIN_VELOCITY;
        }
    }

    /**
     * Release jump with accumulated power
     */
    releaseJump() {
        if (this.isCharging && !this.isDead) {
            this.setVelocityY(-this.jumpPower);
            this.isCharging = false;
            this.jumpPower = 0;
            
            // Jump SFX
            this.playSound('sfx_jump', 0.5);
        }
    }

    /**
     * Take damage from tomato
     */
    takeDamage() {
        if (this.isInvincible || this.isDead) return false;
        
        this.hp--;
        this.isInvincible = true;
        this.invincibleTimer = CONFIG.INVINCIBLE_DURATION;
        
        // Flash effect
        this.scene.tweens.add({
            targets: this,
            alpha: 0.3,
            duration: 100,
            repeat: 7,
            yoyo: true,
            onComplete: () => {
                this.alpha = 1;
                this.isInvincible = false;
            }
        });
        
        // Tint red briefly
        this.setTint(0xff0000);
        this.scene.time.delayedCall(200, () => {
            if (!this.isDead) this.clearTint();
        });
        
        // Screen shake
        this.scene.cameras.main.shake(200, 0.01);
        
        return this.hp <= 0;
    }

    /**
     * Instant death from mimic
     */
    instantDeath() {
        this.isDead = true;
        this.hp = 0;
        this.setTint(0xff0000);
        
        // Big screen shake
        this.scene.cameras.main.shake(400, 0.03);
        this.scene.cameras.main.flash(300, 255, 0, 0);
    }

    /**
     * Main update loop
     */
    update(time, delta) {
        if (this.isDead) return;
        
        // Smooth follow mouse X
        const prevX = this.x;
        this.x = Phaser.Math.Linear(this.x, this.targetX, CONFIG.PLAYER_LERP);
        this.x = Phaser.Math.Clamp(this.x, CONFIG.PLATFORM_LEFT, CONFIG.PLATFORM_RIGHT);
        
        // Check if moving
        const moveAmount = Math.abs(this.x - prevX);
        const wasMoving = this.isMoving;
        this.isMoving = moveAmount > 0.5;
        
        // Switch animation based on movement state
        if (this.isMoving && !wasMoving) {
            this.play('celia_run', true);
            // Run SFX
            this.playSound('sfx_run', 0.3);
        } else if (!this.isMoving && wasMoving) {
            this.play('celia_idle', true);
        }
        
        // Flip based on movement direction
        if (moveAmount > 1) {
            if (this.x > prevX) {
                this.setFlipX(false);
                this.facingRight = true;
            } else {
                this.setFlipX(true);
                this.facingRight = false;
            }
        }
        
        // Charge jump while holding
        if (this.isCharging) {
            this.jumpPower = Math.min(
                this.jumpPower + CONFIG.JUMP_CHARGE_RATE,
                CONFIG.JUMP_MAX_VELOCITY
            );
        }
        
        // Update invincibility timer
        if (this.isInvincible) {
            this.invincibleTimer -= delta;
            if (this.invincibleTimer <= 0) {
                this.isInvincible = false;
                this.alpha = 1;
            }
        }
    }

    /**
     * Play sound helper
     */
    playSound(key, volume = 0.5) {
        try {
            if (this.scene.sound.get(key) || this.scene.cache.audio.exists(key)) {
                this.scene.sound.play(key, { volume });
            }
        } catch (e) {
            // Audio not loaded — ignore
        }
    }
}
