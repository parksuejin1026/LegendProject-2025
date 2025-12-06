

export type PersonaType = 'standard' | 'aggressive' | 'defensive' | 'trickster';

export interface AIStrategy {
    offenseWeight: number; // 공격 가중치 (기본 1.0)
    defenseWeight: number; // 방어 가중치 (기본 1.0)
    randomness: number;    // 실수/변칙 확률 (0.0 ~ 1.0)
}

export interface AIPersona {
    id: PersonaType;
    name: string;
    icon: string;
    description: string;
    strategy: AIStrategy;
    dialogues: {
        start: string[];
        win: string[];
        lose: string[];
        defense: string[]; // 막았을 때
        offense: string[]; // 공격할 때 (3, 4목)
        waiting: string[]; // 고민 중
    };
}

export const PERSONAS: Record<PersonaType, AIPersona> = {
    standard: {
        id: 'standard',
        name: '알파고무 (Standard)',
        icon: '🤖',
        description: '균형 잡힌 정석 스타일',
        strategy: { offenseWeight: 1.0, defenseWeight: 1.0, randomness: 0.1 },
        dialogues: {
            start: ['공정한 승부를 기대합니다.', '데이터 분석 시작.'],
            win: ['예측 범위 내의 결과입니다.', '체크메이트.'],
            lose: ['데이터 오류... 패배를 인정합니다.', '훌륭한 수군요.'],
            defense: ['방어 프로토콜 가동.', '그 수는 읽었습니다.'],
            offense: ['공격 확률 90%.', '이 수는 어떨까요?'],
            waiting: ['연산 중...', '최적의 수를 찾는 중입니다.']
        }
    },
    aggressive: {
        id: 'aggressive',
        name: '맹수 호랑이 (Aggressive)',
        icon: '🐯',
        description: '방어보다는 공격! 닥공 스타일',
        strategy: { offenseWeight: 1.5, defenseWeight: 0.6, randomness: 0.2 },
        dialogues: {
            start: ['어흥! 오늘 저녁은 너다!', '숨통을 끊어주마!'],
            win: ['약육강식! 내가 왕이다!', '너무 약하군!'],
            lose: ['크윽... 내가 당하다니...', '두고보자!'],
            defense: ['칫, 막혔나?', '귀찮게 구는군.'],
            offense: ['받아라 불꽃 펀치!', '빈틈 발견!'],
            waiting: ['어디를 물어뜯을까...', '피냄새가 나는군.']
        }
    },
    defensive: {
        id: 'defensive',
        name: '철벽 거북이 (Defensive)',
        icon: '🐢',
        description: '우주 방어. 지지는 않는다.',
        strategy: { offenseWeight: 0.7, defenseWeight: 1.4, randomness: 0.05 },
        dialogues: {
            start: ['천천히 갑시다.', '내 등껍질은 단단하다고.'],
            win: ['인내심의 승리네.', '무리하더니 지쳤군.'],
            lose: ['내 방어가 뚫리다니...', '단단한 한 방이었어.'],
            defense: ['통하지 않아.', '어림없지.', '안전 제일.'],
            offense: ['슬슬 반격해볼까?', '이제 내 차례인가.'],
            waiting: ['신중하게...', '돌다리도 두드려보고.']
        }
    },
    trickster: {
        id: 'trickster',
        name: '능구렁이 (Trickster)',
        icon: '🦊',
        description: '변칙적이고 알 수 없는 수',
        strategy: { offenseWeight: 1.1, defenseWeight: 0.9, randomness: 0.4 },
        dialogues: {
            start: ['히히, 재밌는 게임이 되겠어.', '속고 속이는 게 인생이지.'],
            win: ['걸려들었어!', '내가 뭘 할지 몰랐지?'],
            lose: ['이런, 내가 속았나?', '제법인데?'],
            defense: ['요리조리 피하기~', '거긴 함정이야.'],
            offense: ['여기가 아닐텐데?', '깜짝 선물이야!'],
            waiting: ['무슨 꿍꿍이를 꾸며볼까~', '히히히...']
        }
    }
};
