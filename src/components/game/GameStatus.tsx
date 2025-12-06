import React from 'react';
import styled, { keyframes } from 'styled-components';
import { GameState, GameMode, Player } from '../../core/GomokuGame';

const pulse = keyframes`
  0% { transform: scale(1); box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
  50% { transform: scale(1.05); box-shadow: 0 8px 12px rgba(0, 0, 0, 0.2); }
  100% { transform: scale(1); box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
`;

const StatusMessage = styled.div<{ $isGameOver: boolean; $gameState: GameState }>`
  margin: 20px 0;
  font-size: 1.5rem;
  font-weight: 600;
  padding: 10px 20px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(5px);
  color: ${({ $isGameOver, $gameState }) => {
        if (!$isGameOver) return '#e0e0e0';
        return $gameState === GameState.HumanWin ? '#4caf50' : '#f44336';
    }};
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  animation: ${pulse} 0.5s ease-in-out;
`;

const TimerContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  margin-top: 10px;
`;

const CircularTimer = styled.div<{ $percentage: number; $isUrgent: boolean }>`
  position: relative;
  width: 60px;
  height: 60px;
  
  svg {
    transform: rotate(-90deg);
    
    circle {
      fill: none;
      stroke-width: 4;
      
      &.background {
        stroke: rgba(255, 255, 255, 0.1);
      }
      
      &.progress {
        stroke: ${({ $isUrgent }) => $isUrgent ? '#ff4444' : '#4caf50'};
        stroke-linecap: round;
        stroke-dasharray: ${2 * Math.PI * 26};
        stroke-dashoffset: ${({ $percentage }) => 2 * Math.PI * 26 * (1 - $percentage / 100)};
        transition: stroke-dashoffset 1s linear, stroke 0.3s ease;
        filter: ${({ $isUrgent }) => $isUrgent ? 'drop-shadow(0 0 8px #ff4444)' : 'none'};
      }
    }
  }
  
  .timer-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 1.2rem;
    font-weight: 700;
    color: ${({ $isUrgent }) => $isUrgent ? '#ff4444' : '#fff'};
    animation: ${({ $isUrgent }) => $isUrgent ? pulse : 'none'} 1s ease-in-out infinite;
  }
`;

const thinkingDots = keyframes`
  0%, 20% { content: '.'; }
  40% { content: '..'; }
  60%, 100% { content: '...'; }
`;

const AIThinkingIndicator = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(33, 150, 243, 0.2);
  border-radius: 20px;
  border: 1px solid rgba(33, 150, 243, 0.4);
  font-size: 0.9rem;
  color: #2196f3;
  
  &::after {
    content: '...';
    animation: ${thinkingDots} 1.5s infinite;
    display: inline-block;
    width: 20px;
  }
`;

interface GameStatusProps {
    gameState: GameState;
    gameMode: GameMode;
    currentPlayer: Player;
    isGameOver: boolean;
    isAIThinking: boolean;
    timeLeft: number;
}

const GameStatus: React.FC<GameStatusProps> = ({
    gameState,
    gameMode,
    currentPlayer,
    isGameOver,
    isAIThinking,
    timeLeft
}) => {

    const getStatusMessage = () => {
        switch (gameState) {
            case GameState.HumanWin:
                return '🎉 당신의 승리입니다! (흑돌)';
            case GameState.AIWin:
                return '😭 AI의 승리입니다. (백돌)';
            case GameState.Draw:
                return '🤝 무승부입니다.';
            case GameState.Playing:
            default:
                if (gameMode === GameMode.HvH) {
                    return currentPlayer === Player.Human
                        ? '▶️ 흑돌(Player 1)의 턴입니다'
                        : '▶️ 백돌(Player 2)의 턴입니다';
                }
                return currentPlayer === Player.Human
                    ? '▶️ 당신의 턴입니다 (흑돌)'
                    : '💻 AI의 턴입니다 (백돌)';
        }
    };

    return (
        <StatusMessage
            $isGameOver={isGameOver}
            $gameState={gameState}
            key={currentPlayer}
        >
            {getStatusMessage()}
            {isAIThinking && gameMode === GameMode.HvAI && (
                <div style={{ marginTop: '10px' }}>
                    <AIThinkingIndicator>🤖 AI 사고 중</AIThinkingIndicator>
                </div>
            )}
            {gameState === GameState.Playing && !isAIThinking && timeLeft >= 0 && (
                <TimerContainer>
                    <CircularTimer
                        $percentage={(timeLeft / 30) * 100}
                        $isUrgent={timeLeft < 10}
                    >
                        <svg width="60" height="60">
                            <circle className="background" cx="30" cy="30" r="26" />
                            <circle className="progress" cx="30" cy="30" r="26" />
                        </svg>
                        <div className="timer-text">{timeLeft}</div>
                    </CircularTimer>
                    <span
                        style={{
                            fontSize: '0.9em',
                            color: timeLeft < 10 ? '#ff4444' : '#aaa',
                        }}
                    >
                        {timeLeft < 10 ? '⚠️ 서두르세요!' : '남은 시간'}
                    </span>
                </TimerContainer>
            )}
        </StatusMessage>
    );
};

export default GameStatus;
