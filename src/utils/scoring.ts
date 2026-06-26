import {
  DOMAINS,
  QUESTIONS,
  QUESTIONS_SELF_ESTEEM,
  QUESTIONS_ATTACHMENT,
  QUESTIONS_DEPRESSION,
  QUESTIONS_ANXIETY,
  QUESTIONS_SLEEP,
  LIE_SCALE_QUESTIONS,
  type Domain,
} from '@/data/questions';

export interface SubDimensionScores {
  [key: string]: number;
}

export interface DomainScores {
  openness: number;
  conscientiousness: number;
  extraversion: number;
  agreeableness: number;
  neuroticism: number;
  socialDesirability: number;
  subDimensions: SubDimensionScores;

  // ── 新模块 ──
  /** 自我价值感 0-100（越高越健康） */
  selfEsteem: number;
  /** 关系焦虑 0-100（越高越担心被拒绝） */
  attachmentAnxiety: number;
  /** 关系回避 0-100（越高越不愿亲近） */
  attachmentAvoidance: number;
  /** 抑郁筛查原始分 0-24（PHQ-8） */
  depressionScore: number;
  /** 焦虑筛查原始分 0-21（GAD-7） */
  anxietyScore: number;
  /** 睡眠质量 0-100（越高越好） */
  sleepQuality: number;
}

const DOMAIN_KEYS: Record<Domain, keyof Omit<DomainScores, 'subDimensions' | 'socialDesirability' | 'selfEsteem' | 'attachmentAnxiety' | 'attachmentAvoidance' | 'depressionScore' | 'anxietyScore' | 'sleepQuality'>> = {
  O: 'openness',
  C: 'conscientiousness',
  E: 'extraversion',
  A: 'agreeableness',
  N: 'neuroticism',
};

export function rawScore(answer: number, reverse: boolean): number {
  return reverse ? 6 - answer : answer;
}

