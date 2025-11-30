// src/components/Board.tsx

import React from 'react';
import { Player } from '../core/GomokuGame';
import Cell from './Cell';
import styled from 'styled-components';

interface BoardProps {
    boardState: Player[][];
    boardSize: number;
    onCellClick: (row: number, col: number) => void;
    isGameOver: boolean;
    lastMove: { row: number, col: number } | null;
    winLine: { row: number, col: number }[] | null;
}

// --- Styled Components ---

const BoardContainer = styled.div<{ $size: number }>`
  display: grid;
  grid-template-columns: repeat(${props => props.$size}, 1fr);
  width: min(90vw, 600px);
  height: min(90vw, 600px);
  background-color: #34495e; /* Dark Slate */
  border: 4px solid #2c3e50;
  margin: 20px auto;
  box-sizing: content-box;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
  border-radius: 4px;
`;

const CellWrapper = styled.div<{ $row: number; $col: number; $size: number }>`
  border-top: 1px solid #5d6d7e;
  border-left: 1px solid #5d6d7e;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  
  /* Remove outer borders for cleaner look or keep them? 
     Standard Gomoku boards usually have lines going to the edge.
     But we implemented border-right/bottom logic in previous code.
     Let's replicate the grid logic cleanly.
  */
  
  border-right: ${props => props.$col === props.$size - 1 ? 'none' : '1px solid #5d6d7e'};
  border-bottom: ${props => props.$row === props.$size - 1 ? 'none' : '1px solid #5d6d7e'};
`;

const Board: React.FC<BoardProps> = ({ boardState, boardSize, onCellClick, isGameOver, lastMove, winLine }) => {
    const isCoordinateInWinLine = (r: number, c: number) => {
        if (!winLine) return false;
        return winLine.some(coord => coord.row === r && coord.col === c);
    };

    return (
        <BoardContainer $size={boardSize}>
            {boardState.map((row, r) => (
                row.map((cellValue, c) => (
                    <CellWrapper key={`${r}-${c}`} $row={r} $col={c} $size={boardSize}>
                        <Cell
                            value={cellValue}
                            onClick={() => onCellClick(r, c)}
                            isGameOver={isGameOver}
                            isLastMove={lastMove?.row === r && lastMove?.col === c}
                            isOnWinLine={isCoordinateInWinLine(r, c)}
                        />
                    </CellWrapper>
                ))
            ))}
        </BoardContainer>
    );
};

export default Board;