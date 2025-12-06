// src/components/GameResultModal.tsx
import React from 'react';
import styled, { keyframes } from 'styled-components';
import { GameState, GameMode } from '../core/GomokuGame';

interface GameResultModalProps {
  gameState: GameState;
  gameMode: GameMode;
  moveCount: number;
  onRestart: () => void;
  onMenu: () => void;
  onReplay?: () => void;
}

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const slideUp = keyframes`
  from {
    transform: translateY(50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: ${fadeIn} 0.3s ease-out;
`;

const ModalContainer = styled.div<{ $result: 'win' | 'lose' | 'draw' }>`
  background: linear-gradient(135deg, 
    ${({ $result }) =>
    $result === 'win' ? '#4caf5033, #4caf5011' :
      $result === 'lose' ? '#f4433633, #f4433611' :
        '#ff980033, #ff980011'
  });
  border: 2px solid ${({ $result }) =>
    $result === 'win' ? '#4caf50' :
      $result === 'lose' ? '#f44336' :
        '#ff9800'
  };
  border-radius: 24px;
  padding: 48px;
  max-width: 500px;
  width: 90%;
  text-align: center;
  animation: ${slideUp} 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  
  @media (max-width: 768px) {
    padding: 32px 24px;
  }
`;

const ResultIcon = styled.div`
  font-size: 5rem;
  margin-bottom: 24px;
  filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.5));
`;

const ResultTitle = styled.h2<{ $result: 'win' | 'lose' | 'draw' }>`
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 16px;
  color: ${({ $result }) =>
    $result === 'win' ? '#4caf50' :
      $result === 'lose' ? '#f44336' :
        '#ff9800'
  };
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Stats = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 20px;
  margin: 24px 0;
  display: flex;
  justify-content: space-around;
  gap: 20px;
`;

const StatItem = styled.div`
  .label {
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.7);
    margin-bottom: 8px;
  }
  
  .value {
    font-size: 1.8rem;
    font-weight: 700;
    color: #fff;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-top: 32px;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ModalButton = styled.button<{ $primary?: boolean }>`
  padding: 14px 32px;
  font-size: 1.1rem;
  font-weight: 600;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${({ $primary }) => $primary ? 'linear-gradient(135deg, #4caf50, #45a049)' : 'rgba(255, 255, 255, 0.1)'};
  color: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
    background: ${({ $primary }) => $primary ? 'linear-gradient(135deg, #45a049, #3d8b40)' : 'rgba(255, 255, 255, 0.15)'};
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const GameResultModal: React.FC<GameResultModalProps> = ({
  gameState,
  moveCount,
  onRestart,
  onMenu,
  onReplay,
}) => {
  const getResultData = () => {
    switch (gameState) {
      case GameState.HumanWin:
        return {
          type: 'win' as const,
          icon: '🎉',
          title: '승리!',
          message: '축하합니다!'
        };
      case GameState.AIWin:
        return {
          type: 'lose' as const,
          icon: '😢',
          title: '패배',
          message: '다음엔 더 잘할 수 있어요!'
        };
      case GameState.Draw:
        return {
          type: 'draw' as const,
          icon: '🤝',
          title: '무승부',
          message: '팽팽한 대결이었습니다!'
        };
      default:
        return {
          type: 'draw' as const,
          icon: '🎮',
          title: '게임 종료',
          message: ''
        };
    }
  };

  const result = getResultData();

  return (
    <Overlay onClick={(e) => e.target === e.currentTarget && onMenu()}>
      <ModalContainer $result={result.type}>
        <ResultIcon>{result.icon}</ResultIcon>
        <ResultTitle $result={result.type}>{result.title}</ResultTitle>
        <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.8)', marginBottom: '8px' }}>
          {result.message}
        </p>

        <Stats>
          <StatItem>
            <div className="label">총 수</div>
            <div className="value">{moveCount}</div>
          </StatItem>
        </Stats>

        <ButtonGroup>
          <ModalButton $primary onClick={onRestart}>
            🔄 다시 하기
          </ModalButton>
          <ModalButton onClick={onMenu}>
            🏠 메뉴로
          </ModalButton>
          {onReplay && (
            <ModalButton onClick={onReplay} style={{ background: 'linear-gradient(135deg, #9c27b0, #7b1fa2)' }}>
              🎞 복기 하기
            </ModalButton>
          )}
        </ButtonGroup>
      </ModalContainer>
    </Overlay>
  );
};

export default GameResultModal;
