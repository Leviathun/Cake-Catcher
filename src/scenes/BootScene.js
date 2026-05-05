// ============================================
// Cake Catcher — Boot Scene
// Asset loading + Loading bar
// ============================================

class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: CONFIG.SCENE_BOOT });
    }

    preload() {
        // Create loading bar
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // Background
        this.cameras.main.setBackgroundColor(0x1a1a2e);
        
        // Title text
        const titleText = this.add.text(width / 2, height / 2 - 80, '🎂 Cake Catcher', {
            fontFamily: '"Press Start 2P"',
            fontSize: '24px',
            color: '#FFD700',
        });
        titleText.setOrigin(0.5);
        
        // Loading text
        const loadingText = this.add.text(width / 2, height / 2 - 20, 'Loading...', {
            fontFamily: '"Press Start 2P"',
            fontSize: '14px',
            color: '#4CAF50',
        });
        loadingText.setOrigin(0.5);
        
        // Progress bar background
        const barBg = this.add.rectangle(width / 2, height / 2 + 30, 400, 24, 0x333333);
        barBg.setOrigin(0.5);
        
        // Progress bar fill
        const barFill = this.add.rectangle(width / 2 - 196, height / 2 + 30, 0, 18, 0x4CAF50);
        barFill.setOrigin(0, 0.5);
        
        // Percentage text
        const percentText = this.add.text(width / 2, height / 2 + 60, '0%', {
            fontFamily: '"Press Start 2P"',
            fontSize: '12px',
            color: '#ffffff',
        });
        percentText.setOrigin(0.5);
        
        // Progress events
        this.load.on('progress', (value) => {
            barFill.width = 392 * value;
            percentText.setText(Math.round(value * 100) + '%');
        });
        
        this.load.on('complete', () => {
            loadingText.setText('Ready!');
            percentText.setText('100%');
        });
        
        // ============ LOAD ASSETS ============
        
        // Background
        this.load.image('bg_ruins', 'assets/images/bg_ruins.png');
        
        // Player spritesheets
        this.load.spritesheet('idle', 'assets/images/idle.png', {
            frameWidth: 423,
            frameHeight: 416,
        });
        this.load.spritesheet('run', 'assets/images/run.png', {
            frameWidth: 424,
            frameHeight: 416,
        });
        this.load.spritesheet('home_idle', 'assets/images/home idle.png', {
            frameWidth: 351,
            frameHeight: 416,
        });
        
        // Items
        this.load.image('cake', 'assets/images/cake.png');
        this.load.image('tomato', 'assets/images/tomato.png');
        
        // Mimic spritesheet
        this.load.spritesheet('mimic', 'assets/images/mimic.png', {
            frameWidth: 351,
            frameHeight: 416,
        });
        
        // HP hearts
        this.load.image('hp', 'assets/images/hp.png');
        this.load.image('hp_loss', 'assets/images/hp loss.png');
        
        // Game Over
        this.load.image('hit_by_mimic', 'assets/images/hit by mimic.png');
        
        // Audio (will fail silently if files don't exist)
        this.load.audio('sfx_drop', 'assets/audio/sfx_drop.mp3');
        this.load.audio('sfx_hit', 'assets/audio/sfx_hit.mp3');
        this.load.audio('sfx_move', 'assets/audio/sfx_move.mp3');
        this.load.audio('sfx_mimic', 'assets/audio/sfx_cat.mp3');
        this.load.audio('sfx_catch', 'assets/audio/sfx_catch.mp3');
        this.load.audio('sfx_lose', 'assets/audio/sfx_lose.mp3');
    }

    create() {
        // Create animations from spritesheets
        this.createAnimations();
        
        // Small delay before transitioning
        this.time.delayedCall(800, () => {
            this.cameras.main.fadeOut(500, 0, 0, 0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.start(CONFIG.SCENE_MENU);
            });
        });
    }

    createAnimations() {
        // Celia idle animation
        this.anims.create({
            key: 'celia_idle',
            frames: this.anims.generateFrameNumbers('idle', { start: 0, end: 3 }),
            frameRate: 6,
            repeat: -1,
        });
        
        // Celia run animation
        this.anims.create({
            key: 'celia_run',
            frames: this.anims.generateFrameNumbers('run', { start: 0, end: 3 }),
            frameRate: 8,
            repeat: -1,
        });
        
        // Celia home/menu idle animation
        this.anims.create({
            key: 'celia_home_idle',
            frames: this.anims.generateFrameNumbers('home_idle', { start: 0, end: 5 }),
            frameRate: 6,
            repeat: -1,
        });
        
        // Mimic animation (idle → open → bite → close)
        this.anims.create({
            key: 'mimic_run',
            frames: this.anims.generateFrameNumbers('mimic', { start: 0, end: 5 }),
            frameRate: 6,
            repeat: -1,
        });
    }
}
