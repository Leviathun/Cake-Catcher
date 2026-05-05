// ============================================
// Cake Catcher — Game Constants
// ============================================

const CONFIG = {
    // Screen
    GAME_WIDTH: 1280,
    GAME_HEIGHT: 800,

    // Ground / Platform
    GROUND_Y: 640,
    GROUND_HEIGHT: 160,
    PLATFORM_LEFT: 80,
    PLATFORM_RIGHT: 1200,

    // Player
    PLAYER_LERP: 0.15,
    PLAYER_START_X: 640,
    PLAYER_START_Y: 580,

    // Jump
    JUMP_MIN_VELOCITY: 350,
    JUMP_MAX_VELOCITY: 600,
    JUMP_CHARGE_RATE: 18,
    GRAVITY: 900,

    // Falling Items
    CAKE_BASE_SPEED: 130,
    TOMATO_BASE_SPEED: 160,
    CAKE_SPAWN_INTERVAL: 1500,
    TOMATO_SPAWN_INTERVAL: 3500,
    ITEM_SPAWN_MARGIN: 100,

    // Mimic (ground obstacle)
    MIMIC_SPEED: 250,
    MIMIC_SPAWN_INTERVAL: 9000,

    // Bounce
    BOUNCE_UP_VELOCITY: 250,
    BOUNCE_SIDE_VELOCITY: 180,
    BOUNCE_FACTOR: 0.3,

    // Health
    INITIAL_HP: 3,
    INVINCIBLE_DURATION: 1500,

    // Scoring
    CAKE_SCORE: 1,

    // Supabase
    SUPABASE_URL: 'https://ziemwtcgxnszaxmkigum.supabase.co',
    SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppZW13dGNneG5zemF4bWtpZ3VtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc3OTM2NTEsImV4cCI6MjA5MzM2OTY1MX0.3JK1FP26gFn1qbiMZcUl58DcWAO-UsuZxryZNjw5Wiw',

    // Scene Keys
    SCENE_BOOT: 'BootScene',
    SCENE_MENU: 'MenuScene',
    SCENE_CUTSCENE: 'CutsceneScene',
    SCENE_GAME: 'GameScene',
    SCENE_GAMEOVER: 'GameOverScene',
    SCENE_STATS: 'StatsScene',
    SCENE_CREDITS: 'CreditsScene',

    // Colors
    COLOR_BG: 0x1a1a2e,
    COLOR_GREEN_FRAME: '#4CAF50',
    COLOR_PINK: 0xff6b9d,
    COLOR_CREAM: 0xfff5e6,
    COLOR_TEXT_PRIMARY: '#ffffff',
    COLOR_TEXT_SCORE: '#FFD700',
    COLOR_TEXT_DANGER: '#FF4444',
    COLOR_PASTEL_PINK: 0xFFB6C1,
    COLOR_PASTEL_GREEN: 0x98FB98,
    COLOR_PASTEL_BLUE: 0x87CEEB,
};
