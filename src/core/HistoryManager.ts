// src/core/HistoryManager.ts
/**
 * 게임 기록 관리자
 * LocalStorage를 사용하여 최근 게임 기록을 저장하고 관리합니다.
 */

export interface GameRecord {
    id: string;
    date: string;
    mode: 'HvH' | 'HvAI';
    result: 'win' | 'lose' | 'draw';
    moves: number;
    difficulty?: 'Easy' | 'Medium' | 'Hard';
}

const HISTORY_KEY = 'gomoku_game_history';
const MAX_RECORDS = 10;

class HistoryManager {
    /**
     * 게임 기록 저장
     */
    static saveGame(record: Omit<GameRecord, 'id' | 'date'>): void {
        const history = this.getHistory();
        const newRecord: GameRecord = {
            ...record,
            id: Date.now().toString(),
            date: new Date().toISOString(),
        };

        history.unshift(newRecord);

        // 최대 개수 유지
        if (history.length > MAX_RECORDS) {
            history.pop();
        }

        localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    }

    /**
     * 전체 기록 가져오기
     */
    static getHistory(): GameRecord[] {
        try {
            const data = localStorage.getItem(HISTORY_KEY);
            return data ? JSON.parse(data) : [];
        } catch {
            return [];
        }
    }

    /**
     * 승률 계산
     */
    static getWinRate(): { wins: number; losses: number; draws: number; winRate: number } {
        const history = this.getHistory();
        const wins = history.filter(r => r.result === 'win').length;
        const losses = history.filter(r => r.result === 'lose').length;
        const draws = history.filter(r => r.result === 'draw').length;
        const total = wins + losses;
        const winRate = total > 0 ? (wins / total) * 100 : 0;

        return { wins, losses, draws, winRate };
    }

    /**
     * 기록 초기화
     */
    static clearHistory(): void {
        localStorage.removeItem(HISTORY_KEY);
    }
}

export default HistoryManager;
