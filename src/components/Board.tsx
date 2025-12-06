// src/components/Board.tsx
/**
 * 오목판 컴포넌트
 *
 * 게임 보드를 렌더링하고 각 셀(Cell)을 배치합니다.
 * 보드 크기에 따라 그리드를 생성하고, 승리 라인 및 마지막 수를 표시하는 역할을 합니다.
 */

import React from 'react';
import { Player } from '../core/GomokuGame';
import Cell from './Cell';
import styled from 'styled-components';
import SoundManager from '../core/SoundManager';
import { Theme, StoneSkinType } from '../styles/theme';
import { keyframes } from 'styled-components';

interface BoardProps {
  boardState: Player[][]; // 현재 보드 상태 (2차원 배열)
  boardSize: number; // 보드 크기 (예: 15x15)
  onCellClick: (row: number, col: number) => void; // 셀 클릭 핸들러
  isGameOver: boolean; // 게임 종료 여부
  lastMove: { row: number; col: number } | null; // 마지막 착수 위치
  winLine: { row: number; col: number }[] | null; // 승리 라인 좌표 배열
  heuristicMap: number[][] | null; // AI 평가 점수 맵
  checkForbidden: (row: number, col: number) => boolean; // 금지수 확인 함수
  skin: StoneSkinType; // 스킨 prop 추가
  activeCursor?: { r: number; c: number } | null; // 키보드 커서
}

// --- 스타일된 컴포넌트 ---

const BoardContainer = styled.div<{ $size: number; theme: Theme }>`
  position: relative;
  width: min(90vw, 600px);
  height: min(90vw, 600px);
  background: linear-gradient(135deg, #d4a574 0%, #c19a6b 50%, #b8956a 100%);
  border: 8px solid #8b6f47;
  margin: 20px auto;
  padding: 30px;
  box-sizing: border-box;
  box-shadow: 
    0 10px 40px rgba(0, 0, 0, 0.4),
    0 0 0 2px #6b5638,
    inset 0 2px 4px rgba(255, 255, 255, 0.2),
    inset 0 -2px 4px rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  
  /* 나무 질감 효과 */
  &::before {
    content: '';
    position: absolute;
    top: 8px;
    left: 8px;
    right: 8px;
    bottom: 8px;
    background-image: 
      repeating-linear-gradient(
        90deg,
        transparent,
        transparent 2px,
        rgba(139, 111, 71, 0.03) 2px,
        rgba(139, 111, 71, 0.03) 4px
      ),
      repeating-linear-gradient(
        0deg,
        transparent,
        transparent 2px,
        rgba(139, 111, 71, 0.03) 2px,
        rgba(139, 111, 71, 0.03) 4px
      );
    pointer-events: none;
    border-radius: 4px;
  }
`;

const GridLines = styled.svg`
  position: absolute;
  top: 30px;
  left: 30px;
  right: 30px;
  bottom: 30px;
  width: calc(100% - 60px);
  height: calc(100% - 60px);
  pointer-events: none;
`;

const IntersectionPoint = styled.div<{ $row: number; $col: number; $size: number }>`
  position: absolute;
  width: 40px;
  height: 40px;
  top: calc(30px + (100% - 60px) * ${props => props.$row} / ${props => props.$size - 1} - 20px);
  left: calc(30px + (100% - 60px) * ${props => props.$col} / ${props => props.$size - 1} - 20px);
  cursor: pointer;
  z-index: 10;
  border-radius: 50%;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
  
  /* 화점 (Star Points) */
  ${(props) => {
    const isStarPoint = props.$size === 15 && (
      (props.$row === 3 && props.$col === 3) ||
      (props.$row === 3 && props.$col === 11) ||
      (props.$row === 7 && props.$col === 7) ||
      (props.$row === 11 && props.$col === 3) ||
      (props.$row === 11 && props.$col === 11)
    );

    return isStarPoint ? `
      &::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 8px;
        height: 8px;
        background-color: rgba(93, 77, 54, 0.8);
        border-radius: 50%;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
        z-index: 1;
      }
    ` : '';
  }}
`;

