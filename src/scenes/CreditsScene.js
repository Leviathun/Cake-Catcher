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
        
        // Credits content
        const credits = [
            { type: 'title', text: '🎂 Cake Catcher' },
            { type: 'spacer' },
            { type: 'heading', text: '— DEVELOPMENT —' },
            { type: 'name', text: 'Student Project' },
            { type: 'spacer' },
            { type: 'heading', text: '— GAME DESIGN —' },
            { type: 'name', text: 'Cake Catcher Team' },
            { type: 'spacer' },
            { type: 'heading', text: '— CHARACTER —' },
            { type: 'name', text: 'Celia the Elf' },
            { type: 'spacer' },
            { type: 'heading', text: '— TECHNOLOGY —' },
            { type: 'name', text: 'Phaser.js 3' },
            { type: 'name', text: 'Supabase' },
            { type: 'name', text: 'JavaScript' },
            { type: 'spacer' },
            { type: 'heading', text: '— ASSETS —' },
            { type: 'name', text: 'Pixel Art Sprites' },
            { type: 'name', text: 'Sound Effects' },
            { type: 'spacer' },
            { type: 'heading', text: '— SPECIAL THANKS —' },
            { type: 'name', text: 'Thank you for playing! 🍰' },
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
        const totalHeight = currentY - height;
        const scrollDuration = totalHeight * 25;
        
        elements.forEach(el => {
            this.tweens.add({
                targets: el,
                y: el.y - totalHeight - height,
                duration: scrollDuration,
                ease: 'Linear',
            });
        });
        
        // Back button (always visible)
        const backBg = this.add.rectangle(width / 2, height - 40, 200, 36, 0x2a1a3e, 0.9);
        backBg.setStrokeStyle(2, 0x4CAF50);
        backBg.setInteractive({ useHandCursor: true });
        backBg.setDepth(100);
        
        const backText = this.add.text(width / 2, height - 40, '← BACK', {
            fontFamily: '"Press Start 2P"',
            fontSize: '12px',
            color: '#ffffff',
        });
        backText.setOrigin(0.5);
        backText.setDepth(100);
        
        backBg.on('pointerover', () => {
            backBg.setFillStyle(0x4CAF50, 0.8);
            backText.setColor('#FFD700');
        });
        backBg.on('pointerout', () => {
            backBg.setFillStyle(0x2a1a3e, 0.9);
            backText.setColor('#ffffff');
        });
        backBg.on('pointerdown', () => {
            this.cameras.main.fadeOut(300);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.start(CONFIG.SCENE_MENU);
            });
        });
    }
}
