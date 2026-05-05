// ============================================
// Cake Catcher — Cutscene Scene
// "Ready... Go!" before gameplay
// ============================================

class CutsceneScene extends Phaser.Scene {
    constructor() {
        super({ key: CONFIG.SCENE_CUTSCENE });
    }

    create() {
        const { width, height } = this.cameras.main;
        
        this.cameras.main.setBackgroundColor(0x1a1a2e);
        this.cameras.main.fadeIn(300);
        
        // Show "Ready?" text
        const readyText = this.add.text(width / 2, height / 2, 'Ready?', {
            fontFamily: '"Press Start 2P"',
            fontSize: '48px',
            color: '#FFD700',
            stroke: '#000000',
            strokeThickness: 4,
        });
        readyText.setOrigin(0.5);
        readyText.setScale(0);
        readyText.setAlpha(0);
        
        // Ready animation: zoom in
        this.tweens.add({
            targets: readyText,
            scale: 1,
            alpha: 1,
            duration: 500,
            ease: 'Back.easeOut',
            onComplete: () => {
                // Hold for a moment
                this.time.delayedCall(800, () => {
                    // Fade out Ready
                    this.tweens.add({
                        targets: readyText,
                        scale: 2,
                        alpha: 0,
                        duration: 300,
                        ease: 'Cubic.easeIn',
                        onComplete: () => {
                            readyText.destroy();
                            this.showGo(width, height);
                        }
                    });
                });
            }
        });
        
        // Pulsing background effect
        const pulse = this.add.rectangle(width / 2, height / 2, width, height, 0x4CAF50, 0);
        pulse.setDepth(-1);
        
        this.tweens.add({
            targets: pulse,
            alpha: 0.1,
            duration: 500,
            repeat: 3,
            yoyo: true,
        });
    }

    showGo(width, height) {
        // "GO!" text
        const goText = this.add.text(width / 2, height / 2, 'GO!', {
            fontFamily: '"Press Start 2P"',
            fontSize: '72px',
            color: '#4CAF50',
            stroke: '#000000',
            strokeThickness: 6,
        });
        goText.setOrigin(0.5);
        goText.setScale(0);
        
        // Flash effect
        this.cameras.main.flash(200, 76, 175, 80);
        
        // GO animation: slam in + shake
        this.tweens.add({
            targets: goText,
            scale: 1.2,
            duration: 200,
            ease: 'Back.easeOut',
            onComplete: () => {
                this.cameras.main.shake(150, 0.01);
                
                // Shrink slightly
                this.tweens.add({
                    targets: goText,
                    scale: 1,
                    duration: 100,
                    onComplete: () => {
                        // Hold briefly then transition
                        this.time.delayedCall(400, () => {
                            this.cameras.main.fadeOut(300, 0, 0, 0);
                            this.cameras.main.once('camerafadeoutcomplete', () => {
                                this.scene.start(CONFIG.SCENE_GAME);
                            });
                        });
                    }
                });
            }
        });
    }
}
