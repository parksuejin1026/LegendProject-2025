import React from 'react';
import styled from 'styled-components';
import { Theme } from '../styles/theme';

const NavContainer = styled.nav`
  display: flex;
  gap: 20px;
  align-items: center;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavItem = styled.button<{ $active: boolean; theme: Theme }>`
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px 16px;
  font-size: 1rem;
  font-weight: 600;
  color: ${({ $active, theme }) => ($active ? theme.highlightWin : '#888')};
  position: relative;
  transition: all 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.text};
    transform: translateY(-2px);
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    width: ${({ $active }) => ($active ? '100%' : '0')};
    height: 2px;
    background-color: ${({ theme }) => theme.highlightWin};
    transform: translateX(-50%);
    transition: width 0.3s ease;
  }
`;

interface HeaderNavigationProps {
    activeTab: 'game' | 'rank' | 'profile';
    onTabChange: (tab: 'game' | 'rank' | 'profile') => void;
}

const HeaderNavigation: React.FC<HeaderNavigationProps> = ({ activeTab, onTabChange }) => {
    return (
        <NavContainer>
            <NavItem $active={activeTab === 'game'} onClick={() => onTabChange('game')}>
                게임
            </NavItem>
            <NavItem $active={activeTab === 'rank'} onClick={() => onTabChange('rank')}>
                랭킹
            </NavItem>
            <NavItem $active={activeTab === 'profile'} onClick={() => onTabChange('profile')}>
                마이페이지
            </NavItem>
        </NavContainer>
    );
};

export default HeaderNavigation;
