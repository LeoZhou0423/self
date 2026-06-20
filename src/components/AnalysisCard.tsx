import type { ReactNode } from 'react';

interface AnalysisCardProps {
  title?: string;
  subtitle?: string;
  icon?: ReactNode;
  children: ReactNode;
  variant?: 'default' | 'accent' | 'highlight' | 'warning' | 'success';
  className?: string;
  headerAction?: ReactNode;
}

const variantStyles = {
  default: 'bg-[var(--bg-card)] border-[var(--border-color)]',
  accent: 'bg-[var(--accent-blue)]/5 border-[var(--accent-blue)]',
  highlight: 'bg-[var(--accent-yellow)]/5 border-[var(--accent-yellow)]',
  warning: 'bg-red-50 border-[var(--accent-red)] dark:bg-red-950/10',
  success: 'bg-green-50 border-green-300 dark:bg-green-950/10',
};

export function AnalysisCard({
  title,
  subtitle,
  icon,
  children,
  variant = 'default',
  className = '',
  headerAction,
}: AnalysisCardProps) {
  return (
    <div className={`bauhaus-card-sm ${variantStyles[variant]} ${className}`}>
      {(title || icon) && (
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            {icon && (
              <div className="flex h-6 w-6 shrink-0 items-center justify-center border-2 border-[var(--border-color)] bg-[var(--bg-primary)] sm:h-7 sm:w-7">
                {icon}
              </div>
            )}
            <div>
              {title && (
                <h4 className="font-display text-xs font-bold uppercase tracking-wide sm:text-sm">
                  {title}
                </h4>
              )}
              {subtitle && (
                <p className="text-[10px] text-[var(--text-secondary)] sm:text-xs">{subtitle}</p>
              )}
            </div>
          </div>
          {headerAction}
        </div>
      )}
      <div className={title || icon ? 'mt-3' : ''}>{children}</div>
    </div>
  );
}

interface MetricBarProps {
  label: string;
  value: number;
  color?: string;
  showValue?: boolean;
  size?: 'sm' | 'md';
}

export function MetricBar({
  label,
  value,
  color = 'bg-[var(--accent-blue)]',
  showValue = true,
  size = 'md',
}: MetricBarProps) {
  const height = size === 'sm' ? 'h-1.5' : 'h-2.5';

  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        <span className={`font-medium ${size === 'sm' ? 'text-[10px]' : 'text-xs'} sm:text-sm`}>{label}</span>
        {showValue && (
          <span className={`font-display font-bold ${size === 'sm' ? 'text-xs' : 'text-sm'} sm:text-base`}>
            {value}
          </span>
        )}
      </div>
      <div className={`mt-1.5 w-full border-2 border-[var(--border-color)] bg-[var(--bg-primary)] ${height}`}>
        <div
          className={`${height} ${color} transition-all duration-700 ease-out`}
          style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
        />
      </div>
    </div>
  );
}

interface TagProps {
  children: ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
}

export function Tag({ children, variant = 'default' }: TagProps) {
  const styles = {
    default: 'bg-[var(--bg-alt)] text-[var(--text-inverse)] border-[var(--border-color)]',
    primary: 'bg-[var(--accent-blue)]/10 text-[var(--accent-blue)] border-[var(--accent-blue)]',
    success: 'bg-green-100 text-green-700 border-green-300 dark:bg-green-950/20 dark:text-green-400',
    warning: 'bg-orange-100 text-orange-700 border-orange-300 dark:bg-orange-950/20 dark:text-orange-400',
    danger: 'bg-red-100 text-red-700 border-red-300 dark:bg-red-950/20 dark:text-red-400',
  };

  return (
    <span className={`inline-block border px-2 py-0.5 text-[10px] font-bold uppercase sm:text-xs ${styles[variant]}`}>
      {children}
    </span>
  );
}

interface SectionTitleProps {
  children: ReactNode;
  subtitle?: string;
}

export function SectionTitle({ children, subtitle }: SectionTitleProps) {
  return (
    <div className="mb-3">
      <h3 className="font-display text-sm font-bold uppercase tracking-wide sm:text-base">
        {children}
      </h3>
      {subtitle && <p className="mt-1 text-[10px] text-[var(--text-secondary)] sm:text-xs">{subtitle}</p>}
    </div>
  );
}
