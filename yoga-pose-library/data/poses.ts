import type { YogaPose } from '~/types'

const imageBase = (prompt: string) => 
  `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(prompt)}&image_size=square`

export const yogaPoses: YogaPose[] = [
  {
    id: '1',
    name: '下犬式',
    sanskritName: 'Adho Mukha Svanasana',
    difficulty: 'beginner',
    targetAreas: ['全身', '背部', '腿部'],
    description: '最经典的瑜伽体式之一，能够拉伸整个身体后侧',
    keyPoints: [
      { text: '双手与肩同宽，手指充分张开', image: imageBase('yoga downward dog hands shoulder width fingers spread illustration') },
      { text: '双脚与髋同宽，脚跟尽量踩地', image: imageBase('yoga downward dog feet hip width heels down illustration') },
      { text: '臀部向上推高，形成倒V字形', image: imageBase('yoga downward dog hips up inverted V shape illustration') },
      { text: '膝盖可以微微弯曲，避免过度拉伸', image: imageBase('yoga downward dog knees slightly bent illustration') }
    ],
    breathing: '保持均匀深长的呼吸，每次呼气时加深伸展',
    duration: '30-60秒',
    image: imageBase('yoga downward dog pose illustration minimal style')
  },
  {
    id: '2',
    name: '山式',
    sanskritName: 'Tadasana',
    difficulty: 'beginner',
    targetAreas: ['腿部', '核心'],
    description: '所有站立体式的基础，培养正确的站姿和身体觉知',
    keyPoints: [
      { text: '双脚并拢或与髋同宽站立', image: imageBase('yoga mountain pose feet together standing illustration') },
      { text: '脊柱向上延展，肩膀放松下沉', image: imageBase('yoga mountain pose spine extended shoulders down illustration') },
      { text: '核心轻轻收紧，尾骨微微内收', image: imageBase('yoga mountain pose core engaged tailbone in illustration') },
      { text: '视线平视前方，保持稳定', image: imageBase('yoga mountain pose gaze forward stable illustration') }
    ],
    breathing: '自然呼吸，感受双脚与地面的连接',
    duration: '30-60秒',
    image: imageBase('yoga mountain pose illustration minimal style')
  },
  {
    id: '3',
    name: '战士一式',
    sanskritName: 'Virabhadrasana I',
    difficulty: 'beginner',
    targetAreas: ['腿部', '髋部', '背部'],
    description: '增强腿部力量，打开胸腔和髋部的基础体式',
    keyPoints: [
      { text: '前腿膝盖90度，不超过脚尖', image: imageBase('yoga warrior 1 front knee 90 degrees illustration') },
      { text: '后腿伸直，脚跟踩地', image: imageBase('yoga warrior 1 back leg straight heel down illustration') },
      { text: '双臂向上举过头顶，掌心相对', image: imageBase('yoga warrior 1 arms up palms together illustration') },
      { text: '髋部朝向正前方', image: imageBase('yoga warrior 1 hips facing forward illustration') }
    ],
    breathing: '吸气延展脊柱，呼气加深体式',
    duration: '20-30秒/侧',
    image: imageBase('yoga warrior 1 pose illustration minimal style')
  },
  {
    id: '4',
    name: '树式',
    sanskritName: 'Vrksasana',
    difficulty: 'beginner',
    targetAreas: ['腿部', '核心', '平衡'],
    description: '提高平衡感和专注力的经典体式',
    keyPoints: [
      { text: '单脚站稳，另一只脚放于大腿内侧', image: imageBase('yoga tree pose foot on inner thigh illustration') },
      { text: '脚掌不放在膝盖处', image: imageBase('yoga tree pose foot not on knee illustration') },
      { text: '双手在胸前合十或向上伸展', image: imageBase('yoga tree pose hands at heart or up illustration') },
      { text: '目光注视一个固定点帮助平衡', image: imageBase('yoga tree pose gaze at fixed point illustration') }
    ],
    breathing: '缓慢深长的呼吸，保持专注',
    duration: '20-30秒/侧',
    image: imageBase('yoga tree pose illustration minimal style')
  },
  {
    id: '5',
    name: '婴儿式',
    sanskritName: 'Balasana',
    difficulty: 'beginner',
    targetAreas: ['背部', '髋部', '肩部'],
    description: '放松恢复的体式，适合在练习中间休息',
    keyPoints: [
      { text: '膝盖分开，大脚趾相触', image: imageBase('yoga child pose knees apart big toes touching illustration') },
      { text: '臀部坐向脚跟，前额触地', image: imageBase('yoga child pose hips to heels forehead down illustration') },
      { text: '双臂向前伸展或放在身体两侧', image: imageBase('yoga child pose arms forward or by sides illustration') },
      { text: '完全放松背部肌肉', image: imageBase('yoga child pose back muscles relaxed illustration') }
    ],
    breathing: '深呼吸，感受背部的扩张',
    duration: '1-3分钟',
    image: imageBase('yoga child pose illustration minimal style')
  },
  {
    id: '6',
    name: '眼镜蛇式',
    sanskritName: 'Bhujangasana',
    difficulty: 'intermediate',
    targetAreas: ['背部', '胸部', '肩部'],
    description: '打开胸腔，强化背部肌肉的后弯体式',
    keyPoints: [
      { text: '双手放在胸部两侧，手肘夹紧身体', image: imageBase('yoga cobra pose hands by chest elbows in illustration') },
      { text: '吸气时用背部力量抬起上身', image: imageBase('yoga cobra pose lift chest with back muscles illustration') },
      { text: '肩膀远离耳朵，颈部自然延展', image: imageBase('yoga cobra pose shoulders down neck long illustration') },
      { text: '耻骨保持贴地', image: imageBase('yoga cobra pose pubic bone on mat illustration') }
    ],
    breathing: '吸气抬起，呼气保持，呼气放下',
    duration: '15-30秒',
    image: imageBase('yoga cobra pose illustration minimal style')
  },
  {
    id: '7',
    name: '三角式',
    sanskritName: 'Trikonasana',
    difficulty: 'intermediate',
    targetAreas: ['腿部', '侧腰', '脊柱'],
    description: '深度拉伸身体侧线的经典站立体式',
    keyPoints: [
      { text: '双腿伸直，前脚外转90度', image: imageBase('yoga triangle pose legs straight front foot out 90 illustration') },
      { text: '身体向侧面伸展，不向前弯曲', image: imageBase('yoga triangle pose side stretch not forward bend illustration') },
      { text: '下方手可放小腿或地面', image: imageBase('yoga triangle pose lower hand on shin or floor illustration') },
      { text: '上方手臂垂直向上，视线看向上方手指', image: imageBase('yoga triangle pose upper arm up gaze up illustration') }
    ],
    breathing: '吸气延展，呼气加深侧伸展',
    duration: '20-30秒/侧',
    image: imageBase('yoga triangle pose illustration minimal style')
  },
  {
    id: '8',
    name: '船式',
    sanskritName: 'Navasana',
    difficulty: 'intermediate',
    targetAreas: ['核心', '腿部'],
    description: '强化腹部核心力量的经典体式',
    keyPoints: [
      { text: '坐骨着地，身体向后倾斜', image: imageBase('yoga boat pose sitting bones leaning back illustration') },
      { text: '双腿抬起与地面成45度角', image: imageBase('yoga boat pose legs up 45 degrees illustration') },
      { text: '双臂向前伸展，与地面平行', image: imageBase('yoga boat pose arms forward parallel floor illustration') },
      { text: '脊柱保持延展，不拱背', image: imageBase('yoga boat pose spine long not rounded illustration') }
    ],
    breathing: '保持均匀呼吸，核心持续收紧',
    duration: '15-30秒',
    image: imageBase('yoga boat pose illustration minimal style')
  },
  {
    id: '9',
    name: '鸽子式',
    sanskritName: 'Eka Pada Rajakapotasana',
    difficulty: 'intermediate',
    targetAreas: ['髋部', '大腿', '背部'],
    description: '深度开髋的体式，释放髋部紧张',
    keyPoints: [
      { text: '前腿小腿尽量与垫子前缘平行', image: imageBase('yoga pigeon pose front shin parallel front mat illustration') },
      { text: '后腿向后伸直，髋部摆正', image: imageBase('yoga pigeon pose back leg straight hips square illustration') },
      { text: '上身可向前折叠或保持直立', image: imageBase('yoga pigeon pose torso forward or upright illustration') },
      { text: '在臀部下方垫毯子帮助舒适', image: imageBase('yoga pigeon pose blanket under hip for comfort illustration') }
    ],
    breathing: '深呼吸，每次呼气放松髋部',
    duration: '30-60秒/侧',
    image: imageBase('yoga pigeon pose illustration minimal style')
  },
  {
    id: '10',
    name: '头倒立',
    sanskritName: 'Sirsasana',
    difficulty: 'advanced',
    targetAreas: ['全身', '核心', '肩部'],
    description: '瑜伽体式之王，需要强大的核心和平衡能力',
    keyPoints: [
      { text: '前臂和头顶形成稳定的三角支撑', image: imageBase('yoga headstand forearms and head triangle base illustration') },
      { text: '核心收紧，双腿慢慢抬起', image: imageBase('yoga headstand core engaged lift legs slowly illustration') },
      { text: '身体保持垂直一条直线', image: imageBase('yoga headstand body in straight vertical line illustration') },
      { text: '建议在墙边或有辅助的情况下练习', image: imageBase('yoga headstand practice near wall with support illustration') }
    ],
    breathing: '平稳深长的呼吸，保持专注',
    duration: '30秒-5分钟',
    image: imageBase('yoga headstand pose illustration minimal style')
  }
]

export const difficultyLabels = {
  beginner: '初级',
  intermediate: '中级',
  advanced: '高级'
}

export const allTargetAreas = ['全身', '背部', '腿部', '核心', '髋部', '胸部', '肩部', '侧腰', '脊柱', '平衡']
