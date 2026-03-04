import { RiskLevel } from '../types';
import { RISK_CONFIG } from '../utils/scoring';

interface RiskBadgeProps {
  level: RiskLevel;
  size?: 'sm' | 'md';
  pulse?: boolean;
}

export function RiskBadge({ level, size = 'md', pulse = false }: RiskBadgeProps) {
  const cfg = RISK_CONFIG[level];
  const fontSize = size === 'sm' ? '10px' : '11px';
  const padding = size === 'sm' ? '2px 7px' : '3px 10px';

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '5px',
      fontSize,
      fontWeight: 600,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      color: cfg.color,
      background: cfg.bg,
      border: `1px solid ${cfg.border}`,
      borderRadius: '20px',
      padding,
      fontFamily: 'var(--font-mono)',
      whiteSpace: 'nowrap',
    }}>
      <span style={{
        position: 'relative',
        display: 'inline-flex',
        width: 7,
        height: 7,
      }}>
        {pulse && level !== 'healthy' && (
          <span style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            background: cfg.color,
            opacity: 0.4,
            animation: 'pulse-ring 1.8s ease-out infinite',
          }} />
        )}
        <span style={{
          width: 7,
          height: 7,
          borderRadius: '50%',
          background: cfg.color,
          display: 'block',
        }} />
      </span>
      {cfg.label}
    </span>
  );
}
