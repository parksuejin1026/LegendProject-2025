import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const BoardContainer = styled.div`
  background-color: rgba(0, 0, 0, 0.3);
  padding: 20px;
  border-radius: 12px;
  width: 100%;
  max-width: 400px;
  margin-top: 20px;
  border: 1px solid ${({ theme }) => theme.gridLine};
`;

const Title = styled.h3`
  text-align: center;
  color: ${({ theme }) => theme.highlightWin};
  margin-bottom: 15px;
  font-size: 1.2rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
`;

const Th = styled.th`
  text-align: left;
  padding: 8px;
  border-bottom: 1px solid ${({ theme }) => theme.gridLine};
  color: #aaa;
`;

const Td = styled.td`
  padding: 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  color: ${({ theme }) => theme.text};
`;

const Rank = styled.span<{ rank: number }>`
  font-weight: bold;
  color: ${({ rank }) => (rank === 1 ? 'gold' : rank === 2 ? 'silver' : rank === 3 ? '#cd7f32' : 'inherit')};
`;

interface UserRank {
    username: string;
    pveStats: { wins: number; losses: number; draws: number };
    pvpStats: { wins: number; losses: number; draws: number };
}

const TabContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 15px;
  gap: 10px;
`;

const TabButton = styled.button<{ $active: boolean }>`
  background: ${({ $active, theme }) => ($active ? theme.highlightWin : 'transparent')};
  color: ${({ $active, theme }) => ($active ? '#000' : theme.text)};
  border: 1px solid ${({ theme }) => theme.highlightWin};
  padding: 5px 15px;
  border-radius: 20px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.2s;

  &:hover {
    background: ${({ theme }) => theme.highlightWin};
    color: #000;
  }
`;

const RankingBoard: React.FC = () => {
    const [rankings, setRankings] = useState<UserRank[]>([]);
    const [loading, setLoading] = useState(true);
    const [mode, setMode] = useState<'pve' | 'pvp'>('pve');

    useEffect(() => {
        const fetchRankings = async () => {
            try {
                const res = await fetch('/api/rankings');
                if (res.ok) {
                    const data = await res.json();
                    setRankings(data);
                }
            } catch (error) {
                console.error('Failed to fetch rankings', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRankings();
    }, []);

    if (loading) return <div>Loading rankings...</div>;

    return (
        <BoardContainer>
            <Title>🏆 명예의 전당 (Top 10)</Title>

            <TabContainer>
                <TabButton $active={mode === 'pve'} onClick={() => setMode('pve')}>🤖 vs AI</TabButton>
                <TabButton $active={mode === 'pvp'} onClick={() => setMode('pvp')}>👥 Online</TabButton>
            </TabContainer>

            <Table>
                <thead>
                    <tr>
                        <Th>순위</Th>
                        <Th>이름</Th>
                        <Th>승리</Th>
                        <Th>승률</Th>
                    </tr>
                </thead>
                <tbody>
                    {rankings
                        .sort((a, b) => {
                            const statsA = (mode === 'pve' ? a.pveStats : a.pvpStats) || { wins: 0, losses: 0, draws: 0 };
                            const statsB = (mode === 'pve' ? b.pveStats : b.pvpStats) || { wins: 0, losses: 0, draws: 0 };
                            return statsB.wins - statsA.wins;
                        })
                        .map((user, index) => {
                            const stats = (mode === 'pve' ? user.pveStats : user.pvpStats) || { wins: 0, losses: 0, draws: 0 };
                            const total = stats.wins + stats.losses + stats.draws;
                            const winRate = total > 0 ? Math.round((stats.wins / total) * 100) : 0;
                            return (
                                <tr key={user.username}>
                                    <Td><Rank rank={index + 1}>{index + 1}</Rank></Td>
                                    <Td>{user.username}</Td>
                                    <Td>{stats.wins}승</Td>
                                    <Td>{winRate}%</Td>
                                </tr>
                            );
                        })}
                </tbody>
            </Table>
        </BoardContainer>
    );
};

export default RankingBoard;
