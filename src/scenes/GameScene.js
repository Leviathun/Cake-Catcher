// ============================================
// Cake Catcher — Game Scene
// Core gameplay with all mechanics
// ============================================

class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: CONFIG.SCENE_GAME });
    }

    init() {
        this.score = 0;
        this.cakesCollected = 0;
        this.gameStartTime = 0;
        this.isGameOver = false;
        this.deathCause = 'hp';
    }

    create() {
        const { width, height } = this.cameras.main;
        
        this.cameras.main.fadeIn(300);
        
        // ============ BACKGROUND ============
        if (this.textures.exists('bg')) {
            this.bgImage = this.add.image(width / 2, height / 2, 'bg');
            this.bgImage.setDisplaySize(width, height);
            this.bgImage.setDepth(0);
        } else {
            this.cameras.main.setBackgroundColor(0x87CEEB);
        }
        
        // ============ GROUND ============
        // Semi-transparent ground overlay to darken the stone floor area
        const groundOverlay = this.add.rectangle(
            width / 2, CONFIG.GROUND_Y + CONFIG.GROUND_HEIGHT / 2,
            width, CONFIG.GROUND_HEIGHT,
            0x3a2a1a, 0.3
        );
        groundOverlay.setDepth(2);
        
        // Ground line (subtle stone edge)
        const groundLine = this.add.rectangle(
            width / 2, CONFIG.GROUND_Y,
            width, 3, 0x8B7355, 0.6
        );
        groundLine.setDepth(2);
        
        // Physics ground (thick invisible collider to prevent tunneling)
        this.ground = this.physics.add.staticGroup();
        const groundBody = this.add.rectangle(width / 2, CONFIG.GROUND_Y + 100, width, 200, 0x000000, 0);
        this.ground.add(groundBody);
        groundBody.body.updateFromGameObject();
        
        // ============ PLAYER ============
        this.player = new Player(this, CONFIG.PLAYER_START_X, CONFIG.PLAYER_START_Y);
        this.physics.add.collider(this.player, this.ground);
        
        // ============ ITEM GROUPS ============
        this.cakeGroup = this.physics.add.group({ runChildUpdate: true });
        this.tomatoGroup = this.physics.add.group({ runChildUpdate: true });
        this.mimicGroup = this.physics.add.group({ runChildUpdate: true });
        
        // ============ COLLISIONS ============
        // Player catches cake
        this.physics.add.overlap(this.player, this.cakeGroup, this.onCatchCake, null, this);
        
        // Player hit by tomato
        this.physics.add.overlap(this.player, this.tomatoGroup, this.onHitTomato, null, this);
        
        // Player hit by mimic
        this.physics.add.overlap(this.player, this.mimicGroup, this.onHitMimic, null, this);
        
        // ============ INPUT ============
        this.input.on('pointermove', (pointer) => {
            if (!this.isGameOver) {
                this.player.followMouse(pointer.x);
            }
        });
        
        this.input.on('pointerdown', () => {
            if (!this.isGameOver) {
                this.player.startJumpCharge();
            }
        });
        
        this.input.on('pointerup', () => {
            if (!this.isGameOver) {
                this.player.releaseJump();
            }
        });
        
        // ============ UI ============
        this.createUI();
        
        // ============ DIFFICULTY ============
        this.difficultyManager = new DifficultyManager();
        
        // ============ SPAWNERS ============
        this.setupSpawners();
        
        // ============ GAME TIMER ============
        this.gameStartTime = this.time.now;
        
        // ============ BGM ============
        this.playBGM('bgm_game');
    }

    // ============================================
    // UI
    // ============================================
    createUI() {
        const uiDepth = 100;
        
        // HP Display (pixel art hearts)
        this.hearts = [];
        for (let i = 0; i < CONFIG.INITIAL_HP; i++) {
            const heart = this.add.image(35 + i * 45, 30, 'hp');
            heart.setScale(0.4);
            heart.setDepth(uiDepth);
            this.hearts.push(heart);
        }
        
        // Score display
        const cakeIcon = this.add.image(30, 80, 'cake');
        cakeIcon.setScale(0.4);
        cakeIcon.setDepth(uiDepth);
        
        this.scoreText = this.add.text(60, 65, 'x 0', {
            fontFamily: '"Press Start 2P"',
            fontSize: '18px',
            color: '#FFD700',
            stroke: '#000000',
            strokeThickness: 3,
        });
        this.scoreText.setDepth(uiDepth);
        
        // Difficulty label
        const diffX = CONFIG.GAME_WIDTH - 60;
        const diffY = 30;
        
        if (this.textures.exists('ui_tab_rank')) {
            this.diffBg = this.add.sprite(diffX, diffY, 'ui_tab_rank', 0);
            this.diffBg.setDisplaySize(120, 40);
            this.diffBg.setDepth(uiDepth - 1);
            this.diffBg.setTint(0xcccccc);
        }

        this.diffLabel = this.add.text(diffX, diffY, 'Easy', {
            fontFamily: '"Press Start 2P"',
            fontSize: '15px',
            color: '#4CAF50',
            stroke: '#000000',
            strokeThickness: 2,
        });
        this.diffLabel.setOrigin(0.5);
        this.diffLabel.setDepth(uiDepth);
    }

    updateHeartsUI() {
        for (let i = 0; i < this.hearts.length; i++) {
            if (i < this.player.hp) {
                this.hearts[i].setTexture('hp');
                this.hearts[i].setAlpha(1);
            } else {
                this.hearts[i].setTexture('hp_loss');
                this.hearts[i].setAlpha(0.7);
            }
        }
        
        // Shake last heart when HP = 1
        if (this.player.hp === 1) {
            this.tweens.add({
                targets: this.hearts[0],
                scale: { from: 0.4, to: 0.5 },
                duration: 300,
                repeat: -1,
                yoyo: true,
            });
        }
    }

    showScorePop(x, y) {
        const pop = this.add.text(x, y - 20, '+1', {
            fontFamily: '"Press Start 2P"',
            fontSize: '16px',
            color: '#FFD700',
            stroke: '#000000',
            strokeThickness: 2,
        });
        pop.setOrigin(0.5);
        pop.setDepth(101);
        
        this.tweens.add({
            targets: pop,
            y: y - 60,
            alpha: 0,
            scale: 1.5,
            duration: 600,
            ease: 'Cubic.easeOut',
            onComplete: () => pop.destroy()
        });
    }

    // ============================================
    // SPAWNERS
    // ============================================
    setupSpawners() {
        const params = this.difficultyManager.getParams();
        
        // Cake spawner
        this.cakeTimer = this.time.addEvent({
            delay: params.cakeInterval,
            loop: true,
            callback: this.spawnCake,
            callbackScope: this,
        });
        
        // Tomato spawner
        this.tomatoTimer = this.time.addEvent({
            delay: params.tomatoInterval,
            loop: true,
            callback: this.spawnTomato,
            callbackScope: this,
        });
        
        // Mimic spawner
        this.mimicTimer = this.time.addEvent({
            delay: params.mimicInterval,
            loop: true,
            callback: this.spawnMimic,
            callbackScope: this,
        });
    }

    updateSpawnerTimers() {
        const params = this.difficultyManager.getParams();
        
        this.cakeTimer.delay = params.cakeInterval;
        this.tomatoTimer.delay = params.tomatoInterval;
        this.mimicTimer.delay = params.mimicInterval;
        
        // Update difficulty label
        this.diffLabel.setText(params.label);
        
        // Flash label
        const colors = ['#4CAF50', '#FFD700', '#FF8C00', '#FF4444', '#FF0000'];
        this.diffLabel.setColor(colors[this.difficultyManager.currentLevel] || '#FF0000');
    }

    spawnCake() {
        if (this.isGameOver) return;
        
        const x = Phaser.Math.Between(
            CONFIG.ITEM_SPAWN_MARGIN,
            CONFIG.GAME_WIDTH - CONFIG.ITEM_SPAWN_MARGIN
        );
        
        const cake = new Cake(this, x);
        this.cakeGroup.add(cake);
        
        // Set velocity AFTER adding to group (group.add can reset body)
        cake.body.setAllowGravity(false);
        cake.setFallSpeed(this.difficultyManager.getCakeSpeed());
    }

    spawnTomato() {
        if (this.isGameOver) return;
        
        const x = Phaser.Math.Between(
            CONFIG.ITEM_SPAWN_MARGIN,
            CONFIG.GAME_WIDTH - CONFIG.ITEM_SPAWN_MARGIN
        );
        
        const tomato = new Tomato(this, x);
        this.tomatoGroup.add(tomato);
        
        // Set velocity AFTER adding to group (group.add can reset body)
        tomato.body.setAllowGravity(false);
        tomato.setFallSpeed(this.difficultyManager.getTomatoSpeed());
    }

    spawnMimic() {
        if (this.isGameOver) return;
        
        const fromLeft = Phaser.Math.Between(0, 1) === 1;
        const mimic = new Mimic(this, fromLeft);
        this.mimicGroup.add(mimic);
        
        // Set velocity AFTER adding to group (group.add can reset body)
        mimic.body.setAllowGravity(false);
        mimic.setSpeed(this.difficultyManager.getMimicSpeed());
    }

    // ============================================
    // COLLISIONS
    // ============================================
    onCatchCake(player, cake) {
        if (this.isGameOver || cake.hasBeenCaught || cake.isBouncing) return;
        
        this.score += CONFIG.CAKE_SCORE;
        this.cakesCollected++;
        
        // Update score display
        this.scoreText.setText('x ' + this.score);
        
        // Score pop animation
        this.showScorePop(cake.x, cake.y);
        
        // Bounce score text
        this.tweens.add({
            targets: this.scoreText,
            scale: { from: 1.3, to: 1 },
            duration: 200,
            ease: 'Back.easeOut'
        });
        
        // Play catch sound
        this.playSound('sfx_eat_cake', 0.5);
        
        // Remove cake
        cake.onCaught(this);
        
        // Check difficulty
        const levelChanged = this.difficultyManager.update(this.score);
        if (levelChanged) {
            this.updateSpawnerTimers();
            this.showLevelUp();
        }
    }

    onHitTomato(player, tomato) {
        if (this.isGameOver || tomato.hasHitPlayer || tomato.isBouncing) return;
        if (player.isInvincible) return;
        
        // Play hit sound
        this.playSound('sfx_crying', 0.6);
        
        // Damage player
        const isDead = player.takeDamage();
        this.updateHeartsUI();
        
        // Remove tomato
        tomato.onHitPlayer(this);
        
        if (isDead) {
            this.deathCause = 'hp';
            this.gameOver();
        }
    }

    onHitMimic(player, mimic) {
        if (this.isGameOver) return;
        if (!player.body.blocked.down) {
            // Player is in the air - they jumped over the mimic!
            return;
        }
        
        this.deathCause = 'mimic';
        player.instantDeath();
        this.gameOver();
    }

    // ============================================
    // GROUND BOUNCE CHECK
    // ============================================
    checkGroundBounce() {
        // Check cakes hitting ground
        this.cakeGroup.getChildren().forEach(cake => {
            if (!cake.isBouncing && !cake.hasBeenCaught && cake.y >= CONFIG.GROUND_Y - 20) {
                cake.startBounce();
            }
        });
        
        // Check tomatoes hitting ground
        this.tomatoGroup.getChildren().forEach(tomato => {
            if (!tomato.isBouncing && !tomato.hasHitPlayer && tomato.y >= CONFIG.GROUND_Y - 20) {
                tomato.startBounce();
            }
        });
    }

    // ============================================
    // GAME OVER
    // ============================================
    gameOver() {
        if (this.isGameOver) return;
        this.isGameOver = true;
        
        // Stop spawners
        this.cakeTimer.remove();
        this.tomatoTimer.remove();
        this.mimicTimer.remove();
        
        // Play lose sound based on death cause
        if (this.deathCause === 'mimic') {
            this.playSound('sfx_loss', 0.7);
        } else {
            this.playSound('sfx_crying', 0.7);
        }
        
        // Stop BGM
        this.stopBGM();
        
        // Calculate play time
        const playTime = (this.time.now - this.gameStartTime) / 1000;
        
        // Dramatic pause then transition
        this.time.delayedCall(1500, () => {
            this.cameras.main.fadeOut(500, 0, 0, 0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.start(CONFIG.SCENE_GAMEOVER, {
                    score: this.score,
                    cakesCollected: this.cakesCollected,
                    deathCause: this.deathCause,
                    playTime: playTime,
                });
            });
        });
    }

    showLevelUp() {
        const text = this.add.text(
            CONFIG.GAME_WIDTH / 2,
            CONFIG.GAME_HEIGHT / 2 - 50,
            '⬆ LEVEL UP! ⬆',
            {
                fontFamily: '"Press Start 2P"',
                fontSize: '20px',
                color: '#FFD700',
                stroke: '#000000',
                strokeThickness: 3,
            }
        );
        text.setOrigin(0.5);
        text.setDepth(102);
        
        this.tweens.add({
            targets: text,
            y: text.y - 50,
            alpha: 0,
            scale: 1.5,
            duration: 1500,
            ease: 'Cubic.easeOut',
            onComplete: () => text.destroy()
        });
    }

    // ============================================
    // AUDIO HELPER
    // ============================================
    playSound(key, volume = 0.5) {
        try {
            if (this.sound.get(key) || this.cache.audio.exists(key)) {
                this.sound.play(key, { volume });
            }
        } catch (e) {
            // Audio not loaded — ignore
        }
    }

    /**
     * Play background music with loop
     */
    playBGM(key) {
        try {
            // Stop any existing BGM
            this.stopBGM();
            if (this.cache.audio.exists(key)) {
                this.bgm = this.sound.add(key, { volume: 0.3, loop: true });
                this.bgm.play();
            }
        } catch (e) {
            // Audio not available
        }
    }

    /**
     * Stop current BGM
     */
    stopBGM() {
        if (this.bgm && this.bgm.isPlaying) {
            this.bgm.stop();
            this.bgm.destroy();
            this.bgm = null;
        }
    }

    // ============================================
    // UPDATE LOOP
    // ============================================
    update(time, delta) {
        if (this.isGameOver) return;
        
        // Update player
        this.player.update(time, delta);
        
        // Check ground bounce for falling items
        this.checkGroundBounce();
    }
}
