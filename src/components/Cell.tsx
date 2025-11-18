// src/components/Cell.tsx (수정된 전체 코드)

import React from 'react';
import { Player } from '../core/GomokuGame'; 

interface CellProps {
    value: Player; 
    onClick: () => void; 
    isGameOver: boolean; 
    isLastMove: boolean;
    isOnWinLine: boolean;
}

const getStoneColor = (value: Player) => {
    if (value === Player.Human) return '#000'; 
    if (value === Player.AI) return '#fff';  
    return 'transparent'; 
}

const Cell: React.FC<CellProps> = ({ value, onClick, isGameOver, isLastMove, isOnWinLine }) => {
    const isClickable = !isGameOver && value === Player.Empty;

    // 1. 기본 스타일 정의
    const baseStoneStyle: React.CSSProperties = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '80%', 
        height: '80%',
        borderRadius: '50%',
        backgroundColor: getStoneColor(value),
        border: value === Player.AI ? '1px solid #ccc' : 'none',
        zIndex: 10,
    };

    // 2. 조건부 스타일을 기본 스타일에 병합
    const finalStoneStyle: React.CSSProperties = {
        ...baseStoneStyle,
        
        // ✨ 승리 선 하이라이트 (최우선 적용)
        animation: isOnWinLine ? 'pulse 1s infinite alternate' : 'none',
        boxShadow: isOnWinLine 
            ? '0 0 10px 5px gold' 
            // ✨ 마지막 수 강조 (승리 선이 아닐 경우 적용)
            : (isLastMove ? '0 0 0 3px red' : 'none'), 
    };

    return (
        <div 
            style={{ 
                width: '100%', 
                height: '100%', 
                position: 'relative', 
                cursor: isClickable ? 'pointer' : 'default',
            }} 
            onClick={isClickable ? onClick : undefined}
        >
            {value !== Player.Empty && <div style={finalStoneStyle} />}
        </div>
    );
};

export default Cell;