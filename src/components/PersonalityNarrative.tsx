import type { PersonalityNarrative } from '@/utils/narrative';
import { cn } from '@/lib/utils';

interface PersonalityNarrativeProps {
  narrative: PersonalityNarrative;
  className?: string;
}

const PARAGRAPH_MARKERS = ['①', '②', '③'];

export function PersonalityNarrative({
  narrative,
  className,
}: PersonalityNarrativeProps) {
  const paragraphs = [narrative.paragraph1, narrative.paragraph2, narrative.paragraph3];

  return (
    <div className={cn('bauhaus-card-sm p-5 sm:p-6', className)}>
      <div className="mb-1">
        <p className="font-display text-xs font-bold uppercase tracking-[0.2em] text-[var(--text-secondary)]">
          人格侧写
        </p>
      </div>
      <h2 className="font-display text-xl font-bold uppercase tracking-wide sm:text-2xl">
        人格侧写
      </h2>
      <p className="mt-2 text-sm text-[var(--text-secondary)] sm:mt-3">
        基于你的答题模式，以下是对你人格特质的观察
      </p>

      <div className="mt-5 space-y-4 sm:mt-6 sm:space-y-5">
        {paragraphs.map((text, index) => (
          <div
            key={index}
            className="relative border-l-2 border-[var(--accent-blue)] pl-4 sm:pl-5"
          >
            <span className="font-display text-lg font-bold text-[var(--accent-blue)] sm:text-xl">
              {PARAGRAPH_MARKERS[index]}
            </span>
            <p className="mt-1 text-sm leading-relaxed text-[var(--text-secondary)] sm:mt-2 sm:text-base">
              {text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
