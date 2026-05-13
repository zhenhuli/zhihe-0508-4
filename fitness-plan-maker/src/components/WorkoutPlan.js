import React, { useState } from 'react';
import styled from 'styled-components';
import ImageModal from './ImageModal';

const PlanContainer = styled.div`
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  max-height: 450px;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 4px;
    
    &:hover {
      background: #a8a8a8;
    }
  }
`;

const Title = styled.h2`
  font-size: 1.3rem;
  color: #333;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 10px;
  position: sticky;
  top: 0;
  background: white;
  padding-bottom: 10px;
  z-index: 10;
`;

const PlanHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
  position: sticky;
  top: 45px;
  background: white;
  padding-bottom: 15px;
  z-index: 10;
`;

const PlanNameInput = styled.input`
  padding: 10px 15px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.3s;
  
  &:focus {
    border-color: #667eea;
  }
`;

const DaySelector = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const DayButton = styled.button`
  padding: 6px 12px;
  border: 2px solid ${props => props.selected ? '#667eea' : '#e0e0e0'};
  border-radius: 20px;
  background: ${props => props.selected ? '#667eea' : 'white'};
  color: ${props => props.selected ? 'white' : '#333'};
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #667eea;
  }
`;

const PlanItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 15px;
  margin-bottom: 8px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 12px;
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.02);
  }
`;

const ExerciseNumber = styled.div`
  width: 28px;
  height: 28px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.85rem;
  flex-shrink: 0;
`;

const ExerciseThumbnail = styled.img`
  width: 50px;
  height: 40px;
  object-fit: cover;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;
  
  &:hover {
    transform: scale(1.15);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  }
`;

const ExerciseDetails = styled.div`
  flex: 1;
`;

const ExerciseTitle = styled.div`
  font-weight: 600;
  color: #333;
`;

const ExerciseStats = styled.div`
  font-size: 0.8rem;
  color: #666;
  margin-top: 3px;
`;

const MoveButtons = styled.div`
  display: flex;
  gap: 5px;
`;

const MoveButton = styled.button`
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 6px;
  background: #e0e0e0;
  color: #333;
  cursor: pointer;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    background: #667eea;
    color: white;
  }
  
  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

const RemoveButton = styled.button`
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  background: #ff6b6b;
  color: white;
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.2s ease;
  
  &:hover {
    background: #ee5a5a;
  }
`;

const SaveButton = styled.button`
  padding: 12px 24px;
  border: none;
  border-radius: 10px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
  margin-top: 15px;
  width: 100%;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const EmptyPlan = styled.div`
  text-align: center;
  padding: 40px;
  color: #999;
  
  span {
    font-size: 3rem;
    display: block;
    margin-bottom: 10px;
  }
`;

function WorkoutPlan({
  currentPlan,
  onRemoveExercise,
  onMoveExercise,
  planName,
  onPlanNameChange,
  selectedDays,
  onToggleDay,
  weekDays,
  onSavePlan
}) {
  const [modalImage, setModalImage] = useState(null);
  const [modalTitle, setModalTitle] = useState('');

  const openImageModal = (exercise) => {
    setModalImage(exercise.image);
    setModalTitle(exercise.name);
  };

  const closeImageModal = () => {
    setModalImage(null);
    setModalTitle('');
  };

  return (
    <PlanContainer>
      <Title>📝 我的训练计划 ({currentPlan.length})</Title>
      <PlanHeader>
        <PlanNameInput
          type="text"
          placeholder="给你的计划起个名字..."
          value={planName}
          onChange={(e) => onPlanNameChange(e.target.value)}
        />
        <DaySelector>
          {weekDays.map(day => (
            <DayButton
              key={day}
              selected={selectedDays.includes(day)}
              onClick={() => onToggleDay(day)}
            >
              {day}
            </DayButton>
          ))}
        </DaySelector>
      </PlanHeader>
      
      {currentPlan.length === 0 ? (
        <EmptyPlan>
          <span>📋</span>
          <p>从左侧添加动作开始你的训练计划</p>
        </EmptyPlan>
      ) : (
        currentPlan.map((exercise, index) => (
          <PlanItem key={exercise.id}>
            <ExerciseNumber>{index + 1}</ExerciseNumber>
            <ExerciseThumbnail 
              src={exercise.image} 
              alt={exercise.name}
              onClick={() => openImageModal(exercise)}
            />
            <ExerciseDetails>
              <ExerciseTitle>{exercise.name}</ExerciseTitle>
              <ExerciseStats>
                ⏱️ {exercise.duration}秒 | 🔄 {exercise.reps} | ⭐ {exercise.difficulty}
              </ExerciseStats>
            </ExerciseDetails>
            <MoveButtons>
              <MoveButton
                onClick={() => onMoveExercise(index, -1)}
                disabled={index === 0}
              >
                ↑
              </MoveButton>
              <MoveButton
                onClick={() => onMoveExercise(index, 1)}
                disabled={index === currentPlan.length - 1}
              >
                ↓
              </MoveButton>
            </MoveButtons>
            <RemoveButton onClick={() => onRemoveExercise(exercise.id)}>
              删除
            </RemoveButton>
          </PlanItem>
        ))
      )}
      
      <SaveButton
        onClick={onSavePlan}
        disabled={!planName.trim() || currentPlan.length === 0}
      >
        💾 保存训练计划
      </SaveButton>
      
      {modalImage && (
        <ImageModal 
          image={modalImage} 
          title={modalTitle} 
          onClose={closeImageModal} 
        />
      )}
    </PlanContainer>
  );
}

export default WorkoutPlan;
