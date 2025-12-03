/**
 * StorageManager
 *
 * 로컬 스토리지(localStorage)를 사용하여 게임 전적을 저장하고 불러옵니다.
 */

export interface GameStats {
    wins: number;
    losses: number;
    draws: number;
}

class StorageManager {
    private readonly STORAGE_KEY = 'gomoku_stats';

    /**
     * 전적을 불러옵니다.
     */
    public getStats(): GameStats {
        if (typeof window === 'undefined') {
            return { wins: 0, losses: 0, draws: 0 };
        }

        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
        return { wins: 0, losses: 0, draws: 0 };
    }

    /**
     * 승리를 기록합니다.
     */
    public recordWin() {
        const stats = this.getStats();
        stats.wins++;
        this.saveStats(stats);
    }

    /**
     * 패배를 기록합니다.
     */
    public recordLoss() {
        const stats = this.getStats();
        stats.losses++;
        this.saveStats(stats);
    }

    /**
     * 무승부를 기록합니다.
     */
    public recordDraw() {
        const stats = this.getStats();
        stats.draws++;
        this.saveStats(stats);
    }

    private saveStats(stats: GameStats) {
        if (typeof window !== 'undefined') {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(stats));
        }
    }
}

export default new StorageManager();
