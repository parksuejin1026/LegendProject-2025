// src/App.tsx
/**
 * 메인 애플리케이션 컴포넌트
 *
 * 이 컴포넌트는 오목 게임 애플리케이션의 진입점 역할을 합니다.
 * 헤더, 게임 보드, 상태 메시지, 제어 버튼을 포함한 게임 레이아웃을 관리합니다.
 * `useGomokuGame` 훅을 사용하여 게임 로직과 상태를 처리합니다.
 */

import React from 'react';
import { useGomokuGame } from './hooks/useGomokuGame';
import Board from './components/Board';
import { Player, GameState, GameMode } from './core/GomokuGame';
import { StoneSkinType } from './styles/theme'; // 스킨 타입 추가

import SoundManager from './core/SoundManager';
import StorageManager from './core/StorageManager';
import HistoryManager from './core/HistoryManager';
import styled, { ThemeProvider, keyframes } from 'styled-components';
import { themes, Theme } from './styles/theme';

import confetti from 'canvas-confetti';
import ParticlesBackground from './components/ParticlesBackground';
import TutorialOverlay from './components/TutorialOverlay';
import LoginModal from './components/LoginModal';
import RankingBoard from './components/RankingBoard';
import BottomNavigation from './components/BottomNavigation';
import LandingPage from './components/LandingPage';
import ProfileView from './components/ProfileView';
import GameResultModal from './components/GameResultModal';
import ModeSelection from './components/ModeSelection';
import HeaderNavigation from './components/HeaderNavigation';
import EmoteChat from './components/EmoteChat';
import GameStatus from './components/game/GameStatus'; // 리팩토링된 컴포넌트
import GameControls from './components/game/GameControls'; // 리팩토링된 컴포넌트
import ReplayControl from './components/game/ReplayControl'; // 복기 컨트롤 추가
import ChallengeSelector from './components/ChallengeSelector'; // 챌린지 선택 추가
import './core/AchievementManager'; // 업적 매니저 추가 (side-effect import if needed, otherwise remove)
import CustomThemeCreator from './components/CustomThemeCreator'; // 커스텀 테마 추가
// --- 스타일된 컴포넌트 ---

/**
 * 애플리케이션의 메인 컨테이너입니다.
 * 콘텐츠를 중앙에 배치하고 다크 테마 배경을 적용합니다.
 */
const Container = styled.div<{ theme: Theme }>`
  font-family: 'Inter', sans-serif;
  max-width: 100%;
  min-height: 100vh;
  margin: 0 auto;
  padding: 40px 20px;
  text-align: center;
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: background 0.5s ease, color 0.5s ease;
  overflow-x: hidden; // 가로 스크롤 방지

  @media (max-width: 768px) {
    padding: 20px 10px;
  }
`;

const SplitLayout = styled.div`
  display: flex;
  width: 100%;
  max-width: 1200px;
  gap: 40px;
  align-items: flex-start;
  justify-content: center;

  @media (max-width: 1024px) {
    flex-direction: column;
    align-items: center;
  }
`;

const GameSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const InfoSection = styled.div`
  flex: 1;
  width: 100%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  gap: 20px;

  @media (min-width: 1025px) {
    position: sticky;
    top: 40px;
    height: calc(100vh - 80px);
    overflow-y: auto;
    justify-content: center;
  }
`;

const DesktopHeaderNavWrapper = styled.div`
  position: absolute;
  top: 40px;
  right: 40px;

  @media (max-width: 1024px) {
    display: none;
  }
`;

const Header = styled.header`
  margin-bottom: 30px;
`;



const shimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  letter-spacing: 4px;
  margin: 0;
  background: linear-gradient(
    to right, 
    #daa520 20%, 
    #fff 50%, 
    #daa520 80%
  );
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-transform: uppercase;
  animation: ${shimmer} 3s linear infinite;
  text-shadow: 0 0 10px rgba(218, 165, 32, 0.3);

  @media (max-width: 768px) {
    font-size: 1.8rem;
    letter-spacing: 2px;
  }
