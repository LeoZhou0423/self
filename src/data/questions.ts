export type Domain = 'O' | 'C' | 'E' | 'A' | 'N';

export interface Question {
  id: number;
  text: string;
  domain: Domain;
  facet: string;
  reverse: boolean;
}

export const DOMAINS: Record<
  Domain,
  { name: string; en: string; color: string; description: string }
> = {
  O: {
    name: '开放性',
    en: 'Openness',
    color: '#8E6EAB',
    description: '对经验、想象力、审美与求知欲的开放程度。',
  },
  C: {
    name: '尽责性',
    en: 'Conscientiousness',
    color: '#4A7C59',
    description: '自律、条理性、责任感与目标导向程度。',
  },
  E: {
    name: '外向性',
    en: 'Extraversion',
    color: '#D4A017',
    description: '社交活跃、精力充沛与寻求外部刺激的程度。',
  },
  A: {
    name: '宜人性',
    en: 'Agreeableness',
    color: '#5B8A72',
    description: '信任、利他、合作与关心他人的程度。',
  },
  N: {
    name: '神经质',
    en: 'Neuroticism',
    color: '#A65D57',
    description: '情绪稳定性、易焦虑与负面情绪的敏感程度。',
  },
};

export const FACETS: Record<
  Domain,
  { key: string; name: string; description: string }[]
> = {
  O: [
    {
      key: 'aesthetic',
      name: '审美感受',
      description: '对艺术、音乐、自然与美的敏感度和欣赏力。',
    },
    {
      key: 'curiosity',
      name: '求知欲',
      description: '对新知识、抽象思想与复杂问题的好奇心。',
    },
    {
      key: 'imagination',
      name: '想象力',
      description: '创造性思维、幻想与跳出常规框架的能力。',
    },
  ],
  C: [
    {
      key: 'organization',
      name: '条理性',
      description: '保持环境整洁、做事有条理与注重细节。',
    },
    {
      key: 'productiveness',
      name: '效率感',
      description: '完成任务、追求目标与持续努力的倾向。',
    },
    {
      key: 'responsibility',
      name: '责任感',
      description: '信守承诺、可靠与对自身行为负责。',
    },
  ],
  E: [
    {
      key: 'sociability',
      name: '社交性',
      description: '喜欢社交场合、与人交往并建立联系。',
    },
    {
      key: 'assertiveness',
      name: '自信表达',
      description: '主动发言、领导他人与表达观点的意愿。',
    },
    {
      key: 'energy',
      name: '活力水平',
      description: '精力旺盛、行动迅速与生活节奏。',
    },
  ],
  A: [
    {
      key: 'compassion',
      name: '同理心',
      description: '理解他人感受、愿意帮助与关怀弱者。',
    },
    {
      key: 'respectfulness',
      name: '尊重他人',
      description: '礼貌待人、尊重差异与避免冲突。',
    },
    {
      key: 'trust',
      name: '信任',
      description: '相信他人的善意、坦诚与正直。',
    },
  ],
  N: [
    {
      key: 'anxiety',
      name: '焦虑',
      description: '对压力、未知与批评的敏感和担忧。',
    },
    {
      key: 'depression',
      name: '抑郁倾向',
      description: '情绪低落、自我怀疑与无助感。',
    },
    {
      key: 'volatility',
      name: '情绪波动',
      description: '情绪起伏大、易怒与难以平复。',
    },
  ],
};

