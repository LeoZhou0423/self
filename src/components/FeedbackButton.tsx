import { MessageCircle } from 'lucide-react';

interface FeedbackButtonProps {
  onScrollToFacets: () => void;
  className?: string;
}

export function FeedbackButton({ onScrollToFacets, className = '' }: FeedbackButtonProps) {
  return (
    <button
      onClick={onScrollToFacets}
      className={`bauhaus-btn-secondary flex items-start gap-3 p-4 text-left sm:p-5 ${className}`}
    >
      <MessageCircle
        size={20}
        className="mt-0.5 shrink-0 text-[var(--text-secondary)]"
      />
      <div className="min-w-0">
        <span className="block text-sm font-semibold">这不像我？</span>
        <span className="mt-0.5 block text-xs leading-relaxed text-[var(--text-secondary)]">
          查看各维度的子项得分，帮你更精确地校准自我认知
        </span>
      </div>
    </button>
  );
}
