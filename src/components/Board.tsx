// src/components/Board.tsx
// 이 코드는 GomokuGame의 상태를 받아 15x15 오목판의 격자를 구성하고, 각 격자에 Cell 컴포넌트를 배치하여 게임판을 시각적으로 렌더링하는 역할을 합니다.
import React from 'react';
// GomokuGame 코어 파일에서 Player 타입 임포트
import { Player } from '../core/GomokuGame';
import Cell from './Cell';

interface BoardProps {
    boardState: Player[][]; // 15x15 게임판 상태 배열
    boardSize: number;      // 오목판 크기 (15)
    onCellClick: (row: number, col: number) => void; // 셀 클릭 핸들러
    isGameOver: boolean;    // 게임 종료 여부
}

const Board: React.FC<BoardProps> = ({ boardState, boardSize, onCellClick, isGameOver }) => {
    // 오목판 컨테이너 스타일 (미니멀리즘: 나무색 배경, 격자 레이아웃)
    const boardContainerStyle: React.CSSProperties = {
        display: 'grid',
        gridTemplateColumns: `repeat(${boardSize}, 1fr)`,
        width: 'min(90vw, 600px)', // 반응형을 고려한 최대 크기
        height: 'min(90vw, 600px)',
        backgroundColor: '#f0d9b5', // 연한 나무색
        border: '3px solid #333',
        margin: '20px auto',
        boxSizing: 'content-box',
    };

    // 격자 선 스타일 (얇고 깔끔한 미니멀리즘 스타일)
    const lineStyle: React.CSSProperties = {
        borderTop: '1px solid #333',
        borderLeft: '1px solid #333',
        boxSizing: 'border-box',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    };

    return (
        <div style={boardContainerStyle}>
            {/* 2차원 배열을 순회하며 Cell 컴포넌트 렌더링 */}
            {boardState.map((row, r) => (
                row.map((cellValue, c) => {
                    const cellStyle: React.CSSProperties = {
                        ...lineStyle,
                        // 마지막 행과 열은 선이 겹치지 않도록 테두리 제거 (또는 변경)
                        borderBottom: r === boardSize - 1 ? 'none' : '1px solid #333',
                        borderRight: c === boardSize - 1 ? 'none' : '1px solid #333',
                    };

                    return (
                        <div key={`${r}-${c}`} style={cellStyle}>
                            <Cell 
                                value={cellValue} 
                                onClick={() => onCellClick(r, c)} // 클릭 시 해당 좌표를 전달
                                isGameOver={isGameOver}
                            />
                        </div>
                    );
                })
            ))}
        </div>
    );
};

export default Board;