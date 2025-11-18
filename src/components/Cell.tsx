// src/components/Cell.tsx
// 이 코드는 미니멀리즘 스타일을 적용하여 오목판의 개별 칸을 렌더링하고, 플레이어의 돌을 색상(흑/백)에 맞춰 표시하며, 클릭 가능 상태를 관리합니다.
import React from 'react';
// GomokuGame 코어 파일에서 Player 타입 임포트
import { Player } from '../core/GomokuGame'; 

interface CellProps {
    value: Player; // 현재 칸의 상태 (Empty, Human, AI)
    onClick: () => void; // 셀 클릭 시 실행할 함수
    isGameOver: boolean; // 게임 종료 여부
}

/**
 * 돌의 색상을 결정하는 헬퍼 함수
 */
const getStoneColor = (value: Player) => {
    if (value === Player.Human) return '#000'; // 흑돌
    if (value === Player.AI) return '#fff';  // 백돌
    return 'transparent'; // 빈 칸
}

const Cell: React.FC<CellProps> = ({ value, onClick, isGameOver }) => {
    // 게임이 진행 중이고 칸이 비어있을 때만 클릭 가능
    const isClickable = !isGameOver && value === Player.Empty;

    // 돌의 미니멀리즘 스타일
    const stoneStyle: React.CSSProperties = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '80%', // 셀 크기의 80%
        height: '80%',
        borderRadius: '50%',
        backgroundColor: getStoneColor(value),
        // 백돌일 경우 경계를 명확히 하기 위해 얇은 테두리 추가
        border: value === Player.AI ? '1px solid #ccc' : 'none',
    };

    return (
        <div 
            style={{ 
                width: '100%', 
                height: '100%', 
                position: 'relative', 
                // 클릭 가능 여부에 따라 마우스 커서 변경
                cursor: isClickable ? 'pointer' : 'default',
            }} 
            // 클릭 가능할 때만 onClick 함수 연결
            onClick={isClickable ? onClick : undefined}
        >
            {/* 돌이 놓여 있을 경우에만 렌더링 */}
            {value !== Player.Empty && <div style={stoneStyle} />}
        </div>
    );
};

export default Cell;