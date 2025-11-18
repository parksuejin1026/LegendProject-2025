// src/components/Board.tsx

import React from 'react';
import { Player } from '../core/GomokuGame';
import Cell from './Cell';

interface BoardProps {
    boardState: Player[][];
    boardSize: number;
    onCellClick: (row: number, col: number) => void;
    isGameOver: boolean;
    lastMove: { row: number, col: number } | null;
    winLine: { row: number, col: number }[] | null;
}

const Board: React.FC<BoardProps> = ({ boardState, boardSize, onCellClick, isGameOver, lastMove, winLine }) => {
    const boardContainerStyle: React.CSSProperties = {
        display: 'grid',
        gridTemplateColumns: `repeat(${boardSize}, 1fr)`,
        width: 'min(90vw, 600px)', 
        height: 'min(90vw, 600px)',
        backgroundColor: '#f0d9b5',
        border: '3px solid #333',
        margin: '20px auto',
        boxSizing: 'content-box',
    };

    const lineStyle: React.CSSProperties = {
        borderTop: '1px solid #333',
        borderLeft: '1px solid #333',
        boxSizing: 'border-box',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    };

    const isCoordinateInWinLine = (r: number, c: number) => {
        if (!winLine) return false;
        return winLine.some(coord => coord.row === r && coord.col === c);
    };

    return (
        <div style={boardContainerStyle}>
            {boardState.map((row, r) => (
                row.map((cellValue, c) => {
                    const cellStyle: React.CSSProperties = {
                        ...lineStyle,
                        borderBottom: r === boardSize - 1 ? 'none' : '1px solid #333',
                        borderRight: c === boardSize - 1 ? 'none' : '1px solid #333',
                    };

                    return (
                        <div key={`${r}-${c}`} style={cellStyle}>
                            <Cell 
                                value={cellValue} 
                                onClick={() => onCellClick(r, c)}
                                isGameOver={isGameOver}
                                isLastMove={lastMove?.row === r && lastMove?.col === c}
                                isOnWinLine={isCoordinateInWinLine(r, c)}
                            />
                        </div>
                    );
                })
            ))}
        </div>
    );
};

export default Board;