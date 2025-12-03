// src/components/GameHistory.tsx
import React from 'react';
import styled from 'styled-components';
import HistoryManager, { GameRecord } from '../core/HistoryManager';

const HistoryContainer = styled.div`
  max-width: 600px;
  margin: 20px auto;
  padding: 24px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  backdrop-filter: blur(10px);
`;

const Title = styled.h2`
  font-size: 1.8rem;
  margin-bottom: 20px;
  text-align: center;
  color: #fff;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`;

const StatCard = styled.div<{ $color: string }>`
  background: ${({ $color }) => `${$color}22`};
  border: 2px solid ${({ $color }) => $color};
  border-radius: 12px;
  padding: 16px;
  text-align: center;
  
  .label {
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.7);
    margin-bottom: 8px;
  }
  
  .value {
    font-size: 2rem;
    font-weight: 700;
    color: ${({ $color }) => $color};
  }
`;

const RecordList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const RecordItem = styled.div<{ $result: 'win' | 'lose' | 'draw' }>`
  background: rgba(255, 255, 255, 0.03);
  border-left: 4px solid ${({ $result }) =>
        $result === 'win' ? '#4caf50' :
            $result === 'lose' ? '#f44336' :
                '#ff9800'
    };
  border-radius: 8px;
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.08);
    transform: translateX(4px);
  }
  
  .info {
    .result {
      font-weight: 600;
      color: ${({ $result }) =>
        $result === 'win' ? '#4caf50' :
            $result === 'lose' ? '#f44336' :
                '#ff9800'
    };
      margin-bottom: 4px;
    }
    
    .details {
      font-size: 0.85rem;
      color: rgba(255, 255, 255, 0.6);
    }
  }
  
  .moves {
    font-size: 1.2rem;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.8);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px;
  color: rgba(255, 255, 255, 0.5);
  font-size: 1.1rem;
`;

const GameHistory: React.FC = () => {
    const [history, setHistory] = React.useState<GameRecord[]>([]);
    const [stats, setStats] = React.useState({ wins: 0, losses: 0, draws: 0, winRate: 0 });

    React.useEffect(() => {
        setHistory(HistoryManager.getHistory());
        setStats(HistoryManager.getWinRate());
    }, []);

    const getResultText = (result: string) => {
        switch (result) {
            case 'win': return '🏆 승리';
            case 'lose': return '😢 패배';
            case 'draw': return '🤝 무승부';
            default: return '게임';
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (minutes < 1) return '방금 전';
        if (minutes < 60) return `${minutes}분 전`;
        if (hours < 24) return `${hours}시간 전`;
        if (days < 7) return `${days}일 전`;
        return date.toLocaleDateString('ko-KR');
    };

    return (
        <HistoryContainer>
            <Title>📊 게임 기록</Title>

            <StatsGrid>
                <StatCard $color="#4caf50">
                    <div className="label">승리</div>
                    <div className="value">{stats.wins}</div>
                </StatCard>
                <StatCard $color="#f44336">
                    <div className="label">패배</div>
                    <div className="value">{stats.losses}</div>
                </StatCard>
                <StatCard $color="#ff9800">
                    <div className="label">무승부</div>
                    <div className="value">{stats.draws}</div>
                </StatCard>
                <StatCard $color="#2196f3">
                    <div className="label">승률</div>
                    <div className="value">{stats.winRate.toFixed(0)}%</div>
                </StatCard>
            </StatsGrid>

            <RecordList>
                {history.length === 0 ? (
                    <EmptyState>아직 기록이 없습니다.<br />게임을 시작해보세요!</EmptyState>
                ) : (
                    history.map(record => (
                        <RecordItem key={record.id} $result={record.result}>
                            <div className="info">
                                <div className="result">{getResultText(record.result)}</div>
                                <div className="details">
                                    {record.mode === 'HvAI' ? '🤖 AI 대전' : '👥 로컬 대전'} · {formatDate(record.date)}
                                </div>
                            </div>
                            <div className="moves">{record.moves}수</div>
                        </RecordItem>
                    ))
                )}
            </RecordList>
        </HistoryContainer>
    );
};

export default GameHistory;
