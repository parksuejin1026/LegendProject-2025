import React from 'react';
import styled from 'styled-components';
import { GameMode, Difficulty, Player } from '../../core/GomokuGame';
import { Theme } from '../../styles/theme';

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 30px;
  padding-bottom: 100px; /* 하단 탭바 공간 확보 */

  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
    max-width: 300px;
  }
`;

const DifficultyGroup = styled.div`
  display: flex;
  gap: 8px;
  justify-content: center;
  margin-bottom: 20px;
`;

const Button = styled.button<{ $primary?: boolean; theme: Theme }>`
  padding: 12px 24px;
  font-size: 1rem;
  cursor: pointer;
  border: none;
  background: ${({ $primary, theme }) => ($primary ? theme.text : theme.buttonBg)};
  color: ${({ $primary, theme }) => ($primary ? theme.background : theme.buttonText)};
  border-radius: 50px;
  font-weight: 600;
  transition: all 0.2s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
    background: ${({ $primary, theme }) => ($primary ? theme.text : theme.buttonHover)};
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const MobileButton = styled(Button)`
  display: none;
  @media (max-width: 768px) {
    display: inline-block;
    margin-left: 10px;
  }
`;

interface GameControlsProps {
    gameMode: GameMode;
    difficulty: Difficulty;
    setDifficulty: (difficulty: Difficulty) => void;
    isGameOver: boolean;
    currentPlayer: Player;
    onRestart: () => void;
    onUndo: () => void;
    onMobileAction?: () => void;
}

const GameControls: React.FC<GameControlsProps> = ({
    gameMode,
    difficulty,
    setDifficulty,
    isGameOver,
    currentPlayer,
    onRestart,
    onUndo,
    onMobileAction
}) => {
    return (
        <>
            {/* 난이도 선택 (HvAI 모드일 때만) */}
            {gameMode === GameMode.HvAI && (
                <DifficultyGroup>
                    <Button
                        $primary={difficulty === Difficulty.Easy}
                        onClick={() => setDifficulty(Difficulty.Easy)}
                        style={{ fontSize: '0.9rem', padding: '8px 16px' }}
                    >
                        🐣 쉬움
                    </Button>
                    <Button
                        $primary={difficulty === Difficulty.Medium}
                        onClick={() => setDifficulty(Difficulty.Medium)}
                        style={{ fontSize: '0.9rem', padding: '8px 16px' }}
                    >
                        🐥 보통
                    </Button>
                    <Button
                        $primary={difficulty === Difficulty.Hard}
                        onClick={() => setDifficulty(Difficulty.Hard)}
                        style={{ fontSize: '0.9rem', padding: '8px 16px' }}
                    >
                        🦅 어려움
                    </Button>
                </DifficultyGroup>
            )}

            <ButtonGroup>
                <Button onClick={onRestart} $primary={isGameOver}>
                    {isGameOver ? '새 게임 시작' : '다시 시작하기 (R)'}
                </Button>
                {currentPlayer === Player.Human && !isGameOver && (
                    <>
                        <Button onClick={onUndo}>⏪ 되돌리기 (Ctrl+Z)</Button>
                        {onMobileAction && (
                            <MobileButton onClick={onMobileAction}>
                                착수
                            </MobileButton>
                        )}
                    </>
                )}
            </ButtonGroup>
        </>
    );
};

export default GameControls;
