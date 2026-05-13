import React from 'react';
import styled from 'styled-components';

const StatsContainer = styled.div`
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

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 15px;
`;

const StatCard = styled.div`
  background: linear-gradient(135deg, ${props => props.gradient || '#667eea, #764ba2'});
  border-radius: 12px;
  padding: 15px;
  text-align: center;
  color: white;
`;

const StatValue = styled.div`
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 5px;
`;

const StatLabel = styled.div`
  font-size: 0.85rem;
  opacity: 0.9;
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
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  border-radius: 4px;
  width: ${props => props.percent}%;
  transition: width 0.5s ease;
`;

const ProgressLabel = styled.div`
  text-align: center;
  margin-top: 8px;
  font-size: 0.85rem;
  color: #666;
`;

function StatsPanel({ currentPlan, totalDuration }) {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}分${secs}秒` : `${secs}秒`;
  };

  const getDifficultyDistribution = () => {
    const dist = { 简单: 0, 中等: 0, 困难: 0 };
    currentPlan.forEach(e => {
      if (dist[e.difficulty] !== undefined) {
        dist[e.difficulty]++;
      }
    });
    return dist;
  };

  const difficultyDist = getDifficultyDistribution();
  const targetDuration = 1800;
  const progressPercent = Math.min((totalDuration / targetDuration) * 100, 100);

  return (
    <StatsContainer>
      <Title>📊 训练统计</Title>
      <StatsGrid>
        <StatCard gradient="#667eea, #764ba2">
          <StatValue>{currentPlan.length}</StatValue>
          <StatLabel>动作数量</StatLabel>
        </StatCard>
        <StatCard gradient="#4ECDC4, #44A08D">
          <StatValue>{formatTime(totalDuration)}</StatValue>
          <StatLabel>总时长</StatLabel>
        </StatCard>
        <StatCard gradient="#FF6B6B, #ee5a5a">
          <StatValue>{difficultyDist['简单']}</StatValue>
          <StatLabel>简单动作</StatLabel>
        </StatCard>
        <StatCard gradient="#FFEAA7, #f0d060">
          <StatValue>{difficultyDist['中等']}</StatValue>
          <StatLabel>中等动作</StatLabel>
        </StatCard>
        <StatCard gradient="#9B59B6, #8E44AD">
          <StatValue>{difficultyDist['困难']}</StatValue>
          <StatLabel>困难动作</StatLabel>
        </StatCard>
      </StatsGrid>
      <ProgressBar>
        <ProgressFill percent={progressPercent} />
      </ProgressBar>
      <ProgressLabel>
        目标完成度: {Math.round(progressPercent)}% (目标30分钟)
      </ProgressLabel>
    </StatsContainer>
  );
}

export default StatsPanel;
