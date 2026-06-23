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
 * A tension is triggered when both dimensions in a pair are > 60,
 * or when specific high/low combinations are met.
 */
export function detectTensions(
  scores: Record<Domain, number>
): DetectedTension[] {
  const tensions: DetectedTension[] = [];

  for (const pattern of TENSION_PATTERNS) {
    const [dimA, dimB] = pattern.dimensions;
    const scoreA = scores[dimA] ?? 0;
    const scoreB = scores[dimB] ?? 0;

    // Special case: E_A tension requires high E + low A
    if (pattern.id === 'E_A') {
      if (scoreA >= 60 && scoreB <= 40) {
        tensions.push({
          pattern,
          scoreA,
          scoreB,
          severity: calculateSeverity(scoreA, scoreB, 'high-low'),
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
  type: 'both-high' | 'high-low'
): 'mild' | 'moderate' | 'strong' {
  if (type === 'both-high') {
    const avg = (scoreA + scoreB) / 2;
    if (avg >= 80) return 'strong';
    if (avg >= 70) return 'moderate';
    return 'mild';
  } else {
    // high-low: the more extreme the gap, the stronger
    const gap = scoreA - scoreB;
    if (gap >= 50) return 'strong';
    if (gap >= 35) return 'moderate';
    return 'mild';
  }
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
