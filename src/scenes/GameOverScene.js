// ============================================
// Cake Catcher — Game Over Scene
// Score display + Name input + Submit
// ============================================

class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: CONFIG.SCENE_GAMEOVER });
    }

    init(data) {
        this.finalScore = data.score || 0;
        this.cakesCollected = data.cakesCollected || 0;
        this.deathCause = data.deathCause || 'hp';
        this.playTime = data.playTime || 0;
        this.submitted = false;
    }

    create() {
        const { width, height } = this.cameras.main;
        
        this.cameras.main.setBackgroundColor(0x1a1a2e);
        this.cameras.main.fadeIn(500);
        
        // Save to local stats
        if (!window.statsManager) window.statsManager = new StatsManager();
        window.statsManager.saveGame(
            this.finalScore,
            this.cakesCollected,
            this.playTime,
            this.deathCause
        );
        
        // ============ GAME OVER TEXT ============
        const gameOverText = this.add.text(width / 2, 80, 'GAME OVER', {
            fontFamily: '"Press Start 2P"',
            fontSize: '40px',
            color: '#FF4444',
            stroke: '#000000',
            strokeThickness: 4,
        });
        gameOverText.setOrigin(0.5);
        
        // Pulse animation
        this.tweens.add({
            targets: gameOverText,
            scale: { from: 0.8, to: 1.05 },
            duration: 800,
            repeat: -1,
            yoyo: true,
            ease: 'Sine.easeInOut'
        });
        
        // ============ LEFT COLUMN: VISUALS ============
        const leftX = width * 0.3;
        
        // Death cause
        const isMimicDeath = this.deathCause === 'mimic';
        const causeText = isMimicDeath ? 'It\'s so dark. I\'m scared. It\'s dark.' : 'Frieren-sama, don\'t be so picky!\nNo, I want to eat cake.';
        
        this.add.text(leftX, 550, causeText, {
            fontFamily: '"Press Start 2P"',
            fontSize: '16px',
            color: '#FF8C00',
            stroke: '#000000',
            strokeThickness: 2,
            padding: { top: 4, bottom: 4 }
        }).setOrigin(0.5);
        
        // Show death image
        if (isMimicDeath && this.textures.exists('hit_by_mimic')) {
            const mimicImg = this.add.image(leftX, 350, 'hit_by_mimic');
            mimicImg.setScale(0.35);
            mimicImg.setAlpha(0.95);
            
            this.tweens.add({
                targets: mimicImg,
                scale: { from: 0.33, to: 0.37 },
                duration: 1200,
                repeat: -1,
                yoyo: true,
                ease: 'Sine.easeInOut'
            });
        } else if (!isMimicDeath && this.textures.exists('loss_by_tomato')) {
            const tomatoImg = this.add.image(leftX, 350, 'loss_by_tomato');
            tomatoImg.setScale(2.5);
            tomatoImg.setAlpha(0.95);
            
            this.tweens.add({
                targets: tomatoImg,
                scale: { from: 2.3, to: 2.7 },
                duration: 1200,
                repeat: -1,
                yoyo: true,
                ease: 'Sine.easeInOut'
            });
        }
        
        // ============ RIGHT COLUMN: STATS & ACTIONS ============
        const rightX = width * 0.72;
        const panelY = 380; // Center of the right panel
        
        // Score panel background
        if (this.textures.exists('ui_slices_gameover')) {
            const panel = this.add.image(rightX, panelY + 20, 'ui_slices_gameover');
            panel.setDisplaySize(420, 560);
            panel.setDepth(0);
        } else {
            const panel = this.add.rectangle(rightX, panelY + 20, 420, 560, 0x2a1a3e, 0.9);
            panel.setStrokeStyle(2, 0x4CAF50);
        }
        
        // Score Compass
        let compassY = panelY - 140;
        if (this.textures.exists('ui_compass')) {
            const compass = this.add.image(rightX, compassY, 'ui_compass');
            compass.setScale(1.5);
        }
        
        this.add.text(rightX, compassY - 70, 'SCORE', {
            fontFamily: '"Press Start 2P"',
            fontSize: '14px',
            color: '#FFD700',
            stroke: '#000000',
            strokeThickness: 2,
        }).setOrigin(0.5);
        
        const scoreNumber = this.add.text(rightX, compassY + 5, String(this.finalScore), {
            fontFamily: '"Press Start 2P"',
            fontSize: '32px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3,
        });
        scoreNumber.setOrigin(0.5);
        
        // Animate score counting up
        let displayScore = { val: 0 };
        this.tweens.add({
            targets: displayScore,
            val: this.finalScore,
            duration: 1000,
            ease: 'Cubic.easeOut',
            onUpdate: () => {
                scoreNumber.setText(Math.floor(displayScore.val));
            }
        });
        
        // Cakes & Time
        this.add.text(rightX, compassY + 70, `Cakes: ${this.cakesCollected}  |  Time: ${Math.floor(this.playTime)}s`, {
            fontFamily: '"Press Start 2P"',
            fontSize: '10px',
            color: '#dddddd',
        }).setOrigin(0.5);
        
        // ============ NAME INPUT ============
        const nameY = compassY + 130;
        
        this.add.text(rightX, nameY, 'Enter your name:', {
            fontFamily: '"Press Start 2P"',
            fontSize: '11px',
            color: '#ffffff',
        }).setOrigin(0.5);
        
        // Name display text
        const savedName = window.statsManager.getPlayerName() || 'PLAYER';
        this.playerName = savedName;
        
        if (this.textures.exists('ui_tab_rank')) {
            const nameBg = this.add.sprite(rightX, nameY + 35, 'ui_tab_rank', 0);
            nameBg.setDisplaySize(200, 45);
            nameBg.setTint(0xcccccc);
            nameBg.setInteractive({ useHandCursor: true });
            nameBg.on('pointerdown', () => this.promptName());
        }
        
        this.nameDisplay = this.add.text(rightX, nameY + 38, savedName, {
            fontFamily: '"Press Start 2P"',
            fontSize: '16px',
            color: '#8B4513',
            stroke: '#ffffff',
            strokeThickness: 2,
        });
        this.nameDisplay.setOrigin(0.5);
        this.nameDisplay.setInteractive({ useHandCursor: true });
        this.nameDisplay.on('pointerdown', () => this.promptName());
        
        const editHint = this.add.text(rightX, nameY + 65, '(click to change)', {
            fontFamily: '"Press Start 2P"',
            fontSize: '8px',
            color: '#aaaaaa',
        }).setOrigin(0.5);
        
        // ============ BUTTONS ============
        const btnY = nameY + 110;
        
        // Submit button
        this.submitBtn = this.createButton(rightX, btnY, 'SUBMIT SCORE', async () => {
            if (this.submitted) return;
            await this.submitScore();
        });
        
        // Retry button
        this.createButton(rightX, btnY + 55, 'RETRY', () => {
            this.stopBGM();
            this.cameras.main.fadeOut(300);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.start(CONFIG.SCENE_CUTSCENE);
            });
        });
        
        // Menu button
        this.createButton(rightX, btnY + 110, 'MENU', () => {
            this.stopBGM();
            this.cameras.main.fadeOut(300);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.start(CONFIG.SCENE_MENU);
            });
        });
        
        // Status text for submit (Between Cakes/Time and Name Input)
        this.statusText = this.add.text(rightX, compassY + 100, '', {
            fontFamily: '"Press Start 2P", "Segoe UI Emoji", "Apple Color Emoji"',
            fontSize: '10px',
            color: '#4CAF50',
            padding: { top: 4, bottom: 4 }
        });
        this.statusText.setOrigin(0.5);
        
        // ============ BGM ============
        this.playBGM('bgm_normal');
    }

    promptName() {
        const name = prompt('Enter your name (max 12 chars):', this.playerName);
        if (name && name.trim()) {
            this.playerName = name.trim().substring(0, 12).toUpperCase();
            this.nameDisplay.setText(this.playerName);
            window.statsManager.setPlayerName(this.playerName);
        }
    }

    async submitScore() {
        this.submitted = true;
        this.statusText.setText('Submitting...');
        this.statusText.setColor('#FFD700');
        
        // Save name
        window.statsManager.setPlayerName(this.playerName);
        
        // Submit to Supabase
        if (!window.supabaseManager) window.supabaseManager = new SupabaseManager();
        
        const result = await window.supabaseManager.submitScore(
            this.playerName,
            this.finalScore,
            this.cakesCollected,
            this.deathCause
        );
        
        if (result.success) {
            this.statusText.setText('✅ Score submitted!');
            this.statusText.setColor('#4CAF50');
            
            // Get rank
            const rank = await window.supabaseManager.getPlayerRank(this.finalScore);
            if (rank.rank !== '?') {
                this.statusText.setText(`✅ Submitted! Rank #${rank.rank}`);
            }
        } else {
            this.statusText.setText('⚠ Offline — saved locally');
            this.statusText.setColor('#FF8C00');
            this.submitted = false;
        }
    }

    createButton(x, y, label, callback) {
        let bg;
        if (this.textures.exists('ui_button')) {
            bg = this.add.sprite(x, y, 'ui_button', 0);
            bg.setScale(3, 2.2); // Reduced height
        } else {
            bg = this.add.rectangle(x, y, 280, 44, 0x2a1a3e, 0.9);
            bg.setStrokeStyle(2, 0x4CAF50);
        }
        bg.setInteractive({ useHandCursor: true });
        
        const text = this.add.text(x, y, label, {
            fontFamily: '"Press Start 2P", "Segoe UI Emoji", "Apple Color Emoji"',
            fontSize: '12px',
            color: '#ffffff',
            padding: { top: 4, bottom: 4 }
        });
        text.setOrigin(0.5);
        
        bg.on('pointerover', () => {
            text.setColor('#FFD700');
            if (bg.type === 'Sprite') {
                bg.clearTint();
                this.tweens.add({ targets: bg, scaleX: 3.1, scaleY: 2.3, duration: 100 });
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
                this.tweens.add({ targets: bg, scaleX: 3, scaleY: 2.2, duration: 100 });
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
