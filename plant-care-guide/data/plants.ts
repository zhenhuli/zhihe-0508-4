import type { Plant } from '~/types'

export const plants: Plant[] = [
  {
    id: 1,
    name: '绿萝',
    scientificName: 'Epipremnum aureum',
    image: 'https://picsum.photos/id/106/400/300',
    description: '绿萝是一种非常受欢迎的室内观叶植物，具有强大的空气净化能力，能够有效吸收甲醛等有害气体。',
    light: {
      level: '散射光',
      description: '喜欢明亮的散射光，避免阳光直射。可放置在离窗户1-2米的位置，也能耐受较低的光照条件。',
      icon: '☀️'
    },
    water: {
      frequency: '每周1-2次',
      description: '保持土壤微湿但不积水。表面土壤干燥时浇水。冬季减少浇水频率。',
      icon: '💧'
    },
    temperature: {
      min: 15,
      max: 30,
      description: '适宜生长温度为15-30°C。冬季温度不低于10°C，避免冻伤。',
      icon: '🌡️'
    },
    difficulty: 'easy',
    tips: [
      '定期擦拭叶片保持光泽',
      '可水培或土培养殖',
      '生长迅速，定期修剪'
    ]
  },
  {
    id: 2,
    name: '多肉植物',
    scientificName: 'Succulent',
    image: 'https://picsum.photos/id/107/400/300',
    description: '多肉植物是指植物营养器官肥大的植物，通常具有肥厚的叶片、茎或根，能储存大量水分。',
    light: {
      level: '充足光照',
      description: '需要充足的阳光，每天至少4-6小时的直射光。南向窗户是理想位置。',
      icon: '☀️'
    },
    water: {
      frequency: '每2-3周1次',
      description: '干透浇透，避免积水。冬季休眠期更少浇水，约每月1次。',
      icon: '💧'
    },
    temperature: {
      min: 5,
      max: 35,
      description: '大多数多肉能耐受5-35°C的温度范围。冬季保持干燥可增强耐寒性。',
      icon: '🌡️'
    },
    difficulty: 'easy',
    tips: [
      '使用排水良好的多肉专用土',
      '避免叶片积水',
      '通风良好的环境更佳'
    ]
  },
  {
    id: 3,
    name: '龟背竹',
    scientificName: 'Monstera deliciosa',
    image: 'https://picsum.photos/id/108/400/300',
    description: '龟背竹以其独特的裂叶形态而闻名，是热带风格室内装饰的绝佳选择，能为空间增添自然气息。',
    light: {
      level: '明亮散射光',
      description: '喜欢明亮但避免直射的光线。可放置在有纱帘的窗边，或离窗稍远的明亮位置。',
      icon: '☀️'
    },
    water: {
      frequency: '每周1次',
      description: '保持土壤湿润但不积水。表土2-3厘米干燥时浇水。冬季减少浇水量。',
      icon: '💧'
    },
    temperature: {
      min: 18,
      max: 28,
      description: '喜温暖湿润环境，适宜温度18-28°C。低于15°C生长减缓，冬季注意保暖。',
      icon: '🌡️'
    },
    difficulty: 'medium',
    tips: [
      '经常喷雾增加空气湿度',
      '提供支撑让植株攀爬',
      '定期擦拭大叶片'
    ]
  },
  {
    id: 4,
    name: '虎皮兰',
    scientificName: 'Sansevieria trifasciata',
    image: 'https://picsum.photos/id/109/400/300',
    description: '虎皮兰是极具韧性的室内植物，几乎能适应任何环境。夜间释放氧气，是卧室的绝佳选择。',
    light: {
      level: '适应性强',
      description: '从低光照到明亮直射光都能适应。但在明亮散射光下生长最佳，斑纹更明显。',
      icon: '☀️'
    },
    water: {
      frequency: '每2-4周1次',
      description: '耐旱性强，宁干勿湿。冬季可每月浇1次。避免叶心积水导致腐烂。',
      icon: '💧'
    },
    temperature: {
      min: 10,
      max: 32,
      description: '适宜温度10-32°C。低于5°C可能冻伤，冬季需移至温暖处。',
      icon: '🌡️'
    },
    difficulty: 'easy',
    tips: [
      '非常适合新手养护',
      '净化空气效果极佳',
      '避免频繁移动位置'
    ]
  },
  {
    id: 5,
    name: '琴叶榕',
    scientificName: 'Ficus lyrata',
    image: 'https://picsum.photos/id/110/400/300',
    description: '琴叶榕以其大提琴形状的大叶片成为网红植物，是家居装饰的焦点，能提升整体空间质感。',
    light: {
      level: '明亮散射光',
      description: '需要充足的明亮散射光，避免强烈直射光。靠近窗户但有纱帘遮挡是最佳位置。',
      icon: '☀️'
    },
    water: {
      frequency: '每周1次',
      description: '保持土壤均匀湿润，表土干燥时浇水。对水质敏感，建议使用放置过的水。',
      icon: '💧'
    },
    temperature: {
      min: 18,
      max: 26,
      description: '喜温暖，适宜18-26°C。温度骤变会导致落叶，远离空调和暖气出风口。',
      icon: '🌡️'
    },
    difficulty: 'medium',
    tips: [
      '不喜欢频繁移动',
      '定期转盆保持株型匀称',
      '叶片需经常清洁'
    ]
  },
  {
    id: 6,
    name: '空气凤梨',
    scientificName: 'Tillandsia',
    image: 'https://picsum.photos/id/111/400/300',
    description: '空气凤梨是独特的无土植物，通过叶片吸收水分和养分，可放置在任何地方，创意装饰的首选。',
    light: {
      level: '明亮散射光',
      description: '喜欢明亮的间接光线。避免强烈阳光直射，特别是夏季。',
      icon: '☀️'
    },
    water: {
      frequency: '每周泡水1次',
      description: '每周将整株浸泡在水中10-30分钟，然后轻轻甩干。空气干燥时增加喷雾。',
      icon: '💧'
    },
    temperature: {
      min: 10,
      max: 32,
      description: '适宜温度10-32°C。能耐受短暂的极端温度，但长期需保持温和。',
      icon: '🌡️'
    },
    difficulty: 'easy',
    tips: [
      '泡水后必须充分干燥',
      '良好的通风很重要',
      '可固定在各种装饰物上'
    ]
  }
]
