import { type Domain, FACETS } from '@/data/questions';
import {
  NARRATIVE_TEMPLATES,
  FACET_NARRATIVES,
  STRENGTH_PHRASES,
  GROWTH_PHRASES,
  type NarrativeTemplate,
} from '@/data/narratives';
import type { DomainScores } from './scoring';

export interface PersonalityNarrative {
  paragraph1: string; // Opening + trait identification
  paragraph2: string; // Behavioral observations
  paragraph3: string; // Strengths + growth areas
}

/**
 * Generate a 3-paragraph personality narrative based on domain and facet scores.
 * The narrative is written in second person, therapist observation style.
 */
export function generateNarrative(scores: DomainScores): PersonalityNarrative {
  const domainScores: Record<Domain, number> = {
    O: scores.openness,
    C: scores.conscientiousness,
    E: scores.extraversion,
    A: scores.agreeableness,
    N: scores.neuroticism,
  };

  // Find the two most distinctive dimensions (highest deviation from 50)
  const sortedDomains = (['O', 'C', 'E', 'A', 'N'] as Domain[]).sort(
    (a, b) => Math.abs(domainScores[b] - 50) - Math.abs(domainScores[a] - 50)
  );

  const primaryDomain = sortedDomains[0];
  const secondaryDomain = sortedDomains[1];

  const primaryLevel: 'high' | 'low' =
    domainScores[primaryDomain] >= 50 ? 'high' : 'low';
  const secondaryLevel: 'high' | 'low' =
    domainScores[secondaryDomain] >= 50 ? 'high' : 'low';

  const primaryTemplate = getTemplate(primaryDomain, primaryLevel);
  const secondaryTemplate = getTemplate(secondaryDomain, secondaryLevel);

  // Paragraph 1: Opening from primary dimension
  const paragraph1 = primaryTemplate?.opening ?? '';

  // Paragraph 2: Body from primary + facet-specific details
  const facetDetails = getFacetDetails(scores, primaryDomain);
  const bodySentences = [
    ...(primaryTemplate?.body ?? []),
    facetDetails,
  ].filter(Boolean);
  const paragraph2 = bodySentences.join('');

  // Paragraph 3: Closing from both dimensions + strength/growth phrases
  const primaryClosing = primaryTemplate?.closing ?? [];
  const secondaryClosing = secondaryTemplate?.closing ?? [];
  const strengthPhrase = getStrengthPhrase(primaryDomain);
  const growthPhrase = getGrowthPhrase(secondaryDomain);

  const paragraph3 = [
    ...primaryClosing,
    secondaryClosing[0], // One insight from secondary
    strengthPhrase,
    growthPhrase,
  ]
    .filter(Boolean)
    .join('');

  return { paragraph1, paragraph2, paragraph3 };
}

/**
 * Get narrative template for a specific dimension and level.
 */
function getTemplate(
  dimension: Domain,
  level: 'high' | 'low'
): NarrativeTemplate | undefined {
  return NARRATIVE_TEMPLATES.find(
    (t) => t.dimension === dimension && t.level === level
  );
}

/**
 * Get facet-specific behavioral details for the primary dimension.
 */
function getFacetDetails(
  scores: DomainScores,
  dimension: Domain
): string {
  const facets = FACETS[dimension];
  if (!facets) return '';

  const details: string[] = [];

  for (const facet of facets) {
    const facetScore = scores.subDimensions[facet.key] ?? 50;
    const narrative = FACET_NARRATIVES.find(
      (n) => n.domain === dimension && n.facet === facet.key
    );

    if (narrative) {
      const descriptions =
        facetScore >= 50 ? narrative.high : narrative.low;
      // Pick one random description
      const picked =
        descriptions[Math.floor(Math.random() * descriptions.length)];
      if (picked) details.push(picked);
    }
  }

  return details.length > 0 ? details.join('') : '';
}

/**
 * Get a strength affirmation phrase for a dimension.
 * STRENGTH_PHRASES is a flat string array with 3 phrases per dimension (O,C,E,A,N).
 */
function getStrengthPhrase(dimension: Domain): string {
  const dimIndex = ['O', 'C', 'E', 'A', 'N'].indexOf(dimension);
  if (dimIndex === -1) return '';
  const start = dimIndex * 3;
  const phrases = STRENGTH_PHRASES.slice(start, start + 3);
  if (phrases.length === 0) return '';
  return phrases[Math.floor(Math.random() * phrases.length)];
}

/**
 * Get a growth suggestion phrase for a dimension.
 * GROWTH_PHRASES is a flat string array with 2 phrases per dimension (O,C,E,A,N).
 */
function getGrowthPhrase(dimension: Domain): string {
  const dimIndex = ['O', 'C', 'E', 'A', 'N'].indexOf(dimension);
  if (dimIndex === -1) return '';
  const start = dimIndex * 2;
  const phrases = GROWTH_PHRASES.slice(start, start + 2);
  if (phrases.length === 0) return '';
  return phrases[Math.floor(Math.random() * phrases.length)];
}
