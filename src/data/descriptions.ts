import type { Domain } from './questions';

export interface DomainAdvice {
  high: string;
  low: string;
  career: string;
  relationship: string;
  growth: string;
}

export const DOMAIN_ADVICE: Record<Domain, DomainAdvice> = {
  O: {
    high:
      '你对新思想、艺术体验和抽象概念持开放态度，富有想象力，乐于探索未知。',
    low:
      '你倾向于务实和具体，偏好熟悉的经验与传统做法，脚踏实地。',
    career:
      '高开放性适合创意、研究、设计、战略规划等需要创新思维的领域；低开放性适合执行、运营、技术等注重稳定与精确的工作。',
    relationship:
      '高开放性的人在关系中能带来新鲜感和深度话题，也需注意尊重伴侣的实际需求；低开放性的人可靠稳定，可尝试偶尔接受新的共同体验。',
    growth:
      '尝试每月接触一种新艺术形式或阅读一本非惯常领域的书籍，拓宽经验边界。',
  },
  C: {
    high:
      '你自律、有条理、目标明确，能够坚持不懈地完成任务，值得信赖。',
    low:
      '你更随性、灵活，偏好即兴与自由，不喜欢被过多规则和计划束缚。',
    career:
      '高尽责性在项目管理、法律、医疗、财务等需要可靠性的岗位表现出色；低尽责性在创意、销售、应急响应等灵活环境中可能更自在。',
    relationship:
      '高尽责性的人给伴侣安全感，但避免过度控制；低尽责性的人需要共同建立简单的规则与承诺机制。',
    growth:
      '建立一个“最小可行系统”：每天列出 3 件最重要的事并完成它们，逐步培养稳定习惯。',
  },
  E: {
    high:
      '你外向活跃，喜欢社交和表达，在人群中感到充满能量。',
    low:
      '你内敛安静，享受独处，在社交后需要独处来恢复精力。',
    career:
      '高外向性在销售、公关、培训、管理等需要频繁互动的职业中如鱼得水；低外向性在写作、编程、研究、数据分析等独立工作中更能专注。',
    relationship:
      '高外向性的人能带动社交氛围，也需留意伴侣的独处需求；低外向性的人虽不善言辞，但深度倾听是重要优势。',
    growth:
      '无论倾向如何，每周安排一次有质量的社交互动，同时保留固定的独处时间。',
  },
  A: {
    high:
      '你善良、合作、愿意体谅他人，容易建立和谐的人际关系。',
    low:
      '你直率、竞争意识强，更关注自身利益与真实表达。',
    career:
      '高宜人性在护理、教育、咨询、客户服务等助人职业中优势明显；低宜人性在谈判、竞技、创业等需要果断和抗压的环境中表现突出。',
    relationship:
      '高宜人性的人善于维护关系，但要防止过度委屈自己；低宜人性的人可通过练习积极倾听和表达感谢来增进亲密感。',
    growth:
      '每天主动为身边人做一件小事，同时练习在重要边界被侵犯时温和而坚定地说“不”。',
  },
  N: {
    high:
      '你情绪敏感，容易体验到焦虑、担忧或情绪波动，对压力反应强烈。',
    low:
      '你情绪稳定，面对压力较为从容，不易被负面情绪困扰。',
    career:
      '高神经质者对风险信号敏感，适合需要细致审查或预警能力的工作；低神经质者在高压、快节奏环境中更能保持冷静决策。',
    relationship:
      '高神经质的人需要学习情绪调节技巧，避免将焦虑投射到关系中；低神经质的人可主动关注和回应伴侣的情绪变化。',
    growth:
      '建立“情绪日志”习惯，记录触发事件、身体感受与应对方式，必要时寻求专业心理支持。',
  },
};

export const DOMAIN_EXAMPLES: Record<Domain, { high: string[]; low: string[] }> = {
  O: {
    high: ['喜欢参观展览、尝试新菜式', '经常提出问题并寻找深层原因', '愿意尝试 unconventional 的生活方式'],
    low: ['偏好熟悉的餐厅和日常路线', '更关注实际问题的解决', '对传统和既定规则较为尊重'],
  },
  C: {
    high: ['提前规划并按时完成任务', '保持工作环境的整洁有序', '信守承诺，极少爽约'],
    low: ['灵活应对变化，不拘泥于计划', '在截止日期前爆发效率', '更倾向于随性安排生活'],
  },
  E: {
    high: ['主动发起聚会和活动', '在公开场合发言自如', '喜欢快节奏和多样化的日程'],
    low: ['偏好小范围的深度交流', '在社交活动后需要独处恢复', '倾向于先观察再发言'],
  },
  A: {
    high: ['乐于倾听朋友的困扰', '避免冲突，寻求双赢方案', '容易原谅他人的过失'],
    low: ['直言不讳，表达真实想法', '在竞争中不轻易让步', '更关注公平而非和谐'],
  },
  N: {
    high: ['对未来和不确定性感到担忧', '情绪波动较大', '对批评和压力反应敏感'],
    low: ['面对变化保持镇定', '情绪恢复较快', '不容易被小事困扰'],
  },
};

export const OVERVIEW_ADVICE = {
  intro:
    '大五人格模型认为人格由五个相对独立的维度组成。你的得分反映了你当前在这些特质上的相对位置，而非优劣。',
  usage:
    '这些结果可用于自我认知、职业方向探索、人际关系理解和心理咨询前的自我评估。',
  note:
    '人格具有相对稳定性，但也会随年龄、经历和情境而变化。测试结果仅供参考，不构成临床诊断。',
};

export const REFERENCES = [
  'Soto, C. J., & John, O. P. (2017). The next Big Five Inventory (BFI-2): Developing and assessing a hierarchical model with 15 facets to enhance bandwidth, fidelity, and predictive power. Journal of Personality and Social Psychology, 113(1), 117–143.',
  'John, O. P., Naumann, L. P., & Soto, C. J. (2008). Paradigm shift to the integrative Big Five trait taxonomy: History, measurement, and conceptual issues. In O. P. John, R. W. Robins, & L. A. Pervin (Eds.), Handbook of personality: Theory and research (3rd ed., pp. 114–158). Guilford Press.',
  'Costa, P. T., Jr., & McCrae, R. R. (1992). Revised NEO Personality Inventory (NEO-PI-R) and NEO Five-Factor Inventory (NEO-FFI) professional manual. Psychological Assessment Resources.',
];