`;


/**
 * App 컴포넌트
 *
 * 메인 게임 UI를 렌더링합니다.
 */

const App: React.FC = () => {
  const {
    boardState,
    currentPlayer,
    gameState,
    handleMove,
    restartGame,
    boardSize,
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
    checkForbidden,
    moveHistory, // 추가
    currentPersona,
    setPersona,
    aiMessage,
    startChallenge, // 챌린지 시작 함수
    setBoardSize, // 보드 크기 변경
  } = useGomokuGame(); // 커스텀 훅을 통해 게임 로직 사용

  const [currentTheme, setCurrentTheme] = React.useState('modern');
  const [customThemes, setCustomThemes] = React.useState<Theme[]>([]);
  const [showThemeCreator, setShowThemeCreator] = React.useState(false);

  // Load Custom Themes
  React.useEffect(() => {
    const saved = localStorage.getItem('gomoku_custom_themes');
    if (saved) {
      try {
        setCustomThemes(JSON.parse(saved));
      } catch { }
    }
  }, []);

  const handleSaveCustomTheme = (newTheme: Theme) => {
    const updated = [...customThemes, newTheme];
    setCustomThemes(updated);
    localStorage.setItem('gomoku_custom_themes', JSON.stringify(updated));
    setShowThemeCreator(false);
    // Immediately switch to new theme
    // Need to update 'themes' object? NO, 'themes' is const.
    // I should handle dynamic theme selection.
    // But ThemeProvider expects a Theme object.
    // My logic: currentTheme is a string KEY.
    // If currentTheme meets a standard key, use standard. Else look in custom array.
    setCurrentTheme(newTheme.name);
  };

  // getThemeObject Helper
  const getThemeObject = (key: string): Theme => {
    if (themes[key]) return themes[key];
    const found = customThemes.find(t => t.name === key);
    return found || themes['modern'];
  };

  const [currentSkin, setCurrentSkin] = React.useState<StoneSkinType>('standard'); // 스킨 상태
  const [isMuted, setIsMuted] = React.useState(false);
  const [stats, setStats] = React.useState({ wins: 0, losses: 0, draws: 0 });
  const [isAIThinking, setIsAIThinking] = React.useState(false);
  const [showResultModal, setShowResultModal] = React.useState(false);
  const [moveCount, setMoveCount] = React.useState(0);
  const [receivedEmote, setReceivedEmote] = React.useState<string | null>(null);
  const [replayStep, setReplayStep] = React.useState<number | null>(null); // 복기 단계 (null이면 라이브)

  // ...

  const [keyboardCursor, setKeyboardCursor] = React.useState<{ r: number, c: number } | null>(null);


  const handleSendEmote = (emote: string) => {
    // 현재는 로컬에서만 동작 (내가 보낸 이모티콘을 나도 받음)
    setReceivedEmote(emote);
    setTimeout(() => setReceivedEmote(null), 2000);
  };

  // Auth State
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = React.useState<any>(null);
  const [showLoginModal, setShowLoginModal] = React.useState(false);




  // Mobile First State
  const [activeTab, setActiveTab] = React.useState<'game' | 'rank' | 'profile'>('game');
  const [showLanding, setShowLanding] = React.useState(true);
  const [showModeSelection, setShowModeSelection] = React.useState(false);

  // Check if user is logged in or guest on mount
  React.useEffect(() => {
    // If user is already logged in (persisted), hide landing
    if (user) setShowLanding(false);
  }, [user]);

  const handleGuestPlay = () => {
    setShowLanding(false);
    setShowModeSelection(true);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleLoginSuccess = (loggedInUser: any) => {
    setUser(loggedInUser);
    setShowLanding(false);
    setShowModeSelection(true);
  };

  const handleLogout = () => {
    setUser(null);
    setShowLanding(true);
    setActiveTab('game');
  };

  const toggleMute = () => {
    const newMuteState = !isMuted;
    SoundManager.setMute(newMuteState);
    setIsMuted(newMuteState);
  };

  // 초기 마운트 시 전적 불러오기 (Hydration Error 방지) & BGM 시작
  React.useEffect(() => {
    setStats(StorageManager.getStats());

    // 사용자 인터랙션 후 BGM 재생을 위해 클릭 이벤트에 리스너 한 번 부착
    const enableAudio = () => {
      SoundManager.playBGM();
      window.removeEventListener('click', enableAudio);
    };
    window.addEventListener('click', enableAudio);

    return () => {
      SoundManager.stopBGM();
      window.removeEventListener('click', enableAudio);
    };
  }, []);

  // AI 사고 중 상태 추적
  React.useEffect(() => {
    if (gameMode === GameMode.HvAI && currentPlayer === Player.AI && gameState === GameState.Playing) {
      setIsAIThinking(true);
      const timer = setTimeout(() => setIsAIThinking(false), 500);
      return () => clearTimeout(timer);
    } else {
      setIsAIThinking(false);
    }
  }, [currentPlayer, gameMode, gameState]);



  // 게임 종료 시 효과음 재생 및 전적 저장
  React.useEffect(() => {
    if (gameState === GameState.HumanWin) {
      SoundManager.playWin();
      if (gameMode === GameMode.HvAI) StorageManager.recordWin();
      // 승리 축하 효과 (Confetti)
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'],
      });
      // 모달 표시
      setTimeout(() => setShowResultModal(true), 1000);
    } else if (gameState === GameState.AIWin) {
      SoundManager.playLose();
      if (gameMode === GameMode.HvAI) StorageManager.recordLoss();
      setTimeout(() => setShowResultModal(true), 500);
    } else if (gameState === GameState.Draw) {
      if (gameMode === GameMode.HvAI) StorageManager.recordDraw();
      setTimeout(() => setShowResultModal(true), 500);
    }
    // 게임 종료 시 전적 업데이트 (로컬 & DB)
    if (gameState !== GameState.Playing) {
      setStats(StorageManager.getStats());

      // 기록 저장
      if (gameState !== GameState.Draw) {
        HistoryManager.saveGame({
          mode: gameMode === GameMode.HvAI ? 'HvAI' : 'HvH',
          result: gameState === GameState.HumanWin ? 'win' : 'lose',
          moves: moveCount,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          difficulty: gameMode === GameMode.HvAI ? difficulty.toString() as any : undefined
        });
      } else {
        HistoryManager.saveGame({
          mode: gameMode === GameMode.HvAI ? 'HvAI' : 'HvH',
          result: 'draw',
          moves: moveCount
        });
      }

      // 로그인 상태라면 DB에도 저장
      if (user && gameMode === GameMode.HvAI) {
        let result = '';
        if (gameState === GameState.HumanWin) result = 'win';
        else if (gameState === GameState.AIWin) result = 'loss';
        else if (gameState === GameState.Draw) result = 'draw';

        if (result) {
          fetch('/api/game/result', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: user.id,
              result,
              mode: gameMode === GameMode.HvAI ? 'pve' : 'pvp'
            }),
          }).catch(console.error);
        }
      }
    }
  }, [gameState, gameMode, user, moveCount, difficulty]);



  // 게임 종료 여부 확인 (승리 또는 무승부)
  const isGameOver = gameState !== GameState.Playing;

  /**
   * 현재 게임 상태에 따른 상태 메시지를 반환합니다.
   */
  // ...


  // 복기용 보드 상태 생성
  const getDisplayBoard = () => {
    if (!isGameOver || replayStep === null) return boardState;

    // 히스토리 기반으로 보드 재구성
    const newBoard = Array(boardSize).fill(null).map(() => Array(boardSize).fill(Player.Empty));
    for (let i = 0; i < replayStep; i++) {
      const move = moveHistory[i];
      if (move) newBoard[move.row][move.col] = move.player;
    }
    return newBoard;
  };

  const displayBoardState = getDisplayBoard();
  const displayLastMove = isGameOver && replayStep !== null && replayStep > 0
    ? moveHistory[replayStep - 1]
    : lastMove;

  // 타이머 (Blitz 모드: 각자 3분 = 180초)
  const [isBlitz] = React.useState(false);
  const [blackTime, setBlackTime] = React.useState(180);
  const [whiteTime, setWhiteTime] = React.useState(180);
  const [gameStarted, setGameStarted] = React.useState(false);

  React.useEffect(() => {
    if (gameState !== GameState.Playing || !isBlitz) {
      setGameStarted(false); // 게임이 끝나거나 블리츠가 아니면 타이머 멈춤
      return;
    }

    if (!gameStarted) return; // 첫 수 두기 전엔 타이머 안 감

    const timer = setInterval(() => {
      if (currentPlayer === Player.Human) { // 흑(Human)
        setBlackTime(prev => {
          if (prev <= 0) {
            clearInterval(timer);
            alert('시간 초과! 패배했습니다.');
            restartGame(); // 또는 GameState.AIWin 처리
            return 0;
          }
          return prev - 1;
        });
      } else { // 백(AI)
        setWhiteTime(prev => {
          if (prev <= 0) {
            clearInterval(timer);
            alert('시간 초과! 승리했습니다.');
            restartGame();
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [currentPlayer, gameState, gameStarted, isBlitz, restartGame]);

  // 게임 재시작 시 시간 초기화
  React.useEffect(() => {
    setBlackTime(180);
    setWhiteTime(180);
  }, [winLine]); // winLine이 null로 (초기화) 바뀌는 시점을 감지하거나 restartGame 함수 내에서 초기화해야 함.
  // restartGame 함수 수정이 어려우므로 App 내에서 감지.


  // 키보드 단축키
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 입력 폼 등에서는 동작하지 않도록 예외 처리
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (isGameOver) {
        if (e.code === 'KeyR') restartGame();
        return;
      }

      switch (e.code) {
        case 'ArrowUp':
          setKeyboardCursor(prev => {
            const r = prev ? Math.max(0, prev.r - 1) : Math.floor(boardSize / 2);
            const c = prev ? prev.c : Math.floor(boardSize / 2);
            return { r, c };
          });
          break;
        case 'ArrowDown':
          setKeyboardCursor(prev => {
            const r = prev ? Math.min(boardSize - 1, prev.r + 1) : Math.floor(boardSize / 2);
            const c = prev ? prev.c : Math.floor(boardSize / 2);
            return { r, c };
          });
          break;
        case 'ArrowLeft':
          setKeyboardCursor(prev => {
            const r = prev ? prev.r : Math.floor(boardSize / 2);
            const c = prev ? Math.max(0, prev.c - 1) : Math.floor(boardSize / 2);
            return { r, c };
          });
          break;
        case 'ArrowRight':
          setKeyboardCursor(prev => {
            const r = prev ? prev.r : Math.floor(boardSize / 2);
            const c = prev ? Math.min(boardSize - 1, prev.c + 1) : Math.floor(boardSize / 2);
            return { r, c };
          });
          break;
        case 'Enter':
        case 'Space':
          e.preventDefault();
          if (keyboardCursor) {
            handleMove(keyboardCursor.r, keyboardCursor.c);
          }
          break;
        case 'KeyR': // R: 재시작
          if (isGameOver) restartGame();
          break;
        case 'KeyZ': // Ctrl+Z: 되돌리기
          if (e.ctrlKey || e.metaKey) {
            if (currentPlayer === Player.Human && !isGameOver) undoMove();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGameOver, currentPlayer, restartGame, undoMove, boardSize, handleMove, keyboardCursor]);

  if (showLanding) {
    return (
      <ThemeProvider theme={getThemeObject(currentTheme)}>
        <LandingPage
          onLoginSuccess={handleLoginSuccess}
          onGuestClick={handleGuestPlay}
        />
        {showLoginModal && (
          <LoginModal
            onClose={() => setShowLoginModal(false)}
            onLoginSuccess={handleLoginSuccess}
          />
        )}
      </ThemeProvider>
    );
  }

  // 모드 선택 화면
  if (showModeSelection) {
    return (
      <ThemeProvider theme={getThemeObject(currentTheme)}>
        <ModeSelection
          onSelectMode={(mode) => {
            setGameMode(mode);
            setShowModeSelection(false);
            setActiveTab('game');
          }}
        />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={getThemeObject(currentTheme)}>
      <ParticlesBackground />
      <TutorialOverlay />
      <Container>
        <DesktopHeaderNavWrapper>
          <HeaderNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        </DesktopHeaderNavWrapper>

        {activeTab === 'game' ? (
          <SplitLayout>
            <GameSection>
              <Header style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <Title>LEGEND GOMOKU</Title>
                <button
                  onClick={toggleMute}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '1.5rem',
                    padding: '5px',
                    opacity: 0.8,
                    transition: 'transform 0.2s'
                  }}
                  title={isMuted ? "소리 켜기" : "음소거"}
                >
                  {isMuted ? '🔇' : '🔊'}
                </button>
              </Header>

              {gameMode === GameMode.Challenge && moveCount === 0 && !isGameOver ? (
                <ChallengeSelector
                  onSelectChallenge={(challenge) => {
                    startChallenge(challenge.initialStones);
                    setMoveCount(challenge.initialStones.length);
                  }}
                  onBack={() => {
                    setGameMode(GameMode.HvAI);
                    setShowModeSelection(true);
                  }}
                />
              ) : (
                <>
                  <Board
                    boardState={displayBoardState}
                    boardSize={boardSize}
                    skin={currentSkin} // 스킨 전달
                    onCellClick={(r, c) => {
                      if (replayStep !== null) return;
                      // Online Mode logic removed
                      if (!gameStarted) setGameStarted(true);
                      handleMove(r, c);
                      setMoveCount((prev) => prev + 1);
                    }}
                    isGameOver={isGameOver}
                    winLine={replayStep === null || replayStep === moveHistory.length ? winLine : null}
                    lastMove={displayLastMove}
                    heuristicMap={replayStep === null ? heuristicMap : null}
                    checkForbidden={
                      gameMode === GameMode.HvH && replayStep === null ? checkForbidden : () => false
                    }
                  />
                </>
              )}
              {/* 이모션 채팅 컴포넌트 추가 */}
              {/* 이모션 채팅 컴포넌트 메아리 */}
              <EmoteChat onSendEmote={handleSendEmote} receivedEmote={receivedEmote} />

              {/* AI Message Bubble */}
              {aiMessage && (
                <div style={{
                  position: 'absolute',
                  top: '20%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'rgba(255, 255, 255, 0.95)',
                  color: '#333',
                  padding: '15px 25px',
                  borderRadius: '20px',
                  boxShadow: '0 5px 20px rgba(0,0,0,0.2)',
                  zIndex: 100,
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  border: '2px solid #333',
                  pointerEvents: 'none',
                  animation: 'popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                }}>
                  <div style={{ position: 'absolute', bottom: '-10px', left: '50%', marginLeft: '-10px', width: 0, height: 0, borderLeft: '10px solid transparent', borderRight: '10px solid transparent', borderTop: '10px solid #333' }}></div>
                  {/* 아이콘 표시 */}
                  <span style={{ marginRight: '8px', fontSize: '1.5rem' }}>
                    {currentPersona === 'aggressive' ? '🐯' : currentPersona === 'defensive' ? '🐢' : currentPersona === 'trickster' ? '🦊' : '🤖'}
                  </span>
                  {aiMessage}
                </div>
              )}
            </GameSection>

            <InfoSection>
              <GameStatus
                gameState={gameState}
                gameMode={gameMode}
                currentPlayer={currentPlayer}
                isGameOver={isGameOver}
                isAIThinking={isAIThinking}
                timeLeft={isBlitz ? (currentPlayer === Player.Human ? blackTime : whiteTime) : -1}
              />
              {isBlitz && (
                <div style={{
                  marginTop: '10px',
                  padding: '10px',
                  background: 'rgba(0,0,0,0.5)',
                  borderRadius: '8px',
                  display: 'flex',
                  justifyContent: 'space-around',
                  fontWeight: 'bold',
                  color: '#fff'
                }}>
                  <span style={{ color: currentPlayer === Player.Human ? '#FFD700' : '#fff' }}>
                    My Time: {Math.floor(blackTime / 60)}:{String(blackTime % 60).padStart(2, '0')}
                  </span>
                  <span style={{ color: currentPlayer === Player.AI ? '#FFD700' : '#fff' }}>
                    AI Time: {Math.floor(whiteTime / 60)}:{String(whiteTime % 60).padStart(2, '0')}
                  </span>
                </div>
              )}
              {isGameOver ? (
                <ReplayControl
                  currentStep={replayStep ?? moveHistory.length}
                  totalSteps={moveHistory.length}
                  onStepChange={setReplayStep}
                  onExit={() => {
                    setReplayStep(null);
                    restartGame();
                  }}
                />
              ) : (
                <GameControls
                  gameMode={gameMode}
                  difficulty={difficulty}
                  setDifficulty={setDifficulty}
                  isGameOver={isGameOver}
                  currentPlayer={currentPlayer}
                  onRestart={restartGame}
                  onUndo={undoMove}
                  onMobileAction={() => handleMove(boardSize - 1, boardSize - 1)}
                />
              )}
            </InfoSection>
          </SplitLayout>
        ) : activeTab === 'rank' ? (
          <RankingBoard />
        ) : (
          <ProfileView
            user={user}
            stats={stats}
            currentTheme={currentTheme}
            onThemeChange={setCurrentTheme}
            currentSkin={currentSkin} // 스킨 전달
            onSkinChange={setCurrentSkin} // 스킨 변경 핸들러 전달
            isMuted={isMuted}
            onMuteToggle={toggleMute}
            showHeatmap={showHeatmap}
            onHeatmapToggle={toggleHeatmap}
            onLogout={handleLogout}
            onLoginClick={() => setShowLoginModal(true)}
            currentPersona={currentPersona}
            onPersonaChange={setPersona}
            currentBoardSize={boardSize}
            onBoardSizeChange={setBoardSize}
            customThemes={customThemes}
            onCreateTheme={() => setShowThemeCreator(true)}
          />
        )}

        {showThemeCreator && (
          <CustomThemeCreator
            onSave={handleSaveCustomTheme}
            onCancel={() => setShowThemeCreator(false)}
          />
        )}

        {errorMessage && (
          <div
            style={{
              position: 'fixed',
              bottom: '80px',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: 'rgba(255, 68, 68, 0.9)',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              zIndex: 1000,
            }}
          >
            {errorMessage}
          </div>
        )}

        {showLoginModal && (
          <LoginModal
            onClose={() => setShowLoginModal(false)}
            onLoginSuccess={handleLoginSuccess}
          />
        )}

        {/* 게임 결과 모달 */}
        {showResultModal && isGameOver && (
          <GameResultModal
            gameState={gameState}
            gameMode={gameMode} // 모드 전달
            moveCount={moveCount}
            onRestart={() => {
              setShowResultModal(false);
              setMoveCount(0);
              setReplayStep(null);
              restartGame();
            }}
            onMenu={() => {
              setShowResultModal(false);
              setMoveCount(0);
              setReplayStep(null);
              restartGame(); // 모달의 메뉴 버튼은 현재 재시작과 동일 (추후 변경 가능)
            }}
            onReplay={() => {
              setShowResultModal(false);
              setReplayStep(moveHistory.length); // 복기 시작 (마지막 수부터)
            }}
          />
        )}

        <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      </Container>
    </ThemeProvider>
  );
};

export default App;
