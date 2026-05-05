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
        
        // Death cause
        const isMimicDeath = this.deathCause === 'mimic';
        const causeEmoji = isMimicDeath ? '📦' : '💔';
        const causeText = isMimicDeath ? 'Eaten by Mimic!' : 'Ran out of HP!';
        
        this.add.text(width / 2, 140, `${causeEmoji} ${causeText}`, {
            fontFamily: '"Press Start 2P"',
            fontSize: '14px',
            color: '#FF8C00',
            stroke: '#000000',
            strokeThickness: 2,
        }).setOrigin(0.5);
        
        // Show mimic death image if killed by mimic
        if (isMimicDeath && this.textures.exists('hit_by_mimic')) {
            const mimicImg = this.add.image(width / 2, 250, 'hit_by_mimic');
            mimicImg.setScale(0.18);
            mimicImg.setAlpha(0.9);
            
            // Subtle animation
            this.tweens.add({
                targets: mimicImg,
                scale: { from: 0.17, to: 0.19 },
                duration: 1200,
                repeat: -1,
                yoyo: true,
                ease: 'Sine.easeInOut'
            });
        }
        
        // ============ SCORE DISPLAY ============
        const panelY = isMimicDeath ? 380 : 240;
        
        // Score panel background
        const panel = this.add.rectangle(width / 2, panelY + 40, 420, 130, 0x2a1a3e, 0.9);
        panel.setStrokeStyle(2, 0x4CAF50);
        
        this.add.text(width / 2, panelY, '🍰 SCORE', {
            fontFamily: '"Press Start 2P"',
            fontSize: '14px',
            color: '#4CAF50',
        }).setOrigin(0.5);
        
        const scoreNumber = this.add.text(width / 2, panelY + 35, String(this.finalScore), {
            fontFamily: '"Press Start 2P"',
            fontSize: '36px',
            color: '#FFD700',
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
        
        this.add.text(width / 2, panelY + 75, `Cakes: ${this.cakesCollected}  |  Time: ${Math.floor(this.playTime)}s`, {
            fontFamily: '"Press Start 2P"',
            fontSize: '9px',
            color: '#aaaaaa',
        }).setOrigin(0.5);
        
        // ============ NAME INPUT ============
        const nameY = panelY + 140;
        
        this.add.text(width / 2, nameY, 'Enter your name:', {
            fontFamily: '"Press Start 2P"',
            fontSize: '11px',
            color: '#ffffff',
        }).setOrigin(0.5);
        
        // Name display text (shown in Phaser)
        const savedName = window.statsManager.getPlayerName() || 'PLAYER';
        this.playerName = savedName;
        
        this.nameDisplay = this.add.text(width / 2, nameY + 35, savedName, {
            fontFamily: '"Press Start 2P"',
            fontSize: '18px',
            color: '#FFD700',
            backgroundColor: '#2a1a3e',
            padding: { x: 16, y: 8 },
            stroke: '#4CAF50',
            strokeThickness: 2,
        });
        this.nameDisplay.setOrigin(0.5);
        this.nameDisplay.setInteractive({ useHandCursor: true });
        
        // Click to edit name
        this.nameDisplay.on('pointerdown', () => {
            this.promptName();
        });
        
        const editHint = this.add.text(width / 2, nameY + 65, '(click to change)', {
            fontFamily: '"Press Start 2P"',
            fontSize: '8px',
            color: '#888888',
        }).setOrigin(0.5);
        
        // ============ BUTTONS ============
        const btnY = height - 180;
        
        // Submit button
        this.submitBtn = this.createButton(width / 2, btnY, '📤 SUBMIT SCORE', async () => {
            if (this.submitted) return;
            await this.submitScore();
        });
        
        // Retry button
        this.createButton(width / 2, btnY + 55, '🔄 RETRY', () => {
            this.cameras.main.fadeOut(300);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.start(CONFIG.SCENE_CUTSCENE);
            });
        });
        
        // Menu button
        this.createButton(width / 2, btnY + 110, '🏠 MENU', () => {
            this.cameras.main.fadeOut(300);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.start(CONFIG.SCENE_MENU);
            });
        });
        
        // Status text for submit
        this.statusText = this.add.text(width / 2, btnY - 25, '', {
            fontFamily: '"Press Start 2P"',
            fontSize: '9px',
            color: '#4CAF50',
        });
        this.statusText.setOrigin(0.5);
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
        const bg = this.add.rectangle(x, y, 300, 40, 0x2a1a3e, 0.9);
        bg.setStrokeStyle(2, 0x4CAF50);
        bg.setInteractive({ useHandCursor: true });
        
        const text = this.add.text(x, y, label, {
            fontFamily: '"Press Start 2P"',
            fontSize: '12px',
            color: '#ffffff',
        });
        text.setOrigin(0.5);
        
        bg.on('pointerover', () => {
            bg.setFillStyle(0x4CAF50, 0.8);
            text.setColor('#FFD700');
        });
        
        bg.on('pointerout', () => {
            bg.setFillStyle(0x2a1a3e, 0.9);
            text.setColor('#ffffff');
        });
        
        bg.on('pointerdown', callback);
        
        return { bg, text };
    }
}
