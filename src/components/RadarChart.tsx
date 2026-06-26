import { useEffect, useMemo, useRef, useState } from 'react';
import { DOMAINS, type Domain } from '@/data/questions';

interface RadarChartProps {
  scores: Record<Domain, number>;
  size?: number;
  animated?: boolean;
  className?: string;
}

const DOMAIN_ORDER: Domain[] = ['O', 'C', 'E', 'A', 'N'];

const getLabelPosition = (angle: number, radius: number, center: number) => {
  const isTop = angle > -Math.PI / 2 - 0.6 && angle < -Math.PI / 2 + 0.6;
  const isBottom = angle > Math.PI / 2 - 0.6 && angle < Math.PI / 2 + 0.6;
  const offset = 18;
  const x = center + (radius + offset) * Math.cos(angle);
  let y = center + (radius + offset) * Math.sin(angle);

  if (isTop) {
    y -= 6;
  } else if (isBottom) {
    y += 6;
  }

  let textAnchor: 'start' | 'middle' | 'end' = 'middle';
  if (Math.cos(angle) > 0.3) textAnchor = 'start';
  if (Math.cos(angle) < -0.3) textAnchor = 'end';

  let dominantBaseline: 'auto' | 'middle' | 'hanging' = 'middle';
  if (isTop) dominantBaseline = 'auto';
  if (isBottom) dominantBaseline = 'hanging';

  return { x, y, textAnchor, dominantBaseline };
};