export function calculateScores(answers: Record<number, number>): DomainScores {
  const domainTotals: Record<Domain, number> = { O: 0, C: 0, E: 0, A: 0, N: 0 };
  const facetTotals: Record<string, number> = {};
  const facetCounts: Record<string, number> = {};

  // BFI-2 人格维度计分
  for (const q of QUESTIONS) {
    const answer = answers[q.id];
    if (answer === undefined) continue;
    const score = rawScore(answer, q.reverse);

    domainTotals[q.domain] += score;
    facetTotals[q.facet] = (facetTotals[q.facet] || 0) + score;
    facetCounts[q.facet] = (facetCounts[q.facet] || 0) + 1;
  }

  const scores: DomainScores = {
    openness: 0,
    conscientiousness: 0,
    extraversion: 0,
    agreeableness: 0,
    neuroticism: 0,
    socialDesirability: 0,
    subDimensions: {},
    selfEsteem: 0,
    attachmentAnxiety: 0,
    attachmentAvoidance: 0,
    depressionScore: 0,
    anxietyScore: 0,
    sleepQuality: 0,
  };

  // BFI-2 主维度
  for (const domain of Object.keys(DOMAINS) as Domain[]) {
    const total = domainTotals[domain];
    scores[DOMAIN_KEYS[domain]] = Math.round((total / 60) * 100);
  }

  // BFI-2 子维度
  for (const facetKey of Object.keys(facetTotals)) {
    const total = facetTotals[facetKey];
    const count = facetCounts[facetKey] || 1;
    scores.subDimensions[facetKey] = Math.round((total / (count * 5)) * 100);
  }

  // ── 社会期许 ──
  let lieTotal = 0;
  let lieCount = 0;
  for (const q of LIE_SCALE_QUESTIONS) {
    const answer = answers[q.id];
    if (answer === undefined) continue;
    const score = rawScore(answer, q.reverse);
    lieTotal += score;
    lieCount++;
  }
  if (lieCount > 0) {
    const lieAvg = lieTotal / lieCount;
    scores.socialDesirability = Math.round(((lieAvg - 1) / 4) * 100);
  }

  // ── 自我价值感（Rosenberg）─ 8 题，1-5 分 ──
  let seSum = 0;
  let seCount = 0;
  for (const q of QUESTIONS_SELF_ESTEEM) {
    const answer = answers[q.id];
    if (answer === undefined) continue;
    const score = rawScore(answer, q.reverse);
    seSum += score;
    seCount++;
  }
  scores.selfEsteem = seCount > 0 ? Math.round(((seSum - seCount) / (seCount * 4)) * 100) : 0;

  // ── 依恋风格 ──
  let aaSum = 0;
  let aaCount = 0;
  let avSum = 0;
  let avCount = 0;
  for (const q of QUESTIONS_ATTACHMENT) {
    const answer = answers[q.id];
    if (answer === undefined) continue;
    if (q.facet === 'attachment_anxiety') {
      aaSum += answer;
      aaCount++;
    } else {
      avSum += answer;
      avCount++;
    }
  }
  scores.attachmentAnxiety = aaCount > 0 ? Math.round(((aaSum - aaCount) / (aaCount * 4)) * 100) : 0;
  scores.attachmentAvoidance = avCount > 0 ? Math.round(((avSum - avCount) / (avCount * 4)) * 100) : 0;

  // ── 抑郁筛查 PHQ-8（0-3 分制，原始分 0-24）─ 8 题 ──
  let depSum = 0;
  let depCount = 0;
  for (const q of QUESTIONS_DEPRESSION) {
    const answer = answers[q.id];
    if (answer === undefined) continue;
    depSum += answer;
    depCount++;
  }
  // 若全部作答，depSum 范围 0-24
  scores.depressionScore = depCount > 0 ? Math.round((depSum / depCount) * 3) : 0;
  // 缩放至 0-24 原始分
  scores.depressionScore = depCount > 0 ? Math.round((depSum / depCount) * 24 / 3 * 10) / 10 : 0;
  // 更精确：直接按缺失题数等比缩放
  if (depCount === QUESTIONS_DEPRESSION.length) {
    scores.depressionScore = depSum;
  } else if (depCount > 0) {
    scores.depressionScore = Math.round((depSum / depCount) * QUESTIONS_DEPRESSION.length * 10) / 10;
  }

  // ── 焦虑筛查 GAD-7（0-3 分制，原始分 0-21）─ 7 题 ──
  let anxSum = 0;
  let anxCount = 0;
  for (const q of QUESTIONS_ANXIETY) {
    const answer = answers[q.id];
    if (answer === undefined) continue;
    anxSum += answer;
    anxCount++;
  }
  if (anxCount === QUESTIONS_ANXIETY.length) {
    scores.anxietyScore = anxSum;
  } else if (anxCount > 0) {
    scores.anxietyScore = Math.round((anxSum / anxCount) * QUESTIONS_ANXIETY.length * 10) / 10;
  }

  // ── 睡眠质量 ─ 5 题，0-3 分 ──
  let slSum = 0;
  let slCount = 0;
  for (const q of QUESTIONS_SLEEP) {
    const answer = answers[q.id];
    if (answer === undefined) continue;
    // 睡眠疲劳题（id 137）反向计分
    const score = q.reverse ? 3 - answer : answer;
    slSum += score;
    slCount++;
  }
  scores.sleepQuality = slCount > 0 ? Math.round((slSum / (slCount * 3)) * 100) : 0;

  return scores;
}

export function getDomainScore(scores: DomainScores, domain: Domain): number {
  return scores[DOMAIN_KEYS[domain]];
}

export function getFacetScore(scores: DomainScores, facetKey: string): number {
  return scores.subDimensions[facetKey] || 0;
}

/** BFI-2 人格题是否全部答完 */
export function isComplete(answers: Record<number, number>): boolean {
  return QUESTIONS.every((q) => answers[q.id] !== undefined);
}

/** BFI-2 已答题数 */
export function getAnsweredCount(answers: Record<number, number>): number {
  return QUESTIONS.filter((q) => answers[q.id] !== undefined).length;
}
