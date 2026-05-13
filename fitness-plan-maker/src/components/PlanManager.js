import React from 'react';
import styled from 'styled-components';

const ManagerContainer = styled.div`
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  max-height: 350px;
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

const PlanCard = styled.div`
  padding: 15px;
  margin-bottom: 10px;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8ed 100%);
  border-radius: 12px;
  border-left: 4px solid #667eea;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateX(5px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }
`;

const PlanHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const PlanTitle = styled.div`
  font-weight: 600;
  color: #333;
  font-size: 1.05rem;
`;

const PlanActions = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button`
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 500;
  transition: all 0.2s ease;
  
  &.load {
    background: #667eea;
    color: white;
    
    &:hover {
      background: #5a6fd6;
    }
  }
  
  &.delete {
    background: #ff6b6b;
    color: white;
    
    &:hover {
      background: #ee5a5a;
    }
  }
`;

const PlanDetails = styled.div`
  display: flex;
  gap: 15px;
  font-size: 0.85rem;
  color: #666;
`;

const DetailTag = styled.span`
  background: #e0e0e0;
  padding: 3px 10px;
  border-radius: 15px;
`;

const EmptyPlans = styled.div`
  text-align: center;
  padding: 40px;
  color: #999;
  
  span {
    font-size: 3rem;
    display: block;
    margin-bottom: 10px;
  }
`;

function PlanManager({ savedPlans, exercises, onLoadPlan, onDeletePlan }) {
  const getPlanDuration = (plan) => {
    return plan.exercises.reduce((sum, id) => {
      const exercise = exercises.find(e => e.id === id);
      return sum + (exercise ? exercise.duration : 0);
    }, 0);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}分${secs}秒` : `${secs}秒`;
  };

  return (
    <ManagerContainer>
      <Title>💾 已保存的计划 ({savedPlans.length})</Title>
      {savedPlans.length === 0 ? (
        <EmptyPlans>
          <span>📁</span>
          <p>还没有保存的训练计划</p>
        </EmptyPlans>
      ) : (
        savedPlans.map(plan => (
          <PlanCard key={plan.id}>
            <PlanHeader>
              <PlanTitle>{plan.name}</PlanTitle>
              <PlanActions>
                <ActionButton className="load" onClick={() => onLoadPlan(plan)}>
                  📂 加载
                </ActionButton>
                <ActionButton className="delete" onClick={() => onDeletePlan(plan.id)}>
                  🗑️ 删除
                </ActionButton>
              </PlanActions>
            </PlanHeader>
            <PlanDetails>
              <DetailTag>🏋️ {plan.exercises.length} 个动作</DetailTag>
              <DetailTag>⏱️ {formatTime(getPlanDuration(plan))}</DetailTag>
              {plan.days && plan.days.length > 0 && (
                <DetailTag>📅 {plan.days.join(', ')}</DetailTag>
              )}
            </PlanDetails>
          </PlanCard>
        ))
      )}
    </ManagerContainer>
  );
}

export default PlanManager;
