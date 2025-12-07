import React, { useState } from 'react';
import styled from 'styled-components';
import { Theme } from '../styles/theme';

interface CustomThemeCreatorProps {
    onSave: (theme: Theme) => void;
    onCancel: () => void;
}

const Overlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1200;
`;

const Modal = styled.div`
  background: #2a2a2a;
  padding: 20px;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  color: white;
  max-height: 90vh;
  overflow-y: auto;
`;

const Title = styled.h2`
  margin-top: 0;
  text-align: center;
  margin-bottom: 20px;
`;

const ControlGroup = styled.div`
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const Label = styled.label`
  font-size: 0.9rem;
  color: #ccc;
`;

const Input = styled.input`
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #555;
  background: #333;
  color: white;
`;

const ColorInput = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
  justify-content: flex-end;
`;

const Button = styled.button`
  padding: 10px 20px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-weight: bold;
  
  &:hover { opacity: 0.9; }
`;

const PreviewBoard = styled.div<{ theme: Theme }>`
  width: 100%;
  height: 150px;
  background: ${props => props.theme.background};
  border: 1px solid #555;
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const PreviewGrid = styled.div<{ theme: Theme }>`
  width: 100px;
  height: 100px;
  background: ${props => props.theme.boardBackground};
  border: 2px solid ${props => props.theme.boardBorder};
  position: relative;
  box-shadow: ${props => props.theme.boardShadow};
  
  &::before {
    content: '';
    position: absolute;
    top: 50%; left: 0; right: 0;
    height: 1px;
    background: ${props => props.theme.gridLine};
  }
  &::after {
    content: '';
    position: absolute;
    left: 50%; top: 0; bottom: 0;
    width: 1px;
    background: ${props => props.theme.gridLine};
  }
`;

const CustomThemeCreator: React.FC<CustomThemeCreatorProps> = ({ onSave, onCancel }) => {
    const [name, setName] = useState('My Custom Theme');
    const [background, setBackground] = useState('#1a1c20'); // Simple Color for custom
    const [boardBackground, setBoardBackground] = useState('#34495e');
    const [gridLine, setGridLine] = useState('#5d6d7e');
    const [highlightLast, setHighlightLast] = useState('#ff0000');

    // Base theme for defaults
    const createTheme = (): Theme => ({
        name,
        background, // If user wants gradient, they can input CSS string, but color picker usually hex
        boardBackground,
        boardBorder: gridLine, // Simplify
        gridLine,
        text: '#ffffff',
        buttonBg: 'rgba(255,255,255,0.1)',
        buttonText: '#ffffff',
        buttonHover: 'rgba(255,255,255,0.2)',
        stoneBlack: '#000000',
        stoneWhite: '#ffffff',
        highlightWin: 'gold',
        highlightLast,
        stoneShadow: '2px 2px 4px rgba(0,0,0,0.4)',
        boardShadow: '0 10px 30px rgba(0,0,0,0.5)',
    });

    const currentPreview = createTheme();

    return (
        <Overlay>
            <Modal>
                <Title>🎨 나만의 테마 만들기</Title>

                <PreviewBoard theme={currentPreview}>
                    <PreviewGrid theme={currentPreview} />
                </PreviewBoard>

                <ControlGroup>
                    <Label>테마 이름</Label>
                    <Input value={name} onChange={e => setName(e.target.value)} />
                </ControlGroup>

                <ControlGroup>
                    <Label>메인 배경색</Label>
                    <ColorInput>
                        <Input type="color" value={background} onChange={e => setBackground(e.target.value)} />
                        <span>{background}</span>
                    </ColorInput>
                </ControlGroup>

                <ControlGroup>
                    <Label>보드판 색상</Label>
                    <ColorInput>
                        <Input type="color" value={boardBackground} onChange={e => setBoardBackground(e.target.value)} />
                        <span>{boardBackground}</span>
                    </ColorInput>
                </ControlGroup>

                <ControlGroup>
                    <Label>선(Line) 색상</Label>
                    <ColorInput>
                        <Input type="color" value={gridLine} onChange={e => setGridLine(e.target.value)} />
                        <span>{gridLine}</span>
                    </ColorInput>
                </ControlGroup>

                <ControlGroup>
                    <Label>마지막 수 강조색</Label>
                    <ColorInput>
                        <Input type="color" value={highlightLast} onChange={e => setHighlightLast(e.target.value)} />
                        <span>{highlightLast}</span>
                    </ColorInput>
                </ControlGroup>

                <ButtonGroup>
                    <Button onClick={onCancel} style={{ background: '#555', color: '#fff' }}>취소</Button>
                    <Button onClick={() => onSave(createTheme())} style={{ background: '#4CAF50', color: '#fff' }}>저장하기</Button>
                </ButtonGroup>
            </Modal>
        </Overlay>
    );
};

export default CustomThemeCreator;
