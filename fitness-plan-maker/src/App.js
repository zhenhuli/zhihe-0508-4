import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { bodyParts, exercises, defaultPlans } from './data/exercises';
import BodyPartSelector from './components/BodyPartSelector';
import ExerciseList from './components/ExerciseList';
import WorkoutPlan from './components/WorkoutPlan';
import PlanManager from './components/PlanManager';
import StatsPanel from './components/StatsPanel';
import TodayWorkout from './components/TodayWorkout';

const AppContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
`;

const Header = styled.header`
  text-align: center;
  color: white;
  margin-bottom: 30px;
  
  h1 {
    font-size: 2.5rem;
    margin-bottom: 10px;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
  }
  
  p {
    font-size: 1.1rem;
    opacity: 0.9;
  }
`;

const MainContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const LeftPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const RightPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

function App() {
  const [selectedBodyPart, setSelectedBodyPart] = useState(null);
  const [currentPlan, setCurrentPlan] = useState([]);
  const [savedPlans, setSavedPlans] = useState([]);
  const [planName, setPlanName] = useState('');
  const [selectedDays, setSelectedDays] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('fitnessPlans');
    if (saved) {
      setSavedPlans(JSON.parse(saved));
    } else {
      setSavedPlans(defaultPlans);
    }
  }, []);

  useEffect(() => {
    if (savedPlans.length > 0) {
      localStorage.setItem('fitnessPlans', JSON.stringify(savedPlans));
    }
  }, [savedPlans]);

  const addExercise = (exercise) => {
    if (!currentPlan.find(e => e.id === exercise.id)) {
      setCurrentPlan([...currentPlan, exercise]);
    }
  };

  const removeExercise = (exerciseId) => {
    setCurrentPlan(currentPlan.filter(e => e.id !== exerciseId));
  };

  const moveExercise = (index, direction) => {
    const newPlan = [...currentPlan];
    const newIndex = index + direction;
    if (newIndex >= 0 && newIndex < newPlan.length) {
      [newPlan[index], newPlan[newIndex]] = [newPlan[newIndex], newPlan[index]];
      setCurrentPlan(newPlan);
    }
  };

  const saveCurrentPlan = () => {
    if (!planName.trim() || currentPlan.length === 0) return;
    
    const newPlan = {
      id: `plan_${Date.now()}`,
      name: planName,
      days: selectedDays,
      exercises: currentPlan.map(e => e.id)
    };
    
    setSavedPlans([...savedPlans, newPlan]);
    setPlanName('');
    setSelectedDays([]);
    setCurrentPlan([]);
  };

  const loadPlan = (plan) => {
    const planExercises = plan.exercises
      .map(id => exercises.find(e => e.id === id))
      .filter(Boolean);
    setCurrentPlan(planExercises);
    setPlanName(plan.name);
    setSelectedDays(plan.days || []);
  };

  const deletePlan = (planId) => {
    setSavedPlans(savedPlans.filter(p => p.id !== planId));
  };

  const totalDuration = currentPlan.reduce((sum, e) => sum + e.duration, 0);
  const filteredExercises = selectedBodyPart 
    ? exercises.filter(e => e.bodyPart === selectedBodyPart)
    : exercises;

  const weekDays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
  const toggleDay = (day) => {
    setSelectedDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  return (
    <AppContainer>
      <Header>
        <h1>🏋️ 居家健身计划定制器</h1>
        <p>按身体部位选择动作，打造专属训练计划</p>
      </Header>

      <MainContent>
        <LeftPanel>
          <TodayWorkout
            savedPlans={savedPlans}
            exercises={exercises}
          />
          <BodyPartSelector
            bodyParts={bodyParts}
            selectedBodyPart={selectedBodyPart}
            onSelect={setSelectedBodyPart}
          />
          <ExerciseList
            exercises={filteredExercises}
            onAddExercise={addExercise}
            addedExercises={currentPlan.map(e => e.id)}
          />
        </LeftPanel>

        <RightPanel>
          <WorkoutPlan
            currentPlan={currentPlan}
            onRemoveExercise={removeExercise}
            onMoveExercise={moveExercise}
            planName={planName}
            onPlanNameChange={setPlanName}
            selectedDays={selectedDays}
            onToggleDay={toggleDay}
            weekDays={weekDays}
            onSavePlan={saveCurrentPlan}
          />
          <StatsPanel currentPlan={currentPlan} totalDuration={totalDuration} />
          <PlanManager
            savedPlans={savedPlans}
            exercises={exercises}
            onLoadPlan={loadPlan}
            onDeletePlan={deletePlan}
          />
        </RightPanel>
      </MainContent>
    </AppContainer>
  );
}

export default App;
