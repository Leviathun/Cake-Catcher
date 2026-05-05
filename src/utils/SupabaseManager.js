// ============================================
// Cake Catcher — Supabase Manager
// Online Leaderboard via Supabase
// ============================================

class SupabaseManager {
    constructor() {
        this.client = null;
        this.isConnected = false;

        try {
            if (typeof supabase !== 'undefined' && supabase.createClient) {
                this.client = supabase.createClient(
                    CONFIG.SUPABASE_URL,
                    CONFIG.SUPABASE_ANON_KEY
                );
                this.isConnected = true;
                console.log('[SupabaseManager] Connected to Supabase');
            } else {
                console.warn('[SupabaseManager] Supabase client not available');
            }
        } catch (e) {
            console.error('[SupabaseManager] Init error:', e);
        }
    }

    /**
     * Submit a score to the leaderboard
     */
    async submitScore(playerName, score, cakesCollected, deathCause) {
        if (!this.client) {
            console.warn('[SupabaseManager] Offline — score not submitted');
            return { success: false, error: 'offline' };
        }

        try {
            const { data, error } = await this.client
                .from('leaderboard')
                .insert([{
                    player_name: playerName || 'Anonymous',
                    score: score,
                    cakes_collected: cakesCollected,
                    death_cause: deathCause || 'hp',
                }]);

            if (error) {
                console.error('[SupabaseManager] Submit error:', error);
                return { success: false, error: error.message };
            }

            console.log('[SupabaseManager] Score submitted!', data);
            return { success: true, data };
        } catch (e) {
            console.error('[SupabaseManager] Submit exception:', e);
            return { success: false, error: e.message };
        }
    }

    /**
     * Get top scores for leaderboard
     */
    async getTopScores(limit = 10) {
        if (!this.client) {
            return { success: false, data: [], error: 'offline' };
        }

        try {
            const { data, error } = await this.client
                .from('leaderboard')
                .select('player_name, score, cakes_collected, death_cause, played_at')
                .order('score', { ascending: false })
                .limit(limit);

            if (error) {
                console.error('[SupabaseManager] Fetch error:', error);
                return { success: false, data: [], error: error.message };
            }

            return { success: true, data: data || [] };
        } catch (e) {
            console.error('[SupabaseManager] Fetch exception:', e);
            return { success: false, data: [], error: e.message };
        }
    }

    /**
     * Get rank of a specific score
     */
    async getPlayerRank(score) {
        if (!this.client) return { rank: '?', total: '?' };

        try {
            const { count, error } = await this.client
                .from('leaderboard')
                .select('*', { count: 'exact', head: true })
                .gt('score', score);

            if (error) return { rank: '?', total: '?' };

            const { count: total } = await this.client
                .from('leaderboard')
                .select('*', { count: 'exact', head: true });

            return { rank: (count || 0) + 1, total: total || 0 };
        } catch (e) {
            return { rank: '?', total: '?' };
        }
    }

    /**
     * Check if we can connect to Supabase
     */
    async isOnline() {
        if (!this.client) return false;

        try {
            const { error } = await this.client
                .from('leaderboard')
                .select('id', { count: 'exact', head: true });
            return !error;
        } catch (e) {
            return false;
        }
    }
}
