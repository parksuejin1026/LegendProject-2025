import React, { useState } from 'react';
import styled from 'styled-components';

const LobbyContainer = styled.div`
  background-color: rgba(0, 0, 0, 0.5);
  padding: 30px;
  border-radius: 16px;
  width: 100%;
  max-width: 500px;
  text-align: center;
  border: 1px solid ${({ theme }) => theme.highlightWin};
`;

const Title = styled.h2`
  color: ${({ theme }) => theme.highlightWin};
  margin-bottom: 20px;
`;

const Input = styled.input`
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
  margin-right: 10px;
  font-size: 1rem;
`;

const Button = styled.button`
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  background-color: ${({ theme }) => theme.buttonBg};
  color: ${({ theme }) => theme.buttonText};
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.buttonHover};
  }
`;

interface LobbyProps {
  onJoinRoom: (roomId: string, role: 'host' | 'guest') => void;
}

const Lobby: React.FC<LobbyProps> = ({ onJoinRoom }) => {
  const [roomId, setRoomId] = useState('');

  const handleCreateRoom = () => {
    const newRoomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    onJoinRoom(newRoomId, 'host');
  };

  const handleJoinRoom = () => {
    if (roomId.trim()) {
      onJoinRoom(roomId.toUpperCase(), 'guest');
    }
  };

  return (
    <LobbyContainer>
      <Title>🌐 온라인 대기실</Title>
      <div style={{ marginBottom: '20px' }}>
        <p style={{ marginBottom: '10px' }}>새로운 방을 만들고 친구를 초대하세요!</p>
        <Button onClick={handleCreateRoom}>방 만들기</Button>
      </div>
      <hr style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '20px 0' }} />
      <div>
        <p style={{ marginBottom: '10px' }}>또는 방 코드를 입력하여 참가하세요.</p>
        <Input
          type="text"
          placeholder="방 코드 입력"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
        />
        <Button onClick={handleJoinRoom}>참가하기</Button>
      </div>
    </LobbyContainer>
  );
};

export default Lobby;
