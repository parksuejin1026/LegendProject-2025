import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  width: 100%;
  padding: 20px;
  background: rgba(0, 0, 0, 0.8);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  margin-top: 20px;
  color: white;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const SliderContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const Slider = styled.input`
  flex: 1;
  height: 6px;
  -webkit-appearance: none;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
  outline: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: ${({ theme }) => theme.highlightWin};
    cursor: pointer;
    transition: transform 0.2s;
  }

  &::-webkit-slider-thumb:hover {
    transform: scale(1.2);
  }
`;

const MoveLabel = styled.div`
  min-width: 80px;
  text-align: right;
  font-family: monospace;
  font-size: 1.1rem;
  font-weight: bold;
`;



const IconButton = styled.button`
  background: none;
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: white;
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

interface ReplayControlProps {
  currentStep: number;
  totalSteps: number;
  onStepChange: (step: number) => void;
  onExit: () => void;
}

const ReplayControl: React.FC<ReplayControlProps> = ({
  currentStep,
  totalSteps,
  onStepChange,
  onExit
}) => {
  return (
    <Container>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>🔄 복기 모드</h3>
        <IconButton onClick={onExit} style={{ width: 'auto', padding: '5px 15px', borderRadius: '4px' }}>
          종료
        </IconButton>
      </div>

      <SliderContainer>
        <IconButton onClick={() => onStepChange(Math.max(0, currentStep - 1))} disabled={currentStep === 0}>
          ◀
        </IconButton>
        <Slider
          type="range"
          min="0"
          max={totalSteps}
          value={currentStep}
          onChange={(e) => onStepChange(Number(e.target.value))}
        />
        <IconButton onClick={() => onStepChange(Math.min(totalSteps, currentStep + 1))} disabled={currentStep === totalSteps}>
          ▶
        </IconButton>
        <MoveLabel>
          {currentStep} / {totalSteps}
        </MoveLabel>
      </SliderContainer>

      <div style={{ fontSize: '0.8rem', color: '#aaa', textAlign: 'center' }}>
        슬라이더를 움직여 이전 수를 확인하세요
      </div>
    </Container>
  );
};

export default ReplayControl;
