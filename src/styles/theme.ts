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
        background: 'linear-gradient(135deg, #8b4513 0%, #5d4037 100%)',
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
