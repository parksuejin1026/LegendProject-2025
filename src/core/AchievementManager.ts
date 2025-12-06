export enum AchievementType {
    FirstWin = 'FIRST_WIN',
    SpeedRacer = 'SPEED_RACER', // 30수 이내 승리
    DefenseMaster = 'DEFENSE_MASTER', // 100수 이상 게임
    Streak3 = 'STREAK_3', // 3연승
}

export interface Achievement {
    id: AchievementType;
    title: string;
    description: string;
    icon: string;
    unlocked: boolean;
}

const ACHIEVEMENTS_DATA: Record<AchievementType, Omit<Achievement, 'unlocked' | 'id'>> = {
    [AchievementType.FirstWin]: {
        title: '첫 승리',
        description: 'AI를 상대로 첫 승리를 거두었습니다.',
        icon: '🥇'
    },
    [AchievementType.SpeedRacer]: {
        title: '스피드 레이서',
        description: '30수 이내에 AI를 이겼습니다.',
        icon: '⚡'
    },
    [AchievementType.DefenseMaster]: {
        title: '철벽 방어',
        description: '100수 이상 치열한 접전 끝에 승리했습니다.',
        icon: '🛡️'
    },
    [AchievementType.Streak3]: {
        title: '파죽지세',
        description: '3연승을 달성했습니다!',
        icon: '🔥'
    }
};

export class AchievementManager {
    private static STORAGE_KEY = 'gomoku_achievements';

    public static getAchievements(): Achievement[] {
        const unlockedIds = this.getUnlockedIds();
        return Object.entries(ACHIEVEMENTS_DATA).map(([id, data]) => ({
            id: id as AchievementType,
            ...data,
            unlocked: unlockedIds.includes(id as AchievementType)
        }));
    }

    private static getUnlockedIds(): AchievementType[] {
        if (typeof window === 'undefined') return [];
        const json = localStorage.getItem(this.STORAGE_KEY);
        return json ? JSON.parse(json) : [];
    }

    public static checkAchievements(
        isWin: boolean,
        moveCount: number,
        winStreak: number
    ): Achievement[] {
        if (!isWin) return [];

        const unlocked = this.getUnlockedIds();
        const newUnlocked: Achievement[] = [];

        const check = (id: AchievementType, condition: boolean) => {
            if (condition && !unlocked.includes(id)) {
                unlocked.push(id);
                newUnlocked.push({ id, ...ACHIEVEMENTS_DATA[id], unlocked: true });
            }
        };

        check(AchievementType.FirstWin, true);
        check(AchievementType.SpeedRacer, moveCount <= 30);
        check(AchievementType.DefenseMaster, moveCount >= 100);
        check(AchievementType.Streak3, winStreak >= 3);

        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(unlocked));
        return newUnlocked;
    }
}
