// ============================================
// Cake Catcher — Difficulty Manager
// Scales game difficulty over time/score
// ============================================

class DifficultyManager {
    constructor() {
        this.currentLevel = 0;
        this.levels = [
            // Level 0: Score 0-10
            {
                minScore: 0,
                cakeInterval: 1500,
                tomatoInterval: 3500,
                mimicInterval: 9000,
                fallSpeedMultiplier: 1.0,
                label: 'Easy'
            },
            // Level 1: Score 11-25
            {
                minScore: 11,
                cakeInterval: 1200,
                tomatoInterval: 2500,
                mimicInterval: 7000,
                fallSpeedMultiplier: 1.3,
                label: 'Normal'
            },
            // Level 2: Score 26-50
            {
                minScore: 26,
                cakeInterval: 900,
                tomatoInterval: 1800,
                mimicInterval: 5000,
                fallSpeedMultiplier: 1.6,
                label: 'Hard'
            },
            // Level 3: Score 51-75
            {
                minScore: 51,
                cakeInterval: 750,
                tomatoInterval: 1400,
                mimicInterval: 4000,
                fallSpeedMultiplier: 1.8,
                label: 'Very Hard'
            },
            // Level 4: Score 76+
            {
                minScore: 76,
                cakeInterval: 600,
                tomatoInterval: 1000,
                mimicInterval: 3000,
                fallSpeedMultiplier: 2.0,
                label: 'Insane!'
            }
        ];
    }

    /**
     * Update difficulty based on current score
     * Returns true if level changed
     */
    update(score) {
        let newLevel = 0;
        for (let i = this.levels.length - 1; i >= 0; i--) {
            if (score >= this.levels[i].minScore) {
                newLevel = i;
                break;
            }
        }

        const changed = newLevel !== this.currentLevel;
        this.currentLevel = newLevel;
        return changed;
    }

    /**
     * Get current difficulty parameters
     */
    getParams() {
        return this.levels[this.currentLevel];
    }

    /**
     * Get cake fall speed (base * multiplier)
     */
    getCakeSpeed() {
        return CONFIG.CAKE_BASE_SPEED * this.getParams().fallSpeedMultiplier;
    }

    /**
     * Get tomato fall speed
     */
    getTomatoSpeed() {
        return CONFIG.TOMATO_BASE_SPEED * this.getParams().fallSpeedMultiplier;
    }

    /**
     * Get mimic speed
     */
    getMimicSpeed() {
        return CONFIG.MIMIC_SPEED * (1 + this.currentLevel * 0.15);
    }

    reset() {
        this.currentLevel = 0;
    }
}
