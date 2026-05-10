// ============================================
// Cake Catcher — Cutscene Scene
// Video tutorial + "Ready... Go!" before gameplay
// ============================================

class CutsceneScene extends Phaser.Scene {
    constructor() {
        super({ key: CONFIG.SCENE_CUTSCENE });
    }

    create() {
        const { width, height } = this.cameras.main;
        
        this.cameras.main.setBackgroundColor(0x1a1a2e);
        this.cameras.main.fadeIn(300);
        
        this.videoEnded = false;
        
        // ============ VIDEO ============
        this.showVideoPhase(width, height);
    }

    showVideoPhase(width, height) {
        // Play cutscene video in center
        if (this.cache.video.exists('cutscene_cake')) {
            this.cutsceneVideo = this.add.video(width / 2, height / 2, 'cutscene_cake');
            this.cutsceneVideo.setDepth(1);
            
            // Scale video to fit nicely (not full screen)
            const videoScale = Math.min(
                (width * 0.7) / this.cutsceneVideo.width,
                (height * 0.5) / this.cutsceneVideo.height
            );
            this.cutsceneVideo.setScale(videoScale);
            
            this.cutsceneVideo.play(false); // play once, don't loop
            
            // When video ends
            this.cutsceneVideo.on('complete', () => {
                this.onVideoEnd(width, height);
            });
            
            // Fallback: if video doesn't fire complete event
            this.time.delayedCall(15000, () => {
                if (!this.videoEnded) {
                    this.onVideoEnd(width, height);
                }
            });
        } else {
            // No video — skip to click prompt
            this.onVideoEnd(width, height);
        }
        
        // ============ TUTORIAL TEXT (above video) ============
        const tutorialY = 60;
        
        // Dark overlay behind text for readability
        const textBg = this.add.rectangle(width / 2, tutorialY + 20, 500, 90, 0x000000, 0.5);
        textBg.setDepth(5);
        
        const line1 = this.add.text(width / 2, tutorialY, 'DRAG MOUSE TO MOVE', {
            fontFamily: '"Press Start 2P"',
            fontSize: '18px',
            color: '#ffffff',
        });
        line1.setOrigin(0.5);
        line1.setDepth(6);
        
        const line2 = this.add.text(width / 2, tutorialY + 40, 'HOLD RIGHT CLICK TO JUMP', {
            fontFamily: '"Press Start 2P"',
            fontSize: '18px',
            color: '#ffffff',
        });
        line2.setOrigin(0.5);
        line2.setDepth(6);
        
        // Subtle pulse animation on tutorial text
        this.tweens.add({
            targets: [line1, line2],
            alpha: { from: 1, to: 0.6 },
            duration: 800,
            repeat: -1,
            yoyo: true,
        });
    }

    onVideoEnd(width, height) {
        if (this.videoEnded) return;
        this.videoEnded = true;
        
        // Fade out video
        if (this.cutsceneVideo) {
            this.tweens.add({
                targets: this.cutsceneVideo,
                alpha: 0.3,
                duration: 500,
            });
        }
        
        // Show "Click to Start" prompt
        const promptY = height / 2 + 80;
        
        const clickText = this.add.text(width / 2, promptY + 20, 'Click to Start!', {
            fontFamily: '"Press Start 2P"',
            fontSize: '18px',
            color: '#FFD700',
        });
        clickText.setOrigin(0.5);
        clickText.setDepth(10);
        
        // fade text
        this.tweens.add({
            targets: clickText,
            alpha: { from: 1, to: 0.3 },
            duration: 800,
            repeat: -1,
            yoyo: true,
        });
        
        // Wait for click
        this.input.once('pointerdown', () => {
            // Remove prompt
            clickText.destroy();
            
            // Show Ready → GO!
            this.showReadyGo(width, height);
        });
    }

    showReadyGo(width, height) {
        // Fade out video completely
        if (this.cutsceneVideo) {
            this.tweens.add({
                targets: this.cutsceneVideo,
                alpha: 0,
                duration: 300,
            });
        }
        
        // "Ready?" text
        const readyText = this.add.text(width / 2, height / 2, 'Ready?', {
            fontFamily: '"Press Start 2P"',
            fontSize: '60px',
            color: '#FFD700',
            stroke: '#000000',
            strokeThickness: 4,
        });
        readyText.setOrigin(0.5);
        readyText.setScale(0);
        readyText.setAlpha(0);
        readyText.setDepth(20);
        
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
        pulse.setDepth(15);
        
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
        goText.setDepth(20);
        
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
