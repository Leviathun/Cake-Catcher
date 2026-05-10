// ============================================
// Cake Catcher — Credits Scene
// Scrolling credits
// ============================================

class CreditsScene extends Phaser.Scene {
    constructor() {
        super({ key: CONFIG.SCENE_CREDITS });
    }

    create() {
        const { width, height } = this.cameras.main;
        
        this.cameras.main.setBackgroundColor(0x1a1a2e);
        this.cameras.main.fadeIn(300);
        
        // ============ AMBIENT DECORATIONS ============
        this.createAmbientDecorations(width, height);
        
        // Credits content
        const credits = [
            { type: 'title', text: 'Cake Catcher' },
            { type: 'spacer' },
            { type: 'heading', text: '— PROJECT —' },
            { type: 'name', text: 'PHASER GAME PROJECT' },
            { type: 'spacer' },
            { type: 'heading', text: '— DEVELOPER —' },
            { type: 'name', text: 'Tanabadee Kraitong' },
            { type: 'spacer' },
            { type: 'heading', text: '— INSPIRATION —' },
            { type: 'name', text: 'Frieren: Beyond Journey\'s End.' },
            { type: 'spacer' },
            { type: 'heading', text: '— CHARACTER —' },
            { type: 'name', text: 'Frieren' },
            { type: 'spacer' },
            { type: 'heading', text: '— TECHNOLOGY —' },
            { type: 'name', text: 'Phaser.js 3' },
            { type: 'name', text: 'Supabase' },
            { type: 'name', text: 'Vanilla JavaScript' },
            { type: 'name', text: 'Nano Banana' },
            { type: 'spacer' },
            { type: 'heading', text: '— Music —' },
            { type: 'name', text: 'The Magic Within' },
            { type: 'name', text: 'Dragon Smasher' },
            { type: 'name', text: 'Grassy Turtles and Seed Rats' },
            { type: 'name', text: 'Music From Frieren: Beyond Journey\'s End' },    
            { type: 'spacer' },
            { type: 'heading', text: '— OBJECTIVE —' },
            { type: 'name', text: 'This project was created to learn' },
            { type: 'name', text: 'how to use Phaser.js and is not' },
            { type: 'name', text: 'intended for profit. All character' },
            { type: 'name', text: 'assets were generated using' },
            { type: 'name', text: 'Nano Banana and inspired by the' },
            { type: 'name', text: 'anime Frieren: Beyond Journey\'s End.' },
            { type: 'spacer' },
            { type: 'heading', text: '— SPECIAL THANKS —' },
            { type: 'name', text: 'Thank you for playing!' },
            { type: 'spacer' },
            { type: 'spacer' },
            { type: 'name', text: '© 2026 Cake Catcher' },
        ];
        
        // Build credit elements
        let currentY = height + 50;
        const elements = [];
        
        credits.forEach(item => {
            if (item.type === 'spacer') {
                currentY += 40;
                return;
            }
            
            let style = {};
            if (item.type === 'title') {
                style = {
                    fontFamily: '"Press Start 2P"',
                    fontSize: '32px',
                    color: '#FFD700',
                    stroke: '#000000',
                    strokeThickness: 3,
                };
            } else if (item.type === 'heading') {
                style = {
                    fontFamily: '"Press Start 2P"',
                    fontSize: '12px',
                    color: '#4CAF50',
                };
            } else {
                style = {
                    fontFamily: '"Press Start 2P"',
                    fontSize: '14px',
                    color: '#ffffff',
                };
            }
            
            const text = this.add.text(width / 2, currentY, item.text, style);
            text.setOrigin(0.5);
            elements.push(text);
            
            currentY += item.type === 'title' ? 60 : 35;
        });
        
        // Scroll animation
        // Stop scroll when the last element is fully visible (around height - 120)
        const scrollDistance = Math.max(0, currentY - (height - 180));
        const scrollDuration = scrollDistance * 25;
        
        elements.forEach(el => {
            this.tweens.add({
                targets: el,
                y: el.y - scrollDistance,
                duration: scrollDuration,
                ease: 'Linear',
                onUpdate: (tween, target) => {
                    // Fade out text as it reaches the top
                    if (target.y < 150) {
                        target.alpha = Math.max(0, (target.y - 100) / 50);
                    }
                }
            });
        });
        
        // Back button (always visible)
        let backBg;
        if (this.textures.exists('ui_tab_rank')) {
            backBg = this.add.sprite(width / 2, height - 40, 'ui_tab_rank', 0);
            backBg.setScale(3.5, 2.0); // Make it larger than the text
            backBg.setTint(0xcccccc);
            backBg.setDepth(100);
        } else {
            backBg = this.add.rectangle(width / 2, height - 40, 200, 36, 0x2a1a3e, 0.9);
            backBg.setStrokeStyle(2, 0x4CAF50);
            backBg.setDepth(100);
        }
        backBg.setInteractive({ useHandCursor: true });
        
        const backText = this.add.text(width / 2, height - 40, 'BACK', {
            fontFamily: '"Press Start 2P"',
            fontSize: '14px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3,
        });
        backText.setOrigin(0.5);
        backText.setDepth(101);
        
        backBg.on('pointerover', () => {
            if (backBg.type === 'Sprite') {
                backBg.clearTint();
                backText.setColor('#FFD700');
                this.tweens.add({ targets: backBg, scaleX: 3.7, scaleY: 2.2, duration: 100 });
                this.tweens.add({ targets: backText, scaleX: 1.1, scaleY: 1.1, duration: 100 });
            } else {
                backBg.setFillStyle(0x4CAF50, 0.8);
                backText.setColor('#FFD700');
            }
        });
        
        backBg.on('pointerout', () => {
            if (backBg.type === 'Sprite') {
                backBg.setTint(0xcccccc);
                backText.setColor('#ffffff');
                this.tweens.add({ targets: backBg, scaleX: 3.5, scaleY: 2.0, duration: 100 });
                this.tweens.add({ targets: backText, scaleX: 1, scaleY: 1, duration: 100 });
            } else {
                backBg.setFillStyle(0x2a1a3e, 0.9);
                backText.setColor('#ffffff');
            }
        });
        
        backBg.on('pointerdown', () => {
            this.stopBGM();
            this.cameras.main.fadeOut(300);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.start(CONFIG.SCENE_MENU);
            });
        });
        
        // ============ BGM ============
        this.playBGM('bgm_normal');
    }

    // ============================================
    // AMBIENT DECORATIONS
    // ============================================
    createAmbientDecorations(width, height) {
        // Spawn feathers falling slowly
        this.time.addEvent({
            delay: 3000,
            loop: true,
            callback: () => {
                if (this.textures.exists('deco_feather')) {
                    // Spawn only on left or right sides to avoid text overlap
                    const isLeft = Phaser.Math.Between(0, 1) === 0;
                    const spawnX = isLeft 
                        ? Phaser.Math.Between(50, 300) 
                        : Phaser.Math.Between(width - 300, width - 50);
                        
                    const feather = this.add.sprite(
                        spawnX,
                        -20,
                        'deco_feather'
                    );
                    feather.setScale(2);
                    feather.setAlpha(0.4);
                    feather.setDepth(0);
                    feather.play('feather_float');
                    
                    this.tweens.add({
                        targets: feather,
                        y: height + 30,
                        x: feather.x + Phaser.Math.Between(-80, 80),
                        angle: Phaser.Math.Between(-180, 180),
                        duration: Phaser.Math.Between(6000, 10000),
                        ease: 'Sine.easeInOut',
                        onComplete: () => feather.destroy()
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
