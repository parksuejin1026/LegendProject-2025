import React from 'react';
import styled from 'styled-components';
import { Theme, themes, StoneSkinType, stoneSkins } from '../styles/theme';
import GameHistory from './GameHistory';
import SoundManager from '../core/SoundManager';
import { PERSONAS, PersonaType } from '../core/AIPersona';

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

const VolumeSlider = styled.input`
  -webkit-appearance: none;
  width: 100px;
  height: 6px;
  background: ${({ theme }) => theme.buttonBg};
  border-radius: 5px;
  outline: none;
  margin-right: 15px;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: ${({ theme }) => theme.highlightWin};
    cursor: pointer;
    transition: transform 0.2s;
  }

  &::-webkit-slider-thumb:hover {
    transform: scale(1.2);
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any;
  stats: { wins: number; losses: number; draws: number };
  currentTheme: string;
  onThemeChange: (theme: string) => void;
  currentSkin: StoneSkinType;
  onSkinChange: (skin: StoneSkinType) => void;
  isMuted: boolean;
  onMuteToggle: () => void;
  showHeatmap: boolean;
  onHeatmapToggle: () => void;
  onLogout: () => void;
  customThemes?: Theme[];
  onCreateTheme?: () => void;
  onLoginClick: () => void;
  currentPersona: PersonaType;
  onPersonaChange: (persona: PersonaType) => void;
  currentBoardSize: number;
  onBoardSizeChange: (size: number) => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  stats,
  currentTheme,
  onThemeChange,
  currentSkin,
  onSkinChange,
  isMuted,
  onMuteToggle,
  showHeatmap,
  onHeatmapToggle,
  onLogout,
  onLoginClick,
  currentPersona,
  onPersonaChange,
  currentBoardSize,
  onBoardSizeChange,
  customThemes,
  onCreateTheme,
}) => {
  const [volume, setVolume] = React.useState(Math.round(SoundManager.getVolume() * 100));

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = Number(e.target.value);
    setVolume(newVol);
    SoundManager.setVolume(newVol / 100);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [deferredPrompt, setDeferredPrompt] = React.useState<any>(null);

  React.useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        } else {
          console.log('User dismissed the install prompt');
        }
        setDeferredPrompt(null);
      });
    }
  };

  return (
    <Container>
      <Header>
        <Avatar>{user ? user.username[0].toUpperCase() : 'G'}</Avatar>
        <UserInfo>
          <Username>{user ? user.username : 'Guest Player'}</Username>
          <UserStatus>{user ? '온라인' : '로그인이 필요합니다'}</UserStatus>
        </UserInfo>
      </Header>

      {/* 앱 설치 버튼 (설치 가능할 때만 표시) */}
      {deferredPrompt && (
        <Card style={{ background: 'linear-gradient(45deg, #FF6B6B, #556270)', textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 10px 0', color: 'white' }}>📱 앱으로 설치하기</h3>
          <p style={{ margin: '0 0 15px 0', fontSize: '0.9rem', opacity: 0.9 }}>더 빠르고 쾌적하게 즐겨보세요!</p>
          <ThemeButton
            $active={true}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            theme={{ highlightWin: 'white' } as any}
            onClick={handleInstallClick}
            style={{ color: '#333', fontWeight: 'bold', padding: '10px 20px', fontSize: '1rem' }}
          >
            홈 화면에 추가
          </ThemeButton>
        </Card>
      )}

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
            <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
              {Object.keys(themes).map((key) => (
                <ThemeButton
                  key={key}
                  $active={currentTheme === key}
                  onClick={() => onThemeChange(key)}
                >
                  {themes[key].name}
                </ThemeButton>
              ))}
              {/* Custom Themes */}
              {customThemes?.map((theme) => (
                <ThemeButton
                  key={theme.name}
                  $active={currentTheme === theme.name}
                  onClick={() => onThemeChange(theme.name)}
                >
                  {theme.name}
                </ThemeButton>
              ))}
              {/* Create Button */}
              {onCreateTheme && (
                <ThemeButton
                  $active={false}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  theme={{ highlightWin: '#aaa' } as any} // Placeholder theme struct
                  onClick={onCreateTheme}
                  style={{ border: '1px dashed #aaa', color: '#aaa' }}
                >
                  + 만들기
                </ThemeButton>
              )}
            </div>
          </SettingRow>
          <SettingRow>
            <SettingLabel>바둑돌 스킨</SettingLabel>
            <div>
              {Object.keys(stoneSkins).map((key) => {
                const skinKey = key as StoneSkinType;
                return (
                  <ThemeButton
                    key={skinKey}
                    $active={currentSkin === skinKey}
                    onClick={() => onSkinChange(skinKey)}
                  >
                    {stoneSkins[skinKey].name}
                  </ThemeButton>
                );
              })}
            </div>
          </SettingRow>
          <SettingRow>
            <SettingLabel>보드 크기</SettingLabel>
            <div>
              {[9, 15, 19].map(size => (
                <ThemeButton
                  key={size}
                  $active={currentBoardSize === size}
                  onClick={() => {
                    onBoardSizeChange(size);
                  }}
                >
                  {size}x{size}
                </ThemeButton>
              ))}
            </div>
          </SettingRow>
          <SettingRow>
            <SettingLabel>AI 성격</SettingLabel>
            <div style={{ display: 'flex', gap: '5px' }}>
              {Object.keys(PERSONAS).map((key) => {
                const pKey = key as PersonaType;
                return (
                  <ThemeButton
                    key={pKey}
                    $active={currentPersona === pKey}
                    onClick={() => onPersonaChange(pKey)}
                    title={PERSONAS[pKey].description}
                  >
                    {PERSONAS[pKey].icon} {PERSONAS[pKey].name.split('(')[0]}
                  </ThemeButton>
                );
              })}
            </div>
          </SettingRow>
          <SettingRow>
            <SettingLabel>효과음 (Mute)</SettingLabel>
            <ToggleSwitch>
              <ToggleInput type="checkbox" checked={!isMuted} onChange={onMuteToggle} />
              <ToggleSlider />
            </ToggleSwitch>
          </SettingRow>
          <SettingRow>
            <SettingLabel>볼륨 크기</SettingLabel>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <VolumeSlider
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={handleVolumeChange}
                disabled={isMuted}
                style={{ opacity: isMuted ? 0.5 : 1 }}
              />
              <span style={{ fontSize: '0.9rem', width: '30px', textAlign: 'right' }}>{volume}%</span>
            </div>
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
