import { DOMAINS, FACETS, QUESTIONS, type Domain } from '@/data/questions';

export interface SubDimensionScores {
  [key: string]: number;
}

export interface DomainScores {
  openness: number;
  conscientiousness: number;
  extraversion: number;
  agreeableness: number;
  neuroticism: number;
  subDimensions: SubDimensionScores;
}

const DOMAIN_KEYS: Record<Domain, keyof Omit<DomainScores, 'subDimensions'>> = {
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
    subDimensions: {},
  };

  for (const domain of Object.keys(DOMAINS) as Domain[]) {
    const total = domainTotals[domain];
    scores[DOMAIN_KEYS[domain]] = Math.round((total / 60) * 100);
  }

  for (const facetKey of Object.keys(facetTotals)) {
    const total = facetTotals[facetKey];
    const count = facetCounts[facetKey] || 1;
    scores.subDimensions[facetKey] = Math.round((total / (count * 5)) * 100);
  }

  return scores;
}

export function getDomainScore(scores: DomainScores, domain: Domain): number {
  return scores[DOMAIN_KEYS[domain]];
}

export function getFacetScore(scores: DomainScores, facetKey: string): number {
  return scores.subDimensions[facetKey] || 0;
}

export function isComplete(answers: Record<number, number>): boolean {
  return QUESTIONS.every((q) => answers[q.id] !== undefined);
}

export function getAnsweredCount(answers: Record<number, number>): number {
  return QUESTIONS.filter((q) => answers[q.id] !== undefined).length;
}
