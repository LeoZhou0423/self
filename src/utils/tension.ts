import { type Domain } from '@/data/questions';
import { TENSION_PATTERNS, type TensionPattern } from '@/data/tensions';

export interface DetectedTension {
  pattern: TensionPattern;
  scoreA: number;
  scoreB: number;
  severity: 'mild' | 'moderate' | 'strong';
}

/**
 * Detect tension patterns in Big Five scores.
 * A tension is triggered when both dimensions in a pair are extreme (> 60 or < 40),
 * or when specific high/low combinations are met.
 * Supports both-high and both-low tension patterns for comprehensive analysis.
 */
export function detectTensions(
  scores: Record<Domain, number>
): DetectedTension[] {
  const tensions: DetectedTension[] = [];

  for (const pattern of TENSION_PATTERNS) {
    const [dimA, dimB] = pattern.dimensions;
    const scoreA = scores[dimA] ?? 50;
    const scoreB = scores[dimB] ?? 50;

    // Special case: E_A tension requires asymmetric combo (high E + low A, or low E + high A)
    if (pattern.id === 'E_A') {
      // High E + low A: assertive driver pattern
      if (scoreA >= 60 && scoreB <= 40) {
        tensions.push({
          pattern,
          scoreA,
          scoreB,
          severity: calculateSeverity(scoreA, scoreB, 'gap'),
        });
      }
      // Low E + high A: quiet harmonizer pattern (reversed tension)
      else if (scoreA <= 40 && scoreB >= 60) {
        tensions.push({
          pattern,
          scoreA,
          scoreB,
          severity: calculateSeverity(scoreA, scoreB, 'gap'),
        });
      }
      continue;
    }

    // Standard case: both dimensions high (> 60)
    if (scoreA >= 60 && scoreB >= 60) {
      tensions.push({
        pattern,
        scoreA,
        scoreB,
        severity: calculateSeverity(scoreA, scoreB, 'both-high'),
      });
    }
    // Both dimensions low (< 40): reverse tension pattern
    else if (scoreA <= 40 && scoreB <= 40) {
      tensions.push({
        pattern,
        scoreA,
        scoreB,
        severity: calculateSeverity(scoreA, scoreB, 'both-low'),
      });
    }
  }

  // Sort by severity (strong first)
  const severityOrder = { strong: 0, moderate: 1, mild: 2 };
  tensions.sort(
    (a, b) => severityOrder[a.severity] - severityOrder[b.severity]
  );

  return tensions;
}

/**
 * Calculate tension severity based on how extreme the scores are.
 */
function calculateSeverity(
  scoreA: number,
  scoreB: number,
  type: 'both-high' | 'both-low' | 'gap'
): 'mild' | 'moderate' | 'strong' {
  if (type === 'both-high') {
    const avg = (scoreA + scoreB) / 2;
    if (avg >= 80) return 'strong';
    if (avg >= 70) return 'moderate';
    return 'mild';
  }
  if (type === 'both-low') {
    // Both low: the lower the average, the stronger the reverse tension
    const avg = (scoreA + scoreB) / 2;
    if (avg <= 20) return 'strong';
    if (avg <= 30) return 'moderate';
    return 'mild';
  }
  // gap: the more extreme the difference, the stronger
  const gap = Math.abs(scoreA - scoreB);
  if (gap >= 50) return 'strong';
  if (gap >= 35) return 'moderate';
  return 'mild';
}

/**
 * Get a human-readable severity label.
 */
export function getSeverityLabel(severity: DetectedTension['severity']): string {
  switch (severity) {
    case 'strong':
      return '显著';
    case 'moderate':
      return '中等';
    case 'mild':
      return '轻微';
  }
}
