import React from 'react';
import styled from 'styled-components';
import { CHALLENGES, Challenge } from '../core/Challenges';


const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
  max-width: 500px;
`;

const ChallengeCard = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 20px;
  text-align: left;
  cursor: pointer;
  transition: all 0.3s ease;
  color: white;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.3);
  }
`;

const Title = styled.h3`
  margin: 0 0 5px 0;
  font-size: 1.2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const DifficultyBadge = styled.span<{ level: string }>`
  font-size: 0.8rem;
  padding: 2px 8px;
  border-radius: 10px;
  background: ${({ level }) =>
    level === 'Easy' ? '#4caf50' :
      level === 'Medium' ? '#ff9800' : '#f44336'};
  color: white;
`;

const Description = styled.p`
  margin: 0 0 10px 0;
  font-size: 0.9rem;
  color: #ccc;
`;

const Goal = styled.div`
  font-size: 0.9rem;
  color: #aaa;
  font-style: italic;
  
  &::before {
      content: '🎯 ';
  }
`;

interface ChallengeSelectorProps {
  onSelectChallenge: (challenge: Challenge) => void;
  onBack: () => void;
}

const ChallengeSelector: React.FC<ChallengeSelectorProps> = ({ onSelectChallenge, onBack }) => {
  return (
    <Container>
      <h2 style={{ color: 'white', marginBottom: '20px', textAlign: 'center' }}>🧩 묘수 풀이 (Challenge)</h2>

      {CHALLENGES.map((challenge) => (
        <ChallengeCard key={challenge.id} onClick={() => onSelectChallenge(challenge)}>
          <Title>
            {challenge.title}
            <DifficultyBadge level={challenge.difficulty}>{challenge.difficulty}</DifficultyBadge>
          </Title>
          <Description>{challenge.description}</Description>
          <Goal>{challenge.goal}</Goal>
        </ChallengeCard>
      ))}

      <button
        onClick={onBack}
        style={{
          marginTop: '20px',
          padding: '10px',
          background: 'transparent',
          border: '1px solid #aaa',
          color: '#aaa',
          borderRadius: '8px',
          cursor: 'pointer'
        }}
      >
        뒤로 가기
      </button>
    </Container>
  );
};

export default ChallengeSelector;
