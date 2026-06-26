export type Domain = 'O' | 'C' | 'E' | 'A' | 'N';

export type QuestionCategory =
  | 'personality'
  | 'selfEsteem'
  | 'attachment'
  | 'depression'
  | 'anxiety'
  | 'sleep';

export interface Question {
  id: number;
  text: string;
  domain: Domain;
  facet: string;
  reverse: boolean;
  category: QuestionCategory;
}

export interface Option {
  value: number;
  label: string;
}

export const DOMAINS: Record<
  Domain,
  { name: string; en: string; color: string; description: string }
> = {
  O: {
    name: '对外界的态度',
    en: 'Openness',
    color: '#8E6EAB',
    description: '对经验、想象力、审美与求知欲的开放程度。',
  },
  C: {
    name: '做事风格',
    en: 'Conscientiousness',
    color: '#4A7C59',
    description: '自律、条理性、责任感与目标导向程度。',
  },
  E: {
    name: '社交倾向',
    en: 'Extraversion',
    color: '#D4A017',
    description: '社交活跃、精力充沛与寻求外部刺激的程度。',
  },
  A: {
    name: '待人方式',
    en: 'Agreeableness',
    color: '#5B8A72',
    description: '信任、利他、合作与关心他人的程度。',
  },
  N: {
    name: '情绪感受',
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

export const OPTIONS_LIKERT_5: Option[] = [
  { value: 1, label: '非常不同意' },
  { value: 2, label: '不同意' },
  { value: 3, label: '中立' },
  { value: 4, label: '同意' },
  { value: 5, label: '非常同意' },
];

export const OPTIONS_FREQUENCY_4: Option[] = [
  { value: 0, label: '没有过' },
  { value: 1, label: '偶尔有' },
  { value: 2, label: '经常有' },
  { value: 3, label: '几乎每天' },
];

export const OPTIONS_SLEEP_4: Option[] = [
  { value: 0, label: '很好/规律' },
  { value: 1, label: '还可以' },
  { value: 2, label: '不太好' },
  { value: 3, label: '很差/很不规律' },
];

export const OPTIONS_FATIGUE_4: Option[] = [
  { value: 0, label: '很少' },
  { value: 1, label: '偶尔' },
  { value: 2, label: '经常' },
  { value: 3, label: '几乎每天' },
];

export const OPTIONS_SLEEP_LATENCY_4: Option[] = [
  { value: 0, label: '不到15分钟' },
  { value: 1, label: '15-30分钟' },
  { value: 2, label: '30-60分钟' },
  { value: 3, label: '超过1小时' },
];

/** BFI-2 人格量表（60 题） */
export const QUESTIONS: Question[] = [
  // Openness - Aesthetic (O1)
  { id: 1, text: '我对艺术和音乐有浓厚的兴趣。', domain: 'O', facet: 'aesthetic', reverse: false, category: 'personality' },
  { id: 2, text: '我常常被诗歌、电影或自然美景所打动。', domain: 'O', facet: 'aesthetic', reverse: false, category: 'personality' },
  { id: 3, text: '我觉得文学和艺术的讨论很无聊。', domain: 'O', facet: 'aesthetic', reverse: true, category: 'personality' },
  { id: 4, text: '我不太在意周围环境的视觉美感。', domain: 'O', facet: 'aesthetic', reverse: true, category: 'personality' },

  // Openness - Curiosity (O2)
  { id: 5, text: '我喜欢思考抽象的哲学或科学问题。', domain: 'O', facet: 'curiosity', reverse: false, category: 'personality' },
  { id: 6, text: '我对新奇的想法和理论充满好奇。', domain: 'O', facet: 'curiosity', reverse: false, category: 'personality' },
  { id: 7, text: '我对复杂的理论问题没什么耐心。', domain: 'O', facet: 'curiosity', reverse: true, category: 'personality' },
  { id: 8, text: '我更愿意处理具体的事务，而非思考抽象概念。', domain: 'O', facet: 'curiosity', reverse: true, category: 'personality' },

  // Openness - Imagination (O3)
  { id: 9, text: '我拥有活跃的想象力。', domain: 'O', facet: 'imagination', reverse: false, category: 'personality' },
  { id: 10, text: '我常常沉浸在自己的幻想和白日梦中。', domain: 'O', facet: 'imagination', reverse: false, category: 'personality' },
  { id: 11, text: '我不太喜欢做白日梦或幻想。', domain: 'O', facet: 'imagination', reverse: true, category: 'personality' },
  { id: 12, text: '我认为自己更实际，而不是富有想象力。', domain: 'O', facet: 'imagination', reverse: true, category: 'personality' },

  // Conscientiousness - Organization (C1)
  { id: 13, text: '我喜欢把东西放在固定的位置，保持整洁。', domain: 'C', facet: 'organization', reverse: false, category: 'personality' },
  { id: 14, text: '我的生活和工作环境通常井井有条。', domain: 'C', facet: 'organization', reverse: false, category: 'personality' },
  { id: 15, text: '我的桌面或房间常常杂乱无章。', domain: 'C', facet: 'organization', reverse: true, category: 'personality' },
  { id: 16, text: '我很难保持物品和文件的有序。', domain: 'C', facet: 'organization', reverse: true, category: 'personality' },

  // Conscientiousness - Productiveness (C2)
  { id: 17, text: '我总是努力完成任务，不半途而废。', domain: 'C', facet: 'productiveness', reverse: false, category: 'personality' },
  { id: 18, text: '我设定目标后，会坚持不懈地追求。', domain: 'C', facet: 'productiveness', reverse: false, category: 'personality' },
  { id: 19, text: '我很容易拖延，把工作留到最后一刻。', domain: 'C', facet: 'productiveness', reverse: true, category: 'personality' },
  { id: 20, text: '我常常缺乏做事的动力。', domain: 'C', facet: 'productiveness', reverse: true, category: 'personality' },

  // Conscientiousness - Responsibility (C3)
  { id: 21, text: '我认真履行自己的承诺和义务。', domain: 'C', facet: 'responsibility', reverse: false, category: 'personality' },
  { id: 22, text: '别人认为我是一个可靠的人。', domain: 'C', facet: 'responsibility', reverse: false, category: 'personality' },
  { id: 23, text: '我有时会为了自己的便利而食言。', domain: 'C', facet: 'responsibility', reverse: true, category: 'personality' },
  { id: 24, text: '我不太愿意为他人或团队承担责任。', domain: 'C', facet: 'responsibility', reverse: true, category: 'personality' },

  // Extraversion - Sociability (E1)
  { id: 25, text: '我喜欢参加聚会和社交活动。', domain: 'E', facet: 'sociability', reverse: false, category: 'personality' },
  { id: 26, text: '在人群中我会感到兴奋和充满活力。', domain: 'E', facet: 'sociability', reverse: false, category: 'personality' },
  { id: 27, text: '我宁愿待在家里，也不愿参加社交聚会。', domain: 'E', facet: 'sociability', reverse: true, category: 'personality' },
  { id: 28, text: '大型社交场合会让我疲惫不堪。', domain: 'E', facet: 'sociability', reverse: true, category: 'personality' },

  // Extraversion - Assertiveness (E2)
  { id: 29, text: '我在团队讨论中乐于表达自己的意见。', domain: 'E', facet: 'assertiveness', reverse: false, category: 'personality' },
  { id: 30, text: '我能够自信地担任领导角色。', domain: 'E', facet: 'assertiveness', reverse: false, category: 'personality' },
  { id: 31, text: '在公开场合发言会让我感到紧张不安。', domain: 'E', facet: 'assertiveness', reverse: true, category: 'personality' },
  { id: 32, text: '我倾向于让别人做决定，而不是主动提出方案。', domain: 'E', facet: 'assertiveness', reverse: true, category: 'personality' },

  // Extraversion - Energy (E3)
  { id: 33, text: '我精力充沛，总是闲不住。', domain: 'E', facet: 'energy', reverse: false, category: 'personality' },
  { id: 34, text: '我的生活节奏很快，喜欢同时做几件事。', domain: 'E', facet: 'energy', reverse: false, category: 'personality' },
  { id: 35, text: '我通常行动缓慢，需要较多休息时间。', domain: 'E', facet: 'energy', reverse: true, category: 'personality' },
  { id: 36, text: '我很少感到精力充沛。', domain: 'E', facet: 'energy', reverse: true, category: 'personality' },

  // Agreeableness - Compassion (A1)
  { id: 37, text: '看到别人受苦时，我会感同身受。', domain: 'A', facet: 'compassion', reverse: false, category: 'personality' },
  { id: 38, text: '我愿意花时间和精力去帮助有困难的人。', domain: 'A', facet: 'compassion', reverse: false, category: 'personality' },
  { id: 39, text: '我不太关心他人的情绪和困扰。', domain: 'A', facet: 'compassion', reverse: true, category: 'personality' },
  { id: 40, text: '我认为帮助他人会给自己带来太多麻烦。', domain: 'A', facet: 'compassion', reverse: true, category: 'personality' },

  // Agreeableness - Respectfulness (A2)
  { id: 41, text: '即使与他人意见不合，我也会保持礼貌。', domain: 'A', facet: 'respectfulness', reverse: false, category: 'personality' },
  { id: 42, text: '我尊重不同文化和背景的人。', domain: 'A', facet: 'respectfulness', reverse: false, category: 'personality' },
  { id: 43, text: '我有时会对他人的观点表现出轻蔑。', domain: 'A', facet: 'respectfulness', reverse: true, category: 'personality' },
  { id: 44, text: '我倾向于批评或挑剔与自己不同的人。', domain: 'A', facet: 'respectfulness', reverse: true, category: 'personality' },

  // Agreeableness - Trust (A3)
  { id: 45, text: '我倾向于相信他人是诚实和善意的。', domain: 'A', facet: 'trust', reverse: false, category: 'personality' },
  { id: 46, text: '我愿意相信别人，直到他们有辜负我的行为。', domain: 'A', facet: 'trust', reverse: false, category: 'personality' },
  { id: 47, text: '我通常怀疑他人的动机。', domain: 'A', facet: 'trust', reverse: true, category: 'personality' },
  { id: 48, text: '我认为大多数人只关心自己的利益。', domain: 'A', facet: 'trust', reverse: true, category: 'personality' },

  // Neuroticism - Anxiety (N1)
  { id: 49, text: '我常常担心事情会出错。', domain: 'N', facet: 'anxiety', reverse: false, category: 'personality' },
  { id: 50, text: '在面对压力时，我容易感到紧张。', domain: 'N', facet: 'anxiety', reverse: false, category: 'personality' },
  { id: 51, text: '即使在压力下，我也能保持冷静。', domain: 'N', facet: 'anxiety', reverse: true, category: 'personality' },
  { id: 52, text: '我很少为未来的事情担忧。', domain: 'N', facet: 'anxiety', reverse: true, category: 'personality' },

  // Neuroticism - Depression (N2)
  { id: 53, text: '我有时会感到情绪低落或沮丧。', domain: 'N', facet: 'depression', reverse: false, category: 'personality' },
  { id: 54, text: '遇到挫折时，我容易怀疑自己的价值。', domain: 'N', facet: 'depression', reverse: false, category: 'personality' },
  { id: 55, text: '我通常对自己的生活感到满意。', domain: 'N', facet: 'depression', reverse: true, category: 'personality' },
  { id: 56, text: '我很少感到悲伤或无助。', domain: 'N', facet: 'depression', reverse: true, category: 'personality' },

  // Neuroticism - Volatility (N3)
  { id: 57, text: '我的情绪容易波动，时而高兴时而烦躁。', domain: 'N', facet: 'volatility', reverse: false, category: 'personality' },
  { id: 58, text: '当事情不如预期时，我会很快发怒。', domain: 'N', facet: 'volatility', reverse: false, category: 'personality' },
  { id: 59, text: '我能够很好地控制自己的情绪。', domain: 'N', facet: 'volatility', reverse: true, category: 'personality' },
  { id: 60, text: '我的情绪通常比较稳定。', domain: 'N', facet: 'volatility', reverse: true, category: 'personality' },
];

// ── 社会期许量表 ──
export const LIE_SCALE_QUESTIONS: { id: number; text: string; reverse: boolean }[] = [
  { id: 61, text: '我从不说谎。', reverse: false },
  { id: 62, text: '我总是信守承诺，从不食言。', reverse: false },
  { id: 63, text: '我从来没有说过别人坏话。', reverse: false },
  { id: 64, text: '我总是把别人的需求放在自己之前。', reverse: false },
];

// ── 自我感受（自尊）─ 8 题 ──
export const QUESTIONS_SELF_ESTEEM: Question[] = [
  { id: 101, text: '总的来说，我对自己是满意的。', domain: 'O', facet: 'self_worth', reverse: false, category: 'selfEsteem' },
  { id: 102, text: '我觉得自己身上有很多优点。', domain: 'O', facet: 'self_worth', reverse: false, category: 'selfEsteem' },
  { id: 103, text: '我觉得自己是一个有价值的人。', domain: 'O', facet: 'self_worth', reverse: false, category: 'selfEsteem' },
  { id: 104, text: '我做事能做得和大多数人一样好。', domain: 'O', facet: 'self_worth', reverse: false, category: 'selfEsteem' },
  { id: 105, text: '我有时候觉得自己一无是处。', domain: 'O', facet: 'self_worth', reverse: true, category: 'selfEsteem' },
  { id: 106, text: '我没有什么值得骄傲的地方。', domain: 'O', facet: 'self_worth', reverse: true, category: 'selfEsteem' },
  { id: 107, text: '我有时候觉得自己完全没用。', domain: 'O', facet: 'self_worth', reverse: true, category: 'selfEsteem' },
  { id: 108, text: '我希望自己能更看得起自己。', domain: 'O', facet: 'self_worth', reverse: true, category: 'selfEsteem' },
];

// ── 与人相处（依恋风格）─ 10 题 ──
// 前 5 题：焦虑维度，后 5 题：回避维度
export const QUESTIONS_ATTACHMENT: Question[] = [
  { id: 109, text: '我担心别人是不是真的喜欢我。', domain: 'E', facet: 'attachment_anxiety', reverse: false, category: 'attachment' },
  { id: 110, text: '我常常觉得自己在关系里不够好。', domain: 'E', facet: 'attachment_anxiety', reverse: false, category: 'attachment' },
  { id: 111, text: '我害怕失去重要的人。', domain: 'E', facet: 'attachment_anxiety', reverse: false, category: 'attachment' },
  { id: 112, text: '我需要别人反复确认，才能安心。', domain: 'E', facet: 'attachment_anxiety', reverse: false, category: 'attachment' },
  { id: 113, text: '我总是担心自己被拒绝。', domain: 'E', facet: 'attachment_anxiety', reverse: false, category: 'attachment' },
  { id: 114, text: '我不习惯和别人走得太近。', domain: 'E', facet: 'attachment_avoidance', reverse: false, category: 'attachment' },
  { id: 115, text: '我宁愿靠自己，也不愿依赖别人。', domain: 'E', facet: 'attachment_avoidance', reverse: false, category: 'attachment' },
  { id: 116, text: '别人想靠近我的时候，我会下意识躲开。', domain: 'E', facet: 'attachment_avoidance', reverse: false, category: 'attachment' },
  { id: 117, text: '我觉得完全信任别人是不安全的。', domain: 'E', facet: 'attachment_avoidance', reverse: false, category: 'attachment' },
  { id: 118, text: '我不太需要亲密关系。', domain: 'E', facet: 'attachment_avoidance', reverse: false, category: 'attachment' },
];

// ── 近两周情绪状态（抑郁筛查 PHQ-8，去掉自杀意念题）─ 8 题 ──
export const QUESTIONS_DEPRESSION: Question[] = [
  { id: 119, text: '做事情提不起兴趣，或者本来喜欢的事也觉得没意思了。', domain: 'N', facet: 'phq_anhedonia', reverse: false, category: 'depression' },
  { id: 120, text: '情绪低落、觉得闷闷不乐或者看不到希望。', domain: 'N', facet: 'phq_mood', reverse: false, category: 'depression' },
  { id: 121, text: '睡不好——要么很难入睡、睡不安稳，要么睡得太多。', domain: 'N', facet: 'phq_sleep', reverse: false, category: 'depression' },
  { id: 122, text: '总觉得累，没什么精力。', domain: 'N', facet: 'phq_fatigue', reverse: false, category: 'depression' },
  { id: 123, text: '胃口变差，或者反而吃特别多。', domain: 'N', facet: 'phq_appetite', reverse: false, category: 'depression' },
  { id: 124, text: '对自己不满意，觉得自己这也不好那也不好。', domain: 'N', facet: 'phq_selfworth', reverse: false, category: 'depression' },
  { id: 125, text: '很难集中注意力，看书看手机都容易走神。', domain: 'N', facet: 'phq_concentration', reverse: false, category: 'depression' },
  { id: 126, text: '动作变慢、不想动；或者反过来——坐立不安、闲不下来。', domain: 'N', facet: 'phq_psychomotor', reverse: false, category: 'depression' },
];

// ── 近两周焦虑感受（GAD-7）─ 7 题 ──
export const QUESTIONS_ANXIETY: Question[] = [
  { id: 127, text: '总觉得心里不踏实、紧张或者担心什么。', domain: 'N', facet: 'gad_nervous', reverse: false, category: 'anxiety' },
  { id: 128, text: '脑子停不下来，没办法不想事情。', domain: 'N', facet: 'gad_worry', reverse: false, category: 'anxiety' },
  { id: 129, text: '对各种事情都忍不住操心。', domain: 'N', facet: 'gad_overworry', reverse: false, category: 'anxiety' },
  { id: 130, text: '很难放松下来。', domain: 'N', facet: 'gad_restless', reverse: false, category: 'anxiety' },
  { id: 131, text: '坐立不安，静不下来。', domain: 'N', facet: 'gad_agitation', reverse: false, category: 'anxiety' },
  { id: 132, text: '容易烦躁，一点小事就不耐烦。', domain: 'N', facet: 'gad_irritable', reverse: false, category: 'anxiety' },
  { id: 133, text: '总觉得有什么不好的事要发生。', domain: 'N', facet: 'gad_dread', reverse: false, category: 'anxiety' },
];

// ── 睡眠与精力 ─ 5 题 ──
export const QUESTIONS_SLEEP: Question[] = [
  { id: 134, text: '你晚上躺下后，通常要多久才能睡着？', domain: 'N', facet: 'sleep_latency', reverse: false, category: 'sleep' },
  { id: 135, text: '总的来说，你的睡眠质量怎么样？', domain: 'N', facet: 'sleep_quality', reverse: false, category: 'sleep' },
  { id: 136, text: '白天你觉得自己精神好吗？', domain: 'N', facet: 'sleep_daytime', reverse: false, category: 'sleep' },
  { id: 137, text: '白天你会感到疲倦或想打瞌睡吗？', domain: 'N', facet: 'sleep_fatigue', reverse: true, category: 'sleep' },
  { id: 138, text: '你的作息规律吗？', domain: 'N', facet: 'sleep_routine', reverse: false, category: 'sleep' },
];

/** 所有题目（含人格 + 测谎 + 所有新模块）按答题顺序排列 */
export const ALL_QUESTIONS: Question[] = [
  ...QUESTIONS,
  ...LIE_SCALE_QUESTIONS.map((q) => ({
    id: q.id,
    text: q.text,
    domain: 'L' as Domain,
    facet: 'social_desirability',
    reverse: q.reverse,
    category: 'personality' as QuestionCategory,
  })),
  ...QUESTIONS_SELF_ESTEEM,
  ...QUESTIONS_ATTACHMENT,
  ...QUESTIONS_DEPRESSION,
  ...QUESTIONS_ANXIETY,
  ...QUESTIONS_SLEEP,
];

/** 答题区域标题 — 按 ALL_QUESTIONS 中的索引确定切换时机 */
export const SECTION_BOUNDARIES: { startIndex: number; label: string }[] = [
  { startIndex: 0, label: '关于你的日常' },
  { startIndex: 64, label: '你对自己的感受' },
  { startIndex: 72, label: '关于你与人相处' },
  { startIndex: 82, label: '最近这段时间' },
  { startIndex: 97, label: '一些日常状态' },
];

/** 根据题目分类返回对应的选项列表 */
export function getOptionsForCategory(category: QuestionCategory): Option[] {
  switch (category) {
    case 'depression':
    case 'anxiety':
      return OPTIONS_FREQUENCY_4;
    case 'sleep':
      return OPTIONS_SLEEP_4;
    default:
      return OPTIONS_LIKERT_5;
  }
}

/** 根据 facet key 返回特定 sleep 题目的选项 */
export function getOptionsForSleepFacet(facet: string): Option[] {
  switch (facet) {
    case 'sleep_latency':
      return OPTIONS_SLEEP_LATENCY_4;
    case 'sleep_fatigue':
      return OPTIONS_FATIGUE_4;
    default:
      return OPTIONS_SLEEP_4;
  }
}
