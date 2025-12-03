import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
`;

const Content = styled.div`
  background-color: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  padding: 40px;
  border-radius: 16px;
  max-width: 500px;
  width: 90%;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  border: 1px solid ${({ theme }) => theme.boardBorder};
`;

const Title = styled.h2`
  font-size: 2rem;
  margin-bottom: 20px;
  color: ${({ theme }) => theme.highlightWin};
`;

const Description = styled.p`
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 30px;
  color: #ccc;
`;

const Button = styled.button`
  padding: 12px 30px;
  font-size: 1.1rem;
  background-color: ${({ theme }) => theme.buttonBg};
  color: ${({ theme }) => theme.buttonText};
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.buttonHover};
    transform: translateY(-2px);
  }
`;

const TutorialOverlay: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const hasSeenTutorial = localStorage.getItem('gomoku_tutorial_seen');
        if (!hasSeenTutorial) {
            setIsVisible(true);
        }
    }, []);

    const handleClose = () => {
        localStorage.setItem('gomoku_tutorial_seen', 'true');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <Overlay>
            <Content>
                <Title>오목 게임에 오신 것을 환영합니다! 👋</Title>
                <Description>
                    이 게임은 흑돌과 백돌을 번갈아 두어<br />
                    먼저 <strong>5개의 돌을 일렬로 만드는 쪽이 승리</strong>합니다.
                    <br /><br />
                    <strong>⚠️ 흑돌(Player 1) 규칙 (렌주룰)</strong><br />
                    3-3, 4-4, 6목 이상은 금지수입니다.<br />
                    금지수 위치에 마우스를 올리면 <strong>X</strong> 표시가 뜹니다.
                </Description>
                <Button onClick={handleClose}>게임 시작하기</Button>
            </Content>
        </Overlay>
    );
};

export default TutorialOverlay;
