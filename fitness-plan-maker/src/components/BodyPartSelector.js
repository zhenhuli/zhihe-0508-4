import React from 'react';
import styled from 'styled-components';

const SelectorContainer = styled.div`
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
`;

const Title = styled.h2`
  font-size: 1.3rem;
  color: #333;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const BodyPartGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 10px;
`;

const BodyPartButton = styled.button`
  padding: 12px 8px;
  border: 2px solid ${props => props.selected ? props.color : '#e0e0e0'};
  border-radius: 12px;
  background: ${props => props.selected ? props.color : 'white'};
  color: ${props => props.selected ? 'white' : '#333'};
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  font-weight: 500;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.15);
    border-color: ${props => props.color};
  }
  
  span {
    font-size: 1.5rem;
    display: block;
    margin-bottom: 5px;
  }
`;

const AllButton = styled(BodyPartButton)`
  background: ${props => props.selected ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'white'};
  border-color: ${props => props.selected ? '#667eea' : '#e0e0e0'};
`;

function BodyPartSelector({ bodyParts, selectedBodyPart, onSelect }) {
  return (
    <SelectorContainer>
      <Title>🎯 选择身体部位</Title>
      <BodyPartGrid>
        <AllButton
          selected={selectedBodyPart === null}
          onClick={() => onSelect(null)}
          color="#667eea"
        >
          <span>🔄</span>
          全部
        </AllButton>
        {bodyParts.map(part => (
          <BodyPartButton
            key={part.id}
            selected={selectedBodyPart === part.id}
            onClick={() => onSelect(part.id)}
            color={part.color}
          >
            <span>{part.icon}</span>
            {part.name}
          </BodyPartButton>
        ))}
      </BodyPartGrid>
    </SelectorContainer>
  );
}

export default BodyPartSelector;
