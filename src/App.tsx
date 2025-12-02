// src/App.tsx

import React from "react";
import { useGomokuGame } from "./hooks/useGomokuGame";
import Board from "./components/Board";
import { Player, GameState } from "./core/GomokuGame";
// [Refactor] import styled from 'styled-components';

// [Refactor] Styled Components 정의 위치
// 1. Container = styled.div ...
// 2. Title = styled.h1 ...
// 3. StatusMessage = styled.div<{ $isGameOver: boolean; $gameState: GameState }> ...
// 4. RestartButton = styled.button<{ $isGameOver: boolean }> ...
// 5. UndoButton = styled.button ...

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

    // --- 스타일 정의 (미니멀리즘) ---
    // [Refactor] 아래 스타일 객체들을 모두 제거하고 Styled Components로 이동
    const appContainerStyle: React.CSSProperties = {
        fontFamily: "sans-serif",
        maxWidth: "800px",
        margin: "0 auto",
        padding: "20px",
        textAlign: "center",
    };
    const statusStyle: React.CSSProperties = {
        margin: "20px 0",
        fontSize: "24px",
        fontWeight: "bold",
        color: isGameOver
            ? gameState === GameState.HumanWin
                ? "#28a745"
                : "#dc3545"
            : "#d1d1d1",
    };
    const restartButtonStyle: React.CSSProperties = {
        padding: "10px 30px",
        fontSize: "16px",
        cursor: "pointer",
        border: "1px solid #ccc",
        backgroundColor: isGameOver ? "#007bff" : "#f8f9fa",
        color: isGameOver ? "#fff" : "#333",
        borderRadius: "5px",
        fontWeight: "bold",
    };
    const undoButtonStyle: React.CSSProperties = {
        padding: "8px 15px",
        fontSize: "14px",
        cursor: "pointer",
        border: "1px solid #ffc107",
        backgroundColor: "#ffc107",
        color: "#333",
        borderRadius: "5px",
        fontWeight: "bold",
        marginLeft: "10px",
        display:
            currentPlayer === Player.Human && !isGameOver
                ? "inline-block"
                : "none",
    };

    return (
        <div style={appContainerStyle}>
            {/* [Refactor] <Container> */}
            <h1 style={{ fontWeight: 600, letterSpacing: "2px" }}>
                {/* [Refactor] <Title> */}
                PVE GOMOKU
            </h1>

            <hr
                style={{
                    border: "none",
                    borderTop: "1px solid #eee",
                    margin: "20px 0",
                }}
            />

            <div style={statusStyle}>{getStatusMessage()}</div>
            {/* [Refactor] <StatusMessage $isGameOver={isGameOver} $gameState={gameState}> */}

            <Board
                boardState={boardState}
                boardSize={boardSize}
                onCellClick={handleHumanMove}
                isGameOver={isGameOver}
                lastMove={lastMove}
                winLine={winLine}
            />

            <div style={{ textAlign: "center" }}>
                <button onClick={restartGame} style={restartButtonStyle}>
                    {/* [Refactor] <RestartButton $isGameOver={isGameOver} onClick={restartGame}> */}
                    다시 시작하기
                </button>

                <button onClick={undoMove} style={undoButtonStyle}>
                    {/* [Refactor] <UndoButton onClick={undoMove}> */}⏪
                    되돌리기
                </button>
            </div>
        </div>
    );
};

export default App;
