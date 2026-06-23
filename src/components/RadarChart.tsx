import { useEffect, useMemo, useRef, useState } from 'react';
import { DOMAINS, type Domain } from '@/data/questions';

interface RadarChartProps {
  scores: Record<Domain, number>;
  size?: number;
  animated?: boolean;
  className?: string;
}

const DOMAIN_ORDER: Domain[] = ['O', 'C', 'E', 'A', 'N'];

const getLabelPosition = (angle: number, radius: number, center: number, label: string) => {
  const isTop = angle > -Math.PI / 2 - 0.6 && angle < -Math.PI / 2 + 0.6;
  const isBottom = angle > Math.PI / 2 - 0.6 && angle < Math.PI / 2 + 0.6;
  const offset = 18;
  let x = center + (radius + offset) * Math.cos(angle);
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
      // Ease-out cubic for smooth entrance
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

  // Compute cubic bezier control points for smooth curves between dimension points
  const bezierSegments = useMemo(() => {
    const n = dataPoints.length;
    if (n === 0) return [];
    return dataPoints.map((p, i) => {
      const next = dataPoints[(i + 1) % n];
      const prev = dataPoints[(i - 1 + n) % n];
      const next2 = dataPoints[(i + 2) % n];

      // Catmull-Rom-like control points with tension for smooth closed curves
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

  // Closed cubic bezier path for the filled polygon
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

  // Individual bezier segments with domain colors and glow flags
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
      aria-label="大五人格雷达图"
    >
      <defs>
        {/* Subtle radial gradient fill inside the data polygon */}
        <radialGradient id="radar-fill" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(198, 123, 92, 0.35)" />
          <stop offset="100%" stopColor="rgba(198, 123, 92, 0.06)" />
        </radialGradient>

        {/* Per-dimension glow filters using feGaussianBlur + feComposite */}
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

      {/* Filled polygon with subtle gradient */}
      <path
        d={fillPathD}
        fill="url(#radar-fill)"
        stroke="none"
      />

      {/* Color-coded bezier segments with glow on high-scoring areas */}
      <g>
        {segmentPaths.map((seg, idx) => (
          <path
            key={idx}
            d={seg.d}
            fill="none"
            stroke={seg.color}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            filter={seg.hasGlow ? `url(#glow-${seg.domain})` : undefined}
            opacity={0.9}
          />
        ))}
      </g>

      {/* Data points and labels */}
      {dataPoints.map((p, idx) => {
        const labelPos = getLabelPosition(p.angle, radius, center, p.label);
        return (
          <g key={idx}>
            <circle
              cx={p.x}
              cy={p.y}
              r={4}
              fill={p.color}
              stroke="#fff"
              strokeWidth={1.5}
            />
            <text
              x={labelPos.x}
              y={labelPos.y}
              textAnchor={labelPos.textAnchor}
              dominantBaseline={labelPos.dominantBaseline}
              fontSize={12}
              fill="currentColor"
              className="font-display"
            >
              {p.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
