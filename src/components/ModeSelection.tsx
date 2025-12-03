// src/components/ModeSelection.tsx
import React from 'react';
import styled, { keyframes } from 'styled-components';
import { GameMode } from '../core/GomokuGame';

interface ModeSelectionProps {
    onSelectMode: (mode: GameMode) => void;
}

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #fff 0%, #a5a5a5 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-align: center;
  letter-spacing: 2px;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 60px;
  text-align: center;
  
  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 40px;
  }
`;

const CardsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 40px;
  max-width: 1000px;
  width: 100%;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 24px;
  }
`;

const ModeCard = styled.div<{ $color: string }>`
  background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%);
  border: 2px solid ${({ $color }) => $color}44;
  border-radius: 24px;
  padding: 40px 32px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${({ $color }) => `radial-gradient(circle at top right, ${$color}33, transparent 70%)`};
    opacity: 0;
    transition: opacity 0.4s ease;
  }
  
  &:hover {
    transform: translateY(-12px) scale(1.02);
    border-color: ${({ $color }) => $color};
    box-shadow: 0 20px 60px ${({ $color }) => $color}66;
    
    &::before {
      opacity: 1;
    }
    
    .icon {
      animation: ${float} 2s ease-in-out infinite;
    }
  }
  
  .icon {
    font-size: 5rem;
    margin-bottom: 24px;
    display: block;
    text-align: center;
    filter: drop-shadow(0 4px 12px rgba(0,0,0,0.3));
  }
  
  .title {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 16px;
    text-align: center;
    color: #fff;
  }
  
  .description {
    font-size: 1rem;
    color: rgba(255, 255, 255, 0.8);
    line-height: 1.6;
    text-align: center;
    margin-bottom: 24px;
  }
  
  .features {
    list-style: none;
    padding: 0;
    margin: 0;
    
    li {
      padding: 8px 0;
      color: rgba(255, 255, 255, 0.7);
      font-size: 0.9rem;
      display: flex;
      align-items: center;
      gap: 8px;
      
      &::before {
        content: '✓';
        color: ${({ $color }) => $color};
        font-weight: bold;
        font-size: 1.2rem;
      }
    }
  }
  
  .cta {
    margin-top: 24px;
    padding: 14px 28px;
    background: ${({ $color }) => $color};
    color: #fff;
    border: none;
    border-radius: 50px;
    font-size: 1.1rem;
    font-weight: 600;
    width: 100%;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px ${({ $color }) => $color}66;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px ${({ $color }) => $color}88;
    }
  }
`;

const ModeSelection: React.FC<ModeSelectionProps> = ({ onSelectMode }) => {
    return (
        <Container>
            <Title>🎮 LEGEND GOMOKU</Title>
            <Subtitle>게임 모드를 선택하세요</Subtitle>

            <CardsContainer>
                <ModeCard $color="#4caf50" onClick={() => onSelectMode(GameMode.HvH)}>
                    <span className="icon">🧑‍🤝‍🧑</span>
                    <div className="title">로컬 대전</div>
                    <div className="description">
                        친구나 가족과 함께 한 기기에서 즐기는 클래식 오목
                    </div>
                    <ul className="features">
                        <li>2인 대전 모드</li>
                        <li>턴제 게임플레이</li>
                        <li>금지수 규칙 적용</li>
                        <li>무제한 플레이</li>
                    </ul>
                    <button className="cta">로컬 대전 시작</button>
                </ModeCard>

                <ModeCard $color="#2196f3" onClick={() => onSelectMode(GameMode.HvAI)}>
                    <span className="icon">🤖</span>
                    <div className="title">AI 대전</div>
                    <div className="description">
                        강력한 AI와 대결하며 실력을 향상시키세요
                    </div>
                    <ul className="features">
                        <li>3단계 난이도 선택</li>
                        <li>AI 사고 과정 표시</li>
                        <li>힌트 시스템</li>
                        <li>전적 기록 저장</li>
                    </ul>
                    <button className="cta">AI 대전 시작</button>
                </ModeCard>
            </CardsContainer>
        </Container>
    );
};

export default ModeSelection;
