// ============================================
// Cake Catcher — Stats Manager (localStorage)
// Persistent personal stats
// ============================================

class StatsManager {
    constructor() {
        this.storageKey = 'cakeCatcher_stats';
        this.nameKey = 'cakeCatcher_playerName';
        this.stats = this.loadStats();
    }

    getDefaultStats() {
        return {
            highScore: 0,
            totalCakes: 0,
            totalPlays: 0,
            totalTime: 0,
            catDeaths: 0,
            hpDeaths: 0,
            bestCakesInOneGame: 0,
        };
    }

    loadStats() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (stored) {
                return { ...this.getDefaultStats(), ...JSON.parse(stored) };
            }
        } catch (e) {
            console.warn('[StatsManager] Load error:', e);
        }
        return this.getDefaultStats();
    }

    saveStats() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.stats));
        } catch (e) {
            console.warn('[StatsManager] Save error:', e);
        }
    }

    /**
     * Record a completed game
     */
    saveGame(score, cakesCollected, playTime, deathCause) {
        this.stats.totalPlays++;
        this.stats.totalCakes += cakesCollected;
        this.stats.totalTime += playTime;

        if (score > this.stats.highScore) {
            this.stats.highScore = score;
        }

        if (cakesCollected > this.stats.bestCakesInOneGame) {
            this.stats.bestCakesInOneGame = cakesCollected;
        }

        if (deathCause === 'cat') {
            this.stats.catDeaths++;
        } else {
            this.stats.hpDeaths++;
        }

        this.saveStats();
    }

    /**
     * Get/set player name
     */
    getPlayerName() {
        try {
            return localStorage.getItem(this.nameKey) || '';
        } catch (e) {
            return '';
        }
    }

    setPlayerName(name) {
        try {
            localStorage.setItem(this.nameKey, name);
        } catch (e) {
            console.warn('[StatsManager] Name save error:', e);
        }
    }

    /**
     * Format play time as readable string
     */
    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        if (mins > 60) {
            const hrs = Math.floor(mins / 60);
            const remainMins = mins % 60;
            return `${hrs}h ${remainMins}m`;
        }
        return `${mins}m ${secs}s`;
    }
}
