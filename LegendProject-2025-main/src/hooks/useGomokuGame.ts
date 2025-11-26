// src/hooks/useGomokuGame.ts

import { useState, useCallback } from 'react';
import { GomokuGame, Player, GameState } from '../core/GomokuGame';

export const useGomokuGame = () => {
    const [gameInstance, setGameInstance] = useState(() => new GomokuGame());
    
    const [boardState, setBoardState] = useState<Player[][]>(gameInstance.getBoardState());
    const [currentPlayer, setCurrentPlayer] = useState<Player>(gameInstance.getCurrentPlayer());
    const [gameState, setGameState] = useState<GameState>(gameInstance.getGameState());
    const [lastMove, setLastMove] = useState(gameInstance.getLastMove());
    const [winLine, setWinLine] = useState(gameInstance.getWinLine());

    const updateGameState = useCallback((game: GomokuGame) => {
        setBoardState(game.getBoardState().map(row => [...row])); 
        setCurrentPlayer(game.getCurrentPlayer());
        setGameState(game.getGameState());
        setLastMove(game.getLastMove()); 
        setWinLine(game.getWinLine());
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
    
    // ⏪ Undo 기능
    const undoMove = useCallback(() => {
        if (gameInstance.undoMove()) {
            updateGameState(gameInstance);
            return true;
        }
        return false;
    }, [gameInstance, updateGameState]);

    const restartGame = useCallback(() => {
        const newGame = new GomokuGame();
        setGameInstance(newGame);
        updateGameState(newGame);
    }, [updateGameState]);

    return {
        boardState,
        currentPlayer,
        gameState,
        handleHumanMove,
        restartGame,
        boardSize: gameInstance.getBoardSize(),
        lastMove,
        winLine,
        undoMove,
    };
};