// src/hooks/useGomokuGame.ts
/**
 * Gomoku 게임 로직을 React 컴포넌트에서 쉽게 사용할 수 있도록 래핑한 커스텀 Hook입니다.
 * 게임 인스턴스를 생성하고 상태를 동기화합니다.
 */

import { useState, useCallback } from 'react';
import { GomokuGame, Player, GameState, GameMode, Difficulty } from '../core/GomokuGame';

export const useGomokuGame = () => {
  const [gameInstance, setGameInstance] = useState(() => new GomokuGame());

  const [boardState, setBoardState] = useState<Player[][]>(gameInstance.getBoardState());
  const [currentPlayer, setCurrentPlayer] = useState<Player>(gameInstance.getCurrentPlayer());
  const [gameState, setGameState] = useState<GameState>(gameInstance.getGameState());
  const [gameMode, setGameModeState] = useState<GameMode>(gameInstance.getGameMode());
  const [difficulty, setDifficultyState] = useState<Difficulty>(Difficulty.Easy);
  const [lastMove, setLastMove] = useState(gameInstance.getLastMove());
  const [winLine, setWinLine] = useState(gameInstance.getWinLine());
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [heuristicMap, setHeuristicMap] = useState<number[][] | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 게임 상태를 React 상태로 동기화하는 함수
  // GomokuGame 인스턴스의 내부 상태를 React state로 복사하여 UI 업데이트를 트리거합니다.
  const updateGameState = useCallback((game: GomokuGame) => {
    setBoardState(game.getBoardState().map((row) => [...row])); // 2차원 배열 깊은 복사
    setCurrentPlayer(game.getCurrentPlayer());
    setGameState(game.getGameState());
    setGameModeState(game.getGameMode());
    setLastMove(game.getLastMove());
    setWinLine(game.getWinLine());
    if (showHeatmap) {
      setHeuristicMap(game.getHeuristicMap());
    }
  }, [showHeatmap]);

  const handleMove = useCallback(
    (row: number, col: number, isRemote: boolean = false) => {
      // 게임 중이 아니면 무시 (단, 리모트 무브는 강제 적용 가능성을 열어둠)
      if (gameInstance.getGameState() !== GameState.Playing && !isRemote) return;

      // 착수 시도
      const moveSuccess = gameInstance.makeMove(row, col);

      if (moveSuccess) {
        setErrorMessage(null); // 성공 시 에러 메시지 초기화
        updateGameState(gameInstance); // UI 업데이트

        // AI 턴일 경우, 약간의 지연 후 AI 착수 실행 (HvAI 모드일 때만)
        if (
          gameInstance.getGameMode() === GameMode.HvAI &&
          gameInstance.getCurrentPlayer() === Player.AI &&
          gameInstance.getGameState() === GameState.Playing
        ) {
          // 30초 타임아웃 로직 적용
          const aiMoveTimer = setTimeout(() => {
            try {
              gameInstance.handleAIMove();
              updateGameState(gameInstance);
            } catch (e) {
              // 에러 발생 시 (혹은 타임아웃 시뮬레이션) 랜덤 착수
              console.error("AI Error", e);
            }
          }, 500);

          // 타임아웃 안전장치 (30초)
          const timeoutTimer = setTimeout(() => {
            if (gameInstance.getCurrentPlayer() === Player.AI && gameInstance.getGameState() === GameState.Playing) {
              console.warn("AI Timeout forced.");
              // 랜덤 착수
              const size = gameInstance.getBoardSize();
              let r, c;
              let attempts = 0;
              do {
                r = Math.floor(Math.random() * size);
                c = Math.floor(Math.random() * size);
                attempts++;
              } while (gameInstance.getBoardState()[r][c] !== Player.Empty && attempts < 100);

              if (attempts < 100) {
                gameInstance.makeMove(r, c);
                updateGameState(gameInstance);
              }
            }
          }, 30000);

          return () => {
            clearTimeout(aiMoveTimer);
            clearTimeout(timeoutTimer);
          };
        }
      } else {
        // 착수 실패 (금지수 등)
        if (
          gameInstance.getCurrentPlayer() === Player.Human &&
          gameInstance.checkForbiddenMove(row, col, Player.Human)
        ) {
          setErrorMessage('🚫 금지수입니다! (3-3, 4-4, 6목 이상)');
          setTimeout(() => setErrorMessage(null), 2000); // 2초 후 사라짐
        }
      }
    },
    [gameInstance, updateGameState]
  );



  // ⏪ Undo 기능
  const undoMove = useCallback(() => {
    if (gameInstance.undoMove()) {
      updateGameState(gameInstance);
      return true;
    }
    return false;
  }, [gameInstance, updateGameState]);

  // 게임 재시작
  const restartGame = useCallback(() => {
    const newGame = new GomokuGame();
    newGame.setGameMode(gameMode); // 현재 모드 유지
    newGame.setDifficulty(difficulty); // 현재 난이도 유지
    setGameInstance(newGame);
    updateGameState(newGame);
  }, [gameMode, difficulty, updateGameState]);

  // 게임 모드 변경
  const setGameMode = useCallback(
    (mode: GameMode) => {
      const newGame = new GomokuGame();
      newGame.setGameMode(mode);
      newGame.setDifficulty(difficulty);
      setGameInstance(newGame);
      updateGameState(newGame);
    },
    [difficulty, updateGameState]
  );

  // 난이도 변경
  const setDifficulty = useCallback(
    (diff: Difficulty) => {
      const newGame = new GomokuGame();
      newGame.setGameMode(gameMode);
      newGame.setDifficulty(diff);
      setDifficultyState(diff);
      setGameInstance(newGame);
      updateGameState(newGame);
    },
    [gameMode, updateGameState]
  );

  // Heatmap 토글
  const toggleHeatmap = useCallback(() => {
    setShowHeatmap((prev) => {
      const next = !prev;
      if (next) {
        setHeuristicMap(gameInstance.getHeuristicMap());
      } else {
        setHeuristicMap(null);
      }
      return next;
    });
  }, [gameInstance]);

  return {
    boardState,
    setBoardState, // 소켓 업데이트를 위해 노출
    currentPlayer,
    gameState,
    handleMove, // 이름 변경
    restartGame,
    boardSize: gameInstance.getBoardSize(),
    lastMove,
    winLine,
    undoMove,
    gameMode,
    setGameMode,
    difficulty,
    setDifficulty,
    showHeatmap,
    toggleHeatmap,
    heuristicMap,
    errorMessage,
    checkForbidden: (row: number, col: number) => gameInstance.checkForbiddenMove(row, col, currentPlayer),
  };
};
