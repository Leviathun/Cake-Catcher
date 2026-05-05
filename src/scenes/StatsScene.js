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
        this.add.text(width / 2, 40, '🏆 LEADERBOARD', {
            fontFamily: '"Press Start 2P"',
            fontSize: '22px',
            color: '#FFD700',
            stroke: '#000000',
            strokeThickness: 3,
        }).setOrigin(0.5);
        
        // ============ TABS ============
        this.activeTab = 'online';
        
        this.tabOnline = this.createTab(width / 2 - 120, 85, '🌐 ONLINE', 'online');
        this.tabLocal = this.createTab(width / 2 + 120, 85, '📊 MY STATS', 'local');
        
        // Content container Y
        this.contentY = 120;
        this.contentGroup = this.add.group();
        
        // Show online tab by default
        this.showOnlineTab();
        
        // Back button
        this.createBackButton(width / 2, height - 50);
    }

    createTab(x, y, label, tabId) {
        const bg = this.add.rectangle(x, y, 200, 30, 
            tabId === 'online' ? 0x4CAF50 : 0x333333, 0.8);
        bg.setStrokeStyle(1, 0x4CAF50);
        bg.setInteractive({ useHandCursor: true });
        
        const text = this.add.text(x, y, label, {
            fontFamily: '"Press Start 2P"',
            fontSize: '10px',
            color: tabId === 'online' ? '#ffffff' : '#888888',
        });
        text.setOrigin(0.5);
        
        bg.on('pointerdown', () => {
            this.switchTab(tabId);
        });
        
        return { bg, text, tabId };
    }

    switchTab(tabId) {
        this.activeTab = tabId;
        
        // Update tab visuals
        const isOnline = tabId === 'online';
        this.tabOnline.bg.setFillStyle(isOnline ? 0x4CAF50 : 0x333333, 0.8);
        this.tabOnline.text.setColor(isOnline ? '#ffffff' : '#888888');
        this.tabLocal.bg.setFillStyle(!isOnline ? 0x4CAF50 : 0x333333, 0.8);
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
        const loading = this.add.text(width / 2, startY + 100, 'Loading...', {
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
            
            const noData = this.add.text(width / 2, startY + 100, msg, {
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
        
        // Table header
        const headerY = startY + 10;
        const cols = { rank: 100, name: 280, score: 500, cakes: 660, date: 900 };
        
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
            
            // Highlight my row
            if (isMe) {
                const highlight = this.add.rectangle(width / 2, rowY, 800, 32, 0xFFD700, 0.1);
                this.contentGroup.add(highlight);
            }
            
            // Rank medal
            const rankText = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}`;
            this.addTableText(cols.rank, rowY, rankText, rowColor);
            this.addTableText(cols.name, rowY, entry.player_name || 'Anonymous', rowColor);
            this.addTableText(cols.score, rowY, String(entry.score), rowColor);
            this.addTableText(cols.cakes, rowY, String(entry.cakes_collected || 0), rowColor);
            
            // Format date
            const date = new Date(entry.played_at);
            const dateStr = `${date.getMonth() + 1}/${date.getDate()}`;
            this.addTableText(cols.date, rowY, dateStr, '#888888');
        });
        
        // Refresh button
        const refreshBtn = this.add.text(width - 80, startY, '🔄 Refresh', {
            fontFamily: '"Press Start 2P"',
            fontSize: '9px',
            color: '#4CAF50',
        });
        refreshBtn.setOrigin(0.5);
        refreshBtn.setInteractive({ useHandCursor: true });
        refreshBtn.on('pointerdown', () => {
            this.contentGroup.clear(true, true);
            this.showOnlineTab();
        });
        this.contentGroup.add(refreshBtn);
    }

    showLocalTab() {
        const { width } = this.cameras.main;
        const startY = this.contentY + 30;
        
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
            const y = startY + 20 + i * 55;
            
            // Background bar
            const bar = this.add.rectangle(width / 2, y, 500, 40, 0x2a1a3e, 0.8);
            bar.setStrokeStyle(1, 0x333333);
            this.contentGroup.add(bar);
            
            // Icon + Label
            const label = this.add.text(width / 2 - 220, y, `${item.icon} ${item.label}`, {
                fontFamily: '"Press Start 2P"',
                fontSize: '11px',
                color: '#ffffff',
            });
            label.setOrigin(0, 0.5);
            this.contentGroup.add(label);
            
            // Value
            const value = this.add.text(width / 2 + 220, y, item.value, {
                fontFamily: '"Press Start 2P"',
                fontSize: '14px',
                color: '#FFD700',
            });
            value.setOrigin(1, 0.5);
            this.contentGroup.add(value);
        });
    }

    addTableText(x, y, content, color, isHeader = false) {
        const text = this.add.text(x, y, content, {
            fontFamily: '"Press Start 2P"',
            fontSize: isHeader ? '10px' : '11px',
            color: color,
        });
        text.setOrigin(0.5);
        this.contentGroup.add(text);
        return text;
    }

    createBackButton(x, y) {
        const bg = this.add.rectangle(x, y, 200, 36, 0x2a1a3e, 0.9);
        bg.setStrokeStyle(2, 0x4CAF50);
        bg.setInteractive({ useHandCursor: true });
        
        const text = this.add.text(x, y, '← BACK', {
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
        bg.on('pointerdown', () => {
            this.cameras.main.fadeOut(300);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.start(CONFIG.SCENE_MENU);
            });
        });
    }
}
