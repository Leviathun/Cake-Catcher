// ============================================
// Cake Catcher — Menu Scene
// Title screen with Start, Stats, Credits
// ============================================

class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: CONFIG.SCENE_MENU });
    }

    create() {
        const { width, height } = this.cameras.main;
        
        this.cameras.main.fadeIn(500);
        this.cameras.main.setBackgroundColor(0x1a1a2e);
        
        // Ruins background
        if (this.textures.exists('bg_ruins')) {
            const bg = this.add.image(width / 2, height / 2, 'bg_ruins');
            bg.setDisplaySize(width, height);
            bg.setDepth(0);
        }
        
        // Darken overlay for text readability
        const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.25);
        overlay.setDepth(1);
        
        // Title shadow
        this.add.text(width / 2 + 3, 133, 'Cake Catcher', {
            fontFamily: '"Press Start 2P"',
            fontSize: '42px',
            color: '#000000',
            align: 'center',
        }).setOrigin(0.5).setAlpha(0.3).setDepth(2);
        
        // Title text
        const title = this.add.text(width / 2, 130, 'Cake Catcher', {
            fontFamily: '"Press Start 2P"',
            fontSize: '42px',
            color: '#FFD700',
            align: 'center',
            stroke: '#8B4513',
            strokeThickness: 4,
        });
        title.setOrigin(0.5);
        title.setDepth(2);
        
        // Title bounce animation
        this.tweens.add({
            targets: title,
            y: 140,
            duration: 1500,
            repeat: -1,
            yoyo: true,
            ease: 'Sine.easeInOut'
        });
        
        // Cake emoji subtitle
        const subtitle = this.add.text(width / 2, 195, '🍰 Catch the Cake! 🍰', {
            fontFamily: '"Press Start 2P"',
            fontSize: '14px',
            color: '#ffffff',
            stroke: '#333333',
            strokeThickness: 2,
        });
        subtitle.setOrigin(0.5);
        subtitle.setDepth(2);
        
        // Character preview — Celia with home_idle animation
        if (this.textures.exists('home_idle')) {
            const celia = this.add.sprite(width / 2, height / 2, 'home_idle');
            celia.setScale(0.6);
            celia.setDepth(1);
            celia.play('celia_home_idle');
            
            // Gentle floating animation
            this.tweens.add({
                targets: celia,
                y: celia.y - 10,
                duration: 1200,
                repeat: -1,
                yoyo: true,
                ease: 'Sine.easeInOut'
            });
        }
        
        // ============ BUTTONS ============
        const buttonY = height / 2 + 150;
        const buttonSpacing = 60;
        
        this.createButton(width / 2, buttonY, '▶  START GAME', () => {
            this.cameras.main.fadeOut(300, 0, 0, 0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.start(CONFIG.SCENE_CUTSCENE);
            });
        });
        
        this.createButton(width / 2, buttonY + buttonSpacing, '🏆  LEADERBOARD', () => {
            this.cameras.main.fadeOut(300, 0, 0, 0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.start(CONFIG.SCENE_STATS);
            });
        });
        
        this.createButton(width / 2, buttonY + buttonSpacing * 2, '📜  CREDITS', () => {
            this.cameras.main.fadeOut(300, 0, 0, 0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.start(CONFIG.SCENE_CREDITS);
            });
        });
        
        // Falling cake background animation
        this.createFallingCakes();
        
        // Version text
        this.add.text(width - 10, height - 10, 'v1.1', {
            fontFamily: '"Press Start 2P"',
            fontSize: '8px',
            color: '#ffffff',
            alpha: 0.4,
        }).setOrigin(1, 1).setDepth(2);
    }

    createButton(x, y, label, callback) {
        const bg = this.add.rectangle(x, y, 320, 42, 0x2a1a3e, 0.9);
        bg.setStrokeStyle(2, 0x4CAF50);
        bg.setInteractive({ useHandCursor: true });
        bg.setDepth(4);
        
        const text = this.add.text(x, y, label, {
            fontFamily: '"Press Start 2P"',
            fontSize: '13px',
            color: '#ffffff',
        });
        text.setOrigin(0.5);
        text.setDepth(4);
        
        bg.on('pointerover', () => {
            bg.setFillStyle(0x4CAF50, 0.8);
            text.setColor('#FFD700');
            this.tweens.add({
                targets: [bg, text],
                scaleX: 1.05,
                scaleY: 1.05,
                duration: 100,
            });
        });
        
        bg.on('pointerout', () => {
            bg.setFillStyle(0x2a1a3e, 0.9);
            text.setColor('#ffffff');
            this.tweens.add({
                targets: [bg, text],
                scaleX: 1,
                scaleY: 1,
                duration: 100,
            });
        });
        
        bg.on('pointerdown', callback);
        
        return { bg, text };
    }

    createFallingCakes() {
        this.time.addEvent({
            delay: 2000,
            loop: true,
            callback: () => {
                if (this.textures.exists('cake')) {
                    const cake = this.add.image(
                        Phaser.Math.Between(100, CONFIG.GAME_WIDTH - 100),
                        -30,
                        'cake'
                    );
                    cake.setScale(0.04);
                    cake.setAlpha(0.3);
                    cake.setDepth(1);
                    
                    this.tweens.add({
                        targets: cake,
                        y: CONFIG.GAME_HEIGHT + 50,
                        angle: Phaser.Math.Between(-180, 180),
                        duration: Phaser.Math.Between(4000, 7000),
                        onComplete: () => cake.destroy()
                    });
                }
            }
        });
    }
}
