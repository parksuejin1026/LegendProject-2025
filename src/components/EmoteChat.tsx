import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const floatUp = keyframes`
  0% { transform: translateY(0) scale(0.5); opacity: 0; }
  20% { transform: translateY(-20px) scale(1.2); opacity: 1; }
  80% { transform: translateY(-80px) scale(1); opacity: 1; }
  100% { transform: translateY(-100px) scale(0.8); opacity: 0; }
`;

const Container = styled.div`
  position: fixed;
  bottom: 100px;
  right: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  z-index: 1000;
`;

const EmoteButton = styled.button`
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  width: 50px;
  height: 50px;
  font-size: 24px;
  cursor: pointer;
  transition: all 0.2s;
  color: white;
  margin-top: 10px;

  &:hover {
    transform: scale(1.1);
    background: rgba(0, 0, 0, 0.8);
  }
`;

const EmoteList = styled.div<{ $isOpen: boolean }>`
  display: ${({ $isOpen }) => ($isOpen ? 'flex' : 'none')};
  flex-direction: column;
  gap: 10px;
  background: rgba(0, 0, 0, 0.8);
  padding: 10px;
  border-radius: 20px;
  margin-bottom: 10px;
  backdrop-filter: blur(5px);
`;

const EmoteItem = styled.button`
  background: none;
  border: none;
  font-size: 28px;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.3);
  }
`;

const FloatingEmote = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  font-size: 4rem;
  pointer-events: none;
  animation: ${floatUp} 2s ease-out forwards;
  z-index: 2000;
`;

interface EmoteChatProps {
    onSendEmote: (emote: string) => void;
    receivedEmote: string | null;
}

const EMOTES = ['👏', '😱', '🤔', '😭', '🎉', '😡'];

const EmoteChat: React.FC<EmoteChatProps> = ({ onSendEmote, receivedEmote }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeEmotes, setActiveEmotes] = useState<{ id: number; emote: string }[]>([]);

    useEffect(() => {
        if (receivedEmote) {
            addFloatingEmote(receivedEmote);
        }
    }, [receivedEmote]);

    const addFloatingEmote = (emote: string) => {
        const id = Date.now();
        setActiveEmotes((prev) => [...prev, { id, emote }]);
        setTimeout(() => {
            setActiveEmotes((prev) => prev.filter((e) => e.id !== id));
        }, 2000);
    };

    const handleSend = (emote: string) => {
        onSendEmote(emote);
        addFloatingEmote(emote); // 내 화면에도 표시
        setIsOpen(false);
    };

    return (
        <>
            <Container>
                <EmoteList $isOpen={isOpen}>
                    {EMOTES.map((emote) => (
                        <EmoteItem key={emote} onClick={() => handleSend(emote)}>
                            {emote}
                        </EmoteItem>
                    ))}
                </EmoteList>
                <EmoteButton onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? '❌' : '💬'}
                </EmoteButton>
            </Container>
            {activeEmotes.map((item) => (
                <FloatingEmote key={item.id}>{item.emote}</FloatingEmote>
            ))}
        </>
    );
};

export default EmoteChat;
