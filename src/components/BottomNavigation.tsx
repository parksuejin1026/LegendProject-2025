import React from 'react';
import styled from 'styled-components';
import { Theme } from '../styles/theme';

const NavContainer = styled.nav`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 60px;
  background-color: ${({ theme }) => theme.boardBackground};
  border-top: 1px solid ${({ theme }) => theme.gridLine};
  display: flex;
  justify-content: space-around;
  align-items: center;
  z-index: 1000;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.3);
`;

const NavItem = styled.button<{ $active: boolean; theme: Theme }>`
  background: none;
  border: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: ${({ $active, theme }) => ($active ? theme.highlightWin : '#888')};
  cursor: pointer;
  padding: 5px;
  flex: 1;
  transition: color 0.2s;

  &:hover {
    color: ${({ theme }) => theme.highlightWin};
  }
`;

const Icon = styled.span`
  font-size: 1.5rem;
  margin-bottom: 2px;
`;

const Label = styled.span`
  font-size: 0.75rem;
  font-weight: 500;
`;

interface BottomNavigationProps {
    activeTab: 'game' | 'rank' | 'profile';
    onTabChange: (tab: 'game' | 'rank' | 'profile') => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ activeTab, onTabChange }) => {
    return (
        <NavContainer>
            <NavItem $active={activeTab === 'game'} onClick={() => onTabChange('game')}>
                <Icon>🎮</Icon>
                <Label>게임</Label>
            </NavItem>
            <NavItem $active={activeTab === 'rank'} onClick={() => onTabChange('rank')}>
                <Icon>🏆</Icon>
                <Label>랭킹</Label>
            </NavItem>
            <NavItem $active={activeTab === 'profile'} onClick={() => onTabChange('profile')}>
                <Icon>👤</Icon>
                <Label>마이</Label>
            </NavItem>
        </NavContainer>
    );
};

export default BottomNavigation;