const drawLine = keyframes`
  from {
    stroke-dashoffset: 1000;
  }
  to {
    stroke-dashoffset: 0;
  }
`;

const WinLineOverlay = styled.svg`
  position: absolute;
  top: 30px;
  left: 30px;
  right: 30px;
  bottom: 30px;
  width: calc(100% - 60px);
  height: calc(100% - 60px);
  pointer-events: none;
  z-index: 20;

  line {
    stroke: ${({ theme }) => theme.highlightWin};
    stroke-width: 8;
    stroke-linecap: round;
    stroke-dasharray: 1000;
    stroke-dashoffset: 1000;
    animation: ${drawLine} 1s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    filter: drop-shadow(0 0 10px ${({ theme }) => theme.highlightWin});
  }
`;

const Board: React.FC<BoardProps> = ({
  boardState,
  boardSize,
  onCellClick,
  isGameOver,
  lastMove,
  winLine,
  heuristicMap,
  checkForbidden,
  skin,
  activeCursor,
}) => {
  const [hoveredCell, setHoveredCell] = React.useState<{ row: number; col: number } | null>(null);

  // 특정 좌표가 승리 라인에 포함되는지 확인하는 헬퍼 함수
  const isCoordinateInWinLine = (r: number, c: number) => {
    if (!winLine) return false;
    return winLine.some((coord) => coord.row === r && coord.col === c);
  };

  return (
    <BoardContainer $size={boardSize}>
      {/* 바둑판 선 그리기 */}
      <GridLines>
        {/* 세로선 */}
        {Array.from({ length: boardSize }).map((_, i) => (
          <line
            key={`v-${i}`}
            x1={`${(i / (boardSize - 1)) * 100}%`}
            y1="0%"
            x2={`${(i / (boardSize - 1)) * 100}%`}
            y2="100%"
            stroke="rgba(93, 77, 54, 0.6)"
            strokeWidth="1.5"
          />
        ))}
        {/* 가로선 */}
        {Array.from({ length: boardSize }).map((_, i) => (
          <line
            key={`h-${i}`}
            x1="0%"
            y1={`${(i / (boardSize - 1)) * 100}%`}
            x2="100%"
            y2={`${(i / (boardSize - 1)) * 100}%`}
            stroke="rgba(93, 77, 54, 0.6)"
            strokeWidth="1.5"
          />
        ))}
      </GridLines>

      {/* 교차점에 돌 배치 */}
      {boardState.map((row, r) =>
        row.map((cellValue, c) => (
          <IntersectionPoint key={`${r}-${c}`} $row={r} $col={c} $size={boardSize}>
            <Cell
              value={cellValue}
              onClick={() => {
                onCellClick(r, c);
                if (cellValue === Player.Empty && !isGameOver) {
                  SoundManager.playPlaceStone();
                }
              }}
              isGameOver={isGameOver}
              isLastMove={lastMove?.row === r && lastMove?.col === c}
              isOnWinLine={isCoordinateInWinLine(r, c)}
              heuristicScore={heuristicMap ? heuristicMap[r][c] : undefined}
              checkForbidden={() => checkForbidden(r, c)}
              isHovered={
                (hoveredCell?.row === r && hoveredCell?.col === c) ||
                (activeCursor?.r === r && activeCursor?.c === c)
              }
              onMouseEnter={() => setHoveredCell({ row: r, col: c })}
              onMouseLeave={() => setHoveredCell(null)}
              skin={skin} // Cell에 스킨 전달
            />
          </IntersectionPoint>
        ))
      )}


      {/* 승리 라인 애니메이션 */}
      {winLine && winLine.length > 0 && (
        <WinLineOverlay viewBox={`0 0 ${boardSize - 1} ${boardSize - 1}`} preserveAspectRatio="none">
          <line
            x1={winLine[0].col}
            y1={winLine[0].row}
            x2={winLine[winLine.length - 1].col}
            y2={winLine[winLine.length - 1].row}
          />
        </WinLineOverlay>
      )}
    </BoardContainer>
  );
};

export default Board;
