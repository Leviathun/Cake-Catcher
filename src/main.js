// Cake Catcher — Main Entry Point
window.statsManager = new StatsManager();
window.supabaseManager = new SupabaseManager();

const gameConfig = {
    type: Phaser.AUTO,
    width: CONFIG.GAME_WIDTH,
    height: CONFIG.GAME_HEIGHT,
    parent: 'game-container',
    pixelArt: true,
    roundPixels: true,
    antialias: false,
    physics: {
        default: 'arcade',
        arcade: { gravity: { y: CONFIG.GRAVITY }, debug: false }
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: [BootScene, MenuScene, CutsceneScene, GameScene, GameOverScene, StatsScene, CreditsScene],
    audio: { disableWebAudio: false },
    backgroundColor: '#1a1a2e',
};

const game = new Phaser.Game(gameConfig);
console.log('🎂 Cake Catcher initialized!');
