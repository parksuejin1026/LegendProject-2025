export interface Theme {
    name: string;
    background: string;
    boardBackground: string;
    boardBorder: string;
    gridLine: string;
    text: string;
    buttonBg: string;
    buttonText: string;
    buttonHover: string;
    stoneBlack: string;
    stoneWhite: string;
    highlightWin: string;
    highlightLast: string;
    stoneShadow: string;
    boardShadow: string;
}

export type StoneSkinType = 'standard' | 'gem' | 'cat';

export interface StoneSkinStyle {
    name: string;
    black: string; // CSS background or gradient
    white: string; // CSS background or gradient
    shadow: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    component?: (props: any) => JSX.Element; // For complex SVG skins
}

export const stoneSkins: Record<StoneSkinType, StoneSkinStyle> = {
    standard: {
        name: '기본 (Standard)',
        black: 'radial-gradient(circle at 30% 30%, #666, #000)',
        white: 'radial-gradient(circle at 30% 30%, #fff, #e0e0e0)',
        shadow: '2px 2px 4px rgba(0, 0, 0, 0.5), inset -2px -2px 4px rgba(0,0,0,0.2)'
    },
    gem: {
        name: '보석 (Gem)',
        black: 'radial-gradient(circle at 30% 30%, #444, #1a1a1a, #000)', // 오닉스 느낌
        white: 'radial-gradient(circle at 30% 30%, #fff, #e6e6fa, #b0c4de)', // 다이아몬드 느낌
        shadow: '0 0 8px rgba(255, 255, 255, 0.3), inset -2px -2px 6px rgba(0,0,0,0.4)'
    },
    cat: {
        name: '냥냥이 (Cat)',
        black: '#333', // 흑냥이 (SVG로 처리 예정)
        white: '#fff', // 백냥이 (SVG로 처리 예정)
        shadow: '2px 2px 3px rgba(0,0,0,0.3)'
    }
};

export const themes: Record<string, Theme> = {
    modern: {
        name: 'Modern Dark',
        background: 'linear-gradient(135deg, #1a1c20 0%, #0f1012 100%)',
        boardBackground: '#34495e',
        boardBorder: '#2c3e50',
        gridLine: '#5d6d7e',
        text: '#e0e0e0',
        buttonBg: 'rgba(255, 255, 255, 0.1)',
        buttonText: '#ffffff',
        buttonHover: 'rgba(255, 255, 255, 0.2)',
        stoneBlack: '#000000',
        stoneWhite: '#ffffff',
        highlightWin: 'gold',
        highlightLast: 'rgba(255, 0, 0, 0.8)',
        stoneShadow: '2px 2px 4px rgba(0, 0, 0, 0.4)',
        boardShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
    },
    classic: {
        name: 'Classic Wood',
        background: 'linear-gradient(135deg, #4a3b32 0%, #2c241b 100%)', // 붉은기 제거, 차분한 나무색
        boardBackground: '#e6b87d', // 나무 색상
        boardBorder: '#5d4037',
        gridLine: '#5d4037',
        text: '#f5f5f5',
        buttonBg: 'rgba(255, 255, 255, 0.2)',
        buttonText: '#ffffff',
        buttonHover: 'rgba(255, 255, 255, 0.3)',
        stoneBlack: '#000000',
        stoneWhite: '#ffffff',
        highlightWin: '#ff4500',
        highlightLast: 'rgba(255, 0, 0, 0.8)',
        stoneShadow: '3px 3px 6px rgba(0, 0, 0, 0.6)',
        boardShadow: '0 10px 30px rgba(0, 0, 0, 0.6)',
    },
    neon: {
        name: 'Cyber Neon',
        background: 'linear-gradient(135deg, #000000 0%, #0a0a2a 100%)',
        boardBackground: '#000000',
        boardBorder: '#00ffff',
        gridLine: '#00ffff',
        text: '#00ffff',
        buttonBg: 'rgba(0, 255, 255, 0.1)',
        buttonText: '#00ffff',
        buttonHover: 'rgba(0, 255, 255, 0.3)',
        stoneBlack: '#000000',
        stoneWhite: '#e0e0ff',
        highlightWin: '#ff00ff',
        highlightLast: '#ffff00',
        stoneShadow: '0 0 10px #00ffff',
        boardShadow: '0 0 20px #00ffff',
    },
};
