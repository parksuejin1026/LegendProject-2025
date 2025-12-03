import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { Theme } from '../styles/theme';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  animation: ${fadeIn} 0.8s ease-out;
`;

const Logo = styled.h1`
  font-size: clamp(2rem, 5vw, 3rem);
  margin-bottom: 30px;
  background: linear-gradient(to right, #fff, #a5a5a5);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-transform: uppercase;
  letter-spacing: 4px;
  text-align: center;
`;

const FormContainer = styled.form`
  width: 100%;
  max-width: 320px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 0 10px;
`;

const Input = styled.input`
  width: 100%;
  padding: 15px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background-color: rgba(255, 255, 255, 0.05);
  color: #fff;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s;
  box-sizing: border-box;

  &:focus {
    border-color: ${({ theme }) => theme.highlightWin};
  }
`;

const Button = styled.button<{ $primary?: boolean; theme: Theme }>`
  padding: 15px;
  font-size: 1rem;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  font-weight: bold;
  background: ${({ $primary, theme }) => ($primary ? theme.highlightWin : 'transparent')};
  color: ${({ $primary }) => ($primary ? '#000' : '#aaa')};
  transition: all 0.2s;
  margin-top: ${({ $primary }) => ($primary ? '10px' : '0')};

  &:hover {
    transform: translateY(-2px);
    color: ${({ $primary }) => ($primary ? '#000' : '#fff')};
  }
`;

const ToggleText = styled.p`
  text-align: center;
  margin-top: 15px;
  font-size: 0.9rem;
  color: #888;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
    color: #fff;
  }
`;

const ErrorMessage = styled.p`
  color: #ff4444;
  text-align: center;
  font-size: 0.9rem;
`;

interface LandingPageProps {
  onLoginSuccess: (user: any) => void;
  onGuestClick: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLoginSuccess, onGuestClick }) => {
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
      } else {
        setIsLogin(true);
        setError('회원가입 성공! 로그인해주세요.');
        setPassword('');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Logo>LEGEND<br />GOMOKU</Logo>

      <FormContainer onSubmit={handleSubmit}>
        {error && <ErrorMessage>{error}</ErrorMessage>}
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
        <Button type="submit" $primary disabled={loading}>
          {loading ? '처리 중...' : (isLogin ? '로그인' : '회원가입')}
        </Button>
      </FormContainer>

      <ToggleText onClick={() => { setIsLogin(!isLogin); setError(''); }}>
        {isLogin ? '계정이 없으신가요? 회원가입' : '이미 계정이 있으신가요? 로그인'}
      </ToggleText>

      <Button onClick={onGuestClick} style={{ marginTop: '20px', fontSize: '0.9rem' }}>
        게스트로 플레이하기 &rarr;
      </Button>
    </Container>
  );
};

export default LandingPage;
