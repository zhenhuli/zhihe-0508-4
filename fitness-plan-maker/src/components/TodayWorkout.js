import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ImageModal from './ImageModal';

const TodayContainer = styled.div`
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

const DateDisplay = styled.div`
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 15px;
  padding: 8px 15px;
  background: linear-gradient(135deg, #667eea20 0%, #764ba220 100%);
  border-radius: 8px;
  display: inline-block;
`;

const PlanSelector = styled.div`
  margin-bottom: 15px;
`;

const SelectLabel = styled.div`
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 8px;
`;

const PlanTabs = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const PlanTab = styled.button`
  padding: 8px 16px;
  border: 2px solid ${props => props.selected ? '#667eea' : '#e0e0e0'};
  border-radius: 20px;
  background: ${props => props.selected ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'white'};
  color: ${props => props.selected ? 'white' : '#333'};
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #667eea;
  }
`;

const TaskItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 15px;
  margin-bottom: 8px;
  background: ${props => props.completed ? 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)' : '#f8f9fa'};
  border-radius: 12px;
  border: 2px solid ${props => props.completed ? '#4caf50' : 'transparent'};
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateX(5px);
  }
`;

const Checkbox = styled.div`
  width: 28px;
  height: 28px;
  border: 2px solid ${props => props.checked ? '#4caf50' : '#ddd'};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background: ${props => props.checked ? '#4caf50' : 'white'};
  color: white;
  font-weight: bold;
  font-size: 1rem;
  transition: all 0.3s ease;
  flex-shrink: 0;
  
  &:hover {
    transform: scale(1.1);
  }
`;

const TaskThumbnail = styled.img`
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

const TaskInfo = styled.div`
  flex: 1;
`;

const TaskName = styled.div`
  font-weight: 600;
  color: ${props => props.completed ? '#2e7d32' : '#333'};
  text-decoration: ${props => props.completed ? 'line-through' : 'none'};
`;

const TaskStats = styled.div`
  font-size: 0.8rem;
  color: #666;
  margin-top: 3px;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: #e0e0e0;
  border-radius: 4px;
  margin-top: 15px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #4caf50 0%, #81c784 100%);
  border-radius: 4px;
  width: ${props => props.percent}%;
  transition: width 0.5s ease;
