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
import { Theme, StoneSkinType, stoneSkins } from '../styles/theme';

// --- Styled Components 정의 ---



const dropIn = keyframes`
  0% {
    transform: translate(-50%, -50%) scale(1.5);
    opacity: 0;
  }
  50% {
    transform: translate(-50%, -50%) scale(0.9);
    opacity: 1;
  }
  75% {
    transform: translate(-50%, -50%) scale(1.1);
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
  $skin: StoneSkinType;
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

  background: ${({ $player, $skin }) => {
    if ($player === Player.Empty) return 'transparent';
    const skin = stoneSkins[$skin];
    return $player === Player.Human ? skin.black : skin.white;
  }};

  box-shadow: ${({ $player, $skin }) => {
    if ($player === Player.Empty) return 'none';
    return stoneSkins[$skin].shadow;
  }};

  ${({ $isOnWinLine }) =>
    $isOnWinLine &&
    css`
      /* 사용자의 요청으로 승리 시 돌 위의 노란 원(하이라이트) 효과 제거 */
      /* z-index만 높여서 라인 위에 올라오게 할지 여부는 선택사항이나, 일단 효과 없음 */
      z-index: 15;
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
        width: 40%;
        height: 40%;
        background-color: transparent;
        border: 3px solid ${({ theme }) => theme.highlightLast};
        /* 삼각형 모양 (clip-path 사용 시 border와 충돌하므로 단순 원형 테두리 또는 다른 방식 고려) */
        /* 여기서는 가시성 높은 붉은 점/삼각형 등을 고려. */
        /* 단순하고 깔끔하게: 붉은 점 */
        width: 30%;
        height: 30%;
        background-color: ${({ theme }) => theme.highlightLast};
        border: 2px solid #fff;
        border-radius: 50%;
        box-shadow: 0 0 8px ${({ theme }) => theme.highlightLast};
        z-index: 20;
      }
    `}
`;

interface CellProps {
  value: Player;
  currentPlayer: Player; // 추가
  onClick: () => void;
  isGameOver: boolean;
  isLastMove: boolean;
  isOnWinLine: boolean;
  heuristicScore?: number;
  checkForbidden: () => boolean;
  isHovered?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  skin?: StoneSkinType;
}

const Cell: React.FC<CellProps> = ({
  value,
  currentPlayer,
  onClick,
  isGameOver,
  isLastMove,
  isOnWinLine,
  heuristicScore,
  checkForbidden,
  isHovered,
  onMouseEnter,
  onMouseLeave,
  skin = 'standard',
}) => {
  // ... (unchanged logic) ...
  const isClickable = !isGameOver && value === Player.Empty;
  const [isForbidden, setIsForbidden] = React.useState(false);

  // ... (handleMouseEnter/Leave, backgroundColor logic) ...

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
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <Stone $player={value} $isOnWinLine={isOnWinLine} $isLastMove={isLastMove} $skin={skin} theme={{} as any} />
          {isLastMove && !isGameOver && <RippleEffect $player={value} />}
        </>
      )}
      {/* Ghost Stone */}
      {value === Player.Empty && isHovered && !isForbidden && (
        <Stone
          $player={currentPlayer} // 현재 플레이어 색상 적용
          $isOnWinLine={false}
          $isLastMove={false}
          $skin={skin}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          theme={{} as any}
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
