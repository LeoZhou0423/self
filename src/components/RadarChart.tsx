import { useEffect, useMemo, useRef, useState } from 'react';
import { DOMAINS, type Domain } from '@/data/questions';

interface RadarChartProps {
  scores: Record<Domain, number>;
  size?: number;
  animated?: boolean;
  className?: string;
}

const DOMAIN_ORDER: Domain[] = ['O', 'C', 'E', 'A', 'N'];

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
    const duration = 800;

    let raf = 0;
    const step = (now: number) => {
      const elapsed = now - start;
      const p = Math.min(elapsed / duration, 1);
      setProgress(p);
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
      };
    });
  }, [scores, center, radius, angleStep, progress]);

  const pathD = useMemo(() => {
    if (dataPoints.length === 0) return '';
    return dataPoints
      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
      .join(' ') + ' Z';
  }, [dataPoints]);

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      aria-label="大五人格雷达图"
    >
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

      <path
        d={pathD}
        fill="rgba(198, 123, 92, 0.25)"
        stroke="#C67B5C"
        strokeWidth={2}
        strokeLinejoin="round"
      />

      {dataPoints.map((p, idx) => (
        <g key={idx}>
          <circle cx={p.x} cy={p.y} r={4} fill="#C67B5C" stroke="#fff" strokeWidth={1.5} />
          <text
            x={center + (radius + 18) * Math.cos(p.angle)}
            y={center + (radius + 18) * Math.sin(p.angle)}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={12}
            fill="currentColor"
            className="font-display"
          >
            {p.label}
          </text>
        </g>
      ))}
    </svg>
  );
}