`;

const ProgressText = styled.div`
  text-align: center;
  margin-top: 8px;
  font-size: 0.9rem;
  color: #666;
  
  span {
    font-weight: 600;
    color: #4caf50;
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

const CelebrateMessage = styled.div`
  text-align: center;
  padding: 20px;
  background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
  border-radius: 12px;
  margin-bottom: 15px;
  animation: pulse 2s infinite;
  
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.02); }
  }
  
  span {
    font-size: 2rem;
    display: block;
    margin-bottom: 8px;
  }
  
  div {
    font-weight: 600;
    color: #e65100;
  }
`;

const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

function TodayWorkout({ savedPlans, exercises }) {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [completedExercises, setCompletedExercises] = useState([]);
  const [modalImage, setModalImage] = useState(null);
  const [modalTitle, setModalTitle] = useState('');

  const today = new Date();
  const todayDayName = weekDays[today.getDay()];
  const dateString = `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日 ${todayDayName}`;
  const storageKey = `workout_${today.toDateString()}`;

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      const data = JSON.parse(saved);
      setCompletedExercises(data.completed || []);
      if (data.planId) {
        const plan = savedPlans.find(p => p.id === data.planId);
        if (plan) {
          setSelectedPlan(plan);
        }
      }
    }
  }, [savedPlans.length]);

  useEffect(() => {
    if (selectedPlan) {
      localStorage.setItem(storageKey, JSON.stringify({
        planId: selectedPlan.id,
        completed: completedExercises
      }));
    }
  }, [selectedPlan, completedExercises]);

  const getTodayPlans = () => {
    return savedPlans.filter(plan => 
      plan.days && plan.days.includes(todayDayName)
    );
  };

  const getPlanExercises = (plan) => {
    return plan.exercises
      .map(id => exercises.find(e => e.id === id))
      .filter(Boolean);
  };

  const toggleComplete = (exerciseId) => {
    setCompletedExercises(prev => 
      prev.includes(exerciseId)
        ? prev.filter(id => id !== exerciseId)
        : [...prev, exerciseId]
    );
  };

  const openImageModal = (exercise) => {
    setModalImage(exercise.image);
    setModalTitle(exercise.name);
  };

  const closeImageModal = () => {
    setModalImage(null);
    setModalTitle('');
  };

  const todayPlans = getTodayPlans();
  const currentPlanExercises = selectedPlan ? getPlanExercises(selectedPlan) : [];
  const completedCount = currentPlanExercises.filter(e => completedExercises.includes(e.id)).length;
  const totalCount = currentPlanExercises.length;
  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
  const isAllCompleted = totalCount > 0 && completedCount === totalCount;

  return (
    <TodayContainer>
      <Title>🔥 今日训练任务</Title>
      <DateDisplay>📅 {dateString}</DateDisplay>
      
      {savedPlans.length === 0 ? (
        <EmptyState>
          <span>📝</span>
          <p>还没有保存的训练计划</p>
          <p style={{ fontSize: '0.85rem', marginTop: '5px' }}>先创建并保存一个训练计划吧</p>
        </EmptyState>
      ) : todayPlans.length === 0 && !selectedPlan ? (
        <EmptyState>
          <span>😴</span>
          <p>今天没有安排训练计划</p>
          <p style={{ fontSize: '0.85rem', marginTop: '5px' }}>选择一个计划开始训练，或者休息一天吧</p>
          <PlanTabs style={{ marginTop: '15px', justifyContent: 'center' }}>
            {savedPlans.map(plan => (
              <PlanTab
                key={plan.id}
                selected={selectedPlan?.id === plan.id}
                onClick={() => setSelectedPlan(plan)}
              >
                {plan.name}
              </PlanTab>
            ))}
          </PlanTabs>
        </EmptyState>
      ) : (
        <>
          <PlanSelector>
            <SelectLabel>选择训练计划：</SelectLabel>
            <PlanTabs>
              {todayPlans.length > 0 && todayPlans.map(plan => (
                <PlanTab
                  key={plan.id}
                  selected={selectedPlan?.id === plan.id}
                  onClick={() => {
                    setSelectedPlan(plan);
                    setCompletedExercises([]);
                  }}
                >
                  {plan.name} {plan.days?.includes(todayDayName) && '(今日)'}
                </PlanTab>
              ))}
              {savedPlans.filter(p => !p.days?.includes(todayDayName)).map(plan => (
                <PlanTab
                  key={plan.id}
                  selected={selectedPlan?.id === plan.id}
                  onClick={() => {
                    setSelectedPlan(plan);
                    setCompletedExercises([]);
                  }}
                >
                  {plan.name}
                </PlanTab>
              ))}
            </PlanTabs>
          </PlanSelector>

          {selectedPlan ? (
            <>
              {isAllCompleted && (
                <CelebrateMessage>
                  <span>🎉</span>
                  <div>太棒了！今日训练全部完成！</div>
                </CelebrateMessage>
              )}
              
              {currentPlanExercises.map(exercise => (
                <TaskItem key={exercise.id} completed={completedExercises.includes(exercise.id)}>
                  <Checkbox
                    checked={completedExercises.includes(exercise.id)}
                    onClick={() => toggleComplete(exercise.id)}
                  >
                    {completedExercises.includes(exercise.id) && '✓'}
                  </Checkbox>
                  <TaskThumbnail
                    src={exercise.image}
                    alt={exercise.name}
                    onClick={() => openImageModal(exercise)}
                  />
                  <TaskInfo>
                    <TaskName completed={completedExercises.includes(exercise.id)}>
                      {exercise.name}
                    </TaskName>
                    <TaskStats>
                      ⏱️ {exercise.duration}秒 | 🔄 {exercise.reps} | ⭐ {exercise.difficulty}
                    </TaskStats>
                  </TaskInfo>
                </TaskItem>
              ))}
              
              <ProgressBar>
                <ProgressFill percent={progressPercent} />
              </ProgressBar>
              <ProgressText>
                完成进度：<span>{completedCount}/{totalCount}</span> 个动作 ({Math.round(progressPercent)}%)
              </ProgressText>
            </>
          ) : (
            <EmptyState>
              <span>👆</span>
              <p>请选择一个训练计划开始今日训练</p>
            </EmptyState>
          )}
        </>
      )}
      
      {modalImage && (
        <ImageModal 
          image={modalImage} 
          title={modalTitle} 
          onClose={closeImageModal} 
        />
      )}
    </TodayContainer>
  );
}

export default TodayWorkout;
