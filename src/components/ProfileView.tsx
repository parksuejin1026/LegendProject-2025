import React from 'react';
import styled from 'styled-components';
import { Theme, themes } from '../styles/theme';
import GameHistory from './GameHistory';

const Container = styled.div`
  padding: 20px;
  padding-bottom: 80px;
  color: ${({ theme }) => theme.text};
  max-width: 600px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid ${({ theme }) => theme.gridLine};
`;

const Avatar = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: ${({ theme }) => theme.highlightWin};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  margin-right: 20px;
  color: #000;
`;

const UserInfo = styled.div`
  flex: 1;
`;

const Username = styled.h2`
  margin: 0;
  font-size: 1.5rem;
`;

const UserStatus = styled.p`
  margin: 5px 0 0;
  color: #aaa;
  font-size: 0.9rem;
`;

const Section = styled.section`
  margin-bottom: 30px;
`;

const SectionTitle = styled.h3`
  margin-bottom: 15px;
  font-size: 1.1rem;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 15px;
`;

const StatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  text-align: center;
`;

const StatItem = styled.div``;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${({ theme }) => theme.highlightWin};
`;

const StatLabel = styled.div`
  font-size: 0.8rem;
  color: #aaa;
`;

const SettingRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  &:last-child {
    border-bottom: none;
  }
`;

const SettingLabel = styled.span`
  font-size: 1rem;
`;

const ThemeButton = styled.button<{ $active: boolean; theme: Theme }>`
  padding: 5px 10px;
  border-radius: 15px;
  border: 1px solid ${({ theme }) => theme.highlightWin};
  background: ${({ $active, theme }) => ($active ? theme.highlightWin : 'transparent')};
  color: ${({ $active }) => ($active ? '#000' : '#fff')};
  margin-left: 5px;
  cursor: pointer;
  font-size: 0.8rem;
`;

const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 50px;
  height: 28px;
`;

const ToggleInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;

  &:checked + span {
    background-color: ${({ theme }) => theme.highlightWin};
  }

  &:checked + span:before {
    transform: translateX(22px);
  }
`;

const ToggleSlider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #555;
  transition: .4s;
  border-radius: 34px;

  &:before {
    position: absolute;
    content: "";
    height: 20px;
    width: 20px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: .4s;
    border-radius: 50%;
  }
`;

const LogoutButton = styled.button`
  width: 100%;
  padding: 15px;
  background: #ff4444;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  margin-top: 20px;

  &:hover {
    background: #cc0000;
  }
`;

interface ProfileViewProps {
  user: any;
  stats: { wins: number; losses: number; draws: number };
  currentTheme: string;
  onThemeChange: (theme: string) => void;
  isMuted: boolean;
  onMuteToggle: () => void;
  showHeatmap: boolean;
  onHeatmapToggle: () => void;
  onLogout: () => void;
  onLoginClick: () => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  stats,
  currentTheme,
  onThemeChange,
  isMuted,
  onMuteToggle,
  showHeatmap,
  onHeatmapToggle,
  onLogout,
  onLoginClick
}) => {
  return (
    <Container>
      <Header>
        <Avatar>{user ? user.username[0].toUpperCase() : 'G'}</Avatar>
        <UserInfo>
          <Username>{user ? user.username : 'Guest Player'}</Username>
          <UserStatus>{user ? '온라인' : '로그인이 필요합니다'}</UserStatus>
        </UserInfo>
      </Header>

      {user && (
        <Section>
          <SectionTitle>나의 전적 (AI 대전)</SectionTitle>
          <Card>
            <StatGrid>
              <StatItem>
                <StatValue>{stats.wins}</StatValue>
                <StatLabel>승리</StatLabel>
              </StatItem>
              <StatItem>
                <StatValue>{stats.losses}</StatValue>
                <StatLabel>패배</StatLabel>
              </StatItem>
              <StatItem>
                <StatValue>{stats.draws}</StatValue>
                <StatLabel>무승부</StatLabel>
              </StatItem>
            </StatGrid>
          </Card>
        </Section>
      )}

      <GameHistory />

      <Section>
        <SectionTitle>게임 설정</SectionTitle>
        <Card>
          <SettingRow>
            <SettingLabel>테마 설정</SettingLabel>
            <div>
              {Object.keys(themes).map((key) => (
                <ThemeButton
                  key={key}
                  $active={currentTheme === key}
                  onClick={() => onThemeChange(key)}
                >
                  {themes[key].name}
                </ThemeButton>
              ))}
            </div>
          </SettingRow>
          <SettingRow>
            <SettingLabel>효과음</SettingLabel>
            <ToggleSwitch>
              <ToggleInput type="checkbox" checked={!isMuted} onChange={onMuteToggle} />
              <ToggleSlider />
            </ToggleSwitch>
          </SettingRow>
          <SettingRow>
            <SettingLabel>AI 힌트 보기</SettingLabel>
            <ToggleSwitch>
              <ToggleInput type="checkbox" checked={showHeatmap} onChange={onHeatmapToggle} />
              <ToggleSlider />
            </ToggleSwitch>
          </SettingRow>
        </Card>
      </Section>

      {user ? (
        <LogoutButton onClick={onLogout}>로그아웃</LogoutButton>
      ) : (
        <LogoutButton style={{ background: '#2196f3' }} onClick={onLoginClick}>로그인 / 회원가입</LogoutButton>
      )}
    </Container>
  );
};

export default ProfileView;
