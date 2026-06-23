import { DOMAINS, type Domain } from '@/data/questions';
import { AnimatedNumber } from './AnimatedNumber';

interface DomainCardProps {
  domain: Domain;
  score: number;
  onClick?: () => void;
}

const DOMAIN_COLORS: Record<Domain, string> = {
  O: 'bg-[var(--accent-yellow)]',
  C: 'bg-[var(--accent-blue)]',
  E: 'bg-[var(--accent-red)]',
  A: 'bg-emerald-500',
  N: 'bg-violet-500',
};

export function DomainCard({ domain, score, onClick }: DomainCardProps) {
  const info = DOMAINS[domain];

  return (
    <button
      onClick={onClick}
      className="bauhaus-card-sm group relative overflow-hidden p-4 text-left transition-transform hover:-translate-x-1 hover:-translate-y-1 sm:p-5"
    >
      <div
        className={`absolute left-0 top-0 h-full w-2 ${DOMAIN_COLORS[domain]}`}
      />
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-display text-base font-bold uppercase tracking-wide sm:text-lg">
            {info.name}
          </h3>
          <p className="mt-1 text-[10px] text-[var(--text-secondary)] sm:text-xs">{info.en}</p>
        </div>
        <div className="font-display text-2xl font-bold sm:text-3xl">
          <AnimatedNumber value={score} />
        </div>
      </div>
      <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-[var(--text-secondary)] sm:mt-3 sm:text-sm">
        {info.description}
      </p>
    </button>
  );
}
