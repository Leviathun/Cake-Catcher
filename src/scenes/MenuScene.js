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
        
        // Background
        if (this.textures.exists('bg')) {
            const bg = this.add.image(width / 2, height / 2, 'bg');
            bg.setDisplaySize(width, height);
            bg.setDepth(0);
        }
        
        // Darken overlay for text readability
        const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.25);
        overlay.setDepth(1);
        
        // Title Header Background
        let headerBg;
        if (this.textures.exists('ui_header_a')) {
            headerBg = this.add.image(width / 2, 100, 'ui_header_a');
            headerBg.setDisplaySize(600, 120);
            headerBg.setDepth(2);
        }
        
        // Title text
        const title = this.add.text(width / 2, 100, 'CAKE CATCHER', {
            fontFamily: '"Press Start 2P"',
            fontSize: '32px',
            color: '#8B4513', 
            align: 'center',
            stroke: '#ffffff',
            strokeThickness: 2,
        });
        title.setOrigin(0.5);
        title.setDepth(2);
        
        // Title bounce animation
        this.tweens.add({
            targets: headerBg ? [title, headerBg] : title,
            y: '+=10',
            duration: 1500,
            repeat: -1,
            yoyo: true,
            ease: 'Sine.easeInOut'
        });
        
        // subtitle
        const subtitle = this.add.text(width / 2, 195, 'Catch the cake and dodge the tomatoes!', {
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
            const celia = this.add.sprite(width / 2, 320, 'home_idle');
            celia.setScale(1.5);
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
        
        // ============ MENU PANEL ============
        const buttonY = height / 2 + 130;
        const buttonSpacing = 75;
        
        if (this.textures.exists('ui_slices_home')) {
            const panel = this.add.image(width / 2, buttonY + buttonSpacing, 'ui_slices_home');
            panel.setDisplaySize(380, 360);
            panel.setDepth(3);
            panel.setAlpha(0.9);
        }
        
        // ============ BUTTONS ============
        this.createButton(width / 2, buttonY, 'START GAME', 1, () => {
            this.stopBGM();
            this.cameras.main.fadeOut(300, 0, 0, 0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.start(CONFIG.SCENE_CUTSCENE);
            });
        });
        
        this.createButton(width / 2, buttonY + buttonSpacing, 'LEADERBOARD', 0, () => {
            this.stopBGM();
            this.cameras.main.fadeOut(300, 0, 0, 0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.start(CONFIG.SCENE_STATS);
            });
        });
        
        this.createButton(width / 2, buttonY + buttonSpacing * 2, 'CREDITS', 3, () => {
            this.stopBGM();
            this.cameras.main.fadeOut(300, 0, 0, 0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.start(CONFIG.SCENE_CREDITS);
            });
        });
        
        // Version text
        this.add.text(width - 10, height - 10, 'v1.2', {
            fontFamily: '"Press Start 2P"',
            fontSize: '8px',
            color: '#ffffff',
            alpha: 0.4,
        }).setOrigin(1, 1).setDepth(2);
        
        // ============ AMBIENT DECORATIONS ============
        this.createAmbientDecorations(width, height);
        
        // ============ BGM ============
        this.playBGM('bgm_home');
    }

    createButton(x, y, label, frameIndex, callback) {
        let bg;
        if (this.textures.exists('ui_button')) {
            bg = this.add.sprite(x, y, 'ui_button', frameIndex);
            bg.setScale(3);
            bg.setTint(0xcccccc); // slightly darker when idle
        } else {
            bg = this.add.rectangle(x, y, 320, 42, 0x2a1a3e, 0.9);
            bg.setStrokeStyle(2, 0x4CAF50);
        }
        
        bg.setInteractive({ useHandCursor: true });
        bg.setDepth(4);
        
        const text = this.add.text(x, y, label, {
            fontFamily: '"Press Start 2P"',
            fontSize: '13px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3,
        });
        text.setOrigin(0.5);
        text.setDepth(4);
        
        bg.on('pointerover', () => {
            text.setColor('#FFD700');
            if (bg.type === 'Sprite') {
                bg.clearTint();
                this.tweens.add({ targets: bg, scaleX: 3.1, scaleY: 3.1, duration: 100 });
                this.tweens.add({ targets: text, scaleX: 1.05, scaleY: 1.05, duration: 100 });
            } else {
                bg.setFillStyle(0x4CAF50, 0.8);
                this.tweens.add({ targets: [bg, text], scaleX: 1.05, scaleY: 1.05, duration: 100 });
            }
        });
        
        bg.on('pointerout', () => {
            text.setColor('#ffffff');
            if (bg.type === 'Sprite') {
                bg.setTint(0xcccccc);
                this.tweens.add({ targets: bg, scaleX: 3, scaleY: 3, duration: 100 });
                this.tweens.add({ targets: text, scaleX: 1, scaleY: 1, duration: 100 });
            } else {
                bg.setFillStyle(0x2a1a3e, 0.9);
                this.tweens.add({ targets: [bg, text], scaleX: 1, scaleY: 1, duration: 100 });
            }
        });
        
        bg.on('pointerdown', callback);
        
        return { bg, text };
    }

    // ============================================
    // AMBIENT DECORATIONS
    // ============================================
    createAmbientDecorations(width, height) {
        // Spawn leaves and feathers falling slowly
        this.time.addEvent({
            delay: 2500,
            loop: true,
            callback: () => {
                const useLeaf = Phaser.Math.Between(0, 1) === 0;
                const key = useLeaf ? 'deco_leaf' : 'deco_feather';
                const animKey = useLeaf ? 'leaf_float' : 'feather_float';
                
                if (this.textures.exists(key)) {
                    const deco = this.add.sprite(
                        Phaser.Math.Between(50, width - 50),
                        -20,
                        key
                    );
                    deco.setScale(useLeaf ? 2.5 : 2);
                    deco.setAlpha(0.35);
                    deco.setDepth(1);
                    deco.play(animKey);
                    
                    this.tweens.add({
                        targets: deco,
                        y: height + 30,
                        x: deco.x + Phaser.Math.Between(-100, 100),
                        angle: Phaser.Math.Between(-180, 180),
                        duration: Phaser.Math.Between(5000, 9000),
                        ease: 'Sine.easeInOut',
                        onComplete: () => deco.destroy()
                    });
                }
            }
        });
    }

    // ============================================
    // BGM
    // ============================================
    playBGM(key) {
        try {
            this.stopBGM();
            if (this.cache.audio.exists(key)) {
                this.bgm = this.sound.add(key, { volume: 0.3, loop: true });
                this.bgm.play();
            }
        } catch (e) { /* Audio not available */ }
    }

    stopBGM() {
        if (this.bgm && this.bgm.isPlaying) {
            this.bgm.stop();
            this.bgm.destroy();
            this.bgm = null;
        }
    }
}
