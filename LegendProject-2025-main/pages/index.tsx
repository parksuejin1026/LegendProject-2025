import React from 'react';
import { NextPage } from 'next';
import Link from 'next/link';
import styled, { keyframes } from 'styled-components';

// --- Animations ---
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(255, 255, 255, 0); }
  100% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0); }
`;

// --- Styled Components ---
const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1c20 0%, #0f1012 100%);
  color: #ffffff;
  font-family: 'Inter', sans-serif;
  overflow: hidden;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 60%);
    transform: rotate(30deg);
    pointer-events: none;
  }
`;

const Title = styled.h1`
  font-size: 4rem;
  font-weight: 800;
  margin-bottom: 1rem;
  background: linear-gradient(to right, #fff, #a5a5a5);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  animation: ${fadeIn} 1s ease-out;
  letter-spacing: -2px;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: #888;
  margin-bottom: 3rem;
  animation: ${fadeIn} 1s ease-out 0.3s backwards;
  font-weight: 300;
  letter-spacing: 1px;
`;

const StartButton = styled(Link)`
  padding: 18px 48px;
  font-size: 1.2rem;
  font-weight: 600;
  color: #0f1012;
  background: #ffffff;
  border-radius: 50px;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(255, 255, 255, 0.2);
  animation: ${fadeIn} 1s ease-out 0.6s backwards;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 30px rgba(255, 255, 255, 0.4);
    background: #f0f0f0;
    animation: ${pulse} 2s infinite;
  }

  &:active {
    transform: translateY(1px);
  }
`;

const DecorativeStone = styled.div<{ $color: 'black' | 'white'; $top: string; $left: string; $size: string }>`
  position: absolute;
  top: ${props => props.$top};
  left: ${props => props.$left};
  width: ${props => props.$size};
  height: ${props => props.$size};
  border-radius: 50%;
  background: ${props => props.$color === 'black'
        ? 'radial-gradient(circle at 30% 30%, #444, #000)'
        : 'radial-gradient(circle at 30% 30%, #fff, #ddd)'};
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
  opacity: 0.1;
  z-index: 0;
  pointer-events: none;
`;

const HomePage: NextPage = () => {
    return (
        <MainContainer>
            <DecorativeStone $color="black" $top="10%" $left="10%" $size="150px" />
            <DecorativeStone $color="white" $top="70%" $left="80%" $size="200px" />
            <DecorativeStone $color="black" $top="80%" $left="15%" $size="80px" />

            <Title>LEGEND GOMOKU</Title>
            <Subtitle>전설의 오목, 지금 시작하세요.</Subtitle>

            <StartButton href="/game">
                게임 시작하기
            </StartButton>
        </MainContainer>
    );
};

export default HomePage;