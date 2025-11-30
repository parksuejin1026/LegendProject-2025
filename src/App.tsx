// src/App.tsx

import React from "react";
import { useGomokuGame } from "./hooks/useGomokuGame";
import Board from "./components/Board";
import { Player, GameState } from "./core/GomokuGame";
import styled from 'styled-components';
import Link from 'next/link';

// --- Styled Components ---

const Container = styled.div`
  font-family: 'Inter', sans-serif;
  max-width: 100%;
  min-height: 100vh;
  margin: 0 auto;
  padding: 40px 20px;
  text-align: center;
  background: linear-gradient(135deg, #1a1c20 0%, #0f1012 100%);
  color: #e0e0e0;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Header = styled.header`
  margin-bottom: 30px;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 300;
  letter-spacing: 4px;
  margin: 0;
  background: linear-gradient(to right, #fff, #a5a5a5);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-transform: uppercase;
`;

const Divider = styled.hr`
  border: none;
  height: 1px;
  background: linear-gradient(to right, transparent, #333, transparent);
  margin: 20px 0;
  width: 100%;
  max-width: 600px;
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
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 30px;
`;

const Button = styled.button<{ $primary?: boolean }>`
  padding: 12px 24px;
  font-size: 1rem;
  cursor: pointer;
  border: none;
  background: ${({ $primary }) => ($primary ? '#ffffff' : 'rgba(255, 255, 255, 0.1)')};
  color: ${({ $primary }) => ($primary ? '#0f1012' : '#ffffff')};
  border-radius: 50px;
  font-weight: 600;
  transition: all 0.2s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
    background: ${({ $primary }) => ($primary ? '#f0f0f0' : 'rgba(255, 255, 255, 0.2)')};
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const HomeLink = styled(Link)`
  position: absolute;
  top: 20px;
  left: 20px;
  color: #888;
  text-decoration: none;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: color 0.2s;

  &:hover {
    color: #fff;
  }
`;

const App: React.FC = () => {
    const {
        boardState,
        currentPlayer,
        gameState,
        handleHumanMove,
        restartGame,
        boardSize,
        lastMove,
        winLine,
        undoMove,
    } = useGomokuGame();

    const isGameOver = gameState !== GameState.Playing;

    const getStatusMessage = () => {
        switch (gameState) {
            case GameState.HumanWin:
                return "🎉 당신의 승리입니다! (흑돌)";
            case GameState.AIWin:
                return "😭 AI의 승리입니다. (백돌)";
            case GameState.Draw:
                return "🤝 무승부입니다.";
            case GameState.Playing:
            default:
                return currentPlayer === Player.Human
                    ? "▶️ 당신의 턴입니다 (흑돌)"
                    : "💻 AI의 턴입니다 (백돌)";
        }
    };

    return (
        <Container>
            <HomeLink href="/">← 메인으로</HomeLink>

            <Header>
                <Title>PVE GOMOKU</Title>
            </Header>

            <Divider />

            <StatusMessage $isGameOver={isGameOver} $gameState={gameState}>
                {getStatusMessage()}
            </StatusMessage>

            <Board
                boardState={boardState}
                boardSize={boardSize}
                onCellClick={handleHumanMove}
                isGameOver={isGameOver}
                lastMove={lastMove}
                winLine={winLine}
            />

            <ButtonGroup>
                <Button onClick={restartGame} $primary={isGameOver}>
                    {isGameOver ? '새 게임 시작' : '다시 시작하기'}
                </Button>

                {currentPlayer === Player.Human && !isGameOver && (
                    <Button onClick={undoMove}>
                        ⏪ 되돌리기
                    </Button>
                )}
            </ButtonGroup>
        </Container>
    );
};

export default App;
