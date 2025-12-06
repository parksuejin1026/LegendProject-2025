import { Player } from './GomokuGame';

export interface Challenge {
    id: string;
    title: string;
    description: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    initialStones: { row: number; col: number; player: Player }[];
    goal: string; // e.g., "3수 안에 승리하세요"
    hint?: string;
}

export const CHALLENGES: Challenge[] = [
    {
        id: 'c1',
        title: '연속 공격의 기초',
        description: '흑을 잡고 승리할 수 있는 수를 찾아보세요.',
        difficulty: 'Easy',
        goal: '4•3을 만들어 승리하세요',
        initialStones: [
            { row: 7, col: 7, player: Player.Human }, // 흑
            { row: 7, col: 8, player: Player.AI },    // 백
            { row: 6, col: 8, player: Player.Human },
            { row: 5, col: 9, player: Player.AI },
            { row: 8, col: 6, player: Player.Human },
        ]
    },
    {
        id: 'c2',
        title: '빈틈 찌르기',
        description: '백의 방어를 뚫고 결정적인 한 수를 두세요.',
        difficulty: 'Medium',
        goal: '막을 수 없는 4목을 만드세요',
        initialStones: [
            { row: 7, col: 7, player: Player.AI },
            { row: 6, col: 6, player: Player.Human },
            { row: 8, col: 8, player: Player.Human },
            { row: 6, col: 8, player: Player.AI },
            { row: 5, col: 9, player: Player.AI },
            { row: 9, col: 5, player: Player.Human },
            { row: 9, col: 9, player: Player.Human },
        ]
    },
    {
        id: 'c3',
        title: '전설의 묘수',
        description: '복잡한 형태에서 승리 패턴을 발견하세요.',
        difficulty: 'Hard',
        goal: 'VCF (Victory by Continuous Four) 공격',
        initialStones: [
            { row: 4, col: 4, player: Player.AI },
            { row: 5, col: 5, player: Player.Human },
            { row: 5, col: 6, player: Player.AI },
            { row: 6, col: 5, player: Player.Human },
            { row: 6, col: 7, player: Player.AI },
            { row: 7, col: 8, player: Player.Human },
            { row: 8, col: 8, player: Player.AI },
            { row: 7, col: 5, player: Player.Human },
            { row: 9, col: 4, player: Player.AI },
            { row: 6, col: 6, player: Player.Human },
        ]
    }
];
