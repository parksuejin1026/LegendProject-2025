// src/App.tsx
// 이 코드는 모든 컴포넌트와 훅을 통합하여 오목 게임의 메인 레이아웃을 구성하고, 현재 게임 상태(턴, 승패)를 표시하며, 미니멀리즘 스타일을 적용합니다.
import React from 'react';
// useGomokuGame 훅을 임포트하여 게임 로직 상태를 가져옴
import { useGomokuGame } from './hooks/useGomokuGame'; 
import Board from './components/Board';
// GomokuGame 코어 파일에서 Player, GameState 타입을 임포트
import { Player, GameState } from './core/GomokuGame'; 

const App: React.FC = () => {
    // 커스텀 훅을 통해 게임 상태와 제어 함수를 가져옴
    const { boardState, currentPlayer, gameState, handleHumanMove, restartGame, boardSize } = useGomokuGame();
    
    const isGameOver = gameState !== GameState.Playing;

    // 현재 게임 상태에 따라 메시지 출력
    const getStatusMessage = () => {
        switch (gameState) {
            case GameState.HumanWin: return "🎉 당신의 승리입니다! (흑돌)";
            case GameState.AIWin: return "😭 AI의 승리입니다. (백돌)";
            case GameState.Draw: return "🤝 무승부입니다.";
            case GameState.Playing: 
            default:
                return currentPlayer === Player.Human ? "▶️ 당신의 턴입니다 (흑돌)" : "💻 AI의 턴입니다 (백돌)";
        }
    };

    // --- 미니멀리즘 스타일 ---
    const appContainerStyle: React.CSSProperties = { 
        fontFamily: 'sans-serif', 
        maxWidth: '800px', 
        margin: '0 auto', 
        padding: '20px',
        textAlign: 'center'
    };
    const statusStyle: React.CSSProperties = {
        margin: '20px 0',
        fontSize: '24px',
        fontWeight: 'bold',
        // 게임 종료 결과에 따라 색상 변경
        color: isGameOver ? (gameState === GameState.HumanWin ? '#28a745' : '#dc3545') : '#333',
    };
    const restartButtonStyle: React.CSSProperties = {
        padding: '10px 30px',
        fontSize: '16px',
        cursor: 'pointer',
        border: '1px solid #ccc',
        // 게임 종료 시 버튼 색상 강조
        backgroundColor: isGameOver ? '#007bff' : '#f8f9fa',
        color: isGameOver ? '#fff' : '#333',
        borderRadius: '5px',
        marginTop: '20px',
        fontWeight: 'bold',
    };

    return (
        <div style={appContainerStyle}>
            <h1 style={{ fontWeight: 300, letterSpacing: '2px' }}>PVE GOMOKU</h1> 
            
            <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '20px 0' }}/>

            {/* 상태 표시 */}
            <div style={statusStyle}>
                {getStatusMessage()}
            </div>
            
            {/* 게임판 컴포넌트 */}
            <Board 
                boardState={boardState}
                boardSize={boardSize}
                onCellClick={handleHumanMove} // 셀 클릭 시 사람의 움직임 처리
                isGameOver={isGameOver}
            />

            {/* 다시 시작 버튼 */}
            <button onClick={restartGame} style={restartButtonStyle}>
                다시 시작하기
            </button>
            
        </div>
    );
};

export default App;