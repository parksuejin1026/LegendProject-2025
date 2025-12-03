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
import { Player, GameState, GameMode, Difficulty } from './core/GomokuGame';
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

  @media (max-width: 768px) {
    padding: 20px 10px;
  }
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

  @media (max-width: 768px) {
    font-size: 1.8rem;
    letter-spacing: 2px;
  }
`;



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




/**
 * App 컴포넌트
 *
 * 메인 게임 UI를 렌더링합니다.
 */
const MobileButton = styled(Button)`
  display: none;
  @media (max-width: 768px) {
    display: inline-block;
    margin-left: 10px;
  }
`;

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
  } = useGomokuGame(); // 커스텀 훅을 통해 게임 로직 사용

  const [currentTheme, setCurrentTheme] = React.useState('modern');
  const [isMuted, setIsMuted] = React.useState(false);
  const [stats, setStats] = React.useState({ wins: 0, losses: 0, draws: 0 });
  const [isAIThinking, setIsAIThinking] = React.useState(false);
  const [showResultModal, setShowResultModal] = React.useState(false);
  const [moveCount, setMoveCount] = React.useState(0);

  // Auth State
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

  // 초기 마운트 시 전적 불러오기 (Hydration Error 방지)
  React.useEffect(() => {
    setStats(StorageManager.getStats());
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
          return currentPlayer === Player.Human
            ? '▶️ 흑돌(Player 1)의 턴입니다'
            : '▶️ 백돌(Player 2)의 턴입니다';
        }
        return currentPlayer === Player.Human
          ? '▶️ 당신의 턴입니다 (흑돌)'
          : '💻 AI의 턴입니다 (백돌)';
    }
  };

  // 타이머 (간단한 구현)
  const [timeLeft, setTimeLeft] = React.useState(30);
  const [gameStarted, setGameStarted] = React.useState(false);

  React.useEffect(() => {
    if (gameState !== GameState.Playing) {
      setGameStarted(false);
      return;
    }
    if (gameStarted) {
      setTimeLeft(30); // 턴 변경 시 초기화
    }
  }, [currentPlayer, gameState, gameStarted]);

  React.useEffect(() => {
    if (gameState !== GameState.Playing || !gameStarted) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [gameState, gameStarted]);

  if (showLanding) {
    return (
      <ThemeProvider theme={themes[currentTheme]}>
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
      <ThemeProvider theme={themes[currentTheme]}>
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
    <ThemeProvider theme={themes[currentTheme]}>
      <ParticlesBackground />
      <TutorialOverlay />
      <Container>
        {activeTab === 'game' && (
          <>
            <Header>
              <Title>LEGEND GOMOKU</Title>
            </Header>

            <StatusMessage $isGameOver={isGameOver} $gameState={gameState} key={currentPlayer}>
              {getStatusMessage()}
              {isAIThinking && gameMode === GameMode.HvAI && (
                <div style={{ marginTop: '10px' }}>
                  <AIThinkingIndicator>🤖 AI 사고 중</AIThinkingIndicator>
                </div>
              )}
              {gameState === GameState.Playing && !isAIThinking && (
                <TimerContainer>
                  <CircularTimer $percentage={(timeLeft / 30) * 100} $isUrgent={timeLeft < 10}>
                    <svg width="60" height="60">
                      <circle className="background" cx="30" cy="30" r="26" />
                      <circle className="progress" cx="30" cy="30" r="26" />
                    </svg>
                    <div className="timer-text">{timeLeft}</div>
                  </CircularTimer>
                  <span style={{ fontSize: '0.9em', color: timeLeft < 10 ? '#ff4444' : '#aaa' }}>
                    {timeLeft < 10 ? '⚠️ 서두르세요!' : '남은 시간'}
                  </span>
                </TimerContainer>
              )}
            </StatusMessage>

            {/* 난이도 선택 (HvAI 모드일 때만) */}
            {gameMode === GameMode.HvAI && (
              <DifficultyGroup>
                <Button $primary={difficulty === Difficulty.Easy} onClick={() => setDifficulty(Difficulty.Easy)} style={{ fontSize: '0.9rem', padding: '8px 16px' }}>🐣 쉬움</Button>
                <Button $primary={difficulty === Difficulty.Medium} onClick={() => setDifficulty(Difficulty.Medium)} style={{ fontSize: '0.9rem', padding: '8px 16px' }}>🐥 보통</Button>
                <Button $primary={difficulty === Difficulty.Hard} onClick={() => setDifficulty(Difficulty.Hard)} style={{ fontSize: '0.9rem', padding: '8px 16px' }}>🦅 어려움</Button>
              </DifficultyGroup>
            )}

            <Board
              boardState={boardState}
              boardSize={boardSize}
              onCellClick={(r, c) => {
                if (!gameStarted) setGameStarted(true);
                handleMove(r, c);
                setMoveCount(prev => prev + 1);
              }}
              isGameOver={isGameOver}
              winLine={winLine}
              lastMove={lastMove}
              heuristicMap={heuristicMap}
              checkForbidden={
                gameMode === GameMode.HvH
                  ? checkForbidden
                  : () => false
              }
            />



            <ButtonGroup>
              <Button onClick={restartGame} $primary={isGameOver}>
                {isGameOver ? '새 게임 시작' : '다시 시작하기'}
              </Button>
              {currentPlayer === Player.Human && !isGameOver && (
                <>
                  <Button onClick={undoMove}>⏪ 되돌리기</Button>
                  <MobileButton onClick={() => handleMove(boardSize - 1, boardSize - 1)}>착수</MobileButton>
                </>
              )}
            </ButtonGroup>
          </>
        )}

        {activeTab === 'rank' && <RankingBoard />}

        {activeTab === 'profile' && (
          <ProfileView
            user={user}
            stats={stats}
            currentTheme={currentTheme}
            onThemeChange={setCurrentTheme}
            isMuted={isMuted}
            onMuteToggle={toggleMute}
            showHeatmap={showHeatmap}
            onHeatmapToggle={toggleHeatmap}
            onLogout={handleLogout}
            onLoginClick={() => setShowLoginModal(true)}
          />
        )}

        {errorMessage && (
          <div style={{ position: 'fixed', bottom: '80px', left: '50%', transform: 'translateX(-50%)', backgroundColor: 'rgba(255, 68, 68, 0.9)', color: 'white', padding: '12px 24px', borderRadius: '8px', zIndex: 1000 }}>
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
            moveCount={moveCount}
            onRestart={() => {
              setShowResultModal(false);
              setMoveCount(0);
              restartGame();
            }}
            onMenu={() => {
              setShowResultModal(false);
              setMoveCount(0);
              restartGame();
            }}
          />
        )}

        <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      </Container>
    </ThemeProvider>
  );
};

export default App;
