export const bodyParts = [
  { id: 'chest', name: '胸部', icon: '💪', color: '#FF6B6B' },
  { id: 'back', name: '背部', icon: '🦴', color: '#4ECDC4' },
  { id: 'shoulders', name: '肩部', icon: '🧘', color: '#45B7D1' },
  { id: 'arms', name: '手臂', icon: '💪', color: '#96CEB4' },
  { id: 'core', name: '核心', icon: '🔥', color: '#FFEAA7' },
  { id: 'legs', name: '腿部', icon: '🦵', color: '#DDA0DD' },
  { id: 'glutes', name: '臀部', icon: '🍑', color: '#FFB6C1' }
];

export const exercises = [
  { id: 1, name: '标准俯卧撑', bodyPart: 'chest', duration: 60, difficulty: '中等', reps: '15-20个', image: 'https://picsum.photos/seed/pushup1/400/300' },
  { id: 2, name: '上斜俯卧撑', bodyPart: 'chest', duration: 45, difficulty: '简单', reps: '12-15个', image: 'https://picsum.photos/seed/pushup2/400/300' },
  { id: 3, name: '下斜俯卧撑', bodyPart: 'chest', duration: 60, difficulty: '困难', reps: '10-15个', image: 'https://picsum.photos/seed/pushup3/400/300' },
  { id: 4, name: '宽距俯卧撑', bodyPart: 'chest', duration: 45, difficulty: '中等', reps: '12-15个', image: 'https://picsum.photos/seed/pushup4/400/300' },
  { id: 5, name: '钻石俯卧撑', bodyPart: 'chest', duration: 45, difficulty: '困难', reps: '8-12个', image: 'https://picsum.photos/seed/pushup5/400/300' },
  
  { id: 6, name: '超人式', bodyPart: 'back', duration: 45, difficulty: '简单', reps: '15个', image: 'https://picsum.photos/seed/back1/400/300' },
  { id: 7, name: '俯卧划船', bodyPart: 'back', duration: 60, difficulty: '中等', reps: '12个/侧', image: 'https://picsum.photos/seed/back2/400/300' },
  { id: 8, name: '拱桥', bodyPart: 'back', duration: 45, difficulty: '简单', reps: '15个', image: 'https://picsum.photos/seed/back3/400/300' },
  { id: 9, name: '靠墙天使', bodyPart: 'back', duration: 60, difficulty: '简单', reps: '10个', image: 'https://picsum.photos/seed/back4/400/300' },
  
  { id: 10, name: '开合跳', bodyPart: 'shoulders', duration: 60, difficulty: '简单', reps: '30个', image: 'https://picsum.photos/seed/shoulder1/400/300' },
  { id: 11, name: '侧平举', bodyPart: 'shoulders', duration: 45, difficulty: '中等', reps: '15个', image: 'https://picsum.photos/seed/shoulder2/400/300' },
  { id: 12, name: '前平举', bodyPart: 'shoulders', duration: 45, difficulty: '中等', reps: '15个', image: 'https://picsum.photos/seed/shoulder3/400/300' },
  { id: 13, name: '俯身飞鸟', bodyPart: 'shoulders', duration: 45, difficulty: '中等', reps: '12个', image: 'https://picsum.photos/seed/shoulder4/400/300' },
  { id: 14, name: '靠墙倒立', bodyPart: 'shoulders', duration: 30, difficulty: '困难', reps: '保持30秒', image: 'https://picsum.photos/seed/shoulder5/400/300' },
  
  { id: 15, name: '二头弯举', bodyPart: 'arms', duration: 45, difficulty: '简单', reps: '15个', image: 'https://picsum.photos/seed/arm1/400/300' },
  { id: 16, name: '三头臂屈伸', bodyPart: 'arms', duration: 60, difficulty: '中等', reps: '12-15个', image: 'https://picsum.photos/seed/arm2/400/300' },
  { id: 17, name: '锤式弯举', bodyPart: 'arms', duration: 45, difficulty: '简单', reps: '15个', image: 'https://picsum.photos/seed/arm3/400/300' },
  { id: 18, name: '钻石俯卧撑', bodyPart: 'arms', duration: 45, difficulty: '困难', reps: '10个', image: 'https://picsum.photos/seed/arm4/400/300' },
  
  { id: 19, name: '平板支撑', bodyPart: 'core', duration: 60, difficulty: '中等', reps: '保持60秒', image: 'https://picsum.photos/seed/core1/400/300' },
  { id: 20, name: '卷腹', bodyPart: 'core', duration: 45, difficulty: '简单', reps: '20个', image: 'https://picsum.photos/seed/core2/400/300' },
  { id: 21, name: '俄罗斯转体', bodyPart: 'core', duration: 60, difficulty: '中等', reps: '20个/侧', image: 'https://picsum.photos/seed/core3/400/300' },
  { id: 22, name: '仰卧举腿', bodyPart: 'core', duration: 45, difficulty: '中等', reps: '15个', image: 'https://picsum.photos/seed/core4/400/300' },
  { id: 23, name: '登山跑', bodyPart: 'core', duration: 60, difficulty: '中等', reps: '30个', image: 'https://picsum.photos/seed/core5/400/300' },
  { id: 24, name: '侧平板', bodyPart: 'core', duration: 45, difficulty: '中等', reps: '30秒/侧', image: 'https://picsum.photos/seed/core6/400/300' },
  { id: 25, name: '仰卧起坐', bodyPart: 'core', duration: 60, difficulty: '简单', reps: '20个', image: 'https://picsum.photos/seed/core7/400/300' },
  
  { id: 26, name: '深蹲', bodyPart: 'legs', duration: 60, difficulty: '简单', reps: '20个', image: 'https://picsum.photos/seed/leg1/400/300' },
  { id: 27, name: '箭步蹲', bodyPart: 'legs', duration: 60, difficulty: '中等', reps: '12个/侧', image: 'https://picsum.photos/seed/leg2/400/300' },
  { id: 28, name: '保加利亚分腿蹲', bodyPart: 'legs', duration: 45, difficulty: '困难', reps: '10个/侧', image: 'https://picsum.photos/seed/leg3/400/300' },
  { id: 29, name: '箱式深蹲', bodyPart: 'legs', duration: 45, difficulty: '简单', reps: '15个', image: 'https://picsum.photos/seed/leg4/400/300' },
  { id: 30, name: '靠墙静蹲', bodyPart: 'legs', duration: 60, difficulty: '中等', reps: '保持60秒', image: 'https://picsum.photos/seed/leg5/400/300' },
  { id: 31, name: '跳箱', bodyPart: 'legs', duration: 45, difficulty: '困难', reps: '10个', image: 'https://picsum.photos/seed/leg6/400/300' },
  
  { id: 32, name: '臀桥', bodyPart: 'glutes', duration: 45, difficulty: '简单', reps: '20个', image: 'https://picsum.photos/seed/glute1/400/300' },
  { id: 33, name: '单腿臀桥', bodyPart: 'glutes', duration: 60, difficulty: '中等', reps: '12个/侧', image: 'https://picsum.photos/seed/glute2/400/300' },
  { id: 34, name: '蚌式开合', bodyPart: 'glutes', duration: 45, difficulty: '简单', reps: '15个/侧', image: 'https://picsum.photos/seed/glute3/400/300' },
  { id: 35, name: '驴踢', bodyPart: 'glutes', duration: 45, difficulty: '中等', reps: '12个/侧', image: 'https://picsum.photos/seed/glute4/400/300' },
  { id: 36, name: '跪姿后踢腿', bodyPart: 'glutes', duration: 45, difficulty: '简单', reps: '15个/侧', image: 'https://picsum.photos/seed/glute5/400/300' }
];

export const defaultPlans = [
  {
    id: 'plan_1',
    name: '全身燃脂计划',
    days: ['周一', '周三', '周五'],
    exercises: [26, 19, 5, 6, 21, 32]
  },
  {
    id: 'plan_2',
    name: '上肢力量计划',
    days: ['周二', '周四', '周六'],
    exercises: [1, 2, 10, 11, 15, 16]
  },
  {
    id: 'plan_3',
    name: '核心强化计划',
    days: ['周一', '周三', '周五', '周日'],
    exercises: [19, 20, 21, 22, 23, 24]
  }
];
