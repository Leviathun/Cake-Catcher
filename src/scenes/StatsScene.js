// ============================================
// Cake Catcher — Stats Scene (Leaderboard)
// Online Top 10 + Personal Stats
// ============================================

class StatsScene extends Phaser.Scene {
    constructor() {
        super({ key: CONFIG.SCENE_STATS });
    }

    create() {
        const { width, height } = this.cameras.main;
        
        this.cameras.main.setBackgroundColor(0x1a1a2e);
        this.cameras.main.fadeIn(300);
        
        // Title
        let headerBg;
        if (this.textures.exists('ui_header_b')) {
            headerBg = this.add.image(width / 2, 70, 'ui_header_b');
            headerBg.setDisplaySize(700, 80);
            headerBg.setDepth(1);
        }
        
        this.add.text(width / 2, 70, 'LEADERBOARD', {
            fontFamily: '"Press Start 2P"',
            fontSize: '20px',
            color: '#8B4513',
            stroke: '#ffffff',
            strokeThickness: 3,
        }).setOrigin(0.5).setDepth(2);
        
        // ============ TABS ============
        this.activeTab = 'online';
        
        this.tabOnline = this.createTab(width / 2 - 120, 150, '🌐', 'ONLINE', 'online');
        this.tabLocal = this.createTab(width / 2 + 120, 150, '📊', 'MY STATS', 'local');
        
        // Content container Y
        this.contentY = 220;
        this.contentGroup = this.add.group();
        
        // Show online tab by default
        this.showOnlineTab();
        
        // Back button
        this.createBackButton(width / 2, height - 50);
        
        // ============ BGM ============
        this.playBGM('bgm_normal');
    }

    createTab(x, y, icon, label, tabId) {
        let bg;
        if (this.textures.exists('ui_button')) {
            bg = this.add.sprite(x, y, 'ui_button', 0);
            bg.setDisplaySize(200, 50);
            if (tabId !== 'online') bg.setTint(0x888888);
        } else {
            bg = this.add.rectangle(x, y, 200, 30, 
                tabId === 'online' ? 0x4CAF50 : 0x333333, 0.8);
            bg.setStrokeStyle(1, 0x4CAF50);
        }
        bg.setInteractive({ useHandCursor: true });
        
        const iconObj = this.add.text(x - 45, y, icon, {
            fontFamily: '"Segoe UI Emoji", "Apple Color Emoji", "Press Start 2P"',
            fontSize: '18px', // ทำให้อิโมจิใหญ่ขึ้น
            color: tabId === 'online' ? '#ffffff' : '#888888',
            padding: { top: 8, bottom: 8 }
        });
        iconObj.setOrigin(0.5);
        iconObj.setY(y - 2); // ขยับตำแหน่งแกน Y ให้ตรงบรรทัด
        
        const textObj = this.add.text(x - 20, y, label, {
            fontFamily: '"Press Start 2P"',
            fontSize: '10px',
            color: tabId === 'online' ? '#ffffff' : '#888888',
            padding: { top: 8, bottom: 8 }
        });
        textObj.setOrigin(0, 0.5);
        
        bg.on('pointerdown', () => {
            this.switchTab(tabId);
        });
        
        return { bg, icon: iconObj, text: textObj, tabId };
    }

    switchTab(tabId) {
        this.activeTab = tabId;
        
        // Update tab visuals
        const isOnline = tabId === 'online';
        if (this.tabOnline.bg.type === 'Sprite') {
            this.tabOnline.bg.clearTint();
            if (!isOnline) this.tabOnline.bg.setTint(0x888888);
            this.tabLocal.bg.clearTint();
            if (isOnline) this.tabLocal.bg.setTint(0x888888);
        } else {
            this.tabOnline.bg.setFillStyle(isOnline ? 0x4CAF50 : 0x333333, 0.8);
            this.tabLocal.bg.setFillStyle(!isOnline ? 0x4CAF50 : 0x333333, 0.8);
        }
        this.tabOnline.icon.setColor(isOnline ? '#ffffff' : '#888888');
        this.tabOnline.text.setColor(isOnline ? '#ffffff' : '#888888');
        this.tabLocal.icon.setColor(!isOnline ? '#ffffff' : '#888888');
        this.tabLocal.text.setColor(!isOnline ? '#ffffff' : '#888888');
        
        // Clear content
        this.contentGroup.clear(true, true);
        
        if (tabId === 'online') {
            this.showOnlineTab();
        } else {
            this.showLocalTab();
        }
    }