export const QUESTIONS: Question[] = [
  // Openness - Aesthetic (O1)
  { id: 1, text: '我对艺术和音乐有浓厚的兴趣。', domain: 'O', facet: 'aesthetic', reverse: false },
  { id: 2, text: '我常常被诗歌、电影或自然美景所打动。', domain: 'O', facet: 'aesthetic', reverse: false },
  { id: 3, text: '我觉得文学和艺术的讨论很无聊。', domain: 'O', facet: 'aesthetic', reverse: true },
  { id: 4, text: '我不太在意周围环境的视觉美感。', domain: 'O', facet: 'aesthetic', reverse: true },

  // Openness - Curiosity (O2)
  { id: 5, text: '我喜欢思考抽象的哲学或科学问题。', domain: 'O', facet: 'curiosity', reverse: false },
  { id: 6, text: '我对新奇的想法和理论充满好奇。', domain: 'O', facet: 'curiosity', reverse: false },
  { id: 7, text: '我对复杂的理论问题没什么耐心。', domain: 'O', facet: 'curiosity', reverse: true },
  { id: 8, text: '我更愿意处理具体的事务，而非思考抽象概念。', domain: 'O', facet: 'curiosity', reverse: true },

  // Openness - Imagination (O3)
  { id: 9, text: '我拥有活跃的想象力。', domain: 'O', facet: 'imagination', reverse: false },
  { id: 10, text: '我常常沉浸在自己的幻想和白日梦中。', domain: 'O', facet: 'imagination', reverse: false },
  { id: 11, text: '我不太喜欢做白日梦或幻想。', domain: 'O', facet: 'imagination', reverse: true },
  { id: 12, text: '我认为自己更实际，而不是富有想象力。', domain: 'O', facet: 'imagination', reverse: true },

  // Conscientiousness - Organization (C1)
  { id: 13, text: '我喜欢把东西放在固定的位置，保持整洁。', domain: 'C', facet: 'organization', reverse: false },
  { id: 14, text: '我的生活和工作环境通常井井有条。', domain: 'C', facet: 'organization', reverse: false },
  { id: 15, text: '我的桌面或房间常常杂乱无章。', domain: 'C', facet: 'organization', reverse: true },
  { id: 16, text: '我很难保持物品和文件的有序。', domain: 'C', facet: 'organization', reverse: true },

  // Conscientiousness - Productiveness (C2)
  { id: 17, text: '我总是努力完成任务，不半途而废。', domain: 'C', facet: 'productiveness', reverse: false },
  { id: 18, text: '我设定目标后，会坚持不懈地追求。', domain: 'C', facet: 'productiveness', reverse: false },
  { id: 19, text: '我很容易拖延，把工作留到最后一刻。', domain: 'C', facet: 'productiveness', reverse: true },
  { id: 20, text: '我常常缺乏做事的动力。', domain: 'C', facet: 'productiveness', reverse: true },

  // Conscientiousness - Responsibility (C3)
  { id: 21, text: '我认真履行自己的承诺和义务。', domain: 'C', facet: 'responsibility', reverse: false },
  { id: 22, text: '别人认为我是一个可靠的人。', domain: 'C', facet: 'responsibility', reverse: false },
  { id: 23, text: '我有时会为了自己的便利而食言。', domain: 'C', facet: 'responsibility', reverse: true },
  { id: 24, text: '我不太愿意为他人或团队承担责任。', domain: 'C', facet: 'responsibility', reverse: true },

  // Extraversion - Sociability (E1)
  { id: 25, text: '我喜欢参加聚会和社交活动。', domain: 'E', facet: 'sociability', reverse: false },
  { id: 26, text: '在人群中我会感到兴奋和充满活力。', domain: 'E', facet: 'sociability', reverse: false },
  { id: 27, text: '我宁愿待在家里，也不愿参加社交聚会。', domain: 'E', facet: 'sociability', reverse: true },
  { id: 28, text: '大型社交场合会让我疲惫不堪。', domain: 'E', facet: 'sociability', reverse: true },

  // Extraversion - Assertiveness (E2)
  { id: 29, text: '我在团队讨论中乐于表达自己的意见。', domain: 'E', facet: 'assertiveness', reverse: false },
  { id: 30, text: '我能够自信地担任领导角色。', domain: 'E', facet: 'assertiveness', reverse: false },
  { id: 31, text: '在公开场合发言会让我感到紧张不安。', domain: 'E', facet: 'assertiveness', reverse: true },
  { id: 32, text: '我倾向于让别人做决定，而不是主动提出方案。', domain: 'E', facet: 'assertiveness', reverse: true },

  // Extraversion - Energy (E3)
  { id: 33, text: '我精力充沛，总是闲不住。', domain: 'E', facet: 'energy', reverse: false },
  { id: 34, text: '我的生活节奏很快，喜欢同时做几件事。', domain: 'E', facet: 'energy', reverse: false },
  { id: 35, text: '我通常行动缓慢，需要较多休息时间。', domain: 'E', facet: 'energy', reverse: true },
  { id: 36, text: '我很少感到精力充沛。', domain: 'E', facet: 'energy', reverse: true },

  // Agreeableness - Compassion (A1)
  { id: 37, text: '看到别人受苦时，我会感同身受。', domain: 'A', facet: 'compassion', reverse: false },
  { id: 38, text: '我愿意花时间和精力去帮助有困难的人。', domain: 'A', facet: 'compassion', reverse: false },
  { id: 39, text: '我不太关心他人的情绪和困扰。', domain: 'A', facet: 'compassion', reverse: true },
  { id: 40, text: '我认为帮助他人会给自己带来太多麻烦。', domain: 'A', facet: 'compassion', reverse: true },

  // Agreeableness - Respectfulness (A2)
  { id: 41, text: '即使与他人意见不合，我也会保持礼貌。', domain: 'A', facet: 'respectfulness', reverse: false },
  { id: 42, text: '我尊重不同文化和背景的人。', domain: 'A', facet: 'respectfulness', reverse: false },
  { id: 43, text: '我有时会对他人的观点表现出轻蔑。', domain: 'A', facet: 'respectfulness', reverse: true },
  { id: 44, text: '我倾向于批评或挑剔与自己不同的人。', domain: 'A', facet: 'respectfulness', reverse: true },

  // Agreeableness - Trust (A3)
  { id: 45, text: '我倾向于相信他人是诚实和善意的。', domain: 'A', facet: 'trust', reverse: false },
  { id: 46, text: '我愿意相信别人，直到他们有辜负我的行为。', domain: 'A', facet: 'trust', reverse: false },
  { id: 47, text: '我通常怀疑他人的动机。', domain: 'A', facet: 'trust', reverse: true },
  { id: 48, text: '我认为大多数人只关心自己的利益。', domain: 'A', facet: 'trust', reverse: true },

  // Neuroticism - Anxiety (N1)
  { id: 49, text: '我常常担心事情会出错。', domain: 'N', facet: 'anxiety', reverse: false },
  { id: 50, text: '在面对压力时，我容易感到紧张。', domain: 'N', facet: 'anxiety', reverse: false },
  { id: 51, text: '即使在压力下，我也能保持冷静。', domain: 'N', facet: 'anxiety', reverse: true },
  { id: 52, text: '我很少为未来的事情担忧。', domain: 'N', facet: 'anxiety', reverse: true },

  // Neuroticism - Depression (N2)
  { id: 53, text: '我有时会感到情绪低落或沮丧。', domain: 'N', facet: 'depression', reverse: false },
  { id: 54, text: '遇到挫折时，我容易怀疑自己的价值。', domain: 'N', facet: 'depression', reverse: false },
  { id: 55, text: '我通常对自己的生活感到满意。', domain: 'N', facet: 'depression', reverse: true },
  { id: 56, text: '我很少感到悲伤或无助。', domain: 'N', facet: 'depression', reverse: true },

  // Neuroticism - Volatility (N3)
  { id: 57, text: '我的情绪容易波动，时而高兴时而烦躁。', domain: 'N', facet: 'volatility', reverse: false },
  { id: 58, text: '当事情不如预期时，我会很快发怒。', domain: 'N', facet: 'volatility', reverse: false },
  { id: 59, text: '我能够很好地控制自己的情绪。', domain: 'N', facet: 'volatility', reverse: true },
  { id: 60, text: '我的情绪通常比较稳定。', domain: 'N', facet: 'volatility', reverse: true },
];

// Social Desirability Scale (Lie Scale) - 检测社会期许效应
// 这些题目用于识别用户是否在"表演"理想自我
export const LIE_SCALE_QUESTIONS: { id: number; text: string; reverse: boolean }[] = [
  { id: 61, text: '我从不说谎。', reverse: false },
  { id: 62, text: '我总是信守承诺，从不食言。', reverse: false },
  { id: 63, text: '我从来没有说过别人坏话。', reverse: false },
  { id: 64, text: '我总是把别人的需求放在自己之前。', reverse: false },
];

export const OPTIONS = [
  { value: 1, label: '非常不同意' },
  { value: 2, label: '不同意' },
  { value: 3, label: '中立' },
  { value: 4, label: '同意' },
  { value: 5, label: '非常同意' },
];
