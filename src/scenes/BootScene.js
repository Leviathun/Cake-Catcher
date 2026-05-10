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
        const titleText = this.add.text(width / 2, height / 2 - 80, 'PHASER GAME PROJECT', {
            fontFamily: '"Press Start 2P"',
            fontSize: '30px',
            color: '#FFD700'
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
        this.load.image('bg', 'assets/images/bg.png');
        
        // Player spritesheets (NEW: 128x128 per frame, 6 frames = 768x128)
        this.load.spritesheet('idle', 'assets/images/charecter/idle.png', {
            frameWidth: 128,
            frameHeight: 128,
        });
        this.load.spritesheet('run', 'assets/images/charecter/run.png', {
            frameWidth: 128,
            frameHeight: 128,
        });
        this.load.spritesheet('home_idle', 'assets/images/charecter/home idle.png', {
            frameWidth: 128,
            frameHeight: 128,
        });
        
        // Items (128x128 static)
        this.load.image('cake', 'assets/images/item/cake.png');
        this.load.image('tomato', 'assets/images/item/tomato.png');
        
        // Mimic spritesheet (UNCHANGED: 2109x416, ~351x416 per frame)
        this.load.spritesheet('mimic', 'assets/images/charecter/mimic.png', {
            frameWidth: 351,
            frameHeight: 416,
        });
        
        // HP hearts (128x128 static)
        this.load.image('hp', 'assets/images/item/HP.png');
        this.load.image('hp_loss', 'assets/images/item/HP loss.png');
        
        // Game Over images
        this.load.image('hit_by_mimic', 'assets/images/UI/hit by mimic.png');
        this.load.image('loss_by_tomato', 'assets/images/UI/loss by tomato.png');
        
        // ============ UI ASSETS ============
        this.load.spritesheet('ui_button', 'assets/images/UI/main button-Sheet.png', {
            frameWidth: 96,
            frameHeight: 22,
        });
        this.load.spritesheet('ui_button_small', 'assets/images/UI/small button-Sheet.png', {
            frameWidth: 96,
            frameHeight: 22,
        });
        this.load.image('ui_header_a', 'assets/images/UI/HeaderA-Sheet.png');
        this.load.image('ui_header_b', 'assets/images/UI/HeaderB-Sheet.png');
        this.load.image('ui_slices_gameover', 'assets/images/UI/Slices game over -Sheet.png');
        this.load.image('ui_slices_home', 'assets/images/UI/Slices home -Sheet.png');
        this.load.image('ui_horizontal_leaf', 'assets/images/UI/horizontal C leaf-Sheet.png');
        this.load.spritesheet('ui_tab_rank', 'assets/images/UI/Tab rank number -Sheet.png', {
            frameWidth: 63,
            frameHeight: 32,
        });
        this.load.image('ui_bar_rank_a', 'assets/images/UI/bar rank A-Sheet.png');
        this.load.image('ui_bar_rank_b', 'assets/images/UI/bar rank B-Sheet.png');
        this.load.image('ui_bar_rank_c', 'assets/images/UI/bar rank C-Sheet.png');
        this.load.image('ui_compass', 'assets/images/UI/compass score -Sheet.png');
        this.load.image('ui_rank_table_a', 'assets/images/UI/rank A table.png');
        this.load.image('ui_rank_table_b', 'assets/images/UI/rank B table.png');
        this.load.image('ui_rank_table_c', 'assets/images/UI/rank C table.png');
        
        // ============ DECORATIONS ============
        this.load.spritesheet('deco_leaf', 'assets/images/UI/Small leaf -Sheet.png', {
            frameWidth: 17,
            frameHeight: 17,
        });
        this.load.spritesheet('deco_feather', 'assets/images/UI/feather -Sheet.png', {
            frameWidth: 23,
            frameHeight: 23,
        });
        
        // ============ CUTSCENE VIDEO ============
        this.load.video('cutscene_cake', 'assets/audio/Cut sene eating cake.mp4');
        
        // ============ AUDIO — SFX ============
        this.load.audio('sfx_eat_cake', 'assets/audio/eat-cake.m4a');
        this.load.audio('sfx_jump', 'assets/audio/jump.m4a');
        this.load.audio('sfx_run', 'assets/audio/run.m4a');
        this.load.audio('sfx_loss', 'assets/audio/loss.m4a');
        this.load.audio('sfx_crying', 'assets/audio/Frieren crying.m4a');
        
        // ============ AUDIO — BGM ============
        this.load.audio('bgm_home', 'assets/audio/home bgm.mp3');
        this.load.audio('bgm_game', 'assets/audio/game bgm.mp3');
        this.load.audio('bgm_normal', 'assets/audio/normal bgm.mp3');
    }

    create() {
        // Create animations from spritesheets
        this.createAnimations();
        
        const { width, height } = this.cameras.main;
        
        const startText = this.add.text(width / 2, height / 2 + 160, 'Click to Start', {
            fontFamily: '"Press Start 2P"',
            fontSize: '16px',
            color: '#FFD700',
        });
        startText.setOrigin(0.5);
        
        this.tweens.add({
            targets: startText,
            alpha: { from: 1, to: 0.3 },
            duration: 800,
            yoyo: true,
            repeat: -1
        });
        
        // Wait for click to unlock audio context
        this.input.once('pointerdown', () => {
            startText.destroy();
            this.cameras.main.fadeOut(500, 0, 0, 0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.start(CONFIG.SCENE_MENU);
            });
        });
    }

    createAnimations() {
        // Celia idle animation (6 frames)
        this.anims.create({
            key: 'celia_idle',
            frames: this.anims.generateFrameNumbers('idle', { start: 0, end: 5 }),
            frameRate: 6,
            repeat: -1,
        });
        
        // Celia run animation (6 frames)
        this.anims.create({
            key: 'celia_run',
            frames: this.anims.generateFrameNumbers('run', { start: 0, end: 5 }),
            frameRate: 8,
            repeat: -1,
        });
        
        // Celia home idle animation (6 frames)
        this.anims.create({
            key: 'celia_home_idle',
            frames: this.anims.generateFrameNumbers('home_idle', { start: 0, end: 5 }),
            frameRate: 6,
            repeat: -1,
        });
        
        // Mimic animation (6 frames )
        this.anims.create({
            key: 'mimic_run',
            frames: this.anims.generateFrameNumbers('mimic', { start: 0, end: 5 }),
            frameRate: 6,
            repeat: -1,
        });
        
        // Decoration animations
        this.anims.create({
            key: 'leaf_float',
            frames: this.anims.generateFrameNumbers('deco_leaf', { start: 0, end: 3 }),
            frameRate: 4,
            repeat: -1,
        });
        
        this.anims.create({
            key: 'feather_float',
            frames: this.anims.generateFrameNumbers('deco_feather', { start: 0, end: 3 }),
            frameRate: 4,
            repeat: -1,
        });
    }
}