    async showOnlineTab() {
        const { width } = this.cameras.main;
        const startY = this.contentY + 20;
        
        // Loading text
        const loading = this.add.text(width / 2, startY + 200, 'Loading...', {
            fontFamily: '"Press Start 2P"',
            fontSize: '12px',
            color: '#4CAF50',
        });
        loading.setOrigin(0.5);
        this.contentGroup.add(loading);
        
        // Fetch from Supabase
        if (!window.supabaseManager) window.supabaseManager = new SupabaseManager();
        const result = await window.supabaseManager.getTopScores(10);
        
        loading.destroy();
        
        if (!result.success || result.data.length === 0) {
            const msg = result.error === 'offline' 
                ? '⚠ Offline — cannot load leaderboard'
                : '📭 No scores yet. Be the first!';
            
            const noData = this.add.text(width / 2, startY + 200, msg, {
                fontFamily: '"Press Start 2P"',
                fontSize: '10px',
                color: '#FF8C00',
                align: 'center',
                wordWrap: { width: 500 }
            });
            noData.setOrigin(0.5);
            this.contentGroup.add(noData);
            return;
        }
        
        // Table background
        if (this.textures.exists('ui_slices_gameover')) {
            const tableBg = this.add.image(width / 2, startY + 200, 'ui_slices_gameover');
            tableBg.setDisplaySize(900, 500);
            tableBg.setDepth(0);
            this.contentGroup.add(tableBg);
        }
        
        // Table header
        const headerY = startY + 10;
        const cols = { rank: 300, name: 500, score: 700, cakes: 800, date: 950 };
        
        this.addTableText(cols.rank, headerY, '#', '#FFD700', true);
        this.addTableText(cols.name, headerY, 'NAME', '#FFD700', true);
        this.addTableText(cols.score, headerY, 'SCORE', '#FFD700', true);
        this.addTableText(cols.cakes, headerY, 'CAKES', '#FFD700', true);
        this.addTableText(cols.date, headerY, 'DATE', '#FFD700', true);
        
        // Separator line
        const line = this.add.rectangle(width / 2, headerY + 18, 800, 2, 0x4CAF50, 0.5);
        this.contentGroup.add(line);
        
        // Rows
        const savedName = (window.statsManager || new StatsManager()).getPlayerName();
        
        result.data.forEach((entry, i) => {
            const rowY = headerY + 40 + i * 38;
            const isMe = entry.player_name === savedName;
            const rowColor = isMe ? '#FFD700' : '#ffffff';
            
            // Row background for Top 3
            if (i === 0 && this.textures.exists('ui_rank_table_a')) {
                const rankBgA = this.add.image(width / 2, rowY, 'ui_rank_table_a');
                rankBgA.setDisplaySize(780, 40);
                this.contentGroup.add(rankBgA);
            } else if (i === 1 && this.textures.exists('ui_rank_table_b')) {
                const rankBgB = this.add.image(width / 2, rowY, 'ui_rank_table_b');
                rankBgB.setDisplaySize(765, 40);
                this.contentGroup.add(rankBgB);
            } else if (i === 2 && this.textures.exists('ui_rank_table_c')) {
                const rankBgC = this.add.image(width / 2, rowY, 'ui_rank_table_c');
                rankBgC.setDisplaySize(810, 50);
                this.contentGroup.add(rankBgC);
            } else if (isMe) {
                const highlight = this.add.rectangle(width / 2, rowY, 780, 40, 0xFFD700, 0.1);
                this.contentGroup.add(highlight);
            }
            
            // Rank medal
            const rankText = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}`;
            const rankObj = this.addTableText(cols.rank, rowY, rankText, rowColor);
            if (i <= 2) {
                rankObj.setFontSize('18px'); 
                rankObj.setY(rowY - 5); 
            }
            this.addTableText(cols.name, rowY, entry.player_name || 'Anonymous', rowColor);
            this.addTableText(cols.score, rowY, String(entry.score), rowColor);
            this.addTableText(cols.cakes, rowY, String(entry.cakes_collected || 0), rowColor);
            
            // Format date
            const date = new Date(entry.played_at);
            const dateStr = `${date.getMonth() + 1}/${date.getDate()}`;
            this.addTableText(cols.date, rowY, dateStr, '#888888');
        });
        
        // Refresh button
        let refreshBg;
        if (this.textures.exists('ui_button_small')) {
            refreshBg = this.add.sprite(width - 100, startY, 'ui_button_small', 0);
            refreshBg.setDisplaySize(150, 60);
            refreshBg.setInteractive({ useHandCursor: true });
            this.contentGroup.add(refreshBg);
        } else {
            refreshBg = this.add.rectangle(width - 100, startY, 120, 30, 0x4CAF50);
            refreshBg.setInteractive({ useHandCursor: true });
            this.contentGroup.add(refreshBg);
        }
        
        const refreshBtn = this.add.text(width - 100, startY, 'REFRESH', {
            fontFamily: '"Press Start 2P"',
            fontSize: '14px',
            color: '#ffffff',
        });
        refreshBtn.setOrigin(0.5);
        this.contentGroup.add(refreshBtn);
        
        refreshBg.on('pointerdown', () => {
            this.contentGroup.clear(true, true);
            this.showOnlineTab();
        });
        this.contentGroup.add(refreshBtn);
    }

    showLocalTab() {
        const { width } = this.cameras.main;
        const startY = this.contentY + 30;
        
        // Table background for Local Stats
        if (this.textures.exists('ui_slices_gameover')) {
            const tableBg = this.add.image(width / 2, startY + 180, 'ui_slices_gameover');
            tableBg.setDisplaySize(820, 500);
            tableBg.setDepth(0);
            this.contentGroup.add(tableBg);
        }
        
        if (!window.statsManager) window.statsManager = new StatsManager();
        const stats = window.statsManager.stats;
        
        const items = [
            { icon: '🏆', label: 'High Score', value: String(stats.highScore) },
            { icon: '🎂', label: 'Total Cakes', value: String(stats.totalCakes) },
            { icon: '🎯', label: 'Best in One Game', value: String(stats.bestCakesInOneGame) },
            { icon: '🎮', label: 'Games Played', value: String(stats.totalPlays) },
            { icon: '⏱️', label: 'Total Play Time', value: window.statsManager.formatTime(stats.totalTime) },
            { icon: '📦', label: 'Mimic Deaths', value: String(stats.catDeaths) },
            { icon: '💔', label: 'HP Deaths', value: String(stats.hpDeaths) },
        ];
        
        items.forEach((item, i) => {
            const y = startY + 20 + i * 50;
            
            // Background bar (Rank C table for every row)
            let bar;
            if (this.textures.exists('ui_rank_table_c')) {
                bar = this.add.image(width / 2, y, 'ui_rank_table_c');
                bar.setDisplaySize(600, 60);
                this.contentGroup.add(bar);
            } else {
                bar = this.add.rectangle(width / 2, y, 600, 50, 0x2a1a3e, 0.8);
                bar.setStrokeStyle(1, 0x333333);
                this.contentGroup.add(bar);
            }
            
            // Icon
            const iconObj = this.add.text(width / 2 - 250, y, item.icon, {
                fontFamily: '"Press Start 2P", "Segoe UI Emoji", "Apple Color Emoji"',
                fontSize: '24px', // ทำให้อิโมจิใหญ่ขึ้น
                color: '#ffffff',
                padding: { top: 8, bottom: 8 }
            });
            iconObj.setOrigin(0, 0.5);
            iconObj.setY(y - 5); // ปรับตำแหน่งแกน Y 
            this.contentGroup.add(iconObj);
            
            // Label
            const label = this.add.text(width / 2 - 205, y, item.label, {
                fontFamily: '"Press Start 2P", "Segoe UI Emoji", "Apple Color Emoji"',
                fontSize: '15px',
                color: '#ffffff',
                padding: { top: 6, bottom: 6 }
            });
            label.setOrigin(0, 0.5);
            this.contentGroup.add(label);
            
            // Value
            const value = this.add.text(width / 2 + 250, y, item.value, {
                fontFamily: '"Press Start 2P"',
                fontSize: '19px',
                color: '#FFD700',
                padding: { top: 6, bottom: 6 }
            });
            value.setOrigin(1, 0.5);
            this.contentGroup.add(value);
        });
    }

    addTableText(x, y, content, color, isHeader = false) {
        const text = this.add.text(x, y, content, {
            fontFamily: '"Press Start 2P", "Segoe UI Emoji", "Apple Color Emoji"',
            fontSize: isHeader ? '10px' : '11px',
            color: color,
            padding: { top: 5, bottom: 5 }
        });
        text.setOrigin(0.5);
        this.contentGroup.add(text);
        return text;
    }

    createBackButton(x, y) {
        let backBg;
        if (this.textures.exists('ui_tab_rank')) {
            backBg = this.add.sprite(x, y, 'ui_tab_rank', 0);
            backBg.setScale(3.5, 2.0); // Make it larger than the text
            backBg.setTint(0xcccccc);
            backBg.setDepth(100);
        } else {
            backBg = this.add.rectangle(x, y, 200, 36, 0x2a1a3e, 0.9);
            backBg.setStrokeStyle(2, 0x4CAF50);
            backBg.setDepth(100);
        }
        backBg.setInteractive({ useHandCursor: true });
        
        const backText = this.add.text(x, y, 'BACK', {
            fontFamily: '"Press Start 2P"',
            fontSize: '14px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3,
        });
        backText.setOrigin(0.5);
        backText.setDepth(101);
        
        backBg.on('pointerover', () => {
            if (backBg.type === 'Sprite') {
                backBg.clearTint();
                backText.setColor('#FFD700');
                this.tweens.add({ targets: backBg, scaleX: 3.7, scaleY: 2.2, duration: 100 });
                this.tweens.add({ targets: backText, scaleX: 1.1, scaleY: 1.1, duration: 100 });
            } else {
                backBg.setFillStyle(0x4CAF50, 0.8);
                backText.setColor('#FFD700');
            }
        });
        
        backBg.on('pointerout', () => {
            if (backBg.type === 'Sprite') {
                backBg.setTint(0xcccccc);
                backText.setColor('#ffffff');
                this.tweens.add({ targets: backBg, scaleX: 3.5, scaleY: 2.0, duration: 100 });
                this.tweens.add({ targets: backText, scaleX: 1, scaleY: 1, duration: 100 });
            } else {
                backBg.setFillStyle(0x2a1a3e, 0.9);
                backText.setColor('#ffffff');
            }
        });
        
        backBg.on('pointerdown', () => {
            this.stopBGM();
            this.cameras.main.fadeOut(300);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.start(CONFIG.SCENE_MENU);
            });
        });
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
