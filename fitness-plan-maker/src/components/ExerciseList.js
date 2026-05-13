import React, { useState } from 'react';
import styled from 'styled-components';
import ImageModal from './ImageModal';

const ListContainer = styled.div`
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  max-height: 500px;
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
`;

const ExerciseItem = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 12px 15px;
  margin-bottom: 8px;
  background: ${props => props.added ? '#e8f5e9' : '#f8f9fa'};
  border-radius: 12px;
  border: 2px solid ${props => props.added ? '#4caf50' : 'transparent'};
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.added ? '#e8f5e9' : '#e9ecef'};
    transform: translateX(5px);
  }
`;

const ExerciseImage = styled.img`
  width: 80px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;
  
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  }
`;

const ExerciseInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const ExerciseName = styled.div`
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ViewImageHint = styled.span`
  font-size: 0.75rem;
  color: #667eea;
  font-weight: normal;
  cursor: pointer;
  
  &:hover {
    text-decoration: underline;
  }
`;

const ExerciseMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  font-size: 0.75rem;
  color: #666;
`;

const MetaTag = styled.span`
  background: ${props => props.color || '#e0e0e0'};
  color: ${props => props.textColor || '#333'};
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.7rem;
  white-space: nowrap;
`;

const AddButton = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  background: ${props => props.added ? '#4caf50' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};
  color: white;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.85rem;
  transition: all 0.3s ease;
  flex-shrink: 0;
  
  &:hover {
    transform: scale(1.05);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px;
  color: #999;
  
  span {
    font-size: 3rem;
    display: block;
    margin-bottom: 10px;
  }
`;

function ExerciseList({ exercises, onAddExercise, addedExercises }) {
  const [modalImage, setModalImage] = useState(null);
  const [modalTitle, setModalTitle] = useState('');

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case '简单': return { bg: '#c8e6c9', text: '#2e7d32' };
      case '中等': return { bg: '#fff3cd', text: '#856404' };
      case '困难': return { bg: '#f8d7da', text: '#721c24' };
      default: return { bg: '#e0e0e0', text: '#333' };
    }
  };

  const openImageModal = (exercise) => {
    setModalImage(exercise.image);
    setModalTitle(exercise.name);
  };

  const closeImageModal = () => {
    setModalImage(null);
    setModalTitle('');
  };

  return (
    <ListContainer>
      <Title>📋 动作列表 ({exercises.length})</Title>
      {exercises.length === 0 ? (
        <EmptyState>
          <span>🏋️</span>
          <p>请选择身体部位查看相关动作</p>
        </EmptyState>
      ) : (
        exercises.map(exercise => {
          const isAdded = addedExercises.includes(exercise.id);
          const diffColor = getDifficultyColor(exercise.difficulty);
          return (
            <ExerciseItem key={exercise.id} added={isAdded}>
              <ExerciseImage 
                src={exercise.image} 
                alt={exercise.name}
                onClick={() => openImageModal(exercise)}
              />
              <ExerciseInfo>
                <ExerciseName>
                  {exercise.name}
                  <ViewImageHint onClick={() => openImageModal(exercise)}>
                    👁️ 查看大图
                  </ViewImageHint>
                </ExerciseName>
                <ExerciseMeta>
                  <MetaTag color={diffColor.bg} textColor={diffColor.text}>
                    {exercise.difficulty}
                  </MetaTag>
                  <MetaTag>⏱️ {exercise.duration}秒</MetaTag>
                  <MetaTag>🔄 {exercise.reps}</MetaTag>
                </ExerciseMeta>
              </ExerciseInfo>
              <AddButton
                added={isAdded}
                onClick={() => onAddExercise(exercise)}
                disabled={isAdded}
              >
                {isAdded ? '✓ 已添加' : '+ 添加'}
              </AddButton>
            </ExerciseItem>
          );
        })
      )}
      
      {modalImage && (
        <ImageModal 
          image={modalImage} 
          title={modalTitle} 
          onClose={closeImageModal} 
        />
      )}
    </ListContainer>
  );
}

export default ExerciseList;
