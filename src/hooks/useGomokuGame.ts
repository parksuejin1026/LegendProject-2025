// src/hooks/useGomokuGame.ts

import { useState, useCallback } from 'react';
// ⬅️ 클래스 이름 및 파일명 변경
import { Player, GameState, GomokuGame } from '../core/GomokuGame';

// ⬅️ 훅 이름 변경
export const useGomokuGame = () => {
    // ⬅️ GomokuGame 클래스 사용
    const [gameInstance, setGameInstance] = useState(() => new GomokuGame());
    
    const [boardState, setBoardState] = useState<Player[][]>(gameInstance.getBoardState());
    const [currentPlayer, setCurrentPlayer] = useState<Player>(gameInstance.getCurrentPlayer());
    const [gameState, setGameState] = useState<GameState>(gameInstance.getGameState());

    const updateGameState = useCallback((game: GomokuGame) => {
        setBoardState(game.getBoardState().map(row => [...row])); 
        setCurrentPlayer(game.getCurrentPlayer());
        setGameState(game.getGameState());
    }, []);

    const handleHumanMove = useCallback((row: number, col: number) => {
        if (gameInstance.getGameState() !== GameState.Playing) return;

        const moveSuccess = gameInstance.makeMove(row, col);

        if (moveSuccess) {
            updateGameState(gameInstance);

            if (gameInstance.getCurrentPlayer() === Player.AI && gameInstance.getGameState() === GameState.Playing) {
                setTimeout(() => {
                    gameInstance.handleAIMove(); 
                    updateGameState(gameInstance);
                }, 500); 
            }
        }
    }, [gameInstance, updateGameState]);

    const restartGame = useCallback(() => {
        const newGame = new GomokuGame(); // ⬅️ GomokuGame 클래스 사용
        setGameInstance(newGame);
        updateGameState(newGame);
    }, [updateGameState]);

    return {
        boardState,
        currentPlayer,
        gameState,
        handleHumanMove,
        restartGame,
        boardSize: gameInstance.getBoardSize()
    };
};