export function RadarChart({
  scores,
  size = 280,
  animated = true,
  className = '',
}: RadarChartProps) {
  const [progress, setProgress] = useState(animated ? 0 : 1);
  const [hoveredDomain, setHoveredDomain] = useState<Domain | null>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!animated || hasAnimated.current) {
      setProgress(1);
      return;
    }
    hasAnimated.current = true;
    const start = performance.now();
    const duration = 900;

    let raf = 0;
    const step = (now: number) => {
      const elapsed = now - start;
      const p = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setProgress(eased);
      if (p < 1) {
        raf = requestAnimationFrame(step);
      }
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [animated]);

  const padding = 48;
  const center = size / 2;
  const radius = size / 2 - padding;
  const angleStep = (Math.PI * 2) / 5;

  const gridPolygons = useMemo(() => {
    const levels = 4;
    return Array.from({ length: levels }, (_, i) => {
      const levelRadius = (radius * (i + 1)) / levels;
      return DOMAIN_ORDER.map((_, idx) => {
        const angle = idx * angleStep - Math.PI / 2;
        const x = center + levelRadius * Math.cos(angle);
        const y = center + levelRadius * Math.sin(angle);
        return `${x},${y}`;
      }).join(' ');
    });
  }, [center, radius, angleStep]);

  const dataPoints = useMemo(() => {
    return DOMAIN_ORDER.map((domain, idx) => {
      const value = scores[domain] || 0;
      const r = (radius * value * progress) / 100;
      const angle = idx * angleStep - Math.PI / 2;
      return {
        x: center + r * Math.cos(angle),
        y: center + r * Math.sin(angle),
        label: DOMAINS[domain].name,
        value,
        angle,
        domain,
        color: DOMAINS[domain].color,
      };
    });
  }, [scores, center, radius, angleStep, progress]);

  const bezierSegments = useMemo(() => {
    const n = dataPoints.length;
    if (n === 0) return [];
    return dataPoints.map((p, i) => {
      const next = dataPoints[(i + 1) % n];
      const prev = dataPoints[(i - 1 + n) % n];
      const next2 = dataPoints[(i + 2) % n];

      const tension = 0.25;
      const cp1x = p.x + (next.x - prev.x) * tension;
      const cp1y = p.y + (next.y - prev.y) * tension;
      const cp2x = next.x - (next2.x - p.x) * tension;
      const cp2y = next.y - (next2.y - p.y) * tension;

      return {
        p0: p,
        p1: next,
        cp1: { x: cp1x, y: cp1y },
        cp2: { x: cp2x, y: cp2y },
      };
    });
  }, [dataPoints]);

  const fillPathD = useMemo(() => {
    if (bezierSegments.length === 0) return '';
    return bezierSegments
      .map((seg, i) => {
        if (i === 0) {
          return `M ${seg.p0.x} ${seg.p0.y} C ${seg.cp1.x} ${seg.cp1.y} ${seg.cp2.x} ${seg.cp2.y} ${seg.p1.x} ${seg.p1.y}`;
        }
        return `C ${seg.cp1.x} ${seg.cp1.y} ${seg.cp2.x} ${seg.cp2.y} ${seg.p1.x} ${seg.p1.y}`;
      })
      .join(' ') + ' Z';
  }, [bezierSegments]);

  const segmentPaths = useMemo(() => {
    return bezierSegments.map((seg) => ({
      d: `M ${seg.p0.x} ${seg.p0.y} C ${seg.cp1.x} ${seg.cp1.y} ${seg.cp2.x} ${seg.cp2.y} ${seg.p1.x} ${seg.p1.y}`,
      domain: seg.p0.domain,
      color: seg.p0.color,
      hasGlow: (seg.p0.value > 60 || seg.p1.value > 60),
    }));
  }, [bezierSegments]);

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      role="img"
      aria-label="五个维度的得分分布"
    >
      <defs>
        <radialGradient id="radar-fill" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(198, 123, 92, 0.35)" />
          <stop offset="100%" stopColor="rgba(198, 123, 92, 0.06)" />
        </radialGradient>

        {DOMAIN_ORDER.map((domain) => (
          <filter
            key={domain}
            id={`glow-${domain}`}
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
          >
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        ))}
      </defs>

      {/* Grid */}
      <g>
        {gridPolygons.map((points, i) => (
          <polygon
            key={i}
            points={points}
            fill="none"
            stroke="currentColor"
            strokeOpacity={0.15}
            strokeWidth={1}
          />
        ))}
        {DOMAIN_ORDER.map((_, idx) => {
          const angle = idx * angleStep - Math.PI / 2;
          const x = center + radius * Math.cos(angle);
          const y = center + radius * Math.sin(angle);
          return (
            <line
              key={idx}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="currentColor"
              strokeOpacity={0.15}
              strokeWidth={1}
            />
          );
        })}
      </g>

      {/* Filled polygon */}
      <path
        d={fillPathD}
        fill="url(#radar-fill)"
        stroke="none"
      />

      {/* Color-coded bezier segments */}
      <g>
        {segmentPaths.map((seg, idx) => (
          <path
            key={idx}
            d={seg.d}
            fill="none"
            stroke={seg.color}
            strokeWidth={hoveredDomain === seg.domain ? 4 : 2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            filter={seg.hasGlow ? `url(#glow-${seg.domain})` : undefined}
            opacity={hoveredDomain && hoveredDomain !== seg.domain ? 0.4 : 0.9}
            style={{ transition: 'stroke-width 0.2s, opacity 0.2s' }}
          />
        ))}
      </g>

      {/* Data points, labels, and interactive areas */}
      {dataPoints.map((p, idx) => {
        const labelPos = getLabelPosition(p.angle, radius, center);
        const isHovered = hoveredDomain === p.domain;
        return (
          <g key={idx}
            onMouseEnter={() => setHoveredDomain(p.domain)}
            onMouseLeave={() => setHoveredDomain(null)}
            style={{ cursor: 'pointer' }}
          >
            {/* Invisible hit area for better interaction */}
            <circle
              cx={p.x}
              cy={p.y}
              r={18}
              fill="transparent"
            />
            <circle
              cx={p.x}
              cy={p.y}
              r={isHovered ? 6 : 4}
              fill={p.color}
              stroke="#fff"
              strokeWidth={1.5}
              style={{ transition: 'r 0.2s' }}
            />
            <text
              x={labelPos.x}
              y={labelPos.y}
              textAnchor={labelPos.textAnchor}
              dominantBaseline={labelPos.dominantBaseline}
              fontSize={12}
              fill="currentColor"
              className="font-display"
              opacity={hoveredDomain && hoveredDomain !== p.domain ? 0.4 : 1}
              style={{ transition: 'opacity 0.2s' }}
            >
              {p.label}
            </text>
            {/* Tooltip on hover */}
            {isHovered && (
              <g>
                <rect
                  x={p.x - 28}
                  y={p.y - 28}
                  width={56}
                  height={20}
                  fill="var(--bg-alt)"
                  stroke="var(--border-color)"
                  strokeWidth={1}
                  rx={2}
                />
                <text
                  x={p.x}
                  y={p.y - 14}
                  textAnchor="middle"
                  fontSize={10}
                  fill="var(--text-inverse)"
                  className="font-display"
                  fontWeight="bold"
                >
                  {p.value}分
                </text>
              </g>
            )}
          </g>
        );
      })}
    </svg>
  );
}
