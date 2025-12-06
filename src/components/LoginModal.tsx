import React, { useState } from 'react';
import styled from 'styled-components';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  backdrop-filter: blur(5px);
`;

const ModalContainer = styled.div`
  background-color: ${({ theme }) => theme.boardBackground};
  padding: 40px;
  border-radius: 16px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
  border: 1px solid ${({ theme }) => theme.boardBorder};
  color: ${({ theme }) => theme.text};
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 30px;
  color: ${({ theme }) => theme.highlightWin};
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin-bottom: 15px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.gridLine};
  background-color: rgba(255, 255, 255, 0.1);
  color: ${({ theme }) => theme.text};
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.highlightWin};
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  background-color: ${({ theme }) => theme.buttonBg};
  color: ${({ theme }) => theme.buttonText};
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background 0.2s;
  margin-top: 10px;

  &:hover {
    background-color: ${({ theme }) => theme.buttonHover};
  }
`;

const ToggleText = styled.p`
  text-align: center;
  margin-top: 20px;
  font-size: 0.9rem;
  color: #aaa;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
    color: ${({ theme }) => theme.text};
  }
`;

const ErrorMessage = styled.p`
  color: #ff4444;
  text-align: center;
  margin-bottom: 15px;
  font-size: 0.9rem;
`;

interface LoginModalProps {
  onClose: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onLoginSuccess: (user: any) => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose, onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      if (isLogin) {
        onLoginSuccess(data.user);
        onClose();
      } else {
        // 회원가입 성공 시 바로 로그인 처리하거나 로그인 화면으로 전환
        setIsLogin(true);
        setError('회원가입 성공! 로그인해주세요.');
        setPassword('');
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Overlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <Title>{isLogin ? '로그인' : '회원가입'}</Title>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <form onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="아이디"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" disabled={loading}>
            {loading ? '처리 중...' : isLogin ? '로그인' : '가입하기'}
          </Button>
        </form>
        <ToggleText onClick={() => { setIsLogin(!isLogin); setError(''); }}>
          {isLogin ? '계정이 없으신가요? 회원가입' : '이미 계정이 있으신가요? 로그인'}
        </ToggleText>
      </ModalContainer>
    </Overlay>
  );
};

export default LoginModal;
