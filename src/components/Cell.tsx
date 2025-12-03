// src/components/Cell.tsx
/**
 * 셀(Cell) 컴포넌트
 *
 * 오목판의 각 칸을 나타냅니다.
 * 흑돌/백돌을 표시하고, 승리 시 하이라이트 효과나 마지막 착수 표시를 처리합니다.
 */
import React from 'react';
import styled, { keyframes, css } from 'styled-components';
import { Player } from '../core/GomokuGame';
import { Theme } from '../styles/theme';

// --- Styled Components 정의 ---

const pulse = keyframes`
  0%, 100% {
    transform: translate(-50%, -50%) scale(1);
    box-shadow: 0 0 20px 8px rgba(255, 215, 0, 0.8);
  }
  50% {
    transform: translate(-50%, -50%) scale(1.15);
    box-shadow: 0 0 30px 15px rgba(255, 215, 0, 1);
  }
`;

const dropIn = keyframes`
  0% {
    transform: translate(-50%, -200%) scale(0.3);
    opacity: 0;
  }
  60% {
    transform: translate(-50%, -50%) scale(1.1);
    opacity: 1;
  }
  80% {
    transform: translate(-50%, -50%) scale(0.95);
  }
  100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
`;

const ripple = keyframes`
  0% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.6;
  }
  100% {
    transform: translate(-50%, -50%) scale(2.5);
    opacity: 0;
  }
`;

const CellContainer = styled.div<{ $clickable: boolean }>`
  width: 100%;
  height: 100%;
  position: relative;
  cursor: ${({ $clickable }) => ($clickable ? 'pointer' : 'default')};
`;

const RippleEffect = styled.div<{ $player: Player }>`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 85%;
  height: 85%;
  border-radius: 50%;
  border: 3px solid ${({ $player }) => ($player === Player.Human ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.6)')};
  animation: ${ripple} 0.6s ease-out;
  pointer-events: none;
  z-index: 5;
`;

const Stone = styled.div<{
  $player: Player;
  $isOnWinLine: boolean;
  $isLastMove: boolean;
  theme: Theme;
}>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 85%;
  height: 85%;
  border-radius: 50%;
  z-index: 10;
  animation: ${dropIn} 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  border: 1px solid ${({ $player }) => ($player === Player.Human ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.2)')};

  background: ${({ $player, theme }) =>
    $player === Player.Human
      ? `radial-gradient(circle at 30% 30%, #666, ${theme.stoneBlack})`
      : $player === Player.AI
        ? `radial-gradient(circle at 30% 30%, #fff, ${theme.stoneWhite})`
        : 'transparent'};

  box-shadow: ${({ $player }) =>
    $player === Player.Empty ? 'none' : '2px 2px 4px rgba(0, 0, 0, 0.5), inset -2px -2px 4px rgba(0,0,0,0.2)'};

  ${({ $isOnWinLine }) =>
    $isOnWinLine &&
    css`
      animation: ${pulse} 1.5s infinite ease-in-out;
      filter: brightness(1.3);
    `}

  ${({ $isOnWinLine, $isLastMove }) =>
    !$isOnWinLine &&
    $isLastMove &&
    css`
      &::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 30%;
        height: 30%;
        background-color: ${({ theme }) => theme.highlightLast};
        border-radius: 50%;
        box-shadow: 0 0 5px ${({ theme }) => theme.highlightLast};
      }
    `}
`;

// --- 컴포넌트 구현 ---

interface CellProps {
  value: Player;
  onClick: () => void;
  isGameOver: boolean;
  isLastMove: boolean;
  isOnWinLine: boolean;
  heuristicScore?: number;
  checkForbidden: () => boolean;
  isHovered?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const Cell: React.FC<CellProps> = ({
  value,
  onClick,
  isGameOver,
  isLastMove,
  isOnWinLine,
  heuristicScore,
  checkForbidden,
  isHovered,
  onMouseEnter,
  onMouseLeave,
}) => {
  const isClickable = !isGameOver && value === Player.Empty;
  const [isForbidden, setIsForbidden] = React.useState(false);

  const handleMouseEnter = () => {
    if (isClickable && checkForbidden()) {
      setIsForbidden(true);
    }
  };

  const handleMouseLeave = () => {
    setIsForbidden(false);
  };

  // 점수에 따른 색상 계산 (히트맵)
  let backgroundColor = 'transparent';
  if (heuristicScore !== undefined && value === Player.Empty) {
    if (heuristicScore > 1000) backgroundColor = 'rgba(255, 0, 0, 0.5)'; // 매우 위험/좋음
    else if (heuristicScore > 100) backgroundColor = 'rgba(255, 165, 0, 0.4)'; // 위험/좋음
    else if (heuristicScore > 10) backgroundColor = 'rgba(255, 255, 0, 0.3)'; // 보통
  }

  return (
    <CellContainer
      $clickable={isClickable}
      onClick={isClickable ? onClick : undefined}
      onMouseEnter={() => {
        handleMouseEnter();
        onMouseEnter?.();
      }}
      onMouseLeave={() => {
        handleMouseLeave();
        onMouseLeave?.();
      }}
    >
      {/* 히트맵 오버레이 */}
      {heuristicScore !== undefined && value === Player.Empty && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor,
            borderRadius: '50%',
            transform: 'scale(0.6)',
            pointerEvents: 'none',
          }}
        />
      )}
      {value !== Player.Empty && (
        <>
          <Stone $player={value} $isOnWinLine={isOnWinLine} $isLastMove={isLastMove} />
          {isLastMove && !isGameOver && <RippleEffect $player={value} />}
        </>
      )}
      {/* Ghost Stone */}
      {value === Player.Empty && isHovered && (
        <Stone
          $player={Player.Human} // 고스트 스톤은 항상 현재 플레이어(흑/백) 색상이어야 하지만, 여기선 간단히 Human(흑)으로 가정하거나 상위에서 받아와야 함.
          // 실제로는 Board에서 currentPlayer를 받아와야 정확함. 
          // 일단 투명도만 줘서 표시.
          $isOnWinLine={false}
          $isLastMove={false}
          style={{ opacity: 0.5, transform: 'translate(-50%, -50%) scale(0.9)' }}
        />
      )}
      {/* 금지수 표시 (X) */}
      {isForbidden && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: '1.5rem',
            color: 'red',
            fontWeight: 'bold',
            pointerEvents: 'none',
            zIndex: 20,
          }}
        >
          ✕
        </div>
      )}
    </CellContainer>
  );
};

export default Cell;
