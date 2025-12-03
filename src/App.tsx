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
import styled, { ThemeProvider, keyframes } from 'styled-components';
import { themes, Theme } from './styles/theme';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import ParticlesBackground from './components/ParticlesBackground';
import TutorialOverlay from './components/TutorialOverlay';
import LoginModal from './components/LoginModal';
import RankingBoard from './components/RankingBoard';
import Lobby from './components/Lobby';
import { useSocket } from './hooks/useSocket';

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

const Divider = styled.hr`
  border: none;
  height: 1px;
  background: linear-gradient(to right, transparent, #333, transparent);
  margin: 20px 0;
  width: 100%;
  max-width: 600px;
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

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 30px;

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


const HomeLink = styled(Link)`
position: absolute;
top: 20px;
left: 20px;
color: #888;
text - decoration: none;
font - size: 0.9rem;
display: flex;
align - items: center;
gap: 5px;
transition: color 0.2s;

  &:hover {
  color: #fff;
}
`;

/**
 * App 컴포넌트
 *
 * 메인 게임 UI를 렌더링합니다.
 */
const MobileButton = styled(Button)`
display: none;
@media(max - width: 768px) {
  display: inline - block;
  margin - left: 10px;
}
`;

const App: React.FC = () => {
  const {
    boardState,
    setBoardState,
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

  // Auth State
  const [user, setUser] = React.useState<any>(null);
  const [showLoginModal, setShowLoginModal] = React.useState(false);

  // Online State
  const { socket } = useSocket();
  const [roomId, setRoomId] = React.useState<string | null>(null);
  const [isMyTurn, setIsMyTurn] = React.useState(true); // 온라인 모드에서 내 턴인지 여부

  const toggleMute = () => {
    const newMuteState = !isMuted;
    SoundManager.setMute(newMuteState);
    setIsMuted(newMuteState);
  };

  // 초기 마운트 시 전적 불러오기 (Hydration Error 방지)
  React.useEffect(() => {
    setStats(StorageManager.getStats());
  }, []);

  // Socket Event Listeners
  React.useEffect(() => {
    if (!socket) return;

    socket.on('receive-move', (data: { row: number; col: number; player: Player }) => {
      if (gameMode === GameMode.Online) {
        // 상대방의 수를 보드에 반영
        setBoardState((prev) => {
          const newBoard = prev.map((r) => [...r]);
          newBoard[data.row][data.col] = data.player;
          return newBoard;
        });
        handleMove(data.row, data.col);
        setIsMyTurn(true);
      }
    });

    return () => {
      socket.off('receive-move');
    };
  }, [socket, gameMode, boardState, handleMove, setBoardState]);

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
    } else if (gameState === GameState.AIWin) {
      SoundManager.playLose();
      if (gameMode === GameMode.HvAI) StorageManager.recordLoss();
    } else if (gameState === GameState.Draw) {
      if (gameMode === GameMode.HvAI) StorageManager.recordDraw();
    }
    // 게임 종료 시 전적 업데이트 (로컬 & DB)
    if (gameState !== GameState.Playing) {
      setStats(StorageManager.getStats());

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
              mode: gameMode === GameMode.HvAI ? 'pve' : (gameMode === GameMode.Online ? 'online' : 'pvp') // 현재는 HvAI만 있지만 추후 PvP 추가 시 대응
            }),
          }).catch(console.error);
        }
      }
    }
  }, [gameState, gameMode, user]);

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
        } else if (gameMode === GameMode.Online) {
          return isMyTurn ? '▶️ 당신의 턴입니다' : '상대방의 턴입니다';
        }
        return currentPlayer === Player.Human
          ? '▶️ 당신의 턴입니다 (흑돌)'
          : '💻 AI의 턴입니다 (백돌)';
    }
  };

  // 타이머 (간단한 구현)
  const [timeLeft, setTimeLeft] = React.useState(30);

  React.useEffect(() => {
    if (gameState !== GameState.Playing) return;
    setTimeLeft(30); // 턴 변경 시 초기화
  }, [currentPlayer, gameState]);

  React.useEffect(() => {
    if (gameState !== GameState.Playing) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [gameState]);

  return (
    <ThemeProvider theme={themes[currentTheme]}>
      <ParticlesBackground />
      <TutorialOverlay />
      <Container>
        <HomeLink href="/">← 메인으로</HomeLink>

        <Header>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <Title>PVE GOMOKU</Title>
            {user ? (
              <div style={{ fontSize: '0.9rem' }}>
                👋 <strong>{user.username}</strong>님
                <Button onClick={() => setUser(null)} style={{ marginLeft: '10px', padding: '5px 10px', fontSize: '0.8rem' }}>로그아웃</Button>
              </div>
            ) : (
              <Button onClick={() => setShowLoginModal(true)} style={{ padding: '8px 16px', fontSize: '0.9rem' }}>🔑 로그인</Button>
            )}
          </div>
        </Header>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', alignItems: 'center', justifyContent: 'center' }}>
          {Object.keys(themes).map((themeKey) => (
            <Button
              key={themeKey}
              onClick={() => setCurrentTheme(themeKey)}
              $primary={currentTheme === themeKey}
              style={{ padding: '8px 16px', fontSize: '0.8rem' }}
            >
              {themes[themeKey].name}
            </Button>
          ))}
          <Button
            onClick={toggleMute}
            style={{ padding: '8px 12px', fontSize: '1.2rem', marginLeft: '10px' }}
            title={isMuted ? '소리 켜기' : '소리 끄기'}
          >
            {isMuted ? '🔇' : '🔊'}
          </Button>
        </div>

        <Divider />

        <div style={{ marginBottom: '20px' }}>
          <Button onClick={() => { setGameMode(GameMode.HvH); setRoomId(null); restartGame(); }} style={{ backgroundColor: gameMode === GameMode.HvH ? '#4caf50' : '#555' }}>사람 vs 사람</Button>
          <Button onClick={() => { setGameMode(GameMode.HvAI); setRoomId(null); restartGame(); }} style={{ backgroundColor: gameMode === GameMode.HvAI ? '#2196f3' : '#555', marginLeft: '10px' }}>사람 vs AI</Button>
          <Button onClick={() => { setGameMode(GameMode.Online); restartGame(); }} style={{ backgroundColor: gameMode === GameMode.Online ? '#9c27b0' : '#555', marginLeft: '10px' }}>온라인 대전</Button>
        </div>

        {gameMode === GameMode.Online && !roomId ? (
          <Lobby onJoinRoom={(id) => {
            setRoomId(id);
            socket?.emit('join-room', id);
            restartGame();
            setIsMyTurn(true);
          }} />
        ) : (
          <>
            {gameMode === GameMode.Online && roomId && (
              <div style={{ marginBottom: '10px', color: '#aaa' }}>
                방 코드: <strong style={{ color: '#fff' }}>{roomId}</strong> (친구에게 공유하세요!)
              </div>
            )}
            <Board
              boardState={boardState}
              boardSize={boardSize}
              isGameOver={isGameOver}
              onCellClick={(r, c) => {
                // 온라인 모드일 때 내 턴이 아니면 클릭 무시
                if (gameMode === GameMode.Online && !isMyTurn) return;

                handleMove(r, c);

                if (gameMode === GameMode.Online && socket && roomId) {
                  socket.emit('make-move', { roomId, row: r, col: c, player: currentPlayer });
                  setIsMyTurn(false);
                }
              }}
              winLine={winLine}
              lastMove={lastMove}
              heuristicMap={heuristicMap}
              checkForbidden={
                gameMode === GameMode.HvH || (gameMode === GameMode.Online && isMyTurn)
                  ? checkForbidden
                  : () => false
              }
            />
          </>
        )}
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

        {/* AI Hint Toggle (HvAI 모드일 때만) */}
        {gameMode === GameMode.HvAI && (
          <div style={{ marginBottom: '15px' }}>
            <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input
                type="checkbox"
                checked={showHeatmap}
                onChange={toggleHeatmap}
                style={{ width: '18px', height: '18px' }}
              />
              <span style={{ fontSize: '1rem', fontWeight: 'bold' }}>🧠 AI 힌트 보기</span>
            </label>
          </div>
        )}

        {/* 전적 표시 (HvAI 모드일 때만) */}
        {gameMode === GameMode.HvAI && (
          <div style={{ marginBottom: '20px', fontSize: '0.9rem', color: '#aaa' }}>
            🏆 전적: {stats.wins}승 {stats.losses}패
          </div>
        )}

        <StatusMessage $isGameOver={isGameOver} $gameState={gameState} key={currentPlayer}>
          {getStatusMessage()}
          {gameState === GameState.Playing && (
            <div style={{ fontSize: '0.8em', marginTop: '5px', color: timeLeft < 10 ? '#ff4444' : '#aaa' }}>
              ⏳ {timeLeft}초 남음
            </div>
          )}
        </StatusMessage>



        <ButtonGroup>
          <Button onClick={restartGame} $primary={isGameOver}>
            {isGameOver ? '새 게임 시작' : '다시 시작하기'}
          </Button>

          {currentPlayer === Player.Human && !isGameOver && (
            <>
              <Button onClick={undoMove}>⏪ 되돌리기</Button>
              <MobileButton onClick={() => handleMove(boardSize - 1, boardSize - 1)}>
                착수
              </MobileButton>
            </>
          )}
        </ButtonGroup>

        {errorMessage && (
          <div
            style={{
              position: 'fixed',
              bottom: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: 'rgba(255, 68, 68, 0.9)',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
              zIndex: 1000,
              animation: 'fadeIn 0.3s ease',
              fontWeight: 'bold',
            }}
          >
            {errorMessage}
          </div>
        )}

        {/* 랭킹 보드 */}
        <RankingBoard />

        {/* 로그인 모달 */}
        {showLoginModal && (
          <LoginModal
            onClose={() => setShowLoginModal(false)}
            onLoginSuccess={(loggedInUser) => setUser(loggedInUser)}
          />
        )}
      </Container>
    </ThemeProvider>
  );
};

export default App;
