import { useState } from 'react';
import { ChevronDown, Check, AlertTriangle } from 'lucide-react';
import type { Archetype } from '@/data/archetypes';

interface ArchetypeCardProps {
  archetype: Archetype;
  className?: string;
}

export function ArchetypeCard({ archetype, className = '' }: ArchetypeCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`bauhaus-card overflow-hidden animate-fade-in-up ${className}`}>
      <div className="p-5 sm:p-6">
        <h2 className="font-display text-2xl font-bold uppercase tracking-wide sm:text-3xl lg:text-4xl">
          {archetype.name}
        </h2>
        <p className="mt-2 text-sm font-medium text-[var(--accent-blue)] sm:text-base lg:mt-3">
          {archetype.portrait}
        </p>
        <button
          onClick={() => setExpanded(!expanded)}
          className="bauhaus-btn-secondary mt-4 inline-flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wide sm:mt-5 sm:px-5 sm:py-3 sm:text-sm"
        >
          {expanded ? '收起详情' : '查看详情'}
          <ChevronDown
            size={16}
            className={`transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      {expanded && (
        <div className="animate-fade-in-up border-t-2 border-[var(--border-color)] p-5 sm:p-6">
          <p className="text-sm leading-relaxed text-[var(--text-secondary)] sm:text-base">
            {archetype.description}
          </p>

          <div className="mt-5 sm:mt-6">
            <h3 className="font-display text-xs font-bold uppercase tracking-wide text-emerald-600 sm:text-sm">
              核心优势
            </h3>
            <ul className="mt-3 space-y-2 sm:space-y-3">
              {archetype.strengths.map((strength, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-[var(--text-primary)] sm:text-base">
                  <Check size={18} className="mt-0.5 shrink-0 text-emerald-500 sm:size-5" />
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-5 sm:mt-6">
            <h3 className="font-display text-xs font-bold uppercase tracking-wide text-[var(--accent-yellow)] sm:text-sm">
              需要注意
            </h3>
            <ul className="mt-3 space-y-2 sm:space-y-3">
              {archetype.watchOuts.map((watchOut, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-[var(--text-primary)] sm:text-base">
                  <AlertTriangle size={18} className="mt-0.5 shrink-0 text-amber-500 sm:size-5" />
                  <span>{watchOut}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-5 sm:mt-6">
            <h3 className="font-display text-xs font-bold uppercase tracking-wide text-[var(--accent-blue)] sm:text-sm">
              职业匹配
            </h3>
            <div className="mt-3 flex flex-wrap gap-2 sm:gap-3">
              {archetype.careerFit.map((career, i) => (
                <span
                  key={i}
                  className="bauhaus-card-sm px-3 py-1 text-xs font-medium text-[var(--text-primary)] sm:px-4 sm:py-2 sm:text-sm"
                >
                  {career}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-5 sm:mt-6">
            <h3 className="font-display text-xs font-bold uppercase tracking-wide text-[var(--accent-red)] sm:text-sm">
              人际风格
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-[var(--text-primary)] sm:text-base">
              {archetype.relationshipStyle}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
